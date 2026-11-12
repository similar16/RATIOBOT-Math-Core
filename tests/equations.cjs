const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const site = path.resolve(process.env.SITE_DIR || 'site');
const feature = path.join(site, 'equation-practice');
const E = require(path.join(feature, 'equation-engine.js'));

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(feature, 'math-entry.js'), 'utf8'), sandbox);
const toInput = tex => sandbox.window.MathIsleMathEntry.toLegacy(tex, 'equation');
const rational = (n, d = 1) => ({ n: BigInt(n), d: BigInt(d) });
const linear = (a, b) => ({ a: typeof a === 'object' ? a : rational(a), b: typeof b === 'object' ? b : rational(b) });

const denominator = { focus: 'clear', variable: 'x', left: linear(rational(1, 2), rational(1, 2)), right: linear(rational(4, 3), 1) };
assert(E.checkStep(denominator, '3(x+1)', '8x+6').ok);
assert(E.checkStep(denominator, '6(x+1)', '16x+12').ok);
assert(E.checkStep(denominator, '8x+6', '3(x+1)').ok);
assert(!E.checkStep(denominator, '3(x+1)', '8x+1').ok);
assert(!E.checkStep(denominator, '0', '0').ok);
assert(!E.checkStep(denominator, '3(x+1)', '8x+6+1/2-1/2').ok);

const expand = { focus: 'expand', variable: 'x', left: linear(-3, -1), right: linear(0, 11) };
assert(E.checkStep(expand, '2-3x-3', '11').ok);
assert(E.checkStep(expand, '-3x-1', '11').ok);
assert(!E.checkStep(expand, '2-3x+3', '11').ok);
assert(!E.checkStep(expand, '2-3(x+1)', '11').ok);

const move = { focus: 'move', variable: 'x', isolated: [linear(-3, 0), linear(0, 9)] };
assert(E.checkStep(move, '2x-5x', '6+3').ok);
assert(E.checkStep(move, '9', '-3x').ok);
assert(!E.checkStep(move, '-3x', '6-3').ok);
assert(!E.checkStep(move, 'x', '-3').ok);

assert(E.checkNumber(toInput('-\\frac{2}{4}'), rational(-1, 2), 'x'));
assert(E.checkNumber('-0.5', rational(-1, 2), 'x'));
assert(E.checkNumber(toInput('-2\\frac{1}{3}'), rational(-7, 3), 'x'));
assert.throws(() => E.checkNumber('3/0', rational(0), 'x'), /分母不能为0/);
assert.throws(() => E.checkNumber('x-x+1', rational(1), 'x'), /填一个数/);
assert.throws(() => toInput('\\frac{2}{}'), /补全/);

let seed = 0x451fa33e;
function random() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 2 ** 32;
}

function satisfies(q) {
  function evaluate(p) {
    const n = p.a.n * q.answer.n * p.b.d + p.b.n * p.a.d * q.answer.d;
    return rational(n, p.a.d * q.answer.d * p.b.d);
  }
  const left = evaluate(q.left);
  const right = evaluate(q.right);
  return left.n * right.d === right.n * left.d;
}

for (const { id } of E.topics) {
  let previous = [];
  for (let set = 0; set < 150; set++) {
    const qs = E.makeSet(id, random, previous);
    assert.equal(qs.length, 5);
    assert.equal(new Set(qs.map(q => q.tex)).size, qs.length);
    assert(!qs.some(q => previous.some(old => old.tex === q.tex)));
    for (const q of qs) {
      assert(satisfies(q), q.tex);
      const last = q.lines.at(-1)?.tex || q.tex;
      const [unknown, value] = last.split('=');
      assert.equal(unknown, q.variable, q.tex);
      assert(E.checkNumber(toInput(value), q.answer, q.variable));
      const label = { clear: '去分母', expand: '去括号', isolate: '移项', move: '移项' }[q.focus];
      if (label) {
        const example = q.lines.find(line => line.label.startsWith(label));
        const [left, right] = example.tex.split('=').map(toInput);
        assert(E.checkStep(q, left, right).ok, q.tex + ' -> ' + example.tex);
      }
      if (q.focus === 'verify') {
        const [left, right] = q.values.map(value => toInput(E.numericTex(value)));
        const verdict = left === right ? 'yes' : 'no';
        assert(E.checkVerification(q, left, right, verdict).ok);
        assert(!E.checkVerification(q, left, right, verdict === 'yes' ? 'no' : 'yes').ok);
      }
      if (q.focus === 'property') {
        const value = q.operand.a.n ? q.variable : toInput(E.numericTex(q.operand.b));
        assert(E.checkProperty(q, q.operation, value));
        if (q.operation === 'divide') assert.throws(() => E.checkProperty(q, 'divide', '0'), /不能为0/);
      }
    }
    previous = qs;
  }
}
console.log('PASS 4,500 equation variants, reference steps, transformations and exact fraction entry');

const { JSDOM } = require('jsdom');

async function exerciseNavigation() {
  const dom = new JSDOM('<section id="specialPractice" class="active"></section>', {
    url: 'https://test.invalid/RATIOBOT-Math-Core/',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  const w = dom.window;
  try {
    const get = selector => w.document.querySelector(selector);
    const tick = () => new Promise(resolve => setTimeout(resolve, 5));
    const loads = [];
    const routes = [];
    let ready = false;
    let key = 'class|1';
    w.scrollTo = () => {};
    w.SpecialPracticeCards = [];
    w.SpecialPracticeEngine = {};
    w.katex = require('katex');
    w.RatioPracticeBridge = {
      ready: () => ready,
      key: () => key,
      profile: () => ({ economy: { modules: {} } }),
      go: route => routes.push(route),
    };
    w.MathfieldElement = w.HTMLElement;
    const append = w.document.head.append.bind(w.document.head);
    w.document.head.append = element => {
      append(element);
      const url = new URL(element.src || element.href);
      assert(url.pathname.startsWith('/RATIOBOT-Math-Core/equation-practice/'));
      if (process.env.SITE_DIR) assert.match(url.searchParams.get('v'), /^[0-9a-f]{12}$/);
      const name = path.basename(url.pathname);
      loads.push(name);
      queueMicrotask(() => {
        if (name === 'handwriting.js') w.MathIsleHandwriting = { mount() {}, pages: new Map() };
        else if (name.endsWith('.js')) w.eval(fs.readFileSync(path.join(feature, name), 'utf8'));
        element.onload();
      });
    };
    w.eval(fs.readFileSync(path.join(site, 'special-practice.js'), 'utf8'));

    w.SpecialPracticeUI.open();
    assert.equal(get('#spEquationPractice'), null);
    assert.equal(loads.length, 0);

    ready = true;
    w.SpecialPracticeUI.open();
    get('#spEquationPractice').click();
    await tick();
    assert.equal(loads.length, 5);
    assert.equal(w.document.querySelectorAll('.equation-topic').length, 6);

    seed = 0xa12de654;
    const [question] = E.makeSet('clear', random);
    seed = 0xa12de654;
    w.Math.random = random;
    get('[data-topic="clear"]').click();
    await tick();
    let keypad = get('.keypad-disclosure');
    assert.equal(keypad.open, true);
    assert.equal(keypad.querySelector('summary').textContent, '隐藏公式键盘');
    keypad.querySelector('summary').click();
    assert.equal(keypad.open, false);
    await tick();
    assert.equal(keypad.querySelector('summary').textContent, '显示公式键盘');

    const step = question.lines.find(line => line.label.startsWith('去分母'));
    const [left, right] = step.tex.split('=');
    get('#eq-left-math').value = left;
    get('#eq-right-math').value = right;
    get('#equation-form').requestSubmit();
    await tick();
    keypad = get('.keypad-disclosure');
    assert.equal(keypad.open, false, 'keep the keyboard hidden between steps');
    assert(get('#eq-value-math'));

    get('#eq-value-math').value = E.numericTex(question.answer);
    get('#equation-form').requestSubmit();
    get('#equation-next').click();
    await tick();
    keypad = get('.keypad-disclosure');
    assert.equal(keypad.open, false, 'keep the keyboard hidden between questions');
    keypad.querySelector('summary').click();
    assert.equal(keypad.open, true);
    await tick();
    assert.equal(keypad.querySelector('summary').textContent, '隐藏公式键盘');

    get('#spEquationBack').click();
    get('#spEquationPractice').click();
    await tick();
    get('[data-topic="simple"]').click();
    await tick();
    assert.equal(get('.keypad-disclosure').open, true, 'new groups default to open');
    assert.equal(loads.length, 5, 'a successful module load is reused');

    key = 'class|2';
    get('#equation-hint').click();
    assert.deepEqual(routes, ['account']);
    assert.equal(get('#equations'), null);
    assert.equal(get('#specialPractice').textContent, '');
    console.log('PASS authorized G-area entry, lazy loading, keypad visibility across steps and questions, and account switch cleanup');
  } finally {
    w.close();
  }
}
exerciseNavigation().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
