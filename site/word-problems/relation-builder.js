/* Quantity relations: copy from the bank, move between slots, or tap to place. */
(function(root){
 'use strict';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const kinds=['sum','product'];
 const names={sum:'加和关系',product:'乘积关系'};
 function shuffle(tokens,seed){
  const result=tokens.slice();let state=2166136261;
  for(const c of String(seed))state=Math.imul(state^c.charCodeAt(0),16777619)>>>0;
  const random=()=>{state=(state+0x6D2B79F5)>>>0;let n=state;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return ((n^(n>>>14))>>>0)/4294967296;};
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  if(result.length>1&&result.every((t,i)=>t.id===tokens[i].id))result.push(result.shift());
  return result;
 }
 function mount(host,options){
  const {model,seed='',readonly=false,onChange=()=>{}}=options;
  const tokens=new Map((model.tokens||[]).map(t=>[t.id,t.label])),bank=shuffle(model.tokens||[],seed);
  const answers=Object.fromEntries(kinds.map(kind=>[kind,(model[kind]||[]).map((_,i)=>Array.from({length:3},(_,j)=>tokens.has(options.answers?.[kind]?.[i]?.[j])?options.answers[kind][i][j]:''))]));
  let selected=null,drag=null,cleanupPointer=null,suppressClickUntil=0,alive=true;
  const snapshot=()=>Object.fromEntries(kinds.map(k=>[k,answers[k].map(row=>row.slice())]));
  const address=(kind,row,col)=>kind+':'+row+':'+col;
  function parseAddress(value){const m=String(value).match(/^(sum|product):(\d+):([012])$/);return m&&answers[m[1]]?.[Number(m[2])]?{kind:m[1],row:Number(m[2]),col:Number(m[3])}:null;}
  function valueAt(value){const p=parseAddress(value);return p?answers[p.kind][p.row][p.col]:'';}
  function tell(text){const status=host.querySelector('[data-wp-relation-status]');if(status)status.textContent=text;}
  function refreshSelection(){host.querySelectorAll('[data-wp-token]').forEach(b=>b.setAttribute('aria-pressed',String(selected?.id===b.dataset.wpToken&&!selected.from)));host.querySelectorAll('[data-wp-rel-slot]').forEach(b=>b.classList.toggle('is-selected',selected?.from===b.dataset.wpRelSlot));}
  function select(id,from=''){
   if(readonly||!tokens.has(id))return;
   selected=selected?.id===id&&selected.from===from?null:{id,from};refreshSelection();
   tell(selected?'已选“'+tokens.get(id)+'”，再点要放入的框.':'已取消选择.');
  }
  function place(target,payload){
   if(!alive||readonly||!tokens.has(payload?.id))return false;
   const p=parseAddress(target);if(!p)return false;
   if(payload.from&&(!parseAddress(payload.from)||valueAt(payload.from)!==payload.id))return false;
   if(payload.from===target){selected=null;refreshSelection();return true;}
   const old=answers[p.kind][p.row][p.col];
   if(payload.from){const from=parseAddress(payload.from);answers[from.kind][from.row][from.col]=old;}
   answers[p.kind][p.row][p.col]=payload.id;selected=null;drag=null;onChange(snapshot());paint();
   tell('已放入“'+tokens.get(payload.id)+'”.');
   host.querySelector('[data-wp-rel-slot="'+target+'"]')?.focus({preventScroll:true});
   return true;
  }
  function clear(target){const p=parseAddress(target);if(readonly||!p)return;answers[p.kind][p.row][p.col]='';selected=null;onChange(snapshot());paint();tell('已清空这个框.');host.querySelector('[data-wp-rel-slot="'+target+'"]')?.focus({preventScroll:true});}
  function dragPayload(event){
   if(drag)return drag;
   try{const raw=event.dataTransfer?.getData('application/x-ratiobot-quantity');if(raw&&raw.length<2000){const p=JSON.parse(raw);if(tokens.has(p.id))return p;}}catch{}
   return null;
  }
  function bindDraggable(button,payload){
   button.addEventListener('dragstart',event=>{drag=payload;selected=null;refreshSelection();button.classList.add('is-dragging');if(event.dataTransfer){event.dataTransfer.effectAllowed=payload.from?'move':'copy';event.dataTransfer.setData('application/x-ratiobot-quantity',JSON.stringify(payload));event.dataTransfer.setData('text/plain',payload.id);}tell('把“'+tokens.get(payload.id)+'”拖进一个框.');});
   button.addEventListener('dragend',()=>{drag=null;button.classList.remove('is-dragging');host.querySelectorAll('.is-over').forEach(x=>x.classList.remove('is-over'));suppressClickUntil=Date.now()+250;});
   // Pointer dragging keeps the same interaction available on touch screens and pens.
   button.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'||event.button>0)return;
    cleanupPointer?.();const start={x:event.clientX,y:event.clientY},pointerId=event.pointerId;
    let moving=false,ghost=null,over=null,lastMove=null,animation=0;
    const targetAt=e=>{const el=document.elementFromPoint?.(e.clientX,e.clientY)?.closest('[data-wp-rel-slot]');return el&&host.contains(el)?el:null;};
    const updateHover=e=>{const next=targetAt(e);if(next!==over){over?.classList.remove('is-over');next?.classList.add('is-over');over=next;}};
    const autoScroll=()=>{if(!moving||!alive)return;const y=lastMove?.clientY,height=root.innerHeight||0;if(height&&y!=null){const distance=y<64?-Math.ceil((64-y)/5):y>height-64?Math.ceil((y-height+64)/5):0;if(distance){root.scrollBy?.(0,distance);updateHover(lastMove);}}animation=root.requestAnimationFrame?.(autoScroll)||0;};
    const move=e=>{
     if(e.pointerId!==pointerId)return;
     if(!moving&&Math.hypot(e.clientX-start.x,e.clientY-start.y)<7)return;
     e.preventDefault();
     if(!moving){moving=true;drag=payload;selected=null;refreshSelection();ghost=document.createElement('div');ghost.className='wp-drag-ghost';ghost.textContent=tokens.get(payload.id);ghost.setAttribute('aria-hidden','true');host.append(ghost);button.classList.add('is-dragging');animation=root.requestAnimationFrame?.(autoScroll)||0;}
     ghost.style.left=(e.clientX+12)+'px';ghost.style.top=(e.clientY+12)+'px';
     lastMove={clientX:e.clientX,clientY:e.clientY};updateHover(e);
    };
    const clean=()=>{moving=false;if(animation)root.cancelAnimationFrame?.(animation);document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',end);document.removeEventListener('pointercancel',cancel);over?.classList.remove('is-over');ghost?.remove();button.classList.remove('is-dragging');cleanupPointer=null;};
    const end=e=>{if(e.pointerId!==pointerId)return;const wasMoving=moving,target=moving?targetAt(e):null;clean();drag=null;if(wasMoving){e.preventDefault();suppressClickUntil=Date.now()+350;if(target)place(target.dataset.wpRelSlot,payload);else tell('没有放入框内，可以重新拖拽或点选.');}};
    const cancel=()=>{clean();drag=null;};cleanupPointer=cancel;
    document.addEventListener('pointermove',move,{passive:false});document.addEventListener('pointerup',end);document.addEventListener('pointercancel',cancel);
   });
  }
  function slot(kind,row,col){
   const key=address(kind,row,col),id=answers[kind][row][col],name=names[kind]+'第'+(row+1)+'行'+(col===2?'的结果':'的第'+(col+1)+'个量');
   return '<div class="wp-relation-cell"><button type="button" class="wp-relation-slot" data-wp-rel-slot="'+key+'" data-filled="'+Boolean(id)+'" aria-label="'+esc(name+(id?'：'+tokens.get(id):'：空框'))+'"'+(readonly?' disabled':id?' draggable="true"':'')+'>'+esc(id?tokens.get(id):'□')+'</button>'+(!readonly&&id?'<button type="button" class="wp-relation-remove" data-wp-rel-remove="'+key+'" aria-label="清空'+esc(name)+'">×</button>':'')+'</div>';
  }
  function paint(){
   if(!alive)return;cleanupPointer?.();
   host.innerHTML='<div class="wp-relation-builder">'+(!readonly&&bank.length?'<p class="wp-relation-help">把上方的量拖进框里，也可以先点一个量，再点空框.同一个量可以重复使用.</p><div class="wp-relation-bank" role="group" aria-label="可拖拽的数量">'+bank.map(t=>'<button type="button" class="wp-relation-token" data-wp-token="'+esc(t.id)+'" draggable="true" aria-pressed="false">'+esc(t.label)+'</button>').join('')+'</div>':'')+'<div class="wp-relation-pair">'+kinds.map(kind=>'<section class="wp-relation-group" data-kind="'+kind+'"><h4>'+names[kind]+'</h4>'+((model[kind]||[]).length?(model[kind]||[]).map((_,i)=>'<div class="wp-relation-row"><div class="wp-relation-equation" role="group" aria-label="'+names[kind]+'第'+(i+1)+'行">'+slot(kind,i,0)+'<span class="wp-relation-operator">'+(kind==='sum'?'+':'×')+'</span>'+slot(kind,i,1)+'<span class="wp-relation-operator">=</span>'+slot(kind,i,2)+'</div></div>').join(''):'<p class="wp-relation-help">'+esc(model.empty?.[kind]||'本题没有需要单独整理的'+names[kind]+'.')+'</p>')+'</section>').join('')+'</div>'+(!readonly?'<p class="wp-relation-status" data-wp-relation-status role="status" aria-live="polite">同类关系可以交换行；两个加数或两个乘数可以交换位置.</p>':'')+'</div>';
   if(readonly)return;
   host.querySelectorAll('[data-wp-token]').forEach(button=>{const payload={id:button.dataset.wpToken,from:''};button.onclick=()=>{if(Date.now()>=suppressClickUntil)select(payload.id);};bindDraggable(button,payload);});
   host.querySelectorAll('[data-wp-rel-slot]').forEach(button=>{
    const target=button.dataset.wpRelSlot,id=valueAt(target);
    button.onclick=()=>{if(Date.now()<suppressClickUntil)return;if(selected)place(target,selected);else if(id)select(id,target);else tell('先选择上方的一个量，再点这个框.');};
    button.onkeydown=event=>{if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();clear(target);}if(event.key==='Escape'){selected=null;refreshSelection();tell('已取消选择.');}};
    button.ondragover=event=>{if(dragPayload(event)){event.preventDefault();button.classList.add('is-over');if(event.dataTransfer)event.dataTransfer.dropEffect=drag?.from?'move':'copy';}};
    button.ondragleave=()=>button.classList.remove('is-over');
    button.ondrop=event=>{event.preventDefault();const payload=dragPayload(event);button.classList.remove('is-over');suppressClickUntil=Date.now()+250;place(target,payload);};
    if(id)bindDraggable(button,{id,from:target});
   });
   host.querySelectorAll('[data-wp-rel-remove]').forEach(button=>button.onclick=()=>clear(button.dataset.wpRelRemove));
  }
  paint();
  return {answers:snapshot,destroy(){cleanupPointer?.();alive=false;drag=null;selected=null;}};
 }
 const api={mount,shuffle};if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioWordProblemRelationBuilder=api;
})(typeof window==='undefined'?globalThis:window);
