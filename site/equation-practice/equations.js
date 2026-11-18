(function () {
  'use strict';

  let sequence = 0;

  function mount(app, canUse = () => true, { code, onBack, onComplete, correctionStore } = {}) {
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

    function stepFields(q) {
      return '<p class="equation-prompt">' + prompts[q.focus] + '</p><div class="equation-fields two">' +
          field('left', '等号左边') + '<span class="equation-symbol" aria-hidden="true">' + math('=') +
          '</span>' + field('right', '等号右边') + '</div>';
    }

    function solutionField(q) {
      return '<p class="equation-prompt">写出未知数的值。</p>' +
        '<div class="equation-fields solution"><span class="equation-symbol" aria-hidden="true">' +
        math(q.variable + '=') + '</span>' + field('value', q.variable + ' 的值', true) + '</div>';
    }

    function formBody(q) {
      return (needsStep(q, run.index) ? stepFields(q) : '') + solutionField(q);
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
        variable: q.variable,
        open: currentRun.keyboardOpen,
        onToggle: open => { currentRun.keyboardOpen = open; },
      });
      formElement.onsubmit = event => {
        event.preventDefault();
        if (!formElement.isConnected || run !== currentRun || run.correction || !canUse()) return;
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

    function checkedPart(question, part, answer) {
      try {
        if (part === 'step') return E.checkStep(question, answer.left || '', answer.right || '');
        return { ok: E.checkNumber(answer.value || '', question.answer, question.variable),
          message: '把求出的值代回原方程，再检查等号两边是否相等.' };
      } catch (error) {
        return { ok: false, message: error.message };
      }
    }

    const stepNames = { isolate: '移项', move: '移项', expand: '去括号', clear: '去分母' };
    function partName(question, part) {
      return part === 'step' ? (stepNames[question.focus] || '方程变形') : '方程的解';
    }

    function inspectAnswers() {
      return run.questions.map((q, i) => {
        const parts = needsStep(q, i) ? ['step', 'value'] : ['value'];
        return parts.map(part => {
          const firstCorrect = checkedPart(q, part, run.answers[i]).ok;
          const repair = run.correction.repairs[i]?.[part];
          const corrected = !firstCorrect && !!repair && checkedPart(q, part, repair).ok;
          return { index: i, part, firstCorrect, corrected };
        });
      });
    }

    function results() {
      run.correction = {
        kind: 'equation', runId: run.attemptId, code: run.topic.code, number: run.number,
        answers: run.answers, drafts: run.drafts, repairs: {},
        elapsed: Math.max(0, Math.ceil(performance.now() - (run.started ?? performance.now()))), at: Date.now(),
      };
      const rows = inspectAnswers();
      if (rows.some(row => row.some(item => !item.firstCorrect))) {
        run.memoryOnly = correctionStore?.write(run.correction) === false;
        showCorrection(rows);
      } else {
        completeSet(rows);
      }
    }

    function previousExpression(item, useRepair = false) {
      const q = run.questions[item.index];
      const answer = useRepair ? run.correction.repairs[item.index][item.part] : run.answers[item.index];
      const tex = useRepair ? answer.tex : run.drafts[item.index];
      const show = key => tex?.[key] || entry.toLatex(answer[key] || '');
      return math(item.part === 'step' ? show('left') + '=' + show('right') : q.variable + '=' + show('value'));
    }

    function correctionSummary(rows) {
      const wrong = rows.filter(row => row.some(item => !item.firstCorrect));
      return '<ul class="equation-error-list">' + wrong.map(row => {
        const q = run.questions[row[0].index];
        return '<li><b>第 ' + (row[0].index + 1) + ' 题</b> ' + row.map(item => {
          const status = item.firstCorrect ? '首答正确' : item.corrected ? '✓ 已订正' : '✗ 待订正';
          return '<span class="equation-part-status' + (!item.firstCorrect && !item.corrected ? ' needs-repair' : '') + '">' +
            partName(q, item.part) + ' ' + status + '</span>';
        }).join(' ') + '</li>';
      }).join('') + '</ul>';
    }

    function showCorrection(rows) {
      const outstanding = rows.flat().filter(item => !item.firstCorrect && !item.corrected);
      if (!outstanding.length) return completeSet(rows);
      const current = outstanding[0], i = current.index, q = run.questions[i], state = run.correction;
      const wrongCount = rows.filter(row => row.some(item => !item.firstCorrect)).length;
      const context = rows[i].filter(item => item.firstCorrect || item.corrected).map(item =>
        '<p class="equation-accepted">✓ ' + partName(q, item.part) +
        (item.corrected ? '已订正 ' : '首答正确 ') + previousExpression(item, item.corrected) + '</p>').join('');
      app.innerHTML = '<div class="equation-title"><div><p class="equation-chapter">' +
        topicLabel(run.topic) + ' · ' + setLabel(run.topic, run.number) + '</p><h1 tabindex="-1">有错题，请完成订正</h1></div></div>' +
        '<section class="panel equation-result equation-correction-summary"><h2>✗ ' + wrongCount +
        ' 道错题，还需订正 ' + outstanding.length + ' 步</h2><p><strong>首答答对 ' +
        (rows.length - wrongCount) + ' / ' + rows.length + ' 题</strong> · 用时 ' +
        durationText(state.elapsed) + '</p>' + correctionSummary(rows) +
        (run.memoryOnly ? '<p role="status">当前浏览器只能暂存订正进度，请在关闭页面前完成订正.</p>' : '') + '</section>' +
        '<div class="equation-workbench"><section class="panel exercise"><h2 tabindex="-1">订正第 ' +
        (i + 1) + ' 题 · ' + partName(q, current.part) + '</h2><div class="core-formula">' + math(q.tex, true) +
        '</div><p class="equation-first-entry">首答有误 ' + previousExpression(current) + '</p>' + context +
        '<form class="equation-form" id="equation-repair-form">' +
        (current.part === 'step' ? stepFields(q) : solutionField(q)) +
        '<div class="equation-note error" role="alert" id="equation-repair-feedback"></div>' +
        '<div class="equation-actions"><button class="btn" type="submit" id="equation-repair-check">核对这一步</button></div></form>' +
        '</section><aside id="equation-ink"></aside></div>';

      const form = app.querySelector('#equation-repair-form');
      const feedback = app.querySelector('#equation-repair-feedback');
      entry.install(form, 'equation', true, { variable: q.variable, open: run.keyboardOpen,
        onToggle: open => { if (run?.correction === state) run.keyboardOpen = open; } });
      ink.mount(app.querySelector('#equation-ink'), 'equations:' + run.id + ':' + i);
      form.onsubmit = event => {
        event.preventDefault();
        if (!form.isConnected || run?.correction !== state || !canUse()) return;
        const answer = Object.fromEntries(new FormData(form));
        const result = checkedPart(q, current.part, answer);
        if (!result.ok) {
          feedback.textContent = '✗ 这一步仍有误. ' + (result.message || '请重新填写.').replaceAll('。', '.');
          return;
        }
        const tex = Object.fromEntries([...form.querySelectorAll('math-field')].map(field =>
          [field.id.slice(3, -5), field.value]));
        (state.repairs[i] ||= {})[current.part] = { ...answer, tex };
        run.memoryOnly = correctionStore?.write(state) === false;
        showCorrection(inspectAnswers());
      };
      app.querySelector('h1').focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }

    function durationText(elapsed) {
      return window.RatioAutumnBreak?.time(elapsed) ?? (elapsed / 1000).toFixed(2) + ' 秒';
    }

    function completeSet(rows) {
      if (!canUse()) return;
      const total = rows.length;
      const correct = rows.filter(row => row.every(item => item.firstCorrect)).length;
      const { elapsed, at, runId } = run.correction;
      const activity = onComplete?.({ id: runId, code: run.topic.code, correct, elapsed, at });
      if (correct < total) correctionStore?.clear(runId);
      clearDrafts();
      const duration = durationText(elapsed);
      const nextTopic = E.topics[E.topics.indexOf(run.topic) + 1];
      const lastSet = run.number === E.setCount;
      const nextNumber = lastSet ? run.number : run.number + 1;
      app.innerHTML = '<div class="equation-title"><div><p class="equation-chapter">' +
        topicLabel(run.topic) + ' · ' + setLabel(run.topic, run.number) +
        '</p><h1 tabindex="-1">' + (correct < total ? '✓ 本套错步已全部订正' : '本套结果') + '</h1></div>' + setPicker() + '</div>' +
        '<section class="panel equation-result"><p><strong>' + (correct < total ? '首答答对 ' : '答对 ') + correct + ' / ' + total + ' 题</strong>' +
        ' · 用时 ' + duration + '</p>' +
        (activity ? '<p role="status">' + escape(activity) + '</p>' : '') + '<div class="equation-actions">' +
        '<button class="btn" type="button" id="equation-again">' +
        (lastSet ? '重练本套' : '下一套 · ' + setLabel(run.topic, nextNumber)) + '</button>' +
        (nextTopic ? '<button type="button" class="btn secondary" id="equation-next-topic">下一类 · ' + nextTopic.code + '</button>' : '') +
        '<button class="text-button" type="button" id="equation-topics">' +
        (onBack ? backLabel : '返回题型') + '</button>' +
        '</div><ol class="equation-results-list">' +
        run.questions.map((q, i) => {
          const checks = rows[i].map(item => item.firstCorrect);
          const { left, right, value } = run.drafts[i] || run.answers[i];
          const status = checks.length === 2
            ? '步骤' + (checks[0] ? '正确' : '有误') + ' · 答案' + (checks[1] ? '正确' : '有误')
            : (checks[0] ? '正确' : '有误');
          return '<li><details><summary><span>第 ' + (i + 1) + ' 题</span>' +
            math(q.tex) + '<small>' + (checks.every(Boolean) ? status : '已订正 · 首答' + status) +
            '</small></summary><p>首次作答 ' +
            (left ? math(left + '=' + right) + '，' : '') + math(q.variable + '=' + value) +
            '</p>' + rows[i].filter(item => item.corrected).map(item => '<p>✓ ' + partName(q, item.part) +
              '已订正 ' + previousExpression(item, true) + '</p>').join('') + '<p>参考步骤</p>' + steps(q) + '</details></li>';
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
    const saved = correctionStore?.read();
    const savedTopic = saved?.kind === 'equation' && E.topics.find(topic => topic.code === saved.code);
    if (savedTopic && Number.isInteger(saved.number) && saved.number >= 1 && saved.number <= E.setCount &&
        Array.isArray(saved.answers) && saved.answers.length === E.questionCount && saved.answers.every(answer => answer && typeof answer.value === 'string')) {
      run = {
        id: ++sequence, topic: savedTopic, number: saved.number, questions: E.getSet(savedTopic.code, saved.number),
        index: 0, answers: saved.answers, drafts: saved.drafts || [], keyboardOpen: true,
        attemptId: saved.runId, correction: { ...saved, repairs: saved.repairs || {} },
      };
      showCorrection(inspectAnswers());
    } else if (code && E.topics.some(topic => topic.code === code)) start(code);
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
