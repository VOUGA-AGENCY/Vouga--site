// Run against `bun run dev`. Uses an installed Playwright module; never sends real email.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
const output = process.env.TEST_SCREENSHOTS || '/private/tmp/vouga-automation-qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true,
  ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  for (const [name, width, height] of [['desktop',1920,1080],['laptop',1366,900],['tablet',768,1024],['phone',390,844],['small-phone',320,740]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce',
      ...(width < 500 ? { isMobile:true, hasTouch:true } : {}) });
    const page = await context.newPage();
    const errors = [], events = [], submissions = [];
    page.on('pageerror', error => errors.push(error.message));
    let submissionStatus = 503;
    await page.route('**/api/automation-events', route => { events.push(route.request().postDataJSON()); return route.fulfill({status:204}); });
    await page.route('**/api/contact', route => { submissions.push(route.request().postDataJSON()); return route.fulfill({
      status:submissionStatus, contentType:'application/json', body:JSON.stringify(submissionStatus===201 ? {ok:true,requestId:'test'} : {ok:false,code:submissionStatus===429?'rate_limited':'service_unavailable'}) }); });
    await page.addInitScript(() => localStorage.setItem('vouga-lang','en'));
    await page.goto(baseURL+'/automation?utm_source=leanked&utm_medium=newsletter&utm_campaign=automation_01');
    await page.locator('#startAnalysis').waitFor({state:'visible'});
    assert.equal(await page.locator('html').getAttribute('lang'),'pt-PT');
    assert.equal(await page.locator('#leadForm').isVisible(),false);
    await page.screenshot({path:`${output}/${name}-hero.png`});
    if(width<=820) {
      await page.locator('#navBurger').click();
      assert.equal(await page.locator('#navBurger').getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#navBurger').getAttribute('aria-expanded'),'false');
    }
    await page.locator('#startAnalysis').click();
    await page.locator('#nextStep').click();
    assert.match(await page.locator('#stepError').textContent(),/Descreva/);
    await page.locator('#process').fill('Recebemos faturas por email e copiamos os dados para o ERP.');
    await page.locator('#nextStep').click();
    await page.locator('#people').fill('5');
    await page.locator('#people').press('Enter');
    await page.locator('[data-minutes="60"]').click();
    await page.locator('#previousStep').click();
    assert.equal(await page.locator('#people').inputValue(),'5');
    await page.locator('#nextStep').click();
    assert.equal(await page.locator('#minutes').inputValue(),'60');
    await page.reload();
    await page.locator('[data-step="2"]').waitFor({state:'visible'});
    assert.equal(await page.locator('#minutes').inputValue(),'60');
    await page.locator('#nextStep').click();
    await page.locator('[name=frequency][value=custom]').check();
    await page.locator('#frequencyCount').fill('2');
    await page.locator('#frequencyPeriod').selectOption('week');
    assert.match(await page.locator('#frequencyHelp').textContent(),/88 ocorrências/);
    await page.locator('[name=frequency][value=daily]').check();
    assert.equal(await page.locator('#frequencyDetails').isVisible(),false);
    await page.screenshot({path:`${output}/${name}-question.png`});
    await page.locator('#nextStep').click();
    if(name==='tablet') await page.locator('#unknownCost').check();
    else await page.locator('#hourlyCost').fill('15,00');
    await page.locator('#nextStep').click();
    assert.equal(await page.locator('#annualHours').textContent(),'1.100');
    assert.equal(await page.locator('#annualDays').textContent(),'138');
    assert.equal(await page.locator('#annualCostBlock').isVisible(),name!=='tablet');
    if(name!=='tablet') assert.equal(await page.locator('#annualCost').textContent(),'16.500 €');
    await page.screenshot({path:`${output}/${name}-result.png`});
    await page.reload();
    await page.locator('#analysisResult').waitFor({state:'visible'});
    assert.equal(await page.locator('#annualHours').textContent(),'1.100');
    await page.locator('#leadName').fill('Teste Vouga');
    await page.locator('#leadCompany').fill('Empresa Teste');
    await page.locator('#leadEmail').fill('teste@example.com');
    await page.locator('[name=consent]').check();
    await page.locator('#submitLead').click();
    await page.waitForFunction(()=>document.getElementById('leadError').textContent.includes('Não foi possível'));
    assert.equal(await page.locator('#leadName').inputValue(),'Teste Vouga');
    submissionStatus=429;
    await page.locator('#submitLead').click();
    await page.waitForFunction(()=>document.getElementById('leadError').textContent.includes('Aguarde'));
    await page.screenshot({path:`${output}/${name}-lead.png`});
    submissionStatus=201;
    await page.locator('#submitLead').click();
    await page.locator('#leadSuccess').waitFor({state:'visible'});
    assert.equal(await page.locator('#leadForm').isVisible(),false);
    assert.equal(await page.evaluate(()=>sessionStorage.getItem('vouga-automation-v1')),null);
    assert.equal(submissions.at(-1).analysis.process,'Recebemos faturas por email e copiamos os dados para o ERP.');
    assert.equal(submissions.at(-1).attribution.utm.utm_campaign,'automation_01');
    assert.deepEqual(events.map(x=>x.event),['automation_started','automation_step_1_completed','automation_step_2_completed','automation_step_3_completed','automation_step_4_completed','automation_calculation_completed','automation_lead_submitted']);
    const overflow = await page.evaluate(()=>document.documentElement.scrollWidth * parseFloat(getComputedStyle(document.documentElement).zoom || 1) - innerWidth);
    assert.ok(overflow<=2,`${name}: horizontal overflow ${overflow}`);
    assert.deepEqual(errors,[]);
    console.log(`PASS ${name} ${width}×${height}: flow, reload, errors, success, tracking, no overflow`);
    await context.close();
  }
} finally { await browser.close(); }
