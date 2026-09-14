from pathlib import Path
import re,sys,subprocess,tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
index=root/'index.html'; rings=root/'rings.html'
s=index.read_text('utf-8')
MARK='rings-scope-fix-v54'
if MARK not in s:
    s=re.sub(r'\s*<script id="rings-parent-v53">.*?</script>\s*', '\n', s, count=1, flags=re.S)
    s=s.replace("function ensureRingsLoaded(force=false){let f=$('#ringsFrame');if(!f)return;if(force||!f.dataset.loaded){f.src='rings.html';f.dataset.loaded='1';}}","function ensureRingsLoaded(force=false){let f=$('#ringsFrame');if(!f)return;if(force||!f.dataset.loaded){f.removeAttribute('srcdoc');f.src='rings.html?v=54';f.dataset.loaded='1';}}",1)
    anchor="    migrateLegacy();const initP=currentProfile();if(initP){state.profileKey=currentProfileKey();state.classCode=initP.classCode;state.studentId=initP.studentId;}refreshPlayerUI();renderRules();renderConfig();renderStats();renderGrowth();renderAccount();initCloud();"
    if anchor not in s: raise SystemExit('main IIFE anchor not found')
    scorer=r'''  /* rings-scope-fix-v54 */
  function awardRingsV54(d={}){
    if(d.mode==='duel'||d.playMode==='duel')return{type:'ratiobot-score-result',gain:0,balance:Number(currentProfile()?.economy?.credits||0),message:'PK 模式不计 R积分'};
    let p=currentProfile();
    if(!p)return{type:'ratiobot-score-result',gain:0,balance:0,message:'未登录学生账号，本局未计分'};
    p=ensureProfileShape(p);let e=p.economy,nr=e.modules.numberRings;
    nr.processedRuns=Array.isArray(nr.processedRuns)?nr.processedRuns:[];
    const runId=String(d.runId||'rings-'+Date.now());
    if(nr.processedRuns.includes(runId))return{type:'ratiobot-score-result',gain:0,balance:Number(e.credits||0),duplicate:true,message:'本局已经结算过'};
    const abMistakes=Math.max(0,Number(d.abMistakes||0));
    const baseGain=abMistakes===0?8:(abMistakes===1?4:0);
    const today=ensureTodayRecord(p),room=Math.max(0,HQ_R_DAILY_CAP-Number(today.points||0)),gain=Math.min(baseGain,room);
    let reason=abMistakes>=2?'A/B 判断第二次错误，本局 0 分':abMistakes===1?'A/B 第一次判断错误，本局半分':'A/B 判断无误，获得满分';
    if(room<=0&&baseGain>0)reason='今日 40 R积分已满';else if(gain<baseGain&&gain>0)reason=`今日上限只剩 ${gain} 分`;
    if(gain>0){today.points=Number(today.points||0)+gain;e.credits=Number(e.credits||0)+gain;e.lifetimeCredits=Number(e.lifetimeCredits||0)+gain;e.daily.date=dateKey();e.daily.earned=today.points;nr.earned=Number(nr.earned||0)+gain;}
    if(d.challenge)today.challenge=true;if(today.points>=20)today.checked=true;if(today.points>=40)today.full=true;checkinMetrics(p);currentWeekInfo(p);
    const roundCount=Math.max(1,Number(d.roundCount||0)),ops=Math.max(0,Number(d.totalOps||0)),fails=Math.max(0,Number(d.totalFails||0));
    nr.clears=Number(nr.clears||0)+1;nr.archives=Number(nr.archives||0)+roundCount;if(abMistakes===0)nr.cleanRounds=Number(nr.cleanRounds||0)+1;if(String(d.grade||'').startsWith('S'))nr.sClears=Number(nr.sClears||0)+1;
    nr.processedRuns.push(runId);nr.processedRuns=nr.processedRuns.slice(-80);
    p.games=Number(p.games||0)+1;p.questions=Number(p.questions||0)+roundCount;
    const acc=ops?Math.max(0,Math.min(100,Math.round((ops-fails)/ops*100))):100,grade=String(d.grade||'—');
    const td=todayKey();if(!p.activeDates.includes(td))p.activeDates.push(td);p.activeDates=p.activeDates.slice(-60);
    p.history ||= [];
    p.history.unshift({at:new Date().toISOString(),classCode:p.classCode,studentId:p.studentId,game:'rings',stage:'rings',numberType:'classification',difficulty:'normal',brackets:'0',accuracy:acc,bestCombo:0,avgTime:null,xp:0,rGain:gain,level:levelInfo(p.xp).level,totalOps:ops,totalFails:fails,roundCount,abMistakes,grade,runId});
    p.history=p.history.slice(0,10);p.economy=e;saveCurrentProfile(p);renderGrowth();renderStats();
    const balance=Number(e.credits||0);
    return{type:'ratiobot-score-result',gain,balance,points:today.points,abMistakes,reason,message:`数圈侦探：+${gain} R积分 · ${reason} · 当前余额 ${balance}`};
  }
  window.ratiobotAwardRingsV54=awardRingsV54;
  window.addEventListener('message',ev=>{const d=ev.data;if(!d||d.type!=='ratiobot-rings-v54')return;const f=$('#ringsFrame');if(f&&ev.source!==f.contentWindow)return;const res=awardRingsV54(d);try{ev.source.postMessage(res,'*')}catch(e){}});
'''
    s=s.replace(anchor,scorer+'\n'+anchor,1)
    index.write_text(s,'utf-8')
r=rings.read_text('utf-8')
if 'rings-reliable-child-v54' not in r:
    r=r.replace('rings-reliable-child-v53','rings-reliable-child-v54')
    r=r.replace("type:'ratiobot-rings-v53'","type:'ratiobot-rings-v54'")
    r=r.replace('parent.ratiobotAwardRingsV53','parent.ratiobotAwardRingsV54')
    rings.write_text(r,'utf-8')
for page in (index,rings):
    txt=page.read_text('utf-8')
    for js in re.findall(r'<script(?:[^>]*)>(.*?)</script>',txt,flags=re.S|re.I):
        if not js.strip(): continue
        with tempfile.NamedTemporaryFile('w',suffix='.js',encoding='utf-8',delete=False) as f:
            f.write(js); name=f.name
        subprocess.run(['node','--check',name],check=True,stdout=subprocess.DEVNULL)
print('rings scope fix v54 applied')
