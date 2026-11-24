const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const site = path.resolve(process.env.SITE_DIR || 'site', 'word-problems');
const E = require(path.join(site, 'engine.js'));
const A = require(path.join(site, 'table-alternatives.js'));
const problems = [
  'data-l7-l8', 'data-l9-review', 'data-textbook-intro', 'data-textbook-applications',
  'data-textbook-review', 'data-pep-foundations', 'data-pep-applications', 'data-pep-review', 'data-chapter-2021'
].flatMap(name => require(path.join(site, name + '.js')));
const byId = new Map(problems.map(problem => [problem.id, problem]));

// This substitution is ONLY a regression oracle. Production options() is an
// explicit registry lookup and never reads equations, answers or solved values.
function valueAt(expression, bindings) {
  const normalized = E.normalize(expression);
  return E.numeric(normalized.replace(/[a-z]/g, variable => {
    assert.notEqual(bindings[variable], undefined, 'Test has no binding for ' + variable);
    return '(' + bindings[variable] + ')';
  }));
}
function solutionsForTest(route) {
  const bindings = {};
  for (const equation of route.equations || []) {
    const difference = '(' + equation.left + ')-(' + equation.right + ')';
    const variables = E.inspect(difference).variables;
    if (!variables || variables.length !== 1) continue;
    const variable = variables[0];
    const atZero = valueAt(difference, { [variable]: '0' });
    const atOne = valueAt(difference, { [variable]: '1' });
    if (atZero == null || atOne == null) continue;
    const coefficient = E.numeric('(' + atOne + ')-(' + atZero + ')');
    if (coefficient === '0') continue;
    const solution = E.numeric('-(' + atZero + ')/(' + coefficient + ')');
    assert.notEqual(solution, null);
    if (bindings[variable] != null) assert.equal(bindings[variable], solution, 'A registry route must not combine distinct branch solutions');
    bindings[variable] = solution;
    assert.equal(valueAt(difference, { [variable]: solution }), '0', 'The test substitution must solve the equation exactly');
  }
  return bindings;
}

const records = A.entries();
const usedProblems = new Set();
const usedRoutes = new Set();
const targets = new Set();
const seen = new Set();
let checkedEquations = 0;
for (const record of records) {
  const { problemId, routeId, rowIndex, cellIndex, expr, sources, explain, closureSources, closureHint } = record;
  const label = [problemId, routeId, rowIndex, cellIndex, expr].join('/');
  assert(!seen.has(label), 'Duplicate alternative: ' + label);
  seen.add(label);
  const problem = byId.get(problemId);
  assert(problem, label + ': problem exists');
  const route = problem.routes.find(route => route.id === routeId);
  assert(route, label + ': route exists');
  const cell = route.table.rows[rowIndex]?.cells[cellIndex];
  assert(cell && !cell.given && cell.note == null, label + ': target is an editable quantity');
  const facts = new Set(problem.facts.map(fact => fact.id));
  const refs = new Set(['unknown', ...facts, ...(route.derivations || []).map(derivation => derivation.id)]);
  assert(sources.length > 0 && typeof explain === 'string' && explain.length > 5, label + ': source explanation exists');
  for (const source of sources) assert(refs.has(source), label + ': source exists: ' + source);
  assert(closureSources.length > 0 && closureHint.length > 5, label + ': independent closure guidance exists');
  for (const source of closureSources) assert(facts.has(source), label + ': closure is an actual condition: ' + source);
  const parsed = E.inspect(expr);
  assert(parsed.ok, label + ': supported exact expression');
  const declared = new Set([route.variable, ...(route.additionalVariables || []).map(variable => variable.variable)]);
  for (const variable of parsed.variables) assert(declared.has(variable), label + ': variable keeps this route meaning: ' + variable);
  const alternatives = A.options(problem, route, rowIndex, cellIndex);
  assert(alternatives.some(item => item.expr === expr), label + ': API exposes authored entry');
  const accepted = E.checkTableCell(expr, { ...cell, alternatives, requiredDerivations: [] }, route.variable);
  assert(accepted.ok, label + ': explicit expression is accepted: ' + accepted.message);
  const bindings = solutionsForTest(route);
  assert.equal(valueAt(expr, bindings), valueAt(cell.expr, bindings), label + ': same quantity under the problem conditions');
  // For one-variable cells, equating the two representations must reproduce
  // an independent modeling equation, rather than merely agree at a sample.
  const difference = E.inspect('(' + cell.expr + ')-(' + expr + ')');
  if (difference.variables.length === 1 && !E.equivalent(cell.expr, expr)) {
    const equation = route.equations.find(equation => {
      const vars = E.inspect('(' + equation.left + ')-(' + equation.right + ')').variables;
      return vars.length === 1 && vars[0] === difference.variables[0];
    });
    assert(equation, label + ': original independent equation exists');
    const verified = E.checkEquation(cell.expr + '=' + expr, { ...equation, allowSolved: true }, route.variable);
    assert(verified.ok, label + ': representations yield original condition: ' + verified.message);
    checkedEquations++;
  }
  usedProblems.add(problemId);
  usedRoutes.add(problemId + '/' + routeId);
  targets.add([problemId, routeId, rowIndex, cellIndex].join('/'));
}

function options(problemId, routeId, row, cell) {
  const problem = byId.get(problemId);
  const route = problem.routes.find(route => route.id === routeId);
  return { problem, route, alternatives: A.options(problem, route, row, cell), cell: route.table.rows[row].cells[cell] };
}
const jacket = options('L8-P1', 'cost', 0, 2);
assert.equal(jacket.alternatives[0].expr, 'x+96');
assert.deepEqual(jacket.alternatives[0].sources, ['unknown', 'profit']);
assert.deepEqual(jacket.alternatives[0].closureSources, ['markup', 'discount']);
assert(!E.equivalent('(1.5*x)*0.8', 'x+96'), 'Different conditions, not a polynomial identity');
assert(E.checkTableCell('96+x', { ...jacket.cell, alternatives: jacket.alternatives, requiredDerivations: [] }).ok);
for (const wrong of ['576', 'x+95', '2*x-384', 'x+96+y-y']) {
  assert(!E.checkTableCell(wrong, { ...jacket.cell, alternatives: jacket.alternatives, requiredDerivations: [] }).ok,
    'No acceptance from a solved answer or an arbitrary agreeing expression: ' + wrong);
}
assert.equal(E.checkEquation('(x+96)-x=96', jacket.route.equations[0]).kind, 'constraint', 'An alternative cannot turn an identity into a modeling equation');

const rabbitLegs = options('G10-01', 'chicken', 1, 2);
assert(rabbitLegs.alternatives.some(item => item.expr === '94-2*x' && item.sources.includes('feet')));
const rabbitCount = options('G10-01', 'rabbit', 1, 1);
assert(rabbitCount.alternatives.every(item => !E.inspect(item.expr).variables.includes('x')), 'Rabbit route keeps y as rabbit count');
assert(options('L7-H1', 'son', 1, 0).alternatives.length === 0, 'A column explicitly asking for age-difference representation is not swapped with the multiplier column');

// Existing constants given in the statement may appear in a target expression;
// a guessed final value for an unknown-derived cell is never auto-registered.
assert(options('PEP-P048', 'main', 2, 1).alternatives.some(item => item.expr === '144' && item.sources.includes('sale')));
const beforePoison = A.options(jacket.problem, jacket.route, 0, 2);
const poisonedProblem = { ...jacket.problem, answers: new Proxy({}, { get() { throw Error('Production code read answers'); } }) };
const poisonedRoute = { ...jacket.route };
for (const key of ['answers', 'equations', 'checks', 'steps']) {
  Object.defineProperty(poisonedRoute, key, { get() { throw Error('Production code read ' + key); } });
}
assert.deepEqual(A.options(poisonedProblem, poisonedRoute, 0, 2), beforePoison);
beforePoison[0].sources.push('made-up');
beforePoison[0].closureSources.length = 0;
beforePoison[0].expr = '999';
assert.deepEqual(A.options(jacket.problem, jacket.route, 0, 2), jacket.alternatives, 'Callers cannot mutate the registry');
const changedRecords = A.entries();
changedRecords[0].sources.length = 0;
assert(A.entries()[0].sources.length > 0, 'Audit copies also protect source metadata');
assert.deepEqual(A.options({}, {}, 0, 0), []);
assert.deepEqual(A.options(jacket.problem, jacket.route, -1, 2), []);
assert.deepEqual(A.options(jacket.problem, jacket.route, 0.5, 2), []);

// Entire catalog traversal protects row ownership and exclusions. These ranges
// need case-specific UI, open-model review, or only identity-preserving algebra.
const noCrossConditionRoutes = [
  ['L7-H1','son'], ['TB-I15','standard'],
  ['L8-P2-Q4','both-orders'], ['L8-P2-V3','both-orders'], ['PEP-P050','main'],
  ['PEP-P052','main'], ['PEP-P053','main'], ['PEP-P054','main'], ['PEP-P064','main'],
  ['PEP-P066','main'], ['G10-04','time'], ['PEP-P068','main']
];
for (const [problemId, routeId] of noCrossConditionRoutes) {
  assert(!usedRoutes.has(problemId + '/' + routeId), 'Do not silently merge case or column meanings: ' + problemId);
}
let reviewedRoutes = 0;
for (const problem of problems) for (const route of problem.routes) {
  reviewedRoutes++;
  for (const [rowIndex, row] of route.table.rows.entries()) for (const [cellIndex, cell] of row.cells.entries()) {
    const items = A.options(problem, route, rowIndex, cellIndex);
    if (cell.given || cell.note != null) assert.deepEqual(items, [], 'Readonly cells keep their role');
    else for (const item of items) assert(records.some(record => record.problemId === problem.id && record.routeId === route.id && record.rowIndex === rowIndex && record.cellIndex === cellIndex && record.expr === item.expr));
  }
}

// The same dependency-free module must work in the static browser entry.
const browser = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(site, 'table-alternatives.js'), 'utf8'), browser);
assert.equal(typeof browser.window.RatioWordProblemTableAlternatives.options, 'function');
assert.equal(browser.window.RatioWordProblemTableAlternatives.entries().length, records.length);
console.log('PASS table alternatives: reviewed ' + problems.length + ' problems / ' + reviewedRoutes + ' routes; '
  + records.length + ' authored alternatives in ' + targets.size + ' cells / ' + usedProblems.size + ' problems / '
  + usedRoutes.size + ' routes; ' + checkedEquations + ' independent-equation checks; source IDs, declared variables, route meanings and no-solver runtime verified');
