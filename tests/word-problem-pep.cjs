/* PEP sources, exact mathematics, provenance, and the merged topic catalog. */
'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems');
const load=name=>require(path.join(base,name+'.js'));
const E=load('engine'),R=load('relations'),F=load('reading'),C=load('catalog');
const prior=['data-l7-l8','data-l9-review','data-textbook-intro','data-textbook-applications','data-textbook-review'].flatMap(load);
const pep=['data-pep-foundations','data-pep-applications','data-pep-review'].flatMap(load);
const all=[...prior,...pep],byId=new Map(all.map(p=>[p.id,p]));
const source=load('textbook-index'),supplement=load('supplement-index');
const coverage=require('../content/word-problems/pep-ch5-coverage.json');
assert.equal(prior.length,106,'All prior task IDs survive');
assert.equal(pep.length,44);assert.equal(byId.size,150);
assert.equal(coverage.items.length,93);assert.equal(coverage.page_audit.length,39);
const applications=coverage.items.filter(p=>p.collection_category==='application');
assert.equal(applications.length,80);
assert.deepEqual(applications.map(p=>p.collection_id).sort(),Array.from({length:80},(_,i)=>'P'+String(i+1).padStart(3,'0')));
assert.equal(applications.filter(p=>p.implementation.status==='interactive').length,44);
assert.equal(applications.filter(p=>p.implementation.status==='merged').length,36);
assert.equal(coverage.boundary_subquestions.length,2);
for(const item of coverage.items){
 assert(item.statement&&item.visually_checked,item.collection_id+' verified original prompt');
 assert(item.source.printed_pages.length&&item.source.pdf_pages_1_based.length,item.collection_id+' traceable page');
 assert(item.implementation,item.collection_id+' explicit inclusion decision');
 for(const id of item.implementation.problem_ids)assert(byId.has(id),item.collection_id+' valid representative '+id);
 if(item.implementation.status==='merged')assert.equal(item.implementation.transfer_completion,false,'A similar exercise cannot inherit completion');
}
assert.deepEqual(pep.map(p=>p.id).sort(),applications.filter(p=>p.implementation.status==='interactive').flatMap(p=>p.implementation.problem_ids).sort());
assert.equal(supplement.uniqueCount,27,'Original guide accounting stays intact');
assert.equal(supplement.uniqueIds.length,27);assert.equal(supplement.excludedCount,28);
assert.equal(supplement.mergedUniqueCount,71);assert.equal(new Set(supplement.mergedUniqueIds).size,71);

const rows=C.build(all,source,supplement);
assert.equal(C.categories.length,13);assert.equal(rows.length,150);
assert.equal(new Set(rows.map(r=>r.problem.id)).size,150,'One task card regardless of repeated source positions');
assert.equal(C.select(rows,{book:'textbook'}).length,79);
assert.equal(C.select(rows,{book:'guide'}).length,71);
assert(pep.every(p=>C.select(rows,{book:'guide'}).some(r=>r.problem.id===p.id)));
for(const p of all)assert(C.categoryFor(p),p.id+' has an explicit topic');
assert(!C.categories.some(c=>/课时|第[一二三四五六七八九十\d]+讲/.test(c.label)));
const chicken=rows.find(r=>r.problem.id==='G10-01');
assert(chicken.locations.some(s=>s.id==='I00')&&chicken.locations.some(s=>s.id==='A16'),'Retain both textbook locations');
assert(C.select(rows,{query:'126 鸡兔'}).includes(chicken),'Search every source position');
assert(C.select(rows,{query:'人教版 110'}).some(r=>r.problem.id==='S10'),'Find a merged original by its PEP page');
assert(C.select(rows,{query:'人教版 124'}).some(r=>r.problem.id==='S10'),'Find its repeated PEP occurrence too');
assert.equal(supplement.peopleEducation.mergedSources.length,36);
assert(C.select(rows,{book:'guide',category:'fees'}).every(r=>r.book==='guide'&&r.category==='fees'));
assert.equal(C.select(rows,{query:'没有这样一道题 xyz'}).length,0);

const digits={'一':'1','二':'2','两':'2','三':'3','四':'4','五':'5','六':'6','七':'7','八':'8','九':'9','十':'10'};
function numbers(text){return new Set([...(String(text).match(/\d+(?:\.\d+)?/g)||[]).map(E.numeric),...Array.from(String(text)).filter(c=>digits[c]).map(c=>digits[c])]);}
const literals=expr=>E.inspect(expr).numericLiterals||[];
function substitute(expr,variable,value){return expr.replace(new RegExp('\\b'+variable+'\\b','g'),'('+value+')');}
const counts={problems:pep.length,routes:0,derivations:0,cells:0,equations:0,readingFields:0,relations:0};
for(const p of pep){
 assert.deepEqual(E.validateProblem(p),[],p.id+' schema and references');
 assert.match(p.source,/人教版.*\d+(?:[、—-]\d+)?页/,p.id+' original printed page');
 assert(p.stem.length>15,p.id+' self-contained statement');
 const reading=F.build(p),answers=F.canonical(p);counts.readingFields+=reading.fields.length;
 assert(F.check(p,answers).ok,p.id+' numeric blanks');
 for(const fact of reading.facts)for(const part of fact.parts)if(part.type==='text')assert(!/[0-9０-９]/.test(part.text),p.id+' all numbers become blanks');
 if(p.sourceTable){
  const t=p.sourceTable;assert(t.headers?.length&&t.rows.length,p.id+' source table shape');
  for(const row of t.rows)assert.equal(row.length,t.headers.length,p.id+' source table width');
  const given=new Set(p.facts.filter(f=>f.kind==='given').flatMap(f=>[...numbers(f.text)]));
  for(const value of t.rows.flat())if(value!=null)for(const n of numbers(value))assert(given.has(n),p.id+' original table number '+n+' must be read from a fact');
 }
 for(const r of p.routes){
  counts.routes++;
  const at=p.id+'/'+r.id,available=new Map([['unknown',new Set()],...p.facts.map(f=>[f.id,numbers(f.text)])]);
  const vars=new Set([r.variable,...(r.additionalVariables||[]).map(v=>v.variable)]);
  for(const d of r.derivations||[]){
   counts.derivations++;
   const allowed=new Set(d.sources.flatMap(id=>[...(available.get(id)||[])]));
   for(const n of literals(d.expr))assert(allowed.has(n),at+'/'+d.id+' unexplained number '+n);
   assert(E.checkDerivation(d.expr,d,r.variable).ok,at+'/'+d.id+' canonical derivation');
   assert(E.equivalent(d.expr,d.result),at+'/'+d.id+' arithmetic');
   available.set(d.id,new Set([...allowed,...literals(d.expr),...literals(d.result)]));
  }
  for(const row of r.table.rows)for(const c of row.cells){
   if(!c.expr)continue;counts.cells++;
   const info=E.inspect(c.expr);assert(info.ok,at+' supported table expression '+c.expr);
   for(const variable of info.variables)assert(vars.has(variable),at+' declared '+variable);
   const allowed=new Set(c.sources.flatMap(id=>[...(available.get(id)||[])]));
   for(const n of info.numericLiterals)assert(allowed.has(n),at+' unexplained table number '+n+' in '+c.expr);
  }
  for(const q of r.equations||[]){
   counts.equations++;
   const variable=q.variable||r.variable,answer=r.answers[q.answerIndex??0];
   assert(E.checkEquation(q.left+'='+q.right,q,variable).ok,at+' canonical equation');
   assert(answer,at+' indexed answer');
   assert(E.equivalent(substitute(q.left,variable,answer.expr),substitute(q.right,variable,answer.expr)),at+' exact solution of '+q.left+'='+q.right);
  }
  for(const a of r.answers||[])assert.notEqual(E.numeric(a.expr),null,at+' exact numeric answer');
  for(const check of r.checks||[])assert(E.equivalent(check.expr,check.result),at+' verification '+check.text);
  const model=R.build(p,r),canonical=R.canonical(model);counts.relations+=model.count;
  assert(model.count>0,at+' actual quantity relations');assert(R.check(model,canonical).ok,at+' canonical relations');
  const swapped=Object.fromEntries(['sum','product'].map(kind=>[kind,canonical[kind].toReversed().map(([a,b,c])=>[b,a,c])]));
  assert(R.check(model,swapped).ok,at+' row order and commutative operands');
 }
}

// Independent answers from the original conditions, including feasibility rather than algebra alone.
const p=id=>byId.get('PEP-'+id),r=id=>p(id).routes[0];
const hasAnswer=(id,value)=>assert(r(id).answers.some(a=>E.numeric(a.expr)===E.numeric(String(value))),id+' expected result '+value);
for(const [id,values] of Object.entries({P022:[27],P025:[230],P039:[27],P040:[300],P043:[8],P049:[2,1,'14/3'],P050:[6,3,'9/4'],P051:[2],P052:[5,4600],P053:[0,60],P054:[14,150],P055:[10,2,200],P060:[8,73],P062:[4,16,96],P063:[25],P064:[45,35,55],P066:[0,125],P077:[28],P078:[16,'50/3'],P080:[20,17]}))for(const value of values)hasAnswer(id,value);
assert(r('P043').derivations.some(d=>d.expr==='1/12'),'Efficiency is derived by dividing declared total work by time');
assert(r('P043').derivations.some(d=>d.expr==='1/24'));
assert(r('P048').derivations.some(d=>d.expr==='1+20%'),'Price increase keeps its calculation');
assert(r('P080').derivations.some(d=>d.expr==='40%+10%'),'Ten percentage points adds to the old oil content');
assert(r('P080').derivations.some(d=>d.expr==='2400+300'),'New yield starts from original yield and increase');
assert(!r('P080').derivations.some(d=>d.expr==='40%*(1+10%)'),'Percentage points cannot be treated as relative percent increase');
assert.equal(r('P064').equations.length,3,'The three alternatives are independently modeled');
assert(r('P051').discussion&&r('P051').verdict.correct==='valid','Integer enumeration stays a reviewed explanation');
assert(r('P068').additionalVariables.filter(v=>['n','l'].includes(v.variable)).every(v=>v.known),'Experimental parameters are known quantities');
assert.equal(p('P068').kind,'open');assert.equal(r('P068').verdict.correct,'open');
assert(r('P068').steps.some(s=>s.replace(/\s/g,'')==='n*x=1*(l/2)'),'Retain the linear parameter equation');
assert(r('P049').verdict.correct==='impossible'||r('P049').verdictCases?.some(v=>v.correct==='impossible'));
assert(r('P078').verdictCases?.some(v=>v.correct==='impossible'),'Reject the noninteger score claim');
assert(!p('P066').stem.includes('每满100'),'Do not turn a one-time reduction into repeated discounts');
console.log('PASS merged PEP topic catalog and source coverage:',JSON.stringify(counts));
