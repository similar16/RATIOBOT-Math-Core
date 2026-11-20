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
// Quantity-first schematics. Positions are illustrative, never numerical solutions.
function travelMarkup(problem,route,{step=0,tablePassed=false,values={},derived={}}={}){
 const blue='#526B87',red='#BD8882',gold='#B79A5C',ink='#3E3540';
 const rows=(route.table?.rows||[]).map((r,i)=>({...r,index:i})).filter(r=>!/^总|^合计|^全程/.test(r.label)).slice(0,4);
 const id=problem.id;
 const type=['C21-05','TB-R08','TB-A18','S03'].includes(id)?'segments':['C21-11','L8-H3','PEP-P022'].includes(id)?'roundtrip':['C21-10','L8-T2','PEP-P075'].includes(id)?'circle':['C21-09','TB-A29','PEP-P035','G10-09','G10-05','PEP-P062'].includes(id)?'meeting':/^L8-P2-|^S10$|^TB-A30$/.test(id)?'chase':'tracks';
 const ln=(a,y,b,col=blue,dashed=false)=>'<line x1="'+a+'" y1="'+y+'" x2="'+b+'" y2="'+y+'" stroke="'+col+'" stroke-width="3"'+(dashed?' stroke-dasharray="6 5"':'')+'/>';
 const txt=(x,y,label,anchor='start',col=ink)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" fill="'+col+'" font-size="18">'+esc(label)+'</text>';
 const tick=(x,y)=>'<path d="M'+x+' '+(y-7)+'v14" stroke="'+ink+'" stroke-width="2"/>';
 const arrow=(a,y,b,col=blue)=>ln(a,y,b,col)+'<path d="M'+(b+(b>a?-10:10))+' '+(y-6)+'L'+b+' '+y+'L'+(b+(b>a?-10:10))+' '+(y+6)+'" fill="none" stroke="'+col+'" stroke-width="2"/>';
 const fixedNames={'C21-09':['慢车','快车'],'TB-A29':['甲','乙'],'PEP-P035':['甲车','乙车'],'G10-09':['野鸭','大雁'],'G10-05':['甲车','乙车'],'PEP-P062':['李明（骑车）','刘伟（步行）']};
 const names=fixedNames[id]||rows.filter(r=>r.label!=='休息').slice(0,2).map(r=>r.label.length>12?r.label.slice(0,12)+'…':r.label);
 let body='',height=220,description='各线段仅用于对应数量关系，不按实际路程比例绘制.';
 if(type==='segments'){
  const labels=id==='C21-05'?['乘车','乘船','步行']:id==='TB-R08'?['跑步','步行']:id==='TB-A18'?['前段跑步','最后冲刺']:['普通公路','高速公路'];
  const w=560/labels.length;body=txt(40,38,'起点')+txt(600,38,'终点','end');
  labels.forEach((v,i)=>{const a=40+i*w,b=a+w;body+=ln(a,100,b,i%2?red:blue)+tick(a,100)+txt((a+b)/2,78,v,'middle');});body+=tick(600,100)+arrow(40,145,600,gold)+txt(320,185,'整段路程由各段组成','middle');
 }else if(type==='meeting'){
  body=txt(40,35,'起点 A')+txt(600,35,'起点 B','end')+ln(40,105,600,ink)+tick(40,105)+tick(600,105)+tick(330,105)+arrow(70,70,275,blue)+arrow(570,70,385,red)+txt(170,55,names[0]||'从A出发者','middle')+txt(480,55,names[1]||'从B出发者','middle')+txt(330,135,'相遇位置（示意）','middle')+txt(320,183,id==='C21-09'?'先辨清先出发者与后出发者的行驶时间':'从两端出发，比较两段行程','middle');
 }else if(type==='roundtrip'){
  body=txt(40,34,'甲地 / 起点')+txt(600,34,'乙地 / 折返点','end')+arrow(40,85,600,blue)+txt(320,67,id==='L8-H3'?'上山':'去程','middle')+arrow(600,160,40,red)+txt(320,141,id==='L8-H3'?'下山':id==='PEP-P022'?'逆水返回':'返程','middle');
  if(id==='C21-11'){height=260;body+=txt(320,210,'到达乙城 → 休息30分钟 → 返回','middle')+txt(320,243,'休息计入时间，不计入行驶路程','middle');}else body+=txt(320,205,'两个方向分别记时间，同一路程对应比较','middle');
 }else if(type==='circle'){
  height=id==='C21-10'?290:245;
  const ring=(cx,cy,label,opposite)=>'<circle cx="'+cx+'" cy="'+cy+'" r="57" fill="none" stroke="'+ink+'" stroke-width="2"/>'+txt(cx,cy+85,label,'middle')+txt(cx,cy-70,'共同起点','middle')+'<circle cx="'+cx+'" cy="'+(cy-57)+'" r="4" fill="'+ink+'"/>'+'<path data-wp-runner="red" data-direction="'+(opposite?'counterclockwise':'clockwise')+'" d="M'+(cx-40)+' '+(cy+(opposite?40:-40))+' A57 57 0 0 '+(opposite?'0':'1')+' '+(cx+57)+' '+cy+'m-6 '+(opposite?'10':'-10')+'l6 '+(opposite?'-10':'10')+'l6 '+(opposite?'10':'-10')+'" fill="none" stroke="'+red+'" stroke-width="4"/>'+'<path data-wp-runner="blue" data-direction="clockwise" d="M'+(cx+40)+' '+(cy+40)+' A57 57 0 0 1 '+(cx-57)+' '+cy+'m-6 10 l6 -10 l6 10" fill="none" stroke="'+blue+'" stroke-width="4"/>';
  if(id==='C21-10')body=ring(170,120,'先同向跑',false)+txt(320,124,'转向','middle')+ring(470,120,'相遇后反向跑',true)+txt(320,268,'转向前后分开比较，不把两种相遇混为同一过程','middle');
  else body=ring(320,105,id==='PEP-P075'?'同一点反向出发':'同一点同向出发',id==='PEP-P075');
 }else{
  height=Math.max(200,rows.length*70+65);
  rows.forEach((r,i)=>{const y=65+i*70;body+=txt(40,y-20,r.label)+arrow(id==='S10'&&i===1?160:40,y,590,i%2?red:blue);});
  body+=txt(320,height-12,type==='chase'?'同向行进：起点、出发时刻与经过时间分别比较':'各行对应当前表格的对象或阶段','middle');
 }
 if(type==='circle')body+=txt(320,id==='C21-10'?240:225,id==='PEP-P075'?'蓝色：李明　红色：刘伟':'蓝色：爷爷　红色：小红','middle');
 const picture=svg(body,'行程数量关系示意图',description,height);
 const cols=(route.table?.headers||[]).map((h,i)=>({label:h,index:i-1})).filter(c=>c.index>=0&&/速度|时间|用时|路程|距离/.test(c.label));
 const quantities=step>0&&cols.length?'<div class="wp-travel-quantities">'+rows.map(r=>'<section><h5>'+esc(r.label)+'</h5>'+cols.map(c=>{const cell=r.cells[c.index];if(!cell)return '';const value=cell.note!=null?esc(cell.note):cell.given&&cell.sources.every(id=>id==='unknown'||problem.facts.some(f=>f.id===id)||derived[id])?math(cell.expr):tablePassed&&values['t:'+r.index+':'+c.index]?math(values['t:'+r.index+':'+c.index]):'<span class="wp-travel-blank">待表示</span>';return '<p><span>'+esc(c.label)+'</span><b>'+value+'</b></p>';}).join('')+'</section>').join('')+'</div>':'';
 return '<details class="wp-travel-diagram" data-wp-travel-diagram data-kind="'+type+'" open><summary>行程示意图</summary><p class="wp-table-note">示意图不按比例绘制，线段位置不代表实际相遇点.可配合上面的数量关系与表格分析.</p><div class="wp-travel-drawing" tabindex="0" role="region" aria-label="行程示意图，可横向滚动">'+picture+'</div>'+quantities+'</details>';
}

const api={mount,destroy,travelMarkup};if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioWordProblemDiagrams=api;
})(typeof window==='undefined'?globalThis:window);
