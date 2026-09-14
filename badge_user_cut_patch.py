from pathlib import Path
import re,sys,subprocess,tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'; asset=root/'assets'/'badges_user_cut.webp'
if not asset.exists() or asset.stat().st_size<10000:
    raise SystemExit('missing/too-small assets/badges_user_cut.webp')
s=p.read_text('utf-8')
MARK='badge-wall-user-cut-v1'
if MARK not in s:
    css=r'''<style id="badge-wall-user-cut-v1">
.unified-badge .ub-icon{width:min(128px,100%);height:auto;aspect-ratio:4/5;border:0!important;border-radius:0!important;background:transparent!important;overflow:visible!important}
.user-badge-sprite{display:block;width:100%;height:100%;background-image:url('assets/badges_user_cut.webp');background-repeat:no-repeat;background-size:400% 400%;filter:none;transition:.18s transform,.18s filter,.18s opacity}
.unified-badge.earned:hover .user-badge-sprite{transform:translateY(-2px) scale(1.025)}
.unified-badge:not(.earned) .user-badge-sprite{filter:grayscale(1);opacity:.23}
@media(max-width:720px){.unified-badge .ub-icon{width:min(132px,100%)}}
</style>'''
    if '</head>' not in s: raise SystemExit('missing head close')
    s=s.replace('</head>',css+'\n</head>',1)
    mapping="""  const USER_BADGE_INDEX={'数圈新探':0,'零点守卫':1,'分类大师':2,'精准推理':3,'运算满贯':4,'S级破案':5,'双人擂主':6,'追平高手':7,'双核连携':8,'数学全徽章':9,'核心启动':10,'连击点火':11,'第一次就对':12,'修理大师':13,'稳定核心':14,'全系统在线':15};
  function userBadgeSprite(name){const i=USER_BADGE_INDEX[name];if(i===undefined)return '<span>★</span>';const col=i%4,row=Math.floor(i/4),x=(col*100/3).toFixed(4),y=(row*100/3).toFixed(4);return `<span class=\"user-badge-sprite\" role=\"img\" aria-label=\"${name}\" style=\"background-position:${x}% ${y}%\"></span>`;}
"""
    needle='  function renderUnifiedBadges(p)'
    pos=s.find(needle)
    if pos<0: raise SystemExit('renderUnifiedBadges not found')
    s=s[:pos]+mapping+s[pos:]
    pat=r"  function renderUnifiedBadges\(p\)\{.*?\n  function renderHonorGrowth\(\)"
    m=re.search(pat,s,flags=re.S)
    if not m: raise SystemExit('renderUnifiedBadges block not found')
    new=r'''  function renderUnifiedBadges(p){
    let box=$('#unifiedBadgeGrid');if(!box||!p)return;
    let have=new Set(p.badges||[]),growth=BADGES.map(b=>({name:b.name,desc:b.desc,earned:have.has(b.id),type:'成长'}));
    let base=hqBadges(p).map(([name,icon,desc,earned])=>({name,desc,earned,type:'数学'}));
    box.innerHTML=[...base,...growth].map(b=>`<article class="unified-badge ${b.earned?'earned':''}"><div class="ub-icon">${userBadgeSprite(b.name)}</div><div><b>${b.name}</b><span>${b.desc}</span><em>${b.type} · ${b.earned?'已点亮':'未点亮'}</em></div></article>`).join('');
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
print('user badge cut patch applied')