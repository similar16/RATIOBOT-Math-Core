from pathlib import Path
import re,sys,subprocess,tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'; s=p.read_text('utf-8')
MARK='badge-wall-individual-v48'
asset_dir=root/'assets'/'userbadges'
missing=[str(asset_dir/f'badge_{i:02d}.webp') for i in range(1,17) if not (asset_dir/f'badge_{i:02d}.webp').exists()]
if missing: raise SystemExit('missing individual badges: '+', '.join(missing[:4]))
if MARK not in s:
    css=r'''<style id="badge-wall-individual-v48">
.unified-badge .ub-icon{width:min(132px,100%);height:132px;aspect-ratio:1/1;border:0!important;border-radius:0!important;background:transparent!important;display:grid!important;place-items:center!important;overflow:visible!important}
.unified-badge .ub-icon img.user-badge-img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;opacity:1;filter:none;transition:.18s transform,.18s filter,.18s opacity}
.unified-badge:not(.earned) .ub-icon img.user-badge-img{filter:grayscale(1);opacity:.28}
.unified-badge.earned:hover .ub-icon img.user-badge-img{transform:translateY(-2px) scale(1.03)}
</style>'''
    if '</head>' not in s: raise SystemExit('missing head')
    s=s.replace('</head>',css+'\n</head>',1)
    mapping="""  const USER_BADGE_FILE={'数圈新探':1,'零点守卫':2,'分类大师':3,'精准推理':4,'运算满贯':5,'S级破案':6,'双人擂主':7,'追平高手':8,'双核连携':9,'数学全徽章':10,'核心启动':11,'连击点火':12,'第一次就对':13,'修理大师':14,'稳定核心':15,'全系统在线':16};
  function userBadgeImg(name){const i=USER_BADGE_FILE[name];if(!i)return '<span>★</span>';return `<img class=\"user-badge-img\" src=\"assets/userbadges/badge_${String(i).padStart(2,'0')}.webp?v=48\" alt=\"${name}\" loading=\"lazy\">`;}
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
    box.innerHTML=[...base,...growth].map(b=>`<article class="unified-badge ${b.earned?'earned':''}"><div class="ub-icon">${userBadgeImg(b.name)}</div><div><b>${b.name}</b><span>${b.desc}</span><em>${b.type} · ${b.earned?'已点亮':'未点亮'}</em></div></article>`).join('');
  }
  function renderHonorGrowth()'''
    s=s[:m.start()]+new+s[m.end():]
    p.write_text(s,'utf-8')
scripts=re.findall(r'<script(?:[^>]*)>(.*?)</script>',s,flags=re.S|re.I)
with tempfile.TemporaryDirectory() as td:
    for i,js in enumerate(scripts):
        if not js.strip(): continue
        f=Path(td)/f's{i}.js';f.write_text(js,'utf-8')
        subprocess.run(['node','--check',str(f)],check=True,stdout=subprocess.DEVNULL)
print('individual badge patch v48 applied')
