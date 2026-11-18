/* Keep mathematical entry literal across physical keyboards, IMEs and paste. */
(function(root){
 'use strict';
 const commands=new Set(['frac','dfrac','tfrac','left','right','times','cdot','div','placeholder','square','le','leq','ge','geq','ne','neq','approx']);
 const numericCommands=new Set(['frac','dfrac','tfrac','left','right','times','cdot','div']);
 const attributes={autocomplete:'off',autocorrect:'off',autocapitalize:'off',spellcheck:'false','data-lpignore':'true','data-1p-ignore':'','data-form-type':'other'};
 function letter(c,variables=[]){return variables.find(v=>v.toLowerCase()===c.toLowerCase())||c;}
 function clean(value,{numberOnly=false,variables=[]}={}){
  // Group a fraction glyph before NFKC, otherwise x/½ would become x/1/2.
  let s=String(value??'').replace(/[¼½¾⅐-⅞]/g,c=>'('+c.normalize('NFKC')+')').normalize('NFKC').replace(/[−–－]/g,'-').replace(/[⁄／]/g,'/');
  s=s.replace(/\\(?:text|mathrm|operatorname)\{[^{}]*\}/g,'');
  s=s.replace(/\\([a-zA-Z]+)/g,(all,name)=>commands.has(name)?all:'');
  s=s.replace(/[^0-9a-zA-Z\s.+\-*/^()%=[\]{}\\×÷·⋅≤≥≠≈<>]/gu,'');
  // A number may be pasted as a rendered fraction. Keep its syntax intact;
  // stripping the command and braces would silently turn 1/2 into 12.
  if(numberOnly)return s.replace(/\\[a-zA-Z]+|[a-zA-Z]/g,token=>token[0]==='\\'&&numericCommands.has(token.slice(1))?token:'');
  return s.replace(/\\[a-zA-Z]+|[a-zA-Z]/g,token=>token[0]==='\\'?token:letter(token,variables));
 }
 function preview(value){
  let s=clean(value).replace(/\\%/g,'%').replace(/\\(?:left|right)/g,'').replace(/\\placeholder(?:\[[^\]]*\])?\{[^{}]*\}/g,'\\square ')
   .replace(/\{\s*\}/g,'{\\square}').replace(/\*/g,'\\times ').replace(/÷/g,'\\div ').replace(/%/g,'\\%');
  if(/(?:[+\-=/]|\\(?:times|div|cdot))\s*$/.test(s))s+='\\square';
  if(/\^$/.test(s))s+='{\\square}';
  let depth=0;for(const c of s){if(c==='{')depth++;if(c==='}')depth--;if(depth<0)return '';}
  return s+'}'.repeat(depth);
 }
 function bind(field,{numberOnly=false,inputMode=numberOnly?'decimal':'url',variables=()=>[],onChange=()=>{},onFocus=()=>{}}={}){
  for(const [name,value]of Object.entries(attributes))if(field.getAttribute(name)!==value)field.setAttribute(name,value);
  const listeners=[];const listen=(type,handler,capture=false)=>{field.addEventListener(type,handler,capture);listeners.push([type,handler,capture]);};
  const math=field.tagName==='MATH-FIELD';field.setAttribute('inputmode',inputMode);
  const options=()=>({numberOnly,variables:variables()});
  let composing=false;
  const commit=()=>{
   const original=field.value||'',value=clean(original,options());
   if(value!==original){const position=field.selectionStart,caret=field.position;field.value=value;if(!math&&position!=null){const next=clean(original.slice(0,position),options()).length;field.setSelectionRange?.(next,next);}else if(math&&Number.isFinite(caret))field.position=Math.min(caret,field.lastOffset??caret);}
   onChange(value);
  };
  listen('beforeinput',event=>{
   if(event.inputType==='insertReplacementText'){event.preventDefault();event.stopImmediatePropagation();return;}
   if(!event.data||event.isComposing)return;
   // Reject predictive replacements before they can replace an already correct letter.
   if(/[^\x20-\x7e０-９Ａ-Ｚａ-ｚ−×÷·⋅≤≥≠≈¼½¾⅐-⅞⁄]/u.test(event.data)){
    const normalized=clean(event.data,options());if(normalized!==event.data.normalize('NFKC')){event.preventDefault();event.stopImmediatePropagation();}
   }
  },true);
  listen('compositionstart',()=>{composing=true;});
  listen('compositionend',()=>{composing=false;queueMicrotask(commit);});
  listen('input',()=>{if(!composing)commit();});
  listen('focusin',onFocus);
  if(math){
   field.defaultMode='math';field.smartMode=false;field.inlineShortcuts={};field.onInlineShortcut=()=>'';
   field.popoverPolicy='off';field.environmentPopoverPolicy='off';field.menuItems=[];
   listen('keydown',event=>{
    if(event.key==='\\'&&!event.ctrlKey&&!event.metaKey){event.preventDefault();event.stopImmediatePropagation();return;}
    if(event.isComposing||event.ctrlKey||event.metaKey||event.altKey||!/^\w$/.test(event.key)||!/[a-zA-Z]/.test(event.key))return;
    event.preventDefault();event.stopImmediatePropagation();
    field.insert(letter(event.key,variables()),{mode:'math',format:'latex',focus:false,scrollIntoView:false});commit();
   },true);
   listen('paste',event=>{
    const raw=event.clipboardData?.getData('text/plain');if(raw==null)return;
    event.preventDefault();event.stopImmediatePropagation();const value=clean(raw,options());
    if(value)field.insert(value,{mode:'math',format:'auto',focus:false,scrollIntoView:false});commit();
   },true);
  }
  return {commit,destroy(){for(const [type,handler,capture]of listeners)field.removeEventListener(type,handler,capture);listeners.length=0;}};
 }
 const api={clean,preview,bind};if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioWordProblemMathInput=api;
})(typeof window==='undefined'?globalThis:window);
