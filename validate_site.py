from pathlib import Path
import re, subprocess, sys, tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'
s=p.read_text('utf-8')
checks={
 'account login button':'id="accountLoginBtn"',
 'student register button':'id="studentRegisterBtn"',
 'student class username':'id="accountClassInput"',
 'student number':'id="accountStudentInput"',
 'student password':'id="accountPasswordInput"',
 'fixed teacher email':'similar320@gmail.com',
 'teacher login button':'id="teacherLoginBtn"',
 'teacher login handler':"$('#teacherLoginBtn').onclick=()=>teacherAuth()",
 'teacher no signup copy':'教师账号固定，不开放注册',
 'teacher cloud fallback':'云端组件未加载，请刷新页面后重试',
 'class username label':'班级用户名',
 'student register handler':'async function cloudStudentRegister()',
 'rules':'A 法则实验室',
 'training':'B 闯关训练',
 'rings':'C 数圈侦探',
 'login gate':'CLOUD_LOGIN_REQUIRED_PAGES',
 'legacy import':'导入旧版 JSON',
 'browser supabase':'window.supabase',
 'local supabase bundle':'assets/supabase.min.js',
}
missing=[name for name,needle in checks.items() if needle not in s]
for stale in ['global.supabase','id="cloudRegisterBtn"','id="localLoginBtn"','id="accountUsernameInput"','id="accountPinInput"','id="teacherSignupBtn"','id="bulkCreateStudentsBtn"','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2']:
    if stale in s: missing.append('stale '+stale)
if not (root/'assets'/'supabase.min.js').exists() or (root/'assets'/'supabase.min.js').stat().st_size<50000:
    missing.append('missing/invalid local supabase bundle')
if missing: raise SystemExit('site validation failed: '+', '.join(missing))
scripts=re.findall(r'<script(?:[^>]*)>(.*?)</script>',s,flags=re.S|re.I)
with tempfile.TemporaryDirectory() as td:
    for i,js in enumerate(scripts):
        if not js.strip(): continue
        f=Path(td)/f'script_{i}.js'; f.write_text(js,'utf-8')
        subprocess.run(['node','--check',str(f)],check=True)
print('RATIOBOT site validation passed')
