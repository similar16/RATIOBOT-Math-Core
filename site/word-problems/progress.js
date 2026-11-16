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
 function cleanDraft(d,update=true){
  if(!d||typeof d!=='object'||Array.isArray(d))return null;
  const hints=counts(d.hints),example=!!d.example||d.status==='example';
  return {schema:1,interactionVersion:integer(d.interactionVersion,3),runId:text(d.runId,100),scratchId:text(d.scratchId||d.runId,100),problemId:text(d.problemId,50),routeId:text(d.routeId,50),sourceLocation:text(d.sourceLocation,50),step:integer(d.step,6),
   values:values(d.values),passed:flags(d.passed),attempts:counts(d.attempts),firstPass:flags(d.firstPass),hints,
   seen:list(d.seen,60),closure:list(d.closure,30),
   derivationSources:Object.fromEntries(entries(d.derivationSources,60).map(([k,v])=>[k,list(v,20)])),
   derived:flags(d.derived,60,false),verdict:text(d.verdict,30),reflection:text(d.reflection,1600),customModel:text(d.customModel,1600),
   discussion:text(d.discussion,2000),assisted:!!d.assisted||example||d.status==='assisted'||Object.values(hints).some(n=>n>0),example,
   finished:d.finished===true,answersChecked:d.answersChecked===true,startedAt:stamp(d.startedAt),updatedAt:update?new Date().toISOString():stamp(d.updatedAt)};
 }
 function migrateDraft(raw){
  const d=cleanDraft(raw,false);if(!d||d.interactionVersion!==2)return d;
  const remap=o=>{const result=Object.fromEntries(Object.entries(o).filter(([k])=>/^[0-4]$/.test(k)));if(Object.hasOwn(o,'5'))result[6]=o[5];return result;};
  const passed=Object.fromEntries(Object.entries(d.passed).filter(([k])=>/^[0-4]$/.test(k)));
  if(d.finished){passed[5]=true;if(Object.hasOwn(d.passed,'5'))passed[6]=d.passed[5];}
  // Step 5 is now a personal scratchpad; the old solve/check evidence moves to step 6.
  // Legacy reflection text is retained as history, but its old step-6 grading evidence is omitted.
  return {...d,interactionVersion:3,step:d.finished?6:Math.min(d.step,5),passed,
   firstPass:remap(d.firstPass),attempts:remap(d.attempts),hints:remap(d.hints)};
 }
 function accuracy(d){const graded=Object.keys(d.firstPass).filter(k=>(d.interactionVersion>=3?/^(?:[0-4]|6)$/:/^[0-5]$/).test(k)),first=graded.filter(k=>d.firstPass[k]===true).length;return {first,total:graded.length,accuracy:graded.length?Math.round(100*first/graded.length):null};}
 function valueLabels(route,answers,problem){
  const factLabels=new Map((reading()?.build(problem).fields||[]).map(f=>[f.key,f.label]));
  return Object.fromEntries(Object.keys(answers).map(key=>{
   let label='补充表达';
   if(key.startsWith('f:'))label=(factLabels.get(key)||'题目数量')+'（读题填空）';
   else if(key.startsWith('r:')){const m=key.match(/^r:(sum|product):(\d+):([012])$/);if(m)label=(m[1]==='sum'?'加和关系':'乘积关系')+'第'+(Number(m[2])+1)+'行 · '+(m[3]==='2'?'结果':'第'+(Number(m[3])+1)+'个量');}
   else if(key.startsWith('d:'))label=((route.derivations||[]).find(d=>d.id===key.slice(2))?.label||'数据推导')+'（来源推导）';
   else {const m=key.match(/^(t|e|a|c|v):(\d+)(?::(\d+))?$/);if(m){const i=Number(m[2]),j=Number(m[3]);
    if(m[1]==='t')label=(route.table?.rows?.[i]?.label||'对象')+' · '+(route.table?.headers?.[j+1]||'数量');
    if(m[1]==='e')label=route.equations?.[i]?.label||'数量等式';
    if(m[1]==='a')label=route.answers?.[i]?.label||'所求量';
    if(m[1]==='c')label=route.checks?.[i]?.text||'代回检验';
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
  if(a.runId!==b.runId||a.routeId!==b.routeId)return String(b.updatedAt||'')>=String(a.updatedAt||'')?b:a;
  // An older device may still send v2 data for this run. Align step meanings before merging evidence.
  if(a.interactionVersion===3||b.interactionVersion===3){if(a.interactionVersion===2)a=migrateDraft(a);if(b.interactionVersion===2)b=migrateDraft(b);}
  const latest=String(b.updatedAt||'')>=String(a.updatedAt||'')?b:a;
  // Keep latest expressions and unlocked steps; assistance evidence is irreversible within one run.
  return {...latest,...mergeFlags(a,b)};
 }
 function mergeRecord(a,b){
  if(a.problemId!==b.problemId||a.routeId!==b.routeId)return String(b.at||'')>=String(a.at||'')?b:a;
  if(a.interactionVersion===3||b.interactionVersion===3){if(a.interactionVersion===2)a={...a,...migrateDraft(a)};if(b.interactionVersion===2)b={...b,...migrateDraft(b)};}
  const latest=String(b.at||'')>=String(a.at||'')?b:a;
  const combined={...latest,...mergeFlags(a,b)};
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
  if(!d||!problem||!route||d.problemId!==problem.id||d.routeId!==route.id||!/^wp-[\w-]+$/.test(d.runId))throw Error('分析记录不完整，请返回当前题目重试。');
  if(!Array.from({length:7},(_,i)=>d.passed[i]===true).every(Boolean))throw Error('请依次完成并核对七个分析步骤，再保存完成记录。');
  if((route.derivations||[]).some(x=>d.derived[x.id]!==true))throw Error('数据来源推导尚未全部核对，请返回检查。');
  if((route.answers||[]).length&&!d.answersChecked)throw Error('求解结果尚未核对，请先完成求解与检验。');
  if((route.verdictCases||[]).some((c,i)=>d.values['v:'+i]!==c.correct))throw Error('请分别完成每种情形的实际意义判断。');
  if(d.interactionVersion>=2){
   const F=reading(),R=relations();if(!F||!R)throw Error('数量互动资源尚未准备好，请重试。');
   if(!F.check(problem,d.values).ok||F.build(problem).facts.some(f=>!f.fields.length&&!d.seen.includes(f.id)))throw Error('请完成并核对读题数量填空。');
   const model=R.build(problem,route),answers=Object.fromEntries(['sum','product'].map(kind=>[kind,model[kind].map((_,i)=>[0,1,2].map(j=>d.values['r:'+kind+':'+i+':'+j]||''))]));
   if(!R.check(model,answers).ok)throw Error('请完成并核对加和、乘积关系。');
  }
  if(s.records.some(x=>x.runId===d.runId))return {state:s,record:null};
  const discussion=!!route.discussion||['open','boundary'].includes(problem.kind)||!!d.customModel;
  const record={...d,finished:true,title:problem.title,source:[...new Set([(problem.textbookSources||[]).find(s=>s.id===d.sourceLocation)?.source,problem.source,...(problem.textbookSources||[]).map(s=>s.source)].filter(Boolean))].join('；'),routeLabel:route.label,valueLabels:valueLabels(route,d.values,problem),at:new Date().toISOString(),
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
