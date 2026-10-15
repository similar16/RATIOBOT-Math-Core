(function(){
'use strict';
const E=window.AlgebraEngine,bridge=window.RatioAlgebraBridge;if(!E||!bridge)return;
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const showMath=s=>{try{return window.katex?.renderToString(s,{throwOnError:false,output:'html'})||esc(s);}catch(e){return esc(s);}};
const names={b1:'合并同类项',b2:'去括号化简',b3:'整式加减',b4:'代数式综合'};
const labNames=['同类项分类','合并同类项','去括号法则'];
let lab=0,labStep=0,selected=[],lesson='',teacherLevel=0,unlocked=0,unlockClass='',unlockAt=0,run=null,waiting=false;
let conf={module:'b1',difficulty:'normal',coefficient:'integer',count:5};
const str=(x)=>String(x??'');
function status(id,s,bad=false){const el=$(id);if(!el)return;el.textContent=s;el.classList.toggle('bad',bad);}
function selectHtml(id,items,value){return '<select id="'+id+'">'+items.map(([v,label])=>'<option value="'+v+'"'+(String(v)===String(value)?' selected':'')+'>'+label+'</option>').join('')+'</select>';}
function student(){return bridge.identity().role==='student'&&bridge.ready();}
function tester(){const p=bridge.profile();return student()&&String(p?.studentId||'')==='46';}
function currentClass(){return bridge.identity().classId||'';}
async function loadUnlock(force=false){
 if(tester()){unlocked=4;return unlocked;}
 if(!student()){unlocked=0;unlockClass='';return unlocked;}
 const cid=currentClass();if(!cid){unlocked=0;return unlocked;}
 if(!force&&unlockClass===cid&&Date.now()-unlockAt<15000)return unlocked;
 unlocked=0;unlockClass=cid;unlockAt=Date.now();
 try{const r=await bridge.client().from('classes').select('id,algebra_progress').eq('id',cid).maybeSingle();if(r.error||!r.data)throw(r.error||Error('班级进度未找到'));if(currentClass()===cid)unlocked=Math.max(0,Math.min(4,Number(r.data.algebra_progress?.through||0)));}catch(e){unlocked=0;status('#algStatus','无法读取班级开放进度，暂不开始计分训练。',true);}
 return unlocked;
}
function labAllowed(index){return tester()||unlocked>=(index===2?2:1);}
function install(){
 const rules=$('#rules'),train=$('#train'),teach=$('#teacherPanelReview');if(!rules||!train||!teach)return;
 const labWrap=document.createElement('details');labWrap.className='alg-shell';labWrap.id='algLabWrap';labWrap.innerHTML='<summary><b>代数式法则实验室</b> · 同类项、合并、去括号 <span class="alg-note">（点此展开）</span></summary><div id="algLab"></div>';const stage=rules.querySelector('.lab-layout');rules.insertBefore(labWrap,stage);
 const door=document.createElement('div');door.id='algDoor';door.className='alg-shell alg-door';door.innerHTML='<div class="alg-head"><div><b>代数式运算训练 · 第3章</b><p class="alg-note">4个模块，整数／分数／常数分母，3～6题一局</p></div><button type="button" id="algOpen" class="alg-action">进入代数式运算 →</button></div>';train.insertBefore(door,train.firstChild);
 const game=document.createElement('div');game.id='algPanel';game.className='alg-shell alg-hidden';train.insertBefore(game,door.nextSibling);
 const teacher=document.createElement('div');teacher.className='alg-teacher';teacher.id='algTeacher';teacher.innerHTML='<h3>代数式运算 · 教师开放进度</h3><p class="alg-note">默认锁定。开放至选定模块时，此前模块一并开放。测试号46可预览所有模块。</p><div class="alg-row"><label>开放至 '+selectHtml('algTeacherThrough',[[0,'暂不开放'],[1,'合并同类项'],[2,'去括号化简'],[3,'整式加减'],[4,'代数式综合']],0)+'</label><button id="algTeacherSave" class="alg-action">保存开放进度</button><button id="algTeacherReload" class="alg-secondary">刷新</button></div><div id="algTeacherStatus" class="alg-status"></div>';teach.appendChild(teacher);
 $('#algOpen').onclick=async()=>{if(!student()){bridge.go('account');return;}await loadUnlock(true);$('#algDoor').classList.add('alg-hidden');$('#setupView').classList.add('hidden');$('#studentView').classList.add('hidden');$('#gameView').classList.add('hidden');$('#resultView').classList.add('hidden');$('#algPanel').classList.remove('alg-hidden');renderConfig();};
 labWrap.addEventListener('toggle',async()=>{if(labWrap.open){await loadUnlock(true);renderLab();}});
 $('#algTeacherSave').onclick=saveTeacher;$('#algTeacherReload').onclick=loadTeacher;
 $$('.teacher-tab').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.teacherTab==='review')setTimeout(loadTeacher,0);}));
 $('#teacherClassSelect')?.addEventListener('change',()=>setTimeout(loadTeacher,0));
}
function restore(){run=null;$('#algPanel').classList.add('alg-hidden');$('#algDoor').classList.remove('alg-hidden');$('#setupView').classList.remove('hidden');}
function renderConfig(){
 const panel=$('#algPanel');
 panel.innerHTML='<div class="alg-head"><div><h3>代数式 · 核心计算</h3><p class="alg-note">教材第3章3.3；独立答题，不强制分步点击。</p></div><button id="algBack" class="alg-secondary">返回有理数训练</button></div><div class="alg-row"><label>运算模块 '+selectHtml('algModule',Object.entries(E.MODULES).map(([k,v])=>[k,v.label]),conf.module)+'</label><label>难度 '+selectHtml('algDifficulty',[['easy','轻松'],['normal','标准'],['hard','挑战']],conf.difficulty)+'</label><label>系数 '+selectHtml('algCoeff',[['integer','整数'],['fraction','含分数'],['denominator','常数分母']],conf.coefficient)+'</label><label>每局题量 '+selectHtml('algCount',[[3,'3题'],[4,'4题'],[5,'5题'],[6,'6题']],conf.count)+'</label></div><p id="algConfigNote" class="alg-note"></p><div class="alg-row"><button id="algStart" class="alg-action">启动计算训练</button><div id="algStatus" class="alg-status"></div></div>';
 $('#algBack').onclick=restore;['algModule','algDifficulty','algCoeff','algCount'].forEach(id=>{$('#'+id).onchange=()=>{conf={module:$('#algModule').value,difficulty:$('#algDifficulty').value,coefficient:$('#algCoeff').value,count:Number($('#algCount').value)};if(conf.coefficient==='denominator'&&!['b3','b4'].includes(conf.module))conf.coefficient='integer';renderConfig();};});
 $('#algStart').onclick=start;
 if(conf.coefficient==='denominator'&&!['b3','b4'].includes(conf.module)){conf.coefficient='integer';return renderConfig();}
 const level=E.MODULES[conf.module].level,allowed=unlocked>=level||tester();
 $('#algStart').disabled=!allowed;
 const pts=E.fullPoints(conf.module,conf.difficulty,conf.coefficient,conf.count);
 status('#algConfigNote','预计满分 '+pts+' R（'+conf.count+'题首次全部正确）；错题订正得半分。'+(allowed?'':' 教师尚未开放本模块。'));
 if(conf.coefficient==='denominator')status('#algStatus','常数分母训练仅在整式加减和综合模块开放。');
 else status('#algStatus',tester()?'测试号46：全部模块可供测试。':allowed?'已开放，可以开始训练。':'本模块尚未开放。',!allowed);
}
async function start(){
 if(waiting||!student())return;waiting=true;try{const level=await loadUnlock(true);if(level<E.MODULES[conf.module].level&&!tester()){renderConfig();return;}
 let questions=[];for(let i=0;i<conf.count;i++){let q=null;for(let attempt=0;attempt<15;attempt++){try{q=E.generate(conf);break;}catch(e){if(attempt===14)throw e;}}questions.push(q);}
 run={config:{...conf},questions,index:0,first:0,retry:0,attempts:0,answered:false,started:Date.now(),times:[],mistakes:[],totalHint:0};
 renderQuestion();
 }catch(e){status('#algStatus','生成题目失败：'+str(e.message),true);}finally{waiting=false;}
}
function renderQuestion(){
 if(!run)return;const q=run.questions[run.index],n=run.questions.length;
 $('#algPanel').innerHTML='<div class="alg-head"><b>'+esc(names[run.config.module])+' · '+(run.config.difficulty==='hard'?'挑战':run.config.difficulty==='easy'?'轻松':'标准')+'</b><button id="algExit" class="alg-secondary">退出训练（本局不计分）</button></div><div class="alg-progress"><i style="width:'+Math.round(run.index/n*100)+'%"></i></div><p class="alg-note">第 '+(run.index+1)+' / '+n+' 题 · 请化简为最简整式</p><div class="alg-math">'+showMath(q.expression)+'</div><div class="alg-row"><label>结果 <input id="algAnswer" autocomplete="off" spellcheck="false" autocapitalize="none" placeholder="例如 2x^2-3xy+1" /></label><button id="algSubmit" class="alg-action">确认答案</button></div><p class="alg-kbd">使用 x^2 表示平方、xy 表示乘积；分数系数用 1/2x 输入。项的顺序可不同。</p><div id="algFeedback" class="alg-status" aria-live="polite"></div><div class="alg-row"><button id="algReveal" class="alg-secondary">显示答案（本题不计分）</button><button id="algNext" class="alg-action alg-hidden">下一题 →</button></div>';
 $('#algExit').onclick=()=>{if(confirm('退出将放弃本局积分，确定退出吗？'))restore();};
 $('#algSubmit').onclick=submit;$('#algReveal').onclick=reveal;$('#algNext').onclick=next;
 $('#algAnswer').onkeydown=e=>{if(e.key==='Enter'&&!run.answered)submit();};
 $('#algAnswer').focus();
}
function lockAnswer(){run.answered=true;$('#algSubmit').disabled=true;$('#algReveal').disabled=true;$('#algAnswer').disabled=true;$('#algNext').classList.remove('alg-hidden');}
function submit(){
 if(!run||run.answered)return;const input=$('#algAnswer').value.trim();if(!input){status('#algFeedback','请输入化简结果。',true);return;}
 try{E.parse(input);}catch(e){status('#algFeedback',e.message||'输入格式有误',true);return;}
 const q=run.questions[run.index],v=E.check(input,q.answer);
 if(v.correct){if(run.attempts===0)run.first++;else run.retry++;run.times.push((Date.now()-run.started)/1000);lockAnswer();status('#algFeedback','✓ 正确！'+(run.attempts===0?'首次答对':'订正完成'));}
 else{run.attempts++;run.mistakes.push({module:q.module,structure:q.meta,answer:input,equivalent:v.equivalent,reason:v.reason});if(run.attempts>=2){run.times.push((Date.now()-run.started)/1000);lockAnswer();status('#algFeedback','本题正确结果：'+q.answer+'。建议检查符号与系数。',true);}else status('#algFeedback',v.equivalent?'表达式等值，但请合并成最简整式后再提交。':'暂不正确。检查括号前的符号、字母指数和同类项系数，还可以再试一次。',true);}
}
function reveal(){if(!run||run.answered)return;const q=run.questions[run.index];run.totalHint++;run.times.push((Date.now()-run.started)/1000);lockAnswer();status('#algFeedback','参考答案：'+q.answer+'；本题不计分。');}
function next(){if(!run||!run.answered)return;run.index++;run.attempts=0;run.answered=false;run.started=Date.now();if(run.index>=run.questions.length)finish();else renderQuestion();}
async function finish(){
 if(!run)return;const done=run;run=null;
 const n=done.questions.length,accuracy=Math.round(done.first/n*100);
 const max=E.fullPoints(done.config.module,done.config.difficulty,done.config.coefficient,n);
 const attempted=Math.floor(max*(done.first+0.5*done.retry)/n);
 let award={gain:0,xp:0,reason:'结果未保存'};
 try{award=bridge.complete({config:done.config,questions:n,first:done.first,retry:done.retry,accuracy,max,requested:attempted,mistakes:done.mistakes,avgTime:done.times.reduce((a,b)=>a+b,0)/Math.max(1,done.times.length),hints:done.totalHint});}
 catch(e){award.reason='积分结算失败：'+str(e.message);}
 $('#algPanel').innerHTML='<h3>代数式训练完成</h3><div class="alg-tiles"><div class="alg-chip"><b>'+accuracy+'%</b><p class="alg-note">首次正确率</p></div><div class="alg-chip"><b>'+done.first+' / '+n+'</b><p class="alg-note">首次正确</p></div><div class="alg-chip"><b>+'+(award.gain||0)+' R</b><p class="alg-note">本局积分</p></div><div class="alg-chip"><b>+'+(award.xp||0)+' XP</b><p class="alg-note">成长经验</p></div></div><div class="alg-status">'+esc(award.reason||'')+'</div><p class="alg-note">错题已按模块、字母种类、次数和括号结构保存到训练记录。</p><div class="alg-row"><button id="algAgain" class="alg-action">再练一局</button><button id="algGoBack" class="alg-secondary">返回训练设置</button></div>';
 $('#algAgain').onclick=start;$('#algGoBack').onclick=renderConfig;
 try{await bridge.sync();}catch(e){}
}
function renderLab(){
 const root=$('#algLab');if(!root)return;
 root.innerHTML='<p class="alg-note">按教材顺序解锁。点击操作，先观察字母和指数，再研究系数与符号。</p><div class="alg-row">'+labNames.map((t,i)=>'<button class="'+(i===lab?'alg-action':'alg-secondary')+'" data-alg-lab="'+i+'" '+(!labAllowed(i)?'disabled':'')+'>'+t+(!labAllowed(i)?' · 未开放':'')+'</button>').join('')+'</div><div id="algLabBody"></div>';
 root.querySelectorAll('[data-alg-lab]').forEach(b=>b.onclick=()=>{lab=Number(b.dataset.algLab);labStep=0;selected=[];renderLab();});
 if(!labAllowed(lab)){status('#algLabBody','老师尚未开放此项演示。');return;}
 const body=$('#algLabBody');
 if(lab===0){if(!lesson)lesson='4x^2y';
 const opts=['-7x^2y','2xy^2','5yx^2','-x^2y','3xy'];body.innerHTML='<p><b>选出与 '+showMath(lesson)+' 同类的所有项</b></p><div class="alg-tiles">'+opts.map((x,i)=>'<button class="alg-chip'+(selected.includes(i)?' selected':'')+'" data-pick="'+i+'">'+showMath(x)+'</button>').join('')+'</div><div class="alg-row"><button id="algLabCheck" class="alg-action">检查分类</button><button id="algLabReset" class="alg-secondary">重新选择</button></div><div id="algLabResult" class="alg-status"></div>';
 body.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.pick);selected=selected.includes(i)?selected.filter(x=>x!==i):[...selected,i];b.classList.toggle('selected',selected.includes(i));});
 $('#algLabReset').onclick=()=>{selected=[];renderLab();};
 $('#algLabCheck').onclick=()=>status('#algLabResult',selected.length===3&&[0,2,3].every(x=>selected.includes(x))?'✓ 分类正确。字母顺序不同不影响同类项，指数必须分别相同。':'还没全部正确：请比较每个字母的指数，而不是只比较总次数。');
 }else if(lab===1){const items=['4a^2','-4a^2','3b^2','-2b^2','2ab','-b^2'];
 body.innerHTML='<p><b>选出所有 a^2 项，然后算出它们的系数和。</b></p><div class="alg-tiles">'+items.map((v,i)=>'<button class="alg-chip'+(selected.includes(i)?' selected':'')+'" data-pick="'+i+'">'+showMath(v)+'</button>').join('')+'</div><div class="alg-row"><label>合并后的系数 <input id="algLabInput" placeholder="例如 0"/></label><button id="algLabCheck" class="alg-action">检查</button><button id="algLabReset" class="alg-secondary">重置</button></div><div id="algLabResult" class="alg-status"></div>';
 body.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.pick);selected=selected.includes(i)?selected.filter(x=>x!==i):[...selected,i];b.classList.toggle('selected',selected.includes(i));});
 $('#algLabReset').onclick=()=>{selected=[];renderLab();};
 $('#algLabCheck').onclick=()=>status('#algLabResult',selected.length===2&&selected.includes(0)&&selected.includes(1)&&$('#algLabInput').value.trim()==='0'?'✓ 对！4＋(−4)＝0，这一组全部抵消。':'请选出4a²和−4a²，并算出系数和。');
 }else{
 body.innerHTML='<p><b>展开 6m − 3(−m + 2n)</b></p><div class="alg-tiles">'+[['6m+3m-6n','right'],['6m-3m+6n','wrong'],['6m+3m+6n','wrong']].map(([v,k],i)=>'<button class="alg-chip" data-choice="'+k+'">'+showMath(v)+'</button>').join('')+'</div><div id="algLabResult" class="alg-status"></div><div id="algLabFinal" class="alg-hidden"><p>第二步：合并同类项</p><div class="alg-row"><label>最终结果 <input id="algLabFinalInput" placeholder="例如 9m-6n"/></label><button class="alg-action" id="algLabFinalCheck">检查</button></div><div id="algLabFinalStatus" class="alg-status"></div></div>';
 body.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{if(b.dataset.choice==='right'){status('#algLabResult','✓ 去括号正确。−3须分别乘 −m 和 2n。');$('#algLabFinal').classList.remove('alg-hidden');}else status('#algLabResult','检查 −3 对括号里每一项的分配与符号。',true);});
 $('#algLabFinalCheck').onclick=()=>{const chk=E.check($('#algLabFinalInput').value,'9m-6n');status('#algLabFinalStatus',chk.correct?'✓ 正确，实验完成。':'请把6m和3m合并；−6n保留。',!chk.correct);};
 }
}
async function loadTeacher(){
 const id=$('#teacherClassSelect')?.value||'',box=$('#algTeacherThrough');if(!id||bridge.identity().role!=='teacher'){status('#algTeacherStatus','请先进入教师端并选择班级。');return;}
 try{const r=await bridge.client().from('classes').select('id,algebra_progress').eq('id',id).maybeSingle();if(r.error)throw r.error;if(!r.data)throw Error('班级不存在');teacherLevel=Math.max(0,Math.min(4,Number(r.data.algebra_progress?.through||0)));box.value=String(teacherLevel);status('#algTeacherStatus','已读取本班进度：'+(teacherLevel?names['b'+teacherLevel]:'暂不开放'));}
 catch(e){status('#algTeacherStatus','读取失败：'+str(e.message),true);}
}
async function saveTeacher(){
 const id=$('#teacherClassSelect')?.value||'',wanted=Number($('#algTeacherThrough').value);if(!id||bridge.identity().role!=='teacher'||!Number.isInteger(wanted)||wanted<0||wanted>4){status('#algTeacherStatus','需要教师身份和有效的班级。',true);return;}
 $('#algTeacherSave').disabled=true;
 try{const r=await bridge.client().from('classes').update({algebra_progress:{through:wanted,updated_at:new Date().toISOString()}}).eq('id',id).select('algebra_progress').maybeSingle();if(r.error)throw r.error;if(!r.data)throw Error('保存失败或无修改权限');teacherLevel=wanted;unlockClass='';status('#algTeacherStatus','✓ 已保存：'+(wanted?names['b'+wanted]+'及此前模块':'全部暂不开放'));}
 catch(e){status('#algTeacherStatus','保存失败：'+str(e.message),true);}finally{$('#algTeacherSave').disabled=false;}
}
install();
window.AlgebraUI={loadUnlock,renderConfig,renderLab,loadTeacher,restore};
})();
