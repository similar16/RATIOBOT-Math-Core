/* Content and persistence gates for the simplified application-problem workflow. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems');
const E=require(path.join(base,'engine.js')),P=require(path.join(base,'progress.js')),R=require(path.join(base,'relations.js'));
const data=['data-l7-l8','data-l9-review','data-textbook-intro','data-textbook-applications','data-textbook-review','data-pep-foundations','data-pep-applications','data-pep-review'].flatMap(f=>require(path.join(base,f+'.js')));
const find=id=>data.find(p=>p.id===id);
const trapezoid=find('G9-06'),tr=trapezoid.routes[0];
assert.match(trapezoid.facts.find(f=>f.id==='formula').text,/×1\/2/);
assert.equal(tr.table.rows[0].cells[4].expr,'(12+x)*8*(1/2)');
assert(!JSON.stringify(R.build(trapezoid,tr)).includes('面积的2倍'));
for(const input of ['(12+x)*8*1/2=120','(1/2)*8*(12+x)=120','120=(12+x)*8*(1/2)',String.raw`(12+x)\times8\times\frac{1}{2}=120`]){
 assert(E.checkEquation(input,tr.equations[0]).ok,input);
}
assert(!E.checkEquation('(12+x)*8*2=120',tr.equations[0]).ok);
const odd=find('G9-08'),or=odd.routes[0];
assert.equal(odd.title,'三个连续奇数相加');assert(odd.originalStem.includes('积'),'The adjustment keeps the original question in source metadata');
assert.deepEqual(or.answers.map(a=>a.expr),['3','5','7']);assert.equal(or.equations[0].answerIndex,1);
assert(!JSON.stringify(or).includes('105'));assert(!JSON.stringify(R.build(odd,or)).includes('数之积'));
const calendar=find('TB-R01'),cr=calendar.routes[0],cm=R.build(calendar,cr);
assert.deepEqual(cr.table.headers,['框形','左边数','中心数','右边数','上方数','下方数']);assert.equal(cr.table.rows.length,3);assert.equal(cr.relationshipOnly,true);assert(!cr.discussion);
assert.equal(cr.table.rows.flatMap(r=>r.cells).filter(c=>c.expr&&!c.given).length,8);assert.deepEqual(cr.sumExpressions.map(item=>item.expr),['3*x','5*x']);
assert.equal(cm.sum.length,2);assert.equal(cm.product.length,2);
assert.equal(cr.equations.length,0);assert.equal(cr.answers.length,0);assert(!cr.additionalVariables.find(v=>v.variable==='S').known);
assert.match(cr.tableNote,/左、右、上、下/);assert.equal(cr.checks.length,0);
const F=require(path.join(base,'reading.js'));
assert.equal(calendar.facts.find(f=>f.id==='center').numericBlanks,false);assert.equal(F.build(calendar).facts.find(f=>f.id==='center').fields.length,0,'The one-frame convention remains a readable statement');
assert.equal(R.reference(calendar,cr).sum.length,0,'Calendar references contain no extra additive relations');
const life=find('TB-A37'),lifeReference=R.reference(life,life.routes[0]);assert.equal(lifeReference.sum.length,1);assert.equal(lifeReference.sum[0].terms.length,6,'All six life stages share one addition relationship');
const half=find('TB-I05');assert(!half.facts.some(f=>/平均分|其中1份/.test(f.text)));assert.equal(F.build(half).facts.find(f=>f.id==='half').fields.length,0);assert.equal(R.reference(half,half.routes[0]).product.length,0);
assert.equal(find('S01').routes[0].reverseModel,true,'The story task starts from its given equation');
for(const p of data){
 for(const fact of p.facts.filter(f=>f.kind==='property'&&/一半|二分之一/.test(f.text)))assert.equal(F.build(p).facts.find(f=>f.id===fact.id).fields.length,0,p.id+' does not ask pupils to fill the definition of one half');
 if(p.kind==='open')for(const r of p.routes){assert.equal(r.answers.length,0);assert.equal(r.checks.length,0);assert(p.contentRevision>0);}
}
const vertical=find('PEP-P037');assert.equal(vertical.facts.length,3);assert.equal(vertical.sourceTable.rows.flat().filter(v=>typeof v==='number').length,31,'Original calendar retained as a reference');assert(F.build(vertical).fields.length<=3,'Only the basic quantities are filled');
const age=find('PEP-P077');assert.equal(age.routes.length,2);assert.deepEqual(age.routes.map(r=>r.table.headers[3]),['父女年龄差/岁','两时刻的年份差/年']);
const wire=find('PEP-P005');assert.equal(wire.routes.length,2);assert.deepEqual(wire.routes.map(r=>r.meaning),['从第一条截下的电线长度','两条电线调整后的共同长度']);
const percent=find('PEP-P063').routes[0];assert.equal(percent.unit,'');assert.equal(percent.answers[0].unit,'');
assert.match(percent.conclusion,/25%/);
for(const problem of [trapezoid,odd,calendar]){
 const route=problem.routes[0],current=P.cleanDraft({runId:'wp-current-'+problem.id,scratchId:'wp-current-ink',problemId:problem.id,routeId:route.id,interactionVersion:4,contentRevision:1,values:{'f:test':'new'},updatedAt:'2026-11-17T10:00:00Z'},false);
 const old=P.cleanDraft({...current,runId:'wp-legacy-'+problem.id,contentRevision:0,values:{'a:1':'105'},updatedAt:'2026-11-17T10:10:00Z'},false);
 const history={...old,title:'旧版求积记录',at:old.updatedAt,status:'independent',finished:true,valueLabels:{'a:1':'三个奇数的积'}};
 const older={drafts:{[problem.id]:old},records:[history]},newer={drafts:{[problem.id]:current}};
 assert.equal(P.cleanDraft(current,false).contentRevision,1);
 for(const merged of [P.merge(older,newer),P.merge(newer,older)]){
  assert.equal(merged.drafts[problem.id].runId,current.runId,'A later old device cannot overwrite revised content');
  assert.equal(merged.drafts[problem.id].values['f:test'],'new');
  assert.deepEqual(merged.records,P.normalized(older).records,'Historical title, values and labels are not reinterpreted');
 }
 assert.throws(()=>P.complete(null,old,problem,route),/内容已更新/);
}
const dom=new JSDOM('<div id="figure"></div>',{runScripts:'outside-only'}),w=dom.window,host=w.document.querySelector('#figure');
w.katex={renderToString:s=>String(s)};w.RatioWordProblemEngine=E;
w.eval(fs.readFileSync(path.join(base,'diagrams.js'),'utf8'));
const D=w.RatioWordProblemDiagrams,fish=find('G9-07');
D.mount(host,fish,fish.routes[0]);
assert.equal(fish.sourceFigure.file,'figures/match-fish.svg');
assert(!host.querySelector('img'),'The observation no longer depends on a remote scan');
assert(!host.querySelector('svg'),'The original figure appears with the prompt instead of being replaced by counting bars');
const slider=host.querySelector('input[type=range]');slider.value='3';slider.dispatchEvent(new w.Event('input'));assert.match(host.textContent,/20/);
const tower=find('G9-10');assert(!tower.diagram&&!tower.sourceFigure,'The tower illustration is removed at the user request');
D.mount(host,tower,tower.routes[0]);assert.equal(host.childNodes.length,0);
D.destroy(host);dom.window.close();
const css=fs.readFileSync(path.join(base,'styles.css'),'utf8');
assert.match(css,/overflow-x:clip;padding-right:7px;padding-left:7px/,'Both horizontal edges reserve room for the floating card');
console.log('PASS application refinements: half-factor modeling, three-number sum, five-position calendar, local fish figure, removed tower illustration, percentage variable and revision-safe history');
