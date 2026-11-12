(function () {
  'use strict';

  let sequence = 0;

  function mount(app, canUse = () => true) {
    const E = window.MathIsleEquationEngine;
    const entry = window.MathIsleMathEntry;
    const ink = window.MathIsleHandwriting;
    const escape = text => String(text).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const math = (tex, displayMode = false) => {
      try {
        return window.katex.renderToString(tex, { displayMode, trust: false, output: 'htmlAndMathml' });
      } catch {
        return escape(tex);
      }
    };

    let run = null;
    const topicLabel = topic => topic.code + ' · ' + topic.name;
    const setLabel = (topic, number) => topic.code + '-' + String(number).padStart(2, '0');

    const prompts = {
      isolate: '先移走含未知数的一边的常数项，写出变形后的方程。',
      move: '先移项，把含未知数的项放在一边，常数项放在另一边。',
      expand: '先去括号，写出展开后的方程。',
      clear: '先去分母，写出变形后的方程。可以保留括号。',
    };

    function clearDrafts() {
      if (run) run.questions.forEach((_, i) => ink.pages.delete('equations:' + run.id + ':' + i));
    }

    function showTopics() {
      clearDrafts();
      run = null;
      app.innerHTML = [
        '<section class="equation-hero">',
        '<p class="equation-chapter">第4章 · 一元一次方程</p>',
        '<h1 tabindex="-1">解方程专项</h1>',
        '<p>每类 ' + E.setCount + ' 套，每套 ' + E.questionCount + ' 题。</p>',
        '</section><ol class="equation-topics">',
        E.topics.map(topic =>
          '<li><button type="button" class="equation-topic" data-topic="' + topic.code + '">' +
          '<span class="equation-topic-number">' + topic.code + '</span>' +
          '<span><strong>' + topic.name + '</strong><small>' + topic.goal + '</small></span>' +
          '<span class="equation-topic-arrow" aria-hidden="true">→</span></button></li>'
        ).join(''),
        '</ol>',
      ].join('');
      app.querySelectorAll('[data-topic]').forEach(button => {
        button.onclick = () => start(button.dataset.topic);
      });
    }

    function start(code, number = 1) {
      const questions = E.getSet(code, number);
      const topic = E.topics.find(item => item.code === code);
      clearDrafts();
      run = {
        id: ++sequence, topic, number, questions, index: 0, results: [],
        wrong: false, done: false, accepted: '', keyboardOpen: true,
      };
      renderQuestion();
      window.scrollTo(0, 0);
    }

    function returnToTopics() {
      showTopics();
      app.querySelector('h1').focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }

    function setPicker() {
      const options = Array.from({ length: E.setCount }, (_, index) => {
        const number = index + 1;
        return '<option value="' + number + '"' + (run.number === number ? ' selected' : '') +
          '>' + setLabel(run.topic, number) + '</option>';
      }).join('');
      return '<label class="equation-set-picker">套号 <select id="equation-set" aria-label="套号">' +
        options + '</select></label>';
    }

    function hasWorkInSet() {
      if (run.index || run.done || run.wrong || run.accepted) return true;
      if (ink.pages.get('equations:' + run.id + ':' + run.index)?.strokes.length) return true;
      return [...app.querySelectorAll('.equation-form math-field, .equation-form input, .equation-form select')]
        .some(field => field.value && field.value.trim());
    }

    function bindSetPicker(confirmSwitch) {
      const picker = app.querySelector('#equation-set');
      picker.onchange = () => {
        if (!canUse()) return;
        const number = Number(picker.value);
        if (number === run.number) return;
        if (confirmSwitch && hasWorkInSet() && !window.confirm('切换套号会放弃本套当前进度。要切换吗？')) {
          picker.value = String(run.number);
          return;
        }
        start(run.topic.code, number);
      };
    }

    function phase(q) {
      if (run.done) return 'done';
      if (run.accepted) return 'answer';
      if (q.focus === 'verify' || q.focus === 'property') return q.focus;
      return run.topic.id !== 'mixed' && run.index < 2 && q.focus !== 'answer' ? 'step' : 'answer';
    }

    function field(name, label, hideLabel = false) {
      return '<div class="equation-field"><label for="eq-' + name + '"' +
        (hideLabel ? ' class="sr-only"' : '') + '>' + label + '</label>' +
        '<input type="text" id="eq-' + name + '" name="' + name + '" aria-label="' + label +
        '" maxlength="110" autocomplete="off" spellcheck="false"></div>';
    }

    function select(name, label, options) {
      return '<div class="equation-field"><label for="eq-' + name + '">' + label + '</label>' +
        '<select id="eq-' + name + '" name="' + name + '" required><option value="">请选择</option>' +
        options.map(([key, value]) => '<option value="' + key + '">' + value + '</option>').join('') + '</select></div>';
    }

    function formBody(q, current) {
      const equalSign = '<span class="equation-symbol" aria-hidden="true">' + math('=') + '</span>';
      if (current === 'verify') {
        return '<p class="equation-prompt">把 ' + math(q.variable + '=' + E.numericTex(q.candidate)) +
          ' 代入方程，填写两边的值，再判断。</p><div class="equation-fields two">' +
          field('left', '左边的值') + '<span aria-hidden="true"></span>' + field('right', '右边的值') + '</div>' +
          '<div class="equation-verdict">' + select('verdict', '这个值是方程的解吗？', [['yes', '是'], ['no', '否']]) + '</div>';
      }
      if (current === 'property') {
        const goal = q.needsAnswer ? '消去右边含 ' + math(q.variable) + ' 的项。'
          : '把方程化成 ' + math(q.variable + '=c') + '（' + math('c') + ' 为常数）的形式。';
        return '<p class="equation-prompt">' + goal + '</p><div class="equation-fields operation">' +
          select('operation', '等式两边都', [['add', '加'], ['subtract', '减'], ['multiply', '乘'], ['divide', '除以']]) +
          field('operand', '同一个数或式') + '</div>';
      }
      if (current === 'step') {
        return '<p class="equation-prompt">' + prompts[q.focus] + '</p><div class="equation-fields two">' +
          field('left', '等号左边') + equalSign + field('right', '等号右边') + '</div>';
      }
      return '<p class="equation-prompt">' + (run.accepted ? '继续解方程，写出未知数的值。' : '解方程。') +
        '</p><div class="equation-fields solution"><span class="equation-symbol" aria-hidden="true">' +
        math(q.variable + '=') + '</span>' + field('value', q.variable + ' 的值', true) + '</div>';
    }

    function explanation(q) {
      if (q.focus === 'verify') {
        const values = q.values.map(value => E.numericTex(value));
        const yes = values[0] === values[1];
        return [
          { label: '代入后的值', tex: values[0] + (yes ? '=' : '\\ne ') + values[1] },
          { label: '所以 ' + q.variable + ' 取这个值时' + (yes ? '是' : '不是') + '方程的解。' },
        ];
      }
      if (q.focus === 'property') {
        const operand = q.operand.a.n ? q.variable : E.numericTex(q.operand.b);
        const principle = q.operation === 'divide' ? '基本性质2 · 两边同除' : '基本性质1 · 两边同减';
        return [{ label: principle, operand, tex: q.lines[0]?.tex || q.tex }, ...q.lines.slice(1)];
      }
      return q.lines.length ? q.lines : [{ label: '方程的解', tex: q.tex }];
    }

    function steps(q, open = false) {
      return '<details class="equation-review"' + (open ? ' open' : '') + '><summary>参考步骤</summary><ol>' +
        explanation(q).map(item => '<li><span class="step-label">' + escape(item.label) +
          (item.operand ? ' ' + math(item.operand) : '') + '</span>' + (item.tex ? math(item.tex) : '') + '</li>').join('') +
        '</ol></details>';
    }

    function renderQuestion(focus = true) {
      const q = run.questions[run.index];
      const current = phase(q);
      const progress = run.index + Number(run.done);
      const total = run.questions.length;
      const finished = run.results[run.index];
      const accepted = run.accepted ? '<p class="equation-accepted"><span>上一步</span>' + math(run.accepted) + '</p>' : '';
      const form = '<form class="equation-form" id="equation-form">' + formBody(q, current) +
        '<div class="equation-actions">' +
        '<button class="btn" type="submit">检查' + (current === 'step' || current === 'property' ? '这一步' : '答案') + '</button>' +
        '<button class="btn secondary" type="button" id="equation-hint">提示</button>' +
        '<button class="text-button" type="button" id="equation-reveal">看步骤并跳过</button>' +
        '</div><p id="equation-message" class="equation-note" role="status" aria-live="polite"></p></form>';
      const complete = finished
        ? '<p class="equation-note ' + (finished.status === 'revealed' ? 'info' : 'success') + '">' +
          (finished.status === 'revealed' ? '可以对照步骤，再试同类题。' : '答对了。') +
          '</p>' + steps(q, finished.status === 'revealed') +
          '<div class="equation-actions"><button type="button" id="equation-next" class="btn">' +
          (run.index === total - 1 ? '查看本套结果' : '下一题') + '</button></div>'
        : '';
      app.innerHTML = '<div class="equation-title"><div><p class="equation-chapter">' + run.topic.pages +
        '</p><h1 tabindex="-1">' + topicLabel(run.topic) + '</h1></div>' +
        '<div class="equation-run-tools">' + setPicker() +
        '<button type="button" id="equation-topics" class="btn secondary">选题型</button></div></div>' +
        '<div class="equation-progress"><span>第 ' + (run.index + 1) + ' / ' + total + ' 题</span>' +
        '<progress value="' + progress + '" max="' + total + '" aria-label="本套完成进度"></progress></div>' +
        '<div class="equation-workbench"><section class="panel exercise" aria-label="当前题目">' +
        '<div class="core-formula" tabindex="0">' + math(q.tex, true) + '</div>' + accepted +
        (run.done ? complete : form) + '</section><aside id="equation-ink"></aside></div>';

      app.querySelector('#equation-topics').onclick = returnToTopics;
      bindSetPicker(true);
      ink.mount(app.querySelector('#equation-ink'), 'equations:' + run.id + ':' + run.index);
      if (run.done) {
        const next = app.querySelector('#equation-next');
        next.onclick = nextQuestion;
        next.focus({ preventScroll: true });
      } else {
        const formElement = app.querySelector('#equation-form');
        const currentRun = run;
        entry.install(formElement, 'equation', true, {
          open: currentRun.keyboardOpen,
          onToggle: open => { currentRun.keyboardOpen = open; },
        });
        formElement.onsubmit = event => check(event, q, current);
        app.querySelector('#equation-hint').onclick = () => message(hint(q, current), 'info', true);
        app.querySelector('#equation-reveal').onclick = () => completeQuestion('revealed');
        if (focus) app.querySelector('h1').focus({ preventScroll: true });
      }
    }

    function hint(q, current) {
      if (current === 'verify') return '分别算出等号左边和右边的值。两边的值相等时，这个值是方程的解。';
      if (current === 'property') {
        return q.operation === 'divide'
          ? '要把未知数的系数化为1，等式两边都除以原来的系数。'
          : '找出要消去的项。等式两边同时减去这一项。';
      }
      if (run.accepted || q.focus === 'answer') return '先得到一个系数乘未知数等于一个数的式子，再把两边都除以未知数的系数。';
      if (q.focus === 'clear') {
        const decimalDenominator = q.lines[0]?.label.includes('分母化为整数');
        return (decimalDenominator ? '先把每个分式的分子、分母同乘10，把分母化为整数。' : '') +
          '找出各分母的最小公倍数。两边的每一项都要乘，包括原来的整数项。';
      }
      if (q.focus === 'expand') return '用括号外的因数分别乘括号内的每一项。把括号前的符号一起考虑。';
      return '把含未知数的项移到一边，常数项移到另一边。移到等号另一边的项要变号。';
    }

    function message(text, style, isHint = false) {
      const target = app.querySelector('#equation-message');
      target.className = 'equation-note ' + style;
      target.textContent = (isHint ? '提示。' : '') + text;
    }

    function solutionFeedback(q, value) {
      const a = q.answer;
      if (a.n && E.checkNumber(value, { n: -a.n, d: a.d }, q.variable)) {
        return '结果的绝对值对了，再检查最后除法的符号。';
      }
      const reciprocal = a.n < 0n ? { n: -a.d, d: -a.n } : { n: a.d, d: a.n };
      if (a.n && E.checkNumber(value, reciprocal, q.variable)) {
        return '系数化为1时，用等号另一边的数除以未知数的系数。检查除数和被除数的顺序。';
      }
      return '把你求出的值代入原方程，分别算一下两边，再检查变形。';
    }

    function rememberKeyboard() {
      const keypad = app.querySelector('.keypad-disclosure');
      if (keypad) run.keyboardOpen = keypad.open;
    }

    function check(event, q, current) {
      event.preventDefault();
      rememberKeyboard();
      const data = new FormData(event.currentTarget);
      try {
        if (current === 'verify') {
          const result = E.checkVerification(q, data.get('left'), data.get('right'), data.get('verdict'));
          if (!result.ok) return retry(result.message);
        } else if (current === 'property') {
          if (!E.checkProperty(q, data.get('operation'), data.get('operand'))) return retry(hint(q, current));
          if (q.needsAnswer) {
            run.accepted = q.lines[0].tex;
            renderQuestion();
            return;
          }
        } else if (current === 'step') {
          const result = E.checkStep(q, data.get('left'), data.get('right'));
          if (!result.ok) return retry(result.message);
          const valueOf = name => event.currentTarget.querySelector('#eq-' + name + '-math').value;
          run.accepted = valueOf('left') + '=' + valueOf('right');
          renderQuestion();
          return;
        } else if (!E.checkNumber(data.get('value'), q.answer, q.variable)) {
          return retry(solutionFeedback(q, data.get('value')));
        }
      } catch (error) {
        message(error.message, 'error');
        return;
      }
      completeQuestion(run.wrong ? 'corrected' : 'first');
    }

    function retry(text) {
      run.wrong = true;
      message(text, 'error');
    }

    function completeQuestion(status) {
      if (run.done) return;
      rememberKeyboard();
      run.done = true;
      run.results[run.index] = { status };
      renderQuestion(false);
    }

    function nextQuestion() {
      if (run.index === run.questions.length - 1) return results();
      run.index++;
      run.done = false;
      run.wrong = false;
      run.accepted = '';
      renderQuestion();
      window.scrollTo(0, 0);
    }

    function results() {
      const names = { first: '首答全对', corrected: '订正后答对', revealed: '看过步骤' };
      const first = run.results.filter(item => item.status === 'first').length;
      const corrected = run.results.filter(item => item.status === 'corrected').length;
      const total = run.questions.length;
      const skipped = total - first - corrected;
      const nextTopic = E.topics[E.topics.indexOf(run.topic) + 1];
      const lastSet = run.number === E.setCount;
      const nextNumber = lastSet ? run.number : run.number + 1;
      app.innerHTML = '<div class="equation-title"><div><p class="equation-chapter">' +
        topicLabel(run.topic) + ' · ' + setLabel(run.topic, run.number) +
        '</p><h1 tabindex="-1">本套结果</h1></div>' + setPicker() + '</div>' +
        '<section class="panel equation-result"><p><strong>首答全对 ' + first + ' / ' + total + '</strong>' +
        (corrected ? ' · 订正后答对 ' + corrected + ' 题' : '') + (skipped ? ' · 看过步骤 ' + skipped + ' 题' : '') +
        '</p><div class="equation-actions">' +
        '<button class="btn" type="button" id="equation-again">' +
        (lastSet ? '重练本套' : '下一套 · ' + setLabel(run.topic, nextNumber)) + '</button>' +
        (nextTopic ? '<button type="button" class="btn secondary" id="equation-next-topic">下一类 · ' + nextTopic.code + '</button>' : '') +
        '<button class="text-button" type="button" id="equation-topics">返回题型</button>' +
        '</div><ol class="equation-results-list">' +
        run.questions.map((q, i) => '<li><details><summary><span>第 ' + (i + 1) + ' 题</span>' +
          math(q.tex) + '<small>' + names[run.results[i].status] + '</small></summary>' + steps(q, true) +
          '</details></li>').join('') + '</ol></section>';
      app.querySelector('#equation-again').onclick = () => start(run.topic.code, nextNumber);
      if (nextTopic) app.querySelector('#equation-next-topic').onclick = () => start(nextTopic.code);
      app.querySelector('#equation-topics').onclick = returnToTopics;
      bindSetPicker(false);
      app.querySelector('h1').focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }

    function requireSession(event) {
      if (canUse()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    app.addEventListener('click', requireSession, true);
    app.addEventListener('submit', requireSession, true);
    showTopics();

    return {
      destroy() {
        clearDrafts();
        run = null;
        app.removeEventListener('click', requireSession, true);
        app.removeEventListener('submit', requireSession, true);
        app.replaceChildren();
      },
    };
  }

  window.MathIsleEquationPractice = { mount };
  const standalone = document.querySelector('[data-equations-standalone]');
  if (standalone) mount(standalone);
})();
