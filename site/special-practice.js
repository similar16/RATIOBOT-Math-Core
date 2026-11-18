(function(){
'use strict';
const cards=window.SpecialPracticeCards,E=window.SpecialPracticeEngine,B=window.RatioPracticeBridge;if(!cards||!E||!B)return;
const page=document.querySelector('#specialPractice'),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const math=s=>{try{return window.katex.renderToString(String(s),{throwOnError:false,output:'html'});}catch(e){return esc(s);}};
const frac=s=>String(s).replace(/^(-?)(\d+)\/(\d+)$/,'$1\\frac{$2}{$3}');
let run=null,owner='',token=0;
let equationPractice=null;
const equationAssets=new Map();
const equationBase=new URL('equation-practice/',document.currentScript?.src||document.baseURI);
const equationVersion='__EQUATION_PRACTICE_VERSION__';

function loadEquationAsset(name){
 const url=new URL(name,equationBase);
 url.searchParams.set('v',equationVersion);
 if(equationAssets.has(name))return equationAssets.get(name);
 const promise=new Promise((resolve,reject)=>{
  const style=name.endsWith('.css'),element=document.createElement(style?'link':'script');
  if(style){element.rel='stylesheet';element.href=url.href}else element.src=url.href;
  element.onload=resolve;
  element.onerror=()=>{element.remove();equationAssets.delete(name);reject(Error('解方程专项资源未加载。'));};
  document.head.append(element);
 });
 equationAssets.set(name,promise);
 return promise;
}
function addEquationCards(grid){
 const E=window.MathIsleEquationEngine;
 grid.insertAdjacentHTML('beforeend',E.topics.map(({code,name})=>
  '<button type="button" class="sp-category" data-equation-code="'+code+'">'+
  '<span class="sp-tag" style="--sp-color:#167582">'+code+'</span><b>'+esc(name)+'</b>'+
  '<small>'+E.setCount+'套 · 每套'+E.questionCount+'题</small></button>'
 ).join(''));
 grid.querySelectorAll('[data-equation-code]').forEach(button=>{
  button.onclick=()=>openEquations(button.dataset.equationCode);
 });
}
function loadEquationCards(grid){
 if(window.MathIsleEquationEngine){addEquationCards(grid);return;}
 const opening=token;
 const status=document.createElement('div');
 status.className='sp-hint';
 grid.after(status);
 const active=()=>opening===token&&grid.isConnected&&identity()===owner&&B.ready();
 async function load(){
  status.innerHTML='<p role="status">正在加载第4章题型…</p>';
  try{
   await loadEquationAsset('equation-engine.js');
   if(!active())return;
   addEquationCards(grid);
   status.remove();
  }catch{
   if(!active())return;
   status.innerHTML='<p role="status">第4章题型未加载。</p><button type="button" class="ghost">重新加载</button>';
   status.querySelector('button').onclick=load;
  }
 }
 void load();
}
function returnToMenu(code){
 menu();
 page.querySelector('[data-equation-code="'+code+'"]')?.focus();
}
function closeEquations(){
 equationPractice?.destroy();
 equationPractice=null;
}
async function openEquations(code, pending = null){
 if(!check() || (!pending && resumePending()))return;
 const account = owner;
 closeEquations();
 const opening=++token;
 page.innerHTML='<div class="sp-toolbar"><button type="button" class="ghost" id="spEquationBack">← 返回专项加练</button></div>'+
  '<div id="equations"><p role="status">正在加载解方程专项…</p></div>';
 const host=page.querySelector('#equations');
 const back=page.querySelector('#spEquationBack');
 back.onclick=()=>returnToMenu(code);
 try{
  const files = ['math-entry.js','handwriting.js','equations.js','equations.css'];
  if (!window.MathIsleEquationEngine) files.unshift('equation-engine.js');
  await Promise.all(files.map(loadEquationAsset));
  if(opening!==token||!check())return;
  equationPractice=window.MathIsleEquationPractice.mount(host,check,{
   code, onBack:returnToMenu, onComplete:B.completeEquation,
   correctionStore:{
    read:()=>readPending(account),
    write:item=>writePending(account,item),
    clear:runId=>clearPending(account,runId)
   }
  });
  back.parentElement.remove();
  host.querySelector('h1')?.focus({preventScroll:true});
 }catch{
  if(opening!==token||!check())return;
  host.innerHTML='<p role="status">解方程专项未加载，请重试。</p><button type="button" class="ghost">重新加载</button>';
  host.querySelector('button').onclick=()=>openEquations(code);
 }
}
const identity=()=>B.ready()?B.key():'';
const progress=()=>B.profile()?.economy?.modules?.specialPractice||{};
// Keep each unfinished set under its own account and attempt ID so a second tab
// cannot overwrite a different set. Only the signed-in student can resume it.
const pendingPrefix = account => 'ratiobot:special-corrections:v1:' + encodeURIComponent(account) + ':';
const unsavedCorrections = new Map();
function readPending(account) {
 if (!account || identity() !== account) return null;
 const prefix = pendingPrefix(account);
 const attempts = new Map();
 try {
  const storage = window.localStorage;
  for (let i = 0; i < storage.length; i++) {
   const key = storage.key(i);
   if (!key?.startsWith(prefix)) continue;
   try {
    const item = JSON.parse(storage.getItem(key));
    if (item && key === prefix + item.runId) attempts.set(key,item);
   } catch { /* A damaged draft must not prevent opening other work. */ }
  }
 } catch { /* Current-page drafts are available when device storage is unavailable. */ }
 for (const [key,item] of unsavedCorrections) {
  if (key.startsWith(prefix)) attempts.set(key,item);
 }
 for (const item of attempts.values()) {
  if (item?.kind === 'card' && cards.some(card => card.id === item.cardId)) return item;
  if (item?.kind === 'equation' && /^D[1-6]$/.test(item.code)) return item;
 }
 return null;
}
function writePending(account, item) {
 if (!account || identity() !== account || !item?.runId) throw Error('请先登录当前学生账号.');
 const key = pendingPrefix(account) + item.runId;
 try {
  window.localStorage.setItem(key,JSON.stringify(item));
  unsavedCorrections.delete(key);
  return true;
 } catch {
  unsavedCorrections.set(key,JSON.parse(JSON.stringify(item)));
  return false;
 }
}
function clearPending(account, runId) {
 if (!account || identity() !== account) throw Error('请先登录当前学生账号.');
 const key = pendingPrefix(account) + runId;
 try {
  window.localStorage.removeItem(key);
  unsavedCorrections.delete(key);
 } catch { unsavedCorrections.set(key,null); }
}
const correctionStore = {read:readPending, write:writePending, clear:clearPending};
window.RatioPracticeCorrections = correctionStore;

function resumePending() {
 const pending = readPending(owner);
 if (pending?.kind === 'card') return resumeCard(pending);
 if (pending?.kind === 'equation') {
  void openEquations(pending.code,pending);
  return true;
 }
 return false;
}

const categories=[...new Set(cards.map(c=>c.code))].sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
function check(){if(identity()!==owner||!B.ready()){reset();B.go('account');return false;}return true;}
function header(){return '<div class="page-heading"><div><div class="eyebrow">PART G · SPECIAL PRACTICE</div><h2>专项加练</h2><p>每类50套，每套5题。选定题型后，可在练习页切换套号。</p></div><button type="button" class="ghost" id="spHome">返回首页</button></div>';}
function common(){page.querySelector('#spHome').onclick=()=>B.go('home');}
function history(){const records=progress().records||[];return '<div class="sp-history"><h3>最近专项练习</h3>'+(records.slice(0,10).map(r=>'<div class="sp-record">'+esc(r.title)+' · '+esc(r.cardId)+' · 首答 '+r.correct+'/5'+(r.corrected?' · 已订正':'')+' · '+esc(new Date(r.at).toLocaleString('zh-CN'))+'</div>').join('')||'<p>完成第一组后，记录会保存在当前学生账号。</p>')+'</div>';}
function menu(){
 closeEquations();run=null;token++;
 if(!B.ready()){page.innerHTML=header()+'<div class="sp-empty">请先登录学生账号。</div>';common();return;}
 owner=identity();
 if (resumePending()) return;
 const best=progress().best||{};
 page.innerHTML=header()+'<div class="sp-grid">'+categories.map(code=>{const group=cards.filter(c=>c.code===code),c=group[0],done=group.filter(x=>best[x.id]===5).length;return '<button type="button" class="sp-category" data-code="'+code+'"><span class="sp-tag" style="--sp-color:#'+c.color+'">'+code+'</span><b>'+esc(c.title)+'</b><small>'+group.length+'套 · 每套5题 · 已全对 '+done+'/'+group.length+' 套</small></button>';}).join('')+'</div>'+history();
 common();
 page.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>choose(b.dataset.code));
 loadEquationCards(page.querySelector('.sp-grid'));
}
function choose(code){
 if(!check())return;const group=cards.filter(c=>c.code===code),best=progress().best||{},todo=group.filter(c=>best[c.id]!==5),pool=todo.length?todo:group;start(pool[Math.floor(Math.random()*pool.length)]);
}
function axis(c){if(!c.diagram)return '';return '<p class="sp-hint">仅依据大小顺序判断，不按图测量。</p><svg class="sp-axis" viewBox="0 0 520 85" role="img" aria-label="'+esc(c.diagram.labels.join(' 小于 '))+'"><path d="M15 30 H500 M490 24 L500 30 L490 36" stroke="currentColor" fill="none" stroke-width="2"/>'+c.diagram.labels.map((x,i)=>'<path d="M'+(c.diagram.positions?.[i]??(50+i*95))+' 30 v-8" stroke="currentColor"/><text x="'+(c.diagram.positions?.[i]??(50+i*95))+'" y="61" text-anchor="middle" font-size="23" font-family="serif">'+esc(x)+'</text>').join('')+'</svg>';}
function fullQuestion(c,i){return (c.conditions?.[i]?c.conditions[i]+'，':'')+(c.diagrams?.[i]?c.diagrams[i].labels.join('<')+'，':'')+c.questions[i];}
function fieldLabels(c, i) {
 if (c.code === 'B7') return c.answers[i].map((_, j) => '第'+(j+1)+'个解');
 return c.labels?.[i] || (c.code === 'B1' ? ['系数','次数'] : c.code === 'B2' ? ['项数','次数'] :
  c.answers[i].map((_, j) => c.answers[i].length > 1 ? '第'+(j+1)+'个答案' : '答案'));
}
function input(c,i){
 if(c.code==='C2')return ['大于0','小于0','不能判断'].map((t,j)=>'<label class="sp-choice"><input required type="radio" name="q'+i+'" value="'+String.fromCharCode(65+j)+'">'+String.fromCharCode(65+j)+'. '+t+'</label>').join('');
 const labels=fieldLabels(c,i);
 return labels.map((label,j)=>'<label>'+esc(label)+'<input required autocomplete="off" aria-label="第'+(i+1)+'题'+esc(label)+'" name="q'+i+'_'+j+'" maxlength="40" placeholder="'+(c.code==='B1'&&j===0?'如 -2/3 或 3π':['B4','B5','C3'].includes(c.code)?'如 2x+3':'如 -3/4')+'"></label>').join('');
}
function start(c){
 if(!check() || resumePending())return;
 renderCard(c);
}
function renderCard(c){
 closeEquations();token++;run={card:c,owner,started:performance.now(),submitted:false,runId:'sp-'+Date.now()+'-'+Math.random().toString(36).slice(2)};
 page.innerHTML=header()+'<div class="sp-toolbar"><button type="button" class="ghost" id="spBack">← 专项目录</button><span class="sp-tag" style="--sp-color:#'+c.color+'">'+c.code+'</span><h3>'+esc(c.title)+'</h3><label>套号 <select id="spSet">'+cards.filter(x=>x.code===c.code).map(x=>'<option value="'+x.id+'" '+(x.id===c.id?'selected':'')+'>'+String(x.set).padStart(2,'0')+'</option>').join('')+'</select></label></div><p class="sp-hint">'+(c.code==='B8'?'根据已知条件，直接写出所求代数式的值。':c.code==='C3'?'依据数轴和所给条件化简，合并同类项。输入示例：3a-b。':c.code==='B7'?'求出所有符合等式的 x 值，每格填一个解，顺序不限。':c.code==='B6'?'下列各式的值都与 x 的取值无关。直接填写各参数的值，分数可用 / 输入。':['B4','B5','C3'].includes(c.code)?'直接写出化简结果，同类项要合并。输入示例：2x+3。':c.code==='A9'?'先约分，再相乘，答案写成最简形式。分数输入示例：-3/4。':c.code==='B1'?'填写系数与次数，π可输入pi。':c.code==='B2'?'填写项数与次数。':'直接写出答案。分数可用 / 输入。')+'</p>'+(c.value?'<div class="sp-formula">已知 '+math('a='+frac(c.value))+'</div>':'')+axis(c)+'<form id="spForm">'+c.questions.map((q,i)=>'<article class="sp-question"><b>第'+(i+1)+'题</b>'+(c.conditions?.[i]?'<p>已知 '+math(c.conditions[i])+'</p>':'')+(c.diagrams?.[i]?axis({diagram:c.diagrams[i]}):'')+'<div class="sp-formula">'+math(q)+'</div><div class="sp-inputs">'+input(c,i)+'</div><div id="spFeedback'+i+'" class="sp-feedback" aria-live="polite"></div></article>').join('')+'<button id="spSubmit" class="primary" type="submit">提交5题</button><div id="spNotice" role="status"></div></form><div id="spResult"></div>';common();
 page.querySelector('#spBack').onclick=()=>{if(!run.submitted&&!window.confirm('返回目录？未提交的答案不会保存。'))return;menu();};
 page.querySelector('#spSet').onchange=e=>{if(!run.submitted&&!window.confirm('切换套号？未提交的答案不会保存。')){e.target.value=c.id;return;}start(cards.find(x=>x.id===e.target.value));};
 page.querySelector('#spForm').onsubmit=submit;
}
function readFields(form, card) {
 return card.answers.map((row, i) => row.map((_, j) =>
  card.code === 'C2' ? form.querySelector('[name="q'+i+'"]:checked')?.value || '' :
   form.elements['q'+i+'_'+j].value));
}

function captureMistakes(card, values, firstFlags) {
 firstFlags.forEach((ok, i) => {
  if (ok) return;
  const others = cards.filter(c => c.code === card.code && c.id !== card.id && c.questions?.[i] && c.answers?.[i]);
  const variant = others[(Math.max(1, Number(card.set) || 1) - 1) % others.length];
  void window.MistakeBook?.capture({
   sourceKey:'special:'+card.id+':'+i, source:'G区 专项加练', kind:'special-'+card.code,
   topic:card.code+' · '+card.title, question:fullQuestion(card,i),
   correctAnswer:card.answers[i].join('||'), studentAnswer:values[i].join('||'),
   variantQuestion:variant ? fullQuestion(variant,i) : '', variantAnswer:variant?.answers[i]?.join('||') || ''
  });
 });
}

function correctionProgress(card, pending) {
 const first = E.gradeFields(card, pending.values);
 const wrong = first.flatMap((row, i) => row.flatMap((ok, j) => ok ? [] : [{i,j}]));
 const remaining = wrong.filter(({i,j}) => pending.accepted[i][j] == null);
 return {first, wrong, remaining, correct:first.filter(row => row.every(Boolean)).length};
}

function drawFields(form, card, pending, first) {
 card.answers.forEach((row, i) => {
  const feedback = page.querySelector('#spFeedback'+i);
  const article = feedback.closest('.sp-question');
  const unresolved = pending.accepted[i].some(value => value == null);
  const missed = !first[i].every(Boolean);
  article.classList.toggle('sp-needs-repair', unresolved);
  feedback.classList.toggle('correct', !unresolved);
  if (!missed) feedback.textContent = '✓ 首答正确';
  else {
   const labels = fieldLabels(card,i);
   feedback.innerHTML = '<strong>'+(unresolved ? '✕ 首答有错' : '✓ 本题已订正')+'</strong> '+
    first[i].flatMap((ok, j) => ok ? [] : [
     '<span class="sp-field-status">'+esc(labels[j])+' · 首答 '+esc(pending.values[i][j])+
     ' · '+(pending.accepted[i][j] == null ? '待订正' : '已订正')+'</span>'
    ]).join(' ');
  }
  row.forEach((_, j) => {
   const answer = pending.accepted[i][j];
   const controls = card.code === 'C2' ? form.querySelectorAll('[name="q'+i+'"]') : [form.elements['q'+i+'_'+j]];
   for (const control of controls) {
    control.disabled = answer != null;
    if (control.type === 'radio') control.checked = control.value === answer;
    else control.value = answer ?? '';
    control.setAttribute('aria-invalid', String(answer == null));
    if (answer == null) {
     control.setAttribute('aria-describedby', feedback.id);
     if (control.type !== 'radio') control.placeholder = '重新作答';
    }
   }
  });
 });
}

function renderCorrection(retried = false) {
 const {card, pending} = run;
 const {first, wrong, remaining, correct} = correctionProgress(card, pending);
 const form = page.querySelector('#spForm'), summary = page.querySelector('#spResult');
 form.before(summary);
 // Verify each available entry even when another correction field is still empty.
 form.noValidate = true;
 page.querySelector('#spSet').disabled = true;
 page.querySelector('#spBack').disabled = true;
 page.querySelector('#spSubmit').textContent = remaining.length ? '检查订正' : '保存本组结果';
 page.querySelector('#spNotice').textContent = '';
 drawFields(form, card, pending, first);
 summary.className = 'sp-correction-summary';
 const time = window.RatioAutumnBreak?.time(pending.elapsed) ?? (pending.elapsed/1000).toFixed(2)+' 秒';
 const items = [...new Set(remaining.map(({i}) => i))].map(i => {
  const labels = remaining.filter(item => item.i === i).map(({j}) => fieldLabels(card,i)[j]);
  return '<button type="button" class="ghost" data-sp-jump="'+i+'">第'+(i+1)+'题 · '+labels.map(esc).join('、')+'</button>';
 }).join('');
 summary.innerHTML = '<section aria-labelledby="spCorrectionTitle"><h3 id="spCorrectionTitle" tabindex="-1">'+
  (remaining.length ? '✕ '+(retried?'订正尚未完成':'本组有错，必须订正') : '✓ 本组错项已全部订正')+
  '</h3><p>首答正确 '+correct+' / '+card.questions.length+' 题 · 用时 '+esc(time)+' · 已订正 '+(wrong.length-remaining.length)+' / '+wrong.length+' 项</p>'+
  (remaining.length ? '<p>请重新填写标出的 '+remaining.length+' 项，再点“检查订正”.</p><div class="sp-jumps">'+items+'</div>' : '')+
  '</section>';
 summary.querySelectorAll('[data-sp-jump]').forEach(b => {
  b.onclick = () => {
   const article = page.querySelector('#spFeedback'+b.dataset.spJump).closest('.sp-question');
   article.querySelector('input:not(:disabled)')?.focus();
  };
 });
 summary.querySelector('h3').focus();
}

function resumeCard(pending) {
 const account = identity();
 if (!account || pending?.kind !== 'card' || pending.owner !== account) return false;
 const card = cards.find(c => c.id === pending.cardId);
 if (!card || !pending.runId || !Number.isFinite(pending.elapsed) || pending.elapsed < 0) return false;
 const validRows = (rows, optional) => Array.isArray(rows) && rows.length === card.answers.length &&
  card.answers.every((row, i) => Array.isArray(rows[i]) && rows[i].length === row.length &&
   rows[i].every(v => optional && v === null || typeof v === 'string' && v.length > 0 && v.length <= 40));
 if (!validRows(pending.values,false) || !validRows(pending.accepted,true)) return false;
 const first = E.gradeFields(card,pending.values);
 // Retain correct first answers and recheck every stored correction against the same rubric.
 const restored = first.map((row,i) => row.map((ok,j) => ok ? pending.values[i][j] : pending.accepted[i][j]));
 const preferred = first.map((row,i) => row.map((ok,j) => ok ? pending.values[i][j] : null));
 const flags = E.gradeFields(card,restored,preferred);
 const accepted = restored.map((row,i) => row.map((value,j) => flags[i][j] ? value : null));
 owner = account;
 renderCard(card);
 run.runId = pending.runId;
 run.pending = {...pending, accepted};
 renderCorrection();
 return true;
}

function persist(pending) {
 if (window.RatioPracticeCorrections.write(owner, pending) === false) {
  page.querySelector('#spNotice').textContent = '本次订正暂存于当前页面，请完成后再关闭.';
 }
}

async function finishCard(current, pending) {
 const {card} = current;
 const {correct, first, wrong} = correctionProgress(card, pending);
 const flags = first.map(row => row.every(Boolean));
 B.complete({
  runId:current.runId, cardId:card.id, title:card.title, code:card.code, correct,
  values:pending.values, flags, avgTime:pending.elapsed/5000, submittedAt:pending.submittedAt,
  ...(wrong.length ? {correctedValues:pending.accepted} : {})
 });
 if (wrong.length) window.RatioPracticeCorrections.clear(owner, current.runId);
 current.submitted = true;
 const form = page.querySelector('#spForm'), summary = page.querySelector('#spResult');
 drawFields(form, card, pending, first);
 form.querySelectorAll('input,button').forEach(control => control.disabled = true);
 page.querySelector('#spBack').disabled = false;
 page.querySelector('#spSet').disabled = false;
 form.after(summary);
 summary.className = '';
 const time = window.RatioAutumnBreak?.time(pending.elapsed) ?? (pending.elapsed/1000).toFixed(2)+' 秒';
 summary.innerHTML = '<div class="sp-result"><h3 tabindex="-1">'+(wrong.length ? '✓ 订正完成' : '✓ 本组全部正确')+
  '</h3><p>首答正确 '+correct+' / '+card.questions.length+' 题 · 用时 '+esc(time)+'</p>'+
  (wrong.length ? '<p>'+wrong.length+' 个错项已逐项通过.</p>' : '')+
  '<p id="spSync">本机已保存，正在同步…</p><button class="primary" id="spNext" type="button">随机再练一组</button> '+
  '<button class="ghost" id="spDone" type="button">返回目录</button></div>';
 summary.querySelector('h3').focus();
 page.querySelector('#spNext').onclick = () => {
  const group = cards.filter(c => c.code === card.code && c.id !== card.id);
  start(group[Math.floor(Math.random()*group.length)] || card);
 };
 page.querySelector('#spDone').onclick = menu;
 const completedToken = token;
 let synced = false;
 try { synced = await B.sync(); } catch { /* The local attempt remains saved. */ }
 if (completedToken === token && current.owner === identity()) {
  const status = page.querySelector('#spSync');
  if (status) status.textContent = synced ? '记录已同步到学生账号.' : '已保存在本机，联网后会重试.';
 }
}

async function submit(event) {
 event.preventDefault();
 if (!check() || !run || run.submitted || run.saving) return;
 const current = run, card = current.card, form = page.querySelector('#spForm');
 if (event.currentTarget !== form) return;
 current.saving = true;
 try {
  const entered = readFields(form,card);
  const retry = !!current.pending;
  if (!retry && entered.some(row => row.some(value => !value.trim()))) {
   page.querySelector('#spNotice').textContent = '请先完成全部5题.';
   return;
  }
  const previous = current.pending?.accepted;
  const values = entered.map((row,i) => row.map((v,j) => previous?.[i][j] ?? v));
  const flags = E.gradeFields(card, values, previous);
  const accepted = values.map((row,i) => row.map((v,j) => flags[i][j] ? v : null));
  const pending = retry ? {...current.pending, accepted} : {
   kind:'card', owner, runId:current.runId, cardId:card.id, elapsed:performance.now()-current.started, submittedAt:new Date().toISOString(), values, accepted
  };
  if (retry || accepted.some(row => row.includes(null))) {
   current.pending = pending;
   renderCorrection(retry);
   persist(pending);
   if (!retry) captureMistakes(card,pending.values,flags.map(row => row.every(Boolean)));
   if (accepted.some(row => row.includes(null))) return;
  }
  await finishCard(current,pending);
 } catch (err) {
  const notice = page.querySelector('#spNotice');
  if (current.owner === identity() && current === run && notice) notice.textContent = '保存失败，点击按钮重试. '+err.message;
 } finally {
  current.saving = false;
 }
}
function reset(){closeEquations();run=null;owner='';token++;page.innerHTML='';}
window.SpecialPracticeUI={open:menu,reset,resumeCard,start:card=>{owner=identity();start(card);}};
})();
