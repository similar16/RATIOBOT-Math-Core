/* Source-by-source gates for textbook and teaching-guide modeling activities. */
'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const base = path.resolve(process.env.SITE_DIR || 'site', 'word-problems');
const E = require(path.join(base, 'engine.js'));
const l7l8 = require(path.join(base, 'data-l7-l8.js'));
const rest = require(path.join(base, 'data-l9-review.js'));
const textbookFiles=['data-textbook-intro.js','data-textbook-applications.js','data-textbook-review.js'];
const textbook=textbookFiles.flatMap(file=>require(path.join(base,file)));
const manifest=require('./word-problem-textbook-manifest.json');
const sourceIndex=require(path.join(base,'textbook-index.js'));
const problems = [...l7l8, ...rest, ...textbook];
const byId = new Map(problems.map(p => [p.id, p]));
const expectedIds = [
  'L7-P1','L7-P2','L7-P3','L7-T1','L7-T2','L7-H1','L7-H2','L7-H3',
  'L8-P1','L8-P1-V1','L8-P1-V2','L8-P1-V3',
  'L8-P2-Q1','L8-P2-Q2','L8-P2-Q3','L8-P2-Q4','L8-P2-Q5',
  'L8-P2-V1','L8-P2-V2','L8-P2-V3','L8-T1','L8-T2','L8-H1','L8-H2','L8-H3',
  ...Array.from({length:10},(_,i)=>'G9-'+String(i+1).padStart(2,'0')),
  ...Array.from({length:10},(_,i)=>'G10-'+String(i+1).padStart(2,'0')),
  ...Array.from({length:10},(_,i)=>'S'+String(i+1).padStart(2,'0')),
  ...manifest.items.filter(i=>i.coverage==='added').map(i=>i.moduleId),
  ...manifest.boundaryReferences.map(i=>i.moduleId)
];
assert.equal(l7l8.length, 25);
assert.equal(rest.length, 30);
assert.equal(problems.length, 106);
assert.equal(byId.size, problems.length, 'No duplicated source entry IDs');
assert.deepEqual([...byId.keys()].sort(), expectedIds.sort());

const count = { routes:0, derivations:0, writableCells:0, equations:0, answers:0, checks:0, boundaryCells:0 };
// Textual facts can use ordinary Chinese counts: 两个月, 八折 and 十折 are real sources.
const chineseDigits = { '一':'1','二':'2','两':'2','三':'3','四':'4','五':'5','六':'6','七':'7','八':'8','九':'9','十':'10' };
function textNumbers(text) {
  const values = new Set();
  for (const number of String(text).match(/\d+(?:\.\d+)?/g) || []) values.add(E.numeric(number));
  for (const char of String(text)) if (chineseDigits[char]) values.add(chineseDigits[char]);
  return values;
}
function expressionNumbers(expression) {
  const info = E.inspect(expression);
  return info.ok ? info.numericLiterals : [];
}
function declaredVariables(route) {
  return new Set([route.variable, ...(route.additionalVariables || []).map(v => v.variable)]);
}
function resultLiterals(derivations) {
  return [...new Set(derivations.flatMap(d => [...expressionNumbers(d.expr), ...expressionNumbers(d.result ?? d.expr)]))];
}
function routeFor(id, routeId) {
  const problem = byId.get(id);
  assert(problem, id);
  const route = routeId ? problem.routes.find(r => r.id === routeId) : problem.routes[0];
  assert(route, id + '/' + routeId);
  return route;
}
function cellFor(id, expr, routeId) {
  const route = routeFor(id, routeId);
  const cell = route.table.rows.flatMap(row => row.cells).find(c => c.expr === expr);
  assert(cell, id + ' must retain source expression ' + expr);
  return cell;
}
function substitute(expression, variable, value) {
  return expression.replace(new RegExp(variable, 'g'), '(' + value + ')');
}

for (const problem of problems) {
  assert.deepEqual(E.validateProblem(problem), [], problem.id + ' schema/source references');
  assert.match(problem.source, /(?:《教学设计与指导》|《数学 七年级上册》苏科版2026，)\d+(?:[—、]\d+)?页/, problem.id + ' source pages');
  assert(problem.stem.length >= 15, problem.id + ' has a self-contained prompt');
  const facts = new Map(problem.facts.map(f => [f.id, f]));
  for (const route of problem.routes) {
    count.routes++;
    const context = problem.id + '/' + route.id;
    const available = new Map([['unknown', new Set()]]);
    for (const fact of problem.facts) available.set(fact.id, textNumbers(fact.text));
    const vars = declaredVariables(route);
    for (const derivation of route.derivations || []) {
      count.derivations++;
      const allowed = new Set(derivation.sources.flatMap(id => [...(available.get(id) || [])]));
      for (const literal of expressionNumbers(derivation.expr)) {
        assert(allowed.has(literal), context + '/' + derivation.id + ': unexplained literal ' + literal);
      }
      const verdict = E.checkDerivation(derivation.expr, derivation, route.variable);
      assert(verdict.ok, context + '/' + derivation.id + ': canonical derivation ' + verdict.message);
      assert(E.equivalent(derivation.expr, derivation.result ?? derivation.expr), context + '/' + derivation.id + ': arithmetic');
      assert(!E.formatCalculation(derivation.expr).startsWith('\\text{'), context + ': derivation renders as mathematical notation');
      available.set(derivation.id, new Set([
        ...derivation.sources.flatMap(id => [...(available.get(id) || [])]),
        ...expressionNumbers(derivation.expr),
        ...expressionNumbers(derivation.result ?? derivation.expr)
      ]));
    }
    for (const row of route.table.rows) for (const cell of row.cells) {
      if (cell.expr == null) continue;
      const location = context + '/' + row.label + '/' + cell.expr;
      assert(!E.format(cell.expr).startsWith('\\text{'), location + ': renders as mathematical notation');
      const info = E.inspect(cell.expr);
      if (!info.ok) {
        assert.equal(problem.kind, 'boundary');
        assert.equal(info.kind, 'unsupported');
        assert(route.discussion && route.equations.length === 0 && route.answers.length === 0);
        const allowed = new Set(cell.sources.flatMap(id => [...(available.get(id) || [])]));
        for (const literal of textNumbers(cell.expr)) assert(allowed.has(literal), location + ': even boundary expressions need numeric sources');
        count.boundaryCells++;
        continue;
      }
      for (const variable of info.variables) assert(vars.has(variable), location + ': undeclared variable ' + variable);
      const allowed = new Set(cell.sources.flatMap(id => [...(available.get(id) || [])]));
      for (const literal of info.numericLiterals) assert(allowed.has(literal), location + ': unexplained literal ' + literal);
      if (!cell.given) {
        count.writableCells++;
        const verdict = E.checkDerivation(cell.expr, { expr:cell.expr }, route.variable);
        assert(verdict.ok, location + ': canonical cell input must be accepted: ' + verdict.message);
      }
    }
    for (const [i,equation] of (route.equations || []).entries()) {
      count.equations++;
      const variable = equation.variable || route.variable;
      assert(vars.has(variable), context + ': equation variable declared');
      const canonical = equation.left + '=' + equation.right;
      const verdict = E.checkEquation(canonical, equation, variable);
      assert(verdict.ok, context + ': canonical modeling equation ' + canonical + ' / ' + verdict.message);
      // The two chase branches each solve their own x; the two shirts independently solve x and y.
      let answerIndex = equation.answerIndex ?? 0;
      if (problem.id === 'L8-P2-Q4' || problem.id === 'L8-P2-V3' || problem.id === 'L8-H1') answerIndex = i;
      if(equation.modelOnly){assert(route.modelOnly&&route.answers.length===0,context+': model-only task does not invent a numerical population');continue;}
      const answer = route.answers[answerIndex];
      assert(answer, context + ': a numerical solution accompanies the modeled equation');
      assert(E.equivalent(substitute(equation.left, variable, answer.expr), substitute(equation.right, variable, answer.expr)), context + ': solution substitution for ' + canonical);
    }
    for (const answer of route.answers || []) {
      count.answers++;
      assert.notEqual(E.numeric(answer.expr), null, context + ': answer is an exact number');
      assert(!E.format(answer.expr).startsWith('\\text{'), context + ': answer notation renders');
    }
    for (const check of route.checks || []) {
      count.checks++;
      assert(E.equivalent(check.expr, check.result), context + ': check ' + check.text);
    }
    if (['open','boundary'].includes(problem.kind)) assert(route.discussion, context + ': open work needs an explicit discussion prompt');
  }
}

// Real content regressions for the user's requirement: correct value without its origin is incomplete.
for (const [id, expression, shortcut] of [
  ['L7-P1','0.15*6*x','0.9*x'],
  ['L7-T2','19+(20-x)','39-x'],
  ['L7-H2','(60-x)-10','50-x'],
  ['L8-P1','(1.5*x)*0.8','1.2*x'],
  ['S04','0.5*200','100'],
  ['S08','450-200','250'],
  ['S08','0.7*(450-200)','175'],
  ['S09','(800-x)-450','350-x']
]) {
  const cell = cellFor(id, expression);
  const verdict = E.checkDerivation(shortcut, {expr:cell.expr});
  assert(!verdict.ok && verdict.kind === 'source', id + ': unexplained shortcut must request its origin: ' + shortcut);
}

const blackGrowth = routeFor('G9-03').derivations.find(d => d.expr === '3*1');
assert(blackGrowth, 'Black-chess growth is derived from three edges and one added point each');
assert.equal(E.checkDerivation('3', blackGrowth).kind, 'source');
assert(byId.get('S01').facts.filter(f => f.id !== 'equation').every(f => f.kind === 'example'), 'Authored notebook story must be labeled example');
assert.equal(byId.get('G9-05').facts.find(f => f.id === 'sample').kind, 'example');

const shirts = routeFor('L8-H1');
assert.deepEqual(shirts.equations.map(e=>e.variable), ['x','y']);
assert(shirts.additionalVariables.some(v => v.variable === 'y'));
assert(byId.get('L8-H1').facts.some(f => f.kind === 'convention' && f.text.includes('1')));
for (const [expr,result] of [['1+25%','1.25'],['1-25%','0.75']]) {
  const derivation = shirts.derivations.find(d => d.expr === expr);
  assert(derivation, 'Both gain and loss must derive the whole-plus/minus-percent multiplier');
  assert(E.checkDerivation(expr, derivation).ok);
  assert.equal(E.checkDerivation(result, derivation).kind, 'source');
}

const work = routeFor('G10-02','phases');
assert(byId.get('G10-02').facts.some(f => f.id === 'whole' && f.kind === 'convention'));
for (const hours of [18,12]) {
  const derivation = work.derivations.find(d => d.expr === '1/'+hours);
  assert(derivation && derivation.sources.includes('whole'));
  assert(E.checkDerivation('1÷'+hours, derivation).ok);
  assert.match(E.formatCalculation(derivation.expr), /\\div/);
}

// A completed derivation may be used later: 4÷20=1/5 justifies x/5 in the printed-work row.
const novel = routeFor('G10-10');
const novelCell = cellFor('G10-10','(4/20)*x');
assert.equal(E.checkDerivation('x/5',{expr:novelCell.expr}).kind,'source');
assert(E.checkDerivation('x/5',{expr:novelCell.expr,allowedNumbers:resultLiterals(novel.derivations)}).ok,
  'UI must pass completed derivation literal values when a justified equivalent expression is used');

assert.equal(E.numeric(routeFor('L7-H3').answers[0].expr),'12','Aviation club original count is 12, not 18');
assert.equal(E.numeric(routeFor('G10-10').answers[0].expr),'6','Novel printing uses the lower-volume workload');
assert.deepEqual(routeFor('L8-P2-Q4').answers.map(a=>E.numeric(a.expr)),['3/20','7/20']);
assert.deepEqual(routeFor('L8-P2-V3').answers.map(a=>E.numeric(a.expr)),['7/10','3/10']);
assert.equal(routeFor('L8-P2-Q4').verdict.correct,'multiple');
assert.equal(routeFor('G9-03').verdict.correct,'impossible');
assert.equal(E.numeric(routeFor('G9-03').answers[0].expr),'49/3');
assert.equal(routeFor('S06').verdict.correct,'multiple');
assert(routeFor('S06').discussion && routeFor('S06').equations.length === 0);
assert.equal(byId.get('G10-04').kind,'boundary');
assert.equal(count.boundaryCells,4,'All variable-denominator cells remain explicit discussion, with traceable data');
assert.equal(E.checkEquation('x+(35-x)=35',routeFor('G10-01','chicken').equations[0]).kind,'constraint');
assert.equal(E.checkEquation('45+x=39+x',routeFor('L7-P3').equations[0]).ok,false);


// Every source position is represented, including repeated original questions and separate boundary references.
assert.equal(manifest.items.length,80);
assert.equal(new Set(manifest.items.map(i=>i.groupSerial)).size,71);
assert.equal(new Set(manifest.items.map(i=>i.textbookItemId)).size,80);
assert.equal(manifest.items.filter(i=>i.coverage==='added').length,50);
assert.equal(sourceIndex.items.length,80);
for(const item of [...manifest.items,...manifest.boundaryReferences]){
 const problem=byId.get(item.moduleId);assert(problem,item.textbookItemId+' is missing from the module');
 if(item.coverage!=='existing')assert.equal(problem.textbookItemId,item.textbookItemId);
 const position=[...sourceIndex.items,...sourceIndex.references].find(p=>p.id===item.textbookItemId);
 assert(position,item.textbookItemId+' source location is missing');
 assert.equal(position.problemId,item.moduleId);
 assert.deepEqual(position.pages,item.printedPages);
 assert.equal(position.reference,item.coverage==='reference');
}
assert.equal(sourceIndex.groupCount,71);
assert.equal(sourceIndex.references.length,1);
assert.equal(byId.get('TB-I11').routes.find(r=>r.id==='original-two').verdict.correct,'boundary');
assert.equal(byId.get('TB-I14').routes[0].modelOnly,true);
assert(E.checkEquation('n=84748016*15.21%',byId.get('TB-I14').routes[0].equations[0],'n').ok,
 'The population task accepts the original product model without inventing an exact integer population');

console.log('PASS word-problem content:',JSON.stringify({problems:problems.length,...count}));
console.log('Verified source references, explicit rate/percent derivations, unsimplified table inputs, all normal equations and answers, branching completeness and discussion boundaries.');
