from pathlib import Path
import re, sys

root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'
s=p.read_text('utf-8')

MARK='base-theme-system-v1'
if MARK in s:
    print('base theme patch already applied')
    raise SystemExit(0)

def rep(old,new,label,count=1):
    global s
    if old not in s:
        raise SystemExit(f'base theme patch target not found: {label}')
    s=s.replace(old,new,count)

replacements={
    '<span>双游戏总部</span><span>7 个运算核心</span><span>数的分类推理</span><span>Lv12 + BASE10</span>':'<span>双游戏总部</span><span>7 个运算核心</span><span>数的分类推理</span><span>10 BASE × 9 LEVELS</span>',
    '角色 Lv12、基地 BASE10、7 个能力核心与徽章柜。':'BASE1–10，每个 BASE 9 级成长，配合 7 个能力核心与徽章柜。',
    'XP负责长期人物与基地成长；打卡换装决定当前头像；能力核心负责“真正会不会”。每12级点亮一个数学基地。':'XP负责长期主题成长；BASE1–10 每个都有 9 个成长级别。打卡换装与 BASE 收藏并行，能力核心负责“真正会不会”。',
    '<b id="baseCurrentName">成长家园 · 尚未点亮基地</b>':'<b id="baseCurrentName">BASE 1 · 成长家园</b>',
    '<span class="phase" id="basePhase">0 / 12</span>':'<span class="phase" id="basePhase">1 / 9</span>',
    '<span id="baseCurrentRange">Lv1–11 · 基础成长</span><span id="baseNextUnlock">Lv12 点亮 BASE 1</span>':'<span id="baseCurrentRange">BASE 1 · 第 1 / 9 级</span><span id="baseNextUnlock">继续升级当前主题</span>',
    '<div class="base-stage-chip" id="baseStageChip">BASE 0</div>':'<div class="base-stage-chip" id="baseStageChip">BASE 1</div>',
    'XP 永久累计、不消费。每 12 个等级点亮一个数学基地；Lv12 点亮 BASE1，Lv24 点亮 BASE2……Lv120 完成 BASE10。越往后每级所需 XP 自动增加。':'XP 永久累计、不消费。每 9 个等级完成一个主题 BASE：Lv1–9 为 BASE1，Lv10–18 为 BASE2……Lv82–90 为 BASE10。每个 BASE 都有 9 个逐步累积的形象级别。',
    '头像以打卡图鉴中当前穿戴的形象为准；未选择打卡换装时，继续显示原 Lv1–12 数牌小方基础形象。':'打卡换装是独立头像收藏；上方 BASE 主题成长形象按 XP 自动升级，两个系统互不覆盖。',
    'Lv1–12 基础成长收藏':'BASE1 · 成长家园历史收藏',
    '保留前面插件版的成长历史：帽子、咖啡、书、小狗、伙伴、花园、汽车与别墅仍然是数牌小方的基础成长轨迹，但不再作为当前头像的手动换装槽位。':'BASE1 的 9 级成长轨迹继续保留：基础小方、帽子、咖啡、书、小狗、伙伴、花园、汽车与完整家园。',
}
for a,b in replacements.items():
    if a in s: s=s.replace(a,b)

old='<div id="baseMilestones" class="base-milestones"></div><div class="section-title" style="margin:0 0 7px"><div><h3 style="font-size:16px">本学期数学模块</h3><p>保留课程方向，不再单独做一大块“基地总规划”。</p></div></div><div id="semesterModuleStrip" class="semester-strip"></div>'
new='''<div id="baseMilestones" class="base-milestones"></div>
        <section class="base-theme-panel" id="baseThemePanel">
          <div class="section-title compact"><div><div class="eyebrow">CURRENT BASE · 9 LEVELS</div><h3 id="baseThemeTitle">BASE 1 · 成长家园</h3><p id="baseThemeDesc">每一级只增加新元素，已经获得的元素不会撤掉。</p></div><span class="base-theme-count" id="baseThemeCount">1 / 9</span></div>
          <div id="baseStageGallery" class="base-stage-gallery"></div>
        </section>
        <section class="base-complete-panel" id="baseCompletePanel">
          <div class="section-title compact"><div><div class="eyebrow">COMPLETE THEME COLLECTION</div><h3>已集齐的完整主题</h3><p>一个 BASE 达到第 9 级后，完整主题形象会永久收藏在这里。</p></div></div>
          <div id="baseCompleteGallery" class="base-complete-gallery"></div>
        </section>
        <div class="section-title" style="margin:0 0 7px"><div><h3 style="font-size:16px">本学期数学模块</h3><p>课程方向继续保留；BASE 主题只负责长期视觉成长与收藏。</p></div></div><div id="semesterModuleStrip" class="semester-strip"></div>'''
rep(old,new,'growth theme sections')

old='<div class="growth-robot"><img id="growthRobot" alt="当前头像"><div class="energy-chip" id="growthEnergy">核心启动 0/7</div><div class="base-stage-chip" id="baseStageChip">BASE 1</div></div>'
new='<div class="growth-robot"><img id="growthRobot" alt="当前头像"><div id="baseHeroSprite" class="base-hero-sprite hidden" aria-label="当前 BASE 成长形象"></div><div class="energy-chip" id="growthEnergy">核心启动 0/7</div><div class="base-stage-chip" id="baseStageChip">BASE 1</div></div>'
rep(old,new,'hero sprite layer')

css='''
/* base-theme-system-v1 */
.base-level-track{grid-template-columns:repeat(9,1fr)}
.base-milestones{grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
.base-mini{min-height:104px;position:relative;overflow:hidden}
.base-mini .base-nine-dots{display:grid;grid-template-columns:repeat(9,1fr);gap:2px;margin:8px 0 6px}
.base-mini .base-nine-dots i{height:7px;border:1.5px solid var(--ink);border-radius:99px;background:#FFFDF8}
.base-mini .base-nine-dots i.on{background:var(--teal)}
.base-mini .base-nine-dots i.now{background:var(--yellow)}
.base-mini .base-status{font-size:8px;font-weight:1000;color:var(--muted)}
.base-theme-panel,.base-complete-panel{margin:14px 0 18px;border:4px solid var(--ink);border-radius:22px;background:linear-gradient(135deg,#FFFDF8,#FFF5CE 58%,#D9F1F2);box-shadow:7px 7px 0 rgba(62,53,64,.10);padding:16px}
.base-complete-panel{background:linear-gradient(135deg,#FFFDF8,#E7F7EF 58%,#EAF3FF)}
.section-title.compact{margin:0 0 12px;align-items:flex-start}
.base-theme-count{border:3px solid var(--ink);border-radius:999px;background:var(--yellow);padding:7px 11px;font-size:11px;font-weight:1000;white-space:nowrap;box-shadow:3px 3px 0 rgba(62,53,64,.1)}
.base-stage-gallery{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:7px}
.base-stage-card{min-width:0;border:3px solid var(--ink);border-radius:15px;background:#FFFDF8;padding:7px 5px 8px;text-align:center;box-shadow:3px 3px 0 rgba(62,53,64,.08);position:relative}
.base-stage-card.locked{opacity:.46;background:#F2F2F0;box-shadow:none}
.base-stage-card.current{background:#FFF2B7;box-shadow:4px 4px 0 var(--coral);transform:translateY(-2px)}
.base-stage-card.complete{background:#E7F7EF}
.base-stage-card small{display:block;margin-top:5px;color:var(--coral);font-size:8px;font-weight:1000}
.base-stage-card b{display:block;font-size:9px;line-height:1.15;margin-top:2px;white-space:normal}
.base-sprite{width:100%;aspect-ratio:1/1;background-repeat:no-repeat;background-size:300% 300%;background-color:transparent;background-position:0 0}
.base-stage-card.locked .base-sprite{filter:grayscale(1);opacity:.22}
.base-sprite.placeholder{border:2px dashed rgba(62,53,64,.25);border-radius:12px;background-image:none!important;display:grid;place-items:center;font-size:22px;font-weight:1000;color:#B9B0A5}
.base-complete-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.base-complete-card{border:3px solid var(--ink);border-radius:18px;background:#FFFDF8;padding:12px;text-align:center;box-shadow:4px 4px 0 rgba(53,184,200,.17)}
.base-complete-card .base-sprite{max-width:230px;margin:0 auto}
.base-complete-card b{display:block;font-size:14px;margin-top:5px}.base-complete-card span{display:block;color:var(--muted);font-size:9px;font-weight:900;margin-top:3px}
.base-complete-empty{grid-column:1/-1;padding:17px;border:2px dashed rgba(62,53,64,.25);border-radius:14px;color:var(--muted);font-size:11px;font-weight:900;text-align:center;background:#FFFDF8}
.base-hero-sprite{width:min(330px,96%);aspect-ratio:1/1;background-repeat:no-repeat;background-size:300% 300%;filter:drop-shadow(0 8px 0 rgba(62,53,64,.12));animation:float 3.6s ease-in-out infinite}
.base-hero-sprite.hidden{display:none}.growth-robot img.base-theme-hidden{display:none}.base-hero-placeholder{width:100%;height:100%;border:3px dashed rgba(62,53,64,.28);border-radius:28px;background:#FFFDF8;display:grid;place-items:center;text-align:center;color:var(--muted);font-size:24px;font-weight:1000;line-height:1.25}.base-hero-placeholder small{font-size:10px;color:var(--muted)}
@media(max-width:1100px){.base-stage-gallery{grid-template-columns:repeat(5,minmax(0,1fr))}.base-complete-gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:720px){.base-milestones{grid-template-columns:repeat(2,minmax(0,1fr))}.base-stage-gallery{grid-template-columns:repeat(3,minmax(0,1fr))}.base-complete-gallery{grid-template-columns:1fr}}
'''
rep('</style>',css+'\n</style>','style insertion')

old="function levelInfo(totalXP){let level=1,spent=0,need=120;while(level<120&&totalXP>=spent+need){spent+=need;level++;need=120+(level-1)*60;}if(level>=120){return {level:120,into:0,need:0,pct:100,toNext:0,capped:true,spent};}const into=Math.max(0,totalXP-spent),pct=Math.max(0,Math.min(100,Math.round(into/need*100)));return {level,into,need,pct,toNext:Math.max(0,need-into),capped:false,spent};}"
new="function levelInfo(totalXP){let level=1,spent=0,need=120;while(level<90&&totalXP>=spent+need){spent+=need;level++;need=120+(level-1)*60;}if(level>=90){return {level:90,into:0,need:0,pct:100,toNext:0,capped:true,spent};}const into=Math.max(0,totalXP-spent),pct=Math.max(0,Math.min(100,Math.round(into/need*100)));return {level,into,need,pct,toNext:Math.max(0,need-into),capped:false,spent};}"
rep(old,new,'level cap 90')

old="function levelTitle(level){if(level>=120)return 'RATIOBOT 数学核心大师';if(level>=108)return '综合解题师';if(level>=96)return '空间建模师';if(level>=84)return '几何推理师';if(level>=72)return '方程分析师';if(level>=60)return '代数研究员';if(level>=48)return '边界研究员';if(level>=36)return '运算策略师';if(level>=24)return '分类推理师';if(level>=13)return '数系研究员';if(level===12)return '有理数专家';if(level>=8)return '核心驾驶员';if(level>=5)return '运算工程师';if(level>=3)return '符号侦察员';return '数字启动员';}"
new="function levelTitle(level){if(level>=90)return 'RATIOBOT 数学核心大师';if(level>=82)return '总部建造师';if(level>=73)return '云端探索师';if(level>=64)return '海岛研究员';if(level>=55)return '极地探险师';if(level>=46)return '城市创意师';if(level>=37)return '森林观察员';if(level>=28)return '深海研究员';if(level>=19)return '太空探索员';if(level>=10)return '农场建造员';if(level>=7)return '家园设计师';if(level>=4)return '成长工程师';return '数字启动员';}"
rep(old,new,'level titles')

pat=r"  const HQ_HONOR_LEVELS=\[.*?\n  \];\n  const HQ_SEMESTER_MODULES="
m=re.search(pat,s,flags=re.S)
if not m: raise SystemExit('base theme patch target not found: HQ_HONOR_LEVELS block')
new_block='''  const BASE_THEME_META=[
    {base:1,name:'成长家园',need:9,atlas:'assets/base1_home_9.webp',desc:'从基础小方一步步拥有帽子、伙伴、花园、汽车与完整家园。',stages:['基础小方','帽子','能量咖啡','知识书','小狗伙伴','迷你伙伴','小花园','小汽车','完整家园']},
    {base:2,name:'农场主题',need:18,atlas:'assets/base2_farm_9.webp',desc:'农场元素逐级累积，已经获得的装备、伙伴和场景不会撤掉。',stages:['基础小方','背带裤','草帽','鸡蛋篮','农具耙','猫咪伙伴','菜地与小鸡','小马伙伴','完整农场']},
    {base:3,name:'太空主题',need:27,atlas:'assets/base3_space_9.webp',desc:'从基础小方一路升级到完整太空基地，所有前置元素持续保留。',stages:['基础小方','宇航服与头盔','手持探测器','外星伙伴','月球车','后方小机器人','火箭','月面基地背景','空间站']},
    {base:4,name:'深海研究站',need:36,atlas:'',desc:'9 级成长槽已建立，主题形象待继续设计。',stages:Array.from({length:9},(_,i)=>`深海成长 ${i+1}`)},
    {base:5,name:'森林营地',need:45,atlas:'',desc:'9 级成长槽已建立，主题形象待继续设计。',stages:Array.from({length:9},(_,i)=>`森林成长 ${i+1}`)},
    {base:6,name:'城市创意街',need:54,atlas:'',desc:'9 级成长槽已建立，主题形象待继续设计。',stages:Array.from({length:9},(_,i)=>`城市成长 ${i+1}`)},
    {base:7,name:'极地探险站',need:63,atlas:'',desc:'9 级成长槽已建立，主题形象待继续设计。',stages:Array.from({length:9},(_,i)=>`极地成长 ${i+1}`)},
    {base:8,name:'海岛乐园',need:72,atlas:'',desc:'9 级成长槽已建立，主题形象待继续设计。',stages:Array.from({length:9},(_,i)=>`海岛成长 ${i+1}`)},
    {base:9,name:'云端城堡',need:81,atlas:'',desc:'9 级成长槽已建立，主题形象待继续设计。',stages:Array.from({length:9},(_,i)=>`云端成长 ${i+1}`)},
    {base:10,name:'RATIOBOT 数学总部',need:90,atlas:'',desc:'最终 BASE：9 级成长槽已建立，完整总部形象待继续设计。',stages:Array.from({length:9},(_,i)=>`总部成长 ${i+1}`)}
  ];
  const HQ_HONOR_LEVELS=BASE_THEME_META;
  const HQ_SEMESTER_MODULES='''
s=s[:m.start()]+new_block+s[m.end():]

old="function honorInfoFromProfile(p){p=ensureProfileShape(p);const lv=levelInfo(p.xp).level;let unlocked=Math.min(10,Math.floor(lv/12));let current=unlocked?HQ_HONOR_LEVELS[unlocked-1]:null,next=unlocked<10?HQ_HONOR_LEVELS[unlocked]:null;let startLv=unlocked*12,endLv=Math.min(120,startLv+12),phase=unlocked>=10?12:Math.max(0,lv-startLv),pct=unlocked>=10?100:phase/12*100;return{level:current,next,unlocked,lv,phase,pct,startLv,endLv};}"
new="function honorInfoFromProfile(p){p=ensureProfileShape(p);const lv=levelInfo(p.xp).level,currentBase=Math.min(10,Math.floor((lv-1)/9)+1),phase=((lv-1)%9)+1,completed=Math.min(10,Math.floor(lv/9)),current=BASE_THEME_META[currentBase-1],nextBase=currentBase<10?BASE_THEME_META[currentBase]:null;return{level:current,next:nextBase,unlocked:completed,completed,lv,phase,pct:phase/9*100,startLv:(currentBase-1)*9+1,endLv:currentBase*9,currentBase};}"
rep(old,new,'honorInfo 9 levels')

needle="  function renderHonorGrowth(){"
if needle not in s: raise SystemExit('base theme patch target not found: renderHonorGrowth')
helpers=r'''  function baseSpritePosition(stage){stage=Math.max(1,Math.min(9,Number(stage)||1));const i=stage-1,col=i%3,row=Math.floor(i/3);return `${col*50}% ${row*50}%`;}
  function baseSpriteHtml(theme,stage,extra=''){if(!theme?.atlas)return `<div class="base-sprite placeholder ${extra}">?</div>`;return `<div class="base-sprite ${extra}" style="background-image:url('${theme.atlas}');background-position:${baseSpritePosition(stage)}"></div>`;}
  function renderBaseHero(hp){const old=$('#growthRobot'),sprite=$('#baseHeroSprite'),theme=hp.level;if(!old||!sprite)return;old.classList.add('base-theme-hidden');sprite.classList.remove('hidden');if(theme?.atlas){sprite.innerHTML='';sprite.style.backgroundImage=`url('${theme.atlas}')`;sprite.style.backgroundPosition=baseSpritePosition(hp.phase);sprite.setAttribute('aria-label',`BASE ${theme.base} ${theme.name} 第${hp.phase}级`);}else{sprite.style.backgroundImage='none';sprite.innerHTML=`<div class="base-hero-placeholder"><div>BASE ${theme.base}<br><small>${theme.name} · ${hp.phase}/9<br>主题形象待继续设计</small></div></div>`;}}
  function renderBaseStageGallery(hp){const theme=hp.level,box=$('#baseStageGallery');if(!box||!theme)return;$('#baseThemeTitle').textContent=`BASE ${theme.base} · ${theme.name}`;$('#baseThemeDesc').textContent=theme.desc;$('#baseThemeCount').textContent=`${hp.phase} / 9`;box.innerHTML=theme.stages.map((name,i)=>{const st=i+1,unlocked=st<=hp.phase,cur=st===hp.phase;return `<article class="base-stage-card ${unlocked?'complete':'locked'} ${cur?'current':''}">${baseSpriteHtml(theme,st)}<small>LEVEL ${st}</small><b>${name}</b></article>`}).join('');}
  function renderCompletedBaseThemes(hp){const box=$('#baseCompleteGallery');if(!box)return;const complete=BASE_THEME_META.filter(t=>t.base<=hp.completed&&t.atlas);box.innerHTML=complete.length?complete.map(t=>`<article class="base-complete-card">${baseSpriteHtml(t,9)}<b>BASE ${t.base} · ${t.name}</b><span>9 / 9 · 完整主题已收藏</span></article>`).join(''):`<div class="base-complete-empty">当前还没有集齐完整 BASE。BASE1 达到第 9 级后，完整主题形象会出现在这里。</div>`;}
'''
s=s.replace(needle,helpers+needle,1)

start=s.index("  function renderHonorGrowth(){")
end=s.index("  function updateRingsProfileHint()",start)
new_func=r'''  function renderHonorGrowth(){
    const p=currentProfile();if(!p)return;
    const hp=honorInfoFromProfile(p),e=p.economy||normalizeHQEconomy({}),theme=hp.level;
    $('#baseCurrentName').textContent=`BASE ${theme.base} · ${theme.name}`;
    $('#baseStageChip').textContent=`BASE ${theme.base}`;
    $('#basePhase').textContent=`${hp.phase} / 9`;
    let dots='';for(let i=1;i<=9;i++){let done=i<hp.phase,cur=i===hp.phase;dots+=`<i class="${done?'done':cur?'current':''}"></i>`}$('#baseLevelTrack').innerHTML=dots;
    const stageName=theme.stages[hp.phase-1]||`第 ${hp.phase} 级`;
    $('#baseCurrentRange').textContent=`Lv${hp.startLv}–${hp.endLv} · ${theme.name} · ${hp.phase}/9 ${stageName}`;
    if(hp.lv>=90){$('#baseNextUnlock').textContent='BASE10 已集齐 · 十个主题全部完成';}
    else if(hp.phase<9){$('#baseNextUnlock').textContent=`Lv${hp.lv+1} 解锁 ${hp.phase+1}/9 · ${theme.stages[hp.phase]}`;}
    else{$('#baseNextUnlock').textContent=`BASE${theme.base} 已集齐 · Lv${hp.lv+1} 进入 BASE${theme.base+1} · ${BASE_THEME_META[theme.base].name}`;}
    $('#baseMilestones').innerHTML=BASE_THEME_META.map(t=>{const start=(t.base-1)*9+1,end=t.base*9,done=hp.completed>=t.base,current=hp.currentBase===t.base;let reached=current?hp.phase:done?9:0;let d='';for(let i=1;i<=9;i++)d+=`<i class="${i<=reached?'on':current&&i===reached+1?'now':''}"></i>`;return `<div class="base-mini ${done?'done':''} ${current?'current':''}"><div class="bno">BASE ${t.base} · Lv${start}–${end}</div><b>${t.name}</b><div class="base-nine-dots">${d}</div><span class="base-status">${done?'9 / 9 · 已集齐':current?`${hp.phase} / 9 · 当前主题`:'0 / 9 · 未开始'}</span></div>`}).join('');
    renderBaseHero(hp);renderBaseStageGallery(hp);renderCompletedBaseThemes(hp);
    let ms=$('#semesterModuleStrip');if(ms)ms.innerHTML=HQ_SEMESTER_MODULES.map((m,i)=>`<span class="semester-node ${i===0?'now':'future'}"><b>${m.code}</b>${m.name}</span>`).join('');let today=ensureTodayRecord(p);$('#rWalletSummary').textContent=`余额 ${e.credits} · 今日 ${today.points}/40`;renderUnifiedBadges(p);
  }
'''
s=s[:start]+new_func+s[end:]

old="function cloudLevelBase(p){let lv=levelInfo(p?.xp||0).level;return {level:lv,base:Math.min(10,Math.floor(lv/12))}}"
new="function cloudLevelBase(p){let lv=levelInfo(p?.xp||0).level;return {level:lv,base:Math.min(10,Math.floor((lv-1)/9)+1)}}"
rep(old,new,'cloud base mapping')

s=s.replace("li.capped?'Lv120 已完成'","li.capped?'Lv90 已完成'")
s=s.replace("li.capped?'十座数学基地全部点亮'","li.capped?'十个 BASE 主题全部集齐'")
s=s.replace('<body>','<body data-base-theme-system="v1">',1)
p.write_text(s,'utf-8')
print('RATIOBOT BASE theme system patch applied')
