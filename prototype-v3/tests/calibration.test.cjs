const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../engine.js'),{measure}=require('../../calibration/measure.cjs');
test('updated model: results are measured, not forced to calibration targets',()=>{const results=measure(E,500,50001);for(const r of results){assert.ok(r.trees>=0&&r.trees<=100);assert.ok(r.shrubs>=0&&r.shrubs<=100);} });
// Previous 30-60% mean targets superseded by Ileah 28 October.
// New 60-80% / baseline >80% shrub targets are NOT certified: see feasibility report.
test('probabilities are bounded and nondecreasing on each control',()=>{
 for(const key of ['suppression','temperature','precipitation']){let last={tree:0,shrub:0};for(let i=0;i<=100;i++){
 const s={suppression:0,temperature:70,precipitation:80};s[key]=key==='suppression'?i:key==='temperature'?70+i/5:80-i/5;
 const p=E.probabilities(s);for(const type of ['tree','shrub']){assert.ok(p[type]>=last[type]&&p[type]<=1); }last=p;
 }}
});
