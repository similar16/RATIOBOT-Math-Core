const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict');
const dom=new JSDOM('<!doctype html><div id="studentProfileContent"></div>',{runScripts:'outside-only',url:'https://test.local'}),w=dom.window;
w.RatioProfileBridge={
  earnedBadges:()=>['核心启动','数圈新探'],
  badgeImg:n=>'<img src="badge-'+n+'.png">',
  defaultAvatar:()=> 'default.png',
  today:()=>({points:22,checked:true,full:false})
};
w.eval(fs.readFileSync('site/student-profile.js','utf8'));
const client={from(){return {}}};
const row={user_id:'u1',display_name:'17号小方',level:12,base_level:2,streak:5,badge_count:2,public_card_enabled:true,avatar_key:'level:12|frame:midautumn2026',custom_avatar:'data:image/png;base64,AA==',public_training:{history:[{game:'rings',accuracy:90}]},profile_card:{theme:'detective',title:'分类侦探',featured_badges:['数圈新探'],show_recent:true}};
w.StudentProfileCard.hydrate(row,{classId:'c1',className:'七年级29班',studentCode:'17'},client);
assert.match(w.StudentProfileCard.avatarSrc('fallback'),/AA/);
assert.equal(w.StudentProfileCard.card().theme,'detective');
assert.equal(w.StudentProfileCard.frameOn(),true);
w.StudentProfileCard.render();
const html=w.document.querySelector('#studentProfileContent').innerHTML;
assert.match(html,/个人头像/);assert.match(html,/for="profileAvatarFile"/);assert.match(html,/分类侦探/);assert.match(html,/22\/40 R/);assert.match(html,/数圈新探/);assert.match(html,/midautumn-frame-2026-clear/);
console.log('PASS student profile: custom avatar, mission card theme, featured badges and frame');
w.close();