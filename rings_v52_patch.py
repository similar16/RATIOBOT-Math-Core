from pathlib import Path
import re,sys,subprocess,tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
index=root/'index.html'; rings=root/'rings.html'
s=index.read_text('utf-8')
if 'rings-parent-v52' not in s:
    old_listener="window.addEventListener('message',ev=>{let d=ev.data;if(!d||d.type!=='ratiobot-game-clear')return;if(d.mode==='duel'||d.playMode==='duel')return;let p=currentProfile();if(!p)return;let res=recordGameClear(p,'rings',String(d.signature||'random-rules'),!!d.challenge,'normal','rings','integer');p.economy.modules.numberRings.clears++;saveCurrentProfile(p);renderGrowth();renderStats();try{ev.source.postMessage({type:'ratiobot-score-result',message:res.gain?`总部计分 +${res.gain} R积分`:`本局 0 分：${res.reason}`},'*')}catch(e){}});"
    if old_listener not in s: raise SystemExit('original rings listener not found')
    s=s.replace(old_listener,"/* original rings listener disabled by rings-parent-v52 */",1)
    old_hist="const h=(p.history||[]).slice(0,10);$('#historyCount').textContent=h.length?`已保存 ${h.length} / 10 次`:'最多保留 10 次';$('#historyList').innerHTML=h.length?h.map((r,i)=>{const stage=E.STAGES[r.stage]?.label||r.stage,nt=r.stage==='power'?'乘方底数规则':(E.NUMBER_TYPES[r.numberType]?.label||r.numberType),diff=E.DIFFICULTY[r.difficulty]?.label||r.difficulty;const bracket=E.STAGES[r.stage]?.allowBrackets?` · 括号${r.brackets==='auto'?'自动':r.brackets+'对'}`:'';return `<div class=\"history-item\"><div class=\"history-item-head\"><div class=\"history-student\">${p.classCode}<br>学号 ${p.studentId}</div><div class=\"history-main\"><b>${stage} · ${nt}</b><span>${diff}${bracket}</span></div><div class=\"history-result\"><b>${r.accuracy}%</b><span>首次正确率</span></div></div><div class=\"history-extra\"><div><small>本局成长</small><b>+${r.xp||0} XP</b></div><div><small>最高连击</small><b>${r.bestCombo}</b></div><div><small>平均用时</small><b>${Number(r.avgTime||0).toFixed(1)} s</b></div></div><div class=\"history-time\">${displayDate(r.at)} · 完成后 Lv.${r.level||'?'} · 最近第 ${i+1} 条</div></div>`;}).join(''):'<div class=\"empty\">还没有详细训练记录。完成一局后会保存类型、难度、结果和获得的 XP。</div>';"
    new_hist="const h=(p.history||[]).slice(0,10);$('#historyCount').textContent=h.length?`已保存 ${h.length} / 10 次`:'最多保留 10 次';$('#historyList').innerHTML=h.length?h.map((r,i)=>{const isRings=r.game==='rings'||r.stage==='rings',stage=isRings?'数圈侦探':(E.STAGES[r.stage]?.label||r.stage),nt=isRings?'分类推理':(r.stage==='power'?'乘方底数规则':(E.NUMBER_TYPES[r.numberType]?.label||r.numberType)),diff=isRings?'单人闯关':(E.DIFFICULTY[r.difficulty]?.label||r.difficulty);const bracket=!isRings&&E.STAGES[r.stage]?.allowBrackets?` · 括号${r.brackets==='auto'?'自动':r.brackets+'对'}`:'';const extra=isRings?`<div><small>本局积分</small><b>+${r.rGain||0} R</b></div><div><small>A/B 判断错误</small><b>${r.abMistakes||0}</b></div><div><small>总操作 / 失败</small><b>${r.totalOps||0} / ${r.totalFails||0}</b></div>`:`<div><small>本局成长</small><b>+${r.xp||0} XP</b></div><div><small>最高连击</small><b>${r.bestCombo}</b></div><div><small>平均用时</small><b>${Number(r.avgTime||0).toFixed(1)} s</b></div>`;return `<div class=\"history-item\"><div class=\"history-item-head\"><div class=\"history-student\">${p.classCode}<br>学号 ${p.studentId}</div><div class=\"history-main\"><b>${stage} · ${nt}</b><span>${diff}${bracket}</span></div><div class=\"history-result\"><b>${r.accuracy}%</b><span>${isRings?'投放准确率':'首次正确率'}</span></div></div><div class=\"history-extra\">${extra}</div><div class=\"history-time\">${displayDate(r.at)} · 完成后 Lv.${r.level||'?'} · 最近第 ${i+1} 条</div></div>`;}).join(''):'<div class=\"empty\">还没有详细训练记录。完成运算或数圈侦探后都会保存记录。</div>';"
    if old_hist not in s: raise SystemExit('history render line not found')
    s=s.replace(old_hist,new_hist,1)
    parent_script=r'''<script id="rings-parent-v52">
(function(){
  function awardRingsV52(d={}){
    if(d.mode==='duel'||d.playMode==='duel') return {type:'ratiobot-score-result',gain:0,balance:Number(currentProfile()?.economy?.credits||0),message:'PK 模式不计 R积分'};
    let p=currentProfile();
    if(!p) return {type:'ratiobot-score-result',gain:0,balance:0,message:'未登录学生账号，本局未计分'};
    p=ensureProfileShape(p); const e=p.economy, nr=e.modules.numberRings;
    nr.processedRuns=Array.isArray(nr.processedRuns)?nr.processedRuns:[];
    const runId=String(d.runId||'rings-'+Date.now()+'-'+Math.random().toString(36).slice(2,8));
    if(nr.processedRuns.includes(runId)) return {type:'ratiobot-score-result',gain:0,balance:Number(e.credits||0),duplicate:true,message:'本局已经结算过'};
    const abMistakes=Math.max(0,Number(d.abMistakes||0));
    const baseGain=abMistakes===0?8:(abMistakes===1?4:0);
    const today=ensureTodayRecord(p), room=Math.max(0,HQ_R_DAILY_CAP-Number(today.points||0));
    const gain=Math.min(baseGain,room);
    let reason=abMistakes>=2?'A/B 判断第二次错误，本局 0 分':abMistakes===1?'A/B 第一次判断错误，本局半分':'A/B 判断无误，获得满分';
    if(room<=0&&baseGain>0) reason='今日 40 R积分已满'; else if(gain<baseGain&&gain>0) reason=`今日上限只剩 ${gain} 分`;
    if(gain>0){today.points=Number(today.points||0)+gain;e.credits=Number(e.credits||0)+gain;e.lifetimeCredits=Number(e.lifetimeCredits||0)+gain;e.daily.date=dateKey();e.daily.earned=today.points;nr.earned=Number(nr.earned||0)+gain;}
    if(d.challenge)today.challenge=true;if(today.points>=20)today.checked=true;if(today.points>=40)today.full=true;checkinMetrics(p);currentWeekInfo(p);
    const roundCount=Math.max(1,Number(d.roundCount||0)),ops=Math.max(0,Number(d.totalOps||0)),fails=Math.max(0,Number(d.totalFails||0));
    nr.clears=Number(nr.clears||0)+1;nr.archives=Number(nr.archives||0)+roundCount;if(abMistakes===0)nr.cleanRounds=Number(nr.cleanRounds||0)+1;if(String(d.grade||'').startsWith('S'))nr.sClears=Number(nr.sClears||0)+1;
    nr.processedRuns.push(runId);nr.processedRuns=nr.processedRuns.slice(-80);
    p.games=Number(p.games||0)+1;p.questions=Number(p.questions||0)+roundCount;
    const acc=ops?Math.max(0,Math.min(100,Math.round((ops-fails)/ops*100))):100, grade=String(d.grade||'—');
    const td=todayKey();if(!p.activeDates.includes(td))p.activeDates.push(td);p.activeDates=p.activeDates.slice(-60);
    p.history ||= [];p.history.unshift({at:new Date().toISOString(),classCode:p.classCode,studentId:p.studentId,game:'rings',stage:'rings',numberType:'classification',difficulty:'normal',brackets:'0',accuracy:acc,bestCombo:0,avgTime:null,xp:0,rGain:gain,level:levelInfo(p.xp).level,totalOps:ops,totalFails:fails,roundCount,abMistakes,grade,runId});p.history=p.history.slice(0,10);
    p.economy=e;saveCurrentProfile(p);renderGrowth();renderStats();
    const balance=Number(e.credits||0);return {type:'ratiobot-score-result',gain,balance,points:today.points,abMistakes,reason,message:`数圈侦探：+${gain} R积分 · ${reason} · 当前余额 ${balance}`};
  }
  window.ratiobotAwardRingsV52=awardRingsV52;
  window.addEventListener('message',ev=>{const d=ev.data;if(!d||d.type!=='ratiobot-rings-v52')return;const frame=document.querySelector('#ringsFrame');if(frame&&ev.source!==frame.contentWindow)return;const result=awardRingsV52(d);try{ev.source.postMessage(result,'*')}catch(e){}});
})();
</script>'''
    s=s.replace('</body>',parent_script+'\n</body>',1)
    index.write_text(s,'utf-8')
r=rings.read_text('utf-8')
if 'rings-reliable-child-v52' not in r:
    r=r.replace("let sessionRPoints=0,roundPointAwarded=false,finishPointAwarded=false;","let sessionRPoints=0,roundPointAwarded=false,finishPointAwarded=false,abMistakes=0; /* rings-reliable-child-v52 */",1)
    r=r.replace("ri=0;totalOps=0;totalFails=0;sessionRPoints=0;finishPointAwarded=false;roundStarter=0;","ri=0;totalOps=0;totalFails=0;sessionRPoints=0;finishPointAwarded=false;abMistakes=0;roundStarter=0;",1)
    old_wrong="else{let m=$('#soloDockMessage');if(m)m.textContent=`“${name}”还不能解释全部数字。继续看左侧题面。`;setFeedback('这条规则还不对，题面不会被遮住，可以直接继续判断。','bad')}"
    new_wrong="else{abMistakes++;let m=$('#soloDockMessage');if(m)m.textContent=`“${name}”还不能解释全部数字。A/B 判断错误累计 ${abMistakes} 次。`;setFeedback(abMistakes===1?'第一次判断错误：本局积分减半。':'第二次判断错误：本局 R积分变为 0。','bad')}"
    if old_wrong not in r: raise SystemExit('A/B wrong branch not found')
    r=r.replace(old_wrong,new_wrong,1)
    start=r.find('function finishGame(){'); end=r.find('\n\nconst VICTORY_ART=',start)
    if start<0 or end<0: raise SystemExit('finishGame boundaries not found')
    finish=r'''function finishGame(){
  $('#finishPanel').classList.remove('hidden');
  if(playMode==='solo'&&!window.__hqScoreSent){
    window.__hqScoreSent=true;
    const runId='rings-'+Date.now()+'-'+Math.random().toString(36).slice(2,9);
    const payload={type:'ratiobot-rings-v52',game:'rings',mode:'solo',playMode:'solo',runId,signature:rounds.map(r=>r.aRule+'>'+r.bRule).join('|'),challenge:(totalFails<=3&&totalOps<=16),roundCount:rounds.length,totalOps,totalFails,abMistakes,grade:(totalOps<=14?'S · 很会选线索':totalOps<=19?'A · 推理很稳':totalOps<=25?'B · 已掌握':'继续优化策略')};
    let direct=false;
    try{if(parent&&parent!==window&&typeof parent.ratiobotAwardRingsV52==='function'){const res=parent.ratiobotAwardRingsV52(payload);if(res&&!res.duplicate){sessionRPoints=Number(res.gain||0);setTimeout(()=>window.postMessage(res,'*'),0);}direct=true}}catch(e){}
    if(!direct){try{parent.postMessage(payload,'*')}catch(e){}}
  }
  if(playMode==='duel'){
    let a=duelPlayers[0],b=duelPlayers[1],winner=a.wins===b.wins?null:(a.wins>b.wins?0:1);$('#finishTitle').textContent=winner===null?'PK 平局！':`${duelPlayers[winner].name} 获胜！`;$('#finalScores').innerHTML=`<span>${esc(a.name)}：<b>${a.wins}</b> 局 / ${a.ops} 次投放</span><span>${esc(b.name)}：<b>${b.wins}</b> 局 / ${b.ops} 次投放</span><span>总失败投放：<b>${totalFails}</b></span><span>机制：成功交棒 + 追平破解</span>`;showCelebration(winner===null?'draw':'duel',winner===null?'平局':duelPlayers[winner].name,winner)
  }else{
    let grade=totalOps<=14?'S · 很会选线索':totalOps<=19?'A · 推理很稳':totalOps<=25?'B · 已掌握':'继续优化策略';$('#finishTitle').textContent='挑战完成！';$('#finalScores').innerHTML=`<span>总操作：<b>${totalOps}</b></span><span>失败投放：<b>${totalFails}</b></span><span>A/B 判断错误：<b>${abMistakes}</b></span><span>策略评级：<b>${grade}</b></span><span id="sessionRPointLine">本次获得：<b>${window.__hqScoreSent?'结算中…':'0 R积分'}</b></span>`;showCelebration('solo','单人挑战')
  }
}'''
    r=r[:start]+finish+r[end:]
    old_msg="window.addEventListener('message',e=>{if(e.data&&e.data.type==='ratiobot-score-result'){let box=document.querySelector('#finalScores');if(box){let span=document.createElement('span');span.textContent=e.data.message;box.appendChild(span)}}});"
    new_msg="window.addEventListener('message',e=>{if(e.data&&e.data.type==='ratiobot-score-result'){if(e.data.duplicate)return;sessionRPoints=Number(e.data.gain||0);let line=document.querySelector('#sessionRPointLine');if(line)line.innerHTML=`本次获得：<b>+${sessionRPoints} R积分</b>`;let box=document.querySelector('#finalScores');if(box){let old=box.querySelector('.hq-score-message');if(old)old.remove();let span=document.createElement('span');span.className='hq-score-message';span.textContent=e.data.message;box.appendChild(span)}updateScoreHud()}});"
    if old_msg not in r: raise SystemExit('score result listener not found')
    r=r.replace(old_msg,new_msg,1)
    rings.write_text(r,'utf-8')
for page in (index,rings):
    txt=page.read_text('utf-8')
    for js in re.findall(r'<script(?:[^>]*)>(.*?)</script>',txt,flags=re.S|re.I):
        if not js.strip(): continue
        with tempfile.NamedTemporaryFile('w',suffix='.js',encoding='utf-8',delete=False) as f: f.write(js); name=f.name
        subprocess.run(['node','--check',name],check=True,stdout=subprocess.DEVNULL)
print('rings v52 patch applied')
