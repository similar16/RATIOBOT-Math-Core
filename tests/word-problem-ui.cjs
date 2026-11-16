/* Student workflow tests: actual DOM events, exact content, account-scoped persistence. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const base = path.resolve(process.env.SITE_DIR || 'site', 'word-problems');
const files = ['engine.js','progress.js','data-l7-l8.js','data-l9-review.js','data-textbook-intro.js','data-textbook-applications.js','data-textbook-review.js','textbook-index.js','diagrams.js','app.js'];
const sources = files.map(file => ({ file, text:fs.readFileSync(path.join(base,file),'utf8') }));
const clone = v => JSON.parse(JSON.stringify(v));
const counts = { routes:0, sourceSteps:0, writableCells:0, equations:0, completed:0 };

function fixture() {
 const dom = new JSDOM('<!doctype html><html lang="zh-CN"><head></head><body><section id="host"></section></body></html>', {
  url:'https://test.invalid/RATIOBOT-Math-Core/', runScripts:'outside-only', pretendToBeVisual:true,
 });
 const w = dom.window, host = w.document.querySelector('#host');
 w.HTMLElement.prototype.scrollIntoView = function(){};
 w.scrollTo = ()=>{};
 // Typesetting is separately exercised by the renderer tests/browser QA. Keep DOM tests focused on behavior.
 w.katex = { renderToString:s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])) };
 for (const {file,text} of sources) w.eval(text+'\n//# sourceURL='+file);
 let owner='class-a::46', teacher=false, loggedIn=true, activeWrites=0, syncs=0;
 const accounts = new Map(), redirects=[];
 const P = w.RatioWordProblemProgress;
 const read = ()=>accounts.get(owner)||P.normalized(null);
 const bridge = {
  ready:()=>loggedIn, key:()=>owner, isTeacher:()=>teacher, progress:read,
  saveDraft(id,draft){if(teacher)return;accounts.set(owner,P.saveDraft(read(),id,draft));activeWrites++;},
  complete(draft,problem,route){if(teacher)return;assert.equal(problem,w.RatioWordProblemsData.find(p=>p.id===draft.problemId),'Keep the verified source object required by the production bridge');assert.equal(route,problem.routes.find(r=>r.id===draft.routeId));const done=P.complete(read(),draft,problem,route);accounts.set(owner,done.state);activeWrites++;return done.record;},
  sync:async()=>{syncs++;return true;}, go:id=>redirects.push(id),
 };
 let app=w.RatioWordProblemApp.mount(host,bridge);
 const $=selector=>host.querySelector(selector);
 const click=selector=>{const e=typeof selector==='string'?$(selector):selector;assert(e,'Missing control '+selector);e.click();return e;};
 const textInput=(selector,value)=>{const e=$(selector);assert(e,'Missing input '+selector);e.value=value;e.dispatchEvent(new w.Event('input',{bubbles:true}));return e;};
 const setInput=(key,value)=>{const e=[...host.querySelectorAll('[data-wp-input]')].find(x=>x.dataset.wpInput===key);assert(e,'Missing formula '+key);e.value=value;e.dispatchEvent(new w.Event('input',{bubbles:true}));return e;};
 const checkBox=element=>{assert(element,'Missing checkbox');element.checked=true;element.dispatchEvent(new w.Event('change',{bubbles:true}));};
 const currentStep=()=>Number($('[aria-current="step"]')?.dataset.wpStep);
 const feedback=()=>$('.wp-feedback')?.textContent||'';
 function expectPassed(step,where){assert.equal(currentStep(),step,where+' is current step');const next=$('[data-wp-next]');assert(next&&!next.disabled,where+' did not pass: '+feedback());}
 function checkAndNext(step,where){click('[data-wp-check]');expectPassed(step,where);click('[data-wp-next]');assert.equal(currentStep(),step+1,where+' advances');}
 function confirmFacts(){host.querySelectorAll('[data-wp-seen]').forEach(checkBox);checkAndNext(0,'Read source facts');}
 function selectRoute(routeId){const b=[...host.querySelectorAll('[data-wp-route]')].find(x=>x.dataset.wpRoute===routeId);assert(b,'Route '+routeId);click(b);}
 function fillDerivations(route){
  for(const d of route.derivations||[]){
   setInput('d:'+d.id,d.expr);
   for(const id of d.sources){const c=[...host.querySelectorAll('[data-wp-derived-source]')].find(x=>x.dataset.wpDerivedSource===d.id&&x.value===id);checkBox(c);}
   click([...host.querySelectorAll('[data-wp-check-derived]')].find(x=>x.dataset.wpCheckDerived===d.id));
   const card=[...host.querySelectorAll('[data-wp-derivation]')].find(x=>x.dataset.wpDerivation===d.id);
   assert(card?.querySelector('.wp-success-tag'),'Derivation '+d.id+' not accepted: '+feedback());
   counts.sourceSteps++;
  }
 }
 function canonicalRoute(problem,route){
  app.start(problem.id,true);
  assert.equal(currentStep(),0);
  assert($('[data-wp-next]').disabled,'No advancing before source step passes');
  confirmFacts();selectRoute(route.id);fillDerivations(route);checkAndNext(1,problem.id+'/'+route.id+' derivations');
  const manual=!!route.discussion||['open','boundary'].includes(problem.kind);
  if(manual)textInput('[data-wp-discussion]','这个表达式由题目给出的数量与关系得到，需要说明所用条件及单位。');
  else route.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{
   if(cell.expr&&!cell.given){setInput('t:'+ri+':'+ci,cell.expr);counts.writableCells++;}
  }));
  checkAndNext(2,problem.id+'/'+route.id+' table');
  if(!manual)for(const id of route.closure.sources){const c=[...host.querySelectorAll('[data-wp-closure]')].find(x=>x.dataset.wpClosure===id);checkBox(c);}
  checkAndNext(3,problem.id+'/'+route.id+' independent condition');
  if(manual)textInput('[data-wp-discussion]','需要检查方程的适用范围、题目是否给出充分条件，以及所求数量的实际取值要求。');
  else (route.equations||[]).forEach((equation,i)=>{setInput('e:'+i,equation.left+'='+equation.right);counts.equations++;});
  checkAndNext(4,problem.id+'/'+route.id+' equation');
  (route.answers||[]).forEach((answer,i)=>setInput('a:'+i,answer.expr));
  if((route.answers||[]).length){click('[data-wp-check]');assert($('.wp-verification'),problem.id+' must show verification after solving: '+feedback());}
  (route.checks||[]).forEach((check,i)=>setInput('c:'+i,check.result));
  if((route.verdictCases||[]).length)for(const [i,c]of route.verdictCases.entries())checkBox(host.querySelector('[data-wp-case="'+i+'"][value="'+c.correct+'"]'));
  else checkBox([...host.querySelectorAll('[name="wp-verdict"]')].find(x=>x.value===route.verdict.correct));
  checkAndNext(5,problem.id+'/'+route.id+' check actual meaning');
  textInput('[data-wp-reflection]','改变题目中的一个条件后，相关数量格子与独立等量关系需要重新检查。');
  click('[data-wp-check]');
  assert($('.wp-completion'),problem.id+'/'+route.id+' must finish: '+feedback());
  const record=read().records[0];
  if(!teacher){assert.equal(record.problemId,problem.id);assert.equal(record.routeId,route.id);assert.equal(record.finished,true);counts.completed++;}
  counts.routes++;
  return record;
 }
 return {dom,w,host,$,click,textInput,setInput,checkBox,currentStep,feedback,expectPassed,checkAndNext,confirmFacts,selectRoute,fillDerivations,canonicalRoute,
  get app(){return app;},read,accounts,redirects,get writes(){return activeWrites;},get syncs(){return syncs;},get owner(){return owner;},
  switchAccount(next,role='student'){owner=next;teacher=role==='teacher';},logout(){loggedIn=false;},
  remount(){app.destroy();host.innerHTML='';app=w.RatioWordProblemApp.mount(host,bridge);return app;},
  close(){app.destroy();dom.window.close();},
 };
}

// Every authored normal, branching, arithmetic, open and boundary route reaches its appropriate saved record.
const all=fixture();
const data=all.w.RatioWordProblemsData;
assert.equal(data.length,106);
for(const problem of data)for(const route of problem.routes)all.canonicalRoute(problem,route);
assert.equal(counts.routes,data.reduce((sum,p)=>sum+p.routes.length,0));
assert.equal(counts.completed,counts.routes);
assert.equal(all.read().records.length,counts.routes);
assert.equal(all.read().records.filter(r=>r.problemId==='L8-P2-Q4').length,1,'Both chase branches form one coherent analysis');
assert.equal(all.read().records.find(r=>r.problemId==='S06').status,'review','Parameter classification remains teacher-reviewed discussion');
assert.equal(all.read().records.find(r=>r.problemId==='G10-04').status,'review','Nonlinear boundary is not marked a solved linear exercise');
assert(all.read().records.every(r=>r.first===r.total),'Canonical independent routes pass on their first attempts');
// The progress layer must not create duplicate completions on replay/retry.
const latest=all.read().records[0],latestProblem=data.find(p=>p.id===latest.problemId),latestRoute=latestProblem.routes.find(r=>r.id===latest.routeId);
const duplicated=all.w.RatioWordProblemProgress.complete(all.read(),latest,latestProblem,latestRoute);
assert.equal(duplicated.record,null);
assert.equal(duplicated.state.records.length,all.read().records.length);
all.close();

// A correct multiplier is still incomplete without its source calculation and the chosen basis.
const provenance=fixture(),shirt=provenance.w.RatioWordProblemsData.find(p=>p.id==='L8-H1'),shirtRoute=shirt.routes[0];
provenance.app.start(shirt.id,true);provenance.confirmFacts();
const growth=shirtRoute.derivations.find(d=>d.expr==='1+25%');assert(growth);
provenance.setInput('d:'+growth.id,'1.25');
for(const id of growth.sources)provenance.checkBox([...provenance.host.querySelectorAll('[data-wp-derived-source]')].find(x=>x.dataset.wpDerivedSource===growth.id&&x.value===id));
provenance.click([...provenance.host.querySelectorAll('[data-wp-check-derived]')].find(x=>x.dataset.wpCheckDerived===growth.id));
assert.match(provenance.feedback(),/来源|过程|原数|依据/);
assert(!provenance.host.querySelector('[data-wp-derivation="'+growth.id+'"] .wp-success-tag'));
provenance.setInput('d:'+growth.id,'1+25%');
provenance.click([...provenance.host.querySelectorAll('[data-wp-check-derived]')].find(x=>x.dataset.wpCheckDerived===growth.id));
assert(provenance.host.querySelector('[data-wp-derivation="'+growth.id+'"] .wp-success-tag'),'1+25% with source must pass');
provenance.click('[data-wp-check]');
assert(provenance.$('[data-wp-next]').disabled,'Remaining derivation is still required');
provenance.close();

// Once a numerical simplification has an explicit, completed origin, later table cells may use it.
const reuse=fixture(),novel=reuse.w.RatioWordProblemsData.find(p=>p.id==='G10-10'),novelRoute=novel.routes[0];
reuse.app.start(novel.id,true);reuse.confirmFacts();reuse.fillDerivations(novelRoute);reuse.checkAndNext(1,'Novel rate derivations');
novelRoute.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{
 if(cell.expr&&!cell.given)reuse.setInput('t:'+ri+':'+ci,cell.expr==='(4/20)*x'?'x/5':cell.expr);
}));
reuse.click('[data-wp-check]');reuse.expectPassed(2,'Source-backed simplified efficiency');
novelRoute.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{
 if(cell.expr==='(4/20)*x'&&!cell.given)reuse.setInput('t:'+ri+':'+ci,'0.2x');
}));
reuse.click('[data-wp-check]');reuse.expectPassed(2,'A completed fraction derivation also permits the equivalent decimal');
reuse.close();

// Derived constants retain their calculation chain visibly inside the table itself.
const chains=fixture(),chainShirt=chains.w.RatioWordProblemsData.find(p=>p.id==='L8-H1');
chains.app.start(chainShirt.id,true);chains.confirmFacts();chains.fillDerivations(chainShirt.routes[0]);chains.checkAndNext(1,'Visible percent source chains');
assert.equal(chains.host.querySelectorAll('.wp-cell-chain').length,2);
assert.match(chains.host.querySelector('.wp-cell-chain').textContent,/1.*25.*1\.25/);
chains.close();

// Worked examples stay explicitly labeled; they never count as independent analyses.
const example=fixture(),exampleProblem=example.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
example.app.start(exampleProblem.id,true);
for(let step=0;step<6;step++){
 example.click('[data-wp-example]');
 example.checkAndNext(step,'Worked-example step '+step);
}
example.textInput('[data-wp-reflection]','我参考了示范，需要重新检查每个数量的来源，再独立完成一道变式。');
example.click('[data-wp-check]');
assert.equal(example.read().records[0].status,'example');
assert.equal(example.w.RatioWordProblemProgress.summary(example.read()).independent,0);
example.close();

// Editing an earlier step invalidates subsequent gates, including stale navigation controls.
const invalidation=fixture(),tea=invalidation.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
invalidation.canonicalRoute(tea,tea.routes[0]);
invalidation.click('[data-wp-step="0"]');
const fact=invalidation.host.querySelector('[data-wp-seen]');fact.checked=false;fact.dispatchEvent(new invalidation.w.Event('change',{bubbles:true}));
invalidation.click('[data-wp-step="6"]');
assert.equal(invalidation.currentStep(),0,'An edited source condition must block a stale completed-step button');
assert(invalidation.$('[data-wp-next]').disabled,'Next step disabled immediately after earlier edit');
invalidation.close();

// A saved reflection remains editable: retain focus and selection, then save a new revision.
const revised=fixture(),revisedProblem=revised.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
const originalRecord=clone(revised.canonicalRoute(revisedProblem,revisedProblem.routes[0]));
const reflectionBox=revised.$('[data-wp-reflection]');reflectionBox.focus();
reflectionBox.value='每套茶杯增加一个时，杯子数量和杯子耗泥量都要改变。';reflectionBox.setSelectionRange(3,8);
reflectionBox.dispatchEvent(new revised.w.Event('input',{bubbles:true}));
assert.equal(revised.w.document.activeElement,reflectionBox,'Editing a completed reflection retains its active editor');
assert.equal(reflectionBox.selectionStart,3);assert.equal(reflectionBox.selectionEnd,8);
assert(!revised.$('.wp-completion'),'Edited work must no longer claim to be saved as complete');
assert.equal(revised.$('[data-wp-check]')?.textContent,'保存分析','An edited finished reflection can be saved again');
revised.click('[data-wp-check]');
const revisedRecord=revised.read().records.find(r=>r.runId!==originalRecord.runId);
assert(revisedRecord,'A changed finished analysis receives a distinct revision identifier');
assert.equal(revisedRecord.reflection,reflectionBox.value);
assert.equal(revised.read().records.find(r=>r.runId===originalRecord.runId).reflection,originalRecord.reflection,'The earlier submitted record is not silently overwritten');
assert.equal(revised.w.RatioWordProblemProgress.summary(revised.read()).completed,1,'Revising one task does not increase its completed-task count');
revised.close();

// Written modeling changes invalidate every later gate, just as edits to formulas do.
const customChange=fixture(),customProblem=customChange.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
const customOriginal=customChange.canonicalRoute(customProblem,customProblem.routes[0]);
customChange.click('[data-wp-step="1"]');customChange.textInput('[data-wp-custom]','改设茶杯数量为 y，再由每套杯数表示茶壶数量。');
assert(customChange.$('[data-wp-next]').disabled,'An edited alternative model must be rechecked');
customChange.click('[data-wp-step="6"]');assert.equal(customChange.currentStep(),1,'No skipping later gates after a written modeling change');
assert(customChange.$('[data-wp-check]'),'A formerly completed earlier stage regains its check action');
customChange.click('[data-wp-catalog]');
const customDraft=customChange.read().drafts[customProblem.id];
assert.equal(customDraft.finished,false);assert.notEqual(customDraft.runId,customOriginal.runId);
for(let step=1;step<7;step++)assert(!customDraft.passed[step],'Written model edit invalidates step '+step);
assert.match(customDraft.customModel,/茶杯数量/);customChange.close();

const discussionChange=fixture(),discussionProblem=discussionChange.w.RatioWordProblemsData.find(p=>p.id==='G10-04');
discussionChange.canonicalRoute(discussionProblem,discussionProblem.routes[0]);discussionChange.click('[data-wp-step="2"]');
discussionChange.textInput('[data-wp-discussion]','两个未知的长度相乘，必须重新判断方程的次数。');
assert(discussionChange.$('[data-wp-next]').disabled);
discussionChange.click('[data-wp-step="4"]');assert.equal(discussionChange.currentStep(),2,'A revised table discussion cannot bypass its dependent explanation');
discussionChange.click('[data-wp-catalog]');
const discussionDraft=discussionChange.read().drafts[discussionProblem.id];
assert.equal(discussionDraft.finished,false);for(let step=2;step<7;step++)assert(!discussionDraft.passed[step]);
assert.match(discussionDraft.discussion,/方程的次数/);discussionChange.close();

// Revising the practical verdict keeps the checked numerical answers but reopens verification.
const verdictChange=fixture(),verdictProblem=verdictChange.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
verdictChange.canonicalRoute(verdictProblem,verdictProblem.routes[0]);verdictChange.click('[data-wp-step="5"]');
verdictChange.checkBox(verdictChange.$('[name="wp-verdict"][value="impossible"]'));
assert(verdictChange.$('[data-wp-next]').disabled);assert(verdictChange.$('[data-wp-check]'));
assert(!verdictChange.$('.wp-solution'),'A previously passed solution must not remain presented as a checked result after editing');
verdictChange.click('[data-wp-step="6"]');assert.equal(verdictChange.currentStep(),5);
verdictChange.click('[data-wp-check]');assert.match(verdictChange.feedback(),/题目要求/,'A revised incorrect verdict is checked again');
verdictChange.click('[data-wp-catalog]');
const verdictDraft=verdictChange.read().drafts[verdictProblem.id];
assert.equal(verdictDraft.finished,false);assert.equal(verdictDraft.answersChecked,true);assert(!verdictDraft.passed[5]);assert(!verdictDraft.passed[6]);
verdictChange.close();

// Derived values must lose validity when either their calculation or their prerequisite changes.
const cascade=fixture(),tower=cascade.w.RatioWordProblemsData.find(p=>p.id==='G9-10'),towerRoute=tower.routes[0];
cascade.app.start(tower.id,true);cascade.confirmFacts();cascade.fillDerivations(towerRoute);cascade.click('[data-wp-check]');cascade.expectPassed(1,'Tower derivations');
const firstDerived=towerRoute.derivations[0];cascade.setInput('d:'+firstDerived.id,'2+2');
cascade.click('[data-wp-check]');
assert(cascade.$('[data-wp-next]').disabled,'Editing a checked derivation must close the stage gate');
const cascadeDraft=cascade.read().drafts[tower.id];
assert(!cascadeDraft.derived[firstDerived.id],'Edited derivation cannot remain marked valid');
for(const later of towerRoute.derivations.slice(1))assert(!cascadeDraft.derived[later.id],'Dependent derivation '+later.id+' must be invalidated');
cascade.close();

// Restore checked answers after leaving the page so the pupil can resume verification directly.
const restore=fixture(),fruit=restore.w.RatioWordProblemsData.find(p=>p.id==='L7-P2'),fruitRoute=fruit.routes[0];
restore.canonicalRoute(fruit,fruitRoute);restore.click('[data-wp-step="5"]');
assert(restore.$('.wp-verification'));
restore.remount().start(fruit.id);
// Completed records intentionally reopen the final step; explicitly revisit verification.
restore.click('[data-wp-step="5"]');
assert(restore.$('.wp-verification'),'A restored checked answer keeps verification available');
restore.close();

// Changing accounts while an editor is open may neither save that draft nor complete it for the new account.
const identity=fixture(),p=identity.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
identity.app.start(p.id,true);identity.confirmFacts();identity.checkAndNext(1,'Tea setup');
const oldAccount=identity.owner,oldState=clone(identity.accounts.get(oldAccount));
identity.switchAccount('class-a::45');
const oldInput=identity.host.querySelector('[data-wp-input]');assert(oldInput);oldInput.value='123';oldInput.dispatchEvent(new identity.w.Event('input',{bubbles:true}));
assert.equal(identity.redirects.at(-1),'account');
assert(!identity.accounts.has('class-a::45'),'No previous-account draft may be saved under the new identity');
assert.deepEqual(clone(identity.accounts.get(oldAccount)),oldState,'Old profile also remains unchanged after identity mismatch');
identity.close();

// Teacher demonstration uses the same flow, with no writes to any student profile.
const teacher=fixture();teacher.switchAccount('teacher::preview','teacher');teacher.remount();
const teacherProblem=teacher.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
teacher.canonicalRoute(teacherProblem,teacherProblem.routes[0]);
assert.equal(teacher.accounts.size,0);
assert.equal(teacher.writes,0);
assert.match(teacher.host.textContent,/教师演示/);
teacher.close();


// Textbook and guide catalogs retain source context while sharing repeated-question progress.
const catalogs=fixture();catalogs.app.open();
assert.equal(catalogs.host.querySelectorAll('[data-wp-problem]').length,81,'80 textbook positions and one explicit reference');
catalogs.click('[data-wp-location="I00"]');
assert.match(catalogs.$('.wp-citation').textContent,/105页.*章引入/);
assert.equal(catalogs.read().drafts['G10-01'].sourceLocation,'I00');
catalogs.click('[data-wp-catalog]');catalogs.click('[data-wp-book="guide"]');
assert.equal(catalogs.host.querySelectorAll('[data-wp-problem]').length,55,'Guide keeps all original 55 tasks');
catalogs.click('[data-wp-problem="G10-01"]');
assert.match(catalogs.$('.wp-citation').textContent,/教学设计与指导/,'Guide entry must not retain a different source selection');
catalogs.close();

// Taking quantities uses the learner's checked expression, adds grouping, and never chooses the operation.
const taking=fixture();taking.app.start('L7-P1',true);
for(let step=0;step<2;step++){taking.click('[data-wp-example]');taking.checkAndNext(step,'Table builder setup '+step);}
taking.click('[data-wp-example]');taking.setInput('t:1:2','6*0.15*x');taking.checkAndNext(2,'Student equivalent quantity');
taking.click('[data-wp-example]');taking.checkAndNext(3,'Builder closing condition');
assert.equal(taking.$('[data-wp-input="e:0"]').value,'','The module must not preassemble the equation');
taking.click('[data-wp-take="0:2"]');taking.click('[data-wp-key="+"]');taking.click('[data-wp-take="1:2"]');taking.click('[data-wp-key="="]');taking.click('[data-wp-take="2:2"]');
assert.match(taking.$('[data-wp-input="e:0"]').value,/6\*0\.15\*x/,'Take the learner expression instead of replacing it with a reference');
taking.click('[data-wp-check]');taking.expectPassed(4,'Equation assembled from selected quantities');taking.close();

// Numerical coincidence does not establish the origin of a different quantity.
const coincidence=fixture(),chase=coincidence.w.RatioWordProblemsData.find(p=>p.id==='TB-A30'),chaseRoute=chase.routes[0];
assert.equal(chase.routes.length,1,'Both required station cases belong to one complete task');
coincidence.app.start(chase.id,true);coincidence.confirmFacts();
const lead=chaseRoute.derivations.find(d=>d.id==='lead');coincidence.setInput('d:lead',lead.expr);
for(const id of lead.sources)coincidence.checkBox(coincidence.$('[data-wp-derived-source="lead"][value="'+id+'"]'));
coincidence.click('[data-wp-check-derived="lead"]');
const far=chaseRoute.derivations.find(d=>d.id==='farRemaining');coincidence.setInput('d:farRemaining','15');
for(const id of far.sources)coincidence.checkBox(coincidence.$('[data-wp-derived-source="farRemaining"][value="'+id+'"]'));
coincidence.click('[data-wp-check-derived="farRemaining"]');
assert(!coincidence.$('[data-wp-derivation="farRemaining"] .wp-success-tag'),'A previously derived 15 minutes cannot replace another calculation');
assert.match(coincidence.feedback(),/来源|计算过程/);
coincidence.setInput('d:farRemaining','1800/60-(45-30)');coincidence.click('[data-wp-check-derived="farRemaining"]');
assert(coincidence.$('[data-wp-derivation="farRemaining"] .wp-success-tag'),'Expanding a checked parent calculation preserves its origin');
for(let step=1;step<5;step++){coincidence.click('[data-wp-example]');coincidence.checkAndNext(step,'Both-case setup '+step);}
coincidence.click('[data-wp-example]');
coincidence.checkBox(coincidence.$('[data-wp-case="1"][value="valid"]'));
coincidence.click('[data-wp-check]');assert(coincidence.$('[data-wp-next]').disabled,'Correct first case cannot substitute for the second case');
coincidence.checkBox(coincidence.$('[data-wp-case="1"][value="impossible"]'));
coincidence.click('[data-wp-check]');coincidence.expectPassed(5,'Both required cases verified');coincidence.close();

// The figure is checked by structure, not just a coincidentally identical total.
const chess=fixture(),chessProblem=chess.w.RatioWordProblemsData.find(p=>p.id==='G9-03');
const diagram=chess.w.document.createElement('div');chess.host.append(diagram);
chess.w.RatioWordProblemDiagrams.mount(diagram,chessProblem,chessProblem.routes[0]);
const slider=diagram.querySelector('input[type="range"]');slider.value='3';slider.dispatchEvent(new chess.w.Event('input',{bubbles:true}));
assert.equal(diagram.querySelectorAll('[data-wp-color]').length,16);
assert.equal(diagram.querySelectorAll('[data-wp-color="black"]').length,10);
assert.equal(diagram.querySelector('[data-wp-row="1"][data-wp-col="1"]').dataset.wpColor,'black');
assert.equal(diagram.querySelector('[data-wp-row="1"][data-wp-col="3"]').dataset.wpColor,'white');
chess.close();

(async()=>{
 // Deferred catalog rendering may not navigate away after the student opens a problem.
 const searching=fixture();searching.app.open();searching.textInput('[data-wp-search]','追');searching.click('[data-wp-location="I00"]');
 await new Promise(resolve=>setTimeout(resolve,320));assert.equal(searching.currentStep(),0);assert.match(searching.$('.wp-citation').textContent,/105页/);searching.close();
 // MathLive loads lazily. Replacing a focused fallback field must preserve the chosen equation target.
 const upgrading=fixture();upgrading.app.start('L8-H1',true);
 for(let step=0;step<4;step++){upgrading.click('[data-wp-example]');upgrading.checkAndNext(step,'Delayed editor setup '+step);}
 upgrading.setInput('e:1','10+').focus();
 class FakeMathfield extends upgrading.w.HTMLElement{constructor(){super();this.value='';}insert(value){this.value+=value;}}
 upgrading.w.customElements.define('math-field',FakeMathfield);upgrading.w.MathfieldElement=FakeMathfield;
 const loader=upgrading.w.document.querySelector('script[src*="mathlive.min.js"]');assert(loader);loader.onload();
 await Promise.resolve();await Promise.resolve();
 const target=upgrading.host.querySelector('[data-wp-editor="e:1"] math-field');assert(target);
 upgrading.click('[data-wp-take="1:0"]');
 assert.equal(upgrading.host.querySelector('[data-wp-editor="e:0"] math-field').value,'','An upgraded second editor must not fall back to the first equation');
 assert(upgrading.w.RatioWordProblemEngine.equivalent(target.value,'10+y'),'The selected second equation receives its quantity after editor upgrade');
 upgrading.close();
 console.log('PASS textbook navigation, checked-table equation assembly, complete case analysis, exact chess structure and delayed editor focus');
})().catch(error=>{console.error(error);process.exitCode=1;});

console.log('PASS word-problem UI:',JSON.stringify(counts));
console.log('Verified complete authored flows, explicit percent origins, source gating, prerequisite invalidation, verification restore, completion deduplication, identity isolation and teacher preview.');
