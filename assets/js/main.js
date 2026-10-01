(function(){
  'use strict';

  (function normalizeVisibleUrl(){
    if (!window.history || !window.history.replaceState) return;
    var path = window.location.pathname || '';
    if (!/\/index\.html$/i.test(path)) return;
    var cleanPath = path.replace(/\/index\.html$/i, '/') || '/';
    window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
  })();

  /* ===== theme ===== */
  var root = document.documentElement;

  /* ===== first-load preloader: wait for hero + use case imagery ===== */
  (function initPreloader(){
    var overlay = document.getElementById('sitePreloader');
    if (!overlay || !document.body.classList.contains('home')) return;
    var wordEl = document.getElementById('sitePreloaderWord');
    var savedLang = 'pt';
    try {
      var storedLang = localStorage.getItem('vouga-lang');
      if (storedLang === 'pt' || storedLang === 'en') savedLang = storedLang;
    } catch(e){}
    var words = savedLang === 'pt'
      ? ['mapear contexto','ler o sistema','encontrar fricção','ligar decisões','preparar operação']
      : ['mapping context','reading the system','finding friction','connecting decisions','preparing operation'];
    var stopWords = false;
    function runTerminalWords(){
      if (!wordEl) return;
      var wi = 0;
      var text = '';
      var deleting = false;
      function tick(){
        if (stopWords) return;
        var target = words[wi % words.length];
        if (deleting) text = target.slice(0, Math.max(0, text.length - 2));
        else text = target.slice(0, text.length + 1);
        wordEl.textContent = text;
        var doneWriting = !deleting && text === target;
        var doneDeleting = deleting && text.length === 0;
        if (doneWriting) {
          deleting = true;
          window.setTimeout(tick, 620);
        } else if (doneDeleting) {
          deleting = false;
          wi += 1;
          window.setTimeout(tick, 90);
        } else {
          window.setTimeout(tick, deleting ? 34 : 46);
        }
      }
      wordEl.textContent = '';
      tick();
    }
    runTerminalWords();
    var criticalImages = [
      'assets/img/logoVouga.png',
      window.matchMedia('(max-width: 820px)').matches
        ? 'assets/img/HEROMOVEL.webp'
        : 'assets/img/hero1.webp'
    ];
    function loadImage(src){
      return new Promise(function(resolve){
        var img = new Image();
        function done(){ resolve(src); }
        img.onload = function(){
          if (img.decode) img.decode().then(done).catch(done);
          else done();
        };
        img.onerror = function(){
          console.warn('Vouga preloader could not load:', src);
          done();
        };
        img.src = src;
        if (img.complete && img.naturalWidth) {
          if (img.decode) img.decode().then(done).catch(done);
          else done();
        }
      });
    }
    function revealSite(){
      stopWords = true;
      overlay.classList.add('is-hidden');
      document.body.classList.remove('is-preloading');
      settleHashNavigation();
      window.setTimeout(function(){
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 760);
    }
    function settleHashNavigation(){
      var hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      var id = '';
      try { id = decodeURIComponent(hash.slice(1)); }
      catch(e){ id = hash.slice(1); }
      var target = document.getElementById(id === 'lets-talk' ? 'contact' : id);
      if (!target) return;
      var offset = window.matchMedia('(max-width: 820px)').matches ? 66 : 82;
      function scrollToTarget(){
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(top, 0), behavior: 'auto' });
      }
      window.setTimeout(function(){
        scrollToTarget();
        requestAnimationFrame(scrollToTarget);
      }, 90);
    }
    Promise.race([
      Promise.all(criticalImages.map(loadImage)),
      new Promise(function(resolve){ window.setTimeout(resolve, 4500); })
    ]).then(revealSite);
  })();

  root.setAttribute('data-theme', 'dark');
  try { localStorage.removeItem('vouga-theme'); } catch(e){}

  document.addEventListener('click', function(e){
    var link = e.target.closest ? e.target.closest('a[data-route-page]') : null;
    if (!link) return;
    var page = link.getAttribute('data-route-page');
    if (!page) return;
    e.preventDefault();
    window.location.href = page;
  });

  /* ===== mobile menu (hamburger) ===== */
  var navBurger = document.getElementById('navBurger');
  var mobileMenu = document.getElementById('mobileMenu');
  function setMenu(open){
    if (!navBurger || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('mobile-menu-open', open);
    navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
    navBurger.setAttribute('aria-label', currentLang === 'en'
      ? (open ? 'close menu' : 'open menu')
      : (open ? 'fechar menu' : 'abrir menu'));
  }
  if (navBurger && mobileMenu) {
    navBurger.addEventListener('click', function(){ setMenu(!mobileMenu.classList.contains('open')); });
    mobileMenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function(){ if (window.innerWidth > 820) setMenu(false); });
  }
  function enforceMobileNavSurface(){
    var mobile = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
      document.querySelectorAll('.nav .nav-right > .desktop-contact, .nav .nav-right > a[href^="mailto"]').forEach(function(el){
      if (mobile) {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
        el.setAttribute('tabindex', '-1');
      } else {
        el.style.display = '';
        el.removeAttribute('aria-hidden');
        el.removeAttribute('tabindex');
      }
    });
  }
  enforceMobileNavSurface();
  window.addEventListener('resize', enforceMobileNavSurface);

  /* ===== language ===== */
  var currentLang = 'pt';
  try {
    var savedLang = localStorage.getItem('vouga-lang');
    if (savedLang === 'pt' || savedLang === 'en') currentLang = savedLang;
  } catch(e){}
  var langToggle = document.getElementById('langToggle');
  var I18N = {
    pt: {
      logoHome: 'Vouga Agency, início',
      mainNav: 'navegação principal',
      navContact: 'contactar',
      navApproach: 'Abordagem',
      navIntervene: 'Modelo',
      navWork: 'Trabalho',
      talkToUs: 'Falar connosco',
      heroTitle: '<span class="hero-line"><strong class="hero-bold">Crescimento operacional</strong></span><br><span class="hero-line">através do <em>pensamento sistémico</em></span>',
      heroSub: 'Modernizamos operações industriais para desbloquear crescimento através de uma abordagem system-first à adoção de software, automação e IA.',
      heroSubMobile: 'Modernizamos operações industriais para desbloquear crescimento através de uma abordagem system-first à adoção de software, automação e IA.',
      heroApproachCta: '&gt;&nbsp; a nossa&nbsp;<strong>abordagem</strong>',
      heroModelCta: '&gt;&nbsp; <strong>o que fazemos</strong>',
      whyStoryLabel: 'Why Now',
      whyTitle: '<span class="why-title-line">O fosso da IA </span><span class="why-title-line">começa <span class="grad"><em>antes da IA.</em></span></span>',
      whyCopy: 'As empresas mais avançadas não têm apenas melhores modelos. Têm melhores dados, maior<br>integração, processos mais claros e capacidade interna para transformar tecnologia em execução.<br><br>Enquanto a IA acelera, muitas empresas continuam sobre foundations fragmentadas. Adicionar inteligência sem preparar dados, sistemas e processos não só limita o impacto, como amplifica ineficiências existentes.',
      whyCopyMobile: 'Muitas empresas continuam a operar sobre foundations fragmentadas. Sem dados, sistemas e processos preparados, adicionar IA limita o impacto e amplifica ineficiências.',
      whyGroup1Label: '01/DIGITAL FOUNDATIONS',
      whyCard1Stat: '73% vs. 98%',
      whyCard1Copy: 'Intensidade digital básica nas PME e grandes empresas.',
      whyCard1Source: 'Eurostat · 2025',
      whyCard2Stat: '41% vs. 89%',
      whyCard2Copy: 'Utilização de ERP nas pequenas e grandes empresas.',
      whyCard2Source: 'Eurostat · 2025',
      whyCard3Stat: '11% vs. 69%',
      whyCard3Copy: 'Utilização de Business Intelligence nas pequenas e grandes empresas.',
      whyCard3Source: 'Eurostat · 2025',
      whyGroup2Label: '02/AI OPERATIONALISATION',
      whyCard4Stat: '88% &rarr; 7%',
      whyCard4Copy: 'Utilizavam IA em pelo menos uma função vs. escalaram a toda a organização.',
      whyCard4Source: 'McKinsey · 2025',
      whyCard5Stat: 'Apenas 39%',
      whyCard5Copy: 'Reportavam impacto da IA no EBIT a nível empresarial.',
      whyCard5Source: 'McKinsey · 2025',
      whyCard6Stat: 'Apenas 21%',
      whyCard6Copy: 'Das organizações a utilizar GenAI redesenharam fundamentalmente os seus workflows.',
      whyCard6Source: 'McKinsey · 2025',
      whyFooterQuote: 'Um futuro AI-native começa com as bases certas,<br>não com IA sobre sistemas obsoletos.',
      whyCardM1Stat: '73% vs. 98%',
      whyCardM1Copy: 'Intensidade digital PMEs vs. grandes empresas',
      whyCardM1Source: 'Eurostat · 2025',
      whyCardM2Stat: '11% vs. 69%',
      whyCardM2Copy: 'Utilização de BI pequenas vs. grandes empresas',
      whyCardM2Source: 'Eurostat · 2025',
      whyCardM3Stat: '88% &rarr; 7%',
      whyCardM3Copy: 'Utilização única de AI &rarr; escala a toda a organização',
      whyCardM3Source: 'McKinsey · 2025',
      whyCardM4Stat: 'apenas 39%',
      whyCardM4Copy: 'Reportaram impacto da IA no EBIT',
      whyCardM4Source: 'McKinsey · 2025',
      whyFooterQuoteMobile: 'Um futuro AI-native<br>começa com as bases certas.',
      approachLabel: 'A NOSSA ABORDAGEM',
      approachTitle: '<span class="approach-title-line">Compreender o sistema. </span><span class="approach-title-line">Construir para <span class="grad"><em>evoluir</em></span>.</span>',
      approachSub: 'Na Vouga, system-first significa compreender o sistema <br>antes de introduzir software, automação ou IA.<span class="sub-motto">Compreender. Simplificar. Construir. Medir. Evoluir.</span>',
      approachPhase1Title: 'COMPREENDER',
      approachP1Item1: 'PESSOAS',
      approachP1Item2: 'PROCESSOS',
      approachP1Item3: 'INFORMAÇÃO',
      approachP1Item4: 'TECNOLOGIA',
      approachP1Subtext: 'Ver o sistema tal como ele é.',
      approachPhase2Title: 'CONSTRUIR',
      approachP2Item1: 'REMOVER FRICÇÃO',
      approachP2Item2: 'IDENTIFICAR A ALAVANCA',
      approachP2Item3: 'CONSTRUIR EM CAMADAS',
      approachP2LayersLabel: 'CAMADAS',
      approachP2LayersList: '<span>PROCESSO</span> · <span>DADOS</span> · <span>SOFTWARE</span><br><span>AUTOMAÇÃO</span> · <span>IA</span>',
      approachP2Subtext: 'Construir em volta do sistema.',
      approachPhase3Title: 'EVOLUIR',
      approachP3Item1: 'MEDIR',
      approachP3Item2: 'APRENDER',
      approachP3Item3: 'ADAPTAR',
      approachP3Item4: 'ESCALAR',
      approachP3Subtext: 'Melhorar à medida que o sistema muda.',
      interveneLabel: 'MODELO OPERACIONAL',
      interveneTitle: 'Visibilidade. Operações. Inteligência.',
      interveneCopy: 'Cada projeto começa onde a empresa mais precisa de ajuda e evolui em camadas.',
      interveneCol1Title: '<span class="num">01/</span>visibilidade',
      interveneCol1Desc: 'Tornamos a capacidade da fábrica visível e comercialmente apelativa.',
      interveneCol1ServicesLabel: 'SERVIÇOS',
      interveneCol1ResultLabel: 'Resultado:',
      interveneCol1ResultText: 'mais credibilidade, visibilidade e oportunidades comerciais.',
      interveneCol2Title: '<span class="num">02/</span>operação',
      interveneCol2Desc: 'Identificamos um processo interno que está a limitar a empresa e digitalizamo-lo.',
      interveneCol2ServicesLabel: 'SERVIÇOS',
      interveneCol2ResultLabel: 'Resultado:',
      interveneCol2ResultText: 'menos trabalho manual, erros e informação dispersa.',
      interveneCol3Title: '<span class="num">03/</span>inteligência',
      interveneCol3Desc: 'Acrescentamos IA quando os dados e processos já permitem gerar valor.',
      interveneCol3ServicesLabel: 'SERVIÇOS',
      interveneCol3ResultLabel: 'Resultado:',
      interveneCol3ResultText: 'maior velocidade, autonomia e capacidade de decisão.',
      useCasesLabel: 'TRABALHO SELECIONADO',
      useCasesTitle: 'Sistemas aplicados a <br class="br-mobile">problemas reais.',
      useCasesIntro: 'Uma seleção de exemplos de aplicação que mostra como transformamos problemas operacionais em sistemas com impacto mensurável.',
      useCasesNavLabel: 'Navegação dos casos de uso',
      useCasesPrev: 'Caso anterior',
      useCasesNext: 'Caso seguinte',
      useCasesRailLabel: 'Trabalho selecionado',
      useCaseLearnMore: 'Ver trabalho',
      useCaseProblemLabel: 'Problema',
      useCaseInterventionLabel: 'Intervenção',
      useCaseResultLabel: 'Resultado esperado',
      useCase1CardLabel: "Ver Centro Integrado de Operações Industriais",
      useCase1Tags: "Sistemas Operacionais · Integrações · Dashboards",
      useCase1Title: "Centro Integrado de Operações Industriais",
      useCase1Problem: "Stock, custos, horas e projetos vivem em sistemas e ficheiros separados.",
      useCase1Intervention: "Construímos uma plataforma sobre os sistemas existentes, reunindo dados, workflows, responsabilidades e indicadores num único ponto de trabalho.",
      useCase1Result: "Menos consolidação manual e respostas operacionais mais rápidas.",
      useCase2CardLabel: "Ver Sistema Comercial e de Orçamentação",
      useCase2Tags: "CRM · Orçamentação · IA",
      useCase2Title: "Sistema Comercial e de Orçamentação",
      useCase2Problem: "Pedidos, histórico e informação técnica estão dispersos entre canais e pessoas.",
      useCase2Intervention: "Centralizamos contactos, oportunidades, documentação, propostas e conhecimento técnico, automatizando tarefas repetitivas e apoiando a preparação e acompanhamento comercial.",
      useCase2Result: "Propostas mais rápidas e oportunidades com acompanhamento definido.",
      useCase3CardLabel: "Ver Camada de Conhecimento Técnico",
      useCase3Tags: "Conhecimento · Pesquisa · IA",
      useCase3Title: "Camada de Conhecimento Técnico",
      useCase3Problem: "Documentação e experiência estão dispersas por pastas, sistemas e pessoas.",
      useCase3Intervention: "Criamos uma camada de conhecimento sobre documentação e histórico interno, permitindo pesquisar, relacionar e recuperar informação através de linguagem natural.",
      useCase3Result: "Menos tempo à procura de informação e menos dependência de especialistas.",
      useCase4CardLabel: "Ver Motor de Normalização de Dados",
      useCase4Tags: "Dados · Integrações · Automação",
      useCase4Title: "Motor de Normalização de Dados",
      useCase4Problem: "Ficheiros e catálogos chegam com estruturas diferentes e exigem correção manual.",
      useCase4Intervention: "Criamos pipelines de ingestão, normalização e validação que recebem informação de diferentes fornecedores e a convertem automaticamente para uma estrutura interna comum.",
      useCase4Result: "Menos mapeamento manual e menos erros de importação.",
      useCase5CardLabel: "Ver Inteligência Operacional",
      useCase5Tags: "Dados · Indicadores · Apoio à Decisão",
      useCase5Title: "Inteligência Operacional",
      useCase5Problem: "Os indicadores chegam tarde e os dashboards nem sempre orientam a ação.",
      useCase5Intervention: "Ligamos informação operacional, criamos indicadores relevantes e acrescentamos alertas, análise e contexto para identificar desvios e apoiar decisões.",
      useCase5Result: "Reporting mais rápido e desvios detetados mais cedo.",
      capVis1: 'Posicionamento & Branding',
      capVis3: 'Websites',
      capVis4: 'SEO & GEO',
      capVis5: 'Materiais Comerciais',
      capOp1: 'Sistemas Operacionais',
      capOp2: 'Integrações',
      capOp3: 'Dashboards',
      capOp4: 'Automação',
      capIntel1: 'Sistemas de Conhecimento',
      capIntel2: 'Pesquisa Interna',
      capIntel3: 'Copilotos',
      capIntel4: 'Agentes de IA',
      navAbout: 'Sobre',
      aboutLabel: 'SOBRE',
      aboutTitle: 'De uma região industrial. <span class="about-title-mobile-break">Para o seu <span class="grad"><em>próximo capítulo</em></span>.</span>',
      aboutBody: 'Nascidos entre os rios Douro e Vouga, crescemos rodeados de fábricas, produtores e empresas industriais que moldaram a região. Hoje, trabalhamos ao seu lado para modernizar operações através de pensamento sistémico, software e IA.',
      aboutTagline: 'A ajudar a próxima geração da indústria a crescer sobre bases operacionais mais sólidas.',
      indTextile: 'Têxtil',
      indFootwear: 'Calçado',
      indMetalworking: 'Metalomecânica',
      indMolds: 'Moldes',
      indMachinery: 'Máquinas Industriais',
      indCork: 'Cortiça',
      indAutomotive: 'Automóvel',
      footerTalkTitle: '<span>Vamos</span><em>conversar</em>',
      footerTag: 'understand, before building.',
      rights: 'Copyright © 2026 Vouga Agency',
      legalLinks: '<a href="privacy.html">Privacidade</a> · <a href="terms.html">Termos</a>'
    },
    en: {
      logoHome: 'Vouga Agency, home',
      mainNav: 'main navigation',
      navContact: 'contact',
      navApproach: 'Approach',
      navIntervene: 'Model',
      navWork: 'Work',
      talkToUs: 'Contact us',
      heroTitle: '<span class="hero-line">Driving <strong class="hero-bold">business growth</strong></span><br><span class="hero-line">through <em>systems thinking</em></span>',
      heroSub: 'We accelerate industrial modernization through a system-first approach to software, automation and AI.',
      heroSubMobile: 'We accelerate industrial modernization through a system-first approach to software, automation and AI.',
      heroApproachCta: '&gt;&nbsp; our&nbsp;<strong>approach</strong>',
      heroModelCta: '&gt;&nbsp; <strong>what we do</strong>',
      whyStoryLabel: 'Why Now',
      whyTitle: '<span class="why-title-line">The AI gap starts </span><span class="why-title-line"><span class="grad"><em>before AI.</em></span></span>',
      whyCopy: 'The most advanced companies do not just have better models. They have better data,<br>stronger integration, clearer processes and the internal capacity to turn technology into execution.<br><br>As AI accelerates, many companies still operate on fragmented foundations. Adding intelligence without preparing data, systems and processes not only limits its impact, it amplifies existing inefficiencies.',
      whyCopyMobile: 'Many companies still operate on fragmented foundations. Without prepared data, systems and processes, adding AI limits impact and amplifies inefficiencies.',
      whyGroup1Label: '01/DIGITAL FOUNDATIONS',
      whyCard1Stat: '73% vs. 98%',
      whyCard1Copy: 'Basic digital intensity in SMEs and large enterprises.',
      whyCard1Source: 'Eurostat · 2025',
      whyCard2Stat: '41% vs. 89%',
      whyCard2Copy: 'ERP system usage in small and large enterprises.',
      whyCard2Source: 'Eurostat · 2025',
      whyCard3Stat: '11% vs. 69%',
      whyCard3Copy: 'Business Intelligence usage in small and large enterprises.',
      whyCard3Source: 'Eurostat · 2025',
      whyGroup2Label: '02/AI OPERATIONALISATION',
      whyCard4Stat: '88% &rarr; 7%',
      whyCard4Copy: 'Used AI in at least one function vs. scaled across the organization.',
      whyCard4Source: 'McKinsey · 2025',
      whyCard5Stat: 'Only 39%',
      whyCard5Copy: 'Reported EBIT impact from AI at the enterprise level.',
      whyCard5Source: 'McKinsey · 2025',
      whyCard6Stat: 'Only 21%',
      whyCard6Copy: 'Of organizations using GenAI fundamentally redesigned their workflows.',
      whyCard6Source: 'McKinsey · 2025',
      whyFooterQuote: "Don't retrofit AI into yesterday's systems.<br>Build today's foundations for an AI-native future.",
      whyCardM1Stat: '73% vs. 98%',
      whyCardM1Copy: 'Digital intensity SMEs vs. large enterprises',
      whyCardM1Source: 'Eurostat · 2025',
      whyCardM2Stat: '11% vs. 69%',
      whyCardM2Copy: 'BI usage small vs. large enterprises',
      whyCardM2Source: 'Eurostat · 2025',
      whyCardM3Stat: '88% &rarr; 7%',
      whyCardM3Copy: 'Single AI use &rarr; scale across the organization',
      whyCardM3Source: 'McKinsey · 2025',
      whyCardM4Stat: 'only 39%',
      whyCardM4Copy: 'Reported AI impact on EBIT',
      whyCardM4Source: 'McKinsey · 2025',
      whyFooterQuoteMobile: 'An AI-native future<br>starts with the right foundations.',
      approachLabel: 'OUR APPROACH',
      approachTitle: '<span class="approach-title-line">Understand the system. </span><span class="approach-title-line">Build what <span class="grad"><em>evolves</em></span>.</span>',
      approachSub: 'At Vouga, a system-first approach means understanding the system <br>before introducing software, automation or AI.<span class="sub-motto">Understand. Simplify. Build. Measure. Evolve.</span>',
      approachPhase1Title: 'UNDERSTAND',
      approachP1Item1: 'PEOPLE',
      approachP1Item2: 'PROCESSES',
      approachP1Item3: 'INFORMATION',
      approachP1Item4: 'TECHNOLOGY',
      approachP1Subtext: 'See the system as it is.',
      approachPhase2Title: 'BUILD',
      approachP2Item1: 'REMOVE FRICTION',
      approachP2Item2: 'FIND LEVERAGE',
      approachP2Item3: 'BUILD IN LAYERS',
      approachP2LayersLabel: 'LAYERS',
      approachP2LayersList: '<span>PROCESS</span> · <span>DATA</span> · <span>SOFTWARE</span><br><span>AUTOMATION</span> · <span>AI</span>',
      approachP2Subtext: 'Build around the system.',
      approachPhase3Title: 'EVOLVE',
      approachP3Item1: 'MEASURE',
      approachP3Item2: 'LEARN',
      approachP3Item3: 'ADAPT',
      approachP3Item4: 'SCALE',
      approachP3Subtext: 'Improve as the system changes.',
      interveneLabel: 'OPERATING MODEL',
      interveneTitle: 'Visibility. Operations. Intelligence.',
      interveneCopy: 'Every engagement starts where the company needs the most help and evolves in layers.',
      interveneCol1Title: '<span class="num">01/</span>visibility',
      interveneCol1Desc: 'We make the company\'s capability visible and commercially compelling.',
      interveneCol1ServicesLabel: 'CAPABILITIES',
      interveneCol1ResultLabel: 'Result:',
      interveneCol1ResultText: 'higher credibility, visibility and commercial opportunities.',
      interveneCol2Title: '<span class="num">02/</span>operations',
      interveneCol2Desc: 'We identify an internal process that is limiting the company and digitize it.',
      interveneCol2ServicesLabel: 'CAPABILITIES',
      interveneCol2ResultLabel: 'Result:',
      interveneCol2ResultText: 'less manual work, fewer errors and no fragmented information.',
      interveneCol3Title: '<span class="num">03/</span>intelligence',
      interveneCol3Desc: 'We add AI when data and processes are already prepared to create value.',
      interveneCol3ServicesLabel: 'CAPABILITIES',
      interveneCol3ResultLabel: 'Result:',
      interveneCol3ResultText: 'higher speed, autonomy and decision-making capability.',
      useCasesLabel: 'SELECTED WORK',
      useCasesTitle: 'Systems applied to real problems.',
      useCasesIntro: 'A selection of application examples showing how we turn operational problems into systems with measurable impact.',
      useCasesNavLabel: 'Selected work navigation',
      useCasesPrev: 'Previous case',
      useCasesNext: 'Next case',
      useCasesRailLabel: 'Selected work',
      useCaseLearnMore: 'View work',
      useCaseProblemLabel: 'Problem',
      useCaseInterventionLabel: 'Intervention',
      useCaseResultLabel: 'Expected result',
      useCase1CardLabel: "View Industrial Operations Hub",
      useCase1Tags: "Operational Systems · Integrations · Dashboards",
      useCase1Title: "Industrial Operations Hub",
      useCase1Problem: "Inventory, costs, hours and projects live in separate systems and files.",
      useCase1Intervention: "We build a platform over existing systems, bringing data, workflows, responsibilities and indicators into one operational workspace.",
      useCase1Result: "Less manual consolidation and faster operational responses.",
      useCase2CardLabel: "View Commercial & Quotation System",
      useCase2Tags: "CRM · Quotation · AI",
      useCase2Title: "Commercial & Quotation System",
      useCase2Problem: "Requests, history and technical information are scattered across channels and people.",
      useCase2Intervention: "We centralize contacts, opportunities, documentation, quotations and technical knowledge, automating repetitive work and supporting commercial preparation and follow-up.",
      useCase2Result: "Faster quotations and opportunities with clear follow-up.",
      useCase3CardLabel: "View Technical Knowledge Layer",
      useCase3Tags: "Knowledge · Search · AI",
      useCase3Title: "Technical Knowledge Layer",
      useCase3Problem: "Documents and experience are scattered across folders, systems and people.",
      useCase3Intervention: "We create a knowledge layer over internal documentation and history, allowing teams to search, connect and retrieve information through natural language.",
      useCase3Result: "Less time searching and less dependence on individual experts.",
      useCase4CardLabel: "View Data Normalization Engine",
      useCase4Tags: "Data · Integrations · Automation",
      useCase4Title: "Data Normalization Engine",
      useCase4Problem: "Files and catalogs arrive in different structures and require manual correction.",
      useCase4Intervention: "We build ingestion, normalization and validation pipelines that receive data from different suppliers and automatically convert it into one common internal structure.",
      useCase4Result: "Less manual mapping and fewer import errors.",
      useCase5CardLabel: "View Operational Intelligence",
      useCase5Tags: "Data · Indicators · Decision Support",
      useCase5Title: "Operational Intelligence",
      useCase5Problem: "Indicators arrive late and dashboards do not always drive action.",
      useCase5Intervention: "We connect operational information, create relevant indicators and add alerts, analysis and context to identify deviations and support action.",
      useCase5Result: "Faster reporting and earlier detection of deviations.",
      capVis1: 'Positioning & Branding',
      capVis3: 'Websites',
      capVis4: 'SEO & GEO',
      capVis5: 'Commercial Materials',
      capOp1: 'Operating Systems',
      capOp2: 'Integrations',
      capOp3: 'Dashboards',
      capOp4: 'Automation',
      capIntel1: 'Knowledge Systems',
      capIntel2: 'Internal Search',
      capIntel3: 'Copilots',
      capIntel4: 'AI Agents',
      navAbout: 'About',
      aboutLabel: 'ABOUT',
      aboutTitle: 'From an industrial region. <span class="about-title-mobile-break">For its <span class="grad"><em>next chapter</em></span>.</span>',
      aboutBody: 'Born between the Douro and Vouga rivers, we grew up surrounded by factories, makers and industrial businesses that shaped the region. Today, we work alongside them to modernise operations through systems thinking, software and AI.',
      aboutTagline: 'helping the next generation of industry grow on stronger operating foundations.',
      indTextile: 'Textile',
      indFootwear: 'Footwear',
      indMetalworking: 'Metalworking',
      indMolds: 'Molds & Plastics',
      indMachinery: 'Industrial Machinery',
      indCork: 'Cork',
      indAutomotive: 'Automotive',
      footerTalkTitle: '<span class="single-line">Let’s <em>talk</em></span>',
      footerTag: 'understand, before building.',
      rights: 'Copyright © 2026 Vouga Agency',
      legalLinks: '<a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a>'
    }
  };
  var META_COPY = {
    pt: {
      title: 'Vouga Agency | Consultora Tecnológica para a Indústria',
      description: 'A Vouga Agency ajuda empresas industriais a modernizar operações através de uma abordagem system-first a software, automação e IA.',
      keywords: 'operações industriais, transformação operacional, software industrial, automação, inteligência artificial, sistemas empresariais, Vouga Agency, Porto, Portugal',
      socialTitle: 'Vouga Agency | Consultora Tecnológica para a Indústria',
      socialDescription: 'A Vouga Agency ajuda empresas industriais a modernizar operações através de uma abordagem system-first a software, automação e IA.',
      imageAlt: 'Identidade visual da Vouga Agency para operações industriais, software, automação e IA.',
      locale: 'pt_PT'
    },
    en: {
      title: 'Vouga Agency | Technology Consulting for Industry',
      description: 'Vouga Agency helps industrial companies modernize operations through a system-first approach to software, automation and AI.',
      keywords: 'industrial operations, operational transformation, industrial software, automation, artificial intelligence, business systems, Vouga Agency, Porto, Portugal',
      socialTitle: 'Vouga Agency | Technology Consulting for Industry',
      socialDescription: 'Vouga Agency helps industrial companies modernize operations through a system-first approach to software, automation and AI.',
      imageAlt: 'Vouga Agency visual identity for industrial operations, software, automation and AI.',
      locale: 'en_US'
    }
  };
  var WORK_DETAIL_LABELS = {
    pt: {
      allWork: 'Todos os trabalhos', context: 'Exemplo de aplicação', problem: 'O problema', system: 'O que construímos',
      evidence: 'Evidência de mercado', evidenceTitle: 'Porque importa.',
      evidenceIntro: 'Indicadores externos que ajudam a dimensionar a oportunidade. Não representam resultados da Vouga.',
      measures: 'O que medimos', measuresTitle: 'Medimos aquilo que o sistema deve melhorar.',
      measuresIntro: 'Definimos o baseline e acompanhamos os indicadores que mostram se o sistema está a criar valor.',
      flowSources: 'Fontes', flowFriction: 'Fricção', flowResult: 'Resultado', flowLayer: 'Camada', flowEnables: 'Permite',
      outcomes: 'Resultados esperados', outcomesTitle: 'O que pretendemos melhorar.',
      outcomesIntro: 'Intervalos de melhoria usados como ponto de partida e afinados depois de medir o baseline da operação.',
      outcomesNote: 'São objetivos de projeto, não garantias. O intervalo final depende do diagnóstico, da qualidade dos dados, da adoção e dos sistemas existentes.',
      next: 'Próximo passo', apply: 'Aplicar este sistema'
    },
    en: {
      allWork: 'All work', context: 'Application example', problem: 'The problem', system: 'What we build',
      evidence: 'Market evidence', evidenceTitle: 'Why it matters.',
      evidenceIntro: 'External indicators that help size the opportunity. They are not Vouga project results.',
      measures: 'What we measure', measuresTitle: 'We measure what the system is meant to improve.',
      measuresIntro: 'We establish the baseline and track the indicators that show whether the system is creating value.',
      flowSources: 'Sources', flowFriction: 'Friction', flowResult: 'Result', flowLayer: 'Layer', flowEnables: 'Enables',
      outcomes: 'Expected results', outcomesTitle: 'What we intend to improve.',
      outcomesIntro: 'Improvement ranges used as a starting point and refined after measuring the operational baseline.',
      outcomesNote: 'These are project targets, not guarantees. The final range depends on diagnosis, data quality, adoption and existing systems.',
      next: 'Next step', apply: 'Apply this system'
    }
  };
  var WORK_CASES = {
    "centro-operacoes-industriais": {
      index: "01", image: "assets/img/11.webp",
      pt: {
        tags: "Sistemas Operacionais · Integrações · Dashboards",
        title: "Centro Integrado de Operações Industriais",
        lead: "Centralizamos operação, stock, custos, recursos e indicadores num sistema que transforma informação dispersa em controlo operacional.",
        problemTitle: "Stock num sistema.\nCustos noutro.",
        problemBody: "Stock num sistema. Custos noutro. Horas em folhas de cálculo. Projetos acompanhados por email. O problema não é falta de informação, mas a fragmentação entre fontes, equipas e processos.",
        problemFlow: {inputs: ["ERP", "Excel", "Email", "Stock"], core: "Fontes dispersas", outputs: ["Procura manual", "Atrasos"]},
        problems: ["Informação fragmentada entre diferentes sistemas e ficheiros.", "Consolidação manual para perceber custos, stock ou progresso.", "Falta de rastreabilidade entre equipas e processos.", "Decisões tomadas com informação incompleta ou desatualizada."],
        systemTitle: "Uma plataforma sobre os sistemas existentes.",
        systemBody: "Construímos uma plataforma sobre os sistemas existentes, reunindo dados, workflows, responsabilidades e indicadores num único ponto de trabalho.",
        systemFlow: {inputs: ["ERP", "Excel", "Email", "Stock"], core: "Operations Hub", outputs: ["Workflows", "Alertas", "Decisões"]},
        system: ["Integração com ERP, folhas de cálculo e sistemas existentes.", "Gestão de stock, recursos, custos e projetos.", "Dashboards operacionais e executivos.", "Workflows, alertas e responsabilidades.", "Histórico e rastreabilidade da operação."],
        evidence: [{stat: "53%", copy: "das empresas da UE utilizavam ERP, CRM e/ou BI em 2025.", source: "Eurostat · 2026", url: "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1"}, {stat: "41% vs. 89%", copy: "adoção de ERP nas pequenas e grandes empresas da UE.", source: "Eurostat · 2026", url: "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1"}, {stat: "11% vs. 69%", copy: "adoção de BI nas pequenas e grandes empresas da UE.", source: "Eurostat · 2026", url: "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1"}],
        note: "Indicadores europeus de adoção tecnológica; não medem o impacto de uma implementação específica.",
        measures: ["Horas de consolidação manual", "Número de fontes e sistemas isolados", "Tempo entre ocorrência e visibilidade", "Passagens manuais entre equipas", "Tempo de resposta operacional"],
        outcomes: [{stat: "~50/80%", copy: "de redução no tempo gasto em consolidação manual."}, {stat: "~30/50%", copy: "de redução no tempo de resposta a desvios operacionais."}, {stat: "~25/45%", copy: "de redução nas passagens manuais entre equipas."}],
        outcomesTitle: "Menos consolidação. Mais controlo operacional.",
        ctaTitle: "Unificar a operação num único ponto de trabalho.",
        cta: "Unificar a minha operação",
        evidenceIntro: "Indicadores externos que ajudam a dimensionar a oportunidade. Não representam resultados da Vouga.",
        measuresIntro: "Definimos o baseline e acompanhamos os indicadores que mostram se a plataforma está realmente a reduzir fricção operacional.",
        outcomesNote: "São objetivos de projeto, não garantias. O intervalo final depende do diagnóstico, qualidade dos dados, adoção e sistemas existentes."
      },
      en: {
        tags: "Operational Systems · Integrations · Dashboards",
        title: "Industrial Operations Hub",
        lead: "We centralize operations, inventory, costs, resources and performance data into one system that turns fragmented information into operational control.",
        problemTitle: "Inventory in one system.\nCosts in another.",
        problemBody: "Inventory lives in one system. Costs in another. Hours in spreadsheets. Projects are followed through email. The problem is not a lack of information, but fragmentation across sources, teams and processes.",
        problemFlow: {inputs: ["ERP", "Excel", "Email", "Inventory"], core: "Scattered sources", outputs: ["Manual search", "Delays"]},
        problems: ["Information fragmented across systems and files.", "Manual consolidation to understand costs, inventory or progress.", "Limited traceability across teams and processes.", "Decisions made with incomplete or outdated information."],
        systemTitle: "One platform over existing systems.",
        systemBody: "We build a platform over existing systems, bringing data, workflows, responsibilities and indicators into one operational workspace.",
        systemFlow: {inputs: ["ERP", "Excel", "Email", "Inventory"], core: "Operations Hub", outputs: ["Workflows", "Alerts", "Decisions"]},
        system: ["Integration with ERP, spreadsheets and existing systems.", "Inventory, resource, cost and project management.", "Operational and executive dashboards.", "Workflows, alerts and ownership.", "Operational history and traceability."],
        evidence: [{stat: "53%", copy: "of EU enterprises used ERP, CRM and/or BI software in 2025.", source: "Eurostat · 2026", url: "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1"}, {stat: "41% vs. 89%", copy: "ERP adoption among small versus large EU enterprises.", source: "Eurostat · 2026", url: "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1"}, {stat: "11% vs. 69%", copy: "BI adoption among small versus large EU enterprises.", source: "Eurostat · 2026", url: "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1"}],
        note: "",
        measures: ["Manual consolidation hours", "Number of isolated systems and sources", "Time from occurrence to visibility", "Manual handoffs between teams", "Operational response time"],
        outcomes: [{stat: "~50–80%", copy: "reduction in time spent on manual consolidation."}, {stat: "~30–50%", copy: "reduction in response time to operational deviations."}, {stat: "~25–45%", copy: "reduction in manual handoffs between teams."}],
        outcomesTitle: "Less consolidation. More operational control.",
        ctaTitle: "Bring the operation into one workspace.",
        cta: "Unify my operation",
        evidenceIntro: "External indicators used to size the opportunity. They do not represent Vouga results.",
        outcomesNote: "Project targets, not guarantees. Final ranges depend on the baseline, data quality, adoption and existing systems."
      }
    },
    "sistema-comercial-orcamentacao": {
      index: "02", image: "assets/img/44.webp",
      pt: {
        tags: "CRM · Orçamentação · IA",
        title: "Sistema Comercial e de Orçamentação",
        lead: "Ligamos prospeção, oportunidades, conhecimento técnico e orçamentação num processo comercial desenhado para contextos industriais.",
        problemTitle: "Cada proposta exige reconstruir trabalho já feito.",
        problemBody: "Pedidos comerciais entram por email, telefone ou contactos pessoais. A informação técnica está dispersa. O histórico depende de quem conhece o cliente. Preparar uma proposta exige procurar informação, validar internamente e reconstruir trabalho já feito.",
        problemFlow: {inputs: ["Leads", "CRM", "Email", "Engenharia"], core: "Fontes dispersas", outputs: ["Procura manual", "Atrasos"]},
        problems: ["Leads dispersos por emails, contactos e ficheiros.", "Informação técnica difícil de localizar.", "Orçamentos dependentes de conhecimento individual.", "Follow-ups inconsistentes.", "Pouca visibilidade sobre pipeline e conversão."],
        systemTitle: "Um processo comercial ligado do lead ao follow-up.",
        systemBody: "Centralizamos contactos, oportunidades, documentação, propostas e conhecimento técnico, automatizando tarefas repetitivas e apoiando a preparação e acompanhamento comercial.",
        systemFlow: {inputs: ["Leads", "CRM", "Email", "Engenharia"], core: "Quotation Hub", outputs: ["IA", "Follow-up", "Pipeline"]},
        system: ["CRM adaptado ao processo comercial.", "Pesquisa e qualificação de oportunidades.", "Histórico centralizado de clientes e propostas.", "Apoio à preparação de propostas e orçamentos.", "Alertas, follow-ups e acompanhamento do pipeline.", "IA aplicada à pesquisa e reutilização de conhecimento comercial."],
        evidence: [{stat: "3–5%", copy: "é o aumento potencial de produtividade comercial estimado pela McKinsey para aplicações de GenAI em vendas.", source: "McKinsey", url: "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier"}, {stat: "25% vs. 65%", copy: "adoção de CRM entre pequenas e grandes empresas da UE.", source: "Eurostat · 2026", url: "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1"}],
        note: "A GenAI pode apoiar identificação, priorização e desenvolvimento de leads através da combinação de dados estruturados e não estruturados.",
        measures: ["Tempo médio de preparação de proposta", "Tempo gasto a procurar informação", "Lead-to-quote time", "Taxa de follow-up", "Conversão de oportunidade em proposta", "Número de oportunidades sem próxima ação"],
        outcomes: [{stat: "~30/60%", copy: "de redução no tempo de preparação de propostas recorrentes."}, {stat: "~25/50%", copy: "de redução no tempo gasto a procurar informação comercial e técnica."}, {stat: "~20/40%", copy: "de redução em oportunidades sem follow-up ou próxima ação definida."}],
        outcomesTitle: "Propostas mais rápidas. Melhor acompanhamento.",
        ctaTitle: "Melhorar a operação comercial.",
        cta: "Melhorar o meu processo comercial",
        outcomesNote: "São objetivos de projeto definidos após análise do processo comercial atual."
      },
      en: {
        tags: "CRM · Quotation · AI",
        title: "Commercial & Quotation System",
        lead: "We connect prospecting, opportunities, technical knowledge and quotation into one commercial process designed for industrial businesses.",
        problemTitle: "Every quotation rebuilds work already done.",
        problemBody: "Requests arrive through email, phone calls and personal contacts. Technical information is scattered. Customer history depends on individual knowledge. Every quotation requires searching, validating and rebuilding work that often already exists somewhere.",
        problemFlow: {inputs: ["Leads", "CRM", "Email", "Engineering"], core: "Scattered sources", outputs: ["Manual search", "Delays"]},
        problems: ["Leads scattered across emails, contacts and files.", "Technical information difficult to retrieve.", "Quotations dependent on individual knowledge.", "Inconsistent follow-up.", "Limited pipeline and conversion visibility."],
        systemTitle: "One commercial process from lead to follow-up.",
        systemBody: "We centralize contacts, opportunities, documentation, quotations and technical knowledge, automating repetitive work and supporting commercial preparation and follow-up.",
        systemFlow: {inputs: ["Leads", "CRM", "Email", "Engineering"], core: "Quotation Hub", outputs: ["AI", "Follow-up", "Pipeline"]},
        system: ["CRM adapted to the commercial process.", "Opportunity research and qualification.", "Centralized customer and quotation history.", "Quotation and proposal support.", "Alerts, follow-ups and pipeline management.", "AI applied to commercial and technical knowledge retrieval."],
        evidence: [{stat: "3–5%", copy: "potential increase in sales productivity from GenAI applications estimated by McKinsey.", source: "McKinsey", url: "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier"}, {stat: "25% vs. 65%", copy: "CRM adoption among small versus large EU enterprises.", source: "Eurostat · 2026", url: "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1"}],
        note: "",
        measures: ["Average quotation preparation time", "Time spent searching for information", "Lead-to-quote time", "Follow-up rate", "Opportunity-to-quotation conversion", "Opportunities without a next action"],
        outcomes: [{stat: "~30–60%", copy: "reduction in preparation time for recurring quotations."}, {stat: "~25–50%", copy: "reduction in time spent searching for technical and commercial information."}, {stat: "~20–40%", copy: "reduction in opportunities without a defined next action."}],
        outcomesTitle: "Faster quotations. Better follow-up.",
        ctaTitle: "Improve the commercial operation.",
        cta: "Improve my commercial process"
      }
    },
    "sistema-conhecimento-tecnico": {
      index: "03", image: "assets/img/33.webp",
      pt: {
        tags: "Conhecimento · Pesquisa · IA",
        title: "Camada de Conhecimento Técnico",
        lead: "Transformamos documentação, experiência e conhecimento disperso numa camada de inteligência acessível a quem está a executar o trabalho.",
        problemTitle: "A resposta depende de saber quem perguntar.",
        problemBody: "Procedimentos, manuais, projetos anteriores e conhecimento técnico existem, mas estão distribuídos por pastas, emails, sistemas e pessoas. Quando surge um problema, a resposta depende frequentemente de saber quem perguntar.",
        problemFlow: {inputs: ["Manuais", "Procedimentos", "Email", "Projetos"], core: "Fontes dispersas", outputs: ["Procura manual", "Atrasos"]},
        problems: ["Conhecimento crítico concentrado em poucas pessoas.", "Documentação difícil de pesquisar.", "Problemas semelhantes resolvidos várias vezes de raiz.", "Tempo perdido a procurar informação.", "Perda de contexto quando pessoas mudam de função ou saem."],
        systemTitle: "Conhecimento interno acessível em linguagem natural.",
        systemBody: "Criamos uma camada de conhecimento sobre documentação e histórico interno, permitindo pesquisar, relacionar e recuperar informação através de linguagem natural.",
        systemFlow: {inputs: ["Manuais", "Procedimentos", "Email", "Projetos"], core: "Knowledge Layer", outputs: ["Pesquisa", "IA", "Decisões"]},
        system: ["Pesquisa semântica sobre documentação interna.", "Respostas fundamentadas nas fontes da empresa.", "Organização automática de conhecimento.", "Recuperação de projetos e casos anteriores.", "Assistente técnico contextual.", "Histórico e rastreabilidade das fontes usadas."],
        evidence: [{stat: "29%", copy: "mais rapidez numa série de tarefas de pesquisa, escrita e resumo com apoio de Copilot num estudo controlado da Microsoft.", source: "Microsoft", url: "https://www.microsoft.com/en-us/worklab/work-trend-index/copilots-earliest-users-teach-us-about-generative-ai-at-work"}, {stat: "75%", copy: "dos utilizadores inquiridos disseram que o Copilot os ajudava a encontrar mais facilmente aquilo de que precisavam nos seus ficheiros.", source: "Microsoft", url: "https://www.microsoft.com/en-us/worklab/work-trend-index/copilots-earliest-users-teach-us-about-generative-ai-at-work"}, {stat: "40%+", copy: "dos fabricantes de produtos industriais inquiridos pela Deloitte planeavam investir em IA e machine learning nos anos seguintes, incluindo aplicações associadas a retenção de conhecimento e augmentation das equipas.", source: "Deloitte", url: "https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/manufacturing-industry-outlook/2025.html"}],
        note: "",
        measures: ["Tempo médio de procura de informação", "Número de fontes consultadas por tarefa", "Questões repetidas entre equipas", "Dependência de especialistas individuais", "Tempo de onboarding técnico", "Taxa de respostas suportadas por fontes internas"],
        outcomes: [{stat: "~30/60%", copy: "de redução no tempo gasto a procurar informação técnica."}, {stat: "~20/40%", copy: "de redução em pedidos repetitivos dirigidos a especialistas internos."}, {stat: "~20/35%", copy: "de redução no tempo necessário para recuperar contexto de projetos ou ocorrências anteriores."}],
        outcomesTitle: "Menos procura. Conhecimento disponível.",
        ctaTitle: "Tornar o conhecimento interno acessível.",
        cta: "Ativar o meu conhecimento interno",
        outcomesNote: "São objetivos de projeto. A qualidade depende diretamente da documentação e conhecimento disponível."
      },
      en: {
        tags: "Knowledge · Search · AI",
        title: "Technical Knowledge Layer",
        lead: "We turn documentation, experience and fragmented knowledge into an intelligence layer available to the people doing the work.",
        problemTitle: "The answer depends on knowing who to ask.",
        problemBody: "Procedures, manuals, previous projects and technical expertise exist, but they are scattered across folders, emails, systems and people. When a problem appears, the answer often depends on knowing who to ask.",
        problemFlow: {inputs: ["Manuals", "Procedures", "Email", "Projects"], core: "Scattered sources", outputs: ["Manual search", "Delays"]},
        problems: ["Critical knowledge concentrated in a few people.", "Documentation difficult to search.", "Similar problems repeatedly solved from scratch.", "Time lost looking for information.", "Context lost when people move or leave."],
        systemTitle: "Internal knowledge accessible in natural language.",
        systemBody: "We create a knowledge layer over internal documentation and history, allowing teams to search, connect and retrieve information through natural language.",
        systemFlow: {inputs: ["Manuals", "Procedures", "Email", "Projects"], core: "Knowledge Layer", outputs: ["Search", "AI", "Decisions"]},
        system: ["Semantic search across internal documentation.", "Source-grounded answers.", "Automated knowledge organization.", "Retrieval of previous projects and cases.", "Contextual technical assistant.", "Source history and traceability."],
        evidence: [{stat: "29%", copy: "faster across a series of search, writing and summarization tasks in a Microsoft controlled study.", source: "Microsoft", url: "https://www.microsoft.com/en-us/worklab/work-trend-index/copilots-earliest-users-teach-us-about-generative-ai-at-work"}, {stat: "75%", copy: "of surveyed users said Copilot helped them find what they needed in their files.", source: "Microsoft", url: "https://www.microsoft.com/en-us/worklab/work-trend-index/copilots-earliest-users-teach-us-about-generative-ai-at-work"}, {stat: "40%+", copy: "of surveyed industrial product manufacturers planned investment in AI and machine learning, including use cases linked to retaining knowledge and augmenting workforce capabilities.", source: "Deloitte", url: "https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/manufacturing-industry-outlook/2025.html"}],
        note: "",
        measures: ["Average information search time", "Sources consulted per task", "Repeated questions between teams", "Dependence on individual experts", "Technical onboarding time", "Answers supported by internal sources"],
        outcomes: [{stat: "~30–60%", copy: "reduction in technical information search time."}, {stat: "~20–40%", copy: "reduction in repetitive requests to internal experts."}, {stat: "~20–35%", copy: "reduction in time required to recover context from previous projects or incidents."}],
        outcomesTitle: "Less searching. Available knowledge.",
        ctaTitle: "Make internal knowledge accessible.",
        cta: "Activate my internal knowledge"
      }
    },
    "motor-normalizacao-dados": {
      index: "04", image: "assets/img/22.webp",
      pt: {
        tags: "Dados · Integrações · Automação",
        title: "Motor de Normalização de Dados",
        lead: "Transformamos ficheiros, estruturas e formatos diferentes numa camada de dados normalizada, validada e pronta para utilização.",
        problemTitle: "Cada fornecedor traz uma estrutura diferente.",
        problemBody: "XML, CSV, Excel, APIs e catálogos chegam com estruturas, campos e nomenclaturas diferentes. Equipas acabam por mapear, corrigir e validar manualmente informação antes de conseguir utilizá-la.",
        problemFlow: {inputs: ["XML", "CSV", "Excel", "APIs"], core: "Fontes dispersas", outputs: ["Procura manual", "Atrasos"]},
        problems: ["Estruturas diferentes por fornecedor.", "Mapeamento manual e repetitivo.", "Campos incompletos, duplicados ou inconsistentes.", "Erros que se propagam para sistemas internos.", "Integração lenta de novos fornecedores."],
        systemTitle: "Dados normalizados, validados e prontos a utilizar.",
        systemBody: "Criamos pipelines de ingestão, normalização e validação que recebem informação de diferentes fornecedores e a convertem automaticamente para uma estrutura interna comum.",
        systemFlow: {inputs: ["XML", "CSV", "Excel", "APIs"], core: "Data Engine", outputs: ["Mapeamento", "Validação", "Formato interno"]},
        system: ["Ingestão de múltiplos formatos.", "Mapeamento automático para estrutura interna.", "Regras de validação e qualidade.", "Deteção de campos em falta e inconsistências.", "Aprendizagem da estrutura de cada fornecedor.", "Histórico e controlo das transformações."],
        evidence: [{stat: "43%", copy: "dos COOs identificavam qualidade de dados como a sua principal prioridade relacionada com dados num estudo citado pela IBM.", source: "IBM · 2026", url: "https://www.ibm.com/think/insights/cost-of-poor-data-quality"}, {stat: ">25%", copy: "das organizações inquiridas estimavam perder mais de 5 milhões de dólares por ano devido a problemas de qualidade de dados.", source: "IBM · 2026", url: "https://www.ibm.com/think/insights/cost-of-poor-data-quality"}, {stat: "7%", copy: "reportavam perdas superiores a 25 milhões de dólares associadas a má qualidade de dados.", source: "IBM · 2026", url: "https://www.ibm.com/think/insights/cost-of-poor-data-quality"}],
        note: "Os valores referem-se a organizações de diferentes dimensões e mercados e não são diretamente representativos de uma PME portuguesa.",
        measures: ["Tempo de integração por fornecedor", "Campos mapeados manualmente", "Taxa de erros de importação", "Registos rejeitados ou incompletos", "Correções manuais por ficheiro", "Tempo entre receção e disponibilidade dos dados"],
        outcomes: [{stat: "~70/95%", copy: "de redução no mapeamento manual de estruturas recorrentes."}, {stat: "~50/80%", copy: "de redução no tempo de onboarding técnico de fornecedores semelhantes."}, {stat: "~40/70%", copy: "de redução em correções manuais após importação."}],
        outcomesTitle: "Menos mapeamento. Dados mais fiáveis.",
        ctaTitle: "Automatizar a preparação dos dados.",
        cta: "Automatizar os meus dados",
        outcomesNote: "Objetivos de projeto, dependentes da consistência, frequência e qualidade dos dados recebidos."
      },
      en: {
        tags: "Data · Integrations · Automation",
        title: "Data Normalization Engine",
        lead: "We transform different files, structures and formats into a normalized, validated data layer ready for use.",
        problemTitle: "Every supplier brings a different structure.",
        problemBody: "XML, CSV, Excel, APIs and catalogs arrive with different structures, fields and naming conventions. Teams manually map, correct and validate information before it can be used.",
        problemFlow: {inputs: ["XML", "CSV", "Excel", "APIs"], core: "Scattered sources", outputs: ["Manual search", "Delays"]},
        problems: ["Different structures for each supplier.", "Repetitive manual mapping.", "Missing, duplicate or inconsistent fields.", "Errors propagated into internal systems.", "Slow supplier onboarding."],
        systemTitle: "Normalized, validated data ready for use.",
        systemBody: "We build ingestion, normalization and validation pipelines that receive data from different suppliers and automatically convert it into one common internal structure.",
        systemFlow: {inputs: ["XML", "CSV", "Excel", "APIs"], core: "Data Engine", outputs: ["Mapping", "Validation", "Internal format"]},
        system: ["Multi-format ingestion.", "Automatic mapping to internal structures.", "Validation and quality rules.", "Missing-field and inconsistency detection.", "Supplier-structure learning.", "Transformation history and control."],
        evidence: [{stat: "43%", copy: "of COOs identified data quality as their most significant data priority in research cited by IBM.", source: "IBM · 2026", url: "https://www.ibm.com/think/insights/cost-of-poor-data-quality"}, {stat: ">25%", copy: "of surveyed organizations estimated losses above $5 million annually from poor data quality.", source: "IBM · 2026", url: "https://www.ibm.com/think/insights/cost-of-poor-data-quality"}, {stat: "7%", copy: "reported losses above $25 million associated with poor data quality.", source: "IBM · 2026", url: "https://www.ibm.com/think/insights/cost-of-poor-data-quality"}],
        note: "These figures cover organizations of different sizes and markets and are not directly representative of a Portuguese SME.",
        measures: ["Supplier integration time", "Manually mapped fields", "Import error rate", "Rejected or incomplete records", "Manual corrections per file", "Time from receipt to data availability"],
        outcomes: [{stat: "~70–95%", copy: "reduction in manual mapping for recurring structures."}, {stat: "~50–80%", copy: "reduction in technical onboarding time for similar suppliers."}, {stat: "~40–70%", copy: "reduction in manual corrections after import."}],
        outcomesTitle: "Less mapping. More reliable data.",
        ctaTitle: "Automate data preparation.",
        cta: "Automate my supplier data"
      }
    },
    "inteligencia-operacional": {
      index: "05", image: "assets/img/55.webp",
      pt: {
        tags: "Dados · Indicadores · Apoio à Decisão",
        title: "Inteligência Operacional",
        lead: "Transformamos dados operacionais em indicadores, alertas e contexto para apoiar decisões mais rápidas no terreno e na gestão.",
        problemTitle: "Os indicadores chegam tarde.",
        problemBody: "Produção, qualidade, manutenção e custos geram continuamente informação. Mas indicadores chegam tarde, dashboards mostram apenas o passado e a análise depende frequentemente de alguém ligar manualmente os pontos.",
        problemFlow: {inputs: ["ERP", "MES", "SCADA", "Sensores"], core: "Fontes dispersas", outputs: ["Procura manual", "Atrasos"]},
        problems: ["KPIs produzidos manualmente.", "Informação disponível demasiado tarde.", "Dados sem ligação direta a uma decisão.", "Desvios identificados apenas depois do impacto.", "Dashboards que informam, mas não orientam ação."],
        systemTitle: "Dados operacionais transformados em ação.",
        systemBody: "Ligamos informação operacional, criamos indicadores relevantes e acrescentamos alertas, análise e contexto para identificar desvios e apoiar decisões.",
        systemFlow: {inputs: ["ERP", "MES", "SCADA", "Sensores"], core: "Data Layer", outputs: ["KPIs", "Alertas", "Decisões"]},
        system: ["Integração de dados operacionais.", "KPIs e dashboards contextuais.", "Alertas sobre desvios e exceções.", "Análise de padrões e causas prováveis.", "Apoio à decisão baseado em contexto operacional.", "Histórico para comparação e aprendizagem."],
        evidence: [{stat: "~15%", copy: "de capacidade de back-office libertada num caso industrial através de digital performance management.", source: "McKinsey", url: "https://www.mckinsey.com/capabilities/operations/our-insights/the-digital-difference-in-measuring-production-performance"}, {stat: ">10%", copy: "de aumento de throughput reportado no programa industrial analisado pela McKinsey.", source: "McKinsey", url: "https://www.mckinsey.com/capabilities/operations/our-insights/the-digital-difference-in-measuring-production-performance"}, {stat: ">5%", copy: "de redução de custos e também redução superior a 5% no cycle time em diferentes fases do mesmo caso.", source: "McKinsey", url: "https://www.mckinsey.com/capabilities/operations/our-insights/the-digital-difference-in-measuring-production-performance"}],
        note: "São resultados de um caso industrial específico e não representam resultados esperados automaticamente noutras operações.",
        measures: ["Tempo de geração de KPIs", "Tempo entre desvio e deteção", "Tempo entre deteção e ação", "Horas gastas em reporting", "Número de decisões suportadas por dados", "Frequência de desvios recorrentes"],
        outcomes: [{stat: "~50/80%", copy: "de redução no tempo gasto a produzir reporting operacional recorrente."}, {stat: "~30/60%", copy: "de redução no tempo entre ocorrência e deteção de desvios."}, {stat: "~20/40%", copy: "de redução no tempo entre deteção e resposta operacional."}],
        outcomesTitle: "Desvios detetados mais cedo. Decisões mais rápidas.",
        ctaTitle: "Ativar inteligência sobre a operação.",
        cta: "Ativar inteligência operacional",
        outcomesNote: "São objetivos de projeto. O impacto real depende da disponibilidade, frequência e qualidade dos dados operacionais."
      },
      en: {
        tags: "Data · Indicators · Decision Support",
        title: "Operational Intelligence",
        lead: "We turn operational data into indicators, alerts and context to support faster decisions on the shop floor and in management.",
        problemTitle: "Indicators arrive too late.",
        problemBody: "Production, quality, maintenance and cost systems continuously generate information. But indicators arrive late, dashboards mostly describe the past, and analysis often depends on someone manually connecting the dots.",
        problemFlow: {inputs: ["ERP", "MES", "SCADA", "Sensors"], core: "Scattered sources", outputs: ["Manual search", "Delays"]},
        problems: ["KPIs generated manually.", "Information available too late.", "Data disconnected from decisions.", "Deviations discovered after impact.", "Dashboards that inform but do not drive action."],
        systemTitle: "Operational data turned into action.",
        systemBody: "We connect operational information, create relevant indicators and add alerts, analysis and context to identify deviations and support action.",
        systemFlow: {inputs: ["ERP", "MES", "SCADA", "Sensors"], core: "Data Layer", outputs: ["KPIs", "Alerts", "Decisions"]},
        system: ["Operational data integration.", "Contextual KPIs and dashboards.", "Deviation and exception alerts.", "Pattern and probable-cause analysis.", "Context-based decision support.", "Historical comparison and learning."],
        evidence: [{stat: "~15%", copy: "of back-office capacity was freed in an industrial digital performance management case.", source: "McKinsey", url: "https://www.mckinsey.com/capabilities/operations/our-insights/the-digital-difference-in-measuring-production-performance"}, {stat: ">10%", copy: "throughput increase reported in the industrial transformation analyzed by McKinsey.", source: "McKinsey", url: "https://www.mckinsey.com/capabilities/operations/our-insights/the-digital-difference-in-measuring-production-performance"}, {stat: ">5%", copy: "cost reduction, with cycle-time improvements also exceeding 5% in parts of the case.", source: "McKinsey", url: "https://www.mckinsey.com/capabilities/operations/our-insights/the-digital-difference-in-measuring-production-performance"}],
        note: "These are results from a specific industrial case and should not be interpreted as automatic outcomes elsewhere.",
        measures: ["KPI generation time", "Time from deviation to detection", "Time from detection to action", "Reporting hours", "Decisions supported by data", "Frequency of recurring deviations"],
        outcomes: [{stat: "~50–80%", copy: "reduction in time spent generating recurring operational reporting."}, {stat: "~30–60%", copy: "reduction in time between occurrence and detection of deviations."}, {stat: "~20–40%", copy: "reduction in time between detection and operational response."}],
        outcomesTitle: "Earlier detection. Faster decisions.",
        ctaTitle: "Activate intelligence across the operation.",
        cta: "Activate operational intelligence"
      }
    }
  };

  var homeMain = document.querySelector('.home-main');
  var workDetailPage = document.getElementById('workDetailPage');
  function activeWorkSlug(){
    var match = (window.location.hash || '').match(/^#work\/([^/?]+)/);
    if (!match) return '';
    try { return decodeURIComponent(match[1]); } catch(e) { return match[1]; }
  }
  function fillText(id, value){
    var el = document.getElementById(id);
    if (el) el.textContent = value || '';
  }
  function fillList(id, items){
    var list = document.getElementById(id);
    if (!list) return;
    list.textContent = '';
    (items || []).forEach(function(item){
      var li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  }
  var workSchematicObserver = null;
  function queueWorkSchematicReveal(root){
    if (!root) return;
    root.classList.remove('is-visible');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      root.classList.add('is-visible');
      return;
    }
    requestAnimationFrame(function(){
      void root.offsetWidth;
      if (!workSchematicObserver) {
        workSchematicObserver = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            workSchematicObserver.unobserve(entry.target);
          });
        }, {threshold:.28});
      }
      workSchematicObserver.unobserve(root);
      workSchematicObserver.observe(root);
    });
  }
  function renderWorkSchematic(problemFlow, systemFlow){
    var root = document.getElementById('workSystemSchematic');
    if (!root || !problemFlow || !systemFlow) return;
    var locale = currentLang === 'pt' ? 'pt-PT' : 'en-US';
    function editorial(value){
      return String(value || '').toLocaleUpperCase(locale);
    }
    var sources = (problemFlow.inputs || []).slice(0,4);
    var outputs = (systemFlow.outputs || []).slice(0,3);
    root.querySelectorAll('[data-schematic-source]').forEach(function(group){
      var index = Number(group.getAttribute('data-schematic-source'));
      var value = sources[index] || '';
      group.style.display = value ? '' : 'none';
      var text = group.querySelector('text');
      if (text) text.textContent = editorial(value);
    });
    root.querySelectorAll('[data-schematic-output]').forEach(function(group){
      var index = Number(group.getAttribute('data-schematic-output'));
      var value = outputs[index] || '';
      group.style.display = value ? '' : 'none';
      var text = group.querySelector('text');
      if (text) text.textContent = editorial(value);
    });
    root.querySelectorAll('svg').forEach(function(svg){
      svg.querySelectorAll('.schematic-input-lines path').forEach(function(path,index){
        path.style.display = sources[index] ? '' : 'none';
      });
      svg.querySelectorAll('.schematic-output-lines path').forEach(function(path,index){
        path.style.display = outputs[index] ? '' : 'none';
      });
    });
    root.querySelectorAll('[data-schematic-core]').forEach(function(text){
      text.textContent = editorial(systemFlow.core);
    });
    root.setAttribute('aria-label', currentLang === 'pt'
      ? 'Fontes fragmentadas (' + sources.join(', ') + ') ligadas através de ' + systemFlow.core + ' para ' + outputs.join(', ') + '.'
      : 'Fragmented sources (' + sources.join(', ') + ') connected through ' + systemFlow.core + ' to ' + outputs.join(', ') + '.');
    queueWorkSchematicReveal(root);
  }
  function renderWorkCase(slug){
    var item = WORK_CASES[slug];
    if (!item || !workDetailPage) return false;
    var copy = item[currentLang] || item.pt;
    var labels = WORK_DETAIL_LABELS[currentLang] || WORK_DETAIL_LABELS.pt;
    fillText('workDetailBack', '');
    var back = document.getElementById('workDetailBack');
    if (back) back.innerHTML = '<span aria-hidden="true">←</span> ' + labels.allWork;
    fillText('workDetailIndex', item.index);
    fillText('workDetailContext', labels.context);
    fillText('workDetailTitle', copy.title);
    fillText('workDetailLead', copy.lead);
    var image = document.getElementById('workDetailImage');
    if (image) { image.src = item.image; image.alt = copy.title; }
    fillText('workProblemLabel', labels.problem);
    fillText('workProblemTitle', copy.problemTitle);
    fillText('workProblemBody', copy.problemBody);
    fillList('workProblemList', copy.problems);
    fillText('workSystemLabel', labels.system);
    fillText('workSystemTitle', copy.systemTitle);
    fillText('workSystemBody', copy.systemBody);
    renderWorkSchematic(copy.problemFlow, copy.systemFlow);
    fillList('workSystemList', copy.system);
    fillText('workEvidenceLabel', labels.evidence);
    fillText('workEvidenceTitle', labels.evidenceTitle);
    fillText('workEvidenceIntro', copy.evidenceIntro || labels.evidenceIntro);
    fillText('workEvidenceNote', copy.note);
    var evidenceGrid = document.getElementById('workEvidenceGrid');
    if (evidenceGrid) {
      evidenceGrid.textContent = '';
      copy.evidence.forEach(function(evidence){
        var link = document.createElement('a');
        link.className = 'work-evidence-card';
        link.href = evidence.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', evidence.stat + ': ' + evidence.copy + ' (' + evidence.source + ')');
        var stat = document.createElement('strong');
        stat.textContent = evidence.stat;
        var desc = document.createElement('span');
        desc.className = 'work-evidence-copy';
        desc.textContent = evidence.copy;
        var source = document.createElement('span');
        source.className = 'work-evidence-source';
        source.textContent = evidence.source + ' ↗';
        link.appendChild(stat); link.appendChild(desc); link.appendChild(source);
        evidenceGrid.appendChild(link);
      });
    }
    fillText('workMeasuresLabel', labels.measures);
    fillText('workMeasuresTitle', labels.measuresTitle);
    fillText('workMeasuresIntro', copy.measuresIntro || labels.measuresIntro);
    fillList('workMeasuresList', copy.measures);
    fillText('workOutcomesLabel', labels.outcomes);
    fillText('workOutcomesTitle', copy.outcomesTitle || labels.outcomesTitle);
    fillText('workOutcomesIntro', labels.outcomesIntro);
    fillText('workOutcomesNote', copy.outcomesNote || labels.outcomesNote);
    var outcomesGrid = document.getElementById('workOutcomesGrid');
    if (outcomesGrid) {
      outcomesGrid.textContent = '';
      (copy.outcomes || []).forEach(function(outcome){
        var card = document.createElement('article');
        card.className = 'work-outcome-card';
        var stat = document.createElement('strong');
        stat.textContent = outcome.stat;
        var desc = document.createElement('span');
        desc.textContent = outcome.copy;
        card.appendChild(stat);
        card.appendChild(desc);
        outcomesGrid.appendChild(card);
      });
    }
    fillText('workCtaLabel', labels.next);
    fillText('workCtaTitle', copy.ctaTitle);
    var cta = document.getElementById('workCtaLink');
    if (cta) {
      cta.innerHTML = copy.cta + ' <span aria-hidden="true">→</span>';
      cta.setAttribute('data-route-page', '/contact?service=' + encodeURIComponent(slug));
    }
    document.title = copy.title + ' · Vouga Agency';
    setMeta('meta[name="description"]', copy.lead);
    return true;
  }
  function scrollToHomeHash(){
    var hash = window.location.hash || '#top';
    var id = hash.slice(1);
    if (!id || id.indexOf('/') !== -1) return;
    var target = document.getElementById(id);
    if (!target) return;
    var offset = window.matchMedia('(max-width: 820px)').matches ? 66 : 82;
    requestAnimationFrame(function(){
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({top:Math.max(0, top), behavior:'auto'});
    });
  }
  function routeWorkDetail(shouldScroll){
    var slug = activeWorkSlug();
    var active = slug && WORK_CASES[slug] && renderWorkCase(slug);
    if (active) {
      var wasActive = document.body.classList.contains('work-detail-open');
      if (homeMain) homeMain.hidden = true;
      workDetailPage.hidden = false;
      document.body.classList.add('work-detail-open');
      if (!wasActive || shouldScroll !== false) {
        if (shouldScroll !== false && workDetailPage.focus) {
          try { workDetailPage.focus({preventScroll:true}); } catch(e) { workDetailPage.focus(); }
        }
        window.scrollTo({top:0, behavior:'auto'});
      }
      return;
    }
    if (workDetailPage) workDetailPage.hidden = true;
    if (homeMain) homeMain.hidden = false;
    document.body.classList.remove('work-detail-open');
    if (shouldScroll) scrollToHomeHash();
  }
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
      option.classList.toggle('active', active);
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
    document.querySelectorAll('[data-i18n-alt]').forEach(function(el){
      var key = el.getAttribute('data-i18n-alt');
      if (copy[key]) el.setAttribute('alt', copy[key]);
    });
    syncLangToggle(lang);
    if (navBurger) {
      var menuOpen = navBurger.getAttribute('aria-expanded') === 'true';
      navBurger.setAttribute('aria-label', lang === 'en'
        ? (menuOpen ? 'close menu' : 'open menu')
        : (menuOpen ? 'fechar menu' : 'abrir menu'));
    }
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
    routeWorkDetail(false);
  }
  /* Lock hero CTAs to the widest language variant, without adding invisible
     width to the desktop navigation. */
  function lockI18nWidths(){
    var targets = [];
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

  applyLanguage(currentLang);
  window.addEventListener('hashchange', function(){ routeWorkDetail(true); });
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

  /* ===== hero: sparse ASCII contours aligned to the desktop image ===== */
  (function initHeroAsciiOverlay(){
    var canvases = Array.prototype.slice.call(document.querySelectorAll('[data-hero-ascii]'));
    if (!canvases.length) return;

    canvases.forEach(function(canvas){
      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      var mobileMedia = window.matchMedia('(max-width: 820px)');
      var source = new Image();
      var cells = [];
      var palette = canvas.getAttribute('data-palette') || '.:+*%V#A@';
      var mutators = canvas.getAttribute('data-mutators') || '.:%#@&V+=*A';
      var timer = 0;
      var visible = true;

      function clamp(value, min, max){ return Math.max(min, Math.min(max, value)); }
      function luminance(r, g, b){ return .2126 * r + .7152 * g + .0722 * b; }
      function hash(x, y){
        var value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return value - Math.floor(value);
      }
      function pixel(data, width, height, x, y){
        x = clamp(Math.round(x), 0, width - 1);
        y = clamp(Math.round(y), 0, height - 1);
        var index = (y * width + x) * 4;
        return [data[index], data[index + 1], data[index + 2], data[index + 3]];
      }
      function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        var fontSize = parseInt(canvas.getAttribute('data-font-size'), 10) || 12;
        ctx.font = '700 ' + fontSize + 'px "SFMono-Regular", Consolas, "Liberation Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var defaultColor = canvas.getAttribute('data-ascii-color') || '#fff';
        for (var i = 0; i < cells.length; i += 1){
          var cell = cells[i];
          ctx.fillStyle = cell.color || defaultColor;
          ctx.fillText(cell.char, cell.x, cell.y);
        }
      }
      function build(){
        var width = source.naturalWidth;
        var height = source.naturalHeight;
        if (!width || !height) return;

        canvas.width = width;
        canvas.height = height;
        var sample = document.createElement('canvas');
        sample.width = width;
        sample.height = height;
        var sampleCtx = sample.getContext('2d', { willReadFrequently:true });
        sampleCtx.drawImage(source, 0, 0, width, height);
        var data = sampleCtx.getImageData(0, 0, width, height).data;
        var mobile = mobileMedia.matches;
        var fontSize = parseInt(canvas.getAttribute('data-font-size'), 10) || 12;
        var scaleFactor = fontSize / 12;
        var stepMult = parseFloat(canvas.getAttribute('data-step-mult')) || 1;
        var stepX = Math.max(12, Math.round((mobile ? 10 : 9) * scaleFactor * stepMult));
        var stepY = Math.max(14, Math.round((mobile ? 14 : 13) * scaleFactor * stepMult));
        var firstThird = canvas.hasAttribute('data-first-third-only') || canvas.hasAttribute('data-first-third');
        var maxAllowedX = firstThird ? width * 0.38 : width;
        var minDetail = canvas.hasAttribute('data-min-detail') ? parseFloat(canvas.getAttribute('data-min-detail')) : (mobile ? 30 : 28);
        var forceDense = canvas.hasAttribute('data-force-dense');
        var brightOnly = canvas.hasAttribute('data-bright-only');
        var brightThreshold = parseFloat(canvas.getAttribute('data-bright-threshold')) || 155;
        var includeOrange = canvas.hasAttribute('data-include-orange');
        var horizontalSpread = parseInt(canvas.getAttribute('data-horizontal-spread'), 10) || 0;
        var pastelAccent = canvas.getAttribute('data-pastel-accent') || canvas.getAttribute('data-accent-color');
        var defaultColor = canvas.getAttribute('data-ascii-color') || '#fff';
        cells = [];

        for (var y = Math.floor(stepY / 2); y < height; y += stepY){
          for (var x = Math.floor(stepX / 2); x < maxAllowedX; x += stepX){
            var center = pixel(data, width, height, x, y);
            if (center[3] < 28) continue;

            if (brightOnly) {
              var brightness = luminance(center[0], center[1], center[2]);
              var orangeTarget = includeOrange && center[0] > 145 && center[0] > center[1] * 1.35 && center[1] > 28 && center[2] < 135;
              var directTarget = brightness >= brightThreshold || orangeTarget;
              var spreadTarget = false;
              if (!directTarget && horizontalSpread) {
                for (var spread = 1; spread <= horizontalSpread; spread += 1) {
                  var spreadLeft = pixel(data, width, height, x - stepX * spread, y);
                  var spreadRight = pixel(data, width, height, x + stepX * spread, y);
                  var spreadPixels = [spreadLeft, spreadRight];
                  for (var side = 0; side < spreadPixels.length; side += 1) {
                    var neighbour = spreadPixels[side];
                    var neighbourBright = luminance(neighbour[0], neighbour[1], neighbour[2]) >= brightThreshold;
                    var neighbourOrange = includeOrange && neighbour[0] > 145 && neighbour[0] > neighbour[1] * 1.35 && neighbour[1] > 28 && neighbour[2] < 135;
                    if (neighbourBright || neighbourOrange) spreadTarget = true;
                  }
                  if (spreadTarget) break;
                }
              }
              if (!directTarget && !spreadTarget) continue;
              var brightDensity = spreadTarget ? .42 : (orangeTarget ? .82 : clamp((brightness - brightThreshold) / 42, .58, .98));
              if (hash(x * 1.37, y * 2.11) > brightDensity) continue;
              cells.push({
                x:x,
                y:y,
                char:palette.charAt(Math.floor(hash(x * 3.17, y * 4.73) * palette.length)),
                color:defaultColor
              });
              continue;
            }

            var left = pixel(data, width, height, x - stepX, y);
            var right = pixel(data, width, height, x + stepX, y);
            var up = pixel(data, width, height, x, y - stepY);
            var down = pixel(data, width, height, x, y + stepY);
            var horizontal = Math.abs(luminance(left[0], left[1], left[2]) - luminance(right[0], right[1], right[2]));
            var vertical = Math.abs(luminance(up[0], up[1], up[2]) - luminance(down[0], down[1], down[2]));
            var alphaEdge = Math.max(
              Math.abs(center[3] - left[3]),
              Math.abs(center[3] - right[3]),
              Math.abs(center[3] - up[3]),
              Math.abs(center[3] - down[3])
            );
            var detail = Math.sqrt(horizontal * horizontal + vertical * vertical) + alphaEdge * .42;
            if (detail < minDetail) continue;

            var density = forceDense ? 0.95 : (mobile
              ? clamp((detail - 28) / 110, .08, .55)
              : clamp((detail - 25) / 102, .1, .65));
            if (!forceDense && hash(x, y) > density) continue;

            var strength = clamp((detail - 10) / 110, 0, 1);
            var shade = clamp(Math.round(strength * (palette.length - 1)), 0, palette.length - 1);
            var isAccent = pastelAccent && (hash(x * 3.1, y * 7.7) < 0.38);
            cells.push({
              x:x,
              y:y,
              char:palette.charAt(shade),
              color:isAccent ? pastelAccent : defaultColor
            });
          }
        }
        draw();
        canvas.classList.add('is-ready');
      }
      function mutate(){
        if (document.hidden || !visible || !cells.length) return;
        var mutationRate = parseFloat(canvas.getAttribute('data-mutation-rate')) || .045;
        var changes = Math.max(12, Math.floor(cells.length * mutationRate));
        var pastelAccent = canvas.getAttribute('data-pastel-accent') || canvas.getAttribute('data-accent-color');
        var defaultColor = canvas.getAttribute('data-ascii-color') || '#fff';
        for (var i = 0; i < changes; i += 1){
          var cell = cells[Math.floor(Math.random() * cells.length)];
          cell.char = mutators.charAt(Math.floor(Math.random() * mutators.length));
          if (pastelAccent) {
            cell.color = (Math.random() < 0.38) ? pastelAccent : defaultColor;
          }
        }
        draw();
      }

      function loadSource(){
        var nextSource = mobileMedia.matches ? (canvas.getAttribute('data-mobile-src') || canvas.getAttribute('data-src')) : canvas.getAttribute('data-src');
        if (nextSource && source.getAttribute('data-current-src') !== nextSource){
          source.setAttribute('data-current-src', nextSource);
          source.src = nextSource;
        }
      }
      source.onload = function(){
        build();
        var mutationInterval = parseInt(canvas.getAttribute('data-mutation-ms'), 10) || 150;
        if (!reducedMotion && !timer) timer = window.setInterval(mutate, mutationInterval);
      };
      loadSource();
      if (mobileMedia.addEventListener) mobileMedia.addEventListener('change', loadSource);
      else if (mobileMedia.addListener) mobileMedia.addListener(loadSource);

      if ('IntersectionObserver' in window){
        new IntersectionObserver(function(entries){
          visible = entries[0] ? entries[0].isIntersecting : true;
        }, { threshold:0 }).observe(canvas);
      }
      window.addEventListener('pagehide', function(){
        if (timer) window.clearInterval(timer);
      });
    });
  })();

  /* ===== scroll progress ===== */
  var progress = document.getElementById('progress');
  var siteNav = document.querySelector('.nav');
  function syncScrolledNav(){
    if (siteNav) siteNav.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  syncScrolledNav();
  var ticking = false;
  window.addEventListener('scroll', function(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      syncScrolledNav();
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

  /* ===== selected work rail ===== */
  (function(){
    var rail = document.getElementById('useCasesRail');
    var cards = rail ? [].slice.call(rail.querySelectorAll('.use-case-card')) : [];
    var prev = document.getElementById('useCasesPrev');
    var next = document.getElementById('useCasesNext');
    if (!rail || !cards.length || !prev || !next) return;

    var updateQueued = false;

    function cardStep(){
      var card = rail.querySelector('.use-case-card');
      if (!card) return rail.clientWidth;
      var gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    }
    function updateControls(){
      var max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max - 2;
      updateQueued = false;
    }
    function queueUpdate(){
      if (updateQueued) return;
      updateQueued = true;
      requestAnimationFrame(updateControls);
    }
    function move(direction){
      rail.scrollBy({ left:direction * cardStep(), behavior:reducedMotion ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function(){ move(-1); });
    next.addEventListener('click', function(){ move(1); });
    rail.addEventListener('scroll', queueUpdate, { passive:true });
    rail.addEventListener('keydown', function(event){
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    });
    window.addEventListener('resize', queueUpdate);
    updateControls();
  })();

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
  var asciiVisible = true;
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
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function(entries){
      asciiVisible = entries[0] ? entries[0].isIntersecting : true;
    }, { threshold:0 }).observe(asciiEl);
  }
  if (!reducedMotion) {
    setInterval(function(){
      if (document.hidden || !asciiVisible) return;
      var n = Math.max(4, Math.floor(asciiOn.length * 0.05));
      for (var i = 0; i < n; i++) {
        var cell = asciiOn[Math.floor(Math.random() * asciiOn.length)];
        asciiCells[cell[0]][cell[1]] = SYMS[Math.floor(Math.random() * SYMS.length)];
      }
      renderAscii();
    }, 140);
  }

  /* ===== 3D About Sectors Coverflow Carousel ===== */
  (function(){
    var stage = document.getElementById('aboutSectorsStage');
    if (!stage) return;
    var cards = Array.prototype.slice.call(stage.querySelectorAll('.about-sector-card'));
    if (!cards.length) return;

    var count = cards.length;
    var currentAngle = 0;
    var rotationSpeed = 0.003;
    var carouselVisible = true;
    var carouselFrame = 0;

    function animateSolarRotation(){
      carouselFrame = 0;
      if (!carouselVisible) return;
      if (!reducedMotion) currentAngle += rotationSpeed;

      var isMobile = window.innerWidth <= 640;
      var mobileRadius = Math.max(82, Math.min(108, window.innerWidth * 0.27));
      var Rx = isMobile ? mobileRadius : 420;
      var Rz = isMobile ? 82 : 250;

      cards.forEach(function(card, i){
        var cardAngle = currentAngle + (i * 2 * Math.PI / count);
        var sin = Math.sin(cardAngle);
        var cos = Math.cos(cardAngle);

        var normCos = (cos + 1) / 2; // 0 (back) to 1 (front)

        var x = sin * Rx;
        var z = (cos - 1) * Rz; // 0 at front, -2*Rz at back
        var rotY = -sin * (isMobile ? 12 : 26);
        var scale = (isMobile ? 0.76 : 0.7) + (isMobile ? 0.24 : 0.3) * normCos;
        var opacity = (isMobile ? 0.4 : 0.25) + (isMobile ? 0.6 : 0.75) * normCos;
        var brightness = 0.45 + 0.55 * normCos;
        var zIndex = Math.round((cos + 1) * 500);

        card.style.transform = 'translate3d(' + x.toFixed(2) + 'px, 0, ' + z.toFixed(2) + 'px) rotateY(' + rotY.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = isMobile ? 'none' : 'brightness(' + brightness.toFixed(2) + ')';
        card.style.zIndex = zIndex.toString();
        card.style.pointerEvents = 'none';
      });

      if (!reducedMotion) carouselFrame = requestAnimationFrame(animateSolarRotation);
    }

    function startCarousel(){
      if (!carouselFrame) carouselFrame = requestAnimationFrame(animateSolarRotation);
    }
    if ('IntersectionObserver' in window && !reducedMotion) {
      new IntersectionObserver(function(entries){
        carouselVisible = entries[0] ? entries[0].isIntersecting : true;
        if (carouselVisible) startCarousel();
      }, { rootMargin:'120px 0px', threshold:0 }).observe(stage);
    }
    if (reducedMotion) animateSolarRotation();
    else startCarousel();
  })();

})();
