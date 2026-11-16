'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems');
const source=fs.readFileSync(path.join(base,'relation-builder.js'),'utf8');
const model={sum:[{terms:['原有数量','增加数量'],result:'现有数量'},{terms:['甲的数量','乙的数量'],result:'现有数量'}],product:[{terms:['边长','边长'],result:'面积'}],tokens:['原有数量','增加数量','现有数量','甲的数量','乙的数量','边长','面积'].map(label=>({id:label,label}))};
function fixture(){
 const dom=new JSDOM('<section id="wordProblems"></section>',{runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,host=w.document.querySelector('section'),writes=[];w.eval(source);
 const ui=w.RatioWordProblemRelationBuilder.mount(host,{model,answers:{},seed:'student-run-41',onChange:value=>writes.push(JSON.parse(JSON.stringify(value)))});
 const bank=id=>[...host.querySelectorAll('[data-wp-token]')].find(b=>b.dataset.wpToken===id);
 const slot=key=>host.querySelector('[data-wp-rel-slot="'+key+'"]');
 const tap=(id,key)=>{bank(id).click();slot(key).click();};
 function event(type,props={}){const event=new w.Event(type,{bubbles:true,cancelable:true});for(const [key,value]of Object.entries(props))Object.defineProperty(event,key,{value});return event;}
 return {w,host,ui,writes,bank,slot,tap,event,close(){ui.destroy();dom.window.close();}};
}
// Empty tasks do not reveal answers; cards are randomized once per run and remain reusable.
const tapping=fixture();
assert.equal(tapping.host.querySelectorAll('[data-wp-rel-slot][data-filled="false"]').length,9);
const shuffled=[...tapping.host.querySelectorAll('[data-wp-token]')].map(x=>x.dataset.wpToken);
assert.notDeepEqual(shuffled,model.tokens.map(t=>t.id));
tapping.tap('边长','product:0:0');tapping.tap('边长','product:0:1');tapping.tap('面积','product:0:2');
assert.deepEqual(tapping.writes.at(-1).product,[['边长','边长','面积']]);
assert.deepEqual([...tapping.host.querySelectorAll('[data-wp-token]')].map(x=>x.dataset.wpToken),shuffled,'Placing cards does not reshuffle the bank');
tapping.tap('原有数量','sum:0:0');tapping.tap('增加数量','sum:0:1');
const previous=JSON.stringify(tapping.writes.at(-1));
tapping.slot('sum:0:0').click();tapping.slot('sum:0:1').click();
assert.deepEqual(tapping.writes.at(-1).sum[0],['增加数量','原有数量','']);
assert.equal(JSON.stringify(tapping.writes.at(-2)),previous,'Later placements cannot mutate earlier saved snapshots');
tapping.slot('sum:0:1').dispatchEvent(new tapping.w.KeyboardEvent('keydown',{key:'Delete',bubbles:true,cancelable:true}));
assert.equal(tapping.writes.at(-1).sum[0][1],'');
tapping.close();
// Native drag/drop copies an actual bank card and ignores arbitrary external content.
const native=fixture(),data=new Map(),transfer={effectAllowed:'',dropEffect:'',setData:(key,value)=>data.set(key,value),getData:key=>data.get(key)||''};
native.bank('现有数量').dispatchEvent(native.event('dragstart',{dataTransfer:transfer}));
const over=native.event('dragover',{dataTransfer:transfer});native.slot('sum:1:2').dispatchEvent(over);assert(over.defaultPrevented);
native.slot('sum:1:2').dispatchEvent(native.event('drop',{dataTransfer:transfer}));
assert.equal(native.writes.at(-1).sum[1][2],'现有数量');
const before=native.writes.length;
native.slot('sum:1:1').dispatchEvent(native.event('drop',{dataTransfer:{getData:()=>JSON.stringify({id:'没有的量'})}}));
assert.equal(native.writes.length,before,'Unknown quantities are not accepted from outside the task');native.close();
// Touch pointer dragging reaches the same slots and cleans up its floating label.
const touch=fixture();let destination=touch.slot('sum:0:0');touch.w.document.elementFromPoint=()=>destination;
touch.bank('甲的数量').dispatchEvent(touch.event('pointerdown',{pointerId:1,pointerType:'touch',button:0,clientX:20,clientY:20}));
touch.w.document.dispatchEvent(touch.event('pointermove',{pointerId:1,pointerType:'touch',clientX:90,clientY:150}));
assert(touch.host.querySelector('.wp-drag-ghost'));
touch.w.document.dispatchEvent(touch.event('pointerup',{pointerId:1,pointerType:'touch',clientX:90,clientY:150}));
assert.equal(touch.writes.at(-1).sum[0][0],'甲的数量');assert(!touch.host.querySelector('.wp-drag-ghost'));
touch.bank('乙的数量').dispatchEvent(touch.event('pointerdown',{pointerId:2,pointerType:'touch',button:0,clientX:20,clientY:20}));
touch.w.document.dispatchEvent(touch.event('pointermove',{pointerId:2,pointerType:'touch',clientX:90,clientY:150}));
const saved=touch.writes.length;touch.ui.destroy();
touch.w.document.dispatchEvent(touch.event('pointerup',{pointerId:2,pointerType:'touch',clientX:90,clientY:150}));
assert.equal(touch.writes.length,saved,'Leaving a task cancels an unfinished pointer drag');assert(!touch.host.querySelector('.wp-drag-ghost'));touch.close();
console.log('PASS relation builder: randomized reusable cards, tap placement, swapping, keyboard removal, native drag, touch drag and cleanup');
