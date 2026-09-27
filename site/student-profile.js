(function(){
'use strict';
const THEMES=[
  {id:'sun',name:'总部黄',note:'任务总部 / 成长卡'},
  {id:'detective',name:'侦探蓝',note:'数圈侦探 / 推理卡'},
  {id:'forest',name:'成长绿',note:'连续打卡 / 成长卡'},
  {id:'graphite',name:'夜航灰',note:'挑战任务 / 极简卡'}
];
const TITLES=['数学任务员','运算突击手','分类侦探','秘密房间探索者','连续打卡中','BASE 建造员'];
let client=null,row=null,meta={classId:'',className:'',studentCode:''};

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function normalizeCard(v){
  const x=v&&typeof v==='object'?v:{},theme=THEMES.some(t=>t.id===x.theme)?x.theme:'sun',
    title=TITLES.includes(x.title)?x.title:'数学任务员',
    featured=Array.isArray(x.featured_badges)?x.featured_badges.filter(Boolean).slice(0,3):[];
  return {theme,title,featured_badges:featured,show_recent:x.show_recent!==false};
}
function hydrate(profileRow,extra={}){
  row=profileRow?{...profileRow,profile_card:normalizeCard(profileRow.profile_card)}:null;
  meta={...meta,...extra};
  window.dispatchEvent(new CustomEvent('ratiobot-profile-card-hydrated'));
  return row;
}
async function load(c,userId,classId,extra={}){
  client=c||client;meta={...meta,...extra,classId:classId||extra.classId||meta.classId};
  if(!client||!userId){hydrate(null,meta);return null}
  const r=await client.from('profiles').select('*').eq('user_id',userId).maybeSingle();
  if(r.error)throw r.error;hydrate(r.data,meta);return row;
}
function avatarSrc(fallback=''){return row?.custom_avatar||fallback}
function card(){return normalizeCard(row?.profile_card)}
function frameOn(){return String(row?.avatar_key||'').includes('frame:midautumn2026')}
function bridge(){return window.RatioProfileBridge||{}}
function earnedBadges(){try{return bridge().earnedBadges?.()||[]}catch(e){return []}}
function badgeHtml(name){
  try{return bridge().badgeImg?.(name)||''}catch(e){}
  return '<span class="profile-badge-fallback">★</span>';
}
function defaultAvatar(){try{return bridge().defaultAvatar?.()||''}catch(e){return ''}}
function todayInfo(){try{return bridge().today?.()||{points:0,checked:false,full:false}}catch(e){return {points:0,checked:false,full:false}}}
function recentHistory(){const h=row?.public_training?.history;return Array.isArray(h)?h.slice(0,3):[]}
function activityLabel(r){if(r.game==='knowledge')return '知识点回顾';if(r.game==='rings'||r.stage==='rings')return '数圈侦探';const map={add:'加法',addsub:'加减',mul:'乘法',muldiv:'乘除',mixed:'混合运算',power:'乘方',supermixed:'超级混合'};return map[r.stage]||'核心训练'}
function cardMarkup(){
  if(!row)return '<div class="profile-no-player"><h3>先登录学生账号</h3><p>登录后会生成你的个人任务名片。</p><button class="primary" data-go="account">进入学生入口 →</button></div>';
  const c=card(),earned=earnedBadges(),featured=c.featured_badges.filter(n=>earned.includes(n)).slice(0,3),today=todayInfo(),
    av=avatarSrc(defaultAvatar()),lv=Math.max(1,Number(row.level)||1),base=Math.max(1,Number(row.base_level)||Math.floor((lv-1)/9)+1),
    badgeCount=Math.max(Number(row.badge_count)||0,earned.length),recent=c.show_recent?recentHistory():[];
  return '<div class="profile-page-grid">'+
    '<section class="mission-card theme-'+c.theme+'">'+
      '<div class="mission-card-top"><span>RATIOBOT · PLAYER CARD</span><b>NO. '+esc(meta.studentCode||'—')+'</b></div>'+
      '<div class="mission-card-main"><div class="mission-avatar '+(frameOn()?'with-midautumn-frame':'')+'"><img class="mission-avatar-img" src="'+esc(av)+'" alt="个人头像">'+(frameOn()?'<img class="mission-frame-img" src="assets/midautumn-frame-2026-clear.png?v=20260926-clear" alt="">':'')+'</div>'+
      '<div class="mission-identity"><small>'+esc(meta.className||'同班任务组')+'</small><h2>'+esc(row.display_name||((meta.studentCode||'')+'号'))+'</h2><p>'+esc(c.title)+'</p><div class="mission-rank-chips"><span>LV '+lv+'</span><span>BASE '+base+'</span><span>'+Number(row.streak||0)+' DAY STREAK</span></div></div></div>'+
      '<div class="mission-featured"><small>FEATURED BADGES · 展示徽章</small><div>'+(
        featured.length?featured.map(n=>'<figure>'+badgeHtml(n)+'<figcaption>'+esc(n)+'</figcaption></figure>').join(''):'<p>在右侧选择最多 3 枚已经获得的徽章。</p>'
      )+'</div></div>'+
      '<div class="mission-stats"><div><small>TODAY</small><b>'+Number(today.points||0)+'/40 R</b></div><div><small>BADGES</small><b>'+badgeCount+'</b></div><div><small>STATUS</small><b>'+(today.full?'FULL CLEAR':today.checked?'CHECKED':'ON MISSION')+'</b></div></div>'+
      (recent.length?'<div class="mission-recent"><small>RECENT MISSIONS</small>'+recent.map(r=>'<span>'+esc(activityLabel(r))+(Number.isFinite(Number(r.accuracy))?' · '+Number(r.accuracy)+'%':'')+'</span>').join('')+'</div>':'')+
    '</section>'+
    '<section class="profile-settings">'+
      '<div class="profile-settings-head"><div><small>PROFILE LOADOUT</small><h3>编辑我的名片</h3><p>头像、名片主题与展示徽章只在同班可见，不会公开到班级之外。</p></div><span class="profile-save-state" id="profileSaveState"></span></div>'+
      '<div class="profile-avatar-setting"><div class="profile-avatar-preview '+(frameOn()?'with-midautumn-frame':'')+'"><img src="'+esc(av)+'" alt=""><span>头像</span></div><div><b>自定义头像</b><p>上传后可缩放和裁切成正方形；中秋头像框会继续作为独立收藏叠加。</p><div class="profile-action-row"><input id="profileAvatarFile" type="file" accept="image/png,image/jpeg,image/webp" hidden><button id="profileUploadAvatar" class="primary" type="button">上传 / 修改头像</button>'+(row.custom_avatar?'<button id="profileResetAvatar" class="ghost" type="button">恢复系统头像</button>':'')+'</div></div></div>'+
      '<div class="profile-form-grid"><label>昵称<input id="profileNickname" maxlength="18" value="'+esc(row.display_name||'')+'"></label><label>任务称号<select id="profileTitle">'+TITLES.map(x=>'<option value="'+esc(x)+'" '+(x===c.title?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label></div>'+
      '<div class="profile-section"><b>名片主题</b><div class="profile-theme-grid">'+THEMES.map(t=>'<button type="button" data-profile-theme="'+t.id+'" class="'+(t.id===c.theme?'active':'')+' theme-'+t.id+'"><strong>'+esc(t.name)+'</strong><span>'+esc(t.note)+'</span></button>').join('')+'</div></div>'+
      '<div class="profile-section"><b>展示徽章 · 最多 3 枚</b><p>只显示已经获得的徽章。</p><div class="profile-earned-badges">'+(earned.length?earned.map(n=>'<button type="button" data-profile-badge="'+esc(n)+'" class="'+(featured.includes(n)?'active':'')+'">'+badgeHtml(n)+'<span>'+esc(n)+'</span></button>').join(''):'<div class="profile-empty-badges">完成任务后，已获得徽章会出现在这里。</div>')+'</div></div>'+
      '<div class="profile-options"><label><input type="checkbox" id="profileShowRecent" '+(c.show_recent?'checked':'')+'> 名片展示最近任务</label><label><input type="checkbox" id="profilePublic" '+(row.public_card_enabled!==false?'checked':'')+'> 在同班挑战墙展示我的名片</label></div>'+
      '<button id="profileSaveCard" type="button" class="primary profile-save">保存名片设置</button>'+
    '</section></div>';
}
function render(){
  const root=$('#studentProfileContent');if(!root)return;
  root.innerHTML=cardMarkup();
  if(!row)return;
  let draft=card(),featured=new Set(draft.featured_badges.filter(n=>earnedBadges().includes(n)).slice(0,3));
  root.querySelectorAll('[data-profile-theme]').forEach(b=>b.onclick=()=>{draft.theme=b.dataset.profileTheme;root.querySelectorAll('[data-profile-theme]').forEach(x=>x.classList.toggle('active',x===b));root.querySelector('.mission-card')?.setAttribute('class','mission-card theme-'+draft.theme)});
  root.querySelectorAll('[data-profile-badge]').forEach(b=>b.onclick=()=>{const n=b.dataset.profileBadge;if(featured.has(n)){featured.delete(n);b.classList.remove('active')}else if(featured.size<3){featured.add(n);b.classList.add('active')}else{setState('最多展示 3 枚徽章',true)}});
  const file=root.querySelector('#profileAvatarFile');
  root.querySelector('#profileUploadAvatar').onclick=()=>file.click();
  file.onchange=async()=>{const f=file.files?.[0];file.value='';if(!f)return;try{setState('正在处理头像…');const data=await window.AppearanceManager?.cropFile?.(f,'裁切个人头像');if(!data)return setState('已取消');const r=await client.from('profiles').update({custom_avatar:data,updated_at:new Date().toISOString()}).eq('user_id',row.user_id).select('*').single();if(r.error)throw r.error;hydrate(r.data,meta);render();setState('头像已更新')}catch(e){setState(e.message||'头像更新失败',true)}};
  root.querySelector('#profileResetAvatar')?.addEventListener('click',async()=>{try{const r=await client.from('profiles').update({custom_avatar:null,updated_at:new Date().toISOString()}).eq('user_id',row.user_id).select('*').single();if(r.error)throw r.error;hydrate(r.data,meta);render();setState('已恢复系统头像')}catch(e){setState(e.message||'恢复失败',true)}});
  root.querySelector('#profileSaveCard').onclick=async()=>{try{const nickname=root.querySelector('#profileNickname').value.trim().slice(0,18)||row.display_name||'RATIOBOT 学员';draft={theme:draft.theme,title:root.querySelector('#profileTitle').value,featured_badges:[...featured],show_recent:root.querySelector('#profileShowRecent').checked};setState('正在保存…');const r=await client.from('profiles').update({display_name:nickname,profile_card:draft,public_card_enabled:root.querySelector('#profilePublic').checked,updated_at:new Date().toISOString()}).eq('user_id',row.user_id).select('*').single();if(r.error)throw r.error;hydrate(r.data,meta);render();setState('✓ 名片已保存')}catch(e){setState(e.message||'保存失败',true)}};
}
function setState(t,bad=false){const n=$('#profileSaveState');if(n){n.textContent=t;n.className='profile-save-state '+(bad?'bad':'good')}}
function reset(){client=null;row=null;meta={classId:'',className:'',studentCode:''};const root=$('#studentProfileContent');if(root)root.innerHTML=''}
window.StudentProfileCard={load,hydrate,render,reset,avatarSrc,card,frameOn,current:()=>row?{...row,profile_card:normalizeCard(row.profile_card)}:null};
})();