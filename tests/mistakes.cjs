const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const dir=process.env.SITE_DIR||'site',html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const js=fs.readFileSync(path.join(dir,'mistakes.js'),'utf8'),css=fs.readFileSync(path.join(dir,'mistakes.css'),'utf8');
assert.match(html,/id="mistakes"/);assert.match(html,/id="teacherMistakesContent"/);
assert.match(html,/data-go="mistakes"/);assert.match(html,/data-teacher-tab="mistakes"/);
assert.match(html,/mistakes\.js/);assert.match(html,/mistakes\.css/);
assert.ok(css.includes('@media'));
const dom=new JSDOM('<div id="practiceMistakes"></div><div id="teacherPracticeMistakesContent"></div>',{url:'https://example.com',runScripts:'outside-only'});
const w=dom.window;let who='student-A',role='student',rows=[];
let nextId=0;
const copy=x=>JSON.parse(JSON.stringify(x));
class Query {
 constructor(op='select',values=null){this.op=op;this.values=values;this.filters=[];}
 select(){return this;}
 eq(k,v){this.filters.push([k,v]);return this;}
 order(){return this;}
 limit(){return this.execute();}
 maybeSingle(){return this.execute().then(r=>({data:r.data[0]||null,error:r.error}));}
 update(v){this.op='update';this.values=v;return this;}
 insert(v){this.op='insert';this.values=v;return this;}
 then(done,fail){return this.execute().then(done,fail);}
 execute(){
  let found=rows.filter(r=>this.filters.every(([k,v])=>r[k]===v));
  if(this.op==='insert'){const x={...copy(this.values),id:'item-'+(++nextId),times_wrong:this.values.times_wrong??1,retry_count:0,status:'pending',due_on:this.values.due_on||'2026-11-04',priority:2,attempts:[],success_streak:0,selected_for_retest:!!this.values.selected_for_retest};rows.push(x);found=[x];}
  if(this.op==='update')found.forEach(r=>Object.assign(r,copy(this.values)));
  return Promise.resolve({data:copy(found),error:null});
 }
}
w.RatioMistakeBridge={identity:()=>({user:{id:who},classId:'class-A',role,mustChangePassword:false}),client:()=>({from(name){assert.equal(name,'mistake_items');return new Query();}}),go:()=>{}};
w.eval(js);
async function run(){
 assert.equal(await w.MistakeBook.capture({kind:'arithmetic',question:'1+2',correctAnswer:'3',studentAnswer:'4'}),true);
 assert.equal(rows.length,1);
 assert.equal(await w.MistakeBook.capture({kind:'arithmetic',question:'1+2',correctAnswer:'3',studentAnswer:'5'}),true);
 assert.equal(rows.length,1);assert.equal(rows[0].times_wrong,2);
 await w.MistakeBook.open();await new Promise(r=>setImmediate(r));
 assert.match(w.document.querySelector('#practiceMistakes').textContent,/错题修复站/);
 assert.match(w.document.querySelector('#practiceMistakes').textContent,/1\+2/);
 who='student-B';await w.MistakeBook.refresh();assert.doesNotMatch(w.document.querySelector('#practiceMistakes').textContent,/1\+2/);
 role='teacher';await w.MistakeBook.refresh();assert.match(w.document.querySelector('#practiceMistakes').textContent,/请先登录学生账号/);
 console.log('Mistake book smoke, dedupe and identity isolation: OK');
}
run().catch(e=>{console.error(e);process.exitCode=1;});