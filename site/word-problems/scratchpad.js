/* Local vector working paper. No recognition, score submission, or cloud-image payload. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioWordProblemScratchpad=api;})(typeof window==='undefined'?globalThis:window,function(){'use strict';
 const DB_NAME='ratiobot-word-problem-scratchpad',STORE='pages',WIDTH=900,HEIGHT=1200;
 const MAX_POINTS=160000,MAX_ACTIONS=1800,MAX_SESSION_POINTS=500000,MAX_CACHE=12,MAX_PIXELS=2000000;
 const entries=new Map(),mounts=new WeakMap(),databases=new WeakMap();let expanded=null;
 const empty=()=>({strokes:[],redo:[],grid:false});
 const countPoints=s=>[...s.strokes,...s.redo].reduce((n,a)=>n+a.points.length,0);
 function validate(record,key){
  if(!record||record.key!==key||record.version!==1||record.width!==WIDTH||record.height!==HEIGHT||!Array.isArray(record.strokes)||!Array.isArray(record.redo))throw Error('草稿格式暂不支持');
  if(record.strokes.length+record.redo.length>MAX_ACTIONS)throw Error('已有草稿超出画板容量');
  let points=0;
  const actions=list=>list.map(a=>{
   if(!a||!['pen','erase','clear'].includes(a.mode)||!Array.isArray(a.points)||(a.mode==='clear'&&a.points.length))throw Error('草稿数据不完整');
   points+=a.points.length;if(points>MAX_POINTS)throw Error('已有草稿超出画板容量');
   return {mode:a.mode,points:a.points.map(p=>{if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)||p[0]<0||p[0]>WIDTH||p[1]<0||p[1]>HEIGHT)throw Error('草稿坐标不完整');return [...p];})};
  });
  return {strokes:actions(record.strokes),redo:actions(record.redo),grid:!!record.grid};
 }
 function openDatabase(win){
  const factory=win.indexedDB;if(!factory||typeof factory.open!=='function')return Promise.reject(Error('本机存储不可用'));
  if(databases.has(factory))return databases.get(factory);
  const promise=new Promise((resolve,reject)=>{
   let request,settled=false;const finish=(error,db)=>{if(settled){db?.close?.();return;}settled=true;win.clearTimeout(timer);error?reject(error):resolve(db);};
   const timer=win.setTimeout(()=>finish(Error('本机存储响应超时')),5000);
   try{request=factory.open(DB_NAME,1);}catch(error){finish(error);return;}
   request.onupgradeneeded=()=>{try{const db=request.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'key'});}catch(error){finish(error);}};
   request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();databases.delete(factory);};finish(null,db);};
   request.onerror=()=>finish(request.error||Error('本机存储未能打开'));
   request.onblocked=()=>finish(Error('本机存储正在被其他页面占用'));
  });
  databases.set(factory,promise);return promise;
 }
 function readRecord(db,key){return new Promise((resolve,reject)=>{
  let tx,result;try{tx=db.transaction(STORE,'readonly');const req=tx.objectStore(STORE).get(key);req.onsuccess=()=>{result=req.result;};req.onerror=()=>reject(req.error||Error('草稿读取失败'));tx.oncomplete=()=>resolve(result);tx.onabort=tx.onerror=()=>reject(tx.error||Error('草稿读取失败'));}catch(error){reject(error);}
 });}
 function writeRecord(db,record){return new Promise((resolve,reject)=>{
  let tx;try{tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(record);tx.oncomplete=()=>resolve();tx.onabort=tx.onerror=()=>reject(tx.error||Error('草稿保存失败'));}catch(error){try{tx?.abort();}catch{}reject(error);}
 });}
 function sessionPoints(){return [...entries.values()].reduce((n,e)=>n+e.points,0);}
 function trimCache(){
  for(const [key,e]of entries){if(entries.size<=MAX_CACHE&&sessionPoints()<MAX_SESSION_POINTS*.7)break;if(!e.active&&!e.loading&&e.storage==='indexeddb'&&e.savedRevision>=e.revision&&!e.saving)entries.delete(key);}
 }
 function publish(entry,reason){for(const f of entry.listeners)try{f(reason);}catch{};}
 function entryFor(win,key){
  let e=entries.get(key);if(e){entries.delete(key);entries.set(key,e);return e;}
  e={key,state:empty(),revision:0,inkRevision:0,savedRevision:0,points:0,active:0,storage:'loading',loading:true,canPersist:true,db:null,error:'',listeners:new Set(),saving:0,chain:Promise.resolve()};entries.set(key,e);
  e.ready=(async()=>{
   try{
    const db=await openDatabase(win),raw=await readRecord(db,key),saved=raw?validate(raw,key):null;
    if(saved){
     // Ink written while IndexedDB opens stays above restored ink. Never replace new strokes.
     if(e.inkRevision){e.state.strokes=[...saved.strokes,...e.state.strokes];}
     else{e.state.strokes=saved.strokes;e.state.redo=saved.redo;}
     if(!e.revision)e.state.grid=saved.grid;
     e.points=countPoints(e.state);
    }
    e.db=db;
    if(e.points>MAX_POINTS||e.state.strokes.length+e.state.redo.length>MAX_ACTIONS){e.storage='memory';e.canPersist=false;e.error='旧草稿与新笔迹合并后超出容量，全部笔迹仍保留在本页';}
    else e.storage='indexeddb';
   }catch(error){e.storage='memory';e.canPersist=false;e.error='本机草稿暂时无法读取或保存';}
   e.loading=false;publish(e,'load');trimCache();return {storage:e.storage};
  })();
  return e;
 }
 function snapshot(entry){return {key:entry.key,version:1,width:WIDTH,height:HEIGHT,strokes:entry.state.strokes.map(s=>({mode:s.mode,points:s.points.map(p=>[...p])})),redo:entry.state.redo.map(s=>({mode:s.mode,points:s.points.map(p=>[...p])})),grid:entry.state.grid,updatedAt:new Date().toISOString()};}
 function persist(entry){
  entry.saving++;
  const job=entry.chain.catch(()=>{}).then(async()=>{
   await entry.ready;
   if(!entry.canPersist||!entry.db)return {saved:false,storage:'memory'};
   if(entry.savedRevision>=entry.revision)return {saved:true,storage:'indexeddb'};
   const revision=entry.revision,record=snapshot(entry);publish(entry,'saving');
   try{await writeRecord(entry.db,record);entry.savedRevision=Math.max(entry.savedRevision,revision);entry.storage='indexeddb';entry.error='';publish(entry,'save');return {saved:entry.savedRevision>=entry.revision,storage:entry.storage};}
   catch(error){entry.storage='memory';entry.canPersist=false;entry.error='本机草稿保存未完成';publish(entry,'storage-error');return {saved:false,storage:'memory'};}
  });
  entry.chain=job;
  return job.finally(()=>{entry.saving--;trimCache();});
 }
 function mount(host,options={}){
  if(!host||!host.ownerDocument)throw TypeError('需要一个草稿纸容器');
  if(typeof options.key!=='string'||!options.key)throw TypeError('草稿纸需要独立的账号、题目与设元标识');
  mounts.get(host)?.destroy();
  const doc=host.ownerDocument,win=doc.defaultView,e=entryFor(win,options.key),state=e.state;
  e.active++;let dead=false,mode='pen',stroke=null,pointer=null,painted=0,raf=null,saveTimer=null,resizeFrame=null,isExpanded=false,shade=null,oldOverflow='',limitMessage='';
  const cleanups=[],on=(node,name,fn,opts)=>{node.addEventListener(name,fn,opts);cleanups.push(()=>node.removeEventListener(name,fn,opts));};
  const requestFrame=fn=>win.requestAnimationFrame?win.requestAnimationFrame(fn):win.setTimeout(fn,16),cancelFrame=id=>{if(id!==null)(win.cancelAnimationFrame?win.cancelAnimationFrame(id):win.clearTimeout(id));};
  host.classList.add('wp-scratchpad');
  host.innerHTML='<div class="wp-scratchpad-heading"><div><h4>草稿纸</h4><p>用鼠标、手指或笔写下解方程的过程.</p></div><button type="button" class="wp-secondary" data-wp-ink="expand" aria-expanded="false">放大草稿纸</button></div>'+(options.headingHTML?'<div class="wp-scratchpad-equations" aria-label="已列方程">'+options.headingHTML+'</div>':'')+'<div class="wp-scratchpad-toolbar" role="group" aria-label="草稿工具"><button type="button" data-wp-ink="pen" aria-pressed="true">笔</button><button type="button" data-wp-ink="erase" aria-pressed="false">橡皮</button><button type="button" data-wp-ink="undo" aria-label="撤销上一笔或清空">撤销</button><button type="button" data-wp-ink="redo">重做</button><button type="button" data-wp-ink="clear">清空</button><button type="button" data-wp-ink="grid" aria-pressed="false">方格</button></div><div class="wp-scratchpad-paper-wrap"><canvas class="wp-scratchpad-canvas" width="900" height="1200" tabindex="0" aria-label="手写草稿画板，可用鼠标、手指或笔演算"></canvas></div><p class="wp-scratchpad-status" data-wp-ink-status role="status" aria-live="polite"></p><p class="wp-scratchpad-help">手写内容不自动判分.完成演算后，在下一步填写结果并检验.</p>';
  const canvas=host.querySelector('canvas'),wrap=host.querySelector('.wp-scratchpad-paper-wrap'),status=host.querySelector('[data-wp-ink-status]');let ctx;try{ctx=canvas.getContext('2d');}catch{ctx=null;}
  let inkColor=win.getComputedStyle(host).getPropertyValue('--wp-ink').trim()||'#3E3540';
  let view={width:0,height:0,dpr:1,scale:1,x:0,y:0};
  function notify(reason){if(dead)return;statusText();controls();if(typeof options.onChange==='function')options.onChange({reason,dirty:e.revision>e.savedRevision,saved:e.storage==='indexeddb'&&e.savedRevision>=e.revision,storage:e.storage,strokes:state.strokes.length});}
  function statusText(){
   let text=e.loading?'正在读取本机草稿；现在写下的笔迹也会保留.':e.storage==='memory'?(e.error?e.error+'.':'')+'草稿仅暂存在当前页面内存，刷新或关闭页面可能丢失；原有本机草稿不会被覆盖.':e.savedRevision<e.revision?'草稿正在保存到本机…':'草稿已保存在本机，仅用于本题当前设元.';
   if(!ctx)text='当前浏览器无法打开手写画板.';
   if(limitMessage)text=limitMessage+' '+text;
   status.textContent=text;status.dataset.storage=e.storage;
  }
  function controls(){
   host.querySelector('[data-wp-ink="undo"]').disabled=!state.strokes.length;
   host.querySelector('[data-wp-ink="redo"]').disabled=!state.redo.length;
   host.querySelector('[data-wp-ink="clear"]').disabled=!state.strokes.length||state.strokes.at(-1)?.mode==='clear';
   host.querySelector('[data-wp-ink="grid"]').setAttribute('aria-pressed',String(state.grid));canvas.classList.toggle('with-grid',state.grid);
   if(!ctx)host.querySelectorAll('[data-wp-ink]').forEach(b=>{if(b.dataset.wpInk!=='expand')b.disabled=true;});
  }
  function mark(reason,ink=true){e.revision++;if(ink)e.inkRevision++;e.points=countPoints(state);limitMessage='';notify(reason);queueSave();}
  function queueSave(){if(dead||saveTimer!==null)return;saveTimer=win.setTimeout(()=>{saveTimer=null;void persist(e).then(()=>{if(!dead){statusText();if(e.storage==='indexeddb'&&e.savedRevision<e.revision)queueSave();}});},650);}
  function setTransform(){ctx.setTransform(view.dpr*view.scale,0,0,view.dpr*view.scale,view.dpr*view.x,view.dpr*view.y);}
  function drawAction(action,start=0){
   if(action.mode==='clear'){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.restore();return;}
   if(!action.points.length)return;ctx.globalCompositeOperation=action.mode==='erase'?'destination-out':'source-over';ctx.strokeStyle=inkColor;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=action.mode==='erase'?40:5;
   const points=action.points,from=Math.max(0,start-1);ctx.beginPath();ctx.moveTo(points[from][0],points[from][1]);for(let i=from+1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);if(points.length===1)ctx.lineTo(points[0][0]+.01,points[0][1]+.01);ctx.stroke();ctx.globalCompositeOperation='source-over';
  }
  function redraw(){if(dead||!ctx)return;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);setTransform();for(const action of state.strokes)drawAction(action);if(stroke)painted=stroke.points.length;controls();}
  function incremental(){raf=null;if(dead||!ctx||!stroke||painted>=stroke.points.length)return;setTransform();drawAction(stroke,painted);painted=stroke.points.length;}
  function paintSoon(){if(raf===null)raf=requestFrame(incremental);}
  function resize(){
   if(dead||!ctx||!host.isConnected)return;
   const available=wrap.getBoundingClientRect(),style=win.getComputedStyle(wrap),usableWidth=available.width-(parseFloat(style.paddingLeft)||0)-(parseFloat(style.paddingRight)||0),usableHeight=available.height-(parseFloat(style.paddingTop)||0)-(parseFloat(style.paddingBottom)||0),width=isExpanded?Math.min(usableWidth,usableHeight*WIDTH/HEIGHT):Math.min(usableWidth,450);
   if(!Number.isFinite(width)||width<1)return;
   canvas.style.width=width+'px';canvas.style.height=(width*HEIGHT/WIDTH)+'px';
   const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;
   const dpr=Math.min(win.devicePixelRatio||1,2,Math.sqrt(MAX_PIXELS/(box.width*box.height))),scale=Math.min(box.width/WIDTH,box.height/HEIGHT);
   const next={width:box.width,height:box.height,dpr,scale,x:(box.width-WIDTH*scale)/2,y:(box.height-HEIGHT*scale)/2};
   const changed=Object.keys(next).some(k=>next[k]!==view[k]);view=next;
   if(changed){canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));inkColor=win.getComputedStyle(host).getPropertyValue('--wp-ink').trim()||'#3E3540';canvas.style.setProperty('--wp-ink-grid',40*scale+'px');canvas.style.backgroundPosition=view.x+'px '+view.y+'px';redraw();}
  }
  function scheduleResize(){if(resizeFrame!==null)return;resizeFrame=requestFrame(()=>{resizeFrame=null;resize();});}
  function point(ev){const r=canvas.getBoundingClientRect();return [Math.max(0,Math.min(WIDTH,(ev.clientX-r.left-view.x)/view.scale)),Math.max(0,Math.min(HEIGHT,(ev.clientY-r.top-view.y)/view.scale))];}
  function hasRoom(action=false){
   trimCache();const actions=state.strokes.length+state.redo.length;
   if((action&&actions>=MAX_ACTIONS)||e.points>=MAX_POINTS||sessionPoints()>=MAX_SESSION_POINTS){limitMessage='草稿已达到当前容量上限，已有笔迹完整保留；暂不能增加新笔迹，可继续撤销、重做或清空.';statusText();return false;}return true;
  }
  function begin(ev){
   if(dead||!ctx||pointer!==null||(ev.button!==undefined&&ev.button>0)||!hasRoom(true))return;
   ev.preventDefault();resize();pointer=ev.pointerId;try{canvas.setPointerCapture(pointer);}catch{}
   stroke={mode,points:[point(ev)]};state.strokes.push(stroke);state.redo=[];painted=0;mark('ink');paintSoon();
  }
  function move(ev){
   if(dead||!stroke||pointer!==ev.pointerId)return;ev.preventDefault();let added=false;
   const events=typeof ev.getCoalescedEvents==='function'?ev.getCoalescedEvents():[ev];
   for(const item of events.length?events:[ev]){
    if(!hasRoom()){finish();return;}
    const p=point(item),last=stroke.points.at(-1);if(Math.hypot(p[0]-last[0],p[1]-last[1])<.7)continue;
    stroke.points.push(p);e.points++;added=true;
   }
   if(added){e.revision++;e.inkRevision++;queueSave();paintSoon();}
  }
  function finish(ev){
   if(pointer===null||(ev&&ev.pointerId!==pointer))return;
   incremental();const captured=pointer;pointer=null;stroke=null;painted=0;try{if(canvas.hasPointerCapture?.(captured))canvas.releasePointerCapture(captured);}catch{}
   notify('ink');queueSave();
  }
  function collapse(focus=true){
   if(!isExpanded)return;isExpanded=false;if(expanded===controller)expanded=null;host.classList.remove('wp-scratchpad-expanded');host.removeAttribute('role');host.removeAttribute('aria-modal');host.removeAttribute('aria-label');shade?.remove();shade=null;doc.body.style.overflow=oldOverflow;
   const button=host.querySelector('[data-wp-ink="expand"]');button.textContent='放大草稿纸';button.setAttribute('aria-expanded','false');if(focus&&!dead)button.focus({preventScroll:true});scheduleResize();
  }
  function expand(){
   finish();if(isExpanded){collapse();return;}expanded?.collapse?.(false);isExpanded=true;expanded=controller;oldOverflow=doc.body.style.overflow;doc.body.style.overflow='hidden';
   shade=doc.createElement('div');shade.className='wp-scratchpad-shade';shade.setAttribute('aria-hidden','true');shade.addEventListener('click',()=>collapse());doc.body.append(shade);
   host.classList.add('wp-scratchpad-expanded');host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.setAttribute('aria-label','放大的解方程草稿纸');const button=host.querySelector('[data-wp-ink="expand"]');button.textContent='收起草稿纸';button.setAttribute('aria-expanded','true');button.focus({preventScroll:true});scheduleResize();
  }
  function command(ev){
   const button=ev.target.closest('[data-wp-ink]');if(!button||!host.contains(button)||button.disabled||dead)return;
   const action=button.dataset.wpInk;finish();
   if(action==='pen'||action==='erase'){mode=action;host.querySelectorAll('[data-wp-ink="pen"],[data-wp-ink="erase"]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));canvas.dataset.tool=mode;return;}
   if(action==='expand'){expand();return;}
   if(action==='undo'&&state.strokes.length){state.redo.push(state.strokes.pop());mark('undo');redraw();}
   else if(action==='redo'&&state.redo.length){state.strokes.push(state.redo.pop());mark('redo');redraw();}
   else if(action==='clear'&&state.strokes.length){if(state.strokes.length+state.redo.length>=MAX_ACTIONS){limitMessage='操作记录已达上限，清空未执行，已有笔迹仍保留.';statusText();return;}state.strokes.push({mode:'clear',points:[]});state.redo=[];mark('clear');redraw();}
   else if(action==='grid'){state.grid=!state.grid;mark('grid',false);}
  }
  function keydown(ev){
   if(!isExpanded)return;
   if(ev.key==='Escape'){ev.preventDefault();collapse();return;}
   if(ev.key==='Tab'){const items=[...host.querySelectorAll('button:not(:disabled),canvas[tabindex]')],first=items[0],last=items.at(-1);if(ev.shiftKey&&doc.activeElement===first){ev.preventDefault();last.focus();}else if(!ev.shiftKey&&doc.activeElement===last){ev.preventDefault();first.focus();}}
  }
  function flush(){finish();if(saveTimer!==null){win.clearTimeout(saveTimer);saveTimer=null;}return persist(e);}
  function destroy(){
   if(dead)return e.chain.then(()=>({saved:e.storage==='indexeddb'&&e.savedRevision>=e.revision,storage:e.storage}));
   finish();const pending=flush();collapse(false);dead=true;cancelFrame(raf);cancelFrame(resizeFrame);raf=resizeFrame=null;if(saveTimer!==null)win.clearTimeout(saveTimer);saveTimer=null;cleanups.forEach(f=>f());observer?.disconnect();e.listeners.delete(listener);e.active--;mounts.delete(host);trimCache();return pending;
  }
  const listener=reason=>{if(dead)return;if(reason==='load'){redraw();if(e.savedRevision<e.revision)queueSave();}notify(reason);};e.listeners.add(listener);
  const controller={ready:e.ready.then(result=>{if(!dead){resize();redraw();statusText();controls();}return result;}),flush,destroy,collapse};mounts.set(host,controller);
  on(canvas,'pointerdown',begin);on(canvas,'pointermove',move);on(canvas,'pointerup',finish);on(canvas,'pointercancel',finish);on(canvas,'lostpointercapture',finish);on(host,'click',command);on(host,'keydown',keydown);on(win,'resize',scheduleResize);on(win,'pagehide',()=>{void flush();});on(doc,'visibilitychange',()=>{if(doc.visibilityState==='hidden')void flush();});
  const observer=typeof win.ResizeObserver==='function'?new win.ResizeObserver(scheduleResize):null;observer?.observe(wrap);
  canvas.dataset.tool=mode;statusText();controls();resize();scheduleResize();return controller;
 }
 // A read-only image of the same saved page, used by practice-record exports.
 async function exportImage(options={}){
  const doc=options.document,win=doc?.defaultView,key=options.key;if(!win||typeof key!=='string'||!key)return null;
  const e=entryFor(win,key);await e.ready;await e.chain.catch(()=>{});
  const actions=e.state.strokes.slice(e.state.strokes.findLastIndex(a=>a.mode==='clear')+1),pens=actions.filter(a=>a.mode==='pen'&&a.points.length);if(!pens.length)return null;
  const canvas=doc.createElement('canvas');canvas.width=WIDTH;canvas.height=HEIGHT;const ctx=canvas.getContext('2d');if(!ctx)return null;
  let left=WIDTH,right=0,top=HEIGHT,bottom=0;
  for(const action of actions){if(!action.points.length)continue;ctx.globalCompositeOperation=action.mode==='erase'?'destination-out':'source-over';ctx.strokeStyle='#352d35';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=action.mode==='erase'?40:5;ctx.beginPath();ctx.moveTo(...action.points[0]);for(const point of action.points.slice(1))ctx.lineTo(...point);if(action.points.length===1)ctx.lineTo(action.points[0][0]+.01,action.points[0][1]+.01);ctx.stroke();if(action.mode==='pen')for(const [x,y]of action.points){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
  left=Math.max(0,Math.floor(left-24));top=Math.max(0,Math.floor(top-24));right=Math.min(WIDTH,Math.ceil(right+24));bottom=Math.min(HEIGHT,Math.ceil(bottom+24));
  const crop=doc.createElement('canvas');crop.width=Math.max(1,right-left);crop.height=Math.max(1,bottom-top);const output=crop.getContext('2d');if(!output)return null;output.fillStyle='#fff';output.fillRect(0,0,crop.width,crop.height);output.drawImage(canvas,left,top,crop.width,crop.height,0,0,crop.width,crop.height);
  return {dataUrl:crop.toDataURL('image/png'),width:crop.width,height:crop.height};
 }
 return {mount,exportImage};
});
