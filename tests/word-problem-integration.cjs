/* Account lifecycle and snapshot privacy tests for the real homepage integration. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
const root=path.resolve(process.env.SITE_DIR||'site');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const html=read('index.html');
const clone=value=>JSON.parse(JSON.stringify(value));
const opened=[];

function draft(id='G10-05',value='PRIVATE-WRITTEN-WORK',when='2026-11-16T10:00:00.000Z'){
 return {schema:1,runId:'wp-fixture-'+id,problemId:id,routeId:'main',step:2,
  values:{'t:0:0':value},passed:{0:true,1:true},firstPass:{0:true,1:true},
  seen:['fact'],derived:{},reflection:'PRIVATE-REFLECTION',customModel:'',discussion:'',
  startedAt:when,updatedAt:when};
}
function progress(id,value,when){const d=draft(id,value,when);return {version:1,records:[],drafts:{[d.problemId]:d}};}
function recordState(id='G10-05',value='PRIVATE-TEACHER-ANSWER'){
 const d=draft(id,value);
 return {version:1,drafts:{[id]:d},records:[{...d,finished:true,title:'应用题记录',routeLabel:'原设元',source:'测试来源',status:'independent',at:d.updatedAt,valueLabels:{'t:0:0':'表中数量'}}]};
}

function fixture(){
 const records={},writes=[],queries=[],events=[];
 const client={
  auth:{onAuthStateChange(){},getSession:async()=>({data:{session:null}}),signOut:async()=>{events.push('sign-out');return {error:null};}},
  from(table){
   let rows=[],write;
   const q={
    select(columns){queries.push({table,columns});rows=records[table]||[];return q;},
    eq(){return q;},in(){return q;},gte(){return q;},order(){return q;},
    maybeSingle:async()=>({data:clone(rows[0]||null),error:null}),
    update(row){write=row;return q;},upsert(row){write=row;return q;},
    async throwOnError(){writes.push({table,row:clone(write)});events.push('write:'+table);return {error:null};},
    then(resolve,reject){return Promise.resolve({data:clone(rows),error:null}).then(resolve,reject);},
   };return q;
  },
 };
 const dom=new JSDOM(html,{url:'https://test.invalid/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;opened.push(dom);
 w.structuredClone=structuredClone;w.supabase={createClient:()=>client};w.scrollTo=()=>{};
 w.HTMLElement.prototype.scrollIntoView=function(){};
 w.Element.prototype.animate=()=>({});w.alert=()=>{};w.confirm=()=>true;w.console.warn=()=>{};
 w.requestIdleCallback=cb=>{cb({didTimeout:false,timeRemaining:()=>50});return 1;};w.cancelIdleCallback=()=>{};
 const external=new Set(['review-engine.js','review-ui.js','daily.js','autumn-break.js','question-content.js','question-import.js','question-bank.js','word-problems/progress.js','word-problems-entry.js']);
 for(const script of w.document.scripts){
  const name=script.src?new URL(script.src).pathname.slice(1):'';
  if(script.src&&!external.has(name))continue;
  let source=script.src?read(name):script.textContent;
  source=source.replace('    migrateLegacy();const initP=',`    window.__wordProblemIntegration={cloudSnapshotFromProfile,cloudApplySnapshot,wordProblemSnapshotState,wordProblemHasProgress,profileHasProgress,cloudLoadStudentData,cloudSyncProfile,blankProfile,ensureProfileShape,currentProfile,currentProfileKey,saveMigratedLocalProfile,loadDB,saveDB,cloudState,state,teacherLogout,renderEmptyTeacherConsole,loadTeacherDashboard};\n    migrateLegacy();const initP=`);
  new vm.Script(source);w.eval(source);
 }
 const t=w.__wordProblemIntegration;assert(t,'main closure reaches integration hooks');
 function student(id='student-a',cls='WPA',number='1'){
  Object.assign(t.cloudState,{user:{id},role:'student',classId:'class-a',mustChangePassword:false});
  const p=t.ensureProfileShape(t.blankProfile(cls,number,''));t.saveMigratedLocalProfile(p);return p;
 }
 async function loadModule(){
  w.katex={renderToString:s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))};
  for(const file of ['engine.js','data-l7-l8.js','data-l9-review.js','data-textbook-intro.js','data-textbook-applications.js','data-textbook-review.js','textbook-index.js','supplement-index.js','reading.js','relations.js','relation-builder.js','diagrams.js','app.js'])w.eval(read('word-problems/'+file));
  const append=w.document.head.append.bind(w.document.head);
  w.document.head.append=(...nodes)=>{append(...nodes);for(const node of nodes){const url=node.src||node.href||'';if(url.includes('/word-problems/'))queueMicrotask(()=>node.onload?.());}};
  await w.RatioWordProblemsUI.open();
 }
 return {dom,w,t,records,writes,queries,events,student,loadModule};
}

(async()=>{
 const f=fixture(),{w,t}=f;
 await Promise.resolve();
 const p=t.ensureProfileShape(t.blankProfile('WPA','1',''));
 p.economy.modules.wordProblems=recordState();p.economy.modules.otherPractice={clears:3};
 p.history=[{game:'wordProblems',stage:'应用题分析',accuracy:100}];
 const before=JSON.stringify(p),snapshot=t.cloudSnapshotFromProfile(p);
 assert.equal(JSON.stringify(p),before,'export must not mutate the original local profile');
 assert.equal(snapshot.economy.modules.wordProblems,undefined,'written work is excluded from the publicly projected modules');
 assert.equal(snapshot.economy.modules.otherPractice.clears,3,'unrelated modules remain available');
 assert.equal(snapshot.growth_state.wordProblems.records[0].values['t:0:0'],'PRIVATE-TEACHER-ANSWER','full records remain in private growth snapshot');
 assert.equal(snapshot.growth_state.wordProblems.drafts['G10-05'].reflection,'PRIVATE-REFLECTION','full drafts remain private');
 const publicProjection={modules:snapshot.economy.modules,history:snapshot.game_stats.history};
 assert(!JSON.stringify(publicProjection).includes('PRIVATE-'),'existing public summary projection cannot receive private written work');
 snapshot.growth_state.wordProblems.drafts['G10-05'].values['t:0:0']='changed-export';
 assert.equal(p.economy.modules.wordProblems.drafts['G10-05'].values['t:0:0'],'PRIVATE-TEACHER-ANSWER','exported objects do not alias local draft objects');
 console.log('PASS private snapshot export, unchanged local state, and existing peer-summary projection');

 const local=t.ensureProfileShape(t.blankProfile('WPA','1',''));
 local.economy.modules.wordProblems=progress('L7-P1','local-answer');
 const incoming={game_stats:{},economy:{modules:{wordProblems:progress('G9-01','legacy-answer')}},growth_state:{wordProblems:progress('G10-05','private-answer')}};
 const remoteBefore=JSON.stringify(incoming);
 const restored=t.cloudApplySnapshot(local,{xp:0},incoming);
 assert.deepEqual(Object.keys(restored.economy.modules.wordProblems.drafts).sort(),['G10-05','G9-01','L7-P1'],'local, legacy, and private cloud paths merge without loss');
 assert.equal(JSON.stringify(incoming),remoteBefore,'restoring does not mutate or repopulate the incoming public economy');
 assert(t.profileHasProgress(restored),'draft-only local work is progress');
 assert(t.wordProblemHasProgress({records:recordState().records,drafts:{}}),'record-only module work is progress');
 const upgraded=t.cloudSnapshotFromProfile(restored);
 assert.equal(upgraded.economy.modules.wordProblems,undefined,'legacy compatibility never writes full records back to public modules');
 assert.equal(Object.keys(upgraded.growth_state.wordProblems.drafts).length,3);
 console.log('PASS local/private/legacy merge and one-way migration to private writes');

 for(const legacy of [false,true]){
  const x=fixture();await Promise.resolve();
  Object.assign(x.t.cloudState,{user:{id:'draft-only-student'},role:'student',classId:'class-a',mustChangePassword:false});
  const wp=progress('G10-05',legacy?'legacy-draft-only':'private-draft-only');
  x.records.profiles=[{user_id:'draft-only-student',xp:0,migrated_from_local:true}];
  x.records.progress_snapshots=[{user_id:'draft-only-student',game_stats:{games:0},economy:legacy?{modules:{wordProblems:wp}}:{},growth_state:legacy?{}:{wordProblems:wp}}];
  await x.t.cloudLoadStudentData('WPB','2');
  assert.equal(x.t.currentProfile().economy.modules.wordProblems.drafts['G10-05'].values['t:0:0'],legacy?'legacy-draft-only':'private-draft-only','a clean browser restores draft-only cloud progress');
  assert.equal(x.writes.length,0,'draft-only cloud snapshot must not be overwritten by a blank profile');
  await x.t.cloudSyncProfile(x.t.currentProfile(),true);
  const uploaded=x.writes.find(v=>v.table==='progress_snapshots').row;
  assert.equal(uploaded.economy.modules.wordProblems,undefined,'restored work syncs only to the private field');
  assert(uploaded.growth_state.wordProblems.drafts['G10-05']);
  x.dom.window.close();
 }
 console.log('PASS draft-only cloud recovery on a clean browser, including legacy reads');

 const pending=fixture();await Promise.resolve();
 const pp=pending.student('pending-student','WPC','3');
 pp.economy.modules.wordProblems=progress('L7-P1','new-local-work');pp.pendingCloud=true;pending.t.saveMigratedLocalProfile(pp);
 pending.records.profiles=[{xp:0,migrated_from_local:true}];
 pending.records.progress_snapshots=[{economy:{},game_stats:{games:0},growth_state:{wordProblems:progress('G10-05','earlier-cloud-work')}}];
 await pending.t.cloudLoadStudentData('WPC','3');
 const pendingUpload=pending.writes.filter(v=>v.table==='progress_snapshots').at(-1).row;
 assert.deepEqual(Object.keys(pendingUpload.growth_state.wordProblems.drafts).sort(),['G10-05','L7-P1'],'pending local work merges earlier private cloud drafts before upload');
 assert.equal(pendingUpload.economy.modules.wordProblems,undefined);
 pending.dom.window.close();
 console.log('PASS pending local/cloud merge retains both drafts before private upload');

 const logout=fixture();await Promise.resolve();logout.student();await logout.loadModule();
 const host=logout.w.document.getElementById('wordProblems');
 host.querySelector('[data-wp-problem="L7-P1"]').click();
 const readingProblem=logout.w.RatioWordProblemsData.find(p=>p.id==='L7-P1');
 for(const [key,value]of Object.entries(logout.w.RatioWordProblemReading.canonical(readingProblem))){const input=host.querySelector('[data-wp-fact="'+key+'"]');input.value=value;input.dispatchEvent(new logout.w.Event('input',{bubbles:true}));}
 for(const box of host.querySelectorAll('[data-wp-seen]')){box.checked=true;box.dispatchEvent(new logout.w.Event('change',{bubbles:true}));}
 host.querySelector('[data-wp-check]').click();host.querySelector('[data-wp-next]').click();
 const custom=host.querySelector('[data-wp-custom]');assert(custom,'real module has an editable model field');
 custom.value='退出前立即写入的设元说明';custom.dispatchEvent(new logout.w.Event('input',{bubbles:true}));
 assert.notEqual(logout.t.currentProfile().economy.modules.wordProblems.drafts['L7-P1'].customModel,custom.value,'the latest edit is still waiting in the real 600ms debounce');
 logout.writes.length=0;logout.events.length=0;
 await logout.w.document.getElementById('logoutBtn').onclick();
 const lastUpload=logout.writes.filter(v=>v.table==='progress_snapshots').at(-1).row;
 assert.equal(lastUpload.growth_state.wordProblems.drafts['L7-P1'].customModel,'退出前立即写入的设元说明','logout flushes the real pending input before syncing');
 assert(logout.events.indexOf('write:progress_snapshots')<logout.events.indexOf('sign-out'),'private progress uploads before the old account signs out');
 assert.equal(logout.t.cloudState.user,null);assert.equal(host.innerHTML,'');
 const retained=Object.values(logout.t.loadDB().profiles).find(v=>v.classCode==='WPA');
 assert.equal(retained.economy.modules.wordProblems.drafts['L7-P1'].customModel,'退出前立即写入的设元说明','the same last edit also remains in the old local account');
 logout.dom.window.close();
 console.log('PASS real input debounce is flushed locally and to cloud before logout');

 Object.assign(t.cloudState,{user:{id:'teacher-owner'},role:'teacher',classId:'class-a'});
 const roster=[{user_id:'student-a',student_code:'1',student_name:'测试学生'}];
 const teacherSnaps=[{user_id:'student-a',growth_state:{wordProblems:recordState()}}];
 w.RatioWordProblemsUI.renderTeacher(roster,teacherSnaps);
 const teacherHost=w.document.getElementById('teacherWordProblemRecords');
 assert(teacherHost.textContent.includes('PRIVATE-TEACHER-ANSWER'),'teacher reads private snapshot records');
 t.renderEmptyTeacherConsole();assert.equal(teacherHost.innerHTML,'','empty class clears previous private records');
 w.RatioWordProblemsUI.renderTeacher(roster,teacherSnaps);w.RatioWordProblemsUI.reset();
 assert.equal(teacherHost.innerHTML,'','account reset clears private teacher records');
 f.records.class_roster=roster;f.records.progress_snapshots=teacherSnaps;
 const staleLoad=t.loadTeacherDashboard('class-a');t.cloudState.classId='class-b';await staleLoad;
 assert.equal(teacherHost.innerHTML,'','an old asynchronous class response cannot refill records after a class switch');
 t.cloudState.classId='class-a';await t.loadTeacherDashboard('class-a');
 assert(teacherHost.textContent.includes('PRIVATE-TEACHER-ANSWER'));
 assert(f.queries.some(q=>q.table==='progress_snapshots'&&q.columns.includes('growth_state')),'teacher requests the private field');
 await t.teacherLogout();assert.equal(teacherHost.innerHTML,'','teacher logout clears private records');
 w.RatioWordProblemsUI.renderTeacher(roster,teacherSnaps);
 assert.equal(teacherHost.innerHTML,'','logged-out users cannot refill the teacher record panel');
 console.log('PASS private teacher reads and clearing on empty class, account reset, class switch, and logout');

 const homeCards=[...w.document.querySelectorAll('#home .portal-card[data-go]')];
 const oldCard=homeCards.find(c=>c.dataset.go==='mistakes'),newCard=homeCards.find(c=>c.dataset.go==='wordProblems');
 assert(oldCard&&newCard);assert.equal(oldCard.querySelector('.portal-num').textContent,'H');
 assert.equal(newCard.querySelector('.portal-num').textContent,'I');
 assert(homeCards.indexOf(newCard)>homeCards.indexOf(oldCard),'new I entry follows existing H');
 assert.equal(w.document.querySelector('#studentGameMenu [data-go="wordProblems"] > span').textContent,'I');
 console.log('PASS original H entry retained and application-problem entry labeled I');
 for(const d of opened)d.window.close();
 console.log('PASS word-problem integration: 7 focused lifecycle/privacy scenarios');
})().catch(error=>{for(const d of opened)d.window.close();console.error(error);process.exitCode=1;});
