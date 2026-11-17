/* Exact, bounded mathematics for the quantity-table activities. No dynamic code execution. */
(function (root) {
  'use strict';

  const MAX_INPUT = 600, MAX_NODES = 200, MAX_DEGREE = 4;
  const VARIABLES = /^[a-zA-Z]$/;
  class MathInputError extends Error { constructor(message, kind = 'input') { super(message); this.kind = kind; } }
  const fail = (message, kind) => { throw new MathInputError(message, kind); };
  const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
  function rat(n, d = 1n) {
    n = BigInt(n); d = BigInt(d);
    if (!d) fail('分母不能为0.');
    if (n.toString().length > 160 || d.toString().length > 160) fail('数值过大，请检查输入.');
    const g = gcd(n, d) * (d < 0n ? -1n : 1n);
    return { n: n / g, d: d / g };
  }
  const R0 = rat(0), R1 = rat(1);
  const radd = (a, b) => rat(a.n * b.d + b.n * a.d, a.d * b.d);
  const rmul = (a, b) => rat(a.n * b.n, a.d * b.d);
  const rdiv = (a, b) => rat(a.n * b.d, a.d * b.n);
  const rneg = a => rat(-a.n, a.d);
  const req = (a, b) => a.n === b.n && a.d === b.d;
  const rstring = a => a.d === 1n ? String(a.n) : a.n + '/' + a.d;
  function decimal(raw) {
    if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)) fail('请检查数值.');
    if (raw.replace('.', '').length > 18) fail('数字过长，请检查输入.');
    const [whole, fraction = ''] = raw.split('.');
    return rat((whole || '0') + fraction, 10n ** BigInt(fraction.length));
  }

  function normalize(value) {
    let s = String(value ?? '').trim();
    if (!s) fail('请先填写表达式.');
    if (s.length > MAX_INPUT) fail('表达式过长，请分步填写.');
    s = s.replace(/[０-９]/g, c => String(c.charCodeAt(0) - 65296))
      .replace(/[（【]/g, '(').replace(/[）】]/g, ')').replace(/[−－–]/g, '-')
      .replace(/[×·⋅]/g, '*').replace(/÷/g, '/').replace(/％/g, '%').replace(/＝/g, '=')
      .replace(/\\(?:left|right|displaystyle|textstyle)/g, '')
      .replace(/\\(?:times|cdot)/g, '*').replace(/\\div/g, '/').replace(/\\%/g, '%')
      .replace(/\\(?:,|;|!|quad|qquad| )/g, '').replace(/\s+/g, '');
    // MathLive supplies recursive \frac groups. Convert syntax only; never evaluate text.
    let at = 0;
    function group() {
      if (s[at] !== '{') {
        if (!s[at] || s[at] === '}' || s[at] === '\\') fail('请补全公式中的分子、分母或指数.');
        return s[at++];
      }
      at++; const value = read('}');
      if (s[at] !== '}') fail('请检查公式括号.');
      at++; return value;
    }
    function read(stop) {
      let out = '';
      while (at < s.length && s[at] !== stop) {
        const f = s.slice(at).match(/^\\(?:dfrac|tfrac|frac)/);
        if (f) { at += f[0].length; const n = group(), d = group(); if (!n || !d) fail('请补全分子和分母.'); out += '((' + n + ')/(' + d + '))'; continue; }
        if (s[at] === '{') { out += '(' + group() + ')'; continue; }
        if (s[at] === '\\') fail('这个符号暂不支持自动核对，请使用数字、字母和四则运算.', 'unsupported');
        out += s[at++];
      }
      return out;
    }
    const result = read();
    if (at !== s.length || /[{}]/.test(result)) fail('请检查公式括号.');
    if (!/^[0-9a-zA-Z.+\-*/^()%=[\]]+$/.test(result)) fail('含有无法识别的符号，请只填写数学表达式.');
    return result.replace(/\[/g, '(').replace(/\]/g, ')');
  }

  function parse(input) {
    const normalized = normalize(input);
    if (normalized.includes('=')) fail('这一格只填写表达式，等式请填在列方程处.');
    const tokens = [];
    let i = 0;
    while (i < normalized.length) {
      const c = normalized[i];
      if (/[0-9.]/.test(c)) {
        const match = normalized.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
        if (!match) fail('小数点的位置不正确.');
        tokens.push({ type: 'number', raw: match[0], value: decimal(match[0]) }); i += match[0].length;
      } else if (VARIABLES.test(c)) {
        // Individual mathematical letters are supported. Function-like words are not.
        const word = normalized.slice(i).match(/^[a-zA-Z]+/)[0];
        if (word.length > 3 || /^(?:sin|cos|tan|log|exp|NaN)$/i.test(word)) fail('暂不核对函数或文字，请填写本题的数量表达式.', 'unsupported');
        tokens.push({ type: 'variable', value: c }); i++;
      } else { tokens.push({ type: c }); i++; }
      if (tokens.length > MAX_NODES) fail('表达式过长，请分步填写.');
    }
    let pos = 0, nodes = 0;
    const peek = () => tokens[pos]?.type;
    const node = (kind, props) => { if (++nodes > MAX_NODES) fail('表达式过长，请分步填写.'); return { kind, ...props }; };
    function primary() {
      const t = tokens[pos++];
      if (!t) fail('表达式还没有填写完整.');
      if (t.type === 'number') return node('number', { raw: t.raw, value: t.value });
      if (t.type === 'variable') return node('variable', { name: t.value });
      if (t.type === '(') { const value = sum(); if (peek() !== ')') fail('请补上右括号.'); pos++; return node('group', { value }); }
      fail('请检查运算符或括号的位置.');
    }
    function postfix() { let a = primary(); while (peek() === '%') { pos++; a = node('percent', { value: a }); } return a; }
    function power() { let a = postfix(); if (peek() === '^') { pos++; a = node('power', { left: a, right: unary() }); } return a; }
    function unary() { if (peek() === '+' || peek() === '-') { const op = tokens[pos++].type; return node('unary', { op, value: unary() }); } return power(); }
    function product() {
      let a = unary();
      while (true) {
        let op = peek(), implicit = false;
        if (['number', 'variable', '('].includes(op)) {
          if (op === 'number' && ['number', 'variable'].includes(tokens[pos - 1]?.type)) fail('请检查相邻的数字；字母后乘一个数时请补上乘号.');
          op = '*'; implicit = true;
        }
        else if (op === '*' || op === '/') pos++;
        else break;
        a = node('binary', { op, left: a, right: unary(), implicit });
      }
      return a;
    }
    function sum() { let a = product(); while (peek() === '+' || peek() === '-') { const op = tokens[pos++].type; a = node('binary', { op, left: a, right: product() }); } return a; }
    const ast = sum();
    if (pos !== tokens.length) fail('请检查多余的括号或运算符.');
    return { ast, normalized };
  }

  const constant = value => new Map(value.n ? [['', value]] : []);
  const coefficient = (p, key) => p.get(key) || R0;
  function pAdd(a, b, negative = false) {
    const p = new Map(a);
    for (const [key, value] of b) { const sum = radd(coefficient(p, key), negative ? rneg(value) : value); if (sum.n) p.set(key, sum); else p.delete(key); }
    return p;
  }
  function pScale(a, by) { return new Map([...a].map(([k, v]) => [k, rmul(v, by)]).filter(([, v]) => v.n)); }
  function pMultiply(a, b) {
    const p = new Map();
    for (const [ka, va] of a) for (const [kb, vb] of b) {
      const key = [...ka, ...kb].sort().join('');
      if (key.length > MAX_DEGREE) fail('这个表达式的次数超出当前自动核对范围，请交给老师讨论.', 'unsupported');
      const value = radd(coefficient(p, key), rmul(va, vb)); if (value.n) p.set(key, value); else p.delete(key);
    }
    return p;
  }
  const isConstant = p => [...p.keys()].every(k => !k);
  const degree = p => Math.max(0, ...[...p.keys()].map(k => k.length));
  function evaluate(ast) {
    if (ast.kind === 'number') return constant(ast.value);
    if (ast.kind === 'variable') return new Map([[ast.name, R1]]);
    if (ast.kind === 'group') return evaluate(ast.value);
    if (ast.kind === 'unary') return pScale(evaluate(ast.value), ast.op === '-' ? rat(-1) : R1);
    if (ast.kind === 'percent') return pScale(evaluate(ast.value), rat(1, 100));
    if (ast.kind === 'power') {
      const exponent = evaluate(ast.right);
      if (!isConstant(exponent)) fail('指数含有未知数，暂不自动核对.', 'unsupported');
      const e = coefficient(exponent, '');
      if (e.d !== 1n || e.n < 0n || e.n > BigInt(MAX_DEGREE)) fail('当前只核对0至4的整数次幂.', 'unsupported');
      const base = evaluate(ast.left); let p = constant(R1);
      for (let j = 0; j < Number(e.n); j++) p = pMultiply(p, base);
      return p;
    }
    const a = evaluate(ast.left), b = evaluate(ast.right);
    if (ast.op === '+') return pAdd(a, b);
    if (ast.op === '-') return pAdd(a, b, true);
    if (ast.op === '*') return pMultiply(a, b);
    if (!isConstant(b)) fail('这个式子的分母含有未知数，超出当前一元一次自动核对范围；请保留表达式交给老师讨论.', 'unsupported');
    const divisor = coefficient(b, '');
    if (!divisor.n) fail('分母不能为0.');
    return pScale(a, rdiv(R1, divisor));
  }
  const pEquals = (a, b) => a.size === b.size && [...a].every(([key, value]) => req(value, coefficient(b, key)));
  const read = text => { const p = parse(text); return { ...p, poly: evaluate(p.ast) }; };
  function numeric(input) { try { const p = read(input).poly; return isConstant(p) ? rstring(coefficient(p, '')) : null; } catch { return null; } }
  function equivalent(input, expected, variable = 'x') { try { return pEquals(read(input).poly, read(expected).poly); } catch { return false; } }

  function walk(ast, visit) { visit(ast); if (ast.value && typeof ast.value === 'object' && ast.value.kind) walk(ast.value, visit); if (ast.left) walk(ast.left, visit); if (ast.right) walk(ast.right, visit); }
  function details(ast) {
    const literals = [], variables = new Set(); let operations = 0, percent = false;
    walk(ast, n => { if (n.kind === 'number') literals.push({ raw: n.raw, value: rstring(n.value) }); if (n.kind === 'variable') variables.add(n.name); if (['binary', 'power', 'percent'].includes(n.kind)) operations++; if (n.kind === 'percent') percent = true; });
    return { literals, variables: [...variables].sort(), operations, percent };
  }
  const precedence = node => node.kind === 'binary' ? (['+', '-'].includes(node.op) ? 1 : 2) : node.kind === 'unary' ? 3 : node.kind === 'power' ? 4 : 5;
  function latex(ast, calculation = false, parent = 0) {
    let out;
    if (ast.kind === 'number') out = ast.raw.startsWith('.') ? '0' + ast.raw : ast.raw;
    else if (ast.kind === 'variable') out = ast.name;
    else if (ast.kind === 'group') out = '\\left(' + latex(ast.value, calculation) + '\\right)';
    else if (ast.kind === 'unary') out = ast.op + latex(ast.value, calculation, 3);
    else if (ast.kind === 'percent') out = latex(ast.value, calculation, 5) + '\\%';
    else if (ast.kind === 'power') out = latex(ast.left, calculation, 4) + '^{' + latex(ast.right, calculation) + '}';
    else if (ast.op === '/' && !calculation) out = '\\frac{' + latex(ast.left, calculation) + '}{' + latex(ast.right, calculation) + '}';
    else {
      const pr = precedence(ast);
      const symbol = { '+': '+', '-': '-', '*': '\\times ', '/': '\\div ' }[ast.op];
      out = latex(ast.left, calculation, pr) + symbol + latex(ast.right, calculation, ast.op === '-' || ast.op === '/' ? pr + 1 : pr);
    }
    return precedence(ast) < parent && !(ast.kind === 'binary' && ast.op === '/' && !calculation) ? '\\left(' + out + '\\right)' : out;
  }
  function escapeTex(text) { return String(text).replace(/[\\{}$%&#_^~]/g, c => ({ '\\': '\\textbackslash{}', '{': '\\{', '}': '\\}', '$': '\\$', '%': '\\%', '&': '\\&', '#': '\\#', '_': '\\_', '^': '\\textasciicircum{}', '~': '\\textasciitilde{}' }[c])); }
  function format(input, options = {}) {
    try {
      const comparison = String(input).split(/(≈|≠|≤|≥|<|>)/);
      if (comparison.length > 1) {
        const symbols = { '≈':'\\approx ', '≠':'\\ne ', '≤':'\\le ', '≥':'\\ge ', '<':'<', '>':'>' };
        if (comparison.some((part, index) => index % 2 === 0 && !inspect(part).ok)) fail('请检查比较关系中的表达式.');
        return comparison.map((part, index) => index % 2 ? symbols[part] : latex(parse(part).ast, options.division === 'sign')).join('');
      }
      const normalized = normalize(input);
      const parts = normalized.split('=');
      if (parts.some(p => !p)) fail('请补全等式.');
      return parts.map(p => latex(parse(p).ast, options.division === 'sign')).join('=');
    } catch { return '\\text{' + escapeTex(String(input ?? '').slice(0, MAX_INPUT)) + '}'; }
  }
  const formatCalculation = input => format(input, { division: 'sign' });
  function inspect(input) {
    try { const p = read(input), meta = details(p.ast); return { ok: true, normalized: p.normalized, numeric: isConstant(p.poly) ? rstring(coefficient(p.poly, '')) : null, variables: meta.variables, numbers: meta.literals.map(x => x.raw), numericLiterals: meta.literals.map(x => x.value), operations: meta.operations, percent: meta.percent, degree: degree(p.poly), latex: latex(p.ast), calculationLatex: latex(p.ast, true) }; }
    catch (error) { return { ok: false, kind: error.kind || 'input', message: error.message }; }
  }

  // A verified number is one quantity, not a bag of reusable digits. A known
  // 1/5 can be written as 0.2, 1/5 or used as the divisor in x/5; it does not
  // establish an unrelated quantity 5. Recognize numeric notation as a whole
  // before examining its leaves, without accepting arbitrary computations
  // involving numbers whose sources have not been supplied.
  function scalarLiteral(ast) {
    if (ast.kind === 'group' || ast.kind === 'unary') return scalarLiteral(ast.value);
    return ast.kind === 'number';
  }
  function numericNotation(ast) {
    if (ast.kind === 'group' || ast.kind === 'unary') return numericNotation(ast.value);
    if (ast.kind === 'number') return true;
    if (ast.kind === 'percent') return scalarLiteral(ast.value);
    return ast.kind === 'binary' && ast.op === '/' && scalarLiteral(ast.left) && scalarLiteral(ast.right);
  }
  function knownNumber(ast, available) {
    return numericNotation(ast) && available.has(rstring(coefficient(evaluate(ast), '')));
  }
  function unexplainedNumber(ast, allowed, available) {
    if (knownNumber(ast, available)) return null;
    if (ast.kind === 'number') return allowed.has(rstring(ast.value)) ? null : ast.raw;
    if (ast.kind === 'binary' && ast.op === '/' && numericNotation(ast.right)) {
      const divisor = coefficient(evaluate(ast.right), '');
      if (divisor.n && available.has(rstring(rdiv(R1, divisor)))) return unexplainedNumber(ast.left, allowed, available);
    }
    for (const child of [ast.value, ast.left, ast.right]) {
      if (!child?.kind) continue;
      const missing = unexplainedNumber(child, allowed, available);
      if (missing != null) return missing;
    }
    return null;
  }
  function hasNumberSources(input, originalNumbers = [], availableNumbers = []) {
    try {
      const allowed = new Set(originalNumbers.map(numeric).filter(value => value != null));
      const available = new Set(availableNumbers.map(numeric).filter(value => value != null));
      const parts = normalize(input).split('=');
      return parts.every(part => unexplainedNumber(read(part).ast, allowed, available) == null);
    } catch { return false; }
  }

  function checkDerivation(input, item, variable = 'x') {
    try {
      const expected = read(item.expr), expectedMeta = details(expected.ast);
      const chain = normalize(input).split('=');
      if (chain.some(p => !p)) fail('请补全等号两边.');
      if (chain.length > 4) fail('请把计算分成较短的步骤.');
      const parts = chain.map(read), first = parts[0], meta = details(first.ast);
      const expectedVariables = new Set(expectedMeta.variables);
      if (parts.some(p => details(p.ast).variables.some(name => !expectedVariables.has(name)))) return { ok: false, kind: 'variable', message: '这一步出现了没有设定的字母.请只使用当前数量所需的未知量，即使多余的字母能抵消，也需要说明它的含义.' };
      if (!parts.every(p => pEquals(p.poly, expected.poly))) return { ok: false, kind: 'math', message: '这一步的数量关系或计算还不相等，请检查用到的量和运算.' };
      const result = item.result == null ? expected : read(item.result);
      if (!pEquals(result.poly, expected.poly)) return { ok: false, kind: 'content', message: '本题的推导设置需要教师复核，当前不判错.' };
      const allowed = new Set(expectedMeta.literals.map(x => x.value));
      if (expectedMeta.percent) allowed.add('100'); // “百分之”本身定义分母100.
      // A learner may expand an already checked parent calculation instead of using its short result.
      for (const expression of item.sourceExpressions || []) for (const literal of details(read(expression).ast).literals) allowed.add(literal.value);
      const derivedResults = new Set();
      for (const value of item.allowedNumbers || []) { const number = numeric(value); if (number != null) { allowed.add(number); derivedResults.add(number); } }
      // Only a complete, explicitly available result can replace the calculation;
      // original literal leaves alone do not establish that a derivation was done.
      const knownResult = knownNumber(first.ast, derivedResults);
      const shortcut = expectedMeta.operations > 0 && meta.operations === 0 && (!knownResult || item.requireCalculation === true);
      const unexplained = !knownResult && unexplainedNumber(first.ast, allowed, derivedResults) != null;
      if (shortcut || unexplained) return { ok: false, kind: 'source', message: '数值正确，来源尚未说明.请用题目中的原数或已完成的推导写出计算过程，再使用简写结果.' };
      return { ok: true, kind: 'correct', message: '关系与来源都对应.', expression: first.normalized, result: numeric(item.result ?? item.expr), calculationLatex: latex(first.ast, true) };
    } catch (error) { return { ok: false, kind: error.kind || 'input', message: error.message || '请检查输入.' }; }
  }

  // Table cells name a quantity rather than prescribe one spelling of its
  // expression. Keep the derivation gate above strict, but allow exact algebra
  // after the caller has checked the cell's source dependencies. Coefficients
  // are collected only from this expression's actual expansion, never from a
  // solved value of x or arbitrary arithmetic with every number in the task.
  function tableCoefficients(ast) {
    const values = new Set(['0', '1', '-1']), cache = new Map(), limit = MAX_NODES * 4;
    const add = value => { values.add(rstring(value)); values.add(rstring(rneg(value))); };
    function expanded(node) {
      if (cache.has(node)) return cache.get(node);
      let terms;
      if (node.kind === 'number') terms = [['', node.value]];
      else if (node.kind === 'variable') terms = [[node.name, R1]];
      else if (node.kind === 'group') terms = expanded(node.value);
      else if (node.kind === 'unary' || node.kind === 'percent') {
        const factor = node.kind === 'percent' ? rat(1, 100) : node.op === '-' ? rat(-1) : R1;
        terms = expanded(node.value).map(([key, value]) => [key, rmul(value, factor)]);
      } else if (node.kind === 'power') {
        const exponent = Number(coefficient(evaluate(node.right), '').n);
        terms = [['', R1]];
        for (let i = 0; i < exponent; i++) terms = multiply(terms, expanded(node.left), node);
      } else if (node.op === '+' || node.op === '-') {
        terms = [...expanded(node.left), ...expanded(node.right).map(([key, value]) => [key, node.op === '-' ? rneg(value) : value])];
      } else if (node.op === '*') terms = multiply(expanded(node.left), expanded(node.right), node);
      else {
        const divisor = coefficient(evaluate(node.right), '');
        terms = expanded(node.left).map(([key, value]) => [key, rdiv(value, divisor)]);
      }
      if (terms.length > limit) terms = [...evaluate(node)];
      cache.set(node, terms);return terms;
    }
    function multiply(a, b, node) {
      if (a.length * b.length > limit) return [...evaluate(node)];
      return a.flatMap(([ka, va]) => b.map(([kb, vb]) => [[...ka, ...kb].sort().join(''), rmul(va, vb)]));
    }
    walk(ast, node => {
      for (const value of evaluate(node).values()) add(value);
      for (const [, value] of expanded(node)) add(value);
    });
    return values;
  }

  // A known rational coefficient may be written around its variable: 6x/5
  // and (6/5)x are the same fraction notation. Do not turn several unrelated
  // numeric factors (such as 7*6x/(7*5)) into a hidden source calculation.
  function tableScaleNotation(ast, available) {
    let numerator = R1, denominator = R1, top = 0, bottom = 0, valid = true;
    const quantities = [];
    function collect(node, below = false) {
      if (node.kind === 'group') return collect(node.value, below);
      if (node.kind === 'unary') { if (node.op === '-') numerator = rneg(numerator);return collect(node.value, below); }
      if (numericNotation(node)) {
        const value = coefficient(evaluate(node), '');
        if (below) { bottom++;denominator = rmul(denominator,value); }
        else { top++;numerator = rmul(numerator,value); }
        return;
      }
      if (node.kind === 'binary' && node.op === '*') { collect(node.left,below);collect(node.right,below);return; }
      if (node.kind === 'binary' && node.op === '/' && numericNotation(node.right)) { collect(node.left,below);collect(node.right,!below);return; }
      if (below || isConstant(evaluate(node))) valid = false;
      else quantities.push(node);
    }
    collect(ast);
    return valid && top <= 1 && bottom <= 1 && top + bottom > 0 && quantities.length && denominator.n && available.has(rstring(rdiv(numerator,denominator))) ? quantities : null;
  }
  function unexplainedTableNumber(ast, allowed, available) {
    if (knownNumber(ast,available)) return null;
    const scaled = tableScaleNotation(ast,available);
    if (scaled) {
      for (const quantity of scaled) { const missing = unexplainedTableNumber(quantity,allowed,available);if (missing != null) return missing; }
      return null;
    }
    if (ast.kind === 'number') return allowed.has(rstring(ast.value)) ? null : ast.raw;
    // An exponent counts repeated factors; it is not a new measured quantity.
    if (ast.kind === 'power') return unexplainedTableNumber(ast.left,allowed,available);
    for (const child of [ast.value,ast.left,ast.right]) {
      if (!child?.kind) continue;
      const missing = unexplainedTableNumber(child,allowed,available);if (missing != null) return missing;
    }
    return null;
  }

  /**
   * requiredDerivations: [{id, label?, completed:boolean}]. An explicit []
   * means the caller checked the sources and found no derived dependencies.
   * Omitting it retains the conservative derivation-only behavior.
   * alternatives: [{expr, sources, explain?, requiredDerivations?}]. These are
   * authored quantity representations, not equations evaluated at their roots.
   */
  function checkTableCell(input, item, variable = 'x') {
    const alternatives = Array.isArray(item?.alternatives) ? item.alternatives : [];
    const candidates = [item, ...alternatives.map(alternative => ({ ...item, ...alternative }))];
    const failures = [];
    for (const [index, candidate] of candidates.entries()) {
      try {
        const expected = read(candidate.expr), expectedMeta = details(expected.ast);
        const chain = normalize(input).split('=');
        if (chain.some(part => !part)) fail('请补全等号两边.');
        if (chain.length > 4) fail('请把计算分成较短的步骤.');
        const parts = chain.map(read), first = parts[0];
        const declared = new Set(expectedMeta.variables);
        if (parts.some(part => details(part.ast).variables.some(name => !declared.has(name)))) {
          failures.push({ok:false,kind:'variable',message:'这一格出现了没有设定的字母.请使用当前数量的未知量，不能用抵消来省略字母的含义.'});continue;
        }
        if (!parts.every(part => pEquals(part.poly, expected.poly))) {
          failures.push({ok:false,kind:'math',message:'这个式子还没有表示这一格的数量.可以换一种写法，但要符合该量的含义和已知关系.'});continue;
        }
        const dependencies = candidate.requiredDerivations;
        if (Array.isArray(dependencies) && dependencies.some(d => d?.completed !== true)) {
          const pending = dependencies.filter(d => d?.completed !== true);
          failures.push({ok:false,kind:'source',message:'请先完成“'+(pending[0]?.label||pending[0]?.id||'这一格的数据来源')+'”的推导，再使用结果或等价简写.',pendingSources:pending.map(d=>d?.id).filter(Boolean)});continue;
        }
        const strict = checkDerivation(input, { ...candidate, result:candidate.expr }, variable);
        if (!strict.ok) {
          // A bare computed constant still needs its own calculation or an
          // already verified value. Only nonconstant algebra gets this route.
          if (strict.kind !== 'source' || isConstant(expected.poly) || !Array.isArray(dependencies)) {
            failures.push(strict);continue;
          }
          const original = new Set(expectedMeta.literals.map(literal => literal.value));
          if (expectedMeta.percent) original.add('100');
          for (const expression of candidate.sourceExpressions || []) {
            for (const literal of details(read(expression).ast).literals) original.add(literal.value);
          }
          const established = new Set((candidate.allowedNumbers || []).map(numeric).filter(value => value != null));
          const coefficients = tableCoefficients(expected.ast);
          for (const value of coefficients) established.add(value);
          if (unexplainedTableNumber(first.ast, original, established) != null) {
            failures.push({ok:false,kind:'source',message:'数量值虽然相等，但这个写法引入了没有依据的新数.请使用题目数据、已完成的推导，或由本格原式展开、合并得到的数.'});continue;
          }
        }
        // Later terms in a written equality chain may simplify the established
        // expression, but may not introduce unrelated quantities that cancel.
        if (parts.length > 1) {
          const original = new Set(expectedMeta.literals.map(literal => literal.value));
          if (expectedMeta.percent) original.add('100');
          for (const expression of candidate.sourceExpressions || []) for (const literal of details(read(expression).ast).literals) original.add(literal.value);
          const established = tableCoefficients(expected.ast);
          for (const value of (candidate.allowedNumbers || []).map(numeric).filter(value => value != null)) established.add(value);
          if (parts.slice(1).some(part => unexplainedTableNumber(part.ast, original, established) != null)) {
            failures.push({ok:false,kind:'source',message:'等式链中出现了没有来源的新数.请保留由原式展开、合并或计算得到的量.'});continue;
          }
        }
        const final = parts[parts.length - 1], trace = [expected.normalized, ...parts.map(part => part.normalized)].filter((value,i,array)=>i===0||value!==array[i-1]);
        const sourceTrace = trace.length > 1 ? trace : [];
        return {ok:true,kind:'correct',message:sourceTrace.length?'这是这一数量的另一种正确写法，来源关系已对应.':'数量关系与来源都对应.',expression:final.normalized,result:numeric(candidate.expr),calculationLatex:latex(final.ast,true),sourceExpression:candidate.expr,sources:[...(candidate.sources||[])],explain:candidate.explain||'',matchedAlternativeIndex:index,sourceTrace};
      } catch (error) { failures.push({ok:false,kind:error.kind||'input',message:error.message||'请检查输入.'}); }
    }
    return failures.find(result=>result.kind==='source') || failures.find(result=>result.kind==='variable') || failures[0] || {ok:false,kind:'content',message:'这一格的可用表达式需要教师复核.'};
  }

  function sameEquation(a, b) {
    if (!a.size || !b.size || a.size !== b.size) return false;
    const [key, av] = a.entries().next().value, bv = coefficient(b, key);
    if (!bv.n) return false;
    const factor = rdiv(av, bv);
    return factor.n !== 0n && [...a].every(([k, value]) => req(value, rmul(coefficient(b, k), factor)));
  }
  const hasVariable = p => [...p.keys()].some(Boolean);
  function isolated(left, right) {
    function oneVariable(p) { return p.size === 1 && [...p][0][0].length === 1 && (req([...p][0][1], R1) || req([...p][0][1], rat(-1))); }
    return oneVariable(left) && isConstant(right) || oneVariable(right) && isConstant(left);
  }
  function checkEquation(input, expected, variable = 'x') {
    try {
      const parts = normalize(input).split('=');
      if (parts.length !== 2 || parts.some(p => !p)) fail('请填写一个完整方程，只保留一个等号.');
      const left = read(parts[0]), right = read(parts[1]), a = read(expected.left), b = read(expected.right);
      const expectedVariables = new Set([...details(a.ast).variables, ...details(b.ast).variables]);
      if ([...details(left.ast).variables, ...details(right.ast).variables].some(name => !expectedVariables.has(name))) return { ok: false, kind: 'variable', message: '方程中出现了本次没有设定的字母.请按当前设元表示数量，不能用两边抵消来省略对这个字母的说明.' };
      const inputDiff = pAdd(left.poly, right.poly, true), expectedDiff = pAdd(a.poly, b.poly, true);
      if (!hasVariable(inputDiff)) return { ok: false, kind: 'constraint', message: inputDiff.size ? '这个等式没有留下能确定未知数的关系，请回看表格中的数量.' : '这是恒等式，不能确定未知数.请检查哪个独立条件还没有用到.' };
      if (degree(inputDiff) > 1 || degree(expectedDiff) > 1) return { ok: false, kind: 'unsupported', message: '这个关系化简后不是一元一次方程，请保留表格并作为拓展问题讨论.' };
      if (!hasVariable(expectedDiff)) return { ok: false, kind: 'content', message: '本题的列式设置需要教师复核，当前不判错.' };
      const vars = new Set([...inputDiff.keys()].flatMap(k => [...k]));
      if (vars.size > 1) return { ok: false, kind: 'variable', message: '请按本次选定的设元表示其他量，方程中只保留一个未知数.' };
      if (!sameEquation(inputDiff, expectedDiff)) return { ok: false, kind: 'math', message: '方程还没有表达选中的等量关系，请核对两边各代表哪个量.' };
      if (isolated(left.poly, right.poly) && !isolated(a.poly, b.poly) && expected.allowSolved !== true) return { ok: false, kind: 'model', message: '结果可能正确.这一步请先写出表格中的数量等式，下一步再求未知数的值.' };
      return { ok: true, kind: 'correct', message: '方程表达了选中的等量关系.' };
    } catch (error) { return { ok: false, kind: error.kind || 'input', message: error.message || '请检查方程.' }; }
  }

  function validateProblem(problem) {
    const errors = [], label = problem?.id || '未命名题';
    const error = text => errors.push(label + ': ' + text);
    for (const key of ['id', 'title', 'group', 'source', 'stem']) if (typeof problem?.[key] !== 'string' || !problem[key].trim()) error('缺少' + key);
    if (!['linear', 'arithmetic', 'existence', 'branching', 'open', 'boundary'].includes(problem?.kind)) error('kind无效');
    const facts = new Set(['unknown']);
    if (!Array.isArray(problem?.facts) || !problem.facts.length) error('缺少事实来源');
    for (const f of problem?.facts || []) {
      if (!f?.id || facts.has(f.id)) error('事实ID缺失或重复: ' + f?.id);
      facts.add(f?.id);
      if (!f?.text) error('事实缺少文字: ' + f?.id);
      if (!['given', 'property', 'convention', 'example', 'derived'].includes(f?.kind)) error('事实类型无效: ' + f?.id);
    }
    if (!Array.isArray(problem?.routes) || !problem.routes.length) error('缺少设元路径');
    const routes = new Set();
    for (const route of problem?.routes || []) {
      const where = route?.id || '路径';
      if (!route?.id || routes.has(route.id)) error('路径ID缺失或重复: ' + where);
      routes.add(route?.id);
      if (!VARIABLES.test(route?.variable || '')) error(where + '的未知数字母无效');
      const refs = new Set(facts);
      function sources(item, desc) {
        if (!Array.isArray(item?.sources) || !item.sources.length) error(where + '/' + desc + '缺少来源');
        for (const source of item?.sources || []) if (!refs.has(source)) error(where + '/' + desc + '引用未定义或尚未推导的来源: ' + source);
      }
      function expression(value, desc, allowUnsupported = false) {
        try { read(value); } catch (e) { if (!(allowUnsupported && e.kind === 'unsupported')) error(where + '/' + desc + ': ' + e.message); }
      }
      for (const d of route?.derivations || []) {
        sources(d, d?.id || '推导');
        if (!d?.id || refs.has(d.id)) error(where + '/推导ID缺失或重复: ' + d?.id);
        expression(d?.expr, d?.id || '推导');
        if (d?.result != null && !equivalent(d.expr, d.result, route.variable)) error(where + '/' + d.id + '计算结果不相等');
        refs.add(d?.id);
      }
      if (!route?.table?.headers || !Array.isArray(route.table.rows)) error(where + '/缺少数量表');
      for (const [ri, row] of (route?.table?.rows || []).entries()) {
        if (!Array.isArray(row.cells) || row.cells.length + 1 !== route.table.headers.length) error(where + '/第' + (ri + 1) + '行与表头列数不一致');
        for (const [ci, cell] of (row.cells || []).entries()) {
          const desc = '表格' + (ri + 1) + '-' + (ci + 1);
          if (cell?.note != null) continue;
          sources(cell, desc);
          expression(cell?.expr, desc, ['open', 'boundary'].includes(problem.kind));
          for (const [ai, alternative] of (cell?.alternatives || []).entries()) {
            sources(alternative, desc+'的其他表示'+(ai+1));
            expression(alternative?.expr, desc+'的其他表示'+(ai+1), ['open', 'boundary'].includes(problem.kind));
          }
        }
      }
      if (route?.closure) sources(route.closure, '列式依据');
      for (const [i, equation] of (route?.equations || []).entries()) { expression(equation.left, '方程' + i + '左边', problem.kind === 'boundary'); expression(equation.right, '方程' + i + '右边', problem.kind === 'boundary'); }
      for (const [i, answer] of (route?.answers || []).entries()) expression(answer.expr, '答案' + i);
      for (const [i, check] of (route?.checks || []).entries()) if (check.expr != null && check.result != null && !equivalent(check.expr, check.result, route.variable)) error(where + '/检验' + i + '两边不相等');
      if (route?.verdict && !['valid', 'impossible', 'multiple', 'boundary', 'open'].includes(route.verdict.correct)) error(where + '/检验结论无效');
    }
    return errors;
  }

  const api = { equivalent, checkDerivation, checkTableCell, checkEquation, hasNumberSources, format, formatCalculation, numeric, validateProblem, normalize, inspect };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RatioWordProblemEngine = api;
})(typeof window === 'undefined' ? globalThis : window);
