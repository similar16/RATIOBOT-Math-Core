(function(){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeImage=v=>typeof v==='string'&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v)&&v.length<2200000;
function images(list){return (Array.isArray(list)?list:[]).filter(safeImage).map(src=>`<img class="qb-image" alt="题目配图" src="${src}">`).join('');}
function math(root){if(!window.renderMathInElement)return;window.renderMathInElement(root,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true},{left:'$',right:'$',display:false}],throwOnError:false,trust:false,strict:'ignore',ignoredTags:['script','noscript','style','textarea','pre','code','option']});}
window.QuestionContent={esc,images,math,safeImage};
})();
