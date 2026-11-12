/* Structured editing only; serialization preserves unsimplified fractions for legacy grading. */
(function(root){'use strict';
function toLegacy(latex,kind='algebra'){
 let s=String(latex).replace(/\\(?:left|right|displaystyle|textstyle)/g,'').replace(/\\(?:,|;|!|quad|qquad| )/g,'').replace(/[−－]/g,'-').replace(/\\(?:cdot|times)/g,'*').replace(/\\div/g,'/').replace(/\\pi/g,'π').replace(/\\lbrace/g,'(').replace(/\\rbrace/g,')').replace(/\s+/g,'');
 if(/\\placeholder|#\?|\\[dt]?frac\s*\{\s*\}|\^\s*\{\s*\}/.test(s))throw Error('请补全分子、分母或指数。');
 // Recursive groups, no evaluation: 2/4 must remain 2/4, not become 1/2.
 let i=0;function group(){if(s[i]!=='{'){if(!s[i]||s[i]==='}'||s[i]==='\\')throw Error('请补全公式。');return s[i++]}i++;let out=read('}');if(s[i]!=='}')throw Error('请补全公式。');i++;return out}
 const atom=v=>/^-?\d+(?:\.\d+)?$/.test(v)||/^-?(?:\d+(?:\.\d+)?)?(?:[a-z](?:\^\d+)?)+$/.test(v)?v:'('+v+')';
 function read(stop){let out='';while(i<s.length&&s[i]!==stop){const m=s.slice(i).match(/^\\(?:dfrac|tfrac|frac)/);if(m){i+=m[0].length;let n=group(),d=group();if(!n||!d)throw Error('请补全分子和分母。');if(kind==='rational'&&/^-?\d+$/.test(out)&&/^\d+$/.test(n)&&/^\d+$/.test(d))out+='又'+n+'/'+d;else if(kind==='equation'){
  const whole=out.match(/(?:^|[+\-(])(\d+)$/)?.[1];
  if(whole&&/^\d+$/.test(n)&&/^\d+$/.test(d)&&Number(n)<Number(d))out=out.slice(0,-whole.length)+'('+whole+'+'+n+'/'+d+')';
  else out+='('+atom(n)+'/'+atom(d)+')';
 }else out+=atom(n)+'/'+atom(d);continue}const c=s[i++];if(c==='^'){const p=s[i]==='{'?group():s[i++];if(!p)throw Error('请填写指数。');out+='^'+(/^\d+$/.test(p)?p:'('+p+')')}else if(c==='{'){i--;out+=group()}else if(c==='\\')throw Error('这个符号暂不支持判分，请使用当前键盘。');else out+=c}return out}const out=read().replace(/\s+/g,'');if(/[{}]/.test(out))throw Error('请检查公式括号。');return out;
}
function toLatex(value){return String(value||'').replace(/(-?\d+)又(\d+)\/(\d+)/g,'$1\\frac{$2}{$3}').replace(/(?<![\\{\da-z])((?:\d+(?:\.\d+)?)?(?:[a-z](?:\^\d+)?)+|\d+)\/(\d+)/g,'\\frac{$1}{$2}').replace(/\^(\d+)/g,'^{$1}').replace(/\*/g,'\\cdot ')}
let ready;function load(){if(root.MathfieldElement)return Promise.resolve();return ready||(ready=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='assets/mathlive/0.111.4/mathlive.min.js';s.onload=()=>{root.MathfieldElement.fontsDirectory='assets/mathlive/0.111.4/fonts';root.MathfieldElement.soundsDirectory=null;root.MathfieldElement.computeEngine=null;resolve()};s.onerror=()=>{ready=null;reject(Error('公式输入未加载，请刷新后重试。'))};document.head.append(s)}))}
const contexts=new WeakMap();
function install(form,kind='algebra',compact=false,disclosure){
 if(contexts.has(form)){sync(contexts.get(form));return}
 const inputs=[...form.querySelectorAll('input:not([type=radio]):not([type=checkbox]):not([type=hidden])')];if(!inputs.length)return;
 const ctx={form,kind,inputs,fields:[],active:null};contexts.set(form,ctx);
 inputs.forEach(input=>{input.required=false;input.hidden=true;input.setAttribute('aria-hidden','true')});
 const loading=document.createElement('p');loading.className='input-help';loading.textContent='正在准备公式输入…';form.append(loading);
 // Block submission until the editor is ready and all visible expressions are complete.
 form.addEventListener('submit',ev=>{let message='';if(!ctx.fields.length)message='公式输入还在加载，请稍候。';else for(const f of ctx.fields){try{f.input.value=toLegacy(f.mf.value,kind);if(!f.input.value)throw Error('请填写每一空的答案。')}catch(err){message=err.message;form.dispatchEvent(new CustomEvent('math-entry-invalid',{detail:{input:f.input}}));f.mf.focus();break}}if(message){ev.preventDefault();ev.stopImmediatePropagation();loading.hidden=false;loading.textContent=message}},true);
 load().then(()=>{if(!form.isConnected)return;loading.hidden=true;
 for(const input of inputs){const mf=document.createElement('math-field');mf.id=input.id?input.id+'-math':'';mf.setAttribute('aria-label',input.getAttribute('aria-label')||input.labels?.[0]?.textContent||'你的答案');mf.mathVirtualKeyboardPolicy='manual';mf.smartFence=true;mf.defaultMode='math';mf.value=input.dataset.latex||toLatex(input.value);mf.readOnly=input.readOnly||input.disabled;input.after(mf);const f={input,mf};ctx.fields.push(f);ctx.active||=f;
 mf.addEventListener('focusin',()=>{ctx.active=f;sync(ctx)});mf.addEventListener('input',()=>{try{input.value=toLegacy(mf.value,kind);loading.hidden=true}catch(err){input.value='';loading.hidden=false;loading.textContent=err.message}input.dataset.latex=mf.value;input.dispatchEvent(new Event('input',{bubbles:true}))});mf.addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();if(!mf.readOnly){const next=form.closest('#specialPractice')?.querySelector('#spForward:not([hidden])');if(next)next.click();else form.requestSubmit()}}})}
 const section=document.createElement('section');section.className='formula-keypad';section.setAttribute('aria-label','数学输入键盘');ctx.section=section;
 const keys=['7','8','9','分数','乘方','⌫','4','5','6','+','−','清空','1','2','3','(',')','退出','0','.','←','→','↑','↓'];
 if(kind==='equation')keys[keys.indexOf('乘方')]='×';
 const names={'⌫':'删除','←':'光标左移','→':'光标右移','↑':'光标上移','↓':'光标下移','退出':'移到分数或指数后','分数':'插入分数','乘方':'插入指数'};
 const html=k=>`<button type="button" data-math-key="${k}" aria-label="${names[k]||k}" class="formula-key ${k.length>1?'word-key':''}">${k==='分数'?'<span class="fraction-icon"><i>□</i><i>□</i></span>':k==='乘方'?'<span>x<sup>□</sup></span>':k}</button>`;
 section.innerHTML='<div class="keypad-heading"><span>点按公式可移动光标</span><button type="button" class="text-button keypad-next">下一空 →</button></div><div class="formula-keys">'+keys.map(html).join('')+'</div>'+(kind!=='rational'?'<div class="formula-letters">'+(kind==='equation'?['x','y','÷']:['x','y','a','b','m','n']).map(html).join('')+'</div>':'');
 if(compact){
  const details=document.createElement('details');
  details.className='keypad-disclosure';
  const summary=document.createElement('summary');
  summary.textContent='打开公式键盘';
  if(disclosure){
   details.open=disclosure.open;
   const updateLabel=()=>{summary.textContent=details.open?'隐藏公式键盘':'显示公式键盘'};
   updateLabel();
   details.addEventListener('toggle',()=>{
    if(!details.isConnected)return;
    updateLabel();
    disclosure.onToggle(details.open);
   });
  }
  details.append(summary,section);
  form.append(details);
 }else{const row=form.querySelector('.button-row');if(row)row.before(section);else form.append(section)}
 const more=document.createElement('details');more.className='more-symbols';more.innerHTML='<summary>更多符号</summary><div class="formula-letters">'+['c','t','z','π','×','÷'].map(html).join('')+'</div>';if(kind!=='equation')section.append(more);
 section.addEventListener('pointerdown',ev=>{if(ev.target.closest('button'))ev.preventDefault()});section.addEventListener('click',ev=>{if(ev.target.closest('.keypad-next')){const a=ctx.fields.filter(f=>!f.mf.readOnly&&!f.mf.closest('[hidden]'));ctx.active=a[(a.indexOf(ctx.active)+1)%a.length];ctx.active?.mf.focus();return}const b=ev.target.closest('[data-math-key]');if(!b||!ctx.active||ctx.active.mf.readOnly)return;const mf=ctx.active.mf,k=b.dataset.mathKey;mf.focus({preventScroll:true});const cmds={'⌫':'deleteBackward','←':'moveToPreviousChar','→':'moveToNextChar','↑':'moveUp','↓':'moveDown','退出':'moveAfterParent'};
 if(cmds[k])mf.executeCommand(cmds[k]);else if(k==='清空'){mf.executeCommand('selectAll');mf.executeCommand('deleteBackward')}else if(k==='分数')mf.insert('\\frac{#0}{#?}',{selectionMode:'placeholder'});else if(k==='乘方')mf.executeCommand('moveToSuperscript');else mf.insert({'−':'-','π':'\\pi','×':'\\times','÷':'\\div'}[k]||k);mf.dispatchEvent(new Event('input',{bubbles:true}));sync(ctx)});sync(ctx);
 }).catch(err=>{loading.hidden=false;loading.textContent=err.message});
}
function sync(ctx){for(const {input,mf} of ctx.fields){const locked=input.readOnly||input.disabled;if(mf.readOnly!==locked)mf.readOnly=locked}const editable=ctx.fields.filter(f=>!f.mf.readOnly&&!f.mf.closest('[hidden]'));if(!editable.includes(ctx.active))ctx.active=editable[0];ctx.section?.querySelectorAll('[data-math-key]').forEach(b=>b.disabled=!ctx.active);const next=ctx.section?.querySelector('.keypad-next');if(next)next.hidden=editable.length<2}
root.MathIsleMathEntry={install,toLegacy,toLatex,load};
})(window);
