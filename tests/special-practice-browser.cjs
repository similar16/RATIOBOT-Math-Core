/* Exercise mobile-width correction using the actual MathLive and system-keyboard inputs in Chrome. */
'use strict';
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

async function studentFlow() {
  const select = selector => document.querySelector(selector);
  const assert = (value, message) => { if (!value) throw Error(message); };
  const waitFor = async selector => {
    for (let i = 0; i < 400; i++) {
      const element = select(selector);
      if (element) return element;
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    throw Error('Control did not appear: ' + selector);
  };
  async function enterWithSystemKeyboard(answers) {
    const toggle = await waitFor('.equation-form .input-keyboard-switch');
    if (toggle.getAttribute('aria-pressed') !== 'true') toggle.click();
    for (const [name,value] of Object.entries(answers)) {
      const input = select('#eq-' + name), editor = select('#eq-' + name + '-math');
      assert(editor instanceof window.MathfieldElement, 'Expected upgraded MathLive field');
      assert(input && !input.hidden && editor.hidden && input.inputMode === 'text', 'Native text entry is unavailable');
      assert(input.value === '', name + ' should start blank');
      input.focus();
      input.value = value;
      input.dispatchEvent(new InputEvent('input', {bubbles:true,inputType:'insertText',data:value}));
      assert(editor.value, 'Native input did not reach the real math editor');
    }
  }
  const resumed = sessionStorage.getItem('resume-after-step') === 'yes';
  assert(window.innerWidth === 390, 'Fixture must have a mobile viewport');
  assert(!window.MathIsleEquationEngine, 'Start from the menu before loading the equation bank');
  window.SpecialPracticeUI.open();
  if (!resumed) {
    (await waitFor('[data-equation-code="D2"]')).click();
    await waitFor('#equation-form');
    const E = window.MathIsleEquationEngine, questions = E.getSet('D2',1);
    for (const [i,question] of questions.entries()) {
      const answers = {value:i === 0 ? '91' : E.numericTex(question.answer)};
      if (i < 2) {
        const [left,right] = question.lines[0].tex.split('=');
        answers.left = i === 0 ? '1' : left;
        answers.right = i === 0 ? '1' : right;
      }
      await enterWithSystemKeyboard(answers);
      select('#equation-next').click();
    }
    await waitFor('#equation-repair-form');
    assert(document.querySelectorAll('.needs-repair').length === 2, 'Mark both the transformation and the solution');
    assert(!select('#equation-again') && !select('#equation-set'), 'Next set must wait for both corrections');
    const [left,right] = questions[0].lines[0].tex.split('=');
    await enterWithSystemKeyboard({left,right});
    select('#equation-repair-check').click();
    assert(document.querySelectorAll('.needs-repair').length === 1, 'Only the solution should remain');
    assert(!sessionStorage.getItem('completed'), 'Partial correction cannot complete the set');
    sessionStorage.setItem('resume-after-step','yes');
    location.reload();
    return;
  }
  await waitFor('#equation-repair-form');
  assert(document.querySelectorAll('.needs-repair').length === 1 && !select('#eq-left'), 'Restore only the remaining solution step');
  assert(select('.equation-accepted').textContent.includes('已订正'), 'Keep the checked transformation after refresh');
  const E = window.MathIsleEquationEngine;
  await enterWithSystemKeyboard({value:E.numericTex(E.getSet('D2',1)[0].answer)});
  select('#equation-repair-check').click();
  await waitFor('#equation-again');
  assert(select('h1').textContent.includes('已全部订正'), 'Completion feedback missing');
  const completed = JSON.parse(sessionStorage.getItem('completed') || '[]');
  assert(completed.length === 1 && completed[0].correct === 4 && completed[0].code === 'D2', 'Keep the first score and complete once');
  await fetch('/outcome', {method:'POST',body:JSON.stringify({ok:true})});
}

async function run() {
  const root = path.resolve(process.env.SITE_DIR || 'site');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(),'ratio-equations-chrome-'));
  const mime = {'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff'};
  const app = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="/special-practice.css"><main id="specialPractice"></main>
    <script src="/special-practice-data.js"></script><script src="/special-practice-engine.js"></script>
    <script>window.RatioPracticeBridge={ready:()=>true,key:()=>'isolated-test|46',profile:()=>({}),go(){},
      completeEquation(record){const records=JSON.parse(sessionStorage.getItem('completed')||'[]');records.push(record);sessionStorage.setItem('completed',JSON.stringify(records))}};
    </script><script src="/special-practice.js"></script>
    <script>(${studentFlow.toString()})().catch(error=>fetch('/outcome',{method:'POST',body:JSON.stringify({ok:false,error:error.stack})}));</script></html>`;
  let finish, fail, chrome, timer;
  const result = new Promise((resolve,reject) => {finish=resolve;fail=reject;});
  const server = http.createServer(async (req,res) => {
    const url = new URL(req.url,'http://localhost');
    if (req.method === 'POST' && url.pathname === '/outcome') {
      try {
        let body='';
        for await (const chunk of req) body+=chunk;
        const report=JSON.parse(body);
        res.writeHead(204).end();
        if(report.ok)finish();else fail(Error(report.error));
      } catch(error){res.writeHead(400).end();fail(error);}
      return;
    }
    if(url.pathname==='/' || url.pathname==='/practice'){
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
      res.end(url.pathname==='/practice'?app:'<!doctype html><iframe title="专项练习" width="390" height="780" src="/practice"></iframe>');
      return;
    }
    if(req.method!=='GET' || !/^\/(?:special-practice(?:-data|-engine)?\.js|special-practice\.css|equation-practice\/[a-z-]+\.(?:js|css)|assets\/mathlive\/[\d.]+\/(?:mathlive\.min\.js|fonts\/[\w.-]+\.(?:woff2?|otf)))$/.test(url.pathname)){
      res.writeHead(404).end();return;
    }
    let file=path.join(root,url.pathname);
    if(!process.env.SITE_DIR && !fs.existsSync(file) && url.pathname.startsWith('/assets/mathlive/')){
      file=path.join('node_modules/mathlive',url.pathname.split('/').slice(4).join('/'));
    }
    try {const data=await fs.promises.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(data);}
    catch {res.writeHead(404).end();}
  });
  try {
    server.listen(0,'127.0.0.1');
    await once(server,'listening');
    chrome=spawn(process.env.CHROME_BIN||'google-chrome',['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run',
      '--disable-background-networking','--disable-component-update','--disable-sync','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost',
      '--user-data-dir='+profile,'http://127.0.0.1:'+server.address().port+'/'],{stdio:'ignore'});
    chrome.once('error',fail);
    chrome.once('exit',code=>fail(Error('Chrome exited before reporting an outcome ('+code+')')));
    timer=setTimeout(()=>fail(Error('Chrome did not finish the equation exercise within 75 seconds')),75000);
    await result;
    console.log('PASS Chrome 390px: real MathLive/native keyboard, both D2 corrections, partial reload, first score 4/5');
  } finally {
    clearTimeout(timer);
    if(chrome?.pid && chrome.exitCode===null && chrome.signalCode===null){
      const stopped=once(chrome,'exit');chrome.kill('SIGKILL');await stopped;
    }
    server.closeAllConnections();server.close();
    fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
  }
}
if(process.env.GITHUB_ACTIONS==='true')run().catch(error=>{console.error(error);process.exitCode=1;});
else console.log('SKIP Chrome Actions smoke (enabled on the Linux GitHub runner)');
