'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems');
const data=fs.readdirSync(base).filter(f=>/^data-.*\.js$/.test(f)).flatMap(f=>require(path.join(base,f))),C=require(path.join(base,'catalog.js')),D=require(path.join(base,'diagrams.js'));
let n=0;
for(const p of data.filter(p=>C.categoryFor(p)?.id==='travel'))for(const r of p.routes){
 const html=D.travelMarkup(p,r,{step:2}),dom=new JSDOM(html),box=dom.window.document.querySelector('[data-wp-travel-diagram]');assert(box,p.id);assert(box.querySelector('svg title'));assert(box.querySelector('svg desc'));assert(!box.querySelector('img'));assert([...box.querySelectorAll('rect')].every(el=>el.hasAttribute('data-wp-travelled-lane')&&el.getAttribute('fill-opacity')==='0.3'),p.id+' 30% overlapping path bars without a filled background');n++;
 // Formula values for writable quantities are only the learner's confirmed values.
 const pos=r.table.rows.flatMap((row,ri)=>row.cells.map((c,ci)=>({row,c,ri,ci}))).find(o=>!o.c.note&&!o.c.given&&/速度|时间|用时|路程|距离/.test(r.table.headers[o.ci+1])&&!/^总|^合计|^全程/.test(o.row.label));
 if(pos){const key='t:'+pos.ri+':'+pos.ci;assert(!D.travelMarkup(p,r,{step:2,values:{[key]:'123456789'}}).includes('123456789'));assert(D.travelMarkup(p,r,{step:2,tablePassed:true,values:{[key]:'123456789'}}).includes('123456789'));}
 dom.window.close();
}

const p=data.find(p=>p.id==='C21-11'),html=D.travelMarkup(p,p.routes[0]);assert(html.includes('甲城')&&html.includes('乙城'));assert(!html.includes('左侧线段图'));
for(const p of data.filter(p=>p.id.startsWith('C21-'))){assert(!/文件名标注|PDF/.test(p.source));assert(!p.tags.some(t=>t.includes('2021.12')));}
console.log('PASS travel schematics: '+n+' routes with dynamic SVG, concrete places, hidden derivations and confirmed learner values only');

const turn=data.find(p=>p.id==='C21-10');
const hidden=D.travelMarkup(turn,turn.routes[1],{step:1});assert(!hidden.includes('120米/分钟')&&!hidden.includes('200米/分钟'),'Derived speeds stay hidden before derivation');
const shown=D.travelMarkup(turn,turn.routes[1],{step:1,derived:{'grandpa-speed':true,'red-speed':true}});assert(shown.includes('120米/分钟')&&shown.includes('200米/分钟'));
