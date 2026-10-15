const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=process.env.SITE_DIR||'_site';
const E=require(path.resolve(root,'algebra-engine.js'));
const corpus=[
 ['-3x+2y-5x-7y','-8x-5y'],
 ['4a^2+3b^2+2ab-4a^2-2b^2-b^2','2ab'],
 ['5a-(2a-4b+1)','3a+4b-1'],
 ['6m-3(-m+2n)','9m-6n'],
 ['m-(n-(m+n))','2m'],
 ['(x+1)/2-(2x-3)/4','5/4'],
 ['-3/2a^2bc+1/2a^2bc','-a^2bc'],
 ['2(t^2-t-1)-(t^2-t-1)+3(t^2-t-1)','4t^2-4t-4']
];
for(const [src,dst] of corpus){assert.equal(E.canonical(E.parse(src)),E.canonical(E.parse(dst)),src);assert.equal(E.check(dst,dst).correct,true);}
assert.equal(E.check('x+x','2x').correct,false,'uncollected terms must be rejected');
assert.equal(E.check('2x+3y','3y+2x').correct,true,'reordered terms acceptable');
assert.equal(E.check('xy','yx').correct,true,'permuted variable letters acceptable');
assert.equal(E.check('xy^2','x^2y').correct,false,'degree alone does not determine like terms');
assert.equal(E.check('4a^2-4a^2','0').equivalent,true);
assert.equal(E.check('1/2x','x/2').equivalent,true);
assert.throws(()=>E.parse('(x+1)/(x+2)'),/常数分母/);
for(const module of Object.keys(E.MODULES))for(const difficulty of E.DIFFS)for(const coefficient of ['integer','fraction',...(module==='b3'||module==='b4'?['denominator']:[])]){
 let n=0;for(let i=0;i<60;i++){const q=E.generate({module,difficulty,coefficient});
 assert.equal(q.module,module);assert.equal(q.difficulty,difficulty);
 assert.equal(E.canonical(E.parse(q.expression)),E.canonical(E.parse(q.answer)),'answer mismatch: '+q.expression);
 assert.ok(E.check(q.answer,q.answer).correct,'canonical self-check: '+q.answer);
 assert.ok(q.meta.sourceTerms>0);n++;}
 console.log('algebra generated',module,difficulty,coefficient,n);
}
const html=fs.readFileSync(path.resolve(root,'index.html'),'utf8');
for(const name of ['algebra-engine.js','algebra-ui.js','algebra.css','RatioAlgebraBridge','algebra_progress'])assert.ok(html.includes(name)||name==='algebra_progress','missing '+name);
for(const name of ['algebra-ui.js','algebra.css'])assert.ok(fs.existsSync(path.resolve(root,name)),'missing asset '+name);
console.log('Algebra parser, canonical grading, generation and site integration: PASS');