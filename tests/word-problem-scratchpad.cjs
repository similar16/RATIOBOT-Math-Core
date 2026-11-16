/* Scratch pages stay local: real DOM input with a small asynchronous IndexedDB/canvas fixture. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const source=fs.readFileSync(path.resolve(process.env.SITE_DIR||'site','word-problems/scratchpad.js'),'utf8');
const copy=value=>value===undefined?undefined:structuredClone(value);
const delay=()=>new Promise(resolve=>setTimeout(resolve,0));

function indexedDBFixture(){
 const databases=new Map();
 function database(name){
  if(databases.has(name))return databases.get(name);
  const stores=new Map();
  const db={stores,objectStoreNames:{contains:name=>stores.has(name)},createObjectStore(name,options={}){const value={keyPath:options.keyPath||'key',rows:new Map()};stores.set(name,value);return value;},close(){},transaction(name,mode){
   if(Array.isArray(name))name=name[0];
   if(!stores.has(name))throw Error('Unknown object store '+name);
   const state=stores.get(name),tx={mode,error:null,pending:0,completeScheduled:false};
   function request(action){
    const req={result:undefined,error:null};tx.pending++;
    setTimeout(()=>{
     try{req.result=action();req.onsuccess?.({target:req});}catch(error){req.error=error;tx.error=error;req.onerror?.({target:req});tx.onerror?.({target:tx});}
     tx.pending--;
     if(!tx.pending&&!tx.completeScheduled){tx.completeScheduled=true;setTimeout(()=>{tx.oncomplete?.({target:tx});},0);}
    },0);
    return req;
   }
   tx.objectStore=()=>({get:key=>request(()=>copy(state.rows.get(key))),put:value=>request(()=>{const cloned=copy(value);state.rows.set(cloned[state.keyPath],cloned);return cloned[state.keyPath];}),delete:key=>request(()=>state.rows.delete(key))});
   tx.abort=()=>{tx.error=Error('Transaction aborted');tx.onabort?.({target:tx});};
   return tx;
  }};
  databases.set(name,db);return db;
 }
 return {
  open(name){const req={result:undefined,error:null};const existed=databases.has(name);setTimeout(()=>{req.result=database(name);if(!existed)req.onupgradeneeded?.({target:req,oldVersion:0,newVersion:1});req.onsuccess?.({target:req});},0);return req;},
  record(key){return copy(databases.get('ratiobot-word-problem-scratchpad')?.stores.get('pages')?.rows.get(key));},
  records(){return [...(databases.get('ratiobot-word-problem-scratchpad')?.stores.get('pages')?.rows.values()||[])].map(copy);}
 };
}

function fixture(idb){
 const dom=new JSDOM('<!doctype html><div id="host"></div>',{url:'https://test.invalid/RATIOBOT-Math-Core/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,host=w.document.querySelector('#host'),paints=[],observers=[];let width=450;
 w.structuredClone=copy;
 if(idb)Object.defineProperty(w,'indexedDB',{value:idb,configurable:true});
 Object.defineProperty(w,'devicePixelRatio',{value:2,configurable:true});
 const context={};
 for(const name of ['setTransform','resetTransform','clearRect','fillRect','beginPath','closePath','moveTo','lineTo','stroke','arc','fill','save','restore','scale','translate','drawImage','setLineDash'])context[name]=(...args)=>paints.push([name,...args]);
 w.HTMLCanvasElement.prototype.getContext=()=>context;
 w.HTMLCanvasElement.prototype.setPointerCapture=function(){};
 w.HTMLCanvasElement.prototype.releasePointerCapture=function(){};
 w.HTMLCanvasElement.prototype.hasPointerCapture=()=>true;
 w.HTMLElement.prototype.scrollIntoView=function(){};
 w.HTMLElement.prototype.getBoundingClientRect=function(){return {left:10,top:20,right:10+width,bottom:20+width*4/3,width,height:width*4/3,x:10,y:20,toJSON(){return this;}};};
 w.ResizeObserver=class {constructor(callback){this.callback=callback;this.active=true;observers.push(this);}observe(){}unobserve(){}disconnect(){this.active=false;}};
 w.eval(source+'\n//# sourceURL=scratchpad.js');
 const changes=[];
 const mount=key=>w.RatioWordProblemScratchpad.mount(host,{key,onChange:state=>changes.push(copy(state)),headingHTML:'<h3>草稿纸测试</h3>'});
 const click=kind=>{const b=host.querySelector('[data-wp-ink="'+kind+'"]');assert(b,'Missing '+kind);b.click();};
 function pointer(canvas,type,x,y,patch={}){const e=new w.Event(type,{bubbles:true,cancelable:true});Object.assign(e,{clientX:x+10,clientY:y+20,pointerId:1,pointerType:'pen',button:0,buttons:type==='pointerup'?0:1,isPrimary:true,pressure:0.5,...patch});canvas.dispatchEvent(e);}
 const stroke=(points=[[20,30],[70,90]],patch={})=>{const canvas=host.querySelector('canvas');assert(canvas);pointer(canvas,'pointerdown',...points[0],patch);for(const point of points.slice(1))pointer(canvas,'pointermove',...point,patch);pointer(canvas,'pointerup',...points.at(-1),patch);};
 const resize=async next=>{width=next;for(const o of observers)if(o.active)o.callback([{target:host,contentRect:{width,height:width*4/3}}]);w.dispatchEvent(new w.Event('resize'));await new Promise(resolve=>w.requestAnimationFrame(resolve));};
 return {dom,w,host,mount,click,stroke,pointer,resize,changes,paints,close:()=>w.close()};
}

async function main(){
 const db=indexedDBFixture(),f=fixture(db);
 const key=JSON.stringify(['class-a::46','wp-stable-scratch','L7-P1','sets']);
 let api=f.mount(key);await api.ready;
 assert(f.host.querySelector('canvas.wp-scratchpad-canvas'));
 f.stroke();let saved=await api.flush();assert.equal(saved.saved,true);assert.equal(saved.storage,'indexeddb');
 let row=db.record(key);assert(row);assert.equal(row.version,1);assert.equal(row.width,900);assert.equal(row.height,1200);assert.equal(row.strokes.length,1);assert.equal(row.strokes[0].mode,'pen');assert(row.strokes[0].points.length>=2);
 const firstStroke=copy(row.strokes[0]);assert.deepEqual(firstStroke.points[0],[40,60],'Pointer positions use the fixed 900 × 1200 logical paper');
 f.click('erase');f.stroke([[40,60],[90,110]]);await api.flush();row=db.record(key);assert.equal(row.strokes.length,2);assert.equal(row.strokes[1].mode,'erase');
 f.click('undo');await api.flush();row=db.record(key);assert.deepEqual(row.strokes,[firstStroke]);assert.equal(row.redo.length,1);
 f.click('redo');await api.flush();row=db.record(key);assert.equal(row.strokes.length,2);assert.equal(row.redo.length,0);
 const beforeClear=copy(row.strokes);
 f.click('clear');await api.flush();row=db.record(key);assert.equal(row.strokes.at(-1).mode,'clear');
 f.click('undo');await api.flush();assert.deepEqual(db.record(key).strokes,beforeClear,'Clearing must remain undoable');
 f.click('redo');await api.flush();assert.equal(db.record(key).strokes.at(-1).mode,'clear');
 f.click('undo');await api.flush();
 const beforeGrid=db.record(key).grid;f.click('grid');await api.flush();assert.notEqual(db.record(key).grid,beforeGrid);
 const logical=copy(db.record(key).strokes),paintCount=f.paints.length;
 await f.resize(225);await api.flush();assert.deepEqual(db.record(key).strokes,logical,'Viewport changes must not change logical ink coordinates');assert(f.paints.length>paintCount,'Resize redraws the existing page');
 const staleCanvas=f.host.querySelector('canvas'),finalSaved=copy(db.record(key));
 f.w.document.body.style.overflow='auto';f.click('expand');assert.equal(f.w.document.body.style.overflow,'hidden');assert(f.host.classList.contains('wp-scratchpad-expanded'));
 const destroyed=await api.destroy();assert.equal(destroyed.saved,true);assert.equal(destroyed.storage,'indexeddb');
 assert.equal(f.w.document.body.style.overflow,'auto');assert(!f.w.document.querySelector('.wp-scratchpad-shade'));assert(!f.host.classList.contains('wp-scratchpad-expanded'));
 const afterDestroy=f.changes.length;
 f.pointer(staleCanvas,'pointerdown',15,20);f.pointer(staleCanvas,'pointermove',30,40);f.pointer(staleCanvas,'pointerup',30,40);await delay();
 assert.equal(f.changes.length,afterDestroy,'Detached scratchpad must stop responding to input');assert.deepEqual(db.record(key).strokes,finalSaved.strokes);
 f.close();

 const reopened=fixture(db);api=reopened.mount(key);await api.ready;await api.flush();assert.deepEqual(db.record(key).strokes,logical,'The same private page reloads after a fresh DOM session');
 assert(reopened.paints.some(p=>p[0]==='lineTo'||p[0]==='arc'),'Saved ink is painted when reloaded');
 await api.destroy();reopened.close();
 const otherKeys=[
  JSON.stringify(['class-b::46','wp-stable-scratch','L7-P1','sets']),
  JSON.stringify(['class-a::46','wp-new-scratch','L7-P1','sets']),
  JSON.stringify(['class-a::46','wp-stable-scratch','L7-P2','sets']),
  JSON.stringify(['class-a::46','wp-stable-scratch','L7-P1','cups'])
 ];
 for(const [i,otherKey]of otherKeys.entries()){
  const other=fixture(db),page=other.mount(otherKey);await page.ready;other.stroke([[10+i,20],[40,60]]);await page.flush();
  assert.equal(db.record(otherKey).strokes.length,1,'A different owner, analysis, problem or route starts with its own page');
  assert.deepEqual(db.record(key).strokes,logical,'Saving another page cannot overwrite the original page');
  await page.destroy();other.close();
 }
 assert.equal(db.records().length,5);

 const offline=fixture(null),memory=offline.mount(JSON.stringify(['class-c::46','wp-offline','L7-P1','sets']));await memory.ready;offline.stroke();
 const unsaved=await memory.flush();assert.equal(unsaved.saved,false);assert.equal(unsaved.storage,'memory');assert(offline.changes.some(c=>c.storage==='memory'));
 await memory.destroy();offline.close();
 console.log('PASS local scratchpad: IndexedDB save/reload, owner/run/problem/route isolation, pen and eraser, undo/redo, reversible clear, resize, destroy and memory fallback');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
