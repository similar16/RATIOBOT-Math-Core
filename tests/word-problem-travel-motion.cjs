'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems'),D=require(path.join(base,'diagrams.js')),C=require(path.join(base,'catalog.js'));
const data=fs.readdirSync(base).filter(f=>/^data-.*\.js$/.test(f)).flatMap(f=>require(path.join(base,f)));
const problem=id=>data.find(p=>p.id===id),model=(id,v=0)=>D.travelModel(problem(id),v),near=(a,b)=>assert(Math.abs(a-b)<1e-7,`${a} ≠ ${b}`);
let routes=0;
for(const p of data.filter(p=>C.categoryFor(p)?.id==='travel'))for(const r of p.routes){const m=D.travelModel(p);assert(m,p.id);assert(m.events.length>=2,p.id);assert(m.duration>0&&m.length>0);for(let i=0;i<=100;i++)for(const a of m.sample(i/100))assert(Number.isFinite(a.position),p.id);assert(D.travelMarkup(p,r).includes('<svg'));routes++;}
// Both moving objects really share a position at every authored meeting event.
for(const id of ['C21-09','TB-A29','PEP-P035','G10-09','G10-05','PEP-P062','L8-P2-Q1','L8-P2-Q4','S10','PEP-P039']){const m=model(id);for(const e of m.events.filter(e=>/两者相遇|两人相遇|追上小明|甲在途中追上/.test(e.label))){const a=m.sample(e.t/m.duration);near(a[0].position,a[1].position);}}
// Arrival is clamped, rest consumes time with no displacement, reversal begins at the meeting point.
const rest=model('C21-11');near(rest.sample(2/rest.duration)[0].position,rest.sample(2.4/rest.duration)[0].position);assert(rest.sample(2.4/rest.duration)[0].status.includes('在乙城休息30分钟'));near(rest.sample(1)[0].position,0);
const turn=model('C21-10');near(turn.sample(5/6.25)[0].position%400,turn.sample(5/6.25)[1].position%400);assert(turn.sample(5.1/6.25)[1].position<turn.sample(5/6.25)[1].position);near(turn.sample(1)[0].position%400,turn.sample(1)[1].position%400);
const arrival=model('PEP-P062');near(arrival.sample(.75)[0].position,8);near(arrival.sample(1)[0].position,8);
assert(model('TB-A30',1).sample(16/19)[1].position<960);assert(model('TB-A30',1).events.at(-1).label.includes('未在途中追上'));
for(const v of [0,1]){const m=model('L8-P2-V3',v),e=m.events.find(e=>e.label.includes('0.25'));const a=m.sample(e.t/m.duration);near(Math.abs(a[0].position-a[1].position),1);assert.equal(a[0].position>a[1].position,v===0);}
assert(model('C21-05').note.includes('不代表实际用时'));assert(model('PEP-P039').note.includes('不表示两人的实际速度相等'));
// Real DOM controls, specific places and point speeds, no timer leaks after closing or destroying.
const dom=new JSDOM('<main></main>',{runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,h=w.document.querySelector('main');w.eval(fs.readFileSync(path.join(base,'engine.js'),'utf8'));w.eval(fs.readFileSync(path.join(base,'diagrams.js'),'utf8'));
let next=0;const frames=new Map();w.requestAnimationFrame=f=>{frames.set(++next,f);return next;};w.cancelAnimationFrame=id=>frames.delete(id);const frame=t=>{const callbacks=[...frames.values()];frames.clear();callbacks.forEach(f=>f(t));};
const p=problem('C21-11'),r=p.routes[0];h.innerHTML=w.RatioWordProblemDiagrams.travelMarkup(p,r,{step:2});const ui=w.RatioWordProblemDiagrams.mountTravel(h,p,r),$=s=>h.querySelector(s);
$('[data-motion-play]').click();frame(0);frame(100);assert(ui.getState().playing&&ui.getState().progress>0);$('[data-motion-play]').click();assert(!frames.size&&!ui.getState().playing);
const slider=$('[data-motion-progress]');slider.value=450;slider.dispatchEvent(new w.Event('input'));assert.equal(ui.getState().progress,.45);assert($('svg').textContent.includes('在乙城休息30分钟'));assert($('svg').textContent.includes('0千米/小时'));assert(!$('[data-wp-motion-linked]'));
const before=$('.wp-motion-controls');ui.updateContext({step:2});assert.equal($('.wp-motion-controls'),before);assert.equal(ui.getState().progress,.45);
const answers=Object.fromEntries(r.answers.map((a,i)=>['a:'+i,a.expr]));
assert($('[data-motion-mode]').textContent.includes('可能的情形'));
ui.updateContext({step:5,answersChecked:true,answerPassed:true,values:{'a:0':'999'}});assert.equal($('[data-wp-travel-diagram]').dataset.motionMode,'illustration');
ui.updateContext({step:5,answersChecked:true,answerPassed:true,values:answers});assert.equal($('[data-wp-travel-diagram]').dataset.motionMode,'result');assert($('[data-motion-results]').textContent.includes('200'));assert($('[data-motion-time]').textContent.includes('小时'));
ui.setProgress(.8);assert($('svg').textContent.includes('80千米/小时'));assert($('svg').textContent.includes('乙城'));assert($('svg').textContent.includes('甲城'));
ui.updateContext({step:5,answersChecked:false,answerPassed:false,values:answers});assert.equal($('[data-wp-travel-diagram]').dataset.motionMode,'illustration');assert(!$('[data-motion-results]'));assert.equal($('[data-motion-time]').textContent,'');
$('[data-motion-reset]').click();assert.equal(ui.getState().progress,0);$('[data-motion-event]').click();assert.equal(ui.getState().progress,0);
$('[data-motion-play]').click();const box=$('[data-wp-travel-diagram]');box.open=false;box.dispatchEvent(new w.Event('toggle'));assert(!frames.size);$('[data-motion-play]').click();ui.destroy();assert(!frames.size);assert(!ui.getState().playing);ui.destroy();dom.window.close();
console.log('PASS travel motion: '+routes+' route models; meetings, waits, reversals, endpoints, alternative cases, known/unknown moving speeds, verified result mode, preserved illustrative unknowns, controls and cleanup');

// Every result-mode route must pass the real expression checker first; ambiguous motion stays marked partial.
globalThis.RatioWordProblemEngine=require(path.join(base,'engine.js'));
for(const p of data.filter(p=>C.categoryFor(p)?.id==='travel'))for(const r of p.routes){const context={route:r,answersChecked:true,answerPassed:true,values:Object.fromEntries(r.answers.map((a,i)=>['a:'+i,a.expr]))};const m=D.travelModel(p,0,context);assert.equal(m.mode,['C21-05','PEP-P039'].includes(p.id)?'partial':'result',p.id+'/'+r.id);}
const v=problem('L8-P2-V1'),vr=v.routes[0];assert.equal(D.travelModel(v).sample(.5)[1].speed,'速度待求');assert.equal(D.travelModel(v,0,{route:vr,answersChecked:true,answerPassed:true,values:{'a:0':'30/2'}}).sample(.8)[1].speed,'15千米/小时');
