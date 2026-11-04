import json,random,itertools
from pathlib import Path
import sympy as S
p=Path('site/special-practice-data.js');s=p.read_text();data=json.loads(s[s.index('['):s.rindex(']')+1]);data=[c for c in data if c['code'] not in ['B8','C3']];r=random.Random(48)
a,b,c=S.symbols('a b c')
def tex(e):return S.latex(e)
def card(code,n,title,color):return dict(id=f'{code}-{n:02}',code=code,set=n,title=title,color=color,questions=[],answers=[],conditions=[],diagrams=[],diagram=None,value=None)
seen=set()
for n in range(1,51):
 z=card('B8',n,'整体代入求值','DEE7E1')
 for i in range(5):
  while True:
   u,v,k,h,t=[r.randint(1,5) for _ in range(5)];v=r.choice([-1,1])*v
   if i==0:cond=f'{u}a-b={v}';q=f'{h}-{k*u}a+{k}b';ans=h-k*v
   elif i==1:cond=f'm-{u}n={v}';q=f'{h}+{k*u}n-{k}m';ans=h-k*v
   elif i==2:cond=f'{u}a-b+{t}={v+t}';q=f'{h}-{k*u}a+{k}b';ans=h-k*v
   elif i==3:cond=f'a^2-{u}a-{t}=0';q=f'{k}a^2-{k*u}a+{h}';ans=k*t+h
   else:cond=f'x^2+{u}x={v}';q=f'{h}-{k}x^2-{k*u}x';ans=h-k*v
   if (cond,q) not in seen:seen.add((cond,q));break
  z['questions'].append(q);z['conditions'].append(cond);z['answers'].append([str(ans)])
 if n==1:
  z['conditions']=['2a-b=-2','m-3n=2','2a-b+1=4','a^2-2a-4=0','x^2+3x=-2'];z['questions']=['1-4a+2b','7+6n-2m','8-4a+2b','3a^2-6a+1','5-2x^2-6x'];z['answers']=[[str(v)] for v in [5,3,2,13,9]]
 data.append(z)
 z=card('C3',n,'数轴与绝对值化简','E1E7EB')
 perms=list(itertools.permutations([a,b,c])); perm=perms[(n-1)%6];mp=dict(zip([a,b,c],perm))
 # Keep each position's skill and number of absolute values fixed.
 k=1+(n-1)//6%3;l=1+(n-1)//18;h=1+(n-1)//3%3
 terms=[[a,b],[a-b,b],[a-b,b-c,c+a],[b-c,a+c,b-a],[a+c,a-b,b-c]]
 weights=[[k,l],[k,l],[k,l,-h],[k,-l,2],[k,-2,l]]
 if n==1:weights=[[1,1],[1,1],[1,1,-1],[1,-1,2],[1,-2,1]]
 points=[[('a',-2),('0',0),('b',3)],[('a',-4),('b',-1.5),('0',0)],[('c',-4),('0',0),('a',2),('b',4)],[('c',-4),('b',-2),('0',0),('a',2.5)],[('a',-4),('b',-2),('0',0),('c',2)]]
 signs=[[-1,1],[-1,-1],[-1,1,-1],[1,-1,-1],[-1,-1,-1]]
 conditions=['','',r'|c|>a',r'|a|<|c|',r'|a|>c']
 for i in range(5):
  q='';ans=0
  for term,w,sg in zip(terms[i],weights[i],signs[i]):
   q+=('+' if w>0 and q else '-' if w<0 else '')+(str(abs(w)) if abs(w)!=1 else '')+'|'+tex(term.xreplace(mp))+'|';ans+=w*sg*term
  ans=S.expand(ans.xreplace(mp));z['questions'].append(q);z['answers'].append([str(ans).replace(' ','').replace('*','')])
  z['conditions'].append(''.join(str(mp.get(S.Symbol(ch),ch)) if ch.isalpha() else ch for ch in conditions[i]))
  pts=[(str(mp.get(S.Symbol(label),label)),pos) for label,pos in points[i]]
  z['diagrams'].append({'labels':[v[0] for v in pts],'positions':[260+v[1]*42 for v in pts]})
  vals={mp[S.Symbol(label)]:pos for label,pos in points[i] if label!='0'}
  assert S.simplify(sum(w*abs(term.xreplace(mp).subs(vals)) for term,w in zip(terms[i],weights[i]))-ans.subs(vals))==0
 data.append(z)
data.sort(key=lambda c:(c['code'][0],int(c['code'][1:]),c['set']))
p.write_text('window.SpecialPracticeCards='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
