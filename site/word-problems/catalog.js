/* Textbooks follow source order; supplementary practice follows topics. Task IDs stay independent of navigation. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioWordProblemCatalog=api;})(typeof window==='undefined'?globalThis:window,function(){'use strict';
 const definitions=[
  ['quantity','和差倍分','找出整体、部分、差量和倍数.','TB-I02 TB-I13 TB-I14 TB-I17 TB-R03 TB-R05 TB-R06 TB-R09 TB-R10 TB-R12 PEP-P003 PEP-P015 PEP-P021 PEP-P032 PEP-P072'],
  ['allocation','调配与盈不足','跟踪调入调出，比较同一个总量.','L7-T2 L7-H2 L7-H3 G10-07 S02 TB-I06 TB-R04 TB-R13 TB-R19 TB-R20 PEP-P005 PEP-P018 PEP-P020 PEP-P076'],
  ['age','年龄问题','同一时刻比较年龄，前后年龄差不变.','L7-P3 L7-T1 L7-H1 TB-I15 TB-A37 PEP-P077'],
  ['shopping','总价与数量','单价乘数量得到金额，区分两个总量.','L7-P2 G10-01 G10-06 TB-I11 TB-I18 TB-I19 TB-A21 TB-R07 PEP-P002'],
  ['production','生产与配套','按配套比例分配人、材料或生产时间.','L7-P1 PEP-P041 PEP-P055'],
  ['percent','增长、利润与含量','说清百分数的基准和变化前后的量.','L8-P1 L8-P1-V1 L8-P1-V2 L8-P1-V3 L8-T1 L8-H1 TB-A25 TB-R15 TB-R21 PEP-P047 PEP-P048 PEP-P063 PEP-P074 PEP-P080'],
  ['work','工程与工作量','先推导效率，再按人物或阶段整理完成量.','G10-02 G10-03 G10-08 G10-10 TB-A10 TB-R14 PEP-P038 PEP-P042 PEP-P043 PEP-P064'],
  ['travel','行程问题','统一速度、时间、路程以及计时起点.','L8-P2-Q1 L8-P2-Q2 L8-P2-Q3 L8-P2-Q4 L8-P2-Q5 L8-P2-V1 L8-P2-V2 L8-P2-V3 L8-T2 L8-H2 L8-H3 G10-05 G10-09 S03 S10 TB-I01 TB-I12 TB-A18 TB-A29 TB-A30 TB-R08 TB-R16 PEP-P022 PEP-P025 PEP-P035 PEP-P039 PEP-P040 PEP-P062 PEP-P075'],
  ['fees','方案比较与分段计费','先判断范围，再比较各方案的费用.','S04 S05 S06 S08 S09 TB-I20 TB-A34 PEP-P052 PEP-P053 PEP-P054 PEP-P066'],
  ['geometry','几何数量','依据周长、面积、角度或体积关系建表.','G9-01 G9-06 TB-I16 TB-A32 TB-R11 TB-R18 PEP-P023'],
  ['patterns','数字与图形规律','说明位值、递增、倍增和图形计数的依据.','G9-03 G9-07 G9-08 G9-09 G9-10 TB-I05 TB-I07 TB-I10 TB-A03 TB-R01 TB-R17 PEP-P012 PEP-P014 PEP-P031 PEP-P037'],
  ['data','统计与计分','从原始表格找规律，并检验整数条件.','TB-I09 PEP-P049 PEP-P050 PEP-P051 PEP-P060 PEP-P078'],
  ['modeling','开放探究与方法边界','用实验、编题或反例说明模型的条件.','G9-02 G9-04 G9-05 G10-04 S01 S07 TB-I03 TB-I04 TB-I08 TB-R22 PEP-P068']
 ];
 const categories=definitions.map(([id,label,description,ids])=>({id,label,description,problemIds:ids.split(' ')}));
 const textbookSections=[
  ['chapter-intro','第4章章引入'],
  ['section-4-1','4.1 等式与方程'],
  ['section-4-2','4.2 一元一次方程及其解法'],
  ['section-4-3','4.3 用一元一次方程解决问题'],
  ['investigation','数学探究'],
  ['summary','小结与思考'],
  ['review','复习题']
 ].map(([id,label])=>({id,label}));
 const assignment=new Map();
 for(const category of categories)for(const id of category.problemIds){if(assignment.has(id))throw Error('重复的题型配置：'+id);assignment.set(id,category);}
 const categoryFor=problem=>assignment.get(typeof problem==='string'?problem:problem?.id)||null;
 function build(data,index={items:[],references:[]},supplement={uniqueIds:[]}){
  const sources=[...(index.items||[]),...(index.references||[])],supplementIds=new Set(supplement.mergedUniqueIds||supplement.uniqueIds||[]),byId=new Map(data.map(p=>[p.id,p])),rows=[];
  for(const category of categories)for(const id of category.problemIds){
   const problem=byId.get(id);if(!problem)continue;
   const locations=sources.filter(s=>s.problemId===id),isTextbook=locations.length>0;
   if(!isTextbook&&!supplementIds.has(id))continue;
   const first=locations[0],mergedSources=(supplement.peopleEducation?.mergedSources||[]).filter(s=>s.problemIds.includes(id));
   rows.push({problem,category:category.id,group:category.label,description:category.description,book:isTextbook?'textbook':'guide',source:first?.source||problem.source,label:first?.label||'',locationId:first?.id||'',locations,mergedSources,reference:!!first?.reference,searchText:[problem.title,problem.stem,...(problem.tags||[]),problem.source,category.label,...locations.flatMap(s=>[s.source,s.label]),...mergedSources.flatMap(s=>[s.title,s.source,...(s.repeatSources||[])])].join(' ')});
  }
  return rows;
 }
 function select(rows,{book='all',category='',query=''}={}){
  const words=String(query).trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return rows.filter(row=>(book==='all'||row.book===book)&&(!category||row.category===category)&&words.every(word=>row.searchText.toLocaleLowerCase().includes(word)));
 }
 function forBook(data,index={items:[],references:[]},supplement={uniqueIds:[]},book='textbook'){
  if(!['textbook','guide'].includes(book))throw Error('未知的题目来源：'+book);
  const unique=build(data,index,supplement);
  if(book==='guide'){
   const rows=select(unique,{book}).map(row=>({...row,topicId:row.category,topicLabel:row.group,sectionId:row.category}));
   const groups=categories.filter(c=>rows.some(row=>row.category===c.id));
   return {book,groups,rows,itemCount:rows.length,taskCount:new Set(rows.map(row=>row.problem.id)).size,filterLabel:'选择题型',allLabel:'全部题型',countLabel:'道补充练习'};
  }
  const byId=new Map(unique.map(row=>[row.problem.id,row]));
  const sourceRows=[...(index.items||[]),...(index.references||[])].map((source,order)=>({source,order}));
  const firstPage=source=>Math.min(...(source.pages||[]).filter(Number.isFinite),Infinity);
  sourceRows.sort((a,b)=>firstPage(a.source)-firstPage(b.source)||a.order-b.order);
  const sectionFor=source=>textbookSections.find(section=>section.label===source.section)||textbookSections.find(section=>/^4\.[123]/.test(section.label)&&String(source.label||'').startsWith(section.label.slice(0,3)));
  const rows=sourceRows.flatMap(({source})=>{
   const original=byId.get(source.problemId);if(!original)return [];
   const section=sectionFor(source);if(!section)throw Error('缺少教材顺序分组：'+source.id);
   const problem=original.problem;
   return [{...original,category:section.id,sectionId:section.id,group:section.label,topicId:original.category,topicLabel:original.group,source:source.source,label:source.label,locationId:source.id,reference:!!source.reference,pages:[...(source.pages||[])],searchText:[problem.title,problem.stem,...(problem.tags||[]),source.source,source.label,section.label,original.group,...original.mergedSources.flatMap(s=>[s.title,s.source,...(s.repeatSources||[])])].join(' ')}];
  });
  const groups=textbookSections.flatMap(section=>{
   const entries=rows.filter(row=>row.category===section.id);if(!entries.length)return [];
   const pages=entries.flatMap(row=>row.pages),start=Math.min(...pages),end=Math.max(...pages);
   return [{...section,description:'按教材顺序查看第'+start+(start===end?'':'—'+end)+'页的应用及建模题.'}];
  });
  return {book,groups,rows,itemCount:rows.length,taskCount:new Set(rows.map(row=>row.problem.id)).size,filterLabel:'选择教材内容',allLabel:'全部教材内容',countLabel:'处教材位置'};
 }
 return {categories,textbookSections,categoryFor,build,select,forBook};
});
