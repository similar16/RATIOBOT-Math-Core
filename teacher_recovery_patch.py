from pathlib import Path
import sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'
s=p.read_text('utf-8')

old='<div class="cloud-actions"><button id="teacherLoginBtn" class="primary">教师登录</button><button id="teacherLogoutBtn" class="ghost">退出教师</button></div><div id="teacherMsg" class="cloud-msg"></div>'
new='''<div class="cloud-actions"><button id="teacherLoginBtn" class="primary">教师登录</button><button id="teacherResetBtn" class="ghost">忘记 / 重置教师密码</button><button id="teacherLogoutBtn" class="ghost">退出教师</button></div><div id="teacherMsg" class="cloud-msg"></div>
          <div id="teacherRecoveryBox" class="cloud-hidden" style="margin-top:14px;padding:14px;border:2px solid rgba(62,53,64,.16);border-radius:14px;background:#fffdf8"><b>设置新的教师密码</b><p style="margin:6px 0 10px">请从 <b>similar320@gmail.com</b> 收到的密码恢复邮件进入本页后，在这里设置新密码。</p><div class="cloud-fields"><div class="cloud-field full"><label for="teacherRecoveryPassword">新密码</label><input id="teacherRecoveryPassword" type="password" maxlength="32" autocomplete="new-password" placeholder="至少6位"></div><div class="cloud-field full"><label for="teacherRecoveryPassword2">再输入一次</label><input id="teacherRecoveryPassword2" type="password" maxlength="32" autocomplete="new-password" placeholder="再次输入"></div></div><div class="cloud-actions"><button id="teacherRecoverySaveBtn" class="primary">保存新教师密码</button><button id="teacherRecoveryCancelBtn" class="ghost">取消</button></div><div id="teacherRecoveryMsg" class="cloud-msg"></div></div>'''
if old not in s:
    raise SystemExit('teacher recovery UI target not found')
s=s.replace(old,new,1)

needle='  async function teacherAuth(){'
funcs=r'''  const FIXED_TEACHER_EMAIL='similar320@gmail.com';
  function showTeacherRecovery(){go('account',{bypass:true});$('#teacherRecoveryBox')?.classList.remove('cloud-hidden');setTimeout(()=>$('#teacherRecoveryPassword')?.focus(),80);cloudMsg('#teacherMsg','已打开教师密码重置。请设置新的教师密码。','good')}
  async function requestTeacherPasswordReset(){if(!cloudClient){cloudMsg('#teacherMsg','云端组件未加载，请刷新页面后重试。','bad');return}cloudMsg('#teacherMsg','正在发送教师密码恢复邮件…');try{const redirectTo='https://similar16.github.io/RATIOBOT-Math-Core/?teacher_recovery=1#account';const {error}=await cloudClient.auth.resetPasswordForEmail(FIXED_TEACHER_EMAIL,{redirectTo});if(error)throw error;cloudMsg('#teacherMsg','✓ 密码恢复邮件已发送到 similar320@gmail.com。请打开邮件里的链接，再回到这里设置新密码。','good')}catch(e){cloudMsg('#teacherMsg','发送恢复邮件失败：'+(e?.message||'请稍后重试。'),'bad')}}
  async function saveTeacherRecoveryPassword(){if(!cloudClient)return;const a=$('#teacherRecoveryPassword').value,b=$('#teacherRecoveryPassword2').value;if(a!==b)return cloudMsg('#teacherRecoveryMsg','两次输入的密码不一致。','bad');if(a.length<6||a.length>32)return cloudMsg('#teacherRecoveryMsg','教师密码需为6–32位。','bad');cloudMsg('#teacherRecoveryMsg','正在保存新密码…');try{const {data:{user},error:ue}=await cloudClient.auth.getUser();if(ue||!user)throw new Error('恢复链接登录状态无效，请重新从恢复邮件进入。');if(String(user.email||'').toLowerCase()!==FIXED_TEACHER_EMAIL)throw new Error('当前恢复会话不是固定教师账号。');const {error}=await cloudClient.auth.updateUser({password:a});if(error)throw error;await cloudClient.auth.signOut();cloudState.user=null;cloudState.role='';$('#teacherRecoveryPassword').value='';$('#teacherRecoveryPassword2').value='';$('#teacherRecoveryBox').classList.add('cloud-hidden');$('#teacherPassword').value='';cloudMsg('#teacherMsg','✓ 教师密码已更新。现在请使用新密码登录教师端。','good');refreshCloudUI();history.replaceState(null,'',location.pathname+'?v=23#account')}catch(e){cloudMsg('#teacherRecoveryMsg',e?.message||'保存新密码失败。','bad')}}
'''
if needle not in s:
    raise SystemExit('teacher auth insertion target not found')
s=s.replace(needle,funcs+needle,1)

bind="$('#teacherLoginBtn').onclick=()=>teacherAuth();$('#teacherLogoutBtn').onclick=async()=>{"
newbind="$('#teacherLoginBtn').onclick=()=>teacherAuth();$('#teacherResetBtn').onclick=requestTeacherPasswordReset;$('#teacherRecoverySaveBtn').onclick=saveTeacherRecoveryPassword;$('#teacherRecoveryCancelBtn').onclick=()=>{$('#teacherRecoveryBox').classList.add('cloud-hidden');cloudMsg('#teacherRecoveryMsg','')};$('#teacherLogoutBtn').onclick=async()=>{"
if bind not in s:
    raise SystemExit('teacher recovery binding target not found')
s=s.replace(bind,newbind,1)

init_needle='  async function initCloud(){'
listener=r'''  if(cloudClient){cloudClient.auth.onAuthStateChange((event,session)=>{if(event==='PASSWORD_RECOVERY'){setTimeout(()=>showTeacherRecovery(),50)}});if(new URLSearchParams(location.search).get('teacher_recovery')==='1'){setTimeout(async()=>{const {data}=await cloudClient.auth.getSession();if(data?.session)showTeacherRecovery();else cloudMsg('#teacherMsg','正在验证密码恢复链接…','good')},200)}}
'''
if init_needle not in s:
    raise SystemExit('teacher recovery listener target not found')
s=s.replace(init_needle,listener+init_needle,1)

p.write_text(s,'utf-8')
print('teacher password recovery patch applied')
