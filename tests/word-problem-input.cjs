'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom'),katex=require('katex');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems'),M=require(path.join(base,'math-input.js'));
const dom=new JSDOM('<input id="formula"><input id="number"><textarea id="story"></textarea>',{runScripts:'outside-only'}),w=dom.window;
w.eval(fs.readFileSync(path.join(base,'math-input.js'),'utf8'));
const formula=w.document.querySelector('#formula'),number=w.document.querySelector('#number'),story=w.document.querySelector('#story');
let stored='';w.RatioWordProblemMathInput.bind(formula,{variables:()=>['x','y'],onChange:v=>stored=v});
formula.value='２Ｘ+3Y中文🌙';formula.dispatchEvent(new w.Event('input'));
assert.equal(formula.value,'2x+3y');assert.equal(stored,'2x+3y');
for(const [name,value]of Object.entries({autocorrect:'off',autocapitalize:'off',spellcheck:'false',inputmode:'url'}))assert.equal(formula.getAttribute(name),value);
for(const text of ['🌙','月亮','×','÷','乘号']){
 const e=new w.InputEvent('beforeinput',{data:text,inputType:'insertReplacementText',bubbles:true,cancelable:true});formula.dispatchEvent(e);assert(e.defaultPrevented,'Predictive replacements cannot overwrite Latin variables');
}
const explicitTimes=new w.InputEvent('beforeinput',{data:'×',inputType:'insertText',bubbles:true,cancelable:true});formula.dispatchEvent(explicitTimes);assert(!explicitTimes.defaultPrevented,'An explicitly typed multiplication sign remains available');
w.RatioWordProblemMathInput.bind(number,{numberOnly:true});number.value='１/２月亮🌙y';number.dispatchEvent(new w.Event('input'));assert.equal(number.value,'1/2');
story.value='买了两本练习本🌙';story.dispatchEvent(new w.Event('input'));assert.equal(story.value,'买了两本练习本🌙','Free writing retains its normal input');
class FakeMathfield extends w.HTMLElement{constructor(){super();this.value='';}insert(s){this.value+=s;}}
w.customElements.define('math-field',FakeMathfield);const math=w.document.createElement('math-field');w.document.body.append(math);
w.RatioWordProblemMathInput.bind(math,{variables:()=>['x','y']});
for(const key of ['X','Y','a'])math.dispatchEvent(new w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
assert.equal(math.value,'xya','Physical X and Y remain letters');assert.deepEqual(Object.keys(math.inlineShortcuts),[]);assert.equal(math.smartMode,false);assert.equal(math.popoverPolicy,'off');
math.value='x+\\text{月亮}🌙2';math.dispatchEvent(new w.Event('input'));assert.equal(math.value,'x+2');
for(const input of ['2x+','x=','\\frac{1}{2}','\\frac{\\placeholder{}}{\\placeholder{}}','2\\times','25\\%','\\frac{1}{']){
 const html=katex.renderToString(M.preview(input),{throwOnError:true,output:'html'}),view=new JSDOM(html);
 assert(!/\\(?:frac|times|placeholder|text)|#[?0]/.test(view.window.document.body.textContent),input+' renders a formula rather than LaTeX source');view.window.close();
}
assert.equal(M.clean('XY',{variables:['X','y']}),'Xy','Respect the actual variable case of the problem');
dom.window.close();
console.log('PASS literal math input: physical X/Y, IME replacement rejection, numeric paste filtering, independent Chinese writing and rendered incomplete fractions');
