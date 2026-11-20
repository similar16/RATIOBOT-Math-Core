/* Account-scoped drafts and completed analyses; no new reward rules. */
(function(root){
 'use strict';
 const text=(s,n=600)=>String(s??'').slice(0,n);
 const object=o=>o&&typeof o==='object'&&!Array.isArray(o)?o:{};
 const keyOK=k=>/^[\w:.-]{1,100}$/.test(k)&&!['__proto__','prototype','constructor'].includes(k);
 const stepOK=k=>/^[0-6]$/.test(k);
 const integer=(value,max=1e7)=>Number.isFinite(Number(value))?Math.max(0,Math.min(max,Math.floor(Number(value)))):0;
 const stamp=value=>{const ms=Date.parse(value);return Number.isFinite(ms)?new Date(ms).toISOString():'';};
 const entries=(o,limit)=>Object.entries(object(o)).filter(([k])=>keyOK(k)).slice(0,limit);
 const values=o=>Object.fromEntries(entries(o,220).map(([k,v])=>[k,text(v,500)]));
 const flags=(o,limit=7,steps=true)=>Object.fromEntries(entries(o,limit).filter(([k,v])=>(!steps||stepOK(k))&&typeof v==='boolean'));
 const counts=o=>Object.fromEntries(entries(o,7).filter(([k])=>stepOK(k)).map(([k,v])=>[k,integer(v)]));
 const list=(v,n)=>Array.isArray(v)?[...new Set(v.filter(x=>typeof x==='string').map(x=>text(x,80)))].slice(0,n):[];
 const reading=()=>root.RatioWordProblemReading||(typeof module==='object'&&module.exports?require('./reading.js'):null);
 const relations=()=>root.RatioWordProblemRelations||(typeof module==='object'&&module.exports?require('./relations.js'):null);
 function modelList(raw){
  const byId=new Map();
  for(const value of (Array.isArray(raw)?raw:[]).slice(-32)){
   const m=object(value),id=text(m.id,100);if(!keyOK(id)||typeof m.routeId!=='string'||!keyOK(m.routeId))continue;
   const table=object(m.table),headers=(Array.isArray(table.headers)?table.headers:[]).slice(0,14).map(v=>text(v,100));
   const rows=(Array.isArray(table.rows)?table.rows:[]).slice(0,60).map(value=>{const row=object(value);return {label:text(row.label,140),cells:(Array.isArray(row.cells)?row.cells:[]).slice(0,13).map(value=>{const cell=object(value);return cell.note!=null?{note:text(cell.note,300)}:{expr:text(cell.expr,500)};})};});
   const clean={id,routeId:text(m.routeId,50),routeLabel:text(m.routeLabel,180),variable:text(m.variable,20),meaning:text(m.meaning,180),unit:text(m.unit,40),additionalVariables:(Array.isArray(m.additionalVariables)?m.additionalVariables:[]).slice(0,8).map(value=>{const v=object(value);return {variable:text(v.variable,20),meaning:text(v.meaning,180),unit:text(v.unit,40),known:v.known===true};}),confirmed:m.confirmed===true,createdAt:stamp(m.createdAt)||stamp(m.updatedAt),updatedAt:stamp(m.updatedAt),table:{headers,rows},equations:(Array.isArray(m.equations)?m.equations:[]).slice(0,12).map(value=>{const e=object(value);return {label:text(e.label,180),expression:text(e.expression,500)};})};
   const previous=byId.get(id);if(!previous||String(clean.updatedAt)>=String(previous.updatedAt))byId.set(id,clean);
  }
  const ordered=[...byId.values()].sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt))||a.id.localeCompare(b.id));
  return [...ordered.filter(m=>m.confirmed).slice(0,8),...ordered.filter(m=>!m.confirmed).slice(-8)].sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt))||a.id.localeCompare(b.id));
 }
 function mergeModels(a,b){return a.modelGroupId&&a.modelGroupId===b.modelGroupId?modelList([...(a.modelMethods||[]),...(b.modelMethods||[])]):null;}
 function cleanDraft(d,update=true){
  if(!d||typeof d!=='object'||Array.isArray(d))return null;
  const hints=counts(d.hints),example=!!d.example||d.status==='example';
  return {schema:1,interactionVersion:integer(d.interactionVersion,4),contentRevision:integer(d.contentRevision),runId:text(d.runId,100),scratchId:text(d.scratchId||d.runId,100),problemId:text(d.problemId,50),routeId:text(d.routeId,50),sourceLocation:text(d.sourceLocation,50),step:integer(d.step,6),
   modelGroupId:text(d.modelGroupId||d.runId,100),modelId:text(d.modelId||d.runId,100),modelMethods:modelList(d.modelMethods),
   values:values(d.values),passed:flags(d.passed),attempts:counts(d.attempts),firstPass:flags(d.firstPass),hints,
   seen:list(d.seen,60),closure:list(d.closure,30),conditionFound:list(d.conditionFound,80),conditionUsed:list(d.conditionUsed,80),
   referenceRelations:Object.fromEntries(entries(d.referenceRelations,32).map(([key,answer])=>[key,Object.fromEntries(['sum','product'].map(kind=>[kind,(Array.isArray(answer?.[kind])?answer[kind]:[]).slice(0,60).map(row=>Array.from({length:3},(_,i)=>text(Array.isArray(row)?row[i]:'',300)))]))])),
   derivationSources:Object.fromEntries(entries(d.derivationSources,60).map(([k,v])=>[k,list(v,20)])),
   derived:flags(d.derived,60,false),verdict:text(d.verdict,30),reflection:text(d.reflection,1600),customModel:text(d.customModel,1600),
   discussion:text(d.discussion,2000),assisted:!!d.assisted||example||d.status==='assisted'||Object.values(hints).some(n=>n>0),example,
   finished:d.finished===true,answersChecked:d.answersChecked===true,startedAt:stamp(d.startedAt),updatedAt:update?new Date().toISOString():stamp(d.updatedAt)};
 }
 function migrateDraft(raw,target=4){
  let d=cleanDraft(raw,false);if(!d)return d;
  if(d.interactionVersion===2){
  const remap=o=>{const result=Object.fromEntries(Object.entries(o).filter(([k])=>/^[0-4]$/.test(k)));if(Object.hasOwn(o,'5'))result[6]=o[5];return result;};
  const passed=Object.fromEntries(Object.entries(d.passed).filter(([k])=>/^[0-4]$/.test(k)));
  if(d.finished){passed[5]=true;if(Object.hasOwn(d.passed,'5'))passed[6]=d.passed[5];}
  // Step 5 is now a personal scratchpad; the old solve/check evidence moves to step 6.
  // Legacy reflection text is retained as history, but its old step-6 grading evidence is omitted.
  d={...d,interactionVersion:3,step:d.finished?6:Math.min(d.step,5),passed,
   firstPass:remap(d.firstPass),attempts:remap(d.attempts),hints:remap(d.hints)};
  }
  if(target<4||d.interactionVersion!==3)return d;
  // Preserve logical evidence IDs while showing six pages: 3+4 share one modeling page;
  // step 5 now confirms numerical answers, and step 6 only verifies original conditions.
  const modelReady=d.passed[3]===true&&d.passed[4]===true,answerReady=d.answersChecked||d.finished;
  const passed={...d.passed};if(!modelReady){delete passed[3];delete passed[4];}
  if(!answerReady)delete passed[5];else if(modelReady)passed[5]=true;
  if(!modelReady||!answerReady)delete passed[6];
  const mergeModel=o=>{const result={...o};delete result[4];if(Object.hasOwn(o,'3')||Object.hasOwn(o,'4'))result[3]=(o[3]||0)+(o[4]||0);return result;};
  const firstPass={...d.firstPass};delete firstPass[4];delete firstPass[5];
  if(Object.hasOwn(d.firstPass,'3')||Object.hasOwn(d.firstPass,'4')){
   if(d.firstPass[3]===false||d.firstPass[4]===false)firstPass[3]=false;
   else if(d.firstPass[3]===true&&d.firstPass[4]===true)firstPass[3]=true;else delete firstPass[3];
  }
  if(answerReady)firstPass[5]=d.firstPass[6]!==false&&!d.attempts[6]&&!d.hints[6]&&!d.example;
  const attempts=mergeModel(d.attempts),hints=mergeModel(d.hints);
  if(d.attempts[6])attempts[5]=d.attempts[6];else delete attempts[5];
  if(d.hints[6])hints[5]=d.hints[6];else delete hints[5];
  return {...d,interactionVersion:4,answersChecked:answerReady,step:d.finished?6:d.step===4?3:d.step===6&&!answerReady?5:d.step,passed,firstPass,attempts,hints};
 }
 function accuracy(d){const graded=Object.keys(d.firstPass).filter(k=>(d.interactionVersion>=4?/^(?:[0-3]|5|6)$/:d.interactionVersion>=3?/^(?:[0-4]|6)$/:/^[0-5]$/).test(k)),first=graded.filter(k=>d.firstPass[k]===true).length;return {first,total:graded.length,accuracy:graded.length?Math.round(100*first/graded.length):null};}
 function valueLabels(route,answers,problem,model){
  const factLabels=new Map((reading()?.build(problem).fields||[]).map(f=>[f.key,f.label]));
  return Object.fromEntries(Object.keys(answers).map(key=>{
   let label='补充表达';
   if(key.startsWith('f:'))label=(factLabels.get(key)||'题目数量')+'（读题填空）';
   else if(key.startsWith('r:')){const m=key.match(/^r:(sum|product):(\d+):([012])$/);if(m){const i=relations()?.practice(problem,route)[m[1]].findIndex(row=>row.sourceIndex===Number(m[2]));label=(m[1]==='sum'?'加和关系':'乘积关系')+'第'+((i>=0?i:Number(m[2]))+1)+'行 · '+(m[3]==='2'?'结果':'第'+(Number(m[3])+1)+'个量');}}
   else if(key.startsWith('d:'))label=((route.derivations||[]).find(d=>d.id===key.slice(2))?.label||'数据推导')+'（来源推导）';
   else if(key.startsWith('dm:'))label=((route.derivations||[]).find(d=>d.id===key.slice(3))?.label||'数据推导')+'（推导方法）';
   else {const m=key.match(/^(t|e|a|c|v):(\d+)(?::(\d+))?$/);if(m){const i=Number(m[2]),j=Number(m[3]);
    if(m[1]==='t')label=(route.table?.rows?.[i]?.label||'对象')+' · '+(route.table?.headers?.[j+1]||'数量');
    if(m[1]==='e')label=route.sumExpressions?.[i]?.label?route.sumExpressions[i].label+'的完整求和算式':model?.equations?.[i]?.label||route.equations?.[i]?.label||'数量等式';
    if(m[1]==='a')label=route.answers?.[i]?.label||'所求量';
    if(m[1]==='c')label=route.sumExpressions?.[i]?.label?route.sumExpressions[i].label+'合并同类项后的结果':route.checks?.[i]?.text||'代回检验';
    if(m[1]==='v')label=(route.verdictCases?.[i]?.label||'分情形检验')+'（实际意义判断）';
   }}return [key,text(label,300)];
  }));
 }
 function cleanRecord(r){
  const d=cleanDraft(r,false);if(!d||!/^wp-[\w-]+$/.test(d.runId)||!d.problemId||!d.routeId)return null;
  return {...d,finished:true,title:text(r.title,180),source:text(r.source,300),routeLabel:text(r.routeLabel,180),at:stamp(r.at)||d.updatedAt,
   valueLabels:Object.fromEntries(entries(r.valueLabels,220).filter(([k])=>Object.hasOwn(d.values,k)).map(([k,v])=>[k,text(v,300)])),
   status:r.status==='review'||d.customModel?'review':d.example?'example':d.assisted?'assisted':'independent',...accuracy(d)};
 }
 function mergeFlags(a,b){
  const firstPass={...a.firstPass,...b.firstPass};
  for(const k of Object.keys(firstPass))if(a.firstPass?.[k]===false||b.firstPass?.[k]===false)firstPass[k]=false;
  const maxCounts=(x,y)=>Object.fromEntries([...new Set([...Object.keys(x||{}),...Object.keys(y||{})])].map(k=>[k,Math.max(integer(x?.[k]),integer(y?.[k]))]));
  return {assisted:!!(a.assisted||b.assisted||a.example||b.example),example:!!(a.example||b.example),firstPass,
   attempts:maxCounts(a.attempts,b.attempts),hints:maxCounts(a.hints,b.hints)};
 }
 function mergeDraft(a,b){
  if(a.contentRevision!==b.contentRevision)return a.contentRevision>b.contentRevision?a:b;
  const methods=mergeModels(a,b);
  if(a.runId!==b.runId||a.routeId!==b.routeId){const latest=String(b.updatedAt||'')>=String(a.updatedAt||'')?b:a;return methods?{...latest,modelMethods:methods}:latest;}
  if(a.interactionVersion>=4&&b.interactionVersion<4)b={...b,conditionFound:a.conditionFound,conditionUsed:a.conditionUsed};
  if(b.interactionVersion>=4&&a.interactionVersion<4)a={...a,conditionFound:b.conditionFound,conditionUsed:b.conditionUsed};
  // An older device may still send v2 data for this run. Align step meanings before merging evidence.
  const target=Math.max(a.interactionVersion,b.interactionVersion);if(target>=3){if(a.interactionVersion>=2&&a.interactionVersion<target)a=migrateDraft(a,target);if(b.interactionVersion>=2&&b.interactionVersion<target)b=migrateDraft(b,target);}
  const latest=String(b.updatedAt||'')>=String(a.updatedAt||'')?b:a;
  // Keep latest expressions and unlocked steps; assistance evidence is irreversible within one run.
  return {...latest,...mergeFlags(a,b),...(methods?{modelMethods:methods}:{})};
 }
 function mergeRecord(a,b){
  if(a.problemId!==b.problemId||a.routeId!==b.routeId)return String(b.at||'')>=String(a.at||'')?b:a;
  if(a.interactionVersion>=4&&b.interactionVersion<4)b={...b,conditionFound:a.conditionFound,conditionUsed:a.conditionUsed};
  if(b.interactionVersion>=4&&a.interactionVersion<4)a={...a,conditionFound:b.conditionFound,conditionUsed:b.conditionUsed};
  const target=Math.max(a.interactionVersion,b.interactionVersion);if(target>=3){if(a.interactionVersion>=2&&a.interactionVersion<target)a={...a,...migrateDraft(a,target)};if(b.interactionVersion>=2&&b.interactionVersion<target)b={...b,...migrateDraft(b,target)};}
  const latest=String(b.at||'')>=String(a.at||'')?b:a;
  const methods=mergeModels(a,b),combined={...latest,...mergeFlags(a,b),...(methods?{modelMethods:methods}:{})};
  combined.status=a.status==='review'||b.status==='review'?'review':combined.example?'example':combined.assisted?'assisted':'independent';
  return {...combined,...accuracy(combined)};
 }
 function recordList(records){
  const byRun=new Map();
  for(const raw of (Array.isArray(records)?records:[]).slice(0,500)){const r=cleanRecord(raw);if(!r)continue;byRun.set(r.runId,byRun.has(r.runId)?mergeRecord(byRun.get(r.runId),r):r);}
  return [...byRun.values()].sort((x,y)=>String(y.at).localeCompare(String(x.at))).slice(0,240);
 }
 function draftList(drafts){
  return Object.fromEntries(entries(drafts,300).map(([id,raw])=>[id,cleanDraft(raw,false)]).filter(([id,d])=>d&&d.problemId===id)
   .sort((a,b)=>String(b[1].updatedAt).localeCompare(String(a[1].updatedAt))).slice(0,160));
 }
 function normalized(value){const v=object(value);return {version:1,records:recordList(v.records),drafts:draftList(v.drafts)};}
 function saveDraft(value,id,draft){
  const s=normalized(value),d=cleanDraft(draft);if(!d||d.problemId!==id||!keyOK(id))return s;
  s.drafts=draftList({...s.drafts,[id]:s.drafts[id]?mergeDraft(s.drafts[id],d):d});return s;
 }
 function complete(value,draft,problem,route){
  const s=normalized(value),d=cleanDraft(draft);
  if(!d||!problem||!route||d.problemId!==problem.id||d.routeId!==route.id||!/^wp-[\w-]+$/.test(d.runId))throw Error('分析记录不完整，请返回当前题目重试.');
  if(d.contentRevision<integer(problem.contentRevision))throw Error('本题内容已更新，请重新分析后再保存.');
  const analysisOnly=problem.kind==='open';
  if(!(analysisOnly?[0,1,2,3,4]:[0,1,2,3,4,5,6]).every(i=>d.passed[i]===true))throw Error('请依次完成数量、列式、答案与检验，再保存完成记录.');
  if((route.derivations||[]).some(x=>d.derived[x.id]!==true))throw Error('数据来源推导尚未全部核对，请返回检查.');
  if(!analysisOnly&&(route.answers||[]).length&&!d.answersChecked)throw Error('求解结果尚未核对，请先完成求解与检验.');
  if(!analysisOnly&&(route.verdictCases||[]).some((c,i)=>d.values['v:'+i]!==c.correct))throw Error('请分别完成每种情形的实际意义判断.');
  // A relationship such as y=2x is a complete short record. Open analysis is
  // saved for teacher review rather than graded by a prose-length threshold.
  if(analysisOnly&&!d.discussion.trim())throw Error('请完成数量关系与模型的分析说明后保存.');
  if(route.relationshipOnly){
   const E=root.RatioWordProblemEngine||(typeof module==='object'&&module.exports?require('./engine.js'):null);
   if(!E||route.table.rows.some((row,i)=>row.cells.some((cell,j)=>!cell.note&&!cell.given&&!E.checkTableCell(d.values['t:'+i+':'+j]||'',cell,route.variable).ok)))throw Error('请先确认框内各方向的日期表达式.');
   if((route.sumExpressions||[]).some((item,i)=>!E.checkQuantitySum(d.values['e:'+i]||'',{...item,termSets:(item.rowIndexes||[]).map(index=>route.table.rows[index].cells.filter(cell=>cell.expr).map(cell=>cell.expr))},route.variable).ok))throw Error('请先确认三数框和十字框的完整 S 求和算式.');
   if(!d.answersChecked||(route.sumExpressions||[]).some((item,i)=>!E.checkSimplifiedTerm(d.values['c:'+i]||'',item,route.variable).ok))throw Error('请先填写并确认合并同类项后的化简结果.');
  }
  if(d.interactionVersion>=2){
   const F=reading();if(!F)throw Error('数量互动资源尚未准备好，请重试.');
   if(!F.check(problem,d.values).ok||F.build(problem).facts.some(f=>!f.fields.length&&!d.seen.includes(f.id)))throw Error('请完成并核对读题数量填空.');
  }
  if(s.records.some(x=>x.runId===d.runId))return {state:s,record:null};
  const discussion=!!route.discussion||['open','boundary'].includes(problem.kind)||!!d.customModel;
  const record={...d,finished:true,title:problem.title,source:[...new Set([(problem.textbookSources||[]).find(s=>s.id===d.sourceLocation)?.source,problem.source,...(problem.textbookSources||[]).map(s=>s.source)].filter(Boolean))].join('；'),routeLabel:route.label,valueLabels:valueLabels(route,d.values,problem,d.modelMethods.find(m=>m.id===d.modelId&&m.confirmed)),at:new Date().toISOString(),
   status:discussion?'review':d.example?'example':d.assisted?'assisted':'independent',...accuracy(d)};
  s.records=recordList([record,...s.records]);s.drafts=draftList({...s.drafts,[problem.id]:{...d,finished:true}});return {state:s,record};
 }
 function merge(a,b){
  a=normalized(a);b=normalized(b);const drafts={...a.drafts};
  for(const [id,d]of Object.entries(b.drafts))drafts[id]=drafts[id]?mergeDraft(drafts[id],d):d;
  return normalized({records:[...a.records,...b.records],drafts});
 }
 function summary(value){const r=normalized(value).records;return {completed:new Set(r.filter(x=>x.status!=='review').map(x=>x.problemId)).size,
  independent:new Set(r.filter(x=>x.status==='independent').map(x=>x.problemId)).size,review:r.filter(x=>x.status==='review').length,records:r};}
 const api={cleanDraft,migrateDraft,normalized,saveDraft,complete,merge,summary};if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioWordProblemProgress=api;
})(typeof window==='undefined'?globalThis:window);
