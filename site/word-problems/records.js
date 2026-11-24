(function(root){'use strict';
 function mount(landing,{B,data,ready,esc,open,start}){
 const P=root.RatioWordProblemProgress;
 let state,recordExportUI=null;
 function toast(text){let el=landing.querySelector('[data-record-status]');if(!el){el=document.createElement('p');el.dataset.recordStatus='';el.setAttribute('role','status');landing.prepend(el);}el.textContent=text;}
 function appendAtlas(){
  const catalog=window.RatioWordProblemCatalog, categories=catalog.categories;
  const stages=['读题','设元','找关系','列表','列方程','解方程','检验'];
  const abilities=['审题','关系分析','列方程','解方程','实际检验'], columns=[[0],[2,3],[4],[5],[6]];
  const evidence=categories.map(()=>stages.map(()=>({yes:0,n:0})));
  const records=[...state.records].sort((a,b)=>String(a.at).localeCompare(String(b.at)));
  const seen=new Set();
  for(const r of records){
   const cat=categories.indexOf(catalog.categoryFor(r.problemId));
   if(cat<0||r.status==='review')continue;
   stages.forEach((_,i)=>{
    const key=r.problemId+'/'+i, value=r.values?.['atlas:'+i];
    if(seen.has(key)||!['yes','no','help'].includes(value))return;
    seen.add(key);if(value==='help')return;
    evidence[cat][i].n++;if(value==='yes')evidence[cat][i].yes++;
   });
  }
  const box=document.createElement('section');box.className='atlas';landing.querySelector('.page-heading').after(box);
  const sum=parts=>parts.reduce((a,b)=>({yes:a.yes+b.yes,n:a.n+b.n}),{yes:0,n:0});
  const fraction=v=>v.n?v.yes+'/'+v.n:'—';
  const totals=stages.map((_,i)=>sum(evidence.map(row=>row[i])));
  box.innerHTML='<h2>能力图鉴</h2><div class="atlas-flow"><div class="atlas-zones"><span>思维建模区</span><span>运算检验区</span></div><div class="atlas-steps">'+stages.map((s,i)=>'<div><b style="--arc:'+(totals[i].n?360*totals[i].yes/totals[i].n:0)+'deg">'+(i+1)+'</b>'+s+'<small>'+fraction(totals[i])+'</small></div>').join('')+'</div></div><div class="atlas-pair"><section><h3>题型 × 能力</h3><div class="atlas-scroll"><table><thead><tr><th scope="col">题型</th>'+abilities.map(s=>'<th scope="col">'+s+'</th>').join('')+'</tr></thead><tbody></tbody></table></div><small>独立首答正确次数 / 独立尝试次数　 ·　 — 暂无记录</small></section><section class="atlas-choice" aria-live="polite"></section></div><small>按不同题目的首次有效记录统计。完成新版分析后更新；旧记录可在上方回看。</small>';
  const body=box.querySelector('tbody'),choice=box.querySelector('.atlas-choice');
  function selectCell(t,a,button){
   box.querySelectorAll('td button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   const category=categories[t], tasks=data.filter(p=>category.problemIds.includes(p.id));
   choice.innerHTML='<h3>自主选练</h3><strong>'+esc(category.label)+' · '+abilities[a]+'</strong><p>'+columns[a].map(i=>stages[i]+' '+fraction(evidence[t][i])).join('　')+'</p><label>选择题目 <select></select></label><p><button class="primary">进入本题分析 →</button></p>';
   const select=choice.querySelector('select');for(const p of tasks)select.add(new Option(p.title,p.id));
   choice.querySelector('button').onclick=()=>{if(ready())start(select.value);};
  }
  categories.forEach((category,t)=>{
   const tr=body.insertRow();const label=document.createElement('th');label.scope='row';label.textContent=category.label;tr.append(label);
   columns.forEach((group,a)=>{const v=sum(group.map(i=>evidence[t][i])),b=document.createElement('button');b.textContent=fraction(v);b.className=!v.n?'':v.yes/v.n>=.8?'high':v.yes/v.n>=.5?'mid':'low';b.setAttribute('aria-label',category.label+' '+abilities[a]+' '+(v.n?fraction(v):'暂无记录'));b.onclick=()=>selectCell(t,a,b);tr.insertCell().append(b);});
  });
  body.querySelector('button').click();
 }

 function records(){if(!ready())return;state=P.normalized(B.progress());recordExportUI?.destroy();recordExportUI=null;const s=P.summary(state),drafts=Object.values(state.drafts).filter(d=>!d.finished),rs=s.records;landing.innerHTML=`<div class="page-heading"><button type="button" class="ghost" data-return>← 返回题目目录</button><div><div class="eyebrow">MY ANALYSIS</div><h2>我的记录</h2><p>保留每次分析过程、提示使用情况，以及已经确认的不同填法.</p></div></div><div class="count-line"><span><b>${s.completed}</b>已完成题目</span><span><b>${s.independent}</b>独立完成</span><span><b>${drafts.length}</b>进行中</span><span><b>${s.review}</b>课堂交流记录</span></div><div class="backup-actions"><button class="ghost" data-export>导出记录备份</button><button class="ghost" data-import>导入记录备份</button><button class="primary" data-record-pdf>导出练习记录 PDF</button><input type="file" accept=".json,application/json" data-import-file hidden></div><p style="font-size:12px;color:var(--muted)">练习记录跟随当前学生账号保存. 导入本账号的备份时自动合并已有记录.手写草稿保存在本机画板中，不包含在文字记录备份里.</p><div data-record-pdf-host hidden></div><div class="record-list">${drafts.map(d=>{const p=data.find(p=>p.id===d.problemId);return p?`<article class="record-item"><div><b>${esc(p.title)}</b><p>进行中 · ${esc(p.routes.find(r=>r.id===d.routeId)?.label||'')}</p></div><button class="ghost" data-start="${esc(p.id)}">继续分析 →</button></article>`:'';}).join('')}${rs.map(r=>`<article class="record-item"><div><b>${esc(r.title)}</b><p>${esc(({review:'留待课堂交流',independent:'独立完成',assisted:'提示后完成',example:'看过示范'})[r.status]||'已完成')} · ${esc(r.routeLabel)}<br>${esc(new Date(r.at).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false}))}${r.modelMethods.filter(m=>m.confirmed).length>1?' · 已保留 '+r.modelMethods.filter(m=>m.confirmed).length+' 种填法':''}</p></div><button class="ghost" data-record="${esc(r.runId)}">回看过程 →</button></article>`).join('')}</div>${rs.length||drafts.length?'':'<div class="empty-state">还没有分析记录.<br>完成一题后，这里会保留你的分析过程和不同填法.</div>'}`;appendAtlas();bind();const pdfHost=landing.querySelector('[data-record-pdf-host]');landing.querySelector('[data-record-pdf]').onclick=()=>{pdfHost.hidden=false;recordExportUI?.destroy();recordExportUI=window.EquationRecordExport.mount(pdfHost,{progress:state,data,ownerKey:B.key()});pdfHost.scrollIntoView({block:'start',behavior:'smooth'});};landing.querySelector('[data-export]').onclick=()=>{const b=new Blob([JSON.stringify({app:'ratiobot-equation-records',owner:B.key(),version:1,exportedAt:new Date().toISOString(),progress:state},null,2)],{type:'application/json'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='equation-analysis-records-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('文字分析记录已导出.');};const input=landing.querySelector('[data-import-file]');landing.querySelector('[data-import]').onclick=()=>input.click();input.onchange=async()=>{try{const f=input.files[0];if(!f)return;if(f.size>15000000)throw Error('备份文件过大.');const v=JSON.parse(await f.text());if(!ready()||v.owner!==B.key()||v.app!=='ratiobot-equation-records'||v.version!==1||!v.progress||typeof v.progress!=='object'||!Array.isArray(v.progress.records)||!v.progress.drafts||typeof v.progress.drafts!=='object')throw Error('请选择当前学生账号导出的方程记录备份.');B.mergeRecords(v.progress);records();toast('记录已合并，原有分析记录已保留.');}catch(e){toast('导入未完成：'+e.message);}finally{input.value='';}};}
 function bind(){
  landing.querySelector('[data-return]').onclick=open;
  landing.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{if(ready())start(b.dataset.start);});
  landing.querySelectorAll('[data-record]').forEach(b=>b.onclick=()=>{
   if(!ready())return;
   const record=state.records.find(r=>r.runId===b.dataset.record);
   if(!record)return;
   recordExportUI?.destroy();recordExportUI=null;
   const entry=root.EquationRecordExport.collect({drafts:{},records:[record]},data)[0];
   if(!entry)return;
   landing.innerHTML='<button type="button" class="ghost">← 返回我的记录</button>'+root.EquationRecordExport.buildHTML([entry],{includeQuestion:true,includeProcess:true});
   landing.querySelector('button').onclick=records;
  });
 }
 records();
 return {destroy(){recordExportUI?.destroy();}};
 }
 root.RatioStudentEquationRecords={mount};
})(window);
