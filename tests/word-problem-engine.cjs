const assert = require('node:assert/strict');
const path = require('node:path');
const E = require(path.resolve(process.env.SITE_DIR || 'site', 'word-problems/engine.js'));

assert(E.equivalent('1÷12', '1/12'));
assert(E.equivalent('0.1+0.2', '0.3'));
assert(E.equivalent('1+25%', '1.25'));
assert(E.equivalent('(1+25%)x', '1.25*x'));
assert(E.equivalent('−x+35', '35-x'));
assert(E.equivalent('(n+1)^2-n(n-1)', '3n+1', 'n'));
assert(E.equivalent('2(x+y)-x-y', 'x+y'));
assert(!E.equivalent('x', 'y'));
assert(!E.equivalent('3(x+13)', '3x+13'));
assert(!E.equivalent('1/0', '0'));
assert(!E.equivalent('1/(x+6)', '1/x'));
assert(!E.equivalent('0.08333', '1/12'));
assert(E.equivalent('\\frac{2(x+6)}{3}', '2*(x+6)/3'));
assert(E.equivalent('\\left(1+25\\%\\right)x', '1.25x'));
assert(E.equivalent('-x^2', '-(x*x)'));
assert(!E.equivalent('-x^2', '(-x)^2'));
for (const unsafe of ['alert(1)', 'globalThis', 'process.exit()', '1;2', 'constructor.constructor(1)', '<img>', 'Infinity', '2**3', '1e99', 'x^999999', '1'.repeat(1000)]) {
  assert(!E.inspect(unsafe).ok, unsafe);
}

const growth = { expr: '1+25%', result: '1.25' };
assert(E.checkDerivation('1+25%', growth).ok);
assert(E.checkDerivation('1+25/100', growth).ok);
assert(E.checkDerivation('25%+1=1.25', growth).ok);
assert(!E.checkDerivation('1+25%=1.2', growth).ok);
for (const shortcut of ['1.25', '5/4', '1+.25', '1+1/4']) {
  const verdict = E.checkDerivation(shortcut, growth);
  assert(!verdict.ok, shortcut);
  assert.equal(verdict.kind, 'source', shortcut);
}
// A verified complete result may be reused in a later cell; available pieces
// or an unrelated verified number cannot replace the original calculation.
const growthCell = { expr: '1+25%', result: '1+25%' };
assert(E.checkDerivation('1.25', { ...growthCell, allowedNumbers: ['1.25'] }).ok);
assert(E.checkDerivation('(1.250)', { ...growthCell, allowedNumbers: ['5/4'] }).ok);
assert(E.checkDerivation('1.25=5/4', { ...growthCell, allowedNumbers: ['1.25'] }).ok);
assert.equal(E.checkDerivation('1.25', growthCell).kind, 'source');
assert.equal(E.checkDerivation('1.25', { ...growthCell, allowedNumbers: ['1', '25', '100', '0.25'] }).kind, 'source');
assert.equal(E.checkDerivation('1+.25', { ...growthCell, allowedNumbers: ['1.25'] }).kind, 'source');
assert.equal(E.checkDerivation('1.2', { ...growthCell, allowedNumbers: ['1.2'] }).kind, 'math');
assert.equal(E.checkDerivation('1.25=1.2', { ...growthCell, allowedNumbers: ['1.25'] }).kind, 'math');
assert(E.checkDerivation('0.2', { expr: '4/20', allowedNumbers: ['1/5'] }).ok);
for (const notation of ['0.2*x', '(1/5)*x', 'x/5', '\\frac{x}{5}']) {
  assert(E.checkDerivation(notation, { expr: '(4/20)*x', allowedNumbers: ['1/5'] }).ok, notation + ' reuses the complete known rate');
}
assert(E.checkDerivation('1/5', { expr: '4/20', allowedNumbers: ['1/5'] }).ok);
assert.equal(E.checkDerivation('5-4', { expr: '20/20', allowedNumbers: ['1/5'] }).kind, 'source', 'a known denominator is not an independently known quantity');
assert.equal(E.checkDerivation('(5/25)*x', { expr: '(4/20)*x', allowedNumbers: ['1/5'] }).ok, true, 'an equivalent complete fraction remains the same verified number');
assert.equal(E.checkDerivation('(5-4)/5*x', { expr: '(4/20)*x', allowedNumbers: ['1/5'] }).kind, 'source', 'an untraced numerator computation is not fraction notation');
assert(E.hasNumberSources('x/5+0.2*x=4', ['4','20'], ['1/5']));
assert(!E.hasNumberSources('5*x=20', ['4','20'], ['1/5']), '5 is not itself available from the known fraction 1/5');
assert(!E.hasNumberSources('x/5=4', ['4','20'], []));
assert.equal(E.checkDerivation('0.2', { expr: '4/20', allowedNumbers: ['1', '5'] }).kind, 'source');
assert(E.checkDerivation('-0.25', { expr: '0-25%', allowedNumbers: ['-1/4'] }).ok);
assert.equal(E.checkDerivation('-0.25', { expr: '0-25%', allowedNumbers: ['1/4'] }).kind, 'source');
assert(E.checkDerivation('1.25x', { expr: '(1+25%)*x', allowedNumbers: ['1.25'] }).ok);
assert.equal(E.checkDerivation('1.25x', { expr: '(1+25%)*x', result: '(1+25%)*x' }).kind, 'source');
assert(E.checkDerivation('(1+25%)x', { expr: '(1+25%)*x' }).ok);
assert.equal(E.checkDerivation('0.9x', { expr: '0.15*6*x' }).kind, 'source');
assert(E.checkDerivation('6x*0.15', { expr: '0.15*6*x' }).ok);
assert(E.checkDerivation('1/12', { expr: '1/12', result: '1/12' }).ok);
assert(!E.checkDerivation('0.08333', { expr: '1/12', result: '1/12' }).ok);
assert(E.checkDerivation('x', { expr: 'x' }).ok);
assert(E.checkDerivation('3', { expr: '3' }).ok);
assert(E.checkDerivation('(45+x)/3', { expr: '(45+x)/3' }).ok);
assert(!E.checkDerivation('15+x/3', { expr: '(45+x)/3' }).ok);
assert.equal(E.checkDerivation('1/(x+6)', { expr: '1/(x+6)' }).kind, 'unsupported');
for (const expression of ['1+25%+z-z', '1+25%+x-x', '1+25%=1.25+y-y']) {
  assert.equal(E.checkDerivation(expression, growth).kind, 'variable', expression + ': cancelling an undeclared letter does not establish its source');
}
assert(E.checkDerivation('x+y', { expr:'x+y' }).ok, 'both explicitly expected letters remain valid');

const chicken = { left: '2*x+4*(35-x)', right: '94' };
assert(E.checkEquation('2x+4(35-x)=94', chicken).ok);
assert(E.checkEquation('94=2x+4(35-x)', chicken).ok);
assert(E.checkEquation('4x+8(35-x)=188', chicken).ok);
assert(E.checkEquation('2x=46', chicken).ok);
assert.equal(E.checkEquation('x=23', chicken).kind, 'model');
assert.equal(E.checkEquation('x+0=23', chicken).kind, 'model');
assert.equal(E.checkEquation('x+(35-x)=35', chicken).kind, 'constraint');
assert.equal(E.checkEquation('0=0', chicken).kind, 'constraint');
assert(!E.checkEquation('2x+4(35-x)=95', chicken).ok);
assert(!E.checkEquation('2y+4(35-y)=94', chicken).ok);
assert.equal(E.checkEquation('2x+4(35-x)+y=94+y', chicken).kind, 'variable');
assert.equal(E.checkEquation('2x+4(35-x)+z-z=94', chicken).kind, 'variable');
assert(E.checkEquation('x=10.5/(0.6+6*0.15)', { left: 'x', right: '10.5/(0.6+6*0.15)' }).ok);
assert(!E.checkEquation('45+x=39+x', { left: '45+x', right: '3*(13+x)' }).ok);
assert(E.checkEquation('13+x=(45+x)/3', { left: '45+x', right: '3*(13+x)' }).ok);
assert(E.checkEquation('5(t+0.5)=15t+1', { left: '5*(t+0.5)', right: '15*t+1' }, 't').ok);
assert(E.checkEquation('15t=5(t+0.5)+1', { left: '15*t', right: '5*(t+0.5)+1' }, 't').ok);
assert(!E.checkEquation('15t=5(t+0.5)+1', { left: '5*(t+0.5)', right: '15*t+1' }, 't').ok);
assert.equal(E.checkEquation('12/(x+6)+4/x=1', { left: '12/(x+6)+4/x', right: '1' }).kind, 'unsupported');
assert.equal(E.checkEquation('x*x=4', { left: 'x*x', right: '4' }).kind, 'unsupported');
assert(E.checkEquation('(n+1)^2-n(n-1)=50', { left: '3*n+1', right: '50' }, 'n').ok);

assert.equal(E.numeric('1/12+1/18'), '5/36');
assert.equal(E.numeric('2/4'), '1/2');
assert.equal(E.numeric('0'), '0');
assert.equal(E.numeric('x'), null);
assert.match(E.format('1/12'), /\\frac\{1\}\{12\}/);
assert.match(E.formatCalculation('1/12'), /1\\div 12/);
assert.match(E.format('1+25%'), /25\\%/);
assert.match(E.format('x^2'), /\^\{2\}/);
assert(!E.format('\\href{javascript:alert(1)}{click}').includes('\\href'));
const p = { id:'T',title:'测试',group:'测试',source:'自编',kind:'linear',stem:'12小时完成整项任务。',facts:[{id:'hours',text:'12小时',kind:'given'},{id:'whole',text:'整项记为1',kind:'convention'}],routes:[{id:'one',variable:'x',derivations:[{id:'rate',expr:'1/12',result:'1/12',sources:['whole','hours']}],table:{headers:['对象','效率'],rows:[{label:'甲',cells:[{expr:'1/12',given:true,sources:['rate']}]}]},closure:{sources:['whole']},equations:[],answers:[],checks:[],verdict:{correct:'valid'}}]};
assert.deepEqual(E.validateProblem(p), []);
const invalid = structuredClone(p); invalid.routes[0].derivations[0].sources = ['future'];
assert(E.validateProblem(invalid).some(x => x.includes('future')));
console.log('PASS word-problem engine: exact algebra, percent and rate provenance, safe parsing, modeling equations, rendered fractions and source references');

// Equal numerical values may describe different quantities; every derivation card still needs its calculation.
assert.equal(E.checkDerivation('15',{expr:'1800/60-15',result:'15',allowedNumbers:['15'],requireCalculation:true}).kind,'source');
assert(E.checkDerivation('1800/60-(45-30)',{expr:'1800/60-15',result:'15',allowedNumbers:['15'],sourceExpressions:['45-30'],requireCalculation:true}).ok);

assert.match(E.format('133100/157≈847.7707'), /\\frac.*\\approx/);
assert(!E.format('5<15').startsWith('\\text{'));
