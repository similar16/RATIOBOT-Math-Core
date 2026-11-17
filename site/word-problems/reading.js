/* Reading quantities: retain the original fact text and replace only numerical spans. */
(function(root){
  'use strict';
  const KIND_LABELS={given:'题目条件',property:'已有性质',convention:'建模约定',example:'示例条件'};
  const HAN='零〇一二两三四五六七八九十百千万亿';
  const HAN_DIGITS={零:0,〇:0,一:1,二:2,两:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9};
  const SMALL_UNITS={十:10,百:100,千:1000};
  const protectedTerms=/一元一次方程|二元一次方程|一元二次方程|一次函数|二次函数|三角形|四边形|五边形|六边形|一字框|十字框|四周|几十分之几|十分之几|百分之几|百分之表示|星期[一二三四五六日天]|同一|另一|唯一|一样|下一|上一|前一|后一|一生|一种合理解释/g;
  const classifiers='个|人|条|种|类|件|次|层|段|队|支|车间|车|仓|地|圈|折|周|月|年|天|岁|小时|分钟|秒|倍|份|根|只|颗|幅|册|本|把|组|端|者|边|盘|口|项|套';
  function normalize(s){return String(s??'').trim().replace(/[０-９]/g,c=>String(c.charCodeAt(0)-0xff10)).replace(/[−－﹣]/g,'-').replace(/＋/g,'+').replace(/．/g,'.').replace(/[／⁄]/g,'/');}
  function decimal(s){
    if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return null;
    const negative=s[0]==='-',unsigned=s.replace(/^[+-]/,'');
    const pieces=unsigned.split('.'),places=pieces[1]?.length||0;
    return {n:(negative?-1n:1n)*BigInt((pieces[0]||'0')+(pieces[1]||'')),d:10n**BigInt(places)};
  }
  function rational(value){
    let s=normalize(value);if(!s||s.length>120)return null;
    // MathLive may return a simple rendered fraction. Nested expressions remain disallowed.
    const tex=s.match(/^([+-]?)\\(?:dfrac|tfrac|frac)\{\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\}\{\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\}$/);
    let outerSign=1n;if(tex){outerSign=tex[1]==='-'?-1n:1n;s=tex[2]+'/'+tex[3];}
    const parts=s.split('/');if(parts.length>2)return null;
    const a=decimal(parts[0].trim());if(!a)return null;
    if(parts.length===1)return a;
    const b=decimal(parts[1].trim());if(!b||b.n===0n)return null;
    const n=outerSign*a.n*b.d,d=a.d*b.n;return d<0n?{n:-n,d:-d}:{n,d};
  }
  function hanNumber(raw){
    if(!raw||![...raw].every(c=>Object.hasOwn(HAN_DIGITS,c)||Object.hasOwn(SMALL_UNITS,c)||c==='万'||c==='亿'))return null;
    if([...raw].every(c=>Object.hasOwn(HAN_DIGITS,c)))return Number([...raw].map(c=>HAN_DIGITS[c]).join(''));
    let total=0,section=0,digit=0;
    for(const c of raw){
      if(Object.hasOwn(HAN_DIGITS,c)){digit=HAN_DIGITS[c];continue;}
      if(Object.hasOwn(SMALL_UNITS,c)){section+=(digit||1)*SMALL_UNITS[c];digit=0;continue;}
      section+=digit;digit=0;
      if(c==='万')total+=section*10000;else total=(total+section)*100000000;
      section=0;
    }
    const value=total+section+digit;return Number.isSafeInteger(value)?value:null;
  }
  function overlaps(a,b){return a.start<b.end&&b.start<a.end;}
  function spans(text){
    const found=[],protectedSpans=[];
    for(const match of text.matchAll(new RegExp(protectedTerms.source,'g')))protectedSpans.push({start:match.index,end:match.index+match[0].length});
    const add=(start,end,answer,type,extra={})=>{const span={start,end,raw:text.slice(start,end),answer:String(answer),type,...extra};if(!found.some(x=>overlaps(x,span)))found.push(span);};
    // Fractions are one quantity; colons in ratios and clock times remain between separate fields.
    const arabic=/(?:[0-9０-９]+(?:[.．][0-9０-９]+)?|[.．][0-9０-９]+)(?:\s*[\/／⁄]\s*[+＋\-−－]?(?:[0-9０-９]+(?:[.．][0-9０-９]+)?|[.．][0-9０-９]+))?/g;
    for(const match of text.matchAll(arabic)){
      let start=match.index;const end=start+match[0].length;
      if(start>0&&/[+＋\-−－]/.test(text[start-1])){
        const before=text.slice(0,start-1).trimEnd().slice(-1);
        if(!before||/[=＝:：([{，,；;<>≤≥为是约]/.test(before))start--;
      }
      const answer=normalize(text.slice(start,end)).replace(/\s+/g,'');
      add(start,end,answer,answer.includes('/')?'fraction':'number',{percent:/^[%％]/.test(text.slice(end))});
    }
    // An explicit Chinese fraction denotes one number, not a pair of unrelated blanks.
    const fraction=new RegExp('(['+HAN+']+)分之(['+HAN+']+)','g');
    for(const match of text.matchAll(fraction)){
      const denominator=hanNumber(match[1]),numerator=hanNumber(match[2]);
      if(denominator&&numerator!==null){
        if(match[1]==='百')add(match.index+match[1].length+2,match.index+match[0].length,numerator,'han-number',{percent:true,percentFormat:'word'});
        else add(match.index,match.index+match[0].length,numerator+'/'+denominator,'fraction',{notation:'han'});
      }
    }
    for(const match of text.matchAll(/一半|半(?=小时|分钟|天|年|米|千米|千克|斤|份)/g))add(match.index,match.index+match[0].length,'1/2','fraction',{notation:'han'});
    const quantity=new RegExp('(['+HAN+']+)(?=(?:'+classifiers+'))','g');
    for(const match of text.matchAll(quantity)){
      const span={start:match.index,end:match.index+match[0].length};
      // Ordinal labels and relative references identify a row or step; they do not give a quantity.
      if(text[span.start-1]==='第'||protectedSpans.some(p=>overlaps(p,span)))continue;
      // Do not turn 千克 / 千米 / 万册 and similar written units into additional quantities.
      if(/^[千万亿]$/.test(match[0])&&/[\d０-９A-Za-z.．]/.test(text[span.start-1]||''))continue;
      if(match[0]==='一'&&text.slice(span.start).startsWith('一个量'))continue;
      const answer=hanNumber(match[0]);if(answer!==null)add(span.start,span.end,answer,'han-number');
    }
    return found.sort((a,b)=>a.start-b.start);
  }
  function build(problem){
    const all=[];
    const facts=(problem?.facts||[]).map(fact=>{
      const text=String(fact.text||''),found=spans(text),parts=[],fields=[];let position=0;
      const masked=found.reduceRight((s,p)=>s.slice(0,p.start)+'空格'+s.slice(p.end),text);
      for(const [index,span] of found.entries()){
        if(span.start>position)parts.push({type:'text',text:text.slice(position,span.start)});
        const field={key:'f:'+fact.id+':'+index,factId:fact.id,index,answer:span.answer,raw:span.raw,kind:fact.kind||'given',type:span.type,percent:!!span.percent,label:(KIND_LABELS[fact.kind]||'条件')+' · '+masked+'（第'+(index+1)+'个数）'};
        if(span.notation)field.notation=span.notation;if(span.percentFormat)field.percentFormat=span.percentFormat;
        fields.push(field);all.push(field);parts.push({type:'field',key:field.key,field});position=span.end;
      }
      if(position<text.length||!parts.length)parts.push({type:'text',text:text.slice(position)});
      return {id:fact.id,text,kind:fact.kind||'given',parts,fields};
    });
    return {facts,fields:all};
  }
  function checkValue(field,input){
    const actual=rational(input),expected=rational(field?.answer);
    return !!(actual&&expected&&actual.n*expected.d===expected.n*actual.d);
  }
  function check(problem,values={}){
    for(const field of build(problem).fields){
      const value=values[field.key];
      if(!String(value??'').trim())return {ok:false,message:'还有数值未填写，请根据题干或这条条件补全空格.',key:field.key};
      if(!checkValue(field,value))return {ok:false,message:field.percent?(field.percentFormat==='word'?'请核对“百分之”后面的数.':'请核对百分号前面的数，空格中不用再写百分号.'):'这个数与原条件不符，请核对数量及单位.',key:field.key};
    }
    return {ok:true,message:'所有数值已与原条件核对.',key:null};
  }
  function canonical(problem){return Object.fromEntries(build(problem).fields.map(f=>[f.key,f.answer]));}
  const api={build,checkValue,check,canonical};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioWordProblemReading=api;
})(typeof window==='undefined'?globalThis:window);
