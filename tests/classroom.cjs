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
assert(!src.includes('classroom_responses')&&!src.includes('classroom_live'),'student response features removed');
assert(src.includes('Asia/Shanghai'),'date follows China classroom date');
assert(src.includes("role=member.role==='teacher'")&&src.includes('TEST46'),'46 viewer and teacher scopes');
assert(src.includes("if(role!=='teacher')return"),'teacher-only mutation');
assert(src.includes('async function publish()')&&src.includes('saveDraft()')&&src.includes('loadPublic('));
assert(src.includes('QuestionImport.docx')&&src.includes('QuestionImport.ocr')&&src.includes('QuestionImport.imageData'));
assert(css.includes('.stage-aside')&&css.includes('.viewer-question'),'step-based projection layout');
assert(!entry.includes("a.href='classroom.html'+(access?'':'?student=1')"),'old student menu must be absent');

const pub={title:'3.2 代数式的概念',sections:{warmup:[{id:'q1',title:'课前诊断',body:'$x+3$',images:[]}],intro:[],knowledge:[],example:[{id:'q2',title:'例题1',body:'$2a$',images:[]}],practice:[],exit:[{id:'q3',title:'课堂检测',body:'$4a$',images:[]}]},published_at:'2026-10-10T01:00:00Z'};
const draft={title:'教师草稿课题',sections:pub.sections};
const teacherId='85b3350a-5457-4adb-be73-9c9c4e1c46e7',testerId='d12f28d3-a8d3-4fc3-a2e0-0aeab43e9920';
async function page(id,role,student_code){
 const d=new JSDOM(html,{url:'https://similar16.github.io/RATIOBOT-Math-Core/classroom.html',runScripts:'outside-only',pretendToBeVisual:true});
 const win=d.window;
 win.QuestionContent={content:s=>'<div class="qb-text">'+s+'</div>',math:()=>{}};
 win.supabase={createClient:()=>({
  auth:{getUser:async()=>({data:{user:{id}}})},
  from:table=>{
   const x={
    select(){return x;},eq(){return x;},
    async maybeSingle(){return{data:table==='classroom_day_drafts'?draft:table==='classroom_day_public'?pub:null,error:null};},
    then(resolve,reject){return Promise.resolve({data:[{class_id:'class-uuid',role,student_code,classes:{name:'七年级35班'}}],error:null}).then(resolve,reject);}
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
assert(d.window.document.body.textContent.includes('例题1'),'next moves across populated lesson stages');
d.window.close();
d=await page(teacherId,'teacher',null);
assert(d.window.document.querySelector('#lessonDate'),'teacher has date picker');
assert(d.window.document.querySelector('#lessonTitle'),'teacher can edit lesson title');
assert(d.window.document.querySelector('[data-act="publish"]'),'teacher has publish button');
assert(d.window.document.querySelector('#pageBody'),'teacher can edit question body');
d.window.close();
d=await page('student-1','student','1');
assert(d.window.document.body.textContent.includes('此账号无课堂权限'),'regular student cannot use classroom');
assert(!d.window.document.querySelector('.stage-aside'),'regular student does not see presentation');
d.window.close();
console.log('Classroom V2: JS syntax, teacher editor, account 46 viewer, normal-student exclusion, stage navigation OK');
})().catch(e=>{console.error(e);process.exitCode=1;});