const fs=require('fs'),{execFileSync}=require('child_process');
fs.rmSync('_site',{recursive:true,force:true});fs.cpSync('site','_site',{recursive:true});
execFileSync('python',['-c',`from pathlib import Path
import zipfile
with zipfile.ZipFile('RATIOBOT_GitHub_Pages_v4.0.zip') as z:
 for n in z.namelist():
  if '/assets/' in n and not n.endswith('/'):
   p=Path('_site/assets')/n.split('/assets/',1)[1];p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(n))`]);
fs.copyFileSync('node_modules/@supabase/supabase-js/dist/umd/supabase.js','_site/assets/supabase.min.js');
fs.writeFileSync('_site/.nojekyll','');
fs.writeFileSync('_site/build-info.json',JSON.stringify({commit:process.env.GITHUB_SHA||'local',version:'integrated-1'}));
console.log('Complete site prepared');
