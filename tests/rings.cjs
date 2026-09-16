const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');const {JSDOM}=require('jsdom');
const dom=new JSDOM(fs.readFileSync((process.env.SITE_DIR||'_site')+'/rings.html','utf8'),{url:'https://test.invalid/rings.html',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;
w.alert=()=>{};w.scrollTo=()=>{};w.Element.prototype.animate=()=>({});w.ratiobotRingsIdentity=()=> 'TEST::1';
for(const s of w.document.scripts){if(!s.src&&s.textContent.includes('function startGame')){new vm.Script(s.textContent);w.eval(s.textContent+`;window.rtest={wrong:()=>resolveGuess(0,'a','测试错误规则',round.aRule),mistakes:()=>abMistakes,runId:()=>sessionRunId,finish:()=>{totalOps=20;totalFails=2;finishGame()}};`)}}
for(let mistakes=0;mistakes<3;mistakes++){
 w.eval("startGame();");
 for(let i=0;i<mistakes;i++)w.rtest.wrong();
 assert.equal(w.rtest.mistakes(),mistakes);
 w.rtest.finish();
 const runId=w.rtest.runId(),gain=[8,4,0][mistakes];
 w.dispatchEvent(new w.MessageEvent('message',{origin:'https://test.invalid',source:w,data:{type:'ratiobot-score-result',runId,gain,message:'fixture settlement'}}));
 assert.equal(w.document.querySelector('#sessionRPointLine').textContent,`本次获得：+${gain} R积分`);
 w.dispatchEvent(new w.MessageEvent('message',{origin:'https://test.invalid',source:w,data:{type:'ratiobot-score-result',runId:'old-run',gain:99}}));
 assert.ok(!w.document.querySelector('#sessionRPointLine').textContent.includes('99'));
}
w.eval('startGame()');assert.equal(w.rtest.mistakes(),0);assert.equal(w.eval('window.__hqScoreSent'),false);
console.log('PASS real A/B wrong-answer branch, reset, three finish displays, stale result rejected');w.close();
