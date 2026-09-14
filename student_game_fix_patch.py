from pathlib import Path
import sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
index=root/'index.html'; rings=root/'rings.html'
s=index.read_text('utf-8')
MARK='student-game-fix-v1'
if MARK not in s:
    # CSS + marker
    css='''\n/* student-game-fix-v1 */\n.top-logout{width:auto!important;min-width:58px;padding:0 11px!important;font-size:10px;font-weight:1000}.top-logout.hidden{display:none!important}\n'''
    if '</style>' not in s: raise SystemExit('index style close not found')
    s=s.replace('</style>',css+'\n</style>',1)

    # persistent logout next to current player
    old='<div class="top-actions"><button id="playerBtn" class="player-pill" title="切换学生">未登录</button><button id="soundBtn" class="icon-btn" title="声音">♪</button></div>'
    new='<div class="top-actions"><button id="playerBtn" class="player-pill" title="切换学生">未登录</button><button id="topLogoutBtn" class="icon-btn top-logout hidden" title="退出当前学生">退出</button><button id="soundBtn" class="icon-btn" title="声音">♪</button></div>'
    if old not in s: raise SystemExit('top actions target not found')
    s=s.replace(old,new,1)

    # refreshPlayerUI shows/hides persistent logout
    needle="function refreshPlayerUI(){const p=currentProfile(),btn=$('#playerBtn');if(!btn)return;"
    repl="function refreshPlayerUI(){const p=currentProfile(),btn=$('#playerBtn');if(!btn)return;const topLogout=$('#topLogoutBtn');if(topLogout)topLogout.classList.toggle('hidden',!p);"
    if needle not in s: raise SystemExit('refreshPlayerUI target not found')
    s=s.replace(needle,repl,1)

    # one login per session: skip old per-round password gate
    start=s.find('  function openStudentGate(configOverride){')
    end=s.find('  function startRound(configOverride){',start)
    if start<0 or end<0: raise SystemExit('student gate block not found')
    replacement='''  function openStudentGate(configOverride){\n    if(configOverride) state.config={...state.config,...configOverride};\n    state.pendingConfig={...state.config};\n    const p=currentProfile();\n    if(!p){\n      $('#setupView').classList.remove('hidden');$('#studentView').classList.add('hidden');\n      try{cloudState.pendingPage='train'}catch(e){}\n      go('account');\n      setTimeout(()=>cloudMsg?.('#accountError','请先登录学生账号；登录后挑战期间不需要再次输入密码。','bad'),0);\n      return;\n    }\n    state.classCode=p.classCode;state.studentId=p.studentId;state.profileKey=makeProfileKey(p.classCode,p.studentId);\n    startRound();\n  }\n'''
    s=s[:start]+replacement+s[end:]

    # start/retry text no longer exposes identity gate
    s=s.replace("$('#againBtn').onclick=()=>openStudentGate();","$('#againBtn').onclick=()=>startRound();",1)

    # top logout delegates to authoritative logout button; put after existing logout binding
    logout_needle="$('#logoutBtn').onclick=async()=>{try{await cloudClient?.auth.signOut()}catch(e){} cloudState.user=null;cloudState.role='';cloudState.mustChangePassword=false;cloudState.username='';logoutProfile();$('#firstPasswordBox')?.classList.add('cloud-hidden');$('#accountError').textContent='已退出当前学生。';refreshCloudUI();};"
    if logout_needle not in s: raise SystemExit('logout binding target not found')
    logout_new=logout_needle+"\n  $('#topLogoutBtn')?.addEventListener('click',()=>{if(confirm('退出当前学生账号？'))$('#logoutBtn')?.click();});"
    s=s.replace(logout_needle,logout_new,1)

    # strengthen authoritative rings score response
    old="window.addEventListener('message',ev=>{let d=ev.data;if(!d||d.type!=='ratiobot-game-clear')return;if(d.mode==='duel'||d.playMode==='duel')return;let p=currentProfile();if(!p)return;let res=recordGameClear(p,'rings',String(d.signature||'random-rules'),!!d.challenge,'normal','rings','integer');p.economy.modules.numberRings.clears++;saveCurrentProfile(p);renderGrowth();renderStats();try{ev.source.postMessage({type:'ratiobot-score-result',message:res.gain?`总部计分 +${res.gain} R积分`:`本局 0 分：${res.reason}`},'*')}catch(e){}});"
    new="""window.addEventListener('message',ev=>{let d=ev.data;if(!d||d.type!=='ratiobot-game-clear')return;let frame=$('#ringsFrame');if(frame&&ev.source!==frame.contentWindow)return;if(d.mode==='duel'||d.playMode==='duel'){try{ev.source.postMessage({type:'ratiobot-score-result',gain:0,balance:Number(currentProfile()?.economy?.credits||0),message:'PK 模式不计 R积分'},'*')}catch(e){}return;}let p=currentProfile();if(!p){try{ev.source.postMessage({type:'ratiobot-score-result',gain:0,balance:0,message:'未登录学生账号，本局未计分'},'*')}catch(e){}return;}let res=recordGameClear(p,'rings',String(d.signature||'random-rules'),!!d.challenge,'normal','rings','integer');p.economy.modules.numberRings.clears++;saveCurrentProfile(p);renderGrowth();renderStats();let balance=Number(p.economy?.credits||0);try{ev.source.postMessage({type:'ratiobot-score-result',gain:res.gain,balance,points:res.points,message:res.gain?`总部计分 +${res.gain} R积分 · 当前余额 ${balance}`:`本局 0 分：${res.reason}`},'*')}catch(e){}});"""
    if old not in s: raise SystemExit('rings parent message target not found')
    s=s.replace(old,new,1)

    index.write_text(s,'utf-8')

# Patch child rings UI so it displays parent-awarded score, not hard-coded +0.
r=rings.read_text('utf-8')
if 'rings-parent-score-fix-v1' not in r:
    r=r.replace("function awardRPoints(requested,reason=''){return 0}","function awardRPoints(requested,reason=''){return 0} /* rings-parent-score-fix-v1: parent is authoritative */",1)
    old="$('#finalScores').innerHTML=`<span>总操作：<b>${totalOps}</b></span><span>失败投放：<b>${totalFails}</b></span><span>策略评级：<b>${grade}</b></span><span>本次获得：<b>+${sessionRPoints}</b> R积分</span>`;showCelebration('solo','单人挑战')"
    new="$('#finalScores').innerHTML=`<span>总操作：<b>${totalOps}</b></span><span>失败投放：<b>${totalFails}</b></span><span>策略评级：<b>${grade}</b></span><span id=\"sessionRPointLine\">本次获得：<b>总部结算中…</b></span>`;showCelebration('solo','单人挑战')"
    if old not in r: raise SystemExit('rings finish score line target not found')
    r=r.replace(old,new,1)
    old_listener="window.addEventListener('message',e=>{if(e.data&&e.data.type==='ratiobot-score-result'){let box=document.querySelector('#finalScores');if(box){let span=document.createElement('span');span.textContent=e.data.message;box.appendChild(span)}}});"
    new_listener="""window.addEventListener('message',e=>{if(e.data&&e.data.type==='ratiobot-score-result'){sessionRPoints=Number(e.data.gain||0);let line=document.querySelector('#sessionRPointLine');if(line)line.innerHTML=`本次获得：<b>+${sessionRPoints}</b> R积分`;let hud=document.querySelector('#hudScore');if(hud&&Number.isFinite(Number(e.data.balance)))hud.textContent=String(e.data.balance);let sub=document.querySelector('.celebrate-card .celeb-sub');if(sub)sub.textContent=`冠军领奖台 · 本次 +${sessionRPoints} R积分`;let box=document.querySelector('#finalScores');if(box){let old=box.querySelector('.hq-score-result');if(old)old.remove();let span=document.createElement('span');span.className='hq-score-result';span.textContent=e.data.message||`总部计分 +${sessionRPoints} R积分`;box.appendChild(span)}}});"""
    if old_listener not in r: raise SystemExit('rings result listener target not found')
    r=r.replace(old_listener,new_listener,1)
    rings.write_text(r,'utf-8')

print('student/game fixes applied')
