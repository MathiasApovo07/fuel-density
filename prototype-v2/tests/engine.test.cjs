const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../engine.js');
const settings = {suppression:0,temperature:70,precipitation:80};
const blank = () => ({settings,cells:Array.from({length:100},()=>({type:null,state:'empty'})),status:'running',step:0});
test('interim climate response is preserved pending clarification',()=>{
 assert.deepEqual(E.probabilities(settings),{tree:0.005,shrub:0.97});
 assert.deepEqual(E.probabilities({...settings,temperature:80,precipitation:70}),{tree:0.1,shrub:1});
 assert.deepEqual(E.probabilities({...settings,temperature:90,precipitation:60}),{tree:0.1875,shrub:1});
});
test('population endpoints and middle occupy unique cells',()=>{
 for (const [s,t,b] of [[0,15,35],[50,23,53],[100,30,70]]) {
 const m=E.create({...settings,suppression:s},()=>0.25);
 assert.equal(m.cells.length,100); assert.equal(m.cells.filter(c=>c.type==='tree').length,t); assert.equal(m.cells.filter(c=>c.type==='shrub').length,b);
 }
});
test('GO ignites exactly one fuel and cannot restart a running model',()=>{
 const m=E.create(settings); E.start(m,()=>0.99); assert.equal(m.cells.filter(c=>c.state==='burning').length,1); E.start(m); assert.equal(m.cells.filter(c=>c.state==='burning').length,1);
});
test('shrub radius includes diagonals but not distance two; no same-step cascade',()=>{
 const m=blank(); m.cells[0]={type:'shrub',state:'burning'};m.cells[11]={type:'shrub',state:'intact'};m.cells[22]={type:'shrub',state:'intact'};
 E.advance(m,()=>0);assert.equal(m.cells[0].state,'burned');assert.equal(m.cells[11].state,'burning');assert.equal(m.cells[22].state,'intact');
 E.advance(m,()=>0);assert.equal(m.cells[22].state,'burning');
});
test('tree radius two does not wrap across grid edges',()=>{
 const m=blank();m.cells[9]={type:'tree',state:'burning'};m.cells[27]={type:'shrub',state:'intact'};m.cells[10]={type:'shrub',state:'intact'};
 E.advance(m,()=>0);assert.equal(m.cells[27].state,'burning');assert.equal(m.cells[10].state,'intact');
});
test('failed ignition stays intact and fire ends',()=>{
 const m=blank();m.cells[0]={type:'shrub',state:'burning'};m.cells[1]={type:'tree',state:'intact'};
 E.advance(m,()=>0.99);assert.equal(m.status,'finished');assert.equal(m.cells[1].state,'intact');
 assert.deepEqual(E.results(m),{total:2,burned:1,burning:0,intact:1,treePercent:0,shrubPercent:100,totalPercent:50,density:1});
});
test('all seeded runs terminate, preserve population and leave no active fire',()=>{
 for(let seed=1;seed<=100;seed++) {const rng=E.seeded(seed);const m=E.create({...settings,suppression:100,temperature:90,precipitation:60},rng);E.start(m,rng);let n=0;while(m.status==='running'&&n++<101)E.advance(m,rng);assert.equal(m.status,'finished');assert.equal(E.results(m).total,100);assert.equal(E.results(m).burning,0);assert.ok(n<=100);}
});

