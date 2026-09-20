/* Knowledge recall: pure, deterministic-testable rules. */
(function(root){
'use strict';
const lessons=['正数与负数','数轴','绝对值与相反数','有理数的加法与减法','有理数的乘法与除法','有理数的乘方','有理数的混合运算'];
// Braces mark independently selectable answer positions, not global word replacements.
const rows=[
  [
    1,
    "正负数辨认",
    "像8848.86，4，+40000，1.7这样的数是{正数}（positive number）；像-80.97，-6，-10000，-0.6这样的数是{负数}（negative number）。",
    13
  ],
  [
    1,
    "0的特殊性",
    "0既不是{正数}，也不是{负数}。",
    13
  ],
  [
    1,
    "整数的组成",
    "{正整数}、{零}、{负整数}统称为{整数}（integer）。",
    13
  ],
  [
    1,
    "自然数",
    "{正整数}和{零}就是我们熟悉的{自然数}。",
    13
  ],
  [
    1,
    "有理数的定义",
    "{整数}和{分数}统称为{有理数}（rational number）。",
    13
  ],
  [
    1,
    "按正负分类",
    "有理数也可以分为{正有理数}、{零}和{负有理数}。",
    13
  ],
  [
    1,
    "非负数",
    "{正有理数}和{零}属于{非负数}。",
    13
  ],
  [
    2,
    "数轴三要素",
    "像这样规定了{原点}、{正方向}和{单位长度}的{直线}叫作{数轴}（number axis）。",
    16
  ],
  [
    2,
    "原点与方向",
    "1. 画一条直线，并在这条直线上取一点表示{0}，我们把这个点称为{原点}（origin）。2. 规定直线的一个方向为{正方向}（画箭头表示），相反的方向为{负方向}。",
    16
  ],
  [
    2,
    "数轴比较大小",
    "在数轴上表示的两个数，{右边}的数比{左边}的数{大}。",
    18
  ],
  [
    2,
    "正数 0 负数的大小",
    "正数都{大于}0，负数都{小于}0，正数{大于}负数。",
    18
  ],
  [
    2,
    "大小关系的唯一性",
    "对于有理数 a，b，下列三种关系{有且只有一种}成立：\n{a>b}，{a=b}，{a<b}。",
    19
  ],
  [
    2,
    "大小关系的传递性",
    "根据数轴上点的位置关系，可以发现有理数的大小关系仍具有{传递性}。\n对于有理数 a，b，c，\n如果 a>b，且 b>c，那么 {a>c}；\n如果 a<b，且 b<c，那么 {a<c}。",
    20
  ],
  [
    3,
    "绝对值的定义",
    "一般地，{数轴}上表示一个数的点到{原点}的{距离}叫作这个数的{绝对值}（absolute value）。数 a 的绝对值记为 |a|，读作“a 的绝对值”。",
    22
  ],
  [
    3,
    "绝对值的非负性",
    "任意一个数的{绝对值}都是{非负数}。",
    22
  ],
  [
    3,
    "相反数",
    "像5与-5，2.5与-2.5，2/3与-2/3这样，{只有符号不同}的两个数称为{互为相反数}（opposite number）。例如，5与-5互为相反数，也可以说5是-5的相反数，-5是5的相反数。0的相反数是0。",
    24
  ],
  [
    3,
    "相反数与绝对值",
    "{互为相反数}的两个数{绝对值}{相等}。\n也可以表示为：|-a|=|a|。",
    25
  ],
  [
    3,
    "相反数的相反数",
    "对于任意的数 a 都有 {-(-a)=a}，也就是说，一个数的{相反数}的相反数就是这个数{本身}。",
    25
  ],
  [
    3,
    "求绝对值",
    "正数的绝对值是它{本身}；\n负数的绝对值是它的{相反数}；\n{0}的绝对值是0。\n也可以表示为：当 a>0 时，|a|=a；当 a<0 时，|a|=-a；当 a=0 时，|a|=0。",
    26
  ],
  [
    3,
    "绝对值比较大小",
    "两个{正数}，绝对值{大}的正数大；\n两个{负数}，绝对值大的负数{小}。\n也可以表示为：当 a>0，b>0 时，若 |a|>|b|，则 a>b；当 a<0，b<0 时，若 |a|>|b|，则 a<b。",
    27
  ],
  [
    4,
    "同号相加",
    "{同号}两数相加，取{相同的符号}，并把{绝对值}{相加}。",
    31
  ],
  [
    4,
    "异号相加 绝对值不等",
    "{异号}两数相加，{绝对值不等}时，取{绝对值较大的加数}的{符号}，并用{较大的绝对值}{减去}{较小的绝对值}；绝对值相等时，和为0。",
    31
  ],
  [
    4,
    "异号相加 绝对值相等",
    "异号两数相加，绝对值不等时，取绝对值较大的加数的符号，并用较大的绝对值减去较小的绝对值；{绝对值相等}时，和为{0}。",
    31
  ],
  [
    4,
    "与0相加",
    "一个数与{0}相加，仍得{这个数}。",
    31
  ],
  [
    4,
    "和为0",
    "如果 {a+b=0}，那么 a，b {互为相反数}。",
    35
  ],
  [
    4,
    "减法法则",
    "{减去}一个数，等于{加上}这个数的{相反数}。\n也可以表示为：a-b=a+(-b)。",
    36
  ],
  [
    4,
    "加减统一",
    "根据有理数{减法法则}，有理数的加减混合运算可以统一为{加法运算}。",
    38
  ],
  [
    5,
    "乘法法则",
    "两数相乘，{同号}得{正}，{异号}得{负}，并把{绝对值}{相乘}。",
    45
  ],
  [
    5,
    "与0相乘",
    "0与{任何数}相乘都得{0}。",
    45
  ],
  [
    5,
    "乘法交换律",
    "{交换律}：a×b={b×a}。",
    46
  ],
  [
    5,
    "乘法结合律",
    "{结合律}：(a×b)×c={a×(b×c)}。",
    46
  ],
  [
    5,
    "分配律",
    "{分配律}：(a+b)×c={a×c+b×c}。",
    46
  ],
  [
    5,
    "倒数",
    "一般地，如果 {a×b=1}，那么 a 和 b {互为倒数}关系，其中一个数叫作另一个数的倒数（reciprocal）。",
    47
  ],
  [
    5,
    "除法转乘法",
    "除以一个{不等于0}的数，等于{乘}这个数的{倒数}。\n也可以表示为：a÷b=a×1/b（b≠0）。",
    49
  ],
  [
    5,
    "除法符号",
    "两个{不等于0}的数相除，{同号}得{正}，{异号}得{负}，并把{绝对值}{相除}。",
    49
  ],
  [
    5,
    "0作被除数",
    "0除以任何一个{不等于0}的数，都得{0}。",
    49
  ],
  [
    5,
    "除法与分数",
    "按照小学里的习惯，两个数相除可以写成{分数}的形式，即 a÷b={a/b}（{b≠0}）。",
    49
  ],
  [
    6,
    "乘方及各部分",
    "求{相同因数}的{积}的运算叫作{乘方}（power），相同因数叫作{底数}（base number），相同因数的{个数}叫作{指数}（exponent），乘方运算的结果叫作{幂}（power），aⁿ也可以读作“a的n次幂”。",
    54
  ],
  [
    6,
    "乘方的本质",
    "乘方运算本质上是{乘法运算}，它是{同一个因数}{连乘}的简便形式。",
    54
  ],
  [
    6,
    "指数为1",
    "当指数为{1}时，指数通常{省略不写}，例如，3¹通常写成3。",
    54
  ],
  [
    6,
    "底数为1或0",
    "当底数为1时，{1ⁿ=1}（n=1，2，3，…）；当底数为0时，{0ⁿ=0}（n=1，2，3，…）。",
    54
  ],
  [
    6,
    "负数的幂",
    "负数的{奇数}次幂是{负数}，负数的{偶数}次幂是{正数}。",
    55
  ],
  [
    6,
    "正数的幂",
    "显然，{正数}的任何次幂都是{正数}。",
    55
  ],
  [
    6,
    "平方",
    "特别地，一个数的{二次方}，也称为这个数的{平方}（square），任意一个数的平方都是{非负数}；一个数的三次方，也称为这个数的立方（cube），正数的立方是正数，负数的立方是负数。",
    55
  ],
  [
    6,
    "立方",
    "特别地，一个数的二次方，也称为这个数的平方（square），任意一个数的平方都是非负数；一个数的{三次方}，也称为这个数的{立方}（cube），{正数}的立方是正数，{负数}的立方是负数。",
    55
  ],
  [
    6,
    "科学记数法",
    "一般地，一个绝对值大于10的数可以写成 {a×10ⁿ} 的形式，其中 {1≤|a|<10}，n 是{正整数}。这种记数法称为{科学记数法}（scientific notation）。当 a=1 时，可简写成 10ⁿ。",
    56
  ],
  [
    7,
    "混合运算顺序",
    "先{乘方}，后{乘除}，再{加减}；如果有括号，先进行{括号内}的运算。",
    59
  ]
];
const bank=rows.map(([lesson,title,text,page],i)=>({id:'ch2-'+(i+1),order:i+1,chapter:2,lesson,title,text,page,parts:text.split(/\{([^{}]+)\}/g)}));
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
