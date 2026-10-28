(function(root){
'use strict';
const clean=x=>String(x??'').normalize('NFKC').replace(/[−–]/g,'-').replace(/\s/g,'').replace(/π|\\pi|pi/gi,'π').replace(/[×*](?=π)/g,'');
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
function number(input){
 let s=clean(input);while(s.startsWith('(')&&s.endsWith(')'))s=s.slice(1,-1);
 let m=s.match(/^([+-]?\d{1,8})(?:\/([+-]?\d{1,8}))?$/),n,d;
 if(m){n=Number(m[1]);d=m[2]?Number(m[2]):1;}else if(/^[+-]?\d{0,6}\.\d{1,6}$/.test(s)){d=10**s.split('.')[1].length;n=Math.round(Number(s)*d);}else return null;
 if(!d)return null;const g=gcd(n,d),reduced=g===1&&d>0;return {n:n/g*(d<0?-1:1),d:Math.abs(d/g),reduced};
}
function equal(a,b,simplest=false){
 a=clean(a);b=clean(b);const ap=a.endsWith('π'),bp=b.endsWith('π');if(ap!==bp)return false;
 if(ap){a=a.slice(0,-1)||'1';b=b.slice(0,-1)||'1';if(a==='-')a='-1';if(b==='-')b='-1';}
 const x=number(a),y=number(b);return !!(x&&y&&x.n===y.n&&x.d===y.d&&(!simplest||x.reduced));
}
// Only simplified linear sums are accepted; never evaluate student input as code.
function linear(input){
 const s=clean(input);if(!s||s.length>40)return null;
 const parts=s.match(/[+-]?(?:\d{1,4}\*?[axy]?|[axy])/g);
 if(!parts||parts.join('')!==s||parts.some((t,i)=>i>0&&!/^[+-]/.test(t)))return null;
 const out={},seen=new Set();
 for(const t of parts){const m=t.match(/^([+-]?)(\d{1,4})?(\*)?([axy])?$/);if(!m||(!m[2]&&!m[4])||(m[3]&&!m[4]))return null;
  const key=m[4]||'constant',n=(m[1]==='-'?-1:1)*(m[2]?Number(m[2]):1);
  if(seen.has(key)||(n===0&&(key!=='constant'||parts.length>1)))return null;seen.add(key);out[key]=n;
 }
 return out;
}
function linearEqual(a,b){const x=linear(a),y=linear(b);return !!(x&&y&&['a','x','y','constant'].every(k=>(x[k]||0)===(y[k]||0)));}
function grade(card,values){return card.answers.map((expected,i)=>expected.every((a,j)=>['B4','B5'].includes(card.code)?linearEqual(values[i]?.[j],a):card.code==='C2'?clean(values[i]?.[j]).toUpperCase()===a:equal(values[i]?.[j],a,card.code==='A9')));}
root.SpecialPracticeEngine={number,equal,linear,linearEqual,grade};if(typeof module!=='undefined')module.exports=root.SpecialPracticeEngine;
})(typeof window!=='undefined'?window:globalThis);
