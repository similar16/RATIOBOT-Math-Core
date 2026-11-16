const assert=require('node:assert/strict');
const path=require('node:path');
const P=require(path.resolve(process.env.SITE_DIR||'site','word-problems/progress.js'));
const problem={id:'L7-P1',title:'茶具',source:'教学设计171页',kind:'linear'};
const route={id:'sets',label:'设套数',derivations:[{id:'rate'}],answers:[{expr:'7'}]};
function draft(patch={}){return {runId:'wp-one',problemId:problem.id,routeId:route.id,step:6,values:{'d:rate':'1/12','t:0:0':'0.6x','a:0':'7'},passed:Object.fromEntries(Array.from({length:7},(_,i)=>[i,true])),firstPass:{0:true,1:true,2:true,3:true,4:true,5:true},attempts:{},hints:{},derived:{rate:true},seen:['quantity'],closure:['total'],derivationSources:{rate:['whole','time']},answersChecked:true,verdict:'valid',reflection:'改变杯数，杯子的用泥量随之改变。',startedAt:'2026-11-16T01:00:00Z',updatedAt:'2026-11-16T01:05:00Z',...patch};}

const clean=P.cleanDraft(draft());
assert.equal(clean.answersChecked,true);
assert.equal(clean.values['t:0:0'],'0.6x');
assert.deepEqual(clean.derivationSources.rate,['whole','time']);
assert.equal(clean.passed[5],true);
assert.equal(clean.derived.rate,true);
const malformed=P.cleanDraft(draft({step:3.9,passed:{0:'true',1:'false',2:true,3:1,4:false},firstPass:{0:'true',1:false},derived:{rate:'false'},attempts:{0:Infinity,1:-2,2:2.7},hints:{0:NaN,1:'2'},answersChecked:'true'}));
assert(Number.isInteger(malformed.step)&&malformed.step>=0&&malformed.step<=6);
assert(!malformed.passed[0]);assert(!malformed.passed[1]);assert.equal(malformed.passed[2],true);assert(!malformed.passed[3]);
assert(!malformed.derived.rate);assert.equal(malformed.firstPass[1],false);assert.equal(malformed.answersChecked,false);
assert(Object.values(malformed.attempts).every(Number.isFinite));assert(Object.values(malformed.attempts).every(Number.isInteger));
assert.equal(malformed.attempts[1],0);assert.equal(malformed.hints[1],2);assert.equal(malformed.assisted,true);
assert.equal(P.cleanDraft(null),null);

// The pure progress helper cannot cross student boundaries: only the supplied account object changes.
const accountA={wordProblems:P.normalized(null)},accountB={wordProblems:P.normalized(null)};
const originalA=structuredClone(accountA.wordProblems);
accountA.wordProblems=P.saveDraft(accountA.wordProblems,problem.id,draft());
assert.equal(accountB.wordProblems.drafts[problem.id],undefined);
assert.deepEqual(originalA,P.normalized(null));
assert.equal(accountA.wordProblems.drafts[problem.id].values['a:0'],'7');
assert.equal(accountA.wordProblems.drafts[problem.id].answersChecked,true);
assert.deepEqual(P.saveDraft(accountA.wordProblems,'wrong-id',draft()),accountA.wordProblems);

const completed=P.complete(accountA.wordProblems,draft(),problem,route);
assert.equal(completed.record.status,'independent');assert.equal(completed.record.accuracy,100);assert.equal(completed.record.total,6);
assert.equal(completed.state.records.length,1);assert.equal(completed.state.drafts[problem.id].finished,true);
const again=P.complete(completed.state,draft(),problem,route);assert.equal(again.record,null);assert.equal(again.state.records.length,1);
for(let missing=0;missing<7;missing++){const d=draft();delete d.passed[missing];assert.throws(()=>P.complete(null,d,problem,route),/七个分析步骤/);}
assert.throws(()=>P.complete(null,draft({passed:{0:'true',1:'true',2:'true',3:'true',4:'true',5:'true',6:'true'}}),problem,route),/七个分析步骤/);
assert.throws(()=>P.complete(null,draft({derived:{}}),problem,route),/来源推导/);
assert.throws(()=>P.complete(null,draft({answersChecked:false}),problem,route),/求解结果/);
assert.throws(()=>P.complete(null,draft({runId:'not-a-run'}),problem,route),/不完整/);
assert.throws(()=>P.complete(null,draft({routeId:'different'}),problem,route),/不完整/);
const open=P.complete(null,draft({derived:{},answersChecked:false}),{...problem,kind:'open'},{...route,derivations:[],answers:[],discussion:'说明条件'});
assert.equal(open.record.status,'review');assert.equal(P.summary(open.state).completed,0);assert.equal(P.summary(open.state).review,1);
assert.equal(P.complete(null,draft({assisted:true}),problem,route).record.status,'assisted');
assert.equal(P.complete(null,draft({example:true}),problem,route).record.status,'example');
const labelledRoute={...route,derivations:[{id:'rate',label:'乙每小时完成量'}],table:{headers:['对象','每件耗泥'],rows:[{label:'茶壶'}]},equations:[{label:'总用泥量相等'}],answers:[{expr:'7',label:'茶具套数'}],checks:[{text:'代回耗泥量'}]};
const labelled=P.complete(null,draft({values:{'d:rate':'1/12','t:0:0':'0.6','e:0':'x=7','a:0':'7','c:0':'10.5'}}),problem,labelledRoute);
assert.deepEqual(labelled.record.valueLabels,{'d:rate':'乙每小时完成量（来源推导）','t:0:0':'茶壶 · 每件耗泥','e:0':'总用泥量相等','a:0':'茶具套数','c:0':'代回耗泥量'});
assert.deepEqual(P.normalized(labelled.state).records[0].valueLabels,labelled.record.valueLabels);

// Same-run evidence from another device must never turn assisted work into independent work.
const old=draft({updatedAt:'2026-11-16T01:05:00Z',assisted:true,firstPass:{0:true,1:false},attempts:{1:2},values:{'a:0':'6'}});
const recent=draft({updatedAt:'2026-11-16T01:10:00Z',assisted:false,firstPass:{0:true,1:true},values:{'a:0':'7'}});
let merged=P.merge({drafts:{[problem.id]:old}},{drafts:{[problem.id]:recent}});
assert.equal(merged.drafts[problem.id].values['a:0'],'7');assert.equal(merged.drafts[problem.id].assisted,true);
assert.equal(merged.drafts[problem.id].firstPass[1],false);assert.equal(merged.drafts[problem.id].attempts[1],2);
const changed=draft({updatedAt:'2026-11-16T01:15:00Z',passed:{0:true},derived:{},answersChecked:false});
merged=P.merge(merged,{drafts:{[problem.id]:changed}});
assert(!merged.drafts[problem.id].passed[5]);assert(!merged.drafts[problem.id].derived.rate);assert.equal(merged.drafts[problem.id].answersChecked,false);
assert.equal(merged.drafts[problem.id].assisted,true);
const fresh=draft({runId:'wp-fresh',updatedAt:'2026-11-16T01:20:00Z',assisted:false});
merged=P.merge(merged,{drafts:{[problem.id]:fresh}});assert.equal(merged.drafts[problem.id].assisted,false);
const rOld={...completed.record,at:'2026-11-16T01:05:00Z',assisted:true,status:'assisted',firstPass:{0:true,1:false}};
const rNew={...completed.record,at:'2026-11-16T01:10:00Z',assisted:false,status:'independent',firstPass:{0:true,1:true}};
const records=P.merge({records:[rOld]},{records:[rNew]});assert.equal(records.records.length,1);assert.equal(records.records[0].status,'assisted');assert.equal(records.records[0].firstPass[1],false);
const shown={...rOld,example:true,status:'example'};assert.equal(P.merge(records,{records:[shown]}).records[0].status,'example');
const pending={...rOld,status:'review'};assert.equal(P.merge(records,{records:[pending]}).records[0].status,'review');
assert.deepEqual(P.merge(records,records),records);

// Full per-step drafts survive normalization and the latest 55 are retained.
const many={drafts:{},records:[]};
for(let i=0;i<70;i++){const id='P'+i,t=new Date(Date.UTC(2026,10,16,0,i)).toISOString();many.drafts[id]=draft({problemId:id,runId:'wp-'+i,updatedAt:t});many.records.push({...completed.record,runId:'wp-record-'+i,problemId:id,at:t});}
let bounded=P.normalized(many);assert.equal(Object.keys(bounded.drafts).length,55);assert(bounded.drafts.P69);assert(!bounded.drafts.P0);assert.deepEqual(bounded.drafts.P69.values,draft().values);
const more={records:Array.from({length:100},(_,i)=>({...completed.record,runId:'wp-many-'+i,at:new Date(Date.UTC(2026,10,16,0,i)).toISOString()}))};
assert.equal(P.normalized(more).records.length,80);
assert.equal(P.summary(completed.state).completed,1);assert.equal(P.summary(completed.state).independent,1);
console.log('PASS word-problem progress: isolated account state, full drafts, typed gates, completion prerequisites, deduplication, conservative assistance flags and bounded cloud merges');
