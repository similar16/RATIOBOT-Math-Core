const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=process.env.SITE_DIR||'site',E=require(path.resolve(root,'special-practice-engine.js')),scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'special-practice-data.js'),'utf8'),scope);const cards=scope.window.SpecialPracticeCards;
assert.equal(cards.length,140);assert.equal(new Set(cards.map(c=>c.id)).size,140);assert.equal(new Set(cards.map(c=>c.code)).size,14);
for(const c of cards){assert.equal(c.questions.length,5);assert.equal(c.answers.length,5);assert.deepEqual(Array.from(E.grade(c,c.answers)),[true,true,true,true,true],c.id);for(const q of c.questions)if(c.code==='B1')assert.doesNotMatch(q,/\^\{1\}|\^1(?!\d)/);if(c.code==='C2'){assert.ok(c.questions.every(q=>!/[a-z][a-z]|z|\\times/.test(q)));assert.ok(c.answers.every(a=>/^[ABC]$/.test(a[0])));}}
assert.ok(E.equal('−0.5','-1/2'));assert.ok(E.equal('3pi','3π'));assert.ok(E.equal('-pi','-1π'));assert.ok(!E.equal('2/4','1/2',true));assert.ok(!E.equal('1/0','1'));assert.ok(!E.equal('','0'));assert.ok(!E.equal('1+1','2'));assert.ok(!E.equal('1*2','12'));assert.ok(E.equal('3*pi','3π'));assert.ok(E.equal('-3/4','-3/4',true));
assert.ok(E.linearEqual('3+2x','2x+3'));assert.ok(E.linearEqual('−x+2','2-x'));assert.ok(E.linearEqual('2*x+3','2x+3'));
for(const bad of ['x+x+3','2(x+3)','x2','2x3','x*x','x/0','0x+3','2x-3','alert(1)',''])assert.ok(!E.linearEqual(bad,'2x+3'),bad);
assert.ok(!E.linearEqual('x-x','0'));assert.ok(E.linearEqual('0','0'));
const {JSDOM}=require('jsdom'),d=new JSDOM('<section id="specialPractice"></section>',{url:'https://test.invalid',runScripts:'outside-only'}),w=d.window;
w.SpecialPracticeCards=cards;w.SpecialPracticeEngine=E;w.katex=require('katex');w.confirm=()=>true;
let key='1',ready=true,saves=0;const p={economy:{modules:{}}};w.RatioPracticeBridge={ready:()=>ready,key:()=>key,profile:()=>p,go:()=>{},sync:async()=>true,complete:r=>{saves++;assert.equal(r.correct,5);}};
w.eval(fs.readFileSync(path.join(root,'special-practice.js'),'utf8'));
w.SpecialPracticeUI.open();assert.equal(w.document.querySelectorAll('[data-code]').length,14);
assert.deepEqual(Array.from(w.document.querySelectorAll('[data-code]')).map(x=>x.dataset.code),['A1','A3','A4','A5','A6','A7','A8','A9','B1','B2','B3','B4','B5','C2']);
for(const code of ['B4','B5']){
 w.SpecialPracticeUI.open();w.document.querySelector('[data-code='+code+']').click();
 assert.equal(w.document.querySelectorAll('.sp-question').length,5);
 assert.equal(w.document.querySelector('#spSet').options.length,10);
 assert.match(w.document.querySelector('h3').textContent,code==='B4'?/合并同类项/:/去括号/);
}
(async()=>{
for(const c of [cards[0],cards.find(c=>c.code==='A9'),cards.find(c=>c.code==='B1'),cards.find(c=>c.code==='C2'),cards.find(c=>c.code==='B4'),cards.find(c=>c.code==='B5')]){
 w.SpecialPracticeUI.start(c);const form=w.document.querySelector('form');c.answers.forEach((row,i)=>row.forEach((a,j)=>{if(c.code==='C2')form.querySelector('[name=q'+i+'][value='+a+']').checked=true;else form.elements['q'+i+'_'+j].value=a;}));form.dispatchEvent(new w.Event('submit',{cancelable:true}));assert.match(w.document.querySelector('#spResult').textContent,/5 \/ 5/);form.dispatchEvent(new w.Event('submit',{cancelable:true}));await new Promise(r=>setTimeout(r,0));
}
assert.equal(saves,6);w.SpecialPracticeUI.start(cards[0]);key='2';w.document.querySelector('form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(saves,6);assert.equal(w.document.querySelector('#specialPractice').textContent,'');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.ok(!html.includes('12类专项'));assert.match(html,/新增 B4 合并同类项、B5 去括号/);const home=new JSDOM(html).window.document;assert.deepEqual(Array.from(home.querySelectorAll('#home .portal-num')).slice(0,7).map(x=>x.textContent),['A','B','C','D','E','F','G']);assert.equal(home.querySelector('#studentGameMenu [data-go="specialPractice"] span').textContent,'G');assert.match(html,/data-go="specialPractice"/);assert.match(html,/specialPractice'\]/);assert.match(html,/window\.SpecialPracticeUI\?\.reset/);
console.log('PASS 700 canonical answers, fraction simplification, pi coefficients, ABC, 14 modules, duplicate-submit and account-switch guards');

})().catch(e=>{console.error(e);process.exitCode=1;});
