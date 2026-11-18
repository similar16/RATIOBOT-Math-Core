/* Original prompts, required diagram structure, and the shortened half-then-add model. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems');
const data=fs.readdirSync(base).filter(f=>/^data-.*\.js$/.test(f)).flatMap(f=>require(path.join(base,f)));
const E=require(path.join(base,'engine.js')),T=require(path.join(base,'table-alternatives.js'));
const find=id=>data.find(p=>p.id===id);
assert.equal(data.length,150);
for(const p of data){
 assert(p.originalStem&&p.originalStem.length>12,p.id+' has a verified source prompt');
 assert(!p.originalStem.includes('。'),p.id+' keeps the requested period style');
 if(p.sourceFigure){
  assert(!/^https?:/.test(p.sourceFigure.file),'Original figures are available locally');
  const name=path.join(base,p.sourceFigure.file),source=fs.readFileSync(name,'utf8');
  const dom=new JSDOM(source,{contentType:'image/svg+xml'}),doc=dom.window.document;
  assert(!doc.querySelector('parsererror'),name+' is valid XML');
  assert(doc.querySelector('title')?.textContent&&doc.querySelector('desc')?.textContent,name+' is described');
  assert(!doc.querySelector('image,foreignObject,script'),name+' is a complete standalone vector');
  assert(!source.includes('http://thumb.')&&!source.includes('https://thumb.'),'No external bitmap is needed');
  const svg=doc.documentElement,view=svg.getAttribute('viewBox').split(' ').map(Number);
  assert(![...doc.querySelectorAll('rect')].some(r=>Number(r.getAttribute('width'))===view[2]&&Number(r.getAttribute('height'))===view[3]),'No solid canvas background');
  dom.window.close();
 }
}
function document(file){return new JSDOM(fs.readFileSync(path.join(base,'figures',file),'utf8'),{contentType:'image/svg+xml'});}
for(const [name,counts,selector]of [
 ['chess-pattern.svg',[4,7,10,13],'circle[data-color="black"]'],
 ['match-squares.svg',[4,7,10],'line'],
 ['match-fish.svg',[8,14,20],'line'],
]){
 const dom=document(name),doc=dom.window.document;
 assert.deepEqual([...doc.querySelectorAll('[data-pattern]')].map(g=>g.querySelectorAll(selector).length),counts,name+' follows the original geometry');
 dom.window.close();
}
const half=find('TB-I05'),r=half.routes[0];
assert.deepEqual(E.validateProblem(half),[]);
assert.equal(r.table.rows.flatMap(row=>row.cells).filter(c=>c.expr&&!c.given).length,1,'Only one expression is required before forming the equation');
const c=r.table.rows[0].cells[0],options={...c,alternatives:[...(c.alternatives||[]),...T.options(half,r,0,0)]};
for(const expression of ['a/2+2','(1/2)*a+2','2+a*0.5','5'])assert(E.checkTableCell(expression,options,r.variable).ok,expression);
assert(!E.checkTableCell('(a+2)/2',options,r.variable).ok,'The simplification still distinguishes the operation order');
assert(E.checkEquation('a/2+2=5',r.equations[0],r.variable).ok);
assert.equal(r.answers[0].expr,'6');
assert.equal(find('G9-03').originalStem,'用黑白两色棋子按图4.3-6的方式摆图形，依此规律，图形中黑色棋子的个数有可能是50吗？');
assert.match(find('G9-03').originalStems.A12,/图4-7/,'Opening the textbook location uses the textbook figure number');
assert.match(find('G9-06').originalStems.I21,/梯形面积公式/,'Repeated source positions retain their own wording');
assert.match(find('G9-09').originalStems.A33,/25个四边形/,'The textbook four-sided-figure question is not rewritten as a rhombus question');
assert(!find('G9-10').diagram&&!find('G9-10').sourceFigure);
assert.match(find('G9-08').originalStem,/求它们的积/);assert.match(find('G9-08').analysisNote,/三数相加/,'The earlier requested adjustment is explained outside the original');
// Exercise the actual prompt renderer, including repeated locations and local full-size links.
const dom=new JSDOM('<section id="host"></section>',{url:'https://test.invalid/word-problems/app.js?v=fixture',runScripts:'outside-only'}),w=dom.window,host=w.document.querySelector('#host');
w.katex={renderToString:s=>String(s)};w.HTMLElement.prototype.scrollIntoView=function(){};
for(const f of ['engine','progress','data-l7-l8','data-l9-review','data-textbook-intro','data-textbook-applications','data-textbook-review','data-pep-foundations','data-pep-applications','data-pep-review','catalog','table-alternatives','textbook-index','supplement-index','reading','relations','relation-builder','scratchpad','diagrams','app'])w.eval(fs.readFileSync(path.join(base,f+'.js'),'utf8'));
const P=w.RatioWordProblemProgress;let state=P.normalized(null);
const app=w.RatioWordProblemApp.mount(host,{key:()=> 'fixture::46',ready:()=>true,isTeacher:()=>true,progress:()=>state,saveDraft:(id,d)=>{state=P.saveDraft(state,id,d);},go:()=>{}});
for(const [id,loc]of [['G9-03','A12'],['G9-06','I21'],['G9-09','A33'],['TB-I07','I07'],['TB-I03','I03'],['G9-07',null]]){
 app.start(id,true,loc);
 const p=find(id),expected=p.originalStems?.[loc]||p.originalStem;
 assert.equal(host.querySelector('.wp-stem').textContent,expected,id+' shows the selected original');
 assert(host.querySelector('.wp-original-problem').open,'The original prompt and figure start expanded');
 if(p.sourceFigure){
  const img=host.querySelector('[data-wp-source-figure] img'),link=img.closest('a');
  assert(img.src.endsWith(p.sourceFigure.file+'?v=fixture'));assert.equal(link.href,img.src);assert.equal(link.target,'_blank');
 }
}
app.start('G9-10',true,'A14');assert(!host.querySelector('[data-wp-source-figure],.wp-observation'),'The removed tower does not leave an empty image or diagram panel');
const original=host.querySelector('.wp-stem').textContent;host.querySelector('[data-wp-restart]').click();host.querySelector('[data-wp-confirm-reset]').click();
assert.equal(host.querySelector('.wp-stem').textContent,original,'Reset preserves the selected source text');
app.destroy();dom.window.close();
console.log('PASS original wording for 150 tasks, source-specific repeated prompts, transparent standalone figures, exact chess/match counts, and one-expression half-then-add modeling');
