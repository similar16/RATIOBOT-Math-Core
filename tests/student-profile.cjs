const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const dom=new JSDOM('<!doctype html><div id="studentProfileContent"></div>',{runScripts:'outside-only',url:'https://test.local'}),w=dom.window;
let frameEquipped=true;w.RatioProfileBridge={earnedBadges:()=>['核心启动','数圈新探'],badgeImg:n=>'<img src="badge-'+n+'.png">',defaultAvatar:()=> 'default.png',today:()=>({points:22,checked:true,full:false}),frameState:()=>({unlocked:true,equipped:frameEquipped}),toggleFrame:async()=>{frameEquipped=!frameEquipped;return frameEquipped}};
w.eval(fs.readFileSync('site/student-profile.js','utf8'));
const row={user_id:'u1',display_name:'17号小方',level:12,base_level:2,streak:5,badge_count:2,public_card_enabled:true,avatar_key:'level:12|frame:midautumn2026',custom_avatar:'assets/student-avatar-03.svg',public_training:{history:[{game:'rings',accuracy:90}]},profile_card:{theme:'detective',title:'分类侦探',featured_badges:['数圈新探'],show_recent:true}};
const chain={payload:null,update(payload){this.payload=payload;return this},eq(){return this},select(){return this},async single(){return {data:{...row,...this.payload},error:null}}};
const client={from(){return chain}};
w.StudentProfileCard.hydrate(row,{classId:'c1',className:'七年级29班',studentCode:'17'},client);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(sha('site/assets/student-avatar-sheet.png'),'fe7d29282378dd3b8cb57cc55332578e519a2ae5ce23552ac4855a9e67b7ac32','student sheet must remain the exact supplied original');
assert.equal(sha('site/assets/teacher-avatar-fixed.png'),'0ce073790924c3151998c7d858dd81f80e9f804ba84b4eae9020eb06bdb03b09','teacher avatar must remain the exact supplied original');
for(let i=1;i<=10;i++){const n=String(i).padStart(2,'0'),svg=fs.readFileSync('site/assets/student-avatar-'+n+'.svg','utf8');assert.match(svg,/student-avatar-sheet\.png/,'portrait '+n+' must crop the original sheet rather than redraw it');}
assert.match(fs.readFileSync('site/assets/teacher-avatar-fixed.svg','utf8'),/teacher-avatar-fixed\.png/,'teacher wrapper must use exact original');
assert.equal(w.StudentProfileCard.portraits().length,10);
assert.equal(w.StudentProfileCard.avatarSrc('fallback'),'assets/student-avatar-03.png');
assert.equal(w.StudentProfileCard.frameOn(),true);
w.StudentProfileCard.render();
const d=w.document;
assert.equal(d.querySelectorAll('[data-avatar-choice]').length,11);
assert.equal(d.querySelector('input[type="file"]'),null);
assert.doesNotMatch(d.querySelector('#studentProfileContent').textContent,/上传图片|上传 \/ 修改头像/);
assert.match(d.querySelector('#studentProfileContent').innerHTML,/midautumn-frame-2026-clear/);
assert.ok(d.querySelector('#profileFrameToggle'),'unlocked frame must remain accessible from profile after being removed');
assert.match(d.querySelector('#studentProfileContent').textContent,/可选头像/);
assert.match(d.querySelector('#studentProfileContent').textContent,/外观收藏/);
const choice=d.querySelector('[data-avatar-choice="assets/student-avatar-08.png"]');choice.click();
assert.equal(d.querySelector('.mission-avatar-img').getAttribute('src'),'assets/student-avatar-08.png');
const built=process.env.SITE_DIR||'_site';for(let i=1;i<=10;i++){const n=String(i).padStart(2,'0');assert.ok(fs.existsSync(built+'/assets/student-avatar-'+n+'.png'),'built portrait '+n+' must exist as standalone PNG');}
console.log('PASS student profile: 10 visible PNG choices, old SVG values migrate, permanent frame collection, no avatar upload');w.close();