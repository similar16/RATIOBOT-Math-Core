/* PEP Chapter 5: source-grounded applications, comparison and review tasks. */
(function(root){'use strict';
 const fact=(id,text,kind='given')=>({id,text,kind});
 const cell=(expr,sources,given=false)=>({expr,sources,...(given?{given:true}:{})});
 const note=text=>({note:text});
 const row=(label,...cells)=>({label,cells});
 const derive=(id,label,expr,result,sources,explain)=>({id,label,expr,result,sources,explain});
 const answer=(label,expr,unit='')=>({label,expr,unit});
 const check=(text,expr,result)=>({text,expr,result});
 const equation=(label,left,right,answerIndex=0,variable='x')=>({label,left,right,answerIndex,variable});
 const relation=(sum=[],product=[],notes=[])=>({sum,product,notes});
 const data=[];
 function add(number,title,group,pages,location,stem,facts,r,extra={}){
  r={id:'main',variable:'x',derivations:[],equations:[],answers:[],checks:[],steps:[],...r};
  r.label=r.label||('设'+r.meaning+'为'+r.variable);
  r.relations={add:r.relationTriples.sum.map(a=>a[0]+'+'+a[1]+'='+a[2]),multiply:r.relationTriples.product.map(a=>a[0]+'×'+a[1]+'='+a[2])};
  r.closure.hint=r.closure.hint||'哪些条件已经用来填写表格？还必须满足哪个独立条件？';
  r.verdict=r.verdict||{correct:'valid',prompt:'这些结果是否完整并符合题意？',explain:r.conclusion};
  data.push({id:'PEP-'+number,title,group,source:'《数学 七年级上册》人教版，'+pages+'页 · '+location,kind:'linear',stem,facts,tags:[group],sourceCollectionIds:[number],routes:[r],...extra});
 }

 add('P055','木材制作桌面和桌腿','配套与资源分配','140','习题5.3·复习巩固第2题',
 '制作一张桌子要用1个桌面和4条桌腿，1立方米木材可制作20个桌面，或者制作400条桌腿.现有12立方米木材，应怎样计划用料才能制作尽可能多的桌子？',
 [fact('parts','每张桌子由1个桌面和4条桌腿配套.'),fact('topRate','1立方米木材可制作20个桌面.'),fact('legRate','1立方米木材可制作400条桌腿.'),fact('wood','共有12立方米木材.')],
 {meaning:'制作桌面的木材体积',unit:'立方米',domain:'0<x<12；制成的完整桌子数为整数.',
  table:{headers:['部件','木材体积/立方米','每立方米产量/件','部件数量/件'],rows:[
   row('桌面',cell('x',['unknown'],true),cell('20',['topRate'],true),cell('20*x',['topRate','unknown'])),
   row('桌腿',cell('12-x',['wood','unknown']),cell('400',['legRate'],true),cell('400*(12-x)',['legRate','wood','unknown']))]},
  relationTriples:relation([['桌面用材','桌腿用材','木材总量']],[['每立方米产量','该类用材体积','该类部件数量'],['桌面数量','每桌所需桌腿数','配套所需桌腿数量']]),
  closure:{sources:['parts'],text:'桌腿数量应等于桌面数量的4倍，使两种部件刚好配套.'},
  equations:[equation('配套桌腿数相等','4*(20*x)','400*(12-x)')],
  answers:[answer('制作桌面的木材','10','立方米'),answer('制作桌腿的木材','2','立方米'),answer('最多制作桌子','200','张')],
  steps:['4*20*x=400*(12-x)','80*x=4800-400*x','480*x=4800','x=10','12-10=2','20*10=200'],
  checks:[check('木材总体积','10+2','12'),check('桌面数','20*10','200'),check('桌腿数量刚好配套','400*2','4*200')],
  conclusion:'用10立方米木材制作桌面、2立方米制作桌腿，得到200个桌面和800条桌腿，最多制作200张桌子.'});

 add('P060','从实验表推导升温速度','数据表与计分规则','140','习题5.3·综合运用第7题',
 '下表记录一次实验中的时间和温度，假设温度的变化是均匀的.（1）实验进行21分钟时的温度是多少？（2）实验进行多长时间的温度是34℃？',
 [fact('t0','实验0分钟时温度为10℃.'),fact('t5','实验5分钟时温度为25℃.'),fact('t10','实验10分钟时温度为40℃.'),fact('t15','实验15分钟时温度为55℃.'),fact('t20','实验20分钟时温度为70℃.'),fact('t25','实验25分钟时温度为85℃.'),fact('uniform','温度变化是均匀的.'),fact('forward','第（1）问要求21分钟时的温度.'),fact('target','第（2）问要求温度达到34℃时的时间.')],
 {meaning:'温度达到34℃时经过的时间',unit:'分钟',domain:'x≥0；第（1）问另按题给21分钟正向计算.',
  derivations:[derive('rate','每分钟升温量','(25-10)/(5-0)','3',['t0','t5','uniform'],'先求这一时间段的温差，再除以经过的时间；3℃/分钟不是直接给出的数据.')],
  table:{headers:['情形','初始温度/℃','每分钟升温/℃','经过时间/分钟','升高温度/℃','最终温度/℃'],rows:[
   row('第（1）问',cell('10',['t0'],true),cell('3',['rate'],true),cell('21',['forward'],true),cell('3*21',['rate','forward']),cell('10+3*21',['t0','rate','forward'])),
   row('第（2）问',cell('10',['t0'],true),cell('3',['rate'],true),cell('x',['unknown'],true),cell('3*x',['rate','unknown']),cell('10+3*x',['t0','rate','unknown']))]},
  relationTriples:relation([['初始温度','升高温度','最终温度']],[['每分钟升温量','经过时间','升高温度']]),
  closure:{sources:['target'],text:'第（2）问表中的最终温度应等于34℃.'},
  equations:[equation('第（2）问：最终温度','10+3*x','34')],
  answers:[answer('第（2）问：达到34℃的时间','8','分钟'),answer('第（1）问：21分钟时的温度','73','℃')],
  steps:['10+3*x=34','3*x=24','x=8','10+3*21=73'],
  checks:[check('代回34℃的条件','10+3*8','34'),check('21分钟的温度','10+3*21','73'),check('核对原表25分钟处','10+3*25','85')],
  conclusion:'第（1）问为73℃；第（2）问为8分钟.两问均使用由原表推得的均匀升温关系.'},
 {sourceTable:{caption:'原题实验数据',headers:['时间/分钟','0','5','10','15','20','25'],rows:[['温度/℃',10,25,40,55,70,85]]}});

 add('P062','相遇前后两段行程','相遇、追及与行程','140','习题5.3·综合运用第9题',
 '李明和刘伟分别从A、B两地同时出发，李明骑自行车、刘伟步行，沿同一条道路相向匀速而行，出发24分钟后相遇.相遇时李明比刘伟多行进4.8千米，相遇后6分钟李明到达B地.两人每小时分别行进多少千米？相遇后经过多长时间刘伟到达A地？',
 [fact('meet','两人同时相向出发，24分钟后相遇.'),fact('difference','相遇时李明比刘伟多行进4.8千米.'),fact('after','相遇后6分钟李明到达B地.'),fact('motion','两人沿同一条道路相向匀速而行.'),fact('sameRoad','相遇点到B地是同一路段：李明相遇后的路程等于刘伟相遇前的路程.','property'),fact('hour','1小时等于60分钟.','property')],
 {meaning:'刘伟步行的速度',unit:'千米/小时',domain:'x>0；速度和时间分别统一为千米/小时与小时.',
  derivations:[
   derive('meetHours','相遇前经过的小时数','24/60','2/5',['meet','hour'],'分钟除以每小时的分钟数.'),
   derive('afterHours','李明相遇后经过的小时数','6/60','1/10',['after','hour'],'将6分钟换成小时.'),
   derive('speedRatio','李明速度是刘伟速度的倍数','24/6','4',['meet','after','motion','sameRoad'],'同一路段分别用24分钟、6分钟匀速走完，速度比等于反向的用时比.')],
  table:{headers:['人物与阶段','速度/千米每小时','时间/小时','路程/千米'],rows:[
   row('刘伟相遇前',cell('x',['unknown'],true),cell('24/60',['meet','hour'],true),cell('x*(24/60)',['unknown','meet','hour'])),
   row('李明相遇前',cell('(24/6)*x',['speedRatio','unknown']),cell('24/60',['meet','hour'],true),cell('(24/6)*x*(24/60)',['speedRatio','unknown','meet','hour'])),
   row('李明相遇后',cell('(24/6)*x',['speedRatio','unknown']),cell('6/60',['after','hour'],true),cell('(24/6)*x*(6/60)',['speedRatio','unknown','after','hour']))]},
  relationTriples:relation([['刘伟相遇前路程','相遇前路程差','李明相遇前路程'],['李明相遇前路程','刘伟相遇前路程','两地距离']],[['速度','时间','路程'],['刘伟速度','速度倍数','李明速度']]),
  closure:{sources:['difference'],text:'相遇时李明路程比刘伟路程多4.8千米.'},
  equations:[equation('相遇前的路程差','(24/6)*x*(24/60)-x*(24/60)','4.8')],
  answers:[answer('刘伟的速度','4','千米/小时'),answer('李明的速度','16','千米/小时'),answer('刘伟相遇后到A地所需时间','96','分钟')],
  steps:['(24/6)*x*(24/60)-x*(24/60)=4.8','(4-1)*x*(2/5)=4.8','x=4','4*4=16','(16*(24/60))/4*60=96'],
  checks:[check('相遇时的路程差','16*(24/60)-4*(24/60)','4.8'),check('李明相遇后的路程等于刘伟原来走的路程','16*(6/60)','4*(24/60)'),check('刘伟相遇后行进的路程','4*(96/60)','16*(24/60)')],
  conclusion:'李明每小时行进16千米，刘伟每小时行进4千米；刘伟相遇后还需96分钟到达A地.'});

 add('P063','降价后保持销售额不变','增长、折扣与利润','141','习题5.3·综合运用第10题',
 '商店对某商品降价20%促销.为了使销售总金额不变，销售量要比按原价销售时增加百分之几？',
 [fact('drop','商品单价降低20%.'),fact('sameRevenue','要求销售总金额保持不变.'),fact('baseline','把原单价、原销量相对于各自原值的倍数都记作1；比较销售额相对原销售额的倍数.','convention'),fact('percentage','x%表示x/100，即百分号前的数除以100.','property')],
 {meaning:'销量增长百分数中百分号前面的数',unit:'',domain:'x≥0；x表示百分号前的数，增长比例为x/100.',
  derivations:[derive('priceFactor','现单价相对于原单价的倍数','1-20%','0.8',['baseline','drop'],'先从原来的1份扣除20%，再得到0.8倍.')],
  table:{headers:['状态','单价相对原值的倍数','销量相对原值的倍数','销售额相对原值的倍数'],rows:[
   row('降价前',cell('1',['baseline'],true),cell('1',['baseline'],true),cell('1*1',['baseline'])),
   row('降价后',cell('1-20%',['baseline','drop']),cell('1+x/100',['baseline','percentage','unknown']),cell('(1-20%)*(1+x/100)',['baseline','drop','percentage','unknown']))]},
  relationTriples:relation([['原销量','增加销量','现销量']],[['单价','销量','销售额'],['原销量','增长比例','增加销量']]),
  closure:{sources:['sameRevenue'],text:'降价后的销售额倍数与原来的1相等.'},
  equations:[equation('销售额保持不变','(1-20%)*(1+x/100)','1')],
  answers:[answer('增长百分数中百分号前的数','25','')],
  steps:['(1-20%)*(1+x/100)=1','0.8*(1+x/100)=1','1+x/100=1.25','x=25'],
  checks:[check('降低后的价格与增加后的销量相乘','(1-20%)*(1+25%)','1')],
  conclusion:'销售量应增加25%.销量的增长基准是原销量，不能直接把降价20%当成销量也增长20%.'});

 add('P064','三种人均工作量关系','平均量与工作效率','141','习题5.3·综合运用第11题',
 '甲组4名工人3月份完成的总工作量比此月人均定额的4倍多20件；乙组5名工人完成的总工作量比此月人均定额的6倍少20件.分别求：（1）两组人均实际完成量相等时的人均定额；（2）甲组人均实际完成量比乙组多2件时的人均定额；（3）甲组比乙组少2件时的人均定额.',
 [fact('a','甲组4名工人，总工作量比人均定额的4倍多20件.'),fact('b','乙组5名工人，总工作量比人均定额的6倍少20件.'),fact('equal','第（1）种情形：两组人均实际完成量相等.'),fact('more','第（2）种情形：甲组人均实际完成量比乙组多2件.'),fact('less','第（3）种情形：甲组人均实际完成量比乙组少2件.')],
 {meaning:'当前所讨论情形下的人均定额',unit:'件',domain:'分别讨论三种互不同时成立的条件；三个方程中的x分别代表各情形的人均定额.',
  table:{headers:['组别','人数/人','实际总工作量/件','实际人均工作量/件'],rows:[
   row('甲组',cell('4',['a'],true),cell('4*x+20',['a','unknown']),cell('(4*x+20)/4',['a','unknown'])),
   row('乙组',cell('5',['b'],true),cell('6*x-20',['b','unknown']),cell('(6*x-20)/5',['b','unknown']))]},
  relationTriples:relation([['人均定额的四倍','甲组多完成量','甲组总工作量'],['乙组总工作量','乙组少完成量','人均定额的六倍'],['较少的人均实际量','人均实际量之差','较多的人均实际量']],[['人均实际工作量','人数','实际总工作量'],['人均定额','题给倍数','比较工作量']]),
  closure:{sources:['equal','more','less'],text:'分别使用三种人均实际量关系.三个方程分别求解，不把它们当成同时成立的条件.'},
  equations:[equation('第（1）种情形：人均实际量相等','(4*x+20)/4','(6*x-20)/5',0),equation('第（2）种情形：甲比乙多2件','(4*x+20)/4','(6*x-20)/5+2',1),equation('第（3）种情形：甲比乙少2件','(4*x+20)/4+2','(6*x-20)/5',2)],
  answers:[answer('第（1）种情形的人均定额','45','件'),answer('第（2）种情形的人均定额','35','件'),answer('第（3）种情形的人均定额','55','件')],
  steps:['(4*x+20)/4=(6*x-20)/5','5*x+25=6*x-20','x=45','(4*x+20)/4=(6*x-20)/5+2','5*x+25=6*x-10','x=35','(4*x+20)/4+2=(6*x-20)/5','5*x+35=6*x-20','x=55'],
  checks:[check('情形（1）两组人均相等','(4*45+20)/4','(6*45-20)/5'),check('情形（2）甲比乙多2件','(4*35+20)/4-(6*35-20)/5','2'),check('情形（3）乙比甲多2件','(6*55-20)/5-(4*55+20)/4','2')],
  conclusion:'三种情形的人均定额依次是45件、35件、55件.乙组人数是5，但比较量是人均定额的6倍，两个数不能混用.'},
 {kind:'branching',notices:['三问是三个独立情形.完成时必须分别列式、求解并检验，不能把三个条件同时加到一个方程中.']});

 add('P066','满减和六折怎样选择','分段收费与方案比较','141','习题5.3·拓广探索第14题',
 '某购物平台有两种图书促销方式：方式一“满100元减50元”；方式二“单件打六折”.（1）设某本书原价为t元，列表说明t在不同范围内时两种方式分别需支付多少.（2）根据原价怎样选择省钱的购买方式？通过计算验证.',
 [fact('reduction','方式一：满100元减50元.'),fact('discount','方式二：单件打六折.'),fact('ten','十折相当于原价的10/10，六折的比例由6÷10得到.','property'),fact('positive','讨论原价为正数的同一本书.','convention'),fact('comparison','比较同一本书的两种支付金额，费用相等处可能成为方案选择的分界.','property')],
 {variable:'t',meaning:'所讨论图书的原价',unit:'元',domain:'t>0；先分未满100元与达到100元两种情形，再检查费用相等的候选值.',
  derivations:[derive('discountRatio','六折：实际支付原价的几倍','6/10','0.6',['discount','ten'],'换算范例：六折→6÷10=0.6.意思是原价每10元，实际付6元；支付金额=原价×0.6.请写出换算算式.')],
  table:{headers:['原价范围与方式','原价/元','支付金额/元'],rows:[
   row('未满100元·方式一',cell('t',['unknown'],true),cell('t',['unknown','reduction'])),
   row('未满100元·方式二',cell('t',['unknown'],true),cell('(6/10)*t',['discount','ten','unknown'])),
   row('达到100元·方式一',cell('t',['unknown'],true),cell('t-50',['reduction','unknown'])),
   row('达到100元·方式二',cell('t',['unknown'],true),cell('(6/10)*t',['discount','ten','unknown']))]},
  relationTriples:relation([['满减支付金额','减免金额','达到门槛的原价']],[['原价','折扣比例','折扣支付金额']]),
  closure:{sources:['comparison'],text:'分别令两种范围内的支付金额相等，求出候选分界，再核对原价范围并比较大小.'},
  equations:[equation('未满100元：求相等费用的代数候选','t','(6/10)*t',0,'t'),equation('达到100元：求相等费用的分界','t-50','(6/10)*t',1,'t')],
  answers:[answer('未满100元分支的代数候选原价','0','元'),answer('达到100元分支的相同费用原价','125','元')],
  steps:['t=(6/10)*t','(1-6/10)*t=0','t=0','t-50=(6/10)*t','(1-6/10)*t=50','t=125'],
  checks:[check('125元时满减支付金额','125-50','75'),check('125元时六折支付金额','(6/10)*125','75'),check('刚达到100元时六折与满减的费用差','(6/10)*100-(100-50)','10')],
  verdictCases:[{label:'正价范围',prompt:'未满100元分支得到的0元，符合题目采用的正价范围吗？',correct:'impossible'},{label:'费用相等',prompt:'原价125元，属于达到100元的分支并且两种费用相同吗？',correct:'valid'},{label:'较低原价',prompt:'原价为正且未满100元时，六折方案更省钱吗？',correct:'valid'},{label:'中间范围',prompt:'原价达到100元但低于相等费用的分界时，满减方案更省钱吗？',correct:'valid'},{label:'较高原价',prompt:'原价高于相等费用的分界时，满减方案仍更省钱吗？',correct:'impossible'}],
  conclusion:'原价大于0且小于100元时选六折；100元至125元之间（不含125元）选满减；125元时一样；超过125元时选六折.未满100元分支的0元候选不在正价范围内.'},
 {kind:'branching'});

 add('P068','木杆平衡与已知参数','实验、编题与参数','143—144','数学活动2',
 '用一根质地均匀的木杆和一些等重的小物体做实验：①在木杆中间拴绳吊起，使其左右平衡；②两端各挂1个重物；③左端再加1个，将左边的2个重物一起向右移动至平衡并记录两边力臂；④左边再加1个，将3个重物一起向右移动至平衡并记录；⑤继续加挂、移动、记录.你能发现什么规律？最后在右端挂1个重物、支点左边挂n个重物并保持平衡.木杆长l厘米，支点在中点，左侧挂重物处距支点x厘米，把n、l看作已知数，列关于x的一元一次方程.',
 [fact('rod','木杆质地均匀，支点在木杆中点，木杆本身左右平衡.'),fact('weight','所有小物体等重，右端挂1个重物，左侧最后挂n个重物.'),fact('stages','实验依次观察左侧1个、2个、3个及更多重物平衡时的距离.'),fact('length','木杆总长为l厘米；n与l均为题目指定的已知数.'),fact('halves','中点把全长分成相等的2段.','property'),fact('records','各次平衡时记录左右重物个数及它们到支点的距离；依据记录说明规律.')],
 {meaning:'支点到左侧挂重物处的距离',unit:'厘米',domain:'n为已知正整数，l为已知正数；x>0且不超过木杆的一半.',
  additionalVariables:[{variable:'n',meaning:'左侧重物个数',unit:'个',domain:'已知正整数，不是待求未知数',known:true},{variable:'l',meaning:'木杆总长',unit:'厘米',domain:'已知正数，不是待求未知数',known:true}],
  derivations:[derive('rightArm','右端到支点的距离','l/2','l/2',['length','halves'],'右端与支点之间是木杆全长的一半，保留参数l.')],
  table:{headers:['支点哪一侧','等重物体个数/个','到支点的距离/厘米','个数与距离的乘积'],rows:[
   row('左侧',cell('n',['weight'],true),cell('x',['unknown'],true),cell('n*x',['weight','unknown'])),
   row('右侧',cell('1',['weight'],true),cell('l/2',['rightArm'],true),cell('1*(l/2)',['weight','rightArm']))]},
  relationTriples:relation([],[['左侧重物个数','左侧到支点的距离','左侧个数与距离的乘积'],['右侧重物个数','右侧到支点的距离','右侧个数与距离的乘积']],['需根据实验记录解释平衡时两侧乘积为何相等.n、l是已知参数，不能把图示的3块固定为n=3.']),
  closure:{sources:['records','rod','weight'],text:'用实验记录归纳平衡时两侧“重物个数×到支点距离”的乘积相等，并说明均匀木杆在中点支撑时自身已平衡.'},
  discussionTitle:'说明参数与方程',
  discussion:'请说明你记录到的平衡规律，写出关于x的方程，并解释为什么n和l是已知参数.不要把图示的重物数量固定为3.',
  equations:[],answers:[],steps:['n*x=1*(l/2)'],checks:[],
  conclusion:'两侧重物等重，实验支持“个数×力臂”相等，故列n×x=1×(l÷2).n和l已知且n不为0，因此这是一元一次方程；x等于l除以2n.实际数值取决于给定参数，原题没有要求编造数值答案.',
  verdict:{correct:'open',prompt:'是否已用实验说明数量关系，并明确哪些字母是已知参数？',explain:'保留实验记录和参数说明，由教师核对；不能因为关系中出现n和x相乘，就把n也误当作未知数.'}},
 {kind:'open',kindLabel:'实验与参数建模',notices:['本题保留原实验步骤与参数条件.参数关系交由教师讨论，不要求填写原题没有给出的数值.']});

 add('P072','金银铜奖牌的数量','和差倍分与分配','147','复习题5·综合运用第7题',
 '在北京2022年冬奥会上，中国代表团共获得15枚奖牌，其中金牌数比银牌数多5枚，银牌数比铜牌数多2枚.中国代表团一共获得多少枚金牌？',
 [fact('total','金、银、铜奖牌共15枚.'),fact('goldSilver','金牌数比银牌数多5枚.'),fact('silverBronze','银牌数比铜牌数多2枚.')],
 {meaning:'金牌数',unit:'枚',domain:'金、银、铜牌数均为非负整数.',
  table:{headers:['奖牌种类','数量/枚'],rows:[row('金牌',cell('x',['unknown'],true)),row('银牌',cell('x-5',['unknown','goldSilver'])),row('铜牌',cell('x-5-2',['unknown','goldSilver','silverBronze']))]},
  relationTriples:relation([['银牌数','金银牌数之差','金牌数'],['铜牌数','银铜牌数之差','银牌数'],['金牌数','银牌数','金银牌数之和'],['金银牌数之和','铜牌数','奖牌总数']]),
  closure:{sources:['total'],text:'金牌、银牌、铜牌三类数量之和等于15枚.'},
  equations:[equation('三类奖牌合计','x+(x-5)+(x-5-2)','15')],
  answers:[answer('金牌数','9','枚')],
  steps:['x+(x-5)+(x-5-2)=15','3*x-12=15','3*x=27','x=9'],
  checks:[check('三类奖牌总数','9+(9-5)+(9-5-2)','15'),check('金牌比银牌多的数量','9-4','5'),check('银牌比铜牌多的数量','4-2','2')],
  conclusion:'金牌9枚；由表还可得到银牌4枚、铜牌2枚，三类合计15枚.'});

 add('P074','收益相等的两只基金','增长、折扣与利润','147','复习题5·综合运用第9题',
 '某人年初购买A、B两只基金共20000元，年底卖出后发现两只基金的实际收益恰好相等，实际收益率分别为4.4%和3.6%.A、B两只基金各购买了多少元？',
 [fact('total','A、B两只基金的购买金额合计20000元.'),fact('rateA','A基金实际收益率为4.4%.'),fact('rateB','B基金实际收益率为3.6%.'),fact('equal','两只基金的实际收益金额相等.')],
 {meaning:'购买A基金的金额',unit:'元',domain:'0<x<20000，B基金的购买金额为20000-x.',
  table:{headers:['基金','购买金额/元','收益率','实际收益/元'],rows:[
   row('A基金',cell('x',['unknown'],true),cell('4.4%',['rateA'],true),cell('x*4.4%',['unknown','rateA'])),
   row('B基金',cell('20000-x',['total','unknown']),cell('3.6%',['rateB'],true),cell('(20000-x)*3.6%',['total','unknown','rateB']))]},
  relationTriples:relation([['A基金购买金额','B基金购买金额','购买总金额']],[['基金购买金额','该基金收益率','该基金实际收益']]),
  closure:{sources:['equal'],text:'A基金实际收益与B基金实际收益相等；比较的是收益金额，不是收益率本身.'},
  equations:[equation('两只基金收益相等','x*4.4%','(20000-x)*3.6%')],
  answers:[answer('A基金购买金额','9000','元'),answer('B基金购买金额','11000','元')],
  steps:['x*4.4%=(20000-x)*3.6%','0.044*x=720-0.036*x','0.08*x=720','x=9000','20000-9000=11000'],
  checks:[check('购买总金额','9000+11000','20000'),check('A基金收益','9000*4.4%','396'),check('B基金收益','11000*3.6%','396')],
  conclusion:'A基金购买9000元，B基金购买11000元；按原题收益率，两者收益均为396元.'});

 add('P075','环形跑道反向再次相遇','相遇、追及与行程','148','复习题5·综合运用第10题',
 '李明和刘伟在600米环形跑道上跑步.李明平均每分钟跑190米，刘伟平均每分钟跑210米.两人从同一处同时反向出发，经过多长时间首次相遇？又经过多长时间再次相遇？',
 [fact('lap','环形跑道长600米.'),fact('li','李明平均每分钟跑190米.'),fact('liu','刘伟平均每分钟跑210米.'),fact('direction','两人从同一处同时反向出发.'),fact('continued','按题给的每分钟路程进行运动建模，相遇后继续原方向的跑步.','convention'),fact('cycle','从同一处反向出发，到下一次相遇时，两人累计路程的和为1圈.','property')],
 {meaning:'从两人在同一处开始到下一次相遇的时间间隔',unit:'分钟',domain:'x>0；首次相遇和两次相遇之间的间隔使用相同的环形运动关系.',
  table:{headers:['人物','速度/米每分钟','时间间隔/分钟','本间隔路程/米'],rows:[
   row('李明',cell('190',['li'],true),cell('x',['unknown'],true),cell('190*x',['li','unknown'])),
   row('刘伟',cell('210',['liu'],true),cell('x',['unknown'],true),cell('210*x',['liu','unknown']))]},
  relationTriples:relation([['李明本间隔路程','刘伟本间隔路程','一圈长度']],[['速度','时间间隔','本间隔路程']]),
  closure:{sources:['lap','cycle'],text:'反向从同一处出发至下一次相遇，两人本间隔路程之和为一圈600米.'},
  equations:[equation('两人路程和为一圈','190*x+210*x','600')],
  answers:[answer('首次相遇所需时间','3/2','分钟'),answer('首次相遇后又经过的时间','3/2','分钟')],
  steps:['190*x+210*x=600','400*x=600','x=3/2'],
  checks:[check('每次相遇间隔内两人路程之和','190*(3/2)+210*(3/2)','600'),check('从出发到第二次相遇的总时间','3/2+3/2','3')],
  conclusion:'出发1.5分钟后首次相遇，又经过1.5分钟再次相遇.“又经过”问相邻两次相遇之间的间隔，不是从出发开始累计的3分钟.'});

 add('P076','鸽子增加前后的分笼','盈不足与数量转移','148','复习题5·综合运用第11题',
 '有一群鸽子和一些鸽笼.如果每笼住6只鸽子，则剩余3只鸽子无笼可住；如果再飞来5只鸽子，连同原来的鸽子，每笼刚好住8只.原来有多少只鸽子和多少个鸽笼？',
 [fact('first','原来每笼住6只鸽子，剩余3只无笼可住.'),fact('arrive','又飞来5只鸽子.'),fact('second','增加后每笼刚好住8只鸽子，仍用原来的鸽笼.')],
 {meaning:'鸽笼数',unit:'个',domain:'x为正整数；鸽子总只数也必须是整数.',
  table:{headers:['状态','每笼鸽子数/只','鸽笼数/个','入笼鸽子数/只','笼外鸽子数','总鸽子数/只'],rows:[
   row('原来',cell('6',['first'],true),cell('x',['unknown'],true),cell('6*x',['first','unknown']),cell('3',['first'],true),cell('6*x+3',['first','unknown'])),
   row('又飞来以后',cell('8',['second'],true),cell('x',['unknown'],true),cell('8*x',['second','unknown']),note('全部入笼，无剩余'),cell('8*x',['second','unknown']))]},
  relationTriples:relation([['原来入笼鸽子数','原来笼外鸽子数','原来总鸽子数'],['原来总鸽子数','又飞来的鸽子数','现在总鸽子数']],[['每笼鸽子数','鸽笼数','入笼鸽子数']]),
  closure:{sources:['arrive'],text:'增加后的鸽子总数，等于原有总数加上又飞来的5只.'},
  equations:[equation('鸽子增加前后的总数关系','6*x+3+5','8*x')],
  answers:[answer('鸽笼数','4','个'),answer('原有鸽子数','27','只')],
  steps:['6*x+3+5=8*x','2*x=8','x=4','6*4+3=27'],
  checks:[check('原来装笼后剩下的鸽子','27-6*4','3'),check('增加后刚好住满','27+5','8*4')],
  conclusion:'原有27只鸽子、4个鸽笼；又飞来5只后有32只，每笼8只刚好住满.'});

 add('P077','父女在两个时刻的年龄','年龄与前后变化','148','复习题5·综合运用第12题',
 '父亲和女儿现在的年龄之和是91.当父亲的年龄是女儿现在年龄的2倍时，女儿的年龄是父亲现在年龄的1/3.求女儿现在的年龄.',
 [fact('sum','父亲和女儿现在的年龄之和为91岁.'),fact('fatherThen','题述另一时刻，父亲年龄是女儿现在年龄的2倍.'),fact('daughterThen','题述另一时刻，女儿年龄是父亲现在年龄的1/3.'),fact('gap','两人的年龄按相同的时间变化，年龄差保持不变.','property')],
 {label:'方案一：按年龄差列式',meaning:'女儿现在的年龄',unit:'岁',domain:'两人年龄均为正，父亲比女儿年长；另一时刻是过去还是未来，要由求解结果判断.',
  table:{headers:['时刻','女儿年龄/岁','父亲年龄/岁','父女年龄差/岁'],rows:[
   row('现在',cell('x',['unknown'],true),cell('91-x',['sum','unknown']),cell('(91-x)-x',['sum','unknown'])),
   row('题述另一时刻',cell('(91-x)/3',['sum','unknown','daughterThen']),cell('2*x',['fatherThen','unknown']),cell('2*x-(91-x)/3',['fatherThen','daughterThen','sum','unknown']))]},
  relationTriples:relation([['女儿现在年龄','父亲现在年龄','现在年龄和'],['女儿现在年龄','不变的年龄差','父亲现在年龄'],['女儿另一时刻年龄','不变的年龄差','父亲另一时刻年龄']],[['女儿现在年龄','题给倍数','父亲另一时刻年龄'],['父亲现在年龄','题给分率','女儿另一时刻年龄']]),
  closure:{sources:['gap'],text:'在两个时刻分别表示父女年龄差，并令它们相等.'},
  equations:[equation('两个时刻年龄差相等','(91-x)-x','2*x-(91-x)/3')],
  answers:[answer('女儿现在的年龄','28','岁')],
  steps:['(91-x)-x=2*x-(91-x)/3','273-6*x=7*x-91','13*x=364','x=28'],
  checks:[check('现在的年龄和','63+28','91'),check('另一时刻父亲年龄','2*28','56'),check('另一时刻女儿年龄','63/3','21'),check('父女经历的时间相同','63-56','28-21')],
  conclusion:'女儿现在28岁，父亲63岁.题述另一时刻为7年前：父亲56岁、女儿21岁，两项倍数条件均成立.'});

 // The same x can be organized by elapsed years instead of the age gap.
 {
  const p=data.find(p=>p.id==='PEP-P077'),main=p.routes[0];p.contentRevision=1;
  p.routes.push({...main,id:'years',label:'方案二：按年份差列式',
   domain:'两人年龄均为正；年份差可按任一方向相减，两人的方向须一致，正负由求解结果判断.',
   table:{headers:['人物','现在年龄/岁','另一时刻年龄/岁','两时刻的年份差/年'],signedDifferences:[{label:'两时刻的年份差',cells:[[0,2],[1,2]],forwardLabel:'现在年龄−另一时刻年龄',reverseLabel:'另一时刻年龄−现在年龄'}],rows:[
    row('女儿',cell('x',['unknown'],true),cell('(91-x)/3',['sum','unknown','daughterThen']),cell('x-(91-x)/3',['sum','unknown','daughterThen','gap'])),
    row('父亲',cell('91-x',['sum','unknown']),cell('2*x',['fatherThen','unknown']),cell('(91-x)-2*x',['sum','unknown','fatherThen','gap']))]},
   relationTriples:relation([['女儿另一时刻年龄','相同的年份差','女儿现在年龄'],['父亲另一时刻年龄','相同的年份差','父亲现在年龄'],['女儿现在年龄','父亲现在年龄','现在年龄和']],[['女儿现在年龄','题给倍数','父亲另一时刻年龄'],['父亲现在年龄','题给分率','女儿另一时刻年龄']]),
   closure:{sources:['gap'],text:'父女经历的是相同的两个时刻，按同一方向相减，分别求出的年份差相等.',hint:'两人都用“现在减另一时刻”或都用“另一时刻减现在”，再令年份差相等.'},
   equations:[equation('父女经历的年份差相等','x-(91-x)/3','(91-x)-2*x')],
   steps:['x-(91-x)/3=(91-x)-2*x','3*x-(91-x)=3*(91-x)-6*x','13*x=364','x=28'],
   tableNote:'两行的年份差可以同时交换被减数与减数，方向须一致.解后再判断另一时刻是在过去还是未来.'});
 }

 add('P078','竞赛规则与不可能的得分','数据表与计分规则','148','复习题5·拓广探索第13题',
 '学校组织知识竞赛，共设20道选择题，各题分值相同，每题必答.根据表中5名参赛者的答题与得分情况回答：（1）F得76分，他答对几道题？（2）G说他得80分，有可能吗？为什么？',
 [fact('rules','共20道选择题，各题分值相同，每题必答.'),fact('a','A答对20题，答错0题，得100分.'),fact('b','B答对19题，答错1题，得94分.'),fact('c','C答对18题，答错2题，得88分.'),fact('d','D答对14题，答错6题，得64分.'),fact('e','E答对10题，答错10题，得40分.'),fact('fScore','F得76分.'),fact('gScore','G声称得80分.'),fact('integer','答对、答错的题数都是非负整数，且不能超过总题数.','property')],
 {meaning:'F答对的题数',unit:'题',domain:'x为0至20之间的整数；另对G声称的80分设置代数候选y，再检验整数性.',
  additionalVariables:[{variable:'y',meaning:'假设G得80分时答对题数的代数候选',unit:'题',domain:'实际可行时应为0至20之间的整数'}],
  derivations:[derive('correctScore','每答对一题的分数','100/20','5',['a'],'A全部答对，用总得分除以题数.'),derive('wrongScore','每答错一题计入的分数','94-19*(100/20)','-1',['b','correctScore'],'B只有一题答错，从总分扣除19题正确题的得分，得到每错一题计-1分.')],
  table:{headers:['参赛者','答对题数','答错题数','答对得分','答错计分','总得分'],rows:[
   row('F',cell('x',['unknown'],true),cell('20-x',['rules','unknown']),cell('5*x',['correctScore','unknown']),cell('(-1)*(20-x)',['wrongScore','rules','unknown']),cell('5*x-(20-x)',['correctScore','wrongScore','rules','unknown'])),
   row('G的代数候选',cell('y',['unknown'],true),cell('20-y',['rules','unknown']),cell('5*y',['correctScore','unknown']),cell('(-1)*(20-y)',['wrongScore','rules','unknown']),cell('5*y-(20-y)',['correctScore','wrongScore','rules','unknown']))]},
  relationTriples:relation([['答对题数','答错题数','总题数'],['答对题所得分数','答错题计入的分数','总得分']],[['答对题数','每答对题的得分','答对题所得分数'],['答错题数','每答错题计入的分数','答错题计入的分数']],['每答错题计入的分数为负数；它与正的扣分数不是同一个量.']),
  closure:{sources:['fScore','gScore'],text:'分别用F的76分和G声称的80分列方程，然后检验题数必须为整数.'},
  equations:[equation('F的得分','5*x-(20-x)','76',0),equation('G声称的得分','5*y-(20-y)','80',1,'y')],
  answers:[answer('F答对的题数','16','题'),answer('G得80分所需答对题数的代数候选','50/3','题')],
  steps:['5*x-(20-x)=76','6*x=96','x=16','5*y-(20-y)=80','6*y=100','y=50/3'],
  checks:[check('F的得分','5*16-(20-16)','76'),check('G的代数候选确实满足得分式','5*(50/3)-(20-50/3)','80'),check('用规则回查D的表格记录','5*14-6','64')],
  verdictCases:[{label:'F',prompt:'F答对题数是范围内的整数，并且得分为76，符合题意吗？',correct:'valid'},{label:'G',prompt:'G得80分时的代数候选能作为实际答对题数吗？',correct:'impossible'}],
  conclusion:'由原表推出答对得5分、答错扣1分.F答对16题.G得80分需要答对50/3题，题数不是整数，因此不可能.'},
 {kind:'existence',sourceTable:{caption:'原题竞赛得分记录',headers:['参赛者','答对题数','答错题数','得分'],rows:[['A',20,0,100],['B',19,1,94],['C',18,2,88],['D',14,6,64],['E',10,10,40]]}});

 add('P080','产量、含油率与种植面积','增长、折扣与利润','148','复习题5·拓广探索第15题',
 '“丰收1号”油菜籽平均每公顷产量2400千克，含油率40%.“丰收2号”平均每公顷产量比它提高300千克，含油率提高10个百分点.某村去年种“丰收1号”，今年改种“丰收2号”，种植面积减少3公顷，总产油量却提高3750千克.去年和今年的种植面积各是多少公顷？',
 [fact('oldYield','去年“丰收1号”每公顷油菜籽产量为2400千克.'),fact('oldRate','“丰收1号”的含油率为40%.'),fact('yieldRise','今年“丰收2号”每公顷油菜籽产量提高300千克.'),fact('pointsRise','今年的含油率提高10个百分点.'),fact('areaDrop','今年种植面积比去年减少3公顷.'),fact('oilRise','今年总产油量比去年提高3750千克.'),fact('percentagePoints','“提高几个百分点”表示百分数的直接差，不是把原含油率按相同比例再增长.','property')],
 {meaning:'去年的种植面积',unit:'公顷',domain:'x>3，保证今年的种植面积为正.',
  derivations:[
   derive('newYield','今年每公顷油菜籽产量','2400+300','2700',['oldYield','yieldRise'],'在原每公顷产量上增加300千克.'),
   derive('newRate','今年的含油率','40%+10%','50%',['oldRate','pointsRise','percentagePoints'],'提高10个百分点，直接在40%上加10%，得到50%.'),
   derive('oldOilPerArea','去年每公顷产油量','2400*40%','960',['oldYield','oldRate'],'油菜籽产量乘含油率.'),
   derive('newOilPerArea','今年每公顷产油量','2700*50%','1350',['newYield','newRate'],'使用已说明来源的新产量和新含油率.')],
  table:{headers:['年份','面积/公顷','每公顷籽产量/千克','含油率','每公顷产油量/千克','总产油量/千克'],rows:[
   row('去年',cell('x',['unknown'],true),cell('2400',['oldYield'],true),cell('40%',['oldRate'],true),cell('960',['oldOilPerArea'],true),cell('960*x',['oldOilPerArea','unknown'])),
   row('今年',cell('x-3',['unknown','areaDrop']),cell('2700',['newYield'],true),cell('50%',['newRate'],true),cell('1350',['newOilPerArea'],true),cell('1350*(x-3)',['newOilPerArea','unknown','areaDrop']))]},
  relationTriples:relation([['今年种植面积','减少的面积','去年种植面积'],['去年总产油量','增加的产油量','今年总产油量'],['原含油率','提高的百分点所对应比例','新含油率']],[['每公顷籽产量','含油率','每公顷产油量'],['每公顷产油量','种植面积','总产油量']]),
  closure:{sources:['oilRise'],text:'今年总产油量等于去年总产油量加上3750千克.'},
  equations:[equation('总产油量的增加关系','1350*(x-3)','960*x+3750')],
  answers:[answer('去年的种植面积','20','公顷'),answer('今年的种植面积','17','公顷')],
  steps:['1350*(x-3)=960*x+3750','1350*x-4050=960*x+3750','390*x=7800','x=20','20-3=17'],
  checks:[check('面积减少量','20-17','3'),check('去年总产油量','2400*40%*20','19200'),check('今年总产油量','(2400+300)*(40%+10%)*17','22950'),check('总产油量增加量','22950-19200','3750')],
  conclusion:'去年种植20公顷，今年17公顷.两年的总产油量分别为19200千克、22950千克，增加3750千克.'});


 const sourceUpdates={
  "PEP-P055": {
    "originalStem": "制作一张桌子要用1个桌面和4条桌腿，1 m³木材可制作20个桌面，或者制作400条桌腿.现有12 m³木材，应怎样计划用料才能制作尽可能多的桌子？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        140
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  "PEP-P060": {
    "originalStem": "下表中记录了一次实验中时间和温度的数据，假设温度的变化是均匀的.\n(1)实验进行21 min时的温度是多少？\n(2)实验进行多长时间的温度是34 ℃？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        140
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    },
    "sourceTable": {
      "caption": "原题实验数据",
      "headers": [
        "时间/分钟",
        "0",
        "5",
        "10",
        "15",
        "20",
        "25"
      ],
      "rows": [
        [
          "温度/℃",
          10,
          25,
          40,
          55,
          70,
          85
        ]
      ]
    }
  },
  "PEP-P062": {
    "originalStem": "李明和刘伟分别从A，B两地同时出发，李明骑自行车，刘伟步行，沿同一条道路相向匀速而行，出发24 min后两人相遇.相遇时李明比刘伟多行进4.8 km，相遇后6 min李明到达B地.两人每小时分别行进多少千米？相遇后经过多长时间刘伟到达A地？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        140
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  "PEP-P063": {
    "originalStem": "商店对某商品降价20%促销，为了使销售总金额不变，销售量要比按原价销售时增加百分之几？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        141
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  "PEP-P064": {
    "originalStem": "甲组的4名工人3月份完成的总工作量比此月人均定额的4倍多20件，乙组的5名工人3月份完成的总工作量比此月人均定额的6倍少20件.\n(1)如果两组工人此月人均实际完成的工作量相等，那么此月人均定额是多少件？\n(2)如果甲组工人此月人均实际完成的工作量比乙组的多2件，那么此月人均定额是多少件？\n(3)如果甲组工人此月人均实际完成的工作量比乙组的少2件，那么此月人均定额是多少件？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        141
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  "PEP-P066": {
    "originalStem": "下面是某购物平台的两种图书促销方式.方式一：满100元减50元.方式二：单件打六折.考虑下列问题.\n(1)设某本书的原价为t元，列表说明当t在不同范围内取值时，按两种方式购买分别需要支付的金额.\n(2)观察你的列表，你能从中发现如何根据图书的原价选择省钱的购买方式吗？通过计算验证你的想法.",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        141
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  "PEP-P068": {
    "originalStem": "用一根质地均匀的木杆和一些等重的小物体，做下列实验.\n(1)在木杆中间处拴绳，将木杆吊起并使其左右平衡，吊绳处为木杆的支点.\n(2)在木杆两端各悬挂一重物，看看左右是否保持平衡.\n(3)在木杆左端小物体下加挂一重物，然后把这两个重物一起向右移动，直至左右平衡，记录此时支点与木杆左右两边挂重物处的距离.\n(4)在木杆左端两小物体下再加挂一重物，然后把这三个重物一起向右移动，直至左右平衡，记录此时支点与木杆左右两边挂重物处的距离.\n(5)在木杆左边继续加挂重物，并重复以上操作和记录.\n如图1，在木杆右端挂一重物，支点左边挂n个重物，并使左右平衡.设木杆长为l cm，支点在木杆中点处，支点与木杆左边挂重物处的距离为x cm，把n，l作为已知数，列出关于x的一元一次方程.",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        143,
        144
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    },
    "sourceFigure": {
      "file": "figures/lever.svg",
      "alt": "木杆支点位于中点，左侧挂n个重物，右端挂1个重物"
    }
  },
  "PEP-P072": {
    "originalStem": "在北京2022年冬奥会上，中国代表团共获得15枚奖牌，其中金牌数比银牌数多5枚，银牌数比铜牌数多2枚.中国代表团一共获得多少枚金牌？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        147
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  "PEP-P074": {
    "originalStem": "某人年初购买了A、B两只基金共20000元，年底卖出后发现两只基金的实际收益恰好相等，且实际收益率分别为4.4%和3.6%.A、B两只基金各购买了多少元？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        147
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  "PEP-P075": {
    "originalStem": "李明和刘伟在600m环形跑道上跑步.李明平均每分钟跑190m，刘伟平均每分钟跑210m.两人从同一处同时反向出发.\n经过多长时间首次相遇？\n又经过多长时间再次相遇？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        148
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  "PEP-P076": {
    "originalStem": "有一群鸽子和一些鸽笼，如果每个鸽笼住6只鸽子，则剩余3只鸽子无鸽笼可住；如果再飞来5只鸽子，连同原来的鸽子每个鸽笼刚好住8只.原来有多少只鸽子和多少个鸽笼？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        148
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  "PEP-P077": {
    "originalStem": "父亲和女儿现在的年龄之和是91，当父亲的年龄是女儿现在年龄的2倍时，女儿的年龄是父亲现在年龄的1/3.求女儿现在的年龄.",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        148
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  "PEP-P078": {
    "originalStem": "学校组织知识竞赛，共设20道选择题，各题分值相同，每题必答.下表记录了5名参赛同学的得分情况.\n(1)同学F得76分，他答对了几道题？\n(2)同学G说他得了80分，你认为有可能吗？为什么？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        148
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    },
    "sourceTable": {
      "caption": "原题竞赛得分记录",
      "headers": [
        "参赛者",
        "答对题数",
        "答错题数",
        "得分"
      ],
      "rows": [
        [
          "A",
          20,
          0,
          100
        ],
        [
          "B",
          19,
          1,
          94
        ],
        [
          "C",
          18,
          2,
          88
        ],
        [
          "D",
          14,
          6,
          64
        ],
        [
          "E",
          10,
          10,
          40
        ]
      ]
    }
  },
  "PEP-P080": {
    "originalStem": "“丰收1号”油菜籽平均每公顷的产量为2400kg，含油率为40%.“丰收2号”油菜籽比“丰收1号”平均每公顷的产量提高了300kg，含油率提高了10个百分点.某村去年种植“丰收1号”油菜籽，今年改种“丰收2号”油菜籽，虽然种植面积比去年减少了3hm²，但是所产油菜籽的总产油量比去年提高了3750kg.这个村去年和今年油菜籽的种植面积各是多少公顷？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        148
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  }
};
 for(const p of data)Object.assign(p,sourceUpdates[p.id]||{});
 for(const p of data)if(p.kind==='open'){p.contentRevision=(p.contentRevision||0)+1;p.analysisNote='本次只分析平衡规律与参数关系，完成分析后保存.';for(const r of p.routes){r.answers=[];r.checks=[];r.equations=[];r.steps=['n*x=1*(l/2)'];r.conclusion='两侧重物等重，平衡时两侧的“重物个数×到支点距离”相等，可列n×x=1×(l÷2).n和l是已知参数，x是未知数；本次只分析平衡关系，不求解.';}}
 if(typeof module==='object'&&module.exports)module.exports=data;
 else root.RatioWordProblemsData=(root.RatioWordProblemsData||[]).concat(data);
})(typeof window==='undefined'?globalThis:window);
