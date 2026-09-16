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
for i in range(1,17):assert (root/f'assets/badge-{i}.png').exists()
for b in [2,3]:
 for i in range(1,10):assert (root/f'assets/base{b}-{i}.png').exists()
# Preserve all original files, including graphics not currently visible.
with zipfile.ZipFile('RATIOBOT_GitHub_Pages_v4.0.zip') as z:
 n=0
 for name in z.namelist():
  if '/assets/' not in name or name.endswith('/'):continue
  rel='assets/'+name.split('/assets/',1)[1]
  assert (root/rel).read_bytes()==z.read(name),rel
  n+=1
print(f'PASS syntax, complete image decoding, 16 badges, 18 restored theme stages, {n} original assets byte-identical')
