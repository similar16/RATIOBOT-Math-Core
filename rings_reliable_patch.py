from pathlib import Path
import re,sys,subprocess,tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
index=root/'index.html'; rings=root/'rings.html'
s=index.read_text('utf-8')
MARK='rings-reliable-v48'
if MARK not in s:
    s=s.replace('</style>', '\n/* rings-reliable-v48 */\n</style>', 1)
    s=re.sub(r"function ensureRingsLoaded\(force=false\)\{.*?\}","function ensureRingsLoaded(force=false){let f=$('#ringsFrame');if(!f)return;if(force||!f.dataset.loaded){f.removeAttribute('srcdoc');f.src='rings.html?v=48';f.dataset.loaded='1';setTimeout(drainRingsPending,450);}}",s,count=1,flags=re.S)
    pat=r"  function ratiobotAwardRings\(d=\{\}\)\{.*?  window\.addEventListener\('message',ev=>\{let d=ev\.data;if\(!d\|\|d\.type!=='ratiobot-game-clear'\)return;.*?\}\);"
    m=re.search(pat,s,flags=re.S)
    if not m: raise SystemExit('rings parent award block not found')
    repl=r'''  const RINGS_PENDING_KEY='ratiobot_rings_pending_v48';
  function ringsResultMessage(result){let frame=$('#ringsFrame');try{frame?.contentWindow?.postMessage(result,'*')}catch(e){}}
  function ratiobotAwardRings(d={}){
    if(d.mode==='duel'||d.playMode==='duel')return {type:'ratiobot-score-result',gain:0,balance:Number(currentProfile()?.economy?.credits||0),message:'PK 模式不计 R积分'};
    let p=currentProfile();
    if(!p)return {type:'ratiobot-score-result',gain:0,balance:0,message:'未登录学生账号，本局未计分'};
    p=ensureProfileShape(p);let e=p.economy,nr=e.modules.numberRings;
    nr.processedRuns=Array.isArray(nr.processedRuns)?nr.processedRuns:[];
    const runId=String(d.runId||'rings-'+Date.now()+'-'+Math.random().toString(36).slice(2,8));
    if(nr.processedRuns.includes(runId))return {type:'ratiobot-score-result',gain:0,balance:Number(e.credits||0),duplicate:true,message:'本局已经结算过'};
    const abMistakes=Math.max(0,Number(d.abMistakes||0));
    const baseGain=abMistakes===0?8:(abMistakes===1?4:0);
    let today=ensureTodayRecord(p),room=Math.max(0,HQ_R_DAILY_CAP-Number(today.points||0)),gain=Math.min(baseGain,room),reason='';
    if(baseGain===0)reason='A/B 规则判断累计 2 次错误，本局 0 分';
    else if(room<=0)reason='今日 40 R积分已满';
    else if(gain<baseGain)reason=`今日上限只剩 ${gain} 分`;
    else reason=abMistakes===1?'A/B 首次判断错误，本局半分':'A/B 判断无误，获得满分';
    if(gain>0){today.points=Number(today.points||0)+gain;e.credits=Number(e.credits||0)+gain;e.lifetimeCredits=Number(e.lifetimeCredits||0)+gain;e.daily.date=dateKey();e.daily.earned=today.points;nr.earned=Number(nr.earned||0)+gain;}
    if(d.challenge)today.challenge=true;if(today.points>=20)today.checked=true;if(today.points>=40)today.full=true;checkinMetrics(p);currentWeekInfo(p);
    nr.clears=Number(nr.clears||0)+1;nr.archives=Number(nr.archives||0)+Math.max(1,Number(d.roundCount||0));
    if(abMistakes===0)nr.cleanRounds=Number(nr.cleanRounds||0)+1;
    if(String(d.grade||'').startsWith('S'))nr.sClears=Number(nr.sClears||0)+1;
    nr.processedRuns.push(runId);nr.processedRuns=nr.processedRuns.slice(-80);
    p.games=Number(p.games||0)+1;const roundCount=Math.max(1,Number(d.roundCount||0));p.questions=Number(p.questions||0)+roundCount;
    const ops=Math.max(0,Number(d.totalOps||d.ops||0)),fails=Math.max(0,Number(d.totalFails||d.fails||0));
    const acc=ops?Math.max(0,Math.min(100,Math.round((ops-fails)/ops*100))):100;
    const grade=String(d.grade|| (ops<=14?'S · 很会选线索':ops<=19?'A · 推理很稳':ops<=25?'B · 已掌握':'继续优化策略'));
    const td=todayKey();if(!p.activeDates.includes(td))p.activeDates.push(td);p.activeDates=p.activeDates.slice(-60);
    p.history ||= [];
    p.history.unshift({at:new Date().toISOString(),classCode:p.classCode,studentId:p.studentId,game:'rings',stage:'rings',numberType:'classification',difficulty:'normal',brackets:'0',accuracy:acc,bestCombo:0,avgTime:null,xp:0,rGain:gain,level:levelInfo(p.xp).level,totalOps:ops,totalFails:fails,roundCount,abMistakes,grade,runId});
    p.history=p.history.slice(0,10);p.economy=e;saveCurrentProfile(p);renderGrowth();renderStats();
    const balance=Number(p.economy?.credits||0);
    return {type:'ratiobot-score-result',gain,balance,points:today.points,abMistakes,reason,message:`数圈侦探：+${gain} R积分 · ${reason} · 当前余额 ${balance}`};
  }
  window.ratiobotAwardRings=ratiobotAwardRings;
  function processRingsPayload(d){try{const result=ratiobotAwardRings(d);ringsResultMessage(result);return result}catch(e){console.error('rings award failed',e);return {type:'ratiobot-score-result',gain:0,message:'数圈结算失败，请返回总部后重试'}}}
  function drainRingsPending(){try{let raw=localStorage.getItem(RINGS_PENDING_KEY);if(!raw)return;let d=JSON.parse(raw);if(!d||d.type!=='ratiobot-game-clear')return;processRingsPayload(d);localStorage.removeItem(RINGS_PENDING_KEY)}catch(e){console.warn('rings pending drain failed',e)}}
  window.addEventListener('storage',e=>{if(e.key===RINGS_PENDING_KEY&&e.newValue)drainRingsPending()});
  window.addEventListener('message',ev=>{let d=ev.data;if(!d||d.type!=='ratiobot-game-clear')return;let frame=$('#ringsFrame');if(frame&&ev.source!==frame.contentWindow)return;processRingsPayload(d);try{localStorage.removeItem(RINGS_PENDING_KEY)}catch(e){}});
  setInterval(drainRingsPending,800);'''
    s=s[:m.start()]+repl+s[m.end():]
    # add A/B mistake count to detailed record rendering
    s=s.replace("<div><small>本局积分</small><b>+${r.rGain||0} R</b></div><div><small>总操作 / 失败</small><b>${r.totalOps||0} / ${r.totalFails||0}</b></div><div><small>策略评级</small><b>${r.grade||'—'}</b></div>","<div><small>本局积分</small><b>+${r.rGain||0} R</b></div><div><small>A/B 判断错误</small><b>${r.abMistakes||0}</b></div><div><small>总操作 / 失败</small><b>${r.totalOps||0} / ${r.totalFails||0}</b></div><div><small>策略评级</small><b>${r.grade||'—'}</b></div>",1)
    index.write_text(s,'utf-8')

r=rings.read_text('utf-8')
if 'rings-reliable-child-v48' not in r:
    r=r.replace("let playMode='solo',rounds=[],ri=0,round=null,totalOps=0,totalFails=0,selected=null,pointerDrag=null,soloState=null;","let playMode='solo',rounds=[],ri=0,round=null,totalOps=0,totalFails=0,abMistakes=0,selected=null,pointerDrag=null,soloState=null; /* rings-reliable-child-v48 */",1)
    r=r.replace("ri=0;totalOps=0;totalFails=0;sessionRPoints=0;finishPointAwarded=false;","ri=0;totalOps=0;totalFails=0;abMistakes=0;sessionRPoints=0;finishPointAwarded=false;",1)
    old="else{let m=$('#soloDockMessage');if(m)m.textContent=`“${name}”还不能解释全部数字。继续看左侧题面。`;setFeedback('这条规则还不对，题面不会被遮住，可以直接继续判断。','bad')}"
    new="else{abMistakes++;let m=$('#soloDockMessage');if(m)m.textContent=`“${name}”还不能解释全部数字。A/B 判断错误累计 ${abMistakes} 次。`;setFeedback(abMistakes===1?'这条规则还不对：本局积分将减半。':'再次判断错误：本局将不再获得 R积分。','bad')}"
    if old not in r: raise SystemExit('resolveGuess wrong branch not found')
    r=r.replace(old,new,1)
    start=r.find('function finishGame(){')
    end=r.find('\nconst VICTORY_ART=',start)
    if start<0 or end<0: raise SystemExit('finishGame boundaries not found')
    newf=r'''function finishGame(){
  $('#finishPanel').classList.remove('hidden');
  if(playMode==='solo'&&!window.__hqScoreSent){
    window.__hqScoreSent=true;
    const runId='rings-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
    const payload={type:'ratiobot-game-clear',game:'rings',mode:'solo',playMode:'solo',runId,signature:rounds.map(r=>r.aRule+'>'+r.bRule).join('|'),challenge:(totalFails<=3&&totalOps<=16),roundCount:rounds.length,totalOps,totalFails,abMistakes,grade:(totalOps<=14?'S · 很会选线索':totalOps<=19?'A · 推理很稳':totalOps<=25?'B · 已掌握':'继续优化策略')};
    try{localStorage.setItem('ratiobot_rings_pending_v48',JSON.stringify(payload))}catch(e){}
    try{parent.postMessage(payload,'*')}catch(e){}
    try{if(parent&&parent!==window&&typeof parent.ratiobotAwardRings==='function'){const res=parent.ratiobotAwardRings(payload);setTimeout(()=>window.postMessage(res,'*'),0);try{localStorage.removeItem('ratiobot_rings_pending_v48')}catch(e){}}}catch(e){}
  }
  if(playMode==='duel'){
    let a=duelPlayers[0],b=duelPlayers[1],winner=a.wins===b.wins?null:(a.wins>b.wins?0:1);$('#finishTitle').textContent=winner===null?'PK 平局！':`${duelPlayers[winner].name} 获胜！`;$('#finalScores').innerHTML=`<span>${esc(a.name)}：<b>${a.wins}</b> 局 / ${a.ops} 次投放</span><span>${esc(b.name)}：<b>${b.wins}</b> 局 / ${b.ops} 次投放</span><span>总失败投放：<b>${totalFails}</b></span><span>机制：成功交棒 + 追平破解</span>`;showCelebration(winner===null?'draw':'duel',winner===null?'平局':duelPlayers[winner].name,winner)
  }else{
    let grade=totalOps<=14?'S · 很会选线索':totalOps<=19?'A · 推理很稳':totalOps<=25?'B · 已掌握':'继续优化策略';$('#finishTitle').textContent='挑战完成！';$('#finalScores').innerHTML=`<span>总操作：<b>${totalOps}</b></span><span>失败投放：<b>${totalFails}</b></span><span>A/B 判断错误：<b>${abMistakes}</b></span><span>策略评级：<b>${grade}</b></span><span id="sessionRPointLine">本次获得：<b>总部结算中…</b></span>`;showCelebration('solo','单人挑战')
  }
}
'''
    r=r[:start]+newf+r[end:]
    rings.write_text(r,'utf-8')

for page in (index,rings):
    txt=page.read_text('utf-8')
    scripts=re.findall(r'<script(?:[^>]*)>(.*?)</script>',txt,flags=re.S|re.I)
    with tempfile.TemporaryDirectory() as td:
        for i,js in enumerate(scripts):
            if not js.strip(): continue
            f=Path(td)/f's{i}.js';f.write_text(js,'utf-8')
            subprocess.run(['node','--check',str(f)],check=True,stdout=subprocess.DEVNULL)
print('rings reliable patch v48 applied')
