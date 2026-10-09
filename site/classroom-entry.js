(function(){
'use strict';
const TEST46='d12f28d3-a8d3-4fc3-a2e0-0aeab43e9920';
if(!window.supabase?.createClient)return;
const sb=window.supabase.createClient('https://bqtidgxpinhtkmrspres.supabase.co','sb_publishable_rtdSVt1mkCBTrS78kUvzNQ_slSc76Ye',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
let seq=0;
async function refresh(){
 const cycle=++seq;
 try{
 const r=await sb.auth.getUser();if(cycle!==seq)return;
 const u=r.data?.user;let teacher=false,viewer=false;
 if(u){
  const q=await sb.from('class_members').select('role,student_code').eq('user_id',u.id);
  if(cycle!==seq)return;
  teacher=!!q.data?.some(v=>v.role==='teacher');
  viewer=!teacher&&u.id===TEST46&&!!q.data?.some(v=>v.student_code==='46');
 }
 // Remove the superseded student-facing classroom menu entry.
 document.querySelector('#classroomMenuLink')?.remove();
 // Only account 46 gets the direct launch button; no normal-student UI change.
 const top=document.querySelector('.top-actions');
 let a=document.querySelector('#classroom46Shortcut');
 if(viewer&&top){
  if(!a){a=document.createElement('a');a.id='classroom46Shortcut';a.href='classroom.html';a.textContent='课堂交互';a.style.cssText='border:2px solid #3e3540;border-radius:12px;background:#f6c34a;padding:8px 11px;color:#3e3540;font-weight:900;text-decoration:none;font-size:12px';top.insertBefore(a,top.firstChild);}
  a.hidden=false;a.style.display='inline-flex';
 }else if(a){a.remove();}
 // Formal teacher account gets publishing; this is not shown to any student.
 for(const selector of ['.teacher-tabs','#teacherNavigation']){
  const panel=document.querySelector(selector);
  if(!panel)continue;
  let link=panel.querySelector('.classroom-teacher-nav');
  if(teacher){
   if(!link){link=document.createElement('a');link.className='classroom-teacher-nav';link.href='classroom.html';link.textContent='课堂进度发布 ↗';link.style.cssText='display:inline-flex;align-items:center;padding:10px 14px;margin:2px 5px;border:3px solid #3e3540;border-radius:99px;background:#f6c34a;color:#3e3540;text-decoration:none;font-weight:900;font-size:12px';panel.appendChild(link);}
   link.hidden=false;link.style.display='inline-flex';
  }else link?.remove();
 }
 }catch(e){console.warn('Classroom entry identity refresh failed',e);}
}
sb.auth.onAuthStateChange(()=>{setTimeout(refresh,160);});
setTimeout(refresh,500);
})();