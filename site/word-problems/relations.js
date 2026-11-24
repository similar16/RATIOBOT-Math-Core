/* Authored quantity relationships. Cards name quantities; slots show only binary + or ×. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioWordProblemRelations=api;})(typeof window==='undefined'?globalThis:window,function(){'use strict';
 const catalog=Object.create(null);
 function define(id,sum=[],product=[],notes=[]){catalog[id]={sum,product,notes};}
 function copy(id,from){catalog[id]=catalog[from];}
 const rate=[['速度','时间','路程']];
 const price=[['单价','数量','金额']];
 const work=[['工作效率','工作时间','完成量']];

 define('L7-P1',[
  ['茶壶用泥量','茶杯用泥量','总用泥量']
 ],[
  ['套数','每套茶壶数','茶壶数量'],['套数','每套茶杯数','茶杯数量'],['单件耗泥量','该类件数','该类耗泥量']
 ]);
 define('L7-P2',[
  ['苹果质量','橘子质量','水果总质量'],['苹果金额','橘子金额','水果总金额']
 ],[['单价','质量','金额']]);
 define('L7-P3',[
  ['小明今年年龄','经过年数','小明未来年龄'],['老师今年年龄','经过年数','老师未来年龄']
 ],[['老师未来年龄','小明未来年龄占比','小明未来年龄']]);
 define('L7-T1',[
  ['小丽今年年龄','经过年数','小丽未来年龄'],['爸爸今年年龄','经过年数','爸爸未来年龄'],['小丽未来年龄','爸爸未来年龄','未来年龄和']
 ],[['小丽今年年龄','爸爸年龄倍数','爸爸今年年龄']]);
 define('L7-T2',[
  ['合唱组原人数','合唱组增加人数','合唱组现人数'],['舞蹈组原人数','舞蹈组增加人数','舞蹈组现人数'],['合唱组增加人数','舞蹈组增加人数','总增加人数']
 ],[['舞蹈组现人数','人数倍数','合唱组现人数']]);
 define('L7-H1',[
  ['小明年龄','年龄差','爸爸年龄']
 ],[['小明年龄','年龄倍数','爸爸年龄']]);
 define('L7-H2',[
  ['甲原有蔬菜','乙原有蔬菜','原有蔬菜总量'],['原有量','变化量','现有量']
 ],[],['运出对应负的变化量，运入对应正的变化量.']);
 define('L7-H3',[
  ['原女生人数','增加女生人数','现女生人数'],['原全组人数','增加女生人数','现全组人数']
 ],[['对应时刻全组人数','对应时刻女生比例','对应时刻女生人数']]);
 define('L8-P1',[
  ['进价','利润','售价']
 ],[['进价','加价倍数','标价'],['标价','折扣比例','售价']]);
 define('L8-P1-V1',[
  ['售价','亏损额','进价']
 ],[['进价','加价倍数','标价'],['标价','折扣比例','售价']]);
 define('L8-P1-V2',[
  ['进价','加价额','标价'],['进价','利润','售价']
 ],[['标价','折扣比例','售价']]);
 define('L8-P1-V3',[
  ['进价','运输成本','总成本'],['总成本','利润','售价']
 ],[['进价','运输费率','运输成本'],['进价','加价倍数','标价'],['标价','折扣比例','售价']]);
 define('L8-P2-Q1',[
  ['小亮行进时间','小明先行时间','小明行进时间']
 ],rate);
 copy('L8-P2-Q2','L8-P2-Q1');
 define('L8-P2-Q4',[
  ['较小的距起点路程','两人间距离','较大的距起点路程'],['小亮行进时间','小明先行时间','小明行进时间']
 ],rate,['两种前后次序分别列式、检验；卡片中的“较大”“较小”要随情形确定.']);
 define('L8-P2-Q5',[
  ['小亮行进时间','小明先行时间','小明行进时间']
 ],[...rate,['小明路程','路程倍数','小亮路程']]);
 copy('L8-P2-V1','L8-P2-Q1');
 copy('L8-P2-V2','L8-P2-Q1');
 copy('L8-P2-V3','L8-P2-Q4');
 define('L8-T1',[
  ['进价','利润','售价']
 ],[['标价','折扣比例','售价'],['进价','利润率','利润']]);
 define('L8-T2',[
  ['爷爷路程','一圈长度','小红路程']
 ],[...rate,['爷爷速度','速度倍数','小红速度']]);
 define('L8-H1',[
  ['盈利件进价','盈利件利润','盈利件售价'],['亏损件售价','亏损额','亏损件进价'],['盈利件利润','亏损件利润','总利润']
 ],[
  ['盈利件进价','盈利件售价倍数','盈利件售价'],['亏损件进价','亏损件售价倍数','亏损件售价'],['盈利件进价','盈利率','盈利件利润'],['亏损件进价','亏损率','亏损额']
 ],['亏损件利润为负数；亏损额为正数，两个数量的含义不同.']);
 define('L8-H2',[
  ['小明所用时间','到达时间差','小丽所用时间']
 ],rate);
 define('L8-H3',[
  ['上山时间','下山时间','总时间'],['上山路程','下山路程','往返路程']
 ],rate);

 define('G9-01',[
  ['第一角度数','第二角度数','前两角度数和'],['前两角度数和','第三角度数','三角形内角和']
 ],[['比例份数','每份角度','对应角度']]);
 define('G9-01/smallest',catalog['G9-01'].sum,[['相对最小角的倍数','最小角度数','对应角度']]);
 define('G9-02',[
  ['较短边之一','较短边之二','较短两边长度和']
 ],[['比例份数','每份长度','对应边长']],['较短两边的和是否大于最长边，属于随后必须检查的大小条件.']);
 define('G9-03',[
  ['第一幅黑棋数','后续增加数','总黑棋数']
 ],[['每次增加数','增加次数','后续增加数']]);
 define('G9-04',[
  ['白棋数','实际黑棋数','总棋子数'],['实际黑棋数','重复计数','分条累计黑棋数']
 ],[['每边颗数','每边颗数','总棋子数'],['每边颗数','黑棋线条数','分条累计黑棋数']],['重复计数表示分条数黑棋时多算的颗数；共同的左上角棋子被数3次，实际只应计1次.']);
 define('G9-05',[
  ['重复部分根数','固定部分根数','小棒总根数']
 ],[['单元数','每单元根数','重复部分根数']]);
 define('G9-06',[
  ['上底','下底','两底和']
 ],[['两底和','高','两底和与高的乘积'],['两底和与高的乘积','面积公式系数（二分之一）','梯形面积']]);
 define('G9-07',[
  ['首条鱼用量','后续小鱼新增量','总用量']
 ],[['后添小鱼条数','每条新增根数','后续小鱼新增量']]);
 define('G9-08',[
  ['前一个奇数','中间奇数','前两数之和'],['前两数之和','后一个奇数','三数之和']
 ],[['奇数个数','中间奇数','三数之和']]);
 define('G9-09',[
  ['大菱形数','小菱形数','菱形总数'],['小菱形数','相差个数','大菱形数']
 ]);
 define('G9-10',[
  ['顶层灯数','第二层灯数','前两层灯数'],['前两层灯数','第三层灯数','前三层灯数'],['前三层灯数','第四层灯数','前四层灯数'],['前四层灯数','第五层灯数','前五层灯数'],['前五层灯数','第六层灯数','前六层灯数'],['前六层灯数','第七层灯数','七层总灯数']
 ],[['上一层灯数','相邻层灯数倍数','下一层灯数']]);
 define('G10-01',[
  ['鸡只数','兔只数','总只数'],['鸡脚数','兔脚数','总脚数']
 ],[['每只脚数','该类只数','该类总脚数']]);
 define('G10-02',[
  ['甲效率','乙效率','合作效率'],['甲先做完成量','合作完成量','任务总量']
 ],work);
 define('G10-02/people',[
  ['甲效率','乙效率','合作效率'],['甲完成量','乙完成量','任务总量']
 ],work);
 define('G10-03',[
  ['甲完成量','乙完成量','任务总量']
 ],work);
 define('G10-04',[
  ['乙单独用时','单独用时差','甲单独用时'],['甲完成量','乙完成量','任务总量']
 ],work,['能写出数量关系不等于所得方程一定是一元一次方程，仍需辨别方程类型.']);
 define('G10-05',[
  ['乙行驶时间','甲先行时间','甲行驶时间'],['甲路程','乙路程','全程']
 ],rate);
 define('G10-06',[
  ['每套中A费用','每套中B费用','组合单价'],['先买费用','后买费用','原现金']
 ],[['A单价','每套A件数','每套中A费用'],['B单价','每套B件数','每套中B费用'],['A单价','先买A件数','先买费用'],['组合单价','组合套数','后买费用']],['每套A、B件数均来自题目“各1件”；先得到每套中各类费用，再合成组合单价.']);
 define('G10-07',[
  ['筹得的钱','不足的钱','羊价']
 ],[['每人金额','人数','筹得的钱']]);
 define('G10-08',[
  ['甲效率','乙效率','合作效率'],['合作完成量','乙独做完成量','全部工程']
 ],work);
 define('G10-09',[
  ['野鸭路程','大雁路程','全程']
 ],rate);
 define('G10-10',[
  ['甲下册完成量','乙下册完成量','下册总工作量']
 ],[['工作效率','工作时间','工作量']]);
 define('S01',[
  ['甲类本数','乙类本数','总本数'],['甲类费用','乙类费用','总费用']
 ],price);
 define('S02',[
  ['鸡价','多收的钱','每人9钱的筹款'],['每人6钱的筹款','不足的钱','鸡价']
 ],[['每人金额','人数','筹款金额']]);
 define('S03',[
  ['普通公路时间','高速公路时间','总时间'],['普通公路路程','高速公路路程','全程']
 ],[...rate,['普通公路路程','两段路程倍数','高速公路路程']]);
 define('S03/distance',catalog.S03.sum,[...rate,['全程','该段路程比例','该段路程']]);
 define('S04',[
  ['第一档用电量','第二档用电量','总用电量'],['第一档费用','第二档费用','总电费']
 ],[['本段单价','本段用电量','本段费用']]);
 define('S05',[
  ['五月用电量','六月用电量','两月总用电量'],['六月第一档费用','六月第二档费用','六月电费'],['五月电费','六月电费','两月总电费']
 ],[['本段单价','本段用电量','本段费用']]);
 define('S06',[
  ['五月用电量','六月用电量','两月总用电量'],['某月第一档费用','某月第二档费用','该月总电费'],['五月电费','六月电费','两月总电费']
 ],[['本段单价','本段用电量','本段费用']],['某月没有进入第二档时，该月第二档费用为0；档次与解是否唯一仍需分情形讨论.']);
 define('S07',[
  ['小明本数','小丽本数','总本数'],['小丽费用','两人费用差','小明费用']
 ],price);
 define('S08',[
  ['第一档用电量','第二档用电量','前两档用电量'],['前两档用电量','第三档用电量','总用电量'],['第一档费用','第二档费用','前两档费用'],['前两档费用','第三档费用','总电费']
 ],[['本段单价','本段用电量','本段费用']]);
 define('S09',[
  ['五月用电量','六月用电量','两月总用电量'],['六月第一档费用','六月第二档费用','六月前两档费用'],['六月前两档费用','六月第三档费用','六月电费'],['五月电费','六月电费','两月总电费']
 ],[['本段单价','本段用电量','本段费用']]);
 define('S10',[
  ['甲起点位置','甲行进路程','甲现在位置'],['乙起点位置','乙行进路程','乙现在位置']
 ],rate);

 define('TB-I01',[],[['平均速度','行驶时间','路程']]);
 define('TB-I02',[
  ['盐的质量','水的质量','盐水总质量']
 ],[['盐的质量','水相对盐的倍数','水的质量']]);
 define('TB-I03',[
  ['左盘小球总质量','左盘砝码质量','左盘总质量']
 ],[['小球个数','每个小球质量','小球总质量']],['两盘总质量相等，是天平平衡给出的等量条件.']);
 define('TB-I04',[
  ['右盘小球总质量','右盘砝码质量','右盘总质量']
 ],[['小球个数','每个小球质量','小球总质量']],['两盘总质量相等，是天平平衡给出的等量条件.']);
 define('TB-I05',[
  ['原数的一半','加上的数','指定结果']
 ],[['原数的一半','等分份数','原数']]);
 define('TB-I06',[
  ['剪下总长度','剩余长度','原长']
 ],[['每段长度','剪下段数','剪下总长度']]);
 define('TB-I07',[
  ['首个正方形用量','后添新增用量','总用量']
 ],[['后添个数','每次新增根数','后添新增用量']]);
 define('TB-I08',[
  ['左盘小球总质量','左盘砝码质量','左盘总质量'],['右盘小球总质量','右盘砝码质量','右盘总质量']
 ],[['小球个数','每个小球质量','小球总质量']],['两盘总质量相等，是天平平衡给出的等量条件.']);
 define('TB-I09',[
  ['胜场数','负场数','比赛总场数'],['获胜积分','失利积分','总积分']
 ],[['该类每场得分','该类场数','该类总积分']]);
 define('TB-I10',[
  ['原数','原数的七分之一','两部分之和']
 ],[['原数','另一部分占原数比例','原数的七分之一']]);
 define('TB-I11',[
  ['硬面抄本数','软面抄本数','总本数'],['硬面抄费用','软面抄费用','总费用']
 ],[['每本单价','本数','费用']],['两种设元对应相同的数量关系；是否只有一个未知数，需要在列式时单独判断.']);
 define('TB-I12',[
  ['提速后时间','缩短时间','提速前时间']
 ],[['平均速度','运行时间','铁路里程']]);
 define('TB-I13',[
  ['初始高度','后来增长量','目标高度']
 ],[['每日增长量','经过天数','后来增长量']]);
 define('TB-I14',[],[['总人口','该年龄段人口比例','该年龄段人口']]);
 define('TB-I15',[
  ['小明年龄的倍数量','多出的年龄','爸爸年龄']
 ],[['小明年龄','比较倍数','小明年龄的倍数量']]);
 define('TB-I16',[
  ['两条长的总长','两条宽的总长','周长']
 ],[['每条边长','该类边的条数','该类边总长'],['宽','长宽倍数','长']]);
 define('TB-I17',[
  ['黑色块数','白色块数','皮块总数'],['白色块数','相差块数','黑色块数的倍数量']
 ],[['黑色块数','比较倍数','黑色块数的倍数量']]);
 define('TB-I18',[
  ['练习本费用','圆珠笔费用','总费用']
 ],price);
 define('TB-I19',[
  ['书费','邮费','订单总费用']
 ],[['书的单价','本数','书费']]);
 define('TB-I20',[
  ['起步费','超程费','总费用'],['起步里程','超程里程','总路程']
 ],[['超程单价','超程里程','超程费']]);

 define('TB-A03',[
  ['第一步输出','第一步减去的数','最初输入'],['第二步输出','最后加上的数','最终输出']
 ],[['第一步输出','放大倍数','第二步输出']]);
 define('TB-A10',[
  ['实际时间','提前的天数','原计划时间']
 ],[['每天印数','所用时间','订单总量']]);
 define('TB-A18',[
  ['前阶段时间','冲刺时间','总时间'],['前阶段路程','冲刺路程','总路程']
 ],[['该段平均速度','该段时间','该段路程']]);
 define('TB-A21',[
  ['商品总金额','找零金额','付出金额'],['面包金额','牛奶金额','商品总金额']
 ],price);
 define('TB-A25',[
  ['去年人数','增加人数','今年人数']
 ],[['去年人数','增长率','增加人数'],['去年人数','增长后倍数','今年人数']]);
 define('TB-A29',[
  ['甲路程','乙路程','两地距离']
 ],[...rate,['甲速度','乙相对甲的速度倍数','乙速度']]);
 define('TB-A30',[
  ['小明追赶时间','妈妈先行时间','妈妈行进时间'],['妈妈先行时间','妈妈到站余时','妈妈到站总用时']
 ],rate,['追上时两人距家的路程相等；还须分别核对两种路程情形能否在到站前追上.']);
 define('TB-A32',[],[
  ['底面半径','直径相对半径的倍数','底面直径'],['圆周率','底面直径','底面周长'],['底面半径','底面半径','底面半径的平方'],['圆周率','底面半径的平方','底面积'],['底面积','圆柱高','容积']
 ],['展开图的相邻边分别对应高和底面周长，这是一一对应条件，不是加和关系.']);
 define('TB-A34',[
  ['第一档用水量','超出第一档的用水量','全年用水量'],['第一档水费','超出第一档的水费','总水费']
 ],[['本段单价','本段用水量','本段水费']]);
 define('TB-A37',[
  ['童年年数','童年后至长胡须年数','长出胡须时年龄'],['长出胡须时年龄','长胡须至结婚年数','结婚年龄'],['结婚年龄','结婚至生子年数','生子时年龄'],['生子时年龄','孩子一生年数','孩子去世时父亲年龄'],['孩子去世时父亲年龄','孩子去世后年数','一生年数']
 ],[['一生年数','该阶段所占比例','该阶段年数']]);

 define('TB-R01',[
  ['左格日期','右格日期','左右日期和'],['上格日期','下格日期','上下日期和']
 ],[['一字框格数','中心日期','一字框日期和'],['十字框格数','中心日期','十字框日期和']],['每轮只分析一个框；不同轮次的中心日期和总和不必相同.','横框取左、中、右；竖框取上、中、下；十字框取五个位置.','日期须落在本轮选用的实际月历内，横向不能跨行.']);
 define('TB-R03',[
  ['弹簧原长','伸长量','挂物体后的总长']
 ],[['每千克伸长量','物体质量','伸长量']]);
 define('TB-R04',[
  ['本次阅读页数','读后未读页数','读前未读页数']
 ],[['星期日读前未读页数','本次阅读比例','星期日阅读页数']]);
 define('TB-R05',[
  ['陆地面积','海洋面积','地球表面积']
 ],[['陆地面积','海陆面积倍数','海洋面积']]);
 define('TB-R06',[
  ['甲团人数','乙团人数','总人数'],['乙团人数的倍数量','多出的人数','甲团人数']
 ],[['乙团人数','比较倍数','乙团人数的倍数量']]);
 define('TB-R07',[
  ['成人票张数','学生票张数','总票数'],['成人票收入','学生票收入','总收入']
 ],[['票价','票数','该类收入']]);
 define('TB-R08',[
  ['跑步时间','步行时间','总时间'],['跑步路程','步行路程','总路程']
 ],rate);
 define('TB-R09',[
  ['甲药材质量','乙药材质量','甲乙药材质量'],['甲乙药材质量','丙药材质量','药材总质量']
 ],[['比例份数','每份质量','对应药材质量']]);
 define('TB-R10',[
  ['女生人数','男女相差人数','男生人数'],['男生人数','女生人数','全班人数'],['男生人数','少于比较量的人数','全班人数的比较量']
 ],[['全班人数','题给比较比例','全班人数的比较量']]);
 define('TB-R11',[
  ['横向木条总长','竖向木条总长','木条总长'],['窗宽','高宽之差','窗高']
 ],[['单根长度','同方向根数','该方向总长']]);
 define('TB-R12',[
  ['小丽投中个数','爸爸投中个数','总投中个数']
 ],[['每个得分','投中个数','该人得分']]);
 define('TB-R13',[
  ['缩短高度','剩余高度','原高度']
 ],[['每小时缩短量','燃烧时间','缩短高度'],['第一支剩余高度','剩余高度倍数','第二支剩余高度']]);
 define('TB-R14',[
  ['甲效率','乙效率','合作效率'],['甲先做完成量','乙再做完成量','前两阶段完成量'],['前两阶段完成量','最后合作完成量','全部工程']
 ],work);
 define('TB-R15',[
  ['面粉质量','牛肉质量','食物总质量'],['面粉中蛋白质质量','牛肉中蛋白质质量','蛋白质总质量']
 ],[['食物质量','每克食物的蛋白质含量','该食物的蛋白质质量']]);
 define('TB-R16',[
  ['乙已行路程','路程差','甲已行路程']
 ],rate);
 define('TB-R17',[
  ['第一张座位数','后添桌子新增座位','总座位数'],['每张新增座位','相接处减少座位','单张独放座位数']
 ],[['每张新增座位','后添桌数','后添桌子新增座位'],['每条长边原有座位','相接长边条数','相接处减少座位']]);
 define('TB-R18',[
  ['基准锐角','另一个锐角','两锐角之和'],['两锐角之和','直角度数','三角形内角和'],['另一个锐角','少的度数','基准锐角的倍数量']
 ],[['基准锐角','比较倍数','基准锐角的倍数量']]);
 define('TB-R19',[
  ['井深','井外余绳','折后每段长']
 ],[['折数','折后每段长','原绳长']]);
 define('TB-R20',[
  ['第一次用去长度','第一次剩余长度','原长'],['第二次用去长度','最后剩余长度','第一次剩余长度'],['第一次用去长度','第一次少用长度','原长的一半'],['第一次剩余的一半','第二次多用长度','第二次用去长度']
 ],[['原长','取半比例','原长的一半'],['第一次剩余长度','取半比例','第一次剩余的一半']]);
 define('TB-R21',[
  ['五折售价','亏损额','成本'],['成本','利润','八折售价']
 ],[['标价','五折售价比例','五折售价'],['标价','八折售价比例','八折售价'],['标价','最低不亏本售价比例','成本'],['折数','每折对应比例','售价占标价比例']]);
 define('TB-R22',[
  ['购买金额','找回金额','付款金额']
 ],[['单价','质量','购买金额']],['本组关系针对题中给定方程的买梨解释；另编故事仍需逐一解释数量和单位.']);

 const normalizeToken=value=>value==='最大允许排量'?'环保限制的最大量':value==='加价后倍数'?'加价倍数':value;
 function rows(raw){return raw.map((triple,i)=>{if(!Array.isArray(triple)||triple.length!==3||triple.some(s=>typeof s!=='string'||!s.trim()))throw Error('Invalid authored relation at '+i);return {terms:triple.slice(0,2),result:triple[2]};});}
 function build(problem,route){
  const key=String(problem?.id||'')+'/'+String(route?.id||''),raw=route?.relationTriples||problem?.relationTriples||catalog[key]||catalog[problem?.id];
  if(!raw)throw Error('缺少数量关系配置：'+key);
  const sum=rows(raw.sum||[]),product=rows(raw.product||[]),labels=[...new Set([...sum,...product].flatMap(r=>[...r.terms,r.result]))];
  return {id:key,sum,product,tokens:labels.map(label=>({id:label,label})),count:sum.length+product.length,notes:[...(raw.notes||[])],empty:{sum:sum.length?'':'本题没有需要拼接的加和等式.',product:product.length?'':'本题没有需要拼接的乘积等式.'}};
 }
 function canonical(model){return {sum:model.sum.map(r=>[...r.terms,r.result]),product:model.product.map(r=>[...r.terms,r.result])};}
 // Original quantity relationships also support the relation-first table workflow.
 function reference(problem,route){
  const model=build(problem,route);
  if(problem.id==='TB-A37')model.sum=[{terms:['童年年数','童年后至长出胡须年数','长出胡须至结婚年数','结婚至生子年数','孩子一生年数','孩子去世后年数'],result:'一生年数'}];
  if(problem.id==='TB-I05'){model.sum=[{terms:['a的二分之一','2'],result:'5'}];model.product=[];}
  if(problem.id==='TB-R01')model.sum=[];
  model.count=model.sum.length+model.product.length;
  model.tokens=[...new Set([...model.sum,...model.product].flatMap(r=>[...r.terms,r.result]))].map(label=>({id:label,label}));
  return model;
 }
 // Only a small number of tasks benefit from a separate relationship activity.
 // Indices refer to the original authored rows, which remain available for old records.
 const practicePolicy={
  'L7-P1':{sum:[0]}, // Introduce the first complete model, without per-piece multiplication drills.
  'L7-P2':{sum:[1]},
  'L7-P3':{product:[0]}, // Compare ages at the same future moment.
  'L7-T1':{sum:[2]},
  'L7-H3':{sum:[1]}, // Adding girls also changes the denominator (the whole group).
  'L8-P1':{product:[1]},'L8-P1-V1':{product:[1]},
  'L8-P1-V2':{sum:[1]},'L8-P1-V3':{sum:[0]},
  'L8-P2-Q1':{sum:[0]},'L8-P2-Q2':{sum:[0]},
  'L8-P2-Q4':{sum:[0]},'L8-P2-Q5':{sum:[0]},
  'L8-P2-V1':{sum:[0]},'L8-P2-V2':{sum:[0]},'L8-P2-V3':{sum:[0]},
  'L8-T2':{sum:[0]}, // The faster runner has covered one extra lap.
  'L8-H1':{sum:[2]}, // Net profit combines a positive profit and a signed loss.
  'L8-H2':{sum:[0]},'L8-H3':{sum:[0]},
  'G10-02':{sum:[1]},'G10-03':{sum:[0]},'G10-05':{sum:[0]},'G10-08':{sum:[1]},
  'S03':{sum:[0]},'S05':{sum:[2]},'S09':{sum:[3]},'S10':{sum:[0]},
  'PEP-P040':{sum:[0]}, // The entire train must leave the tunnel.
  'PEP-P041':{product:[1]},'PEP-P042':{sum:[1]},
  'PEP-P052':{sum:[0]},'PEP-P053':{sum:[1]},'PEP-P054':{sum:[1]},
  'PEP-P055':{product:[1]},'PEP-P062':{sum:[0]},
  'PEP-P080':{product:[1]},
  'TB-A10':{sum:[0]},'TB-A30':{sum:[0]},
  'TB-R13':{sum:[0]},'TB-R20':{product:[1]} // The second half is based on the first remainder.
 };
 function practice(problem,route){
  const full=build(problem,route),choice=practicePolicy[full.id]||practicePolicy[problem?.id]||{};
  const select=kind=>(choice[kind]||[]).map(sourceIndex=>{
   const row=full[kind][sourceIndex];if(!row)throw Error('Invalid practice relation at '+full.id+'/'+kind+':'+sourceIndex);
   return {...row,terms:[...row.terms],sourceIndex};
  });
  const sum=select('sum'),product=select('product'),labels=[...new Set([...sum,...product].flatMap(r=>[...r.terms,r.result]))];
  return {...full,full,sum,product,count:sum.length+product.length,tokens:labels.map(label=>({id:label,label})),notes:sum.length+product.length?full.notes:[]};
 }
 function practiceAnswers(model,values={},checked=false){
  const answer=Object.fromEntries(['sum','product'].map(kind=>[kind,model[kind].map(row=>[0,1,2].map(j=>normalizeToken(values['r:'+kind+':'+row.sourceIndex+':'+j]||'')))]));
  // Previously checked full activities allowed arbitrary row order. Recover the
  // matching retained row by its meaning, without redoing or changing historical work.
  if(checked&&model.count&&model.full){
   const legacy=Object.fromEntries(['sum','product'].map(kind=>[kind,model.full[kind].map((_,i)=>[0,1,2].map(j=>normalizeToken(values['r:'+kind+':'+i+':'+j]||'')))]));
   if(check(model.full,legacy).ok)for(const kind of ['sum','product'])answer[kind]=model[kind].map(row=>legacy[kind].find(a=>signature(a)===signature([...row.terms,row.result])).slice());
  }
  return answer;
 }
 function signature(row){return JSON.stringify([row.slice(0,-1).sort(),row.at(-1)]);}
 function check(model,answers){
  const available=new Set(model.tokens.map(t=>t.id));
  for(const type of ['sum','product']){
   const wanted=model[type],raw=answers?.[type],actual=Array.isArray(raw)?raw.map(row=>Array.isArray(row)?row.map(normalizeToken):row):raw;
   if(!Array.isArray(actual)||actual.length!==wanted.length)return {ok:false,kind:'incomplete',type,message:'请把每条'+(type==='sum'?'加和':'乘积')+'关系的所有框都填完整.'};
   if(actual.some(row=>!Array.isArray(row)||!wanted.some(w=>w.terms.length+1===row.length)||row.some(v=>typeof v!=='string'||!available.has(v))))return {ok:false,kind:'incomplete',type,message:'还有数量框没有填好，请从上方选择对应的数量.'};
   const counts=new Map();
   for(const row of wanted){const k=signature([...row.terms,row.result]);counts.set(k,(counts.get(k)||0)+1);}
   for(const [i,row]of actual.entries()){const k=signature(row),left=counts.get(k)||0;if(!left)return {ok:false,kind:'relation',type,row:i,message:'再看数量的含义：等号左边的量合成什么量？同类关系可以换行，加数或乘数也可以交换.'};counts.set(k,left-1);}
  }
  return {ok:true,kind:'correct',message:'关系正确；同类关系的先后顺序以及加数、乘数的顺序都可以交换.'};
 }
 return {build,reference,practice,practiceAnswers,canonical,check,normalizeToken};
});
