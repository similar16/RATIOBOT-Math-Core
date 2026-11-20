'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems');
const data=fs.readdirSync(base).filter(f=>/^data-.*\.js$/.test(f)).flatMap(f=>require(path.join(base,f))),C=require(path.join(base,'catalog.js')),D=require(path.join(base,'diagrams.js'));
const kinds=new Set();let n=0;
for(const p of data.filter(p=>C.categoryFor(p)?.id==='travel'))for(const r of p.routes){
 const html=D.travelMarkup(p,r,{step:2}),dom=new JSDOM(html),box=dom.window.document.querySelector('[data-wp-travel-diagram]');assert(box,p.id);assert(box.querySelector('svg title'));assert(box.querySelector('svg desc'));assert(!box.querySelector('img'));assert(!html.includes('<rect'),p.id+' transparent diagram');kinds.add(box.dataset.kind);n++;
 // Formula values for writable quantities are only the learner's confirmed values.
 const pos=r.table.rows.flatMap((row,ri)=>row.cells.map((c,ci)=>({row,c,ri,ci}))).find(o=>!o.c.note&&!o.c.given&&/速度|时间|用时|路程|距离/.test(r.table.headers[o.ci+1])&&!/^总|^合计|^全程/.test(o.row.label));
 if(pos){const key='t:'+pos.ri+':'+pos.ci;assert(!D.travelMarkup(p,r,{step:2,values:{[key]:'123456789'}}).includes('123456789'));assert(D.travelMarkup(p,r,{step:2,tablePassed:true,values:{[key]:'123456789'}}).includes('123456789'));}
 dom.window.close();
}
for(const k of ['segments','meeting','circle','roundtrip','chase','tracks'])assert(kinds.has(k));
const p=data.find(p=>p.id==='C21-11'),html=D.travelMarkup(p,p.routes[0]);assert(html.includes('休息30分钟')&&html.includes('休息计入时间，不计入行驶路程'));
for(const p of data.filter(p=>p.id.startsWith('C21-'))){assert(!/文件名标注|PDF/.test(p.source));assert(!p.tags.some(t=>t.includes('2021.12')));}
console.log('PASS travel schematics: '+n+' routes across six relationship layouts; transparent SVG, readable stage labels, optional display and confirmed learner values only');

const turn=data.find(p=>p.id==='C21-10');const turnDoc=new JSDOM(D.travelMarkup(turn,turn.routes[0]));assert.deepEqual([...turnDoc.window.document.querySelectorAll('[data-wp-runner="blue"]')].map(p=>p.dataset.direction),['clockwise','clockwise']);assert.deepEqual([...turnDoc.window.document.querySelectorAll('[data-wp-runner="red"]')].map(p=>p.dataset.direction),['clockwise','counterclockwise']);turnDoc.window.close();
const hidden=D.travelMarkup(turn,turn.routes[1],{step:1});assert(!hidden.includes('>120<')&&!hidden.includes('>200<'),'Derived speeds stay hidden before derivation');
