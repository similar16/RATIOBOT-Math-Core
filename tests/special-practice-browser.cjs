/* Exercise mobile-width correction using the actual MathLive and system-keyboard inputs in Chrome. */
'use strict';
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

async function studentFlow(resumed) {
  const select = selector => document.querySelector(selector);
  const assert = (value, message) => { if (!value) throw Error(message); };
  const waitFor = async selector => {
    const deadline = Date.now()+10000;
    while (Date.now()<deadline) {
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
  const note = message => console.log('SMOKE ' + message);
  note(resumed?'restoring correction after reload':'opening the directory');
  assert(window.innerWidth === 390, 'Fixture must have a mobile viewport');
  assert(!window.MathIsleEquationEngine, 'Start from the menu before loading the equation bank');
  window.SpecialPracticeUI.open();
  if (!resumed) {
    (await waitFor('[data-equation-code="D2"]')).click();
    await waitFor('#equation-form');
    const E = window.MathIsleEquationEngine, questions = E.getSet('D2',1);
    for (const [i,question] of questions.entries()) {
      const [left,right] = question.target.split('=');
      const answers = { expandLeft:left, expandRight:i < 2 ? '91' : right };
      note('entering D2 question '+(i+1));
      await enterWithSystemKeyboard(answers);
      select('#equation-next').click();
    }
    await waitFor('#equation-repair-form');
    assert(document.querySelectorAll('.needs-repair').length === 2, 'Mark both the transformation and the solution');
    assert(!select('#equation-again') && !select('#equation-set'), 'Next set must wait for both corrections');
    const [left,right] = questions[0].lines[0].tex.split('=');
    await enterWithSystemKeyboard({expandLeft:left,expandRight:right});
    select('#equation-repair-check').click();
    assert(document.querySelectorAll('.needs-repair').length === 1, 'Only the solution should remain');
    assert(!sessionStorage.getItem('completed'), 'Partial correction cannot complete the set');
    note('first wrong step corrected');
    return;
  }
  await waitFor('#equation-repair-form');
  assert(document.querySelectorAll('.needs-repair').length === 1 && !select('#eq-left'), 'Restore only the remaining solution step');
  assert(select('.equation-correction-summary').textContent.includes('已订正'), 'Keep the corrected question after refresh');
  const E = window.MathIsleEquationEngine;
  const [left,right] = E.getSet('D2',1)[1].target.split('=');
  await enterWithSystemKeyboard({expandLeft:left,expandRight:right});
  select('#equation-repair-check').click();
  await waitFor('#equation-again');
  assert(select('h1').textContent.includes('已全部订正'), 'Completion feedback missing');
  const completed = JSON.parse(sessionStorage.getItem('completed') || '[]');
  assert(completed.length === 1 && completed[0].correct === 3 && completed[0].code === 'D2', 'Keep the first score and complete once');
  note('completed once with the first score');
}

// Chrome's DevTools pipe uses NUL-delimited JSON and requires no network listener or third-party client.
function devTools(chrome) {
  let counter=0, buffer='';
  const waiting=new Map(), listeners=new Set();
  function rejectPending(error){
    for(const request of waiting.values())request.reject(error);
    waiting.clear();
  }
  chrome.once('error',rejectPending);
  chrome.once('exit',(code,signal)=>rejectPending(Error('Chrome exited ('+(signal||code)+')')));
  chrome.stdio[3].on('error',rejectPending);
  chrome.stdio[4].setEncoding('utf8');
  chrome.stdio[4].on('data',text=>{
    buffer+=text;
    let end;
    while((end=buffer.indexOf('\0'))>=0){
      const message=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);
      if(message.id){
        const request=waiting.get(message.id);
        if(!request)continue;
        waiting.delete(message.id);
        if(message.error)request.reject(Error(request.method+': '+message.error.message));
        else request.resolve(message.result);
      }else for(const listener of listeners)listener(message);
    }
  });
  return {
    call(method,params={},sessionId){
      return new Promise((resolve,reject)=>{
        const id=++counter;
        waiting.set(id,{resolve,reject,method});
        chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId})+'\0');
      });
    },
    listeners,
  };
}

async function run() {
  const root=path.resolve(process.env.SITE_DIR||'site');
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'ratio-equations-chrome-'));
  const mime={'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff'};
  const app=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/special-practice.css"></head>
    <body><main id="specialPractice"></main><script src="/special-practice-data.js"></script><script src="/special-practice-engine.js"></script>
    <script>window.RatioPracticeBridge={ready:()=>true,key:()=>'isolated-test|46',profile:()=>({}),go(){},
      completeEquation(record){const records=JSON.parse(sessionStorage.getItem('completed')||'[]');records.push(record);sessionStorage.setItem('completed',JSON.stringify(records))}};
    </script><script src="/special-practice.js"></script></body></html>`;
  let lastRequest='(no requests)',phase='starting server',stderr='',browserError='',chrome,client,session,timer;
  const server=http.createServer(async (req,res)=>{
    const {pathname}=new URL(req.url,'http://localhost');
    lastRequest=pathname;
    if(pathname==='/practice'){
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}).end(app);return;
    }
    if(req.method!=='GET'||!/^\/(?:special-practice(?:-data|-engine)?\.js|special-practice\.css|equation-practice\/[a-z-]+\.(?:js|css)|assets\/mathlive\/[\d.]+\/(?:mathlive\.min\.js|fonts\/[\w.-]+\.(?:woff2?|otf)))$/.test(pathname)){
      res.writeHead(404).end();return;
    }
    let file=path.join(root,pathname);
    if(!process.env.SITE_DIR&&!fs.existsSync(file)&&pathname.startsWith('/assets/mathlive/')){
      file=path.join('node_modules/mathlive',pathname.split('/').slice(4).join('/'));
    }
    try {const bytes=await fs.promises.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(bytes);}
    catch {res.writeHead(404).end();}
  });

  async function exercise(){
    phase='attaching to Chrome';
    client=devTools(chrome);
    const {targetId}=await client.call('Target.createTarget',{url:'about:blank'});
    session=(await client.call('Target.attachToTarget',{targetId,flatten:true})).sessionId;
    const send=(method,params)=>client.call(method,params,session);
    client.listeners.add(message=>{
      if(message.sessionId!==session)return;
      if(message.method==='Runtime.exceptionThrown')browserError=message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text;
      if(message.method==='Runtime.consoleAPICalled'){
        const note=message.params.args[0]?.value;
        if(typeof note==='string'&&note.startsWith('SMOKE ')){phase=note.slice(6);console.log('Chrome: '+phase);}
      }
    });
    await send('Page.enable');await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride',{width:390,height:780,deviceScaleFactor:2,mobile:true});
    await send('Emulation.setTouchEmulationEnabled',{enabled:true});
    await send('Page.bringToFront');
    for(const resumed of [false,true]){
      phase=resumed?'reloading the exercise':'navigating to the exercise';
      const loaded=new Promise(resolve=>{
        const listener=message=>{
          if(message.sessionId===session&&message.method==='Page.loadEventFired'){client.listeners.delete(listener);resolve();}
        };
        client.listeners.add(listener);
      });
      if(resumed)await send('Page.reload',{ignoreCache:true});
      else {
        const navigation=await send('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/practice'});
        if(navigation.errorText)throw Error(navigation.errorText);
      }
      await loaded;
      const report=await send('Runtime.evaluate',{expression:'('+studentFlow.toString()+')('+resumed+')',awaitPromise:true,userGesture:true,returnByValue:true});
      if(report.exceptionDetails)throw Error(report.exceptionDetails.exception?.description||report.exceptionDetails.text);
    }
  }

  try {
    server.listen(0,'127.0.0.1');await once(server,'listening');
    chrome=spawn(process.env.CHROME_BIN||'google-chrome',['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
      '--remote-debugging-pipe','--no-proxy-server','--no-first-run','--no-default-browser-check','--disable-background-networking',
      '--disable-component-update','--disable-sync','--disable-background-timer-throttling','--user-data-dir='+profile,'about:blank'],
      {stdio:['ignore','ignore','pipe','pipe','pipe']});
    chrome.stderr.on('data',buffer=>{stderr=(stderr+buffer.toString()).slice(-1600);});
    const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Timed out after 75 seconds')),75000);});
    await Promise.race([exercise(),deadline]);
    console.log('PASS Chrome 390px: real MathLive/native keyboard, both D2 corrections, partial reload, first score 4/5');
  } catch(error){
    let page='(unavailable)';
    if(session&&chrome.exitCode===null&&chrome.signalCode===null){
      const dom=client.call('Runtime.evaluate',{expression:"JSON.stringify({url:location.href,ready:document.readyState,heading:document.querySelector('h1')?.textContent,inputs:[...document.querySelectorAll('form input')].map(i=>[i.name,i.hidden]),text:document.body?.innerText.slice(-800)})",returnByValue:true},session);
      try { const reply=await Promise.race([dom,new Promise(resolve=>setTimeout(()=>resolve(null),1200))]);page=reply?.result?.value||page; } catch {}
    }
    throw Error(error.message+'\nPhase: '+phase+'\nLast HTTP request: '+lastRequest+'\nPage: '+page+'\nBrowser error: '+(browserError||'(none)')+'\nChrome stderr: '+stderr);
  } finally {
    clearTimeout(timer);
    if(chrome?.pid&&chrome.exitCode===null&&chrome.signalCode===null){
      const stopped=once(chrome,'exit');
      // A hard kill of only the parent leaves Chrome children writing profile
      // files during rmSync. Close the browser tree normally before removal.
      const forceStop=setTimeout(()=>chrome.kill('SIGKILL'),5000);
      try {
        if(client)await client.call('Browser.close').catch(()=>{});
        else chrome.kill('SIGTERM');
        await stopped;
      } finally {clearTimeout(forceStop);}
    }
    server.closeAllConnections();server.close();
    fs.rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:200});
  }
}
if(process.env.GITHUB_ACTIONS==='true')run().catch(error=>{console.error(error);process.exitCode=1;});
else console.log('SKIP Chrome Actions smoke (enabled on the Linux GitHub runner)');
