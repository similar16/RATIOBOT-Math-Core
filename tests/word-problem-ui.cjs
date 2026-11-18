/* Student workflow tests: actual DOM events, exact content, account-scoped persistence. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const base = path.resolve(process.env.SITE_DIR || 'site', 'word-problems');
const files = ['engine.js','math-input.js','progress.js','data-l7-l8.js','data-l9-review.js','data-textbook-intro.js','data-textbook-applications.js','data-textbook-review.js','data-pep-foundations.js','data-pep-applications.js','data-pep-review.js','catalog.js','table-alternatives.js','textbook-index.js','supplement-index.js','reading.js','relations.js','relation-builder.js','scratchpad.js','diagrams.js','app.js'];
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
 // Exercise the real scratchpad. jsdom needs drawing primitives; persistence is covered by its focused IndexedDB tests.
 w.structuredClone=structuredClone;
 const canvasContext={};
 for(const name of ['setTransform','resetTransform','clearRect','fillRect','beginPath','closePath','moveTo','lineTo','stroke','arc','fill','save','restore','scale','translate','drawImage','setLineDash'])canvasContext[name]=()=>{};
 w.HTMLCanvasElement.prototype.getContext=()=>canvasContext;
 w.HTMLCanvasElement.prototype.setPointerCapture=function(){};
 w.HTMLCanvasElement.prototype.releasePointerCapture=function(){};
 w.HTMLCanvasElement.prototype.hasPointerCapture=()=>true;
 w.ResizeObserver=class {observe(){}disconnect(){}};
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
 function checkAndNext(step,where){assert($('.wp-stage-top [data-wp-restart]'),'Reset remains available at '+where);click('[data-wp-check]');expectPassed(step,where);click('[data-wp-next]');assert.equal(currentStep(),step===2&&read().drafts[$('[data-wp-current-problem]').dataset.wpCurrentProblem]?.problemId==='TB-R01'?6:step===3?5:step===0&&read().drafts[$('[data-wp-current-problem]').dataset.wpCurrentProblem]?.problemId==='S01'?2:step+1,where+' advances');}
 function completeScratch(where,route){
  assert.equal(currentStep(),5,where+' reaches the scratchpad and answer confirmation');
  assert.equal($('.wp-stage h3')?.textContent,'在草稿纸上解方程并确认答案');
  assert($('[data-wp-scratch-mount]'),'The personal scratchpad is mounted');
  assert($('.wp-stage-top [data-wp-restart]'),'Reset is available while solving');
  assert(!$('.wp-answer-confirm').textContent.includes('不必算出结果'),'Answer confirmation still asks for the result');
  assert(!$('[data-wp-hint]')&&!$('[data-wp-example]'),'Handwriting does not reveal a worked answer');
  assert(!$('.wp-solution')&&!$('.wp-verification'),'Verification stays on the next page');
  const problem=w.RatioWordProblemsData.find(p=>p.id===$('[data-wp-current-problem]').dataset.wpCurrentProblem);
  route=route||problem.routes.find(r=>r.id===read().drafts[problem.id]?.routeId)||problem.routes[0];
  for(const [i,a]of (route.answers||[]).entries())if($('[data-wp-input="a:'+i+'"]').value!==a.expr)setInput('a:'+i,a.expr);
  click('[data-wp-check]');expectPassed(5,where+' confirms the numerical answers without grading ink');
  assert(!$('.wp-verification'),'Confirming answers does not mix verification onto this page');
  click('[data-wp-next]');assert.equal(currentStep(),6);
  assert(!$('[data-wp-next]')&&!$('[data-wp-reflection]'));
  assert(!$('[data-wp-input="a:0"]'),'The final page has no answer-confirmation input');
 }
 function fillVerification(route){
  (route.checks||[]).forEach((check,i)=>setInput('c:'+i,check.result));
  if((route.verdictCases||[]).length)for(const [i,c]of route.verdictCases.entries())checkBox(host.querySelector('[data-wp-case="'+i+'"][value="'+c.correct+'"]'));
  else checkBox([...host.querySelectorAll('[name="wp-verdict"]')].find(x=>x.value===route.verdict.correct));
 }
 function confirmFacts(){
  const problem=w.RatioWordProblemsData.find(p=>p.id===$('[data-wp-current-problem]').dataset.wpCurrentProblem);
  for(const [key,value]of Object.entries(w.RatioWordProblemReading.canonical(problem)))textInput('[data-wp-fact="'+key+'"]',value);
  host.querySelectorAll('[data-wp-seen]').forEach(checkBox);checkAndNext(0,'Read source facts');
 }
 function fillRelations(){assert.equal(host.querySelectorAll('[data-wp-rel-slot],[data-wp-token]').length,0,'Modeling references never require dragging');}

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
  if(route.relationshipOnly){assert.equal(currentStep(),2);assert(!$('.wp-stage textarea'));assert.equal(host.querySelectorAll('[data-wp-input]').length,2);setInput('t:0:0','3');setInput('t:1:0','5');checkAndNext(2,'Basic calendar relations');assert(!$('.wp-stage textarea'));click('[data-wp-check]');assert($('.wp-completion'));if(!teacher)counts.completed++;counts.routes++;return read().records[0];}
  assert.equal(currentStep(),0);
  assert($('[data-wp-next]').disabled,'No advancing before source step passes');
  confirmFacts();if(!route.reverseModel){selectRoute(route.id);fillDerivations(route);checkAndNext(1,problem.id+'/'+route.id+' derivations');}
  const reference=$('.wp-relation-reference');
  if(reference)assert(!reference.open,'Modeling references start collapsed');
  assert.equal(host.querySelectorAll('[data-wp-rel-slot],[data-wp-token]').length,0);
  assert($('.wp-original-problem').open,'The original problem stays expanded at every stage');
  const manual=!!route.discussion||['open','boundary'].includes(problem.kind);
  if(manual&&!route.reverseModel)textInput('[data-wp-discussion]','这个表达式由题目给出的数量与关系得到，需要说明所用条件及单位。');
  else route.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{
   if(cell.expr&&!cell.given){setInput('t:'+ri+':'+ci,cell.expr);counts.writableCells++;}
  }));
  fillRelations(problem,route);checkAndNext(2,problem.id+'/'+route.id+' table');
  assert.equal(host.querySelectorAll('[data-wp-rel-slot]').length,0,'The equation page uses read-only references');
  assert(!$('[data-wp-closure]')&&!$('.wp-closure-choices'),'Modeling has no duplicate condition-selection gate');
  if(manual)textInput('[data-wp-discussion]','需要检查方程的适用范围、题目是否给出充分条件，以及所求数量的实际取值要求。');
  else (route.equations||[]).forEach((equation,i)=>{setInput('e:'+i,equation.left+'='+equation.right);counts.equations++;});
  checkAndNext(3,problem.id+'/'+route.id+' condition and equation together');
  completeScratch(problem.id+'/'+route.id,route);
  fillVerification(route);
  assert.equal($('[data-wp-check]')?.textContent,'检验并保存');
  assert(!$('.wp-verification').textContent.includes('不必算出结果'),'Verification still asks for calculated results');
  click('[data-wp-check]');
  assert($('.wp-completion'),problem.id+'/'+route.id+' must finish: '+feedback());
  assert.equal(currentStep(),6,'A completed analysis remains on verification');
  assert($('.wp-solution'),'The complete derivation becomes available after verification');
  const record=read().records[0];
  if(!teacher){assert.equal(record.problemId,problem.id);assert.equal(record.routeId,route.id);assert.equal(record.finished,true);assert.equal(record.interactionVersion,4);assert.equal(record.passed[5],true);assert.equal(record.firstPass[5],true,'Numerical answers are checked; ink remains ungraded');assert.equal(record.firstPass[4],undefined,'The merged modeling page is not counted twice');assert.equal(record.reflection,'','Reflection is optional historical data, not required to finish');assert.equal(record.conditionUsed.length,problem.facts.length,'Finishing visibly accounts for every original condition');counts.completed++;}
  counts.routes++;
  return record;
 }
 return {dom,w,host,$,click,textInput,setInput,checkBox,currentStep,feedback,expectPassed,checkAndNext,completeScratch,fillVerification,confirmFacts,selectRoute,fillDerivations,fillRelations,canonicalRoute,
  get app(){return app;},read,accounts,redirects,get writes(){return activeWrites;},get syncs(){return syncs;},get owner(){return owner;},
  switchAccount(next,role='student'){owner=next;teacher=role==='teacher';},logout(){loggedIn=false;},
  remount(){app.destroy();host.innerHTML='';app=w.RatioWordProblemApp.mount(host,bridge);return app;},
  close(){app.destroy();dom.window.close();},
 };
}

(async()=>{
// Every authored normal, branching, arithmetic, open and boundary route reaches its appropriate saved record.
const all=fixture();
const data=all.w.RatioWordProblemsData;
assert.equal(data.length,150);
for(const problem of data)for(const route of problem.routes){all.canonicalRoute(problem,route);if(counts.routes%10===0)await new Promise(resolve=>setImmediate(resolve));}
assert.equal(counts.routes,data.reduce((sum,p)=>sum+p.routes.length,0));
assert.equal(counts.completed,counts.routes);
assert.equal(all.read().records.length,counts.routes);
assert.equal(all.read().records.filter(r=>r.problemId==='L8-P2-Q4').length,1,'Both chase branches form one coherent analysis');
assert.equal(all.read().records.find(r=>r.problemId==='S06').status,'review','Parameter classification remains teacher-reviewed discussion');
assert.equal(all.read().records.find(r=>r.problemId==='G10-04').status,'review','Nonlinear boundary is not marked a solved linear exercise');
assert(all.read().records.every(r=>r.first===r.total),'Canonical independent routes pass on their first attempts');
assert(all.read().records.every(r=>!Object.keys(r.values).some(k=>k.startsWith('r:'))),'All tasks complete without relationship-card answers');
all.app.open();
assert(all.host.querySelectorAll('.wp-problem-card.is-completed').length>0,'Completed tasks use a distinct card state');
assert(all.host.querySelectorAll('.wp-problem-card.is-completed').length<all.host.querySelectorAll('.wp-problem-card').length,'Open discussions remain distinct from finished tasks');
// The progress layer must not create duplicate completions on replay/retry.
const latest=all.read().records[0],latestProblem=data.find(p=>p.id===latest.problemId),latestRoute=latestProblem.routes.find(r=>r.id===latest.routeId);
const duplicated=all.w.RatioWordProblemProgress.complete(all.read(),latest,latestProblem,latestRoute);
assert.equal(duplicated.record,null);
assert.equal(duplicated.state.records.length,all.read().records.length);
all.close();
await new Promise(resolve=>setImmediate(resolve));

// A correct multiplier is still incomplete without its source calculation and the chosen basis.
const provenance=fixture(),shirt=provenance.w.RatioWordProblemsData.find(p=>p.id==='L8-H1'),shirtRoute=shirt.routes[0];
provenance.app.start(shirt.id,true);provenance.confirmFacts();
const growth=shirtRoute.derivations.find(d=>d.expr==='1+25%');assert(growth);
assert.match(provenance.$('[data-wp-input="d:'+growth.id+'"]').getAttribute('aria-label'),/计算过程（写出来源算式即可，不必算出结果）/);
provenance.setInput('d:'+growth.id,'1.25');
for(const id of growth.sources)provenance.checkBox([...provenance.host.querySelectorAll('[data-wp-derived-source]')].find(x=>x.dataset.wpDerivedSource===growth.id&&x.value===id));
provenance.click([...provenance.host.querySelectorAll('[data-wp-check-derived]')].find(x=>x.dataset.wpCheckDerived===growth.id));
assert.match(provenance.feedback(),/来源|过程|原数|依据/);
assert(!provenance.host.querySelector('[data-wp-derivation="'+growth.id+'"] .wp-success-tag'));
provenance.setInput('d:'+growth.id,'1+25%');
provenance.click([...provenance.host.querySelectorAll('[data-wp-check-derived]')].find(x=>x.dataset.wpCheckDerived===growth.id));
assert(provenance.host.querySelector('[data-wp-derivation="'+growth.id+'"] .wp-success-tag'),'1+25% with source must pass');
provenance.setInput('d:'+growth.id,'1+25%=1.25');
provenance.click('[data-wp-check-derived="'+growth.id+'"]');
assert(provenance.$('[data-wp-derivation="'+growth.id+'"] .wp-success-tag'),'An optional correct result is accepted');
const editedCalculation=provenance.setInput('d:'+growth.id,'1+25%=1.5');
assert.equal(provenance.$('[data-wp-input="d:'+growth.id+'"]'),editedCalculation,'Editing preserves the active input element');
assert(!provenance.$('[data-wp-derivation="'+growth.id+'"] .wp-success-tag'),'Editing immediately removes the stale success badge');
assert(!provenance.$('[data-wp-derivation="'+growth.id+'"] .wp-derived-chain'),'Editing immediately removes the previously verified result');
provenance.click('[data-wp-check-derived="'+growth.id+'"]');
assert(!provenance.$('[data-wp-derivation="'+growth.id+'"] .wp-success-tag'),'An incorrect optional result is still checked');
provenance.setInput('d:'+growth.id,'1+25%');
provenance.click('[data-wp-check-derived="'+growth.id+'"]');
provenance.click('[data-wp-check]');
assert(provenance.$('[data-wp-next]').disabled,'Remaining derivation is still required');
provenance.close();

// Once a numerical simplification has an explicit, completed origin, later table cells may use it.
const reuse=fixture(),novel=reuse.w.RatioWordProblemsData.find(p=>p.id==='G10-10'),novelRoute=novel.routes[0];
reuse.app.start(novel.id,true);reuse.confirmFacts();reuse.fillDerivations(novelRoute);reuse.checkAndNext(1,'Novel rate derivations');
novelRoute.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{
 if(cell.expr&&!cell.given)reuse.setInput('t:'+ri+':'+ci,cell.expr==='(4/20)*x'?'x/5':cell.expr);
}));
reuse.fillRelations(novel,novelRoute);reuse.click('[data-wp-check]');reuse.expectPassed(2,'Source-backed simplified efficiency');
novelRoute.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{
 if(cell.expr==='(4/20)*x'&&!cell.given)reuse.setInput('t:'+ri+':'+ci,'0.2x');
}));
reuse.click('[data-wp-check]');reuse.expectPassed(2,'A completed fraction derivation also permits the equivalent decimal');
reuse.close();

// A different original condition may describe the same quantity; preserve that choice through modeling.
const alternative=fixture(),jacket=alternative.w.RatioWordProblemsData.find(p=>p.id==='L8-P1'),jacketRoute=jacket.routes[0];
alternative.app.start(jacket.id,true);alternative.confirmFacts();alternative.fillDerivations(jacketRoute);alternative.checkAndNext(1,'Discount provenance');
jacketRoute.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{
 if(cell.expr&&!cell.given)alternative.setInput('t:'+ri+':'+ci,ri===0&&ci===2?'96+x':cell.expr);
}));
alternative.fillRelations(jacket,jacketRoute);alternative.click('[data-wp-check]');alternative.expectPassed(2,'Selling price from cost plus profit');
assert.match(alternative.$('[data-wp-input="t:0:2"]').closest('td').querySelector('.wp-source-preview').textContent,/盈利96元/,'Checked table inputs immediately show their chosen source');
alternative.click('[data-wp-next]');
const saleCell=alternative.$('[data-wp-take="0:2"]').closest('td');
assert.match(saleCell.querySelector('.wp-cell-expression').textContent,/96.*x/,'The table keeps the student\'s accepted expression');
assert.match(saleCell.querySelector('.wp-source').textContent,/96/,'Its source is the given profit');
assert.match(saleCell.querySelector('.wp-source-preview').textContent,/进价.*利润|盈利96元/);
assert.match(alternative.$('.wp-stage').textContent,/售价还应由进价乘1.5得到标价/,'The selected alternative provides its own independent closure hint');
alternative.setInput('e:0','(96+x)-x=96');alternative.click('[data-wp-check]');
assert(alternative.$('[data-wp-next]').disabled,'An identity assembled from an alternative cannot determine the unknown');
alternative.setInput('e:0','');alternative.click('[data-wp-take="0:2"]');
assert.match(alternative.$('[data-wp-input="e:0"]').value,/96.*x/,'Taking a table quantity uses the student expression, not the original key');
alternative.setInput('e:0','96+x=1.5*x*0.8');alternative.checkAndNext(3,'Alternative closure and additive equation');
alternative.completeScratch('Alternative selling price',jacketRoute);alternative.fillVerification(jacketRoute);alternative.click('[data-wp-check]');
assert(alternative.$('.wp-completion'));assert.equal(alternative.read().records[0].values['t:0:2'],'96+x');
assert(alternative.read().records[0].conditionUsed.includes('discount'),'The equation uses its independent condition without another checkbox');alternative.close();

// Mixed representations retain valid equations made from the unchanged cells.
const mixed=fixture(),pots=mixed.w.RatioWordProblemsData.find(p=>p.id==='L7-P1'),potsRoute=pots.routes[0];
mixed.app.start(pots.id,true);mixed.confirmFacts();mixed.fillDerivations(potsRoute);mixed.checkAndNext(1,'Mixed table setup');
potsRoute.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{
 if(cell.expr&&!cell.given)mixed.setInput('t:'+ri+':'+ci,ri===1&&ci===1?'(10.5-0.6*x)/0.15':cell.expr);
}));mixed.fillRelations(pots,potsRoute);mixed.checkAndNext(2,'A cup count expressed from clay');
mixed.setInput('e:0',potsRoute.equations[0].left+'='+potsRoute.equations[0].right);
mixed.click('[data-wp-check]');mixed.expectPassed(3,'Unchanged clay cells still support the original independent total');mixed.close();

// With two separately modeled players, selecting one alternative preserves the other player's condition.
const paired=fixture(),scores=paired.w.RatioWordProblemsData.find(p=>p.id==='PEP-P078'),scoreRoute=scores.routes[0];
paired.app.start(scores.id,true);paired.confirmFacts();paired.fillDerivations(scoreRoute);paired.checkAndNext(1,'Independent score variables');
scoreRoute.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{
 if(cell.expr&&!cell.given)paired.setInput('t:'+ri+':'+ci,ri===0&&ci===4?'76':cell.expr);
}));paired.fillRelations(scores,scoreRoute);paired.checkAndNext(2,'One given total and one calculated total');
scoreRoute.equations.forEach((q,i)=>paired.setInput('e:'+i,q.left+'='+q.right));
paired.click('[data-wp-check]');paired.expectPassed(3,'Mixed independent conditions for two players');paired.close();

// Derived constants retain their calculation chain visibly inside the table itself.
const chains=fixture(),chainShirt=chains.w.RatioWordProblemsData.find(p=>p.id==='L8-H1');
chains.app.start(chainShirt.id,true);chains.confirmFacts();chains.fillDerivations(chainShirt.routes[0]);chains.checkAndNext(1,'Visible percent source chains');
assert.equal(chains.host.querySelectorAll('.wp-cell-chain').length,2);
assert.match(chains.host.querySelector('.wp-cell-chain').textContent,/1.*25.*1\.25/);
chains.close();

// Worked examples stay explicitly labeled; they never count as independent analyses.
const example=fixture(),exampleProblem=example.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
example.app.start(exampleProblem.id,true);
for(const step of [0,1,2,3]){
 example.click('[data-wp-example]');
 example.checkAndNext(step,'Worked-example step '+step);
}
example.completeScratch('Worked example');
example.click('[data-wp-example]');
example.click('[data-wp-check]');
assert.equal(example.read().records[0].status,'example');
assert.equal(example.w.RatioWordProblemProgress.summary(example.read()).independent,0);
example.close();

// Editing an earlier step invalidates subsequent gates, including stale navigation controls.
const invalidation=fixture(),tea=invalidation.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
invalidation.canonicalRoute(tea,tea.routes[0]);
invalidation.click('[data-wp-step="0"]');
const fact=invalidation.host.querySelector('[data-wp-fact]');fact.value='';fact.dispatchEvent(new invalidation.w.Event('input',{bubbles:true}));
invalidation.click('[data-wp-step="6"]');
assert.equal(invalidation.currentStep(),0,'An edited source condition must block a stale completed-step button');
assert(invalidation.$('[data-wp-next]').disabled,'Next step disabled immediately after earlier edit');
invalidation.close();

// A saved answer remains editable; recheck it and save a distinct revision without replacing history or the scratchpad.
const revised=fixture(),revisedProblem=revised.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
const originalRecord=clone(revised.canonicalRoute(revisedProblem,revisedProblem.routes[0]));
revised.click('[data-wp-step="5"]');
const answerBox=revised.$('[data-wp-input="a:0"]');answerBox.focus();
answerBox.value='99999';answerBox.setSelectionRange(1,3);
answerBox.dispatchEvent(new revised.w.Event('input',{bubbles:true}));
assert.equal(revised.w.document.activeElement,answerBox,'Editing a completed answer retains its active editor');
assert.equal(answerBox.selectionStart,1);assert.equal(answerBox.selectionEnd,3);
assert(!revised.$('.wp-completion'),'Edited work must no longer claim to be saved as complete');
assert(!revised.$('.wp-solution'),'Editing an answer hides the previously checked complete derivation');
assert.equal(revised.$('[data-wp-check]')?.textContent,'核对答案','An edited answer must be checked again before saving');
revised.click('[data-wp-check]');
assert(!revised.$('.wp-completion'),'An incorrect revised answer cannot save a finished record');
assert.equal(revised.read().records.length,1,'An unsuccessful revision keeps the original record only');
revised.setInput('a:0','('+revisedProblem.routes[0].answers[0].expr+')');
revised.click('[data-wp-check]');revised.expectPassed(5,'Revised answer confirmation');revised.click('[data-wp-next]');assert(revised.$('.wp-verification'));
revised.fillVerification(revisedProblem.routes[0]);
assert.equal(revised.$('[data-wp-check]')?.textContent,'检验并保存');
revised.click('[data-wp-check]');assert(revised.$('.wp-completion'));
const revisedRecord=revised.read().records.find(r=>r.runId!==originalRecord.runId);
assert(revisedRecord,'A changed finished analysis receives a distinct revision identifier');
assert.equal(revisedRecord.values['a:0'],'('+revisedProblem.routes[0].answers[0].expr+')','The accepted revision retains the pupil\'s actual answer');
assert.equal(revisedRecord.scratchId,originalRecord.scratchId,'Revising an answer retains the same personal scratchpad');
assert.deepEqual(clone(revised.read().records.find(r=>r.runId===originalRecord.runId)),originalRecord,'The earlier submitted record is not silently overwritten');
assert.equal(revised.w.RatioWordProblemProgress.summary(revised.read()).completed,1,'Revising one task does not increase its completed-task count');
const historyBeforeReset=clone(revised.read().records);
assert(revised.$('.wp-stage-top [data-wp-restart]'),'The persistent reset remains visible after completion');
revised.click('.wp-completion [data-wp-restart]');
assert.equal(revised.currentStep(),6,'Requesting reset does not immediately clear submitted work');
assert.equal(revised.$('[data-wp-reset-confirm]').hidden,false);
revised.click('[data-wp-confirm-reset]');
assert.equal(revised.currentStep(),0);
assert.deepEqual(clone(revised.read().records),historyBeforeReset,'Reset keeps exact historical input, labels and evidence');
assert.deepEqual(clone(revised.read().drafts[revisedProblem.id].values),{});
assert.equal(revised.read().drafts[revisedProblem.id].finished,false);
assert.notEqual(revised.read().drafts[revisedProblem.id].scratchId,originalRecord.scratchId,'A new independent analysis starts a new personal scratchpad');
assert.equal(revised.read().records.length,2,'Starting over keeps both completed records');
revised.close();

// Reset is explicit, cancellable, route-preserving and persistent during an unfinished analysis.
const resetting=fixture();
resetting.app.start('L7-P1',true);resetting.click('[data-wp-example]');
resetting.app.start('L7-P2',true);
const unrelatedDraft=clone(resetting.read().drafts['L7-P1']);
resetting.confirmFacts();resetting.selectRoute('cost');
resetting.click('[data-wp-example]');
const beforeReset=clone(resetting.read().drafts['L7-P2']);
assert.equal(beforeReset.routeId,'cost');assert.equal(beforeReset.example,true);
const resetButton=resetting.click('.wp-stage-top [data-wp-restart]');
assert.equal(resetting.$('[data-wp-reset-confirm]').hidden,false);
assert.equal(resetting.w.document.activeElement,resetting.$('[data-wp-cancel-reset]'),'Confirmation initially focuses the safe cancel action');
resetting.click('[data-wp-cancel-reset]');
assert.equal(resetting.$('[data-wp-reset-confirm]').hidden,true);
assert.equal(resetting.w.document.activeElement,resetButton,'Cancel restores focus to the triggering control');
assert.equal(resetting.currentStep(),1);assert.deepEqual(clone(resetting.read().drafts['L7-P2']),beforeReset,'Cancel keeps exact draft and help evidence');
resetting.click('.wp-stage-top [data-wp-restart]');
resetting.$('[data-wp-reset-confirm]').dispatchEvent(new resetting.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
assert.equal(resetting.$('[data-wp-reset-confirm]').hidden,true,'Escape also cancels reset');
resetting.click('.wp-stage-top [data-wp-restart]');resetting.click('[data-wp-confirm-reset]');
const afterReset=clone(resetting.read().drafts['L7-P2']);
assert.equal(resetting.currentStep(),0);assert.equal(afterReset.routeId,'cost','Reset retains the current meaning of the unknown');
assert.notEqual(afterReset.runId,beforeReset.runId);assert.notEqual(afterReset.scratchId,beforeReset.scratchId);
for(const key of ['values','passed','attempts','firstPass','hints','derived','derivationSources'])assert.deepEqual(afterReset[key],{},'Reset clears '+key);
for(const key of ['seen','closure','conditionFound','conditionUsed'])assert.deepEqual(afterReset[key],[],'Reset clears '+key);
for(const key of ['finished','answersChecked','assisted','example'])assert.equal(afterReset[key],false,'Reset clears '+key);
assert(resetting.$('[data-wp-next]').disabled);
assert([...resetting.host.querySelectorAll('[data-wp-step]')].filter(b=>b.dataset.wpStep!=='0').every(b=>b.disabled),'Reset closes every later step');
assert.deepEqual(clone(resetting.read().drafts['L7-P1']),unrelatedDraft,'Reset cannot alter another problem');
resetting.remount().start('L7-P2');
assert.equal(resetting.currentStep(),0);assert.equal(resetting.read().drafts['L7-P2'].runId,afterReset.runId);
assert.deepEqual(clone(resetting.read().drafts['L7-P2'].values),{},'Reopening cannot resurrect the discarded input');
resetting.confirmFacts();assert.equal(resetting.$('[data-wp-route="cost"]').getAttribute('aria-pressed'),'true');
resetting.close();

// A reset confirmation opened by one account cannot write after the active identity changes.
const resetIdentity=fixture();resetIdentity.app.start('L7-P2',true);resetIdentity.confirmFacts();
resetIdentity.click('.wp-stage-top [data-wp-restart]');
const resetOwner=resetIdentity.owner,resetOwnerState=clone(resetIdentity.read());
resetIdentity.switchAccount('class-a::45');resetIdentity.click('[data-wp-confirm-reset]');
assert.equal(resetIdentity.redirects.at(-1),'account');
assert(!resetIdentity.accounts.has('class-a::45'));
assert.deepEqual(clone(resetIdentity.accounts.get(resetOwner)),resetOwnerState);
resetIdentity.close();

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
discussionChange.click('[data-wp-step="3"]');assert.equal(discussionChange.currentStep(),2,'A revised table discussion cannot bypass its dependent explanation');
discussionChange.click('[data-wp-catalog]');
const discussionDraft=discussionChange.read().drafts[discussionProblem.id];
assert.equal(discussionDraft.finished,false);for(let step=2;step<7;step++)assert(!discussionDraft.passed[step]);
assert.match(discussionDraft.discussion,/方程的次数/);discussionChange.close();

// Revising the practical verdict keeps the checked numerical answers but reopens verification.
const verdictChange=fixture(),verdictProblem=verdictChange.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
verdictChange.canonicalRoute(verdictProblem,verdictProblem.routes[0]);
verdictChange.checkBox(verdictChange.$('[name="wp-verdict"][value="impossible"]'));
assert(!verdictChange.$('[data-wp-next]'));assert(verdictChange.$('[data-wp-check]'));
assert(!verdictChange.$('.wp-solution'),'A previously passed solution must not remain presented as a checked result after editing');
assert(!verdictChange.$('.wp-completion'));assert.equal(verdictChange.currentStep(),6);
verdictChange.click('[data-wp-check]');assert.match(verdictChange.feedback(),/整数、单位、取值范围/,'A revised incorrect verdict is checked again');
verdictChange.click('[data-wp-catalog]');
const verdictDraft=verdictChange.read().drafts[verdictProblem.id];
assert.equal(verdictDraft.finished,false);assert.equal(verdictDraft.answersChecked,true);assert.equal(verdictDraft.passed[5],true,'Changing the verdict does not discard completed paper calculation');assert(!verdictDraft.passed[6]);
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
restore.canonicalRoute(fruit,fruitRoute);
assert(restore.$('.wp-verification'));
restore.remount().start(fruit.id);
assert.equal(restore.currentStep(),6,'Completed analyses reopen their final verification step');
assert(restore.$('.wp-verification'),'A restored checked answer keeps verification available');
restore.click('[data-wp-step="5"]');restore.completeScratch('Reviewing a completed scratchpad');
assert(restore.$('.wp-completion'),'Returning from a completed scratchpad shows the saved result');
assert.equal(restore.read().records.length,1,'Reviewing a saved scratchpad cannot create another completion');
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

// The app supplies the signed-in owner as part of a real scratchpad key, even when two profiles contain the same draft ID.
const scratchIdentity=fixture(),scratchKeys=[];
const realScratchMount=scratchIdentity.w.RatioWordProblemScratchpad.mount;
scratchIdentity.w.RatioWordProblemScratchpad.mount=(host,options)=>{scratchKeys.push(options.key);return realScratchMount(host,options);};
scratchIdentity.app.start('L7-P1',true);
for(const step of [0,1,2,3]){scratchIdentity.click('[data-wp-example]');scratchIdentity.checkAndNext(step,'Scratch account setup '+step);}
const scratchOldOwner=scratchIdentity.owner,scratchOldState=clone(scratchIdentity.read()),scratchOldKey=scratchKeys.at(-1);
scratchIdentity.switchAccount('class-b::46');scratchIdentity.accounts.set(scratchIdentity.owner,clone(scratchOldState));
scratchIdentity.remount().start('L7-P1');
assert.equal(scratchIdentity.currentStep(),5);
assert.notEqual(scratchKeys.at(-1),scratchOldKey,'A matching run ID in another account cannot open the old account\'s personal scratchpad');
assert.deepEqual(clone(scratchIdentity.accounts.get(scratchOldOwner)),scratchOldState,'Changing scratchpad owners leaves the previous account unchanged');
scratchIdentity.close();

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
assert.equal(catalogs.host.querySelectorAll('[data-wp-problem]').length,81,'Textbook starts with all source positions in printed order');
catalogs.click('[data-wp-location="I00"]');
assert.match(catalogs.$('.wp-citation').textContent,/105页.*章引入/);
assert.equal(catalogs.read().drafts['G10-01'].sourceLocation,'I00');
catalogs.click('.wp-stage-top [data-wp-restart]');catalogs.click('[data-wp-confirm-reset]');
assert.equal(catalogs.read().drafts['G10-01'].sourceLocation,'I00','Reset retains this repeated question\'s printed source position');
assert.match(catalogs.$('.wp-citation').textContent,/105页.*章引入/);
catalogs.click('[data-wp-catalog]');catalogs.click('[data-wp-book="guide"]');
assert.equal(catalogs.host.querySelectorAll('[data-wp-problem]').length,71,'Supplement merges 27 existing and 44 PEP representative tasks');
assert(!catalogs.host.textContent.includes('教学设计与指导'),'The learner catalog uses the requested supplement name');
const textbookIds=new Set(catalogs.w.RatioWordProblemTextbookIndex.items.map(x=>x.problemId));
for(const button of catalogs.host.querySelectorAll('[data-wp-problem]'))assert(!textbookIds.has(button.dataset.wpProblem),'No duplicate textbook exercise in supplements');
catalogs.click('[data-wp-problem="L7-P2"]');
assert.match(catalogs.$('.wp-citation').textContent,/补充练习/,'Supplement entry has the learner-facing source label');
assert(!catalogs.host.textContent.includes('教学设计与指导'));
const draftField=catalogs.$('[data-wp-fact]');catalogs.textInput('[data-wp-fact="'+draftField.dataset.wpFact+'"]','12');
catalogs.click('[data-wp-back]');assert.equal(catalogs.host.querySelectorAll('[data-wp-problem]').length,71,'Back retains the current source catalog');
catalogs.click('[data-wp-problem="L7-P2"]');assert.equal(catalogs.$('[data-wp-fact="'+draftField.dataset.wpFact+'"]').value,'12','Back saves the current reading draft');
catalogs.click('[data-wp-back]');catalogs.click('[data-wp-back]');assert.equal(catalogs.redirects.at(-1),'home');
catalogs.close();

// Topic navigation persists on return; original source tables and known parameters remain visible.
const topics=fixture();topics.app.open();
assert.equal(topics.host.querySelectorAll('[data-wp-category]').length,7);
assert.equal(topics.$('[data-wp-book="textbook"]').getAttribute('aria-pressed'),'true');
assert(topics.$('[aria-label="选择教材内容"]'));
assert.match(topics.host.textContent,/能用加法不用减法，能用乘法不用除法/);
assert.equal(topics.host.querySelectorAll('.wp-example-chains>span').length,3);
assert.match(topics.$('.wp-example-chains').textContent,/八折/);
assert(!topics.host.querySelector('[aria-label="选择课时"]'));
topics.click('[data-wp-book="guide"]');topics.click('[data-wp-filter="fees"]');
assert.equal(topics.host.querySelectorAll('[data-wp-category]').length,1);
topics.click('[data-wp-problem="PEP-P054"]');topics.click('[data-wp-back]');
assert.equal(topics.$('[data-wp-book="guide"]').getAttribute('aria-pressed'),'true');
assert.equal(topics.$('[data-wp-filter="fees"]').getAttribute('aria-pressed'),'true');
topics.click('[data-wp-filter="data"]');topics.click('[data-wp-problem="PEP-P049"]');
assert.equal(topics.host.querySelectorAll('.wp-source-table tbody tr').length,8,'All original basketball rows render');
assert.match(topics.$('.wp-source-table').textContent,/前进|钢铁/);
topics.app.start('PEP-P068',true);topics.confirmFacts();
assert.match(topics.$('.wp-variable-definition').textContent,/已知参数/);
assert.match(topics.$('.wp-context-title').textContent,/实验与参数建模/);
topics.app.start('S10',true);
assert.match(topics.$('.wp-source-locations').textContent,/合并题目与出处/);
assert.match(topics.host.textContent,/人教版，110页/);
topics.close();

// Conditions are pinned only after discovery, can be marked/unmarked, and survive returning to the problem.
const pinned=fixture();pinned.app.start('L8-P1',true);
const pinnedProblem=pinned.w.RatioWordProblemsData.find(p=>p.id==='L8-P1');
const firstFact=pinned.w.RatioWordProblemReading.build(pinnedProblem).facts.find(f=>f.fields.length);
assert.equal(pinned.host.querySelectorAll('[data-wp-condition]').length,0);
for(const f of firstFact.fields)pinned.textInput('[data-wp-fact="'+f.key+'"]',f.answer);
const conditionSelector='[data-wp-condition="'+firstFact.id+'"]';
assert(pinned.$(conditionSelector),'A correctly found fact appears on the left immediately');
pinned.click(conditionSelector);assert(pinned.$(conditionSelector).classList.contains('is-used'));
pinned.click(conditionSelector);assert(!pinned.$(conditionSelector).classList.contains('is-used'));
pinned.click(conditionSelector);pinned.click('[data-wp-back]');pinned.app.start('L8-P1');
assert(pinned.$(conditionSelector).classList.contains('is-used'),'Manual condition marks survive saved drafts');
assert.equal(pinned.host.querySelectorAll('.wp-steps [data-wp-step]').length,6,'Combined modeling uses six pages');
assert(!pinned.$('[data-wp-step="4"]'),'There is no redundant standalone equation page');
pinned.close();

// Reading is now a cloze task, and relations must be assembled before the table gate opens.
const interactive=fixture(),interactiveProblem=interactive.w.RatioWordProblemsData.find(p=>p.id==='L7-P1'),interactiveRoute=interactiveProblem.routes[0];
interactive.app.start(interactiveProblem.id,true);
assert.equal(interactive.$('.wp-stem').textContent,interactiveProblem.originalStem,'The source wording remains separate from modeling instructions');
const blanks=[...interactive.host.querySelectorAll('[data-wp-fact]')];assert(blanks.length>0);assert(blanks.every(x=>x.value===''));
assert.equal(interactive.host.querySelectorAll('[data-wp-condition]').length,0,'The pinned list starts empty until facts have been found');
interactive.click('[data-wp-check]');assert(interactive.$('[data-wp-next]').disabled);assert(interactive.$('[aria-invalid="true"]'));
for(const [key,value]of Object.entries(interactive.w.RatioWordProblemReading.canonical(interactiveProblem)))interactive.textInput('[data-wp-fact="'+key+'"]',value);
interactive.host.querySelectorAll('[data-wp-seen]').forEach(interactive.checkBox);
const wrongFactKey=blanks[0].dataset.wpFact;
interactive.textInput('[data-wp-fact="'+wrongFactKey+'"]','99999');
assert([...interactive.host.querySelectorAll('[data-wp-fact]')].every(x=>x.value!==''),'Wrong-value fixture has no empty numeric fields');
interactive.click('[data-wp-check]');
assert(interactive.$('[data-wp-next]').disabled,'A filled but incorrect quantity must block the reading step');
assert.equal(interactive.$('[data-wp-fact="'+wrongFactKey+'"]').getAttribute('aria-invalid'),'true','The incorrect numerical field is identified');
interactive.confirmFacts();interactive.fillDerivations(interactiveRoute);interactive.checkAndNext(1,'Quantity cloze confirmed');
interactiveRoute.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{if(cell.expr&&!cell.given)interactive.setInput('t:'+ri+':'+ci,cell.expr);}));
assert.equal(interactive.host.querySelectorAll('[data-wp-rel-slot]').length,0);
assert(!interactive.$('.wp-relation-reference').open);
interactive.click('.wp-relation-reference summary');assert(interactive.$('.wp-relation-reference').open,'Relationship references open when requested');
interactive.click('[data-wp-check]');interactive.expectPassed(2,'Table passes without assembling any relationships');
interactive.click('[data-wp-next]');
interactive.click('[data-wp-example]');interactive.checkAndNext(3,'Read-only relationship reference');
interactive.click('[data-wp-step="2"]');
interactive.click('.wp-relation-reference summary');assert(!interactive.$('[data-wp-next]').disabled,'Opening a reference does not invalidate checked work');
const changedTable=interactive.$('[data-wp-input]');interactive.setInput(changedTable.dataset.wpInput,'9999');
assert(interactive.$('[data-wp-next]').disabled,'Editing the table reopens dependent gates');
assert(interactive.$('[data-wp-step="3"]').disabled,'The equation page depends on the table');
interactive.close();

// Removing obvious relationship cards leaves the mathematical table checks in place.
const football=fixture(),footballProblem=football.w.RatioWordProblemsData.find(p=>p.id==='TB-I17'),footballRoute=footballProblem.routes[0];
football.app.start(footballProblem.id,true);football.confirmFacts();football.fillDerivations(footballRoute);football.checkAndNext(1,'Football setup');
assert(!football.$('[data-wp-relation-mount]')&&!football.$('.wp-relation-builder'));
footballRoute.table.rows.forEach((row,ri)=>row.cells.forEach((cell,ci)=>{if(cell.expr&&!cell.given)football.setInput('t:'+ri+':'+ci,cell.expr);}));
const footballCell=football.$('[data-wp-input]'),footballKey=footballCell.dataset.wpInput,footballCorrect=footballCell.value;
football.setInput(footballKey,'9999');football.click('[data-wp-check]');assert(football.$('[data-wp-next]').disabled,'Wrong table values remain blocked');
football.setInput(footballKey,footballCorrect);football.checkAndNext(2,'Football direct table');
assert(!football.$('[data-wp-relation-mount]')&&!football.$('.wp-relation-builder'),'Football equation page has no relationship cards');
football.close();

// The inverse story task first decomposes the equation, then requires real table entries.
const story=fixture(),storyProblem=story.w.RatioWordProblemsData.find(p=>p.id==='S01'),storyRoute=storyProblem.routes[0];
story.app.start('S01',true);
assert.deepEqual([...story.host.querySelectorAll('.wp-steps button')].slice(0,2).map(b=>b.textContent),['1拆表','2填写数量表']);
assert(story.$('.wp-equation-parts'));story.click('[data-wp-example]');story.checkAndNext(0,'Inverse story decomposition');
assert.equal(story.currentStep(),2);assert(!story.$('[data-wp-discussion]'));assert(!story.$('.wp-stage').textContent.includes('这张表表达了哪些关系'));
assert.equal(story.host.querySelectorAll('[data-wp-input]').length,3,'The story quantity table is writable');
story.click('[data-wp-check]');assert(story.$('[data-wp-next]').disabled,'The table cannot pass with empty entries');
story.click('[data-wp-example]');story.checkAndNext(2,'Inverse story quantity table');
assert.match(story.$('.wp-stage h3').textContent,/编写应用题/);assert(story.$('[data-wp-discussion]'));story.close();

// Historical records survive the new interaction version; drafts cannot skip the new activities.
const migrated=fixture(),migrationProblem=migrated.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
const historical=migrated.canonicalRoute(migrationProblem,migrationProblem.routes[0]);
const legacyInteractionState=clone(migrated.read()),oldDraft=legacyInteractionState.drafts[migrationProblem.id];delete oldDraft.interactionVersion;
oldDraft.values=Object.fromEntries(Object.entries(oldDraft.values).filter(([key])=>!key.startsWith('f:')&&!key.startsWith('r:')));
oldDraft.hints={6:2};oldDraft.attempts={6:3};oldDraft.assisted=true;
migrated.app.destroy();migrated.accounts.set(migrated.owner,legacyInteractionState);migrated.remount().start(migrationProblem.id);
assert.equal(migrated.currentStep(),0);assert(migrated.$('[data-wp-next]').disabled);
assert.equal(migrated.read().records.length,1);assert.equal(migrated.read().records[0].runId,historical.runId);
assert.notEqual(migrated.read().drafts[migrationProblem.id].runId,historical.runId);
assert.deepEqual(clone(migrated.read().drafts[migrationProblem.id].values),oldDraft.values,'Migration preserves prior table, equation, answer and check values for reference');
assert.deepEqual(clone(migrated.read().drafts[migrationProblem.id].hints),{},'Legacy reflection hints cannot count against the new solving step');
assert.deepEqual(clone(migrated.read().drafts[migrationProblem.id].attempts),{},'Legacy reflection attempts cannot count against the new solving step');
assert.equal(migrated.read().drafts[migrationProblem.id].assisted,true,'The old use of assistance remains disclosed');
migrated.close();

// Version-2 work keeps its established modeling gates and values while adopting the new scratch/verification order.
const migrationV2=fixture(),migrationV2Problem=migrationV2.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
const migrationV2Record=migrationV2.canonicalRoute(migrationV2Problem,migrationV2Problem.routes[0]);
const migrationV2Base=clone(migrationV2.read());
for(const scenario of [{step:2,finished:false},{step:5,finished:false},{step:6,finished:false},{step:6,finished:true}]){
 const legacyState=clone(migrationV2Base),legacyDraft=legacyState.drafts[migrationV2Problem.id];
 legacyDraft.interactionVersion=2;delete legacyDraft.scratchId;legacyDraft.step=scenario.step;legacyDraft.finished=scenario.finished;
 legacyDraft.passed=Object.fromEntries(Array.from({length:scenario.finished?7:scenario.step},(_,i)=>[i,true]));
 legacyDraft.firstPass=clone(legacyDraft.passed);legacyDraft.reflection='以前版本中保存的变式说明，仍作为历史文字保留。';
 legacyDraft.answersChecked=scenario.step===6;
 legacyState.records[0].interactionVersion=2;
 migrationV2.app.destroy();migrationV2.accounts.set(migrationV2.owner,legacyState);migrationV2.remount().start(migrationV2Problem.id);
 const resumed=migrationV2.read().drafts[migrationV2Problem.id];
 assert.equal(migrationV2.currentStep(),scenario.finished?6:scenario.step===4?3:Math.min(scenario.step,5),'Version-2 work resumes at the corresponding new stage');
 assert.equal(resumed.interactionVersion,4);assert.equal(resumed.runId,legacyDraft.runId);
 assert.equal(resumed.scratchId,legacyDraft.runId,'Existing analyses receive a stable local scratchpad identity');
 assert.deepEqual(clone(resumed.values),legacyDraft.values,'Version-2 values remain available for review and correction');
 for(let step=0;step<3;step++)assert.equal(resumed.passed[step],legacyDraft.passed[step],'Keep quantity gate '+step);
 assert.equal(resumed.passed[3]===true,legacyDraft.passed[3]===true&&legacyDraft.passed[4]===true,'The merged page requires both former modeling gates');
 if(!resumed.answersChecked)assert.equal(resumed.firstPass[5],undefined,'Unchecked answers do not inherit a handwriting pass');
 assert.equal(resumed.reflection,legacyDraft.reflection,'Historical reflection is retained without requiring it in the new UI');
 assert(!migrationV2.$('[data-wp-reflection]'));
 assert.equal(migrationV2.read().records.length,1);assert.equal(migrationV2.read().records[0].runId,migrationV2Record.runId);
 if(scenario.finished){assert(migrationV2.$('.wp-completion'));assert.equal(resumed.passed[5],true);assert.equal(resumed.passed[6],true);}
 else if(scenario.step>=5){if(!resumed.answersChecked)assert(!resumed.passed[5]);assert(!resumed.passed[6]);assert(!migrationV2.$('.wp-solution'));migrationV2.completeScratch('Migrated version-2 calculation');}
 const current=clone(migrationV2.read().drafts[migrationV2Problem.id]);
 migrationV2.remount().start(migrationV2Problem.id);
 assert.equal(migrationV2.currentStep(),current.step,'A version-3 draft resumes without another migration');
 assert.equal(migrationV2.read().drafts[migrationV2Problem.id].scratchId,current.scratchId);
}
migrationV2.close();

// Taking quantities uses the learner's checked expression, adds grouping, and never chooses the operation.
const taking=fixture();taking.app.start('L7-P1',true);
for(let step=0;step<2;step++){taking.click('[data-wp-example]');taking.checkAndNext(step,'Table builder setup '+step);}
taking.click('[data-wp-example]');taking.setInput('t:1:2','6*0.15*x');taking.checkAndNext(2,'Student equivalent quantity');
assert.equal(taking.$('[data-wp-input="e:0"]').value,'','The module must not preassemble the equation');
taking.click('[data-wp-take="0:2"]');taking.click('[data-wp-key="+"]');taking.click('[data-wp-take="1:2"]');taking.click('[data-wp-key="="]');taking.click('[data-wp-take="2:2"]');
assert.match(taking.$('[data-wp-input="e:0"]').value,/6\*0\.15\*x/,'Take the learner expression instead of replacing it with a reference');
const pupilEquation=taking.$('[data-wp-input="e:0"]').value;
taking.click('[data-wp-check]');taking.expectPassed(3,'Equation assembled from selected quantities');taking.click('[data-wp-next]');
assert.equal(taking.$('[data-wp-scratch-equation="0"] .wp-math-line')?.textContent,taking.w.RatioWordProblemEngine.format(pupilEquation),'The scratchpad previews the pupil\'s actual checked equation');
assert(!taking.$('.wp-stage').textContent.includes(taking.w.RatioWordProblemsData.find(p=>p.id==='L7-P1').routes[0].conclusion),'Opening the scratchpad does not reveal the final answer');
taking.click('[data-wp-prev]');assert.equal(taking.currentStep(),3);
assert.equal(taking.$('[data-wp-input="e:0"]').value,pupilEquation,'Returning from scratch keeps the student equation intact');
taking.click('[data-wp-next]');taking.completeScratch('Student-equation scratchpad');taking.close();

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
for(const step of [1,2,3]){coincidence.click('[data-wp-example]');coincidence.checkAndNext(step,'Both-case setup '+step);}
coincidence.completeScratch('Both-case calculation');
coincidence.click('[data-wp-example]');
coincidence.checkBox(coincidence.$('[data-wp-case="1"][value="valid"]'));
coincidence.click('[data-wp-check]');assert(!coincidence.$('.wp-completion'),'Correct first case cannot substitute for the second case');assert.equal(coincidence.read().records.length,0);
coincidence.checkBox(coincidence.$('[data-wp-case="1"][value="impossible"]'));
coincidence.click('[data-wp-check]');assert(coincidence.$('.wp-completion'),'Both required cases are verified and saved together');assert.equal(coincidence.currentStep(),6);coincidence.close();

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

// Refinements: actual equation gate, clear feedback, variable-aware answer prefixes and scoped content revisions.
const refinements=fixture();refinements.app.start('G9-06',true);
for(const step of [0,1,2]){refinements.click('[data-wp-example]');refinements.checkAndNext(step,'Trapezoid setup '+step);}
assert(!refinements.$('[data-wp-closure]'));
assert.match(refinements.$('.wp-equation-block').textContent,/可以点击表格中的“取用此量”/);
for(const equation of ['(12+x)*8*(1/2)=120','(12+x)*8*1/2=120','(1/2)*8*(12+x)=120','120=(12+x)*8*(1/2)','(12+x)*8/2=120',String.raw`(12+x)\times8\times\frac{1}{2}=120`]){
 refinements.setInput('e:0',equation);refinements.click('[data-wp-check]');refinements.expectPassed(3,'Trapezoid accepts '+equation);
 assert.equal(refinements.$('.wp-feedback-title').textContent,'检查正确');
 assert.equal(refinements.$('.wp-feedback').getAttribute('role'),'status');
}
refinements.setInput('e:0','(12+x)*8*2=120');refinements.click('[data-wp-check]');
assert(refinements.$('[data-wp-next]').disabled);assert.equal(refinements.$('.wp-feedback-title').textContent,'还不正确');
assert.equal(refinements.$('.wp-feedback').getAttribute('role'),'alert');assert.equal(refinements.$('.wp-feedback').getAttribute('aria-live'),'assertive');
refinements.setInput('e:0','(12+x)*8*1/2=120');refinements.checkAndNext(3,'Corrected fraction equation');
assert.equal(refinements.$('[data-wp-editor="a:0"]').closest('.wp-answer-field').querySelector('.wp-answer-prefix').textContent.replace(/\s/g,''),'x=');
assert.equal(refinements.$('[data-wp-input="a:0"]').value,'','The prefix is outside the editable answer');
refinements.close();

for(const [id,prefixes]of [['G9-08',['','x=','']],['L8-H1',['x=','y=','']],['PEP-P037',['','x=','']],['PEP-P051',['x=','y=']],['PEP-P063',['x=']]]){
 const f=fixture();f.app.start(id,true);
 for(const step of [0,1,2,3]){f.click('[data-wp-example]');f.checkAndNext(step,'Answer prefix '+id+' '+step);}
 const fields=[...f.host.querySelectorAll('.wp-answer-confirm .wp-answer-field')];
 assert.deepEqual(fields.map(el=>(el.querySelector('.wp-answer-prefix')?.textContent||'').replace(/\s/g,'')),prefixes,id+' maps the variable to the actual unknown');
 if(id==='PEP-P063'){assert(!fields[0].querySelector('small'),'The number before the percentage sign is x=25, not x=25%');}
 if(id==='PEP-P051')assert.equal(f.$('.wp-feedback-title')?.textContent,undefined,'A newly entered page has no stale success indicator');
 f.close();
}
for(const id of ['G9-06','G9-08','TB-R01','TB-I03','TB-I04','TB-I05']){
 const f=fixture(),problem=f.w.RatioWordProblemsData.find(p=>p.id===id),r=problem.routes[0];
 f.app.start(id,true);const old=clone(f.read().drafts[id]);f.app.destroy();
 Object.assign(old,{contentRevision:0,runId:'wp-legacy-'+id,scratchId:'wp-legacy-ink-'+id,step:6,finished:true,answersChecked:true,passed:Object.fromEntries([0,1,2,3,4,5,6].map(i=>[i,true])),values:{'f:formula:0':'2','a:1':'105','t:2:5':'old-calendar-expression'},updatedAt:new Date().toISOString()});
 const history={...old,title:id==='G9-08'?'三个连续奇数的积':'旧版本题目',status:'independent',at:old.updatedAt,valueLabels:{'a:1':'旧版三个奇数的积'}};
 f.accounts.set(f.owner,{version:1,records:[history],drafts:{[id]:old}});
 f.remount().start(id);
 const current=f.read().drafts[id];assert.equal(current.contentRevision,f.w.RatioWordProblemsData.find(p=>p.id===id).contentRevision);assert.equal(f.currentStep(),r.relationshipOnly?2:0);assert.equal(current.finished,false);
 assert.notEqual(current.runId,old.runId);assert.notEqual(current.scratchId,old.scratchId);assert.deepEqual(clone(current.values),{});assert.deepEqual(clone(current.passed),r.relationshipOnly?{0:true,1:true}:{});
 assert.equal(f.read().records[0].values['a:1'],'105');assert.equal(f.read().records[0].valueLabels['a:1'],'旧版三个奇数的积');
 assert.match(f.feedback(),/以前已提交的记录完整保留/);
 f.app.open();const card=f.$('[data-wp-problem="'+id+'"]');assert(card);assert(!card.textContent.includes('已完成 ✓'),'Old content does not mark the revised task complete');
 f.close();
}
// Balance activities use one total-mass column and one starting equation; transformations belong on paper.
for(const id of ['TB-I03','TB-I04']){
 const f=fixture(),problem=f.w.RatioWordProblemsData.find(p=>p.id===id),r=problem.routes[0];
 f.app.start(id,true);
 for(const step of [0,1]){f.click('[data-wp-example]');f.checkAndNext(step,'Simplified balance setup '+id+' '+step);}
 const table=f.$('.wp-quantity-table');
 assert.equal(table.querySelectorAll('thead th').length,3);
 assert.equal(table.querySelectorAll('tbody tr').length,2);
 const writable=table.querySelectorAll('[data-wp-input]');
 assert.equal(writable.length,id==='TB-I03'?1:2,'Only unknown total masses need filling');
 assert([...writable].every(input=>input.dataset.wpInput.endsWith(':1')));
 f.click('[data-wp-example]');f.checkAndNext(2,'Balance totals '+id);
 assert.equal(f.host.querySelectorAll('.wp-equation-entry').length,1,'Intermediate transformations are not repeated modeling gates');
 // Alternate total-mass representations must remain accepted after the column indices change.
 f.click('[data-wp-prev]');
 for(const option of f.w.RatioWordProblemTableAlternatives.entries().filter(a=>a.problemId===id))f.setInput('t:'+option.rowIndex+':'+option.cellIndex,option.expr);
 f.checkAndNext(2,'Balance alternate totals '+id);
 f.click('[data-wp-example]');f.checkAndNext(3,'Balance initial equation '+id);
 assert.equal(f.host.querySelectorAll('[data-wp-scratch-equation]').length,1);
 assert.equal(f.$('[data-wp-scratch-prompt]').textContent,r.scratchPrompt);
 assert(!f.$('.wp-stage').textContent.includes(r.conclusion),'The operation prompt does not reveal the solution');
 f.completeScratch('Simplified balance '+id,r);f.fillVerification(r);f.click('[data-wp-check]');
 assert(f.$('.wp-completion'));f.close();
}

const calendarSimple=fixture();calendarSimple.app.start('TB-R01',true);
assert.equal(calendarSimple.currentStep(),2);assert.equal(calendarSimple.host.querySelectorAll('[data-wp-input]').length,2);
assert(!calendarSimple.$('[data-wp-discussion]')&&!calendarSimple.$('.wp-relation-reference'));
assert(!calendarSimple.$('.wp-stage').textContent.includes('开放问题'));
calendarSimple.setInput('t:0:0','4');calendarSimple.setInput('t:1:0','5');calendarSimple.click('[data-wp-check]');assert(calendarSimple.$('[data-wp-next]').disabled);
calendarSimple.setInput('t:0:0','3');calendarSimple.checkAndNext(2,'Basic center-number multipliers');
assert.equal(calendarSimple.$('[data-wp-check]').textContent,'确认并保存');assert(!calendarSimple.$('textarea'));
calendarSimple.click('[data-wp-check]');assert(calendarSimple.$('.wp-completion'));assert.equal(calendarSimple.read().records[0].status,'independent');
calendarSimple.close();

{
// Independent table/equation snapshots survive another method, reload, reset and account changes.
const variants=fixture(),jacketProblem=variants.w.RatioWordProblemsData.find(p=>p.id==='L8-P1'),jacketRoute=jacketProblem.routes[0];
variants.canonicalRoute(jacketProblem,jacketRoute);
const firstMethod=clone(variants.read().records[0].modelMethods[0]),firstGroup=variants.read().drafts[jacketProblem.id].modelGroupId;
assert(firstMethod.confirmed);assert(variants.$('[data-wp-new-model="'+jacketRoute.id+'"]'));
variants.click('.wp-more-models summary');variants.click('[data-wp-new-model="'+jacketRoute.id+'"]');
assert.equal(variants.currentStep(),2);assert.equal(variants.read().drafts[jacketProblem.id].modelMethods.length,1);
assert.equal(variants.read().drafts[jacketProblem.id].modelGroupId,firstGroup);
variants.remount().start(jacketProblem.id);assert.equal(variants.currentStep(),2);
assert.deepEqual(clone(variants.read().drafts[jacketProblem.id].modelMethods[0]),firstMethod,'Reload preserves the first method exactly');
jacketRoute.table.rows.forEach((row,i)=>row.cells.forEach((cell,j)=>{if(cell.expr&&!cell.given)variants.setInput('t:'+i+':'+j,cell.expr);}));
variants.setInput('t:0:2','x+97');variants.click('[data-wp-check]');assert(variants.$('[data-wp-next]').disabled,'Every new table is still mathematically checked');
variants.setInput('t:0:2','x+96');variants.checkAndNext(2,'Second table uses profit instead of discount');
jacketRoute.equations.forEach((q,i)=>variants.setInput('e:'+i,q.right+'='+q.left));variants.checkAndNext(3,'Second modeling equation');
variants.completeScratch('Second method answer',jacketRoute);variants.fillVerification(jacketRoute);variants.click('[data-wp-check]');
assert.equal(variants.host.querySelectorAll('.wp-model-comparison .wp-method-card').length,2);
const twoMethods=clone(variants.read().records[0].modelMethods);assert.equal(twoMethods.length,2);assert.deepEqual(twoMethods[0],firstMethod);
assert.equal(twoMethods[1].table.rows[0].cells[2].expr,'x+96');assert.notEqual(twoMethods[0].equations[0].expression,twoMethods[1].equations[0].expression);
assert.equal(variants.read().records.length,2,'The earlier completed record remains available');
variants.remount().start(jacketProblem.id);assert.equal(variants.host.querySelectorAll('.wp-model-comparison .wp-method-card').length,2,'Saved comparisons reopen with both methods');
variants.click('.wp-stage-top [data-wp-restart]');variants.click('[data-wp-confirm-reset]');
assert.deepEqual(clone(variants.read().drafts[jacketProblem.id].modelMethods),[]);assert.notEqual(variants.read().drafts[jacketProblem.id].modelGroupId,firstGroup);
assert.deepEqual(clone(variants.read().records[0].modelMethods),twoMethods,'Reset does not edit historical comparisons');
variants.switchAccount('other-class::2');variants.remount().open();assert.deepEqual(clone(variants.read().drafts),{});assert.deepEqual(clone(variants.read().records),[]);variants.close();

// Choosing a different unknown keeps the first model and requires the new route's derivations/table.
const unknowns=fixture(),fruit=unknowns.w.RatioWordProblemsData.find(p=>p.id==='L7-P2'),massRoute=fruit.routes.find(r=>r.id==='mass'),costRoute=fruit.routes.find(r=>r.id==='cost');
unknowns.app.start(fruit.id,true);
for(const step of [0,1,2]){unknowns.click('[data-wp-example]');unknowns.checkAndNext(step,'First unknown setup '+step);}
unknowns.click('[data-wp-example]');unknowns.click('[data-wp-check]');unknowns.expectPassed(3,'First unknown model');
unknowns.click('.wp-more-models summary');unknowns.click('[data-wp-new-model="cost"]');assert.equal(unknowns.currentStep(),1);
assert.equal(unknowns.read().drafts[fruit.id].modelMethods.length,1);assert.equal(unknowns.read().drafts[fruit.id].modelMethods[0].meaning,massRoute.meaning);
unknowns.fillDerivations(costRoute);unknowns.checkAndNext(1,'New unknown derivations');
costRoute.table.rows.forEach((row,i)=>row.cells.forEach((cell,j)=>{if(cell.expr&&!cell.given)unknowns.setInput('t:'+i+':'+j,cell.expr);}));unknowns.checkAndNext(2,'New unknown table');
costRoute.equations.forEach((q,i)=>unknowns.setInput('e:'+i,q.left+'='+q.right));unknowns.checkAndNext(3,'New unknown equation');
unknowns.completeScratch('New unknown answer',costRoute);unknowns.fillVerification(costRoute);unknowns.click('[data-wp-check]');
assert.equal(unknowns.host.querySelectorAll('.wp-model-comparison .wp-method-card').length,2);assert.equal(unknowns.read().records[0].modelMethods[1].meaning,costRoute.meaning);unknowns.close();
console.log('PASS optional modeling methods: independent equations/tables, alternative unknowns, source checks, reload, account isolation and reset-safe history');
}

(async()=>{
 // A personal stroke stays active across the profile-save debounce and the scratchpad's own persistence timer.
 const ink=fixture(),paintedPoints=[];let releasedPointers=0;
 const context=ink.w.HTMLCanvasElement.prototype.getContext();
 context.lineTo=(x,y)=>paintedPoints.push([x,y]);
 ink.w.HTMLCanvasElement.prototype.releasePointerCapture=()=>{releasedPointers++;};
 ink.w.HTMLElement.prototype.getBoundingClientRect=()=>({left:0,top:0,right:450,bottom:600,width:450,height:600,x:0,y:0});
 ink.app.start('L7-P1',true);
 for(const step of [0,1,2,3]){ink.click('[data-wp-example]');ink.checkAndNext(step,'Continuous handwriting setup '+step);}
 const canvas=ink.$('canvas.wp-scratchpad-canvas');assert(canvas);
 const pointer=(type,x,y)=>{const event=new ink.w.Event(type,{bubbles:true,cancelable:true});Object.assign(event,{clientX:x,clientY:y,pointerId:1,pointerType:'pen',button:0,buttons:type==='pointerup'?0:1,isPrimary:true,pressure:0.5});canvas.dispatchEvent(event);};
 pointer('pointerdown',20,30);pointer('pointermove',40,50);
 await new Promise(resolve=>setTimeout(resolve,720));
 assert.equal(releasedPointers,0,'Saving while a pupil writes cannot end the active stroke');
 pointer('pointermove',90,110);pointer('pointerup',90,110);
 assert(paintedPoints.some(([x,y])=>x===180&&y===220),'Points after the save interval remain part of the visible stroke');
 assert.equal(releasedPointers,1,'The pen-up event ends the continuous stroke');
 ink.click('[data-wp-ink="undo"]');assert(ink.$('[data-wp-ink="undo"]').disabled,'The entire long stroke is one undo action');
 // Starting over after ink exists must open a genuinely blank pad under a new identity.
 ink.click('[data-wp-ink="redo"]');assert(!ink.$('[data-wp-ink="undo"]').disabled);
 const previousInkDraft=clone(ink.read().drafts['L7-P1']),previousInkKey=JSON.stringify([ink.owner,previousInkDraft.scratchId,'L7-P1',previousInkDraft.routeId]);
 const resetInkKeys=[],actualMount=ink.w.RatioWordProblemScratchpad.mount;
 ink.w.RatioWordProblemScratchpad.mount=(host,options)=>{resetInkKeys.push(options.key);return actualMount(host,options);};
 ink.click('.wp-stage-top [data-wp-restart]');ink.click('[data-wp-confirm-reset]');
 assert.equal(ink.currentStep(),0);
 assert.deepEqual(clone(ink.read().drafts['L7-P1'].values),{});
 for(const step of [0,1,2,3]){ink.click('[data-wp-example]');ink.checkAndNext(step,'Fresh scratch after reset '+step);}
 assert.notEqual(resetInkKeys.at(-1),previousInkKey,'Reset supplies a new personal scratchpad key');
 assert(ink.$('[data-wp-ink="undo"]').disabled,'The new pad contains none of the previous ink');
 assert(ink.$('[data-wp-ink="redo"]').disabled,'The new pad contains none of the old undo history');
 ink.close();
 // Deferred catalog rendering may not navigate away after the student opens a problem.
 const searching=fixture();searching.app.open();searching.textInput('[data-wp-search]','追');searching.click('[data-wp-location="I00"]');
 await new Promise(resolve=>setTimeout(resolve,320));assert.equal(searching.currentStep(),0);assert.match(searching.$('.wp-citation').textContent,/105页/);searching.close();
 // MathLive loads lazily. Replacing a focused fallback field must preserve the chosen equation target.
 const upgrading=fixture();upgrading.app.start('L8-H1',true);
 for(let step=0;step<3;step++){upgrading.click('[data-wp-example]');upgrading.checkAndNext(step,'Delayed editor setup '+step);}
 upgrading.setInput('e:1','10+').focus();
 class FakeMathfield extends upgrading.w.HTMLElement{constructor(){super();this.value='';}insert(value){this.value+=value;}set inlineShortcuts(value){assert(this.isConnected,'MathLive options require a mounted field');this._shortcuts=value;}get inlineShortcuts(){return this._shortcuts;}}
 upgrading.w.customElements.define('math-field',FakeMathfield);upgrading.w.MathfieldElement=FakeMathfield;
 const loader=upgrading.w.document.querySelector('script[src*="mathlive.min.js"]');assert(loader);loader.onload();
 await Promise.resolve();await Promise.resolve();
 const target=upgrading.host.querySelector('[data-wp-editor="e:1"] math-field');assert(target);
 upgrading.click('[data-wp-take="1:0"]');
 assert.equal(upgrading.host.querySelector('[data-wp-editor="e:0"] math-field').value,'','An upgraded second editor must not fall back to the first equation');
 assert(upgrading.w.RatioWordProblemEngine.equivalent(target.value,'10+y'),'The selected second equation receives its quantity after editor upgrade');
 upgrading.close();
 console.log('PASS continuous handwriting across autosave, textbook navigation, checked-table equation assembly, complete case analysis, exact chess structure and delayed editor focus');
})().catch(error=>{console.error(error);process.exitCode=1;});

console.log('PASS word-problem UI:',JSON.stringify(counts));
console.log('Verified complete authored flows, explicit percent origins, source gating, prerequisite invalidation, ungraded scratchpad transition, pupil-equation preview, direct verification save, answer revisions, v1/v2/v3 draft migration, identity isolation and teacher preview.');

})().catch(error=>{console.error(error);process.exitCode=1;});
