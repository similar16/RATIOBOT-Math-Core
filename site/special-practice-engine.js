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
function grade(card,values){return card.answers.map((expected,i)=>expected.every((a,j)=>card.code==='C2'?clean(values[i]?.[j]).toUpperCase()===a:equal(values[i]?.[j],a,card.code==='A9')));}
root.SpecialPracticeEngine={number,equal,grade};if(typeof module!=='undefined')module.exports=root.SpecialPracticeEngine;
})(typeof window!=='undefined'?window:globalThis);
