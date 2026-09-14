from pathlib import Path
import re,sys,subprocess,tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'; s=p.read_text('utf-8')
files=sorted((root/'assets'/'badges_user16').glob('badge_*.webp'))
if len(files)!=16: raise SystemExit(f'expected 16 badge files, got {len(files)}')
if 'badge-wall-individual-v49' not in s:
    css=r'''<style id="badge-wall-individual-v49">
.unified-badge .ub-icon{width:min(138px,100%);height:138px;aspect-ratio:1/1;border:0!important;border-radius:0!important;background:transparent!important;display:grid!important;place-items:center!important;overflow:visible!important}
.user-badge-v49{display:block;width:100%;height:100%;object-fit:contain;filter:none;transition:.18s transform,.18s filter,.18s opacity}
.unified-badge:not(.earned) .user-badge-v49{filter:grayscale(1);opacity:.30}
.unified-badge.earned:hover .user-badge-v49{transform:translateY(-2px) scale(1.03)}
</style>'''
    s=s.replace('</head>',css+'\n</head>',1)
    mapping="""  const USER_BADGE_V49={'数圈新探':1,'零点守卫':2,'分类大师':3,'精准推理':4,'运算满贯':5,'S级破案':6,'双人擂主':7,'追平高手':8,'双核连携':9,'数学全徽章':10,'核心启动':11,'连击点火':12,'第一次就对':13,'修理大师':14,'稳定核心':15,'全系统在线':16};
  function userBadgeImg49(name){const i=USER_BADGE_V49[name];if(!i)return '<span>★</span>';return `<img class=\"user-badge-v49\" src=\"assets/badges_user16/badge_${String(i).padStart(2,'0')}.webp?v=49\" alt=\"${name}\" loading=\"lazy\">`;}
"""
    pos=s.find('  function renderUnifiedBadges(p)')
    if pos<0: raise SystemExit('renderUnifiedBadges not found')
    s=s[:pos]+mapping+s[pos:]
    pat=r"  function renderUnifiedBadges\(p\)\{.*?\n  function renderHonorGrowth\(\)"
    m=re.search(pat,s,flags=re.S)
    if not m: raise SystemExit('renderUnifiedBadges block missing')
    new=r'''  function renderUnifiedBadges(p){
    let box=$('#unifiedBadgeGrid');if(!box||!p)return;
    let have=new Set(p.badges||[]),growth=BADGES.map(b=>({name:b.name,desc:b.desc,earned:have.has(b.id),type:'成长'}));
    let base=hqBadges(p).map(([name,icon,desc,earned])=>({name,desc,earned,type:'数学'}));
    box.innerHTML=[...base,...growth].map(b=>`<article class="unified-badge ${b.earned?'earned':''}"><div class="ub-icon">${userBadgeImg49(b.name)}</div><div><b>${b.name}</b><span>${b.desc}</span><em>${b.type} · ${b.earned?'已点亮':'未点亮'}</em></div></article>`).join('');
  }
  function renderHonorGrowth()'''
    s=s[:m.start()]+new+s[m.end():]
    p.write_text(s,'utf-8')
for i,js in enumerate(re.findall(r'<script(?:[^>]*)>(.*?)</script>',s,flags=re.S|re.I)):
    if not js.strip(): continue
    with tempfile.NamedTemporaryFile('w',suffix='.js',encoding='utf-8',delete=False) as f:
        f.write(js); name=f.name
    subprocess.run(['node','--check',name],check=True,stdout=subprocess.DEVNULL)
print('badge v49 patch applied')
