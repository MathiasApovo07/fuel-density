const test=require('node:test'),assert=require('node:assert/strict'),E=require('../engine.js');
test('suppression changes density only, never ignition',()=>{for(let t=70;t<=90;t++)for(let rain=60;rain<=80;rain++) assert.deepEqual(E.probabilities({suppression:0,temperature:t,precipitation:rain}),E.probabilities({suppression:100,temperature:t,precipitation:rain}));});
