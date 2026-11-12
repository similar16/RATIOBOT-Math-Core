/* Exact rational arithmetic and original variants for 苏科版七上 §4.1–4.2. */
(function (root) {
  'use strict';

  const setCount = 50;
  const questionCount = 5;
  const topics = [
    { id: 'equality', code: 'D1', name: '等式与方程', pages: '4.1 · 第106—112页', goal: '代入检验，练习等式两边的同一变形。' },
    { id: 'simple', code: 'D2', name: '简单方程', pages: '4.2 · 第113—114页', goal: '从 ax = b 到 ax + b = c，练习系数化为1。' },
    { id: 'move', code: 'D3', name: '移项', pages: '4.2 · 第114—115页', goal: '把含未知数的项和常数项分开，留意移项变号。' },
    { id: 'expand', code: 'D4', name: '去括号', pages: '4.2 · 第116—117页', goal: '从单侧括号到两侧括号，练习负因数的分配。' },
    { id: 'clear', code: 'D5', name: '去分母', pages: '4.2 · 第117—120页', goal: '等式两边的每一项都乘同一个数，包括整数项。' },
    { id: 'mixed', code: 'D6', name: '混合训练', pages: '4.2 · 第118—120页', goal: '独立判断从哪一步开始，完成整道题。' },
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

  function makeSet(topic, rng) {
    const seen = new Set();
    const order = topic === 'mixed' ? ['simple', 'move', 'expand', 'clear', 'clear'] : Array(questionCount).fill(topic);
    if (topic === 'mixed') {
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    }
    let clearCount = 0;
    return order.map((kind, index) => {
      const variant = topic !== 'mixed' ? index
        : kind === 'clear' ? (clearCount++ ? 4 : 2) : 2 + Math.floor(rng() * 3);
      for (let attempt = 0; attempt < 500; attempt++) {
        const q = makeQuestion(kind, variant, rng);
        if (!q) continue;
        if (abs(q.answer).n > 24n * q.answer.d || q.answer.d > 24n || seen.has(q.tex)) continue;
        seen.add(q.tex);
        return q;
      }
      throw Error('题库生成失败，请刷新后重试。');
    });
  }

  // Each seed identifies one fixed set in both deployments.
  const setSeeds = {
    D1: [
      0x88b6ed4a, 0x3c7e7c21, 0xd389670c, 0xc9a3f6fb, 0xe53868e5, 0x98748500, 0x6457b45f, 0x05fba834, 0x3c4f3603, 0xa4abe52d,
      0x77de84a8, 0x7da21c1a, 0xf366bcb1, 0xf51e0e5c, 0x0faa560b, 0x4d70b3ee, 0xa516ea75, 0xa5707950, 0xc8d0b279, 0x03f53984,
      0xc2b17713, 0x75be9156, 0x032902f8, 0x08b43eea, 0xa3816141, 0x9619c9ac, 0x34701bbe, 0x46bc1005, 0x52dac1a0, 0x8350887f,
      0x22385ed4, 0xb1c83c23, 0xe6c4704d, 0x777a55ba, 0x6af769d1, 0xde60d995, 0xef286ca2, 0xa57708f6, 0xa7da7c4c, 0x9fd7875e,
      0x4fce4e40, 0x77175243, 0x2fd9a6f1, 0x3c65aa42, 0x9c71a353, 0x68625096, 0xde46522a, 0x180b8266, 0xc6ef368d, 0xe45e38fa,
    ],
    D2: [
      0xf0557411, 0xd2ad9e3c, 0xc1eb2ece, 0x4440d173, 0xfb686836, 0xdb09ba57, 0x6eab13ca, 0xf3bb70a1, 0x2d34ce9e, 0x7dfd5780,
      0x7f2be469, 0x7cec62b4, 0x6757ae83, 0x76360206, 0xb501a728, 0xeaba0f93, 0xa29ec578, 0x09e4ca77, 0x9980619b, 0x015751a6,
      0xa5915c3a, 0x3df0e60e, 0x53151070, 0x73fd690f, 0x42323b71, 0x45cc0939, 0xaca79001, 0x5b02ad92, 0x450b830d, 0x8fdfba59,
      0x03db2a00, 0xb5e3a813, 0xa428f1bd, 0x200ce8d2, 0xec4aad23, 0x6e9512d1, 0xc402798f, 0x976b514c, 0xbb1bcd9f, 0xaf3b3449,
      0x3b27e963, 0xd9f78aad, 0x7a26ec28, 0x60294a78, 0x300a2b97, 0xbf5d8359, 0x82889bd7, 0xb0465ae5, 0x9c9c9234, 0xc06855be,
    ],
    D3: [
      0xf3730205, 0x9e910ba0, 0x370e4a7f, 0x003e55d2, 0x774cfb09, 0xc877718e, 0x189c4b95, 0x240927f0, 0x9d3f9a8f, 0xa835c6a2,
      0xd2ef2d3b, 0xa95cc15e, 0xad5e3925, 0x29999840, 0x6a252e9f, 0x6dd19d9c, 0x9975452e, 0x8271cab5, 0xfea75c90, 0xb8900442,
      0xab2cad81, 0xda5dfcfe, 0x7ad00045, 0x5cd122bf, 0xaf96688d, 0x17a252fa, 0x79cf066b, 0x88f3e8ce, 0xc70ee130, 0x2d886236,
      0x916a3c57, 0x48cc7b8c, 0x1c905765, 0x0c06c6b2, 0x6c439083, 0xd9dd2331, 0xcadb5c6e, 0x02740eef, 0x2ca9f73d, 0xa7c73f6a,
      0xcc79039b, 0x3026e43e, 0x8a931e20, 0xaa0acba6, 0xc25ffa87, 0x4b91a815, 0x1532bfb3, 0x2ade8818, 0xad7b1ce1, 0xa4be8fde,
    ],
    D4: [
      0x941cb5a5, 0xef60eac0, 0xeea35f1f, 0xbca821f2, 0x1f2118a9, 0x697189f4, 0x89ac572f, 0x68831ac2, 0x64b29b39, 0xabea8b44,
      0x04791dd3, 0xa2128916, 0x16cf01c9, 0x2d9492e3, 0x17abdae6, 0x49d6b50d, 0x36be5308, 0xb28bd97a, 0xfa818bf3, 0xa748e09d,
      0xb3f5e958, 0x247cdcd7, 0x67c2d44a, 0x4390bd32, 0x0e14302d, 0x68cc22e7, 0x4d43c31a, 0x362637b1, 0xa6d94d5c, 0xa4185884,
      0xdf252cf7, 0xfa0b9c41, 0xd1a0c8ac, 0x8a59ac1b, 0xcc3272be, 0x0a082a26, 0x72fc64d1, 0xb8e1d32b, 0x393cce8e, 0x8ab00495,
      0xc3fa8a98, 0x98c8fb4c, 0x35443225, 0x027d3d40, 0x3e728f9f, 0x60561d29, 0x0ba1222e, 0x1309a7af, 0x6cd33142, 0xb83abfb9,
    ],
    D5: [
      0xb8df65c4, 0x92773653, 0x7a3cc796, 0x26b0d9fd, 0xf3f9d338, 0xcabefd37, 0x5b64b92a, 0x176d1681, 0x50f519fe, 0x8b0a7945,
      0x8ee703bf, 0xa6de9b14, 0x555a4630, 0xbba1bee2, 0xd9c5b0d9, 0x44d7e473, 0x9e174d1d, 0x142c6bd8, 0x7dc07d57, 0xb4762ba1,
      0xf831a59e, 0x4699c1b4, 0xafcdb906, 0x8a49899a, 0xb4dd9ad0, 0x142431f9, 0x1c42503d, 0x6fed0c6a, 0x9873732c, 0x8e8b013e,
      0xf36f1bff, 0x01b247a3, 0x300f9bab, 0xafba3f70, 0x13a9fe76, 0x2154ad97, 0x9ea4ee0a, 0x42d4aea5, 0x538efef4, 0x5a1b1dc3,
      0x8990e2ed, 0xe9d2b671, 0x81f7f82f, 0x958815b8, 0xe49ea86c, 0xb9dc2c60, 0xc60097e6, 0x5c724e0d, 0xc456dfeb, 0x5d4e344f,
    ],
    D6: [
      0xa604214a, 0x4a30bb0c, 0xe1b9d786, 0x9825806f, 0x574c0d84, 0x0e408556, 0xc4a316f8, 0x017b72ea, 0xb8570541, 0xf79755a0,
      0x77dc0c7f, 0xd3c9e726, 0x027ed44d, 0xdd2dfc07, 0xdc1aec24, 0xb002948a, 0x4a95d04c, 0x4803f09f, 0x31d53974, 0xf8f4935a,
      0xb75a4af1, 0xd0923e4b, 0x2e00ff2e, 0x66e0be37, 0x7ee8f245, 0x2787bee0, 0xf840e4bf, 0xaf23cf49, 0xab6a3c63, 0xdf881811,
      0x0dcf4bd5, 0x7a8b9964, 0x0f679573, 0xee5c258c, 0xec9ae8df, 0x8912f606, 0xc701d5ad, 0x949a6cdc, 0x432d50ef, 0x5582b8a3,
      0xbd9ea0cd, 0xc593cbc8, 0x0ea9fc87, 0x89065a0e, 0x85011a15, 0x891fee97, 0x6b30a7a5, 0xa2e86546, 0xfe6bfbed, 0x9e7adf71,
    ],
  };

  function getSet(code, number) {
    const topic = topics.find(item => item.code === code);
    if (!topic) throw Error('未知训练类型。');
    if (!Number.isInteger(number) || number < 1 || number > setCount) throw Error('套号超出范围。');
    let seed = setSeeds[code][number - 1];
    const next = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 2 ** 32;
    };
    return makeSet(topic.id, next);
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

  const api = { topics, setCount, questionCount, getSet, checkNumber, checkVerification, checkProperty, checkStep, numericTex };
  if (typeof module !== 'undefined') module.exports = api;
  else root.MathIsleEquationEngine = api;
})(typeof window === 'undefined' ? globalThis : window);
