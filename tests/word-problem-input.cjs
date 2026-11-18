'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom'),katex=require('katex');
const base=path.resolve(process.env.SITE_DIR||'site','word-problems'),M=require(path.join(base,'math-input.js'));
(async()=>{
const dom=new JSDOM('<input id="formula"><input id="number"><input id="search" type="search"><textarea id="story"></textarea>',{runScripts:'outside-only'}),w=dom.window;
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
w.RatioWordProblemMathInput.bind(story,{variables:()=>['x','y']});story.value='设月亮为Y，y=2X+1🌙';story.dispatchEvent(new w.Event('input'));assert.equal(story.value,'yy=2x+1','Even notes retain only mathematical input');
const search=w.document.querySelector('#search');search.value='父女年龄';search.dispatchEvent(new w.Event('input'));assert.equal(search.value,'父女年龄','Only the search field keeps native Chinese input');
for(const value of [String.raw`\frac{1}{2}`,String.raw`\dfrac{2}{4}`,String.raw`\left(\tfrac{1}{2}\right)`,'1÷2','½','1⁄2']){
 number.value=value;number.dispatchEvent(new w.Event('input'));assert.notEqual(number.value,'12','A fraction cannot turn into concatenated digits');
 assert.equal(require(path.join(base,'engine.js')).numericValue(number.value),'1/2',value);
}
formula.value='x/½';formula.dispatchEvent(new w.Event('input'));assert(require(path.join(base,'engine.js')).equivalent(formula.value,'2*x'),'A pasted fraction denominator remains grouped');
number.dispatchEvent(new w.Event('compositionstart'));number.value='月亮🌙';number.dispatchEvent(new w.Event('input'));number.dispatchEvent(new w.Event('compositionend'));await Promise.resolve();assert.equal(number.value,'','Composition cannot retain Chinese or emoji');
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
console.log('PASS literal math input: physical X/Y, IME replacement rejection, search-only Chinese, intact numeric fractions and rendered incomplete fractions');

})().catch(error=>{console.error(error);process.exitCode=1;});
