// A wrong first submission becomes a per-field correction, including unordered roots.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.resolve(process.env.SITE_DIR || 'site');
const source = name => fs.readFileSync(path.join(root,name),'utf8');
const engine = require(path.join(root,'special-practice-engine.js'));

function fixture() {
 const dom = new JSDOM('<section id="specialPractice"></section>', {url:'https://test.invalid/',runScripts:'outside-only'});
 const w = dom.window, doc = w.document, completed = [], captured = [];
 let owner = 'room:46';
 w.SpecialPracticeEngine = engine;
 w.eval(source('special-practice-data.js'));
 w.RatioPracticeBridge = {key:()=>owner, ready:()=>true, profile:()=>({}), go:()=>{}, complete:r=>completed.push(r), sync:async()=>true};
 w.MistakeBook = {capture:r=>captured.push(r)};
 w.eval(source('special-practice.js'));
 const form = () => doc.querySelector('#spForm');
 const card = code => w.SpecialPracticeCards.find(c=>c.code===code);
 function put(code,i,j,value) {
  if(code==='C2') form().querySelector('[name=q'+i+'][value='+value+']').checked=true;
  else form().elements['q'+i+'_'+j].value=value;
 }
 function first(c, overrides = {}) {
  w.SpecialPracticeUI.start(c);
  c.answers.forEach((row,i)=>row.forEach((a,j)=>put(c.code,i,j,overrides[i+':'+j]??a)));
  submit();
 }
 const submit=()=>form().dispatchEvent(new w.Event('submit',{cancelable:true}));
 return {w,doc,completed,captured,form,card,put,first,submit,
  field:(i,j)=>form().elements['q'+i+'_'+j],
  pending:()=>w.RatioPracticeCorrections.read(owner),
  switchOwner:key=>{owner=key;}, reload(){w.SpecialPracticeUI.reset();w.eval(source('special-practice.js'));w.SpecialPracticeUI.open();}, close:()=>dom.window.close()};
}

const f=fixture(),two=f.card('B1');
f.first(two,{'0:0':'90','0:1':'91','1:0':'92'});
const pending=f.pending();
assert.equal(pending.kind,'card');assert.equal(typeof pending.submittedAt,'string');
assert.equal(f.completed.length,0);assert.equal(f.captured.length,2);
assert.match(f.doc.querySelector('#spResult').textContent,/首答正确 3 \/ 5 题/);
assert.deepEqual([...f.doc.querySelectorAll('[data-sp-jump]')].map(b=>b.textContent),['第1题 · 系数、次数','第2题 · 系数']);
assert(f.doc.querySelector('#spSet').disabled);
assert(!f.doc.querySelector('#spNext')&&!f.doc.querySelector('#spDone'));
assert.equal(f.field(0,0).value,'');assert.equal(f.field(0,1).value,'');
assert(f.field(1,1).disabled);assert.equal(f.field(1,1).value,two.answers[1][1]);
f.put('B1',0,0,two.answers[0][0]);f.put('B1',1,0,'99');f.submit();
assert.equal(f.completed.length,0);assert.match(f.doc.querySelector('#spResult').textContent,/已订正 1 \/ 3 项/);
assert(f.field(0,0).disabled);assert(!f.field(0,1).disabled&&!f.field(1,0).disabled);
const saved=f.pending();f.reload();
assert.match(f.doc.querySelector('#spResult').textContent,/已订正 1 \/ 3 项/,'Entering practice again resumes unfinished corrections');
assert.equal(f.field(0,0).value,two.answers[0][0]);
assert(f.field(0,0).disabled);assert.equal(f.field(0,1).value,'');
f.switchOwner('room:45');assert.equal(f.w.SpecialPracticeUI.resumeCard(saved),false);
f.switchOwner('room:46');
f.put('B1',0,1,two.answers[0][1]);f.put('B1',1,0,two.answers[1][0]);f.submit();f.submit();
assert.equal(f.completed.length,1);assert.equal(f.captured.length,2);assert.equal(f.pending(),null);
assert.equal(f.completed[0].correct,3);assert.equal(f.completed[0].avgTime,pending.elapsed/5000);
assert.equal(f.completed[0].submittedAt,pending.submittedAt);assert.deepEqual(f.completed[0].values,pending.values);
assert.deepEqual(Array.from(engine.grade(two,f.completed[0].correctedValues)),[true,true,true,true,true]);
assert.match(f.doc.querySelector('#spResult').textContent,/订正完成/);
assert(f.doc.querySelector('#spNext'));f.close();

const g=fixture(),roots=g.card('B7');
g.first(roots,{'0:0':'999','0:1':roots.answers[0][0]});
assert(g.field(0,1).disabled);
g.put('B7',0,0,roots.answers[0][0]);g.submit();
assert(!g.field(0,0).disabled);assert(g.field(0,1).disabled,'A duplicate cannot consume the previously confirmed root');
assert.equal(g.completed.length,0);
g.put('B7',0,0,roots.answers[0][1]);g.submit();
assert.equal(g.completed.length,1);assert.equal(g.completed[0].correct,4);g.close();

const radio=fixture(),choice=radio.card('C2');
const wrongChoice=['A','B','C'].find(a=>a!==choice.answers[0][0]);
radio.first(choice,{'0:0':wrongChoice});
assert(!radio.form().querySelector('[name=q0]:checked'),'Wrong option must be freshly selected');
radio.submit();assert.equal(radio.completed.length,0);
radio.put('C2',0,0,choice.answers[0][0]);radio.submit();
assert.equal(radio.completed.length,1);assert.equal(radio.completed[0].correct,4);radio.close();
console.log('PASS mandatory card corrections: ordered fields, unordered roots, radio answers, partial resume, original score, account isolation and single completion');
