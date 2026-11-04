"""Extend vetted positional question pools to 50 cards, preserving existing IDs."""
import json,random,copy,re
from pathlib import Path
from fractions import Fraction as F
p=Path('site/special-practice-data.js');s=p.read_text();data=json.loads(s[s.index('['):s.rindex(']')+1]);rng=random.Random(20261104)
base=copy.deepcopy(data)
for code in dict.fromkeys(c['code'] for c in base):
 pool=[c for c in base if c['code']==code];seen={json.dumps([c['questions'],c.get('value'),c.get('diagram')]) for c in pool}
 while len([c for c in data if c['code']==code])<50:
  c=copy.deepcopy(rng.choice(pool));num=sum(z['code']==code for z in data)+1
  if code=='B6':
   u,v,w,t=[rng.randint(1,6) for _ in range(4)]
   c['questions']=[f'ax+{u}x-{v}',f'{u}(mx+{v})-{w}x',f'ax^2+bx-{u}x^2+{v}x-{w}',f'2(mx^2-{u}x+1)+{v}x^2+nx',rf'3\left(mx^2+x-\frac{{1}}{{3}}\right)-{t}x^2+2nx']
   c['answers']=[[str(-u)],[str(F(w,u))],[str(u),str(-v)],[str(F(-v,2)),str(2*u)],[str(F(t,3)),'-3/2']]
   c['labels']=[['a'],['m'],['a','b'],['m','n'],['m','n']]
  elif code=='B7':
   u,v,w,t=[rng.randint(1,6) for _ in range(4)]
   c['questions']=[f'|x-{u}|={v}',f'|x+{w}|={t}',f'(x-{w})^2={v*v}',f'(x+{u})^2={t*t}',f'|x-{t}|=0']
   c['answers']=[[str(u-v),str(u+v)],[str(-w-t),str(-w+t)],[str(w-v),str(w+v)],[str(-u-t),str(-u+t)],[str(t)]]
   c['labels']=[['x','x']]*4+[['x']]
  elif code=='C2':
   old=[z for z in c['diagram']['labels'] if z.isalpha()];new=rng.sample(list('abcmxy'),3);mapping=dict(zip(old,new))
   c['questions']=[re.sub('[a-z]',lambda m:mapping.get(m[0],m[0]),q) for q in c['questions']];c['diagram']['labels']=[mapping.get(z,z) for z in c['diagram']['labels']]
  else:
   for i in range(5):
    source=rng.choice(pool);c['questions'][i]=source['questions'][i];c['answers'][i]=source['answers'][i]
   if code=='B3':
    av=F(c['value']); c['answers']=[]
    for q in c['questions']:
     # Bank contains only small integer polynomial expressions in a.
     assert re.fullmatch(r'[0-9a+*()^\-]+',q)
     expr=re.sub(r'(\d)a',r'\1*a',q).replace('^','**')
     c['answers'].append([str(eval(expr,{'__builtins__':{}},{'a':av}))])
  sig=json.dumps([c['questions'],c.get('value'),c.get('diagram')])
  if sig in seen:continue
  seen.add(sig);c['set']=num;c['id']=f'{code}-{num:02}';data.append(c)
data.sort(key=lambda c:(c['code'][0],int(c['code'][1:]),c['set']))
assert len(data)==800
p.write_text('window.SpecialPracticeCards='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
print('800 groups / 4000 questions; original groups retained')
