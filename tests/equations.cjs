const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createHash } = require('node:crypto');
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

function satisfies(q) {
  function evaluate(p) {
    const n = p.a.n * q.answer.n * p.b.d + p.b.n * p.a.d * q.answer.d;
    return rational(n, p.a.d * q.answer.d * p.b.d);
  }
  const left = evaluate(q.left);
  const right = evaluate(q.right);
  return left.n * right.d === right.n * left.d;
}

assert.deepEqual(E.topics.map(topic => topic.code), ['D1','D2','D3','D4','D5','D6']);
assert.equal(E.setCount, 50);
assert.equal(E.questionCount, 5);
assert.throws(() => E.getSet('D0', 1), /未知训练类型/);
assert.throws(() => E.getSet('D1', 0), /套号超出范围/);
assert.throws(() => E.getSet('D6', 51), /套号超出范围/);
assert.deepEqual(E.topics.slice(0, 2).map(topic => topic.name), ['一步解方程', '两步解方程']);
for (let set = 1; set <= E.setCount; set++) {
  const oneStep = E.getSet('D1', set);
  const twoStep = E.getSet('D2', set);
  assert(oneStep.some(q => q.lines[0].label === '移项'));
  assert(oneStep.some(q => q.lines[0].label === '系数化为1'));
  for (const q of oneStep) {
    assert.equal(q.lines.length, 1);
    assert.equal(q.answer.d, 1n);
    assert.equal(q.right.a.n, 0n);
    assert((q.left.b.n === 0n) !== (q.left.a.n === q.left.a.d));
  }
  assert.equal(twoStep.filter(q => q.left.a.d > 1n).length, 1);
  assert.equal(twoStep.filter(q => q.right.a.n !== 0n).length, 1);
  for (const q of twoStep) {
    assert.equal(q.lines.length, 2);
    assert.equal(q.answer.d, 1n);
    assert(q.left.b.n || q.right.a.n);
    assert.notEqual(q.isolated[0].a.n, q.isolated[0].a.d);
  }
}
const seen = new Set();
const catalogue = [];
for (const { code } of E.topics) {
  for (let set = 1; set <= E.setCount; set++) {
    const qs = E.getSet(code, set);
    assert.equal(qs.length, E.questionCount);
    for (const q of qs) {
      assert(!seen.has(q.tex), code + '-' + set + ': ' + q.tex);
      seen.add(q.tex);
      catalogue.push([code, set, q.tex, q.focus, E.numericTex(q.answer), q.candidate ? E.numericTex(q.candidate) : null]);
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
  }
}
assert.equal(seen.size, 1500);
assert.equal(createHash('sha256').update(JSON.stringify(catalogue)).digest('hex'),
  '752bda51a7d913f60450e022357e6177cb60aa18d43a0a26fe3641161eabf805');
console.log('PASS D1–D6, 300 fixed sets, 1,500 unique questions, exact answers and steps');

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
    w.SpecialPracticeCards = [{ code: 'A1', title: '两数加减', color: 'dce7e3' }];
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
    assert.equal(get('[data-equation-code]'), null);
    assert.equal(loads.length, 0);

    ready = true;
    w.SpecialPracticeUI.open();
    await tick();
    const directory = get('.sp-grid');
    assert.equal(get('[data-code="A1"]').parentElement, directory);
    assert.deepEqual([...directory.querySelectorAll(':scope > .sp-category[data-equation-code]')]
      .map(button => button.dataset.equationCode), E.topics.map(topic => topic.code));
    assert.deepEqual(loads, ['equation-engine.js'], 'only the bank is needed for the directory');
    for (const { code } of E.topics) {
      get('[data-equation-code="' + code + '"]').click();
      await tick();
      assert.equal(get('.equation-topic'), null, 'no extra topic picker');
      assert.equal(get('#equation-set').options.length, 50);
      assert.equal(get('#equation-set').selectedOptions[0].textContent, code + '-01');
      get('#equation-topics').click();
      assert.equal(w.document.activeElement.dataset.equationCode, code);
    }
    assert.equal(loads.length, 5, 'assets are shared by all six types');

    const chooseSet = number => {
      const picker = get('#equation-set');
      picker.value = String(number);
      picker.dispatchEvent(new w.Event('change', { bubbles: true }));
    };
    get('[data-equation-code="D5"]').click();
    await tick();
    assert.equal(get('#equation-set').options.length, 50);
    assert.equal(get('#equation-set').selectedOptions[0].textContent, 'D5-01');
    chooseSet(50);
    await tick();
    assert.equal(get('#equation-set').selectedOptions[0].textContent, 'D5-50');
    const [question] = E.getSet('D5', 50);
    assert.equal(get('.core-formula annotation').textContent, question.tex);
    let keypad = get('.keypad-disclosure');
    assert.equal(keypad.open, true);
    assert.equal(keypad.querySelector('summary').textContent, '隐藏公式键盘');
    keypad.querySelector('summary').click();
    assert.equal(keypad.open, false);
    await tick();
    assert.equal(keypad.querySelector('summary').textContent, '显示公式键盘');

    function fillQuestion(q) {
      const step = q.lines.find(line => /^(移项|去括号|去分母)/.test(line.label));
      if (get('#eq-left-math')) {
        const [left, right] = step.tex.split('=');
        get('#eq-left-math').value = left;
        get('#eq-right-math').value = right;
      }
      get('#eq-value-math').value = E.numericTex(q.answer);
    }
    async function finishSet(number, start = 0) {
      const questions = E.getSet('D5', number);
      await tick();
      for (let index = start; index < questions.length; index++) {
        fillQuestion(questions[index]);
        get('#equation-next').click();
        await tick();
        if (index < questions.length - 1) assert.equal(get('.equation-results-list'), null);
      }
    }

    get('#equation-next').click();
    assert.equal(get('.equation-progress span').textContent, '第 1 / 5 题');
    fillQuestion(question);
    get('#eq-value-math').value = '999';
    get('#equation-next').click();
    await tick();
    assert.equal(get('.equation-results-list'), null, 'no grading after a wrong answer until the full set is submitted');
    assert.equal(get('.keypad-disclosure').open, false);
    get('#equation-previous').click();
    await tick();
    assert.equal(get('#eq-value-math').value, '999');
    w.confirm = () => false;
    chooseSet(49);
    assert.equal(get('#equation-set').value, '50', 'cancelling a set switch keeps work');
    get('#equation-next').click();
    await tick();
    await finishSet(50, 1);
    assert.match(get('.equation-result strong').textContent, /4 \/ 5/);
    assert.match(get('.equation-results-list small').textContent, /步骤正确 · 答案有误/);
    assert.match(get('.equation-title').textContent, /D5-50/);
    assert.equal(get('#equation-again').textContent, '重练本套');
    get('#equation-again').click();
    assert.equal(get('.core-formula annotation').textContent, question.tex);
    chooseSet(49);
    assert.equal(get('#equation-set').value, '49');
    await finishSet(49);
    assert.equal(get('#equation-again').textContent, '下一套 · D5-50');
    get('#equation-again').click();
    assert.equal(get('.core-formula annotation').textContent, question.tex);
    await finishSet(50);
    get('#equation-topics').click();
    assert.equal(w.document.activeElement.dataset.equationCode, 'D5');
    get('[data-equation-code="D2"]').click();
    await tick();
    assert.equal(get('.keypad-disclosure').open, true, 'new groups default to open');
    assert.equal(loads.length, 5, 'a successful module load is reused');

    key = 'class|2';
    get('#equation-next').click();
    assert.deepEqual(routes, ['account']);
    assert.equal(get('#equations'), null);
    assert.equal(get('#specialPractice').textContent, '');
    console.log('PASS numbered set navigation, keypad state, lazy loading, and account switch cleanup');
  } finally {
    w.close();
  }
}
exerciseNavigation().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
