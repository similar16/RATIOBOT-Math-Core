/* Knowledge recall: pure, deterministic-testable rules. */
(function(root){
'use strict';
const lessons=['正数与负数','数轴','绝对值与相反数','有理数的加法与减法','有理数的乘法与除法','有理数的乘方','有理数的混合运算'];
// Braces mark independently selectable answer positions, not global word replacements.
const rows=[
[1,'正负数辨认','+5属于{正数}，−5属于{负数}。'],
[1,'0的特殊性','0既不属于{正数}，也不属于{负数}。'],
[1,'整数的组成','{正整数}、{零}、{负整数}共同组成{整数}。'],
[1,'自然数','{自然数}包括{正整数}和{零}。'],
[1,'有理数的定义','{有理数}由{整数}和{分数}组成。'],
[1,'按正负分类','有理数按正负分为{正有理数}、{零}、{负有理数}。'],
[1,'非负数','在有理数范围内，{正有理数}和{零}合起来是{非负数}。'],
[2,'数轴三要素','一条{直线}上规定{原点}、{正方向}、{单位长度}，就得到{数轴}。'],
[2,'原点与方向','数轴上表示{0}的点是{原点}；{负方向}与正方向相反。'],
[2,'数轴比较大小','数轴上两点比较，{右边}的数比{左边}的数{大}。'],
[2,'正数 0 负数的大小','正数{大于}0，负数{小于}0；正数{大于}负数。'],
[2,'大小关系的唯一性','a与b比较，a>b、a=b、a<b中{有且只有一种}成立；相等写成{a=b}。'],
[2,'大小关系的传递性','若a>b且b>c，则{a>c}；若a<b且b<c，则{a<c}。这体现{传递性}。'],
[3,'绝对值的定义','数的{绝对值}表示数轴上对应点到{原点}的{距离}。'],
[3,'绝对值的非负性','任意有理数的{绝对值}都是{非负数}。'],
[3,'相反数','两个非零数{只有符号不同}，就{互为相反数}；0的相反数为{0}。'],
[3,'相反数与绝对值','两个数{互为相反数}，它们的{绝对值}{相等}。'],
[3,'相反数的相反数','取一个数的{相反数}，再取相反数，得到这个数{本身}，即−(−a)={a}。'],
[3,'求绝对值','正数的绝对值为它{本身}，负数的绝对值为它的{相反数}，0的绝对值为{0}。'],
[3,'绝对值比较大小','两个正数中，绝对值大的数较{大}；两个负数中，绝对值大的数较{小}。'],
[4,'同号相加','{同号}相加，和取{相同的符号}；两个数的{绝对值}要{相加}。'],
[4,'异号相加 绝对值不等','{异号}相加且{绝对值不等}时，和的符号跟{绝对值较大的加数}相同；用{较大的绝对值}{减去}{较小的绝对值}。'],
[4,'异号相加 绝对值相等','两数异号且{绝对值相等}时，相加结果为{0}。'],
[4,'与0相加','一个数加上{0}，结果仍是{这个数}。'],
[4,'和为0','若{a+b=0}，则a和b{互为相反数}。'],
[4,'减法法则','{减去}一个数，可以改成{加上}它的{相反数}。'],
[4,'加减统一','利用{减法法则}，加减混合运算能统一成{加法运算}。'],
[5,'乘法法则','相乘时，{同号}得{正}，{异号}得{负}，并将{绝对值}{相乘}。'],
[5,'与0相乘','{任何数}乘以0，结果都为{0}。'],
[5,'乘法交换律','乘法{交换律}写成：a×b={b×a}。'],
[5,'乘法结合律','乘法{结合律}写成：(a×b)×c={a×(b×c)}。'],
[5,'分配律','乘法{分配律}写成：(a+b)×c={a×c+b×c}。'],
[5,'倒数','若{a×b=1}，则a和b{互为倒数}。'],
[5,'除法转乘法','除数必须{不等于0}。除以这个数，可改为{乘}它的{倒数}。'],
[5,'除法符号','两个非零数相除：{同号}得{正}，{异号}得{负}，{绝对值}要{相除}。'],
[5,'0作被除数','0除以一个{不等于0}的数，结果是{0}。'],
[5,'除法与分数','a÷b可写为{a/b}，条件为{b≠0}；这种写法是{分数}形式。'],
[6,'乘方及各部分','求{相同因数}的{积}叫{乘方}；相同因数叫{底数}，因数的{个数}叫{指数}，结果叫{幂}。'],
[6,'乘方的本质','乘方本质是{乘法运算}，用来简写{同一个因数}的{连乘}。'],
[6,'指数为1','指数为{1}时，通常{省略不写}。'],
[6,'底数为1或0','当n为正整数时，1ⁿ={1}，0ⁿ={0}。'],
[6,'负数的幂','负数的{奇数}次幂是{负数}，{偶数}次幂是{正数}。'],
[6,'正数的幂','底数为{正数}、指数为正整数时，幂为{正数}。'],
[6,'平方','{二次方}也叫{平方}，有理数的平方均为{非负数}。'],
[6,'立方','{三次方}也叫{立方}；正数的立方为{正数}，负数的立方为{负数}。'],
[6,'科学记数法','把绝对值大于10的数记为{a×10^n}，其中{1≤|a|<10}，n为{正整数}，这叫{科学记数法}。'],
[7,'混合运算顺序','按先{乘方}、再{乘除}、最后{加减}的顺序计算；遇到括号，先算{括号内}。']
];
const bank=rows.map(([lesson,title,text],i)=>({id:'ch2-'+(i+1),order:i+1,chapter:2,lesson,title,text,parts:text.split(/\{([^{}]+)\}/g)}));
const day=(d=new Date())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(d);
const normalize=s=>String(s??'').replace(/ⁿ/g,'^n').normalize('NFKC').trim().replace(/\s/g,'').replace(/[−–]/g,'-').replace(/\*/g,'×').replace(/<=/g,'≤').replace(/>=/g,'≥').replace(/!=/g,'≠').replace(/ⁿ/g,'^n');
function eligible(progress,all=bank,today=day()){return all.filter(x=>x.order<=Number(progress?.through||0)&&progress?.dates?.[x.id]&&progress.dates[x.id]<=today);}
function batch(progress,all=bank,rng=Math.random,today=day(),previous=''){
 const pool=eligible(progress,all,today);if(!pool.length)return [];
 const newest=pool.reduce((a,b)=>a.order>b.order?a:b),chapter=newest.chapter;
 const current=pool.filter(x=>x.chapter===chapter),older=pool.filter(x=>x.chapter<chapter),prevChapter=Math.max(...older.map(x=>x.chapter));
 const primary=current.length>=4?current:current.concat(older.filter(x=>x.chapter===prevChapter));
 const recent=primary.filter(x=>{const age=(Date.parse(today)-Date.parse(progress.dates[x.id]))/86400000;return age>=0&&age<3;});
 const result=[];
 function pick(source){let available=source.filter(x=>!result.some(y=>y.id===x.id)&&x.id!==previous);if(!available.length)available=source.filter(x=>x.id!==(result.at(-1)?.id||previous));if(!available.length)available=source;
 const weights=available.map(x=>1/(1+Math.max(0,newest.order-x.order)/4)),total=weights.reduce((a,b)=>a+b,0);let n=rng()*total;return available.find((x,i)=>(n-=weights[i])<0)||available.at(-1);}
 for(let i=0;i<5;i++){const source=i<2&&recent.length?recent:i<4?primary:(older.length?older:primary);result.push(pick(source));}
 return result;
}
function question(item,rng=Math.random){const indices=item.parts.map((_,i)=>i).filter(i=>i%2);for(let i=indices.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[indices[i],indices[j]]=[indices[j],indices[i]];}return {item,blanks:indices.slice(0,2+Math.floor(rng()*(Math.min(6,indices.length)-1))).sort((a,b)=>a-b)};}
function grade(q,answers){const correct=q.blanks.map((index,i)=>normalize(answers[i])===normalize(q.item.parts[index]));return {correct,count:correct.filter(Boolean).length,ok:correct.every(Boolean)};}
function makeupTarget(p,today=day()) {const c=p.economy.checkin;if(c.makeupEarnedDate===today)return {error:'今天已经完成过补签。'};let count=0,target='';for(let i=1;i<=10;i++){const k=new Date(Date.parse(today+'T00:00:00Z')-i*86400000).toISOString().slice(0,10),r=c.days[k];if(r?.makeup)count++;if(i<=7&&!target&&!r?.checked)target=k;}return count>=2?{error:'最近10天已补签2天。'}:target?{target}:{error:'最近7天没有漏签日。'};}
function settle(p,run,answers,{today=day(),now=Date.now()}={}){
 const e=p.economy,c=e.checkin,mod=e.modules.knowledge||(e.modules.knowledge={receipts:[]});mod.receipts=mod.receipts||[];
 if(mod.receipts.includes(run.id))return {duplicate:true};const result=grade(run.q,answers),r=c.days[today]||(c.days[today]={points:0,checked:false,full:false,runs:{}});
 const gain=Math.min(result.count,Math.max(0,40-(r.points||0)));r.points=(r.points||0)+gain;r.checked=!!r.checked||r.points>=20;r.full=!!r.full||r.points>=40;e.credits+=gain;e.lifetimeCredits+=gain;e.daily={date:today,earned:r.points};mod.earned=(mod.earned||0)+gain;mod.receipts.push(run.id);mod.receipts=mod.receipts.slice(-200);
 const streak=result.ok?(run.streak||0)+1:0;let repaired='',repairError='';if(run.repair&&streak>=5){const m=makeupTarget(p,today);if(m.error)repairError=m.error;else if(m.target!==run.target)repairError='漏签状态已变化，请重新开始补签。';else{const d=c.days[m.target]||(c.days[m.target]={points:0,runs:{}});d.checked=true;d.makeup=true;d.full=false;c.makeupEarnedDate=today;repaired=m.target;}}
 const seconds=Math.max(0,(now-run.started)/1000);p.games=(p.games||0)+1;p.questions=(p.questions||0)+run.q.blanks.length;
 p.history.unshift({game:'knowledge',stage:'knowledge',numberType:run.q.item.title,difficulty:run.repair?'补签复习':'知识回顾',at:new Date(now).toISOString(),runId:run.id,accuracy:Math.round(result.count/run.q.blanks.length*100),avgTime:seconds/run.q.blanks.length,durationSeconds:Math.round(seconds),rGain:gain,correctBlanks:result.count,totalBlanks:run.q.blanks.length,qualified:result.ok,repairDate:repaired});p.history=p.history.slice(0,10);
 return {...result,gain,streak,repaired,repairError};
}
const api={lessons,bank,day,normalize,eligible,batch,question,grade,makeupTarget,settle};if(typeof module==='object')module.exports=api;else root.KnowledgeReview=api;
})(typeof window==='object'?window:this);
