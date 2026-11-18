const assert=require('node:assert/strict');
const path=require('node:path');
const P=require(path.resolve(process.env.SITE_DIR||'site','word-problems/progress.js'));
const problem={id:'L7-P1',title:'茶具',source:'教学设计171页',kind:'linear'};
const route={id:'sets',label:'设套数',derivations:[{id:'rate'}],answers:[{expr:'7'}]};
function draft(patch={}){return {runId:'wp-one',problemId:problem.id,routeId:route.id,step:6,values:{'d:rate':'1/12','t:0:0':'0.6x','a:0':'7'},passed:Object.fromEntries(Array.from({length:7},(_,i)=>[i,true])),firstPass:{0:true,1:true,2:true,3:true,4:true,5:true},attempts:{},hints:{},derived:{rate:true},seen:['quantity'],closure:['total'],derivationSources:{rate:['whole','time']},answersChecked:true,verdict:'valid',reflection:'改变杯数，杯子的用泥量随之改变。',startedAt:'2026-11-16T01:00:00Z',updatedAt:'2026-11-16T01:05:00Z',...patch};}

const clean=P.cleanDraft(draft());
assert.equal(clean.answersChecked,true);
assert.equal(clean.scratchId,clean.runId,'Existing runs get a stable scratchpad identity');
assert.equal(P.cleanDraft(draft({runId:'wp-revision',scratchId:'wp-original'})).scratchId,'wp-original');
assert.equal(P.cleanDraft(draft({scratchId:'a'.repeat(140)})).scratchId.length,100);
assert.equal(P.cleanDraft(draft({interactionVersion:3})).interactionVersion,3);
assert.equal(P.cleanDraft(draft({interactionVersion:4})).interactionVersion,4);
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
const tracked=P.cleanDraft(draft({interactionVersion:4,conditionFound:['whole','time','whole',null,7],conditionUsed:['time','time',false]}));
assert.deepEqual(tracked.conditionFound,['whole','time']);assert.deepEqual(tracked.conditionUsed,['time']);
const trackedRoundTrip=P.normalized({drafts:{[problem.id]:tracked}}).drafts[problem.id];
assert.deepEqual(trackedRoundTrip.conditionFound,tracked.conditionFound);assert.deepEqual(trackedRoundTrip.conditionUsed,tracked.conditionUsed);
const boundedConditions=P.cleanDraft(draft({conditionFound:Array.from({length:100},(_,i)=>'fact-'+i),conditionUsed:['x'.repeat(100)]}));
assert.equal(boundedConditions.conditionFound.length,80);assert.equal(boundedConditions.conditionUsed[0].length,80);

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
for(let missing=0;missing<7;missing++){const d=draft();delete d.passed[missing];assert.throws(()=>P.complete(null,d,problem,route),/数量、列式、答案与检验/);}
assert.throws(()=>P.complete(null,draft({passed:{0:'true',1:'true',2:'true',3:'true',4:'true',5:'true',6:'true'}}),problem,route),/数量、列式、答案与检验/);
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

// Full per-step drafts survive normalization and all textbook and guide drafts fit; the latest 160 are retained.
const many={drafts:{},records:[]};
for(let i=0;i<190;i++){const id='P'+i,t=new Date(Date.UTC(2026,10,16,0,i)).toISOString();many.drafts[id]=draft({problemId:id,runId:'wp-'+i,updatedAt:t});many.records.push({...completed.record,runId:'wp-record-'+i,problemId:id,at:t});}
let bounded=P.normalized(many);assert.equal(Object.keys(bounded.drafts).length,160);assert(bounded.drafts.P189);assert(!bounded.drafts.P0);assert.deepEqual(bounded.drafts.P189.values,draft().values);
const more={records:Array.from({length:260},(_,i)=>({...completed.record,runId:'wp-many-'+i,at:new Date(Date.UTC(2026,10,16,0,i)).toISOString()}))};
assert.equal(P.normalized(more).records.length,240);
assert.equal(P.summary(completed.state).completed,1);assert.equal(P.summary(completed.state).independent,1);

// v3 inserts the scratchpad before solving; migrating never erases the student's existing answers.
const legacyV2=draft({interactionVersion:2,step:6,finished:false,sourceLocation:'A01',firstPass:{0:true,1:false,2:true,3:true,4:true,5:false,6:true},attempts:{1:2,5:3,6:9},hints:{5:1,6:7},customModel:'原设元说明',discussion:'原讨论'});
const untouched=structuredClone(legacyV2),migrated=P.migrateDraft(legacyV2,3);
assert.equal(migrated.interactionVersion,3);assert.equal(migrated.step,5);assert.equal(migrated.finished,false);
assert.deepEqual(migrated.passed,{0:true,1:true,2:true,3:true,4:true});
assert.deepEqual(migrated.values,legacyV2.values);assert.equal(migrated.answersChecked,true);
assert.deepEqual(migrated.derived,legacyV2.derived);assert.deepEqual(migrated.derivationSources,legacyV2.derivationSources);
assert.deepEqual(migrated.seen,legacyV2.seen);assert.deepEqual(migrated.closure,legacyV2.closure);
assert.equal(migrated.sourceLocation,'A01');assert.equal(migrated.customModel,'原设元说明');assert.equal(migrated.discussion,'原讨论');
assert.equal(migrated.runId,legacyV2.runId);assert.equal(migrated.scratchId,legacyV2.runId);assert.equal(Date.parse(migrated.updatedAt),Date.parse(legacyV2.updatedAt));
assert.equal(migrated.firstPass[5],undefined);assert.equal(migrated.firstPass[6],false);assert.equal(migrated.firstPass[1],false);
assert.deepEqual(migrated.attempts,{1:2,6:3});assert.deepEqual(migrated.hints,{6:1});
assert.deepEqual(P.migrateDraft(migrated,3),migrated,'Historical migration is idempotent');assert.deepEqual(legacyV2,untouched,'Migration does not mutate saved data');
assert.equal(P.migrateDraft(draft({interactionVersion:2,step:3}),3).step,3);
const migratedFinished=P.migrateDraft(draft({interactionVersion:2,finished:true,firstPass:{0:true,5:true,6:false},attempts:{5:2,6:8}}),3);
assert.equal(migratedFinished.finished,true);assert.equal(migratedFinished.step,6);assert.equal(migratedFinished.passed[5],true);assert.equal(migratedFinished.passed[6],true);
assert.deepEqual(migratedFinished.firstPass,{0:true,6:true});assert.deepEqual(migratedFinished.attempts,{6:2});
for(const version of [undefined,1]){
 const oldStyle=draft({interactionVersion:version,firstPass:{0:true,5:false,6:true}}),same=P.migrateDraft(oldStyle);
 assert.equal(same.interactionVersion,version||0);assert.equal(same.step,6);assert.equal(same.runId,oldStyle.runId);assert.deepEqual(same.firstPass,oldStyle.firstPass);
}
assert.equal(P.migrateDraft(null),null);

// v4 combines the old relation and equation pages without treating an unfinished equation as ready.
const oldModel=draft({interactionVersion:3,step:4,runId:'wp-model-migration',scratchId:'wp-existing-ink',passed:{0:true,1:true,2:true,3:true},firstPass:{0:true,1:true,2:true,3:true},answersChecked:false,values:{'e:0':'0.6x+0.3*6x=16.8','a:0':'7'},closure:['total'],sourceLocation:'A01'});
const oldModelBefore=structuredClone(oldModel),combinedModel=P.migrateDraft(oldModel);
assert.equal(combinedModel.interactionVersion,4);assert.equal(combinedModel.step,3);
assert.deepEqual(combinedModel.passed,{0:true,1:true,2:true});assert.equal(combinedModel.firstPass[3],undefined);
assert.deepEqual(combinedModel.values,oldModel.values);assert.deepEqual(combinedModel.closure,oldModel.closure);
assert.equal(combinedModel.sourceLocation,'A01');assert.equal(combinedModel.runId,oldModel.runId);assert.equal(combinedModel.scratchId,'wp-existing-ink');
assert.equal(Date.parse(combinedModel.updatedAt),Date.parse(oldModel.updatedAt));assert.deepEqual(oldModel,oldModelBefore);
assert.deepEqual(P.migrateDraft(combinedModel),combinedModel,'Current migration is idempotent');

const oldUnconfirmed=draft({interactionVersion:3,step:6,answersChecked:false,firstPass:{0:true,1:true,2:true,3:true,4:true},attempts:{3:1,4:2,6:2},hints:{3:1,4:2,6:1}});
const needAnswers=P.migrateDraft(oldUnconfirmed);
assert.equal(needAnswers.step,5);assert.equal(needAnswers.answersChecked,false);
assert.equal(needAnswers.passed[3],true);assert.equal(needAnswers.passed[4],true);assert.equal(needAnswers.passed[5],undefined);assert.equal(needAnswers.passed[6],undefined);
assert.equal(needAnswers.values['a:0'],'7','Existing entered answers remain available for explicit confirmation');
assert.equal(needAnswers.attempts[3],3);assert.equal(needAnswers.hints[3],3);
assert.equal(needAnswers.attempts[4],undefined);assert.equal(needAnswers.hints[4],undefined);
assert.equal(needAnswers.attempts[5],2);assert.equal(needAnswers.attempts[6],2);assert.equal(needAnswers.hints[5],1);assert.equal(needAnswers.hints[6],1);
assert.equal(needAnswers.firstPass[5],undefined,'Unconfirmed old answers do not earn a new first pass');

const oldConfirmed=draft({interactionVersion:3,step:6,firstPass:{0:true,1:true,2:true,3:true,4:false,5:true,6:false},attempts:{4:2,6:1},hints:{6:1}});
const confirmedV4=P.migrateDraft(oldConfirmed);
assert.equal(confirmedV4.step,6);assert.equal(confirmedV4.passed[5],true);assert.equal(confirmedV4.answersChecked,true);
assert.equal(confirmedV4.firstPass[3],false);assert.equal(confirmedV4.firstPass[4],undefined);
assert.equal(confirmedV4.firstPass[5],false);assert.equal(confirmedV4.firstPass[6],false);
assert.equal(confirmedV4.assisted,true,'Earlier help remains attached to the migrated run');
const finishedV4=P.migrateDraft(draft({interactionVersion:3,finished:true,answersChecked:false,scratchId:'wp-finished-ink',firstPass:{0:true,1:true,2:true,3:true,4:true,6:true}}));
assert.equal(finishedV4.finished,true);assert.equal(finishedV4.step,6);assert.equal(finishedV4.answersChecked,true);
assert.equal(finishedV4.passed[5],true);assert.equal(finishedV4.passed[6],true);assert.equal(finishedV4.scratchId,'wp-finished-ink');
assert.equal(finishedV4.runId,'wp-one');assert.equal(finishedV4.firstPass[5],true);
const directV4=P.migrateDraft(legacyV2);
assert.equal(directV4.interactionVersion,4);assert.equal(directV4.firstPass[5],false);assert.equal(directV4.firstPass[6],false);
assert.equal(directV4.attempts[5],3);assert.equal(directV4.hints[5],1);assert.deepEqual(directV4.values,legacyV2.values);

// Historical v3 completion keeps its six graded stages; scratch use and reflection were not graded.
const sourceBase=path.resolve(process.env.SITE_DIR||'site','word-problems');
const F=require(path.join(sourceBase,'reading.js')),R=require(path.join(sourceBase,'relations.js'));
const authored=require(path.join(sourceBase,'data-l7-l8.js')).find(p=>p.id==='L7-P1'),authoredRoute=authored.routes[0];
const currentValues=F.canonical(authored),relationRows=R.canonical(R.build(authored,authoredRoute));
for(const kind of ['sum','product'])relationRows[kind].forEach((row,i)=>row.forEach((value,j)=>{currentValues['r:'+kind+':'+i+':'+j]=value;}));
for(const [i,a]of (authoredRoute.answers||[]).entries())currentValues['a:'+i]=a.expr;
const newDraft=draft({interactionVersion:3,problemId:authored.id,routeId:authoredRoute.id,runId:'wp-new-flow',scratchId:'wp-original-ink',values:currentValues,seen:authored.facts.map(f=>f.id),derived:Object.fromEntries((authoredRoute.derivations||[]).map(d=>[d.id,true])),reflection:'',firstPass:{0:true,1:true,2:true,3:true,4:true,5:false,6:true}});
const newComplete=P.complete(null,newDraft,authored,authoredRoute);
assert.equal(newComplete.record.total,6);assert.equal(newComplete.record.first,6);assert.equal(newComplete.record.accuracy,100);
assert.equal(newComplete.record.reflection,'');assert.equal(newComplete.record.scratchId,'wp-original-ink');
const solveWrong=P.complete(null,{...newDraft,firstPass:{...newDraft.firstPass,5:true,6:false}},authored,authoredRoute);
assert.equal(solveWrong.record.accuracy,83);assert.equal(solveWrong.record.total,6);
assert.throws(()=>P.complete(null,{...newDraft,passed:{...newDraft.passed,5:false}},authored,authoredRoute),/数量、列式、答案与检验/);
const noInk=P.cleanDraft({...newDraft,scratchpad:{strokes:[{points:[[0,0],[1,1]]}]},strokes:[1],image:'data:image/png;base64,private'});
assert(!Object.hasOwn(noInk,'scratchpad'));assert(!Object.hasOwn(noInk,'strokes'));assert(!Object.hasOwn(noInk,'image'));
assert.equal(P.saveDraft(null,authored.id,{...newDraft,runId:'wp-revised'}).drafts[authored.id].scratchId,'wp-original-ink');

// v4 grades numerical answer confirmation, but never an extra equation page or handwriting.
const currentDraft={...newDraft,interactionVersion:4,runId:'wp-current-six-pages',firstPass:{0:true,1:true,2:true,3:true,4:false,5:true,6:true},conditionFound:authored.facts.map(f=>f.id),conditionUsed:authored.facts.map(f=>f.id)};
const currentComplete=P.complete(null,currentDraft,authored,authoredRoute);
assert.equal(currentComplete.record.total,6);assert.equal(currentComplete.record.first,6);assert.equal(currentComplete.record.accuracy,100);
assert.deepEqual(currentComplete.record.conditionFound,currentDraft.conditionFound);assert.deepEqual(currentComplete.record.conditionUsed,currentDraft.conditionUsed);
assert.equal(currentComplete.record.scratchId,'wp-original-ink');
const wrongAnswer=P.complete(null,{...currentDraft,firstPass:{...currentDraft.firstPass,5:false}},authored,authoredRoute);
assert.equal(wrongAnswer.record.total,6);assert.equal(wrongAnswer.record.accuracy,83,'A corrected numerical answer still retains its original failed first attempt');
assert.throws(()=>P.complete(null,{...currentDraft,passed:{...currentDraft.passed,4:false}},authored,authoredRoute),/数量、列式、答案与检验/,'Combined modeling still requires the equation gate');
assert.throws(()=>P.complete(null,{...currentDraft,answersChecked:false},authored,authoredRoute),/求解结果/);

// Historical records keep their original accuracy denominator and step numbering.
const historical={...completed.record,interactionVersion:2,firstPass:{0:true,1:true,2:true,3:true,4:true,5:false,6:true}};
const preserved=P.normalized({records:[historical]}).records[0];
assert.equal(preserved.interactionVersion,2);assert.equal(preserved.accuracy,83);assert.deepEqual(preserved.firstPass,historical.firstPass);
const oldCloud=draft({interactionVersion:2,runId:'wp-shared-version',updatedAt:'2026-11-16T01:10:00Z',firstPass:{0:true,5:false,6:false},attempts:{5:4,6:20},hints:{5:1,6:9}});
const newLocal=draft({interactionVersion:3,runId:'wp-shared-version',updatedAt:'2026-11-16T01:15:00Z',firstPass:{0:true,5:true,6:true},attempts:{6:1},hints:{6:0},scratchId:'wp-shared-ink'});
const mixed=P.merge({drafts:{[problem.id]:oldCloud}},{drafts:{[problem.id]:newLocal}}).drafts[problem.id];
assert.equal(mixed.interactionVersion,3);assert.equal(mixed.firstPass[6],false);assert.equal(mixed.attempts[6],4);assert.equal(mixed.hints[6],1);assert.equal(mixed.scratchId,'wp-shared-ink');
assert.equal(mixed.attempts[5],undefined,'Old solve attempts must not be counted as scratchpad attempts');
const mixedRecords=P.merge({records:[{...historical,runId:'wp-shared-record',at:'2026-11-16T01:10:00Z'}]},{records:[{...newComplete.record,runId:'wp-shared-record',routeId:historical.routeId,problemId:historical.problemId,at:'2026-11-16T01:15:00Z'}]}).records[0];
assert.equal(mixedRecords.interactionVersion,3);assert.equal(mixedRecords.firstPass[6],false);assert.equal(mixedRecords.accuracy,83);
const preservedV3=P.normalized({records:[newComplete.record]}).records[0];
assert.equal(preservedV3.interactionVersion,3);assert.equal(preservedV3.total,6);assert.equal(preservedV3.accuracy,100);

// A later sync from an old device must preserve both the old help evidence and the new condition tracker.
const currentDevice=draft({interactionVersion:4,runId:'wp-cross-version',scratchId:'wp-cross-ink',updatedAt:'2026-11-16T01:20:00Z',firstPass:{0:true,1:true,2:true,3:true,5:true,6:true},conditionFound:['whole','time'],conditionUsed:['time']});
const oldDevice=draft({interactionVersion:3,runId:'wp-cross-version',scratchId:'wp-cross-ink',updatedAt:'2026-11-16T01:25:00Z',firstPass:{0:true,1:false,2:true,3:true,4:false,6:false},attempts:{1:2,4:3,6:1},hints:{4:1,6:2},values:{'a:0':'7','e:0':'2.4x=16.8'}});
for(const [a,b]of [[currentDevice,oldDevice],[oldDevice,currentDevice]]){
 const shared=P.merge({drafts:{[problem.id]:a}},{drafts:{[problem.id]:b}}).drafts[problem.id];
 assert.equal(shared.interactionVersion,4);assert.equal(shared.values['e:0'],'2.4x=16.8');
 assert.equal(shared.firstPass[1],false);assert.equal(shared.firstPass[3],false);assert.equal(shared.firstPass[5],false);assert.equal(shared.firstPass[6],false);
 assert.equal(shared.attempts[1],2);assert.equal(shared.attempts[3],3);assert.equal(shared.hints[3],1);assert.equal(shared.hints[5],2);assert.equal(shared.hints[6],2);
 assert.equal(shared.assisted,true);assert.equal(shared.scratchId,'wp-cross-ink');
 assert.deepEqual(shared.conditionFound,['whole','time']);assert.deepEqual(shared.conditionUsed,['time']);
}
const oldRecord={...oldDevice,finished:true,at:oldDevice.updatedAt,status:'assisted'},currentRecord={...currentDevice,finished:true,at:currentDevice.updatedAt,status:'independent'};
const sharedRecord=P.merge({records:[currentRecord]},{records:[oldRecord]}).records[0];
assert.equal(sharedRecord.interactionVersion,4);assert.equal(sharedRecord.total,6);assert.equal(sharedRecord.accuracy,33);assert.equal(sharedRecord.status,'assisted');
assert.deepEqual(sharedRecord.conditionFound,['whole','time']);assert.deepEqual(sharedRecord.conditionUsed,['time']);
const unchecked={...currentDevice,updatedAt:'2026-11-16T01:30:00Z',conditionUsed:[]};
const sameVersion=P.merge({drafts:{[problem.id]:currentDevice}},{drafts:{[problem.id]:unchecked}}).drafts[problem.id];
assert.deepEqual(sameVersion.conditionFound,['whole','time']);assert.deepEqual(sameVersion.conditionUsed,[],'A deliberate uncheck from a current client must not be undone by merging');
const uncheckedRecord={...unchecked,finished:true,at:unchecked.updatedAt,status:'independent'};
assert.deepEqual(P.merge({records:[currentRecord]},{records:[uncheckedRecord]}).records[0].conditionUsed,[]);
console.log('PASS word-problem progress: isolated accounts, typed gates, v2/v3/v4 migration, six-page grading, answer confirmation, condition tracking, conservative cross-version help and private drafts');

// Confirmed methods are bounded private snapshots; cross-device variants merge within one reset group.
{
 const method=(id,at,expression)=>({id,routeId:route.id,routeLabel:'一种填法',variable:'x',meaning:'套数',unit:'套',confirmed:true,createdAt:at,updatedAt:at,table:{headers:['对象','数量'],rows:[{label:'杯',cells:[{expr:expression}]}]},equations:[{label:'总量',expression:'0.6x+0.15*6x=10.5'}]});
 const a=method('method-a','2026-11-18T01:00:00Z','6*x'),b=method('method-b','2026-11-18T01:01:00Z','(10.5-0.6*x)/0.15');
 const left=draft({runId:'wp-model-a',modelGroupId:'wp-shared-models',modelId:a.id,modelMethods:[a],updatedAt:a.updatedAt});
 const right=draft({runId:'wp-model-b',modelGroupId:'wp-shared-models',modelId:b.id,modelMethods:[b],updatedAt:b.updatedAt});
 for(const [first,second]of [[left,right],[right,left]]){
  const result=P.merge({drafts:{[problem.id]:first}},{drafts:{[problem.id]:second}}).drafts[problem.id];
  assert.deepEqual(result.modelMethods.map(m=>m.id),['method-a','method-b']);assert.equal(result.runId,'wp-model-b');
 }
 const editing={...right,modelMethods:[{...b,confirmed:false,updatedAt:'2026-11-18T01:02:00Z'}],updatedAt:'2026-11-18T01:02:00Z'};
 const merged=P.merge({drafts:{[problem.id]:right}},{drafts:{[problem.id]:editing}}).drafts[problem.id];assert.equal(merged.modelMethods[0].confirmed,false,'An old checked snapshot cannot resurrect an edited method');
 const reset={...right,runId:'wp-after-reset',modelGroupId:'wp-fresh-models',modelMethods:[],updatedAt:'2026-11-18T01:03:00Z'};
 assert.deepEqual(P.merge({drafts:{[problem.id]:left}},{drafts:{[problem.id]:reset}}).drafts[problem.id].modelMethods,[],'Reset groups cannot merge old methods back into the new analysis');
 const history=P.complete(null,draft({modelGroupId:'wp-shared-models',modelId:a.id,modelMethods:[a,b]}),problem,route).record;
 assert.equal(P.normalized({records:[history]}).records[0].modelMethods.length,2,'Completed comparisons survive normalization and cloud serialization');
 assert.doesNotThrow(()=>P.cleanDraft(draft({modelMethods:[null,{id:'bad',routeId:route.id,table:{rows:[null,{cells:[null]}]},equations:[null]}]})));
 const many=Array.from({length:20},(_,i)=>method('method-'+i,'2026-11-18T01:00:00Z','x'));
 assert.equal(P.cleanDraft(draft({modelMethods:many})).modelMethods.length,8);
 const unfinished=many.map(m=>({...m,confirmed:false}));
 const withEdits=P.cleanDraft(draft({modelMethods:[a,...unfinished,b]}));assert(withEdits.modelMethods.some(m=>m.id===a.id&&m.confirmed),'Editing other methods cannot evict the first confirmed table');assert(withEdits.modelMethods.some(m=>m.id===b.id&&m.confirmed));assert.equal(withEdits.modelMethods.filter(m=>!m.confirmed).length,8);
}
console.log('PASS saved modeling comparisons: stable snapshots, chronological method order, editing tombstones, reset groups and cross-device merging');
