from pathlib import Path
import re, subprocess, sys, tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'
s=p.read_text('utf-8')
checks={
 'account login button':'id="accountLoginBtn"',
 'student register button':'id="cloudRegisterBtn"',
 'rules':'A 法则实验室',
 'training':'B 闯关训练',
 'rings':'C 数圈侦探',
 'login gate':'CLOUD_LOGIN_REQUIRED_PAGES',
 'legacy import':'导入旧版 JSON',
 'browser supabase':'window.supabase',
}
missing=[name for name,needle in checks.items() if needle not in s]
if 'global.supabase' in s: missing.append('invalid global.supabase reference remains')
if missing: raise SystemExit('site validation failed: '+', '.join(missing))
scripts=re.findall(r'<script(?:[^>]*)>(.*?)</script>',s,flags=re.S|re.I)
with tempfile.TemporaryDirectory() as td:
    for i,js in enumerate(scripts):
        if not js.strip(): continue
        f=Path(td)/f'script_{i}.js'; f.write_text(js,'utf-8')
        subprocess.run(['node','--check',str(f)],check=True)
print('RATIOBOT site validation passed')
