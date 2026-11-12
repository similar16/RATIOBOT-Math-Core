/* Exact rational arithmetic and original variants for 苏科版七上 §4.1–4.2. */
(function (root) {
  'use strict';

  const topics = [
    { id: 'equality', name: '等式与方程', pages: '4.1 · 第106—112页', goal: '代入检验，练习等式两边的同一变形。' },
    { id: 'simple', name: '简单方程', pages: '4.2 · 第113—114页', goal: '从 ax = b 到 ax + b = c，练习系数化为1。' },
    { id: 'move', name: '移项', pages: '4.2 · 第114—115页', goal: '把含未知数的项和常数项分开，留意移项变号。' },
    { id: 'expand', name: '去括号', pages: '4.2 · 第116—117页', goal: '从单侧括号到两侧括号，练习负因数的分配。' },
    { id: 'clear', name: '去分母', pages: '4.2 · 第117—120页', goal: '等式两边的每一项都乘同一个数，包括整数项。' },
    { id: 'mixed', name: '混合训练', pages: '4.2 · 第118—120页', goal: '独立判断从哪一步开始，完成整道题。' },
  ];

  function gcd(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b) [a, b] = [b, a % b];
    return a;
  }

  function rational(n, d = 1) {
    n = BigInt(n);
    d = BigInt(d);
    if (d === 0n) throw Error('分母不能为0。');
    const g = gcd(n, d) * (d < 0n ? -1n : 1n);
    return { n: n / g, d: d / g };
  }

  const zero = rational(0);
  const one = rational(1);
  const asRat = value => typeof value === 'object' ? value : rational(value);
  const add = (a, b) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
  const times = (a, b) => rational(a.n * b.n, a.d * b.d);
  const divide = (a, b) => rational(a.n * b.d, a.d * b.n);
  const neg = a => ({ n: -a.n, d: a.d });
  const abs = a => a.n < 0n ? neg(a) : a;
  const sub = (a, b) => add(a, neg(b));
  const same = (a, b) => a.n === b.n && a.d === b.d;
  const lcm = (a, b) => a * b / gcd(a, b);

  function decimal(text) {
    const [whole, fraction = ''] = text.split('.');
    return rational((whole + fraction) || '0', 10n ** BigInt(fraction.length));
  }

  function numericTex(value, preferDecimal = false) {
    if (value.d === 1n) return String(value.n);
    if (preferDecimal) {
      for (const places of [1, 2, 3, 4]) {
        const scale = 10n ** BigInt(places);
        if (scale % value.d === 0n) {
          const digits = String(abs(value).n * (scale / value.d)).padStart(places + 1, '0');
          return (value.n < 0n ? '-' : '') + digits.slice(0, -places) + '.' + digits.slice(-places);
        }
      }
    }
    return (value.n < 0n ? '-' : '') + '\\frac{' + abs(value).n + '}{' + value.d + '}';
  }

  const linear = (a, b) => ({ a: asRat(a), b: asRat(b) });
  const sum = (a, b) => linear(add(a.a, b.a), add(a.b, b.b));
  const scale = (p, factor) => linear(times(p.a, factor), times(p.b, factor));
  const pairEquals = (a, b) => same(a.a, b.a) && same(a.b, b.b);
  const sideValue = (p, x) => add(times(p.a, x), p.b);
  const constSide = value => linear(zero, value);

  // Keep top-level terms and grouped sums to distinguish each target transformation.
  function readSide(input, variable) {
    const text = String(input).normalize('NFKC').toLowerCase().replace(/\s/g, '')
      .replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/');
    const tokens = text.match(/\d+(?:\.\d+)?|\.\d+|[a-z()+*/-]/g) || [];
    if (!text || text.length > 110 || tokens.join('') !== text) throw Error('请检查算式和括号。');
    let i = 0;
    let groupedSum = false;
    let containsVariable = false;

    function atom() {
      const token = tokens[i++];
      if (token === '+' || token === '-') {
        return scale(atom(), token === '-' ? neg(one) : one);
      }
      if (token === '(') {
        const terms = expression();
        if (tokens[i++] !== ')') throw Error('请补全括号。');
        groupedSum ||= terms.length > 1;
        return terms.reduce(sum, linear(0, 0));
      }
      if (token === variable) {
        containsVariable = true;
        return linear(1, 0);
      }
      if (token && /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(token)) return constSide(decimal(token));
      throw Error('请使用题目中的未知数，并补全算式。');
    }

    function product() {
      let value = atom();
      while (['*', '/', '(', variable].includes(tokens[i])) {
        const op = tokens[i];
        if (op === '*' || op === '/') i++;
        const right = atom();
        if (op === '/') {
          if (right.a.n) throw Error('分母请填写一个数。');
          value = scale(value, divide(one, right.b));
        } else {
          if (value.a.n && right.a.n) throw Error('请填写一元一次式。');
          value = value.a.n ? scale(value, right.b) : scale(right, value.b);
        }
      }
      return value;
    }

    function expression() {
      const terms = [product()];
      while (tokens[i] === '+' || tokens[i] === '-') {
        const op = tokens[i++];
        terms.push(scale(product(), op === '-' ? neg(one) : one));
      }
      return terms;
    }

    const terms = expression();
    if (i !== tokens.length) throw Error('请检查算式和括号。');
    return { value: terms.reduce(sum, linear(0, 0)), terms, groupedSum, containsVariable, hasDivision: text.includes('/') };
  }

  const plain = (a, b, useDecimal = false) => ({ body: linear(a, b), factor: one, form: 'plain', useDecimal });
  const bracket = (factor, a, b) => ({ body: linear(a, b), factor: asRat(factor), form: 'bracket' });

  function fraction(sign, denominator, a, b, decimalPlaces = 0) {
    const factor = divide(rational(sign), asRat(denominator));
    return { body: linear(a, b), factor, form: 'fraction', denominator: asRat(denominator), decimalPlaces };
  }

  function sideTerms(p, variable, useDecimal = false) {
    const terms = [];
    if (p.a.n) terms.push({
      negative: p.a.n < 0n,
      tex: (same(abs(p.a), one) ? '' : numericTex(abs(p.a), useDecimal)) + variable,
    });
    if (p.b.n) terms.push({ negative: p.b.n < 0n, tex: numericTex(abs(p.b), useDecimal) });
    return terms;
  }

  function joinTerms(terms) {
    return terms.map(({ negative, tex }, i) => (negative ? '-' : i ? '+' : '') + tex).join('') || '0';
  }

  function renderSide(side, variable) {
    return joinTerms(side.flatMap(piece => {
      const { body, factor, form, useDecimal, denominator, decimalPlaces } = piece;
      if (form === 'plain') return sideTerms(scale(body, factor), variable, useDecimal);
      const inside = joinTerms(sideTerms(body, variable, !!decimalPlaces));
      const tex = form === 'fraction'
        ? '\\frac{' + inside + '}{' + numericTex(denominator, !!decimalPlaces) + '}'
        : (same(abs(factor), one) ? '' : numericTex(abs(factor))) + '\\left(' + inside + '\\right)';
      return [{ negative: factor.n < 0n, tex }];
    }));
  }

  const eqTex = (sides, variable) => sides.map(side => renderSide(side, variable)).join('=');
  const fullSide = side => side.map(piece => scale(piece.body, piece.factor)).reduce(sum, linear(0, 0));

  function normalizeDenominators(side) {
    return side.map(piece => {
      if (!piece.decimalPlaces) return piece;
      const multiple = rational(10 ** piece.decimalPlaces);
      const body = scale(piece.body, multiple);
      return fraction(piece.factor.n < 0n ? -1 : 1, times(piece.denominator, multiple), body.a, body.b);
    });
  }

  function multiplyOutDenominators(side, multiple) {
    return side.map(piece => {
      const factor = times(piece.factor, multiple);
      const form = piece.form === 'fraction' && piece.body.a.n && piece.body.b.n ? 'bracket' : 'plain';
      return { ...piece, form, factor };
    });
  }

  function linesFor(sides, variable, answer) {
    const lines = [];
    let current = sides;
    let previous = eqTex(sides, variable);
    function line(label, state) {
      const tex = typeof state === 'string' ? state : eqTex(state, variable);
      if (tex !== previous) lines.push({ label, tex });
      previous = tex;
    }
    let multiplier = null;
    if (sides.flat().some(piece => piece.form === 'fraction')) {
      current = sides.map(normalizeDenominators);
      line('分子和分母同乘，先把分母化为整数', current);
      multiplier = rational(current.flat().reduce((n, piece) => piece.denominator ? lcm(n, piece.denominator.n) : n, 1n));
      current = current.map(side => multiplyOutDenominators(side, multiplier));
      line('去分母 · 两边都乘 ' + multiplier.n, current);
    }
    if (current.flat().some(piece => piece.form === 'bracket')) {
      current = current.map(side => side.map(piece => ({ ...piece, form: 'plain' })));
      line('去括号', current);
    }
    const [left, right] = current.map(fullSide);
    if (left.b.n || right.a.n) {
      const [leftTerms, rightTerms] = current.map(side => side.map(piece => scale(piece.body, piece.factor)));
      line('移项', [
        [...leftTerms.map(term => plain(term.a, 0)), ...rightTerms.map(term => plain(neg(term.a), 0))],
        [...rightTerms.map(term => plain(0, term.b)), ...leftTerms.map(term => plain(0, neg(term.b)))],
      ]);
    }
    line('合并同类项', [[plain(sub(left.a, right.a), 0)], [plain(0, sub(right.b, left.b))]]);
    line('系数化为1', variable + '=' + numericTex(answer));
    return { lines, multiplier };
  }

  function question(sides, variable, focus) {
    const [left, right] = sides.map(fullSide);
    const coefficient = sub(left.a, right.a);
    if (!coefficient.n) return null;
    const difference = sub(right.b, left.b);
    const answer = divide(difference, coefficient);
    return {
      focus, variable, tex: eqTex(sides, variable), answer, left, right,
      isolated: [linear(coefficient, 0), constSide(difference)],
      ...linesFor(sides, variable, answer),
    };
  }

  function property(sides, variable, operation, operand, needsAnswer = false) {
    return { ...question(sides, variable, 'property'), operation, operand, needsAnswer };
  }

  function verification(sides, variable, candidate) {
    const q = question(sides, variable, 'verify');
    return { ...q, candidate, values: [sideValue(q.left, candidate), sideValue(q.right, candidate)] };
  }

  function makeQuestion(topic, index, rng) {
    const pick = options => options[Math.floor(rng() * options.length)];
    const signed = [-5, -4, -3, -2, 2, 3, 4, 5];
    const nonzero = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
    const small = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    const variable = rng() < .82 ? 'x' : 'y';
    const solution = pick(small);
    const coefficient = pick(signed);
    const constant = pick(nonzero);

    if (topic === 'equality') {
      if (index < 2) {
        const rightA = index === 1 ? coefficient - 1 : 0;
        const rightB = (coefficient - rightA) * solution + constant;
        const candidate = rational(index === 0 ? solution : solution + pick([-2, -1, 1, 2]));
        return verification([[plain(coefficient, constant)], [plain(rightA, rightB)]], variable, candidate);
      }
      if (index === 2) {
        return property([[plain(1, constant)], [plain(0, solution + constant)]],
          variable, 'subtract', constSide(rational(constant)));
      }
      if (index === 3) {
        return property([[plain(coefficient, 0)], [plain(0, coefficient * solution)]],
          variable, 'divide', constSide(rational(coefficient)));
      }
      const a = coefficient + 1;
      return property([[plain(a, 0)], [plain(1, coefficient * solution)]],
        variable, 'subtract', linear(1, 0), true);
    }

    if (topic === 'simple') {
      if (index === 0) return question([[plain(coefficient, 0)], [plain(0, coefficient * solution)]], variable, 'answer');
      if (index === 2) {
        const right = constant + pick(nonzero.filter(n => n % coefficient !== 0));
        return question([[plain(coefficient, constant)], [plain(0, right)]], variable, 'isolate');
      }
      if (index === 3 || index === 4) {
        const isDecimal = index === 3;
        const a = rational(isDecimal ? coefficient : pick(signed.filter(n => n % 3 !== 0)), isDecimal ? 10 : 3);
        const b = isDecimal ? rational(constant, 10) : zero;
        const right = add(times(a, rational(solution)), b);
        return question([[plain(a, b, isDecimal)], [plain(0, right, isDecimal)]], variable, b.n ? 'isolate' : 'answer');
      }
      return question([[plain(coefficient, constant)], [plain(0, coefficient * solution + constant)]], variable, 'isolate');
    }

    if (topic === 'move') {
      const a = pick(nonzero.filter(n => n !== -coefficient && Math.abs(n + coefficient) < 8));
      const right = constant + coefficient * solution + (index === 4 ? 1 : 0);
      const split = index === 3 ? pick(signed.filter(n => n !== a + coefficient)) : 0;
      return question([
        [plain(a + coefficient - split, constant), plain(split, 0)],
        [plain(a, right)],
      ], variable, 'move');
    }

    if (topic === 'expand') {
      const factor = index === 0 ? -Math.abs(coefficient) : coefficient;
      const leftGroup = bracket(factor, 1, constant);
      const rightFactor = index >= 2 ? pick(signed.filter(n => n !== factor)) : 1;
      const rightConstant = (factor - rightFactor) * solution + factor * constant;
      const left = [leftGroup];
      if (index === 0) left.unshift(plain(0, 2));
      const right = index >= 2
        ? [bracket(rightFactor, 1, pick(nonzero))]
        : [plain(rightFactor, rightConstant + (index === 0 ? 2 : 0))];
      if (index >= 2) right.push(plain(0, rightConstant - Number(fullSide(right).b.n)));
      return question([left, right], variable, 'expand');
    }

    if (topic === 'clear') {
      if (index === 4) {
        const sign = pick([-1, 1]);
        return question([
          [fraction(1, rational(4, 10), 1, rational(constant, 10), 1)],
          [fraction(sign, rational(5, 10), 1, rational(pick(nonzero), 10), 1), plain(0, pick(nonzero))],
        ], variable, 'clear');
      }
      const [d1, d2] = pick(index < 2 ? [[2, 3], [3, 4]] : [[2, 3], [2, 5], [3, 4], [4, 6]]);
      const a = pick([1, 2, 3].filter(n => n % d2 !== 0));
      const sign = index % 2 ? -1 : 1;
      const first = fraction(1, d1, 1, constant);
      const second = fraction(sign, d2, a, pick(nonzero.filter(n => gcd(BigInt(a), gcd(BigInt(n), BigInt(d2))) === 1n)));
      return question(index % 2
        ? [[plain(0, pick(nonzero)), first], [second]]
        : [[first], [second, plain(0, pick(nonzero))]], variable, 'clear');
    }
    throw Error('未知训练类型。');
  }

  function makeSet(topic, rng = Math.random, previous = []) {
    if (!topics.some(item => item.id === topic)) throw Error('未知训练类型。');
    const order = topic === 'mixed' ? ['simple', 'move', 'expand', 'clear', 'clear'] : Array(5).fill(topic);
    if (topic === 'mixed') {
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    }
    const seen = new Set(previous.map(q => q.tex));
    let clearCount = 0;
    return order.map((kind, index) => {
      const variant = topic !== 'mixed' ? index
        : kind === 'clear' ? (clearCount++ ? 4 : 2) : 2 + Math.floor(rng() * 3);
      let fallback;
      for (let attempt = 0; attempt < 150; attempt++) {
        const q = makeQuestion(kind, variant, rng);
        if (!q) continue;
        fallback ||= q;
        if (abs(q.answer).n > 24n * q.answer.d || q.answer.d > 24n || seen.has(q.tex)) continue;
        seen.add(q.tex);
        return q;
      }
      if (!fallback) throw Error('本组题目生成失败，请换一组。');
      return fallback;
    });
  }

  function checkNumber(text, target, variable) {
    const side = readSide(text, variable);
    if (side.containsVariable) throw Error('请在这一格填一个数。');
    return same(side.value.b, target);
  }

  function checkVerification(q, left, right, verdict) {
    if (!checkNumber(left, q.values[0], q.variable) || !checkNumber(right, q.values[1], q.variable)) {
      return { ok: false, message: '代入后的值有误。把这个数代进等号两边，分别算一次。' };
    }
    return {
      ok: verdict === (same(...q.values) ? 'yes' : 'no'),
      message: '两边的值已经算对了。比较它们是否相等，再判断。',
    };
  }

  function checkProperty(q, operation, input) {
    const operand = readSide(input, q.variable).value;
    if (operation === 'add') return q.operation === 'subtract' && pairEquals(scale(operand, neg(one)), q.operand);
    if (operation === 'subtract') return q.operation === 'subtract' && pairEquals(operand, q.operand);
    if (operation === 'multiply') {
      return q.operation === 'divide' && !operand.a.n && same(times(operand.b, q.operand.b), one);
    }
    if (operation === 'divide') {
      if (!operand.a.n && !operand.b.n) throw Error('等式两边都除以同一个数，这个数不能为0。');
      return q.operation === 'divide' && pairEquals(operand, q.operand);
    }
    return false;
  }

  function aligned(left, right, expected) {
    return pairEquals(left.value, expected[0]) && pairEquals(right.value, expected[1]);
  }

  function isolated(left, right) {
    return left.terms.every(term => term.b.n === 0n) && right.terms.every(term => term.a.n === 0n);
  }

  function commonScale(left, right, expected) {
    const original = [expected[0].a, expected[0].b, expected[1].a, expected[1].b];
    const entered = [left.value.a, left.value.b, right.value.a, right.value.b];
    const anchor = original.findIndex(value => value.n);
    const factor = divide(entered[anchor], original[anchor]);
    return factor.n > 0n && factor.d === 1n && original.every((value, i) => same(times(value, factor), entered[i]));
  }

  function checkStep(q, leftInput, rightInput) {
    const left = readSide(leftInput, q.variable);
    const right = readSide(rightInput, q.variable);
    const expected = [q.left, q.right];
    if (q.focus === 'clear') {
      const hasFraction = [left, right].some(side => side.hasDivision ||
        side.terms.some(term => term.a.d !== 1n || term.b.d !== 1n));
      if (hasFraction) return { ok: false, message: '请把方程变形到各项的系数和常数都是整数。' };
      return {
        ok: commonScale(left, right, expected) || commonScale(right, left, expected),
        message: '检查等号两边的每一项是否都乘了同一个数，尤其是原来没有分母的项。',
      };
    }
    if (q.focus === 'expand') {
      if (left.groupedSum || right.groupedSum) return { ok: false, message: '还有括号需要展开。' };
      return {
        ok: aligned(left, right, expected) || aligned(right, left, expected),
        message: '括号外的因数要乘里面的每一项。括号外有负号时，检查展开后各项的符号。',
      };
    }
    if (q.focus === 'move' || q.focus === 'isolate') {
      return {
        ok: (isolated(left, right) && aligned(left, right, q.isolated)) ||
          (isolated(right, left) && aligned(right, left, q.isolated)),
        message: '把含未知数的项放在一边，常数项放在另一边。跨过等号的项要变号。',
      };
    }
    throw Error('本题直接填写方程的解。');
  }

  const api = { topics, makeSet, checkNumber, checkVerification, checkProperty, checkStep, numericTex };
  if (typeof module !== 'undefined') module.exports = api;
  else root.MathIsleEquationEngine = api;
})(typeof window === 'undefined' ? globalThis : window);
