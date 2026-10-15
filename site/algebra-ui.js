(function(){
'use strict';
const A=window.AlgebraEngine,bridge=window.RatioAlgebraBridge;if(!A||!bridge)return;
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=s=>{try{return window.katex?.renderToString(String(s),{throwOnError:false,output:'html'})||esc(s);}catch(e){return esc(s);}};
const names={b1:'合并同类项',b2:'去括号化简',b3:'整式加减',b4:'代数式综合'};
let unlocked=0,unlockClass='',unlockTime=0,teacherLevel=0,run=null,waiting=false,selection=[],ruleToken=0;
const native={};let keypadOriginal=null;
function student(){return bridge.ready()&&bridge.identity().role==='student';}
function tester(){return student()&&String(bridge.profile()?.studentId||'')==='46';}
function isStage(stage){return /^alg_b[1-4]$/.test(String(stage||''));}
function validClass(){return bridge.identity().classId||'';}
function status(selector,msg,bad=false){const n=$(selector);if(!n)return;n.textContent=msg;n.classList.toggle('bad',bad);}
async function loadUnlock(force=false){
 if(tester()){unlocked=4;return 4;}
 if(!student()){unlocked=0;unlockClass='';return 0;}
 const cls=validClass();if(!cls){unlocked=0;return 0;}
 if(!force&&cls===unlockClass&&Date.now()-unlockTime<12000)return unlocked;
 unlockClass=cls;unlockTime=Date.now();unlocked=0;
 try{const r=await bridge.client().from('classes').select('id,algebra_progress').eq('id',cls).maybeSingle();if(r.error||!r.data)throw r.error||Error('班级不存在');if(cls===validClass())unlocked=Math.min(4,Math.max(0,Number(r.data.algebra_progress?.through||0)));}
 catch(err){unlocked=0;status('#algAccessText','无法读取进度。请检查网络后重试。',true);}
 return unlocked;
}
function configText(c){return (names[c.stage?.slice(4)]||'代数式运算')+' · '+({integer:'整数系数',fraction:'含分数',denominator:'常数分母'}[c.numberType]||'整数系数')+' · '+({easy:'轻松',normal:'标准',hard:'挑战'}[c.difficulty]||'标准')+' · '+(Number(c.brackets)||5)+'题';}
function renderStageConfig(c){
 $('#numberOptions').closest('.config-group').querySelector('.config-title span').textContent='系数类型';
 $('#bracketOptions').closest('.config-group').querySelector('.config-title span').textContent='每局题量';
 const unsuitable=['alg_b1','alg_b2'].includes(c.stage);
 $('#numberOptions [data-value="denominator"]').disabled=unsuitable;
 const n=Number(c.brackets)||5,kind=c.stage.slice(4),points=A.fullPoints(kind,c.difficulty,c.numberType,n);
 $('#bracketNote').textContent='3～6题一局。按首答正确率和订正情况结算；一局只产生一次积分。';
 $('#configSummary').textContent=configText(c)+' · 全对可获 '+points+' R积分';
 $('#startBtn').disabled=true;
 let msg=$('#algAccessText');if(!msg){msg=document.createElement('small');msg.id='algAccessText';msg.className='alg-access-text';$('#configSummary').after(msg);}
 msg.hidden=false;
 status('#algAccessText','正在确认本班开放进度…');
 const cls=validClass(),stage=c.stage;
 loadUnlock().then(level=>{
  if(!isStage(stage)||$('#stageOptions .active')?.dataset.value!==stage||cls!==validClass())return;
  const allowed=tester()||level>=A.MODULES[kind].level;
  $('#startBtn').disabled=!allowed||!student();
  status('#algAccessText',!student()?'请先登录学生账号':allowed?'✓ 已开放，使用与有理数训练相同的挑战界面。':'此模块暂未开放，请等待老师设置教学进度。',!allowed);
 });
}
function captureHandlers(){
 for(const id of ['submitBtn','hintBtn','exitGame','againBtn','reconfigBtn','weakBtn'])native[id]=$('#'+id)?.onclick||null;
 keypadOriginal=Array.from($('#keypad').childNodes);
 $('#answerInput').addEventListener('keydown',e=>{if(!run||e.key!=='Enter')return;e.preventDefault();e.stopImmediatePropagation();submit();},true);
}
function restoreControls(){
 for(const id of Object.keys(native)){const element=$('#'+id);if(element)element.onclick=native[id];}
 if(keypadOriginal)$('#keypad').replaceChildren(...keypadOriginal);
 $('#answerInput').setAttribute('inputmode','decimal');$('#answerInput').placeholder='答案';
 $('#gameView').classList.remove('algebra-game');$('#resultView').classList.remove('algebra-result');
}
function stopRun(){run=null;restoreControls();}
function keypad(){
 const old=$('#keypad');old.innerHTML='';
 for(const key of ['x','y','a','b','m','n','t','z','²','³','⁴','+','−','/','(',')','⌫','清空']){
  const b=document.createElement('button');b.type='button';b.textContent=key;b.dataset.key=key;
  if(key==='清空')b.className='wide';
  b.onclick=()=>{if(!run||run.answered)return;const input=$('#answerInput');const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;const insert=key==='²'?'^2':key==='³'?'^3':key==='⁴'?'^4':key==='−'?'-':key;
   if(key==='清空'){input.value='';input.focus();return;}
   if(key==='⌫'){if(start===end&&start>0)input.value=input.value.slice(0,start-1)+input.value.slice(end);else input.value=input.value.slice(0,start)+input.value.slice(end);input.focus();input.setSelectionRange(Math.max(0,start-(start===end?1:0)),Math.max(0,start-(start===end?1:0)));return;}
   input.value=input.value.slice(0,start)+insert+input.value.slice(end);input.focus();input.setSelectionRange(start+insert.length,start+insert.length);
  };
  old.appendChild(b);
 }
}
function installGameHandlers(){
 $('#submitBtn').onclick=submit;$('#hintBtn').onclick=hint;
 $('#exitGame').onclick=()=>{if(!window.confirm('退出本局？当前这一局不计入完成记录。'))return;stopRun();$('#gameView').classList.add('hidden');$('#setupView').classList.remove('hidden');};
 $('#againBtn').onclick=()=>{const old=run?.config;if(old)startFromCore({stage:'alg_'+old.module,numberType:old.coefficient,difficulty:old.difficulty,brackets:String(old.count)});};
 $('#reconfigBtn').onclick=()=>{stopRun();$('#resultView').classList.add('hidden');$('#setupView').classList.remove('hidden');bridge.renderConfig?.();window.scrollTo?.({top:0,behavior:'smooth'});};
 $('#weakBtn').onclick=repairFromResult;
 keypad();
 $('#answerInput').setAttribute('inputmode','text');$('#answerInput').placeholder='如 2x^2-3xy+1';
 $('#gameView').classList.add('algebra-game');$('#resultView').classList.add('algebra-result');
}
async function startFromCore(c){
 if(waiting||!student()){if(!student())bridge.go('account');return;}
 const module=c.stage.slice(4),conf={module,difficulty:c.difficulty||'normal',coefficient:c.numberType||'integer',count:Number(c.brackets)||5};
 if(!A.MODULES[module]||conf.count<3||conf.count>6)return;
 waiting=true;
 try{
  const level=await loadUnlock(true);
  if(!tester()&&level<A.MODULES[module].level){status('#algAccessText','老师尚未开放这个模块。',true);$('#startBtn').disabled=true;return;}
  const questions=[];
  for(let i=0;i<conf.count;i++){let q;for(let tries=0;tries<12;tries++){try{q=A.generate(conf);break;}catch(e){if(tries===11)throw e;}}questions.push(q);}
  stopRun();
  run={config:conf,questions,index:0,combo:0,maxCombo:0,first:0,retry:0,attempts:0,answered:false,hintCount:0,started:Date.now(),times:[],mistakes:[],finished:false,nonce:0};
  installGameHandlers();
  $('#setupView').classList.add('hidden');$('#studentView').classList.add('hidden');$('#resultView').classList.add('hidden');$('#gameView').classList.remove('hidden');
  showQuestion();
 }catch(e){status('#algAccessText','无法生成本局题目：'+String(e.message||e),true);}finally{waiting=false;}
}
function feedback(msg,type=''){const f=$('#feedback');f.textContent=msg;f.className='feedback'+(type?' '+type:'');}
function showQuestion(){
 if(!run)return;const {questions,index,config}=run,q=questions[index],count=questions.length;
 run.attempts=0;run.answered=false;run.hintCount=0;run.started=Date.now();run.nonce++;
 $('#qIndex').textContent=String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0');
 $('#gameModeLabel').textContent=names[config.module]+' · '+({easy:'轻松',normal:'标准',hard:'挑战'}[config.difficulty]||'标准');
 $('#progressBar').style.width=String((index+1)*100/count)+'%';$('#combo').textContent=run.combo;
 $('#bossBadge').classList.toggle('hidden',index!==count-1);$('#expression').innerHTML=fmt(q.expression);
 $('#answerInput').value='';$('#answerInput').disabled=false;$('#submitBtn').disabled=false;$('#submitBtn').textContent='确认答案';
 feedback('请化简到最简整式。用 x^2 表示平方，xy 表示乘积，分数系数输入 1/2x。');
 $('#answerInput').focus();
}
function correctAnswer(first){
 if(!run||run.answered)return;run.answered=true;
 const q=run.questions[run.index];run.times.push((Date.now()-run.started)/1000);
 if(first){run.first++;run.combo++;run.maxCombo=Math.max(run.maxCombo,run.combo);}
 else{run.retry++;run.combo=0;}
 $('#combo').textContent=run.combo;$('#answerInput').disabled=true;
 $('#submitBtn').textContent='下一题 →';$('#submitBtn').disabled=false;
 feedback(first?'✓ 正确'+(run.combo>=3?' · COMBO × '+run.combo:'')+'！':'✓ 订正正确！','good');
 if(first){const nonce=run.nonce,session=run;setTimeout(()=>{if(run===session&&run.answered&&run.nonce===nonce)next();},run.combo>=3?520:750);}
}
function submit(){
 if(!run||run.finished)return;if(run.answered){next();return;}
 const raw=$('#answerInput').value.trim();if(!raw){feedback('请填写答案后再提交。','bad');return;}
 try{A.parse(raw);}catch(e){feedback(e.message||'表达式未识别，请检查格式。','bad');return;}
 const q=run.questions[run.index],r=A.check(raw,q.answer);
 if(r.correct){correctAnswer(run.attempts===0&&run.hintCount===0);return;}
 run.attempts++;run.combo=0;$('#combo').textContent='0';
 run.mistakes.push({module:q.module,structure:q.meta,equivalent:r.equivalent,reason:r.reason});
 if(run.attempts>=3){run.answered=true;run.times.push((Date.now()-run.started)/1000);$('#answerInput').disabled=true;$('#submitBtn').textContent='看懂了，下一题 →';feedback('参考答案：'+q.answer+'。下一题再试试。','bad');}
 else feedback(r.equivalent?'等值但尚未合并完全，写出最简整式。':run.attempts===1?'检查同类项、符号或每个字母的指数。':'再看一次括号前的系数，以及分数和负号。','bad');
}
function hint(){
 if(!run||run.answered)return;
 run.hintCount++;
 const mod=run.config.module;
 const h={b1:['先把同一字母部分的项找出来。','只把这些项的系数相加，字母和指数都不变。'],
 b2:['先看括号前的正负号及倍数。','逐项相乘，特别注意括号前为负数时的变号。'],
 b3:['先去括号，注意两个多项式的差。','再把相同字母和次数的项合并。'],
 b4:['观察是否有重复出现的整体。','先处理内层括号或常数分母，再合并同类项。']}[mod]||[];
 feedback('🤖 '+h[Math.min(run.hintCount-1,h.length-1)],'hint');
}
function next(){
 if(!run||!run.answered||run.finished)return;
 run.index++;
 if(run.index===run.questions.length)finish();else showQuestion();
}
async function finish(){
 if(!run||run.finished)return;run.finished=true;
 const session=run,n=session.questions.length,acc=Math.round(session.first/n*100);
 const max=A.fullPoints(session.config.module,session.config.difficulty,session.config.coefficient,n);
 const requested=Math.floor(max*(session.first+0.5*session.retry)/n);
 let result={gain:0,xp:0,reason:'本局暂未保存'};
 try{result=bridge.complete({config:session.config,questions:n,first:session.first,retry:session.retry,accuracy:acc,max,requested,mistakes:session.mistakes,avgTime:session.times.reduce((a,b)=>a+b,0)/Math.max(1,n),bestCombo:session.maxCombo});}
 catch(e){result.reason='结算出错：'+String(e.message||e);}
 $('#gameView').classList.add('hidden');$('#resultView').classList.remove('hidden');
 $('#resultAccuracy').textContent=acc+'%';$('#resultCombo').textContent=String(session.maxCombo);
 $('#resultTime').textContent=(session.times.reduce((a,b)=>a+b,0)/Math.max(1,n)).toFixed(1)+'s';
 const p=bridge.profile();$('#resultStudent').textContent=p?.classCode+' · '+p?.studentId+'号';
 $('#resultXP').textContent='+'+(result.xp||0)+' XP · +'+(result.gain||0)+' R积分';
 $('#resultLevelText').textContent='Lv.'+(result.afterLevel||1);
 $('#resultCoreText').textContent=names[session.config.module]+' · 首次正确 '+session.first+'/'+n;
 $('#resultXPBar').style.width=String(result.levelPct||0)+'%';
 $('#diagnoseText').textContent=(result.reason||'')+'；需要订正 '+session.mistakes.length+' 次。';
 $('#levelUpFlash').classList.toggle('hidden',!(result.afterLevel>result.beforeLevel));
 if(result.afterLevel>result.beforeLevel)$('#levelUpFlash').textContent='LEVEL UP! Lv.'+result.beforeLevel+' → Lv.'+result.afterLevel;
 try{await bridge.sync();}catch(e){}
}
function repairFromResult(){
 if(!run){return;}const c=run.config;startFromCore({stage:'alg_'+c.module,numberType:c.coefficient,difficulty:'normal',brackets:String(c.count)});
}
function labAllowed(id){return tester()||unlocked>=(id==='alg_bracket'?2:1);}
async function renderRule(id){
 if(!['alg_like','alg_merge','alg_bracket'].includes(id))return;
 const token=++ruleToken;selection=[];const root=$('#ruleDemo');
 root.innerHTML='<div class="demo-step"><strong>正在读取本班的法则开放进度…</strong></div>';
 const level=await loadUnlock(true);if(token!==ruleToken||!root.isConnected||$('#ruleTitle')?.textContent!==({alg_like:'同类项判断',alg_merge:'合并同类项',alg_bracket:'去括号法则'}[id]))return;
 if(!labAllowed(id)){root.innerHTML='<div class="demo-step"><strong>此法则尚未开放</strong><p>老师开放对应教学进度后，即可在这里体验。</p></div>';return;}
 if(id==='alg_like')renderLike(root);
 if(id==='alg_merge')renderMerge(root);
 if(id==='alg_bracket')renderBracket(root);
}
function choiceBtn(mark,html){return '<button type="button" class="demo-choice alg-demo-choice" data-val="'+mark+'">'+fmt(html)+'</button>';}
function toggleChoice(b){const v=Number(b.dataset.val);selection=selection.includes(v)?selection.filter(x=>x!==v):[...selection,v];b.classList.toggle('selected',selection.includes(v));}
function renderLike(root){
 root.innerHTML='<div class="demo-head"><b>交互演示 · 判断同类项</b><button id="algNewLike" class="ghost small">重新分类 ↻</button></div><div class="demo-expression">'+fmt('4x^2y')+'</div><div class="demo-step"><small>STEP 1 · 观察字母与次数</small><strong>选出所有与 4x²y 同类的项</strong><div class="demo-choices">'+['-7x^2y','2xy^2','5yx^2','-x^2y','3xy'].map((x,i)=>choiceBtn(i,x)).join('')+'</div><button id="algLabCheck" class="primary">检查分类</button><div id="algLabResult" class="alg-lab-result" aria-live="polite"></div></div>';
 root.querySelectorAll('[data-val]').forEach(b=>b.onclick=()=>toggleChoice(b));
 $('#algNewLike').onclick=()=>{selection=[];renderLike(root);};
 $('#algLabCheck').onclick=()=>{const ok=selection.length===3&&[0,2,3].every(x=>selection.includes(x));status('#algLabResult',ok?'✓ 正确！字母顺序不影响同类项，指数必须逐一相同。':'请重新比较各个字母的指数；总次数相同不代表同类项。',!ok);};
}
function renderMerge(root){
 root.innerHTML='<div class="demo-head"><b>交互演示 · 合并同类项</b><button id="algNewMerge" class="ghost small">再选一次 ↻</button></div><div class="demo-expression">'+fmt('4a^2+3b^2+2ab-4a^2-2b^2-b^2')+'</div><div class="demo-step"><small>STEP 1 · 选同类项</small><strong>选择所有含 a² 的项</strong><div class="demo-choices">'+['4a^2','3b^2','2ab','-4a^2','-2b^2','-b^2'].map((x,i)=>choiceBtn(i,x)).join('')+'</div></div><div class="demo-step"><small>STEP 2 · 算系数</small><strong>这组同类项合并后，系数是多少？</strong><div class="demo-choices"><button data-merge="0" class="demo-choice">0</button><button data-merge="8" class="demo-choice">8</button><button data-merge="-8" class="demo-choice">−8</button></div><div id="algLabResult" class="alg-lab-result" aria-live="polite"></div></div>';
 root.querySelectorAll('[data-val]').forEach(b=>b.onclick=()=>toggleChoice(b));
 $('#algNewMerge').onclick=()=>{selection=[];renderMerge(root);};
 root.querySelectorAll('[data-merge]').forEach(b=>b.onclick=()=>{const ok=selection.length===2&&selection.includes(0)&&selection.includes(3)&&b.dataset.merge==='0';status('#algLabResult',ok?'✓ 4＋(−4)＝0，整组项消失。':'先选4a²与−4a²，系数相加；字母部分不变。',!ok);});
}
function renderBracket(root){
 root.innerHTML='<div class="demo-head"><b>交互演示 · 去括号</b><button id="algNewBracket" class="ghost small">重新演示 ↻</button></div><div class="demo-expression">'+fmt('6m-3(-m+2n)')+'</div><div class="demo-step"><small>STEP 1 · 负系数分配</small><strong>正确的去括号结果是哪一个？</strong><div class="demo-choices">'+[['6m+3m-6n','good'],['6m-3m+6n','bad'],['6m+3m+6n','bad']].map(([x,k])=>'<button class="demo-choice" data-bracket="'+k+'">'+fmt(x)+'</button>').join('')+'</div><div id="algLabResult" class="alg-lab-result" aria-live="polite"></div></div><div id="algLabSecond" class="demo-step locked"><small>STEP 2 · 合并同类项</small><strong>化简结果是什么？</strong><div class="demo-choices">'+[['9m-6n','good'],['3m-6n','bad'],['9m+6n','bad']].map(([x,k])=>'<button class="demo-choice" data-final="'+k+'">'+fmt(x)+'</button>').join('')+'</div><div id="algLabFinalResult" class="alg-lab-result" aria-live="polite"></div></div>';
 $('#algNewBracket').onclick=()=>renderBracket(root);
 root.querySelectorAll('[data-bracket]').forEach(b=>b.onclick=()=>{const ok=b.dataset.bracket==='good';status('#algLabResult',ok?'✓ −3分别乘−m和2n；进入下一步。':'注意−3必须与括号里的每一项相乘。',!ok);if(ok)$('#algLabSecond').classList.remove('locked');});
 root.querySelectorAll('[data-final]').forEach(b=>b.onclick=()=>{if($('#algLabSecond').classList.contains('locked'))return;status('#algLabFinalResult',b.dataset.final==='good'?'✓ 正确，最终结果为 9m−6n。':'合并6m与3m，再保留−6n。',b.dataset.final!=='good');});
}
function installTeacher(){
 const node=$('#teacherPanelReview');if(!node)return;
 const block=document.createElement('div');block.className='teacher-box review-teacher alg-teacher-integrated';
 block.innerHTML='<h3>代数式运算 · 教师开放进度</h3><p>与第3章进度对应。默认关闭，新模块逐项开放后才可计分；46号测试账号可预览。</p><div class="review-release"><label>开放至 <select id="algTeacherThrough"><option value="0">暂不开放</option><option value="1">合并同类项</option><option value="2">去括号化简</option><option value="3">整式加减</option><option value="4">代数式综合</option></select></label><button id="algTeacherSave" class="primary">保存进度</button><button id="algTeacherReload" class="ghost">刷新</button></div><p id="algTeacherStatus" class="alg-access-text" role="status"></p>';
 node.appendChild(block);
 $('#algTeacherSave').onclick=saveTeacher;$('#algTeacherReload').onclick=loadTeacher;
 document.querySelectorAll('.teacher-tab').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.teacherTab==='review')setTimeout(loadTeacher,0);}));
 $('#teacherClassSelect')?.addEventListener('change',()=>setTimeout(loadTeacher,0));
}
async function loadTeacher(){
 const cls=$('#teacherClassSelect')?.value;if(!cls||bridge.identity().role!=='teacher'){status('#algTeacherStatus','请先选择班级。');return;}
 try{const r=await bridge.client().from('classes').select('id,algebra_progress').eq('id',cls).maybeSingle();if(r.error||!r.data)throw r.error||Error('读取失败');teacherLevel=Math.min(4,Math.max(0,Number(r.data.algebra_progress?.through||0)));$('#algTeacherThrough').value=String(teacherLevel);status('#algTeacherStatus','当前进度：'+(teacherLevel?names['b'+teacherLevel]:'暂不开放'));}
 catch(e){status('#algTeacherStatus','读取失败：'+String(e.message||e),true);}
}
async function saveTeacher(){
 const cls=$('#teacherClassSelect')?.value,through=Number($('#algTeacherThrough').value);
 if(!cls||bridge.identity().role!=='teacher')return status('#algTeacherStatus','无权限或未选班级。',true);
 $('#algTeacherSave').disabled=true;
 try{const r=await bridge.client().from('classes').update({algebra_progress:{through,updated_at:new Date().toISOString()}}).eq('id',cls).select('algebra_progress').maybeSingle();if(r.error||!r.data)throw r.error||Error('保存失败');teacherLevel=through;unlockClass='';status('#algTeacherStatus','✓ 已开放至：'+(through?names['b'+through]:'暂不开放'));}
 catch(e){status('#algTeacherStatus','保存失败：'+String(e.message||e),true);}
 finally{$('#algTeacherSave').disabled=false;}
}
captureHandlers();installTeacher();
window.AlgebraUI={isStage,loadUnlock,renderStageConfig,configText,startFromCore,renderRule,repairFromResult,loadTeacher,stopRun};
})();
