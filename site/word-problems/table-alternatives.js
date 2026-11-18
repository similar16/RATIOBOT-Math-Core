/* Other expressions for the SAME quantity, justified before solving.
   This is a reviewed content registry, not a solver. Algebraic rearrangements of
   one expression are handled by engine.checkTableCell. Entries here deliberately
   use a different condition (for example selling price = cost + profit).
   Never infer an entry by substituting a final answer. Keep route meanings and
   method-specific column headings intact. Row/cell indices exclude the row label. */
(function (root) {
  'use strict';
  const records = [];
  const index = new Map();
  const list = value => String(value || '').split(',').filter(Boolean);

  function define(problemId, routeId, closureSources, closureHint, rows) {
    for (const [rowIndex, cellIndex, expr, sources, explain, ownClosure, ownHint] of rows) {
      const alternative = Object.freeze({
        expr,
        sources: Object.freeze(list(sources)),
        explain,
        closureSources: Object.freeze(list(ownClosure == null ? closureSources : ownClosure)),
        closureHint: ownHint || closureHint
      });
      const record = Object.freeze({ problemId, routeId, rowIndex, cellIndex, alternative });
      records.push(record);
      const key = [problemId, routeId, rowIndex, cellIndex].join('/');
      if (!index.has(key)) index.set(key, []);
      index.get(key).push(alternative);
    }
  }

  // Quantities, allocation, age: a total or comparison can describe the same part.
  define('L7-P1', 'sets', 'sets,pot,cup', '再按每套的壶杯数量和各自用泥量，连接两类用泥量.', [
    [0,2,'10.5-0.15*6*x','clay,cup,sets,unknown','壶用泥量等于总泥量减去杯用泥量.'],
    [1,1,'(10.5-0.6*x)/0.15','clay,pot,cup,unknown','扣除壶的用泥量，再按每只杯用泥量求杯数.'],
    [1,2,'10.5-0.6*x','clay,pot,unknown','杯用泥量等于总泥量减去壶用泥量.']
  ]);
  define('L7-P2', 'mass', 'mass,orange', '用总质量6千克及橘子每千克5.6元，连接橘子质量与金额.', [
    [1,1,'(36-6.2*x)/5.6','cost,apple,orange,unknown','先扣除苹果金额，再按橘子单价求质量.','mass','再用苹果质量加橘子质量等于6千克.'],
    [1,2,'36-6.2*x','cost,apple,unknown','橘子金额等于总金额减去苹果金额.'],
    [0,2,'36-5.6*(6-x)','cost,orange,mass,unknown','苹果金额等于总金额减去橘子金额.','apple','再用苹果单价乘苹果质量等于苹果金额.']
  ]);
  define('L7-P2', 'cost', 'cost,orange', '再用总金额及橘子单价，连接橘子质量与金额.', [
    [1,1,'6-x/6.2','mass,apple,unknown','用总质量减去苹果质量.'],
    [1,2,'5.6*(6-x/6.2)','orange,mass,apple,unknown','先由总质量求橘子质量，再乘橘子单价.','cost','再用两类金额合计36元.'],
    [0,1,'6-(36-x)/5.6','mass,cost,orange,unknown','用总质量减去橘子质量.','apple','再用苹果单价乘苹果质量等于所设苹果金额.']
  ]);
  define('L7-P2', 'mass-from-cost', 'cost', '再用苹果和橘子的金额合计36元.', [
    [1,1,'6-x','mass,unknown','用总质量减去所设苹果质量.'],
    [1,2,'5.6*(6-x)','orange,mass,unknown','先由总质量求橘子质量，再乘橘子单价.']
  ]);
  define('L7-P3', 'elapsed', 'student,teacher,same-time', '两个年龄都应在现在的年龄上增加同样的x岁.', [
    [0,2,'(45+x)/3','teacher,same-time,unknown,ratio','按题设倍数关系，由那时老师年龄求学生年龄.'],
    [1,2,'3*(13+x)','student,same-time,unknown,ratio','按题设倍数关系，由那时学生年龄求老师年龄.']
  ]);
  define('L7-T1', 'daughter', 'ratio,years,same-time', '再用现在的年龄倍数及经过相同年数的关系.', [
    [1,0,'58-(x+5)-5','sum,years,same-time,unknown','从5年后的年龄和扣去女儿届时年龄，再减5岁.'],
    [0,2,'58-(3*x+5)','sum,ratio,years,same-time,unknown','女儿5年后年龄等于年龄和减去父亲届时年龄.'],
    [1,2,'58-(x+5)','sum,years,same-time,unknown','父亲5年后年龄等于年龄和减去女儿届时年龄.'],
    [2,0,'58-(5+5)','sum,years,same-time','两人现在的年龄和等于5年后的年龄和减去两人各增加的5岁.']
  ]);
  define('L7-T2', 'added', 'new', '再用两个组新加入的人数合计20人.', [
    [0,2,'2*(19+(20-x))','ratio,dance,new,unknown','按人数倍数，由舞蹈组现人数求合唱组现人数.','choir','合唱组现人数还应等于原有27人加新加入的x人.'],
    [1,1,'(27+x)/2-19','choir,ratio,dance,unknown','先由倍数求舞蹈组现人数，再扣去原有19人.'],
    [1,2,'(27+x)/2','choir,ratio,unknown','舞蹈组现人数等于合唱组现人数的一半.','dance,new','再用舞蹈组原有人数与两组新加入总人数.']
  ]);
  define('L7-H2', 'initial-a', 'total,in,out', '再按原有总人数和各队调入、调出人数，连接两队现有人数.', [
    [0,2,'(60-x)-10','total,out,equal,unknown','调整后两队相等，可用乙队现人数表示甲队现人数.'],
    [1,0,'x+14+10','in,out,equal,unknown','乙队原人数等于相等的现人数再加调出的10人.','total','再用两队原人数合计60人.'],
    [1,2,'x+14','in,equal,unknown','调整后两队相等，可用甲队现人数表示乙队现人数.']
  ]);
  define('L7-H3', 'original-total', 'before-ratio,add-girls', '再用原女生占一半及只增加6名女生，连接原人数和现人数.', [
    [0,0,'(x+6)*2/3-6','unknown,add-girls,after-ratio','由现总人数求现女生人数，再扣除新增6人.'],
    [0,2,'(x+6)*2/3','unknown,add-girls,after-ratio','现女生人数也可按现总人数的三分之二表示.'],
    [1,2,'(x/2+6)/(2/3)','unknown,before-ratio,add-girls,after-ratio','由现女生人数除以其占总人数的比例求现总人数.']
  ]);

  // Discount: distinguish cost, marked price, selling price and profit explicitly.
  define('L8-P1', 'cost', 'markup,discount', '售价还应由进价乘1.5得到标价，再按八折计算.', [
    [0,1,'(x+96)/(8/10)','unknown,profit,discount,discount-definition','先由进价加利润得售价，再由八折还原标价.','markup','再用标价是进价的1.5倍.'],
    [0,2,'x+96','unknown,profit','这件羽绒服盈利96元，所以售价=进价+96元.']
  ]);
  define('L8-P1-V1', 'cost', 'markup,discount', '售价还应由进价乘1.2得到标价，再按七折计算.', [
    [0,1,'(x-96)/(7/10)','unknown,loss,discount,discount-definition','售价比进价少96元，再由七折还原标价.','markup','再用标价是进价的1.2倍.'],
    [0,2,'x-96','unknown,loss','亏损96元表示售价比进价少96元.']
  ]);
  define('L8-P1-V2', 'cost', 'markup,discount', '标价应是进价加160元，售价再按这个标价打八折.', [
    [0,1,'(x+96)/(8/10)','unknown,profit,discount,discount-definition','由进价加利润得售价，再按八折还原标价.','markup','再用标价比进价多160元.'],
    [0,2,'x+96','unknown,profit','盈利96元，所以售价等于进价加96元.']
  ]);
  define('L8-P1-V3', 'cost', 'markup,discount', '售价还应等于进价的2.2倍所定标价再打六折.', [
    [0,1,'(2.2*x)*(6/10)-x-88','markup,discount,discount-definition,profit,unknown','运费等于售价减进价再减利润.','transport','再用运费占进价的10%.'],
    [0,2,'(x+x*0.1+88)/(6/10)','unknown,transport-rate,profit,discount,discount-definition','先把进价、运费、利润相加得售价，再还原标价.','markup','再用标价是进价的2.2倍.'],
    [0,3,'x+x*0.1+88','unknown,transport-rate,profit','售价须覆盖进价、运费和88元利润.']
  ]);
  define('L8-T1', 'marked-price', 'discount', '再用售价等于标价打九折后的金额.', [
    [0,2,'360+360*15%','cost,profit-rate','利润按进价计算；售价=360元进价+进价的15%.'],
    [0,3,'x*(9/10)-360','unknown,discount,discount-definition,cost','利润也可用九折售价减进价.','profit-rate','再用利润是进价的15%.']
  ]);
  define('L8-H1', 'separate-costs', 'sale', '分别用两件衬衫各售240元列式；两种进价不能混用.', [
    [0,3,'25%*x','unknown,gain,base','盈利件的利润是该件进价x的25%.'],
    [1,3,'-25%*y','unknown,loss,base','亏损件的利润为负，是该件进价y的负25%.'],
    [2,3,'25%*x-25%*y','unknown,gain,loss,base','总利润等于盈利件利润与亏损件负利润相加.']
  ]);

  define('G10-01', 'chicken', 'heads', '再用鸡和兔的只数合计35只.', [
    [1,1,'(94-2*x)/4','feet,legs,unknown','总腿数扣掉鸡腿，再按每兔4条腿求兔数.'],
    [1,2,'94-2*x','feet,legs,unknown','兔腿数等于总腿数减鸡腿数.','heads,legs','再把兔数与每兔4条腿相连，并满足总只数35.'],
    [0,2,'94-4*(35-x)','feet,legs,heads,unknown','鸡腿数等于总腿数减兔腿数.','legs','再用每鸡2条腿连接鸡数和鸡腿数.']
  ]);
  define('G10-01', 'rabbit', 'heads', '再用鸡和兔的只数合计35只.', [
    [1,1,'(94-4*y)/2','feet,legs,unknown','总腿数扣掉兔腿，再按每鸡2条腿求鸡数.'],
    [1,2,'94-4*y','feet,legs,unknown','鸡腿数等于总腿数减兔腿数.','heads,legs','再按每鸡2条腿及总只数35连接数量.'],
    [0,2,'94-2*(35-y)','feet,legs,heads,unknown','兔腿数等于总腿数减鸡腿数.','legs','再用每兔4条腿连接兔数和兔腿数.']
  ]);
  define('G10-01', 'chicken-feet', 'feet', '再用鸡腿数与兔腿数合计94条.', [
    [1,1,'4*(35-x/2)','legs,heads,unknown','先由鸡腿数求鸡数，再求兔数及兔腿数.'],
    [1,2,'35-x/2','heads,legs,unknown','兔数等于总只数减鸡数.'],
    [0,2,'35-(94-x)/4','heads,feet,legs,unknown','鸡数等于总只数减兔数.','legs','再用每鸡2条腿连接所设鸡腿数和鸡数.']
  ]);
  define('G10-06', 'sets', 'set,aCount,bCount', '再按每套甲乙各一本及各自单价，连接套数和第二次花费.', [
    [1,2,'1-(1/18)*8','whole,aPrice,first,spent','第二次花费等于全部的钱减第一次花费.']
  ]);
  define('G10-07', 'people', 'planA,planB', '同一羊价还须分别满足两种分摊方案的筹款和不足金额.', [
    [0,3,'7*x+3','planB,same,unknown','两个方案购买同一只羊，可由第二种方案表示羊价.'],
    [1,3,'5*x+45','planA,same,unknown','两个方案购买同一只羊，可由第一种方案表示羊价.']
  ]);
  define('S02', 'people', 'surplus,shortage', '同一物品价格还须满足两种筹款方案的盈、缺关系.', [
    [0,3,'6*x+16','shortage,same,unknown','可由第二种筹款加不足金额表示物品价格.'],
    [1,3,'9*x-11','surplus,same,unknown','可由第一种筹款减多余金额表示物品价格.']
  ]);

  define('TB-I02', 'standard', 'ratio', '再用水的质量是盐质量的10倍.', [
    [1,1,'550-x','total,massRule,unknown','水的质量等于盐水总质量减盐的质量.']
  ]);
  define('TB-I06', 'standard', 'cut', '再用剪下的两段等长，每段长x.', [
    [0,2,'20-6','total,remain','剪下总长等于原来20米减剩余6米.']
  ]);
  define('TB-I11', 'one-variable', 'count', '再用两类笔记本合计30本.', [
    [1,1,'(90-5*x)/2','cost,hard,soft,unknown','总价扣去硬皮本金额，再除以软皮本单价.'],
    [1,2,'90-5*x','cost,hard,unknown','软皮本金额等于总价减硬皮本金额.','soft,count','再按软皮本单价和两类总本数连接其数量、金额.'],
    [0,2,'90-2*(30-x)','cost,soft,count,unknown','硬皮本金额等于总价减软皮本金额.','hard','再用硬皮本单价乘本数表示其金额.']
  ]);
  define('TB-I13', 'standard', 'growth', '再用每天增长30厘米乘生长天数.', [
    [1,2,'1000-10','targetCm,initial','增长总高度等于目标高度减初始高度.']
  ]);
  define('TB-I17', 'standard', 'relation', '再用白棋比黑棋的2倍少4颗.', [
    [1,0,'32-x','total,unknown','白棋数等于总棋子数减黑棋数.']
  ]);
  define('TB-I18', 'standard', 'books', '再用每本书的单价乘5本求书的总价.', [
    [0,2,'16-3*2','total,pens','书的总价等于全部金额减去3支笔的金额.']
  ]);
  define('TB-I19', 'standard', 'books', '再用3本书的本数乘每本单价.', [
    [0,2,'97.5-6','total,postage','书的总价等于付款总额减邮费.']
  ]);
  define('TB-A21', 'price', 'breadCount', '再用面包单价乘3个，连接面包单价与金额.', [
    [0,2,'20-3.8-4.8*1','paid,change,milk','付款减找零得到实付，再扣去一盒牛奶的金额.'],
    [2,2,'3*x+4.8*1','breadCount,milk,unknown','商品总价也可由面包金额加牛奶金额得到.','paid,change','再用付款减找零等于实付总金额.']
  ]);
  define('TB-R03', 'table', 'increment', '再用每千克伸长量乘质量，连接质量和伸长量.', [
    [1,2,'45-40','length,original','伸长量等于现在长度减原来长度.']
  ]);
  define('TB-R04', 'table', 'sat,sun', '周六读后余量仍须等于原书页数减20；周日再读其中的一半.', [
    [0,2,'15*2','left,sun,half','周日读掉一半后还剩15页，所以周六读后有两份15页.'],
    [1,0,'15*2','left,sun,half','周日开始时有读掉的一半和剩下的一半，各15页.'],
    [1,1,'15','left,sun,half','周日读掉与留下的各占一半，所以读掉的也有15页.']
  ]);
  define('TB-R05', 'table', 'ratio', '再用海洋面积是陆地面积的2.4倍.', [
    [1,0,'5.1-x','total,unknown','海洋面积等于总面积减陆地面积.']
  ]);
  define('TB-R06', 'table', 'relation', '再用甲组比乙组的2倍多5人.', [
    [1,0,'80-x','total,unknown','甲组人数等于总人数减乙组人数.']
  ]);
  define('TB-R07', 'table', 'count', '再用成人票和学生票合计1680张.', [
    [1,1,'(54400-40*x)/20','money,adult,student,unknown','总票款扣去成人票款，再按学生票单价求张数.'],
    [1,2,'54400-40*x','money,adult,unknown','学生票款等于总票款减成人票款.','student,count','再按学生票单价及总张数连接数量与票款.'],
    [0,2,'54400-20*(1680-x)','money,student,count,unknown','成人票款等于总票款减学生票款.','adult','再用每张成人票40元连接张数与票款.']
  ]);
  define('TB-R09', 'table', 'ratio', '再用三种药材的质量比2∶3∶7.', [
    [0,2,'1440-3*x-7*x','total,ratio,part,unknown','第一种质量等于总质量减其余两种质量.'],
    [1,2,'1440-2*x-7*x','total,ratio,part,unknown','第二种质量等于总质量减其余两种质量.'],
    [2,2,'1440-2*x-3*x','total,ratio,part,unknown','第三种质量等于总质量减其余两种质量.']
  ]);
  define('TB-R10', 'table', 'girls', '再用女生比男生少2人的关系.', [
    [1,0,'x-((5/8)*x-5)','total,boys,unknown','女生人数等于总人数减男生人数.']
  ]);
  define('TB-R12', 'table', 'count', '再用父女合计投中20个球.', [
    [0,2,'1*(20-x)','father,count,equal,unknown','双方得分相等，可用父亲得分表示女儿得分.','daughter','再用女儿每球3分连接命中数和得分.'],
    [1,1,'3*x/1','daughter,father,equal,unknown','由与女儿相等的得分，再按父亲每球1分求命中数.'],
    [1,2,'3*x','daughter,equal,unknown','双方得分相等，可用女儿得分表示父亲得分.','father,count','再用父亲每球1分以及总命中数20.']
  ]);
  define('TB-R13', 'table', 'same,first,second,time', '再用等高蜡烛各自燃烧2小时后的剩余长度.', [
    [0,4,'(x-12)/1.5','unknown,secondLoss,ratio','第二支剩余长度是第一支的1.5倍，反求第一支剩余长度.'],
    [1,4,'1.5*(x-16)','unknown,firstLoss,ratio','由第一支剩余长度乘1.5求第二支剩余长度.']
  ]);
  define('TB-R19', 'table', 'three,four', '同一个井深还应同时满足三折和四折时的余长关系.', [
    [0,3,'x/4-1','unknown,four,same','同一口井的深度，可由四折时的绳长减余长表示.'],
    [1,3,'x/3-4','unknown,three,same','同一口井的深度，可由三折时的绳长减余长表示.']
  ]);
  define('TB-R20', 'table', 'first', '再用第一次用去原长的一半少1米，连接原长与第一次余长.', [
    [0,2,'(3+1)*2','second,left,half','第二次剩3米、且比一半多用1米，因此第一次余长的一半是3+1米.'],
    [1,0,'(3+1)*2','second,left,half','第二次开始时的长度由最后余长和第二次用法倒推.'],
    [1,1,'(x-(x/2-1))-3','unknown,first,half,left','第二次用量等于第二次开始时的余长减最后3米.','second','再用第二次用掉当时余长的一半多1米.']
  ]);
  define('PEP-P002', 'main', 'counts,gap', '再用每杯价格差5元及购买的大小杯数量连接两边金额.', [
    [0,2,'3*(x+5)','counts,gap,equal,unknown','两种购买金额相等，可用3个大杯的金额表示4个小杯的金额.'],
    [1,0,'4*x/3','counts,equal,unknown','大杯单价等于同样的4个小杯金额除以3.','gap','再用大杯单价比小杯高5元.'],
    [1,2,'4*x','counts,equal,unknown','两种购买金额相等，可用4个小杯的金额表示3个大杯的金额.']
  ]);
  define('PEP-P003', 'main', 'girls,whole', '再用女生占总人数52%、男生占剩余部分的比例.', [
    [0,1,'(1-52%)*x+80','boysFraction,unknown,difference','女生比男生多80人，所以女生人数=男生人数+80.'],
    [1,1,'52%*x-80','girls,unknown,difference','男生比女生少80人.']
  ]);
  define('PEP-P005', 'main', 'first,second,transfer', '再用第一根剪去x、第二根接上x的关系.', [
    [0,3,'40+x','second,transfer,equal,unknown','两根调整后等长，可用第二根的长度表示第一根.'],
    [1,3,'90-x','first,transfer,equal,unknown','两根调整后等长，可用第一根的长度表示第二根.']
  ]);
  define('PEP-P015', 'main', 'last,this', '再用相邻两年的产量倍数连接三个年份.', [
    [1,2,'550-x-2*1.5*x','total,last,this,unknown','第二年产量等于三年总量减第一年和第三年产量.'],
    [2,2,'550-x-1.5*x','total,last,unknown','第三年产量等于三年总量减前两年产量.']
  ]);
  define('PEP-P018', 'main', 'ratio', '再用新旧排放量2∶5的比例.', [
    [1,0,'x+100+200','under,over,limit,unknown','先由新排量加100得到限量，再加旧排量超出的200.'],
    [0,2,'(5/2)*x-200','oldFactor,over,limit,unknown','同一排放限量，也可用旧排量减超出的200表示.','under','再用新排量比允许量少100.'],
    [1,2,'x+100','under,limit,unknown','同一排放限量，也可用新排量加少排的100表示.','ratio,over','再用新旧排量比和旧排量超标200的关系.']
  ]);
  define('PEP-P020', 'main', 'wang,zhang,time,transfer', '再按各自采摘速度、相同时间和转交方向，连接转交后的两份质量.', [
    [0,3,'7*x+0.25','zhang,time,transfer,equal,unknown','转交后一样多，可用另一人的现有质量表示.'],
    [1,3,'8*x-0.25','wang,time,transfer,equal,unknown','转交后一样多，可用另一人的现有质量表示.']
  ]);
  define('PEP-P021', 'main', 'decrease', '再用下半年平均每月比上半年少2000度.', [
    [1,0,'(150000-(12/2)*x)/(12/2)','annual,calendar,unknown','全年用量减上半年用量，再除以下半年的月数.'],
    [0,2,'150000-(12/2)*(x-2000)','annual,calendar,decrease,unknown','上半年用量等于全年减下半年.','calendar','再用上半年月数乘每月平均用量.'],
    [1,2,'150000-(12/2)*x','annual,calendar,unknown','下半年用量等于全年减上半年.','calendar,decrease','再用下半年月数及每月减少2000度计算下半年用量.']
  ]);
  define('PEP-P032', 'main', 'spray,drip', '再用喷灌、滴灌各占基准面积的百分率.', [
    [1,1,'420-x-15%*x','total,base,drip,unknown','喷灌面积等于总面积减基准面积和滴灌面积.'],
    [2,1,'420-x-25%*x','total,base,spray,unknown','滴灌面积等于总面积减基准面积和喷灌面积.']
  ]);
  define('PEP-P072', 'main', 'goldSilver,silverBronze', '再用金银牌差5枚、银铜牌差2枚.', [
    [1,0,'15-x-(x-5-2)','total,goldSilver,silverBronze,unknown','银牌数等于总枚数减金牌和铜牌数.'],
    [2,0,'15-x-(x-5)','total,goldSilver,unknown','铜牌数等于总枚数减金牌和银牌数.']
  ]);
  define('PEP-P076', 'main', 'first,second', '再用两次每笼只数及第一次笼外3只的关系.', [
    [0,4,'8*x-5','second,arrive,unknown','原总数等于新总数减后来飞来的5只.'],
    [1,2,'6*x+3+5','first,arrive,second,unknown','第二次都进笼，笼内总数等于原有总数加飞来的5只.'],
    [1,4,'6*x+3+5','first,arrive,unknown','新总数等于原有总数加飞来的5只.']
  ]);
  define('PEP-P077', 'main', 'sum,fatherThen,daughterThen', '再用两个时刻各自给定的年龄和、倍数关系.', [
    [0,2,'2*x-(91-x)/3','fatherThen,daughterThen,sum,gap,unknown','父女年龄差不变，可由另一时刻的年龄求现在的年龄差.'],
    [1,2,'(91-x)-x','sum,gap,unknown','父女年龄差不变，可由现在的年龄求另一时刻的年龄差.'],
    [1,0,'2*x-((91-x)-x)','fatherThen,sum,gap,unknown','另一时刻女儿年龄等于父亲届时年龄减不变的年龄差.','daughterThen','再用女儿那时年龄是父亲现在年龄的三分之一.'],
    [1,1,'(91-x)/3+((91-x)-x)','daughterThen,sum,gap,unknown','另一时刻父亲年龄等于女儿届时年龄加不变的年龄差.','fatherThen','再用父亲那时年龄是女儿现在年龄的2倍.']
  ]);

  // Work, production and percentages: complementary completed amounts and matching parts.
  define('G10-02', 'phases', 'aHours,bHours,firstHours', '再按合作效率乘合作时间，连接第二阶段的时间和完成量.', [
    [1,2,'1-(1/18)*8','whole,aRate,firstHours,done','合作完成量等于全部任务减甲先做的完成量.']
  ]);
  define('G10-02', 'people', 'aHours,bHours,firstHours', '再按两人的效率与实际工作时间，连接各自完成量.', [
    [0,2,'1-(1/12)*x','whole,bRate,done,unknown','甲完成量等于全部任务减乙完成量.'],
    [1,2,'1-(1/18)*(8+x)','whole,aRate,firstHours,done,unknown','乙完成量等于全部任务减甲完成量.']
  ]);
  define('G10-03', 'efficiency', 'coopHours', '再用乙效率乘合作4小时求乙完成量.', [
    [1,2,'1-(1/18)*(8+4)','whole,aRate,firstHours,coopHours','乙完成量等于全部任务减甲实际完成量.']
  ]);
  define('G10-08', 'days', 'bDays', '再用乙的工作效率乘继续工作的天数.', [
    [1,2,'1-(1/10+1/15)*2','whole,aRate,bRate,first,done','乙后来独做的量等于全部减去先合作2天的量.']
  ]);
  define('G10-10', 'parts', 'aHours,bHours,ratio,unit', '再用两人的阅读速度乘共同阅读的时间.', [
    [0,4,'2-(4/30)*x','target,bRate,unknown','甲在下册读的量等于下册总量减乙读的量.'],
    [1,4,'2-(4/20)*x','target,aRate,unknown','乙在下册读的量等于下册总量减甲读的量.']
  ]);
  define('TB-A10', 'quantity', 'planned,increase,same', '再用相同印量分别除以计划和实际的每天印量.', [
    [0,2,'x/(15+5)+4','planned,increase,earlier,unknown','计划时间比实际时间多4天.'],
    [1,2,'x/15-4','planned,earlier,unknown','实际时间比计划时间少4天.']
  ]);
  define('TB-A25', 'last-year', 'growth', '再用去年人数乘1+10%得到今年人数.', [
    [0,3,'352','current','题目已直接给出今年人数352人.']
  ]);
  define('TB-R14', 'table', 'aTime,bTime', '再用两人合作效率乘最后合作时间.', [
    [2,2,'1-(1/20)*8-(1/30)*3','whole,aRate,bRate,aFirst,bThen,done','最后合作完成量等于全部减两段独做完成量.']
  ]);
  define('TB-R15', 'table', 'mass', '再用面粉和牛肉的质量合计600克.', [
    [0,2,'75-0.2*(600-x)','protein,beefRate,mass,unknown','面粉中的蛋白质等于总蛋白质减牛肉中的蛋白质.','flour','再用面粉蛋白质比例连接面粉质量和蛋白质量.'],
    [1,1,'(75-0.1*x)/0.2','protein,flourRate,beefRate,unknown','扣除面粉蛋白质，再由牛肉蛋白质比例求牛肉质量.'],
    [1,2,'75-0.1*x','protein,flourRate,unknown','牛肉中的蛋白质等于总蛋白质减面粉中的蛋白质.','mass,beef','再按总质量及牛肉蛋白质比例连接数量.']
  ]);
  define('TB-R21', 'table', 'low,high,discount', '同一进价还须与五折亏20元、八折赚40元分别对应.', [
    [0,1,'0.8*x-40-20','high,highRate,low,same,unknown','先由八折售价减40得进价，再减亏损20得五折售价.'],
    [0,2,'0.8*x-40','high,highRate,same,unknown','同一进价可由八折售价减40元利润表示.'],
    [1,1,'0.5*x+20+40','low,lowRate,high,same,unknown','先由五折售价加20得进价，再加40得八折售价.'],
    [1,2,'0.5*x+20','low,lowRate,same,unknown','同一进价可由五折售价加20元亏损表示.']
  ]);
  define('PEP-P038', 'main', 'first,second,same', '再用两组各自的总刷墙面积除以人数求每人面积.', [
    [0,2,'(10*x+40)/5+10','second,difference,same,unknown','第一组每人比第二组多刷10平方米.'],
    [1,2,'(8*x-50)/3-10','first,difference,same,unknown','第二组每人比第一组少刷10平方米.']
  ]);
  define('PEP-P041', 'bolts', 'workers', '再用生产螺栓和螺母的人数合计22人.', [
    [1,0,'(2*1200*x)/2000','rate,pair,unknown','按每栓配2母求所需螺母总数，再除以每人日产量.'],
    [0,2,'2000*(22-x)/2','workers,rate,pair,unknown','螺栓总数应是螺母总数的一半.','rate','再用螺栓工人数乘每人日产量.'],
    [1,2,'2*1200*x','rate,pair,unknown','螺母总数应为螺栓总数的2倍.','workers,rate','再用剩余工人数及每人螺母日产量.']
  ]);
  define('PEP-P041', 'nuts', 'workers', '再用生产螺栓和螺母的人数合计22人.', [
    [0,0,'2000*x/(2*1200)','rate,pair,unknown','先由螺母总数求配套螺栓数，再除以每人螺栓日产量.'],
    [0,2,'2000*x/2','rate,pair,unknown','螺栓总数应是螺母总数的一半.','workers,rate','再用剩余工人数及每人螺栓日产量.'],
    [1,2,'2*1200*(22-x)','workers,rate,pair,unknown','螺母总数应为螺栓总数的2倍.','rate','再用螺母工人数乘每人日产量.']
  ]);
  define('PEP-P042', 'main', 'single,first,second,equal', '再用各阶段人数、每人效率与时间相乘求完成量.', [
    [0,3,'1-(x+2)*(1/40)*8','whole,second,rate,unknown','第一阶段完成量等于全部减第二阶段完成量.'],
    [1,3,'1-x*(1/40)*4','whole,first,rate,unknown','第二阶段完成量等于全部减第一阶段完成量.']
  ]);
  define('PEP-P043', 'main', 'a-time,b-time,constant', '再按各自效率和同样的合作时间计算各自完成量.', [
    [0,2,'1-(1/24)*x','whole,b-rate,cooperate,unknown','甲完成量等于全部减乙完成量.'],
    [1,2,'1-(1/12)*x','whole,a-rate,cooperate,unknown','乙完成量等于全部减甲完成量.']
  ]);
  define('PEP-P047', 'main', 'gap,rates,base', '再用两类进价相差10元以及各自利润率连接进价和利润.', [
    [0,2,'(x+10)*20%','gap,rates,profit,base,unknown','两类利润相等，可用另一类利润表示.'],
    [1,0,'x*30%/20%','rates,profit,base,unknown','同样利润除以大袋利润率，得到大袋进价.','gap','再用大袋进价比小袋高10元.'],
    [1,2,'x*30%','rates,profit,base,unknown','两类利润相等，可用小袋利润表示大袋利润.']
  ]);
  define('PEP-P048', 'main', 'raise,discount', '再用进价乘加价倍数得到标价，再按标价打八折.', [
    [1,1,'144/(8/10)','sale,discount,fold','由实际售价144元除以八折对应的倍数还原标价.','raise','再用标价等于进价加进价的20%.'],
    [2,1,'144','sale','题目直接给出实际售价144元.']
  ]);
  define('PEP-P055', 'main', 'wood', '再用制作桌面和桌腿的木料合计12立方米.', [
    [1,0,'4*(20*x)/400','parts,topRate,legRate,unknown','先按每桌4腿求桌腿总数，再按每立方米产量求木料.'],
    [0,2,'400*(12-x)/4','wood,legRate,parts,unknown','桌面数量等于配套桌腿数量除以4.','topRate','再用桌面木料乘每立方米产量.'],
    [1,2,'4*(20*x)','parts,topRate,unknown','桌腿数量等于桌面数量乘4.','wood,legRate','再用剩余木料及每立方米桌腿产量.']
  ]);
  define('PEP-P063', 'main', 'percentage', '再用销量增长百分数x表示新销量倍数1+x/100.', [
    [1,1,'1/(1-20%)','sameRevenue,baseline,drop','收入不变，新销量倍数等于原收入倍数除以降价后的单价倍数.'],
    [1,2,'1*1','sameRevenue,baseline','收入不变，所以新收入倍数等于原收入倍数.','drop,percentage','再用降价后的单价倍数乘增长后的销量倍数.']
  ]);
  define('PEP-P074', 'main', 'total', '再用两种投资本金合计20000元.', [
    [0,2,'(20000-x)*3.6%','total,rateB,equal,unknown','两种收益相等，可用乙的收益表示甲的收益.','rateA','再用甲本金乘甲收益率.'],
    [1,0,'x*4.4%/3.6%','rateA,rateB,equal,unknown','同样收益除以乙收益率，得到乙本金.'],
    [1,2,'x*4.4%','rateA,equal,unknown','两种收益相等，可用甲的收益表示乙的收益.','total,rateB','再用剩余本金与乙收益率连接乙的收益.']
  ]);
  define('PEP-P080', 'main', 'oldYield,oldRate,yieldRise,pointsRise,areaDrop', '再用相应面积乘每单位面积产油量，连接两年总产油量.', [
    [0,4,'1350*(x-3)-3750','newOilPerArea,areaDrop,oilRise,unknown','去年总产油量等于今年总量减增加的3750.'],
    [1,0,'(960*x+3750)/1350','oldOilPerArea,newOilPerArea,oilRise,unknown','由去年总油量加增加量得今年总油量，再除以今年单位面积产油量.','areaDrop','再用今年面积比去年减少3.'],
    [1,4,'960*x+3750','oldOilPerArea,oilRise,unknown','今年总产油量等于去年总量加3750.']
  ]);

  // Travel: preserve starting point, clock, direction, and the route's unknown.
  define('L8-P2-Q1', 'liang-time', 'lead,ming-speed,liang-speed', '再用小明先走0.5小时及两人的速度连接相遇位置.', [
    [0,1,'15*x/5','liang-speed,ming-speed,same-origin,meet,unknown','同起点相遇时路程相同，由小亮路程除以小明速度求小明用时.'],
    [0,2,'15*x','liang-speed,same-origin,meet,unknown','同起点相遇，小明路程等于小亮路程.'],
    [1,2,'5*(x+0.5)','ming-speed,lead,same-origin,meet,unknown','同起点相遇，小亮路程等于小明路程.']
  ]);
  define('L8-P2-Q2', 'ming-time', 'lead,ming-speed,liang-speed', '再用小亮比小明少走0.5小时及两人的速度.', [
    [1,1,'5*x/15','ming-speed,liang-speed,same-origin,meet,unknown','由相同路程除以小亮速度求小亮用时.'],
    [0,2,'15*(x-0.5)','liang-speed,lead,same-origin,meet,unknown','同起点相遇，两人路程相同.'],
    [1,2,'5*x','ming-speed,same-origin,meet,unknown','同起点相遇，可用小明路程表示小亮路程.']
  ]);
  define('L8-P2-Q5', 'liang-time', 'ming-speed,liang-speed,lead', '再分别用速度乘实际时间计算路程.', [
    [0,2,'15*x/2','liang-speed,ratio,unknown','小亮路程为小明的2倍，可反求小明路程.'],
    [1,2,'2*5*(x+0.5)','ming-speed,lead,ratio,unknown','小亮路程是小明路程的2倍.']
  ]);
  define('L8-P2-V1', 'liang-speed', 'ming-speed,lead,liang-time', '再用小明先走时间及两人的实际运动时间计算路程.', [
    [0,2,'x*0.25','unknown,liang-time,meet','追上时两人路程相等，可用小亮速度乘其用时表示小明路程.'],
    [1,2,'5*(0.5+0.25)','ming-speed,lead,liang-time,meet','追上时可用小明已走路程表示小亮路程.']
  ]);
  define('L8-P2-V2', 'lead', 'ming-speed,liang-speed,elapsed', '再用小明多走x小时及两人实际运动时间.', [
    [0,1,'15*0.25/5','liang-speed,elapsed,ming-speed,meet','由小亮路程除以小明速度求小明总用时.'],
    [0,2,'15*0.25','liang-speed,elapsed,meet','追上时小明路程等于小亮路程.'],
    [1,2,'5*(x+0.25)','ming-speed,elapsed,meet,unknown','追上时小亮路程等于小明路程.']
  ]);
  define('L8-T2', 'grandpa-speed', 'ratio', '再用孙女速度是爷爷速度的5/3倍.', [
    [0,2,'(x*5/3)*5-400','unknown,ratio,time,lap,one-lap','爷爷路程等于孙女路程减多跑的一圈.','time','再用爷爷速度乘5分钟表示爷爷路程.'],
    [1,0,'(x*5+400)/5','unknown,time,lap,one-lap','先由爷爷路程加一圈求孙女路程，再除以相同时间.'],
    [1,2,'x*5+400','unknown,time,lap,one-lap','孙女比爷爷多跑一圈，所以孙女路程=爷爷路程+400米.','ratio,time','再用孙女速度倍数及5分钟求其路程.']
  ]);
  define('L8-H2', 'distance', 'ming-speed,li-speed,same-road', '再用相同路程分别除以两人的速度.', [
    [0,1,'x/4-0.25','unknown,li-speed,delay-hours,same-road','小明所用时间比小丽少15分钟.'],
    [1,1,'x/5+0.25','unknown,ming-speed,delay-hours,same-road','小丽所用时间比小明多15分钟.']
  ]);
  define('L8-H3', 'distance', 'up,down,same-path', '再用相同山路长度分别除以上山和下山速度.', [
    [0,1,'2-x/5','total-time,down,unknown','上山时间等于总时间减下山时间.'],
    [1,1,'2-x/3','total-time,up,unknown','下山时间等于总时间减上山时间.']
  ]);
  define('G10-05', 'time', 'aHours,bHours,lead', '再用两人速度和各自运动时间求路程.', [
    [0,2,'1-(1/12)*x','whole,bSpeed,meet,unknown','相向相遇，甲路程等于全程减乙路程.'],
    [1,2,'1-(1/18)*(8+x)','whole,aSpeed,lead,meet,unknown','相向相遇，乙路程等于全程减甲路程.']
  ]);
  define('G10-09', 'days', 'duck,goose,simultaneous', '再按两者速度乘相同时间计算路程.', [
    [0,2,'1-(1/9)*x','whole,gooseRate,meet,unknown','相遇时鸭的路程等于全程减鹅的路程.'],
    [1,2,'1-(1/7)*x','whole,duckRate,meet,unknown','相遇时鹅的路程等于全程减鸭的路程.']
  ]);
  define('S03', 'time', 'totalTime', '再用普通路和高速路的用时合计4小时.', [
    [0,2,'90*(4-x)/3','vHighway,totalTime,distanceRatio,unknown','高速路程是普通路程的3倍，由高速路程求普通路程.','vOrdinary','再用普通路速度乘所设普通路用时.'],
    [1,1,'3*50*x/90','distanceRatio,vOrdinary,vHighway,unknown','由普通路程求3倍的高速路程，再除以高速速度.'],
    [1,2,'3*50*x','distanceRatio,vOrdinary,unknown','高速路程等于普通路程的3倍.','vHighway,totalTime','再用高速速度乘剩余的高速用时.']
  ]);
  define('S03', 'distance', 'ordinaryPart,vOrdinary,vHighway,whole', '再按两段占全程的比例及各段速度计算时间.', [
    [0,2,'4-((1-1/4)*s)/90','totalTime,highwayPart,vHighway,unknown','普通路用时等于总时间减高速路用时.'],
    [1,2,'4-((1/4)*s)/50','totalTime,ordinaryPart,vOrdinary,unknown','高速路用时等于总时间减普通路用时.']
  ]);
  define('S10', 'hours', 'aStart,bStart,aSpeed,bSpeed,position', '再按各自起点加行进路程求位置.', [
    [0,3,'3+0.8*x-1','bStart,bSpeed,aStart,catch,position,unknown','追上时共有位置减甲的起点，就是甲行进路程.'],
    [0,4,'3+0.8*x','bStart,bSpeed,catch,position,unknown','追上时两者位置相同，可用乙的位置表示甲的位置.'],
    [1,3,'1+1.2*x-3','aStart,aSpeed,bStart,catch,position,unknown','追上时共有位置减乙的起点，就是乙行进路程.'],
    [1,4,'1+1.2*x','aStart,aSpeed,catch,position,unknown','追上时两者位置相同，可用甲的位置表示乙的位置.']
  ]);
  define('TB-I01', 'standard', 'time,rule', '再用速度乘0.5小时得到路程.', [
    [0,2,'150','distance','这段路程由题目直接给出为150千米.']
  ]);
  define('TB-I12', 'standard', 'before,after,same,rule', '再用同一路程分别除以提速前后的速度.', [
    [0,2,'x/300+0.5','after,saving,same,unknown','提速前比提速后多用0.5小时.'],
    [1,2,'x/240-0.5','before,saving,same,unknown','提速后比提速前少用0.5小时.']
  ]);
  define('TB-A18', 'sprint', 'totalTime', '再用普通跑和冲刺的时间合计30秒.', [
    [0,1,'(200-8*x)/6','distance,lastSpeed,firstSpeed,unknown','全程扣冲刺路程，再除以普通跑速度.'],
    [0,2,'200-8*x','distance,lastSpeed,unknown','普通跑路程等于全程减冲刺路程.','firstSpeed,totalTime','再用普通跑速度及剩余时间计算普通跑路程.'],
    [1,2,'200-6*(30-x)','distance,firstSpeed,totalTime,unknown','冲刺路程等于全程减普通跑路程.','lastSpeed','再用冲刺速度乘所设冲刺时间.']
  ]);
  define('TB-A29', 'time', 'aSpeed,ratio,simultaneous', '再用两车速度乘相同的相遇时间.', [
    [0,2,'160-60*x','distance,bSpeed,unknown','甲路程等于两地距离减乙路程.'],
    [1,2,'160-20*x','distance,aSpeed,unknown','乙路程等于两地距离减甲路程.']
  ]);
  define('TB-A30', 'both', 'departure,momSpeed,mingSpeed', '再用妈妈先出发15分钟以及各自速度计算路程.', [
    [0,1,'240*x/60','mingSpeed,momSpeed,beforeStation,unknown','若在候选时刻追上，同一路程除以妈妈速度得妈妈用时.'],
    [0,2,'240*x','mingSpeed,beforeStation,unknown','追上候选时刻两人路程相同.'],
    [1,2,'60*(x+15)','momSpeed,lead,beforeStation,unknown','追上候选时刻可用妈妈路程表示小明路程.']
  ]);
  define('TB-R08', 'table', 'time', '再用跑步和走路时间合计18分钟.', [
    [0,2,'2100-90*(18-x)','meters,walk,time,unknown','跑步路程等于总路程减走路路程.','run','再用跑步速度乘跑步时间.'],
    [1,1,'(2100-210*x)/90','meters,run,walk,unknown','全程扣掉跑步路程，再除以步行速度.'],
    [1,2,'2100-210*x','meters,run,unknown','走路路程等于总路程减跑步路程.','walk,time','再用走路速度与剩余的走路时间.']
  ]);
  define('TB-R16', 'table', 'aSpeed,bSpeed,sameTime', '再用两人速度乘相同的运动时间.', [
    [0,2,'6*x+8','bSpeed,gap,unknown','甲路程比乙路程多8.'],
    [1,2,'10*x-8','aSpeed,gap,unknown','乙路程比甲路程少8.']
  ]);
  define('PEP-P022', 'main', 'downTime,upTime,water,speedRule', '再由静水速度与水流速度求实际速度，乘相应时间求路程.', [
    [0,3,'2.5*(x-3)','upTime,water,speedRule,sameTrip,unknown','往返路程相同，可用逆流路程表示顺流路程.'],
    [1,3,'2*(x+3)','downTime,water,speedRule,sameTrip,unknown','往返路程相同，可用顺流路程表示逆流路程.']
  ]);
  define('PEP-P025', 'distance', 'near,far,kingTime,greenTime,waterTime,clock', '再用各区间路程与行驶时间的关系；两段速度应同为这辆匀速车的速度.', [
    [0,0,'((x+70)/(15-10))*(13-10)','far,toWaterTime,toGreenTime,uniform,unknown','先由到水站的路程和时间求车速，再求到绿站的路程.'],
    [0,2,'(x+70)/(15-10)','far,toWaterTime,uniform,unknown','匀速行驶，另一段的路程除以时间也是这辆车的速度.'],
    [1,0,'((x-50)/(13-10))*(15-10)','near,toGreenTime,toWaterTime,uniform,unknown','先由到绿站的路程和时间求车速，再求到水站的路程.'],
    [1,2,'(x-50)/(13-10)','near,toGreenTime,uniform,unknown','匀速行驶，可用到绿站的路程除以时间表示车速.']
  ]);
  define('PEP-P025', 'speed', 'near,far,kingTime,greenTime,waterTime,clock', '再用车站次序和各区间时间、距离连接同一条路线.', [
    [0,2,'(15-13)*x','betweenTime,uniform,unknown','绿站到水站的路程也可用这段时间乘车速.'],
    [1,2,'(15-10)*x-70-50','waterTime,kingTime,clock,far,near,order,uniform,unknown','王站到绿站的路程等于到水站的总路程减后两段.'],
    [2,2,'(15-10)*x-70','waterTime,kingTime,clock,far,order,uniform,unknown','王站到湖站的路程等于到水站的总路程减最后70.']
  ]);
  define('PEP-P035', 'main', 'gap,time', '再用甲比乙快20及两车都行驶半小时的关系.', [
    [0,0,'(84-x*(1/2))/(1/2)','distance,halfHour,unknown','扣去乙路程求甲路程，再除以半小时求甲速度.','gap','再用甲速度比乙速度快20.'],
    [0,2,'84-x*(1/2)','distance,halfHour,unknown','甲路程等于总路程减乙路程.'],
    [1,2,'84-(x+20)*(1/2)','distance,gap,halfHour,unknown','乙路程等于总路程减甲路程.']
  ]);
  define('PEP-P039', 'main', 'start,first,second,unit,motion', '再按相遇前后两次观察的路程和、时间连接同一个速度和.', [
    [0,2,'(x+9)/(9-8)','second,second-time,motion,unknown','两车速度不变，第一次的速度和可由第二次的路程和除以时间表示.'],
    [1,2,'(x-9)/(30/60)','first,first-time,motion,unknown','两车速度不变，第二次的速度和可由第一次的路程和除以时间表示.']
  ]);
  define('PEP-P040', 'main', 'tunnel,lamp,distance', '再用过路灯和穿隧道各自的路程除以所需时间.', [
    [0,2,'(x+300)/20','tunnel,distance,uniform,unknown','火车匀速，过路灯的速度也可由穿隧道的路程与时间计算.'],
    [1,2,'x/10','lamp,distance,uniform,unknown','火车匀速，穿隧道的速度也可由过路灯的路程与时间计算.'],
    [1,0,'(x/10)*20','lamp,tunnel,uniform,unknown','用过路灯求得的速度乘穿隧道时间求穿隧道路程.','tunnel,distance','再用隧道长加车长表示穿隧道路程.']
  ]);
  define('PEP-P062', 'main', 'meet,after,motion,sameRoad,hour', '再由相遇前后时间对应同段路程的关系，使用推导出的速度倍数.', [
    [0,2,'(24/6)*x*(24/60)-4.8','speedRatio,meetHours,difference,unknown','步行者相遇前路程等于骑车者相遇前路程减4.8.'],
    [1,2,'x*(24/60)+4.8','meetHours,difference,unknown','骑车者相遇前路程等于步行者路程加4.8.']
  ]);
  define('PEP-P075', 'main', 'li,liu,direction,continued', '再用两人速度乘这一次相遇间隔，分别计算路程.', [
    [0,2,'600-210*x','lap,liu,cycle,unknown','相邻两次相遇间两人合走一圈，李的路程等于一圈减刘的路程.'],
    [1,2,'600-190*x','lap,li,cycle,unknown','相邻两次相遇间刘的路程等于一圈减李的路程.']
  ]);

  // Geometry, patterns, points and single-range fees.
  define('G9-01', 'part', 'ratio', '再用每个角对应的比例份数乘同一份角度.', [
    [0,2,'180-3*x-5*x','angleSum,ratio,unknown','第一角等于内角和减其余两个角.'],
    [1,2,'180-2*x-5*x','angleSum,ratio,unknown','第二角等于内角和减其余两个角.'],
    [2,2,'180-2*x-3*x','angleSum,ratio,unknown','第三角等于内角和减其余两个角.']
  ]);
  define('G9-01', 'smallest', 'ratio', '再用三角的比例关系连接它们.', [
    [1,1,'180-x-(5/2)*x','angleSum,thirdRatio,unknown','第二角等于内角和减第一角和第三角.'],
    [2,1,'180-x-(3/2)*x','angleSum,secondRatio,unknown','第三角等于内角和减第一角和第二角.']
  ]);
  define('G9-03', 'growth', 'first,structure', '再用第一幅黑棋数和每次新增的黑棋数连接序号与总数.', [
    [1,2,'50-4','target,first','若恰有50颗黑棋，后续新增部分应是50减首幅4颗.'],
    [2,2,'50','target','本问要求的目标黑棋数是50；最后仍须检验序号是正整数.']
  ]);
  define('G9-06', 'bottom', 'top,height,formula', '再用两底和、高及梯形面积公式连接各量.', [
    [0,2,'120*2/8','area,formula,height','由面积公式反求两底和.','top','再用上底12加所设下底等于两底和.'],
    [0,4,'120','area','题目直接给出梯形面积120.']
  ]);
  define('G9-07', 'fish', 'first,shared', '再用后续小鱼条数乘每条新增火柴数.', [
    [1,2,'140-8','total,first','后续小鱼的用量等于总用量减首条鱼8根.']
  ]);
  define('G9-08', 'middle', 'gap', '再用连续奇数的相邻差都是2.', [
    [0,1,'15-x-(x+2)','sum,gap,unknown','前一个数等于三数之和减中间与后一个数.'],
    [2,1,'15-(x-2)-x','sum,gap,unknown','后一个数等于三数之和减前一个与中间数.']
  ]);
  define('G9-09', 'order', 'overlap', '再用n个相邻大菱形共有n−1处重叠.', [
    [1,0,'25-n','total,large,unknown','小菱形数等于总个数减大菱形数.']
  ]);
  define('G9-10', 'top', 'double', '再用每下一层灯数加倍连接第七层与其他层.', [
    [6,1,'381-x-2*x-4*x-8*x-16*x-32*x','total,unknown,double,factor3,factor4,factor5,factor6','第七层灯数等于总灯数减前六层灯数.']
  ]);
  define('TB-I03', 'standard', 'left,balance', '再用左盘两个同样小球的质量和砝码质量.', [
    [0,1,'5','rightMass,balance','天平平衡，左盘总质量等于右盘5克.']
  ]);
  define('TB-I04', 'standard', 'left,right', '再用两边实际的小球个数与砝码质量连接总质量.', [
    [0,1,'y+6','unknown,rightMass,balance','天平平衡，两盘总质量相等.'],
    [1,1,'3*y','left,balance,unknown','天平平衡，右盘总质量等于左盘3个小球的质量.']
  ]);
  define('TB-I05', 'standard', 'half,more', '再用先取一半、再加2的运算关系.', [
    [0,0,'5','result','题目直接给出“a的一半多2”这个数为5.']
  ]);
  define('TB-I07', 'standard', 'first,shared', '再用后添正方形个数乘每个新增的火柴数.', [
    [1,2,'100-4','total,first','后添部分的火柴数等于总数减首个正方形4根.']
  ]);
  define('TB-I08', 'standard', 'left,right', '再按每盘实际物体分别计算总质量.', [
    [0,0,'x+5-1','unknown,rightMass,left,balance','左盘小球质量等于右盘总质量减左盘砝码质量.'],
    [0,2,'x+5','unknown,rightMass,balance','天平平衡，左盘总质量等于右盘总质量.'],
    [1,2,'2*x+1','left,balance,unknown','天平平衡，右盘总质量等于左盘总质量.']
  ]);
  define('TB-I09', 'standard', 'games', '再用胜负场次合计12场.', [
    [1,1,'(20-2*x)/1','points,win,loss,unknown','扣去胜场得分，再按每负1场得1分求负场数.'],
    [1,2,'20-2*x','points,win,unknown','负场得分等于总积分减胜场得分.','loss,games','再用总场次及每负1场的分数.'],
    [0,2,'20-1*(12-x)','points,loss,games,unknown','胜场得分等于总积分减负场得分.','win','再用每胜1场2分连接胜场数与得分.']
  ]);
  define('TB-I10', 'standard', 'fraction', '再用另一部分是原数的七分之一.', [
    [1,0,'19-x','sum,unknown','另一部分等于总和减原数.']
  ]);
  define('TB-I16', 'standard', 'ratio', '再用长是宽的2倍.', [
    [1,0,'(24-2*x)/2','perimeter,sides,unknown','周长扣去两条宽，再平均分给两条长.'],
    [0,2,'24-2*(2*x)','perimeter,sides,ratio,unknown','两条宽的总长等于周长减两条长的总长.','sides','再用宽乘2得到两条宽的总长.'],
    [1,2,'24-2*x','perimeter,sides,unknown','两条长的总长等于周长减两条宽的总长.','ratio,sides','再用长宽倍数和两条长的条数.']
  ]);
  define('TB-I20', 'standard', 'extra', '再用超起步段里程乘每千米2元.', [
    [1,2,'16-8','paid,base','超程费用等于实付总额减起步费.']
  ]);
  define('TB-A03', 'input', 'subtract,multiply,add', '再用原计算程序各步的输入输出关系连接这些数.', [
    [0,2,'(25-1)/4','output,add,multiply','先撤销最后加1，再撤销乘4，得到第一步输出.'],
    [1,0,'(25-1)/4','output,add,multiply','第二步输入就是由后两步倒推得到的第一步输出.'],
    [1,2,'25-1','output,add','第二步输出等于最终25减最后加的1.'],
    [2,0,'25-1','output,add','最后一步的输入等于25减1.'],
    [2,2,'25','output','题目给出的最终输出是25.']
  ]);
  define('TB-A34', 'water', 'tier2', '再用超过180立方米的水量乘第二档单价.', [
    [1,2,'960-180*3','fee,tier1','第二档费用等于全年总费用减第一档费用.']
  ]);
  define('TB-R11', 'table', 'difference', '再用窗高比窗宽多0.6米.', [
    [1,0,'(7.2-3*x)/2','total,figure,unknown','总木条长扣去3条横宽，再平均分给2条竖高.'],
    [1,2,'7.2-3*x','total,figure,unknown','竖向总长等于全部木条长减横向总长.','difference,figure','再用窗高与窗宽的差及竖向有2条木条.'],
    [0,2,'7.2-2*(x+0.6)','total,figure,difference,unknown','横向总长等于全部木条长减竖向总长.','figure','再用3条相同的横宽计算横向总长.']
  ]);
  define('TB-R17', 'table', 'first,join', '再用后来加的桌子张数乘每张新增座位数.', [
    [1,2,'40-6','target,first','后来增加的座位等于总座位减首张桌的6个座位.']
  ]);
  define('TB-R18', 'table', 'relation', '再用另一个锐角比基准锐角的3倍小10度.', [
    [1,0,'90-x','acuteSum,unknown','另一个锐角等于两个锐角之和减基准锐角.']
  ]);
  define('PEP-P012', 'main', 'place,unitDigit', '再用十进制位值以及交换前后各数位的数字.', [
    [0,3,'10*1+x+18','place,unitDigit,unknown,swap','原数比交换后的数大18.'],
    [1,3,'10*x+1-18','place,unitDigit,unknown,swap','交换后的数比原数小18.']
  ]);
  define('PEP-P014', 'main', 'sequence,law', '再用数列相邻项的倍数关系.', [
    [1,1,'-1701-x-(-3)*(-3)*x','sum,ratio,twiceRatio,unknown','第二项等于三项和减第一项和第三项.'],
    [2,1,'-1701-x-(-3)*x','sum,ratio,unknown','第三项等于三项和减前两项.']
  ]);
  define('PEP-P023', 'main', 'length,shorter,wider,formula', '再按两种状态各自的长乘宽计算面积.', [
    [0,2,'(6-2)*(x+2)','newLength,wider,formula,area,unknown','两种状态面积相等，可由改变后的长宽表示原面积.'],
    [1,2,'6*x','length,formula,area,unknown','两种状态面积相等，可由原长宽表示改变后的面积.'],
    [1,1,'6*x/(6-2)','length,newLength,formula,area,unknown','面积不变，原面积除以新长得到新宽.','wider','再用新宽比原宽多2厘米.']
  ]);
  define('PEP-P031', 'main', 'digitRule', '再用十位数字是个位数字的3倍加1.', [
    [1,0,'9-x','digitSum,unknown','十位数字等于两位数字之和减个位数字.'],
    [1,2,'10*(9-x)','digitSum,place,unknown','先由数字和求十位数字，再乘十位的位值10.'],
    [2,2,'10*(9-x)+x','digitSum,place,unknown','用数字和求出的十位数字构成整个两位数.']
  ]);
  define('PEP-P037', 'main', 'week', '再用同列相邻两行日期相差7.', [
    [0,0,'30-x-(x+7)','sum,week,unknown','上一行日期等于三日期之和减中间与下一行日期.'],
    [2,0,'30-(x-7)-x','sum,week,unknown','下一行日期等于三日期之和减上一行与中间日期.']
  ]);
  define('PEP-P049', 'main', 'same-rule,integer,team-0', '再用每胜、负一场的积分及两类场次合计14场.', [
    [0,2,'(14/14)*(14-x)','loss-point,team-0,equal-score,unknown','在本问讨论的等积分情形中，可用负场得分表示胜场得分.'],
    [1,2,'((24-4*(14/14))/10)*x','win-point,equal-score,unknown','在本问讨论的等积分情形中，可用胜场得分表示负场得分.']
  ]);
  define('PEP-P060', 'main', 'uniform,t0,t5', '再用实验推导的每分钟升温量乘时间，并加初始温度.', [
    [1,3,'34-10','target,t0','第二问的升温量等于目标温度减初始温度.'],
    [1,4,'34','target','第二问目标温度由题目给出为34℃.']
  ]);
  define('PEP-P078', 'main', 'rules,a,b', '再按原比赛规则推导出的答对、答错分值计算各自总分.', [
    [0,2,'76-(-1)*(20-x)','fScore,wrongScore,rules,unknown','F答对得分等于总分减答错计分.'],
    [0,3,'76-5*x','fScore,correctScore,unknown','F答错计分等于总分减答对得分.'],
    [0,4,'76','fScore','F的实际总分由题目直接给出.'],
    [1,2,'80-(-1)*(20-y)','gScore,wrongScore,rules,unknown','在G声称得80分的候选情形下，答对得分等于总分减答错计分.'],
    [1,3,'80-5*y','gScore,correctScore,unknown','在G声称得80分的候选情形下，答错计分等于总分减答对得分.'],
    [1,4,'80','gScore','这是G声称的总分；仍须在检验中判断整数题数是否可能.']
  ]);
  define('S05', 'months', 'total,firstTier,secondTier', '在已选定的两个月收费档次内，再用总电量和各档单价连接电量与费用.', [
    [2,2,'290-0.5*x-0.5*200','fee,firstTier,unknown','六月第二档费用等于两月总费用减五月费用及六月第一档费用.'],
    [2,1,'(290-0.5*x-0.5*200)/0.7','fee,firstTier,secondTier,unknown','由总费用扣除其余段费用，再按第二档单价求本段电量.','total','再用两个月总电量500度.']
  ]);
  define('S09', 'months', 'total,firstTier,secondTier,thirdTier', '在已选定的第一档/第三档组合内，再用总电量和各档单价连接电量与费用.', [
    [3,2,'575-0.5*x-0.5*200-0.7*(450-200)','fee,firstTier,secondTier,unknown','六月第三档费用等于总费用减其他三个收费段的费用.'],
    [3,1,'(575-0.5*x-0.5*200-0.7*(450-200))/1','fee,firstTier,secondTier,thirdTier,unknown','先扣除其他段费用，再按第三档每度1元求电量.','total','再用两个月电量合计800度.']
  ]);

  const clone = alternative => ({ ...alternative, sources: [...alternative.sources], closureSources: [...alternative.closureSources] });
  function options(problem, route, rowIndex, cellIndex) {
    if (!problem || !route || !Number.isInteger(rowIndex) || !Number.isInteger(cellIndex)) return [];
    const cell = route.table?.rows?.[rowIndex]?.cells?.[cellIndex];
    if (!cell || cell.given || cell.note != null) return [];
    return (index.get([problem.id, route.id, rowIndex, cellIndex].join('/')) || []).map(clone);
  }
  function entries() {
    return records.map(({ alternative, ...target }) => ({ ...target, ...clone(alternative) }));
  }
  const api = Object.freeze({ options, entries });
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RatioWordProblemTableAlternatives = api;
})(typeof window === 'undefined' ? globalThis : window);
