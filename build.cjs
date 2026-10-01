const fs=require('fs'),{execFileSync}=require('child_process');
fs.rmSync('_site',{recursive:true,force:true});fs.cpSync('site','_site',{recursive:true});
execFileSync('python',['-c',`from pathlib import Path
import zipfile
with zipfile.ZipFile('RATIOBOT_GitHub_Pages_v4.0.zip') as z:
 for n in z.namelist():
  if '/assets/' in n and not n.endswith('/'):
   rel=n.split('/assets/',1)[1]
   if rel.startswith(('base2-','base3-')) and rel.endswith('.png'):continue
   p=Path('_site/assets')/rel;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(n))`]);
// Build standalone student portrait PNGs from the exact supplied contact sheet.
// External SVG <image> references are unreliable when the SVG itself is used as <img> on iOS/WebKit.
execFileSync('python',['-c',`from pathlib import Path
from PIL import Image
import re
sheet=Image.open('_site/assets/student-avatar-sheet.png').convert('RGBA')
for svg in sorted(Path('site/assets').glob('student-avatar-??.svg')):
    text=svg.read_text()
    vb=re.search(r'viewBox="0 0 ([0-9.]+) ([0-9.]+)"',text)
    im=re.search(r'<image[^>]*x="(-?[0-9.]+)"[^>]*y="(-?[0-9.]+)"[^>]*width="([0-9.]+)"[^>]*height="([0-9.]+)"',text)
    if not vb or not im: raise SystemExit(f'cannot parse {svg}')
    vw,vh=map(float,vb.groups()); x,y,iw,ih=map(float,im.groups())
    sx,sy=sheet.width/iw,sheet.height/ih
    left=int(round(-x*sx)); top=int(round(-y*sy))
    right=int(round(left+vw*sx)); bottom=int(round(top+vh*sy))
    crop=sheet.crop((left,top,right,bottom))
    crop.save(Path('_site/assets')/(svg.stem+'.png'),optimize=True)
`]);
// Generate the National Day frame asset at build time in the approved low-brightness RATIOBOT style.
execFileSync('python',['-c',`from PIL import Image,ImageDraw
from pathlib import Path
S=1200; im=Image.new('RGBA',(S,S),(0,0,0,0)); d=ImageDraw.Draw(im)
ink=(62,53,64,255); gold=(202,162,76,255); red=(153,70,63,255); red2=(174,79,69,255); cream=(246,240,230,255); green=(101,131,106,255)
# circular double ring
for w,col,r in [(34,ink,438),(25,gold,438),(12,cream,405)]:
 d.ellipse((S//2-r,S//2-r,S//2+r,S//2+r),outline=col,width=w)
# restrained red ribbon arcs
d.arc((115,80,1085,1015),195,350,fill=ink,width=55);d.arc((115,80,1085,1015),195,350,fill=red,width=39)
d.arc((130,170,1070,1110),15,165,fill=ink,width=55);d.arc((130,170,1070,1110),15,165,fill=red2,width=39)
# flag upper-left
d.line((205,130,205,345),fill=ink,width=24);d.line((205,130,205,345),fill=gold,width=12)
d.polygon([(210,145),(450,175),(405,325),(210,295)],fill=ink)
d.polygon([(220,160),(430,185),(392,307),(220,282)],fill=red)
# flag stars
def star(cx,cy,r,col):
 import math
 pts=[]
 for i in range(10):
  a=-math.pi/2+i*math.pi/5; rr=r if i%2==0 else r*.42
  pts.append((cx+math.cos(a)*rr,cy+math.sin(a)*rr))
 d.polygon(pts,fill=col)
star(275,215,34,gold)
for x,y in [(335,190),(365,225),(350,265),(310,275)]:star(x,y,12,gold)
# lantern right
d.rounded_rectangle((900,455,1060,650),35,fill=ink);d.rounded_rectangle((914,470,1046,635),30,fill=red)
d.rectangle((945,438,1015,475),fill=ink);d.rectangle((955,448,1005,470),fill=gold)
d.line((980,635,980,720),fill=ink,width=18);d.line((980,635,980,710),fill=red2,width=9)
# small stars / leaves
for x,y,r in [(840,250,28),(865,795,24),(310,850,22),(190,690,17)]:star(x,y,r,gold)
for x,y in [(235,810),(280,835),(900,820)]:
 d.ellipse((x-34,y-16,x+34,y+16),fill=ink);d.ellipse((x-27,y-11,x+27,y+11),fill=green)
# simple RATIOBOT mascot lower-left
d.rounded_rectangle((155,710,365,900),42,fill=ink);d.rounded_rectangle((170,725,350,885),35,fill=(231,190,79,255))
d.ellipse((215,785,235,805),fill=ink);d.ellipse((285,785,305,805),fill=ink);d.arc((230,790,290,840),10,170,fill=ink,width=9)
d.polygon([(170,735),(220,690),(330,700),(350,750)],fill=ink);d.polygon([(185,730),(225,705),(325,714),(340,744)],fill=red)
# cloud accents
for cx,cy in [(790,165),(965,325),(700,955)]:
 d.ellipse((cx-65,cy-30,cx+30,cy+35),fill=ink);d.ellipse((cx-25,cy-50,cx+65,cy+35),fill=ink)
 d.ellipse((cx-55,cy-20,cx+25,cy+25),fill=cream);d.ellipse((cx-20,cy-40,cx+55,cy+25),fill=cream)
Path('_site/assets').mkdir(parents=True,exist_ok=True);im.save('_site/assets/national-day-frame-2026.png',optimize=True)
`]);
fs.copyFileSync('node_modules/@supabase/supabase-js/dist/umd/supabase.js','_site/assets/supabase.min.js');
// Recognition resources stay on the same origin and load only when importing.
const vendor='_site/assets/import';fs.mkdirSync(vendor+'/core',{recursive:true});fs.mkdirSync(vendor+'/lang',{recursive:true});
fs.copyFileSync('node_modules/jszip/dist/jszip.min.js',vendor+'/jszip.min.js');
for(const name of ['tesseract.min.js','worker.min.js'])fs.copyFileSync('node_modules/tesseract.js/dist/'+name,vendor+'/'+name);
for(const name of fs.readdirSync('node_modules/tesseract.js-core'))if(name.endsWith('.wasm.js'))fs.copyFileSync('node_modules/tesseract.js-core/'+name,vendor+'/core/'+name);
for(const lang of ['chi_sim','eng'])fs.copyFileSync('node_modules/@tesseract.js-data/'+lang+'/4.0.0_best_int/'+lang+'.traineddata.gz',vendor+'/lang/'+lang+'.traineddata.gz');
fs.cpSync('node_modules/katex/dist',vendor+'/katex',{recursive:true});
for(const [pkg,name] of [['jszip','LICENSE.markdown'],['tesseract.js','LICENSE.md'],['tesseract.js-core','LICENSE'],['katex','LICENSE']]){const source='node_modules/'+pkg+'/'+name;if(fs.existsSync(source))fs.copyFileSync(source,vendor+'/'+pkg+'-LICENSE.txt');}
// Tie local JS/CSS requests to their contents so old browser caches cannot mix releases.
const {createHash}=require('crypto');
let entry=fs.readFileSync('_site/index.html','utf8');
entry=entry.replace(/(src|href)="([^":?]+\.(?:js|css))"/g,(all,attr,file)=>{
 const target='_site/'+file;if(!fs.existsSync(target))return all;
 const hash=createHash('sha256').update(fs.readFileSync(target)).digest('hex').slice(0,12);
 return attr+'="'+file+'?v='+hash+'"';
});
fs.writeFileSync('_site/index.html',entry);
fs.writeFileSync('_site/.nojekyll','');
fs.writeFileSync('_site/build-info.json',JSON.stringify({commit:process.env.GITHUB_SHA||'local',version:'integrated-1'}));
console.log('Complete site prepared');
