(function(){
'use strict';
const TEST46='d12f28d3-a8d3-4fc3-a2e0-0aeab43e9920';
if(!window.supabase?.createClient)return;
const sb=window.supabase.createClient('https://bqtidgxpinhtkmrspres.supabase.co','sb_publishable_rtdSVt1mkCBTrS78kUvzNQ_slSc76Ye',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
let seq=0;
async function refresh(){
const epoch=++seq;
const {data:{user}}=await sb.auth.getUser();
if(epoch!==seq)return;
let access=false,teacher=false;
if(user){const q=await sb.from('class_members').select('role,student_code').eq('user_id',user.id);
if(epoch!==seq)return;
teacher=!!q.data?.some(x=>x.role==='teacher');
access=teacher||!!q.data?.some(x=>user.id===TEST46&&x.student_code==='46');
}
const root=document.querySelector('.student-game-menu-grid');
if(root){
let a=document.getElementById('classroomMenuLink');
if(!a){a=document.createElement('a');a.id='classroomMenuLink';a.style.cssText='display:flex;flex-direction:column;gap:3px;justify-content:center;min-height:65px;border:3px solid #3e3540;border-radius:13px;background:#e1f4ea;color:#3e3540;text-decoration:none;padding:9px 13px';root.appendChild(a);}
a.href='classroom.html'+(access?'':'?student=1');
a.innerHTML='<small>05 · CLASSROOM</small><b>'+(access?'课堂交互':'课堂作答')+'</b><small>'+(access?'备课 · 投屏 · 随堂检测':'跟随课堂 · 提交答案')+'</small>';
a.hidden=!user||teacher;
a.style.display=a.hidden?'none':'flex';
}
let shortcut=document.getElementById('classroom46Shortcut');
const top=document.querySelector('.top-actions');
if(top&&!shortcut){shortcut=document.createElement('a');shortcut.id='classroom46Shortcut';shortcut.href='classroom.html';shortcut.textContent='课堂交互';shortcut.style.cssText='border:2px solid #3e3540;border-radius:12px;background:#f6c34a;padding:8px 11px;color:#3e3540;font-weight:900;text-decoration:none;font-size:12px';top.insertBefore(shortcut,top.firstChild);}
if(shortcut)shortcut.style.display=access&&!teacher?'inline-flex':'none';
for(const sel of ['.teacher-tabs','#teacherNavigation']){
let parent=document.querySelector(sel);if(!parent)continue;
let link=parent.querySelector('.classroom-teacher-nav');
if(!link){link=document.createElement('a');link.className='classroom-teacher-nav';link.href='classroom.html';link.textContent='课堂交互 ↗';link.style.cssText='display:inline-flex;align-items:center;padding:10px 14px;margin:2px 5px;border:3px solid #3e3540;border-radius:99px;background:#f6c34a;color:#3e3540;text-decoration:none;font-weight:900;font-size:12px';parent.appendChild(link);}
link.style.display=teacher?'inline-flex':'none';
}
}
sb.auth.onAuthStateChange(()=>{setTimeout(refresh,160);});
setTimeout(refresh,350);
})();