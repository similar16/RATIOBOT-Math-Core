const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=process.env.SITE_DIR||'site',E=require(path.resolve(root,'special-practice-engine.js')),scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'special-practice-data.js'),'utf8'),scope);const cards=scope.window.SpecialPracticeCards;
assert.equal(cards.length,120);assert.equal(new Set(cards.map(c=>c.id)).size,120);assert.equal(new Set(cards.map(c=>c.code)).size,12);
for(const c of cards){assert.equal(c.questions.length,5);assert.equal(c.answers.length,5);assert.deepEqual(Array.from(E.grade(c,c.answers)),[true,true,true,true,true],c.id);for(const q of c.questions)if(c.code==='B1')assert.doesNotMatch(q,/\^\{1\}|\^1(?!\d)/);if(c.code==='C2'){assert.ok(c.questions.every(q=>!/[a-z][a-z]|z|\\times/.test(q)));assert.ok(c.answers.every(a=>/^[ABC]$/.test(a[0])));}}
assert.ok(E.equal('−0.5','-1/2'));assert.ok(E.equal('3pi','3π'));assert.ok(E.equal('-pi','-1π'));assert.ok(!E.equal('2/4','1/2',true));assert.ok(!E.equal('1/0','1'));assert.ok(!E.equal('','0'));assert.ok(!E.equal('1+1','2'));assert.ok(!E.equal('1*2','12'));assert.ok(E.equal('3*pi','3π'));assert.ok(E.equal('-3/4','-3/4',true));
const {JSDOM}=require('jsdom'),d=new JSDOM('<section id="specialPractice"></section>',{url:'https://test.invalid',runScripts:'outside-only'}),w=d.window;
w.SpecialPracticeCards=cards;w.SpecialPracticeEngine=E;w.katex=require('katex');w.confirm=()=>true;
let key='1',ready=true,saves=0;const p={economy:{modules:{}}};w.RatioPracticeBridge={ready:()=>ready,key:()=>key,profile:()=>p,go:()=>{},sync:async()=>true,complete:r=>{saves++;assert.equal(r.correct,5);}};
w.eval(fs.readFileSync(path.join(root,'special-practice.js'),'utf8'));
w.SpecialPracticeUI.open();assert.equal(w.document.querySelectorAll('[data-code]').length,12);
(async()=>{
for(const c of [cards[0],cards.find(c=>c.code==='A9'),cards.find(c=>c.code==='B1'),cards.find(c=>c.code==='C2')]){
 w.SpecialPracticeUI.start(c);const form=w.document.querySelector('form');c.answers.forEach((row,i)=>row.forEach((a,j)=>{if(c.code==='C2')form.querySelector('[name=q'+i+'][value='+a+']').checked=true;else form.elements['q'+i+'_'+j].value=a;}));form.dispatchEvent(new w.Event('submit',{cancelable:true}));assert.match(w.document.querySelector('#spResult').textContent,/5 \/ 5/);form.dispatchEvent(new w.Event('submit',{cancelable:true}));await new Promise(r=>setTimeout(r,0));
}
assert.equal(saves,4);w.SpecialPracticeUI.start(cards[0]);key='2';w.document.querySelector('form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(saves,4);assert.equal(w.document.querySelector('#specialPractice').textContent,'');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(html,/data-go="specialPractice"/);assert.match(html,/specialPractice'\]/);assert.match(html,/window\.SpecialPracticeUI\?\.reset/);
console.log('PASS 600 canonical answers, fraction simplification, pi coefficients, ABC, 12 modules, duplicate-submit and account-switch guards');

})().catch(e=>{console.error(e);process.exitCode=1;});
