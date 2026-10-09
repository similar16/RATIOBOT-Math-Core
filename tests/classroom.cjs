'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),{JSDOM}=require('jsdom');
const root=path.resolve(process.env.SITE_DIR||'site');
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const html=read('classroom.html'),src=read('classroom.js'),entry=read('classroom-entry.js'),css=read('classroom.css'),home=read('index.html');
new vm.Script(src,{filename:'classroom.js'});new vm.Script(entry,{filename:'classroom-entry.js'});
assert(html.includes('id="classroomApp"'));
assert(html.includes('question-content.js')&&html.includes('question-import.js'));
assert(home.includes('classroom-entry.js'));
assert(src.includes('classroom_day_drafts')&&src.includes('classroom_day_public'));
assert(src.includes('classroom_curriculum_resources'),'teacher-only textbook catalogue exists');
assert(src.includes('reviewPagesFor')&&src.includes('KnowledgeReview'),'knowledge bank reuse required');
assert(src.includes("label:'知识点回顾'")&&src.includes("label:'快速练习'"),'two exit submodules required');
assert(html.includes('review-engine.js'),'original knowledge point engine loaded');
assert(!src.includes('classroom_responses')&&!src.includes('classroom_live'),'student response features removed');
assert(src.includes('Asia/Shanghai'),'date follows China classroom date');
assert(src.includes("role=member.role==='teacher'")&&src.includes('TEST46'),'46 viewer and teacher scopes');
assert(src.includes("if(role!=='teacher')return"),'teacher-only mutation');
assert(src.includes('async function publish()')&&src.includes('saveDraft()')&&src.includes('loadPublic('));
assert(src.includes('window.QuestionImport.docx')&&src.includes('q.ocr')&&src.includes('q.imageData'),'existing Word/OCR/image import helpers reused');
assert(css.includes('.stage-aside')&&css.includes('.viewer-question'),'step-based projection layout');
assert(css.includes('.substage-tabs')&&css.includes('min-height:29px'),'compact substage navigation');
assert(css.includes('.visibility-tools')&&css.includes('.page-hidden'),'teacher visibility UI styles');
assert(css.includes('.recall-controls'),'oral recall presentation controls');
assert(src.includes("p.hidden===true")&&src.includes("p.hidden!==true"),'hidden page marker is supported');
assert(src.includes('function recallTemplate(p)')&&src.includes('function recallDisplayText(p'),'cloze display reads original knowledge markers');
assert(src.includes('clozeTemplate:item.text'),'original marked source is retained');
assert(src.includes('data-act="toggleBranchVisibility"')&&src.includes('data-act="togglePageVisibility"'),'teacher can hide categories and pages');
assert(src.includes('data-act="toggleRecall"'),'teacher can reveal original after oral recall');
for(const name of ['活动','问题','尝试','探究','讨论','其他']){
 assert(src.includes("label:'"+name+"'"),'missing classroom branch '+name);
}
assert(src.includes("label:'课堂环节'"),'main stage renamed without changing ID');
assert(!src.includes("label:'知识点梳理'"),'old main stage label removed');
assert(src.includes("function branchOf(p,group='knowledge')")&&src.includes("group==='exit'?'quick':'other'"),'old knowledge items default to other; old exit items default to quick');

assert(!entry.includes("a.href='classroom.html'+(access?'':'?student=1')"),'old student menu must be absent');

const pub={title:'3.2 代数式的概念',sections:{warmup:[{id:'q1',title:'课前诊断',body:'$x+3$',images:[]}],intro:[],knowledge:[
{id:'act1',branch:'activity',title:'活动一',body:'活动题目A',images:[]},
{id:'ques1',branch:'question',title:'问题一',body:'问题题目B',images:[]},
{id:'act2',branch:'activity',title:'活动二',body:'活动题目C',images:[]},
{id:'old1',title:'旧知识点',body:'未分类的历史内容',images:[]}
],example:[{id:'q2',title:'例题1',body:'$2a$',images:[]}],practice:[],exit:[{id:'q3',title:'课堂检测',body:'$4a$',images:[]}]},published_at:'2026-10-10T01:00:00Z'};
const draft={title:'教师草稿课题',sections:pub.sections};
const teacherId='85b3350a-5457-4adb-be73-9c9c4e1c46e7',testerId='d12f28d3-a8d3-4fc3-a2e0-0aeab43e9920';
async function page(id,role,student_code){
 const d=new JSDOM(html,{url:'https://similar16.github.io/RATIOBOT-Math-Core/classroom.html',runScripts:'outside-only',pretendToBeVisual:true});
 const win=d.window,writes=[];
 win.__testWrites=writes;
 win.KnowledgeReview={bank:[{id:'k1',title:'有理数的定义',text:'{整数}和{分数}统称为{有理数}。'}]};
 win.QuestionContent={content:s=>'<div class="qb-text">'+s+'</div>',math:()=>{}};
 win.supabase={createClient:()=>({
  auth:{getUser:async()=>({data:{user:{id}}})},
  from:table=>{
   let writing=false;
   const x={
    select(){return x;},eq(){return x;},order(){return x;},
    upsert(payload){writes.push({table,payload});writing=true;return x;},
    async single(){return{data:{published_at:'2026-10-10T09:00:00Z'},error:null};},
    async maybeSingle(){return{data:table==='classroom_day_drafts'?draft:table==='classroom_day_public'?pub:null,error:null};},
    then(resolve,reject){return Promise.resolve(writing?{data:null,error:null}:{data:table==='classroom_curriculum_resources'?[]:[{class_id:'class-uuid',role,student_code,classes:{name:'七年级35班'}}],error:null}).then(resolve,reject);}
   };return x;
  }
 })};
 win.eval(src);await new Promise(ok=>setTimeout(ok,35));
 return d;
}
(async()=>{
let d=await page(testerId,'student','46');
assert(d.window.document.querySelector('#viewerBody'),'46 goes directly into published lesson presentation');
assert.equal(d.window.document.querySelectorAll('.stage-btn').length,6);
assert(!d.window.document.querySelector('#pageBody'),'46 has no editing field');
assert(!d.window.document.querySelector('#studentAnswer'),'no student response UI');
assert(d.window.document.body.textContent.includes('课前诊断'));
d.window.document.querySelector('[data-act="next"]').click();
assert(d.window.document.body.textContent.includes('活动一'),'next moves into first classroom substage');
assert.equal(d.window.document.querySelectorAll('.substage-tab').length,6,'six compact branches appear only for classroom');
assert(d.window.document.body.textContent.includes('课堂环节'));
d.window.document.querySelector('[data-act="next"]').click();
assert(d.window.document.body.textContent.includes('活动二'),'next moves within same branch');
d.window.document.querySelector('[data-act="next"]').click();
assert(d.window.document.body.textContent.includes('问题一'),'next proceeds to next populated branch');
d.window.document.querySelector('[data-act="branch"][data-id="other"]').click();
assert(d.window.document.body.textContent.includes('旧知识点'),'pre-existing unclassified questions remain under other');
d.window.document.querySelector('[data-act="previous"]').click();
assert(d.window.document.body.textContent.includes('问题一'),'previous returns to earlier branch');
d.window.document.querySelector('[data-act="stage"][data-id="example"]').click();
assert(d.window.document.body.textContent.includes('例题1'),'other major stages remain navigable');
assert.equal(d.window.document.querySelectorAll('.substage-tab').length,0,'substage buttons do not leak into other stages');
d.window.close();
d=await page(teacherId,'teacher',null);
assert(d.window.document.querySelector('#lessonDate'),'teacher has date picker');
assert(d.window.document.querySelector('#lessonTitle'),'teacher can edit lesson title');
assert(d.window.document.querySelector('#curriculumImport'),'teacher can upload a textbook lesson package');
assert(d.window.document.querySelector('[data-act="publish"]'),'teacher has publish button');
assert(d.window.document.querySelector('#pageBody'),'teacher can edit question body');
d.window.document.querySelector('[data-act="stage"][data-id="knowledge"]').click();
assert.equal(d.window.document.querySelectorAll('.substage-tab').length,6,'teacher sees six subtypes');
d.window.document.querySelector('[data-act="branch"][data-id="other"]').click();
assert(d.window.document.querySelector('#pageBody').value.includes('未分类的历史内容'),'teacher still can edit legacy question');
d.window.document.querySelector('[data-act="branch"][data-id="explore"]').click();
assert(!d.window.document.querySelector('#pageBody'),'empty subtype has empty page list');
d.window.document.querySelector('[data-act="add"]').click();
assert(d.window.document.querySelector('#pageBody'),'teacher can add a page within selected subtype');
let el=d.window.document.querySelector('#pageBody');
el.value='新探究内容';
el.dispatchEvent(new d.window.Event('input',{bubbles:true}));
d.window.document.querySelector('[data-act="branch"][data-id="discussion"]').click();
assert(!d.window.document.querySelector('#pageBody'),'new explore page is absent in another subtype');
d.window.document.querySelector('[data-act="branch"][data-id="explore"]').click();
assert(d.window.document.querySelector('#pageBody').value==='新探究内容','new page is preserved when switching subtypes');
d.window.document.querySelector('[data-act="duplicate"]').click();
assert.equal(d.window.document.querySelectorAll('.page-pill').length,2,'duplicate creates second page in same subtype');
d.window.document.querySelector('[data-act="left"]').click();
assert.equal(d.window.document.querySelectorAll('.page-pill').length,2,'sort does not lose subtyped pages');
d.window.document.querySelector('[data-act="stage"][data-id="exit"]').click();
assert.equal(d.window.document.querySelectorAll('.substage-tab').length,2,'exit check has two submodules');
assert(d.window.document.body.textContent.includes('知识点回顾')&&d.window.document.body.textContent.includes('快速练习'));
assert(d.window.document.querySelector('[data-act="branch"][data-id="quick"]'),'teacher can select quick practice');
d.window.document.querySelector('[data-act="stage"][data-id="warmup"]').click();
assert.equal(d.window.document.querySelectorAll('.substage-tab').length,0,'other teacher sections unchanged');
d.window.close();
d=await page('student-1','student','1');
assert(d.window.document.body.textContent.includes('此账号无课堂权限'),'regular student cannot use classroom');
assert(!d.window.document.querySelector('.stage-aside'),'regular student does not see presentation');
d.window.close();

// Hidden imported activity and an entirely hidden branch: neither must appear in 46's projector.
pub.sections.knowledge.push({id:'hiddenActivity',branch:'activity',title:'内部备用活动',body:'只给教师看',images:[],hidden:true});
pub.sections.knowledge.push({id:'hiddenDiscussion',branch:'discussion',title:'备选讨论',body:'不得显示',images:[],hidden:true});
pub.sections.exit=[
 {id:'recallCard',title:'知识点 · 有理数',body:'整数和分数统称为有理数。',images:[],branch:'recall',knowledgeId:'k1'},
 {id:'quickCard',title:'快速练习',body:'试计算 2+3',images:[],branch:'quick'}
];
d=await page(testerId,'student','46');
d.window.document.querySelector('[data-act="stage"][data-id="knowledge"]').click();
assert(!d.window.document.querySelector('[data-act="branch"][data-id="discussion"]'),'hidden entire discussion category omitted from viewer');
assert.equal(d.window.document.querySelectorAll('.substage-tab').length,3,'viewer sees only nonempty visible knowledge branches');
assert(d.window.document.body.textContent.includes('活动一'));
assert(!d.window.document.body.textContent.includes('内部备用活动'),'hidden title never displayed to viewer');
d.window.document.querySelector('[data-act="next"]').click();
assert(d.window.document.body.textContent.includes('活动二'),'forward navigation skips hidden activity');
d.window.document.querySelector('[data-act="stage"][data-id="exit"]').click();
assert(d.window.document.querySelector('#viewerBody').textContent.includes('＿＿＿'),'key concepts are blank by default');
assert(!d.window.document.querySelector('#viewerBody').textContent.includes('有理数'),'cloze answer not revealed');
assert(d.window.document.querySelector('[data-act="toggleRecall"]'),'projection can toggle source definition');
d.window.document.querySelector('[data-act="toggleRecall"]').click();
assert(d.window.document.querySelector('#viewerBody').textContent.includes('整数和分数统称为有理数。'),'show answer exactly matches existing knowledge source');
d.window.document.querySelector('[data-act="next"]').click();
assert(d.window.document.body.textContent.includes('快速练习'),'quick exercise navigation unaffected');
d.window.document.querySelector('[data-act="previous"]').click();
assert(d.window.document.querySelector('#viewerBody').textContent.includes('＿＿＿'),'returning to recall automatically hides previous answer');
d.window.close();

// Teacher keeps the hidden content editable, can hide entire category and restore it.
d=await page(teacherId,'teacher',null);
d.window.document.querySelector('[data-act="stage"][data-id="knowledge"]').click();
assert(d.window.document.querySelector('.visibility-tools'),'teacher sees category visibility toolbar');
assert.equal(d.window.document.querySelectorAll('.page-pill').length,3,'teacher still sees hidden and visible pages');
assert(d.window.document.querySelector('.page-hidden'),'hidden teacher draft page is visibly marked');
d.window.document.querySelector('[data-act="toggleBranchVisibility"]').click();
assert.equal(d.window.document.querySelectorAll('.page-hidden').length,3,'hide entire activity category');
d.window.document.querySelector('[data-act="toggleBranchVisibility"]').click();
assert.equal(d.window.document.querySelectorAll('.page-hidden').length,0,'restore category makes all pages visible without deleting them');
d.window.document.querySelector('[data-act="togglePageVisibility"]').click();
assert(d.window.document.querySelector('.page-hidden'),'single page can be hidden independently');
d.window.document.querySelector('[data-act="branch"][data-id="discussion"]').click();
assert(d.window.document.querySelector('#pageBody').value.includes('不得显示'),'teacher can edit hidden branch content');
d.window.document.querySelector('[data-act="stage"][data-id="exit"]').click();
assert(d.window.document.querySelector('.substage-tab'),'teacher retains existing exit submodules');
assert(d.window.document.querySelector('#previewBody').textContent.includes('＿＿＿'),'teacher preview also shows oral recall blanks');
await (async()=>{
 const publishButton=d.window.document.querySelector('[data-act="publish"]');
 publishButton.click();
 await new Promise(ok=>setTimeout(ok,60));
 const pubWrite=d.window.__testWrites.find(x=>x.table==='classroom_day_public');
 assert(pubWrite,'teacher publish writes sanitized classroom content');
 assert(pubWrite.payload.sections.knowledge.every(p=>p.hidden!==true),'hidden classroom pages never stored in 46-readable published data');
 assert(!pubWrite.payload.sections.knowledge.some(p=>p.id==='hiddenDiscussion'),'fully hidden category has no published pages');
})();
d.window.close();
console.log('Classroom V3: legacy navigation, teacher-only hiding, published filtering, oral recall blanks/reveal, normal student exclusion OK');
})().catch(e=>{console.error(e);process.exitCode=1;});