'use strict';
const E=window.FuelEngine, $=id=>document.getElementById(id);
const inputs=['suppression','temperature','precipitation'];
let model=E.create(),timer=null,paused=false,remaining=800,deadline=0;
const icons={
 tree:'<path d="M22 5 9 23h7L6 34h12v9h8v-9h12L28 23h7Z" fill="#286040"/><path d="M20 34h4v9h-4z" fill="#735136"/>',
 shrub:'<path d="M21 29v14m0-9-9-8m9 11 11-9" stroke="#735136" stroke-width="3"/><path d="M8 31a9 9 0 0 1 0-17 10 10 0 0 1 19-5 10 10 0 0 1 11 16c0 10-20 14-30 6" fill="#66833c"/>',
 burning:'<path d="M25 3c6 13-5 15 4 20 3-3 4-6 3-10 17 18 10 30-9 31C7 44 3 33 10 21c0 7 5 8 5 5-2-8 4-15 10-23" fill="#b64416"/><path d="M23 24c8 7 10 16 0 18-9-1-8-10 0-18" fill="#ffe09a"/>',
 burned:'<path d="M21 22v19m0-10-9-8m9 13 10-10" stroke="#5c4c41" stroke-width="4"/><path d="m12 7 19 13m0-13L12 20" stroke="#5c4c41" stroke-width="3"/>'
};
const cells=Array.from({length:100},()=>{const el=document.createElement('div');el.setAttribute('aria-hidden','true');$('forest').appendChild(el);return el;});
function settings(){return Object.fromEntries(inputs.map(id=>[id,Number($(id).value)]));}
function render(){
 $('pause').disabled=model.status!=='running';
 $('pause').textContent=paused?'Resume':'Pause';
 model.cells.forEach((c,i)=>{cells[i].className='cell '+c.state;const key=c.state==='intact'?c.type:c.state;cells[i].innerHTML=icons[key]?'<svg viewBox="0 0 44 48" aria-hidden="true">'+icons[key]+'</svg>':'';});
 const r=E.results(model),trees=model.cells.filter(c=>c.type==='tree').length;
 $('population').textContent=trees+' trees · '+(r.total-trees)+' shrubs · 100 cells';
 $('badge').textContent=model.status==='ready'?'Ready':model.status==='running'?(paused?'Paused':'Fire spreading'):'Fire ended';
 $('forest').setAttribute('aria-label',`${r.intact} intact plants, ${r.burning} burning, ${r.burned} burned. ${model.status==='ready'?'Ready to start.':model.status==='finished'?'Fire has ended.':(paused?'Fire is paused.':'Fire is spreading.')}`);
 for(const [id,value] of [['total-result',r.totalPercent],['tree-result',r.treePercent],['shrub-result',r.shrubPercent],['density-result',r.density]])$(id).textContent=Math.round(value)+'%';
 $('total-count').textContent=r.burned+' of '+r.total+' plants';
 $('results-note').textContent=model.status==='finished'?'Final results · Select RESET to explore another forest.':r.burning?`${r.burning} currently burning; included in burned totals when combustion ends.`:'Results update as the fire spreads.';
 $('go').disabled=model.status!=='ready';$('settings').disabled=model.status!=='ready';
 const p=E.probabilities(model.settings);$('probabilities').textContent=`Current ignition chance per nearby source: trees ${Number((p.tree*100).toFixed(1))}%; shrubs ${Number((p.shrub*100).toFixed(1))}%.`;
}
function labels(){for(const id of inputs){const unit=id==='suppression'?'%':id==='temperature'?' °F':' days';$(id+'-value').textContent=$(id).value+unit;$(id).setAttribute('aria-valuetext',$(id).value+unit);}}
function stop(){clearTimeout(timer);timer=null;}
function schedule(){deadline=performance.now()+remaining;timer=setTimeout(()=>{timer=null;remaining=800;tick();},remaining);}
function tick(){E.advance(model);render();if(model.status==='finished'){stop();const r=E.results(model);$('status').textContent=`The fire has ended. ${r.burned} of ${r.total} plants burned. Select RESET to try again.`;}else if(!paused){schedule();}}
inputs.forEach(id=>$(id).addEventListener('input',()=>{if(model.status!=='ready')return;labels();if(id==='suppression')model=E.create(settings());else model.settings=settings();render();}));
$('go').addEventListener('click',()=>{if(model.status!=='ready')return;E.start(model);$('status').textContent='One plant has ignited. Watch how the fire spreads.';render();if(window.matchMedia('(max-width: 800px)').matches){const forest=$('forest');forest.tabIndex=-1;forest.focus({preventScroll:true});forest.parentElement.scrollIntoView({block:'start',behavior:'instant'});}else{$('pause').focus();}remaining=800;paused=false;schedule();});
$('reset').addEventListener('click',()=>{stop();paused=false;remaining=800;model=E.create(settings());labels();render();$('status').textContent='A new forest is ready. Adjust the conditions or select GO.';});
labels();render();



$('pause').addEventListener('click',()=>{
 if(model.status!=='running')return;
 if(paused){paused=false;schedule();$('status').textContent='The fire has resumed from the same point.';}
 else{remaining=Math.max(0,deadline-performance.now());stop();paused=true;$('status').textContent='Fire paused. Observe the forest, then select Resume to continue this trial.';}
 render();
});

