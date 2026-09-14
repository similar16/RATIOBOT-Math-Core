from pathlib import Path
import re,sys,subprocess,tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'; s=p.read_text('utf-8')
if 'xp-balance-v52' not in s:
    s=s.replace('</style>','\n/* xp-balance-v52 */\n</style>',1)
    pat=r"function levelInfo\(totalXP\)\{let level=1,spent=0,need=120;while\(level<120&&totalXP>=spent\+need\)\{spent\+=need;level\+\+;need=120\+\(level-1\)\*60;\}if\(level>=120\)\{return \{level:120,into:0,need:0,pct:100,toNext:0,capped:true,spent\};\}const into=Math.max\(0,totalXP-spent\),pct=Math.max\(0,Math.min\(100,Math.round\(into/need\*100\)\)\);return \{level,into,need,pct,toNext:Math.max\(0,need-into\),capped:false,spent\};\}"
    repl="function levelInfo(totalXP){let level=1,spent=0,need=260;while(level<120&&totalXP>=spent+need){spent+=need;level++;need=260+(level-1)*85;}if(level>=120){return {level:120,into:0,need:0,pct:100,toNext:0,capped:true,spent};}const into=Math.max(0,totalXP-spent),pct=Math.max(0,Math.min(100,Math.round(into/need*100)));return {level,into,need,pct,toNext:Math.max(0,need-into),capped:false,spent};}"
    s,n=re.subn(pat,repl,s,count=1)
    if n!=1: raise SystemExit('levelInfo target not found')
    old="function calcQuestionXP(q,first,hints){const dm={easy:1,normal:1.3,hard:1.6}[q.difficulty]||1;const nm={integer:1,intdec:1.1,intfrac:1.2,fracdec:1.3}[q.numberType]||1;const sm={add:1,addsub:1.05,mul:1,muldiv:1.08,mixed:1.18,power:1.15,supermixed:1.32}[q.stage]||1;const perf=first?1:.6,hint=hints>0?.78:1;return Math.max(2,Math.round(10*dm*nm*sm*perf*hint));}"
    new="function calcQuestionXP(q,first,hints){const dm={easy:1,normal:1.3,hard:1.6}[q.difficulty]||1;const nm={integer:1,intdec:1.1,intfrac:1.2,fracdec:1.3}[q.numberType]||1;const sm={add:1,addsub:1.05,mul:1,muldiv:1.08,mixed:1.18,power:1.15,supermixed:1.32}[q.stage]||1;const perf=first?1:.6,hint=hints>0?.78:1;return Math.max(2,Math.round(8*dm*nm*sm*perf*hint));}"
    if old not in s: raise SystemExit('calcQuestionXP target not found')
    s=s.replace(old,new,1)
    p.write_text(s,'utf-8')
for js in re.findall(r'<script(?:[^>]*)>(.*?)</script>',s,flags=re.S|re.I):
    if not js.strip(): continue
    with tempfile.NamedTemporaryFile('w',suffix='.js',encoding='utf-8',delete=False) as f: f.write(js); name=f.name
    subprocess.run(['node','--check',name],check=True,stdout=subprocess.DEVNULL)
print('xp balance v52 applied')
