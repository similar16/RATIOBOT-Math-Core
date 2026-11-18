/* Quantity extraction and exact checking for the reading step. */
'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems');
const R=require(path.join(base,'reading.js'));
// The production loader requests scripts concurrently; reading may execute
// before the engine, then use it once all resources have finished loading.
const browser={window:{}},vm=require('node:vm'),fs=require('node:fs');
vm.runInNewContext(fs.readFileSync(path.join(base,'reading.js'),'utf8'),browser);
vm.runInNewContext(fs.readFileSync(path.join(base,'engine.js'),'utf8'),browser);
assert(browser.window.RatioWordProblemReading.checkValue({answer:'1/2'},String.raw`\dfrac{2}{4}`));
const data=['data-l7-l8.js','data-l9-review.js','data-textbook-intro.js','data-textbook-applications.js','data-textbook-review.js'].flatMap(name=>require(path.join(base,name)));
const single=text=>({id:'reading-fixture',facts:[{id:'condition',kind:'given',text}]});
const answers=text=>R.build(single(text)).fields.map(f=>f.answer);

assert.deepEqual(answers('总量15.21%，比为2∶3∶5；出发7:30，结束7:45；比例1/12；温度为−5；表达式n−1。'),['15.21','2','3','5','7','30','7','45','1/12','-5','1']);
assert.deepEqual(answers('两个小组，一半，八折，十折，多走一圈，三折，每增一幅，七层。'),['2','1/2','8','10','1','3','1','7']);
assert.deepEqual(answers('三分之一、百分之二十五、一百二十三个、两仓、两车、两地。'),['1/3','25','123','2','2','2']);
assert.deepEqual(answers('一元一次方程、一次函数、三角形、五边形、同一路径、另一种方案、唯一答案、一字框、十字框、桌子四周。速度5千米/小时，质量6千克，1万册=10000册。'),['5','6','1','10000']);
assert.deepEqual(answers('第一支每小时缩短8厘米，第二支每小时缩短6厘米。'),['8','6']);
assert.deepEqual(answers('第1幅有4颗黑棋，每增一幅增加3颗。'),['1','4','1','3']);
assert.deepEqual(answers('百分之几表示几除以100；几十分之几；十分之几；星期六。'),['100']);
assert.deepEqual(answers('５千米，１／２份，０．５小时。'),['5','1/2','0.5']);

for(const input of ['0.5','.5','0.50','1/2','2 / 4','\\frac{1}{2}','\\dfrac{ 2 }{ 4 }','-\\frac{-1}{2}','(0.5)','½','1⁄2','1÷2',String.raw`\frac12`,String.raw`\left(\tfrac{2}{4}\right)`])assert(R.checkValue({answer:'1/2'},input),input);
for(const input of ['', ' ', 'NaN','Infinity','x','x/x','1+1','2-1.5','1e3','1/0','1/2/3','\\frac{x}{2}','Math.random()','0.5abc','0 . 5','0 5','√0.25'])assert(!R.checkValue({answer:'1/2'},input),input);
assert(R.checkValue({answer:'-1/2'},'−0.5'));
assert(R.checkValue({answer:'-1/2'},'\\frac{1}{-2}'));
assert(R.checkValue({answer:'-1/2'},'-\\frac{1}{2}'));
assert(!R.checkValue({answer:'1/12'},'0.08333333333333333'),'Finite rounded decimals are not exact recurring fractions');
assert(R.checkValue({answer:'84748016'},'847480160/10'));
assert(!R.checkValue({answer:'1'},'1'.repeat(121)));

const percentage=single('增长率25%，还剩75%。');
const percentModel=R.build(percentage);
assert.deepEqual(percentModel.fields.map(f=>[f.answer,f.percent]),[['25',true],['75',true]]);
assert.equal(percentModel.facts[0].parts.filter(p=>p.type==='text').map(p=>p.text).join(''),'增长率%，还剩%。');
assert(R.checkValue(percentModel.fields[0],'50/2'));
assert(!R.checkValue(percentModel.fields[0],'0.25'));
assert(!R.checkValue(percentModel.fields[0],'25%'));
const percentWrong=R.check(percentage,{...R.canonical(percentage),[percentModel.fields[0].key]:'0.25'});
assert.equal(percentWrong.ok,false);assert.equal(percentWrong.key,percentModel.fields[0].key);assert(percentWrong.message.includes('百分号'));

const kinds={id:'kinds',facts:[{id:'g',kind:'given',text:'总数12。'},{id:'p',kind:'property',text:'1小时=60分钟。'},{id:'c',kind:'convention',text:'把整项任务记为1。'},{id:'e',kind:'example',text:'本次示例2件。'}]};
for(const fact of R.build(kinds).facts)for(const field of fact.fields)assert.equal(field.kind,fact.kind);
assert(R.build(kinds).facts.find(f=>f.id==='c').fields[0].label.startsWith('建模约定'));
assert(R.build(kinds).facts.find(f=>f.id==='e').fields[0].label.startsWith('示例条件'));
assert.equal(R.build(single('两边相等。')).facts[0].fields.length,1);
assert.equal(R.build(single('位置相同。')).facts[0].fields.length,0,'A nonnumeric fact is still available for explicit confirmation');

let facts=0,fields=0,hanFields=0;
assert.equal(data.length,106);
for(const problem of data){
  const before=JSON.stringify(problem),model=R.build(problem),values=R.canonical(problem);
  assert.equal(model.facts.length,problem.facts.length);
  assert.equal(new Set(model.fields.map(f=>f.key)).size,model.fields.length,problem.id+' duplicate fields');
  for(const fact of model.facts){
    facts++;
    assert.equal(fact.parts.map(p=>p.type==='text'?p.text:p.field.raw).join(''),fact.text,problem.id+'/'+fact.id+' exact original text');
    for(const part of fact.parts){
      if(part.type==='text')assert(!/[0-9０-９]/.test(part.text),problem.id+'/'+fact.id+' left an Arabic number visible');
      else {assert.equal(part.key,part.field.key);assert(fact.fields.includes(part.field));}
    }
    for(const f of fact.fields){
      fields++;if(f.type==='han-number'||f.notation==='han')hanFields++;
      assert(f.key.startsWith('f:'+fact.id+':'));assert.equal(f.kind,fact.kind);assert(f.raw);assert.equal(values[f.key],f.answer);
    }
  }
  assert.equal(R.check(problem,values).ok,true,problem.id+' canonical quantities');
  if(model.fields.length){
    const first=model.fields[0];
    const empty=R.check(problem,{...values,[first.key]:''});assert.equal(empty.ok,false);assert.equal(empty.key,first.key);
    assert.equal(R.check(problem,{...values,[first.key]:'x'}).ok,false);
  }
  assert.equal(JSON.stringify(problem),before,'Reading must not mutate authored facts');
}
const byId=id=>data.find(p=>p.id===id);
assert.deepEqual(R.build(byId('L8-P1')).facts.find(f=>f.id==='discount').fields.map(f=>f.answer),['8']);
assert.deepEqual(R.build(byId('L8-T2')).facts.find(f=>f.id==='one-lap').fields.map(f=>f.answer),['1']);
assert.deepEqual(R.build(byId('TB-A30')).facts.find(f=>f.id==='departure').fields.slice(0,4).map(f=>f.answer),['7','30','7','45']);
assert.deepEqual(R.build(byId('TB-R04')).facts.find(f=>f.id==='sun').fields.map(f=>f.answer),['1/2']);
assert.deepEqual(R.build(byId('TB-R17')).facts.find(f=>f.id==='first').fields.map(f=>f.answer),['1','6'],'四周 means around, not four weeks');
console.log('PASS reading quantities: '+JSON.stringify({problems:data.length,facts,fields,hanFields})+'; exact values, source kinds, percentages, fractions, clock times and protected terminology');
