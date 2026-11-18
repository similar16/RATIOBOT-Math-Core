/* Redo every originally incorrect step, including after refresh, without promoting first-attempt results. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const base = path.resolve(process.env.SITE_DIR || 'site', 'equation-practice');

async function checkCorrections() {
  const dom = new JSDOM('<main id="equations"></main>', {
    url: 'https://test.invalid/', runScripts: 'outside-only', pretendToBeVisual: true,
  });
  const w = dom.window;
  try {
    const host = w.document.querySelector('main'), get = selector => host.querySelector(selector);
    w.scrollTo = () => {};
    w.MathfieldElement = w.HTMLElement;
    w.MathIsleHandwriting = { pages: new Map(), mount() {} };
    w.katex = require('katex');
    for (const file of ['equation-engine.js', 'math-entry.js', 'equations.js']) {
      w.eval(fs.readFileSync(path.join(base, file), 'utf8'));
    }
    let pending = null, now = 100, signedIn = true;
    const events = [];
    Object.defineProperty(w.performance, 'now', { value: () => now });
    const correctionStore = {
      read() {return structuredClone(pending);},
      write(value) {pending = structuredClone(value);return true;},
      clear(id) {assert.equal(id, pending.runId);pending = null;},
    };
    const options = { code: 'D3', onComplete(record) {events.push(structuredClone(record));}, correctionStore };
    const mount = () => w.MathIsleEquationPractice.mount(host, () => signedIn, options);
    let controller = mount();
    const tick = () => new Promise(resolve => setTimeout(resolve, 0));
    const bank = w.MathIsleEquationEngine, qs = bank.getSet('D3', 1);
    const solution = q => bank.numericTex(q.answer);
    const step = q => q.lines.find(line => /^(移项|去括号|去分母)/.test(line.label)).tex.split('=');
    const fill = (id, value) => { get('#eq-' + id + '-math').value = value; };

    // Question 1 misses both steps; Q2 only the transformation; Q3 only the solution.
    for (const [i,q] of qs.entries()) {
      await tick();
      if (i < 2) { fill('left', '4096');fill('right', '8192'); }
      fill('value', i === 0 || i === 2 ? '32768' : solution(q));
      if (i === 4) now += 24000;
      get('#equation-next').click();
    }
    await tick();
    assert.equal(events.length,0);
    assert.equal(pending.code,'D3');
    assert.equal(pending.elapsed,24000);
    const attemptId = pending.runId;
    assert.match(get('.equation-correction-summary h2').textContent,/3 道错题，还需订正 4 步/);
    assert.equal(host.querySelectorAll('.needs-repair').length,4);
    assert.match(get('.equation-result strong').textContent,/2 \/ 5/);
    assert.equal(get('#equation-again'),null);assert.equal(get('#equation-set'),null);
    assert(!host.textContent.includes('参考步骤'));
    assert.equal(get('#eq-left-math').value,'');assert.equal(get('#eq-right-math').value,'');
    assert.equal(get('#eq-value-math'),null,'The first failed transformation requires both sides');
    get('#equation-repair-check').click();
    assert.equal(host.querySelectorAll('.needs-repair').length,4,'Empty inputs cannot advance a step');
    fill('left','4096'); fill('right','8192');
    get('#equation-repair-check').click();
    assert.match(get('#equation-repair-feedback').textContent,/仍有误/);
    assert.equal(events.length,0);
    const [left0,right0] = step(qs[0]);
    fill('left',right0); fill('right',left0); // A valid equivalent order is accepted.
    const staleForm = get('#equation-repair-form');
    get('#equation-repair-check').click();
    await tick();
    assert.equal(host.querySelectorAll('.needs-repair').length,3);
    assert.match(get('.equation-accepted').textContent,/已订正/);
    assert.equal(get('#eq-left-math'),null);assert.equal(get('#eq-value-math').value,'');
    assert(pending.repairs[0].step);assert(!pending.repairs[0].value);
    staleForm.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    assert(pending.repairs[0].step);assert(!pending.repairs[0].value);
    controller.destroy();controller=mount();await tick();
    assert.equal(pending.runId,attemptId);
    assert.equal(host.querySelectorAll('.needs-repair').length,3);
    assert.equal(get('#eq-left-math'),null);assert.equal(get('#eq-value-math').value,'');
    fill('value',solution(qs[0]));
    signedIn=false;get('#equation-repair-check').click();
    assert.equal(events.length,0);assert(!pending.repairs[0].value);
    signedIn=true;get('#equation-repair-check').click();
    await tick();
    assert.match(get('.exercise h2').textContent,/第 2 题/);
    assert.match(get('.equation-accepted').textContent,/方程的解首答正确/);
    assert.equal(get('#eq-value-math'),null);
    const [left1,right1] = step(qs[1]);fill('left',left1);fill('right',right1);
    get('#equation-repair-check').click();await tick();
    assert.match(get('.exercise h2').textContent,/第 3 题/);
    assert.equal(host.querySelectorAll('.needs-repair').length,1);
    now += 60000;
    fill('value',solution(qs[2]));get('#equation-repair-check').click();
    assert.equal(pending,null);
    assert.equal(events.length,1);assert.equal(events[0].id,attemptId);
    assert.equal(events[0].correct,2);assert.equal(events[0].elapsed,24000);
    assert.match(get('h1').textContent,/错步已全部订正/);assert(get('#equation-again'));
    assert.equal(host.querySelectorAll('.equation-results-list > li').length,5);
    controller.destroy();
    console.log('PASS D corrections: all missed steps, equivalent transformations, retry, refresh, identity and first score/time');
  } finally { w.close(); }
}
checkCorrections().catch(error => {console.error(error);process.exitCode=1;});
