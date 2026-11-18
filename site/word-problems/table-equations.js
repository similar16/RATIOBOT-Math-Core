/* Link the learner's actual quantity representations to their remaining
   conditions. Candidates come from authored equal quantities, never answers. */
(function(root){
 'use strict';
 const engine=()=>typeof module==='object'&&module.exports?require('./engine.js'):root.RatioWordProblemEngine;
 const unique=items=>[...new Set(items.filter(Boolean))];
 function build(problem,route,cells=[]){
  const E=engine(),quantities=cells.filter(c=>c?.expr&&c.originalExpr&&(E.equivalent(c.originalExpr,c.expr)||c.alternative?.expr&&E.equivalent(c.alternative.expr,c.expr))),changed=quantities.filter(c=>!E.equivalent(c.originalExpr,c.expr));
  const entries=(route.equations||[]).map((equation,index)=>{
   const choices=[];
   function add(left,right,label,sources,kind,quantity){
    try{left=E.referenceExpression(left,{});right=E.referenceExpression(right,{});}catch{}
    if(!E.checkEquation(left+'='+right,equation,equation.variable||route.variable).ok)return;
    // Two different conditions can yield the same symbolic equation; retain
    // those different meanings instead of deduplicating by mathematics alone.
    if(choices.some(c=>c.label===label&&(E.equivalent(left,c.left)&&E.equivalent(right,c.right)||E.equivalent(left,c.right)&&E.equivalent(right,c.left))))return;
    choices.push({left,right,label,sources:unique(sources||[]),kind,quantity:quantity||''});
   }
   for(const cell of changed){
    const a=cell.alternative||{},quantity=cell.rowLabel+' · '+cell.columnLabel;
    add(cell.originalExpr,cell.expr,a.closureHint||'把'+quantity+'按原题关系表示的结果与表中已填的结果联系起来.',
     [...(a.closureSources||[]),...(cell.originalSources||[])],'quantity',quantity);
   }
   // When a whole side names a table quantity, take the expression the learner
   // actually wrote. If this makes an identity, that condition was used while
   // filling the table and cannot determine the unknown a second time.
   function actualSide(expression){
    const matches=quantities.filter(c=>E.equivalent(c.canonicalExpr||c.originalExpr,expression));
    return matches.length&&matches.every(c=>E.equivalent(c.expr,matches[0].expr))?matches[0].expr:expression;
   }
   add(actualSide(equation.left),actualSide(equation.right),route.closure?.text||equation.label||'根据当前数量表中的等量关系列式.',route.closure?.sources||[],'table');
   // Unchanged branches or arithmetic boundaries retain their authored model.
   // A changed representation has its own independent candidates above.
   if(!choices.length)add(equation.left,equation.right,route.closure?.text||equation.label||'根据原题数量关系列式.',route.closure?.sources||[],'original');
   return {index,variable:equation.variable||route.variable,choices,recommended:choices[0]};
  });
  return {changed:changed.length>0,entries};
 }
 function basis(plan,index,expression){
  const entry=plan.entries[index];if(!entry)return {label:'数量关系',sources:[]};
  if(!String(expression||'').trim())return entry.recommended||{label:'根据当前数量表列方程.',sources:[]};
  const E=engine();let parts;try{parts=E.normalize(expression).split('=');}catch{}
  if(parts?.length===2){const found=entry.choices.find(c=>E.equivalent(parts[0],c.left)&&E.equivalent(parts[1],c.right)||E.equivalent(parts[0],c.right)&&E.equivalent(parts[1],c.left));if(found)return found;}
  // A valid rearrangement may combine several conditions. Do not attribute it
  // to a preset condition solely because it has the same solution.
  return {label:'根据当前数量表中的数量关系等价列式.',sources:unique(entry.choices.flatMap(c=>c.sources)),kind:'equivalent'};
 }
 const api={build,basis};if(typeof module==='object'&&module.exports)module.exports=api;else root.RatioWordProblemTableEquations=api;
})(typeof window==='undefined'?globalThis:window);
