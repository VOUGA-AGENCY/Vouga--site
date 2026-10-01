import assert from 'node:assert/strict';
import test from 'node:test';
import { annualOccurrences, calculate, validateAnalysis, formatWhole } from '../assets/js/automation-math.mjs';
import { attribution, automationMessage } from '../lib/automation.mjs';
const base = { process: 'Copiar dados para o ERP', people: 5, minutes: 60, frequency: 'daily', hourlyCost: '15,00' };
test('annual frequency factors match every specified option', () => {
  assert.equal(annualOccurrences('daily'), 220);
  assert.equal(annualOccurrences('weekly'), 44);
  assert.equal(annualOccurrences('monthly'), 12);
  assert.equal(annualOccurrences('weeklyMultiple', 3), 132);
  assert.equal(annualOccurrences('monthlyMultiple', 3), 36);
  for (const [period, expected] of [['day',440],['week',88],['month',24],['year',2]]) assert.equal(annualOccurrences('custom', 2, period), expected);
});
test('calculates person-hours, equivalent days and optional cost without premature rounding', () => {
  const result = validateAnalysis(base);
  assert.equal(result.hours, 1100); assert.equal(result.days, 137.5); assert.equal(result.cost, 16500);
  assert.equal(result.period, 'day');
  assert.equal(validateAnalysis({ ...base, frequency: 'weekly' }).period, 'week');
  assert.equal(validateAnalysis({ ...base, hourlyCost: null }).cost, null);
  assert.equal(validateAnalysis({ ...base, hourlyCost: '' }).cost, null);
  assert.equal(validateAnalysis({ ...base, hourlyCost: 0 }).cost, 0);
  assert.equal(calculate({ people: 2, minutes: 15, occurrences: 44 }).hours, 22);
});
test('Portuguese formatting includes four-digit grouping, natural rounding and small quantities', () => {
  assert.equal(formatWhole(1098.4), '1.098'); assert.equal(formatWhole(137.3), '137');
  assert.equal(formatWhole(16475), '16.475'); assert.equal(formatWhole(.2), 'menos de 1');
});
test('rejects missing, malformed, negative, non-finite and out-of-range inputs', () => {
  for (const change of [{process:''},{people:0},{people:1.5},{people:true},{minutes:'NaN'}, {minutes:'1e309'},
    {minutes:0},{minutes:-5},{hourlyCost:-1},{frequency:'invalid'},{frequency:'custom',count:2,period:'invalid'},
    {frequency:'weeklyMultiple',count:''},{frequency:'custom',count:Infinity,period:'day'}]) {
    assert.throws(() => validateAnalysis({ ...base, ...change }));
  }
});
test('ignores client totals, captures campaign and removes unrelated URL query data', () => {
  const message = automationMessage({ ...base, hours:1, cost:1 }, { url:'https://www.vouga-agency.pt/automation?secret=hidden',
    referrer:'https://example.com/news?token=secret', utm: {utm_source:'leanked',utm_medium:'newsletter',utm_campaign:'automation_01'} });
  assert.match(message, /Horas anuais: 1100/); assert.match(message, /Custo anual: 16500 EUR/);
  assert.match(message, /Leanked Newsletter #01/); assert.doesNotMatch(message, /secret|token/);
  assert.equal(attribution({}).source,'website_automation');
});
