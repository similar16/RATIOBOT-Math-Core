/* RATIOBOT H · 错题修复站。仅使用当前云端账号与 RLS，绝不跨账号缓存。 */
(function(){
'use strict';
const B=window.RatioMistakeBridge;
const root=document.querySelector('#practiceMistakes'),teacher=document.querySelector('#teacherPracticeMistakesContent');
if(!B||!root||!teacher)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&#39;'}[c]));
const safe=s=>String(s??'').slice(0,4000).trim();
const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date());
const dateAfter=n=>{const d=new Date(today()+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
const session=()=>B.identity()||{};
const uid=()=>session().user?.id||'';
const ident=()=>uid()+'|'+(session().classId||'')+'|'+(session().role||'');
const isStudent=()=>!!uid()&&session().role==='student'&&!!session().classId&&!session().mustChangePassword;
const isTeacher=()=>!!uid()&&session().role==='teacher'&&!!session().classId;
let list=[],loaded='',teacherList=[],roster=[],teacherClass='',teacherSeq=0,studentSeq=0,filter='due',search='',teacherFilter='',lastError='',queue=[],pos=0,active=false,answerStatus='';
function hash(s){let a=2166136261,b=5381;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b,33)^c;}return (a>>>0).toString(36)+(b>>>0).toString(36);}
function showMath(s){const value=String(s??'').trim();if(!value)return '';const q=value.replace(/^\$\$|\$\$$/g,'').replace(/^\$|\$$/g,'');try{if(window.katex&&(/\\[a-z]+|[\^_{}]/.test(q)||/\$\$?/.test(value))){return window.katex.renderToString(q,{throwOnError:false,output:'html',trust:false});}}catch(e){}return esc(value);}
function summary(rows){return {total:rows.length,pending:rows.filter(x=>x.status!=='mastered').length,due:rows.filter(x=>x.status!=='mastered'&&x.due_on<=today()).length,mastered:rows.filter(x=>x.status==='mastered').length};}
function status(text){const el=root.querySelector('#mbStatus');if(el)el.textContent=text;}
function teacherStatus(text){const el=teacher.querySelector('#mbTeacherStatus');if(el)el.textContent=text;}
function badge(x){return x.status==='mastered'?'已掌握':x.due_on<=today()?'到期':'巩固中';}
async function refresh(silent=false){
 if(!isStudent()){list=[];loaded='';renderStudent();return;}
 const k=ident(),seq=++studentSeq;
 if(!silent)root.innerHTML='<div class="mb-pending">正在从云端读取当前账号的错题…</div>';
 try{const r=await B.client().from('mistake_items').select('*').eq('user_id',uid()).eq('class_id',session().classId).order('updated_at',{ascending:false}).limit(800);
 if(r.error)throw r.error;if(seq!==studentSeq||k!==ident())return;list=r.data||[];loaded=k;lastError='';renderStudent();}
 catch(e){if(seq!==studentSeq)return;lastError='云端读取失败：'+(e.message||'请检查网络');renderStudent();}
}
async function capture(x){
 if(!isStudent()||!x||!safe(x.question)||!String(x.correctAnswer??'').trim())return false;
 const who=uid(),cls=session().classId,kind=String(x.kind||'manual').slice(0,45);
 const sourceKey=String(x.sourceKey||('auto:'+hash([kind,x.question,x.correctAnswer].join('|')))).slice(0,160);
 const base={class_id:cls,user_id:who,source_key:sourceKey,source:String(x.source||'在线训练').slice(0,60),
 kind,topic:String(x.topic||'未分类').slice(0,100),question:safe(x.question),correct_answer:String(x.correctAnswer).slice(0,1200),
 submitted_answer:String(x.studentAnswer||'').slice(0,1200),variant_question:safe(x.variantQuestion||''),
 variant_answer:String(x.variantAnswer||'').slice(0,1200),error_type:String(x.errorType||'待分析').slice(0,100)};
 try{
 const db=B.client();
 const old=await db.from('mistake_items').select('id,times_wrong').eq('user_id',who).eq('source_key',sourceKey).maybeSingle();
 if(old.error)throw old.error;
 const payload=old.data?{submitted_answer:base.submitted_answer,times_wrong:Math.min(9999,(old.data.times_wrong||0)+1),success_streak:0,status:'pending',due_on:today(),last_wrong_at:new Date().toISOString(),updated_at:new Date().toISOString()}:{...base,due_on:today()};
 const r=old.data?await db.from('mistake_items').update(payload).eq('id',old.data.id).eq('user_id',who):await db.from('mistake_items').insert(payload);
 if(r.error)throw r.error;
 if(loaded===ident()&&root.classList.contains('mb-open'))void refresh(true);
 return true;
 }catch(e){lastError='有错题未能同步：'+String(e.message||'网络异常');status(lastError);return false;}
}
function startQueue(ids){
 if(!isStudent())return;queue=ids.map(id=>list.find(x=>x.id===id)).filter(Boolean);pos=0;active=!!queue.length;answerStatus='';if(active)renderRetry();else status('当前没有需要重测的题目。');
}
function studentCard(x){
 return '<article class="mb-item"><div class="mb-item-head"><b>'+esc(x.topic||'未分类')+'</b><span class="mb-chip '+(x.status==='mastered'?'is-mastered':'')+'">'+badge(x)+'</span></div><div class="mb-q">'+showMath(x.question)+'</div><div class="mb-meta">'+esc(x.source)+' · 原错 '+x.times_wrong+' 次 · 重测 '+x.retry_count+' 次'+(x.selected_for_retest?' · 教师重点':'')+'</div><div class="mb-footer"><span>下次 '+esc(x.due_on||'待定')+'</span><button class="ghost small" data-mb-one="'+esc(x.id)+'">单题重测</button></div></article>';
}
function renderStudent(){
 if(!isStudent()){root.innerHTML='<div class="page-heading"><div><div class="eyebrow">PART H · MISTAKE REPAIR</div><h2>错题修复站</h2><p>登录后查看属于自己的错题。</p></div></div><p>请先登录学生账号。</p><button class="primary" id="mbLogin">前往登录</button>';root.querySelector('#mbLogin').onclick=()=>B.go('account');return;}
 const s=summary(list),visible=list.filter(x=>(filter==='all'||filter==='mastered'&&x.status==='mastered'||filter==='due'&&x.status!=='mastered'&&x.due_on<=today()||filter==='pending'&&x.status!=='mastered')&&(!search||[x.question,x.topic,x.source].join(' ').toLowerCase().includes(search.toLowerCase()))),due=list.filter(x=>x.status!=='mastered'&&x.due_on<=today()).sort((a,b)=>Number(b.selected_for_retest)-Number(a.selected_for_retest)||a.priority-b.priority||a.due_on.localeCompare(b.due_on)).slice(0,5);
 root.classList.add('mb-open');
 root.innerHTML='<div class="page-heading"><div><div class="eyebrow">PART H · MISTAKE REPAIR</div><h2>错题修复站</h2><p>错题自动归档，优先练到期题。原题记录不会因订正而丢失。</p></div><button class="ghost" id="mbHome">回到首页</button></div>'
 +'<div class="mb-summary"><div><small>累计错题</small><strong>'+s.total+'</strong></div><div><small>待巩固</small><strong>'+s.pending+'</strong></div><div><small>今日到期</small><strong>'+s.due+'</strong></div><div><small>已掌握</small><strong>'+s.mastered+'</strong></div></div>'
 +'<div class="mb-actions"><button class="primary" id="mbStart" '+(due.length?'':'disabled')+'>开始今日重测 · '+due.length+'/5</button><button class="ghost" id="mbRefresh">刷新云端</button><button class="ghost" id="mbManualToggle">＋ 录入纸质错题</button></div>'
 +'<form class="mb-manual" id="mbManual" hidden><h3>手动补录</h3><div class="mb-fields"><label>知识点<input name="topic" maxlength="100" placeholder="如：3.3 去括号" required></label><label>来源<input name="source" maxlength="60" placeholder="如：周测第8题"></label><label>原题<textarea name="question" maxlength="4000" rows="3" required placeholder="可输入文字或 LaTeX 公式"></textarea></label><label>正确答案<textarea name="correct_answer" maxlength="1200" rows="2" required></textarea></label><label>我的错误答案<input name="submitted_answer" maxlength="1200" placeholder="可留空"></label><label>变式题（选填）<textarea name="variant_question" maxlength="4000" rows="2"></textarea></label><label>变式答案（选填）<input name="variant_answer" maxlength="1200"></label></div><button class="primary" type="submit">保存到我的错题本</button><p>手动录入题按答案文字或数值核对；请保留正确的原题与答案。</p></form>'
 +'<div class="mb-filters"><select id="mbFilter" aria-label="错题筛选"><option value="due">今日到期</option><option value="pending">全部待巩固</option><option value="mastered">已掌握</option><option value="all">全部错题</option></select><input id="mbSearch" type="search" placeholder="搜索知识点或题目" value="'+esc(search)+'"></div>'
 +'<div id="mbStatus" role="status" class="mb-notice">'+esc(lastError||'重测不额外获得 R 积分，避免为了刷分重复做原题。')+'</div>'
 +'<div class="mb-items">'+(visible.length?visible.map(studentCard).join(''):'<p class="mb-empty">这个分类下暂时没有错题。可通过在线训练或手动补录添加。</p>')+'</div>';
 root.querySelector('#mbHome').onclick=()=>B.go('home');
 root.querySelector('#mbStart').onclick=()=>startQueue(due.map(x=>x.id));
 root.querySelector('#mbRefresh').onclick=()=>refresh();
 root.querySelector('#mbFilter').value=filter;
 root.querySelector('#mbFilter').onchange=e=>{filter=e.target.value;renderStudent();};
 root.querySelector('#mbSearch').oninput=e=>{search=e.target.value;const v=root.querySelector('.mb-items');if(v){const matches=list.filter(x=>(filter==='all'||filter==='mastered'&&x.status==='mastered'||filter==='due'&&x.status!=='mastered'&&x.due_on<=today()||filter==='pending'&&x.status!=='mastered')&&[x.question,x.topic,x.source].join(' ').toLowerCase().includes(search.toLowerCase()));v.innerHTML=matches.length?matches.map(studentCard).join(''):'<p class="mb-empty">没有匹配的错题。</p>';bindSingle(v);}};
 root.querySelector('#mbManualToggle').onclick=()=>{const f=root.querySelector('#mbManual');f.hidden=!f.hidden;};
 root.querySelector('#mbManual').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget,fd=new FormData(f),button=f.querySelector('button[type="submit"]');button.disabled=true;
 const q=String(fd.get('question')||'').trim(),ans=String(fd.get('correct_answer')||'').trim();
 const result=await capture({sourceKey:'manual:'+Date.now().toString(36)+Math.random().toString(36).slice(2),source:fd.get('source')||'纸质错题',kind:'manual',topic:fd.get('topic'),question:q,correctAnswer:ans,studentAnswer:fd.get('submitted_answer'),variantQuestion:fd.get('variant_question'),variantAnswer:fd.get('variant_answer')});
 if(result)await refresh(true);else{button.disabled=false;status(lastError);}
 };
 bindSingle(root);
}
function bindSingle(container){container.querySelectorAll('[data-mb-one]').forEach(button=>button.onclick=()=>startQueue([button.dataset.mbOne]));}
function normalize(x){return String(x??'').normalize('NFKC').replace(/[−–]/g,'-').replace(/\s+/g,'').replace(/[，、；;]/g,',').toLowerCase();}
function same(a,b){const A=window.SpecialPracticeEngine;if(A?.equal?.(a,b))return true;return normalize(a)===normalize(b);}
function grade(x,typed){
 const answer=x.variant_question&&x.variant_answer?x.variant_answer:x.correct_answer;
 try{
  if(x.kind==='algebra'&&window.AlgebraEngine?.check)return !!window.AlgebraEngine.check(typed,answer).correct;
  if(x.kind.startsWith('special-')&&window.SpecialPracticeEngine){
   const code=x.kind.slice(8),expected=answer.split('||'),input=typed.split(/(?:\|\||[,，、;；])/).map(v=>v.trim());
   return !!window.SpecialPracticeEngine.grade({code,answers:[expected]},[input])[0];
  }
 }catch(e){return false;}
 return same(typed,answer);
}
function renderRetry(){
 const x=queue[pos];if(!x){active=false;renderStudent();status('本轮重测完成。');return;}
 const variant=!!(x.variant_question&&x.variant_answer),display=variant?x.variant_question:x.question;
 root.innerHTML='<div class="page-heading"><div><div class="eyebrow">PART H · RETEST</div><h2>今日错题重测</h2><p>第 '+(pos+1)+' / '+queue.length+' 题 · '+esc(x.topic)+'</p></div><button class="ghost" id="mbExit">退出重测</button></div>'
 +'<div class="mb-retest"><div class="mb-question-label">'+(variant?'变式巩固 · 与原题同知识点':'原题订正 · 暂无变式题')+'</div><div class="mb-retest-question">'+showMath(display)+'</div>'
 +'<form id="mbRetryForm"><label>我的答案<textarea id="mbRetryInput" rows="2" maxlength="1200" required placeholder="'+(x.kind.startsWith('special-')?'多个答案请用逗号分隔':'输入本题答案')+'"></textarea></label><button class="primary" type="submit">核对本题</button></form>'
 +'<div id="mbRetryFeedback" aria-live="polite">'+esc(answerStatus)+'</div><button class="ghost" id="mbNext" hidden>下一题 →</button></div>';
 root.querySelector('#mbExit').onclick=()=>{active=false;renderStudent();};
 root.querySelector('#mbRetryForm').onsubmit=async e=>{
 e.preventDefault();const btn=e.currentTarget.querySelector('button'),raw=root.querySelector('#mbRetryInput').value.trim();if(!raw)return;
 btn.disabled=true;const ok=grade(x,raw),old=(x.attempts||[]),already=old.some(a=>a.day===today()&&a.correct),streak=ok?(already?Number(x.success_streak||0):Number(x.success_streak||0)+1):0;
 const target=!!(x.variant_question&&x.variant_answer)?2:3,mastered=ok&&streak>=target,delay=ok?(streak===1?3:streak===2?7:14):1;
 const changes={retry_count:(x.retry_count||0)+1,success_streak:Math.min(20,streak),status:mastered?'mastered':ok?'reviewing':'pending',due_on:dateAfter(delay),updated_at:new Date().toISOString(),attempts:[...old,{day:today(),correct:ok,answer:raw.slice(0,180),variant:!!x.variant_question}].slice(-20)};
 try{const r=await B.client().from('mistake_items').update(changes).eq('id',x.id).eq('user_id',uid()).select('id');if(r.error||!r.data?.length)throw r.error||Error('没有保存到记录');
 Object.assign(x,changes);const local=list.find(z=>z.id===x.id);if(local)Object.assign(local,changes);
 const correct=x.variant_question&&x.variant_answer?x.variant_answer:x.correct_answer;
 root.querySelector('#mbRetryFeedback').innerHTML='<p class="'+(ok?'mb-good':'mb-bad')+'">'+(ok?(mastered?'✓ 已掌握，进入档案':'✓ 答对了，下次复习 '+esc(changes.due_on)):'需要再巩固 · 下次复习 '+esc(changes.due_on))+'</p><details open><summary>答案对照</summary><p>参考答案：<b>'+esc(correct.replace(/\|\|/g,'、'))+'</b></p><p>你的答案：'+esc(raw)+'</p></details>'+(already&&ok?'<p>今天已通过一次，同日重复答对不增加掌握次数。</p>':'');
 root.querySelector('#mbRetryInput').disabled=true;root.querySelector('#mbNext').hidden=false;
 }catch(err){root.querySelector('#mbRetryFeedback').textContent='本次未保存，请检查网络后重试：'+(err.message||'');btn.disabled=false;}
 };
 root.querySelector('#mbNext').onclick=()=>{pos++;answerStatus='';renderRetry();};
 root.querySelector('#mbRetryInput').focus();
}
function open(){active=false;void refresh();}
async function loadTeacher(cls){
 const seq=++teacherSeq;teacherClass=cls||'';teacherList=[];roster=[];teacherFilter='';
 if(!cls){teacher.innerHTML='<div class="teacher-empty">请选择班级，再查看错题数据。</div>';return;}
 teacher.innerHTML='<p class="mb-pending">正在读取班级错题…</p>';
 try{const [r,n]=await Promise.all([
 B.client().from('mistake_items').select('*').eq('class_id',cls).order('updated_at',{ascending:false}).limit(5000),
 B.client().from('class_roster').select('student_code,student_name,user_id').eq('class_id',cls).order('student_code')]);
 if(r.error||n.error)throw r.error||n.error;
 if(seq!==teacherSeq||teacherClass!==cls||session().classId!==cls||session().role!=='teacher')return;
 teacherList=r.data||[];roster=n.data||[];renderTeacher();
 }catch(e){if(seq===teacherSeq)teacher.innerHTML='<div class="mb-notice">错题读取失败：'+esc(e.message||'请刷新')+'</div>';}
}
function getStudent(row){return roster.find(x=>x.user_id===row.user_id);}
function renderTeacher(){
 const stats=summary(teacherList),byStudent={};for(const x of teacherList){const k=x.user_id;byStudent[k]||={pending:0,selected:0};if(x.status!=='mastered')byStudent[k].pending++;if(x.selected_for_retest)byStudent[k].selected++;}
 const studentOpts=roster.filter(x=>x.user_id).map(x=>'<option value="'+esc(x.user_id)+'">'+esc(x.student_code)+'号 '+esc(x.student_name||'')+'</option>').join('');
 const visible=teacherList.filter(x=>!teacherFilter||x.user_id===teacherFilter).slice(0,400);
 teacher.innerHTML='<div class="mb-teacher-summary"><span>班级累计 <b>'+stats.total+'</b> 题</span><span>待巩固 <b>'+stats.pending+'</b></span><span>已掌握 <b>'+stats.mastered+'</b></span><span>覆盖学生 <b>'+Object.keys(byStudent).length+'</b> 人</span></div>'
 +'<div class="mb-teacher-tools"><label>按学生筛选<select id="mbTeacherStudent"><option value="">全班</option>'+studentOpts+'</select></label><button class="ghost small" id="mbExport">导出已选题 CSV</button><button class="ghost small" id="mbTeacherRefresh">刷新</button></div>'
 +'<p class="mb-help">每名学生最多选 5 道重点重测题；未注册的学号可以先保留在名册中，注册后再分配题目。错题原始记录不会因掌握而删除。</p>'
 +'<details class="mb-teacher-assign"><summary>＋ 给某个学生布置错题</summary><form id="mbTeacherAssign"><label>学生<select name="student" required><option value="">请选择已注册账号</option>'+studentOpts+'</select></label><label>知识点<input name="topic" maxlength="100" required placeholder="如 3.3 整式的加减"></label><label>题目<textarea name="question" maxlength="4000" rows="2" required></textarea></label><label>参考答案<input name="correct_answer" maxlength="1200" required></label><label>变式题（选填）<textarea name="variant_question" maxlength="4000"></textarea></label><label>变式答案（选填）<input name="variant_answer" maxlength="1200"></label><button class="primary small" type="submit">分配到学生错题本</button></form></details>'
 +'<div id="mbTeacherStatus" role="status"></div>'
 +'<div class="mb-teacher-table"><table><thead><tr><th>学生</th><th>知识点 / 错题</th><th>次数</th><th>进度</th><th>优先级</th><th>重测</th></tr></thead><tbody>'
 +(visible.length?visible.map(x=>{const st=getStudent(x);return '<tr><td>'+esc(st?st.student_code+'号 '+(st.student_name||''):'学生账号')+'</td><td><strong>'+esc(x.topic)+'</strong><div>'+showMath(x.question)+'</div><small>'+esc(x.source)+'</small></td><td>'+x.times_wrong+'</td><td>'+esc(badge(x))+'</td><td><select data-mb-priority="'+esc(x.id)+'"><option value="1" '+(x.priority===1?'selected':'')+'>高</option><option value="2" '+(x.priority===2?'selected':'')+'>中</option><option value="3" '+(x.priority===3?'selected':'')+'>低</option></select></td><td><input aria-label="加入重点重测" type="checkbox" data-mb-mark="'+esc(x.id)+'" '+(x.selected_for_retest?'checked':'')+'></td></tr>';}).join(''):'<tr><td colspan="6">暂无对应错题。</td></tr>')+'</tbody></table></div>';
 teacher.querySelector('#mbTeacherStudent').value=teacherFilter;
 teacher.querySelector('#mbTeacherStudent').onchange=e=>{teacherFilter=e.target.value;renderTeacher();};
 teacher.querySelector('#mbTeacherRefresh').onclick=()=>loadTeacher(teacherClass);
 teacher.querySelector('#mbExport').onclick=exportCsv;
 teacher.querySelectorAll('[data-mb-mark]').forEach(inp=>inp.onchange=async()=>{
 const x=teacherList.find(r=>r.id===inp.dataset.mbMark),count=teacherList.filter(r=>r.user_id===x.user_id&&r.selected_for_retest).length;
 if(inp.checked&&count>=5){inp.checked=false;teacherStatus('每名学生最多选择5题。请先取消一题。');return;}
 inp.disabled=true;const r=await B.client().from('mistake_items').update({selected_for_retest:inp.checked,updated_at:new Date().toISOString()}).eq('id',x.id).eq('class_id',teacherClass).select('id');
 if(r.error||!r.data?.length){inp.checked=!inp.checked;teacherStatus('未保存，请重试。');}else{x.selected_for_retest=inp.checked;teacherStatus('✓ 已更新重点题。');}inp.disabled=false;
 });
 teacher.querySelectorAll('[data-mb-priority]').forEach(sel=>sel.onchange=async()=>{
 const x=teacherList.find(r=>r.id===sel.dataset.mbPriority),old=x.priority;
 const r=await B.client().from('mistake_items').update({priority:Number(sel.value),updated_at:new Date().toISOString()}).eq('id',x.id).eq('class_id',teacherClass).select('id');
 if(r.error||!r.data?.length){sel.value=old;teacherStatus('优先级保存失败。');}else{x.priority=Number(sel.value);teacherStatus('✓ 优先级已更新。');}
 });
 teacher.querySelector('#mbTeacherAssign').onsubmit=async e=>{
 e.preventDefault();const f=e.currentTarget,fd=new FormData(f),target=String(fd.get('student')||''),chosen=roster.find(r=>r.user_id===target);if(!chosen)return teacherStatus('请选择已注册学生。');const count=teacherList.filter(r=>r.user_id===target&&r.selected_for_retest).length;if(count>=5)return teacherStatus('这名学生已选满5题，请先取消一道重点题。');const button=f.querySelector('button');button.disabled=true;
 const r=await B.client().from('mistake_items').insert({class_id:teacherClass,user_id:target,source_key:'teacher:'+Date.now().toString(36)+Math.random().toString(36).slice(2),source:'教师布置',kind:'manual',topic:String(fd.get('topic')||''),question:String(fd.get('question')||''),correct_answer:String(fd.get('correct_answer')||''),variant_question:String(fd.get('variant_question')||''),variant_answer:String(fd.get('variant_answer')||''),selected_for_retest:true,due_on:today(),times_wrong:0}).select('id');
 if(r.error||!r.data?.length){button.disabled=false;teacherStatus('分配失败：'+(r.error?.message||'未保存'));}else await loadTeacher(teacherClass);
 };
}
function exportCsv(){
 const arr=teacherList.filter(x=>x.selected_for_retest&&(!teacherFilter||x.user_id===teacherFilter));
 if(!arr.length)return teacherStatus('请先在“重测”列勾选需要导出的题目。');
 const items=[['学号','姓名','知识点','原题','参考答案','变式题','变式答案','错题来源','错误次数']].concat(arr.map(x=>{const n=getStudent(x)||{};return [n.student_code||'',n.student_name||'',x.topic,x.question,x.correct_answer,x.variant_question,x.variant_answer,x.source,x.times_wrong];}));
 const csv='\uFEFF'+items.map(row=>row.map(val=>'"'+String(val??'').replace(/"/g,'""').replace(/^\s*[=+\-@]/,m=>"'"+m)+'"').join(',')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');
 anchor.href=url;anchor.download='RATIOBOT_重点错题_'+today()+'.csv';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
 teacherStatus('已导出 '+arr.length+' 道重点错题。');
}
window.MistakeBook={capture,open,refresh,loadTeacher,reset(){studentSeq++;teacherSeq++;list=[];loaded='';teacherList=[];roster=[];teacherClass='';active=false;queue=[];root.classList.remove('mb-open');root.innerHTML='';teacher.innerHTML='';}};
})();
