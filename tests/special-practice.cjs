const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=process.env.SITE_DIR||'site',E=require(path.resolve(root,'special-practice-engine.js')),scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'special-practice-data.js'),'utf8'),scope);const cards=scope.window.SpecialPracticeCards;
assert.equal(cards.length,900);assert.equal(new Set(cards.map(c=>c.id)).size,900);assert.equal(new Set(cards.map(c=>c.code)).size,18);
for(const code of new Set(cards.map(c=>c.code)))assert.equal(cards.filter(c=>c.code===code).length,50);
for(const c of cards){assert.equal(c.questions.length,5);assert.equal(c.answers.length,5);assert.deepEqual(Array.from(E.grade(c,c.answers)),[true,true,true,true,true],c.id);for(const q of c.questions)if(c.code==='B1')assert.doesNotMatch(q,/\^\{1\}|\^1(?!\d)/);if(c.code==='C2'){assert.ok(c.questions.every(q=>!/[a-z][a-z]|z|\\times/.test(q)));assert.ok(c.answers.every(a=>/^[ABC]$/.test(a[0])));}}
assert.ok(E.equal('−0.5','-1/2'));assert.ok(E.equal('3pi','3π'));assert.ok(E.equal('-pi','-1π'));assert.ok(!E.equal('2/4','1/2',true));assert.ok(!E.equal('1/0','1'));assert.ok(!E.equal('','0'));assert.ok(!E.equal('1+1','2'));assert.ok(!E.equal('1*2','12'));assert.ok(E.equal('3*pi','3π'));assert.ok(E.equal('-3/4','-3/4',true));
assert.ok(E.linearEqual('3+2x','2x+3'));assert.ok(E.linearEqual('−x+2','2-x'));assert.ok(E.linearEqual('2*x+3','2x+3'));
for(const bad of ['x+x+3','2(x+3)','x2','2x3','x*x','x/0','0x+3','2x-3','alert(1)',''])assert.ok(!E.linearEqual(bad,'2x+3'),bad);
assert.ok(!E.linearEqual('x-x','0'));assert.ok(E.linearEqual('0','0'));
const roots=cards.find(c=>c.code==='B7');
assert.ok(E.grade(roots,[['3','-1']])[0]);
for(const invalid of [['3','3'],['-1'],['3','1']])assert.ok(!E.grade(roots,[invalid])[0]);
const {JSDOM}=require('jsdom'),d=new JSDOM('<section id="specialPractice"></section>',{url:'https://test.invalid',runScripts:'outside-only'}),w=d.window;
w.SpecialPracticeCards=cards;w.SpecialPracticeEngine=E;w.katex=require('katex');w.confirm=()=>true;
let key='1',ready=true,saves=0;const p={economy:{modules:{}}};w.RatioPracticeBridge={ready:()=>ready,key:()=>key,profile:()=>p,go:()=>{},sync:async()=>true,complete:r=>{saves++;assert.equal(r.correct,5);}};
w.eval(fs.readFileSync(path.join(root,'special-practice.js'),'utf8'));
w.SpecialPracticeUI.open();assert.equal(w.document.querySelectorAll('[data-code]').length,18);
assert.deepEqual(Array.from(w.document.querySelectorAll('[data-code]')).map(x=>x.dataset.code),['A1','A3','A4','A5','A6','A7','A8','A9','B1','B2','B3','B4','B5','B6','B7','B8','C2','C3']);
for(const code of ['B4','B5']){
 w.SpecialPracticeUI.open();w.document.querySelector('[data-code='+code+']').click();
 assert.equal(w.document.querySelectorAll('.sp-question').length,5);
 assert.equal(w.document.querySelector('#spSet').options.length,50);
 assert.match(w.document.querySelector('h3').textContent,code==='B4'?/合并同类项/:/去括号/);
}
(async()=>{
for(const c of [cards[0],cards.find(c=>c.code==='A9'),cards.find(c=>c.code==='B1'),cards.find(c=>c.code==='C2'),cards.find(c=>c.code==='B4'),cards.find(c=>c.code==='B5'),...cards.filter(c=>['B6','B7','B8','C3'].includes(c.code))]){
 w.SpecialPracticeUI.start(c);if(c.code==='C3')assert.equal(w.document.querySelectorAll('.sp-axis').length,5);if(c.code==='B8')assert.match(w.document.querySelector('form').textContent,/已知/);const form=w.document.querySelector('form');c.answers.forEach((row,i)=>row.forEach((a,j)=>{if(c.code==='C2')form.querySelector('[name=q'+i+'][value='+a+']').checked=true;else form.elements['q'+i+'_'+j].value=a;}));form.dispatchEvent(new w.Event('submit',{cancelable:true}));assert.match(w.document.querySelector('#spResult').textContent,/5 \/ 5/);assert.match(w.document.querySelector('#spResult').textContent,/用时 \d+\.\d{2} 秒/);form.dispatchEvent(new w.Event('submit',{cancelable:true}));await new Promise(r=>setTimeout(r,0));
}
assert.equal(saves,206);w.SpecialPracticeUI.start(cards[0]);key='2';w.document.querySelector('form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(saves,206);assert.equal(w.document.querySelector('#specialPractice').textContent,'');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const home=new JSDOM(html).window.document;
assert.deepEqual(Array.from(home.querySelectorAll('#home .portal-num')).slice(0,7).map(x=>x.textContent),['A','B','C','D','E','F','G']);
const homeEntry=home.querySelector('#home .portal-card[data-go="specialPractice"]');
const menuEntry=home.querySelector('#studentGameMenu [data-go="specialPractice"]');
assert.equal(menuEntry.querySelector('span').textContent,'G');
assert.match(homeEntry.querySelector('p').textContent,/第4章解方程/);
assert.match(menuEntry.querySelector('small').textContent,/第4章解方程/);
assert.match(html,/specialPractice','mistakes'\]/);
assert.match(html,/window\.SpecialPracticeUI\?\.reset/);
console.log('PASS 4500 canonical answers, fraction simplification, pi coefficients, ABC, 18 modules, duplicate-submit and account-switch guards');

})().catch(e=>{console.error(e);process.exitCode=1;});

assert.ok(E.linearEqual('b+3a','3a+b'));assert.ok(!E.linearEqual('a+b+b','a+2b'));
