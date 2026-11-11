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
const chapter3Rows=[
  [
    2,
    "字母式的书写",
    "一般地，数与字母、字母与字母相乘，乘号“×”通常用“{·}”表示或{省略不写}，并且把数写在字母的{前面}，如将10×a写成10a；除法运算通常写成{分数}的形式，如将10÷m写成10/m。",
    77
  ],
  [
    2,
    "代数式的定义",
    "像10a，8a+8b，10/m，10/(n+1)这样，用{运算符号}把{数和字母}连接而成的式子叫作{代数式}（algebraic expression）。",
    77
  ],
  [
    2,
    "单独的数与字母",
    "单独一个{数}或一个{字母}也是{代数式}。",
    77
  ],
  [
    2,
    "代数式的值",
    "代数式中的字母表示的是{数}，用{具体数值}代替代数式中的字母，计算所得的结果叫作{代数式的值}。",
    80
  ],
  [
    2,
    "代数式值的变化",
    "一般地，{代数式的值}随着代数式中{字母取值}的变化而变化。",
    80
  ],
  [
    3,
    "单项式的定义",
    "可以相应地列出代数式：a³，6a²，300t，πr²和πr²h。像这样，由{数与字母的积}组成的代数式叫作{单项式}（monomial expression）。单独一个{数}或一个{字母}也是单项式。",
    84
  ],
  [
    3,
    "单项式的系数与次数",
    "单项式中的{数字因数}叫作单项式的{系数}。单项式中所有字母的{指数的和}叫作单项式的{次数}。如1/2 x的系数是1/2，次数是1；-2a²的系数是-2，次数是2；abc的系数是1，次数是3。",
    84
  ],
  [
    3,
    "不含字母的单项式",
    "如果一个单项式{不含字母}，就称它的次数是{0}。",
    84
  ],
  [
    3,
    "多项式的定义",
    "代数式ab+πR²-πr²可以看作单项式ab，πR²，-πr²的和。像这样可以看作{几个单项式的和}的代数式叫作{多项式}（polynomial）。",
    85
  ],
  [
    3,
    "多项式的项与次数",
    "多项式中，每个单项式叫作多项式的{项}；其中{次数最高的项的次数}叫作这个多项式的{次数}，{不含字母的项}叫作{常数项}。例如，多项式n-2的次数是1，其中-2是常数项；多项式ab+πR²-πr²的次数是2。",
    85
  ],
  [
    3,
    "整式",
    "{单项式}和{多项式}统称{整式}（integral expression）。",
    85
  ],
  [
    3,
    "同类项",
    "一般地，所含{字母相同}，并且{相同字母的指数也相同}的项叫作{同类项}（like terms）。",
    86
  ],
  [
    3,
    "代数式与运算律",
    "代数式中的字母表示的是{数}，因此数的{运算律}也适用于代数式。",
    87
  ],
  [
    3,
    "合并同类项的定义",
    "根据运算律把多项式中的{同类项}合并成{一项}叫作{合并同类项}（unite like terms）。",
    87
  ],
  [
    3,
    "合并同类项法则",
    "同类项的{系数相加}，所得的结果作为{系数}，{字母}和字母的{指数不变}。",
    87
  ],
  [
    3,
    "多项式化简",
    "通过{合并同类项}，可以将多项式{化简}。",
    87
  ],
  [
    3,
    "先化简再求值",
    "求代数式的值时，如果代数式中含有{同类项}，通常先{合并同类项}再进行{计算}。",
    89
  ],
  [
    3,
    "去括号与运算律",
    "在进行整式的运算时，我们可以利用{运算律}把括号去掉，即\na+(b-c)={a+b-c}；\na-(b-c)=a+(-1)(b-c)={a-b+c}。",
    91
  ],
  [
    3,
    "括号前是加号",
    "括号前面是“{+}”号，把括号和它前面的“+”号去掉，括号里{各项的符号}都{不改变}。",
    91
  ],
  [
    3,
    "括号前是减号",
    "括号前面是“{-}”号，把括号和它前面的“-”号去掉，括号里{各项的符号}都要{改变}。",
    91
  ],
  [
    3,
    "整式加减的法则",
    "利用{合并同类项}与{去括号}法则，我们可以进行整式的加减运算。",
    94
  ],
  [
    3,
    "整式加减的顺序",
    "整式的加减运算，像数的运算一样满足各种{运算律}，如果有括号先{去括号}，再{合并同类项}。",
    94
  ]
];
bank.push(...chapter3Rows.map(([lesson,title,text,page],i)=>({id:"ch3-"+(i+1),order:48+i,chapter:3,lesson,title,text,page,parts:text.split(/\{([^{}]+)\}/g)})));
const chapter456Rows=[
  {
    "chapter": 4,
    "lesson": 1,
    "page": 106,
    "title": "等式",
    "text": "像2x=3y，S=xy，12a+3b=58这样，表示{相等关系}的式子叫作{等式}（equation）。",
    "id": "ch4-1",
    "order": 70
  },
  {
    "chapter": 4,
    "lesson": 1,
    "page": 107,
    "title": "等式的基本性质",
    "text": "1. 等式两边都{加上（或减去）}{同一个数或整式}，所得结果仍是{等式}。",
    "id": "ch4-2",
    "order": 71
  },
  {
    "chapter": 4,
    "lesson": 1,
    "page": 107,
    "title": "等式的基本性质",
    "text": "2. 等式两边都{乘（或除以）}{同一个数}（{除数不能为0}），所得结果仍是{等式}。",
    "id": "ch4-3",
    "order": 72
  },
  {
    "chapter": 4,
    "lesson": 1,
    "page": 107,
    "title": "等式的基本性质",
    "text": "用字母可以表示为：\n如果 a=b，那么 {a±m=b±m}；\n如果 a=b，那么 {am=bm}；\n如果 a=b，且 {m≠0}，那么 {a/m=b/m}。",
    "answerFigure": "assets/review/p107-formulas.png",
    "id": "ch4-4",
    "order": 73
  },
  {
    "chapter": 4,
    "lesson": 1,
    "page": 109,
    "title": "未知数",
    "text": "在上面的等式中，都是用字母表示要求的{未知的量}，这样的字母叫作{未知数}（unknown number）。解决上述问题的关键是求出未知数的值。",
    "id": "ch4-5",
    "order": 74
  },
  {
    "chapter": 4,
    "lesson": 1,
    "page": 109,
    "title": "方程",
    "text": "像2x+1=x+5，a+b=12，2a+b=20，0.618x²=1.6这样，{含有未知数的等式}叫作{方程}（equation）。",
    "id": "ch4-6",
    "order": 75
  },
  {
    "chapter": 4,
    "lesson": 1,
    "page": 111,
    "title": "方程的解与解方程",
    "text": "能使方程{两边的值相等}的未知数的值叫作{方程的解}（solution of equation），如x=4是方程2x+1=5+x的解。求方程的解的过程叫作{解方程}（solving equation）。",
    "id": "ch4-7",
    "order": 76
  },
  {
    "chapter": 4,
    "lesson": 2,
    "page": 113,
    "title": "一元一次方程",
    "text": "在上一节认识的方程中，像2x+1=x+5，x+1/7x=19这样，等号两边都是{整式}，且只含有{一个未知数}，未知数的次数都是{1}的方程，叫作{一元一次方程}（linear equation with one unknown）。",
    "id": "ch4-8",
    "order": 77
  },
  {
    "chapter": 4,
    "lesson": 2,
    "page": 115,
    "title": "移项",
    "text": "像这样，方程中的某些项{改变符号}后，可以从方程的一边移到{另一边}，这样的变形叫作{移项}（moving terms）。",
    "id": "ch4-9",
    "order": 78
  },
  {
    "chapter": 4,
    "lesson": 2,
    "page": 115,
    "title": "移项",
    "text": "在解一元一次方程时，移项的目的是把{含有未知数的项}移到方程的{一边}，把{常数项}移到{另一边}。",
    "id": "ch4-10",
    "order": 79
  },
  {
    "chapter": 4,
    "lesson": 2,
    "page": 115,
    "title": "解一元一次方程",
    "text": "解一元一次方程就是通过{变形}，最终将方程转化为{x=c}（c为常数）的形式。",
    "id": "ch4-11",
    "order": 80
  },
  {
    "chapter": 4,
    "lesson": 2,
    "page": 116,
    "title": "解一元一次方程——去括号",
    "text": "在解一元一次方程时，如果方程中有括号，为了将方程转化为{x=c}（c为常数）的形式，一般需要先根据{去括号法则}{去括号}。",
    "id": "ch4-12",
    "order": 81
  },
  {
    "chapter": 4,
    "lesson": 2,
    "page": 118,
    "title": "解一元一次方程的步骤",
    "text": "一般地，解一元一次方程的步骤是：{去分母}、{去括号}、{移项}、{合并同类项}、{把未知数的系数化为1}。通过这些步骤可以将一元一次方程转化为x=c（c为常数）的形式。",
    "answerFigure": "assets/review/p118-flow.png",
    "id": "ch4-13",
    "order": 82
  },
  {
    "chapter": 5,
    "lesson": 1,
    "page": 141,
    "title": "多面体",
    "text": "多面体是由{若干个面}围成的{封闭图形}，相邻两个面的公共边称为{棱}，棱与棱的交点称为{顶点}。",
    "id": "ch5-1",
    "order": 83
  },
  {
    "chapter": 5,
    "lesson": 1,
    "page": 141,
    "title": "点、线、面",
    "text": "{点}（point）、{线}（line）、{面}（surface）是构成几何体的{基本要素}。",
    "id": "ch5-2",
    "order": 84
  },
  {
    "chapter": 6,
    "lesson": 1,
    "page": 154,
    "title": "两点确定一条直线",
    "text": "{两点}确定{一条直线}。",
    "id": "ch6-1",
    "order": 85
  },
  {
    "chapter": 6,
    "lesson": 1,
    "page": 156,
    "title": "两点之间，线段最短",
    "text": "两点之间的所有连线中，{线段}{最短}。\n简单说成：两点之间，线段最短。",
    "id": "ch6-2",
    "order": 86
  },
  {
    "chapter": 6,
    "lesson": 1,
    "page": 156,
    "title": "两点之间的距离",
    "text": "两点之间{线段的长度}叫作这两点之间的{距离}（distance）。",
    "id": "ch6-3",
    "order": 87
  },
  {
    "chapter": 6,
    "lesson": 1,
    "page": 159,
    "title": "中点",
    "text": "如果一个点把一条线段分成{两条相等的线段}，那么这个点叫作这条线段的{中点}（middle point）。",
    "id": "ch6-4",
    "order": 88
  },
  {
    "chapter": 6,
    "lesson": 1,
    "page": 159,
    "title": "中点",
    "text": "如图，如果C是线段AB的{中点}，\n那么 {AC=BC=½AB} 或 {AB=2AC=2BC}。",
    "figure": "assets/review/p159-midpoint.png",
    "id": "ch6-5",
    "order": 89
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 162,
    "title": "角",
    "text": "有{公共端点}的{两条射线}组成的图形叫作{角}（angle），这个公共端点是角的{顶点}，这两条射线是角的两条{边}。",
    "id": "ch6-6",
    "order": 90
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 163,
    "title": "始边和终边",
    "text": "如图6-14，角也可以看成是一条{射线}绕着它的{端点}{旋转}到另一个位置所成的图形。起始位置和终止位置的射线分别叫作角的始边和终边。",
    "figure": "assets/review/p163-rotation.png",
    "id": "ch6-7",
    "order": 91
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 163,
    "title": "平角与周角",
    "text": "如图6-15（1），当角的终边和始边成{一条直线}时，这个角叫作{平角}。如图6-15（2），当角的终边{旋转一周}后与始边重合时，这个角叫作{周角}。",
    "figure": "assets/review/p163-flat-full.png",
    "id": "ch6-8",
    "order": 92
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 163,
    "title": "角度制",
    "text": "角的度量一般采用{角度制}，常用的{度}量单位是度、{分}、{秒}，分别用“°”“′”“″”表示，其中1°={60′}，1′={60″}。",
    "id": "ch6-9",
    "order": 93
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 163,
    "title": "等角",
    "text": "如果两个角的{度数相等}，那么就称这两个角相等，简称{等角}。两个等角可以{重合}，可以重合的角也都相等。",
    "id": "ch6-10",
    "order": 94
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 163,
    "title": "周角、平角、直角",
    "text": "一个周角等于{360°}，一个平角等于{180°}，一个直角等于{90°}。",
    "id": "ch6-11",
    "order": 95
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 165,
    "title": "补角",
    "text": "如果两个角的度数之和等于{180°}，那么这两个角互为{补角}（supplementary angle），简称{互补}。例如，∠1=60°，∠2=120°，则∠1和∠2互为补角。",
    "id": "ch6-12",
    "order": 96
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 165,
    "title": "余角",
    "text": "如果两个角的度数之和等于{90°}，那么这两个角互为{余角}（complementary angle），简称{互余}。例如，∠3=20°，∠4=70°，则∠3和∠4互为余角。",
    "id": "ch6-13",
    "order": 97
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 165,
    "title": "同角（等角）的补角相等",
    "text": "{同角（等角）}的{补角}{相等}。",
    "id": "ch6-14",
    "order": 98
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 165,
    "title": "同角（等角）的余角相等",
    "text": "{同角（等角）}的{余角}{相等}。",
    "id": "ch6-15",
    "order": 99
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 168,
    "title": "角的平分线",
    "text": "如果从角的{顶点}出发的一条{射线}把这个角分成{两个相等的角}，那么这条射线叫作这个角的{平分线}（angular bisector）。",
    "id": "ch6-16",
    "order": 100
  },
  {
    "chapter": 6,
    "lesson": 2,
    "page": 168,
    "title": "角的平分线",
    "text": "如图，如果OC是∠AOB的{平分线}，\n那么 {∠AOC=∠BOC=½∠AOB}，\n或 {∠AOB=2∠AOC=2∠BOC}。",
    "figure": "assets/review/p168-bisector.png",
    "id": "ch6-17",
    "order": 101
  },
  {
    "chapter": 6,
    "lesson": 3,
    "page": 171,
    "title": "对顶角",
    "text": "两条直线相交所成的四个角中，有{公共顶点}没有{公共边}的两个角叫作{对顶角}（opposite angles）。在图6-25中，∠1和∠3是对顶角，∠2和∠4也是对顶角。",
    "figure": "assets/review/p171-opposite.png",
    "id": "ch6-18",
    "order": 102
  },
  {
    "chapter": 6,
    "lesson": 3,
    "page": 171,
    "title": "对顶角相等",
    "text": "{对顶角}{相等}。",
    "id": "ch6-19",
    "order": 103
  },
  {
    "chapter": 6,
    "lesson": 3,
    "page": 173,
    "title": "垂直",
    "text": "如果两条直线相交所成的四个角中有一个角是{直角}，那么就称这两条直线{互相垂直}，其中的一条直线叫作另一条直线的{垂线}（perpendicular line），它们的交点叫作{垂足}（foot of a perpendicular）。",
    "id": "ch6-20",
    "order": 104
  },
  {
    "chapter": 6,
    "lesson": 3,
    "page": 173,
    "title": "垂直",
    "text": "在图6-29中，两条直线互相垂直，记作“{a⊥b}”或“{AB⊥CD}”，垂足是{O}。",
    "figure": "assets/review/p173-perpendicular.png",
    "id": "ch6-21",
    "order": 105
  },
  {
    "chapter": 6,
    "lesson": 3,
    "page": 174,
    "title": "垂直",
    "text": "在{同一平面内}，过一点{有且只有一条}直线与已知直线{垂直}。",
    "id": "ch6-22",
    "order": 106
  },
  {
    "chapter": 6,
    "lesson": 3,
    "page": 176,
    "title": "垂线段",
    "text": "如图6-35，过直线l外一点P作l的{垂线}，{垂足}为O，线段PO叫作点P到直线l的{垂线段}（vertical line segment）。",
    "figure": "assets/review/p176-segment.png",
    "id": "ch6-23",
    "order": 107
  },
  {
    "chapter": 6,
    "lesson": 3,
    "page": 176,
    "title": "垂线段最短",
    "text": "直线外一点与直线上各点连接的所有线段中，{垂线段}{最短}。",
    "id": "ch6-24",
    "order": 108
  },
  {
    "chapter": 6,
    "lesson": 3,
    "page": 177,
    "title": "点到直线的距离",
    "text": "直线外一点到这条直线的{垂线段的长度}叫作{点到直线的距离}。例如，在图6-35中，垂线段PO的长度就是点P到直线l的距离。直线上的点到这条直线的距离为{0}。",
    "figure": "assets/review/p176-segment.png",
    "id": "ch6-25",
    "order": 109
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 180,
    "title": "平行线",
    "text": "在{同一平面内}，{不相交}的两条直线叫作{平行线}（parallel lines）。",
    "id": "ch6-26",
    "order": 110
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 180,
    "title": "平行线",
    "text": "在图6-38中，a，b两条直线互相平行，记作“{a∥b}”或“{AB∥CD}”。",
    "figure": "assets/review/p180-parallel.png",
    "id": "ch6-27",
    "order": 111
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 181,
    "title": "平行线基本事实1",
    "text": "过{直线外一点}{有且只有一条}直线与这条直线{平行}。",
    "id": "ch6-28",
    "order": 112
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 183,
    "title": "同位角",
    "text": "如图6-45，两条直线a，b被第三条直线c所截，形成{八个角}。具有{∠1和∠2}这种位置关系的一对角叫作{同位角}（corresponding angles）。在图6-45中，∠3和∠4，∠5和∠6，∠7和∠8分别是同位角。",
    "figure": "assets/review/p183-corresponding.png",
    "id": "ch6-29",
    "order": 113
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 183,
    "title": "平行线基本事实2",
    "text": "两条直线被第三条直线所截，如果{同位角相等}，那么这两条直线{平行}。（简单说成：同位角相等，两直线平行。）",
    "answerFigure": "assets/review/p183-rule.png",
    "id": "ch6-30",
    "order": 114
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 185,
    "title": "内错角与同旁内角",
    "text": "如图6-49，具有{∠4和∠5}这种位置关系的一对角叫作{内错角}（alternate interior angles），具有{∠2和∠5}这种位置关系的一对角叫作{同旁内角}（interior angles on the same side）。",
    "figure": "assets/review/p185-angles.png",
    "id": "ch6-31",
    "order": 115
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 186,
    "title": "平行线的判定定理",
    "text": "两条直线被第三条直线所截，如果{内错角相等}，那么这两条直线{平行}。（简单说成：内错角相等，两直线平行。）",
    "answerFigure": "assets/review/p186-alternate.png",
    "id": "ch6-32",
    "order": 116
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 186,
    "title": "平行线的判定定理",
    "text": "两条直线被第三条直线所截，如果{同旁内角互补}，那么这两条直线{平行}。（简单说成：同旁内角互补，两直线平行。）",
    "answerFigure": "assets/review/p186-interior.png",
    "id": "ch6-33",
    "order": 117
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 188,
    "title": "平行线的性质定理1",
    "text": "两条{平行直线}被第三条直线所截，{同位角相等}。（简单说成：两直线平行，同位角相等。）",
    "id": "ch6-34",
    "order": 118
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 188,
    "title": "平行线的性质定理2",
    "text": "两条{平行直线}被第三条直线所截，{内错角相等}。（简单说成：两直线平行，内错角相等。）",
    "answerFigure": "assets/review/p189-alternate.png",
    "id": "ch6-35",
    "order": 119
  },
  {
    "chapter": 6,
    "lesson": 4,
    "page": 188,
    "title": "平行线的性质定理2",
    "text": "两条{平行直线}被第三条直线所截，{同旁内角互补}。（简单说成：两直线平行，同旁内角互补。）",
    "answerFigure": "assets/review/p189-interior.png",
    "id": "ch6-36",
    "order": 120
  },
  {
    "chapter": 6,
    "lesson": 5,
    "page": 193,
    "title": "多边形",
    "text": "在平面内，由{不在同一条直线上}的{三条或三条以上}的线段{首尾顺次相接}组成的图形叫作{多边形}（polygon）。这些线段叫作多{边}形的边（side），线段的公共端点叫作多边形的{顶点}（vertex）。",
    "id": "ch6-37",
    "order": 121
  },
  {
    "chapter": 6,
    "lesson": 5,
    "page": 193,
    "title": "内角与外角",
    "text": "多边形{相邻两边}组成的角叫作多边形的{内角}（inner angle），多边形的边与它邻边的{延长线}组成的角叫作多边形的{外角}（external angle）。",
    "id": "ch6-38",
    "order": 122
  },
  {
    "chapter": 6,
    "lesson": 5,
    "page": 194,
    "title": "多边形的外角与内角",
    "text": "多边形的外角与{相邻的内角}{互为补角}。",
    "id": "ch6-39",
    "order": 123
  },
  {
    "chapter": 6,
    "lesson": 5,
    "page": 194,
    "title": "对角线",
    "text": "连接多边形{不相邻}的两个顶点的线段叫作多边形的{对角线}（diagonal）。",
    "id": "ch6-40",
    "order": 124
  },
  {
    "chapter": 6,
    "lesson": 5,
    "page": 194,
    "title": "正多边形",
    "text": "和正方形类似，{各边相等}、{各内角也相等}的多边形叫作{正多边形}（regular polygon）。",
    "id": "ch6-41",
    "order": 125
  }
];
bank.push(...chapter456Rows.map(x=>({...x,parts:x.text.split(/\{([^{}]+)\}/g)})));
const sections=lessons.map((title,i)=>({chapter:2,lesson:i+1,title})).concat([{chapter:3,lesson:2,title:"代数式的概念"},{chapter:3,lesson:3,title:"整式的加减"}]).concat([{"chapter": 4, "lesson": 1, "title": "等式与方程"}, {"chapter": 4, "lesson": 2, "title": "一元一次方程及其解法"}, {"chapter": 5, "lesson": 1, "title": "观察 抽象"}, {"chapter": 6, "lesson": 1, "title": "直线、射线、线段"}, {"chapter": 6, "lesson": 2, "title": "角"}, {"chapter": 6, "lesson": 3, "title": "相交线"}, {"chapter": 6, "lesson": 4, "title": "平行线"}, {"chapter": 6, "lesson": 5, "title": "多边形"}]);
const day=(d=new Date())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(d);
const normalize=s=>String(s??'').replace(/ⁿ/g,'^n').normalize('NFKC').replace(/⁄/g,'/').trim().replace(/\s/g,'').replace(/零/g,'0').replace(/[−–]/g,'-').replace(/\*/g,'×').replace(/<=/g,'≤').replace(/>=/g,'≥').replace(/!=/g,'≠').replace(/ⁿ/g,'^n');
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
 if(mod.receipts.includes(run.id))return {duplicate:true};const result=grade(run.q,answers),r=c.days[today]||(c.days[today]={points:0,checked:false,full:false,runs:{}});const events=e.events||(e.events={}),festival=events.midAutumn2026||(events.midAutumn2026={days:{},unlocked:false,equipped:false});festival.days=festival.days||{};const festivalDay=festival.days[today]||(festival.days[today]={knowledgeBlanks:0,mixedRounds:0,supplement:false});festivalDay.knowledgeBlanks=Number(festivalDay.knowledgeBlanks||0)+run.q.blanks.length;const national=events.nationalDay2026||(events.nationalDay2026={days:{},unlocked:false,equipped:false});national.days=national.days||{};if(today>='2026-10-02'){const nd=national.days[today]||(national.days[today]={knowledgeBlanks:0,mixedRounds:0,secretRoom:false});nd.knowledgeBlanks=Number(nd.knowledgeBlanks||0)+run.q.blanks.length;}
 const gain=Math.min(result.count,Math.max(0,40-(r.points||0)));r.points=(r.points||0)+gain;r.checked=!!r.checked||r.points>=20;r.full=!!r.full||r.points>=40;e.credits+=gain;e.lifetimeCredits+=gain;e.daily={date:today,earned:r.points};mod.earned=(mod.earned||0)+gain;mod.receipts.push(run.id);mod.receipts=mod.receipts.slice(-200);
 const streak=result.ok?(run.streak||0)+1:0;let repaired='',repairError='';if(run.repair&&streak>=5){const m=makeupTarget(p,today);if(m.error)repairError=m.error;else if(m.target!==run.target)repairError='漏签状态已变化，请重新开始补签。';else{const d=c.days[m.target]||(c.days[m.target]={points:0,runs:{}});d.checked=true;d.makeup=true;d.full=false;c.makeupEarnedDate=today;repaired=m.target;}}
 const seconds=Math.max(0,(now-run.started)/1000);p.games=(p.games||0)+1;p.questions=(p.questions||0)+run.q.blanks.length;
 p.history.unshift({game:'knowledge',stage:'knowledge',numberType:run.q.item.title,difficulty:run.repair?'补签复习':'知识回顾',at:new Date(now).toISOString(),runId:run.id,accuracy:Math.round(result.count/run.q.blanks.length*100),avgTime:seconds/run.q.blanks.length,durationSeconds:Math.round(seconds),rGain:gain,correctBlanks:result.count,totalBlanks:run.q.blanks.length,qualified:result.ok,repairDate:repaired});p.history=p.history.slice(0,10);
 return {...result,gain,streak,repaired,repairError};
}
const api={lessons,sections,bank,day,normalize,eligible,batch,question,grade,makeupTarget,settle};if(typeof module==='object')module.exports=api;else root.KnowledgeReview=api;
})(typeof window==='object'?window:this);
