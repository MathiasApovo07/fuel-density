/* Independent educational model. See Documentation/Plan prototype 1.txt. */
(function(root){
 'use strict';
 const defaults={suppression:0,temperature:70,precipitation:80};
 // Interim climate response: recalibration awaits clarification (Documentation/Modifications-2026-10-29.txt).
 // Suppression affects population only, never plant ignition probability.
 function probabilities(s){
  const risk=(s.temperature-70)/20+(80-s.precipitation)/20;
  return {tree:Math.min(1,0.005+0.095*Math.min(1,risk)+0.35*Math.max(0,risk-1.5)**2),shrub:Math.min(1,0.97+0.03*risk)};
 }
 function seeded(seed){let x=seed>>>0;return ()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296;};}
 function create(settings=defaults,rng=Math.random){
  const s={...defaults,...settings};
  const cells=Array.from({length:100},()=>({type:null,state:'empty'}));
  const indices=Array.from({length:100},(_,i)=>i);
  for(let i=99;i>0;i--){const j=Math.floor(rng()*(i+1));[indices[i],indices[j]]=[indices[j],indices[i]];}
  const trees=Math.round(15*(1+s.suppression/100)), shrubs=Math.round(35*(1+s.suppression/100));
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
