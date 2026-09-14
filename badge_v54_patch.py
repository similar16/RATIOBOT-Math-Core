from pathlib import Path
import re,sys,subprocess,tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
index=root/'index.html'
s=index.read_text('utf-8')
if 'badge-wall-user-v54' not in s:
    s=s.replace("assets/badges_user_cut.webp?v=50","assets/badges_user_atlas_v54.png?v=54")
    s=s.replace('</style>','\n/* badge-wall-user-v54 */\n</style>',1)
    index.write_text(s,'utf-8')
for js in re.findall(r'<script(?:[^>]*)>(.*?)</script>',index.read_text('utf-8'),flags=re.S|re.I):
    if not js.strip(): continue
    with tempfile.NamedTemporaryFile('w',suffix='.js',encoding='utf-8',delete=False) as f:
        f.write(js); name=f.name
    subprocess.run(['node','--check',name],check=True,stdout=subprocess.DEVNULL)
print('badge v54 patch applied')
