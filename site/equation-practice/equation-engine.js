/* Exact rational arithmetic and original variants for 苏科版七上 §4.1–4.2. */
(function (root) {
  'use strict';

  const setCount = 50;
  const questionCount = 5;
  const topics = [
    { id: 'clear', code: 'D1', name: '去分母', pages: '4.2 · 解一元一次方程', goal: '写出去分母后的方程。' },
    { id: 'expand', code: 'D2', name: '去括号', pages: '4.2 · 解一元一次方程', goal: '写出去括号后的方程。' },
    { id: 'move', code: 'D3', name: '移项', pages: '4.2 · 解一元一次方程', goal: '写出移项后的方程。' },
    { id: 'combine', code: 'D4', name: '合并同类项', pages: '4.2 · 解一元一次方程', goal: '写出合并同类项后的方程。' },
    { id: 'unit', code: 'D5', name: '系数化为一', pages: '4.2 · 解一元一次方程', goal: '写出系数化为一后的方程。' },
    { id: 'mixed', code: 'D6', name: '混合练习', pages: '4.2 · 解一元一次方程', goal: '按顺序完成五步变形。' },
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
      if (form === 'fraction' && piece.display === 'coefficient') {
        const coefficient = '\\frac{1}{' + numericTex(denominator) + '}';
        const inside = joinTerms(sideTerms(body, variable));
        return [{ negative: factor.n < 0n, tex: coefficient + (body.b.n ? '\\left(' + inside + '\\right)' : inside) }];
      }
      const terms = sideTerms(body, variable, !!decimalPlaces);
      const inside = joinTerms(piece.constantFirst ? terms.reverse() : terms);
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

  function getSet(code, number) {
    const stage = topics.findIndex(topic => topic.code === code);
    if (stage < 0) throw Error('未知训练类型。');
    if (!Number.isInteger(number) || number < 1 || number > setCount) throw Error('套号超出范围。');
    function build(index, offset = 0) {
      const slot = (number - 1) * 4 + index + offset;
      const family = index === 4 ? 6 : slot % 6;
      const variant = index === 4 ? number - 1 : Math.floor(slot / 6);
      const v = ['x','m','y','a','t'][Math.floor(variant / 8) % 5];
      const k = 1 + variant % 5, h = Math.floor(variant / 5);
      const constant = n => plain(0,n);
      const coeff = (d,a,b,sign=1) => ({...fraction(sign,d,a,b),display:'coefficient'});
      let sides;
      switch (family) {
        case 0: sides = [[constant(5+h),fraction(-1,5+k-1,1,k)],[plain(1,0)]]; break;
        case 1: sides = [[coeff(2+h,1,0),constant(-2-k)],[coeff(5+h+k-1,1,0)]]; break;
        case 2: sides = [[fraction(1,3+h,2,-k)],[fraction(1,2*(3+h),2,k),constant(-1-h)]]; break;
        case 3: sides = [[fraction(1,2+h,1,k),constant(-k)],[{...fraction(1,3+h,-3,k+1),constantFirst:true}]]; break;
        case 4: sides = [[coeff(3+h,1,k)],[coeff(7+2*h,2,2+k)]]; break;
        case 5: sides = [[coeff(2+h,1,-k)],[constant(2+h),coeff(5+h,1,k+1,-1)]]; break;
        case 6: {
          const d = 4 + variant % 4, e = d + 1 + h % 2;
          sides = [[fraction(1,rational(d,10),1,rational(-3-h,10),1)],
            [fraction(1,rational(e,10),1,rational(k,10),1),constant(2+h)]];
          break;
        }
      }
      const q = question(sides,v,topics[stage].id);
      let previous = q.tex;
      const stages = [];
      for (const line of q.lines) {
        if (line.label.startsWith('分子和分母')) continue;
        const topic = topics.find(t => line.label.startsWith(t.name) ||
          (t.id === 'unit' && line.label === '系数化为1'));
        stages.push({focus:topic.id, variable:v, label:topic.name, tex:previous,
          target:line.tex, decimalRoute:family === 6, original:q.tex});
        previous = line.tex;
      }
      // A coefficient-only equation may skip expansion. Select a sibling that actually exercises it.
      const chosen = stages.find(row => row.focus === topics[stage].id);
      if (!chosen && stage < 5) return build(index,offset ? offset + 1 : 4 - index);
      return {...q,...(chosen || {}),stages,lines:chosen ? [{label:chosen.label,tex:chosen.target}] : stages.map(t=>({label:t.label,tex:t.target}))};
    }
    const seen = new Set();
    return Array.from({length:questionCount},(_,i)=>{
      let q = build(i);
      for (let offset = 6; seen.has(q.tex); offset += 6) q = build(i,offset);
      seen.add(q.tex);
      return q;
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
    if (q.target) {
      const parts = q.target.replace(/\\(?:left|right)/g, '').replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2').split('=');
      const signature = term => [term.a.n, term.a.d, term.b.n, term.b.d].join(':');
      function matches(actual, expected) {
        const ref = readSide(expected, q.variable);
        const terms = side => side.terms.map(signature).sort().join('|');
        return actual.groupedSum === ref.groupedSum && terms(actual) === terms(ref) &&
          (q.focus === 'unit' || !actual.hasDivision);
      }
      if (q.decimalRoute && q.focus !== 'unit') {
        // Compare signed terms at a single common scale on both sides. This
        // covers fraction-preserving rewrites and multiplication of the equation.
        const refs = parts.map(part => readSide(part,q.variable));
        const [u,w] = refs.map(side => side.value);
        const scaleBy = u.a.n ? divide(left.value.a,u.a) : divide(right.value.b,w.b);
        const key = (side, factor) => side.terms.map(term=>signature(scale(term,factor))).sort().join('|');
        const sameTerms = scaleBy.n !== 0n && [left,right].every((side,i)=>key(side,one)===key(refs[i],scaleBy));
        const clear = q.focus === 'clear';
        const raw = [leftInput,rightInput].join('=').normalize('NFKC').replace(/\s/g,'');
        // Merely retyping the decimal fractions, even with extra parentheses, is not a step.
        const decimalDenominator = /[\/÷]\(*[+-]?(?:\d*\.\d+)/.test(raw);
        const originalMultiplier = q.original.match(/\\frac\{[^}]*\}\{([\d.]+)\}/g);
        const denominators = originalMultiplier.map(t=>decimal(t.match(/\{([\d.]+)\}$/)[1]));
        const common = denominators.map(t=>times(t,rational(10)).n).reduce(lcm);
        const unchangedScale = same(scaleBy,rational(1,common));
        const wholeSide = (input, side, ref) => {
          const text = String(input).normalize('NFKC').replace(/\s|[×*·]/g,'');
          return /^[-+]?(?:\d+(?:\.\d+)?|\.\d+)\(.+\)$/.test(text) &&
            pairEquals(side.value,scale(ref.value,scaleBy));
        };
        const commonProduct = clear && !unchangedScale && scaleBy.n !== 0n &&
          [left,right].every((side,i)=>key(side,one)===key(refs[i],scaleBy) ||
            wholeSide([leftInput,rightInput][i],side,refs[i]));
        return {ok:(sameTerms || commonProduct) && (clear ? !(unchangedScale && decimalDenominator) :
          !left.groupedSum && !right.groupedSum && !left.hasDivision && !right.hasDivision),
          message:'检查分子、分母和方程外的常数是否按所选方法一起变形。'};
      }
      return { ok: matches(left, parts[0]) && matches(right, parts[1]),
        message: '请只完成' + q.label + '这一步，检查每一项的符号和系数。' };
    }
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
