from pathlib import Path
import re, subprocess, sys, tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
s=(root/'index.html').read_text('utf-8')
checks={
 'system marker':'data-base-theme-system="v1"',
 'base theme meta':'const BASE_THEME_META=',
 'base1 theme':'成长家园',
 'base2 theme':'农场主题',
 'base3 theme':'太空主题',
 'nine stages':'baseStageGallery',
 'complete gallery':'baseCompleteGallery',
 'hero sprite':'baseHeroSprite',
 'base1 atlas':'assets/base1_home_9.webp',
 'base2 atlas':'assets/base2_farm_9.webp',
 'base3 atlas':'assets/base3_space_9.webp',
 '90 level cap':'level<90',
 '9 level base map':'Math.floor((lv-1)/9)+1',
}
missing=[k for k,v in checks.items() if v not in s]
if 'BASE 0' in s or 'BASE0' in s: missing.append('stale BASE0')
for f in ['base1_home_9.webp','base2_farm_9.webp','base3_space_9.webp']:
    p=root/'assets'/f
    if not p.exists() or p.stat().st_size<10000: missing.append('missing '+f)
if missing: raise SystemExit('BASE theme validation failed: '+', '.join(missing))
scripts=re.findall(r'<script(?:[^>]*)>(.*?)</script>',s,flags=re.S|re.I)
with tempfile.TemporaryDirectory() as td:
    for i,js in enumerate(scripts):
        if not js.strip(): continue
        f=Path(td)/f'{i}.js'; f.write_text(js,'utf-8'); subprocess.run(['node','--check',str(f)],check=True)
print('RATIOBOT BASE theme validation passed')
