(function(){
'use strict';
const API='https://bqtidgxpinhtkmrspres.supabase.co',KEY='sb_publishable_rtdSVt1mkCBTrS78kUvzNQ_slSc76Ye',TEST46='d12f28d3-a8d3-4fc3-a2e0-0aeab43e9920';
const TYPES={warmup:'课前练习',intro:'知识点引入',knowledge:'知识点整理',example:'典型例题',practice:'巩固练习',exit:'随堂检测',blank:'自由页面'};
const QUESTION=new Set(['warmup','practice','exit']);
const app=document.getElementById('app'),sb=window.supabase?.createClient(API,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
let user=null,member=null,cls='',editor=false,lessons=[],lesson=null,at=0,dirty=false,saving=false,saveTimer=null,previewAnswer=false;
let present=false,live=false,open=false,revealHint=false,revealAnswer=false,showStats=false,answers=[],ink='off',pen='#d78f82',canvas=null,drawing=false,tick=null,remaining=0,poller=null;
let studentData=null,studentPick='',studentText='',studentPoller=null;
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=s=>esc(s).replace(/\n/g,'<br>');
const err=e=>e?.message||String(e);
const sid=()=>window.crypto?.randomUUID?.()||'s'+Date.now().toString(36)+Math.random().toString(36).slice(2);
const typeName=k=>TYPES[k]||TYPES.blank,slide=()=>lesson?.slides?.[at],opts=s=>String(s?.choices||'').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,6);
function status(t,bad=false){let e=$('#status');if(e){e.textContent=t;e.style.color=bad?'#ad4c42':'#516e60';}else console.log(t);}
function math(e){if(e&&window.renderMathInElement){try{window.renderMathInElement(e,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false},{left:'$',right:'$',display:false}],throwOnError:false});}catch(x){console.warn(x);}}}
function newSlide(type='blank'){return {id:sid(),type,title:typeName(type),prompt:'',choices:'',hint:'',steps:'',answer:'',notes:'',image:'',seconds:type==='warmup'?180:type==='exit'?120:0};}
function sample(){return [
{...newSlide('warmup'),title:'课前诊断 · 两问',prompt:'1. 用代数式表示：$x$ 的3倍与5的和。\n2. 当 $a=2$ 时，求 $4a-3$ 的值。',hint:'分清乘法与加法的先后关系。',answer:'$3x+5$；$5$'},
{...newSlide('intro'),title:'知识点引入',prompt:'某种笔每支 $a$ 元，买3支需要多少钱？如果再买一本2元笔记本呢？',hint:'用字母表示变化的数量。'},
{...newSlide('knowledge'),title:'观察与表达',prompt:'观察：$3a$、$3a+2$、$a^2-1$。\n它们表示了什么数量关系？与等式有何不同？',steps:'说清每个运算式对应的实际意义。'},
{...newSlide('example'),title:'例题 · 表示周长',prompt:'某长方形的长比宽的2倍多1，设宽为 $x$，用代数式表示周长。',hint:'先表示长，再列周长式。',steps:'长：$2x+1$；周长：$2(x+2x+1)$。',answer:'$6x+2$'},
{...newSlide('practice'),title:'巩固练习',prompt:'下列哪个式子表示“一个数 $a$ 的平方减去4”？',choices:'$a^2-4$\n$(a-4)^2$\n$4-a^2$\n$2a-4$',answer:'A',seconds:90},
{...newSlide('exit'),title:'随堂检测 · 2分钟',prompt:'正方形的边长为 $2x-1$，请用代数式表示它的周长。',answer:'$8x-4$',seconds:120}
];}
function card(s,project=false,hint=false,solution=false){
let out='<div class="'+(project?'screen-kicker':'eyebrow')+'">'+esc(typeName(s.type))+'</div><div class="'+(project?'screen-title':'section-title')+'">'+esc(s.title||'未命名')+'</div>';
if(s.prompt)out+='<div class="question">'+fmt(s.prompt)+'</div>';
if(s.image&&/^data:image\/(jpeg|png|webp);base64,/.test(s.image))out+='<img alt="课件插图" src="'+s.image+'">';
const options=opts(s);if(options.length)out+='<div class="choice-list">'+options.map((x,i)=>'<div class="choice"><b>'+String.fromCharCode(65+i)+'</b> '+fmt(x)+'</div>').join('')+'</div>';
if(hint&&s.hint)out+='<div class="hintbox"><b>思考提示</b><div>'+fmt(s.hint)+'</div></div>';
if(solution&&(s.steps||s.answer))out+='<div class="answerbox"><b>思路与答案</b><div>'+fmt(s.steps||'')+(s.steps&&s.answer?'<hr>':'')+fmt(s.answer||'')+'</div></div>';
return out;
}
async function boot(){
if(!sb){app.innerHTML='<main class="loading-card"><h2>云端组件暂不可用</h2><a href="./">返回首页</a></main>';return;}
try{
const {data,error}=await sb.auth.getUser();if(error||!data?.user){app.innerHTML='<main class="loading-card"><h2>请先登录 RATIOBOT</h2><p>课堂系统复用原来的账号和班级，无需额外注册。</p><a class="btn primary" href="./#account">返回首页登录</a></main>';return;}
user=data.user;
const q=await sb.from('class_members').select('class_id,role,student_code,classes(name)').eq('user_id',user.id);
if(q.error)throw q.error;
const ms=q.data||[],preferred=new URLSearchParams(location.search).get('class');
member=ms.find(x=>x.class_id===preferred)||ms[0];
if(!member)throw Error('当前账号尚未绑定班级。');
cls=member.class_id;editor=member.role==='teacher'||(user.id===TEST46&&member.student_code==='46');
if(!editor||new URLSearchParams(location.search).has('student')){studentShell();await fetchStudent();studentPoller=setInterval(()=>{if(!document.hidden)fetchStudent();},6000);}
else{teacherShell();await loadLessons();}
}catch(e){app.innerHTML='<main class="loading-card"><h2>课堂连接失败</h2><p>'+esc(err(e))+'</p><a href="./">返回首页</a></main>';}
}
function teacherShell(){
app.innerHTML='<header class="top"><div class="brand">▣ RATIOBOT · 课堂交互</div><span class="tag">'+esc(member.classes?.name||'我的班级')+'</span><span id="status" class="status"></span><a class="btn" href="./">返回基地</a><a class="btn" href="classroom.html?student=1" target="_blank">学生视角</a><button class="primary" data-action="present">开始投屏</button></header>'+
'<main class="studio"><aside class="panel sidebar"><div class="row space"><h3 style="margin:0">我的课件</h3><button class="primary slim" data-action="new">＋ 新建</button></div><div id="lessonList"></div><hr><button class="slim" data-action="sample">创建示例课</button><p class="small muted">自动云端保存；教师账号和 46 号测试账号均可备课。</p></aside><section class="panel"><div id="editor"></div></section></main>'+
'<div class="projector hidden" id="projector"><div class="projector-bar"><strong id="presentTitle">课堂投屏</strong><span class="stretch"></span><span id="liveStatus" class="small"></span><button class="slim" data-action="previous">←</button><button class="slim primary" data-action="next">下一页 →</button><button class="slim" data-action="hint">提示</button><button class="slim green" data-action="solution">解析</button><button class="slim" id="acceptBtn" data-action="accept">开放作答</button><button class="slim" data-action="stats">统计</button><button class="slim" data-action="timer">计时</button><span id="timerLabel" class="timer">00:00</span><span class="ink-toolbar"><button class="slim" id="penBtn" data-action="pen">画笔</button><button class="ink-swatch" style="background:#d78f82" data-action="color" data-color="#d78f82" aria-label="红笔"></button><button class="ink-swatch" style="background:#6c9e91" data-action="color" data-color="#6c9e91" aria-label="绿笔"></button><button class="ink-swatch" style="background:#3e3540" data-action="color" data-color="#3e3540" aria-label="黑笔"></button><button class="slim" data-action="clear">擦板</button></span><button class="slim warn" data-action="end">结束</button></div><div class="screen" id="screen"><div id="screenInner" style="position:relative;z-index:1;pointer-events:none"></div><canvas class="ink-layer" id="inkCanvas"></canvas></div></div>';
}
async function loadLessons(){
const q=await sb.from('classroom_lessons').select('*').eq('class_id',cls).order('updated_at',{ascending:false}).limit(100);
if(q.error){status('加载失败：'+err(q.error),true);return;}lessons=q.data||[];lesson=lessons.find(x=>x.id===lesson?.id)||lessons[0]||null;
at=Math.max(0,Math.min(at,(lesson?.slides?.length||1)-1));renderList();renderEditor();
}
function renderList(){
let e=$('#lessonList');if(!e)return;
e.innerHTML=lessons.length?lessons.map(x=>'<button class="lesson-item '+(lesson?.id===x.id?'active':'')+'" data-action="chooseLesson" data-id="'+esc(x.id)+'"><strong>'+esc(x.title)+'</strong><span>'+esc(x.unit||'未分类')+' · '+(x.slides?.length||0)+' 页</span></button>').join(''):'<p class="small muted">还没有保存的课件。</p>';
}
function renderEditor(){
const e=$('#editor');if(!e)return;
if(!lesson){e.innerHTML='<div class="empty"><h2>创建第一份课堂课件</h2><p>集课前练习、知识引入、例题、练习和检测于一体。</p><button class="primary" data-action="new">新建课件</button></div>';return;}
if(!Array.isArray(lesson.slides)||!lesson.slides.length)lesson.slides=[newSlide()];
at=Math.max(0,Math.min(at,lesson.slides.length-1));const s=slide();
e.innerHTML='<div class="row space"><div><div class="eyebrow">LESSON DESIGN</div><h2>课件编辑器</h2></div><div class="row"><button class="slim green" data-action="save">保存课件</button><button class="slim" data-action="cloneLesson">复制课件</button><button class="slim" data-action="export">导出</button><label style="margin:0"><span class="btn slim">导入</span><input type="file" accept=".json,application/json" id="importFile" hidden></label><button class="slim warn" data-action="deleteLesson">删除</button></div></div>'+
'<div class="editor-top"><div><label>课件名称</label><input data-field="lessonTitle" value="'+esc(lesson.title)+'"></div><div><label>章节 / 单元</label><input data-field="unit" value="'+esc(lesson.unit||'')+'" placeholder="如 3.2 代数式的概念"></div></div>'+
'<div class="row space" style="margin-top:16px"><strong>页面编排 · '+lesson.slides.length+' 页</strong><div class="row"><select id="newType" style="max-width:155px">'+Object.entries(TYPES).map(([k,v])=>'<option value="'+k+'">'+v+'</option>').join('')+'</select><button class="slim primary" data-action="add">＋ 加一页</button></div></div>'+
'<div class="slide-list">'+lesson.slides.map((v,i)=>'<button class="slide-tab '+(i===at?'active':'')+'" data-action="chooseSlide" data-i="'+i+'"><span>'+(i+1)+' · '+esc(typeName(v.type))+'</span>'+esc(v.title)+'</button>').join('')+'</div>'+
'<div class="row" style="margin:0 0 12px"><button class="slim" data-action="left">↑ 前移</button><button class="slim" data-action="right">↓ 后移</button><button class="slim" data-action="copy">复制此页</button><button class="slim warn" data-action="remove">删除此页</button></div>'+
'<div class="slide-editor"><div><div class="field-grid"><div><label>环节类型</label><select data-field="type">'+Object.entries(TYPES).map(([k,v])=>'<option value="'+k+'" '+(s.type===k?'selected':'')+'>'+v+'</option>').join('')+'</select></div><div><label>计时秒数（0=不限时）</label><input data-field="seconds" type="number" min="0" max="3600" value="'+Number(s.seconds||0)+'"></div></div>'+
'<label>标题</label><input data-field="title" value="'+esc(s.title)+'">'+
'<label>课堂问题 / 内容</label><textarea data-field="prompt" rows="5" placeholder="支持 $a^2$ 或 $$\\frac{1}{2}$$ 数学公式">'+esc(s.prompt)+'</textarea>'+
'<label>选项（每行一项；留空则文本作答）</label><textarea data-field="choices" rows="3">'+esc(s.choices)+'</textarea>'+
'<label>思考提示（点击后显示）</label><textarea data-field="hint" rows="2">'+esc(s.hint)+'</textarea>'+
'<label>解析步骤 / 知识点</label><textarea data-field="steps" rows="3">'+esc(s.steps)+'</textarea>'+
'<label>参考答案（学生端不可见）</label><textarea data-field="answer" rows="2">'+esc(s.answer)+'</textarea>'+
'<label>教师私有备注</label><textarea data-field="notes" rows="2">'+esc(s.notes)+'</textarea>'+
'<div class="upload"><label style="margin:0">插入图片（自动压缩）<input type="file" id="imageFile" accept="image/png,image/jpeg,image/webp"></label>'+(s.image?'<button class="slim warn" data-action="delImage">移除插图</button>':'')+'</div></div>'+
'<div><div class="row space"><h3>实时预览</h3><button class="slim" data-action="previewAnswer">显示/隐藏解析</button></div><div id="preview" class="preview-card"></div><div class="teacher-help"><b>推荐教学节奏</b>：课前诊断 5–8 分钟 → 引入 → 探究知识点 → 例题分层 → 变式练习 → 2–3 题随堂检测。大屏提供逐步揭示、板书、计时与匿名答题统计。<br>作答记录不自动计入学生 R 积分。</div></div></div>'+
'<p class="small muted" style="margin-top:12px">公式格式：<code>$3x+2$</code> 或 <code>$$\\frac{1}{2}$$</code>。所有课件保存在云端，不必另存 PPT。</p>';
renderPreview();
}
function renderPreview(){let e=$('#preview');if(e&&slide()){e.innerHTML=card(slide(),false,previewAnswer,previewAnswer);math(e);}}
function mark(){dirty=true;status('等待自动保存…');clearTimeout(saveTimer);saveTimer=setTimeout(save,1300);}
async function save(){
clearTimeout(saveTimer);if(!dirty||!lesson||saving)return;
saving=true;dirty=false;const obj={title:String(lesson.title||'新课件').slice(0,140),unit:String(lesson.unit||'').slice(0,120),slides:lesson.slides,updated_at:new Date().toISOString()},id=lesson.id;
try{const q=await sb.from('classroom_lessons').update(obj).eq('id',id);if(q.error)throw q.error;
Object.assign(lessons.find(x=>x.id===id)||{},obj);status('已保存到云端 ✓');}
catch(e){dirty=true;status('保存失败：'+err(e),true);}
finally{saving=false;if(dirty)saveTimer=setTimeout(save,3500);}
}
async function create(source){
if(dirty)await save();
const obj={class_id:cls,owner_id:user.id,title:String(source?.title||'新课 · 互动课堂').slice(0,140),unit:String(source?.unit||'').slice(0,120),slides:source?.slides||['warmup','intro','knowledge','example','practice','exit'].map(newSlide)};
const q=await sb.from('classroom_lessons').insert(obj).select().single();if(q.error){status('新建失败：'+err(q.error),true);return;}
lesson=q.data;at=0;dirty=false;await loadLessons();status('已创建，开始编辑即可。');
}
function swap(d){let j=at+d;if(j<0||j>=lesson.slides.length)return;[lesson.slides[at],lesson.slides[j]]=[lesson.slides[j],lesson.slides[at]];at=j;mark();renderEditor();}
function edit(el){
if(!lesson)return;let f=el.dataset.field;if(!f)return;
if(f==='lessonTitle')lesson.title=el.value;
else if(f==='unit')lesson.unit=el.value;
else if(f==='seconds')slide().seconds=Math.max(0,Math.min(3600,Number(el.value)||0));
else if(f==='type'){slide().type=el.value;renderEditor();}
else slide()[f]=el.value;
mark();if(!['lessonTitle','unit','notes'].includes(f))renderPreview();
}
function download(){
const doc={schema:'ratiobot-classroom-1',title:lesson.title,unit:lesson.unit,slides:lesson.slides};
const blob=new Blob([JSON.stringify(doc,null,2)],{type:'application/json'}),path=window.URL.createObjectURL(blob),link=document.createElement('a');link.href=path;link.download='课堂课件.json';link.click();setTimeout(()=>window.URL.revokeObjectURL(path),2000);
}
async function importJson(file){
if(!file||file.size>3000000){status('文件过大（限 3 MB）',true);return;}
try{let data=JSON.parse(await file.text());if(!Array.isArray(data.slides)||!data.slides.length||data.slides.length>80)throw Error('课件页数应为1–80');
let slides=data.slides.map(s=>{let r=newSlide(TYPES[s.type]?s.type:'blank');for(let k of ['title','prompt','choices','hint','steps','answer','notes','image'])if(typeof s[k]==='string')r[k]=s[k].slice(0,k==='image'?300000:10000);r.seconds=Math.max(0,Math.min(3600,Number(s.seconds)||0));if(r.image&&!/^data:image\/(jpeg|png|webp);base64,/.test(r.image))r.image='';return r;});
await create({title:String(data.title||'导入课件')+'（导入）',unit:data.unit||'',slides});}
catch(e){status('导入失败：'+err(e),true);}
}
async function imageFile(file){
if(!file)return;
if(!['image/png','image/jpeg','image/webp'].includes(file.type)){status('仅支持 PNG/JPEG/WebP',true);return;}
try{
let bmp=await createImageBitmap(file),factor=Math.min(1,1200/Math.max(bmp.width,bmp.height));let cv=document.createElement('canvas');
cv.width=Math.round(bmp.width*factor);cv.height=Math.round(bmp.height*factor);let ctx=cv.getContext('2d');ctx.fillStyle='#fffdf8';ctx.fillRect(0,0,cv.width,cv.height);ctx.drawImage(bmp,0,0,cv.width,cv.height);bmp.close?.();
let out=cv.toDataURL('image/jpeg',.68);if(out.length>220000)out=cv.toDataURL('image/jpeg',.42);if(out.length>270000)throw Error('图片仍过大，请先裁剪后导入');
slide().image=out;mark();renderEditor();status('图片已压缩并加入本页。');
}catch(e){status('图片处理失败：'+err(e),true);}
}
function stopClock(){if(tick){clearInterval(tick);tick=null;}}
function showClock(){let e=$('#timerLabel');if(e){e.textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');e.classList.toggle('low',remaining>0&&remaining<15);}}
function resetClock(){stopClock();remaining=Number(slide()?.seconds||0);showClock();}
function timer(){if(tick){stopClock();return;}if(!remaining)remaining=Number(slide()?.seconds||120);showClock();tick=setInterval(()=>{remaining=Math.max(0,remaining-1);showClock();if(!remaining)stopClock();},1000);}
async function publish(end=false){
if(!live||!lesson)return;
const s=slide(),choices=opts(s);
const obj={class_id:cls,presenter_id:user.id,lesson_id:end?null:lesson.id,title:end?'':lesson.title,slide_id:end?'':s.id,slide_title:end?'':s.title,prompt:end?'':s.prompt,choices:end?[]:choices,question_type:choices.length?'choice':'text',is_open:!end&&open&&QUESTION.has(s.type),updated_at:new Date().toISOString()};
const q=await sb.from('classroom_live').upsert(obj,{onConflict:'class_id'});
if(q.error)status('投屏发布失败：'+err(q.error),true);
}
function correct(a,s){
let target=String(s.answer||'').replace(/\s/g,'').toLowerCase(),value=String(a.answer||'').replace(/\s/g,'').toLowerCase();if(!target)return null;
let i=opts(s).findIndex(x=>x.replace(/\s/g,'').toLowerCase()===target);
return value===target||(i>=0&&value===String.fromCharCode(97+i));
}
function statsHtml(s){
let output='<div class="present-response"><b>匿名作答 · '+answers.length+' 人</b>',options=opts(s);
if(options.length)output+='<div class="bars">'+options.map((_,i)=>{let n=answers.filter(a=>a.answer===String.fromCharCode(i+65)).length;return '<div class="bar-row"><b>'+String.fromCharCode(65+i)+'</b><div class="bar-track"><div class="bar-fill" style="width:'+(answers.length?Math.round(100*n/answers.length):0)+'%"></div></div><strong>'+n+' 人</strong></div>';}).join('')+'</div>';
else if(answers.length)output+='<div class="anon-answers">'+answers.slice(0,45).map(a=>'<span>'+esc(a.answer).slice(0,500)+'</span>').join('')+'</div>';
if(s.answer)output+='<p>严格匹配参考答案：<b>'+answers.filter(a=>correct(a,s)).length+' / '+answers.length+'</b></p><p class="small">文本题仅按字符严格比较，开放题需教师人工判断。</p>';
return output+'</div>';
}
function renderScreen(){
if(!present||!slide())return;
const s=slide(),e=$('#screenInner');e.innerHTML=card(s,true,revealHint,revealAnswer)+(showStats?statsHtml(s):'')+'<div class="screen-foot"><span>'+(at+1)+' / '+lesson.slides.length+' · '+esc(lesson.unit||'')+'</span><span>← → 翻页 · H 提示 · A 解析 · P 画笔</span></div>';math(e);
$('#presentTitle').textContent=lesson.title;
$('#acceptBtn').disabled=!QUESTION.has(s.type);$('#acceptBtn').textContent=open?'关闭作答':'开放作答';
$('#liveStatus').textContent=(open?'● 正在收集答案':'○ 当前页已投屏')+' · '+answers.length+' 人';
$('#penBtn').textContent=ink==='pen'?'画笔已开':'画笔';canvas?.classList.toggle('active',ink==='pen');
}
async function poll(){
if(!present||!lesson)return;
const s=slide(),q=await sb.from('classroom_responses').select('user_id,answer,updated_at').eq('class_id',cls).eq('lesson_id',lesson.id).eq('slide_id',s.id).limit(100);
if(q.error)return;
let data=q.data||[],changed=JSON.stringify(data)!==JSON.stringify(answers);answers=data;
if(changed&&showStats)renderScreen();else if($('#liveStatus'))$('#liveStatus').textContent=(open?'● 正在收集答案':'○ 已投屏')+' · '+answers.length+' 人';
}
async function begin(){
if(!lesson)return;await save();present=true;live=true;open=false;revealHint=revealAnswer=showStats=false;answers=[];ink='off';
$('#projector').classList.remove('hidden');installInk();resetClock();await publish();renderScreen();
if(poller)clearInterval(poller);poller=setInterval(()=>{if(!document.hidden)poll();},3000);
try{await $('#projector').requestFullscreen?.();}catch(e){}
}
async function end(){
stopClock();if(poller)clearInterval(poller);poller=null;open=false;await publish(true);live=false;present=false;
try{if(document.fullscreenElement)await document.exitFullscreen();}catch(e){}
$('#projector').classList.add('hidden');status('授课已结束。');
}
async function move(d){
let j=at+d;if(!lesson||j<0||j>=lesson.slides.length)return;
at=j;open=false;answers=[];revealHint=revealAnswer=showStats=false;resetClock();clearInk();await publish();renderScreen();
}
function installInk(){
canvas=$('#inkCanvas');let screen=$('#screen'),r=screen.getBoundingClientRect(),d=window.devicePixelRatio||1;
canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);
let cx=canvas.getContext('2d');cx.scale(d,d);cx.lineCap='round';cx.lineJoin='round';
canvas.onpointerdown=e=>{if(ink!=='pen')return;drawing=true;canvas.setPointerCapture(e.pointerId);const b=canvas.getBoundingClientRect();cx.beginPath();cx.moveTo(e.clientX-b.left,e.clientY-b.top);cx.strokeStyle=pen;cx.lineWidth=3;};
canvas.onpointermove=e=>{if(!drawing)return;const b=canvas.getBoundingClientRect();cx.lineTo(e.clientX-b.left,e.clientY-b.top);cx.stroke();};
canvas.onpointerup=canvas.onpointercancel=()=>{drawing=false;};
}
function clearInk(){if(canvas)canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);}
function studentShell(){
app.innerHTML='<header class="top"><div class="brand">▣ RATIOBOT · 课堂作答</div><span class="tag">'+esc(member.classes?.name||'当前班级')+'</span><a class="btn" href="./">返回数学基地</a></header>'+
'<main class="student-shell"><div class="student-heading"><div class="eyebrow">LIVE CLASSROOM</div><h1>随堂互动</h1><p class="muted">跟随教师进度。允许在作答开放期间修改答案。</p></div><section class="panel student-card" id="studentCard"><div class="empty">正在连接课堂…</div></section><p class="small muted">每 6 秒同步课堂状态。</p></main>';
}
async function fetchStudent(){
const q=await sb.from('classroom_live').select('lesson_id,title,slide_id,slide_title,prompt,choices,question_type,is_open,updated_at').eq('class_id',cls).maybeSingle();
if(q.error){$('#studentCard').innerHTML='<div class="empty">加载失败：'+esc(err(q.error))+'</div>';return;}
let data=q.data;
if(!data?.lesson_id||!data.slide_id){studentData=null;$('#studentCard').innerHTML='<div class="empty"><h2>暂时没有正在进行的课堂</h2><p>请等老师投屏后再作答。</p></div>';return;}
let changed=!studentData||JSON.stringify(data)!==JSON.stringify(studentData);
if(!studentData||studentData.slide_id!==data.slide_id){studentPick='';studentText='';}
studentData=data;if(changed)renderStudent();
}
function renderStudent(){
if(!studentData)return;const d=studentData,choices=Array.isArray(d.choices)?d.choices:[],box=$('#studentCard');
let out='<div class="eyebrow">'+esc(d.title||'课堂')+'</div><h2>'+esc(d.slide_title||'当前页面')+'</h2>';
if(d.is_open){
out+='<div class="question">'+fmt(d.prompt)+'</div>';
if(choices.length)out+='<div class="choice-list">'+choices.map((o,i)=>{let k=String.fromCharCode(65+i);return '<button class="choice '+(studentPick===k?'selected':'')+'" data-action="pick" data-value="'+k+'"><b>'+k+'</b> '+fmt(o)+'</button>';}).join('')+'</div>';
else out+='<label>我的答案</label><textarea id="studentAnswer" maxlength="1500" placeholder="输入答案">'+esc(studentText)+'</textarea>';
out+='<div class="foot-actions"><span class="status" id="studentNote">'+(studentText?'已提交，可修改':'请完成作答')+'</span><button class="primary" data-action="submit">提交答案</button></div>';
}else out+='<div class="hintbox"><b>正在讲解 / 等待开放作答</b><p style="margin:5px 0 0">老师开放题目后，这里会出现作答区。</p></div>';
box.innerHTML=out;math(box);
}
async function submit(){
const d=studentData;if(!d?.is_open)return;
const answer=d.question_type==='choice'?studentPick:String($('#studentAnswer')?.value||'').trim();
if(!answer){$('#studentNote').textContent='请选择或填写答案。';return;}
const q=await sb.from('classroom_responses').upsert({class_id:cls,lesson_id:d.lesson_id,slide_id:d.slide_id,user_id:user.id,answer,updated_at:new Date().toISOString()},{onConflict:'class_id,lesson_id,slide_id,user_id'});
$('#studentNote').textContent=q.error?'提交失败：'+err(q.error):'✓ 已提交，可在开放期间修改';if(!q.error)studentText=answer;
}
document.addEventListener('input',e=>{if(e.target.dataset.field)edit(e.target);if(e.target.id==='studentAnswer')studentText=e.target.value;});
document.addEventListener('change',e=>{if(e.target.dataset.field)edit(e.target);if(e.target.id==='imageFile')imageFile(e.target.files?.[0]);if(e.target.id==='importFile')importJson(e.target.files?.[0]);});
document.addEventListener('click',async e=>{
let b=e.target.closest('[data-action]');if(!b)return;
try{
switch(b.dataset.action){
case 'new':await create();break;
case 'sample':await create({title:'3.2 代数式的概念 · 示例课',unit:'第3章 · 代数式',slides:sample()});break;
case 'chooseLesson':if(dirty)await save();lesson=lessons.find(l=>l.id===b.dataset.id);at=0;renderList();renderEditor();break;
case 'chooseSlide':at=Number(b.dataset.i)||0;renderEditor();break;
case 'add':lesson.slides.push(newSlide($('#newType').value));at=lesson.slides.length-1;mark();renderEditor();break;
case 'left':swap(-1);break;
case 'right':swap(1);break;
case 'copy':{let x=JSON.parse(JSON.stringify(slide()));x.id=sid();lesson.slides.splice(at+1,0,x);at++;mark();renderEditor();break;}
case 'remove':if(lesson.slides.length>1){lesson.slides.splice(at,1);at=Math.max(0,at-1);mark();renderEditor();}break;
case 'delImage':slide().image='';mark();renderEditor();break;
case 'save':dirty=true;await save();break;
case 'cloneLesson':await create({title:lesson.title+'（副本）',unit:lesson.unit,slides:lesson.slides.map(s=>({...s,id:sid()}))});break;
case 'deleteLesson':if(confirm('删除此课件及它关联的课堂作答记录？')){let q=await sb.from('classroom_lessons').delete().eq('id',lesson.id);if(q.error)throw q.error;lesson=null;dirty=false;await loadLessons();}break;
case 'export':download();break;
case 'previewAnswer':previewAnswer=!previewAnswer;renderPreview();break;
case 'present':await begin();break;
case 'end':await end();break;
case 'previous':await move(-1);break;
case 'next':await move(1);break;
case 'hint':revealHint=!revealHint;renderScreen();break;
case 'solution':revealAnswer=!revealAnswer;renderScreen();break;
case 'accept':if(QUESTION.has(slide()?.type)){open=!open;await publish();renderScreen();poll();}break;
case 'stats':showStats=!showStats;await poll();renderScreen();break;
case 'timer':timer();break;
case 'pen':ink=ink==='pen'?'off':'pen';renderScreen();break;
case 'clear':clearInk();break;
case 'color':pen=b.dataset.color;ink='pen';renderScreen();break;
case 'pick':studentPick=b.dataset.value;renderStudent();break;
case 'submit':await submit();break;
}
}catch(x){status('操作失败：'+err(x),true);}
});
document.addEventListener('keydown',e=>{
if(!present||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||''))return;
if(['ArrowRight','ArrowLeft',' '].includes(e.key))e.preventDefault();
if(e.key==='ArrowRight'||e.key===' ')move(1);
else if(e.key==='ArrowLeft')move(-1);
else if(e.key.toLowerCase()==='h'){revealHint=!revealHint;renderScreen();}
else if(e.key.toLowerCase()==='a'){revealAnswer=!revealAnswer;renderScreen();}
else if(e.key.toLowerCase()==='p'){ink=ink==='pen'?'off':'pen';renderScreen();}
});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
window.addEventListener('pagehide',()=>{if(poller)clearInterval(poller);if(studentPoller)clearInterval(studentPoller);stopClock();});
boot();
})();