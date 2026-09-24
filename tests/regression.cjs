const assert=require('node:assert/strict');
const fs=require('node:fs'), vm=require('node:vm');
const {JSDOM}=require('jsdom');
const root=process.env.SITE_DIR||'_site';
const html=fs.readFileSync(root+'/index.html','utf8');
const failures=[],writes=[];let failTable='';
const fixture={};
const client={auth:{onAuthStateChange(){},getSession:async()=>({data:{session:null}}),signOut:async()=>({error:null})},from(table){let data=[];const q={select(){data=fixture[table]||[];return q},eq(){return q},in(){return q},gte(){return q},order(){return q},maybeSingle:async()=>({data:data[0]||null}),update(row){fixture[table]=(fixture[table]||[]).map(x=>({...x,...row}));return q},upsert(row){q.row=row;return q},throwOnError:async()=>{if(failTable===table)throw Error('simulated rejected write');writes.push({table,row:structuredClone(q.row)});return {error:null}},then(resolve){return Promise.resolve({data,error:null}).then(resolve)}};return q}};
const dom=new JSDOM(html,{url:'https://test.invalid/',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;
w.structuredClone=structuredClone;w.supabase={createClient:()=>client};w.scrollTo=()=>{};w.Element.prototype.animate=()=>({});w.alert=()=>{};w.confirm=()=>true;w.console.warn=()=>{};
for(const script of w.document.scripts){if(script.src&&!/(review-(engine|ui)|daily|question-(content|import|bank))\.js$/.test(new URL(script.src).pathname))continue;let code=script.src?fs.readFileSync(root+'/'+new URL(script.src).pathname.split('/').pop(),'utf8'):script.textContent;new vm.Script(code);code=code.replace('    migrateLegacy();const initP=',`    window.__test={levelInfo,honorInfoFromProfile,cloudLevelBase,blankProfile,saveCurrentProfile,currentProfile,currentProfileKey,cloudState,cloudSyncProfile,renderGrowth,renderStats,go,openStudentGate,loadTeacherDashboard,teacherSwitchTab,rosterNameMap,loadStudentClassWall,peerState,ensureTodayRecord,calcQuestionXP,recordGameClear,gameSignatureArithmetic,state,renderConfig,avatarSrcByLevel,peerAvatarSrc,refreshPlayerUI,CHECKIN_OUTFITS,cloudLoadStudentData};\n    migrateLegacy();const initP=`);w.eval(code)}
const t=w.__test;assert.ok(t,'main closure reaches initialization');
function student(){t.cloudState.user={id:'fixture-student'};t.cloudState.role='student';t.cloudState.mustChangePassword=false;t.saveCurrentProfile(t.blankProfile('TEST','1',''));}
function xpAt(lv){let n=0;for(let i=1;i<lv;i++)n+=260+(i-1)*85;return n;}
(async()=>{
 student();
 for(let lv=1;lv<=90;lv++){const p=t.currentProfile();p.xp=xpAt(lv);t.saveCurrentProfile(p);t.renderGrowth();const h=t.honorInfoFromProfile(p);assert.equal(h.currentBase,Math.floor((lv-1)/9)+1);assert.equal(h.phase,(lv-1)%9+1);assert.equal(t.cloudLevelBase(p).base,h.currentBase);assert.equal(w.document.querySelectorAll('#baseStageGallery article').length,9);assert.equal(w.document.querySelectorAll('#baseCompleteGallery article').length,Math.min(3,Math.floor(lv/9)));assert.equal(w.document.querySelector('#growthLevel').textContent,String(h.phase));assert.ok(!/BASE\s*0\b/.test(w.document.body.textContent));}
 assert.equal(t.levelInfo(259).level,1);assert.equal(t.levelInfo(260).level,2);assert.equal(t.levelInfo(xpAt(90)+999999).level,90);
 for(const [id,target] of [['homeGrowthBtn','growth'],['homeStatsBtn','stats'],['playerBtn','account'],['growthSwitchBtn','account'],['statsSwitchBtn','account']]){t.go('home');w.document.getElementById(id).click();assert.ok(w.document.getElementById(target).classList.contains('active'),id+' click routes to '+target);}
 console.log('PASS 90 levels, BASE boundaries, retained completed collections and slow XP');
 student();const pending=t.currentProfile();pending.xp=2753;pending.economy.credits=219;t.saveCurrentProfile(pending);
 fixture.profiles=[{xp:5400,level:10,base_level:2,migrated_from_local:true}];
 fixture.progress_snapshots=[{game_stats:{games:1},economy:{lifetimeCredits:219}}];
 await t.cloudLoadStudentData('TEST','1');
 assert.equal(t.currentProfile().xp,5400,'pending local profile adopts newer cloud XP');
 assert.equal(t.currentProfile().economy.credits,219,'pending wallet retained');
 assert.equal(w.document.querySelector('#playerBtn img').getAttribute('src'),'assets/base2-1.png?v=20260925');
 assert.equal(writes.filter(x=>x.table==='profiles').at(-1).row.xp,5400,'upload cannot undo cloud grant');
 delete fixture.profiles;delete fixture.progress_snapshots;
 console.log('PASS pending login preserves cloud XP grant, local work and BASE2 avatar');
 student();

 for(let level=10;level<=27;level++){
  student();const p=t.currentProfile();p.xp=xpAt(level);p.equip={hat:'old-hat'};t.saveCurrentProfile(p);t.renderGrowth();t.refreshPlayerUI();
  const source='assets/base'+(Math.floor((level-1)/9)+1)+'-'+((level-1)%9+1)+'.png?v=20260925';
  for(const selector of ['#growthRobot','#heroRobot','#playerBtn img','#checkinAvatarPreview'])assert.equal(w.document.querySelector(selector).getAttribute('src'),source,selector+' level '+level);
  assert.equal(t.peerAvatarSrc({level}),source);
  assert.equal(t.avatarSrcByLevel(level,true,null,true),source);
 }
 student();const avatarP=t.currentProfile();avatarP.xp=xpAt(12);avatarP.economy.checkin.equippedOutfit=t.CHECKIN_OUTFITS[0].id;t.saveCurrentProfile(avatarP);t.renderGrowth();t.refreshPlayerUI();
 assert.equal(w.document.querySelector('#playerBtn img').getAttribute('src'),t.CHECKIN_OUTFITS[0].src,'explicit outfit remains selected');
 w.document.querySelector('#followBaseAvatar').click();
 assert.equal(w.document.querySelector('#playerBtn img').getAttribute('src'),'assets/base2-3.png?v=20260925');
 assert.equal(t.currentProfile().economy.checkin.equippedOutfit,'base');
 console.log('PASS all 18 BASE2/3 avatar stages across growth, header, hero, checkin and peers; custom outfit retained and follow-BASE button works');
 student();

 student();let scoreProfile=t.currentProfile();
 for(const [brackets,expected] of [['auto',2],['1',2],['2',0],['3',0],['0',0]]){
  const result=t.recordGameClear(scoreProfile,'arithmetic','power|integer|easy|'+brackets,false,'easy','power','integer');
  assert.equal(result.gain,expected,'bracket-only change cannot restart rewards');
 }
 student();scoreProfile=t.currentProfile();
 t.ensureTodayRecord(scoreProfile).runs.arithmetic={'power|integer|easy|auto':1,'power|integer|easy|2':1};
 assert.equal(t.recordGameClear(scoreProfile,'arithmetic','power|integer|easy|3',false,'easy','power','integer').gain,0,'legacy counts merge');
 assert.equal(t.recordGameClear(scoreProfile,'arithmetic','power|intfrac|easy|3',false,'easy','power','intfrac').gain,4,'real number-type change counts separately');
 for(const numberType of ['integer','intfrac','intdec','fracdec']){
  t.state.config={stage:'power',numberType,difficulty:'easy',brackets:'3'};t.renderConfig();
  assert.equal(t.state.config.numberType,numberType);
  assert.equal(w.document.querySelectorAll('#numberOptions button:disabled').length,0);
  t.openStudentGate();
  const kinds=new Set(t.state.questions.map(q=>q.operands[0].baseOperand?.kind||'integer'));
  for(const kind of w.RationalEngine.NUMBER_TYPES[numberType].kinds)assert(kinds.has(kind));
  for(let i=0;i<100;i++){
   const q=w.RationalEngine.generateQuestion({stage:'power',numberType,difficulty:'hard'});
   const o=q.operands[0],b=o.baseOperand;
   if(b){assert(q.answer.eq(new w.RationalEngine.Fraction(b.value.n**o.exponent,b.value.d**o.exponent)));assert(w.RationalEngine.checkAnswer(q.answer.n+'/'+q.answer.d,q.answer));}
   if(b?.kind==='decimal'){assert(Math.abs(o.base)<10);assert.match(b.display,/^[−]?[0-9][.][0-9]$/);}
   if(b?.kind==='fraction')assert.match(q.html,/class="frac"/);
   assert.equal(q.numberType,numberType);
  }
 }
 console.log('PASS bracket reward bypass, legacy aggregation, enabled numeric types, full rounds with fractions/decimals and exact rational powers');
 for(const [difficulty,expected] of [['easy',[10,0,0]],['normal',[8,2,0]],['hard',[6,2,2]]]){
  for(let repeat=0;repeat<12;repeat++){
   t.state.config={stage:'power',numberType:'integer',difficulty,brackets:'auto'};t.renderConfig();t.openStudentGate();
   const counts=['integer','decimal','fraction'].map(kind=>t.state.questions.filter(q=>(q.operands[0].baseOperand?.kind||'integer')===kind).length);
   assert.deepEqual(counts,expected,'difficulty round quotas');
  }
 }
 const oldRandom=w.Math.random;let seed=75231;
 w.Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 let special=0;
 try{for(let i=0;i<10000;i++){const p=w.RationalEngine.makePowerSpec();if(Math.abs(p.base)<=1)special++;assert.equal(p.result,p.base**p.exponent);}}finally{w.Math.random=oldRandom;}
 assert(special>200&&special<400,'0 and ±1 together stay near 3%, got '+special);
 console.log('PASS progressive power round quotas 10/0/0, 8/2/0, 6/2/2; seeded special-base rate '+special+'/10000');

 student();

 for(const [mistakes,gain] of [[0,8],[1,4],[2,0]]){student();const payload={profileKey:t.currentProfileKey(),runId:'run-'+mistakes,mode:'solo',abMistakes:mistakes,totalOps:20,totalFails:2,roundCount:3,grade:'A · 推理很稳',durationSeconds:120};const r=w.ratiobotAwardRingsV53(payload);const p=t.currentProfile();assert.equal(r.gain,gain);assert.equal(p.economy.credits,gain);assert.equal(p.history.length,1);assert.equal(p.history[0].rGain,gain);assert.equal(p.history[0].accuracy,90);assert.equal(p.history[0].durationSeconds,120);assert.equal(p.history[0].abMistakes,mistakes);assert.match(w.document.querySelector('#historyList').textContent,/数圈侦探 · 分类推理/);assert.match(w.document.querySelector('#historyList').textContent,/120 s/);assert.equal(w.ratiobotAwardRingsV53(payload).gain,gain);assert.equal(t.currentProfile().history.length,1);await t.cloudSyncProfile();const pr=writes.filter(x=>x.table==='profiles').at(-1).row,snap=writes.filter(x=>x.table==='progress_snapshots').at(-1).row;assert.equal(pr.r_points,gain);assert.equal(Object.hasOwn(pr,'display_name'),false,'progress sync must not overwrite corrected roster names');assert.equal(snap.economy.credits,gain);assert.equal(snap.game_stats.history[0].rGain,gain);assert.equal(t.currentProfile().pendingCloud,false);}
 console.log('PASS 8/4/0: settlement, wallet, detailed record, snapshot payload, duplicate idempotency');
 student();failTable='progress_snapshots';w.ratiobotAwardRingsV53({profileKey:t.currentProfileKey(),runId:'failed-sync',totalOps:10,roundCount:3});assert.equal(await t.cloudSyncProfile(),false);assert.equal(t.currentProfile().pendingCloud,true);assert.equal(t.currentProfile().economy.credits,8);failTable='';assert.equal(await t.cloudSyncProfile(),true);assert.equal(t.currentProfile().pendingCloud,false);
 assert.equal(w.ratiobotAwardRingsV53({profileKey:'other-student',runId:'wrong'}).error,true);assert.equal(t.currentProfile().economy.credits,8);
 console.log('PASS cloud error remains pending, retry succeeds, changed student rejected');
 student();t.renderGrowth();assert.equal(w.document.querySelectorAll('#unifiedBadgeGrid article').length,16);assert.equal(w.document.querySelectorAll('#unifiedBadgeGrid img').length,16);
 for(const id of ['rules','train','rings']){t.go(id);assert.ok(w.document.getElementById(id).classList.contains('active'),id+' route active');}
 t.openStudentGate();assert.ok(w.document.querySelector('#studentView').classList.contains('hidden'));assert.ok(!w.document.querySelector('#gameView').classList.contains('hidden'));
 console.log('PASS 16 badge image elements, A/B/C routes, logged-in training skips password');
 t.cloudState.classId='fixture-class';
 fixture.class_public_cards=[{user_id:'peer-2',student_code:'2',display_name:'<img src=x onerror=alert(1)>',level:10,streak:3,today_checked_in:true,today_points:20,public_training:{badges:['first_round'],history:[{game:'rings',at:new Date().toISOString(),accuracy:90,rGain:4,abMistakes:1,totalOps:20,totalFails:2,durationSeconds:120,grade:'A'}]}},{user_id:'peer-1',student_code:'1',display_name:'1号',level:1,today_points:0,public_training:{history:[{game:'rings',at:new Date().toISOString(),rGain:0}]}}];
 const beforePeer=JSON.stringify(t.currentProfile());await t.loadStudentClassWall();
 assert.equal(w.document.querySelectorAll('[data-peer]').length,2);assert.equal(w.document.querySelector('[data-peer]').dataset.peer,'peer-1');
 assert.equal(w.document.querySelector('[data-peer="peer-1"]').classList.contains('training'),true);
 assert.equal(w.document.querySelectorAll('#peerGrid img[onerror]').length,0);
 w.document.querySelector('[data-peer="peer-2"]').click();assert.equal(w.document.querySelector('#peerDetail').hidden,false);assert.match(w.document.querySelector('#peerDetail').textContent,/A\/B错误 1 次/);assert.match(w.document.querySelector('#peerDetail').textContent,/120s/);assert.match(w.document.querySelector('#peerDetail').textContent,/BASE 2 · Lv.1/);assert.equal(JSON.stringify(t.currentProfile()),beforePeer);
 w.document.querySelector('#peerFilter').value='checked';w.document.querySelector('#peerFilter').onchange();assert.equal(w.document.querySelectorAll('[data-peer]').length,1);
 console.log('PASS peer wall: zero-R practice, status, badges, ordering, click details, filters, XSS escaping, own profile unchanged');
 t.cloudState.role='teacher';t.cloudState.user={id:'fixture-teacher'};fixture.class_roster=[{student_code:'1',student_name:'测试',user_id:'fixture-student'}];fixture.profiles=[{user_id:'fixture-student',r_points:8,xp:260}];fixture.progress_snapshots=[{user_id:'fixture-student',game_stats:{history:[{at:new Date().toISOString(),accuracy:90,avgTime:6}]}}];await t.loadTeacherDashboard('fixture-class');t.go('teacher');assert.match(w.document.querySelector('#teacherDataTable').textContent,/90%/);assert.match(w.document.querySelector('#teacherDataTable').textContent,/BASE 1 · Lv.2/);assert.equal(w.document.querySelectorAll('[data-reset-student]').length,1);assert.equal(t.rosterNameMap('1 张三\n2,李四',2)['2'],'李四');
 fixture.class_roster=['10','2','1'].map(student_code=>({student_code,student_name:'测试'+student_code}));await t.loadTeacherDashboard('fixture-class');
 for(const selector of ['#teacherRosterPreview .teacher-roster-item b','#teacherDataTable .teacher-data-row b','#teacherAccountsTable .teacher-account-row b'])assert.deepEqual(Array.from(w.document.querySelectorAll(selector),el=>el.textContent),['1号','2号','10号']);
 console.log('PASS teacher dashboard, roster parser and password-reset action retained (mock backend)');
 fixture.classes=[{id:'fixture-class',review_progress:{through:0,dates:{}}}];t.cloudState.classId='fixture-class';await w.reviewUI.loadTeacher('fixture-class');t.teacherSwitchTab('review');assert.ok(w.document.querySelector('#teacherPanelReview').classList.contains('active'));w.document.querySelector('#reviewThrough').value='1';w.document.querySelector('#reviewLearnedDate').value=w.KnowledgeReview.day();await w.document.querySelector('#saveReviewProgress').onclick();assert.equal(fixture.classes[0].review_progress.through,1);
 assert.equal(w.document.querySelector('#reviewLesson').value,'1','partial progress stays precise');assert.equal(w.document.querySelector('#reviewAdvanced').open,false);const oldDate=fixture.classes[0].review_progress.dates['ch2-1'];w.document.querySelector('#reviewLesson').value='13';w.document.querySelector('#reviewLesson').onchange();await w.document.querySelector('#saveReviewProgress').onclick();assert.equal(fixture.classes[0].review_progress.through,13);assert.equal(fixture.classes[0].review_progress.dates['ch2-1'],oldDate);w.document.querySelector('#reviewThrough').value='1';w.document.querySelector('#reviewThrough').onchange();await w.document.querySelector('#saveReviewProgress').onclick();
 student();t.cloudState.classId='fixture-class';t.go('knowledge');w.document.querySelector('#knowledge [data-go="rules"]').click();assert.ok(w.document.querySelector('#rules').classList.contains('active'));assert.ok(w.document.querySelector('.topbar [data-go="knowledge"]').classList.contains('active'));w.document.querySelector('#rules [data-go="review"]').click();assert.ok(w.document.querySelector('#review').classList.contains('active'));
 console.log('PASS knowledge hub branch clicks, parent navigation, simple lesson release and precise progress preservation');
 student();t.cloudState.classId='fixture-class';await w.reviewUI.open();assert.equal(w.document.querySelectorAll('#reviewPrompt input').length,2);assert.equal(w.document.querySelectorAll('#reviewNav button:not(:disabled)').length,1);
 const firstBlank=w.document.querySelector('#reviewPrompt input');assert.equal(firstBlank.getAttribute('autocapitalize'),'none');assert.equal(firstBlank.style.width,'');assert.equal(firstBlank.closest('label').style.getPropertyValue('--answer-width'),'2em');assert.equal(w.document.querySelector('#reviewSource').textContent,'教材 P13');assert.equal(w.document.querySelector('#reviewReveal').hidden,true);firstBlank.focus();w.document.querySelector('#reviewLanguage').click();assert.equal(w.document.querySelector('#reviewLetters').hidden,false);w.document.querySelector('[data-review-key="a"]').click();assert.equal(firstBlank.value,'a');w.document.querySelector('#reviewCase').click();w.document.querySelector('[data-review-key="B"]').click();assert.equal(firstBlank.value,'aB');const symbols=Array.from(w.document.querySelectorAll('#reviewSymbols button'));symbols.find(b=>b.textContent==='>').click();symbols.find(b=>b.textContent==='<').click();assert.equal(firstBlank.value,'aB><');firstBlank.setSelectionRange(0,2);w.document.querySelector('[data-review-key="C"]').click();assert.equal(firstBlank.value,'C><');w.document.querySelector('#reviewLanguage').click();assert.equal(w.document.querySelector('#reviewLetters').hidden,true);assert.equal(firstBlank.value,'C><','language switch preserves typed answer');
 await w.reviewUI.open('repair');const inputs=()=>Array.from(w.document.querySelectorAll('#reviewPrompt input'));inputs().forEach(x=>x.value='错');await w.reviewUI.submit();assert.match(w.document.querySelector('#reviewMode').textContent,/0\/5/);assert.equal(w.document.querySelector('#reviewReveal').hidden,false);assert.equal(w.document.querySelector('#reviewAnswer').hidden,true);const creditBeforeReveal=t.currentProfile().economy.credits;w.document.querySelector('#reviewReveal').click();assert.equal(w.document.querySelectorAll('#reviewAnswer li').length,2);assert.match(w.document.querySelector('#reviewAnswer').textContent,/正确答案：正数/);assert.match(w.document.querySelector('#reviewAnswer').textContent,/你的答案：错/);assert.equal(t.currentProfile().economy.credits,creditBeforeReveal);w.document.querySelector('#reviewReveal').click();assert.equal(w.document.querySelector('#reviewAnswer').hidden,true);
 console.log('PASS review input: answer-length fields and textbook pages, lowercase/uppercase keys, Chinese/English helpers, comparisons, selected replacement, safe answer reveal without rewards');

 for(let i=0;i<5;i++){w.reviewUI.next();inputs().forEach((x,j)=>x.value=j?'负数':'正数');await w.reviewUI.submit();}assert.match(w.document.querySelector('#reviewStatus').textContent,/已补签/);assert.equal(t.currentProfile().economy.credits,10);assert.equal(t.currentProfile().history[0].game,'knowledge');assert.match(w.document.querySelector('#historyList').textContent,/知识点回顾/);await w.reviewUI.submit();assert.equal(t.currentProfile().economy.credits,10);assert.ok(writes.some(x=>x.table==='daily_checkins'&&Array.isArray(x.row)&&x.row.some(d=>d.repaired)));assert.equal(writes.filter(x=>x.table==='progress_snapshots').at(-1).row.game_stats.history[0].game,'knowledge');
 w.reviewUI.next();fixture.classes[0].review_progress={through:0,dates:{}};inputs().forEach((x,j)=>x.value=j?'负数':'正数');await w.reviewUI.submit();assert.match(w.document.querySelector('#reviewStatus').textContent,/调整了学习进度/);assert.equal(t.currentProfile().economy.credits,10);
 console.log('PASS review UI: teacher release, locked directory, wrong resets, five correct repair, history/R/snapshot/repaired-date sync, duplicate submit, revoked progress');
 t.cloudState.role='teacher';t.teacherSwitchTab('bank');assert(w.document.querySelector('#teacherPanelBank').classList.contains('active'));t.go('train');assert(w.document.querySelector('#teacher').classList.contains('active'));w.document.querySelector('#teacherNavigation [data-teacher-tab="daily"]').click();assert(w.document.querySelector('#teacherPanelDaily').classList.contains('active'));console.log('PASS teacher bank entry, dedicated navigation and student-route isolation');
 student();await w.document.querySelector('#logoutBtn').onclick();assert.equal(t.currentProfile(),null);assert.equal(t.cloudState.user,null);assert.equal(w.document.querySelector('#ringsFrame').getAttribute('src'),'about:blank');
 console.log('PASS logout clears current identity and old game frame');
 w.close();
})().catch(e=>{console.error(e);w.close();process.exitCode=1});
