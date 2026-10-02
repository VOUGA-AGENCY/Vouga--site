import './footer-ascii.mjs';
// Shares the site's persisted PT/EN choice; isolated from homepage-only features.
const COPY = {
  "pt": {
    "title": "Vouga × Leanked | Do processo à tecnologia",
    "description": "Excelência operacional e engenharia tecnológica. A parceria entre a Vouga e a Leanked liga processos, sistemas, automação e inteligência artificial.",
    "navApproach": "abordagem",
    "navIntervene": "modelo",
    "navWork": "trabalho",
    "navAbout": "sobre",
    "navContact": "contactar",
    "talkToUs": "Falar connosco",
    "skip": "Saltar para o conteúdo",
    "hero": "Do processo à tecnologia.",
    "heroDescription": "A Leanked traz excelência operacional no terreno. A Vouga traz software, automação, dados e IA. Juntas, ajudamos organizações industriais a transformar melhoria contínua em sistemas escaláveis.",
    "kicker": "VOUGA × LEANKED · PARCERIA ESTRATÉGICA",
    "introFirst": "Uma parceria",
    "introSecond": "Do processo à tecnologia.",
    "years": "17 anos",
    "yearsLabel": "de transformação operacional",
    "projects": "+200 projetos",
    "projectsLabel": "realizados desde 2009",
    "orgs": "+50 organizações",
    "orgsLabel": "acompanhadas",
    "sectors": "6 setores",
    "sectorsLabel": "entre indústria e serviços",
    "results": "Resultados medidos no terreno.",
    "capacity": "Capacidade",
    "picking": "Tempo de picking",
    "productivity": "Produtividade",
    "proofNote": "Resultados selecionados de projetos anteriores da Leanked.",
    "closing": "Da excelência operacional à vantagem tecnológica.",
    "cta": "Falar connosco →",
    "privacy": "Privacidade",
    "terms": "Termos",
    "imageAlt": "Dois braços industriais, com as marcas Vouga e Leanked, encontram-se numa fábrica.",
    "partnerLink": "Conhecer a Leanked ↗",
    "footerFirst": "Vamos",
    "footerSecond": "conversar"
  },
  "en": {
    "title": "Vouga × Leanked | From process to technology",
    "description": "Operational excellence meets technology engineering. Vouga and Leanked connect processes, systems, automation, data and applied AI.",
    "navApproach": "approach",
    "navIntervene": "model",
    "navWork": "work",
    "navAbout": "about",
    "navContact": "contact",
    "talkToUs": "Talk to us",
    "skip": "Skip to content",
    "hero": "From process to technology.",
    "heroDescription": "Leanked brings operational excellence on the ground. Vouga brings software, automation, data and AI. Together, we help industrial organisations turn continuous improvement into scalable systems.",
    "kicker": "VOUGA × LEANKED · STRATEGIC PARTNERSHIP",
    "introFirst": "One partnership",
    "introSecond": "From process to technology.",
    "years": "17 years",
    "yearsLabel": "of operational transformation",
    "projects": "200+ projects",
    "projectsLabel": "delivered since 2009",
    "orgs": "50+ organisations",
    "orgsLabel": "worked with",
    "sectors": "6 sectors",
    "sectorsLabel": "across industry and services",
    "results": "Measured on the ground.",
    "capacity": "Capacity",
    "picking": "Picking time",
    "productivity": "Productivity",
    "proofNote": "Selected results from previous Leanked engagements.",
    "closing": "From operational excellence to technological advantage.",
    "cta": "Talk to us →",
    "privacy": "Privacy",
    "terms": "Terms",
    "imageAlt": "Two industrial arms, branded Vouga and Leanked, meet inside a factory.",
    "partnerLink": "Discover Leanked ↗",
    "footerFirst": "Let’s",
    "footerSecond": "talk"
  }
};
let language = 'pt';
try { if (localStorage.getItem('vouga-lang') === 'en') language = 'en'; } catch {}
const toggle = document.getElementById('langToggle');
const burger = document.getElementById('navBurger');
const menu = document.getElementById('mobileMenu');
function setMenu(open) {
  menu.classList.toggle('open', open);
  menu.inert = !open;
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', language === 'pt' ? (open ? 'fechar menu' : 'abrir menu') : (open ? 'close menu' : 'open menu'));
}
function applyLanguage() {
  const copy = COPY[language];
  document.documentElement.lang = language === 'pt' ? 'pt-PT' : 'en';
  document.documentElement.dataset.lang = language;
  document.querySelectorAll('[data-partner]').forEach(el => {
    const key = el.dataset.partner;
    if (copy[key]) el.textContent = copy[key];
  });
  document.title = copy.title;
  document.querySelector('meta[name="description"]').content = copy.description;
  document.querySelector('meta[property="og:title"]').content = copy.title;
  document.querySelector('meta[property="og:description"]').content = copy.description;
  document.querySelector('meta[property="og:locale"]').content = language === 'pt' ? 'pt_PT' : 'en_GB';
  document.getElementById('partnershipImage').alt = copy.imageAlt;
  toggle.setAttribute('aria-label', language === 'pt' ? 'Switch to English' : 'Mudar para português');
  document.querySelectorAll('[data-lang-option]').forEach(el => el.classList.toggle('active', el.dataset.langOption === language));
  document.querySelector('.logo').setAttribute('aria-label', language === 'pt' ? 'Vouga Agency, início' : 'Vouga Agency, home');
  document.querySelector('.nav-inner > nav').setAttribute('aria-label', language === 'pt' ? 'navegação principal' : 'main navigation');
  document.querySelector('.mobile-links').setAttribute('aria-label', language === 'pt' ? 'navegação móvel' : 'mobile navigation');
  document.querySelector('.home-contact-cta').setAttribute('aria-label', copy.navContact);
  setMenu(false);
}
toggle.addEventListener('click', () => {
  language = language === 'pt' ? 'en' : 'pt';
  try { localStorage.setItem('vouga-lang', language); } catch {}
  applyLanguage();
});
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
});
matchMedia('(max-width:820px)').addEventListener('change', () => setMenu(false));
function syncNav(){ document.querySelector('.nav').classList.toggle('is-scrolled', scrollY > 24); }
window.addEventListener('scroll', syncNav, {passive:true});
applyLanguage();
syncNav();
