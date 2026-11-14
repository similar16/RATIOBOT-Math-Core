(function () {
  'use strict';

  let sequence = 0;

  function mount(app, canUse = () => true, { code, onBack, onComplete } = {}) {
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
    const backLabel = onBack ? '返回专项目录' : '选题型';

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
        id: ++sequence, topic, number, questions, index: 0, drafts: [], answers: [], keyboardOpen: true, started: null, attemptId: window.crypto.randomUUID(),
      };
      renderQuestion();
      window.scrollTo(0, 0);
    }

    function returnToTopics() {
      if (onBack) {
        onBack(run.topic.code);
        return;
      }
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
      if (run.answers.some(Boolean) || run.drafts.some(Boolean)) return true;
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

    function needsStep(q, index) {
      return run.topic.id !== 'mixed' && index < 2 && q.focus !== 'answer';
    }

    function field(name, label, hideLabel = false) {
      return '<div class="equation-field"><label for="eq-' + name + '"' +
        (hideLabel ? ' class="sr-only"' : '') + '>' + label + '</label>' +
        '<input type="text" id="eq-' + name + '" name="' + name + '" aria-label="' + label +
        '" maxlength="110" autocomplete="off" spellcheck="false"></div>';
    }

    function formBody(q) {
      const step = needsStep(q, run.index)
        ? '<p class="equation-prompt">' + prompts[q.focus] + '</p><div class="equation-fields two">' +
          field('left', '等号左边') + '<span class="equation-symbol" aria-hidden="true">' + math('=') +
          '</span>' + field('right', '等号右边') + '</div>'
        : '';
      return step + '<p class="equation-prompt">写出未知数的值。</p>' +
        '<div class="equation-fields solution"><span class="equation-symbol" aria-hidden="true">' +
        math(q.variable + '=') + '</span>' + field('value', q.variable + ' 的值', true) + '</div>';
    }

    function steps(q) {
      const lines = q.lines.length ? q.lines : [{ label: '方程的解', tex: q.tex }];
      return '<ol>' + lines.map(item => '<li><span class="step-label">' + escape(item.label) +
        '</span>' + math(item.tex) + '</li>').join('') + '</ol>';
    }

    function renderQuestion(focus = true) {
      const q = run.questions[run.index];
      const total = run.questions.length;
      const progress = run.answers.filter(Boolean).length;
      const last = run.index === total - 1;
      const form = '<form class="equation-form" id="equation-form">' + formBody(q) +
        '<div class="equation-actions">' +
        (run.index ? '<button class="btn secondary" type="button" id="equation-previous">上一题</button>' : '') +
        '<button class="btn" type="submit" id="equation-next">' +
        (last ? '核对本套答案' : '下一题') + '</button></div></form>';
      app.innerHTML = '<div class="equation-title"><div><p class="equation-chapter">' + run.topic.pages +
        '</p><h1 tabindex="-1">' + topicLabel(run.topic) + '</h1></div>' +
        '<div class="equation-run-tools">' + setPicker() +
        '<button type="button" id="equation-topics" class="btn secondary">' + backLabel + '</button></div></div>' +
        '<div class="equation-progress"><span>第 ' + (run.index + 1) + ' / ' + total + ' 题</span>' +
        '<progress value="' + progress + '" max="' + total + '" aria-label="本套已填写题数"></progress></div>' +
        '<div class="equation-workbench"><section class="panel exercise" aria-label="当前题目">' +
        '<div class="core-formula" tabindex="0">' + math(q.tex, true) + '</div>' + form + '</section><aside id="equation-ink"></aside></div>';

      app.querySelector('#equation-topics').onclick = returnToTopics;
      bindSetPicker(true);
      ink.mount(app.querySelector('#equation-ink'), 'equations:' + run.id + ':' + run.index);
      const formElement = app.querySelector('#equation-form');
      const currentRun = run;
      for (const input of formElement.querySelectorAll('input')) {
        input.dataset.latex = run.drafts[run.index]?.[input.name] ?? '';
      }
      formElement.addEventListener('math-entry-ready', () => { currentRun.started ??= performance.now(); }, { once: true });
      entry.install(formElement, 'equation', true, {
        open: currentRun.keyboardOpen,
        onToggle: open => { currentRun.keyboardOpen = open; },
      });
      formElement.onsubmit = event => {
        event.preventDefault();
        saveDraft(formElement);
        run.answers[run.index] = Object.fromEntries(new FormData(formElement));
        if (!last) return goTo(run.index + 1);
        const missing = run.questions.findIndex((_, index) => !run.answers[index]);
        if (missing >= 0) return goTo(missing);
        results();
      };
      const previous = app.querySelector('#equation-previous');
      if (previous) previous.onclick = () => {
        saveDraft(formElement);
        goTo(run.index - 1);
      };
      if (focus) app.querySelector('h1').focus({ preventScroll: true });
    }

    function saveDraft(form) {
      const fields = [...form.querySelectorAll('math-field')];
      if (!fields.length) return;
      const draft = Object.fromEntries(fields.map(field =>
        [field.id.slice(3, -5), field.value]));
      const previous = run.drafts[run.index];
      if (fields.some(field => field.value) || previous) run.drafts[run.index] = draft;
      if (previous && Object.keys(draft).some(key => draft[key] !== previous[key])) {
        delete run.answers[run.index];
      }
      const keypad = form.querySelector('.keypad-disclosure');
      if (keypad) run.keyboardOpen = keypad.open;
    }

    function goTo(index) {
      run.index = index;
      renderQuestion();
      window.scrollTo(0, 0);
    }

    function grade(q, index) {
      const { left, right, value } = run.answers[index];
      const checks = [() => E.checkNumber(value, q.answer, q.variable)];
      if (needsStep(q, index)) checks.unshift(() => E.checkStep(q, left, right).ok);
      return checks.map(check => {
        try { return check(); } catch { return false; }
      });
    }

    function results() {
      const elapsed = Math.ceil(performance.now() - (run.started ?? performance.now()));
      const at = Date.now();
      clearDrafts();
      const grades = run.questions.map(grade);
      const correct = grades.filter(checks => checks.every(Boolean)).length;
      const total = run.questions.length;
      const activity = onComplete?.({id:run.attemptId,code:run.topic.code,correct,elapsed,at});
      const duration = window.RatioAutumnBreak?.time(elapsed) ?? (elapsed / 1000).toFixed(2) + ' 秒';
      const nextTopic = E.topics[E.topics.indexOf(run.topic) + 1];
      const lastSet = run.number === E.setCount;
      const nextNumber = lastSet ? run.number : run.number + 1;
      app.innerHTML = '<div class="equation-title"><div><p class="equation-chapter">' +
        topicLabel(run.topic) + ' · ' + setLabel(run.topic, run.number) +
        '</p><h1 tabindex="-1">本套结果</h1></div>' + setPicker() + '</div>' +
        '<section class="panel equation-result"><p><strong>答对 ' + correct + ' / ' + total + ' 题</strong>' +
        ' · 用时 ' + duration + '</p>' +
        (activity ? '<p role="status">' + escape(activity) + '</p>' : '') + '<div class="equation-actions">' +
        '<button class="btn" type="button" id="equation-again">' +
        (lastSet ? '重练本套' : '下一套 · ' + setLabel(run.topic, nextNumber)) + '</button>' +
        (nextTopic ? '<button type="button" class="btn secondary" id="equation-next-topic">下一类 · ' + nextTopic.code + '</button>' : '') +
        '<button class="text-button" type="button" id="equation-topics">' +
        (onBack ? backLabel : '返回题型') + '</button>' +
        '</div><ol class="equation-results-list">' +
        run.questions.map((q, i) => {
          const checks = grades[i];
          const { left, right, value } = run.drafts[i];
          const status = checks.length === 2
            ? '步骤' + (checks[0] ? '正确' : '有误') + ' · 答案' + (checks[1] ? '正确' : '有误')
            : (checks[0] ? '正确' : '有误');
          return '<li><details><summary><span>第 ' + (i + 1) + ' 题</span>' +
            math(q.tex) + '<small>' + status + '</small></summary><p>你的作答：' +
            (left ? math(left + '=' + right) + '，' : '') + math(q.variable + '=' + value) +
            '</p><p>参考步骤</p>' + steps(q) + '</details></li>';
        }).join('') + '</ol></section>';
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
    if (code && E.topics.some(topic => topic.code === code)) start(code);
    else showTopics();

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
