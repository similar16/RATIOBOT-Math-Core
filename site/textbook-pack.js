/* RATIOBOT: teacher-only 2026 textbook ZIP import and private image resolver. */
(function(){
'use strict';
var BUCKET='classroom-textbook', PREFIX='suke2026-v2-', SCHEMA='suke-grade7-math-vol1-2026-lesson-entries';
var TYPE={
 '活动':['knowledge','activity'],'尝试':['knowledge','attempt'],
 '问题':['knowledge','question'],'探究':['knowledge','explore'],
 '讨论':['knowledge','discussion'],'例题':['example',null],
 '练习':['practice',null]
};
function keyFor(i){return PREFIX+String(i+1).padStart(2,'0');}
function isNew(key){return String(key||'').startsWith(PREFIX);}
function chooseCatalog(rows){
 var fresh=(rows||[]).filter(function(x){return isNew(x.lesson_key);});
 var keys=new Set(fresh.map(function(x){return x.lesson_key;}));
 if(fresh.length===54&&keys.size===54&&Array.from({length:54},function(_,i){return keyFor(i);}).every(function(k){return keys.has(k);}))
  return fresh.sort(function(a,b){return a.lesson_key.localeCompare(b.lesson_key);});
 return (rows||[]).filter(function(x){return !isNew(x.lesson_key);});
}
function text(v){return String(v==null?'':v);}
function collectImages(item){
 var media=Array.isArray(item.media)?item.media:[];
 if(item.content&&item.content.kind==='original-image'){
  return media.filter(function(m){return ['original-exercise-or-question','continuation-of-exercise','figure-or-dialogue-reference'].includes(m.role);});
 }
 var figures=media.filter(function(m){return ['original-transparent-figure','figure-or-dialogue-reference'].includes(m.role);});
 var t=text(item.content?.text_latex||item.content?.text_plain);
 if(!figures.length&&/如图|图\d|图\s*\d|下图|示意图|观察图/.test(t)){
  figures=media.filter(function(m){return m.role==='original-column-reference';}).slice(0,1);
 }
 return figures;
}
function convertLesson(L,i,byPath,classId){
 var sections={warmup:[],intro:[],knowledge:[],example:[],practice:[],exit:[]};
 var references=[];
 (L.items||[]).forEach(function(item,j){
  var dest=TYPE[item.type];if(!dest)return;
  var source=Array.isArray(item.media)?item.media:[];
  var selected=collectImages(item);
  var assets=selected.map(function(m){return byPath[m.path];}).filter(Boolean);
  if(!assets.length&&item.content?.kind==='original-image'){
   throw Error(L.name+' 的 '+item.type+' 缺少原版彩框图片');
  }
  var original=item.content?.kind==='original-image';
  var body=original?'':text(item.content?.text_latex||item.content?.text_plain||'');
  var pg=Number(item.page)||Number(L.printed_start)||0;
  var p={
   id:'textbook-'+keyFor(i)+'-'+(j+1),title:item.type+(item.label&&item.label!==item.type?' · '+item.label:'')+'｜教材P'+pg,
   body:body,images:[],assetKeys:assets.slice(0,8),imageOriginal:original,
   sourcePage:pg,sourceKind:'textbook-2026',sourceOrder:j+1,
   requiresCheck:item.content?.latex_review_status!=='checked-against-original'&&!original,
   ...(dest[1]?{branch:dest[1]}:{})
  };
  sections[dest[0]].push(p);
  references.push({order:j+1,type:item.type,page:pg,
    textStatus:original?'image-original':text(item.content?.latex_review_status||'auto-extracted'),
    allMedia:source.map(function(m){return {role:m.role,path:m.path,objectKey:byPath[m.path]||null};})
  });
 });
 return {
  class_id:classId,lesson_key:keyFor(i),title:text(L.name).slice(0,160),
  section:text(L.section).slice(0,24),
  first_page:Number(L.printed_start)||1,last_page:Number(L.practice_end_page||L.practice_page||L.printed_end)||1,
  data:{
   schema:'RATIOBOT_TEXTBOOK_2026_V2',title:text(L.name),section:text(L.section),
   unit:text(L.section_name),ordinal:i+1,firstPage:Number(L.printed_start)||1,
   lastPage:Number(L.practice_end_page||L.practice_page||L.printed_end)||1,
   sections:sections,references:references,imageBucket:BUCKET,
   sourceDataset:SCHEMA,sourceCount:(L.items||[]).length
  },
  updated_at:new Date().toISOString()
 };
}
function validate(data,zip){
 if(!data||data.dataset_id!==SCHEMA||!Array.isArray(data.lessons)||data.lessons.length!==54)
  throw Error('不是本次2026苏科版54课时JSON');
 var n=0, keys=new Set();
 data.lessons.forEach(function(L,i){
  if(!L.id||!Array.isArray(L.items)||!L.items.length)throw Error('第'+(i+1)+'课时结构不完整');
  if(keys.has(L.id))throw Error('课时编号重复：'+L.id);
  keys.add(L.id);n+=L.items.length;
  if(L.items[L.items.length-1].type!=='练习')throw Error('第'+(i+1)+'课时没有以练习结束');
 });
 if(n!==224)throw Error('栏目总数不一致：'+n);
 if(!Array.isArray(data.assets_manifest)||data.assets_manifest.length!==356)throw Error('图片清单不完整');
 var total=0;
 for(var a of data.assets_manifest){
  if(!/^assets\/[^/]+\.png$/i.test(a.path)||!zip.file(a.path))throw Error('缺少图片：'+a.path);
  total+=Number(a.bytes)||0;
 }
 if(total>90e6)throw Error('解压后图片总量异常');
 return data;
}
function toHex(buf){return Array.from(new Uint8Array(buf)).map(function(x){return x.toString(16).padStart(2,'0');}).join('');}
async function importZip(file,opt){
 if(!file||!opt||!opt.sb||!opt.user||!opt.classId||!opt.teacher)throw Error('请在教师端登录并选定班级');
 if(!window.JSZip)throw Error('ZIP组件未加载，请刷新页面重试');
 if(file.size>85e6)throw Error('教材ZIP超过85MB限制');
 var status=typeof opt.progress==='function'?opt.progress:function(){};
 status('读取教材压缩包…');
 var zip=await window.JSZip.loadAsync(file,{checkCRC32:true});
 var names=Object.keys(zip.files).filter(function(n){return /\.json$/i.test(n)&&!/\/assets\//.test(n);});
 if(names.length!==1)throw Error('请上传包含一个主JSON和assets图片目录的教材ZIP');
 var doc=validate(JSON.parse(await zip.file(names[0]).async('string')),zip);
 var classId=opt.classId,byPath={};
 for(var a of doc.assets_manifest){
  if(!/^[a-f0-9]{64}$/i.test(a.sha256||''))throw Error('图片校验码缺失：'+a.path);
  byPath[a.path]=classId+'/suke2026-v2/'+a.sha256.slice(0,36)+'.png';
 }
 // Dry run all lessons before any remote writes.
 var rows=doc.lessons.map(function(L,i){return convertLesson(L,i,byPath,classId);});
 var previous=await opt.sb.from('classroom_curriculum_resources').select('lesson_key').eq('class_id',classId);
 if(previous.error)throw previous.error;
 status('已验证54课时、224个栏目和356张图片；开始上传私有图片…');
 var queued=doc.assets_manifest.slice(),done=0,fail=null,workers=5;
 async function worker(){
  while(queued.length&&!fail){
   var asset=queued.shift();if(!asset)break;
   try{
    var bytes=await zip.file(asset.path).async('uint8array');
    if(bytes.byteLength!==Number(asset.bytes))throw Error('文件大小异常：'+asset.path);
    var digest=toHex(await crypto.subtle.digest('SHA-256',bytes));
    if(digest!==asset.sha256.toLowerCase())throw Error('校验失败：'+asset.path);
    var result=await opt.sb.storage.from(BUCKET).upload(byPath[asset.path],new Blob([bytes],{type:'image/png'}),{contentType:'image/png',upsert:true,cacheControl:'31536000'});
    if(result.error)throw result.error;
    done++;if(done%10===0||done===doc.assets_manifest.length)status('已验证并保存图片 '+done+'/356');
   }catch(e){fail=e;break;}
  }
 }
 await Promise.all(Array.from({length:workers},worker));
 if(fail)throw Error('图片上传停在 '+done+'/356：'+(fail.message||fail)+'；旧版教材仍在使用');
 // Upserts are staged separately from old keys. The UI switches to new only when all 54 rows exist.
 var written=0;
 for(var row of rows){
  row.owner_id=opt.user.id;
  var out=await opt.sb.from('classroom_curriculum_resources').upsert(row,{onConflict:'class_id,lesson_key'});
  if(out.error)throw Error('保存第'+(written+1)+'课时失败：'+out.error.message);
  written++;if(written%5===0||written===54)status('已保存新版课时 '+written+'/54');
 }
 var result=await opt.sb.from('classroom_curriculum_resources').select('lesson_key').eq('class_id',classId);
 if(result.error)throw result.error;
 if(chooseCatalog(result.data||[]).filter(function(x){return isNew(x.lesson_key);}).length!==54)throw Error('新版索引核对未通过');
 status('✓ 新版54课时、224栏目、356张原图已存入教师云端资源库。旧版已保留回退。');
 return {lessons:54,entries:224,assets:356};
}
async function imageAsData(sb,objectKey){
 var r=await sb.storage.from(BUCKET).download(objectKey);
 if(r.error)throw r.error;
 var blob=r.data;
 function base64(b){return new Promise(function(resolve,reject){var reader=new FileReader();reader.onload=function(){resolve(reader.result);};reader.onerror=reject;reader.readAsDataURL(b);});}
 // The original transparent PNG is immutable in private storage. A large image
 // gets a temporary projection-sized WebP only for the daily lesson payload.
 if(blob.size<690000)return base64(blob);
 var bmp=await createImageBitmap(blob),canvas=document.createElement('canvas');
 var factor=1,thumb=null;
 while(factor>=0.24){
  canvas.width=Math.max(1,Math.round(bmp.width*factor));canvas.height=Math.max(1,Math.round(bmp.height*factor));
  canvas.getContext('2d').drawImage(bmp,0,0,canvas.width,canvas.height);
  thumb=await new Promise(function(resolve){canvas.toBlob(resolve,'image/webp',0.87);});
  if(thumb&&thumb.size<680000)break;
  factor*=0.78;
 }
 if(typeof bmp.close==='function')bmp.close();
 if(!thumb)throw Error('无法生成课堂预览图片');
 return base64(thumb);
}
async function resolveSections(sections,sb,progress){
 var cache=new Map(),n=0;
 var copy=JSON.parse(JSON.stringify(sections||{}));
 for(var group of Object.keys(copy)){
  for(var page of copy[group]||[]){
   var paths=Array.isArray(page.assetKeys)?page.assetKeys:[];
   var images=[];
   for(var path of paths.slice(0,8)){
    if(!cache.has(path))cache.set(path,await imageAsData(sb,path));
    images.push(cache.get(path));n++;
    if(progress)progress('正在读取本课时教材原图 '+n+' 张…');
   }
   page.images=images;
  }
 }
 return copy;
}
window.TextbookPack2026={importZip:importZip,chooseCatalog:chooseCatalog,resolveSections:resolveSections,isNew:isNew,BUCKET:BUCKET};
})();