// Local browser QA. No form submissions, analytics or email delivery.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output='/private/tmp/vouga-leanked-qa';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
try{
  for(const width of [1920,1366,768,390,320]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/leanked');
    await page.locator('#partnershipImage').evaluate(image=>image.decode());
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('html').getAttribute('lang'),'pt-PT');
    assert.equal(await page.locator('h1').count(),1);
    assert.match(await page.locator('.partnership-intro h2').textContent(),/Uma parceria/);
    assert.match(await page.locator('h1').evaluate(el=>getComputedStyle(el).fontFamily),/Inter/);
    assert.equal(await page.locator('.partnership-closing .btn').getAttribute('href'),'/contact');
    const image=await page.locator('#partnershipImage').boundingBox();
    const ratio=await page.locator('#partnershipImage').evaluate(el=>el.naturalWidth/el.naturalHeight);
    if(width>820) assert.ok(Math.abs(image.width/image.height-ratio)<.01,'uncropped desktop image aspect ratio');
    else {
      assert.equal(await page.locator('#partnershipImage').evaluate(el=>getComputedStyle(el).objectFit),'cover');
      assert.ok((await page.locator('.partnership-hero').boundingBox()).y<1,'mobile hero starts behind header and copy');
      assert.ok(Math.abs(image.width/width-1)<.05,'mobile image keeps its full width');
      assert.match(await page.locator('#partnershipImage').evaluate(el=>el.currentSrc),/leankedmovel\.png/);
    }
    assert.equal(await page.locator('.partnership-external').getAttribute('href'),'https://www.leanked.com/');
    assert.equal(await page.locator('.footer #asciiLogo').count(),1);
    if(width>820) assert.ok(image.y<1,'desktop hero starts behind navigation');
    await page.screenshot({path:`${output}/${width}-pt.png`,fullPage:true});
    await page.locator('#langToggle').click();
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    assert.equal(await page.locator('h1').textContent(),'From process to technology.');
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    if(width<=820){
      await page.locator('#navBurger').click();
      assert.equal(await page.locator('#mobileMenu').evaluate(el=>el.inert),false);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#navBurger').getAttribute('aria-expanded'),'false');
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth*parseFloat(getComputedStyle(document.documentElement).zoom||1)-innerWidth)<=2,'no horizontal overflow');
    await page.screenshot({path:`${output}/${width}-en.png`,fullPage:true});
    await page.goto('http://127.0.0.1:4173/');
    await page.waitForFunction(()=>!document.body.classList.contains('is-preloading'));
    await page.locator('.hero-partnership').waitFor();
    assert.match(await page.locator('.hero-partnership').textContent(),/^NEW/);
    assert.equal(await page.locator('.hero-partnership').getAttribute('href'),'/leanked');
    await page.screenshot({path:`${output}/${width}-home.png`});
    await page.locator('#langToggle').click();
    assert.equal(await page.locator('.hero-partnership').textContent(),'NEW: VOUGA x LEANKED');
    await page.locator('.hero-partnership').click();
    await page.waitForURL('**/leanked');
    assert.equal(await page.locator('html').getAttribute('lang'),'pt-PT');
    assert.deepEqual(errors,[]);
    await page.close();
    console.log(`PASS ${width}: PT/EN, persistence, navigation, image, Inter, homepage announcement, no overflow/errors`);
  }
}finally{await browser.close();}
