(function(){
'use strict';
const API='https://bqtidgxpinhtkmrspres.supabase.co';
const KEY='sb_publishable_rtdSVt1mkCBTrS78kUvzNQ_slSc76Ye';
const TEST46='d12f28d3-a8d3-4fc3-a2e0-0aeab43e9920';
const STAGES=[
 {id:'warmup',label:'课前练习'},
 {id:'intro',label:'知识点引入'},
 {id:'knowledge',label:'课堂环节'},
 {id:'example',label:'例题'},
 {id:'practice',label:'课堂练习'},
 {id:'exit',label:'随堂检测'}
];
const BRANCHES=[
 {id:'activity',label:'活动'},
 {id:'question',label:'问题'},
 {id:'attempt',label:'尝试'},
 {id:'explore',label:'探究'},
 {id:'discussion',label:'讨论'},
 {id:'other',label:'其他'}
];
const EXIT_BRANCHES=[{id:'recall',label:'知识点回顾'},{id:'quick',label:'快速练习'}];
function branchSet(name){return name==='knowledge'?BRANCHES:name==='exit'?EXIT_BRANCHES:[];}

const app=document.querySelector('#classroomApp');
const sb=window.supabase?.createClient(API,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const unique=()=>window.crypto?.randomUUID?.()||('p'+Date.now()+Math.random().toString(16).slice(2));
const validDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'');
let user=null,member=null,role='',classId='',date=today();
let catalog=[],selectedLessonKey='',importingCatalog=false;
let stage='warmup',branch='activity',pageIndex=0,draft=null,published=null,dirty=false,saving=null,timer=null,revision=0,busyImport=false,full=false,loading=false;
function blankSections(){const x={};for(const s of STAGES)x[s.id]=[];return x;}
function createPage(){return {id:unique(),title:'',body:'',images:[]};}
function safePage(p){return {id:typeof p?.id==='string'&&p.id.length<100?p.id:unique(),title:String(p?.title||'').slice(0,160),body:String(p?.body||'').slice(0,14000),images:Array.isArray(p?.images)?p.images.filter(v=>typeof v==='string'&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v)&&v.length<950000).slice(0,8):[],...(branchSet('knowledge').concat(branchSet('exit')).some(b=>b.id===p?.branch)?{branch:p.branch}:{})};}
function normalizeSections(src){const x=blankSections();for(const s of STAGES){if(Array.isArray(src?.[s.id]))x[s.id]=src[s.id].slice(0,50).map(safePage);}return x;}
// The existing knowledge pages without a branch stay accessible under “其他”.
function branchOf(p,group='knowledge'){const kinds=branchSet(group);return kinds.some(b=>b.id===p?.branch)?p.branch:(group==='exit'?'quick':'other');}
function filteredPages(sections,selectedStage=stage,selectedBranch=branch){
 const all=sections?.[selectedStage]||[];
 return branchSet(selectedStage).length?all.filter(p=>branchOf(p,selectedStage)===selectedBranch):all;
}
function pageStore(){return draft?.sections?.[stage]||[];}
function pages(){return filteredPages(draft?.sections);}
function paper(){return pages()[pageIndex]||null;}
function stageName(){return STAGES.find(s=>s.id===stage)?.label||'课堂';}
function chooseBranch(sections,reverse=false,targetStage=stage){
 const branches=branchSet(targetStage);
 const order=reverse?[...branches].reverse():branches;
 return order.find(b=>filteredPages(sections,targetStage,b.id).length)?.id||branches[0]?.id||'activity';
}
function branchTabs(sections){
 const branches=branchSet(stage);
 if(!branches.length)return '';
 return '<nav class="substage-tabs" aria-label="'+(stage==='exit'?'随堂检测子模块':'课堂环节子分类')+'">'+branches.map(b=>{
  const count=filteredPages(sections,stage,b.id).length;
  return '<button type="button" class="substage-tab '+(branch===b.id?'active':'')+'" data-act="branch" data-id="'+b.id+'" aria-pressed="'+String(branch===b.id)+'" '+(role==='viewer'&&!count?'disabled':'')+'>'+b.label+(count?'<small>'+count+'</small>':'')+'</button>';
 }).join('')+'</nav>';
}
function note(text,bad){const el=$('#msg');if(el){el.textContent=text;el.style.color=bad?'#b45046':'#537866';}else console.log(text);}
function viewContent(p,el){if(!el)return;const cleaned=String(p?.body||'').replace(/\[(ANS|OPT|PROOF):([A-Za-z0-9_-]{1,32})\]/gi,'□');
if(window.QuestionContent){el.innerHTML=window.QuestionContent.content(cleaned,p?.images||[]);window.QuestionContent.math(el);}
else el.textContent=cleaned;}
function top(title,teacher){
return '<header class="topbar"><strong class="brand">▣ RATIOBOT · 课堂交互</strong><span class="crumb">'+esc(member?.classes?.name||'本班')+'</span><span class="status">'+(teacher?'教师发布端':'46号 · 课堂展示')+'</span><span class="spacer"></span><span id="msg"></span><a class="linkbtn" href="./">返回数学基地</a></header>';
}
function sidebar(){
const ss=role==='teacher'?draft?.sections:published?.sections;
return '<aside class="stage-aside"><div class="tiny-heading">CLASSROOM STEPS · 教学环节</div>'+
STAGES.map((s,i)=>{const list=ss?.[s.id]||[],count=list.length,active=stage===s.id;
return '<button type="button" class="stage-btn '+(active?'active':'')+'" data-act="stage" data-id="'+s.id+'" '+(role==='viewer'&&!count?'disabled':'')+'><b>'+(i+1)+'. '+s.label+'</b><small>'+count+' 页</small></button>';}).join('')+
'<div class="stage-footer">RATIOBOT · 数学课堂<br>左侧选教学环节，右侧切换题目。<br>Ctrl / Cmd 不需要，方向键即可翻页。</div></aside>';
}
async function boot(){
if(!sb){app.innerHTML='<div class="loading"><h2>云端暂不可用</h2><p>请返回首页刷新后重试。</p><a href="./">返回首页</a></div>';return;}
try{
 const u=await sb.auth.getUser();if(u.error||!u.data?.user){app.innerHTML='<div class="loading"><h2>请先登录数学基地</h2><p>46号沿用原账号；教师使用原教师账号。</p><a class="linkbtn" href="./#account">返回登录</a></div>';return;}
 user=u.data.user;
 const m=await sb.from('class_members').select('class_id,role,student_code,classes(name)').eq('user_id',user.id);
 if(m.error)throw m.error;
 const list=m.data||[],preferred=new URLSearchParams(location.search).get('class');
 member=list.find(x=>x.class_id===preferred&&(x.role==='teacher'||user.id===TEST46&&x.student_code==='46'))||list.find(x=>x.role==='teacher')||list.find(x=>user.id===TEST46&&x.student_code==='46');
 if(!member){app.innerHTML='<div class="loading"><h2>此账号无课堂权限</h2><p>目前仅正式教师账号可发布课件，46号测试账号可展示课件。其他学生端维持原样。</p><a class="linkbtn" href="./">返回数学基地</a></div>';return;}
 role=member.role==='teacher'?'teacher':'viewer';classId=member.class_id;
 if(role==='teacher'){await loadCatalog();await loadDraft();}else await loadPublic();
}catch(e){app.innerHTML='<div class="loading"><h2>课堂加载失败</h2><p>'+esc(e.message||e)+'</p><a href="./">返回数学基地</a></div>';}
}
function stageSelect(id){
 if(!STAGES.some(s=>s.id===id))return;
 const sections=role==='teacher'?draft?.sections:published?.sections;
 if(role==='viewer'&&!(sections?.[id]||[]).length)return;
 stage=id;
 if(branchSet(stage).length)branch=chooseBranch(sections);
 pageIndex=0;render();
}
function branchSelect(id){
 if(!branchSet(stage).some(b=>b.id===id))return;
 const sections=role==='teacher'?draft?.sections:published?.sections;
 if(role==='viewer'&&!filteredPages(sections,stage,id).length)return;
 branch=id;pageIndex=0;render();
}
function changePage(dir){
 const sections=role==='teacher'?draft?.sections:published?.sections;
 if(!sections||!dir)return;
 const arr=filteredPages(sections),next=pageIndex+dir;
 if(next>=0&&next<arr.length){pageIndex=next;render();return;}
 if(branchSet(stage).length){
  const kinds=branchSet(stage),from=kinds.findIndex(b=>b.id===branch);
  for(let j=from+Math.sign(dir);j>=0&&j<kinds.length;j+=Math.sign(dir)){
   const list=filteredPages(sections,stage,kinds[j].id);
   if(list.length){branch=kinds[j].id;pageIndex=dir>0?0:list.length-1;render();return;}
  }
 }
 const from=STAGES.findIndex(s=>s.id===stage);
 for(let j=from+Math.sign(dir);j>=0&&j<STAGES.length;j+=Math.sign(dir)){
  const nextStage=STAGES[j].id,list=sections[nextStage]||[];
  if(!list.length)continue;
  stage=nextStage;
  if(branchSet(stage).length)branch=chooseBranch(sections,dir<0);
  const items=filteredPages(sections);pageIndex=dir>0?0:items.length-1;
  render();return;
 }
}
function mark(){if(role!=='teacher')return;dirty=true;revision++;note('草稿已修改 · 即将自动保存');clearTimeout(timer);timer=setTimeout(()=>{saveDraft();},1500);}
async function saveDraft(force=false){
 if(role!=='teacher'||!draft||(!dirty&&!force))return true;
 if(saving){await saving;if(!dirty&&!force)return true;}
 const state=revision,payload={class_id:classId,lesson_date:date,owner_id:user.id,title:String(draft.title||'').slice(0,140),sections:draft.sections,updated_at:new Date().toISOString()};
 saving=(async()=>{try{
 const q=await sb.from('classroom_day_drafts').upsert(payload,{onConflict:'class_id,lesson_date'});
 if(q.error)throw q.error;
 if(state===revision){dirty=false;note('云端草稿已保存 ✓');}
 return true;
 }catch(e){note('保存失败：'+(e?.message||e),true);return false;}})();
 const ok=await saving;saving=null;if(dirty&&revision!==state){clearTimeout(timer);timer=setTimeout(saveDraft,900);}return ok;
}

async function loadCatalog(){
 const q=await sb.from('classroom_curriculum_resources').select('lesson_key,title,section,first_page,last_page').eq('class_id',classId).order('lesson_key',{ascending:true});
 if(q.error){console.warn('Textbook resource index unavailable:',q.error);return;}
 catalog=q.data||[];
 if(!selectedLessonKey||!catalog.some(x=>x.lesson_key===selectedLessonKey))selectedLessonKey=catalog[0]?.lesson_key||'';
}
function sourceToolbar(){
 const options=catalog.length?catalog.map(x=>'<option value="'+esc(x.lesson_key)+'" '+(selectedLessonKey===x.lesson_key?'selected':'')+'>'+esc(x.title)+'（P'+Number(x.first_page)+'–'+Number(x.last_page)+'）</option>').join(''):'<option value="">尚未导入教材课时资源</option>';
 return '<div class="curriculum-toolbar">'+
 '<strong>教材课时资源库</strong>'+
 '<select id="curriculumLesson" aria-label="选择教材课时" '+(!catalog.length?'disabled':'')+'>'+options+'</select>'+
 '<button class="smol primary" data-act="applyCurriculum" '+(!catalog.length?'disabled':'')+'>填入当天课件</button>'+
 '<label class="linkbtn smol">导入教材资源包<input id="curriculumImport" type="file" accept=".json,application/json" hidden></label>'+
 '<span class="muted small">已存 '+catalog.length+' / 54 课时 · 仅教师可管理，填入后仍需手动发布</span></div>';
}
async function importCatalogFile(file){
 if(role!=='teacher'||!file||importingCatalog)return;
 if(file.size>30000000){note('资源包超过30MB，请检查文件。',true);return;}
 importingCatalog=true;let added=0;
 try{
  const bundle=JSON.parse(await file.text());
  if(bundle?.format!=='RATIOBOT_TEXTBOOK_2026_V1'||!Array.isArray(bundle.lessons)||bundle.lessons.length!==54)throw Error('不是配套54课时教材资源包');
  let entries=bundle.lessons.map(L=>({
   class_id:classId,lesson_key:String(L.id).slice(0,70),owner_id:user.id,
   title:String(L.title).slice(0,160),section:String(L.section).slice(0,24),
   first_page:Number(L.firstPage)||1,last_page:Number(L.lastPage)||1,
   data:{sections:normalizeSections(L.sections),title:L.title,unit:L.unit,ordinal:L.ordinal,firstPage:L.firstPage,lastPage:L.lastPage,section:L.section},
   updated_at:new Date().toISOString()
  }));
  // Send individually to avoid hitting API request body limits; after failure, prior rows remain reusable.
  for(const item of entries){
   const r=await sb.from('classroom_curriculum_resources').upsert(item,{onConflict:'class_id,lesson_key'});
   if(r.error)throw Error(item.title+'：'+r.error.message);
   added++;if(added%4===0)note('正在安全保存教材资源 '+added+'/54 …');
  }
  await loadCatalog();render();note('✓ 54课时教材资源已保存到教师私有题库。请选择课时并点击“填入当天课件”。');
 }catch(e){note('导入未完成：已保存 '+added+'/54 课时。'+(e?.message||e),true);}
 finally{importingCatalog=false;}
}
function reviewPagesFor(L){
 const bank=window.KnowledgeReview?.bank||[];
 const m=/^([0-9]+)\.([0-9]+)$/.exec(String(L.section||''));if(!m)return [];
 const ch=Number(m[1]),sec=Number(m[2]),lo=Number(L.firstPage),hi=Number(L.lastPage);
 return bank.filter(item=>item.chapter===ch&&item.lesson===sec&&item.page>=lo&&item.page<=hi)
 .map(item=>({id:'recall-'+item.id,title:'知识点 · '+item.title+'（教材P'+item.page+'）',body:item.text.replace(/\{([^{}]+)\}/g,'$1'),images:[],branch:'recall'}));
}
async function fillFromCurriculum(){
 if(role!=='teacher'||!draft||!selectedLessonKey)return;
 const q=await sb.from('classroom_curriculum_resources').select('data').eq('class_id',classId).eq('lesson_key',selectedLessonKey).maybeSingle();
 if(q.error||!q.data?.data){note('未能读取所选课时资源。',true);return;}
 const L=q.data.data,sections=normalizeSections(L.sections);let added=0;
 const copyUnique=(key,p)=>{
  const bucket=draft.sections[key];if(bucket.some(existing=>existing.id===p.id))return;
  if(bucket.length>=50)return;
  bucket.push(safePage(p));added++;
 };
 for(const key of ['knowledge','example','practice']){
  for(const item of sections[key]||[])copyUnique(key,item);
 }
 for(const item of reviewPagesFor(L))copyUnique('exit',item);
 if(!draft.title.trim())draft.title=L.title||'今日数学课';
 mark();await saveDraft();
 if(added){
  stage=(sections.knowledge?.length?'knowledge':sections.example?.length?'example':sections.practice?.length?'practice':'exit');
  branch=branchSet(stage).length?chooseBranch(draft.sections,false,stage):'activity';
  pageIndex=0;
 }
 render();note('✓ 已填入 '+added+' 页。空模块继续在教师端添加；确认后点击“发布 / 更新给46号”。');
}

async function loadDraft(){
if(loading)return;loading=true;try{
const [a,b]=await Promise.all([
 sb.from('classroom_day_drafts').select('title,sections,updated_at').eq('class_id',classId).eq('lesson_date',date).maybeSingle(),
 sb.from('classroom_day_public').select('title,sections,published_at').eq('class_id',classId).eq('lesson_date',date).maybeSingle()
]);
if(a.error)throw a.error;if(b.error)throw b.error;
draft={title:a.data?.title||'',sections:normalizeSections(a.data?.sections)};
published=b.data||null;dirty=false;revision=0;stage='warmup';branch='activity';pageIndex=0;render();
}catch(e){app.innerHTML='<div class="loading"><h2>无法读取教师课件</h2><p>'+esc(e?.message||e)+'</p><a href="./">返回</a></div>';}finally{loading=false;}
}
async function loadPublic(reset=true){
if(loading)return;loading=true;
try{
const q=await sb.from('classroom_day_public').select('title,sections,published_at').eq('class_id',classId).eq('lesson_date',date).maybeSingle();
if(q.error)throw q.error;
published=q.data?{...q.data,sections:normalizeSections(q.data.sections)}:null;
if(reset){stage=STAGES.find(s=>(published?.sections?.[s.id]||[]).length)?.id||'warmup';branch=branchSet(stage).length?chooseBranch(published?.sections,false,stage):'activity';pageIndex=0;}
render();
}catch(e){app.innerHTML='<div class="loading"><h2>无法读取当天课件</h2><p>'+esc(e?.message||e)+'</p><button data-act="reload">重新读取</button></div>';}
finally{loading=false;}
}
function heading(){
return '<div class="eyebrow">'+(role==='teacher'?'LESSON PUBLISHER':'TODAY\'S LESSON')+'</div>'+
'<h2>'+(role==='teacher'?'每日课堂进度 · 发布题目':esc(published?.title||'今日数学课堂'))+'</h2>';
}
function editor(){
const current=paper(),list=pages(),count=list.length;
let html=top('课堂发布',true)+'<div class="shell">'+sidebar()+'<section class="workspace editor">'+heading();
html+='<div class="toolbar"><label>课题名称 <input id="lessonTitle" maxlength="140" style="min-width:250px" value="'+esc(draft.title||'')+'" placeholder="例如：3.2 代数式的概念"></label></div>';
html+='<div class="toolbar"><label>上课日期 <input id="lessonDate" type="date" value="'+esc(date)+'"></label><button data-act="save" class="smol">保存草稿</button><button data-act="publish" class="primary">发布 / 更新给46号</button>'+
(published?'<button data-act="withdraw" class="smol">撤回发布</button>':'')+
'<span class="pub-signal">'+(published?'✓ 该日已发布，可继续修改草稿后重新发布':'○ 未发布 · 46号暂不可见')+'</span></div>'+
sourceToolbar()+'<section class="panel">'+branchTabs(draft.sections)+'<div class="row" style="justify-content:space-between"><div><div class="eyebrow">STEP '+(STAGES.findIndex(s=>s.id===stage)+1)+'</div><h3>'+esc(stageName())+'</h3></div><button data-act="add" class="primary smol">＋ 添加题目页</button></div>'+
'<div class="page-strip">'+(list.length?list.map((p,i)=>'<button class="page-pill '+(i===pageIndex?'active':'')+'" data-act="page" data-i="'+i+'"><small>第 '+(i+1)+' 页</small><strong>'+esc(p.title||'题目 '+(i+1))+'</strong></button>').join(''):'<p class="muted small">此环节还没有题目。点击“添加题目页”。</p>')+'</div>';
if(current){
html+='<div class="page-ops"><button class="smol" data-act="left">← 前移</button><button class="smol" data-act="right">后移 →</button><button class="smol" data-act="duplicate">复制本页</button><button class="smol" data-act="delete">删除本页</button><span class="muted small">每题占一页，顺序就是课堂展示顺序。</span></div>'+
'<div class="edit-grid"><div><label>题目标题（可选）</label><input id="pageTitle" maxlength="160" value="'+esc(current.title)+'" placeholder="例如：例题 1">'+
'<label>题目正文（支持 LaTeX 公式、表格、图片标记）</label><textarea id="pageBody" maxlength="14000" placeholder="直接输入或粘贴题目；数学公式用 $...$，也可以上传课本截图。">'+esc(current.body)+'</textarea>'+
'<div class="import-actions"><label class="linkbtn">插入图片<input type="file" id="fileImage" accept="image/png,image/jpeg,image/webp" hidden></label>'+
'<label class="linkbtn">导入 Word<input type="file" id="fileWord" accept=".docx" hidden></label>'+
'<label class="linkbtn">图片识别文字<input type="file" id="fileOCR" accept="image/png,image/jpeg,image/webp" hidden></label></div>'+
'<p class="small muted">截图可直接粘贴在题干框内。Word 和图片识别沿用神秘房间的导入组件，复杂数学公式需人工校对。</p>'+
'<p class="small muted">图片标记示例：[IMG:1@85] 表示第 1 张图片，宽度 85%。</p></div>'+
'<div><div class="preview-label">投屏预览 · 教师审核</div><div id="questionPreview" class="preview"><h3>'+esc(current.title||stageName()+' · 第'+(pageIndex+1)+'题')+'</h3><div id="previewBody"></div></div>'+
'<div class="help"><strong>只发布题目</strong><br>此版本不设置答案、提示、自动判分或学生作答。一个环节可以加入多页。课本例题建议直接拍图或导入 Word，先校对再发布。</div></div></div>';
}else html+='<div class="empty">没有题目页。先添加一页，然后输入题目。</div>';
html+='</section></section></div>';
app.innerHTML=html;
if(current)viewContent(current,$('#previewBody'));
}
function viewer(){
let title=published?.title||'今日数学课',list=filteredPages(published?.sections),p=list[pageIndex]||null;
let html=top(title,false)+'<div class="shell">'+sidebar()+'<section class="workspace"><div class="viewer-heading"><div><div class="eyebrow">DATE · '+esc(date)+'</div><h2>'+esc(title)+'</h2></div>'+
'<div class="row"><button data-act="reload" class="smol">刷新课件</button><button data-act="fullscreen" class="smol">'+(full?'退出全屏':'全屏')+'</button></div></div>';
if(published)html+=branchTabs(published.sections);
if(!published){html+='<div class="panel centered"><div class="empty"><h2>今日课件尚未发布</h2><p>请先从正式教师账号选择今天的日期，编辑课堂内容并点击“发布 / 更新给46号”。</p><button data-act="reload" class="primary">重新读取今日进度</button></div></div>';}
else if(!p){html+='<div class="panel centered"><div class="empty"><h2>当前环节暂无题目</h2><p>选择左侧已有题目的环节。</p></div></div>';}
else{
html+='<div class="viewer-area panel"><div class="viewer-heading"><div class="screen-marker">'+esc(stageName())+' · '+(pageIndex+1)+' / '+list.length+'</div><div class="screen-marker">RATIOBOT CLASSROOM</div></div>'+
'<div class="viewer-title">'+esc(p.title||stageName()+' · 第'+(pageIndex+1)+'题')+'</div><div id="viewerBody" class="viewer-question"></div>'+
'<div class="viewer-foot"><div class="row"><button data-act="previous">← 上一页</button><button data-act="next" class="primary">下一页 →</button></div>'+
'<span class="small muted">方向键换页 · 数字 1–6 快速切换环节</span></div></div>';
}
html+='</section></div>';app.innerHTML=html;
if(p)viewContent(p,$('#viewerBody'));
document.body.classList.toggle('fullscreen-mode',full);
}
function render(){if(role==='teacher')editor();else viewer();}
function inputChange(e){
if(role!=='teacher'||!draft)return;
if(e.target.id==='lessonTitle'){draft.title=e.target.value;mark();return;}
if(!paper())return;
if(e.target.id==='pageTitle'){paper().title=e.target.value;mark();renderPreviewOnly();}
if(e.target.id==='pageBody'){paper().body=e.target.value;mark();renderPreviewOnly();}
}
function renderPreviewOnly(){const page=paper();if(!page)return;const h=$('#questionPreview h3');if(h)h.textContent=page.title||stageName()+' · 第'+(pageIndex+1)+'题';viewContent(page,$('#previewBody'));}
async function changeDate(v){
if(!validDay(v)||v===date)return;
if(role==='teacher'&&dirty){const ok=await saveDraft();if(!ok){note('草稿未保存，请先修复错误。',true);return;}}
date=v;if(role==='teacher')await loadDraft();else await loadPublic(true);
}
async function publish(){
if(!draft)return;
if(dirty){const ok=await saveDraft();if(!ok)return;}
const sections=blankSections();let total=0;
for(const s of STAGES){for(const p of draft.sections[s.id]){
if(!p.body.trim())continue;
sections[s.id].push(safePage(p));total++;
}}
if(!total){note('请至少填写一道题后再发布。',true);return;}
const payload={class_id:classId,lesson_date:date,publisher_id:user.id,title:String(draft.title||'数学课堂 · '+date).slice(0,140),sections,published_at:new Date().toISOString()};
const q=await sb.from('classroom_day_public').upsert(payload,{onConflict:'class_id,lesson_date'}).select('published_at').single();
if(q.error){note('发布失败：'+(q.error.message||'请重试'),true);return;}
published={...payload,published_at:q.data?.published_at};render();note('✓ 已发布！46号打开 '+date+' 的课堂即可看到。');
}
async function withdraw(){
if(!published||!window.confirm('确认撤回 '+date+' 的课堂？46号将不再能看到当天课件。'))return;
const q=await sb.from('classroom_day_public').delete().eq('class_id',classId).eq('lesson_date',date);
if(q.error){note('撤回失败：'+q.error.message,true);return;}
published=null;render();note('已撤回发布。草稿仍保留。');
}
async function importPicture(file,ocr=false){
if(!file||!paper()||busyImport)return;
busyImport=true;note(ocr?'正在识别图片，请稍候…':'正在压缩课本图片…');
try{
const q=window.QuestionImport;if(!q)throw Error('图片导入组件未加载');
const target=paper(),id=target.id;
const result=ocr?await q.ocr(file,s=>note(s),{cancelled:false}):{images:[await q.imageData(file,{preserveAlpha:true})],text:'',note:'图片已插入'};
const current=paper();if(!current||current.id!==id){note('当前页已切换，请重新导入。',true);return;}
if(result.text?.trim())current.body+=(current.body.trim()?'\n\n':'')+result.text.trim();
for(const image of (result.images||[])){
 if(current.images.length>=8)break;
 current.images.push(image);current.body+=(current.body.trim()?'\n\n':'')+'[IMG:'+current.images.length+'@85]';
}
mark();render();note(result.note||'导入完成，请检查题目后发布。');
}catch(e){note('导入失败：'+(e?.message||e),true);}finally{busyImport=false;}
}
async function importWord(file){
if(!file||!paper()||busyImport)return;
busyImport=true;note('正在读取 Word，请稍候…');
try{
const target=paper(),id=target.id,r=await window.QuestionImport.docx(file);
if(!paper()||paper().id!==id){note('当前页已切换，请重新导入。',true);return;}
const parsed=window.QuestionImport.parse(r.text||'');
const title=parsed.title||'',body=parsed.body||r.text||'';
if(title&&!target.title)target.title=title.slice(0,160);
target.body+=(target.body.trim()?'\n\n':'')+body.trim();
for(const pic of r.images||[]){if(target.images.length>=8)break;target.images.push(pic);target.body+=(target.body.trim()?'\n\n':'')+'[IMG:'+target.images.length+'@85]';}
mark();render();note(r.note||'Word 题目已导入，发布前请校对。');
}catch(e){note('Word 导入失败：'+(e?.message||e),true);}finally{busyImport=false;}
}
function addPage(){
if(!draft)return;
if(pageStore().length>=50){note('每个主环节最多 50 页。',true);return;}
const item=createPage();
if(branchSet(stage).length)item.branch=branch;
pageStore().push(item);pageIndex=pages().length-1;mark();render();
}
async function clickAction(button){
const act=button.dataset.act;
if(act==='stage'){stageSelect(button.dataset.id);return;}
if(act==='branch'){branchSelect(button.dataset.id);return;}
if(act==='page'){pageIndex=Math.max(0,Math.min(Number(button.dataset.i)||0,pages().length-1));render();return;}
if(act==='reload'){await loadPublic(true);note('已重新读取发布内容。');return;}
if(act==='fullscreen'){
 try{
  if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();
 }catch(e){note('浏览器不支持全屏：'+(e?.message||''),true);}
 return;
}
if(act==='previous'||act==='next'){changePage(act==='next'?1:-1);return;}
if(role!=='teacher')return;
if(act==='applyCurriculum'){await fillFromCurriculum();return;}
if(act==='add'){addPage();return;}
if(act==='left'||act==='right'){
const i=pageIndex,j=i+(act==='left'?-1:1),visible=pages();if(j<0||j>=visible.length)return;
const arr=pageStore(),first=arr.indexOf(visible[i]),second=arr.indexOf(visible[j]);
if(first<0||second<0)return;
[arr[first],arr[second]]=[arr[second],arr[first]];pageIndex=j;mark();render();return;
}
if(act==='duplicate'){
const p=paper();if(!p)return;const copy=safePage(p);copy.id=unique();
const store=pageStore(),i=store.indexOf(p);store.splice(i+1,0,copy);
pageIndex++;mark();render();return;
}
if(act==='delete'){
if(!paper()||!window.confirm('删除当前题目页？'))return;
const store=pageStore(),i=store.indexOf(paper());if(i>=0)store.splice(i,1);
pageIndex=Math.max(0,Math.min(pageIndex,pages().length-1));mark();render();return;
}
if(act==='save'){await saveDraft(true);return;}
if(act==='publish'){await publish();return;}
if(act==='withdraw'){await withdraw();return;}
}
document.addEventListener('input',e=>inputChange(e));
document.addEventListener('change',async e=>{
if(e.target.id==='lessonDate'){await changeDate(e.target.value);return;}
if(e.target.id==='curriculumLesson'){selectedLessonKey=e.target.value;return;}
if(e.target.id==='curriculumImport'){await importCatalogFile(e.target.files?.[0]);return;}
if(e.target.id==='fileImage'){await importPicture(e.target.files?.[0]);}
if(e.target.id==='fileOCR'){await importPicture(e.target.files?.[0],true);}
if(e.target.id==='fileWord'){await importWord(e.target.files?.[0]);}
});
document.addEventListener('paste',async e=>{
if(role!=='teacher'||e.target.id!=='pageBody')return;
const item=Array.from(e.clipboardData?.items||[]).find(it=>it.type.startsWith('image/'));
if(item){e.preventDefault();await importPicture(item.getAsFile());}
});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(b)clickAction(b).catch(x=>note(x.message||String(x),true));});
document.addEventListener('keydown',e=>{
if(role!=='viewer'||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||''))return;
if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();changePage(e.key==='ArrowRight'?1:-1);}
if(/^[1-6]$/.test(e.key))stageSelect(STAGES[Number(e.key)-1].id);
});
document.addEventListener('fullscreenchange',()=>{full=!!document.fullscreenElement;document.body.classList.toggle('fullscreen-mode',full);const b=$('[data-act="fullscreen"]');if(b)b.textContent=full?'退出全屏':'全屏';});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
boot();
})();