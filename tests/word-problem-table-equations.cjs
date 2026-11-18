'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems'),E=require(path.join(base,'engine.js')),A=require(path.join(base,'table-alternatives.js')),Q=require(path.join(base,'table-equations.js'));
const data=['data-l7-l8','data-l9-review','data-textbook-intro','data-textbook-applications','data-textbook-review','data-pep-foundations','data-pep-applications','data-pep-review'].flatMap(f=>require(path.join(base,f+'.js')));
function fixture(id,routeId,alternatives=[]){
 const problem=data.find(p=>p.id===id),route=problem.routes.find(r=>r.id===routeId);
 const cells=route.table.rows.flatMap((row,ri)=>row.cells.flatMap((cell,ci)=>cell.expr?[{rowIndex:ri,cellIndex:ci,rowLabel:row.label,columnLabel:route.table.headers[ci+1],originalExpr:cell.expr,originalSources:cell.sources,expr:cell.expr}]:[]));
 for(const a of alternatives){const cell=cells.find(c=>c.rowIndex===a.rowIndex&&c.cellIndex===a.cellIndex);Object.assign(cell,{expr:a.expr,alternative:a});}
 return {problem,route,cells,plan:Q.build(problem,route,cells)};
}
const records=A.entries(),sale=records.find(a=>a.problemId==='L8-P1'&&a.cellIndex===2),marked=records.find(a=>a.problemId==='L8-P1'&&a.cellIndex===1);
const original=fixture('L8-P1','cost'),alternative=fixture('L8-P1','cost',[sale]);
assert.match(original.plan.entries[0].recommended.label,/进价加利润/);
const discount=alternative.plan.entries[0].recommended;
assert.equal(discount.kind,'quantity');assert.match(discount.label,/八折/);assert(!discount.label.includes('进价加利润等于售价'));
assert(E.equivalent(discount.right,'x+96'));assert(E.equivalent(discount.left,'1.5*x*0.8'));
assert(!alternative.plan.entries[0].choices.some(c=>E.equivalent(c.left,c.right)),'Profit used while filling the sale is not re-used as an identity equation');
assert.equal(Q.basis(alternative.plan,0,'96+x=0.8*1.5*x').label,discount.label,'Equivalent spellings and reversed sides retain their actual basis');
assert.equal(Q.basis(alternative.plan,0,'1.2*x-x=96').kind,'equivalent','Do not guess a source from an equation having the same solution');
const combined=fixture('L8-P1','cost',[sale,marked]);assert.match(combined.plan.entries[0].recommended.label,/标价是进价的1.5倍/);
const firstWire=records.find(a=>a.problemId==='PEP-P005'&&a.routeId==='main'&&a.rowIndex===0),wire=fixture('PEP-P005','main',[firstWire]);
assert.equal(wire.plan.entries[0].recommended.kind,'quantity');assert.match(wire.plan.entries[0].recommended.label,/剪去|接上/);
assert(!wire.plan.entries[0].choices.some(c=>c.kind==='table'),'The already-used equal-length relation becomes an identity for this table');

let checked=0;
for(const record of records){
 const f=fixture(record.problemId,record.routeId,[record]),changed=!E.equivalent(f.cells.find(c=>c.rowIndex===record.rowIndex&&c.cellIndex===record.cellIndex).originalExpr,record.expr);
 if(changed&&E.inspect('('+f.cells.find(c=>c.rowIndex===record.rowIndex&&c.cellIndex===record.cellIndex).originalExpr+')-('+record.expr+')').variables.length===1){assert(f.plan.entries.some(e=>e.choices.some(c=>c.kind==='quantity')),record.problemId+'/'+record.routeId+' has its own nonpreset equation basis');checked++;}
 for(const entry of f.plan.entries){assert(entry.recommended,record.problemId+' has a model');for(const choice of entry.choices){assert(E.checkEquation(choice.left+'='+choice.right,f.route.equations[entry.index],entry.variable).ok);assert(!E.equivalent(choice.left,choice.right));}}
}
const grouped=new Map();for(const a of records){const key=a.problemId+'/'+a.routeId;if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(a);}
for(const items of grouped.values()){const f=fixture(items[0].problemId,items[0].routeId,items);for(const entry of f.plan.entries)assert(E.checkEquation(entry.recommended.left+'='+entry.recommended.right,f.route.equations[entry.index],entry.variable).ok,'Mixed representations must still yield an independent modeling equation');}
const poisoned={...alternative.route};for(const key of ['answers','steps','checks'])Object.defineProperty(poisoned,key,{get(){throw Error('Read a solved result: '+key);}});
assert.deepEqual(Q.build(alternative.problem,poisoned,alternative.cells),alternative.plan,'Planning never reads answers or solved steps');
const bad=structuredClone(alternative.cells);bad.find(c=>c.cellIndex===2).expr='576';assert(!Q.build(alternative.problem,alternative.route,bad).changed,'An unvalidated guessed number is not an authored table representation');
console.log('PASS actual-table equation bases: '+checked+' changed representations, '+grouped.size+' mixed tables, nonidentity equations, alternate sides, source labels and no answer lookup');
