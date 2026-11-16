/* Quantity-card grading: commutativity, row order, semantic roles, full authored coverage. */
'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems');
const R=require(path.join(base,'relations.js'));
const data=['data-l7-l8','data-l9-review','data-textbook-intro','data-textbook-applications','data-textbook-review'].flatMap(f=>require(path.join(base,f+'.js')));
const clone=v=>JSON.parse(JSON.stringify(v));
const counts={problems:data.length,routes:0,sum:0,product:0};
function model(id,route){const p=data.find(p=>p.id===id);assert(p,id);return R.build(p,p.routes.find(r=>r.id===route)||p.routes[0]);}
for(const p of data)for(const route of p.routes){
 const m=R.build(p,route),answer=R.canonical(m);
 counts.routes++;counts.sum+=m.sum.length;counts.product+=m.product.length;
 assert.equal(m.count,m.sum.length+m.product.length,p.id+' count');
 assert(m.count>0,p.id+' needs at least one authored relationship');
 assert.equal(new Set(m.tokens.map(t=>t.id)).size,m.tokens.length,p.id+' unique reusable quantities');
 assert(m.tokens.every(t=>t.id===t.label&&t.label.trim().length>0),p.id+' named quantities');
 assert.equal(R.check(m,answer).ok,true,p.id+'/'+route.id+' canonical');
 const reordered={sum:answer.sum.toReversed().map(([a,b,c])=>[b,a,c]),product:answer.product.toReversed().map(([a,b,c])=>[b,a,c])};
 assert.equal(R.check(m,reordered).ok,true,p.id+'/'+route.id+' commutativity and row order');
 for(const type of ['sum','product']){
  if(!answer[type].length){assert(m.empty[type].length>0,'Explain the absent type');continue;}
  const incomplete=clone(answer);incomplete[type][0][1]='';
  assert.equal(R.check(m,incomplete).ok,false,p.id+' blank slot');
  const invented=clone(answer);invented[type][0][1]='没有来源的量';
  assert.equal(R.check(m,invented).ok,false,p.id+' invented quantity');
  // Equality's result is a semantic role, not a third freely movable operand.
  const wrongResult=clone(answer);[wrongResult[type][0][0],wrongResult[type][0][2]]=[wrongResult[type][0][2],wrongResult[type][0][0]];
  assert.equal(R.check(m,wrongResult).ok,false,p.id+' swapping result and operand');
  if(answer[type].length>1){
   const repeated=clone(answer);repeated[type][1]=[...repeated[type][0]];
   assert.equal(R.check(m,repeated).ok,false,p.id+' repeating a row cannot replace another relationship');
  }
 }
 const untouched=R.canonical(m);answer.sum.push(['a','b','c']);
 assert.deepEqual(R.canonical(m),untouched,'Answers must not mutate the model');
}
assert.equal(counts.problems,106);assert.equal(counts.routes,114);

// Equal labels may be reused in two slots: a square really uses the same side twice.
const square=model('G9-04');
assert.deepEqual(square.product[0],{terms:['每边颗数','每边颗数'],result:'总棋子数'});
assert.equal(R.check(square,R.canonical(square)).ok,true);
const chessValues={'每边颗数':4,'黑棋线条数':3,'分条累计黑棋数':12,'重复计数':2,'实际黑棋数':10,'白棋数':6,'总棋子数':16};
for(const row of square.sum)assert.equal(chessValues[row.terms[0]]+chessValues[row.terms[1]],chessValues[row.result]);
for(const row of square.product)assert.equal(chessValues[row.terms[0]]*chessValues[row.terms[1]],chessValues[row.result]);
assert(square.sum.some(r=>r.terms.includes('实际黑棋数')&&r.terms.includes('重复计数')&&r.result==='分条累计黑棋数'));
assert(square.product.some(r=>r.terms.includes('每边颗数')&&r.terms.includes('黑棋线条数')&&r.result==='分条累计黑棋数'));
const diamonds=model('G9-09');assert(diamonds.sum.some(r=>r.terms.includes('小菱形数')&&r.terms.includes('相差个数')&&r.result==='大菱形数'));
const warehouse=model('L7-H2');assert(warehouse.tokens.some(t=>t.id==='甲原有蔬菜'));assert(!warehouse.tokens.some(t=>t.id.includes('粮食')));

// Per-item prices must first be converted to per-set costs before adding them.
const stationery=model('G10-06');
assert(stationery.sum.some(r=>r.terms.includes('每套中A费用')&&r.terms.includes('每套中B费用')&&r.result==='组合单价'));
assert(!stationery.sum.some(r=>r.terms.includes('A单价')&&r.terms.includes('B单价')));
assert(stationery.product.some(r=>r.terms.includes('A单价')&&r.terms.includes('每套A件数')&&r.result==='每套中A费用'));
assert(stationery.product.some(r=>r.terms.includes('B单价')&&r.terms.includes('每套B件数')&&r.result==='每套中B费用'));

// Preserve distinct positive loss amount and signed profit in the two-shirt model.
const shirts=model('L8-H1'),shirtValues={
 '盈利件进价':192,'盈利件利润':48,'盈利件售价':240,
 '亏损件售价':240,'亏损额':80,'亏损件进价':320,'亏损件利润':-80,'总利润':-32,
 '盈利件售价倍数':1.25,'亏损件售价倍数':0.75,'盈利率':0.25,'亏损率':0.25,
};
for(const row of shirts.sum)assert.equal(shirtValues[row.terms[0]]+shirtValues[row.terms[1]],shirtValues[row.result]);
for(const row of shirts.product)assert.equal(shirtValues[row.terms[0]]*shirtValues[row.terms[1]],shirtValues[row.result]);
assert(shirts.notes.some(n=>n.includes('负数')));

// Triangle feasibility and equal-pan constraints are not disguised as additive equalities.
const triangle=model('G9-02');assert(triangle.notes.some(n=>n.includes('大于')));
const balance=model('TB-I03');assert(!balance.tokens.some(t=>t.id.includes('右盘小球')),'Do not invent an absent right-pan ball quantity');
assert.equal(model('TB-I08').sum.length,2,'Both occupied pans retain their own sum relation');
assert.equal(model('TB-A32').sum.length,0,'A cylinder side-to-edge correspondence is not an additive equation');
assert(model('TB-A32').notes.some(n=>n.includes('一一对应')));

// Several factors are split into binary products, never written as an unfillable prose card.
const cylinder=model('TB-A32');
assert(cylinder.product.some(r=>r.terms[0]==='底面半径'&&r.terms[1]==='底面半径'));
assert(cylinder.product.some(r=>r.terms.includes('底面积')&&r.terms.includes('圆柱高')&&r.result==='容积'));
const mixture=model('TB-R09');assert.equal(mixture.sum.length,2,'Three-component totals need two binary sums');
const calendar=model('TB-R01');assert(calendar.sum.some(r=>r.result==='十字左右日期和')&&calendar.sum.some(r=>r.result==='十字上下日期和'));
assert.throws(()=>R.build({id:'missing'},{id:'missing'}),/缺少数量关系配置/,'Unmapped content must not silently invent a relation');
console.log('PASS quantity relationship cards:',JSON.stringify(counts));
console.log('Verified all routes, reversible left terms, arbitrary row order, fixed result roles, reusable quantities, absent relations and multi-step sums/products.');
