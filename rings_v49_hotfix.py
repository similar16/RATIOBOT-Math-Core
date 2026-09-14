from pathlib import Path
import sys,re,subprocess,tempfile
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
index=root/'index.html'; rings=root/'rings.html'
s=index.read_text('utf-8')
if 'rings-reliable-v49' not in s:
    s=s.replace('</style>','\n/* rings-reliable-v49 */\n</style>',1)
    old="function processRingsPayload(d){try{const result=ratiobotAwardRings(d);ringsResultMessage(result);return result}catch(e){console.error('rings award failed',e);return {type:'ratiobot-score-result',gain:0,message:'数圈结算失败，请返回总部后重试'}}}"
    new="function processRingsPayload(d){try{const result=ratiobotAwardRings(d);if(!result?.duplicate)ringsResultMessage(result);return result}catch(e){console.error('rings award failed',e);return {type:'ratiobot-score-result',gain:0,message:'数圈结算失败，请返回总部后重试'}}}"
    if old not in s: raise SystemExit('v49 parent payload target not found')
    s=s.replace(old,new,1)
    index.write_text(s,'utf-8')

r=rings.read_text('utf-8')
if 'rings-reliable-child-v49' not in r:
    r=r.replace('/* rings-reliable-child-v48 */','/* rings-reliable-child-v48 */ /* rings-reliable-child-v49 */',1)
    old="""    try{localStorage.setItem('ratiobot_rings_pending_v48',JSON.stringify(payload))}catch(e){}
    try{parent.postMessage(payload,'*')}catch(e){}
    try{if(parent&&parent!==window&&typeof parent.ratiobotAwardRings==='function'){const res=parent.ratiobotAwardRings(payload);setTimeout(()=>window.postMessage(res,'*'),0);try{localStorage.removeItem('ratiobot_rings_pending_v48')}catch(e){}}}catch(e){}"""
    new="""    let settled=false;
    try{if(parent&&parent!==window&&typeof parent.ratiobotAwardRings==='function'){const res=parent.ratiobotAwardRings(payload);if(res&&!res.duplicate)setTimeout(()=>window.postMessage(res,'*'),0);settled=true;try{localStorage.removeItem('ratiobot_rings_pending_v48')}catch(e){}}}catch(e){}
    if(!settled){try{localStorage.setItem('ratiobot_rings_pending_v48',JSON.stringify(payload))}catch(e){};try{parent.postMessage(payload,'*')}catch(e){}}"""
    if old not in r: raise SystemExit('v49 child settlement target not found')
    r=r.replace(old,new,1)
    rings.write_text(r,'utf-8')

for page in (index,rings):
    txt=page.read_text('utf-8')
    for i,js in enumerate(re.findall(r'<script(?:[^>]*)>(.*?)</script>',txt,flags=re.S|re.I)):
        if not js.strip(): continue
        with tempfile.NamedTemporaryFile('w',suffix='.js',encoding='utf-8',delete=False) as f:
            f.write(js); name=f.name
        subprocess.run(['node','--check',name],check=True,stdout=subprocess.DEVNULL)
print('rings v49 hotfix applied')
