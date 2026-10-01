// Shared by the calculator and the contact API. No rounded values enter calculations.
export const ANNUAL_FACTORS = Object.freeze({ day: 220, week: 44, month: 12, year: 1 });
export const FREQUENCIES = Object.freeze({
  daily: 'Todos os dias úteis', weeklyMultiple: 'Várias vezes por semana',
  weekly: 'Uma vez por semana', monthlyMultiple: 'Várias vezes por mês',
  monthly: 'Uma vez por mês', custom: 'Personalizar'
});

export function numberValue(value) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string' || !/^\d+(?:[.,]\d+)?$/.test(value.trim())) return NaN;
  return Number(value.trim().replace(',', '.'));
}

export function annualOccurrences(frequency, count = 1, period = 'year') {
  switch (frequency) {
    case 'daily': return 220;
    case 'weekly': return 44;
    case 'monthly': return 12;
    case 'weeklyMultiple': return count * ANNUAL_FACTORS.week;
    case 'monthlyMultiple': return count * ANNUAL_FACTORS.month;
    case 'custom': return count * ANNUAL_FACTORS[period];
    default: return NaN;
  }
}

export function calculate({ people, minutes, occurrences, hourlyCost = null }) {
  const hours = people * (minutes / 60) * occurrences;
  return { hours, days: hours / 8, cost: hourlyCost === null ? null : hours * hourlyCost };
}

export function validateAnalysis(input) {
  const fail = (field) => { const error = new Error('invalid_analysis'); error.field = field; throw error; };
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('process');
  const process = typeof input.process === 'string' ? input.process.trim() : '';
  if (!process || process.length > 3000) fail('process');
  const people = numberValue(input.people);
  const minutes = numberValue(input.minutes);
  if (!Number.isInteger(people) || people < 1 || people > 100000) fail('people');
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 525600) fail('minutes');
  if (!Object.hasOwn(FREQUENCIES, input.frequency)) fail('frequency');
  const needsCount = ['weeklyMultiple', 'monthlyMultiple', 'custom'].includes(input.frequency);
  const count = needsCount ? numberValue(input.count) : 1;
  if (!Number.isInteger(count) || count < 1 || count > 100000) fail('count');
  const period = input.frequency === 'custom' ? input.period : input.frequency === 'daily' ? 'day' :
    ['weekly', 'weeklyMultiple'].includes(input.frequency) ? 'week' : 'month';
  if (!Object.hasOwn(ANNUAL_FACTORS, period)) fail('period');
  const hourlyCost = input.hourlyCost === null || input.hourlyCost === '' || input.hourlyCost === undefined ? null : numberValue(input.hourlyCost);
  if (hourlyCost !== null && (!Number.isFinite(hourlyCost) || hourlyCost < 0 || hourlyCost > 1000000)) fail('hourlyCost');
  const occurrences = annualOccurrences(input.frequency, count, period);
  const result = calculate({ people, minutes, occurrences, hourlyCost });
  if (!Number.isFinite(result.hours) || result.hours > 1e12 || (result.cost !== null && result.cost > 1e15)) fail('minutes');
  return { process, people, minutes, frequency: input.frequency, count, period, hourlyCost, occurrences, ...result };
}

// Explicit grouping avoids engines that do not group four-digit numbers in pt-PT.
export function formatWhole(value) {
  if (value > 0 && value < 1) return 'menos de 1';
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
