from pathlib import Path
from PIL import Image
import re,subprocess,tempfile,os,hashlib,zipfile
root=Path(os.environ.get('SITE_DIR','_site'))
for page in root.glob('*.html'):
 text=page.read_text()
 for i,js in enumerate(re.findall(r'<script[^>]*>(.*?)</script>',text,re.S)):
  if not js.strip():continue
  with tempfile.NamedTemporaryFile('w',suffix='.js') as f:
   f.write(js);f.flush();subprocess.run(['node','--check',f.name],check=True)
for p in (root/'assets').iterdir():
 if p.suffix.lower() in ['.png','.webp','.jpg']:
  im=Image.open(p);im.load();assert min(im.size)>0,p
for i in range(1,11):
 p=root/f'assets/student-avatar-{i:02d}.png'
 assert p.exists(),p
 with Image.open(p) as im:
  im.load()
  assert min(im.size)>0,(p,im.size)
p=root/'assets/national-day-frame-2026.png'
assert p.exists(),p
with Image.open(p) as im:
 im.load()
 assert im.mode=='RGBA' and min(im.size)>=1000,(p,im.mode,im.size)
for i in range(1,17):assert (root/f'assets/badge-{i}.png').exists()
for b in [2,3]:
 for i in range(1,10):
  p=root/f'assets/base{b}-{i}.png'
  assert p.exists(),p
  with Image.open(p) as im:assert im.size==(420,420),(p,im.size)
# Preserve archived originals except BASE2/BASE3, which are intentionally replaced by the current theme artwork.
with zipfile.ZipFile('RATIOBOT_GitHub_Pages_v4.0.zip') as z:
 n=0
 for name in z.namelist():
  if '/assets/' not in name or name.endswith('/'):continue
  rel='assets/'+name.split('/assets/',1)[1]
  if re.fullmatch(r'assets/base[23]-[1-9]\\.png',rel):continue
  assert (root/rel).read_bytes()==z.read(name),rel
  n+=1
print(f'PASS syntax, complete image decoding, 16 badges, 18 current 420px theme stages, {n} archived assets byte-identical')
# Display variants must be smaller, decodable and preserve transparency.
import json
manifest=json.loads((root/'image-optimization.json').read_text())
assert manifest,'image optimization must produce display variants'
for item in manifest:
 original=root/item['source']; variant=root/item['web']
 assert original.exists() and variant.exists(),item
 assert variant.stat().st_size<original.stat().st_size,item
 with Image.open(variant) as im:
  im.load(); assert max(im.size)<=960,item
  if 'frame-2026' in item['source']:assert im.mode=='RGBA',item
html=(root/'index.html').read_text()
assert 'alt="${o.name}" loading="lazy"' in html
print('PASS optimized image sizes, transparency and deferred outfit images')

for frame in ['autumn-break-frame-2026-original.jpeg', 'autumn-break-frame-2026.png']:
 p=root/'assets'/frame
 assert p.read_bytes()==(Path('site/assets')/frame).read_bytes()
 with Image.open(p) as im:
  im.load()
  assert im.size==(1254,1254)
  if p.suffix=='.png':
   assert im.mode=='RGBA' and im.getpixel((627,627))[3]==0
   assert im.getpixel((0,0))[3]==0
assert hashlib.sha256((root/'assets/autumn-break-frame-2026-original.jpeg').read_bytes()).hexdigest()=='806ba3cb609d0832b88276678ba0ddc79982929345f304d8f5412de47528af69'
home_autumn=re.search(r'<section\b[^>]*\bid="autumnHome"[^>]*>(.*?)</section>',html,re.S)
assert home_autumn and 'src="assets/autumn-break-frame-2026.png"' in home_autumn[1]
assert html.count('src="assets/autumn-break-frame-2026-original.jpeg"')==1
assert "url('assets/autumn-break-frame-2026.png')" in html
assert 'assets/autumn-break-frame-2026.png' in (root/'autumn-break.js').read_text()
assert not any('autumn-break-frame' in item['source'] for item in manifest)
print('PASS original autumn artwork with a transparent homepage preview and full-size overlay')

# New exploration stages retain alpha and are delivered as small independent sprites.
for b in [4,5]:
 for i in range(1,10):
  p=root/f"assets/base{b}-{i}.webp"
  assert p.stat().st_size < 100_000,p
  with Image.open(p) as im:
   im.load();assert im.size==(420,420) and im.mode=="RGBA",p
   assert im.getpixel((0,0))[3]==0,p
print("PASS 18 transparent web-sized ocean and forest stages")
