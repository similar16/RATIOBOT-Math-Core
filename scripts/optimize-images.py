"""Build web-sized artwork without altering archived/print originals."""
from pathlib import Path
from PIL import Image
import hashlib,json,re
root=Path('_site')
texts=list(root.glob('*.html'))+list(root.glob('*.js'))+list(root.glob('*.css'))
contents={p:p.read_text() for p in texts}
joined='\n'.join(contents.values())
paths=set(re.findall(r'assets/[A-Za-z0-9_./-]+\.png',joined))
replacements={}; stats=[]
for rel in sorted(paths):
 # Portrait paths are persisted identifiers, not just display URLs.
 if 'student-avatar-' in rel or 'teacher-avatar-' in rel:continue
 p=root/rel
 if not p.exists(): continue
 with Image.open(p) as source:
  if getattr(source,'is_animated',False):continue
  im=source.convert('RGBA')
  limit=960 if 'd80cfb93c913' in rel else 512
  im.thumbnail((limit,limit),Image.Resampling.LANCZOS)
  import io
  out=io.BytesIO();im.save(out,format='WEBP',quality=88,method=6)
  data=out.getvalue()
 if len(data)>=p.stat().st_size*.9:continue
 name=p.stem+'.'+hashlib.sha256(data).hexdigest()[:12]+'.webp'
 target=p.with_name(name);target.write_bytes(data)
 replacements[rel]=target.relative_to(root).as_posix()
 stats.append({'source':rel,'web':replacements[rel],'before':p.stat().st_size,'after':len(data),'size':list(im.size)})
for p,text in contents.items():
 for src,dst in replacements.items():
  text=re.sub(re.escape(src)+r'(?:\?v=[A-Za-z0-9_-]+)?',lambda m:dst,text)
 p.write_text(text)
(root/'image-optimization.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2))
print('Image variants:',len(stats),'bytes:',sum(s['before'] for s in stats),'->',sum(s['after'] for s in stats))
