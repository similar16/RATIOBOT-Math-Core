/* Initial balance modeling stays short without losing source chains or equal operations. */
'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems');
const E=require(path.join(base,'engine.js'));
const R=require(path.join(base,'relations.js'));
const A=require(path.join(base,'table-alternatives.js'));
const data=require(path.join(base,'data-textbook-intro.js'));
const cases=[
 {id:'TB-I03',variable:'x',mass:'5',answer:'2',left:'2*x+1',right:'5',equivalent:'1+x*2=5',editable:1,operations:['2*x=5-1','x=(5-1)/2']},
 {id:'TB-I04',variable:'y',mass:'6',answer:'3',left:'3*y',right:'y+6',equivalent:'y*3=6+y',editable:2,operations:['(3-1)*y=6','y=6/(3-1)']},
];
for(const expected of cases){
 const p=data.find(p=>p.id===expected.id),r=p.routes[0],where=p.id;
 assert.deepEqual(E.validateProblem(p),[],where+' retains valid sources and declarations');
 assert.equal(p.contentRevision,1,where+' has a new content identity for changed cell indices');
 assert.deepEqual(r.table.headers,['托盘','盘中物体','总质量/克']);
 assert.deepEqual(r.table.rows.map(row=>row.label),['左盘','右盘']);
 assert.equal(r.table.rows.flatMap(row=>row.cells).filter(cell=>cell.expr&&!cell.given).length,expected.editable);
 assert(r.table.rows.every(row=>row.cells.length===2&&row.cells[0].note&&row.cells[0].sources.length));
 const d=r.derivations.find(d=>d.id==='rightMass'),derivation={...d,requireCalculation:true};
 assert.equal(d.expr,expected.mass+'*1','A weight count is converted to mass explicitly');
 assert(E.checkDerivation(d.expr,derivation,r.variable).ok,'The source expression alone is sufficient');
 assert(E.checkDerivation(d.expr+'='+d.result,derivation,r.variable).ok,'A correct optional result is also accepted');
 assert.equal(E.checkDerivation(d.result,derivation,r.variable).kind,'source','A bare answer cannot bypass its origin');
 assert.equal(r.equations.length,1,where+' only asks for the starting balance equation');
 const q=r.equations[0];
 assert.equal(q.left,expected.left);assert.equal(q.right,expected.right);
 for(const equation of [q.left+'='+q.right,q.right+'='+q.left,expected.equivalent])assert(E.checkEquation(equation,q,r.variable).ok,equation);
 assert(!E.checkEquation(r.variable+'='+expected.answer,q,r.variable).ok,'The solved value cannot replace the model');
 assert(!E.checkEquation(q.left+'='+q.left,q,r.variable).ok,'A tautology cannot determine the mass');
 assert.equal(r.answers[0].expr,expected.answer);assert.equal(r.answers[0].unit,'克');
 for(const step of expected.operations)assert(r.steps.includes(step),'The operation '+step+' remains in the worked solution');
 assert(r.scratchPrompt.includes('草稿纸')&&r.scratchPrompt.includes('等式'),'Students still explain the balance-preserving operations');
 assert.equal(R.build(p,r).sum.length,1);assert.equal(R.build(p,r).product.length,1);
 const model=R.build(p,r);assert(R.check(model,R.canonical(model)).ok);
 for(const [ri,row]of r.table.rows.entries()){
  const cell=row.cells[1],alternatives=A.options(p,r,ri,1);
  const item={...cell,alternatives,allowedNumbers:[d.result],sourceExpressions:[d.expr,d.result],requiredDerivations:[]};
  assert(E.checkTableCell(cell.expr,item,r.variable).ok,where+' canonical total');
  for(const alternative of alternatives)assert(E.checkTableCell(alternative.expr,item,r.variable).ok,where+' alternative total');
  assert(!E.checkTableCell('999',item,r.variable).ok,'A wrong total is not accepted');
 }
 const entries=A.entries().filter(entry=>entry.problemId===p.id);
 assert(entries.every(entry=>entry.cellIndex===1&&!r.table.rows[entry.rowIndex].cells[1].given),'Alternatives target only the new editable total column');
 assert(entries.length>0,'Source-backed alternative representations remain available');
 const valueAt=expression=>E.numeric(expression.replace(new RegExp(r.variable,'g'),'('+expected.answer+')'));
 assert.equal(valueAt(q.left),valueAt(q.right));
 for(const check of r.checks)assert(E.equivalent(check.expr,check.result),'The original checks still hold');
}
console.log('PASS simplified balance modeling: source-based weight masses, two-row total tables, alternative representations, one initial equation and retained paper operations');
