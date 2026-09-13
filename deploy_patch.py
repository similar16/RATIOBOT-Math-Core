from pathlib import Path
import sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'
s=p.read_text('utf-8')

def replace_once(src, old, new, label):
    if new in src:
        return src
    if old not in src:
        raise SystemExit(f'patch target not found: {label}')
    return src.replace(old,new,1)

old="""  function go(id){$$('.page').forEach(x=>x.classList.toggle('active',x.id===id));$$('[data-go]').forEach(x=>x.classList.toggle('active',x.dataset.go===id));if(id==='growth')renderGrowth?.();if(id==='stats')renderStats?.();if(id==='account')renderAccount?.();if(id==='rings')ensureRingsLoaded?.();window.scrollTo({top:0,behavior:'smooth'});}\n  $$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));\n"""
new="""  const CLOUD_LOGIN_REQUIRED_PAGES=new Set(['rules','train','rings']);
  function cloudStudentReady(){try{return !!(cloudState?.user&&cloudState?.role==='student')}catch(e){return false}}
  function go(id,opts={}){
    if(CLOUD_LOGIN_REQUIRED_PAGES.has(id)&&!opts.bypass&&!cloudStudentReady()){
      try{cloudState.pendingPage=id}catch(e){}
      $$('.page').forEach(x=>x.classList.toggle('active',x.id==='account'));
      $$('[data-go]').forEach(x=>x.classList.toggle('active',x.dataset.go==='account'));
      renderAccount?.();
      setTimeout(()=>{cloudMsg?.('#accountError',`请先云端登录学生账号，登录后会自动进入${id==='rules'?'法则实验室':id==='train'?'闯关训练':'数圈侦探'}。`,'bad');$('#accountClassInput')?.focus();},0);
      window.scrollTo({top:0,behavior:'smooth'});return;
    }
    $$('.page').forEach(x=>x.classList.toggle('active',x.id===id));$$('[data-go]').forEach(x=>x.classList.toggle('active',x.dataset.go===id));if(id==='growth')renderGrowth?.();if(id==='stats')renderStats?.();if(id==='account')renderAccount?.();if(id==='rings')ensureRingsLoaded?.();window.scrollTo({top:0,behavior:'smooth'});
  }
  $$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
"""
s=replace_once(s,old,new,'login gate')
s=replace_once(s,"const cloudState={user:null,role:'',classId:'',className:'',displayName:'',syncTimer:null,applying:false};","const cloudState={user:null,role:'',classId:'',className:'',displayName:'',syncTimer:null,applying:false,pendingPage:''};",'cloud state')

needle="  async function cloudLoadStudentData(cls,id){"
helpers=r'''  function profileHasProgress(p){p=ensureProfileShape(p);return !!p&&(Number(p.games||0)>0||Number(p.questions||0)>0||Number(p.xp||0)>0||Number(p.economy?.lifetimeCredits||0)>0||Number(p.economy?.credits||0)>0||(p.history||[]).length>0||(p.badges||[]).length>0);}
  function findLocalMigrationCandidate(cls,id){
    const db=loadDB(),exact=makeProfileKey(cls,id);if(profileHasProgress(db.profiles[exact]))return {key:exact,profile:ensureProfileShape(db.profiles[exact]),kind:'exact'};
    const localKey=makeProfileKey('LOCAL',id);if(profileHasProgress(db.profiles[localKey]))return {key:localKey,profile:ensureProfileShape(db.profiles[localKey]),kind:'legacy-local'};
    const current=db.current&&db.profiles[db.current]?ensureProfileShape(db.profiles[db.current]):null;
    if(profileHasProgress(current)&&String(current.studentId)===String(id))return {key:db.current,profile:current,kind:'same-student'};
    const active=Object.entries(db.profiles||{}).filter(([,p])=>profileHasProgress(p));
    if(active.length===1){const [key,p]=active[0];return {key,profile:ensureProfileShape(p),kind:'single-profile'};}
    return null;
  }
  function mergeCoreProgress(a={},b={}){return {mastery:Math.max(Number(a.mastery||0),Number(b.mastery||0)),sessions:Math.max(Number(a.sessions||0),Number(b.sessions||0)),questions:Math.max(Number(a.questions||0),Number(b.questions||0)),bestAccuracy:Math.max(Number(a.bestAccuracy||0),Number(b.bestAccuracy||0)),hardClears:Math.max(Number(a.hardClears||0),Number(b.hardClears||0))};}
  function mergeEconomy(a={},b={}){
    a=normalizeHQEconomy(structuredClone(a||{}));b=normalizeHQEconomy(structuredClone(b||{}));
    const out=normalizeHQEconomy({...a});out.credits=Math.max(a.credits||0,b.credits||0);out.lifetimeCredits=Math.max(a.lifetimeCredits||0,b.lifetimeCredits||0);
    out.modules=out.modules||{};for(const mod of ['numberRings','arithmetic']){out.modules[mod]={...(a.modules?.[mod]||{})};for(const [k,v] of Object.entries(b.modules?.[mod]||{})){if(Array.isArray(v))out.modules[mod][k]=[...new Set([...(out.modules[mod][k]||[]),...v])];else if(typeof v==='number')out.modules[mod][k]=Math.max(Number(out.modules[mod][k]||0),v);else if(out.modules[mod][k]==null)out.modules[mod][k]=v;}}
    out.checkin={...(a.checkin||{})};out.checkin.days={...(a.checkin?.days||{}),...(b.checkin?.days||{})};out.checkin.makeupTokens=Math.max(Number(a.checkin?.makeupTokens||0),Number(b.checkin?.makeupTokens||0));out.checkin.unlockedOutfits=Math.max(Number(a.checkin?.unlockedOutfits||0),Number(b.checkin?.unlockedOutfits||0));out.checkin.constructionCores=Math.max(Number(a.checkin?.constructionCores||0),Number(b.checkin?.constructionCores||0));out.checkin.equippedOutfit=b.checkin?.equippedOutfit||a.checkin?.equippedOutfit||'';return normalizeHQEconomy(out);
  }
  function mergeProfilesForMigration(base,oldp,cls,id){
    base=ensureProfileShape(base||blankProfile(cls,id,''));oldp=ensureProfileShape(oldp);if(!oldp)return base;
    base.classCode=normalizeClass(cls);base.studentId=String(id);base.xp=Math.max(Number(base.xp||0),Number(oldp.xp||0));base.games=Math.max(Number(base.games||0),Number(oldp.games||0));base.questions=Math.max(Number(base.questions||0),Number(oldp.questions||0));base.bestCombo=Math.max(Number(base.bestCombo||0),Number(oldp.bestCombo||0));
    base.repaired=Math.max(Number(base.repaired||0),Number(oldp.repaired||0));base.perfectRounds=Math.max(Number(base.perfectRounds||0),Number(oldp.perfectRounds||0));base.badges=[...new Set([...(base.badges||[]),...(oldp.badges||[])])];base.activeDates=[...new Set([...(base.activeDates||[]),...(oldp.activeDates||[])])].sort();base.equip={...blankEquip(),...(base.equip||{}),...(oldp.equip||{})};base.economy=mergeEconomy(base.economy,oldp.economy);
    for(const k of Object.keys(CORE_META))base.cores[k]=mergeCoreProgress(base.cores?.[k],oldp.cores?.[k]);
    const hist=[...(base.history||[]),...(oldp.history||[])],seen=new Set();base.history=hist.filter(x=>{const key=JSON.stringify([x.date||x.createdAt||x.time||'',x.stage||'',x.accuracy||'',x.score||'']);if(seen.has(key))return false;seen.add(key);return true}).sort((a,b)=>new Date(b.date||b.createdAt||0)-new Date(a.date||a.createdAt||0)).slice(0,10);base.updatedAt=new Date().toISOString();return ensureProfileShape(base);
  }
  function saveMigratedLocalProfile(p){const db=loadDB(),key=makeProfileKey(p.classCode,p.studentId);db.profiles[key]=ensureProfileShape(p);db.current=key;saveDB(db);state.profileKey=key;state.classCode=p.classCode;state.studentId=p.studentId;refreshPlayerUI();return p;}
'''
if helpers not in s:
    if needle not in s: raise SystemExit('patch target not found: migration helper insertion')
    s=s.replace(needle,helpers+needle,1)

start=s.index("  async function cloudLoadStudentData(cls,id){")
end=s.index("  async function cloudStudentAuth(action){",start)
newblock=r'''  async function cloudLoadStudentData(cls,id){
    if(!cloudClient||!cloudState.user)return;
    const localKey=makeProfileKey(cls,id),db=loadDB();let local=db.profiles[localKey]?ensureProfileShape(db.profiles[localKey]):null;
    let {data:pr}=await cloudClient.from('profiles').select('*').eq('user_id',cloudState.user.id).maybeSingle();let {data:snap}=await cloudClient.from('progress_snapshots').select('*').eq('user_id',cloudState.user.id).maybeSingle();
    const cloudHas=!!snap&&(Number(snap.game_stats?.games||0)>0||Number(pr?.xp||0)>0||Number(snap.economy?.lifetimeCredits||0)>0);cloudState.displayName=pr?.display_name||$('#accountNameInput').value.trim()||`${id}号小方`;
    const candidate=findLocalMigrationCandidate(cls,id);
    if(candidate&&!pr?.migrated_from_local){
      cloudMsg('#cloudMigrationMsg',candidate.kind==='exact'?'检测到本机旧进度，正在首次迁移到云端…':'检测到旧版/LOCAL 进度，正在合并到当前学生并迁移…');
      let base=cloudHas?cloudApplySnapshot(local||blankProfile(cls,id,''),pr,snap):(local||blankProfile(cls,id,''));let merged=mergeProfilesForMigration(base,candidate.profile,cls,id);saveMigratedLocalProfile(merged);await cloudSyncProfile(merged,true);cloudMsg('#cloudMigrationMsg','✓ 旧 XP、R积分、打卡、头像、徽章与训练记录已合并到云端。','good');
    }else if(cloudHas){
      let base=local||blankProfile(cls,id,'');cloudState.applying=true;let pulled=cloudApplySnapshot(base,pr,snap);pulled.classCode=normalizeClass(cls);pulled.studentId=String(id);saveMigratedLocalProfile(pulled);cloudState.applying=false;renderGrowth();renderStats();renderAccount();cloudMsg('#cloudMigrationMsg','✓ 已从云端恢复学生进度。','good');
    }else{
      let res=loginOrCreate(cls,id,$('#accountPinInput').value);if(res.ok)await cloudSyncProfile(res.profile,true);
    }
    await loadStudentClassWall();
  }
'''
s=s[:start]+newblock+s[end:]
s=replace_once(s,"renderAccount();renderGrowth();renderStats();refreshCloudUI();setTimeout(()=>go('growth'),350)","renderAccount();renderGrowth();renderStats();refreshCloudUI();const next=cloudState.pendingPage||'growth';cloudState.pendingPage='';setTimeout(()=>go(next,{bypass:true}),350)",'post-login return')

ui_needle='<div id="cloudMigrationMsg" class="cloud-msg"></div></div>'
ui_new='''<div id="cloudMigrationMsg" class="cloud-msg"></div><div class="legacy-import-box" style="margin-top:12px;padding-top:12px;border-top:2px dashed rgba(62,53,64,.18)"><b>旧版数据迁移</b><p style="margin:6px 0 8px">同域旧数据会自动迁移；如果旧数据来自本地 HTML，可导入一次性 JSON 备份。</p><input id="legacyImportFile" type="file" accept="application/json,.json" style="max-width:100%"><div class="cloud-actions"><button id="legacyImportBtn" class="ghost">导入旧版 JSON</button><button id="localBackupBtn" class="ghost">导出本机备份</button></div></div></div>'''
s=replace_once(s,ui_needle,ui_new,'migration ui')

wire="  $('#teacherSignupBtn').onclick=()=>teacherAuth('signup');"
handlers=r'''  function exportLocalBackup(){const payload={format:'ratiobot-local-backup-v1',exportedAt:new Date().toISOString(),studentDB:loadDB(),legacyStats:(()=>{try{return JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY)||'null')}catch(e){return null}})()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`RATIOBOT_本机备份_${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  async function importLegacyBackup(){const file=$('#legacyImportFile')?.files?.[0];if(!file)return cloudMsg('#cloudMigrationMsg','请先选择旧版 JSON 备份文件。','bad');try{const j=JSON.parse(await file.text());let incoming=j.studentDB||j.db||j;let profiles=incoming?.profiles||{};if(j.legacyStats&&!Object.keys(profiles).length){localStorage.setItem(LEGACY_STORAGE_KEY,JSON.stringify(j.legacyStats));const db=loadDB();db.migratedV7=false;saveDB(db);migrateLegacy();profiles=loadDB().profiles||{}}if(!profiles||!Object.keys(profiles).length)throw new Error('备份中没有可识别的学生进度');const db=loadDB();for(const [k,p] of Object.entries(profiles)){const ep=ensureProfileShape(p);if(ep)db.profiles[k]=db.profiles[k]?mergeProfilesForMigration(db.profiles[k],ep,ep.classCode,ep.studentId):ep;}saveDB(db);renderAccount();cloudMsg('#cloudMigrationMsg',`✓ 已导入 ${Object.keys(profiles).length} 个本机档案。请用对应学生账号云端登录，系统会继续合并同步。`,'good')}catch(e){cloudMsg('#cloudMigrationMsg',e.message||'旧版备份导入失败。','bad')}}
  $('#legacyImportBtn').onclick=importLegacyBackup;$('#localBackupBtn').onclick=exportLocalBackup;
'''
if handlers not in s:
    if wire not in s: raise SystemExit('patch target not found: migration handlers')
    s=s.replace(wire,handlers+wire,1)

s=s.replace('首次云端注册后，本机已有的 XP、R积分、打卡、头像和徽章会自动迁移。','首次云端注册后，本机已有的 XP、R积分、打卡、头像、徽章和训练记录会自动迁移。法则实验室、闯关训练和数圈侦探均需先完成学生云端登录。',1)
p.write_text(s,'utf-8')

rp=root/'rings.html'
r=rp.read_text('utf-8')
guard='<script>if(window.top===window){location.replace("index.html#account");}</script>'
if guard not in r:
    if '<head>' not in r: raise SystemExit('patch target not found: rings head')
    r=r.replace('<head>','<head>'+guard,1)
rp.write_text(r,'utf-8')
print('RATIOBOT deploy patch applied')
