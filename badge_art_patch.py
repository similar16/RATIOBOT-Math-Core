from pathlib import Path
import re, sys, subprocess, tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'
s=p.read_text('utf-8')
MARK='badge-wall-flat-v2'
if MARK in s:
    print('Flat badge wall already applied')
    raise SystemExit(0)

css=r'''<style id="badge-wall-flat-v2">
.unified-badge-section{margin-top:22px}
.unified-badge-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.unified-badge{border:3px solid var(--ink);border-radius:18px;background:#FFFDF8;padding:10px 10px 12px;box-shadow:4px 4px 0 rgba(62,53,64,.10);display:flex;flex-direction:column;align-items:center;text-align:center;gap:7px;opacity:.72;overflow:hidden}
.unified-badge.earned{background:#FFF8DE;opacity:1;box-shadow:5px 5px 0 rgba(53,184,200,.20)}
.unified-badge .ub-icon{width:min(112px,100%);height:auto;aspect-ratio:4/5;border:0;border-radius:0;background:transparent;display:block;overflow:visible;flex:0 0 auto}
.ub-sprite{display:block;width:100%;height:100%;background-image:url('assets/badges_flat.webp');background-repeat:no-repeat;background-size:400% 400%;filter:none;transition:.18s transform,.18s filter,.18s opacity}
.unified-badge.earned:hover .ub-sprite{transform:translateY(-2px) scale(1.025)}
.unified-badge:not(.earned) .ub-sprite{filter:grayscale(1);opacity:.22}
.unified-badge b{font-size:12px;line-height:1.2}
.unified-badge span:not(.ub-sprite){display:block;margin-top:0;color:var(--muted);font-size:9px;line-height:1.45;font-weight:850}
.unified-badge em{display:inline-block;margin-top:1px;border:2px solid var(--ink);border-radius:999px;padding:2px 6px;background:#FFFDF8;font-size:8px;font-style:normal;font-weight:1000}
@media(max-width:980px){.unified-badge-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:720px){.unified-badge-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.unified-badge .ub-icon{width:min(120px,100%)}}
</style>'''
if '</head>' not in s: raise SystemExit('missing </head>')
s=s.replace('</head>',css+'\n</head>',1)

mapping="""  const FLAT_BADGE_INDEX={'数圈新探':0,'零点守卫':1,'分类大师':2,'精准推理':3,'运算满贯':4,'S级破案':5,'双人擂主':6,'追平高手':7,'双核连携':8,'数学全徽章':9,'核心启动':10,'连击点火':11,'第一次就对':12,'修理大师':13,'稳定核心':14,'全系统在线':15};
  function flatBadgeSprite(name){const i=FLAT_BADGE_INDEX[name];if(i===undefined)return '';const col=i%4,row=Math.floor(i/4),x=(col*100/3).toFixed(4),y=(row*100/3).toFixed(4);return `<span class=\"ub-sprite\" role=\"img\" aria-label=\"${name}\" style=\"background-position:${x}% ${y}%\"></span>`;}
"""
needle='  function renderUnifiedBadges(p)'
pos=s.find(needle)
if pos<0: raise SystemExit('renderUnifiedBadges not found')
s=s[:pos]+mapping+s[pos:]
pattern=r"  function renderUnifiedBadges\(p\)\{.*?\n  function renderHonorGrowth\(\)"
m=re.search(pattern,s,flags=re.S)
if not m: raise SystemExit('renderUnifiedBadges block not found')
new=r'''  function renderUnifiedBadges(p){
    let box=$('#unifiedBadgeGrid');if(!box||!p)return;
    let have=new Set(p.badges||[]),growth=BADGES.map(b=>({name:b.name,desc:b.desc,earned:have.has(b.id),type:'成长'}));
    let base=hqBadges(p).map(([name,icon,desc,earned])=>({name,desc,earned,type:'数学'}));
    box.innerHTML=[...base,...growth].map(b=>`<article class="unified-badge ${b.earned?'earned':''}"><div class="ub-icon">${flatBadgeSprite(b.name)}</div><div><b>${b.name}</b><span>${b.desc}</span><em>${b.type} · ${b.earned?'已点亮':'未点亮'}</em></div></article>`).join('');
  }
  function renderHonorGrowth()'''
s=s[:m.start()]+new+s[m.end():]
p.write_text(s,'utf-8')
if not (root/'assets'/'badges_flat.webp').exists():
    raise SystemExit('missing assets/badges_flat.webp')
scripts=re.findall(r'<script(?:[^>]*)>(.*?)</script>',s,flags=re.S|re.I)
with tempfile.TemporaryDirectory() as td:
    for i,js in enumerate(scripts):
        if not js.strip(): continue
        f=Path(td)/f's{i}.js';f.write_text(js,'utf-8')
        subprocess.run(['node','--check',str(f)],check=True)
print('Flat badge wall patch applied')
