const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const dir=process.env.SITE_DIR||'site';
const E=require(path.resolve(dir,'paper-mistakes-core.js'));
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
for(const token of ['id="paperStudent"','id="teacherPaperMistakes"','id="practiceArchivePanel"','id="teacherPracticeArchivePanel"','paper-mistakes.js','paper-mistakes-core.js','paper-mistakes.css'])assert.ok(html.includes(token),token);
assert.deepEqual(E.normalized('02,3-5,4,99',['1','2','3','4','5']),{numbers:['2','3','4','5'],unknown:['99']});
assert.deepEqual(E.rowsFromText('1: 2,3\n2： 4\n# note\n3:').rows.map(x=>[x.studentCode,x.raw]),[['1','2,3'],['2','4'],['3','']]);
assert.equal(E.rowsFromText('bad line').errors.length,1);
assert.deepEqual(E.csv('题号,题干,答案\n1,"a,b",2\n2,foo,4'),[['题号','题干','答案'],['1','a,b','2'],['2','foo','4']]);
const questions=[1,2,3,4,5,6,7].map(i=>({question_no:String(i),kind:'regular',priority:i===6||i===7?1:i===1?3:2,body:'题'+i})).concat([{question_no:'D1',kind:'depth',body:'思考题A',priority:1},{question_no:'D2',kind:'depth',body:'思考题B',priority:2}]);
const reported=[{source:'teacher',wrong_numbers:['1','2','3','4','5','6','7']},{source:'student',wrong_numbers:['2','7']}];
assert.deepEqual(E.mergeReports(reported,questions.filter(x=>x.kind==='regular').map(x=>x.question_no)),['1','2','3','4','5','6','7']);
assert.deepEqual(E.plan(reported,questions).selected_numbers,['6','7','2','3','4']);
assert.deepEqual(E.plan([{wrong_numbers:['2','4']}],questions).extra_numbers,['D1','D2']);
assert.equal(E.plan([{wrong_numbers:['2']}],questions).missing,2);
assert.deepEqual(E.plan([{wrong_numbers:['2']}],questions.filter(q=>q.kind==='regular')).extra_numbers,[]);
assert.equal(E.describePlan(null,{selected_numbers:['1'],extra_numbers:['D1']},questions).length,2);
const dom=new JSDOM('<section id="paperStudent"></section><section id="teacherPaperMistakes"></section>',{url:'https://example.invalid',runScripts:'outside-only'});
const w=dom.window;
w.confirm=()=>true;
let who='teacher',role='teacher',currentClass='class-A';
const tables={
 paper_tests:[{id:'paper-1',class_id:'class-A',created_by:'teacher',title:'十一月周测',exam_date:'2026-11-04',question_count:3,published:true,file_path:'',file_name:''}],
 class_roster:[{student_code:'1',student_name:'甲',user_id:'user-1'},{student_code:'2',student_name:'乙',user_id:'user-2'},{student_code:'46',student_name:'测试',user_id:'user-46'}],
 class_members:[{class_id:'class-A',user_id:'user-1',role:'student',student_code:'1'},{class_id:'class-A',user_id:'user-2',role:'student',student_code:'2'},{class_id:'class-A',user_id:'user-46',role:'student',student_code:'46'}],
 paper_questions:[
 {id:'q1',paper_id:'paper-1',question_no:'1',kind:'regular',priority:2,body:'1+1',answer:'2',variant_body:'2+2',variant_answer:'4'},
 {id:'q2',paper_id:'paper-1',question_no:'2',kind:'regular',priority:1,body:'3+3',answer:'6',variant_body:'',variant_answer:''},
 {id:'q3',paper_id:'paper-1',question_no:'3',kind:'regular',priority:2,body:'4+4',answer:'8',variant_body:'',variant_answer:''},
 {id:'qd',paper_id:'paper-1',question_no:'D1',kind:'depth',priority:2,body:'深度思考',answer:'略',variant_body:'',variant_answer:''}
 ],
 paper_error_reports:[{paper_id:'paper-1',class_id:'class-A',student_code:'1',source:'teacher',wrong_numbers:['2'],updated_by:'teacher',updated_at:'2026-11-04'}],
 paper_retest_plans:[{paper_id:'paper-1',class_id:'class-A',student_code:'1',selected_numbers:['2'],extra_numbers:['D1'],published:true,teacher_note:'',updated_by:'teacher'}]
};
let seq=100;
const clone=v=>JSON.parse(JSON.stringify(v));
class Q{
 constructor(table){this.table=table;this.mode='read';this.payload=null;this.filters=[];this.orderBy=null;this.isIn=[];this.max=10000;}
 select(){return this;}eq(k,v){this.filters.push([k,v]);return this;}in(k,v){this.isIn.push([k,v]);return this;}order(k){this.orderBy=k;return this;}limit(n){this.max=n;return this;}
 maybeSingle(){return this.execute().then(r=>({data:r.data[0]||null,error:r.error}));}
 single(){return this.execute().then(r=>({data:r.data[0]||null,error:r.error}));}
 insert(x){this.mode='insert';this.payload=x;return this;}upsert(x){this.mode='upsert';this.payload=x;return this;}update(x){this.mode='update';this.payload=x;return this;}
 then(a,b){return this.execute().then(a,b);}
 async execute(){
  const arr=tables[this.table]||[];
  let found=arr.filter(r=>this.filters.every(([k,v])=>r[k]===v)&&this.isIn.every(([k,v])=>v.includes(r[k])));
  if(this.mode==='insert'||this.mode==='upsert'){
   let inputs=Array.isArray(this.payload)?this.payload:[this.payload],result=[];
   for(let row of inputs){let existing=null;if(this.mode==='upsert'){
    const keys=this.table==='paper_error_reports'?['paper_id','student_code','source']:this.table==='paper_retest_plans'?['paper_id','student_code']:['paper_id','question_no'];
    existing=arr.find(z=>keys.every(k=>z[k]===row[k]));
   }
   if(existing){Object.assign(existing,clone(row));result.push(existing);}
   else{let n={...clone(row),id:row.id||'new-'+(++seq)};arr.push(n);result.push(n);}
   }
   found=result;
  }
  if(this.mode==='update'){found.forEach(x=>Object.assign(x,clone(this.payload)));}
  if(this.orderBy)found.sort((a,b)=>String(a[this.orderBy]).localeCompare(String(b[this.orderBy])));
  return {data:clone(found.slice(0,this.max)),error:null};
 }
}
w.RatioMistakeBridge={identity:()=>({user:{id:who},classId:currentClass,role,mustChangePassword:false}),client:()=>({
 from:table=>new Q(table),
 storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:'https://example.invalid/verified'},error:null})})}
})};
w.MistakePapersCore=E;
w.eval(fs.readFileSync(path.join(dir,'paper-mistakes.js'),'utf8'));
const flush=()=>new Promise(r=>setTimeout(r,5));
(async()=>{
 await w.PaperMistakes.loadTeacher('class-A');await flush();
 assert.match(w.document.querySelector('#teacherPaperMistakes').textContent,/十一月周测/);
 let tabs=w.document.querySelectorAll('[data-paper-tab]');assert.equal(tabs.length,3);
 w.document.querySelector('[data-paper-tab="reports"]').click();
 assert.match(w.document.querySelector('#teacherPaperMistakes').textContent,/逐人检查/);
 w.document.querySelector('[data-paper-tab="plans"]').click();
 assert.match(w.document.querySelector('#teacherPaperMistakes').textContent,/一人一卷/);
 who='user-1';role='student';await w.PaperMistakes.open();await flush();
 assert.match(w.document.querySelector('#paperStudent').textContent,/学号 1/);
 assert.equal(w.document.querySelectorAll('#paperStudentReport input[name="wrong"]').length,3);
 w.document.querySelector('#paperStudentReport input[value="1"]').checked=true;
 let form=w.document.querySelector('#paperStudentReport');form.dispatchEvent(new w.Event('submit',{cancelable:true}));await flush();
 assert.deepEqual(tables.paper_error_reports.find(r=>r.student_code==='1'&&r.source==='student').wrong_numbers,['1']);
 assert.match(w.document.querySelector('#paperStudent').textContent,/个人重测卷/);
 who='user-2';await w.PaperMistakes.open();await flush();
 assert.match(w.document.querySelector('#paperStudent').textContent,/学号 2/);
 assert.doesNotMatch(w.document.querySelector('#paperStudent').textContent,/老师统计：2/);
 who='teacher';role='teacher';await w.PaperMistakes.loadTeacher('class-A');await flush();
 w.document.querySelector('[data-paper-tab="plans"]').click();
 w.document.querySelector('#paperGenerate').click();await flush();await flush();
 assert.ok(tables.paper_retest_plans.some(p=>p.student_code==='2')===false,'student without report must not get invented assignment');
 console.log('Paper-first mistakes: parser, union, five-question planning, student/teacher display, self report and isolation PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
