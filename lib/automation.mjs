import { FREQUENCIES, validateAnalysis } from '../assets/js/automation-math.mjs';

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
export function attribution(input = {}) {
  if (!input || typeof input !== 'object') input = {};
  const utm = {};
  for (const key of UTM_KEYS) {
    if (typeof input.utm?.[key] === 'string') utm[key] = input.utm[key].replace(/[\r\n]/g, '').slice(0, 200);
  }
  const safeUrl = (value, includeUtm) => {
    try {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol)) return '';
      const query = includeUtm ? new URLSearchParams(utm).toString() : '';
      return `${url.origin}${url.pathname}${query ? '?' + query : ''}`.slice(0, 1500);
    } catch { return ''; }
  };
  const leanked = utm.utm_source?.toLowerCase() === 'leanked' && utm.utm_medium?.toLowerCase() === 'newsletter' && utm.utm_campaign?.toLowerCase() === 'automation_01';
  return { source: leanked ? 'Leanked Newsletter #01' : 'website_automation',
    url: safeUrl(input.url, true), referrer: safeUrl(input.referrer, false), utm };
}

export function automationMessage(input, context) {
  const analysis = validateAnalysis(input);
  const origin = attribution(context);
  const periodLabel = { day: 'dia útil', week: 'semana', month: 'mês', year: 'ano' };
  return [
    'ANÁLISE DE AUTOMAÇÃO', '', analysis.process, '',
    `Pessoas: ${analysis.people}`, `Minutos por pessoa e ocorrência: ${analysis.minutes}`,
    `Frequência: ${FREQUENCIES[analysis.frequency]}`, `Quantidade: ${analysis.count}; período: ${periodLabel[analysis.period]}`,
    `Ocorrências anuais: ${analysis.occurrences}`, `Custo/hora: ${analysis.hourlyCost === null ? 'Não indicado' : analysis.hourlyCost + ' EUR'}`,
    `Horas anuais: ${analysis.hours}`, `Dias de trabalho (8 horas): ${analysis.days}`,
    `Custo anual: ${analysis.cost === null ? 'Não calculado' : analysis.cost + ' EUR'}`, '',
    'Valores recalculados no servidor. Tempo e custo atuais; não representam poupanças.', '',
    `Source: ${origin.source}`, `URL: ${origin.url}`, `Referrer: ${origin.referrer}`,
    ...Object.entries(origin.utm).map(([key, value]) => `${key}: ${value}`)
  ].join('\n');
}
