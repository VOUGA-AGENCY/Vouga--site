import { numberValue, validateAnalysis, formatWhole, annualOccurrences } from './automation-math.mjs';
import './footer-ascii.mjs';
import './automation-ascii.mjs';

const $ = id => document.getElementById(id);
const STORAGE = 'vouga-automation-v1';
const TTL = 24 * 60 * 60 * 1000;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const query = new URLSearchParams(location.search);
const utm = Object.fromEntries(utmKeys.filter(key => query.has(key)).map(key => [key, query.get(key).slice(0, 200)]));
const journeyId = () => crypto.randomUUID();
const defaults = () => ({ process: '', people: '5', minutes: '', frequency: '', count: '2', period: 'day', hourlyCost: '', unknown: false });
let state = { version: 1, updated: Date.now(), step: 0, phase: 'intro', answers: defaults(),
  journey: journeyId(), events: [], attribution: { url: location.href, referrer: document.referrer, utm } };
try {
  const saved = JSON.parse(sessionStorage.getItem(STORAGE));
  if (saved?.version === 1 && Date.now() - saved.updated < TTL && saved.updated <= Date.now() &&
      Number.isInteger(saved.step) && saved.step >= 0 && saved.step <= 4 &&
      ['intro', 'questions', 'result'].includes(saved.phase) && saved.answers && typeof saved.answers === 'object' &&
      /^[a-f0-9-]{36}$/.test(saved.journey || '')) {
    state = { ...state, ...saved, answers: { ...defaults(), ...saved.answers }, events: Array.isArray(saved.events) ? saved.events : [] };
    if (Object.keys(utm).length) state.attribution = { url: location.href, referrer: document.referrer, utm };
  } else if (saved) sessionStorage.removeItem(STORAGE);
} catch { /* The calculator also works without browser storage. */ }
let result = null;
let sending = false;
const errors = {
  process: 'Descreva o processo que quer analisar (até 3.000 caracteres).',
  people: 'Indique um número inteiro de pessoas, entre 1 e 100.000.',
  minutes: 'Indique um tempo superior a zero, até 525.600 minutos.',
  frequency: 'Escolha a frequência do processo.', count: 'Indique um número inteiro de ocorrências, entre 1 e 100.000.',
  period: 'Escolha o período da frequência.', hourlyCost: 'Indique um custo válido, entre 0 e 1.000.000 €, ou deixe o campo vazio.'
};
const fields = { process: 'process', people: 'people', minutes: 'minutes', count: 'frequencyCount', period: 'frequencyPeriod', hourlyCost: 'hourlyCost' };

function save() {
  state.updated = Date.now();
  try { sessionStorage.setItem(STORAGE, JSON.stringify(state)); }
  catch { $('storageNote').textContent = 'O navegador não permite guardar o progresso. Mantenha este separador aberto até terminar.'; }
}
function track(event) {
  if (state.events.includes(event)) return;
  state.events.push(event);
  save();
  const campaign = state.attribution?.utm || {};
  const detail = { event, journey: state.journey, leanked: campaign.utm_source?.toLowerCase() === 'leanked' &&
    campaign.utm_medium?.toLowerCase() === 'newsletter' && campaign.utm_campaign?.toLowerCase() === 'automation_01' };
  window.dispatchEvent(new CustomEvent('vouga:automation', { detail }));
  fetch('/api/automation-events', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(detail), keepalive: true }).catch(() => {});
}
function moveTo(element, focusTarget = element) {
  element.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'start' });
  focusTarget.focus({ preventScroll: true });
}
function readAnswers() {
  state.answers = { process: $('process').value, people: $('people').value, minutes: $('minutes').value,
    frequency: document.querySelector('[name=frequency]:checked')?.value || '', count: $('frequencyCount').value,
    period: $('frequencyPeriod').value, hourlyCost: $('hourlyCost').value, unknown: $('unknownCost').checked };
  return { ...state.answers, hourlyCost: state.answers.unknown ? null : state.answers.hourlyCost };
}
function fillAnswers() {
  Object.entries(fields).forEach(([key, id]) => { $(id).value = String(state.answers[key] ?? ''); });
  $('unknownCost').checked = state.answers.unknown === true;
  document.querySelectorAll('[name=frequency]').forEach(el => { el.checked = el.value === state.answers.frequency; });
  syncControls();
}
function syncControls() {
  const answers = readAnswers();
  const custom = answers.frequency === 'custom';
  const detailed = ['weeklyMultiple', 'monthlyMultiple', 'custom'].includes(answers.frequency);
  $('frequencyDetails').hidden = !detailed;
  $('frequencyPeriod').hidden = !custom;
  $('periodLabel').hidden = !custom;
  $('frequencyCountLabel').textContent = custom ? 'Quantas vezes?' : answers.frequency === 'weeklyMultiple' ? 'Vezes por semana' : 'Vezes por mês';
  const occurrences = annualOccurrences(answers.frequency, numberValue(answers.count), answers.period);
  $('frequencyHelp').textContent = 'Consideramos 220 dias úteis, 44 semanas ou 12 meses por ano.' +
    (Number.isFinite(occurrences) && occurrences > 0 ? ` Nesta estimativa: ${formatWhole(occurrences)} ocorrências por ano.` : '');
  $('hourlyCost').disabled = answers.unknown;
  const minutes = numberValue(answers.minutes);
  const preset = [15, 30, 60, 120].includes(minutes);
  document.querySelectorAll('[data-minutes]').forEach(button => button.setAttribute('aria-pressed',
    String(button.dataset.minutes === 'other' ? !preset && answers.minutes !== '' : Number(button.dataset.minutes) === minutes)));
  $('lessPeople').disabled = numberValue(answers.people) <= 1;
  $('morePeople').disabled = numberValue(answers.people) >= 100000;
}
function clearError() {
  $('stepError').textContent = '';
  $('questionForm').querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
}
function stepValid() {
  const answers = readAnswers();
  // Fill only later steps with safe values so earlier steps never require future answers.
  const candidate = { ...answers };
  if (state.step < 1) candidate.people = 1;
  if (state.step < 2) candidate.minutes = 1;
  if (state.step < 3) candidate.frequency = 'daily';
  if (state.step < 4) candidate.hourlyCost = null;
  try { validateAnalysis(candidate); return true; }
  catch (error) {
    const stepByField = { process: 0, people: 1, minutes: 2, frequency: 3, count: 3, period: 3, hourlyCost: 4 };
    if (stepByField[error.field] < state.step) { state.step = stepByField[error.field]; showStep(false); }
    $('stepError').textContent = errors[error.field] || 'Reveja os valores introduzidos.';
    const field = $(fields[error.field]) || document.querySelector('[name=frequency]');
    field.setAttribute('aria-invalid', 'true'); field.focus(); return false;
  }
}
function showStep(scroll = true) {
  clearError();
  $('analysisFlow').hidden = false;
  $('analysisResult').hidden = true;
  document.querySelectorAll('[data-step]').forEach((el, index) => { el.hidden = index !== state.step; });
  $('stepProgress').textContent = `${state.step + 1} de 5`;
  $('analysisProgress').value = state.step + 1;
  $('nextStep').textContent = state.step === 4 ? 'Ver resultado →' : 'Continuar →';
  state.phase = 'questions';
  syncControls(); save();
  if (scroll) moveTo($('analysisFlow'), document.querySelector(`[data-step="${state.step}"] h2`));
}
function showResult(scroll = true) {
  try { result = validateAnalysis(readAnswers()); }
  catch { state.step = 0; showStep(scroll); return; }
  $('annualHours').textContent = formatWhole(result.hours);
  $('annualDays').textContent = formatWhole(result.days);
  $('annualCostBlock').hidden = result.cost === null;
  $('annualCost').textContent = result.cost === null ? '' : `${formatWhole(result.cost)} €`;
  $('currentHours').textContent = `${formatWhole(result.hours)} h / ano`;
  $('illustrativeHours').textContent = `${formatWhole(result.hours * .5)} h / ano`;
  $('resultAssumptions').textContent = `${result.people} ${result.people === 1 ? 'pessoa' : 'pessoas'} × ${String(result.minutes).replace('.', ',')} min × ${formatWhole(result.occurrences)} ocorrências/ano. Dias equivalentes de 8 horas, somados entre todas as pessoas.`;
  $('analysisFlow').hidden = true; $('analysisResult').hidden = false;
  state.phase = 'result'; save();
  if (scroll) moveTo(document.querySelector('.automation-result'), $('resultTitle'));
}
$('startAnalysis').hidden = false;
document.querySelector('.automation-result-cta').addEventListener('click', event => {
  event.preventDefault(); moveTo($('automationLead'), $('leadSuccess').hidden ? $('leadName') : $('leadSuccess').querySelector('h2'));
});
function resetConversion() {
  if (!$('leadSuccess').hidden) {
    $('leadSuccess').hidden = true; $('leadForm').hidden = false; $('conversionIntro').hidden = false;
    state.journey = journeyId(); state.events = [];
  }
}
$('startAnalysis').addEventListener('click', () => { if (sending) return; resetConversion(); track('automation_started'); showStep(); });
$('questionForm').addEventListener('input', () => { clearError(); syncControls(); save(); });
$('questionForm').addEventListener('change', () => { syncControls(); save(); });
$('questionForm').addEventListener('submit', event => {
  event.preventDefault(); if (!stepValid()) return;
  if (state.step < 4) { track(`automation_step_${state.step + 1}_completed`); state.step++; showStep(); }
  else { showResult(); track('automation_calculation_completed'); }
});
$('previousStep').addEventListener('click', () => {
  readAnswers();
  if (state.step > 0) { state.step--; showStep(); }
  else { state.phase = 'intro'; $('analysisFlow').hidden = true; save(); moveTo(document.querySelector('.automation-intro'), $('startAnalysis')); }
});
$('editAnalysis').addEventListener('click', () => { if (!sending) { resetConversion(); state.step = 0; showStep(); } });
$('clearAnalysis').addEventListener('click', () => {
  if (!confirm('Limpar as respostas desta análise?')) return;
  state.answers = defaults(); state.step = 0; state.journey = journeyId(); state.events = [];
  $('leadForm').reset(); fillAnswers(); showStep(); track('automation_started');
});
['lessPeople', 'morePeople'].forEach((id, index) => $(id).addEventListener('click', () => {
  const current = numberValue($('people').value);
  $('people').value = Math.min(100000, Math.max(1, (Number.isFinite(current) ? current : 1) + (index ? 1 : -1)));
  clearError(); syncControls(); save();
}));
document.querySelectorAll('[data-minutes]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.minutes === 'other') { $('minutes').value = ''; $('minutes').focus(); }
  else $('minutes').value = button.dataset.minutes;
  clearError(); syncControls(); save();
}));
$('questionForm').addEventListener('keydown', event => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && event.target.tagName === 'TEXTAREA') {
    event.preventDefault(); $('questionForm').requestSubmit();
  }
});

$('leadForm').addEventListener('submit', async event => {
  event.preventDefault(); if (sending || !result) return;
  const form = $('leadForm');
  $('leadError').textContent = '';
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  const data = Object.fromEntries(new FormData(form));
  const fieldErrors = { name: 'Indique o seu nome (pelo menos 2 caracteres).', company: 'Indique o nome da empresa (pelo menos 2 caracteres).',
    email: 'Introduza um email válido.', phone: 'Indique um telefone válido com indicativo do país, como +351 912 345 678.',
    consent: 'Aceite a utilização dos dados para podermos responder a esta análise.' };
  function fail(field, message) {
    $('leadError').textContent = message;
    const el = form.elements.namedItem(field);
    if (el) { el.setAttribute('aria-invalid', 'true'); el.focus(); }
  }
  for (const key of ['name', 'company']) if ((data[key] || '').trim().length < 2) return fail(key, fieldErrors[key]);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email || '') || !form.elements.email.validity.valid) return fail('email', fieldErrors.email);
  if (data.phone?.trim() && !/^\+[\d\s()\-]{7,24}$/.test(data.phone.trim())) return fail('phone', fieldErrors.phone);
  if (data.consent !== 'on') return fail('consent', fieldErrors.consent);
  sending = true;
  $('submitLead').disabled = true; $('submitLead').textContent = 'A enviar…';
  $('editAnalysis').disabled = true; $('startAnalysis').disabled = true;
  form.setAttribute('aria-busy', 'true');
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      signal: controller.signal, body: JSON.stringify({ ...data, consent: true, language: 'pt', source: 'website_automation',
        analysis: readAnswers(), attribution: state.attribution }) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.ok !== true) {
      if (body.field && fieldErrors[body.field]) { fail(body.field, fieldErrors[body.field]); return; }
      if (body.code === 'invalid_analysis') throw new Error('Reveja as respostas da análise e tente novamente.');
      if (response.status === 429) throw new Error('Recebemos várias tentativas. Aguarde alguns minutos e volte a tentar.');
      throw new Error('Não foi possível enviar. Tente novamente ou escreva para contacto@vouga-agency.pt.');
    }
    track('automation_lead_submitted');
    form.hidden = true; $('conversionIntro').hidden = true; $('leadSuccess').hidden = false;
    form.reset();
    try { sessionStorage.removeItem(STORAGE); } catch {}
    moveTo($('leadSuccess'), $('leadSuccess').querySelector('h2'));
  } catch (error) {
    $('leadError').textContent = error.name === 'AbortError' ? 'O envio demorou mais do que o esperado. As respostas estão guardadas. Tente novamente dentro de momentos.' :
      error instanceof TypeError ? 'Sem ligação. Verifique a sua ligação e tente novamente.' : error.message;
  } finally {
    clearTimeout(timeout); sending = false; form.removeAttribute('aria-busy');
    $('submitLead').disabled = false; $('submitLead').textContent = 'Vamos resolver em conjunto →';
    $('editAnalysis').disabled = false; $('startAnalysis').disabled = false;
  }
});

// Same header behaviour as contact.html, fixed to Portuguese on this page.
const burger = $('navBurger'), menu = $('mobileMenu');
function setMenu(open) {
  menu.classList.toggle('open', open); menu.inert = !open;
  burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'fechar menu' : 'abrir menu');
}
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); } });
matchMedia('(max-width: 820px)').addEventListener('change', () => setMenu(false));
window.addEventListener('scroll', () => document.querySelector('.nav').classList.toggle('is-scrolled', scrollY > 24), { passive: true });
fillAnswers();
if (state.phase === 'result') showResult(false);
else if (state.phase === 'questions') showStep(false);
