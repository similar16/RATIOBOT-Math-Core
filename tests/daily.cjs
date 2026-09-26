const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict');
const dom=new JSDOM('<section id="home" class="page active"></section><div id="dailyDate"></div><div id="dailyArchive"></div><div id="dailyContent"></div><div id="teacherDailyContent"></div>',{runScripts:'outside-only',url:'https://test.local'}),w=dom.window,d=w.document;
w.matchMedia=()=>({matches:true});w.eval(fs.readFileSync('site/question-content.js','utf8'));w.eval(fs.readFileSync('site/daily.js','utf8'));
let who={user:{id:'s1'},classId:'c1',role:'student'},sets=[],answers=[],fail=false,route='',progress=[];
const client={from(table){let rows,mode='read',payload,filters=[];const q={select(){return q},eq(k,v){filters.push([k,v]);return q},order(){return q},insert(v){mode='insert';payload=v;return q},update(v){mode='update';payload=v;return q},upsert(v){mode='upsert';payload=v;return q},maybeSingle(){return run(true)},then(ok,bad){return run(false).then(ok,bad)}};
async function run(single){if(fail)return {data:null,error:Error('offline')};rows=table==='daily_challenge_rewards'?[]:table==='daily_challenge_sets'?sets:table==='class_roster'?[{class_id:'c1',user_id:'s1',student_code:'2',student_name:'测试学生'}]:answers;
if(mode==='insert'){payload={id:'set1',...payload};rows.push(payload)}if(mode==='update'){rows=rows.filter(x=>filters.every(([k,v])=>x[k]===v));rows.forEach(x=>Object.assign(x,payload));filters=[]}if(mode==='upsert'){let old=rows.find(x=>x.set_id===payload.set_id&&x.slot===payload.slot&&x.user_id===payload.user_id);if(old)Object.assign(old,payload);else rows.push(payload)}
let result=mode==='insert'||mode==='upsert'?[payload]:rows.filter(x=>filters.every(([k,v])=>x[k]===v));return {data:single?result[0]||null:result,error:null};}return q;},async rpc(name,args){if(name==='check_daily_inline_answer')return {data:args.submitted==='42',error:null};return {data:null,error:null};}};
const ui=w.mountDailyChallenges({client:()=>client,identity:()=>who,go:id=>route=id,progress:x=>progress.push(x)}),$=s=>d.querySelector(s),tick=()=>new Promise(r=>setTimeout(r,15));
(async()=>{
 assert.equal($('#ratioCompanion').hidden,false);$('#ratioCompanion button').click();assert.equal(route,'daily');
 for(const p of ['knowledge','review','rules','train','rings','teacher','account','daily']){ui.route(p);await tick();assert.equal($('#ratioCompanion').hidden,true,p)}
 ui.route('growth');assert.equal($('#ratioCompanion').hidden,false);
 await ui.open();assert.match($('#dailyContent').textContent,/还在准备/);
 who={...who,role:'teacher'};await ui.loadTeacher('c1');$('#dailyPublish').click();assert.match($('#dailyTeacherStatus').textContent,/完整两道题/);
 for(let i=0;i<2;i++){$('#dailyBody'+i).value='第'+i+'题 <img src=x onerror=alert(1)>';$('#dailyHint'+i+'_0').value='先观察';$('#dailyHint'+i+'_1').value='再计算';}
 $('#dailySaveDraft').click();await tick();assert.equal(sets.length,1);assert.equal(sets[0].published,false);
 $('#dailyPublish').click();await tick();assert.equal(sets[0].published,true);assert.equal($('#dailyPublish'),null);
 sets[0].questions[0].body='第0题 [ANS:a1]';sets[0].questions[0].steps=['第一步','第二步'];sets[0].questions[0].has_solution=true;sets[0].questions[0].answer_type='fill';sets[0].questions[1].answer_type='choice';sets[0].questions[1].choices=['3','4','5'];
 who={...who,role:'student'};await ui.open();assert.equal(d.querySelectorAll('#dailyContent .daily-card').length,2);assert.equal($('#dailyContent img'),null);assert.equal(progress.at(-1).totalQuestions,2);assert.equal(progress.at(-1).submittedSlots.length,0);
 assert.equal($('.daily-answer-btn').disabled,true);const inline=$('.daily-inline-answer');assert(inline);inline.value='41';inline.dispatchEvent(new w.Event('blur'));await tick();assert.equal(inline.dataset.state,'wrong');inline.value='42';inline.dispatchEvent(new w.Event('blur'));await tick();assert.equal(inline.dataset.state,'correct');
 let h=$('.daily-hint-btn');assert.equal(h.disabled,true);assert.match(h.textContent,/提交答案/);assert.equal($('.daily-step-btn').disabled,true);
 $('#dailyAnswer0').value='42';$('#dailyReason0').value='推理过程';await $('form').onsubmit({preventDefault(){},currentTarget:$('form')});assert.equal(answers.length,1);assert.equal(progress.at(-1).submittedSlots.length,1);assert.equal(progress.at(-1).submittedSlots[0],0);assert.match($('.daily-status').textContent,/已提交/);assert.equal(h.disabled,false);assert.equal($('.daily-step-btn').disabled,false);h.click();assert.match($('.daily-hints').textContent,/先观察/);$('.daily-step-btn').click();assert.match($('.daily-steps').textContent,/第一步/);assert.doesNotMatch($('.daily-steps').textContent,/第二步/);$('.daily-step-btn').click();assert.equal($('.daily-step-btn').disabled,true);
 assert.equal($('.daily-answer-btn').disabled,false);
 const choice=d.querySelectorAll('input[name="dailyChoice1"]')[1];assert(choice);choice.checked=true;const secondForm=d.querySelectorAll('#dailyContent form')[1];await secondForm.onsubmit({preventDefault(){},currentTarget:secondForm});assert.equal(answers.length,2);assert.equal(answers.find(x=>x.slot===1).answer,'B');assert.equal(progress.at(-1).submittedSlots.length,2);assert.equal(progress.at(-1).submittedSlots.includes(0),true);assert.equal(progress.at(-1).submittedSlots.includes(1),true);
 $('#dailyAnswer0').value='43';await $('form').onsubmit({preventDefault(){},currentTarget:$('form')});assert.equal(answers.length,2);assert.equal(answers.find(x=>x.slot===0).answer,'43');
 fail=true;$('#dailyAnswer0').value='44';await $('form').onsubmit({preventDefault(){},currentTarget:$('form')});assert.match($('.daily-status').textContent,/保存失败/);assert.equal($('#dailyAnswer0').value,'44');fail=false;
 who={...who,user:{id:'s2'}};await ui.open();assert.equal($('#dailyAnswer0').value,'');
 who={...who,role:'teacher'};await ui.loadTeacher('c1');assert.match($('#dailyAnswers').textContent,/2号/);assert.match($('#dailyAnswers').textContent,/43/);
 who={...who,role:'student'};sets.push({...sets[0],id:'old-set',challenge_date:'2020-01-01'});await ui.open('2020-01-01');assert.match($('#dailyDate').textContent,/2020-01-01/);assert.equal($('#dailyDateSelect').value,'2020-01-01');assert.match($('#dailyContent').textContent,/往期练习/);assert.equal($('.companion-label'),null);
 ui.reset();assert.equal($('#dailyContent').textContent,'');assert.equal($('#teacherDailyContent').textContent,'');ui.destroy();w.close();
 console.log('PASS daily: inline answer auto-check, gated hints, fill/choice responses, reward flow, teacher responses and reset');
})().catch(e=>{console.error(e);ui.destroy();w.close();process.exitCode=1});
