/* RATIOBOT / paper-first mistake workflow: deterministic helpers. */
(function(root){
'use strict';
const order=(a,b)=>{const x=String(a).match(/^(\d+)$/),y=String(b).match(/^(\d+)$/);return x&&y?Number(x[1])-Number(y[1]):x?-1:y?1:String(a).localeCompare(String(b),'zh',{numeric:true});};
function list(value){
 if(Array.isArray(value))return value.map(String).map(x=>x.trim()).filter(Boolean);
 const text=String(value??'').trim();if(!text)return [];
 return text.split(/[,，、;；\s]+/).map(s=>s.trim()).filter(Boolean).flatMap(x=>{
  const m=x.match(/^(\d+)[-~～](\d+)$/);if(!m)return [x];
  let from=Number(m[1]),to=Number(m[2]);return to>=from&&to-from<=100?Array.from({length:to-from+1},(_,i)=>String(from+i)):[x];
 });
}
function normalized(value,allowed){
 const canonical=new Map((allowed||[]).map(q=>[String(q).replace(/^0+(?=\d)/,''),String(q)]));
 const keys=[],unknown=[];
 for(let n of list(value)){
  if(/^\d+$/.test(n))n=n.replace(/^0+(?=\d)/,'');
  const real=canonical.get(n);if(!real){if(!unknown.includes(n))unknown.push(n);continue;}
  if(!keys.includes(real))keys.push(real);
 }
 return {numbers:keys.sort(order),unknown};
}
function rowsFromText(value){
 const lines=String(value||'').replace(/\r/g,'').split('\n'),rows=[],errors=[];
 lines.forEach((line,i)=>{
  const s=line.trim();if(!s||s.startsWith('#'))return;
  const m=s.match(/^([0-9]{1,3})\s*[:：]\s*(.*)$/);
  if(!m){errors.push('第'+(i+1)+'行：请按「学号: 题号,题号」填写');return;}
  rows.push({studentCode:String(Number(m[1])),raw:m[2],line:i+1});
 });
 return {rows,errors};
}
function csv(text,separator){
 const s=String(text||'').replace(/^\uFEFF/,'');let rows=[],row=[],cell='',quote=false;
 const sep=separator||(s.includes('\t')?'\t':',');
 for(let i=0;i<s.length;i++){
  const c=s[i];if(quote){if(c==='"'&&s[i+1]==='"'){cell+='"';i++;}else if(c==='"')quote=false;else cell+=c;}
  else if(c==='"')quote=true;
  else if(c===sep){row.push(cell);cell='';}
  else if(c==='\n'){row.push(cell.trim());if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';}
  else if(c!=='\r')cell+=c;
 }
 row.push(cell.trim());if(row.some(x=>x.trim()))rows.push(row);
 return rows;
}
function mergeReports(reports,allowed){
 let combined=[];
 for(const r of reports||[])for(const x of normalized(r.wrong_numbers||[],allowed).numbers)if(!combined.includes(x))combined.push(x);
 return combined.sort(order);
}
function plan(reports,questions,selectedMax=5){
 const regular=(questions||[]).filter(q=>q.kind==='regular'),depth=(questions||[]).filter(q=>q.kind==='depth'&&String(q.body||'').trim());
 const allowed=regular.map(q=>q.question_no),wrong=mergeReports(reports,allowed);
 const lookup=new Map(questions.map(q=>[q.question_no,q]));
 wrong.sort((a,b)=>Number(lookup.get(a)?.priority||2)-Number(lookup.get(b)?.priority||2)||order(a,b));
 const selected_numbers=wrong.slice(0,selectedMax),space=selectedMax-selected_numbers.length;
 const extra_numbers=depth.sort((a,b)=>Number(a.priority||2)-Number(b.priority||2)||order(a.question_no,b.question_no)).slice(0,space).map(q=>q.question_no);
 return {selected_numbers,extra_numbers,reported_count:wrong.length,missing:Math.max(0,selectedMax-selected_numbers.length-extra_numbers.length)};
}
function describePlan(paper,planItem,questions){
 const lookup=new Map(questions.map(q=>[q.question_no,q]));
 const num=[...(planItem?.selected_numbers||[]),...(planItem?.extra_numbers||[])];
 return num.map(n=>{const q=lookup.get(n);if(!q)return {number:n,text:'请核对试卷题号 '+n,answer:''};
 return {number:q.question_no,depth:q.kind==='depth',text:q.variant_body?.trim()||q.body?.trim()||'请完成原试卷第 '+n+' 题',answer:q.variant_answer?.trim()||q.answer?.trim()||'',source:q.variant_body?.trim()?'变式题':q.kind==='depth'?'深度思考题':'原题'};});
}
function escape(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const api={list,normalized,rowsFromText,csv,mergeReports,plan,describePlan,order,escape};
if(typeof module==='object'&&module.exports)module.exports=api;else root.MistakePapersCore=api;
})(typeof window==='object'?window:this);