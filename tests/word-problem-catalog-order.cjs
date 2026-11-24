/* Distinct navigation rules: complete textbook positions versus supplementary topics. */
'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems');
const load=name=>require(path.join(base,name+'.js'));
const data=['data-l7-l8','data-l9-review','data-textbook-intro','data-textbook-applications','data-textbook-review','data-pep-foundations','data-pep-applications','data-pep-review','data-chapter-2021'].flatMap(load);
const C=load('catalog'),index=load('textbook-index'),supplement=load('supplement-index');
const before=JSON.stringify({data,index,supplement});
const textbook=C.forBook(data,index,supplement);
assert.equal(textbook.book,'textbook');
assert.equal(textbook.itemCount,81);assert.equal(textbook.taskCount,79);
assert.deepEqual(textbook.groups.map(group=>group.label),['第4章章引入','4.1 等式与方程','4.2 一元一次方程及其解法','4.3 用一元一次方程解决问题','数学探究','小结与思考','复习题']);
const expectedLocations=[...Array.from({length:22},(_,i)=>'I'+String(i).padStart(2,'0')),...Array.from({length:37},(_,i)=>'A'+String(i+1).padStart(2,'0')),...Array.from({length:22},(_,i)=>'R'+String(i+1).padStart(2,'0'))];
assert.deepEqual(textbook.rows.map(row=>row.locationId),expectedLocations,'Every position, including the inserted I11 reference, follows the original book');
assert.equal(new Set(textbook.rows.map(row=>row.locationId)).size,81);
for(let i=1;i<textbook.rows.length;i++)assert(Math.min(...textbook.rows[i].pages)>=Math.min(...textbook.rows[i-1].pages),'Printed pages are nondecreasing');
const reference=textbook.rows.find(row=>row.locationId==='I11');
assert(reference.reference);assert.equal(reference.category,'section-4-1');assert.equal(reference.problem.id,'TB-I11');
assert.equal(C.select(textbook.rows,{category:'section-4-1'}).length,17);
for(const [id,locations] of [['G10-01',['I00','A16']],['G9-06',['I21','A13']]]){
 const positions=textbook.rows.filter(row=>row.problem.id===id);
 assert.deepEqual(positions.map(row=>row.locationId),locations);
 assert.equal(positions[0].problem,positions[1].problem,'Repeated positions share the same task and routes');
 assert.deepEqual(positions[0].locations.map(s=>s.id),locations,'Every position keeps the full source lookup');
}
assert.deepEqual(C.select(textbook.rows,{query:'126 鸡兔'}).map(row=>row.locationId),['A16'],'A page search identifies the current source position');
assert.equal(textbook.filterLabel,'选择教材内容');assert.equal(textbook.allLabel,'全部教材内容');

const guide=C.forBook(data,index,supplement,'guide');
assert.equal(guide.itemCount,82);assert.equal(guide.taskCount,82);
assert.equal(guide.groups.length,6);assert.deepEqual(guide.groups.map(g=>g.id),C.categories.map(c=>c.id));
assert.equal(new Set(guide.rows.map(row=>row.problem.id)).size,82);
assert(guide.rows.every(row=>row.book==='guide'&&row.category===row.topicId));
assert.equal(C.select(guide.rows,{category:'fees'}).length,9);
assert(C.select(guide.rows,{query:'人教版 110'}).some(row=>row.problem.id==='S10'),'Merged PEP page searches still find the representative');
const topicOrder=new Map(C.categories.map((category,i)=>[category.id,i]));
for(let i=1;i<guide.rows.length;i++)assert(topicOrder.get(guide.rows[i].category)>=topicOrder.get(guide.rows[i-1].category));
assert.equal(guide.filterLabel,'选择题型');assert.equal(guide.allLabel,'全部题型');
assert.equal(C.build(data,index,supplement).length,161,'The original identity-level coverage API stays compatible');
assert.equal(JSON.stringify({data,index,supplement}),before,'Catalog navigation never edits problem, route, source or progress identities');
console.log('PASS textbook order: 81 source positions / 79 tasks in 7 book sections; supplement: 82 tasks in 6 topics; shared identities, source search and original coverage preserved.');
