from pathlib import Path
import sys,re
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'
s=p.read_text('utf-8')

def rep(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'missing patch target: {label}')
    s=s.replace(old,new,1)

old='''        <div class="account-card"><h3>学生云端登录</h3><p>学生账号由教师统一创建。用户名固定为“班级码-学号”，例如 <b>ZY2901-17</b>。第一次使用教师发放的临时密码登录后，必须设置自己的新密码，完成后才能进入训练。</p>
          <div class="identity-grid"><div class="identity-field"><label for="accountUsernameInput">用户名</label><input id="accountUsernameInput" maxlength="64" autocomplete="username" placeholder="如 ZY2901-17"></div><div class="identity-field pin"><label for="accountPasswordInput">密码 / 初始密码</label><input id="accountPasswordInput" maxlength="32" type="password" autocomplete="current-password" placeholder="请输入密码"></div></div>
          <div id="accountError" class="student-error"></div><div class="account-actions"><button id="logoutBtn" class="ghost">退出当前学生</button><button id="accountLoginBtn" class="primary">学生登录 →</button></div>
          <div id="firstPasswordBox" class="cloud-hidden" style="margin-top:14px;padding:14px;border:2px solid rgba(62,53,64,.16);border-radius:14px;background:#fffdf8"><b>首次登录 · 设置自己的密码</b><p style="margin:6px 0 10px">新密码设置后，老师无法查看；忘记时由老师重置为新的临时密码。</p><div class="cloud-fields"><div class="cloud-field"><label for="firstNewPassword">新密码（6–32位）</label><input id="firstNewPassword" type="password" maxlength="32" autocomplete="new-password"></div><div class="cloud-field"><label for="firstNewPassword2">再输入一次</label><input id="firstNewPassword2" type="password" maxlength="32" autocomplete="new-password"></div></div><div class="cloud-actions"><button id="setFirstPasswordBtn" class="primary">保存新密码并进入</button></div><div id="firstPasswordMsg" class="cloud-msg"></div></div>
          <div class="local-note">云端账号是唯一训练身份；本机仅保留缓存和旧数据迁移，不再允许学生自行创建账号。</div>
        </div>'''
new='''        <div class="account-card"><h3>学生登录 / 首次注册</h3><p>老师先在教师端创建“班级用户名”。学生再用 <b>班级用户名 + 学号</b> 注册；第一次注册时由学生自己设置密码。之后换设备直接用同一组信息登录。</p>
          <div class="identity-grid"><div class="identity-field"><label for="accountClassInput">班级用户名</label><input id="accountClassInput" maxlength="12" autocomplete="organization" placeholder="如 ZY2901"></div><div class="identity-field"><label for="accountStudentInput">学号</label><input id="accountStudentInput" maxlength="3" inputmode="numeric" placeholder="如 17"></div><div class="identity-field pin"><label for="accountPasswordInput">密码</label><input id="accountPasswordInput" maxlength="32" type="password" autocomplete="current-password" placeholder="6–32位"></div><div class="identity-field"><label for="accountNameInput">昵称（可不填）</label><input id="accountNameInput" maxlength="24" placeholder="如 17号小方"></div></div>
          <div id="accountError" class="student-error"></div><div class="account-actions"><button id="logoutBtn" class="ghost">退出当前学生</button><button id="studentRegisterBtn" class="ghost">首次注册</button><button id="accountLoginBtn" class="primary">学生登录 →</button></div>
          <div id="firstPasswordBox" class="cloud-hidden" style="margin-top:14px;padding:14px;border:2px solid rgba(62,53,64,.16);border-radius:14px;background:#fffdf8"><b>旧账号需要更新密码</b><p style="margin:6px 0 10px">仅用于此前由教师统一创建的旧账号。设置完成后即可继续使用。</p><div class="cloud-fields"><div class="cloud-field"><label for="firstNewPassword">新密码（6–32位）</label><input id="firstNewPassword" type="password" maxlength="32" autocomplete="new-password"></div><div class="cloud-field"><label for="firstNewPassword2">再输入一次</label><input id="firstNewPassword2" type="password" maxlength="32" autocomplete="new-password"></div></div><div class="cloud-actions"><button id="setFirstPasswordBtn" class="primary">保存新密码并进入</button></div><div id="firstPasswordMsg" class="cloud-msg"></div></div>
          <div class="local-note">班级用户名必须由老师先创建；同一个班级中的同一学号只能注册一次。旧版数据迁移仍然保留。</div>
        </div>'''
rep(old,new,'student card')

old='''        <div class="cloud-card"><h3>教师端</h3><p>教师使用自己的邮箱账号。首次注册可能需要完成邮箱验证；登录后可创建班级并查看本班学生的完整进度。</p>
          <div class="cloud-fields"><div class="cloud-field full"><label>教师邮箱</label><input id="teacherEmail" type="email" placeholder="teacher@example.com"></div><div class="cloud-field full"><label>密码</label><input id="teacherPassword" type="password" placeholder="至少6位"></div></div>
          <div class="cloud-actions"><button id="teacherSignupBtn" class="ghost">教师注册</button><button id="teacherLoginBtn" class="primary">教师登录</button><button id="teacherLogoutBtn" class="ghost">退出教师</button></div><div id="teacherMsg" class="cloud-msg"></div>
          <div id="teacherCreateBox" class="cloud-hidden"><div class="cloud-fields"><div class="cloud-field"><label>班级名称</label><input id="newClassName" placeholder="七年级29班"></div><div class="cloud-field"><label>班级码</label><input id="newClassCode" maxlength="12" placeholder="ZY2901"></div></div><div class="cloud-actions"><button id="createClassBtn" class="primary">创建班级</button></div></div>
        </div>'''
new='''        <div class="cloud-card"><h3>教师端</h3><p>教师账号固定，不开放注册。登录后先创建班级，并设置一个学生容易输入的“班级用户名”；学生随后即可自行注册。</p>
          <input id="teacherEmail" type="hidden" value="similar320@gmail.com"><div class="cloud-fields"><div class="cloud-field full"><label>教师用户名</label><div style="padding:10px 12px;border:2px solid rgba(62,53,64,.18);border-radius:12px;background:#fffdf8;font-weight:900">similar320@gmail.com</div></div><div class="cloud-field full"><label>密码</label><input id="teacherPassword" type="password" autocomplete="current-password" placeholder="请输入教师密码"></div></div>
          <div class="cloud-actions"><button id="teacherLoginBtn" class="primary">教师登录</button><button id="teacherLogoutBtn" class="ghost">退出教师</button></div><div id="teacherMsg" class="cloud-msg"></div>
          <div id="teacherCreateBox" class="cloud-hidden"><div class="cloud-fields"><div class="cloud-field"><label>班级名称</label><input id="newClassName" placeholder="七年级29班"></div><div class="cloud-field"><label>班级用户名</label><input id="newClassCode" maxlength="12" placeholder="例如 ZY2901"></div></div><div class="cloud-actions"><button id="createClassBtn" class="primary">创建 / 开放学生注册</button></div><p class="local-note">创建成功后，学生凭“班级用户名 + 学号”注册。班级用户名不可与其他班重复。</p></div>
        </div>'''
rep(old,new,'teacher card')

pattern=r'<div id="teacherDashboard" class="cloud-wall cloud-hidden"><div class="cloud-wall-head">.*?</div><div class="cloud-card" style="margin:12px 0">.*?</div><div id="teacherTable" class="teacher-table"></div></div>'
m=re.search(pattern,s,flags=re.S)
if not m: raise SystemExit('missing teacher dashboard block')
newdash='''<div id="teacherDashboard" class="cloud-wall cloud-hidden"><div class="cloud-wall-head"><div><div class="eyebrow">TEACHER DASHBOARD</div><h3>班级学生与进度</h3></div><select id="teacherClassSelect"></select></div><p class="local-note">学生在注册后会自动出现在这里。教师不保存也不查看学生密码。</p><div id="teacherTable" class="teacher-table"></div></div>'''
s=s[:m.start()]+newdash+s[m.end():]
s=s.replace("$('#accountUsernameInput')?.focus();","$('#accountClassInput')?.focus();")

start=s.index('  function renderAccount(){')
end=s.index('  const CLOUD_URL=',start)
s=s[:start]+r'''  function renderAccount(){const db=loadDB(),p=currentProfile(),profiles=Object.entries(db.profiles).map(([k,v])=>[k,ensureProfileShape(v)]).sort((a,b)=>new Date(b[1].updatedAt)-new Date(a[1].updatedAt));$('#profileListNote').textContent=profiles.length?`这台设备已保存 ${profiles.length} 个学生档案。`:'尚未保存学生。';$('#savedProfiles').innerHTML=profiles.length?profiles.map(([k,v])=>{const li=levelInfo(v.xp);return `<div class="saved-profile ${db.current===k?'current':''}"><div><b>${v.classCode}-${v.studentId}</b><span>Lv.${li.level} · ${levelTitle(li.level)} · ${v.games} 局 · ${v.xp} XP · ${displayDateLong(v.updatedAt)}</span></div><button data-profile-prefill="${encodeURIComponent(k)}">填入账号</button></div>`;}).join(''):'<div class="empty">云端登录后，本机缓存会出现在这里。</div>';$$('[data-profile-prefill]').forEach(b=>b.onclick=()=>{const key=decodeURIComponent(b.dataset.profilePrefill),v=db.profiles[key];$('#accountClassInput').value=v.classCode;$('#accountStudentInput').value=v.studentId;$('#accountPasswordInput').value='';$('#accountPasswordInput').focus();});if(p){if(!$('#accountClassInput').value)$('#accountClassInput').value=p.classCode;if(!$('#accountStudentInput').value)$('#accountStudentInput').value=p.studentId;}}
  $('#accountLoginBtn').onclick=()=>cloudStudentLogin();
  $('#studentRegisterBtn').onclick=()=>cloudStudentRegister();
  ['accountClassInput','accountStudentInput','accountPasswordInput'].forEach(id=>$('#'+id).addEventListener('keydown',e=>{if(e.key==='Enter')$('#accountLoginBtn').click();}));
  $('#logoutBtn').onclick=async()=>{try{await cloudClient?.auth.signOut()}catch(e){} cloudState.user=null;cloudState.role='';cloudState.mustChangePassword=false;cloudState.username='';logoutProfile();$('#firstPasswordBox')?.classList.add('cloud-hidden');$('#accountError').textContent='已退出当前学生。';refreshCloudUI();};

'''+s[end:]

start=s.index('  async function cloudStudentLogin(){')
end=s.index('  async function setFirstStudentPassword(){',start)
student_funcs=r'''  function studentForm(){return {join:$('#accountClassInput').value.trim().toUpperCase(),sid:$('#accountStudentInput').value.trim(),password:$('#accountPasswordInput').value,name:$('#accountNameInput').value.trim()}}
  async function finishStudentSession(j,join,sid){await cloudClient.auth.setSession({access_token:j.session.access_token,refresh_token:j.session.refresh_token});cloudState.user={id:j.user.id};cloudState.role='student';cloudState.classId=j.class.id;cloudState.className=j.class.name;cloudState.displayName=j.user.display_name||sid;cloudState.mustChangePassword=!!j.account.must_change_password;cloudState.username=j.account.username||`${join}-${sid}`;localStorage.setItem('ratiobot_last_class',join);localStorage.setItem('ratiobot_last_student',sid);await cloudLoadStudentData(join,sid);$('#accountPasswordInput').value='';renderAccount();renderGrowth();renderStats();refreshCloudUI();if(cloudState.mustChangePassword){$('#firstPasswordBox').classList.remove('cloud-hidden');$('#firstNewPassword').focus();go('account',{bypass:true});return}const next=cloudState.pendingPage||'growth';cloudState.pendingPage='';setTimeout(()=>go(next,{bypass:true}),250)}
  async function cloudStudentLogin(){if(!cloudClient){cloudMsg('#accountError','云端组件未加载，请检查网络。','bad');return}let {join,sid,password}=studentForm();if(!join||!/^[0-9]{1,3}$/.test(sid)||!password){cloudMsg('#accountError','请输入班级用户名、数字学号和密码。','bad');return}cloudMsg('#accountError','正在登录云端…');try{let r=await fetch(`${CLOUD_URL}/functions/v1/student-auth`,{method:'POST',headers:{'Content-Type':'application/json','apikey':CLOUD_KEY},body:JSON.stringify({action:'login',join_code:join,student_code:sid,password})}),j=await r.json();if(!r.ok||!j.ok)throw new Error(j.error||'云端登录失败');cloudMsg('#accountError','✓ 云端登录成功。','good');await finishStudentSession(j,join,sid)}catch(e){cloudMsg('#accountError',e.message||'云端登录失败','bad');beep(180,.1,'square')}}
  async function cloudStudentRegister(){if(!cloudClient){cloudMsg('#accountError','云端组件未加载，请检查网络。','bad');return}let {join,sid,password,name}=studentForm();if(!join||!/^[0-9]{1,3}$/.test(sid)){cloudMsg('#accountError','请输入老师给出的班级用户名和1–3位数字学号。','bad');return}if(!/^[A-Za-z0-9!@#$%^&*._-]{6,32}$/.test(password)){cloudMsg('#accountError','请设置6–32位密码，可使用字母、数字及常见符号。','bad');return}cloudMsg('#accountError','正在创建学生账号…');try{let r=await fetch(`${CLOUD_URL}/functions/v1/student-auth`,{method:'POST',headers:{'Content-Type':'application/json','apikey':CLOUD_KEY},body:JSON.stringify({action:'register',join_code:join,student_code:sid,password,display_name:name||`${sid}号`})}),j=await r.json();if(!r.ok||!j.ok)throw new Error(j.error||'学生注册失败');cloudMsg('#accountError',`✓ 注册成功，账号 ${join}-${sid}。正在自动登录…`,'good');await cloudStudentLogin()}catch(e){cloudMsg('#accountError',e.message||'学生注册失败','bad')}}
'''
s=s[:start]+student_funcs+s[end:]

start=s.index('  async function teacherAuth(mode){')
end=s.index('  async function loadTeacherClasses(){',start)
s=s[:start]+r'''  async function teacherAuth(){if(!cloudClient){cloudMsg('#teacherMsg','云端组件未加载，请刷新页面后重试。','bad');return}const email='similar320@gmail.com',password=$('#teacherPassword').value;if(!password){cloudMsg('#teacherMsg','请输入教师密码。','bad');return}cloudMsg('#teacherMsg','正在登录教师端…');try{let res=await cloudClient.auth.signInWithPassword({email,password});if(res.error)throw res.error;cloudState.user=res.data.user;cloudState.role='teacher';cloudMsg('#teacherMsg','✓ 教师已登录。','good');$('#teacherCreateBox').classList.remove('cloud-hidden');await loadTeacherClasses();refreshCloudUI()}catch(e){cloudMsg('#teacherMsg','教师用户名或密码不正确。','bad')}}
'''+s[end:]

s=s.replace("cloudMsg('#teacherMsg','请输入班级名称和2–12位班级码。','bad')","cloudMsg('#teacherMsg','请输入班级名称和2–12位班级用户名（字母/数字/下划线/短横线）。','bad')")
s=s.replace("cloudMsg('#teacherMsg',error.code==='23505'?'班级码已被使用，请换一个。':error.message,'bad')","cloudMsg('#teacherMsg',error.code==='23505'?'班级用户名已被使用，请换一个。':error.message,'bad')")
s=s.replace("cloudMsg('#teacherMsg',`✓ 已创建 ${name}，学生班级码：${code}`,'good')","cloudMsg('#teacherMsg',`✓ 已创建 ${name}，学生班级用户名：${code}。学生现在可以注册。`,'good')")

start=s.index('  function parseStudentCodes(text){')
end=s.index('  function exportLocalBackup(){',start)
s=s[:start]+r'''  async function loadTeacherDashboard(classId){if(!classId)return;let {data:accounts,error}=await cloudClient.from('student_accounts').select('user_id,student_code,login_name,activated_at').eq('class_id',classId).order('student_code');if(error)return cloudMsg('#teacherMsg',error.message,'bad');let ids=(accounts||[]).map(x=>x.user_id),profiles=[];if(ids.length){let r=await cloudClient.from('profiles').select('*').in('user_id',ids);profiles=r.data||[]}let pm=Object.fromEntries(profiles.map(x=>[x.user_id,x]));$('#teacherTable').innerHTML=`<div class="teacher-row head"><span>学生账号</span><span>状态</span><span>等级</span><span>R积分</span><span>徽章</span></div>`+(accounts||[]).map(a=>{let x=pm[a.user_id]||{};return `<div class="teacher-row"><span><b>${a.login_name||a.student_code}</b><br><small>${x.display_name||a.student_code}</small></span><span>已注册</span><span>Lv.${x.level||1}<br>BASE ${x.base_level||0}</span><span>${x.r_points||0}</span><span>${x.badge_count||0}</span></div>`}).join('')+((accounts||[]).length?'':'<div class="empty">还没有学生注册。把上方“班级用户名”发给学生即可。</div>')}
'''+s[end:]

s=s.replace("  $('#bulkCreateStudentsBtn').onclick=bulkCreateStudents;$('#copyCredentialsBtn').onclick=async()=>{if(!lastCredentialText)return cloudMsg('#teacherProvisionMsg','当前没有可复制的初始密码表。','bad');try{await navigator.clipboard.writeText(lastCredentialText);cloudMsg('#teacherProvisionMsg','✓ 已复制本次账号表。','good')}catch(e){cloudMsg('#teacherProvisionMsg','复制失败，请手动复制上方表格。','bad')};\n",'')
s=s.replace("  $('#teacherSignupBtn').onclick=()=>teacherAuth('signup');$('#teacherLoginBtn').onclick=()=>teacherAuth('login');","  $('#teacherLoginBtn').onclick=()=>teacherAuth();")
s=s.replace("cloudState.username=acct?.login_name||`${cls}-${sid}`;cloudState.mustChangePassword=!!acct?.must_change_password;$('#accountUsernameInput').value=cloudState.username;","cloudState.username=acct?.login_name||`${cls}-${sid}`;cloudState.mustChangePassword=!!acct?.must_change_password;$('#accountClassInput').value=cls;$('#accountStudentInput').value=sid;")
s=s.replace('学生账号由教师统一创建','学生账号在教师创建班级后由学生自行注册')
s=s.replace('教师只能重置为新的临时密码','教师不查看学生当前密码')
p.write_text(s,'utf-8')
print('self registration patch applied')