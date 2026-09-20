"""Rebuild prompts from the supplied DOCX, keeping exact text and punctuation.
Usage: python scripts/import-review-source.py /path/to/source.docx
"""
import sys,json,re,hashlib,subprocess
from zipfile import ZipFile
from xml.etree import ElementTree as E
from pathlib import Path
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','m':'http://schemas.openxmlformats.org/officeDocument/2006/math'}
with ZipFile(sys.argv[1]) as z: root=E.fromstring(z.read('word/document.xml'))
ps=[''.join(n.text or '' for n in p.iter() if n.tag in ('{'+ns['w']+'}t','{'+ns['m']+'}t')) for p in root.findall('.//w:body//w:p',ns)]
pages={};page=None
for i,t in enumerate(ps):
 if re.fullmatch(r'教材 P\d+',t):page=int(t.split('P')[1])
 pages[i]=page
specs=[]
def add(pars,keys,start=None,end=None):specs.append((pars if isinstance(pars,list) else [pars],keys.split('|'),start,end))
add(6,'正数|负数',end='0既不是')
add(6,'正数|负数',start='0既不是')
add(8,'正整数|零|负整数|整数',start='正整数、',end='正整数和零')
add(8,'正整数|零|自然数',start='正整数和零')
add(9,'整数|分数|有理数',end='有理数也')
add(9,'正有理数|零|负有理数',start='有理数也',end='正有理数和零')
add(9,'正有理数|零|非负数',start='正有理数和零')
add(14,'原点|正方向|单位长度|直线|数轴')
add(13,'0|原点|正方向|负方向',end='3. 取')
add(18,'右边|左边|大')
add(21,'大于|小于|大于')
add([24,25],'有且只有一种|a>b|a=b|a<b')
add([28,29,30,31],'传递性|a>c|a<c')
add(36,'数轴|原点|距离|绝对值')
add(37,'绝对值|非负数')
add(41,'只有符号不同|互为相反数')
add([43,44],'互为相反数|绝对值|相等')
add(46,'-(-a)=a|相反数|本身')
add([48,49,50,52],'本身|相反数|0')
add([54,55,57],'正数|大|负数|小')
add(61,'同号|相同的符号|绝对值|相加')
add(62,'异号|绝对值不等|绝对值较大的加数|符号|较大的绝对值|减去|较小的绝对值')
# Retain the complete sentence so its original semicolon and context are not rewritten.
add(62,'绝对值相等|0')
add(63,'0|这个数')
add(66,'a+b=0|互为相反数')
add([70,71],'减去|加上|相反数')
add(74,'减法法则|加法运算')
add(78,'同号|正|异号|负|绝对值|相乘')
add(79,'任何数|0')
add(83,'交换律|b×a')
add(84,'结合律|a×(b×c)')
add(85,'分配律|a×c+b×c')
add(89,'a×b=1|互为倒数')
add([92,93],'不等于0|乘|倒数')
add(95,'不等于0|同号|正|异号|负|绝对值|相除')
add(96,'不等于0|0')
add(98,'分数|a/b|b≠0')
add(102,'相同因数|积|乘方|底数|个数|指数|幂',end='乘方运算本质上')
add(102,'乘法运算|同一个因数|连乘',start='乘方运算本质上')
add(104,'1|省略不写',end='当底数为1')
add(104,'1ⁿ=1|0ⁿ=0',start='当底数为1')
add(106,'奇数|负数|偶数|正数')
add(108,'正数|正数')
add(109,'二次方|平方|非负数')
add(109,'三次方|立方|正数|负数')
add(112,'a×10ⁿ|1≤|a|<10|正整数|科学记数法')
# Vertical bars are meaningful inside this formula, so specify these spans explicitly.
specs[-1]=(specs[-1][0],['a×10ⁿ','1≤|a|<10','正整数','科学记数法'],None,None)
add(115,'乘方|乘除|加减|括号内')
old=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./site/review-engine.js').bank))"]))
rows=[];manifest=[]
for i,(pars,keys,start,end) in enumerate(specs):
 text='\n'.join(ps[n] for n in pars)
 if start:text=text[text.index(start):]
 if end:text=text[:text.index(end)]
 cursor=0;parts=[]
 for key in keys:
  pos=text.find(key,cursor)
  if pos<0:raise ValueError((i+1,key,text))
  parts.extend([text[cursor:pos],'{'+key+'}']);cursor=pos+len(key)
 parts.append(text[cursor:]);marked=''.join(parts)
 assert re.sub(r'[{}]','',marked)==text
 rows.append([old[i]['lesson'],old[i]['title'],marked,pages[pars[0]]])
 manifest.append({'id':old[i]['id'],'page':pages[pars[0]],'sha256':hashlib.sha256(text.encode()).hexdigest(),'paragraphs':pars})
assert len(rows)==47
p=Path('site/review-engine.js');s=p.read_text();a=s.index('const rows=');b=s.index('const bank=',a)
s=s[:a]+'const rows='+json.dumps(rows,ensure_ascii=False,indent=2)+';\n'+s[b:]
s=s.replace('([lesson,title,text],i)', '([lesson,title,text,page],i)').replace('chapter:2,lesson,title,text,parts:', 'chapter:2,lesson,title,text,page,parts:')
p.write_text(s)
Path('tests/review-source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('PASS: 47 prompts copied from DOCX spans; punctuation and page provenance preserved')
