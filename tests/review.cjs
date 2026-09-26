const assert=require('node:assert/strict'),E=require('../site/review-engine.js');
const today='2026-09-20';let seed=12345;const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
assert.equal(E.bank.length,47);for(const x of E.bank){assert.ok(x.parts.length>=5);for(let i=0;i<30;i++){const q=E.question(x,rng);assert.ok(q.blanks.length>=2&&q.blanks.length<=6);assert.equal(new Set(q.blanks).size,q.blanks.length);assert.ok(E.grade(q,q.blanks.map(n=>x.parts[n])).ok);}}
assert.deepEqual(E.batch({through:0,dates:{}},undefined,rng,today),[]);
const p={through:25,dates:Object.fromEntries(E.bank.map(x=>[x.id,x.order>=21?today:'2026-09-01']))};
for(let i=0;i<100;i++){const b=E.batch(p,undefined,rng,today);assert.equal(b.length,5);assert.ok(b.every(x=>x.order<=25));assert.ok(b.slice(0,2).every(x=>x.order>=21));assert.equal(new Set(b.map(x=>x.id)).size,5);}
const future={through:1,dates:{'ch2-1':'2026-09-21'}};assert.equal(E.eligible(future,undefined,today).length,0);
const extended=E.bank.concat(Array.from({length:5},(_,i)=>({id:'ch3-'+i,order:48+i,chapter:3,lesson:1})));const config={through:52,dates:Object.fromEntries(extended.map(x=>[x.id,'2026-09-01']))};for(let i=0;i<100;i++){const b=E.batch(config,extended,rng,today);assert.ok(b.filter(x=>x.chapter===3).length>=4);}
config.through=48;const sparse=E.batch(config,extended,rng,today);assert.ok(sparse.every(x=>[2,3].includes(x.chapter)));
assert.equal(E.normalize(' Ａ × b '),'A×b');assert.equal(E.normalize('1<=|a|<10'),'1≤|a|<10');assert.notEqual(E.normalize('1<|a|<10'),E.normalize('1≤|a|<10'));
const profile=()=>({games:0,questions:0,history:[],economy:{credits:0,lifetimeCredits:0,modules:{},daily:{},checkin:{days:{}}}});
const s=profile();let streak=0;function answer(id,wrong=false){const q=E.question(E.bank[37],rng),run={id,q,started:Date.now(),streak,repair:true,target:'2026-09-19'},ans=q.blanks.map(n=>q.item.parts[n]);if(wrong)ans[0]='错误';const r=E.settle(s,run,ans,{today});streak=r.streak;return {r,run,ans};}
for(let i=0;i<4;i++)assert.equal(answer('a'+i).r.repaired,'');assert.equal(answer('wrong',true).r.streak,0);assert.equal(s.economy.checkin.days['2026-09-19'],undefined);
for(let i=0;i<4;i++)assert.equal(answer('b'+i).r.repaired,'');const last=answer('win');assert.equal(last.r.repaired,'2026-09-19');assert.equal(s.economy.checkin.days['2026-09-19'].points,0);assert.ok(E.makeupTarget(s,today).error);assert.equal(E.settle(s,last.run,last.ans,{today}).duplicate,true);assert.ok(s.economy.credits<=40);assert.equal(s.history[0].game,'knowledge');
const cap=profile();cap.economy.checkin.days[today]={points:39};const q=E.question(E.bank[0],rng),r=E.settle(cap,{id:'cap',q,started:Date.now()},q.blanks.map(n=>q.item.parts[n]),{today});assert.equal(r.gain,1);assert.equal(cap.economy.credits,1);assert.equal(cap.economy.checkin.days[today].points,40);assert.equal(cap.economy.events.midAutumn2026.days[today].knowledgeBlanks,q.blanks.length);
console.log('PASS review: all 47 cards, random 2–6 blanks, locked/future exclusion, recent-first, 4/5 chapter quota, sparse fallback, strict grading, 5-in-row repair/reset, duplicate prevention, 40-R cap, Mid-Autumn blank counter');

const manifest=require('./review-source-manifest.json'),{createHash}=require('node:crypto');
for(const expected of manifest){const card=E.bank.find(x=>x.id===expected.id);assert.equal(card.page,expected.page);assert.equal(createHash('sha256').update(card.parts.join('')).digest('hex'),expected.sha256,'Exact DOCX wording and punctuation: '+card.id);}
console.log('PASS all 47 reconstructed prompts match DOCX source hashes and textbook pages');

for(const [expected,answer] of [['零','0'],['0','零'],['不等于0','不等于零'],['零','０']]){const q={item:{parts:['',expected,'']},blanks:[1]};assert.equal(E.grade(q,[answer]).ok,true);assert.equal(E.grade(q,['00']).ok,false);}
console.log('PASS zero aliases in both directions and phrases; wrong numeric answers remain rejected');
