(function(root){
'use strict';
const MODULES={b1:{label:'合并同类项',base:[4,6,8],level:1},b2:{label:'去括号化简',base:[4,7,9],level:2},b3:{label:'整式加减',base:[6,9,12],level:3},b4:{label:'代数式综合',base:[8,12,16],level:4}};
const DIFFS=['easy','normal','hard'];
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t;}return a||1;}
function f(n,d=1){if(!Number.isFinite(n)||!Number.isFinite(d)||!d)throw Error('数字或分母不合法');const g=gcd(n,d),sg=d<0?-1:1;return [n/g*sg,d/g*sg];}
function fromNumber(s){if(String(s).includes('.')){const p=String(s).split('.');return f(Number(p[0]+p[1]),10**p[1].length);}return f(Number(s));}
function plus(a,b){return f(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);}
function neg(a){return [-a[0],a[1]];}
function mul(a,b){return f(a[0]*b[0],a[1]*b[1]);}
function div(a,b){return f(a[0]*b[1],a[1]*b[0]);}
const c=v=>({'':[v[0],v[1]]});
function clean(p){const o={};for(const [k,v] of Object.entries(p)){if(v[0]!==0)o[k]=v;}return o;}
function add(a,b,sign=1){const out={...a};for(const [k,v] of Object.entries(b))out[k]=plus(out[k]||[0,1],sign===1?v:neg(v));return clean(out);}
function keyMul(a,b){const o={};for(const k of [a,b]){const r=/([a-z])(\d+)/g;let m;while((m=r.exec(k)))o[m[1]]=(o[m[1]]||0)+Number(m[2]);}return Object.entries(o).sort().map(([v,e])=>v+e).join('');}
function multiply(a,b){const out={};for(const [ak,av] of Object.entries(a))for(const [bk,bv] of Object.entries(b)){const k=keyMul(ak,bk);out[k]=plus(out[k]||[0,1],mul(av,bv));}return clean(out);}
function pow(a,n){if(!Number.isInteger(n)||n<0||n>4)throw Error('指数仅支持0～4');let out=c([1,1]);for(let i=0;i<n;i++)out=multiply(out,a);return out;}
function divide(a,b){const keys=Object.keys(b);if(keys.length!==1||keys[0]!=='')throw Error('只支持常数分母');const out={};for(const [k,v] of Object.entries(a))out[k]=div(v,b['']);return clean(out);}
function tokenize(s){
 const str=String(s||'').replace(/\s/g,'').replace(/[−－]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/²/g,'^2').replace(/³/g,'^3').replace(/⁴/g,'^4');
 if(str.length>240)throw Error('表达式过长');
 const raw=str.match(/(?:\d+(?:\.\d+)?)|[a-z]|[()+*\/^-]/g);
 if(!raw||raw.join('')!==str)throw Error('存在不支持的符号，请使用x^2、xy和分数形式');
 const tokens=[];for(let i=0;i<raw.length;i++){const prev=raw[i-1],cur=raw[i];if(prev&&((/^\d/.test(prev)||/[a-z)]/.test(prev))&&(/[a-z(]/.test(cur)||cur==='(')||prev===')'&&/^\d/.test(cur)))tokens.push('*');tokens.push(cur);}return tokens;
}
function parse(source){
 const t=tokenize(source);let at=0;
 function expr(min=0){
   let a;const tok=t[at++];
   if(tok==='+'||tok==='-'){a=expr(3);if(tok==='-')a=multiply(c([-1,1]),a);}
   else if(tok==='('){a=expr();if(t[at++]!==')')throw Error('括号没有正确闭合');}
   else if(/^\d/.test(tok||'')){a=c(fromNumber(tok));}
   else if(/^[a-z]$/.test(tok||'')){a={[tok+'1']:[1,1]};}
   else throw Error('表达式开头或运算符位置有误');
   while(at<t.length){const op=t[at],bp={'+':1,'-':1,'*':2,'/':2,'^':4}[op]||0;if(bp<min||bp===0)break;at++;let rhs=expr(bp+(op==='^'?0:1));if(op==='+')a=add(a,rhs);else if(op==='-')a=add(a,rhs,-1);else if(op==='*')a=multiply(a,rhs);else if(op==='/')a=divide(a,rhs);else{if(Object.keys(rhs).length!==1||!rhs['']||rhs[''][1]!==1)throw Error('指数必须是整数');a=pow(a,rhs[''][0]);}}
   return a;
 }
 const result=expr();if(at!==t.length)throw Error('表达式未完整识别');return clean(result);
}
function degree(k){return [...k.matchAll(/[a-z](\d+)/g)].reduce((n,m)=>n+Number(m[1]),0);}
function canonical(poly){
 const keys=Object.keys(poly).sort((a,b)=>degree(b)-degree(a)||a.localeCompare(b));
 if(!keys.length)return '0';
 return keys.map((k,i)=>{const [n,d]=poly[k],abs=Math.abs(n),coeff=d===1?String(abs):abs+'/'+d;
 const letters=k.replace(/([a-z])(\d+)/g,(_,v,e)=>v+(e==='1'?'':'^'+e));
 const value=letters&&abs===d?letters:coeff+letters;
 return (n<0?'-':i?'+':'')+value;}).join('');
}
function check(input, expected){try{
 const p=parse(input),standard=canonical(p),target=canonical(parse(expected));
 const correct=standard===target;
 const compact=String(input).replace(/\s/g,'').replace(/[−－]/g,'-');
 const monomialOnly=!/[()]/.test(compact)&&!/[*/]/.test(compact.replace(/\d+\/\d+/g,''));
 const segments=compact.replace(/^-/, '').split(/(?=[+-])/).filter(Boolean);
 const reduced=monomialOnly && (Object.keys(p).length===0?compact==='0':segments.length===Object.keys(p).length);
 return {correct:correct&&reduced,equivalent:correct,normalized:standard,reason:correct&&!reduced?'等值，但还没有完成合并同类项。':correct?'正确':'结果不等值'};
 }catch(e){return {correct:false,equivalent:false,reason:e.message||'表达式输入不规范'};}}
const pick=a=>a[Math.floor(Math.random()*a.length)];
const rand=(lo,hi)=>lo+Math.floor(Math.random()*(hi-lo+1));
function termKey(variables,diff){
 const symbols=variables;let degreeMax=diff==='hard'?4:diff==='normal'?3:2;
 let symbolsChosen=Array.from({length:rand(1,Math.min(symbols.length,diff==='easy'?1:3))},()=>pick(symbols));
 let counts={};for(const x of symbolsChosen)counts[x]=1;let extra=rand(0,Math.max(0,degreeMax-Object.keys(counts).length));while(extra--){const k=pick(Object.keys(counts));counts[k]++;}
 return Object.entries(counts).sort().map(([v,n])=>v+n).join('');
}
function displayKey(key){return key.replace(/([a-z])(\d+)/g,(_,v,n)=>v+(n==='1'?'':'^'+n));}
function term(key,coefficient){
 const [n,d]=coefficient;let s=Math.abs(n)===d&&key?'':(d===1?String(Math.abs(n)):String(Math.abs(n))+'/'+d);
 return (n<0?'-':'')+s+displayKey(key);
}
function coefficient(mode){let n=pick([-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7]);if(mode==='fraction'&&Math.random()<.45)return f(n,pick([2,3,4,5,6]));return f(n);}
function joinTerms(terms){return terms.map((a,i)=>{const t=term(a.key,a.coeff);return i===0?t:t.startsWith('-')?t:'+'+t;}).join('')||'0';}
function members(diff,variables,mode,n,withOverlap=true){const groups=[],out=[];let wanted=Math.min(n,diff==='easy'?2:diff==='normal'?3:4);for(let i=0;i<wanted;i++){let key;let tries=0;do{key=termKey(variables,diff);}while(groups.includes(key)&&++tries<20);if(!groups.includes(key))groups.push(key);}
 for(let i=0;i<n;i++)out.push({key:pick(groups),coeff:coefficient(mode)});
 if(withOverlap&&n>=3){out[0].key=groups[0];out[1].key=groups[0];if(n>=4)out[2].key=groups[1]||groups[0];}
 if(diff==='hard'&&n>4&&Math.random()<.4){out[n-1]={key:out[0].key,coeff:neg(out[0].coeff)};}
 return out.sort(()=>Math.random()-.5);
}
function generate(opts={}){
 const mod=MODULES[opts.module]?opts.module:'b1',diff=DIFFS.includes(opts.difficulty)?opts.difficulty:'normal';
 const mode=opts.coefficient==='fraction'?'fraction':opts.coefficient==='denominator'&&['b3','b4'].includes(mod)?'denominator':'integer';
 const variables=(diff==='hard'?pick([['x','y'],['a','b','c'],['m','n'],['x','y','z']]):diff==='easy'?pick([['x'],['a'],['m','n']]):pick([['x','y'],['a','b'],['x']]));
 const amount=diff==='easy'?rand(2,4):diff==='normal'?rand(4,6):rand(5,8);
 let expr='',source=[];
 if(mod==='b1'){source=members(diff,variables,mode,amount);expr=joinTerms(source);}
 if(mod==='b2'){const inside=members(diff,variables,mode,Math.min(3,amount-1)),outside=members(diff,variables,mode,Math.max(1,amount-inside.length),false);const multiplier=diff==='easy'?pick([-1,1]):pick([-5,-3,-2,-1,1,2,3,4]);expr=joinTerms(outside)+(multiplier<0?'':'+' )+(multiplier===1?'':multiplier===-1?'-':multiplier)+'('+joinTerms(inside)+')';source=outside.concat(inside);}
 if(mod==='b3'){
 const a=members(diff,variables,mode,Math.max(2,Math.floor(amount/2))),b=members(diff,variables,mode,Math.max(2,amount-a.length));
 expr='('+joinTerms(a)+')'+pick(['+','-'])+'('+joinTerms(b)+')';source=a.concat(b);
 if(mode==='denominator')expr='('+joinTerms(a)+')/'+pick([2,3,4])+'-('+joinTerms(b)+')/'+pick([4,6,8,12]);
 }
 if(mod==='b4'){
 const a=members(diff,variables,mode,Math.max(2,Math.floor(amount/2))),b=members(diff,variables,mode,2);
 if(mode==='denominator'){expr='('+joinTerms(a)+')/2-('+joinTerms(b)+')/4';}
 else if(Math.random()<.5){const sub='('+joinTerms(a)+')';expr=pick(['2','3','-2'])+sub+'-'+sub+'+3'+sub;}
 else expr='('+joinTerms(a)+')-[' .replace('[','(')+'('+joinTerms(b)+')-('+joinTerms(a.slice(0,2))+'))';
 source=a.concat(b);
 }
 // Reject accidental degenerate or mathematically oversized questions.
 const result=parse(expr);
 const answer=canonical(result);
 if(!Object.keys(result).length&&Math.random()<.8)return generate({...opts,_retry:(opts._retry||0)+1});
 return {module:mod,difficulty:diff,coefficient:mode,expression:expr,answer,meta:{variableCount:variables.length,maxDegree:Math.max(0,...Object.keys(result).map(degree)),sourceTerms:source.length,groups:new Set(source.map(x=>x.key)).size,bracketDepth:Math.max(0,...[...expr].reduce((a,ch)=>{const prev=a.length?a[a.length-1]:0;a.push(ch==='('?prev+1:ch===')'?Math.max(0,prev-1):prev);return a;},[])),fractionStructure:mode==='denominator',hasCancellation:source.some((x,i)=>source.slice(i+1).some(y=>x.key===y.key&&x.coeff[0]===-y.coeff[0]&&x.coeff[1]===y.coeff[1]))}};
}
function fullPoints(module,difficulty,coefficient,n=5){const m=MODULES[module]||MODULES.b1,i=DIFFS.indexOf(difficulty),b=m.base[Math.max(0,i)],extra=coefficient==='denominator'?3:coefficient==='fraction'?2:0;return Math.max(1,Math.round((b+extra)*n/5));}
const API={MODULES,DIFFS,parse,canonical,check,generate,fullPoints,degree};
root.AlgebraEngine=API;
if(typeof module!=='undefined'&&module.exports)module.exports=API;
})(typeof window!=='undefined'?window:globalThis);
