/* RATIOBOT TikZ/PGF rendering bridge. Keep KaTeX for ordinary formulas.
 * TikZ is TeX, not a KaTeX macro. Load a browser-side TeX/PGF runtime
 * only when an actual diagram is visible.
 */
(function(){
'use strict';
const VERSION='1.6.0';
const CDN='https://cdn.jsdelivr.net/npm/@rod2ik/tikzjax@'+VERSION+'/dist/';
const SCRIPT_ID='ratiobot-tikzjax-runtime';
const CSS_ID='ratiobot-tikzjax-fonts';
let loading=null;
function enable(){
 if(loading)return loading;
 loading=new Promise((resolve,reject)=>{
  // Fixed defaults for common junior-secondary geometry:
  // angles/quotes, calc, positioning, arrows, paths, and patterns.
  window.TikzJaxOptions={
    renderTimeout:30000,maxRetries:1,restartWorkerOnFail:true,
    workerPool:{enabled:true,maxWorkers:2,reserveCpuCores:1,useDeviceMemory:true,initializationRetries:1},
    tex:{texPackages:{amsmath:"",amssymb:""},
      tikzLibraries:["arrows.meta","calc","positioning","angles","quotes","decorations.pathreplacing","patterns"] }
  };
  if(!document.getElementById(CSS_ID)){
   const link=document.createElement('link');
   link.rel='stylesheet';link.id=CSS_ID;link.href=CDN+'fonts.min.css';document.head.appendChild(link);
  }
  const script=document.createElement('script');script.id=SCRIPT_ID;script.src=CDN+'tikzjax.min.js';
  script.async=true;
  script.onload=()=>resolve(true);
  script.onerror=()=>{loading=null;reject(new Error('TikZ 绘图引擎加载失败，保留源码供复制重试'));};
  document.head.appendChild(script);
 });
 return loading;
}
function hydrate(root){
 if(!root?.querySelectorAll)return;
 const list=root.querySelectorAll('pre.language-tikz,pre.tikz,script[type="text/tikz"]');
 if(!list.length)return;
 // Lazy and same engine across question bank, daily challenge, and projector.
 enable().catch(e=>{
  list.forEach(node=>{
   const panel=node.closest('.qb-tikz');
   if(panel&&!panel.querySelector('.qb-tikz-error')){
    const n=document.createElement('p');n.className='qb-tikz-error';
    n.textContent=e.message+'。';panel.appendChild(n);
   }
  });
 });
}
const style=document.createElement('style');style.id='ratiobot-tikz-styles';
style.textContent='.qb-tikz{max-width:100%;margin:16px auto;text-align:center;overflow-x:auto}' +
 '.qb-tikz svg{max-width:100%;height:auto}' +
 '.qb-tikz pre{max-width:100%;font-size:12px;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;color:#5e5b66;background:#faf7ef;border:1px dashed #ccc5b7;border-radius:8px;padding:12px}' +
 '.qb-tikz-error{color:#b04b3d;font-size:12px}';
(document.head||document.documentElement).appendChild(style);
window.TikzSupport={hydrate,enable,version:VERSION};
})();