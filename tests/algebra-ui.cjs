const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom'),root=process.env.SITE_DIR||'_site',A=require(path.resolve(root,'algebra-engine.js'));
const html=fs.readFileSync(path.resolve(root,'index.html'),'utf8');
for(const marker of ['alg_like','alg_merge','alg_bracket','alg_b1','alg_b2','alg_b3','alg_b4'])assert.ok(html.includes(marker),'missing '+marker);
const ids=['qIndex','gameModeLabel','progressBar','combo','bossBadge','expression','feedback','resultAccuracy','resultCombo','resultTime','resultStudent','resultXP','resultLevelText','resultCoreText','resultXPBar','diagnoseText','levelUpFlash','configSummary','bracketNote','teacherPanelReview','ruleDemo'];
const buttons=['submitBtn','hintBtn','exitGame','againBtn','reconfigBtn','weakBtn','startBtn'];
const markup='<div id="rules"><h3 id="ruleTitle">同类项判断</h3></div>'+
'<div id="train"><div id="setupView"><div class="config-group"><div class="config-title"><span>数的类型</span></div><div id="numberOptions"></div></div><div class="config-group"><div class="config-title"><span>结构括号</span></div><div id="bracketOptions"></div></div><div id="stageOptions"><button class="active" data-value="alg_b1">代数式</button></div></div><div id="studentView"></div><div id="gameView"><input id="answerInput"><div id="keypad"><button id="oldKey">7</button></div></div><div id="resultView"></div></div>'+
'<button class="teacher-tab" data-teacher-tab="review"></button><select id="teacherClassSelect"><option value="test-class">测试班</option></select>';
const d=new JSDOM(markup,{url:'https://test.invalid/',runScripts:'outside-only',pretendToBeVisual:true});const w=d.window,doc=w.document,$=s=>doc.querySelector(s);
for(const id of ids)if(!$('#'+id)){const el=doc.createElement('div');el.id=id;doc.body.appendChild(el);}
for(const id of buttons){const el=doc.createElement('button');el.id=id;doc.body.appendChild(el);}
w.AlgebraEngine=A;w.katex={renderToString:s=>s};w.confirm=()=>true;w.scrollTo=()=>{};
let role='student',through=4,settlements=0;
const p={studentId:'46',classCode:'ZY2901'};
const client={from(table){assert.equal(table,'classes');const q={select(){return q},eq(){return q},update(row){through=row.algebra_progress.through;return q},maybeSingle:async()=>({data:{id:'test-class',algebra_progress:{through}}})};return q}};
w.RatioAlgebraBridge={ready:()=>role==='student',identity:()=>({role,classId:'test-class'}),client:()=>client,profile:()=>p,go:()=>{},renderConfig:()=>{},sync:async()=>true,complete:d=>{settlements++;return {gain:d.requested,xp:30,reason:'已结算',beforeLevel:1,afterLevel:2,levelPct:50}}};
const old=()=>{};for(const id of buttons)$('#'+id).onclick=old;
w.eval(fs.readFileSync(path.resolve(root,'algebra-ui.js'),'utf8'));
const U=w.AlgebraUI,pause=()=>new Promise(ok=>setTimeout(ok,0));
(async()=>{
 assert.ok(U,'algebra interface registered');
 await U.loadUnlock(true);U.renderStageConfig({stage:'alg_b1',numberType:'integer',difficulty:'normal',brackets:'5'});await pause();
 assert.equal($('#startBtn').disabled,false);assert.match($('#configSummary').textContent,/合并同类项/);
 await U.renderRule('alg_like');for(const i of [0,2,3])$('#ruleDemo [data-val="'+i+'"]').click();$('#algLabCheck').click();assert.match($('#algLabResult').textContent,/正确/);
 $('#ruleTitle').textContent='合并同类项';await U.renderRule('alg_merge');for(const i of [0,3])$('#ruleDemo [data-val="'+i+'"]').click();$('#ruleDemo [data-merge="0"]').click();assert.match($('#algLabResult').textContent,/消失/);
 $('#ruleTitle').textContent='去括号法则';await U.renderRule('alg_bracket');$('#ruleDemo [data-bracket="good"]').click();$('#ruleDemo [data-final="good"]').click();assert.match($('#algLabFinalResult').textContent,/正确/);
 await U.startFromCore({stage:'alg_b1',numberType:'integer',difficulty:'normal',brackets:'5'});
 assert.ok($('#keypad [data-key="x"]'),'algebra keyboard');
 for(let i=0;i<5;i++){const answer=A.canonical(A.parse($('#expression').textContent));$('#answerInput').value=answer;$('#submitBtn').click();assert.match($('#feedback').textContent,/正确/);$('#submitBtn').click();await pause();}
 assert.equal(settlements,1);assert.match($('#resultXP').textContent,/R积分/);
 $('#reconfigBtn').click();assert.equal($('#keypad #oldKey').textContent,'7');assert.equal($('#submitBtn').onclick,old);assert.equal($('#exitGame').onclick,old);
 role='teacher';$('#algTeacherReload').click();await pause();$('#algTeacherThrough').value='2';$('#algTeacherSave').click();await pause();assert.equal(through,2);
 console.log('PASS algebra native rule tab integration, shared challenge HUD, original keypad restored and teacher unlock');
})().catch(e=>{console.error(e);process.exitCode=1;});
