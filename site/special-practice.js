(function(){
'use strict';
const cards=window.SpecialPracticeCards,E=window.SpecialPracticeEngine,B=window.RatioPracticeBridge;if(!cards||!E||!B)return;
const page=document.querySelector('#specialPractice'),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const math=s=>{try{return window.katex.renderToString(String(s),{throwOnError:false,output:'html'});}catch(e){return esc(s);}};
const frac=s=>String(s).replace(/^(-?)(\d+)\/(\d+)$/,'$1\\frac{$2}{$3}');
let run=null,owner='',token=0,loading=false;
const identity=()=>B.ready()?B.key():'';
const progress=()=>B.profile()?.economy?.modules?.specialPractice||{};
const allCategories=[...new Set(cards.map(c=>c.code))];
const featured=['B4','B5'];
const categories=[...featured.filter(c=>allCategories.includes(c)),...allCategories.filter(c=>!featured.includes(c))];
function check(){if(identity()!==owner||!B.ready()){reset();B.go('account');return false;}return true;}
function header(){return '<div class="page-heading"><div><div class="eyebrow">SPECIAL PRACTICE</div><h2>专项加练</h2><p>共'+categories.length+'类专项，每次5题。合并同类项和去括号已开放，位于列表最前面。</p></div><button type="button" class="ghost" id="spHome">返回首页</button></div>';}
function common(){page.querySelector('#spHome').onclick=()=>B.go('home');}
function history(){const records=progress().records||[];return '<div class="sp-history"><h3>最近专项练习</h3>'+(records.slice(0,10).map(r=>'<div class="sp-record">'+esc(r.title)+' · '+esc(r.cardId)+' · '+r.correct+'/5 · '+esc(new Date(r.at).toLocaleString('zh-CN'))+'</div>').join('')||'<p>完成第一组后，记录会保存在当前学生账号。</p>')+'</div>';}
function menu(){
 if(!B.ready()){page.innerHTML=header()+'<div class="sp-empty">请先登录学生账号。</div>';common();return;}
 owner=identity();run=null;token++;const best=progress().best||{};
 page.innerHTML=header()+'<div class="sp-grid">'+categories.map(code=>{const c=cards.find(c=>c.code===code),done=cards.filter(x=>x.code===code&&best[x.id]===5).length;return '<button type="button" class="sp-category" data-code="'+code+'"><span class="sp-tag" style="--sp-color:#'+c.color+'">'+code+'</span><b>'+esc(c.title)+(featured.includes(code)?' · 新增':'')+'</b><small>10套 · 每套5题 · 已全对 '+done+'/10 套</small></button>';}).join('')+'</div>'+history();common();page.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>choose(b.dataset.code));
}
function choose(code){
 if(!check())return;const group=cards.filter(c=>c.code===code),best=progress().best||{},todo=group.filter(c=>best[c.id]!==5),pool=todo.length?todo:group;start(pool[Math.floor(Math.random()*pool.length)]);
}
function axis(c){if(!c.diagram)return '';return '<p class="sp-hint">仅依据大小顺序判断，不按图测量。</p><svg class="sp-axis" viewBox="0 0 520 85" role="img" aria-label="'+esc(c.diagram.labels.join(' 小于 '))+'"><path d="M15 30 H500 M490 24 L500 30 L490 36" stroke="currentColor" fill="none" stroke-width="2"/>'+c.diagram.labels.map((x,i)=>'<path d="M'+(50+i*95)+' 30 v-8" stroke="currentColor"/><text x="'+(50+i*95)+'" y="61" text-anchor="middle" font-size="23" font-family="serif">'+esc(x)+'</text>').join('')+'</svg>';}
function input(c,i){
 if(c.code==='C2')return ['大于0','小于0','不能判断'].map((t,j)=>'<label class="sp-choice"><input required type="radio" name="q'+i+'" value="'+String.fromCharCode(65+j)+'">'+String.fromCharCode(65+j)+'. '+t+'</label>').join('');
 const labels=c.code==='B1'?['系数','次数']:c.code==='B2'?['项数','次数']:['答案'];
 return labels.map((label,j)=>'<label>'+label+'<input required autocomplete="off" aria-label="第'+(i+1)+'题'+label+'" name="q'+i+'_'+j+'" maxlength="40" placeholder="'+(c.code==='B1'&&j===0?'如 -2/3 或 3π':['B4','B5'].includes(c.code)?'如 2x+3':'如 -3/4')+'"></label>').join('');
}
function start(c){
 if(!check())return;token++;run={card:c,owner,started:Date.now(),submitted:false,runId:'sp-'+Date.now()+'-'+Math.random().toString(36).slice(2)};
 page.innerHTML=header()+'<div class="sp-toolbar"><button type="button" class="ghost" id="spBack">← 专项目录</button><span class="sp-tag" style="--sp-color:#'+c.color+'">'+c.code+'</span><h3>'+esc(c.title)+'</h3><label>套号 <select id="spSet">'+cards.filter(x=>x.code===c.code).map(x=>'<option value="'+x.id+'" '+(x.id===c.id?'selected':'')+'>'+String(x.set).padStart(2,'0')+'</option>').join('')+'</select></label></div><p class="sp-hint">'+(['B4','B5'].includes(c.code)?'直接写出化简结果，同类项要合并。输入示例：2x+3。':c.code==='A9'?'先约分，再相乘，答案写成最简形式。分数输入示例：-3/4。':c.code==='B1'?'填写系数与次数，π可输入pi。':c.code==='B2'?'填写项数与次数。':'直接写出答案。分数可用 / 输入。')+'</p>'+(c.value?'<div class="sp-formula">已知 '+math('a='+frac(c.value))+'</div>':'')+axis(c)+'<form id="spForm">'+c.questions.map((q,i)=>'<article class="sp-question"><b>第'+(i+1)+'题</b><div class="sp-formula">'+math(q)+'</div><div class="sp-inputs">'+input(c,i)+'</div><div id="spFeedback'+i+'" class="sp-feedback" aria-live="polite"></div></article>').join('')+'<button id="spSubmit" class="primary" type="submit">提交5题</button><div id="spNotice" role="status"></div></form><div id="spResult"></div>';common();
 page.querySelector('#spBack').onclick=()=>{if(!run.submitted&&!window.confirm('返回目录？未提交的答案不会保存。'))return;menu();};
 page.querySelector('#spSet').onchange=e=>{if(!run.submitted&&!window.confirm('切换套号？未提交的答案不会保存。')){e.target.value=c.id;return;}start(cards.find(x=>x.id===e.target.value));};
 page.querySelector('#spForm').onsubmit=submit;
}
async function submit(e){
 e.preventDefault();if(!check()||!run||run.submitted||loading)return;const current=run,c=current.card,form=page.querySelector('#spForm');
 const values=c.questions.map((q,i)=>c.answers[i].map((a,j)=>c.code==='C2'?form.querySelector('[name="q'+i+'"]:checked')?.value||'':form.elements['q'+i+'_'+j].value));
 if(values.some(row=>row.some(v=>!v.trim()))){page.querySelector('#spNotice').textContent='请先完成全部5题。';return;}
 const flags=E.grade(c,values),correct=flags.filter(Boolean).length;
 loading=true;
 try{
  B.complete({runId:current.runId,cardId:c.id,title:c.title,code:c.code,correct,values,flags,avgTime:(Date.now()-current.started)/5000});
  current.submitted=true;form.querySelectorAll('input,button').forEach(n=>n.disabled=true);
  flags.forEach((ok,i)=>{const f=page.querySelector('#spFeedback'+i);f.classList.toggle('correct',ok);f.innerHTML=ok?'✓ 正确':'再看一看。正确答案：'+c.answers[i].map(a=>'<span class="sp-answer">'+(c.code==='C2'?esc(a):math(frac(a.replace(/−/g,'-').replace(/π/g,'\\pi'))))+'</span>').join('，')+(c.code==='A9'?'（需要约成最简形式）':'');});
  page.querySelector('#spResult').innerHTML='<div class="sp-result"><h3>答对 '+correct+' / 5 题</h3><p>'+(correct===5?'本组全部正确，可以结束今天的专项练习。':'先核对错题，弄清原因后再练一组。')+'</p><p id="spSync">本机已保存，正在同步…</p><button class="primary" id="spNext" type="button">换一套</button> <button class="ghost" id="spDone" type="button">返回目录</button></div>';
  page.querySelector('#spNext').onclick=()=>{const pool=cards.filter(x=>x.code===c.code&&x.id!==c.id);start(pool[Math.floor(Math.random()*pool.length)]);};page.querySelector('#spDone').onclick=menu;
  const t=token,ok=await B.sync();if(t===token&&identity()===owner&&page.querySelector('#spSync'))page.querySelector('#spSync').textContent=ok?'记录已同步到学生账号。':'本机已保存，暂未同步；联网后系统会重试。';
 }catch(err){if(identity()===owner&&page.querySelector('#spNotice'))page.querySelector('#spNotice').textContent='保存失败：'+err.message+'，请重试。';}finally{loading=false;}
}
function reset(){run=null;owner='';token++;loading=false;page.innerHTML='';}
window.SpecialPracticeUI={open:menu,reset,start:card=>{owner=identity();start(card);}};
})();
