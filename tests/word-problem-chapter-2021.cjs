/* Uploaded chapter: source accounting, exact arithmetic, independent modeling and all routes. */
'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems'),load=n=>require(path.join(base,n+'.js'));
const E=load('engine'),R=load('relations'),F=load('reading'),data=load('data-chapter-2021'),C=load('catalog'),S=load('supplement-index');
assert.equal(data.length,12);assert.equal(data.flatMap(p=>p.routes).length,23);
const digits={'一':'1','二':'2','两':'2','三':'3','四':'4','五':'5','六':'6','七':'7','八':'8','九':'9','十':'10'};
function numbers(text){return new Set([...(String(text).match(/\d+(?:\.\d+)?/g)||[]).map(E.numeric),...Array.from(String(text)).filter(c=>digits[c]).map(c=>digits[c])]);}
const literals=e=>E.inspect(e).numericLiterals||[];
const substitute=(e,x,v)=>e.replace(new RegExp('\\b'+x+'\\b','g'),'('+v+')');
let routes=0,cells=0;
for(const p of data){
 assert.deepEqual(E.validateProblem(p),[],p.id);assert.equal(p.originalStem,p.stem);assert(!p.originalStem.includes('。'));
 assert(p.sourceAudit.originalVerified);assert(p.sourceAudit.pdfPage>=1&&p.sourceAudit.pdfPage<=31);assert(C.categoryFor(p));assert(S.mergedUniqueIds.includes(p.id));
 assert(F.check(p,F.canonical(p)).ok,p.id+' reading');assert.equal(p.routes.length>=2,p.kind!=='open'&&p.id!=='C21-12',p.id+' distinct natural methods');
 for(const r of p.routes){routes++;const label=p.id+'/'+r.id,available=new Map([['unknown',new Set()],...p.facts.map(f=>[f.id,numbers(f.text)])]);
  assert(r.domain&&r.meaning&&r.label,label+' defined unknown');
  for(const d of r.derivations){const allowed=new Set(d.sources.flatMap(id=>[...(available.get(id)||[])]));for(const n of literals(d.expr))assert(allowed.has(n),label+'/'+d.id+' source '+n);assert(E.checkDerivation(d.expr,d,r.variable).ok);available.set(d.id,new Set([...allowed,...literals(d.result)]));}
  for(const row of r.table.rows)for(const c of row.cells){if(c.note!=null)continue;cells++;assert(E.inspect(c.expr).ok);const allowed=new Set(c.sources.flatMap(id=>[...(available.get(id)||[])]));for(const n of literals(c.expr))assert(allowed.has(n),label+' unexplained '+n+' in '+c.expr);}
  const model=R.reference(p,r);assert(R.check(model,R.canonical(model)).ok,label+' relations');
  for(const q of r.equations){const a=r.answers[q.answerIndex||0];assert(a);assert(E.equivalent(substitute(q.left,'x',a.expr),substitute(q.right,'x',a.expr)),label+' solution');assert(E.checkEquation(q.left+'='+q.right,q,'x').ok);assert(!E.checkEquation('x=x',q,'x').ok,label+' reject identity');}
  for(const k of r.checks)assert(E.equivalent(k.expr,k.result),label+' original check');
 }
}
// Distinct methods really use different conditions, not one copied preset basis.
for(const id of ['01','02','03','04','05','07','08','09','10','11']){const p=data.find(p=>p.id==='C21-'+id);assert(new Set(p.routes.map(r=>r.closure.text)).size>=2,p.id+' closure changes');}
const open=data.find(p=>p.id==='C21-06');assert.equal(open.kind,'open');assert(open.routes[0].discussion);assert.equal(open.routes[0].answers.length,0);assert.equal(open.routes[0].checks.length,0);
const rest=data.find(p=>p.id==='C21-11');assert(rest.routes.every(r=>r.table.rows.some(row=>row.label==='休息'&&row.cells[0].note&&row.cells.at(-1).note)),'Rest is not assigned a fake speed or distance');
assert(data.find(p=>p.id==='C21-05').routes[0].table.headers.length===5,'Original four-distance table preserved');
console.log('PASS uploaded chapter: 12 new tasks / '+routes+' routes / '+cells+' quantities, source chains, exact answers, method-specific bases and open-only analysis');
