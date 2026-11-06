/* Independent educational model. See Documentation/Plan prototype 1.txt. */
(function(root){
 'use strict';
 const config=typeof module!=='undefined'&&module.exports?require('./settings.js'):root.FuelSettings;
 function invalid(){throw new Error('Check settings.js: probabilities must be between 0 and 1; counts must be non-negative whole numbers and each forest must contain 1 to 100 plants.');}
 if(!config)invalid();
 for(const key of ['treeIgnitionProbability','shrubIgnitionProbability'])if(!Number.isFinite(config[key])||config[key]<0||config[key]>1)invalid();
 for(const level of ['low','high']){
  const t=config[level+'SuppressionTrees'],b=config[level+'SuppressionShrubs'];
  if(!Number.isInteger(t)||!Number.isInteger(b)||t<0||b<0||t+b<1||t+b>100)invalid();
 }
 const defaults={suppression:0,temperature:70,precipitation:80};
 // Ileah confirmed additive percentage-point changes on 5 November 2026.
 // Suppression affects population only, never plant ignition probability.
 function probabilities(s){
  const change=(s.temperature-70)+(80-s.precipitation);
  return {tree:Math.max(0,Math.min(1,config.treeIgnitionProbability+0.012*change)),shrub:Math.max(0,Math.min(1,config.shrubIgnitionProbability+0.0005*change))};
 }
 function seeded(seed){let x=seed>>>0;return ()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296;};}
 function create(settings=defaults,rng=Math.random){
  const s={...defaults,...settings};
  const cells=Array.from({length:100},()=>({type:null,state:'empty'}));
  const indices=Array.from({length:100},(_,i)=>i);
  for(let i=99;i>0;i--){const j=Math.floor(rng()*(i+1));[indices[i],indices[j]]=[indices[j],indices[i]];}
  const fraction=s.suppression/100;
  const trees=Math.round(config.lowSuppressionTrees+(config.highSuppressionTrees-config.lowSuppressionTrees)*fraction);
  const shrubs=Math.round(config.lowSuppressionShrubs+(config.highSuppressionShrubs-config.lowSuppressionShrubs)*fraction);
  for(let i=0;i<trees+shrubs;i++)cells[indices[i]]={type:i<trees?'tree':'shrub',state:'intact'};
  return {settings:s,cells,status:'ready',step:0};
 }
 function start(m,rng=Math.random){
  if(m.status!=='ready')return;
  const fuel=m.cells.filter(c=>c.state==='intact');
  if(!fuel.length){m.status='finished';return;}
  fuel[Math.floor(rng()*fuel.length)].state='burning';m.status='running';
 }
 function advance(m,rng=Math.random){
  if(m.status!=='running')return;
  const active=m.cells.map((c,i)=>c.state==='burning'?i:-1).filter(i=>i>=0);
  const next=new Set(),p=probabilities(m.settings);
  // Read the old front only: newly ignited vegetation waits until the next step.
  for(const source of active){
   const radius=m.cells[source].type==='tree'?2:1;
   for(let target=0;target<100;target++){
    const cell=m.cells[target];if(cell.state!=='intact'||next.has(target))continue;
    const distance=Math.max(Math.abs(source%10-target%10),Math.abs(Math.floor(source/10)-Math.floor(target/10)));
    if(distance<=radius&&rng()<p[cell.type])next.add(target);
   }
  }
  active.forEach(i=>m.cells[i].state='burned');next.forEach(i=>m.cells[i].state='burning');m.step++;
  if(next.size===0)m.status='finished';
 }
 function results(m){
  const fuel=m.cells.filter(c=>c.type),burned=fuel.filter(c=>c.state==='burned').length;
  const percent=type=>{const group=fuel.filter(c=>c.type===type);return group.length?100*group.filter(c=>c.state==='burned').length/group.length:0;};
  const intact=fuel.filter(c=>c.state==='intact').length;
  return {total:fuel.length,burned,burning:fuel.filter(c=>c.state==='burning').length,intact,treePercent:percent('tree'),shrubPercent:percent('shrub'),totalPercent:fuel.length?100*burned/fuel.length:0,density:intact};
 }
 const api={defaults,probabilities,seeded,create,start,advance,results};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FuelEngine=api;
})(typeof window!=='undefined'?window:globalThis);


