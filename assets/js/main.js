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
    var savedLang = 'en';
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
      'assets/img/vouga_site_re.png',
      'assets/img/vouga_site_re_tele.png',
      'assets/img/avaliacao-interna.png',
      'assets/img/kynex.png',
      'assets/img/OS.png',
      'assets/img/voice.png',
      'assets/img/rag.png'
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
    Promise.all(criticalImages.map(loadImage)).then(revealSite);
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
  var currentLang = 'en';
  try {
    var savedLang = localStorage.getItem('vouga-lang');
    if (savedLang === 'pt' || savedLang === 'en') currentLang = savedLang;
  } catch(e){}
  var langToggle = document.getElementById('langToggle');
  var I18N = {
    pt: {
      logoHome: 'Vouga Agency, início',
      mainNav: 'navegação principal',
      navContact: 'contacto',
      navApproach: 'A Nossa Abordagem',
      navIntervene: 'Modelo Operacional',
      navWork: 'Trabalho',
      navCapabilities: 'Capabilities',
      navServices: 'Serviços',
      talkToUs: 'Falar connosco',
      heroTitle: '<span class="hero-line"><span class="grad">Systems thinking</span> for</span><br><span class="hero-line"><em>business growth</em></span>',
      heroSub: 'Adotamos uma abordagem System-first para identificar onde o software, a automação e a IA podem gerar maior impacto operacional.',
      heroSubMobile: 'Adotamos uma abordagem System-first para identificar<br>onde o software, a automação e a IA<br>podem gerar maior impacto operacional.',
      heroDiagnose: 'Explorar uma oportunidade <span class="arrow">→</span>',
      heroPillars: 'A nossa abordagem',
      navMethod: 'método',
      capabilitiesLabel: 'fundações',
      pillarsKicker: 'fundações',
      pillarIntelDesc: 'IA aplicada ao trabalho que já move o negócio.',
      pillarFoundDesc: 'Da validação e protótipos a produto, software e melhoria contínua.',
      pillarAcademyDesc: 'A preparar quem vai construir o que vem a seguir.',
      explore: 'explorar →',
      seeWorking: 'Descubra o seu sistema <span class="arrow">→</span>',
      whatWeBuild: 'O que construímos',
      whyStoryLabel: 'Why Now',
      whyTitle: '<span class="why-title-line">A tecnologia está a acelerar. </span><span class="why-title-line">O <span class="grad"><em>impacto operacional</em></span> não.</span>',
      whyCopy: 'As empresas estão a experimentar IA mais depressa do que melhoram o seu funcionamento.<br>O software continua a crescer, mas processos fragmentados e baixa adoção continuam a limitar resultados.',
      whyCopyMobile: 'As empresas estão a adotar IA mais rápido do que melhoram as operações. Processos fragmentados e fraca adoção ainda limitam resultados.',
      whyCard1Stat: '67%',
      whyCard1Copy: '2 em cada 3 organizações ainda não escalaram a IA.',
      whyCard1Source: 'McKinsey · 2025',
      whyCard2Stat: '11% → 69%',
      whyCard2Copy: 'Fosso de maturidade digital entre pequenas e grandes empresas.',
      whyCard2Source: 'Eurostat · 2025',
      whyCard3Stat: '+ Produtividade',
      whyCard3Copy: 'A IA já é um motor mensurável de produtividade.',
      whyCard3Source: 'NBER · 2025',
      approachLabel: 'A NOSSA ABORDAGEM',
      approachTitle: '<span class="approach-title-line">Compreender o sistema. </span><span class="approach-title-line">Construir para <span class="grad"><em>evoluir</em></span>.</span>',
      approachSub: 'Na Vouga, system-first significa compreender o sistema<br>antes de introduzir software, automação ou IA.<span class="sub-motto">Compreender. Simplificar. Construir. Medir. Evoluir.</span>',
      approachPhase1Title: 'COMPREENDER',
      approachP1Item1: 'PESSOAS',
      approachP1Item2: 'PROCESSOS',
      approachP1Item3: 'INFORMAÇÃO',
      approachP1Item4: 'TECNOLOGIA',
      approachP1Subtext: 'Ver o sistema tal como ele é.',
      approachPhase2Title: 'DESIGN & CONSTRUÇÃO',
      approachP2Item1: 'REMOVER FRICÇÃO',
      approachP2Item2: 'IDENTIFICAR A ALAVANCA',
      approachP2Item3: 'CONSTRUIR EM CAMADAS',
      approachP2LayersLabel: 'CAMADAS:',
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
      homeServicesLabel: 'serviços',
      homeServicesTitle: 'Conheça os nossos serviços',
      homeServicesIntro: 'Uma visão compacta das áreas de serviço dentro da Vouga Intelligence e da Vouga Engineering.',
      homeServicesIntelTitle: 'Sistemas operacionais de IA',
      homeServicesIntel1: 'Copilotos com IA',
      homeServicesIntel2: 'Plataformas de conhecimento',
      homeServicesIntel3: 'Pesquisa inteligente',
      homeServicesIntel4: 'Assistentes de decisão',
      homeServicesIntel5: 'Automatização de processos',
      homeServicesIntel6: 'Agentes operacionais',
      homeServicesEngTitle: 'Produto e desenvolvimento de software',
      homeServicesEng1: 'Plataformas internas',
      homeServicesEng2: 'Software empresarial',
      homeServicesEng3: 'Portais para clientes',
      homeServicesEng4: 'Dashboards operacionais',
      homeServicesEng5: 'MVPs de produto',
      homeServicesEng6: 'Sistemas CRM',
      homeServicesReadMore: 'Saber mais',
      homeServicesCustom: 'Precisa de ajuda com um serviço específico?',
      homeServicesTalk: 'Falar connosco',
      servicesLabel: 'sistemas para operação',
      servicesTitle: 'O que construímos',
      servicesNum: '01 / agency',
      svc1Name: 'Auditoria de Workflow com IA',
      svc1Desc: 'Mapeamos como o trabalho circula dentro da empresa e identificamos onde a IA pode remover fricção, reduzir desperdício ou aumentar velocidade.',
      svc2Name: 'Sistema de Conhecimento com IA',
      svc2Desc: 'Transformamos documentos, processos e know-how interno disperso numa camada de conhecimento consultável, com respostas citadas.',
      svc3Name: 'Copiloto Comercial com IA',
      svc3Desc: 'Ajudamos equipas comerciais a preparar, escrever e acompanhar oportunidades mais depressa, usando o conhecimento da própria empresa.',
      svc4Name: 'Agente Reunião → Execução',
      svc4Desc: 'Transformamos reuniões em decisões, responsáveis, prazos e próximos passos.',
      svc5Name: 'Auditoria de Governação de IA',
      svc5Desc: 'Descobrimos onde a IA já está a ser usada, que riscos cria e de que regras a empresa precisa antes de alargar o uso.',
      svc6Name: 'Capacitação em IA',
      svc6Desc: 'Preparamos equipas a partir do seu trabalho real, não de prompts genéricos.',
      allServices: '← todos os serviços',
      svcOpen: 'abrir detalhe →',
      methodLabel: 'o método',
      methodTitle: 'Como trabalhamos',
      methodNum: '02 / método',
      step1Label: 'passo 1 · 2 semanas',
      step1Duration: '2 semanas',
      step1Title: '<span>Sprint</span><span>Operacional</span>',
      step1Copy: 'Mapeamos o trabalho real, os bloqueios e onde a IA pode gerar impacto.',
      step2Label: 'passo 2 · 4 a 6 semanas',
      step2Duration: '4 a 6 semanas',
      step2Title: '<span>Construção</span><span>Piloto</span>',
      step2Copy: 'Construímos e testamos a primeira solução com a equipa.',
      step3Label: 'passo 3 · mensal',
      step3Duration: 'Mensal',
      step3Title: '<span>Parceiro</span><span>Operacional</span>',
      step3Copy: 'Melhoramos o que está em produção e avançamos para o próximo problema.',
      useCasesLabel: 'TRABALHOS',
      useCasesTitle: 'Construídos à volta de problemas reais.',
      useCasesIntro: 'Sistemas e produtos selecionados que desenhámos<br>ou construímos em operações, conhecimento e IA.',
      useCasesNavLabel: 'Navegação dos casos de uso',
      useCasesPrev: 'Caso anterior',
      useCasesNext: 'Caso seguinte',
      useCasesRailLabel: 'Trabalho selecionado',
      useCaseLearnMore: 'Saber mais',
      useCaseProblemLabel: 'Problema',
      useCaseInterventionLabel: 'Intervenção',
      useCaseResultLabel: 'Resultado esperado',
      useCaseTargetLabel: 'Impacto-alvo',
      useCase1CardLabel: 'Saber mais sobre Sistema de Conhecimento Estratégico',
      useCase1Tags: 'Sistemas de Conhecimento · Projeto Interno',
      useCase1Title: 'Strategic Knowledge System',
      useCase1Problem: 'O contexto para a tomada de decisão estava disperso por documentos, iniciativas e equipas.',
      useCase1Intervention: 'Um sistema de conhecimento estruturado com pesquisa contextual e respostas fundamentadas em fontes.',
      useCase1Result: 'Acesso mais rápido a contexto pronto para a tomada de decisão.',
      useCase2CardLabel: 'Saber mais sobre Produto de Otimização Energética',
      useCase2Tags: 'Dados & Produto · Projeto de Cliente',
      useCase2Title: 'Energy Optimisation Product',
      useCase2Problem: 'Padrões de consumo e anomalias eram difíceis de compreender ao nível do lar.',
      useCase2Intervention: 'Um produto mobile combinando monitorização, deteção de anomalias e recomendações personalizadas.',
      useCase2Result: 'Decisões de eficiência energética mais claras e rápidas.',
      useCase3CardLabel: 'Saber mais sobre Portal do Colaborador com Copiloto',
      useCase3Tags: 'Operações Internas · Conceito',
      useCase3Title: 'Employee Portal with Copilot',
      useCase3Problem: 'Os colaboradores alternam entre diferentes sistemas para aceder a dados, políticas e benefícios.',
      useCase3Intervention: 'Um portal unificado para colaboradores com pesquisa contextual baseada em informação interna.',
      useCase3Result: 'Mais autonomia e menos pedidos repetitivos.',
      useCase4CardLabel: 'Saber mais sobre Agente de Voz com Memória Contextual',
      useCase4Tags: 'IA Conversacional · Projeto de Cliente',
      useCase4Title: 'Voice Agent with Contextual Memory',
      useCase4Problem: 'O contexto perdia-se entre conversas, gerando preparação repetida e acompanhamento inconsistente.',
      useCase4Intervention: 'Um agente de voz com memória longitudinal e preparação automática para interações futuras.',
      useCase4Result: 'Conversas mais contínuas e acompanhamento mais consistente.',
      useCase5CardLabel: 'Saber mais sobre Workspace de Avaliação de Desempenho',
      useCase5Tags: 'People Operations · Conceito',
      useCase5Title: 'Performance Review Workspace',
      useCase5Problem: 'As avaliações de desempenho dependem de informação fragmentada e processos inconsistentes.',
      useCase5Intervention: 'Um espaço de trabalho partilhado que estrutura evidências, feedback e decisões de avaliação.',
      useCase5Result: 'Avaliações mais consistentes e transparentes.',
      capabilitiesLabel: 'CAPACIDADES',
      capabilitiesTitle: 'O que trazemos a cada intervenção.',
      capabilitiesIntro: 'Um conjunto modular de capacidades desenhado para resolver problemas operacionais e evoluir em camadas.',
      capVisibilityTitle: 'Visibilidade',
      capVisibilityDesc: 'Tornar a capacidade visível, credível e comercialmente apelativa.',
      capVis1: 'Posicionamento',
      capVis2: 'Branding',
      capVis3: 'Websites',
      capVis4: 'SEO & GEO',
      capVis5: 'Materiais Comerciais',
      capOp1: 'Sistemas Operacionais',
      capOp2: 'CRM',
      capOp3: 'Portais',
      capOp4: 'Dashboards',
      capIntel1: 'Sistemas de Conhecimento',
      capIntel2: 'Pesquisa Interna',
      capIntel3: 'Copilotos',
      capIntel4: 'Agentes de IA',
      capIntel5: 'Análise',
      capIntel6: 'Suporte à decisão',
      capabilitiesClosing: 'Cada projeto combina apenas as capacidades que o problema exige.',
      navAbout: 'Sobre',
      aboutLabel: 'SOBRE',
      aboutTitle: 'De uma região industrial. <span class="about-title-mobile-break">Para o seu <span class="grad"><em>próximo capítulo</em></span>.</span>',
      aboutBody: 'Nascidos entre os rios Douro e Vouga, crescemos rodeados de fábricas, produtores e empresas industriais que moldaram a região. Hoje, trabalhamos ao seu lado para modernizar operações através de pensamento sistémico, software e IA.',
      aboutTagline: 'ajudando a próxima geração da indústria a crescer sobre fundações mais sólidas.',
      indTextile: 'Têxtil',
      indFootwear: 'Calçado',
      indMetalworking: 'Metalomecânica',
      indMolds: 'Moldes',
      indMachinery: 'Máquinas Industriais',
      indCork: 'Cortiça',
      indAutomotive: 'Automóvel',
      foundationLabel: 'para além dos serviços',
      foundationSubLabel: 'construções chave-na-mão',
      foundationHeadline: 'Algumas ideias precisam de mais do que aconselhamento. Precisam de ser <em>construídas</em>.',
      foundationCopy: 'Traz-nos a ideia. Nós reduzimos o risco, construímos o essencial e entregamos um produto funcional.',
      foundationScope: 'definição',
      foundationScopeCopy: 'Definir a versão mínima que prova procura real.',
      foundationBuild: 'construção',
      foundationBuildCopy: 'Construir depressa, com arquitetura preparada para crescer.',
      foundationHandover: 'entrega',
      foundationHandoverCopy: 'Código claro, infraestrutura clara, propriedade clara.',
      bringIdea: 'Traz-nos uma ideia <span class="arrow">→</span>',
      systemsChangeTitle: 'Como os Sistemas Evoluem',
      systemsChangeIntro: 'Todas as empresas são sistemas. O crescimento sustentável começa por compreendê-los antes de os transformar.',
      systemsStep1Title: 'Ver o Sistema',
      systemsStep1Copy: 'Todas as decisões começam por compreender o funcionamento do sistema.<br><br>Analisamos pessoas, processos, tecnologia e informação como um único sistema antes de decidir o que deve mudar.',
      systemsStep2Title: 'Identificar o Impacto',
      systemsStep2Copy: 'Nem todos os problemas precisam de uma solução.<br><br>Identificamos as mudanças que geram maior impacto na operação.',
      systemsStep3Title: 'Aplicar a Ferramenta Certa',
      systemsStep3Copy: 'A tecnologia segue o problema, nunca o contrário.<br><br>Escolhemos a abordagem mais adequada ao negócio, seja IA, software, automação ou redesenho de processos.',
      systemsStep4Title: 'Evoluir Continuamente',
      systemsStep4Copy: 'A entrega é o início, não o fim.<br><br>Cada implementação cria a base para a próxima melhoria.',
      contactLabel: 'contacto',
      contactTitle: 'Vamos <em>falar</em>',
      contactCopy: 'Manda-nos o processo mais lento, confuso ou dependente de uma só pessoa. Dizemos-te se vale a pena, mesmo que a resposta seja não.',
      contactDirect: 'Escreve-nos com uma frase sobre o sistema, processo ou ideia que queres desbloquear. Respondemos com o próximo passo mais honesto.',
      contactEmailCta: 'Abrir email <span class="arrow">→</span>',
      footerTalkTitle: 'Vamos <em>conversar</em>',
      nameLabel: 'nome',
      companyLabel: 'empresa',
      messageLabel: 'mensagem',
      consentCopy: 'Aceito que a Vouga use os meus dados para responder a este pedido. Lê a <a href="privacy.html">Política de Privacidade</a>.',
      formNote: 'Usamos os dados do formulário apenas para responder ao teu pedido e avaliar se podemos ajudar. Não envies dados confidenciais de clientes através deste formulário.',
      sendButton: 'Enviar <span class="arrow">→</span>',
      footerTag: 'understand, before building.',
      rights: 'Copyright © 2026 Vouga Agency',
      legalLinks: '<a href="privacy.html">Privacidade</a> · <a href="terms.html">Termos</a>'
    },
    en: {
      logoHome: 'Vouga Agency, home',
      mainNav: 'main navigation',
      navContact: 'contact',
      navApproach: 'Our Approach',
      navIntervene: 'Operating Model',
      navWork: 'Work',
      navCapabilities: 'Capabilities',
      navServices: 'Services',
      talkToUs: 'Contact us',
      heroTitle: '<span class="hero-line"><span class="grad">Systems thinking</span> for</span><br><span class="hero-line"><em>business growth</em></span>',
      heroSub: 'We take a system-first approach to identify where software, automation and AI can create real operational leverage.',
      heroSubMobile: 'We take a system-first approach to identify<br>where software, automation and AI<br>can create real operational leverage.',
      heroDiagnose: 'Explore an opportunity <span class="arrow">→</span>',
      heroPillars: 'Our Approach',
      navMethod: 'method',
      capabilitiesLabel: 'foundations',
      pillarsKicker: 'foundations',
      pillarIntelDesc: 'AI built into the work that already moves the business.',
      pillarFoundDesc: 'From validation and POCs to products and software built to keep evolving.',
      pillarAcademyDesc: 'Developing the people who will build what comes next.',
      explore: 'explore →',
      seeWorking: 'Find your system <span class="arrow">→</span>',
      whatWeBuild: 'What we build',
      whyStoryLabel: 'Why Now',
      whyTitle: '<span class="why-title-line">Technology is accelerating. </span><span class="why-title-line"><span class="grad"><em>Operational impact</em></span> isn’t.</span>',
      whyCopy: 'Companies are experimenting with AI faster than they are improving how they operate.<br>Software keeps growing, but fragmented processes and poor adoption continue to limit results.',
      whyCopyMobile: 'Companies are adopting AI faster than they are improving operations. Fragmented processes and poor adoption still limit results.',
      whyCard1Stat: '67%',
      whyCard1Copy: '2 in 3 organisations have not yet scaled AI.',
      whyCard1Source: 'McKinsey · 2025',
      whyCard2Stat: '11% → 69%',
      whyCard2Copy: 'Digital maturity gap between small and large companies.',
      whyCard2Source: 'Eurostat · 2025',
      whyCard3Stat: '+ Productivity',
      whyCard3Copy: 'AI is already becoming a measurable driver of productivity.',
      whyCard3Source: 'NBER · 2025',
      approachLabel: 'OUR APPROACH',
      approachTitle: '<span class="approach-title-line">Understand the system. </span><span class="approach-title-line">Build what <span class="grad"><em>evolves</em></span>.</span>',
      approachSub: 'At Vouga, a system-first approach means understanding the system<br>before introducing software, automation or AI.<span class="sub-motto">Understand. Simplify. Build. Measure. Evolve.</span>',
      approachPhase1Title: 'UNDERSTAND',
      approachP1Item1: 'PEOPLE',
      approachP1Item2: 'PROCESSES',
      approachP1Item3: 'INFORMATION',
      approachP1Item4: 'TECHNOLOGY',
      approachP1Subtext: 'See the system as it is.',
      approachPhase2Title: 'DESIGN & BUILD',
      approachP2Item1: 'REMOVE FRICTION',
      approachP2Item2: 'FIND LEVERAGE',
      approachP2Item3: 'BUILD IN LAYERS',
      approachP2LayersLabel: 'LAYERS:',
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
      homeServicesLabel: 'services',
      homeServicesTitle: 'Meet our services',
      homeServicesIntro: 'A compact view of the service areas that sit inside Vouga Intelligence and Vouga Engineering.',
      homeServicesIntelTitle: 'Operational AI systems',
      homeServicesIntel1: 'AI copilots',
      homeServicesIntel2: 'Knowledge platforms',
      homeServicesIntel3: 'Internal search',
      homeServicesIntel4: 'Decision assistants',
      homeServicesIntel5: 'Workflow automation',
      homeServicesIntel6: 'Operational agents',
      homeServicesEngTitle: 'Product and software delivery',
      homeServicesEng1: 'Internal platforms',
      homeServicesEng2: 'Business software',
      homeServicesEng3: 'Customer portals',
      homeServicesEng4: 'Operational dashboards',
      homeServicesEng5: 'Product MVPs',
      homeServicesEng6: 'CRM systems',
      homeServicesReadMore: 'Read more',
      homeServicesCustom: 'Need help with a custom service?',
      homeServicesTalk: 'Talk to us',
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
      methodTitle: 'How we work',
      methodNum: '02 / method',
      step1Label: 'step 1 · 2 weeks',
      step1Duration: '2 weeks',
      step1Title: '<span>Operating</span><span>Sprint</span>',
      step1Copy: 'We map the real work, the blockers and where AI can create impact.',
      step2Label: 'step 2 · 4 to 6 weeks',
      step2Duration: '4 to 6 weeks',
      step2Title: '<span>Pilot</span><span>Build</span>',
      step2Copy: 'We build and test the first solution with the team.',
      step3Label: 'step 3 · monthly',
      step3Duration: 'Monthly',
      step3Title: '<span>Operating</span><span>Partner</span>',
      step3Copy: 'We improve what is live and move to the next problem.',
      useCasesLabel: 'WORK',
      useCasesTitle: 'Built around real problems.',
      useCasesIntro: 'Selected systems and products we have<br>designed or built across operations, knowledge and AI.',
      useCasesNavLabel: 'Selected work navigation',
      useCasesPrev: 'Previous case',
      useCasesNext: 'Next case',
      useCasesRailLabel: 'Selected work',
      useCaseLearnMore: 'Learn more',
      useCaseProblemLabel: 'Problem',
      useCaseInterventionLabel: 'Intervention',
      useCaseResultLabel: 'Expected result',
      useCaseTargetLabel: 'Target impact',
      useCase1CardLabel: 'Learn more about Strategic Knowledge System',
      useCase1Tags: 'Knowledge Systems · Internal Project',
      useCase1Title: 'Strategic Knowledge System',
      useCase1Problem: 'Decision-making context was spread across documents, initiatives and teams.',
      useCase1Intervention: 'A structured knowledge system with contextual retrieval and source-backed answers.',
      useCase1Result: 'Faster access to decision-ready context.',
      useCase2CardLabel: 'Learn more about Energy Optimisation Product',
      useCase2Tags: 'Data & Product · Client Project',
      useCase2Title: 'Energy Optimisation Product',
      useCase2Problem: 'Consumption patterns and anomalies were difficult to understand at household level.',
      useCase2Intervention: 'A mobile product combining monitoring, anomaly detection and personalised recommendations.',
      useCase2Result: 'Clearer and faster energy-efficiency decisions.',
      useCase3CardLabel: 'Learn more about Employee Portal with Copilot',
      useCase3Tags: 'Internal Operations · Concept',
      useCase3Title: 'Employee Portal with Copilot',
      useCase3Problem: 'Employees move between different systems to access data, policies and benefits.',
      useCase3Intervention: 'A unified employee portal with contextual search grounded in internal information.',
      useCase3Result: 'More autonomy and fewer repetitive requests.',
      useCase4CardLabel: 'Learn more about Voice Agent with Contextual Memory',
      useCase4Tags: 'Conversational AI · Client Project',
      useCase4Title: 'Voice Agent with Contextual Memory',
      useCase4Problem: 'Context was lost between conversations, creating repeated preparation and inconsistent follow-up.',
      useCase4Intervention: 'A voice agent with longitudinal memory and automatic preparation for future interactions.',
      useCase4Result: 'More continuous conversations and more consistent follow-up.',
      useCase5CardLabel: 'Learn more about Performance Review Workspace',
      useCase5Tags: 'People Operations · Concept',
      useCase5Title: 'Performance Review Workspace',
      useCase5Problem: 'Performance reviews depend on fragmented information and inconsistent processes.',
      useCase5Intervention: 'A shared workspace that structures evidence, feedback and review decisions.',
      useCase5Result: 'More consistent and transparent evaluations.',
      capabilitiesLabel: 'CAPABILITIES',
      capabilitiesTitle: 'What we bring to each intervention.',
      capabilitiesIntro: 'A modular set of capabilities designed to solve operational problems and evolve in layers.',
      capVisibilityTitle: 'Visibility',
      capVisibilityDesc: 'Make capability visible, credible and commercially compelling.',
      capVis2: 'Branding',
      capVis3: 'Websites',
      capVis4: 'SEO & GEO',
      capVis5: 'Commercial Materials',
      capOp1: 'Operative Systems',
      capOp2: 'CRM',
      capOp3: 'Portals',
      capOp4: 'Dashboards',
      capIntel1: 'Knowledge Systems',
      capIntel2: 'Internal Search',
      capIntel3: 'Copilots',
      capIntel4: 'AI Agents',
      capIntel5: 'Analytics',
      capIntel6: 'Decision support',
      capabilitiesClosing: 'Each project combines only the capabilities the problem requires.',
      navAbout: 'About',
      aboutLabel: 'ABOUT',
      aboutTitle: 'From an industrial region. <span class="about-title-mobile-break">For its <span class="grad"><em>next chapter</em></span>.</span>',
      aboutBody: 'Born between the Douro and Vouga rivers, we grew up surrounded by factories, makers and industrial businesses that shaped the region. Today, we work alongside them to modernise operations through systems thinking, software and AI.',
      aboutTagline: 'helping the next generation of industry grow on stronger foundations.',
      indTextile: 'Textile',
      indFootwear: 'Footwear',
      indMetalworking: 'Metalworking',
      indMolds: 'Molds & Plastics',
      indMachinery: 'Industrial Machinery',
      indCork: 'Cork',
      indAutomotive: 'Automotive',
      foundationLabel: 'beyond services',
      foundationSubLabel: 'turnkey builds',
      foundationHeadline: 'Some ideas deserve more than advice. They need to be <em>built</em>.',
      foundationCopy: 'You bring the idea. We reduce the risk, build what matters and hand over a working product.',
      foundationScope: 'scope',
      foundationScopeCopy: 'Define the smallest version that proves demand.',
      foundationBuild: 'build',
      foundationBuildCopy: 'Build fast, but with architecture that can survive.',
      foundationHandover: 'handover',
      foundationHandoverCopy: 'Clear code, clear infrastructure, clear ownership.',
      bringIdea: 'Bring us an idea <span class="arrow">→</span>',
      systemsChangeTitle: 'How Systems Change',
      systemsChangeIntro: 'Every company is a system. Sustainable growth comes from understanding it before changing it.',
      systemsStep1Title: 'See the System',
      systemsStep1Copy: 'Every decision starts with understanding how the system works.<br><br>We analyse people, processes, technology and information as one connected system before deciding what should change.',
      systemsStep2Title: 'Find the Leverage',
      systemsStep2Copy: 'Not every problem deserves a solution.<br><br>We identify the few changes that produce the greatest operational impact.',
      systemsStep3Title: 'Apply the Right Tool',
      systemsStep3Copy: 'Technology follows the problem, never the other way around.<br><br>We choose the approach that best fits the business, whether that means AI, software, automation or process redesign.',
      systemsStep4Title: 'Keep Improving',
      systemsStep4Copy: 'Delivery is the beginning, not the end.<br><br>Every implementation becomes the foundation for the next improvement.',
      contactLabel: 'contact',
      contactTitle: "Let's <em>talk</em>",
      contactCopy: 'Send us your slowest, messiest, most one-person-dependent process. We\'ll tell you if it\'s worth it, even if the answer is no.',
      contactDirect: 'Write us one sentence about the system, process or idea you want to unlock. We will reply with the most honest next step.',
      contactEmailCta: 'Open email <span class="arrow">→</span>',
      footerTalkTitle: 'Let’s <em>talk</em>',
      nameLabel: 'name',
      companyLabel: 'company',
      messageLabel: 'message',
      consentCopy: 'I agree that Vouga may use my details to reply to this enquiry. Read the <a href="privacy.html">Privacy Policy</a>.',
      formNote: 'We use contact form details only to respond to your enquiry and evaluate whether we can help. Do not send confidential client data through this form.',
      sendButton: 'Send <span class="arrow">→</span>',
      footerTag: 'understand, before building.',
      rights: 'Copyright © 2026 Vouga Agency',
      legalLinks: '<a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a>'
    }
  };
  var META_COPY = {
    pt: {
      title: 'Vouga Agency · Transformação sistémica e produto',
      description: 'A Vouga é uma empresa de transformação sistémica e produto. Encontramos a origem de problemas complexos de negócio e entregamos a mudança certa através de estratégia, software, IA e execução.',
      keywords: 'transformação sistémica, empresa de produto, transformação de negócio, estratégia de produto, desenvolvimento de software, IA aplicada, sistemas de IA, sistemas empresariais, execução, Vouga Agency, Porto, Portugal',
      socialTitle: 'Vouga Agency · Transformação sistémica e produto',
      socialDescription: 'Encontramos a origem de problemas complexos de negócio e entregamos a mudança certa através de estratégia, software, IA e execução.',
      imageAlt: 'Identidade visual da Vouga Agency para transformação sistémica, software, IA e execução.',
      locale: 'pt_PT'
    },
    en: {
      title: 'Vouga Agency · Systems-led transformation and product company',
      description: 'Vouga is a systems-led transformation and product company. We find the source of complex business problems and deliver the right change through strategy, software, AI and execution.',
      keywords: 'systems-led transformation, product company, business transformation, product strategy, software delivery, applied AI, AI systems, business systems, operational transformation, Portugal product company, Porto product company, Vouga Agency',
      socialTitle: 'Vouga Agency · Systems-led transformation and product company',
      socialDescription: 'We find the source of complex business problems and deliver the right change through strategy, software, AI and execution.',
      imageAlt: 'Vouga Agency visual identity for systems-led transformation, software, AI and execution.',
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
    if (typeof SERVICE_COPY !== 'undefined') SERVICES = SERVICE_COPY[lang] || SERVICE_COPY.pt;
    if (typeof drawWhyMark === 'function' && whySec && whyCanvas && whyBox) drawWhyMark();
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
      var palette = '.:+*%V#A@';
      var mutators = '.:%#@&V+=*A';
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
        var pastelAccent = canvas.getAttribute('data-pastel-accent') || canvas.getAttribute('data-accent-color');
        var defaultColor = canvas.getAttribute('data-ascii-color') || '#fff';
        cells = [];

        for (var y = Math.floor(stepY / 2); y < height; y += stepY){
          for (var x = Math.floor(stepX / 2); x < maxAllowedX; x += stepX){
            var center = pixel(data, width, height, x, y);
            if (center[3] < 28) continue;

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
      }
      function mutate(){
        if (document.hidden || !visible || !cells.length) return;
        var changes = Math.max(12, Math.floor(cells.length * .045));
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
        if (!reducedMotion && !timer) timer = window.setInterval(mutate, 150);
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

  (function initSystemsAsciiMutation(){
    var nodes = Array.prototype.slice.call(document.querySelectorAll('.systems-ascii'));
    if (!nodes.length || reducedMotion) return;
    var palettes = [
      ['%','#','@','&','*','+','=',':','.'],
      ['#','@','%','+','*','-','=',':','.'],
      ['@','%','#','&','+','=','*','/','.'],
      ['%','@','#','*','+','=','.',':','-']
    ];
    var timers = [];
    function mutate(base, palette, seed, tick){
      var out = '';
      for (var i = 0; i < base.length; i += 1) {
        var ch = base.charAt(i);
        if (/\s/.test(ch)) { out += ch; continue; }
        var idx = (i * 11 + tick * 7 + seed * 5 + Math.floor(Math.random() * palette.length)) % palette.length;
        out += palette[idx];
      }
      return out;
    }
    nodes.forEach(function(node, i){
      var base = node.textContent;
      var palette = palettes[i % palettes.length];
      var tick = 0;
      timers.push(window.setInterval(function(){
        tick += 1;
        node.textContent = mutate(base, palette, i + 1, tick);
      }, 180 + (i * 25)));
    });
    window.addEventListener('pagehide', function(){
      timers.forEach(function(timer){ window.clearInterval(timer); });
    });
  })();

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
    function setCardOpen(card, open){
      card.classList.toggle('is-flipped', open);
      card.setAttribute('aria-pressed', open ? 'true' : 'false');
    }
    cards.forEach(function(card){
      card.addEventListener('click', function(){
        setCardOpen(card, !card.classList.contains('is-flipped'));
      });
      card.addEventListener('keydown', function(event){
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        setCardOpen(card, !card.classList.contains('is-flipped'));
      });
    });
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
    var systemWord = document.getElementById('orbitSystem');
    var nodes = orbit ? [].slice.call(orbit.querySelectorAll('.orbit-node')) : [];
    var blobs = orbit ? [].slice.call(orbit.querySelectorAll('.orbit-blob')) : [];
    if (nodes.length < 3) return;

    var CARDS_READY_KEY = 'vouga-pillars-cards-ready';
    var ANG = [180, 60, 300];           /* ellipse angles (deg): intelligence, foundations, academy */
    var enabled = false, running = false, done = false;
    var dispP = 0, targetP = 0, W = 0, Hh = 0;

    function markCardsReady(){
      try { sessionStorage.setItem(CARDS_READY_KEY, '1'); } catch(e){}
    }
    function hasCardsReady(){
      try { return sessionStorage.getItem(CARDS_READY_KEY) === '1'; } catch(e){ return false; }
    }
    function isCapabilityLink(link){
      if (!link) return false;
      var href = link.getAttribute('href') || '';
      return /(?:^|\/)(?:intelligence|foundations|academy)\.html(?:$|[#?])/.test(href);
    }
    orbit.addEventListener('click', function(e){
      var link = e.target.closest ? e.target.closest('a') : null;
      if (isCapabilityLink(link)) markCardsReady();
    });

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
      if (p < 0.82) return lerp(0, 240, easeIO(seg(p, 0.06, 0.82)));
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
      var handoffOut = 1 - easeIO(seg(p, 0.84, 0.93));
      var handoffBlur = (1 - handoffOut) * 12;
      var systemIn = easeIO(seg(p, 0.10, 0.25));
      var systemOut = 1 - easeIO(seg(p, 0.70, 0.87));
      var systemVisible = systemIn * systemOut * handoffOut;

      if (kicker) kicker.style.opacity = '1';
      if (systemWord){
        systemWord.style.opacity = (systemVisible * 0.78).toFixed(3);
        systemWord.style.filter = systemVisible > 0.02 ? 'blur(' + ((1 - systemVisible) * 13).toFixed(1) + 'px)' : 'blur(14px)';
        systemWord.style.transform = 'translate(-50%,-50%) scale(' + lerp(0.94, 1, systemVisible).toFixed(3) + ')';
      }

      var angs = [ANG[0] + R, ANG[1] + R, ANG[2] + R];
      if (svg){
        svg.style.opacity = ((0.14 + appear * 0.86) * handoffOut).toFixed(3);
        path.setAttribute('d', ellipseD(g, 1, angs));
        for (var q = 0; q < pulls.length; q++){
          pulls[q].setAttribute('d', ellipseArcD(g, 1, angs[q]));
          pulls[q].style.opacity = ((0.035 + appear * 0.515) * handoffOut).toFixed(3);
        }
      }

      for (var i = 0; i < 3; i++){
        var a = angs[i] * Math.PI / 180;
        var x = g.cx + g.rx * Math.cos(a), y = g.cy + g.ry * Math.sin(a);
        var focus = smoothstep(Math.max(0, 1 - angleDiff(angs[i], 180) / 105));
        var activeOrbit = focus > 0.52;
        var sc = lerp(0.62, 1, focus);
        var ambientOpacity = lerp(0.14, 0.42, appear);
        var opOrbit = lerp(ambientOpacity, 1, focus);
        var blur = i === 0 ? 0 : (1 - appear) * 9;
        setNode(i, x, y, sc, opOrbit * handoffOut, Math.max(blur, handoffBlur));
        nodes[i].classList.toggle('is-active', activeOrbit);
        nodes[i].style.setProperty('--desc-open', focus.toFixed(3));
        var bl = blobs[i];
        if (bl){
          bl.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%)';
          bl.style.opacity = ((0.012 + appear * 0.988) * lerp(0.035, 0.11, focus) * handoffOut).toFixed(3);
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
      targetP = rawP();                          /* reversible until the cards are finalized */
      dispP += (targetP - dispP) * 0.055;        /* slower, heavier easing */
      var settled = Math.abs(targetP - dispP) < 0.0006;
      if (settled) dispP = targetP;
      render(dispP);
      if (dispP >= 0.93){ finalizeCards(); return; }
      if (settled){ running = false; return; }   /* idle until next scroll */
      requestAnimationFrame(loop);
    }
    function kick(){ if (enabled && !running){ running = true; requestAnimationFrame(loop); } }
    function finalizeCards(){
      enabled = false; running = false; done = true;
      markCardsReady();
      dispP = 1; targetP = 1;
      var orbitTop = orbit.getBoundingClientRect().top;
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
      if (systemWord){ systemWord.style.opacity = ''; systemWord.style.filter = ''; systemWord.style.transform = ''; }
      var layoutShift = orbit.getBoundingClientRect().top - orbitTop;
      if (Math.abs(layoutShift) > 0.5) {
        var previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollBy(0, layoutShift);
        root.style.scrollBehavior = previousScrollBehavior;
      }
      window.setTimeout(function(){ section.classList.remove('is-blur-in'); }, 1400);
    }
    function showCardsImmediately(){
      enabled = false; running = false; done = true;
      dispP = 1; targetP = 1;
      section.classList.remove('is-orbit', 'is-blur-in');
      section.classList.add('is-cards');
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
      if (systemWord){ systemWord.style.opacity = ''; systemWord.style.filter = ''; systemWord.style.transform = ''; }
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
      if (systemWord){ systemWord.style.opacity = ''; systemWord.style.filter = ''; systemWord.style.transform = ''; }
    }
    function evaluate(){
      if (hasCardsReady() && (window.location.hash === '#pillars' || window.location.hash === '#capabilities')) {
        showCardsImmediately();
        return;
      }
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

  /* ============================================================
     Why mark: dotted frame around "Vouga", dots fading out and
     spreading apart as they travel away from the word
  ============================================================ */
  var whySec = document.querySelector('.why');
  var whyCanvas = document.getElementById('whyCanvas');
  var whyBox = document.getElementById('whyBox');
  var wCtx = whyCanvas ? whyCanvas.getContext('2d') : null;

  function offsetWithin(el, anc){
    var x = 0, y = 0;
    while (el && el !== anc) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return [x, y];
  }

  function drawWhyMark(){
    if (!whySec || !whyCanvas || !whyBox || !wCtx) return;
    var W = whySec.clientWidth, H = whySec.clientHeight;
    whyCanvas.width = W; whyCanvas.height = H;
    var col = getComputedStyle(root).getPropertyValue('--text').trim() || '#1a1813';
    var o = offsetWithin(whyBox, whySec);
    var bx = o[0], by = o[1], bw = whyBox.offsetWidth, bh = whyBox.offsetHeight;
    whySec.style.setProperty('--why-line-top', by + 'px');
    whySec.style.setProperty('--why-line-bottom', (by + bh) + 'px');
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
      talk: 'Falar connosco <span class="arrow">→</span>'
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

  if (svcOverlay && ovBody && ovNum && ovBack) {
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
    h += '<div class="ov-ctas"><a class="btn btn-primary" href="#contact" data-route-page="contact.html" data-ov-close>' + oc.talk + '</a>';
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
  }

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

  /* ===== 3D About Sectors Coverflow Carousel ===== */
  (function(){
    var stage = document.getElementById('aboutSectorsStage');
    if (!stage) return;
    var cards = Array.prototype.slice.call(stage.querySelectorAll('.about-sector-card'));
    var prevBtn = document.getElementById('sectorPrev');
    var nextBtn = document.getElementById('sectorNext');
    var dotsWrap = document.getElementById('sectorDots');
    if (!cards.length) return;

    var count = cards.length;
    var currentAngle = 0;
    var rotationSpeed = 0.003; // Smooth, slow continuous rotation like a revolving sun

    function animateSolarRotation(){
      currentAngle += rotationSpeed;

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

      requestAnimationFrame(animateSolarRotation);
    }

    // Start 60fps continuous solar rotation
    animateSolarRotation();
  })();

})();
