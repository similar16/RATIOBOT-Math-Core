/* Optional observations. Slider values are experiments, never additional problem givens. */
(function(root){
'use strict';
const mounted=new WeakMap();let serial=0;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=n=>String(Math.round(n*10000)/10000);
function math(expr,calculation=false){const E=root.RatioWordProblemEngine;const tex=calculation?E?.formatCalculation(expr):E?.format(expr);try{return root.katex.renderToString(tex||String(expr),{throwOnError:false,output:'html'});}catch{return esc(expr);}}
const equation=(expr,result)=>math(expr,true)+' = '+math(clean(result));
const note=text=>'<p class="wp-observe-note" style="font-size:.9em;line-height:1.7;color:var(--muted,#666)">'+esc(text)+'</p>';
const line=(x1,y1,x2,y2,color='#35B8C8',width=3)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
const text=(x,y,value,anchor='start',color='#3E3540')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="17">${esc(value)}</text>`;
function svg(body,title,description,height=220){const id='wp-observe-svg-'+(++serial);return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 ${height}" role="img" aria-labelledby="${id}" style="display:block;width:100%;height:auto;font-family:inherit"><title id="${id}">${esc(title)}</title><desc>${esc(description)}</desc>${body}</svg>`;}
function range(host,label,max,step,initial,render,min=0){
 const id='wp-observe-range-'+(++serial);
 host.innerHTML=`<section class="wp-observe" style="padding:12px 0"><label for="${id}" style="display:block;font-weight:700">${esc(label)}</label><div style="display:flex;align-items:center;gap:12px;margin:12px 0"><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${initial}" style="flex:1;min-width:100px;accent-color:var(--ink,#35B8C8)"><output for="${id}" style="min-width:5em"></output></div><div class="wp-observe-drawing"></div></section>`;
 const input=host.querySelector('input'),output=host.querySelector('output'),drawing=host.querySelector('.wp-observe-drawing');
 const refresh=()=>render(Number(input.value),drawing,output);
 input.addEventListener('input',refresh);mounted.set(host,()=>input.removeEventListener('input',refresh));refresh();
}
function age(host,p){
 if(p.id!=='L7-P3'){
  host.innerHTML=note('年龄条只表示关系，不按实际年龄比例绘制.相同的经过年数，要同时加到两个人的年龄上.')+svg(
   text(20,38,'小丽：今年 x 岁')+text(20,82,'爸爸：今年 3x 岁')+
   `<rect x="235" y="16" width="100" height="26" rx="6" fill="#CDEFF1"/><rect x="335" y="16" width="60" height="26" rx="6" fill="#F7D56B"/>`+
   `<rect x="235" y="60" width="270" height="26" rx="6" fill="#CDEFF1"/><rect x="505" y="60" width="60" height="26" rx="6" fill="#F7D56B"/>`+
   text(240,120,'黄色部分：两人都再过5年'),'年龄前后变化','两个人的现在年龄分别为x和3x，经过相同的5年.',150);
  return;
 }
 range(host,'试取经过年数 t（观察值，不是新增条件）',10,1,0,(t,d,o)=>{
  o.textContent=t+' 年';const a=13+t,b=45+t,scale=8;
  d.innerHTML=svg(text(20,43,'小明')+text(20,107,'王老师')+
   `<rect x="112" y="22" width="${13*scale}" height="28" rx="6" fill="#CDEFF1"/><rect x="${112+13*scale}" y="22" width="${t*scale}" height="28" fill="#F7D56B"/>`+
   `<rect x="112" y="86" width="${45*scale}" height="28" rx="6" fill="#CDEFF1"/><rect x="${112+45*scale}" y="86" width="${t*scale}" height="28" fill="#F7D56B"/>`+
   text(112,150,'蓝色：今年年龄　黄色：共同经过的年数'),'同一时间的年龄','小明今年13岁，王老师今年45岁；两人的年龄增加相同的观察年数.',180)+
   '<p>小明将来年龄：'+equation('13+'+t,a)+' 岁</p><p>王老师将来年龄：'+equation('45+'+t,b)+' 岁</p>'+note('倍数关系应连接同一将来时刻的两个年龄.');
 });
}
function conceptualChase(host,p){
 const mountain=p.id==='S10',names=mountain?['甲队','乙队']:['小明先出发','小亮后出发'];
 host.innerHTML=note('方向示意，不按路程或时间比例绘制.先从题目确定各自的起点、速度与已行时间.')+svg(
  text(20,45,names[0])+line(170,40,580,40)+text(590,46,'→')+text(20,110,names[1])+line(170,105,580,105,'#F0645D')+text(590,111,'→'),
  '同向运动的条件示意','两者沿同一方向运动.未知的速度、先行时间或位置须由题目关系确定.',150)+note(mountain?'起点不同，追上时比较的是“起点位置＋行进路程”.':'从后出发者开始计时，先出发者的已行时间还要加上先行时间.');
}
function chase(host,p){
 if(!/^L8-P2-Q[1-5]$/.test(p.id)){conceptualChase(host,p);return;}
 range(host,'从小亮出发计时 t（试取观察值）',1,.01,0,(t,d,o)=>{
  o.textContent=clean(t)+' 小时';const a=5*(t+.5),b=15*t,scale=32,start=90;
  const front=Math.abs(a-b)<1e-9?'两人在同一位置':a>b?'小明在前':'小亮在前';
  d.innerHTML=svg(line(start,152,606,152)+text(start,181,'共同起点', 'middle')+text(612,157,'→')+
   line(start+scale*a,62,start+scale*a,152,'#F0645D',1)+line(start+scale*b,110,start+scale*b,152,'#35B8C8',1)+
   `<circle cx="${start+scale*a}" cy="62" r="9" fill="#F0645D"/><circle cx="${start+scale*b}" cy="110" r="9" fill="#35B8C8"/>`+
   text(12,68,'小明')+text(12,116,'小亮')+text(320,215,front,'middle'),
   '追及位置观察','从小亮出发计时.小明已行时间为t加0.5小时，小亮为t小时；比较两人离共同起点的距离.',235)+
   '<p>小明的位置：'+equation('5*('+clean(t)+'+0.5)',a)+' 千米</p><p>小亮的位置：'+equation('15*'+clean(t),b)+' 千米</p>'+note('观察约定：追上后仍按原速度沿同一路线前进，路线足够长.记录谁在前，再回到表格选择“相等”或“相差”的关系.');
 });
}
function chess(host){
 let reveal=false;
 range(host,'选择观察的图案序号 n',18,1,1,(n,d,o)=>{
  o.textContent='第 '+n+' 幅';const side=n+1,step=Math.min(42,204/n),left=(640-n*step)/2,top=25,r=Math.min(12,step*.27);
  let body='';for(let row=0;row<side;row++)for(let col=0;col<side;col++){
   const black=row===0||col===0||row===col,x=left+col*step,y=top+row*step;
   body+=`<circle data-wp-row="${row}" data-wp-col="${col}" data-wp-color="${black?'black':'white'}" cx="${x}" cy="${y}" r="${r}" fill="${black?'#3E3540':'#FFFFFF'}" stroke="#3E3540" stroke-width="1.5"/>`;
   if(reveal&&row===0&&col===0)body+=`<circle cx="${x}" cy="${y}" r="${r+5}" fill="none" stroke="#F6C34A" stroke-width="3"/>`;
  }
  const black=3*side-2,total=side*side,white=total-black;
  body+=text(320,top+n*step+36,'首行、首列、主对角线是黑棋','middle');
  d.innerHTML=note('按原图结构重绘：每边 n＋1 颗，首行、首列、主对角线为黑棋，其余为白棋.')+svg(body,'首行首列及主对角线黑棋方阵','黑棋分布在方阵首行、首列、主对角线.左上角同一颗属于这三条线，分条计数时多算了两次.',top+n*step+55)+
   '<button type="button" class="ghost wp-observe-count">'+(reveal?'隐藏计数依据':'显示计数依据')+'</button>'+(reveal?
    '<p>首行、首列、主对角线各数一遍，左上角同一颗被数了3次，应只计1次，所以扣除多算的3−1＝2次.</p><p>黑棋：'+equation('3*('+n+'+1)-2',black)+'</p><p>全部棋子：'+equation('('+n+'+1)*('+n+'+1)',total)+'</p><p>白棋＝全部－黑棋：'+equation('('+n+'+1)*('+n+'+1)-(3*('+n+'+1)-2)',white)+'</p>':'');
  d.querySelector('button').onclick=()=>{reveal=!reveal;host.querySelector('input').dispatchEvent(new Event('input'));};
 },1);
}
function fish(host){
 range(host,'选择观察的小鱼条数 n（观察值）',4,1,1,(n,d,o)=>{
  o.textContent=n+' 条';
  d.innerHTML=note('对照原题中的透明配图：第一条用8根；后加一条仍有8条边，其中2根与已有图形共用.共用的火柴只计一次.')+
   '<p>每次新添：'+equation('8-2',6)+' 根</p><p>后续小鱼条数：'+equation(n+'-1',n-1)+' 条</p><p>总根数：'+equation('8+('+n+'-1)*(8-2)',8+(n-1)*6)+' 根</p>';
 },1);
}
function rhombi(host){
 range(host,'选择观察的大菱形个数 n',6,1,1,(n,d,o)=>{
  o.textContent=n+' 个';let body='';
  for(let i=0;i<n;i++){const x=70+i*90;body+=`<polygon points="${x-60},75 ${x},35 ${x+60},75 ${x},115" fill="#CDEFF1" fill-opacity=".4" stroke="#35B8C8" stroke-width="2"/>`;if(i>0){const middle=x-45;body+=`<polygon points="${middle-15},75 ${middle},65 ${middle+15},75 ${middle},85" fill="#F7D56B" stroke="#F6C34A" stroke-width="2"/>`;}}
  d.innerHTML=note('按题目的叠放关系重绘.每对相邻的大菱形形成1个小菱形；黄色标出相邻重叠处.')+svg(body,'相邻重叠菱形','一列n个大菱形有n减1处相邻重叠，每处形成一个小菱形.',145)+
   '<p>相邻重叠处：'+equation(n+'-1',n-1)+'</p><p>大小菱形总数：'+equation(n+'+('+n+'-1)',2*n-1)+'</p>';
 },1);
}
function tiers(host){
 range(host,'试取一个月的电量 q（观察值）',800,1,0,(q,d,o)=>{
  o.textContent=q+' 度';const first=Math.min(q,200),second=Math.max(0,Math.min(q,450)-200),third=Math.max(0,q-450);
  const e1=String(first),e2=q<=200?'0':q<=450?q+'-200':'450-200',e3=q<=450?'0':q+'-450';
  const cost=.5*first+.7*second+third,start=35,scale=.7;
  const body=`<rect x="${start}" y="55" width="${200*scale}" height="30" fill="#CDEFF1"/><rect x="${start+200*scale}" y="55" width="${(450-200)*scale}" height="30" fill="#F7D56B"/><rect x="${start+450*scale}" y="55" width="${(800-450)*scale}" height="30" fill="#FFE0DC"/>`+
   [0,200,450].map(v=>line(start+v*scale,50,start+v*scale,92,'#3E3540',1)+text(start+v*scale,117,v+'度','middle')).join('')+
   line(start+q*scale,25,start+q*scale,89,'#3E3540',3)+text(start+q*scale,18,'q='+q,'middle');
  d.innerHTML=note('这里观察单月怎样分段计费.两个月的电量分配仍需回到数量表分析.观察尺最多显示800度.')+svg(body,'阶梯电量分段观察','前200度按0.5元计费，超过200度到450度的部分按0.7元计费，超过450度的部分按1元计费.',140)+
   '<div style="overflow-x:auto"><table style="width:100%;text-align:left;border-collapse:collapse"><thead><tr><th>收费段</th><th>这一段的电量</th><th>这一段费用</th></tr></thead><tbody>'+[
    ['前200度',e1,first,'0.5'],['超过200至450度',e2,second,'0.7'],['超过450度',e3,third,'1']
   ].map(([name,e,used,price])=>'<tr><th scope="row" style="padding:9px 0">'+name+'</th><td>'+equation(e,used)+(used===0?'（未进入）':'')+'</td><td>'+equation(price+'*('+e+')',Number(price)*used)+' 元</td></tr>').join('')+
   '</tbody></table></div><p>合计费用：'+equation('0.5*('+e1+')+0.7*('+e2+')+1*('+e3+')',cost)+' 元</p>'+note('第二档的完整长度来自450−200，不能把450当成第二档的计费电量.');
 });
}
function work(host,p){
 const pipe=p.id==='G10-08',first=pipe?'甲乙合作2天':'甲先做8小时',next=pipe?'乙接着独做':'甲乙接着合作';
 host.innerHTML=note('阶段示意，不按时间或工作量比例绘制.先分清每个阶段是谁在做，再用该阶段的效率乘时间.')+svg(
  `<rect x="25" y="30" width="275" height="65" rx="12" fill="#CDEFF1"/><rect x="340" y="30" width="275" height="65" rx="12" fill="#F7D56B"/>`+
  text(162,69,first,'middle')+text(320,70,'→','middle')+text(477,69,next,'middle')+text(320,145,'前段完成量 ＋ 后段完成量 ＝ 整项任务','middle'),
  '按阶段组织工作量','先后两个阶段的工作量可以相加；同时工作的两个人，其工作时间不能当成总工期相加.',175)+note('若选择把整项任务记为1，要先说明这个1的含义，再由“全部任务÷单独完成时间”推导效率.');
}
function destroy(host){mounted.get(host)?.();mounted.delete(host);host?.replaceChildren();}
function mount(host,problem,route){
 if(!host)return()=>{};destroy(host);
 const renderers={age,chase,chess,fish,rhombi,tiers,work};
 if(renderers[problem?.diagram])renderers[problem.diagram](host,problem,route);
 return()=>destroy(host);
}
// The travel panel is dynamic only. Unconfirmed table entries remain hidden.
function travelMarkup(problem,route,context={}){
 const {step=0,tablePassed=false,values={},derived={}}=context,model=travelModel(problem,0,{...context,route});if(!model)return '';
 const rows=(route.table?.rows||[]).map((r,i)=>({...r,index:i})).filter(r=>!/^总|^合计|^全程/.test(r.label)).slice(0,4);
 const cols=(route.table?.headers||[]).map((h,i)=>({label:h,index:i-1})).filter(c=>c.index>=0&&/速度|时间|用时|路程|距离/.test(c.label));
 const quantities=step>0&&cols.length?'<div class="wp-travel-quantities">'+rows.map(r=>'<section><h5>'+esc(r.label)+'</h5>'+cols.map(c=>{const cell=r.cells[c.index];if(!cell)return '';const value=cell.note!=null?esc(cell.note):cell.given&&cell.sources.every(id=>id==='unknown'||problem.facts.some(f=>f.id===id)||derived[id])?math(cell.expr):tablePassed&&values['t:'+r.index+':'+c.index]?math(values['t:'+r.index+':'+c.index]):'<span class="wp-travel-blank">待表示</span>';return '<p><span>'+esc(c.label)+'</span><b>'+value+'</b></p>';}).join('')+'</section>').join('')+'</div>':'';
 return '<details class="wp-travel-diagram" data-wp-travel-diagram open><summary>行程运动演示</summary><p class="wp-motion-mode" data-motion-mode></p><div class="wp-travel-drawing" tabindex="0" role="region" aria-label="行程动态演示，可横向滚动">'+motionPicture(model,0)+'</div>'+quantities+'</details>';
}
function confirmedMotionResult(route,context){
 const E=root.RatioWordProblemEngine;
 return !!(E&&context.answersChecked&&context.answerPassed&&route?.answers?.length&&route.answers.every((a,i)=>{try{return E.equivalent(context.values?.['a:'+i]||'',a.expr,route.variable);}catch{return false;}}));
}
// Each number attached to a moving point is either an original given, a confirmed
// derivation, or a result unlocked only after the actual answer grader succeeds.
function travelScene(problem){
 const id=problem.id,km='千米/小时',mpm='米/分钟';
 const defaults={start:'A地',end:'B地',unit:'小时',speedUnit:km,speeds:[],known:[],actor:'行进者'};
 const scenes={
  'C21-05':{start:'甲地',end:'乙地',actor:'某人',speeds:[],partial:true,timeKnown:false},
  'C21-09':{clock:'从慢车出发计时',speeds:[60,100],known:[true,true]},
  'C21-10':{start:'共同起点',end:'环形跑道',unit:'分钟',speedUnit:mpm,speeds:[120,200],known:['grandpa-speed','red-speed']},
  'C21-11':{start:'甲城',end:'乙城',actor:'汽车',speeds:[100,80],known:[true,true],rest:'在乙城休息30分钟，不行驶'},
  'L8-T2':{start:'共同起点',end:'环形步道',unit:'分钟',speedUnit:mpm,speeds:[120,200]},
  'L8-H2':{start:'甲村',end:'乙村',speeds:[5,4],known:[true,true]},
  'L8-H3':{start:'山脚',end:'山顶',actor:'登山者',speeds:[3,5],known:[true,true]},
  'G10-05':{clock:'从甲车出发计时',speeds:['每小时走全程的1/18','每小时走全程的1/12'],known:['aSpeed','bSpeed'],normalized:true},
  'G10-09':{start:'南海',end:'北海',unit:'天',speeds:['每天走全程的1/7','每天走全程的1/9'],known:['duckRate','gooseRate'],normalized:true},
  'S03':{actor:'汽车',speeds:[50,90],known:[true,true]},
  'S10':{start:'大本营',end:'向山峰继续前进',speeds:[1.2,.8],known:[true,true],openEnd:true},
  'PEP-P039':{speeds:[],partial:true},
  'PEP-P040':{start:'隧道前方',end:'隧道后方',actor:'火车',unit:'秒',speedUnit:'米/秒',speeds:[30]},
  'PEP-P022':{start:'甲码头',end:'乙码头',actor:'船',speeds:[30,24]},
  'PEP-P025':{start:'王家庄',end:'绿水',actor:'汽车',speeds:[60]},
  'PEP-P035':{speeds:[94,74]},
  'PEP-P062':{speeds:[16,4]},
  'PEP-P075':{start:'共同起点',end:'环形跑道',unit:'分钟',speedUnit:mpm,speeds:[190,210],known:[true,true]},
  'TB-A18':{start:'200米跑道起点',end:'200米终点',actor:'小强',unit:'秒',speedUnit:'米/秒',speeds:[6,8],known:[true,true]},
  'TB-A29':{speeds:[20,60],known:[true,'bSpeed']},
  'TB-A30':{start:'家',end:'火车站',unit:'分钟',clock:'从7:30妈妈出发计时',speedUnit:mpm,speeds:[60,240],known:[true,true]},
  'TB-I01':{start:'出发地',end:'150千米处',speeds:[300]},
  'TB-I12':{start:'出发城市',end:'目的城市',speeds:[240,300],known:[true,true]},
  'TB-R08':{start:'晨练起点',end:'晨练终点',actor:'小明',unit:'分钟',speedUnit:mpm,speeds:[210,90],known:[true,true]},
  'TB-R16':{speeds:[10,6],known:[true,true]}
 };
 if(/^L8-P2-/.test(id))return {...defaults,clock:'从小明出发计时',start:'学校',end:'沿同一路线前进',speeds:[5,15],known:[true,id!=='L8-P2-V1'],openEnd:true};
 return {...defaults,...scenes[id]};
}
/* Authored kinematics; internal coordinates are deliberately not answer labels. */
const motionColors=['var(--wp-teal,#35B8C8)','var(--wp-coral,#F0645D)','var(--wp-ink,#3E3540)'];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function travelModel(problem,variant=0,context={}){
 const id=problem.id,events=[],actors=[],scene=travelScene(problem),solved=confirmedMotionResult(context.route,context);let phases=[];
 let duration=1,length=1,circle=false,noteText='',alternatives=[],landmarks=[],train=false;
 const event=(t,label)=>events.push({t,label});
 const actor=(name,position,start=0,finish=Infinity)=>actors.push({name,position,start,finish});
 const linear=(name,start,origin,speed,end=Infinity)=>actor(name,t=>origin+speed*Math.max(0,Math.min(t,end)-start),start,end);
 const meet=(L,a,b,delay=0,names=['甲','乙'])=>{length=L;duration=(L+b*delay)/(a+b);linear(names[0],0,0,a);linear(names[1],delay,L,-b);event(0,delay?'先出发者出发':'两者同时出发');if(delay)event(delay,'后出发者出发');event(duration,'两者相遇');};
 const stages=(labels,distances,times,returning=false,rest=0)=>{
  let total=0,pos=0;const parts=[];length=returning?distances[0]:distances.reduce((a,b)=>a+b,0);
  labels.forEach((label,i)=>{const next=pos+distances[i]*(returning&&i>0?-1:1);parts.push({a:total,b:total+times[i],from:pos,to:next,label});event(total,label);total+=times[i];pos=next;if(rest&&i===0){parts.push({a:total,b:total+rest,from:pos,to:pos,label:'休息'});event(total,scene.rest||'在'+scene.end+'休息');total+=rest;}});
  phases=parts;duration=total;actor(scene.actor,t=>{const p=parts.find(p=>t<=p.b)||parts.at(-1);return p.from+(p.to-p.from)*clamp((t-p.a)/(p.b-p.a));},0,total);event(total,returning?'返回'+scene.start:'到达'+scene.end);
  landmarks=returning?[]:parts.slice(1).map(p=>({pos:p.from,label:p.label+'开始'}));
 };
 if(id==='C21-09')meet(500,60,100,1/3,['慢车','快车']);
 else if(id==='TB-A29')meet(160,20,60);
 else if(id==='PEP-P035')meet(84,94,74,0,['甲车','乙车']);
 else if(id==='G10-09')meet(1,1/7,1/9,0,['野鸭','大雁']);
 else if(id==='G10-05')meet(1,1/18,1/12,8,['甲车','乙车']);
 else if(id==='PEP-P062'){meet(8,16,4,0,['李明（骑车）','刘伟（步行）']);actors.length=0;linear('李明（骑车）',0,0,16,.5);linear('刘伟（步行）',0,8,-4,2);duration=2;event(.5,'李明到达B地后停止');event(2,'刘伟到达A地');}
 else if(id==='PEP-P039'){length=27;duration=1;linear('李明',0,0,18);linear('刘伟',0,27,-18);event(0,'8时：同时出发');event(.5,'8时半：相遇前相距9千米');event(.75,'两人相遇');event(1,'9时：相遇后再次相距9千米');noteText='原题只确定速度和；图中采用等速示意，不表示两人的实际速度相等.';}
 else if(/^L8-P2-/.test(id)){
  let delay=.5;if(id==='L8-P2-V3'){alternatives=['观察时小明在前','观察时小亮在前'];delay=variant===1?.3:.7;}
  const catchTime=1.5*delay;
  duration=/Q[12]$|V[12]$/.test(id)?catchTime:id.endsWith('Q3')||id.endsWith('Q5')?1.5:id.endsWith('V3')?Math.max(catchTime,delay+.25):1.2;
  length=15*(duration-delay)*1.08;linear('小明（步行）',0,0,5);linear('小亮（骑车）',delay,0,15);
  event(0,'小明先出发');event(delay,'小亮后出发');event(catchTime,'小亮追上小明');
  if(id.endsWith('Q4')){event(.65,'追上前相距1千米');event(.85,'追上后相距1千米');}
  if(id.endsWith('V3'))event(delay+.25,'小亮出发0.25小时，两人相距1千米');
  if(id.endsWith('Q3'))event(1.5,'小亮出发1小时');if(id.endsWith('Q5'))event(1.5,'比较两人从学校出发后的路程');
 }
 else if(id==='TB-A30'){alternatives=['车站距家1800米','车站距家960米'];length=variant===1?960:1800;duration=variant===1?19:20;linear('妈妈',0,0,60,length/60);linear('小明',15,0,240,15+length/240);event(0,'妈妈先出发');event(15,'小明出发送手机');if(variant===1){event(16,'妈妈先到站');event(19,'小明到站，未在途中追上');}else event(20,'到站前追上妈妈');}
 else if(id==='S10'){length=8;duration=5;linear('甲队',0,1,1.2);linear('乙队',0,3,.8);event(0,'从不同营地同时出发');event(5,'甲在途中追上乙');landmarks=[{pos:1,label:'一号营地'},{pos:3,label:'二号营地'}];}
 else if(id==='TB-R16'||id==='L8-H2'){
  const h=id==='L8-H2';length=h?5:20;duration=h?1.25:2;linear(h?'小明':'甲（骑车）',0,0,h?5:10,h?1:2);linear(h?'小丽':'乙（步行）',0,0,h?4:6,h?1.25:Infinity);event(0,'同时出发');event(h?1:2,h?'小明先到达':'甲到达，乙还在途中');if(h)event(1.25,'小丽到达');
 }
 else if(id==='TB-I12'){length=600;duration=2.5;linear('提速前',0,0,240,2.5);linear('提速后',0,0,300,2);event(0,'对齐各自出发时刻');event(2,'提速后先到达');event(2.5,'提速前到达');noteText='两种方案按经过时间对照，不表示两次行程同时发生.';}
 else if(id==='TB-I01'){length=150;duration=.5;linear('高铁',0,0,300,.5);event(0,'列车出发');event(.5,'行驶0.5小时，到达150千米处');}
 else if(id==='C21-11')stages(['从甲城驶向乙城','从乙城返回甲城'],[200,200],[2,2.5],true,.5);
 else if(id==='L8-H3')stages(['上山','下山'],[3.75,3.75],[1.25,.75],true);
 else if(id==='PEP-P022')stages(['顺水','逆水返回'],[60,60],[2,2.5],true);
 else if(id==='C21-05'){stages(['乘车','乘船','步行'],[12,8,4],[1,1,1]);noteText='原题没有给出各段速度；各段播放时长只表示先后顺序，不代表实际用时.';}
 else if(id==='TB-R08')stages(['跑步','步行'],[840,1260],[4,14]);
 else if(id==='TB-A18')stages(['前段跑步','最后冲刺'],[120,80],[20,10]);
 else if(id==='S03')stages(['普通公路','高速公路'],[75,225],[1.5,2.5]);
 else if(id==='PEP-P025'){length=300;duration=5;linear('汽车',0,0,60,5);event(0,'10:00 经过王家庄');event(3,'13:00 经过青山');event(23/6,'经过翠湖');event(5,'15:00 经过绿水');landmarks=[{pos:180,label:'青山'},{pos:230,label:'翠湖'}];}
 else if(['C21-10','L8-T2','PEP-P075'].includes(id)){
  circle=true;length=id==='PEP-P075'?600:400;duration=id==='C21-10'?6.25:id==='PEP-P075'?3:5;
  if(id==='PEP-P075'){linear('李明',0,0,190);linear('刘伟',0,0,-210);event(0,'同一点反向出发');event(1.5,'第一次相遇');event(3,'第二次相遇');}
  else{linear('爷爷',0,0,120);actor('小红',t=>t<=5?200*t:1000-200*(t-5));event(0,'同一点同向出发');event(5,id==='C21-10'?'第一次相遇，小红立即转向':'再次相遇');if(id==='C21-10')event(6.25,'转向后再次相遇');}
 }
 else if(id==='PEP-P040'){train=true;length=900;alternatives=['整列火车通过隧道','整列火车经过灯下'];duration=variant===1?10:20;linear('火车车头',0,300,30,duration);event(0,variant===1?'车头经过灯下':'车头进入隧道');if(variant===1){event(10,'车尾经过灯下');landmarks=[{pos:300,label:'灯的位置'}];}else{event(10,'车头离开隧道，车尾进入隧道');event(20,'车尾离开隧道');landmarks=[{pos:300,label:'隧道入口'},{pos:600,label:'隧道出口'}];}noteText='长条代表整列火车；看车头进入到车尾离开的整个过程，两种情形的行进速度相同.';}
 else return null;
 events.sort((a,b)=>a.t-b.t);
 const mode=solved?(scene.partial?'partial':'result'):'illustration';
 const speedLabel=(i,t,status)=>{
  if(status.includes('休息'))return '0'+scene.speedUnit;
  const part=phases.find(p=>t>=p.a&&t<p.b)||phases.at(-1),index=phases.length?(part?.label==='休息'?0:phases.filter(p=>p.label!=='休息').indexOf(part)):i;
  const value=scene.speeds[index],known=scene.known[index];
  if(value==null)return '速度未给出';
  if(!solved&&known!==true&&!context.derived?.[known])return '速度待求';
  return typeof value==='string'?value:clean(value)+scene.speedUnit;
 };
 return {id,length,duration,circle,train,actors,events,alternatives,note:noteText,landmarks,scene,mode,solved,phases,
  sample(progress){const t=clamp(progress)*duration;return actors.map((a,i)=>{
   const part=phases.find(p=>t>=p.a&&t<p.b)||phases.at(-1);
   const status=t<a.start?'尚未出发':t>=a.finish?'已到达'+(Math.abs(a.position(t))<1e-8?scene.start:scene.end):part?.label==='休息'?(scene.rest||'休息中'):part?.label|| (id==='C21-10'&&i===1&&t>=5?'已转向，反向前进':'行进中');
   return {name:a.name,color:motionColors[i],position:a.position(t),status,speed:speedLabel(i,t,status)};
  });}};
}

// Accumulated path length, including direction changes, is distinct from position.
function travelledDistance(model,actorIndex,progress){
 const t=clamp(progress)*model.duration,actor=model.actors[actorIndex];
 const cuts=[0,...model.events.map(e=>e.t).filter(v=>v>0&&v<t),t].sort((a,b)=>a-b);
 return cuts.slice(1).reduce((sum,end,i)=>sum+Math.abs(actor.position(end)-actor.position(cuts[i])),0);
}
function travelledLanes(model,progress){
 const t=clamp(progress)*model.duration;
 if(model.phases?.length)return model.phases.filter(p=>p.label!=='休息').map((p,i)=>({label:p.label,from:p.from,to:p.from+(p.to-p.from)*clamp((t-p.a)/(p.b-p.a)),color:motionColors[i%motionColors.length],active:t>=p.a&&t<p.b}));
 return model.actors.map((a,i)=>({label:a.name,from:a.position(0),to:a.position(t),color:motionColors[i],active:t>=a.start&&t<a.finish}));
}
function motionPicture(model,progress){
 const state=model.sample(progress),t=progress*model.duration,ink='#3E3540',lanes=travelledLanes(model,progress);let height=355;
 const label=(x,y,v,color=ink,anchor='start',size=17)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" font-size="'+size+'" fill="'+color+'">'+esc(v)+'</text>';
 const tag=(a,x,y,i)=>{const anchor=x>410?'end':'start',tx=x+(anchor==='end'?-12:12),ty=y-19;return label(tx,ty,a.name+' · '+a.speed,ink,anchor,16)+label(tx,y+25,a.status,ink,anchor,14);};
 const bar=(x,y,width,color,attrs='')=>'<rect data-wp-travelled-lane '+attrs+' x="'+x+'" y="'+y+'" width="'+Math.max(0,width)+'" height="13" rx="2" fill="'+color+'" fill-opacity="1"/>';
 let body='';
 if(model.circle){
  body='<circle cx="320" cy="185" r="100" fill="none" stroke="'+ink+'" stroke-width="3"/>'+label(320,38,'共同起点',ink,'middle')+'<circle cx="320" cy="85" r="4" fill="'+ink+'"/>';
  state.forEach((a,i)=>{const r=100+(i?8:-8),distance=travelledDistance(model,i,progress),angle=a.position/model.length*2*Math.PI-Math.PI/2,x=320+r*Math.cos(angle),y=185+r*Math.sin(angle);if(distance>=model.length)body+='<circle data-wp-travelled-arc="'+i+'" cx="320" cy="185" r="'+r+'" fill="none" stroke="'+a.color+'" stroke-width="12" stroke-opacity="1"/>';else if(distance>0)body+='<path data-wp-travelled-arc="'+i+'" d="M320 '+(185-r)+' A'+r+' '+r+' 0 '+(distance/model.length>.5?1:0)+' '+(a.position>=0?1:0)+' '+x+' '+y+'" fill="none" stroke="'+a.color+'" stroke-width="12" stroke-opacity="1"/>';});
  if(model.id==='C21-10'&&t>=5)body+='<circle cx="320" cy="285" r="6" fill="none" stroke="'+motionColors[1]+'" stroke-width="2"/>'+label(345,303,'首次相遇处',ink,'start',13);
  state.forEach((a,i)=>{const angle=a.position/model.length*2*Math.PI-Math.PI/2,r=100+(i?8:-8),x=320+r*Math.cos(angle),y=185+r*Math.sin(angle),tx=clamp(x,180,460),ty=y+(i?48:-36);body+='<path d="M'+x+' '+y+'L'+tx+' '+ty+'" stroke="'+a.color+'" stroke-dasharray="3 3"/><circle data-wp-moving-actor="'+i+'" cx="'+x+'" cy="'+y+'" r="8" fill="'+a.color+'" stroke="white" stroke-width="2"/>'+label(tx,ty,a.name+' · '+a.speed,ink,'middle',15);const delta=progress<1?model.sample(Math.min(1,progress+.001))[i].position-a.position:a.position-model.sample(Math.max(0,progress-.001))[i].position,sign=delta<0?-1:1,dx=-Math.sin(angle)*sign,dy=Math.cos(angle)*sign;body+='<path d="M'+(x-dx*30)+' '+(y-dy*30)+'L'+(x-dx*12)+' '+(y-dy*12)+'" stroke="'+a.color+'" stroke-width="3"/>';});
  let rowY=370;
  state.forEach((a,i)=>{body+=label(40,rowY,a.name+'：每行表示一圈路程',ink,'start',15);rowY+=12;const distance=travelledDistance(model,i,progress),count=Math.max(1,Math.ceil((distance-1e-8)/model.length));for(let lap=0;lap<count;lap++){const fraction=clamp(distance/model.length-lap);body+=label(45,rowY+14,'第'+(lap+1)+'圈',ink,'start',14)+'<path d="M120 '+(rowY+7)+'H590" stroke="'+ink+'" stroke-width="1"/>'+bar(120,rowY,470*fraction,a.color,'data-wp-lap="'+lap+'" data-wp-actor="'+i+'"');rowY+=24;}rowY+=18;});
  height=Math.max(440,rowY+5);
 }else{
  const x=p=>50+540*clamp(p/model.length),firstY=model.train?245:205,endY=firstY+(lanes.length-1)*42;
  height=Math.max(355,endY+112);
  lanes.forEach((v,i)=>{const y=firstY+i*42,a=x(v.from),b=x(v.to),short=model.phases?.length?(model.id==='C21-11'?(i?'返程':'去程'):v.label):v.label;body+='<path d="M50 '+y+'H590" fill="none" stroke="'+ink+'" stroke-width="2"/>'+bar(Math.min(a,b),y-6,Math.abs(b-a),v.color,'data-wp-phase="'+i+'"')+label(50,y-13,short,ink,'start',14);});
  body+=label(50,endY+34,model.scene.start)+label(590,endY+34,model.scene.end,ink,'end');
  model.landmarks.forEach((v,i)=>{body+='<path d="M'+x(v.pos)+' '+(endY-7)+'v14" stroke="'+ink+'"/>'+label(x(v.pos),endY+65+(i%2)*22,v.label,ink,'middle',15);});
  if(model.train){body+=model.landmarks.length===1?'<path d="M'+x(300)+' 40v160" stroke="'+motionColors[2]+'" stroke-width="3" stroke-dasharray="4 3"/>':'<path d="M'+x(300)+' 177H'+x(600)+'" stroke="'+ink+'" stroke-width="10" stroke-dasharray="4 3"/>';const head=x(state[0].position),tail=x(state[0].position-300);body+='<path d="M'+tail+' 195H'+head+'" stroke="'+motionColors[0]+'" stroke-width="16"/>'+label(head,152,'车头',motionColors[0],'end')+label(tail,152,'车尾',motionColors[0])+tag(state[0],head,90,0);}
  else state.forEach((a,i)=>{const px=x(a.position),y=90+i*65;let lane=i;if(model.phases?.length){const active=lanes.findIndex(v=>v.active);lane=active>=0?active:(t>=model.duration?lanes.length-1:0);}const targetY=firstY+lane*42;body+='<path d="M'+px+' '+(y+9)+'V'+targetY+'" stroke="'+a.color+'" stroke-dasharray="4 4"/><circle data-wp-moving-actor="'+i+'" cx="'+px+'" cy="'+y+'" r="9" fill="'+a.color+'"/>'+tag(a,px,y,i);const next=model.sample(Math.min(1,progress+.001))[i].position,dir=next<a.position?-1:1;if(Math.abs(next-a.position)>1e-8)body+='<path d="M'+(px-dir*24)+' '+y+'h'+(dir*13)+'m'+(-dir*5)+' -5l'+(dir*5)+' 5l'+(-dir*5)+' 5" fill="none" stroke="'+a.color+'" stroke-width="2"/>';});
  if(state.length===2&&!model.landmarks.length){const a=x(state[0].position),b=x(state[1].position);body+='<path d="M'+a+' '+(endY+86)+'H'+b+'M'+a+' '+(endY+81)+'v10M'+b+' '+(endY+81)+'v10" stroke="'+motionColors[2]+'" stroke-width="3"/>'+label(320,endY+64,Math.abs(a-b)<.01?'位置重合':'两者之间的距离',motionColors[2],'middle');}
  if(model.phases?.length){const total=travelledDistance(model,0,progress),unit=model.scene.speedUnit.includes('千米')?'千米':'米';body+=label(320,height-12,model.solved?'累计走过的路程：'+clean(total)+unit:'实心色条表示已走路程；不同阶段换行保留，休息时不增长',ink,'middle',14);}
 }
 const evt=[...model.events].reverse().find(e=>e.t<=t+1e-8)?.label||'';
 return svg(body,'行程运动演示',state.map(a=>a.name+'：'+a.speed+'，'+a.status).join('；')+'；'+evt,height);
}
function mountTravel(host,problem,route,initialContext={}){
 const box=host.querySelector('[data-wp-travel-diagram]');if(!box||!travelModel(problem))return null;
 let context={...initialContext,route},model=travelModel(problem,0,context),progress=0,playing=false,frame=null,last=null,rate=1,disposed=false;
 const drawing=box.querySelector('.wp-travel-drawing');box.querySelector('summary').textContent='行程运动演示';
 drawing.insertAdjacentHTML('afterend','<div class="wp-motion-controls"><div class="wp-motion-buttons"><button type="button" class="wp-primary" data-motion-play>播放</button><button type="button" class="wp-secondary" data-motion-reset>回到起点</button><label>速度 <select data-motion-rate><option value="0.5">0.5倍</option><option value="1" selected>1倍</option><option value="2">2倍</option></select></label></div><label class="wp-motion-progress">观察进度 <input type="range" min="0" max="1000" step="1" value="0" aria-label="拖动观察行程运动" data-motion-progress><output data-motion-percent>0%</output><span data-motion-time></span></label><div class="wp-motion-events" aria-label="关键时刻" data-motion-events></div><p class="wp-motion-event" data-motion-current role="status" aria-live="polite"></p><div data-motion-legend></div><p class="wp-table-note" data-motion-note></p></div>');
 const play=box.querySelector('[data-motion-play]'),slider=box.querySelector('[data-motion-progress]'),select=box.querySelector('[data-motion-rate]'),evt=box.querySelector('[data-motion-current]');
 let alternatives=null;
 if(model.alternatives.length){const lab=host.ownerDocument.createElement('label');lab.className='wp-motion-variant';lab.textContent='选择题设情形 ';alternatives=host.ownerDocument.createElement('select');model.alternatives.forEach((v,i)=>{const o=host.ownerDocument.createElement('option');o.value=i;o.textContent=v;alternatives.append(o);});lab.append(alternatives);box.querySelector('.wp-motion-controls').prepend(lab);}
 function stop(){playing=false;last=null;if(frame!=null)root.cancelAnimationFrame(frame);frame=null;play.textContent='播放';play.setAttribute('aria-pressed','false');}
 function paint(){
  drawing.innerHTML=motionPicture(model,progress);slider.value=Math.round(progress*1000);box.querySelector('[data-motion-percent]').textContent=Math.round(progress*100)+'%';
  const current=[...model.events].reverse().find(e=>e.t<=progress*model.duration+1e-8)?.label||'';
  if(evt.textContent!==current)evt.textContent=current;
  box.querySelector('[data-motion-time]').textContent=model.solved&&model.scene.timeKnown!==false?(model.scene.clock||'从演示开始计时')+'：约 '+clean(progress*model.duration)+model.scene.unit:'';
  const legend=model.sample(progress).map(a=>'<span class="wp-motion-actor" style="--actor-color:'+a.color+'"><i aria-hidden="true"></i>'+esc(a.name)+'：'+esc(a.speed)+' · '+esc(a.status)+'</span>').join('');
  box.querySelector('[data-motion-legend]').innerHTML=legend;
  box.querySelectorAll('[data-motion-event]').forEach(b=>b.setAttribute('aria-pressed',String(Math.abs(Number(b.dataset.motionEvent)-progress)<.0001)));
 }
 function setup(){
  box.dataset.motionMode=model.mode;
  box.querySelector('[data-motion-mode]').textContent=model.mode==='illustration'?'示意演示：展示一种可能的情形.图中位置和时间比例不作为题目数据，已知速度按原题标注.实心色条表示已走路程，返程或重复行程分行累计.':model.mode==='partial'?'已确认部分结果：仅使用可以确定的数据；未确定的速度或各段用时仍为示意.':'结果演示：根据原题条件和你已确认的解答进行演示.';
  box.querySelector('[data-motion-events]').innerHTML=model.events.map(e=>'<button type="button" class="wp-secondary" data-motion-event="'+e.t/model.duration+'">'+esc(e.label)+'</button>').join('');
  box.querySelector('[data-motion-note]').textContent=(model.note?model.note+' ':'')+(model.scene.normalized?'全程按1表示，速度是每天或每小时行进的全程比例. ':'')+(model.solved?'可用这些结果回看各阶段，并核对原题条件.':'解答核对正确后，这里会切换为结果演示；仍不能确定的数据会继续注明为示意.');
  box.querySelectorAll('[data-motion-results]').forEach(el=>el.remove());
  if(model.solved){const results=host.ownerDocument.createElement('div');results.className='wp-motion-results';results.dataset.motionResults='';results.innerHTML='<b>已确认解答</b>'+route.answers.map((a,i)=>'<p>'+esc(a.label)+'：'+math(context.values['a:'+i])+' '+esc(a.unit||'')+'</p>').join('');box.querySelector('.wp-motion-controls').append(results);}
  paint();
 }

 function tick(now){if(disposed||!playing)return;if(last!=null)progress=Math.min(1,progress+Math.min(now-last,100)*rate/16000);last=now;paint();if(progress>=1)stop();else frame=root.requestAnimationFrame(tick);}
 play.onclick=()=>{if(playing){stop();return;}if(progress>=1)progress=0;playing=true;play.textContent='暂停';play.setAttribute('aria-pressed','true');frame=root.requestAnimationFrame(tick);};
 box.querySelector('[data-motion-reset]').onclick=()=>{stop();progress=0;paint();};slider.oninput=()=>{stop();progress=Number(slider.value)/1000;paint();};select.onchange=()=>{rate=Number(select.value);last=null;};
 const eventsClick=e=>{const b=e.target.closest('[data-motion-event]');if(!b)return;stop();progress=Number(b.dataset.motionEvent);paint();};box.querySelector('[data-motion-events]').addEventListener('click',eventsClick);
 if(alternatives)alternatives.onchange=()=>{stop();model=travelModel(problem,Number(alternatives.value),context);progress=0;setup();};
 const visibility=()=>{if(host.ownerDocument.hidden)stop();};host.ownerDocument.addEventListener('visibilitychange',visibility);
 const toggle=()=>{if(!box.open)stop();};box.addEventListener('toggle',toggle);setup();
 return {getState:()=>({progress,playing,variant:alternatives?Number(alternatives.value):0}),setProgress(v){stop();progress=clamp(v);paint();},updateContext(nextContext){context={...nextContext,route};const prior=model.mode;model=travelModel(problem,alternatives?Number(alternatives.value):0,context);if(model.mode!==prior){stop();progress=0;setup();}else paint();const fragment=host.ownerDocument.createElement('template');fragment.innerHTML=travelMarkup(problem,route,context);const next=fragment.content.querySelector('.wp-travel-quantities'),old=box.querySelector('.wp-travel-quantities');if(old)old.remove();if(next)box.append(next);},destroy(){if(disposed)return;stop();disposed=true;host.ownerDocument.removeEventListener('visibilitychange',visibility);box.removeEventListener('toggle',toggle);box.querySelector('[data-motion-events]').removeEventListener('click',eventsClick);}};
}
const api={mount,destroy,travelMarkup,travelModel,motionPicture,travelledDistance,travelledLanes,mountTravel};if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioWordProblemDiagrams=api;
})(typeof window==='undefined'?globalThis:window);
