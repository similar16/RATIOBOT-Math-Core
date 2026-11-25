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
    const options = { code: 'D6', onComplete(record) {events.push(structuredClone(record));}, correctionStore };
    const mount = () => w.MathIsleEquationPractice.mount(host, () => signedIn, options);
    let controller = mount();
    const tick = () => new Promise(resolve => setTimeout(resolve, 0));
    const bank = w.MathIsleEquationEngine, qs = bank.getSet('D6', 1);
    const fill = (stage, wrong=false) => {
      const [left,right] = stage.target.split('=');
      get('#eq-'+stage.focus+'Left-math').value = left;
      get('#eq-'+stage.focus+'Right-math').value = wrong ? '4096' : right;
    };
    for (const [i,q] of qs.entries()) {
      await tick();
      q.stages.forEach((stage,j) => fill(stage,i < 3 && (j===0 || (i===0 && j===1))));
      if (i===4) now += 24000;
      get('#equation-next').click();
    }
    await tick();
    const attemptId = pending.runId;
    assert.match(get('.equation-correction-summary h2').textContent,/3 道错题，还需订正 4 步/);
    for (const [i,j] of [[0,0],[0,1],[1,0],[2,0]]) {
      fill(qs[i].stages[j],true);
      get('#equation-repair-check').click();
      assert.match(get('#equation-repair-feedback').textContent,/仍有误/);
      fill(qs[i].stages[j]);
      get('#equation-repair-check').click();
      await tick();
      if(i===0 && j===0) {
        controller.destroy(); controller=mount(); await tick();
        assert.equal(pending.runId,attemptId);
        assert.equal(host.querySelectorAll('.needs-repair').length,3);
      }
    }
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
