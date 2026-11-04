/* RATIOBOT H区 · 以教师发布试卷为准的错题统计与一人一卷。 */
(function(){
'use strict';
const B=window.RatioMistakeBridge,E=window.MistakePapersCore;
const SR=document.querySelector('#paperStudent'),TR=document.querySelector('#teacherPaperMistakes');
if(!B||!E||!SR||!TR)return;
const esc=E.escape,day=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date());
const uid=()=>B.identity()?.user?.id||'',ident=()=>B.identity()||{},db=()=>B.client(),classId=()=>ident().classId||'';
const studentReady=()=>!!uid()&&!!classId()&&ident().role==='student'&&!ident().mustChangePassword;
const teacherReady=()=>!!uid()&&!!classId()&&ident().role==='teacher';
const classKey=()=>[uid(),classId(),ident().role].join('|');
const bucket='ratiobot-paper-tests';
let t={classId:'',papers:[],roster:[],paperId:'',paper:null,questions:[],reports:[],plans:[],tab:'paper',editing:'1',editingStudent:'',message:''};
let s={studentCode:'',papers:[],paperId:'',paper:null,questions:[],reports:[],plan:null,message:''};
let teacherEpoch=0,studentEpoch=0;
function msg(target,text){const el=target.querySelector('[data-paper-message]');if(el)el.textContent=text;}
function math(s){
 let val=String(s??'').trim();if(!val)return '';
 const re=/(\\\([\s\S]*?\\\)|\$[^$]+\$)/g;const parts=val.split(re);
 if(parts.length===1&&window.katex&&(/\\(?:frac|sqrt|times|div|pi|left|right|cdot|sum)\b/.test(val)||/^[0-9a-zA-Z()^_+\-×÷=\\{} ]+$/.test(val)&&/[\^_]/.test(val))){
  try{return window.katex.renderToString(val,{throwOnError:false,trust:false});}catch(e){}
 }
 return parts.map(p=>{if((p.startsWith('$')&&p.endsWith('$'))||(p.startsWith('\\(')&&p.endsWith('\\)'))){try{return window.katex.renderToString(p.startsWith('$')?p.slice(1,-1):p.slice(2,-2),{throwOnError:false,trust:false});}catch(e){}}return esc(p);}).join('');
}
function check(res){if(res?.error)throw res.error;return res.data;}
const codeSort=(a,b)=>E.order(a.student_code,b.student_code);
function paperOptions(papers,id){return papers.map(p=>'<option value="'+esc(p.id)+'" '+(p.id===id?'selected':'')+'>'+esc(p.title)+' · '+esc(p.exam_date)+(p.published?' · 已发布':' · 草稿')+'</option>').join('');}
function fileLinkButton(p){return p?.file_path?'<button type="button" class="ghost small" data-paper-file>查看原试卷 · '+esc(p.file_name||'附件')+'</button>':'<span class="paper-muted">未上传电子试卷（可按纸质试卷题号登记）</span>';}
async function openFile(p,target){
 if(!p?.file_path)return;
 const tab=window.open?.('','_blank');try{
 const r=await db().storage.from(bucket).createSignedUrl(p.file_path,600);if(r.error||!r.data?.signedUrl)throw r.error||Error('生成链接失败');
 if(tab)tab.location.href=r.data.signedUrl;else window.location.href=r.data.signedUrl;
 }catch(e){if(tab)tab.close();msg(target,'原卷打开失败：'+(e.message||'请重新登录'));}
}
function fileBind(target,p){target.querySelectorAll('[data-paper-file]').forEach(b=>b.onclick=()=>openFile(p,target));}
function applyTeacherGuard(k,seq){return k===classKey()&&seq===teacherEpoch&&teacherReady()&&classId()===t.classId;}
function applyStudentGuard(k,seq){return k===classKey()&&seq===studentEpoch&&studentReady();}
async function loadTeacher(cls){
 const seq=++teacherEpoch,k=classKey();
 t={...t,classId:cls||'',papers:[],roster:[],paper:null,paperId:'',questions:[],reports:[],plans:[],editing:'1',editingStudent:'',message:''};
 if(!teacherReady()||!cls){TR.innerHTML='<p class="paper-muted">请先登录教师端并选择班级。</p>';return;}
 TR.innerHTML='<p class="mb-pending">正在读取教师试卷与班级名册…</p>';
 try{
 const [p,r]=await Promise.all([
 db().from('paper_tests').select('*').eq('class_id',cls).order('exam_date',{ascending:false}),
 db().from('class_roster').select('student_code,student_name,user_id').eq('class_id',cls).order('student_code')]);
 check(p);check(r);if(!applyTeacherGuard(k,seq))return;
 t.papers=p.data||[];t.roster=(r.data||[]).sort(codeSort);
 t.paperId=t.papers[0]?.id||'';
 if(t.paperId)await selectTeacherPaper(t.paperId);else renderTeacher();
 }catch(e){if(applyTeacherGuard(k,seq))TR.innerHTML='<div class="mb-notice">读取试卷失败：'+esc(e.message||'网络异常')+'</div>';}
}
async function selectTeacherPaper(id){
 if(!teacherReady())return;const seq=++teacherEpoch,k=classKey();
 t.paperId=id;t.paper=t.papers.find(p=>p.id===id)||null;t.questions=[];t.reports=[];t.plans=[];t.editing='1';t.editingStudent='';
 if(!t.paper){renderTeacher();return;}
 TR.innerHTML='<p class="mb-pending">正在载入 '+esc(t.paper.title)+' 的题目、错题和重测卷…</p>';
 try{
 const [qs,rs,ps]=await Promise.all([
 db().from('paper_questions').select('*').eq('paper_id',id).order('question_no'),
 db().from('paper_error_reports').select('*').eq('paper_id',id),
 db().from('paper_retest_plans').select('*').eq('paper_id',id)]);
 check(qs);check(rs);check(ps);if(!applyTeacherGuard(k,seq)||t.paperId!==id)return;
 t.questions=(qs.data||[]).sort((a,b)=>E.order(a.question_no,b.question_no));t.reports=rs.data||[];t.plans=ps.data||[];renderTeacher();
 }catch(e){if(applyTeacherGuard(k,seq))TR.innerHTML='<div class="mb-notice">试卷数据加载失败：'+esc(e.message||'网络异常')+' <button id="paperReload" class="ghost">重试</button></div>';TR.querySelector('#paperReload')?.addEventListener('click',()=>selectTeacherPaper(id));}
}
function headerTeacher(){
 return '<div class="paper-teacher-head"><div><div class="eyebrow">H · PAPER-FIRST MISTAKES</div><h3>试卷错题与一人一卷</h3><p>教师发布原试卷 → 老师 / 学生登记错题号 → 自动筛选 5 题 → 教师审核发布</p></div>'
 +'<button class="ghost small" data-paper-reload>刷新</button></div>'
 +'<div class="paper-select"><label>当前试卷<select id="paperTeacherSelect"><option value="">创建新试卷…</option>'+paperOptions(t.papers,t.paperId)+'</select></label>'
 +'<button class="ghost small" id="paperNew">＋ 新试卷</button></div>'
 +'<div class="paper-tabs">'+[['paper','试卷与题目'],['reports','错题统计'],['plans','一人一卷']].map(([id,label])=>'<button type="button" data-paper-tab="'+id+'" class="'+(t.tab===id?'active':'')+'">'+label+'</button>').join('')+'</div>'
 +'<p data-paper-message class="paper-message" role="status">'+esc(t.message)+'</p>';
}
function renderTeacher(){
 if(!teacherReady()||classId()!==t.classId){TR.innerHTML='<p>请先登录教师账号。</p>';return;}
 TR.innerHTML=headerTeacher()+(t.tab==='paper'?renderPaperTab():t.tab==='reports'?renderReportsTab():renderPlansTab());
 const select=TR.querySelector('#paperTeacherSelect');if(select)select.value=t.paperId||'';
 select.onchange=e=>{const id=e.target.value;if(!id){t.paperId='';t.paper=null;t.tab='paper';renderTeacher();}else selectTeacherPaper(id);};
 TR.querySelector('#paperNew').onclick=()=>{t.paperId='';t.paper=null;t.tab='paper';renderTeacher();};
 TR.querySelector('[data-paper-reload]').onclick=()=>loadTeacher(t.classId);
 TR.querySelectorAll('[data-paper-tab]').forEach(b=>b.onclick=()=>{t.tab=b.dataset.paperTab;renderTeacher();});
 if(t.tab==='paper')bindPaperTab();
 if(t.tab==='reports')bindReportsTab();
 if(t.tab==='plans')bindPlansTab();
 fileBind(TR,t.paper);
}
function renderPaperTab(){
 if(!t.paper)return '<form class="paper-create" id="paperCreate"><h4>① 发布一份新的标准试卷</h4><div class="paper-fields"><label>试卷名称<input name="title" maxlength="120" required placeholder="如：2026.11 整式加减综合练习"></label>'
 +'<label>考试日期<input type="date" name="date" required value="'+day()+'"></label><label>大题或小题总数<input type="number" min="1" max="100" name="count" required value="20"></label></div>'
 +'<p>先建立题号 1 至 N，之后可上传原试卷、补录题目文字及变式。无需逐题抄录就能先统计错题号。</p><button type="submit" class="primary">创建试卷及题号</button></form>';
 const p=t.paper,regular=t.questions.filter(q=>q.kind==='regular'),depth=t.questions.filter(q=>q.kind==='depth');
 const edit=t.questions.find(x=>x.question_no===t.editing)||regular[0]||null;
 return '<div class="paper-toolbar"><b>'+esc(p.title)+'</b><span class="mb-chip">'+(p.published?'已对学生发布':'教师草稿')+'</span><button id="paperPublish" type="button" class="primary small">'+(p.published?'撤回试卷':'发布试卷给学生')+'</button></div>'
 +'<div class="paper-file-row"><label>原试卷 PDF / Word / 图片（≤12MB）<input type="file" id="paperFileInput" accept=".pdf,.docx,.png,.jpg,.jpeg,.webp"></label>'+fileLinkButton(p)+'</div>'
 +'<p class="paper-muted">题目以教师发布的这份试卷为准。可直接录题号统计；需要在线展示与打印完整重测题时，再补充题干、变式与答案。</p>'
 +'<div class="paper-two-col"><div><h4>② 原卷题目与优先级</h4><div class="paper-question-list">'+t.questions.map(q=>'<button type="button" class="paper-question-row '+(q.question_no===t.editing?'selected':'')+'" data-paper-edit="'+esc(q.question_no)+'"><b>'+(q.kind==='depth'?'深度 '+esc(q.question_no):'第 '+esc(q.question_no)+' 题')+'</b><span>'+esc((q.body||'尚未录入题干').slice(0,54))+'</span><small>'+(['','优先','普通','较低'][q.priority]||'普通')+'</small></button>').join('')+'</div><button class="ghost small" id="paperAddDepth">＋ 增加一道深度思考题</button></div>'
 +'<div><h4>③ 编辑题目 / 对应变式</h4>'+(edit?'<form id="paperEditQuestion" class="paper-question-editor"><b>'+(edit.kind==='depth'?'深度题 ':'原卷第 ')+esc(edit.question_no)+' 题</b>'
 +'<label>知识点 / 原题（支持 $LaTeX$）<textarea name="body" rows="4" maxlength="8000" placeholder="可选：没有电子稿时直接按原试卷题号引用">'+esc(edit.body)+'</textarea></label>'
 +'<label>原题参考答案<textarea name="answer" rows="2" maxlength="2000">'+esc(edit.answer)+'</textarea></label>'
 +'<label>变式题<textarea name="variant_body" rows="4" maxlength="8000" placeholder="建议优先在重测卷上使用变式题">'+esc(edit.variant_body)+'</textarea></label>'
 +'<label>变式答案<textarea name="variant_answer" rows="2" maxlength="2000">'+esc(edit.variant_answer)+'</textarea></label>'
 +'<label>选题优先级<select name="priority"><option value="1" '+(edit.priority===1?'selected':'')+'>高（优先保留）</option><option value="2" '+(edit.priority===2?'selected':'')+'>中</option><option value="3" '+(edit.priority===3?'selected':'')+'>低</option></select></label>'
 +'<button class="primary small" type="submit">保存本题</button></form>':'<p>没有题目。</p>')+'</div></div>'
 +'<details class="paper-bulk"><summary>④ Excel / CSV / TSV 批量导入题目（可选）</summary>'
 +'<p>每行：题号、题目、答案、变式题、变式答案、优先级。Excel 复制可直接粘贴；深度题使用 D1、D2……</p>'
 +'<textarea id="paperBulkText" rows="7" placeholder="1&#9;请计算…&#9;5&#9;变式题…&#9;7&#9;1&#10;2&#9;请化简…&#9;2x&#9;…&#9;…&#9;2"></textarea>'
 +'<div class="paper-actions"><input type="file" id="paperBulkFile" accept=".csv,.tsv,.txt"><button id="paperBulkImport" class="ghost small" type="button">导入并保存已校对题目</button></div></details>'
 +'<p class="paper-muted">现有深度题 '+depth.length+' 道；优先级为教师参考建议，最终五题不强制全部采纳。</p>';
}
function renderReportsTab(){
 if(!t.paper)return '<p class="mb-empty">请先创建或选择一份试卷。</p>';
 const questions=t.questions.filter(q=>q.kind==='regular'),allowed=questions.map(q=>q.question_no);
 const count=new Map(allowed.map(n=>[n,0])),reportCodes=new Set();
 for(const row of t.roster){const rr=t.reports.filter(r=>r.student_code===row.student_code),list=E.mergeReports(rr,allowed);if(rr.length)reportCodes.add(row.student_code);list.forEach(n=>count.set(n,(count.get(n)||0)+1));}
 const sample=t.roster[0]?.student_code||'1';
 return '<div class="paper-stats"><div><small>班级人数</small><strong>'+t.roster.length+'</strong></div><div><small>已登记</small><strong>'+reportCodes.size+'</strong></div><div><small>未登记</small><strong>'+Math.max(0,t.roster.length-reportCodes.size)+'</strong></div><div><small>合并后错题次数</small><strong>'+[...count.values()].reduce((a,b)=>a+b,0)+'</strong></div></div>'
 +'<h4>按题号统计 · 老师与学生登记取并集，不重复计数</h4><div class="paper-heat">'+[...count.entries()].map(([n,v])=>'<div title="第'+esc(n)+'题"><b>'+esc(n)+'</b><strong>'+v+'</strong><small>人出错</small></div>').join('')+'</div>'
 +'<div class="paper-two-col"><div><h4>老师逐人登记</h4><form id="paperSingleReport" class="paper-report-form"><label>学生学号<select name="student">'+t.roster.map(r=>'<option value="'+esc(r.student_code)+'">'+esc(r.student_code)+'号 '+esc(r.student_name||'')+'</option>').join('')+'</select></label>'
 +'<label>错题题号（逗号分隔，留空可清除老师的统计）<input name="wrong" placeholder="例如 2,5,8"></label><button type="submit" class="primary small">保存老师统计</button></form></div>'
 +'<div><h4>批量登记 1–45 号错题</h4><p class="paper-muted">支持「学号: 错题号」格式；也可上传 CSV，每行两列为学号与错题号。不会覆盖学生自行登记的题目。</p>'
 +'<textarea id="paperReportsBulk" rows="6" placeholder="'+esc(sample)+': 1,3,8&#10;2: 4,9&#10;3:"></textarea><div class="paper-actions"><input type="file" id="paperReportsFile" accept=".csv,.tsv,.txt"><button id="paperReportsImport" class="ghost small">导入教师统计</button></div></div></div>'
 +'<h4>逐人检查</h4><div class="paper-table"><table><thead><tr><th>学号</th><th>教师</th><th>学生</th><th>合并错题号</th><th>登记</th></tr></thead><tbody>'
 +t.roster.map(r=>{const a=t.reports.find(x=>x.student_code===r.student_code&&x.source==='teacher'),b=t.reports.find(x=>x.student_code===r.student_code&&x.source==='student');
 const merged=E.mergeReports([a,b].filter(Boolean),allowed);
 return '<tr><td>'+esc(r.student_code)+'号 '+esc(r.student_name||'')+'</td><td>'+esc((a?.wrong_numbers||[]).join(', ')||'—')+'</td><td>'+esc((b?.wrong_numbers||[]).join(', ')||'—')+'</td><td><b>'+esc(merged.join(', ')||'—')+'</b></td><td><button type="button" class="ghost small" data-paper-fill="'+esc(r.student_code)+'">选此学生</button></td></tr>';}).join('')+'</tbody></table></div>';
}
function renderPlansTab(){
 if(!t.paper)return '<p class="mb-empty">请先创建试卷并登记错题。</p>';
 const allowed=t.questions.filter(q=>q.kind==='regular').map(q=>q.question_no),depth=t.questions.filter(q=>q.kind==='depth').map(q=>q.question_no);
 const already=t.plans.filter(x=>x.published).length,drafts=t.plans.filter(x=>!x.published).length;
 const editRow=t.roster.find(x=>x.student_code===t.editingStudent);
 const plan=t.plans.find(x=>x.student_code===t.editingStudent);
 const merged=E.mergeReports(t.reports.filter(x=>x.student_code===t.editingStudent),allowed);
 return '<div class="paper-plan-head"><h4>自动推荐 → 教师调整 → 发布个人重测卷</h4><p>每人最多 5 题；错题超出 5 题按教师设定优先级选取，少于 5 题用已编写的深度题补足。没有深度题时不强制凑题。</p>'
 +'<div class="paper-actions"><button class="primary small" id="paperGenerate">生成 / 更新未发布的草稿</button><button class="ghost small" id="paperRelease">发布已审核草稿</button><button class="ghost small" id="paperPrint">打印全班一人一页</button><button class="ghost small" id="paperExport">导出统计 CSV</button></div>'
 +'<div class="paper-plan-status">草稿 '+drafts+' 人 · 已发布 '+already+' 人 · 班级名册 '+t.roster.length+' 人</div></div>'
 +'<div class="paper-table"><table><thead><tr><th>学生</th><th>合并错题</th><th>个人重测题</th><th>状态</th><th>审核</th></tr></thead><tbody>'
 +t.roster.map(r=>{const rr=t.reports.filter(x=>x.student_code===r.student_code),merged=E.mergeReports(rr,allowed),p=t.plans.find(x=>x.student_code===r.student_code),num=[...(p?.selected_numbers||[]),...(p?.extra_numbers||[])];
 return '<tr><td>'+esc(r.student_code)+'号 '+esc(r.student_name||'')+'</td><td>'+esc(rr.length?merged.join(', ')||'全对':'未登记')+'</td><td>'+esc(num.join(', ')||'未选题')+' <small>'+num.length+'/5</small></td><td>'+(p?.published?'已发布':p?'待审核':'未生成')+'</td><td><button class="ghost small" data-paper-plan="'+esc(r.student_code)+'">审核调整</button></td></tr>';}).join('')+'</tbody></table></div>'
 +(editRow?'<form class="paper-plan-editor" id="paperPlanEdit"><h4>审核 '+esc(editRow.student_code)+' 号 '+esc(editRow.student_name||'')+'</h4>'
 +'<p>教师/学生合并错题：'+esc(merged.join(', ')||'无')+'；可自选题号，不要求必须选完所有错题。</p>'
 +'<label>原试卷题号（允许：'+esc(allowed.join(', '))+')<input name="regular" value="'+esc((plan?.selected_numbers||[]).join(', '))+'" placeholder="例如 2,7,13"></label>'
 +'<label>深度题号（允许：'+esc(depth.join(', ')||'尚未编写')+'）<input name="depth" value="'+esc((plan?.extra_numbers||[]).join(', '))+'" placeholder="例如 D1,D2"></label>'
 +'<label>教师备注<input name="note" value="'+esc(plan?.teacher_note||'')+'" maxlength="600"></label>'
 +'<p>最多 5 题。保存后本人的原发布版本将暂时撤回，重新点击「发布已审核草稿」生效。</p>'
 +'<button type="submit" class="primary small">保存个人选题</button></form>':'');
}
function studentSummary(papers){return papers.map(p=>'<option value="'+esc(p.id)+'" '+(p.id===s.paperId?'selected':'')+'>'+esc(p.title)+' · '+esc(p.exam_date)+'</option>').join('');}
function renderStudent(){
 if(!studentReady()){SR.innerHTML='<div class="page-heading"><div><div class="eyebrow">H · PAPER-FIRST</div><h2>试卷错题与一人一卷</h2><p>请先登录自己的学生账号。</p></div></div>';return;}
 SR.innerHTML='<div class="page-heading"><div><div class="eyebrow">PART H · EXAM MISTAKES</div><h2>试卷错题修复站</h2><p>只从老师发布的试卷登记错题；训练出错记录另存，不混入试卷统计。</p></div><button id="paperStudentRefresh" class="ghost small">刷新</button></div>'
 +(s.papers.length?'<div class="paper-student-picker"><label>老师发布的试卷<select id="paperStudentSelect">'+studentSummary(s.papers)+'</select></label><span>学号 '+esc(s.studentCode)+'</span></div>':'<div class="mb-empty">老师尚未发布可登记的试卷。发布后这里会自动显示。</div>')
 +(s.paper?renderStudentPaper():'')+'<p class="paper-message" data-paper-message role="status">'+esc(s.message)+'</p>';
 SR.querySelector('#paperStudentRefresh').onclick=()=>open();
 const sel=SR.querySelector('#paperStudentSelect');if(sel)sel.onchange=e=>selectStudentPaper(e.target.value);
 if(s.paper){const f=SR.querySelector('#paperStudentReport');if(f)f.onsubmit=saveStudentReport;const b=SR.querySelector('#paperStudentPrint');if(b)b.onclick=()=>printSheets(false,s.studentCode);const ans=SR.querySelector('#paperStudentAnswers');if(ans)ans.onclick=()=>{const box=SR.querySelector('#paperStudentAnswerPanel');box.hidden=!box.hidden;};}
 fileBind(SR,s.paper);
}
function renderStudentPaper(){
 const p=s.paper,questions=s.questions.filter(q=>q.kind==='regular'),teacher=s.reports.find(r=>r.source==='teacher')?.wrong_numbers||[],mine=s.reports.find(r=>r.source==='student')?.wrong_numbers||[],merged=E.mergeReports(s.reports,questions.map(q=>q.question_no));
 const plan=s.plan?.published?E.describePlan(p,s.plan,s.questions):[];
 return '<div class="paper-student-file"><b>'+esc(p.title)+'</b> <span>'+esc(p.exam_date)+' · '+questions.length+' 题</span>'+fileLinkButton(p)+'</div>'
 +'<div class="paper-two-col"><div class="paper-student-mark"><h3>① 统计我做错的题</h3><p>老师统计：'+esc(teacher.join(', ')||'暂无')+'。勾选你实际错的题号，保存后会与老师统计自动合并，不会重复。</p>'
 +'<form id="paperStudentReport"><div class="paper-number-grid">'+questions.map(q=>'<label><input type="checkbox" name="wrong" value="'+esc(q.question_no)+'" '+(mine.includes(q.question_no)?'checked':'')+'><span>'+esc(q.question_no)+'</span></label>').join('')+'</div><button class="primary" type="submit">保存我的错题号</button></form>'
 +'<p class="paper-muted">当前合并错题：'+esc(merged.join(', ')||'无')+'。如双方记录不同，老师会在发布个人重测卷前审核。</p></div>'
 +'<div class="paper-personal-plan"><h3>② 我的个性化重测卷</h3>'
 +(s.plan?.published?'<p>教师已选 '+plan.length+' 道题，优先呈现变式，打印时不显示参考答案。</p><ol class="paper-task-list">'+plan.map(x=>'<li><div><b>'+(x.depth?'深度 ': '第 ')+esc(x.number)+' 题</b> · '+esc(x.source||'')+'</div><div class="paper-math">'+math(x.text)+'</div></li>').join('')+'</ol>'
 +'<div class="paper-actions"><button id="paperStudentPrint" class="ghost small">打印我的一人一卷</button><button id="paperStudentAnswers" class="ghost small">核对参考答案</button></div>'
 +'<div id="paperStudentAnswerPanel" hidden><h4>教师参考答案</h4>'+plan.map(x=>'<p>第 '+esc(x.number)+' 题：'+(x.answer?math(x.answer):'请向老师核对')+'</p>').join('')+'</div>':'<div class="mb-empty">个人重测卷尚未由老师审核发布。可以先登记错题号。</div>')+'</div></div>';
}
async function open(){
 const seq=++studentEpoch,k=classKey();
 s={studentCode:'',papers:[],paperId:'',paper:null,questions:[],reports:[],plan:null,message:''};
 if(!studentReady()){renderStudent();return;}
 SR.innerHTML='<p class="mb-pending">正在读取教师发布的试卷…</p>';
 try{
 const [m,p]=await Promise.all([
 db().from('class_members').select('student_code').eq('class_id',classId()).eq('user_id',uid()).eq('role','student').maybeSingle(),
 db().from('paper_tests').select('*').eq('class_id',classId()).eq('published',true).order('exam_date',{ascending:false})]);
 check(m);check(p);if(!applyStudentGuard(k,seq))return;
 if(!m.data?.student_code)throw Error('未找到当前账号的学号');
 s.studentCode=m.data.student_code;s.papers=p.data||[];s.paperId=s.papers[0]?.id||'';
 if(s.paperId)await selectStudentPaper(s.paperId);else renderStudent();
 }catch(e){if(applyStudentGuard(k,seq))SR.innerHTML='<div class="mb-notice">加载试卷失败：'+esc(e.message||'网络异常')+'</div>';}
}
async function selectStudentPaper(id){
 const seq=++studentEpoch,k=classKey();
 s.paperId=id;s.paper=s.papers.find(p=>p.id===id)||null;s.questions=[];s.reports=[];s.plan=null;
 if(!s.paper){renderStudent();return;}
 SR.innerHTML='<p class="mb-pending">正在读取本次试卷的题号与个人记录…</p>';
 try{
 const [qs,rs,ps]=await Promise.all([
 db().from('paper_questions').select('*').eq('paper_id',id),
 db().from('paper_error_reports').select('*').eq('paper_id',id).eq('student_code',s.studentCode),
 db().from('paper_retest_plans').select('*').eq('paper_id',id).eq('student_code',s.studentCode).eq('published',true).maybeSingle()]);
 check(qs);check(rs);check(ps);if(!applyStudentGuard(k,seq)||s.paperId!==id)return;
 s.questions=(qs.data||[]).sort((a,b)=>E.order(a.question_no,b.question_no));s.reports=rs.data||[];s.plan=ps.data||null;renderStudent();
 }catch(e){if(applyStudentGuard(k,seq))SR.innerHTML='<div class="mb-notice">读取失败：'+esc(e.message||'网络异常')+'</div>';}
}
async function saveStudentReport(ev){
 ev.preventDefault();if(!studentReady()||!s.paper)return;
 const form=ev.currentTarget,button=form.querySelector('button');button.disabled=true;
 const allowed=s.questions.filter(q=>q.kind==='regular').map(q=>q.question_no),numbers=[...form.querySelectorAll('input[name="wrong"]:checked')].map(x=>x.value),parsed=E.normalized(numbers,allowed);
 if(parsed.unknown.length){msg(SR,'存在无效题号：'+parsed.unknown.join(','));button.disabled=false;return;}
 const payload={paper_id:s.paper.id,class_id:classId(),student_code:s.studentCode,source:'student',wrong_numbers:parsed.numbers,updated_by:uid(),updated_at:new Date().toISOString()};
 try{
 const r=await db().from('paper_error_reports').upsert(payload,{onConflict:'paper_id,student_code,source'}).select('student_code');check(r);
 const n=s.reports.findIndex(x=>x.source==='student');if(n>=0)s.reports[n]=payload;else s.reports.push(payload);
 s.message='✓ 已保存 '+parsed.numbers.length+' 道自报错题；老师统计不会被覆盖。';renderStudent();
 }catch(e){msg(SR,'保存失败：'+(e.message||'请重试'));button.disabled=false;}
}
async function createPaper(ev){
 ev.preventDefault();if(!teacherReady())return;
 const f=ev.currentTarget,fd=new FormData(f),title=String(fd.get('title')||'').trim(),exam_date=String(fd.get('date')||''),question_count=Number(fd.get('count'));
 if(!title||!Number.isInteger(question_count)||question_count<1||question_count>100)return;
 const btn=f.querySelector('button[type="submit"]');btn.disabled=true;
 try{
 const p=check(await db().from('paper_tests').insert({class_id:t.classId,created_by:uid(),title,exam_date,question_count}).select('*').single());
 const rows=Array.from({length:question_count},(_,i)=>({paper_id:p.id,question_no:String(i+1),kind:'regular'}));
 check(await db().from('paper_questions').insert(rows));
 t.message='✓ 创建成功，已生成 '+question_count+' 个标准题号。请补充原试卷后发布。';await loadTeacher(t.classId);await selectTeacherPaper(p.id);
 }catch(e){t.message='创建失败：'+(e.message||'网络异常')+'。如试卷已生成，刷新后可补齐题号。';btn.disabled=false;msg(TR,t.message);await loadTeacher(t.classId);}
}
async function togglePublish(){
 if(!teacherReady()||!t.paper)return;
 const next=!t.paper.published;
 if(!next&&!window.confirm('撤回后学生将暂时无法看到该试卷及相关个人卷，确认撤回？'))return;
 const r=await db().from('paper_tests').update({published:next,updated_at:new Date().toISOString()}).eq('id',t.paper.id).eq('class_id',t.classId).select('id');
 try{check(r);t.paper.published=next;t.message=next?'✓ 已发布，学生现在可以按这份试卷登记错题。':'已撤回发布。';renderTeacher();}
 catch(e){msg(TR,'状态修改失败：'+(e.message||''));}
}
async function uploadPaper(file){
 if(!file||!t.paper||!teacherReady())return;
 const ext=(file.name.match(/\.(pdf|docx|png|jpe?g|webp)$/i)||[])[1]?.toLowerCase();
 if(!ext||file.size>12582912){msg(TR,'请上传不超过 12 MB 的 PDF、DOCX 或图片。');return;}
 const mime={pdf:'application/pdf',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp'}[ext];
 const p=t.paper,path=[p.class_id,p.id,'original.'+ext].join('/');
 msg(TR,'正在上传原卷…');
 try{
 const result=await db().storage.from(bucket).upload(path,file,{upsert:true,contentType:mime});if(result.error)throw result.error;
 check(await db().from('paper_tests').update({file_path:path,file_name:file.name.slice(0,200),updated_at:new Date().toISOString()}).eq('id',p.id).select('id'));
 p.file_path=path;p.file_name=file.name;t.message='✓ 原试卷已安全保存，仅本班可访问。';renderTeacher();
 }catch(e){msg(TR,'原卷上传失败：'+(e.message||''));}
}
async function saveQuestion(ev){
 ev.preventDefault();const q=t.questions.find(x=>x.question_no===t.editing);if(!q||!teacherReady())return;
 const f=ev.currentTarget,fd=new FormData(f),payload={body:String(fd.get('body')||''),answer:String(fd.get('answer')||''),variant_body:String(fd.get('variant_body')||''),variant_answer:String(fd.get('variant_answer')||''),priority:Number(fd.get('priority')||2),updated_at:new Date().toISOString()};
 f.querySelector('button').disabled=true;
 try{check(await db().from('paper_questions').update(payload).eq('id',q.id).select('id'));Object.assign(q,payload);t.message='✓ 第 '+q.question_no+' 题已保存。';renderTeacher();}
 catch(e){msg(TR,'保存失败：'+(e.message||''));f.querySelector('button').disabled=false;}
}
async function addDepth(){
 if(!teacherReady()||!t.paper)return;
 const number='D'+(Math.max(0,...t.questions.filter(x=>/^D\d+$/.test(x.question_no)).map(x=>Number(x.question_no.slice(1))))+1);
 try{check(await db().from('paper_questions').insert({paper_id:t.paper.id,question_no:number,kind:'depth',body:'请在此编写深度思考题'}).select('id'));await selectTeacherPaper(t.paper.id);t.editing=number;t.message='请完善 '+number+' 的题目和参考答案。';renderTeacher();}
 catch(e){msg(TR,'增加深度题失败：'+(e.message||''));}
}
async function bulkQuestionImport(){
 if(!teacherReady()||!t.paper)return;
 const raw=TR.querySelector('#paperBulkText')?.value||'',table=E.csv(raw);
 if(!table.length){msg(TR,'请粘贴带有题号的数据。');return;}
 const valid=[],errors=[],lookup=new Map(t.questions.map(q=>[q.question_no,q]));
 const rows=table[0]?.[0]?.includes('题号')?table.slice(1):table;
 for(const row of rows){
  const no=String(row[0]||'').trim(),old=lookup.get(no),depth=/^D[1-9]\d*$/.test(no);
  if(!old&&!depth){errors.push('未知题号 '+no);continue;}
  const priority=Number(row[5]||old?.priority||2);if(![1,2,3].includes(priority)){errors.push(no+' 的优先级只能为1、2、3');continue;}
  valid.push({paper_id:t.paper.id,question_no:no,kind:old?.kind||(depth?'depth':'regular'),body:String(row[1]??old?.body??''),answer:String(row[2]??old?.answer??''),variant_body:String(row[3]??old?.variant_body??''),variant_answer:String(row[4]??old?.variant_answer??''),priority});
 }
 if(errors.length)return msg(TR,'未保存：'+errors.slice(0,8).join('；'));
 if(!valid.length)return msg(TR,'未找到可导入的题号。');
 if(valid.length>100)return msg(TR,'单次最多100题，请分批导入。');
 try{check(await db().from('paper_questions').upsert(valid,{onConflict:'paper_id,question_no'}).select('id'));t.message='✓ 已保存 '+valid.length+' 道题目，请逐题核对公式、题号及答案。';await selectTeacherPaper(t.paper.id);msg(TR,t.message);}
 catch(e){msg(TR,'批量保存失败：'+(e.message||''));}
}
function bindPaperTab(){
 const f=TR.querySelector('#paperCreate');if(f){f.onsubmit=createPaper;return;}
 TR.querySelector('#paperPublish').onclick=togglePublish;
 TR.querySelector('#paperFileInput').onchange=e=>{const file=e.target.files?.[0];if(file)void uploadPaper(file);};
 TR.querySelectorAll('[data-paper-edit]').forEach(b=>b.onclick=()=>{t.editing=b.dataset.paperEdit;renderTeacher();});
 TR.querySelector('#paperEditQuestion')?.addEventListener('submit',saveQuestion);
 TR.querySelector('#paperAddDepth').onclick=addDepth;
 TR.querySelector('#paperBulkImport').onclick=bulkQuestionImport;
 TR.querySelector('#paperBulkFile').onchange=async e=>{const file=e.target.files?.[0];if(file){if(file.size>2000000)return msg(TR,'文本导入文件不得超过2MB');TR.querySelector('#paperBulkText').value=await file.text();}};
}
async function teacherReportFor(code,raw){
 const allowed=t.questions.filter(q=>q.kind==='regular').map(q=>q.question_no),r=E.normalized(raw,allowed);
 if(r.unknown.length)throw Error(code+'号存在无效题号：'+r.unknown.join(','));
 return {paper_id:t.paper.id,class_id:t.classId,student_code:code,source:'teacher',wrong_numbers:r.numbers,updated_by:uid(),updated_at:new Date().toISOString()};
}
async function teacherSingleReport(ev){
 ev.preventDefault();const fd=new FormData(ev.currentTarget),code=String(fd.get('student')||'');
 if(!t.roster.some(r=>r.student_code===code))return msg(TR,'学号不在班级名册。');
 try{const payload=await teacherReportFor(code,fd.get('wrong'));check(await db().from('paper_error_reports').upsert(payload,{onConflict:'paper_id,student_code,source'}).select('student_code'));t.message='✓ 已保存 '+code+' 号教师统计。';await selectTeacherPaper(t.paper.id);t.tab='reports';renderTeacher();}
 catch(e){msg(TR,'保存失败：'+(e.message||''));}
}
async function teacherBulkReports(){
 const raw=TR.querySelector('#paperReportsBulk').value,parsed=E.rowsFromText(raw);
 if(parsed.errors.length)return msg(TR,parsed.errors.slice(0,5).join('；'));
 if(!parsed.rows.length)return msg(TR,'没有可导入的学生错题。');
 const seen=new Set(),all=[];
 try{
 for(const r of parsed.rows){
  const roster=t.roster.find(x=>String(Number(x.student_code))===r.studentCode);
  if(!roster)throw Error(r.line+'行学号 '+r.studentCode+' 不在本班名册');
  if(seen.has(roster.student_code))throw Error('同一批次中 '+roster.student_code+' 号出现两次，请合并');
  seen.add(roster.student_code);all.push(await teacherReportFor(roster.student_code,r.raw));
 }
 const result=await db().from('paper_error_reports').upsert(all,{onConflict:'paper_id,student_code,source'}).select('student_code');check(result);
 t.message='✓ 教师统计 '+all.length+' 人已经保存，未覆盖学生自报。';await selectTeacherPaper(t.paper.id);t.tab='reports';renderTeacher();
 }catch(e){msg(TR,'批量导入未保存：'+(e.message||''));}
}
function bindReportsTab(){
 const f=TR.querySelector('#paperSingleReport');if(!f)return;
 f.onsubmit=teacherSingleReport;
 TR.querySelector('#paperReportsImport').onclick=teacherBulkReports;
 TR.querySelector('#paperReportsFile').onchange=async e=>{
  const file=e.target.files?.[0];if(!file)return;if(file.size>2000000)return msg(TR,'统计表不得超过2MB');
  const text=await file.text();
  const rows=E.csv(text);
  const table=rows[0]&&(/学号|student|code/i.test(rows[0][0]||''))?rows.slice(1):rows;
  TR.querySelector('#paperReportsBulk').value=table.map(x=>String(x[0]||'').trim()+': '+x.slice(1).filter(Boolean).join(',')).join('\n');
 };
 TR.querySelectorAll('[data-paper-fill]').forEach(b=>b.onclick=()=>{
  const code=b.dataset.paperFill;f.querySelector('select[name="student"]').value=code;f.querySelector('input[name="wrong"]').value=(t.reports.find(x=>x.student_code===code&&x.source==='teacher')?.wrong_numbers||[]).join(', ');
  f.scrollIntoView({behavior:'smooth',block:'center'});
 });
 f.querySelector('select[name="student"]').onchange=e=>{f.querySelector('input[name="wrong"]').value=(t.reports.find(x=>x.student_code===e.target.value&&x.source==='teacher')?.wrong_numbers||[]).join(', ');};
}
async function generatePlans(){
 if(!t.paper||!teacherReady())return;
 if(!window.confirm('将按原题优先级和深度题生成每人最多5题草稿；已发布的个人卷不受影响，但未发布草稿会重新生成。是否继续？'))return;
 const items=[],all=t.questions,regular=all.filter(q=>q.kind==='regular').map(q=>q.question_no);
 for(const row of t.roster){
  const reports=t.reports.filter(x=>x.student_code===row.student_code),old=t.plans.find(p=>p.student_code===row.student_code);
  if(old?.published||!reports.length)continue;
  const p=E.plan(reports,all,5);
  items.push({paper_id:t.paper.id,class_id:t.classId,student_code:row.student_code,selected_numbers:p.selected_numbers,extra_numbers:p.extra_numbers,published:false,updated_by:uid(),updated_at:new Date().toISOString()});
 }
 if(!items.length)return msg(TR,'没有可生成的草稿：请先登记错题，或已全部发布。');
 try{check(await db().from('paper_retest_plans').upsert(items,{onConflict:'paper_id,student_code'}).select('student_code'));t.message='✓ 已生成 '+items.length+' 人草稿。请逐人审核，未登记错题的学生不会自动编造记录。';await selectTeacherPaper(t.paper.id);t.tab='plans';renderTeacher();}
 catch(e){msg(TR,'生成草稿失败：'+(e.message||''));}
}
async function savePlan(ev){
 ev.preventDefault();const f=ev.currentTarget,fd=new FormData(f),code=t.editingStudent,allowed=t.questions.filter(x=>x.kind==='regular').map(x=>x.question_no),extra=t.questions.filter(x=>x.kind==='depth').map(x=>x.question_no);
 const a=E.normalized(fd.get('regular'),allowed),b=E.normalized(fd.get('depth'),extra);
 if(a.unknown.length||b.unknown.length)return msg(TR,'发现不在题库中的题号：'+[...a.unknown,...b.unknown].join(','));
 if(a.numbers.length+b.numbers.length>5)return msg(TR,'每人最多5题，请减少题目数量。');
 const payload={paper_id:t.paper.id,class_id:t.classId,student_code:code,selected_numbers:a.numbers,extra_numbers:b.numbers,published:false,teacher_note:String(fd.get('note')||''),updated_by:uid(),updated_at:new Date().toISOString()};
 try{check(await db().from('paper_retest_plans').upsert(payload,{onConflict:'paper_id,student_code'}).select('student_code'));t.message='✓ '+code+' 号个人卷已保存为草稿，可继续调整或发布。';await selectTeacherPaper(t.paper.id);t.tab='plans';t.editingStudent=code;renderTeacher();}
 catch(e){msg(TR,'个人卷保存失败：'+(e.message||''));}
}
async function releasePlans(){
 const draft=t.plans.filter(p=>!p.published&&(p.selected_numbers||[]).length+(p.extra_numbers||[]).length>0);
 if(!draft.length)return msg(TR,'没有可发布的非空草稿。');
 if(!t.paper?.published)return msg(TR,'请先在「试卷与题目」发布原试卷。');
 if(!window.confirm('确认将 '+draft.length+' 人的一人一卷发布给学生？未登记者不发布空卷。'))return;
 try{
 const r=await db().from('paper_retest_plans').update({published:true,updated_by:uid(),updated_at:new Date().toISOString()}).eq('paper_id',t.paper.id).eq('class_id',t.classId).eq('published',false).in('student_code',draft.map(x=>x.student_code)).select('student_code');check(r);
 t.message='✓ 已发布 '+(r.data||[]).length+' 人的个性化重测卷。';await selectTeacherPaper(t.paper.id);t.tab='plans';renderTeacher();
 }catch(e){msg(TR,'发布失败：'+(e.message||''));}
}
function printSheets(teacherMode=true,studentCode=''){
 const paper=teacherMode?t.paper:s.paper,questions=teacherMode?t.questions:s.questions,plans=teacherMode?t.plans:[s.plan];
 if(!paper)return;
 const roster=teacherMode?t.roster:[{student_code:studentCode,student_name:s.studentCode===studentCode?'':''}];
 const windowPrint=window.open?.('','_blank');if(!windowPrint){msg(teacherMode?TR:SR,'浏览器拦截了打印窗口，请允许弹出窗口。');return;}
 const pages=roster.map((row,i)=>{
  const plan=plans.find(p=>p?.student_code===row.student_code),items=plan?E.describePlan(paper,plan,questions):[];
  const filled=items.map((q,j)=>'<section class="question"><h3>'+(j+1)+'. '+(q.depth?'深度思考 ': '原试卷第'+esc(q.number)+'题')+' <small>'+esc(q.source||'')+'</small></h3><div class="formula">'+math(q.text)+'</div><div class="answer-lines"></div></section>').join('');
  const empty=Array.from({length:Math.max(0,5-items.length)},(_,j)=>'<section class="question"><h3>'+(items.length+j+1)+'. '+'补充任务（待教师填写）</h3><div class="answer-lines"></div></section>').join('');
  return '<section class="sheet"><header><div class="mark">R</div><div><h1>个性化错题重测 · 一人一卷</h1><p>'+esc(paper.title)+' · '+esc(paper.exam_date)+'</p></div></header><div class="identity">学号 <b>'+esc(row.student_code)+'</b>　姓名 <b>'+esc(row.student_name||'')+'</b>　 总题数 '+items.length+'/5</div>'
  +(plan?'':'<p>尚未安排个人重测题，仅保留版面供教师调整。</p>')+filled+empty+'<footer>请独立完成推理与计算，必要时写出过程。　教师批改：________　订正：________</footer></section>';
 }).join('');
 const css='@page{size:A4;margin:13mm}*{box-sizing:border-box}body{font-family:"Times New Roman","SimSun",serif;color:#323239;margin:0}.sheet{width:100%;min-height:268mm;page-break-after:always;break-after:page;padding:8mm 3mm}.sheet:last-child{page-break-after:auto;break-after:auto}header{display:flex;align-items:center;gap:15px;border-bottom:2px solid #3e3540;padding-bottom:12px}.mark{width:38px;height:38px;border:2px solid #3e3540;border-radius:8px;text-align:center;font:bold 28px Arial;background:#fff0b8}h1{font-size:20px;margin:0 0 6px}header p{font-size:12px;margin:0}.identity{margin:12px 0;border:1px solid #ccc;padding:10px;font-size:13px}.question{margin:14px 0;min-height:36mm;border-bottom:1px dashed #eee;break-inside:avoid}.question h3{font-size:14px;margin:0 0 7px}.question small{color:#777;font-weight:normal}.formula{font-size:15px;white-space:pre-wrap;line-height:1.6}.answer-lines{height:20mm;margin-top:8px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 27px,#e6e1df 28px)}footer{font-size:11px;color:#666;padding-top:12px}';
 try{windowPrint.document.open();windowPrint.document.write('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>一人一卷 · '+esc(paper.title)+'</title><link rel="stylesheet" href="'+new URL('assets/import/katex/katex.min.css',window.location.href).href+'"><style>'+css+'</style></head><body>'+pages+'</body></html>');windowPrint.document.close();windowPrint.focus();setTimeout(()=>windowPrint.print(),350);}
 catch(e){msg(teacherMode?TR:SR,'生成打印预览失败：'+(e.message||''));}
}
function exportCsv(){
 if(!t.paper)return;
 const allowed=t.questions.filter(x=>x.kind==='regular').map(q=>q.question_no);
 const lines=[['学号','姓名','教师统计','学生自报','合并错题','重测原题','深度题','已发布']];
 for(const r of t.roster){
  const reports=t.reports.filter(x=>x.student_code===r.student_code),teacher=reports.find(x=>x.source==='teacher'),student=reports.find(x=>x.source==='student'),p=t.plans.find(x=>x.student_code===r.student_code);
  lines.push([r.student_code,r.student_name,teacher?.wrong_numbers.join(' ')||'',student?.wrong_numbers.join(' ')||'',E.mergeReports(reports,allowed).join(' '),(p?.selected_numbers||[]).join(' '),(p?.extra_numbers||[]).join(' '),p?.published?'是':'否']);
 }
 const value='\uFEFF'+lines.map(row=>row.map(x=>'"'+String(x??'').replace(/"/g,'""').replace(/^\s*[=+\-@]/,z=>"'"+z)+'"').join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([value],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='RATIOBOT_试卷错题_'+day()+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 msg(TR,'已导出名册中 '+t.roster.length+' 人的双来源错题与个人选题。');
}
function bindPlansTab(){
 TR.querySelector('#paperGenerate')?.addEventListener('click',generatePlans);
 TR.querySelector('#paperRelease')?.addEventListener('click',releasePlans);
 TR.querySelector('#paperPrint')?.addEventListener('click',()=>printSheets(true));
 TR.querySelector('#paperExport')?.addEventListener('click',exportCsv);
 TR.querySelectorAll('[data-paper-plan]').forEach(b=>b.onclick=()=>{t.editingStudent=b.dataset.paperPlan;renderTeacher();TR.querySelector('#paperPlanEdit')?.scrollIntoView({block:'center',behavior:'smooth'});});
 TR.querySelector('#paperPlanEdit')?.addEventListener('submit',savePlan);
}
window.PaperMistakes={open,loadTeacher,reset(){
 teacherEpoch++;studentEpoch++;t={classId:'',papers:[],roster:[],paperId:'',paper:null,questions:[],reports:[],plans:[],tab:'paper',editing:'1',editingStudent:'',message:''};
 s={studentCode:'',papers:[],paperId:'',paper:null,questions:[],reports:[],plan:null,message:''};SR.innerHTML='';TR.innerHTML='';
}};
})();
