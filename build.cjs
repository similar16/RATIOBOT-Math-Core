const fs=require('fs'),{execFileSync}=require('child_process');
fs.rmSync('_site',{recursive:true,force:true});fs.cpSync('site','_site',{recursive:true});
execFileSync('python',['-c',`from pathlib import Path
import zipfile
with zipfile.ZipFile('RATIOBOT_GitHub_Pages_v4.0.zip') as z:
 for n in z.namelist():
  if '/assets/' in n and not n.endswith('/'):
   p=Path('_site/assets')/n.split('/assets/',1)[1];p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(n))`]);
fs.copyFileSync('node_modules/@supabase/supabase-js/dist/umd/supabase.js','_site/assets/supabase.min.js');
// Recognition resources stay on the same origin and load only when importing.
const vendor='_site/assets/import';fs.mkdirSync(vendor+'/core',{recursive:true});fs.mkdirSync(vendor+'/lang',{recursive:true});
fs.copyFileSync('node_modules/jszip/dist/jszip.min.js',vendor+'/jszip.min.js');
for(const name of ['tesseract.min.js','worker.min.js'])fs.copyFileSync('node_modules/tesseract.js/dist/'+name,vendor+'/'+name);
for(const name of fs.readdirSync('node_modules/tesseract.js-core'))if(name.endsWith('.wasm.js'))fs.copyFileSync('node_modules/tesseract.js-core/'+name,vendor+'/core/'+name);
for(const lang of ['chi_sim','eng'])fs.copyFileSync('node_modules/@tesseract.js-data/'+lang+'/4.0.0_best_int/'+lang+'.traineddata.gz',vendor+'/lang/'+lang+'.traineddata.gz');
fs.cpSync('node_modules/katex/dist',vendor+'/katex',{recursive:true});
for(const [pkg,name] of [['jszip','LICENSE.markdown'],['tesseract.js','LICENSE.md'],['tesseract.js-core','LICENSE'],['katex','LICENSE']]){const source='node_modules/'+pkg+'/'+name;if(fs.existsSync(source))fs.copyFileSync(source,vendor+'/'+pkg+'-LICENSE.txt');}
fs.writeFileSync('_site/.nojekyll','');
fs.writeFileSync('_site/build-info.json',JSON.stringify({commit:process.env.GITHUB_SHA||'local',version:'integrated-1'}));
console.log('Complete site prepared');
