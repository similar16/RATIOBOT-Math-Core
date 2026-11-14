(function(root){
'use strict';
const start=Date.parse('2026-11-14T00:00:00+08:00');
const end=Date.parse('2026-11-20T00:00:00+08:00');
const limits={D1:30000,D2:40000};
const goal=10;
const asset='assets/autumn-break-frame-2026.png';
const preview='assets/autumn-break-frame-2026-original.jpeg';
const active=at=>at>=start&&at<end;
const time=ms=>(Math.ceil(ms/10)/100).toFixed(2)+' 秒';
const hasProgress=event=>Object.keys(limits).some(code=>event?.runs?.[code]?.length>0);

function merge(a={},b={}){
  const runs={};
  for(const code of Object.keys(limits)){
    runs[code]=[...new Set([...(a.runs?.[code]||[]),...(b.runs?.[code]||[])])].slice(0,goal);
  }
  const unlocked=runs.D1.length>=goal&&runs.D2.length>=goal;
  const choice=(b.equippedUpdatedAt||'')>(a.equippedUpdatedAt||'')?b:a;
  return {runs,unlocked,equipped:unlocked&&!!choice.equipped,equippedUpdatedAt:choice.equippedUpdatedAt||''};
}

function record(previous,{id,code,correct,elapsed,at}){
  const state=merge(previous);
  if(typeof id!=='string'||!id||!Object.hasOwn(limits,code)||!active(at)||correct!==5||!Number.isFinite(elapsed)||elapsed<0||elapsed>limits[code]||state.runs[code].includes(id)||state.runs[code].length>=goal){
    return {state,counted:false};
  }
  return {state:merge(state,{runs:{[code]:[id]}}),counted:true};
}

const api={asset,preview,start,end,active,limits,goal,time,hasProgress,merge,record};
if(typeof module!=="undefined")module.exports=api;else root.RatioAutumnBreak=api;
})(typeof window==="undefined"?globalThis:window);
