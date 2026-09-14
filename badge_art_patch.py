from pathlib import Path
import re, sys, subprocess, tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'
s=p.read_text('utf-8')
MARK='badge-wall-flat-v3'
if MARK in s:
    print('Badge wall image fallback already applied')
    raise SystemExit(0)

css=r'''<style id="badge-wall-flat-v3">
.unified-badge-section{margin-top:22px}
.unified-badge-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.unified-badge{border:3px solid var(--ink);border-radius:18px;background:#FFFDF8;padding:10px 10px 12px;box-shadow:4px 4px 0 rgba(62,53,64,.10);display:flex;flex-direction:column;align-items:center;text-align:center;gap:7px;opacity:.72;overflow:hidden}
.unified-badge.earned{background:#FFF8DE;opacity:1;box-shadow:5px 5px 0 rgba(53,184,200,.20)}
.unified-badge .ub-icon{width:min(112px,100%);height:auto;aspect-ratio:1/1;border:0;border-radius:15px;background:transparent;display:grid;place-items:center;overflow:hidden;flex:0 0 auto}
.unified-badge .ub-icon img{display:block;width:100%;height:100%;object-fit:contain;transition:.18s transform,.18s filter,.18s opacity}
.unified-badge.earned:hover .ub-icon img{transform:translateY(-2px) scale(1.025)}
.unified-badge:not(.earned) .ub-icon img{filter:grayscale(1);opacity:.24}
.unified-badge b{font-size:12px;line-height:1.2}
.unified-badge span{display:block;margin-top:0;color:var(--muted);font-size:9px;line-height:1.45;font-weight:850}
.unified-badge em{display:inline-block;margin-top:1px;border:2px solid var(--ink);border-radius:999px;padding:2px 6px;background:#FFFDF8;font-size:8px;font-style:normal;font-weight:1000}
@media(max-width:980px){.unified-badge-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:720px){.unified-badge-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.unified-badge .ub-icon{width:min(120px,100%)}}
</style>'''
if '</head>' not in s: raise SystemExit('missing </head>')
s=s.replace('</head>',css+'\n</head>',1)

# Remove the older sprite helper if a prior deployment injected it.
s=re.sub(r"\n?  const FLAT_BADGE_INDEX=\{.*?function flatBadgeSprite\(name\)\{.*?\}\n",'\n',s,flags=re.S)
pattern=r"  function renderUnifiedBadges\(p\)\{.*?\n  function renderHonorGrowth\(\)"
m=re.search(pattern,s,flags=re.S)
if not m: raise SystemExit('renderUnifiedBadges block not found')
new=r'''  function renderUnifiedBadges(p){
    let box=$('#unifiedBadgeGrid');if(!box||!p)return;
    let have=new Set(p.badges||[]),growth=BADGES.map(b=>({name:b.name,icon:b.icon,desc:b.desc,earned:have.has(b.id),img:UNIFIED_BADGE_ART[b.name]||'',type:'成长'}));
    let base=hqBadges(p).map(([name,icon,desc,earned])=>({name,icon,desc,earned,img:UNIFIED_BADGE_ART[name]||'',type:'数学'}));
    box.innerHTML=[...base,...growth].map(b=>`<article class="unified-badge ${b.earned?'earned':''}"><div class="ub-icon">${b.img?`<img src="${b.img}" alt="${b.name}" loading="lazy">`:`<span>${b.icon||'★'}</span>`}</div><div><b>${b.name}</b><span>${b.desc}</span><em>${b.type} · ${b.earned?'已点亮':'未点亮'}</em></div></article>`).join('');
  }
  function renderHonorGrowth()'''
s=s[:m.start()]+new+s[m.end():]
p.write_text(s,'utf-8')

# Validate that the 16 mapped image assets actually exist in the unpacked site.
asset_refs=set(re.findall(r"['\"](assets/img_[^'\"]+\.(?:png|webp|svg))['\"]",s))
missing=[x for x in asset_refs if not (root/x).exists()]
if missing: raise SystemExit('missing badge/image assets: '+', '.join(sorted(missing)[:8]))

scripts=re.findall(r'<script(?:[^>]*)>(.*?)</script>',s,flags=re.S|re.I)
with tempfile.TemporaryDirectory() as td:
    for i,js in enumerate(scripts):
        if not js.strip(): continue
        f=Path(td)/f's{i}.js';f.write_text(js,'utf-8')
        subprocess.run(['node','--check',str(f)],check=True)
print('Badge wall PNG fallback patch applied')
