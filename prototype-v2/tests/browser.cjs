const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:"msedge"});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
 assert.ok(await page.evaluate(()=>{const f=document.querySelector('#forest');return Math.abs(f.clientWidth-f.parentElement.clientWidth)<3;}),'forest fills panel');
 await page.screenshot({path:path.resolve(__dirname,'desktop.png'),fullPage:true});
 assert.equal(await page.locator('.cell').count(),100);
 assert.equal(await page.locator('#population').textContent(),'15 trees · 35 shrubs · 100 cells');
 await page.locator('#suppression').focus();await page.keyboard.press('End');
 assert.equal(await page.locator('#population').textContent(),'30 trees · 70 shrubs · 100 cells');
 await page.locator('#temperature').focus();await page.keyboard.press('End');
 await page.locator('#precipitation').focus();await page.keyboard.press('Home');
 assert.equal(await page.locator('#probabilities').count(),0);
 await page.locator('#go').click();assert.equal(await page.locator('.burning').count(),1);
 assert.equal(await page.locator('#temperature').isDisabled(),true);
 await page.locator('#reset').click();assert.equal(await page.locator('.burning').count(),0);
 await page.waitForTimeout(950);assert.equal(await page.locator('.burned').count(),0);
 assert.equal(await page.locator('#go').isEnabled(),true);
 assert.equal(await page.locator('#temperature').inputValue(),'90');
 await page.clock.install();await page.locator('#go').click();
 await page.clock.runFor(81000);assert.equal(await page.locator('#badge').textContent(),'Fire ended');
 assert.equal(await page.locator('.burning').count(),0);
 await page.locator('#reset').click();
 for(const width of [800,390,320]){
 await page.setViewportSize({width,height:900});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'overflow '+width);
 assert.equal(await page.locator('#temperature-info').isEnabled(),true,'help on mobile');
 }
 await page.screenshot({path:path.resolve(__dirname,'mobile.png'),fullPage:true});
 assert.deepEqual(errors,[]);await browser.close();console.log('Browser checks passed: local file, keyboard ranges, GO, RESET cancellation, extinction, 800/390/320px, no JS errors.');
})().catch(e=>{console.error(e);process.exit(1)});



