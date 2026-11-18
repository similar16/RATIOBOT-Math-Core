/* Read-only teacher report. Legacy activity IDs are not timing or set records. */
(function(root){
 'use strict';
 const goal=10,codes=['D1','D2'];
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const credited=value=>Array.isArray(value)?[...new Set(value.filter(x=>typeof x==='string'&&x.trim()))].slice(0,goal):[];
 function build(roster=[],snapshots=[]){
  const byUser=new Map(snapshots.map(s=>[s.user_id,s]));
  const rows=roster.filter(r=>/^\d+$/.test(String(r.student_code))&&Number(r.student_code)>=1&&Number(r.student_code)<=45).map(r=>{
   const event=byUser.get(r.user_id)?.economy?.events?.autumnBreak2026||{};
   const runs=Object.fromEntries(codes.map(code=>[code,credited(event.runs?.[code])]));
   const d1=runs.D1.length,d2=runs.D2.length;
   return {number:Number(r.student_code),name:r.student_name||'未填姓名',registered:!!r.user_id,d1,d2,complete:d1>=goal&&d2>=goal,
    records:codes.flatMap(code=>runs[code].map((id,index)=>({id,code,ordinal:index+1,setNumber:null,elapsed:null,limitSeconds:code==='D1'?30:40}))) };
  }).sort((a,b)=>Number(b.complete)-Number(a.complete)||Number(b.d1+b.d2>0)-Number(a.d1+a.d2>0)||a.number-b.number);
  return {rows,summary:{students:rows.length,registered:rows.filter(r=>r.registered).length,
   creditedStudents:rows.filter(r=>r.d1+r.d2>0).length,completed:rows.filter(r=>r.complete).length,
   d1Completed:rows.filter(r=>r.d1>=goal).length,d2Completed:rows.filter(r=>r.d2>=goal).length,
   d1:rows.reduce((n,r)=>n+r.d1,0),d2:rows.reduce((n,r)=>n+r.d2,0)}};
 }
 function render(host,roster,snapshots,{available=true,at=Date.now()}={}){
  if(!host)return;
  if(!available){host.innerHTML='<section class="teacher-box autumn-report"><h3>秋假限时活动统计</h3><p role="alert">活动数据未能完整读取，请刷新数据后重试.</p></section>';return;}
  const report=build(roster,snapshots),s=report.summary;
  const date=new Date(at).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false});
  const details=report.rows.filter(r=>r.records.length).map(r=>'<details class="autumn-student-records"><summary>'+esc(r.number)+'号 '+esc(r.name)+' · 已计入 '+r.records.length+' 次</summary><div class="autumn-table-scroll"><table><thead><tr><th>题型</th><th>计入序号</th><th>具体套号</th><th>本套用时</th><th>已知达标范围</th></tr></thead><tbody>'+r.records.map(record=>'<tr><td>'+record.code+'</td><td>'+record.ordinal+'</td><td>未记录</td><td>未记录</td><td>全对，≤'+record.limitSeconds+'秒</td></tr>').join('')+'</tbody></table></div></details>').join('');
  host.innerHTML='<section class="teacher-box autumn-report"><h3>秋假限时活动统计</h3><p data-autumn-asof>截至 '+esc(date)+'（北京时间）.活动时间：2026年11月14日至19日.</p><p>D1每套5题全对且≤30秒、D2每套5题全对且≤40秒，各计入10次后完成活动.以下仅统计1—45号，排除46号测试账号.</p><div class="teacher-summary" data-autumn-summary><div><small>完成全部活动</small><b>'+s.completed+'人</b></div><div><small>至少有一次达标记录</small><b>'+s.creditedStudents+'人</b></div><div><small>D1已满10次</small><b>'+s.d1Completed+'人</b></div><div><small>D2已满10次</small><b>'+s.d2Completed+'人</b></div></div><p class="autumn-record-note">历史活动进度只保存达标记录编号，每类最多10个.具体套号、每次用时及未达标尝试未保存，无法从编号还原；下表的“无已保存达标记录”不等于没有练习.</p><div class="autumn-table-scroll"><table data-autumn-students><thead><tr><th>学号</th><th>姓名</th><th>D1计入次数</th><th>D2计入次数</th><th>活动状态</th><th>每次用时与套号</th></tr></thead><tbody>'+report.rows.map(r=>'<tr><td>'+r.number+'</td><td>'+esc(r.name)+'</td><td>'+r.d1+'/10</td><td>'+r.d2+'/10</td><td>'+(r.complete?'已完成':r.d1+r.d2?'进行中':r.registered?'无已保存达标记录':'未注册')+'</td><td>'+(r.d1+r.d2?'历史未记录':'—')+'</td></tr>').join('')+'</tbody></table></div>'+(details?'<details class="autumn-record-details"><summary>查看已计入活动的逐次记录</summary><p>计入序号只表示保存顺序，不能解释为练习套号.不能用其他训练的平均用时替代本次用时.</p>'+details+'</details>':'')+'</section>';
  return report;
 }
 const api={build,render};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioAutumnReport=api;
})(typeof window==='undefined'?globalThis:window);
