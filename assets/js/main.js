(function(){
  'use strict';

  /* ===== theme ===== */
  var root = document.documentElement;
  function applyTheme(t){ root.setAttribute('data-theme', t); }
  var saved = null;
  try { saved = localStorage.getItem('vouga-theme'); } catch(e){}
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
  function toggleTheme(){
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('vouga-theme', next); } catch(e){}
    if (typeof refreshCanvasColors === 'function') refreshCanvasColors();
    if (typeof drawWhyMark === 'function') drawWhyMark();
    if (typeof drawWhyDots === 'function') drawWhyDots();
  }
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  var themeBtnMobile = document.getElementById('themeToggleMobile');
  if (themeBtnMobile) themeBtnMobile.addEventListener('click', toggleTheme);

  /* ===== mobile menu (hamburger) ===== */
  var navBurger = document.getElementById('navBurger');
  var mobileMenu = document.getElementById('mobileMenu');
  function setMenu(open){
    if (!navBurger || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
    navBurger.setAttribute('aria-label', open ? 'fechar menu' : 'abrir menu');
  }
  if (navBurger && mobileMenu) {
    navBurger.addEventListener('click', function(){ setMenu(!mobileMenu.classList.contains('open')); });
    mobileMenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function(){ if (window.innerWidth > 820) setMenu(false); });
  }

  /* ===== language ===== */
  var currentLang = 'pt';
  var langToggle = document.getElementById('langToggle');
  var I18N = {
    pt: {
      logoHome: 'Vouga Agency, início',
      mainNav: 'navegação principal',
      navContact: 'contacto',
      themeToggle: 'alternar modo claro e escuro',
      themeLabel: 'Modo claro / escuro',
      talkToUs: 'Contacte-nos',
      heroTitle: '<span class="hero-line"><span class="grad">Inteligência</span>, desenhada</span><br><span class="hero-line">à volta <em>do negócio</em></span>',
      heroSub: 'Com visão sistémica, melhoramos o que já existe, construímos o que falta e formamos quem mantém tudo em movimento.',
      heroDiagnose: 'Fazer o diagnóstico <span class="arrow">→</span>',
      heroPillars: 'Ver os pilares',
      navMethod: 'método',
      pillarsKicker: 'os pilares · um sistema',
      pillarIntelDesc: 'IA integrada no trabalho que já move o negócio.',
      pillarFoundDesc: 'Da ideia ao sistema validado, construído só depois de perceber o risco.',
      pillarAcademyDesc: 'Uma ponte de formação e talento para quem vai construir com inteligência.',
      explore: 'explorar →',
      seeWorking: 'Descubra o seu sistema <span class="arrow">→</span>',
      whatWeBuild: 'O que construímos',
      whyLabel: 'porquê',
      whyCopy: 'Entre investigação, IA e mudança operacional, muitas empresas perdem momentum. Não por falta de potencial, mas porque o sistema não está preparado para validar, construir e transformar novas capacidades em operação.',
      anchorLine: 'Validamos, construímos e redesenhamos trabalho em torno da <span class="grad">inteligência</span>.',
      servicesLabel: 'sistemas de operação',
      servicesTitle: 'O que construímos',
      servicesNum: '01 / agency',
      svc1Name: 'Auditoria de Workflow com IA',
      svc1Desc: 'Mapeamos como o trabalho se move dentro da empresa e identificamos onde a IA pode remover fricção, reduzir desperdício ou aumentar velocidade.',
      svc2Name: 'Sistema de Conhecimento com IA',
      svc2Desc: 'Transformamos documentos, processos e know-how interno disperso numa camada de conhecimento pesquisável, com respostas citadas.',
      svc3Name: 'Copiloto Comercial com IA',
      svc3Desc: 'Ajudamos equipas comerciais a preparar, escrever e fazer follow-up mais depressa, usando o conhecimento da própria empresa.',
      svc4Name: 'Agente Reunião → Execução',
      svc4Desc: 'Transformamos reuniões em decisões, responsáveis, prazos e follow-up.',
      svc5Name: 'Auditoria de Governação de IA',
      svc5Desc: 'Descobrimos onde a IA já está a ser usada, que riscos cria e de que regras a empresa precisa antes de escalar.',
      svc6Name: 'Capacitação em IA',
      svc6Desc: 'Treinamos equipas no seu trabalho real, não em prompts genéricos.',
      allServices: '← todos os serviços',
      svcOpen: 'abrir detalhe →',
      methodLabel: 'o método',
      methodTitle: 'Como entramos',
      methodNum: '02 / método',
      step1Label: 'passo 1 · 2 semanas',
      step1Title: 'Sprint Operacional',
      step1Copy: 'Duas semanas para perceber o workflow, encontrar os pontos de alavancagem e definir o que construir primeiro.',
      step2Label: 'passo 2 · 4 a 6 semanas',
      step2Title: 'Construção Piloto',
      step2Copy: 'Construímos o primeiro sistema funcional e colocamo-lo nas mãos da equipa.',
      step3Label: 'passo 3 · mensal',
      step3Title: 'Parceiro Operacional',
      step3Copy: 'Ficamos por perto, melhoramos o que está em produção e passamos de um workflow para o próximo.',
      proofLabel: 'prova',
      proofTitle: 'Resultados',
      proofNum: '03 / prova',
      proofStat1: 'tempo para encontrar uma resposta interna',
      proofStat2: 'mais rápido da reunião à proposta enviada',
      proofStat3: 'poupadas por pessoa, por semana',
      proofStat4: 'das reuniões acabam com responsáveis e prazos',
      proofBuildingTitle: 'Primeiros casos em construção.',
      proofBuildingCopy: 'Estamos a fechar os primeiros projetos com clientes. Quando houver resultados reais e medidos, é aqui que aparecem, com nome e número. Sem dados inventados.',
      case1Sector: 'distribuição industrial · 120 pessoas',
      case1Metric: 'tempo de processamento de encomendas −58%',
      case2Sector: 'software b2b · 45 pessoas',
      case2Metric: 'taxa de follow-up em negócios abertos +28%',
      case3Sector: 'serviços profissionais · 80 pessoas',
      case3Metric: 'tempo de integração de novos colaboradores −40%',
      proofNote: 'medido em implementações iniciais, primeiros 90 dias',
      foundationLabel: 'para além dos serviços',
      foundationSubLabel: 'construções chave-na-mão',
      foundationHeadline: 'Algumas ideias merecem mais do que conselhos. Precisam de ser <em>construídas</em>.',
      foundationCopy: 'Vouga Foundations é o nosso braço de construção, complementar ao trabalho de agência. Tu trazes a ideia; levamo-la do conceito a um produto funcional e entregamos-te as chaves. Arquitetura, produto, código e deployment: uma equipa, do início ao fim.',
      foundationScope: 'definição',
      foundationScopeCopy: 'Definir a versão mais pequena que prova que há procura.',
      foundationBuild: 'construção',
      foundationBuildCopy: 'Construir depressa, mas com arquitetura que aguenta.',
      foundationHandover: 'entrega',
      foundationHandoverCopy: 'Código claro, infraestrutura clara, propriedade clara.',
      bringIdea: 'Traz-nos uma ideia <span class="arrow">→</span>',
      aboutLabel: 'sobre',
      aboutTitle: 'Como pensamos',
      aboutNum: '05 / sobre',
      aboutCopy1: 'A Vouga é construída por jovens engenheiros com muita iniciativa e pensamento sistémico. Assumimos os problemas de ponta a ponta e estamos a construir uma casa para o melhor talento técnico jovem: pessoas que querem responsabilidade antes de títulos.',
      aboutCopy2: 'Vemos as empresas como sistemas: pessoas, decisões, ferramentas, documentos e incentivos a moverem-se em conjunto.',
      aboutPrinciple: 'Nenhuma funcionalidade sem contexto. Nenhuma automação sem compreender o sistema.',
      contactLabel: 'contacto',
      contactTitle: 'Vamos <em>falar</em>',
      contactCopy: 'Envia-nos o processo que é lento, confuso ou dependente de uma só pessoa. Dizemos-te se vale a pena construir algo à volta dele.',
      nameLabel: 'nome',
      companyLabel: 'empresa',
      messageLabel: 'mensagem',
      consentCopy: 'Aceito que a Vouga use os meus dados para responder a este pedido. Lê a <a href="privacy.html">Política de Privacidade</a>.',
      formNote: 'Usamos os dados do formulário apenas para responder ao teu pedido e avaliar se podemos ajudar. Não envies dados confidenciais de clientes através deste formulário.',
      sendButton: 'Enviar <span class="arrow">→</span>',
      footerTag: 'Inteligência para trabalho real.',
      visitLabel: 'visita',
      followLabel: 'seguir',
      rights: '© 2026 Vouga Agency · Todos os direitos reservados',
      legalLinks: '<a href="privacy.html">Privacidade</a> · <a href="terms.html">Termos</a>',
      madeIn: 'Feito em Portugal'
    },
    en: {
      logoHome: 'Vouga Agency, home',
      mainNav: 'main navigation',
      navContact: 'contact',
      themeToggle: 'toggle light and dark mode',
      themeLabel: 'Light / dark mode',
      talkToUs: 'Contact us',
      heroTitle: '<span class="hero-line"><span class="grad">Intelligence</span>, built</span><br><span class="hero-line">around <em>the business</em></span>',
      heroSub: 'We read your company as a system, then improve what exists, build what is missing, and train the people who keep it moving.',
      heroDiagnose: 'Take the diagnosis <span class="arrow">→</span>',
      heroPillars: 'See the pillars',
      navMethod: 'method',
      pillarsKicker: 'the pillars · one system',
      pillarIntelDesc: 'AI built into the work that already moves the business.',
      pillarFoundDesc: 'From idea to validated system, built only after the risk is understood.',
      pillarAcademyDesc: 'A learning and talent bridge for the people who will build with intelligence.',
      explore: 'explore →',
      seeWorking: 'Find your system <span class="arrow">→</span>',
      whatWeBuild: 'What we build',
      whyLabel: 'why',
      whyCopy: 'Between research, AI and operational change, many companies lose momentum. Not for lack of potential, but because the system is not prepared to validate, build and turn new capabilities into operation.',
      anchorLine: 'Vouga validates, builds and redesigns work around <span class="grad">intelligence</span>.',
      servicesLabel: 'operating systems',
      servicesTitle: 'What we build',
      servicesNum: '01 / services',
      svc1Name: 'AI Workflow Audit',
      svc1Desc: 'We map how work moves through the company and identify where AI can remove friction, reduce waste or increase speed.',
      svc2Name: 'AI Knowledge System',
      svc2Desc: 'We turn scattered documents, processes and internal know how into a searchable knowledge layer with cited answers.',
      svc3Name: 'AI Sales Copilot',
      svc3Desc: "We help commercial teams prepare, write and follow up faster, using the company's own knowledge.",
      svc4Name: 'Meeting → Execution Agent',
      svc4Desc: 'We turn meetings into decisions, owners, deadlines and follow up.',
      svc5Name: 'AI Governance Audit',
      svc5Desc: 'We find where AI is already being used, what risks it creates, and what rules the company needs before scaling.',
      svc6Name: 'AI Enablement',
      svc6Desc: 'We train teams on their real work, not on generic prompts.',
      allServices: '← all services',
      svcOpen: 'open detail →',
      methodLabel: 'the method',
      methodTitle: 'How we enter',
      methodNum: '02 / method',
      step1Label: 'step 1 · 2 weeks',
      step1Title: 'Operating Sprint',
      step1Copy: 'Two weeks to understand the workflow, find the leverage points and define the first build.',
      step2Label: 'step 2 · 4 to 6 weeks',
      step2Title: 'Pilot Build',
      step2Copy: 'We build the first working system and put it in the hands of the team.',
      step3Label: 'step 3 · monthly',
      step3Title: 'Operating Partner',
      step3Copy: 'We stay close, improve what is live and turn one workflow into the next.',
      proofLabel: 'proof',
      proofTitle: 'Results',
      proofNum: '03 / proof',
      proofStat1: 'time to find an internal answer',
      proofStat2: 'faster from meeting to proposal sent',
      proofStat3: 'saved per person, per week',
      proofStat4: 'of meetings end with owners and deadlines',
      proofBuildingTitle: 'First cases in the making.',
      proofBuildingCopy: 'We are closing our first client projects. Real, measured results will live here, with a name and a number. No invented data.',
      case1Sector: 'industrial distribution · 120 people',
      case1Metric: 'order processing time −58%',
      case2Sector: 'b2b software · 45 people',
      case2Metric: 'follow-up rate on open deals +28%',
      case3Sector: 'professional services · 80 people',
      case3Metric: 'new-hire ramp-up −40%',
      proofNote: 'measured across early deployments, first 90 days',
      foundationLabel: 'beyond services',
      foundationSubLabel: 'turnkey builds',
      foundationHeadline: 'Some ideas deserve more than advice. They need to be <em>built</em>.',
      foundationCopy: 'Vouga Foundations is our build arm, complementary to the agency work. You bring the idea; we take it from concept to a working product and hand over the keys. Architecture, product, code, deployment: one team, end to end.',
      foundationScope: 'scope',
      foundationScopeCopy: 'Define the smallest version that proves demand.',
      foundationBuild: 'build',
      foundationBuildCopy: 'Build fast, but with architecture that can survive.',
      foundationHandover: 'handover',
      foundationHandoverCopy: 'Clear code, clear infrastructure, clear ownership.',
      bringIdea: 'Bring us an idea <span class="arrow">→</span>',
      aboutLabel: 'about',
      aboutTitle: 'How we think',
      aboutNum: '05 / about',
      aboutCopy1: 'Vouga is built by young engineers with high agency and systems thinking. We own problems end to end, and we are building a home for the strongest young technical talent: people who want responsibility before titles.',
      aboutCopy2: 'We see companies as systems: people, decisions, tools, documents and incentives moving together.',
      aboutPrinciple: 'No feature without context. No automation without understanding the system.',
      contactLabel: 'contact',
      contactTitle: "Let's <em>talk</em>",
      contactCopy: 'Send us the process that is slow, messy or dependent on one person. We will tell you if it is worth building around.',
      nameLabel: 'name',
      companyLabel: 'company',
      messageLabel: 'message',
      consentCopy: 'I agree that Vouga may use my details to reply to this enquiry. Read the <a href="privacy.html">Privacy Policy</a>.',
      formNote: 'We use contact form details only to respond to your enquiry and evaluate whether we can help. Do not send confidential client data through this form.',
      sendButton: 'Send <span class="arrow">→</span>',
      footerTag: 'Intelligence for real work.',
      visitLabel: 'visit',
      followLabel: 'follow',
      rights: '© 2026 Vouga Agency · All rights reserved',
      legalLinks: '<a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a>',
      madeIn: 'Made in Portugal'
    }
  };
  var META_COPY = {
    pt: {
      title: 'Vouga Agency · Serviços de IA, MVPs e Automação Empresarial',
      description: 'A Vouga Agency cria sistemas de IA para empresas, automação de workflows, copilotos de IA, MVPs, protótipos e produtos go-to-market para transformar ideias em software real.',
      keywords: 'serviços de IA para empresas, agência de IA, automação com IA, sistemas de conhecimento com IA, copiloto comercial de IA, auditoria de governação de IA, desenvolvimento de MVP, desenvolvimento de protótipos, produto go-to-market, automação empresarial, AI services for companies, enterprise AI agency, MVP development, Porto AI agency, Portugal AI company',
      socialTitle: 'Vouga Agency · Serviços de IA, MVPs e Automação Empresarial',
      socialDescription: 'Sistemas de IA para empresas, automação de workflows, copilotos, MVPs, protótipos e desenvolvimento go-to-market.',
      imageAlt: 'Identidade visual da Vouga Agency para serviços de IA empresarial e desenvolvimento de MVPs.',
      locale: 'pt_PT'
    },
    en: {
      title: 'Vouga Agency · AI Services, MVP Development and Business Automation',
      description: 'Vouga Agency builds enterprise AI systems, workflow automation, AI copilots, MVPs, prototypes and go-to-market products for companies turning ideas into working software.',
      keywords: 'AI services for companies, enterprise AI agency, AI workflow automation, AI knowledge systems, AI sales copilot, AI governance audit, MVP development, prototype development, go-to-market product development, business automation, Porto AI agency, Portugal AI company',
      socialTitle: 'Vouga Agency · AI Services, MVP Development and Business Automation',
      socialDescription: 'Enterprise AI systems, workflow automation, AI copilots, MVPs, prototypes and go-to-market product development for companies.',
      imageAlt: 'Vouga Agency visual identity for enterprise AI and MVP development services.',
      locale: 'en_US'
    }
  };
  function setMeta(selector, value){
    var el = document.querySelector(selector);
    if (el) el.setAttribute('content', value);
  }
  function syncLangToggle(lang){
    if (!langToggle) return;
    var options = langToggle.querySelectorAll('[data-lang-option]');
    options.forEach(function(option){
      var active = option.getAttribute('data-lang-option') === lang;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    langToggle.setAttribute('aria-label', lang === 'pt' ? 'Switch to English' : 'Mudar para português');
  }
  function applyLanguage(lang){
    lang = lang === 'en' ? 'en' : 'pt';
    currentLang = lang;
    root.setAttribute('lang', lang === 'en' ? 'en' : 'pt-PT');
    root.setAttribute('data-lang', lang);
    var copy = I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if (copy[key]) el.textContent = copy[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var key = el.getAttribute('data-i18n-html');
      if (copy[key]) el.innerHTML = copy[key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el){
      var key = el.getAttribute('data-i18n-aria');
      if (copy[key]) el.setAttribute('aria-label', copy[key]);
    });
    syncLangToggle(lang);
    var meta = META_COPY[lang];
    document.title = meta.title;
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[name="keywords"]', meta.keywords);
    setMeta('meta[property="og:title"]', meta.socialTitle);
    setMeta('meta[property="og:description"]', meta.socialDescription);
    setMeta('meta[property="og:image:alt"]', meta.imageAlt);
    setMeta('meta[property="og:locale"]', meta.locale);
    setMeta('meta[name="twitter:title"]', meta.socialTitle);
    setMeta('meta[name="twitter:description"]', meta.socialDescription);
    setMeta('meta[name="twitter:image:alt"]', meta.imageAlt);
    if (typeof SERVICE_COPY !== 'undefined') SERVICES = SERVICE_COPY[lang] || SERVICE_COPY.pt;
    if (typeof drawWhyMark === 'function' && whySec && whyCanvas && whyBox) drawWhyMark();
  }
  /* Lock each translatable element (nav + hero CTAs) to the widest of PT/EN,
     so switching language never reflows the layout — nothing in the nav moves. */
  function lockI18nWidths(){
    var targets = [];
    var nav = document.querySelector('.nav-inner');
    if (nav) targets = targets.concat([].slice.call(nav.querySelectorAll('[data-i18n],[data-i18n-html]')));
    var ctas = document.querySelector('.hero-ctas');
    if (ctas) targets = targets.concat([].slice.call(ctas.querySelectorAll('[data-i18n],[data-i18n-html]')));
    targets.forEach(function(el){
      if (!el.offsetParent && el.offsetWidth === 0) return; /* hidden (e.g. nav links on mobile): keep prior value */
      var isHtml = el.hasAttribute('data-i18n-html');
      var key = el.getAttribute(isHtml ? 'data-i18n-html' : 'data-i18n');
      var ptv = I18N.pt[key], env = I18N.en[key];
      if (ptv == null || env == null) return;
      var saved = isHtml ? el.innerHTML : el.textContent;
      el.style.minWidth = '';
      function setVal(v){ if (isHtml) el.innerHTML = v; else el.textContent = v; }
      setVal(ptv); var wpt = el.getBoundingClientRect().width;
      setVal(env); var wen = el.getBoundingClientRect().width;
      setVal(saved);
      var max = Math.max(wpt, wen);
      if (max <= 0) return;
      var cs = getComputedStyle(el);
      if (cs.display === 'inline') el.style.display = 'inline-block';
      if (cs.display.indexOf('flex') !== -1) el.style.justifyContent = 'center';
      el.style.textAlign = 'center';
      el.style.minWidth = Math.ceil(max) + 'px';
    });
  }

  var savedLang = null;
  try { savedLang = localStorage.getItem('vouga-lang'); } catch(e){}
  applyLanguage(savedLang === 'en' ? 'en' : 'pt');
  lockI18nWidths();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockI18nWidths);
  window.addEventListener('load', lockI18nWidths);
  (function(){ var rt; window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(lockI18nWidths, 150); }); })();
  if (langToggle) {
    langToggle.addEventListener('click', function(){
      var next = currentLang === 'pt' ? 'en' : 'pt';
      applyLanguage(next);
      try { localStorage.setItem('vouga-lang', next); } catch(e){}
    });
  }

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== scroll progress ===== */
  var progress = document.getElementById('progress');
  var ticking = false;
  window.addEventListener('scroll', function(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      ticking = false;
    });
  }, { passive: true });

  /* ===== reveal on viewport entry ===== */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  /* ===== proof stats: count-up when they scroll into view ===== */
  (function(){
    var nums = document.querySelectorAll('#proof .num[data-count]');
    if (!nums.length) return;
    function fmt(el, v){
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var neg = parseFloat(el.getAttribute('data-count')) < 0;
      return (neg ? '−' : '') + Math.abs(v).toFixed(dec) + suffix;
    }
    function run(el){
      var target = Math.abs(parseFloat(el.getAttribute('data-count')));
      if (isNaN(target)) return;
      if (reducedMotion){ el.textContent = fmt(el, target); return; }
      var dur = 1100, start = null;
      function tick(ts){
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(el, target * e);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    if (!('IntersectionObserver' in window)){ nums.forEach(run); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting){ run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    nums.forEach(function(n){ io.observe(n); });
  })();

  /* ===== services: one card at a time, auto-cycling ===== */
  (function(){
    var stage = document.getElementById('svcStage');
    if (!stage) return;
    var cardsEl = stage.querySelector('.svc-cards');
    var cards = [].slice.call(stage.querySelectorAll('.svc-card'));
    var dots = [].slice.call(stage.querySelectorAll('.svc-dot'));
    if (cards.length < 2 || reducedMotion) return; /* fallback: all cards visible */

    stage.classList.add('is-enhanced');
    var DWELL = 4200, idx = 0, paused = false, inView = false, last = 0, elapsed = 0;

    function sizeStage(){
      cardsEl.style.minHeight = '';
      var max = 0;
      cards.forEach(function(c){ if (c.offsetHeight > max) max = c.offsetHeight; });
      cardsEl.style.minHeight = max + 'px';
    }
    function render(){
      cards.forEach(function(c, k){
        var on = k === idx;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-hidden', on ? 'false' : 'true');
        c.tabIndex = on ? 0 : -1;
      });
      dots.forEach(function(d, k){
        d.classList.toggle('is-active', k === idx);
        var bar = d.querySelector('.svc-bar');
        if (bar && k !== idx) bar.style.width = '0%';
      });
    }
    function frame(ts){
      if (last === 0) last = ts;
      var dt = ts - last; last = ts;
      if (inView && !paused){
        elapsed += dt;
        if (elapsed >= DWELL){ elapsed = 0; idx = (idx + 1) % cards.length; render(); }
      }
      var bar = dots[idx] && dots[idx].querySelector('.svc-bar');
      if (bar) bar.style.width = (Math.min(elapsed / DWELL, 1) * 100) + '%';
      requestAnimationFrame(frame);
    }
    function goTo(i){ idx = i; elapsed = 0; render(); }

    dots.forEach(function(d, k){ d.addEventListener('click', function(){ goTo(k); }); });
    stage.addEventListener('mouseenter', function(){ paused = true; });
    stage.addEventListener('mouseleave', function(){ paused = false; });
    stage.addEventListener('focusin', function(){ paused = true; });
    stage.addEventListener('focusout', function(){ paused = false; });

    render();
    sizeStage();
    window.addEventListener('resize', sizeStage);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeStage);
    var lt = document.getElementById('langToggle');
    if (lt) lt.addEventListener('click', function(){ setTimeout(sizeStage, 80); });

    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        es.forEach(function(e){ inView = e.isIntersecting; });
      }, { threshold: 0.25 }).observe(stage);
    } else { inView = true; }
    requestAnimationFrame(frame);
  })();

  /* ===== pillars orbit: play-once scroll choreography (intro -> three -> pillar cards) ===== */
  (function(){
    var section = document.getElementById('pillars');
    if (!section) return;
    var scroller = section.querySelector('.pillars-scroll');
    var orbit = document.getElementById('orbit');
    var svg = document.getElementById('orbitSvg');
    var path = document.getElementById('orbitPath');
    var pulls = svg ? [].slice.call(svg.querySelectorAll('.orbit-pull')) : [];
    var kicker = section.querySelector('.pillars-kicker');
    var nodes = orbit ? [].slice.call(orbit.querySelectorAll('.orbit-node')) : [];
    var blobs = orbit ? [].slice.call(orbit.querySelectorAll('.orbit-blob')) : [];
    if (nodes.length < 3) return;

    var ANG = [180, 60, 300];           /* ellipse angles (deg): intelligence, foundations, academy */
    var enabled = false, running = false, done = false;
    var dispP = 0, targetP = 0, W = 0, Hh = 0;

    function size(){ W = orbit.clientWidth; Hh = orbit.clientHeight; if (svg) svg.setAttribute('viewBox', '0 0 ' + W + ' ' + Hh); }
    function geom(){ return { cx: W * 0.5, cy: Hh * 0.5, rx: W * 0.34, ry: Hh * 0.40 }; }
    function lerp(a, b, t){ return a + (b - a) * t; }
    function seg(p, a, b){ return Math.min(Math.max((p - a) / (b - a), 0), 1); }
    function easeIO(t){ return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function smoothstep(t){ return t * t * (3 - 2 * t); }
    function angleDiff(a, b){ return Math.abs(((a - b + 540) % 360) - 180); }
    /* continuous rotation: no holds, just a slow heavy glide through the three pillars */
    function rot(p){
      if (p < 0.06) return 0;
      if (p < 0.88) return lerp(0, 240, easeIO(seg(p, 0.06, 0.88)));
      return 240;
    }
    function ellipseD(g, bulge, angs){
      var N = 64, d = '';
      for (var i = 0; i <= N; i++){
        var a = i / N * Math.PI * 2, deg = a * 180 / Math.PI, b = 0;
        for (var k = 0; k < angs.length; k++){
          var diff = ((deg - angs[k] + 540) % 360) - 180;
          b += Math.exp(-(diff * diff) / (2 * 15 * 15)); /* gaussian pull near each title, follows rotation */
        }
        var rr = 1 + bulge * b * 0.13;
        var x = g.cx + g.rx * rr * Math.cos(a);
        var y = g.cy + g.ry * rr * Math.sin(a);
        d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
      }
      return d + 'Z';
    }
    function ellipseArcD(g, bulge, centerDeg){
      var span = 34, N = 12, d = '';
      for (var i = 0; i <= N; i++){
        var deg = centerDeg - span / 2 + span * (i / N);
        var a = deg * Math.PI / 180, b = 0;
        var diff = ((deg - centerDeg + 540) % 360) - 180;
        b += Math.exp(-(diff * diff) / (2 * 15 * 15));
        var rr = 1 + bulge * b * 0.13;
        var x = g.cx + g.rx * rr * Math.cos(a);
        var y = g.cy + g.ry * rr * Math.sin(a);
        d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
      }
      return d;
    }
    function setNode(i, x, y, scale, opacity, blur){
      var n = nodes[i];
      n.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + scale.toFixed(3) + ')';
      n.style.opacity = opacity.toFixed(3);
      n.style.filter = blur > 0.15 ? 'blur(' + blur.toFixed(1) + 'px)' : 'none';
    }

    function render(p){
      var g = geom();
      var appear = easeIO(seg(p, 0.04, 0.20));   /* orbit + extra pillars fade in on first scroll */
      var R = rot(p);

      if (kicker) kicker.style.opacity = '1';

      var angs = [ANG[0] + R, ANG[1] + R, ANG[2] + R];
      if (svg){
        svg.style.opacity = appear.toFixed(3);
        path.setAttribute('d', ellipseD(g, 1, angs));
        for (var q = 0; q < pulls.length; q++){
          pulls[q].setAttribute('d', ellipseArcD(g, 1, angs[q]));
          pulls[q].style.opacity = (appear * 0.55).toFixed(3);
        }
      }

      for (var i = 0; i < 3; i++){
        var a = angs[i] * Math.PI / 180;
        var x = g.cx + g.rx * Math.cos(a), y = g.cy + g.ry * Math.sin(a);
        var focus = smoothstep(Math.max(0, 1 - angleDiff(angs[i], 180) / 105));
        var activeOrbit = focus > 0.52;
        var sc = lerp(0.62, 1, focus);
        var opOrbit = lerp(0.42 * appear, 1, focus);
        var blur = i === 0 ? 0 : (1 - appear) * 12;
        setNode(i, x, y, sc, opOrbit, blur);
        nodes[i].classList.toggle('is-active', activeOrbit);
        nodes[i].style.setProperty('--desc-open', focus.toFixed(3));
        var bl = blobs[i];
        if (bl){
          bl.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%)';
          bl.style.opacity = (appear * lerp(0.035, 0.11, focus)).toFixed(3);
        }
      }
    }

    function rawP(){
      var total = scroller.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(Math.max(-scroller.getBoundingClientRect().top / total, 0), 1);
    }
    function loop(){
      if (!enabled){ running = false; return; }
      targetP = Math.max(targetP, rawP());      /* forward only: never replays on scroll up */
      dispP += (targetP - dispP) * 0.055;        /* slower, heavier easing */
      var settled = Math.abs(targetP - dispP) < 0.0006;
      if (settled) dispP = targetP;
      render(dispP);
      if (dispP >= 0.88){ finalizeCards(); return; }
      if (settled){ running = false; return; }   /* idle until next scroll */
      requestAnimationFrame(loop);
    }
    function kick(){ if (enabled && !running){ running = true; requestAnimationFrame(loop); } }
    function finalizeCards(){
      enabled = false; running = false; done = true;
      dispP = 1; targetP = 1;
      section.classList.remove('is-orbit');
      section.classList.add('is-cards', 'is-blur-in');
      window.removeEventListener('scroll', kick);
      nodes.forEach(function(n){
        n.classList.remove('is-active');
        n.style.removeProperty('--desc-open');
        n.style.transform = '';
        n.style.opacity = '';
        n.style.filter = '';
      });
      blobs.forEach(function(b){ b.style.opacity = '0'; });
      if (svg) svg.style.opacity = '0';
      pulls.forEach(function(p){ p.style.opacity = '0'; });
      if (kicker) kicker.style.opacity = '';
      keepCardsInView();
      window.setTimeout(function(){ section.classList.remove('is-blur-in'); }, 1400);
    }
    function keepCardsInView(){
      var previousBehavior = document.documentElement.style.scrollBehavior;
      var targetTop = section.getBoundingClientRect().top + window.scrollY - 82;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'auto' });
      requestAnimationFrame(function(){
        targetTop = section.getBoundingClientRect().top + window.scrollY - 82;
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'auto' });
        document.documentElement.style.scrollBehavior = previousBehavior;
      });
    }

    function enable(){
      if (enabled || done) return;
      enabled = true;
      section.classList.add('is-orbit');
      size(); render(dispP);
      window.addEventListener('scroll', kick, { passive: true });
    }
    function disable(){
      if (!enabled) return;
      enabled = false; running = false;
      section.classList.remove('is-orbit', 'is-cards', 'is-blur-in');
      window.removeEventListener('scroll', kick);
      nodes.forEach(function(n){ n.style.removeProperty('--desc-open'); n.style.transform = ''; n.style.opacity = ''; n.style.filter = ''; });
      blobs.forEach(function(b){ b.style.opacity = '0'; });
      if (kicker) kicker.style.opacity = '';
    }
    function evaluate(){
      if (!reducedMotion && window.innerWidth > 820) enable();
      else disable();
    }
    evaluate();
    window.addEventListener('resize', function(){ if (enabled){ size(); kick(); } evaluate(); });
  })();

  /* ===== pillar ASCII art: masked source images, gently mutating ===== */
  (function(){
    var targets = [].slice.call(document.querySelectorAll('[data-pillar-ascii]'));
    if (!targets.length) return;

    var charset = ' .,:;irsXA253hMHGS#9B&@';
    var mutators = '%#$@&+=*';
    var studies = targets.map(function(target){
      return {
        el: target,
        img: new Image(),
        src: target.getAttribute('data-src'),
        mask: target.getAttribute('data-mask') || 'light',
        cols: parseInt(target.getAttribute('data-cols'), 10) || 42,
        trimBottom: parseFloat(target.getAttribute('data-trim-bottom')) || 0,
        cells: [],
        live: []
      };
    });

    function luminance(r,g,b){ return 0.2126*r + 0.7152*g + 0.0722*b; }
    function isLightBackground(r,g,b, cutoff, satCutoff){
      var lum = luminance(r,g,b);
      var max = Math.max(r,g,b), min = Math.min(r,g,b);
      var sat = max ? (max - min) / max : 0;
      return lum > cutoff && sat < satCutoff;
    }
    function isHandBackground(r,g,b){
      var lum = luminance(r,g,b);
      var max = Math.max(r,g,b), min = Math.min(r,g,b);
      var sat = max ? (max - min) / max : 0;
      var beigeLean = r >= b && g >= b && Math.abs(r - g) < 46;
      var paper = lum > 118 && sat < .34 && beigeLean;
      var palePaper = lum > 170 && sat < .44 && beigeLean;
      return paper || palePaper;
    }
    function isMasked(study, r,g,b,a,x,y,w,h){
      if (study.mask === 'paper') return isLightBackground(r,g,b, 205, .24);
      if (study.mask === 'alpha') return a < 24;
      if (study.mask === 'hand') {
        var nx = x / w, ny = y / h;
        if (nx < .25 && ny > .64) return true;
        return isHandBackground(r,g,b);
      }
      return isLightBackground(r,g,b, 225, .18);
    }
    function asciiCellAspect(el){
      var cs = getComputedStyle(el);
      var fontSize = parseFloat(cs.fontSize) || 4;
      var lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.1;
      var letterSpacing = parseFloat(cs.letterSpacing) || 0;
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      ctx.font = cs.font;
      return (ctx.measureText('M').width + letterSpacing) / lineHeight;
    }
    function render(study){
      study.el.textContent = study.cells.map(function(row){ return row.join(''); }).join('\n');
    }
    function build(study){
      var cols = study.cols;
      var ratio = study.img.naturalHeight / study.img.naturalWidth;
      var rows = Math.max(1, Math.round(cols * ratio * asciiCellAspect(study.el)));
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d', { willReadFrequently:true });
      canvas.width = cols;
      canvas.height = rows;
      ctx.drawImage(study.img, 0, 0, cols, rows);
      var data = ctx.getImageData(0, 0, cols, rows).data;
      var visibleRows = Math.max(1, Math.round(rows * (1 - study.trimBottom)));
      study.cells = [];
      study.live = [];
      for (var y = 0; y < visibleRows; y++){
        var row = [];
        for (var x = 0; x < cols; x++){
          var i = (y * cols + x) * 4;
          var r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          if (isMasked(study, r,g,b,a,x,y,cols,rows)){
            row.push(' ');
            continue;
          }
          var contrast = study.mask === 'alpha' ? Math.max(a / 255, 1 - luminance(r,g,b) / 255) : Math.max(0, 245 - luminance(r,g,b)) / 245;
          var shade = Math.max(0, Math.min(charset.length - 1, Math.round(contrast * (charset.length - 1))));
          row.push(charset[shade]);
          study.live.push([y,x,shade]);
        }
        study.cells.push(row);
      }
      render(study);
    }
    function tick(study){
      if (document.hidden || !study.live.length) return;
      var n = Math.max(5, Math.floor(study.live.length * .03));
      for (var i = 0; i < n; i++){
        var cell = study.live[Math.floor(Math.random() * study.live.length)];
        var jitter = Math.floor(Math.random() * 5) - 2;
        var shade = Math.max(0, Math.min(charset.length - 1, cell[2] + jitter));
        study.cells[cell[0]][cell[1]] = Math.random() < .15 ? mutators[Math.floor(Math.random() * mutators.length)] : charset[shade];
      }
      render(study);
    }
    studies.forEach(function(study){
      study.img.onload = function(){ build(study); };
      study.img.src = study.src;
    });
    if (!reducedMotion) {
      window.setInterval(function(){ studies.forEach(tick); }, 140);
    }
  })();

  /* ===== hero canvas: video halftone, with drifting-dots fallback ===== */
  var canvas = document.getElementById('heroCanvas');
  var video = document.getElementById('heroVideo');
  if (canvas && video) {
  var ctx = canvas.getContext('2d');
  var mode = 'drift'; // 'video' once a frame can be read safely
  var dots = [];
  var colFaint = '#9d998c', colDim = '#615e54', colAccent = '#c97800';
  function refreshCanvasColors(){
    var cs = getComputedStyle(root);
    colFaint = cs.getPropertyValue('--text-faint').trim() || colFaint;
    colDim = cs.getPropertyValue('--text-dim').trim() || colDim;
    colAccent = cs.getPropertyValue('--accent').trim() || colAccent;
  }
  function sizeCanvas(){
    var r = canvas.parentElement.getBoundingClientRect();
    canvas.width = r.width;
    canvas.height = r.height;
    if (!dots.length) seed();
  }
  function seed(){
    dots = [];
    var n = Math.min(72, Math.floor(canvas.width / 16));
    for (var i = 0; i < n; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.8 + Math.random() * 1.4,
        v: 0.12 + Math.random() * 0.3,
        ph: Math.random() * Math.PI * 2,
        amp: 6 + Math.random() * 14,
        accent: Math.random() < 0.06
      });
    }
  }
  function driftFrame(t, dt){
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.v * (dt / 16.7);
      if (d.x > canvas.width + 8) { d.x = -8; d.y = Math.random() * canvas.height; }
      var y = d.y + Math.sin(t / 2400 + d.ph) * d.amp;
      ctx.beginPath();
      ctx.arc(d.x, y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.accent ? colAccent : colFaint;
      ctx.globalAlpha = d.accent ? 0.55 : 0.4;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* video sampling */
  var off = document.createElement('canvas');
  var offCtx = off.getContext('2d', { willReadFrequently: true });
  var CELL = 12;           // px per dot cell on screen
  var THRESH = 0.42;       // intensity needed before a dot appears
  function videoFrame(){
    var cols = Math.max(8, Math.min(170, Math.round(canvas.width / CELL)));
    var rows = Math.max(8, Math.round(canvas.height / CELL));
    if (off.width !== cols || off.height !== rows) { off.width = cols; off.height = rows; }
    /* cover-fit crop of the video into the grid */
    var va = video.videoWidth / video.videoHeight;
    var ca = canvas.width / canvas.height;
    var sw = video.videoWidth, sh = video.videoHeight, sx = 0, sy = 0;
    if (va > ca) { sw = video.videoHeight * ca; sx = (video.videoWidth - sw) / 2; }
    else { sh = video.videoWidth / ca; sy = (video.videoHeight - sh) / 2; }
    offCtx.drawImage(video, sx, sy, sw, sh, 0, 0, cols, rows);
    var data = offCtx.getImageData(0, 0, cols, rows).data;
    var dark = root.getAttribute('data-theme') === 'dark';
    var cw = canvas.width / cols, ch = canvas.height / rows;
    ctx.fillStyle = colDim;
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var p = (j * cols + i) * 4;
        var lum = (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
        /* bright source areas produce dots; this inverts the former light-theme mapping */
        var intensity = lum;
        if (intensity <= THRESH) continue;
        var a = (intensity - THRESH) / (1 - THRESH);
        var r = cw * 0.42 * (0.35 + 0.65 * a);
        ctx.globalAlpha = 0.22 + 0.5 * a;
        var isAccent = ((i * 7 + j * 13) % 97) === 0;
        if (isAccent) ctx.fillStyle = colAccent;
        ctx.beginPath();
        ctx.arc(i * cw + cw / 2, j * ch + ch / 2, r, 0, Math.PI * 2);
        ctx.fill();
        if (isAccent) ctx.fillStyle = colDim;
      }
    }
    ctx.globalAlpha = 1;
  }

  var t0 = 0, lastDraw = 0;
  function frame(t){
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var dt = t - t0; t0 = t;
    if (mode === 'video') {
      if (t - lastDraw < 33 || video.readyState < 2) return; // ~30 fps
      lastDraw = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      try { videoFrame(); }
      catch(e) { mode = 'drift'; } // tainted canvas (file://) or decode issue
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      driftFrame(t, dt);
    }
  }

  function tryEnableVideo(){
    if (!video.videoWidth) return;
    try {
      off.width = 4; off.height = 4;
      offCtx.drawImage(video, 0, 0, 4, 4);
      offCtx.getImageData(0, 0, 1, 1); // throws if pixel access is blocked
      mode = 'video';
    } catch(e) { mode = 'drift'; }
  }

  if (!reducedMotion) {
    refreshCanvasColors();
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    video.addEventListener('loadeddata', tryEnableVideo);
    video.addEventListener('error', function(){ mode = 'drift'; });
    if (video.readyState >= 2) tryEnableVideo();
    var playP = video.play();
    if (playP && playP.catch) playP.catch(function(){});
    /* pause the video when the hero leaves the viewport */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (mode !== 'video') return;
          if (en.isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function(){}); }
          else video.pause();
        });
      }, { threshold: 0 }).observe(canvas.parentElement);
    }
    requestAnimationFrame(function(t){ t0 = t; requestAnimationFrame(frame); });
  }
  }

  /* ============================================================
     Why mark: dotted frame around "Vouga", dots fading out and
     spreading apart as they travel away from the word
  ============================================================ */
  var whySec = document.querySelector('.why');
  var whyCanvas = document.getElementById('whyCanvas');
  var whyBox = document.getElementById('whyBox');
  var wCtx = whyCanvas.getContext('2d');

  function offsetWithin(el, anc){
    var x = 0, y = 0;
    while (el && el !== anc) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return [x, y];
  }

  function drawWhyMark(){
    var W = whySec.clientWidth, H = whySec.clientHeight;
    whyCanvas.width = W; whyCanvas.height = H;
    var col = getComputedStyle(root).getPropertyValue('--text').trim() || '#1a1813';
    var o = offsetWithin(whyBox, whySec);
    var bx = o[0], by = o[1], bw = whyBox.offsetWidth, bh = whyBox.offsetHeight;
    var cx = bx + bw / 2, cy = by + bh / 2;
    var rgb = (function(h){
      h = h.replace('#','');
      if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
      var n = parseInt(h, 16);
      return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
    })(col);
    var A = 0.22; /* line strength */

    /* hairline across the page, fading out towards its ends */
    function lineH(y){
      var g = wCtx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, 'rgba(' + rgb + ',0)');
      g.addColorStop(0.14, 'rgba(' + rgb + ',' + A + ')');
      g.addColorStop(0.86, 'rgba(' + rgb + ',' + A + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      wCtx.fillStyle = g;
      wCtx.fillRect(0, y, W, 0.6);
    }
    /* verticals are born at the top pair: they never rise above it */
    function lineV(x){
      var g = wCtx.createLinearGradient(0, by, 0, H);
      g.addColorStop(0, 'rgba(' + rgb + ',' + A + ')');
      g.addColorStop(0.82, 'rgba(' + rgb + ',' + A + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      wCtx.fillStyle = g;
      wCtx.fillRect(x, by, 0.6, H - by);
    }
    lineH(by); lineH(by + 3);
    lineH(by + bh - 3); lineH(by + bh);
    lineV(bx); lineV(bx + 3);
    lineV(bx + bw - 3); lineV(bx + bw);
  }

  drawWhyMark();
  window.addEventListener('resize', drawWhyMark);
  window.addEventListener('load', drawWhyMark);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawWhyMark);

  /* ============================================================
     Service detail pages (overlay)
  ============================================================ */
  var SERVICES = [
    {
      num: '01', name: 'AI Workflow Audit',
      tagline: 'Before building anything, we find out where your company actually loses time and money.',
      problem: 'Most companies cannot say where their hours go. Work moves through email threads, spreadsheets, meetings and one person who knows how things are done. AI bought on top of that automates the mess instead of fixing it.',
      evidence: [
        ['~60%', 'of knowledge work time goes to coordination, not to the work itself'],
        ['11 h', 'per person per week lost to repetitive handling of information'],
        ['7 in 10', 'AI pilots never make it into daily operations']
      ],
      deploy: [
        'Two weeks inside your operation: we sit with the teams and map how work really moves.',
        'Every workflow scored by cost, frequency and automation potential.',
        'A ranked plan of build-ready use cases, each with estimated hours and euros recovered.'
      ],
      kpis: [
        ['3–5', 'build-ready use cases identified per audit'],
        ['€140k', 'average annual savings identified'],
        ['9 days', 'to the first validated quick win']
      ]
    },
    {
      num: '02', name: 'AI Knowledge System',
      tagline: 'Company knowledge stops living in inboxes and heads, and starts answering questions with sources.',
      problem: 'Policies, prices, processes and past decisions are scattered across drives, email and three people who are always busy. Every answer costs an interruption. When someone leaves, their knowledge leaves with them.',
      evidence: [
        ['19%', 'of the working week is spent searching for internal information'],
        ['47%', 'of internal questions depend on one specific person to be answered'],
        ['3–6 mo', 'for a new hire to find information independently']
      ],
      deploy: [
        'We connect your documents, wikis, email and tools into one indexed knowledge layer.',
        'Every answer cites its sources, so people can verify instead of trusting blindly.',
        'Access follows your existing permissions: people only see what they should.'
      ],
      kpis: [
        ['−83%', 'time to answer internal questions'],
        ['96%', 'of answers delivered with verifiable sources'],
        ['−40%', 'onboarding ramp-up time for new hires']
      ]
    },
    {
      num: '03', name: 'AI Sales Copilot',
      tagline: 'Your commercial team sells. The copilot does the preparing, writing and chasing.',
      problem: 'Sellers spend most of their week not selling: researching accounts, rebuilding proposals from old files, writing follow-ups that arrive late or never. Deals do not die from rejection; they die from delay.',
      evidence: [
        ['~65%', "of a seller's time goes to tasks that are not selling"],
        ['2–4 days', 'to assemble a typical B2B proposal'],
        ['44%', 'of leads never receive a follow-up at all']
      ],
      deploy: [
        'Account briefs prepared before every meeting, from your CRM and public signals.',
        'First drafts of proposals built from your own past wins and price book.',
        'Follow-ups drafted and queued the moment a meeting ends.'
      ],
      kpis: [
        ['3.4×', 'faster from meeting to proposal sent'],
        ['+28%', 'follow-up rate on open opportunities'],
        ['+11%', 'win rate on proposals assisted by the copilot']
      ]
    },
    {
      num: '04', name: 'Meeting → Execution Agent',
      tagline: 'Every meeting ends with decisions, owners, deadlines and a follow-up already drafted.',
      problem: 'Meetings produce decisions, and then nothing holds them. Notes stay in notebooks, tasks have no owner by Friday, and the next meeting starts by re-discussing the last one.',
      evidence: [
        ['31 h', 'per person per month spent in meetings'],
        ['~50%', 'of decisions lose their owner within a week'],
        ['1 in 4', 'meetings exists to re-decide something already decided']
      ],
      deploy: [
        'Notes or recordings in; decisions, owners and deadlines out, structured.',
        'Tasks pushed to the tools your team already uses.',
        'Follow-up email drafted and ready before people leave the room.'
      ],
      kpis: [
        ['100%', 'of meetings leave with owners and deadlines assigned'],
        ['−92%', 'time spent writing minutes and follow-ups'],
        ['+37%', 'tasks completed by their original deadline']
      ]
    },
    {
      num: '05', name: 'AI Governance Audit',
      tagline: 'AI is already inside your company. We make sure it is there on your terms.',
      problem: 'Employees are pasting client data into public chatbots, buying tools on personal cards and shipping AI-written work with no review. The risk is real, and so is the regulation arriving with the EU AI Act.',
      evidence: [
        ['78%', 'of employees use AI tools their company never approved'],
        ['38%', 'admit having shared sensitive data with public AI tools'],
        ['€35M', 'or 7% of turnover: the ceiling of EU AI Act fines']
      ],
      deploy: [
        'Full inventory of AI already in use: tools, teams, data flows.',
        'Risk map ranked by exposure, with the critical gaps flagged first.',
        'A usage policy people actually follow, plus controls and training to hold it.'
      ],
      kpis: [
        ['100%', 'of AI usage inventoried and classified'],
        ['3 weeks', 'from audit start to adopted policy'],
        ['0', 'data incidents at clients since rollout']
      ]
    },
    {
      num: '06', name: 'AI Enablement',
      tagline: 'Teams trained on their own work, until using AI well is just how work is done.',
      problem: 'Generic AI training does not survive contact with a real Tuesday. People attend a workshop, nod, and go back to old habits, while the licences the company bought sit unused.',
      evidence: [
        ['12%', 'of generic training content is ever applied to daily work'],
        ['<30%', 'of paid AI licences see weekly use in most companies'],
        ['2×', 'productivity gap between trained and untrained users of the same tools']
      ],
      deploy: [
        'Sessions built on your real cases: your documents, your clients, your tools.',
        'Playbooks per role, not per buzzword.',
        'Office hours and follow-up until the habits hold.'
      ],
      kpis: [
        ['87%', 'weekly active usage 60 days after training'],
        ['5.2 h', 'saved per person per week, self-reported'],
        ['9.1', 'average training NPS across cohorts']
      ]
    }
  ];
  var SERVICE_COPY = {
    en: SERVICES,
    pt: [
      {
        num: '01', name: 'Auditoria de Workflow com IA',
        tagline: 'Antes de construir qualquer coisa, descobrimos onde a empresa perde tempo e dinheiro.',
        problem: 'A maioria das empresas não consegue dizer para onde vão as horas. O trabalho move-se entre emails, folhas de cálculo, reuniões e uma pessoa que sabe como tudo se faz. Comprar IA por cima disso automatiza a confusão em vez de a corrigir.',
        evidence: [
          ['~60%', 'do tempo em trabalho de conhecimento vai para coordenação, não para o trabalho em si'],
          ['11 h', 'por pessoa/semana perdidas em tratamento repetitivo de informação'],
          ['7 em 10', 'pilotos de IA nunca entram nas operações diárias']
        ],
        deploy: [
          'Duas semanas dentro da operação: sentamo-nos com as equipas e mapeamos como o trabalho se move na realidade.',
          'Cada workflow é classificado por custo, frequência e potencial de automação.',
          'Um plano priorizado de casos prontos a construir, cada um com horas e euros estimados a recuperar.'
        ],
        kpis: [
          ['3–5', 'casos prontos a construir identificados por auditoria'],
          ['€140k', 'poupança anual média identificada'],
          ['9 dias', 'até ao primeiro quick win validado']
        ]
      },
      {
        num: '02', name: 'Sistema de Conhecimento com IA',
        tagline: 'O conhecimento da empresa deixa de viver em inboxes e cabeças, e começa a responder com fontes.',
        problem: 'Políticas, preços, processos e decisões passadas estão espalhados por drives, emails e três pessoas sempre ocupadas. Cada resposta custa uma interrupção. Quando alguém sai, o conhecimento sai com essa pessoa.',
        evidence: [
          ['19%', 'da semana de trabalho é passada à procura de informação interna'],
          ['47%', 'das perguntas internas dependem de uma pessoa específica para serem respondidas'],
          ['3–6 meses', 'para uma nova contratação encontrar informação com autonomia']
        ],
        deploy: [
          'Ligamos documentos, wikis, email e ferramentas numa camada de conhecimento indexada.',
          'Cada resposta cita as suas fontes, para as pessoas verificarem em vez de confiarem às cegas.',
          'O acesso segue as permissões existentes: cada pessoa só vê o que deve ver.'
        ],
        kpis: [
          ['−83%', 'tempo para responder a perguntas internas'],
          ['96%', 'das respostas entregues com fontes verificáveis'],
          ['−40%', 'tempo de ramp-up no onboarding de novas contratações']
        ]
      },
      {
        num: '03', name: 'Copiloto Comercial com IA',
        tagline: 'A equipa comercial vende. O copiloto prepara, escreve e faz o follow-up.',
        problem: 'Vendedores passam grande parte da semana sem vender: pesquisam contas, remontam propostas a partir de ficheiros antigos e escrevem follow-ups que chegam tarde ou nunca chegam. Negócios não morrem só por rejeição; morrem por atraso.',
        evidence: [
          ['~65%', 'do tempo de um vendedor vai para tarefas que não são vender'],
          ['2–4 dias', 'para montar uma proposta B2B típica'],
          ['44%', 'dos leads nunca recebem qualquer follow-up']
        ],
        deploy: [
          'Briefings de conta preparados antes de cada reunião, a partir do CRM e de sinais públicos.',
          'Primeiros drafts de propostas criados com base em vitórias passadas e price book da empresa.',
          'Follow-ups preparados e em fila assim que a reunião acaba.'
        ],
        kpis: [
          ['3.4×', 'mais rápido da reunião à proposta enviada'],
          ['+28%', 'taxa de follow-up em oportunidades abertas'],
          ['+11%', 'win rate em propostas assistidas pelo copiloto']
        ]
      },
      {
        num: '04', name: 'Agente Reunião → Execução',
        tagline: 'Cada reunião termina com decisões, responsáveis, prazos e um follow-up já preparado.',
        problem: 'Reuniões produzem decisões e depois nada as segura. Notas ficam em cadernos, tarefas chegam a sexta-feira sem responsável e a reunião seguinte começa por rediscutir a anterior.',
        evidence: [
          ['31 h', 'por pessoa/mês passadas em reuniões'],
          ['~50%', 'das decisões perdem o responsável numa semana'],
          ['1 em 4', 'reuniões existe para voltar a decidir algo já decidido']
        ],
        deploy: [
          'Notas ou gravações entram; decisões, responsáveis e prazos saem estruturados.',
          'Tarefas são enviadas para as ferramentas que a equipa já usa.',
          'Email de follow-up fica preparado antes das pessoas saírem da sala.'
        ],
        kpis: [
          ['100%', 'das reuniões saem com responsáveis e prazos atribuídos'],
          ['−92%', 'tempo gasto a escrever atas e follow-ups'],
          ['+37%', 'tarefas concluídas dentro do prazo original']
        ]
      },
      {
        num: '05', name: 'Auditoria de Governação de IA',
        tagline: 'A IA já está dentro da empresa. Garantimos que está lá nos vossos termos.',
        problem: 'Colaboradores colam dados de clientes em chatbots públicos, compram ferramentas com cartões pessoais e enviam trabalho escrito por IA sem revisão. O risco é real, tal como a regulação que chega com o EU AI Act.',
        evidence: [
          ['78%', 'dos colaboradores usam ferramentas de IA que a empresa nunca aprovou'],
          ['38%', 'admitem ter partilhado dados sensíveis com ferramentas públicas de IA'],
          ['€35M', 'ou 7% do volume de negócios: teto das coimas do EU AI Act']
        ],
        deploy: [
          'Inventário completo da IA já em uso: ferramentas, equipas e fluxos de dados.',
          'Mapa de risco classificado por exposição, com lacunas críticas sinalizadas primeiro.',
          'Uma política de uso que as pessoas realmente seguem, com controlos e treino para a sustentar.'
        ],
        kpis: [
          ['100%', 'do uso de IA inventariado e classificado'],
          ['3 semanas', 'do início da auditoria à política adotada'],
          ['0', 'incidentes de dados em clientes desde o rollout']
        ]
      },
      {
        num: '06', name: 'Capacitação em IA',
        tagline: 'Equipas treinadas no seu próprio trabalho, até usar bem IA ser apenas a forma como se trabalha.',
        problem: 'Formação genérica em IA não sobrevive a uma terça-feira real. As pessoas vão a um workshop, concordam, e voltam aos hábitos antigos enquanto as licenças compradas pela empresa ficam paradas.',
        evidence: [
          ['12%', 'do conteúdo de formação genérica é aplicado no trabalho diário'],
          ['<30%', 'das licenças pagas de IA têm uso semanal na maioria das empresas'],
          ['2×', 'diferença de produtividade entre utilizadores treinados e não treinados nas mesmas ferramentas']
        ],
        deploy: [
          'Sessões construídas sobre casos reais: os vossos documentos, clientes e ferramentas.',
          'Playbooks por função, não por buzzword.',
          'Office hours e acompanhamento até os hábitos ficarem.'
        ],
        kpis: [
          ['87%', 'uso ativo semanal 60 dias após a formação'],
          ['5.2 h', 'poupadas por pessoa/semana, auto-reportadas'],
          ['9.1', 'NPS médio de formação entre turmas']
        ]
      }
    ]
  };
  SERVICES = SERVICE_COPY[currentLang] || SERVICE_COPY.pt;
  var OVERLAY_COPY = {
    pt: {
      service: 'serviço',
      problem: 'o problema',
      figures: 'dados: investigação de mercado, intervalos típicos',
      deploy: 'o que implementamos',
      measured: 'medido nos nossos clientes',
      kpisNote: 'implementações iniciais, primeiros 90 dias',
      talk: 'Contacte-nos <span class="arrow">→</span>'
    },
    en: {
      service: 'service',
      problem: 'the problem',
      figures: 'figures: industry research, typical ranges',
      deploy: 'what we deploy',
      measured: 'measured at our clients',
      kpisNote: 'early deployments, first 90 days',
      talk: 'Contact us <span class="arrow">→</span>'
    }
  };

  var svcOverlay = document.getElementById('svcOverlay');
  var ovBody = document.getElementById('ovBody');
  var ovNum = document.getElementById('ovNum');
  var ovBack = document.getElementById('ovBack');
  var lastFocus = null;
  var inertTargets = [];
  var focusableSel = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function statBlock(items){
    var h = '<div class="ov-stats">';
    items.forEach(function(s){
      h += '<div class="ov-stat"><div class="num">' + esc(s[0]) + '</div><div class="lbl">' + esc(s[1]) + '</div></div>';
    });
    return h + '</div>';
  }

  function openService(i){
    var s = SERVICES[i];
    var oc = OVERLAY_COPY[currentLang] || OVERLAY_COPY.pt;
    lastFocus = document.activeElement;
    ovNum.textContent = oc.service + ' ' + s.num;
    var h = '';
    h += '<span class="label" style="display:block;margin-bottom:18px">' + esc(oc.service) + ' ' + s.num + '</span>';
    h += '<h1 class="ov-title" id="ovTitle" tabindex="-1">' + esc(s.name) + '</h1>';
    h += '<p class="ov-tagline">' + esc(s.tagline) + '</p>';
    h += '<div class="ov-sec"><span class="label">' + esc(oc.problem) + '</span><p class="ov-prose">' + esc(s.problem) + '</p>' + statBlock(s.evidence) + '<p class="ov-note">' + esc(oc.figures) + '</p></div>';
    h += '<div class="ov-sec"><span class="label">' + esc(oc.deploy) + '</span><ul class="ov-list">';
    s.deploy.forEach(function(d, j){
      h += '<li><span class="li-num">0' + (j + 1) + '</span><span>' + esc(d) + '</span></li>';
    });
    h += '</ul></div>';
    h += '<div class="ov-sec ov-kpis"><span class="label">' + esc(oc.measured) + '</span>' + statBlock(s.kpis) + '<p class="ov-note">' + esc(oc.kpisNote) + '</p></div>';
    h += '<div class="ov-ctas"><a class="btn btn-primary" href="#contact" data-ov-close>' + oc.talk + '</a>';
    h += '</div>';
    ovBody.innerHTML = h;
    svcOverlay.hidden = false;
    setPageInert(true);
    requestAnimationFrame(function(){ svcOverlay.classList.add('open'); });
    document.body.style.overflow = 'hidden';
    svcOverlay.scrollTop = 0;
    ovBack.focus();
  }

  function closeService(){
    svcOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setPageInert(false);
    setTimeout(function(){ svcOverlay.hidden = true; }, 360);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function setPageInert(active){
    function disable(el){
      inertTargets.push(el);
      el.setAttribute('aria-hidden', 'true');
      if ('inert' in el) el.inert = true;
    }
    if (active) {
      inertTargets = [];
      var overlaySection = svcOverlay.closest('section');
      Array.prototype.slice.call(document.body.children).forEach(function(el){
        if (el.tagName === 'SCRIPT') return;
        if (el.tagName !== 'MAIN') {
          disable(el);
          return;
        }
        Array.prototype.slice.call(el.children).forEach(function(child){
          if (child !== overlaySection) disable(child);
        });
      });
      Array.prototype.slice.call(overlaySection.children).forEach(function(child){
        if (child !== svcOverlay) disable(child);
      });
    } else {
      inertTargets.forEach(function(el){
        el.removeAttribute('aria-hidden');
        if ('inert' in el) el.inert = false;
      });
      inertTargets = [];
    }
  }

  function trapOverlayFocus(e){
    if (e.key !== 'Tab' || svcOverlay.hidden) return;
    var focusables = Array.prototype.slice.call(svcOverlay.querySelectorAll(focusableSel)).filter(function(el){
      return el.offsetParent !== null || el === document.activeElement;
    });
    if (!focusables.length) {
      e.preventDefault();
      ovBack.focus();
      return;
    }
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.querySelectorAll('[data-svc]').forEach(function(btn){
    btn.addEventListener('click', function(){ openService(parseInt(btn.getAttribute('data-svc'), 10)); });
  });
  document.querySelectorAll('.svc-demo-flag').forEach(function(link){
    link.addEventListener('click', function(e){ e.stopPropagation(); });
  });
  ovBack.addEventListener('click', closeService);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !svcOverlay.hidden) closeService();
    trapOverlayFocus(e);
  });
  svcOverlay.addEventListener('click', function(e){
    var t = e.target.closest('[data-ov-close]');
    if (t) closeService();
  });

  /* ===== utils ===== */
  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function copyText(text, btn){
    function done(){
      var prev = btn.textContent;
      btn.textContent = 'copied ✓';
      setTimeout(function(){ btn.textContent = prev; }, 1800);
    }
    function fallback(){
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch(e){}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
  }

  /* ============================================================
     ASCII logo: the mark drawn in characters that keep mutating
  ============================================================ */
  var ASCII_GRID = [
    '000000000000000000000011111111111111',
    '000000000000000000000111111111111111',
    '000000000000000000001111111111111111',
    '111111111111111111111100000000000000',
    '111111111111111111111000000000000000',
    '111111111111111111111000000000000000',
    '000000000000000000011111111111111111',
    '000000000000000000111111111111111111',
    '000000000000000001111111111111111111',
    '111111111111111111100000000000000000',
    '111111111111111111000000000000000000',
    '111111111111111111000000000000000000',
    '000000000000000111111111111111111111',
    '000000000000000111111111111111111111',
    '000000000000001111111111111111111111',
    '111111111111111100000000000000000000',
    '111111111111111000000000000000000000',
    '111111111111110000000000000000000000'
  ];
  var SYMS = '%#$@&+=*';
  var asciiEl = document.getElementById('asciiLogo');
  var asciiCells = [];
  var asciiOn = [];
  (function initAscii(){
    for (var r = 0; r < ASCII_GRID.length; r++) {
      asciiCells.push([]);
      for (var c = 0; c < ASCII_GRID[r].length; c++) {
        if (ASCII_GRID[r][c] === '1') {
          asciiCells[r].push(SYMS[Math.floor(Math.random() * SYMS.length)]);
          asciiOn.push([r, c]);
        } else {
          asciiCells[r].push(' ');
        }
      }
    }
    renderAscii();
  })();
  function renderAscii(){
    var out = '';
    for (var r = 0; r < asciiCells.length; r++) out += asciiCells[r].join('') + (r < asciiCells.length - 1 ? '\n' : '');
    asciiEl.textContent = out;
  }
  if (!reducedMotion) {
    setInterval(function(){
      if (document.hidden) return;
      var n = Math.max(4, Math.floor(asciiOn.length * 0.05));
      for (var i = 0; i < n; i++) {
        var cell = asciiOn[Math.floor(Math.random() * asciiOn.length)];
        asciiCells[cell[0]][cell[1]] = SYMS[Math.floor(Math.random() * SYMS.length)];
      }
      renderAscii();
    }, 140);
  }

  /* ===== contact form (mailto) ===== */
  var MAIL_COPY = {
    pt: {
      subject: 'Pedido pelo website',
      name: 'Nome',
      email: 'Email',
      company: 'Empresa',
      privacy: 'Confirmação de privacidade: a pessoa aceitou que a Vouga use estes dados para responder a este pedido.'
    },
    en: {
      subject: 'Website enquiry',
      name: 'Name',
      email: 'Email',
      company: 'Company',
      privacy: 'Privacy acknowledgement: the sender agreed that Vouga may use these details to reply to this enquiry.'
    }
  };
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    var mail = MAIL_COPY[currentLang] || MAIL_COPY.pt;
    var name = document.getElementById('cfName').value.trim();
    var email = document.getElementById('cfEmail').value.trim();
    var company = document.getElementById('cfCompany').value.trim();
    var msg = document.getElementById('cfMsg').value.trim();
    var subject = mail.subject + (company ? ' · ' + company : '');
    var body = msg + '\n\n' +
      mail.name + ': ' + name + '\n' +
      mail.email + ': ' + email + '\n' +
      (company ? mail.company + ': ' + company + '\n' : '') +
      '\n' + mail.privacy;
    window.location.href = 'mailto:hello@vouga.agency?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
