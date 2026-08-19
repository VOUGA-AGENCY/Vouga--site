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
      navCapabilities: 'Capabilities',
      navServices: 'Serviços',
      talkToUs: 'Falar connosco',
      heroTitle: '<span class="hero-line"><strong class="hero-bold">Crescimento operacional</strong></span><br><span class="hero-line">através do <em>pensamento sistémico.</em></span>',
      heroSub: 'Ajudamos o tecido industrial a construir operações mais sólidas através de uma abordagem system-first à adoção de software, automação e IA.',
      heroSubMobile: 'Ajudamos o tecido industrial a construir operações mais sólidas através de uma abordagem system-first à adoção de software, automação e IA.',
      heroDiagnose: 'Explorar uma oportunidade <span class="arrow">→</span>',
      heroPillars: 'A nossa abordagem',
      heroApproachCta: '&gt;&nbsp; a nossa&nbsp;<strong>abordagem</strong>',
      heroModelCta: '&gt;&nbsp; <strong>o que fazemos</strong>',
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
      whyTitle: '<span class="why-title-line">O fosso da IA começa </span><span class="why-title-line"><span class="grad"><em>antes da IA.</em></span></span>',
      whyCopy: 'As empresas mais avançadas não têm apenas melhores modelos. Têm melhores dados, maior<br>integração, processos mais claros e capacidade interna para transformar tecnologia em execução.<br><br>Enquanto a IA acelera, a diferença entre experimentar e operacionalizar continua a aumentar.',
      whyCopyMobile: 'As empresas mais avançadas têm melhores dados, maior integração e processos mais claros. Enquanto a IA acelera, a diferença entre experimentar e operacionalizar continua a aumentar.',
      whyCard1Stat: '20%',
      whyCard1Copy: 'das empresas da UE utilizavam IA em 2025.',
      whyCard1Source: 'Eurostat · 2025',
      whyCard2Stat: '73% vs. 98%',
      whyCard2Copy: 'Intensidade digital básica nas PME e grandes empresas.',
      whyCard2Source: 'Eurostat · 2025',
      whyCard3Stat: '28% vs. 79%',
      whyCard3Copy: 'Análise interna de dados nas pequenas e grandes empresas.',
      whyCard3Source: 'Eurostat · 2025',
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
      useCasesTitle: 'Construídos à volta de <br class="br-mobile">problemas reais.',
      useCasesIntro: 'Vê como transformamos problemas operacionais em vantagem mensurável.',
      useCasesNavLabel: 'Navegação dos casos de uso',
      useCasesPrev: 'Caso anterior',
      useCasesNext: 'Caso seguinte',
      useCasesRailLabel: 'Trabalho selecionado',
      useCaseLearnMore: 'Ver trabalho',
      useCaseProblemLabel: 'Problema',
      useCaseInterventionLabel: 'Intervenção',
      useCaseResultLabel: 'Resultado esperado',
      useCaseTargetLabel: 'Impacto-alvo',
      useCase1CardLabel: 'Ver Centro Integrado de Operações Industriais',
      useCase1Tags: 'Sistemas Operacionais · Dashboards · Integrações',
      useCase1Title: 'Centro Integrado de Operações Industriais',
      useCase1Problem: 'A informação de produção, manutenção e qualidade estava fragmentada entre ferramentas e folhas de cálculo.',
      useCase1Intervention: 'Um hub operacional integrado que liga workflows, dashboards e os principais sistemas industriais.',
      useCase1Result: 'Visibilidade operacional partilhada, coordenação mais rápida e menos passagens manuais.',
      useCase2CardLabel: 'Ver Inteligência de Produção e Energia',
      useCase2Tags: 'Dashboards · Dados · Apoio à Decisão',
      useCase2Title: 'Inteligência de Produção e Energia',
      useCase2Problem: 'O desempenho da produção, as paragens e o consumo de energia eram analisados separadamente e demasiado tarde.',
      useCase2Intervention: 'Uma camada de apoio à decisão que combina dados industriais, dashboards em tempo real, tendências e alertas operacionais.',
      useCase2Result: 'Decisões mais rápidas sobre eficiência, utilização de energia e capacidade produtiva.',
      useCase3CardLabel: 'Ver Sistema de Conhecimento Técnico',
      useCase3Tags: 'Sistemas de Conhecimento · Pesquisa Interna · Copilotos',
      useCase3Title: 'Sistema de Conhecimento Técnico',
      useCase3Problem: 'Manuais, procedimentos e conhecimento de resolução de problemas estavam dispersos e dependentes de poucos especialistas.',
      useCase3Intervention: 'Um sistema de conhecimento técnico fundamentado em fontes, com pesquisa interna e um copiloto contextual.',
      useCase3Result: 'Resolução mais rápida de problemas, execução mais consistente e preservação do conhecimento técnico.',
      useCase4CardLabel: 'Ver Sistema Comercial e de Orçamentação',
      useCase4Tags: 'CRM · Automação · IA',
      useCase4Title: 'Sistema Comercial e de Orçamentação',
      useCase4Problem: 'Pedidos, preços e informação técnica circulavam manualmente entre as equipas comercial e de engenharia, atrasando propostas.',
      useCase4Intervention: 'Um workflow integrado de CRM que usa automação e IA para reunir contexto, preparar propostas e coordenar aprovações.',
      useCase4Result: 'Respostas mais rápidas, maior rastreabilidade e propostas mais consistentes.',
      useCase5CardLabel: 'Ver Sistema de Conhecimento Estratégico',
      useCase5Tags: 'Sistemas de Conhecimento · Pesquisa Interna',
      useCase5Title: 'Sistema de Conhecimento Estratégico',
      useCase5Problem: 'O contexto estratégico estava disperso por documentos, iniciativas e equipas.',
      useCase5Intervention: 'Um sistema de conhecimento estruturado com pesquisa interna contextual e respostas fundamentadas em fontes.',
      useCase5Result: 'Acesso mais rápido a contexto fiável e pronto para apoiar decisões em toda a organização.',
      useCase6CardLabel: 'Ver Agente de Voz com Memória Contextual',
      useCase6Tags: 'Copilotos · Agentes de IA',
      useCase6Title: 'Agente de Voz com Memória Contextual',
      useCase6Problem: 'O contexto perdia-se entre conversas, gerando preparação repetida e acompanhamento inconsistente.',
      useCase6Intervention: 'Um agente de voz com memória longitudinal, pesquisa contextual e preparação automática para interações futuras.',
      useCase6Result: 'Conversas mais contínuas, menos trabalho repetitivo e acompanhamento mais consistente.',
      capabilitiesLabel: 'CAPACIDADES',
      capabilitiesTitle: 'O que trazemos a cada intervenção.',
      capabilitiesIntro: 'Um conjunto modular de capacidades desenhado para resolver problemas operacionais e evoluir em camadas.',
      capVisibilityTitle: 'Visibilidade',
      capVisibilityDesc: 'Tornar a capacidade visível, credível e comercialmente apelativa.',
      capVis1: 'Posicionamento & Branding',
      capVis2: 'Branding',
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
      capIntel5: 'Análise',
      capIntel6: 'Suporte à decisão',
      capabilitiesClosing: 'Cada projeto combina apenas as capacidades que o problema exige.',
      navAbout: 'Sobre',
      aboutLabel: 'SOBRE',
      aboutTitle: 'De uma região industrial. <span class="about-title-mobile-break">Para o seu <span class="grad"><em>próximo capítulo</em></span>.</span>',
      aboutBody: 'Nascidos entre os rios Douro e Vouga, crescemos rodeados de fábricas, produtores e empresas industriais que moldaram a região. Hoje, trabalhamos ao seu lado para modernizar operações através de pensamento sistémico, software e IA.',
      aboutTagline: 'A ajudar a próxima geração da indústria a crescer sobre fundações mais sólidas.',
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
      contactLabel: 'contactar',
      contactTitle: 'Vamos <em>falar</em>',
      contactCopy: 'Manda-nos o processo mais lento, confuso ou dependente de uma só pessoa. Dizemos-te se vale a pena, mesmo que a resposta seja não.',
      contactDirect: 'Escreve-nos com uma frase sobre o sistema, processo ou ideia que queres desbloquear. Respondemos com o próximo passo mais honesto.',
      contactEmailCta: 'Abrir email <span class="arrow">→</span>',
      footerTalkTitle: '<span>Vamos</span><em>conversar</em>',
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
      navApproach: 'Approach',
      navIntervene: 'Model',
      navWork: 'Work',
      navCapabilities: 'Capabilities',
      navServices: 'Services',
      talkToUs: 'Contact us',
      heroTitle: '<span class="hero-line">Driving <strong class="hero-bold">business growth</strong></span><br><span class="hero-line">through <em>systems thinking</em></span>',
      heroSub: 'We help industrial companies build stronger operations through a system-first approach to software, automation and AI.',
      heroSubMobile: 'We help industrial companies build stronger operations through a system-first approach to software, automation and AI.',
      heroDiagnose: 'Explore an opportunity <span class="arrow">→</span>',
      heroPillars: 'Our Approach',
      heroApproachCta: '&gt;&nbsp; our&nbsp;<strong>approach</strong>',
      heroModelCta: '&gt;&nbsp; <strong>what we do</strong>',
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
      whyTitle: '<span class="why-title-line">The AI gap starts </span><span class="why-title-line"><span class="grad"><em>before AI.</em></span></span>',
      whyCopy: 'The most advanced companies do not just have better models. They have better data,<br>stronger integration, clearer processes and the internal capacity to turn technology into execution.<br><br>As AI accelerates, the gap between experimenting and operationalising continues to grow.',
      whyCopyMobile: 'The most advanced companies have better data, stronger integration and clearer processes. As AI accelerates, the gap between experimenting and operationalising continues to grow.',
      whyCard1Stat: '20%',
      whyCard1Copy: 'of EU enterprises used AI in 2025.',
      whyCard1Source: 'Eurostat · 2025',
      whyCard2Stat: '73% vs. 98%',
      whyCard2Copy: 'Basic digital intensity in SMEs and large enterprises.',
      whyCard2Source: 'Eurostat · 2025',
      whyCard3Stat: '28% vs. 79%',
      whyCard3Copy: 'In-house data analytics in small and large enterprises.',
      whyCard3Source: 'Eurostat · 2025',
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
      useCasesIntro: 'See how we turn operational problems into systems that create measurable leverage.',
      useCasesNavLabel: 'Selected work navigation',
      useCasesPrev: 'Previous case',
      useCasesNext: 'Next case',
      useCasesRailLabel: 'Selected work',
      useCaseLearnMore: 'View work',
      useCaseProblemLabel: 'Problem',
      useCaseInterventionLabel: 'Intervention',
      useCaseResultLabel: 'Expected result',
      useCaseTargetLabel: 'Target impact',
      useCase1CardLabel: 'View Industrial Operations Hub',
      useCase1Tags: 'Operational Systems · Dashboards · Integrations',
      useCase1Title: 'Industrial Operations Hub',
      useCase1Problem: 'Production, maintenance and quality information was fragmented across tools and spreadsheets.',
      useCase1Intervention: 'An integrated operations hub connecting workflows, dashboards and core industrial systems.',
      useCase1Result: 'Shared operational visibility, faster coordination and fewer manual handoffs.',
      useCase2CardLabel: 'View Production & Energy Intelligence',
      useCase2Tags: 'Dashboards · Data · Decision Support',
      useCase2Title: 'Production & Energy Intelligence',
      useCase2Problem: 'Production performance, downtime and energy consumption were reviewed separately and too late.',
      useCase2Intervention: 'A decision-support layer combining industrial data, live dashboards, trends and operational alerts.',
      useCase2Result: 'Faster decisions on efficiency, energy use and production capacity.',
      useCase3CardLabel: 'View Technical Knowledge System',
      useCase3Tags: 'Knowledge Systems · Internal Search · Copilots',
      useCase3Title: 'Technical Knowledge System',
      useCase3Problem: 'Manuals, procedures and troubleshooting know-how were dispersed and dependent on a few experts.',
      useCase3Intervention: 'A source-backed technical knowledge system with internal search and a contextual copilot.',
      useCase3Result: 'Faster issue resolution, more consistent execution and preserved technical know-how.',
      useCase4CardLabel: 'View Commercial & Quotation System',
      useCase4Tags: 'CRM · Automation · AI',
      useCase4Title: 'Commercial & Quotation System',
      useCase4Problem: 'Enquiries, pricing and technical inputs moved manually between sales and engineering, slowing quotations.',
      useCase4Intervention: 'An integrated CRM workflow using automation and AI to assemble context, draft quotations and coordinate approval.',
      useCase4Result: 'Faster response times, stronger traceability and more consistent quotations.',
      useCase5CardLabel: 'View Strategic Knowledge System',
      useCase5Tags: 'Knowledge Systems · Internal Search',
      useCase5Title: 'Strategic Knowledge System',
      useCase5Problem: 'Strategic context was spread across documents, initiatives and teams.',
      useCase5Intervention: 'A structured knowledge system with contextual internal search and source-backed answers.',
      useCase5Result: 'Faster access to reliable, decision-ready context across the organisation.',
      useCase6CardLabel: 'View Voice Agent with Contextual Memory',
      useCase6Tags: 'Copilots · AI Agents',
      useCase6Title: 'Voice Agent with Contextual Memory',
      useCase6Problem: 'Context was lost between conversations, creating repeated preparation and inconsistent follow-up.',
      useCase6Intervention: 'A voice agent with longitudinal memory, contextual retrieval and automatic preparation for future interactions.',
      useCase6Result: 'More continuous conversations, less repetitive work and more consistent follow-up.',
      capabilitiesLabel: 'CAPABILITIES',
      capabilitiesTitle: 'What we bring to each intervention.',
      capabilitiesIntro: 'A modular set of capabilities designed to solve operational problems and evolve in layers.',
      capVisibilityTitle: 'Visibility',
      capVisibilityDesc: 'Make capability visible, credible and commercially compelling.',
      capVis1: 'Positioning & Branding',
      capVis2: 'Branding',
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
      footerTalkTitle: '<span class="single-line">Let’s <em>talk</em></span>',
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
  var WORK_DETAIL_LABELS = {
    pt: {
      allWork: 'Todos os trabalhos', problem: 'O problema', system: 'O que construímos',
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
      allWork: 'All work', problem: 'The problem', system: 'What we build',
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
    'centro-operacoes-industriais': {
      index: '01', image: 'assets/img/11.png',
      pt: {
        tags: 'Sistemas Operacionais · Dashboards · Integrações',
        title: 'Centro Integrado de Operações Industriais',
        lead: 'Centralizamos produção, manutenção e qualidade num sistema operacional que liga informação, workflows e decisões.',
        problemTitle: 'A informação existe.\nA operação continua fragmentada.',
        problemBody: 'Produção, manutenção e qualidade vivem em sistemas e rotinas diferentes. A visão global depende de consolidar informação manualmente e reconciliar versões da realidade.',
        problemFlow: {inputs:['ERP','Excel','SCADA','Email'], core:'Consolidação manual', outputs:['Relatório tardio','BI isolado']},
        problems: ['Informação fragmentada entre ERP, folhas de cálculo e ferramentas isoladas.', 'Equipas a trabalhar com versões diferentes da realidade.', 'Consolidação manual e decisões tardias.', 'Falta de visibilidade transversal sobre a operação.'],
        systemTitle: 'Um centro operacional que liga dados, workflows e decisões.',
        systemBody: 'Construímos uma camada operacional sobre os sistemas existentes, reunindo indicadores, alertas, responsabilidades e histórico num único ponto de trabalho.',
        systemFlow: {inputs:['ERP','SCADA','Manutenção','Qualidade'], core:'Operations Hub', outputs:['Alertas','Workflows','Decisões']},
        system: ['Integração com ERP e sistemas existentes.', 'Dashboards por unidade, linha ou processo.', 'Workflows, alertas e responsabilidades.', 'Histórico e rastreabilidade operacional.', 'Informação pronta para apoiar decisões.'],
        evidence: [
          {stat:'53%', copy:'das empresas da UE utilizavam ERP, CRM ou BI em 2025.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1'},
          {stat:'46%', copy:'das empresas utilizavam ERP para integrar informação e recursos.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/22286.pdf?v=8346100741086513'},
          {stat:'41% vs. 89%', copy:'adoção de ERP nas pequenas e grandes empresas.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1'}
        ],
        note: 'Indicadores europeus de adoção tecnológica; não medem o impacto de uma implementação específica.',
        measures: ['Horas de consolidação manual', 'Tempo entre ocorrência e visibilidade', 'Sistemas e fontes integrados', 'Passagens manuais entre equipas', 'Tempo de resposta operacional'],
        outcomes: [
          {stat:'~50/80%', copy:'de redução no tempo gasto em consolidação manual.'},
          {stat:'~30/50%', copy:'de redução no tempo de resposta a desvios operacionais.'},
          {stat:'~25/45%', copy:'de redução nas passagens manuais entre equipas.'}
        ],
        outcomesTitle: 'Menos consolidação. Mais visibilidade. Respostas mais rápidas.',
        ctaTitle: 'Construir uma visão única da sua operação.', cta: 'Unificar a minha operação'
      },
      en: {
        tags: 'Operational Systems · Dashboards · Integrations',
        title: 'Industrial Operations Hub',
        lead: 'We centralise production, maintenance and quality in an operational system that connects information, workflows and decisions.',
        problemTitle: 'The information exists.\nThe operation remains fragmented.',
        problemBody: 'Production, maintenance and quality live in different systems and routines. The complete view depends on manually consolidating information and reconciling versions of reality.',
        problemFlow: {inputs:['ERP','Excel','SCADA','Email'], core:'Manual consolidation', outputs:['Late report','Isolated BI']},
        problems: ['Information fragmented across ERP, spreadsheets and isolated tools.', 'Teams working from different versions of reality.', 'Manual consolidation and delayed decisions.', 'No shared view across the operation.'],
        systemTitle: 'An operations hub connecting data, workflows and decisions.',
        systemBody: 'We build an operational layer over existing systems, bringing indicators, alerts, ownership and history into one place of work.',
        systemFlow: {inputs:['ERP','SCADA','Maintenance','Quality'], core:'Operations Hub', outputs:['Alerts','Workflows','Decisions']},
        system: ['Integration with existing ERP and systems.', 'Dashboards by site, line or process.', 'Workflows, alerts and clear ownership.', 'Operational history and traceability.', 'Information prepared for decision-making.'],
        evidence: [
          {stat:'53%', copy:'of EU enterprises used ERP, CRM or BI in 2025.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1'},
          {stat:'46%', copy:'of enterprises used ERP to integrate information and resources.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/22286.pdf?v=8346100741086513'},
          {stat:'41% vs. 89%', copy:'ERP adoption in small and large enterprises.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1'}
        ],
        note: 'European technology-adoption indicators; they do not measure the impact of a specific implementation.',
        measures: ['Manual consolidation hours', 'Time from event to visibility', 'Systems and sources connected', 'Manual handoffs between teams', 'Operational response time'],
        outcomes: [
          {stat:'~50/80%', copy:'reduction in time spent on manual consolidation.'},
          {stat:'~30/50%', copy:'reduction in response time to operational deviations.'},
          {stat:'~25/45%', copy:'reduction in manual handoffs between teams.'}
        ],
        outcomesTitle: 'Less consolidation. More visibility. Faster responses.',
        ctaTitle: 'Build one shared view of your operation.', cta: 'Unify my operation'
      }
    },
    'inteligencia-producao-energia': {
      index: '02', image: 'assets/img/22.png',
      pt: {
        tags: 'Dashboards · Dados · Apoio à Decisão',
        title: 'Inteligência de Produção e Energia',
        lead: 'Cruzamos desempenho produtivo, consumo energético, paragens e capacidade para tornar desvios visíveis antes de se transformarem em custos.',
        problemTitle: 'Os dados existem.\nOs desvios chegam tarde.',
        problemBody: 'Produção, energia, paragens e capacidade são analisadas separadamente. Quando o desvio se torna visível, o desperdício já aconteceu e a causa continua difícil de localizar.',
        problemFlow: {inputs:['Produção','Energia','Paragens','Capacidade'], core:'Análise separada', outputs:['Médias','Relatório tardio']},
        problems: ['Desempenho produtivo e energia analisados separadamente.', 'Indicadores disponíveis apenas depois do problema.', 'Perdas difíceis de localizar e explicar.', 'Decisões baseadas em médias e relatórios tardios.'],
        systemTitle: 'Um sistema que cruza produção, energia e capacidade.',
        systemBody: 'Ligamos os dados operacionais e energéticos para mostrar desempenho por linha, equipamento ou produto e sinalizar anomalias antes de se tornarem custos.',
        systemFlow: {inputs:['Produção','Energia','Paragens','Capacidade'], core:'Intelligence Layer', outputs:['Análise','Alertas','Decisão']},
        system: ['Dashboards de produção e energia.', 'Indicadores por linha, equipamento ou produto.', 'Alertas sobre anomalias e desvios.', 'Comparação entre períodos e condições operacionais.', 'Apoio à decisão sobre eficiência e capacidade.'],
        evidence: [
          {stat:'≈40%', copy:'do consumo final mundial de energia pertence à indústria.', source:'IEA · 2025', url:'https://www.iea.org/reports/energy-efficiency-2025/industry'},
          {stat:'>10%', copy:'de poupança média nos primeiros três anos com gestão industrial de energia.', source:'IEA', url:'https://www.iea.org/reports/energy-management-for-industry/executive-summary'},
          {stat:'30%+', copy:'de poupança demonstrada por algumas empresas.', source:'IEA', url:'https://www.iea.org/reports/energy-management-for-industry/executive-summary'}
        ],
        note: 'Resultados agregados de programas de gestão de energia; o potencial de cada operação depende do seu baseline e contexto.',
        measures: ['Energia por unidade produzida', 'Picos e desperdícios', 'Tempo de deteção de desvios', 'Paragens não planeadas', 'OEE e utilização de capacidade'],
        outcomes: [
          {stat:'~5/15%', copy:'de redução na energia consumida por unidade produzida.'},
          {stat:'~20/40%', copy:'de redução no tempo necessário para detetar desvios.'},
          {stat:'~10/25%', copy:'de redução nas paragens não planeadas ligadas a anomalias detetáveis.'}
        ],
        outcomesTitle: 'Menos desperdício. Desvios mais cedo. Produção mais eficiente.',
        ctaTitle: 'Encontrar a próxima oportunidade na sua produção.', cta: 'Analisar a minha produção'
      },
      en: {
        tags: 'Dashboards · Data · Decision Support',
        title: 'Production & Energy Intelligence',
        lead: 'We connect production performance, energy consumption, downtime and capacity to make deviations visible before they become costs.',
        problemTitle: 'The data exists.\nDeviations arrive late.',
        problemBody: 'Production, energy, downtime and capacity are analysed separately. By the time a deviation becomes visible, waste has already occurred and the cause remains difficult to locate.',
        problemFlow: {inputs:['Production','Energy','Downtime','Capacity'], core:'Separate analysis', outputs:['Averages','Late report']},
        problems: ['Production performance and energy reviewed separately.', 'Indicators available only after the problem.', 'Losses that are difficult to locate and explain.', 'Decisions based on averages and delayed reports.'],
        systemTitle: 'A system connecting production, energy and capacity.',
        systemBody: 'We connect operational and energy data to show performance by line, equipment or product and flag anomalies before they become costs.',
        systemFlow: {inputs:['Production','Energy','Downtime','Capacity'], core:'Intelligence Layer', outputs:['Analysis','Alerts','Decision']},
        system: ['Production and energy dashboards.', 'Indicators by line, equipment or product.', 'Anomaly and deviation alerts.', 'Comparison across periods and operating conditions.', 'Decision support for efficiency and capacity.'],
        evidence: [
          {stat:'≈40%', copy:'of global final energy consumption comes from industry.', source:'IEA · 2025', url:'https://www.iea.org/reports/energy-efficiency-2025/industry'},
          {stat:'>10%', copy:'average savings in the first three years of industrial energy management.', source:'IEA', url:'https://www.iea.org/reports/energy-management-for-industry/executive-summary'},
          {stat:'30%+', copy:'savings demonstrated by some companies.', source:'IEA', url:'https://www.iea.org/reports/energy-management-for-industry/executive-summary'}
        ],
        note: 'Aggregated energy-management programme outcomes; each operation depends on its own baseline and context.',
        measures: ['Energy per unit produced', 'Peaks and waste', 'Deviation detection time', 'Unplanned downtime', 'OEE and capacity utilisation'],
        outcomes: [
          {stat:'~5/15%', copy:'reduction in energy consumed per unit produced.'},
          {stat:'~20/40%', copy:'reduction in time required to detect deviations.'},
          {stat:'~10/25%', copy:'reduction in unplanned downtime linked to detectable anomalies.'}
        ],
        outcomesTitle: 'Less waste. Earlier signals. More efficient production.',
        ctaTitle: 'Find the next opportunity in your production.', cta: 'Analyse my production'
      }
    },
    'sistema-conhecimento-tecnico': {
      index: '03', image: 'assets/img/33.png',
      pt: {
        tags: 'Sistemas de Conhecimento · Pesquisa Interna · Copilotos',
        title: 'Sistema de Conhecimento Técnico',
        lead: 'Organizamos manuais, procedimentos e experiência operacional num sistema pesquisável, contextual e fundamentado nas fontes da empresa.',
        problemTitle: 'O conhecimento existe.\nEstá preso em documentos e pessoas.',
        problemBody: 'Manuais, procedimentos e experiência operacional estão dispersos. Resolver uma questão depende de encontrar o documento certo ou interromper um dos poucos especialistas disponíveis.',
        problemFlow: {inputs:['Manuais','PDFs','Notas','Email'], core:'Especialista', outputs:['Resposta manual','Conhecimento isolado']},
        problems: ['Manuais e procedimentos dispersos.', 'Dependência de poucos especialistas.', 'Os mesmos problemas resolvidos repetidamente.', 'Onboarding técnico lento e inconsistente.'],
        systemTitle: 'Um sistema que transforma conhecimento técnico em capacidade disponível.',
        systemBody: 'Criamos uma camada pesquisável sobre manuais, procedimentos e casos anteriores, com respostas contextualizadas, fontes e apoio ao diagnóstico.',
        systemFlow: {inputs:['Manuais','Procedimentos','Casos','Experiência'], core:'Technical Layer', outputs:['Pesquisa','Copiloto','Diagnóstico']},
        system: ['Repositório técnico estruturado.', 'Pesquisa interna contextual.', 'Respostas acompanhadas pelas respetivas fontes.', 'Copiloto para diagnóstico e troubleshooting.', 'Permissões por equipa, área ou função.'],
        evidence: [
          {stat:'5.179', copy:'profissionais analisados num estudo de apoio técnico com IA.', source:'NBER · 2023', url:'https://www.nber.org/system/files/working_papers/w31161/revisions/w31161.rev0.pdf'},
          {stat:'+14%', copy:'de produtividade média com um assistente baseado em IA.', source:'NBER · 2023', url:'https://www.nber.org/system/files/working_papers/w31161/revisions/w31161.rev0.pdf'},
          {stat:'até +35%', copy:'entre os profissionais menos experientes.', source:'NBER · 2023', url:'https://www.nber.org/reporter/2024number1/economics-generative-ai'}
        ],
        note: 'O estudo decorreu em apoio técnico ao cliente. Demonstra transferência de conhecimento, não um ganho garantido em ambiente industrial.',
        measures: ['Tempo médio de resolução', 'Questões resolvidas sem escalamento', 'Tempo de onboarding técnico', 'Utilização das fontes', 'Documentos e procedimentos consolidados'],
        outcomes: [
          {stat:'~30/60%', copy:'de redução no tempo médio de resolução de questões técnicas.'},
          {stat:'~20/40%', copy:'de redução nos escalamentos para especialistas sénior.'},
          {stat:'~30/50%', copy:'de redução no tempo de onboarding técnico.'}
        ],
        outcomesTitle: 'Menos procura. Menos escalamentos. Resolução mais rápida.',
        ctaTitle: 'Transformar conhecimento disperso em capacidade.', cta: 'Organizar o meu conhecimento técnico'
      },
      en: {
        tags: 'Knowledge Systems · Internal Search · Copilots',
        title: 'Technical Knowledge System',
        lead: 'We organise manuals, procedures and operational experience into a searchable, contextual system grounded in company sources.',
        problemTitle: 'The knowledge exists.\nIt is trapped in documents and people.',
        problemBody: 'Manuals, procedures and operational experience are dispersed. Solving a question depends on finding the right document or interrupting one of the few available specialists.',
        problemFlow: {inputs:['Manuals','PDFs','Notes','Email'], core:'Specialist', outputs:['Manual answer','Isolated knowledge']},
        problems: ['Manuals and procedures spread across locations.', 'Dependence on a small number of experts.', 'The same problems solved repeatedly.', 'Slow and inconsistent technical onboarding.'],
        systemTitle: 'A system that turns technical knowledge into available capability.',
        systemBody: 'We create a searchable layer over manuals, procedures and previous cases, with contextual answers, sources and diagnostic support.',
        systemFlow: {inputs:['Manuals','Procedures','Cases','Experience'], core:'Technical Layer', outputs:['Search','Copilot','Diagnostics']},
        system: ['A structured technical repository.', 'Contextual internal search.', 'Answers accompanied by source references.', 'A copilot for diagnostics and troubleshooting.', 'Permissions by team, area or role.'],
        evidence: [
          {stat:'5,179', copy:'professionals studied in an AI-assisted technical support setting.', source:'NBER · 2023', url:'https://www.nber.org/system/files/working_papers/w31161/revisions/w31161.rev0.pdf'},
          {stat:'+14%', copy:'average productivity with an AI-based assistant.', source:'NBER · 2023', url:'https://www.nber.org/system/files/working_papers/w31161/revisions/w31161.rev0.pdf'},
          {stat:'up to +35%', copy:'among less-experienced professionals.', source:'NBER · 2023', url:'https://www.nber.org/reporter/2024number1/economics-generative-ai'}
        ],
        note: 'The study took place in customer technical support. It demonstrates knowledge transfer, not a guaranteed industrial gain.',
        measures: ['Average resolution time', 'Questions solved without escalation', 'Technical onboarding time', 'Source usage', 'Documents and procedures consolidated'],
        outcomes: [
          {stat:'~30/60%', copy:'reduction in average technical-issue resolution time.'},
          {stat:'~20/40%', copy:'reduction in escalations to senior specialists.'},
          {stat:'~30/50%', copy:'reduction in technical onboarding time.'}
        ],
        outcomesTitle: 'Less searching. Fewer escalations. Faster resolution.',
        ctaTitle: 'Turn dispersed knowledge into capability.', cta: 'Organise my technical knowledge'
      }
    },
    'sistema-comercial-orcamentacao': {
      index: '04', image: 'assets/img/44.png',
      pt: {
        tags: 'CRM · Automação · IA',
        title: 'Sistema Comercial e de Orçamentação',
        lead: 'Ligamos informação comercial, preços, requisitos técnicos e aprovações num fluxo único para produzir propostas mais rápidas e consistentes.',
        problemTitle: 'Os pedidos chegam.\nA proposta trava entre equipas.',
        problemBody: 'Informação comercial, requisitos técnicos, preços e aprovações circulam por canais diferentes. Cada proposta exige procurar dados, confirmar regras e repetir passagens entre comercial e engenharia.',
        problemFlow: {inputs:['Email','CRM','Pedido','Preços'], core:'Comercial ↔ Engenharia', outputs:['Aprovação manual','Proposta inconsistente']},
        problems: ['Pedidos recebidos por canais diferentes.', 'Informação comercial e técnica separada.', 'Preços e requisitos procurados manualmente.', 'Aprovações por email e propostas inconsistentes.'],
        systemTitle: 'Um fluxo que liga pedido, requisitos, preços e aprovação.',
        systemBody: 'Construímos um sistema contínuo de orçamentação que estrutura a entrada, recupera informação comercial e técnica e aplica regras antes da aprovação.',
        systemFlow: {inputs:['CRM','Requisitos','Preços','Regras'], core:'Quotation System', outputs:['Proposta','Aprovação','Histórico']},
        system: ['Entrada estruturada de pedidos.', 'Ligação ao CRM, ERP e tabelas de preços.', 'Preparação assistida de propostas.', 'Regras comerciais, técnicas e aprovações.', 'Histórico e rastreabilidade de cada oportunidade.'],
        evidence: [
          {stat:'28,5%', copy:'das empresas da UE utilizavam CRM em 2025.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/33473.pdf'},
          {stat:'25% vs. 65%', copy:'adoção de CRM nas pequenas e grandes empresas.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1'},
          {stat:'−65%', copy:'no tempo de configuração de propostas num caso industrial publicado.', source:'Conga · Case study', url:'https://conga.com/customer-stories/industrial-manufacturer'}
        ],
        note: 'O valor de −65% pertence a um caso publicado por um fornecedor terceiro; não é um benchmark nem um resultado da Vouga.',
        measures: ['Tempo entre pedido e proposta', 'Erros e revisões', 'Passagens manuais', 'Tempo de engenharia em orçamentação', 'Margem e taxa de conversão'],
        outcomes: [
          {stat:'~50/80%', copy:'de redução no tempo entre o pedido e a proposta.'},
          {stat:'~30/60%', copy:'de redução nos erros e ciclos de revisão.'},
          {stat:'~20/40%', copy:'de redução no tempo de engenharia gasto em orçamentação.'}
        ],
        outcomesTitle: 'Menos espera. Menos revisões. Propostas mais consistentes.',
        ctaTitle: 'Retirar fricção ao seu processo comercial.', cta: 'Acelerar a minha orçamentação'
      },
      en: {
        tags: 'CRM · Automation · AI',
        title: 'Commercial & Quotation System',
        lead: 'We connect commercial information, prices, technical requirements and approvals in one flow to produce faster, more consistent quotations.',
        problemTitle: 'Enquiries arrive.\nThe quotation stalls between teams.',
        problemBody: 'Commercial information, technical requirements, prices and approvals move through different channels. Every quotation requires searching for data, confirming rules and repeating handoffs between sales and engineering.',
        problemFlow: {inputs:['Email','CRM','Enquiry','Prices'], core:'Sales ↔ Engineering', outputs:['Manual approval','Inconsistent quotation']},
        problems: ['Enquiries received through different channels.', 'Commercial and technical information kept separately.', 'Prices and requirements searched manually.', 'Email approvals and inconsistent proposals.'],
        systemTitle: 'A flow connecting enquiry, requirements, prices and approval.',
        systemBody: 'We build a continuous quotation system that structures intake, retrieves commercial and technical information and applies rules before approval.',
        systemFlow: {inputs:['CRM','Requirements','Prices','Rules'], core:'Quotation System', outputs:['Proposal','Approval','History']},
        system: ['Structured enquiry intake.', 'Connections to CRM, ERP and price lists.', 'Assisted quotation preparation.', 'Commercial and technical rules with approvals.', 'History and traceability for every opportunity.'],
        evidence: [
          {stat:'28.5%', copy:'of EU enterprises used CRM in 2025.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/33473.pdf'},
          {stat:'25% vs. 65%', copy:'CRM adoption in small and large enterprises.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1'},
          {stat:'−65%', copy:'quotation configuration time in one published industrial case.', source:'Conga · Case study', url:'https://conga.com/customer-stories/industrial-manufacturer'}
        ],
        note: 'The −65% figure belongs to a vendor-published third-party case; it is neither a benchmark nor a Vouga result.',
        measures: ['Time from enquiry to quotation', 'Errors and revisions', 'Manual handoffs', 'Engineering time spent quoting', 'Margin and conversion rate'],
        outcomes: [
          {stat:'~50/80%', copy:'reduction in time from enquiry to quotation.'},
          {stat:'~30/60%', copy:'reduction in errors and revision cycles.'},
          {stat:'~20/40%', copy:'reduction in engineering time spent on quotations.'}
        ],
        outcomesTitle: 'Less waiting. Fewer revisions. More consistent quotations.',
        ctaTitle: 'Remove friction from your commercial process.', cta: 'Accelerate my quotations'
      }
    },
    'sistema-conhecimento-estrategico': {
      index: '05', image: 'assets/img/55.png',
      pt: {
        tags: 'Sistemas de Conhecimento · Pesquisa Interna',
        title: 'Sistema de Conhecimento Estratégico',
        lead: 'Ligamos documentos, projetos, decisões e conhecimento interno para que as equipas encontrem respostas com contexto e fontes verificáveis.',
        problemTitle: 'A informação existe.\nO contexto está disperso.',
        problemBody: 'Documentos, decisões, projetos e conhecimento vivem em ferramentas diferentes. Encontrar o contexto certo depende de procurar, perguntar e reconstruir.',
        problemFlow: {inputs:['Docs','SharePoint','Teams','Notion','PDFs'], core:'Pessoa', outputs:['Procura','Contexto reconstruído']},
        problems: ['Informação estratégica dispersa.', 'Decisões anteriores difíceis de recuperar.', 'Conhecimento dependente de pessoas.', 'Tempo perdido a procurar e validar informação.'],
        systemTitle: 'Um sistema que liga o conhecimento da empresa.',
        systemBody: 'Criamos uma camada de conhecimento sobre as fontes existentes, permitindo pesquisar informação, recuperar decisões e obter respostas contextualizadas e verificáveis.',
        systemFlow: {inputs:['Documentos','Projetos','Decisões','Dados'], core:'Knowledge Layer', outputs:['Pesquisa','Copiloto','Decisões']},
        system: ['Liga documentos e fontes existentes.', 'Pesquisa transversal e contextual.', 'Respostas com fontes verificáveis.', 'Histórico e contexto de decisões.', 'Permissões e governação.'],
        evidence: [
          {stat:'16,3%', copy:'das empresas da UE utilizavam Business Intelligence em 2025.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/22286.pdf?v=8346100741086513'},
          {stat:'11% vs. 69%', copy:'utilização de BI nas pequenas e grandes empresas.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1'},
          {stat:'28% vs. 79%', copy:'análise interna de dados nas pequenas e grandes empresas.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/33473.pdf'}
        ],
        note: 'Os indicadores demonstram o fosso de capacidade analítica; não medem diretamente sistemas de conhecimento.',
        measures: ['Tempo para encontrar informação', 'Respostas com fontes verificáveis', 'Documentos e sistemas ligados', 'Preparação antes de reuniões', 'Reutilização de análises anteriores'],
        outcomes: [
          {stat:'~40/70%', copy:'de redução no tempo para encontrar e validar informação.'},
          {stat:'~25/45%', copy:'de redução no tempo de preparação antes de reuniões e decisões.'},
          {stat:'~60/90%', copy:'das respostas com uma fonte verificável associada.'}
        ],
        outcomesTitle: 'Menos procura. Mais contexto. Decisões mais rápidas.',
        ctaTitle: 'Dar contexto a quem precisa de decidir.', cta: 'Tornar o meu conhecimento acessível'
      },
      en: {
        tags: 'Knowledge Systems · Internal Search',
        title: 'Strategic Knowledge System',
        lead: 'We connect documents, projects, decisions and internal knowledge so teams can find answers with context and verifiable sources.',
        problemTitle: 'The information exists.\nThe context is dispersed.',
        problemBody: 'Documents, decisions, projects and knowledge live in different tools. Finding the right context depends on searching, asking and reconstructing.',
        problemFlow: {inputs:['Docs','SharePoint','Teams','Notion','PDFs'], core:'Person', outputs:['Searching','Rebuilt context']},
        problems: ['Strategic information spread across locations.', 'Previous decisions difficult to recover.', 'Knowledge dependent on people.', 'Time lost finding and validating information.'],
        systemTitle: 'A system connecting company knowledge.',
        systemBody: 'We create a knowledge layer over existing sources, making it possible to search information, recover decisions and obtain contextual, verifiable answers.',
        systemFlow: {inputs:['Documents','Projects','Decisions','Data'], core:'Knowledge Layer', outputs:['Search','Copilot','Decisions']},
        system: ['Connects existing documents and sources.', 'Cross-functional contextual search.', 'Answers with verifiable sources.', 'Decision history and context.', 'Permissions and governance.'],
        evidence: [
          {stat:'16.3%', copy:'of EU enterprises used Business Intelligence in 2025.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/22286.pdf?v=8346100741086513'},
          {stat:'11% vs. 69%', copy:'BI use in small and large enterprises.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260520-1'},
          {stat:'28% vs. 79%', copy:'in-house data analytics in small and large enterprises.', source:'Eurostat · 2026', url:'https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/33473.pdf'}
        ],
        note: 'The indicators demonstrate the analytics capability gap; they do not directly measure knowledge systems.',
        measures: ['Time to find information', 'Answers with verifiable sources', 'Documents and systems connected', 'Preparation before meetings', 'Reuse of previous analysis'],
        outcomes: [
          {stat:'~40/70%', copy:'reduction in time spent finding and validating information.'},
          {stat:'~25/45%', copy:'reduction in preparation time before meetings and decisions.'},
          {stat:'~60/90%', copy:'of answers accompanied by a verifiable source.'}
        ],
        outcomesTitle: 'Less searching. More context. Faster decisions.',
        ctaTitle: 'Give decision-makers the context they need.', cta: 'Make my knowledge accessible'
      }
    },
    'agente-voz-memoria-contextual': {
      index: '06', image: 'assets/img/66.png',
      pt: {
        tags: 'Copilotos · Agentes de IA',
        title: 'Agente de Voz com Memória Contextual',
        lead: 'Um agente de voz que recupera contexto, conduz interações consistentes e prepara automaticamente o passo seguinte.',
        problemTitle: 'As conversas acontecem.\nO contexto perde-se entre interações.',
        problemBody: 'Chamadas, notas e histórico vivem separados. Cada novo contacto repete perguntas, preparação e trabalho de follow-up porque o contexto anterior não acompanha a conversa.',
        problemFlow: {inputs:['Chamadas','Notas','CRM','Email'], core:'Novo contacto', outputs:['Repetição','Contexto perdido']},
        problems: ['Contexto perdido entre contactos.', 'Perguntas e preparação repetidas.', 'Acompanhamento inconsistente.', 'Informação importante presa em notas.'],
        systemTitle: 'Um agente de voz que recupera contexto e prepara o passo seguinte.',
        systemBody: 'Ligamos o agente a fontes autorizadas e a uma memória longitudinal para conduzir a interação, registar o essencial e preparar automaticamente o próximo contacto.',
        systemFlow: {inputs:['CRM','Histórico','Notas','Fontes'], core:'Context Memory', outputs:['Voice Agent','Próximo passo','Escalamento humano']},
        system: ['Agente de voz ligado a fontes autorizadas.', 'Memória longitudinal e recuperação de contexto.', 'Transcrição, síntese e próximos passos.', 'Preparação automática da interação seguinte.', 'Escalamento para uma pessoa quando necessário.'],
        evidence: [
          {stat:'70.000', copy:'candidatos analisados num ensaio de campo com agentes de voz.', source:'Jabarian & Henkel · 2026', url:'https://papers.ssrn.com/sol3/Delivery.cfm/5395709.pdf?abstractid=5395709&mirid=1&type=2'},
          {stat:'+12%', copy:'de probabilidade de proposta após entrevistas estruturadas por voz com IA.', source:'Jabarian & Henkel · 2026', url:'https://papers.ssrn.com/sol3/Delivery.cfm/5395709.pdf?abstractid=5395709&mirid=1&type=2'},
          {stat:'− reclamações', copy:'efeito persistente observado num ensaio de campo de atendimento por voz.', source:'Wang et al. · Field study', url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3633100'}
        ],
        note: 'Os estudos analisam recrutamento e atendimento, não o mesmo agente. Também mostram que pedidos complexos e falhas de reconhecimento exigem escalamento humano.',
        measures: ['Tempo de preparação', 'Contexto recuperado', 'Conversas sem repetição', 'Taxa de escalamento', 'Próximos passos registados'],
        outcomes: [
          {stat:'~40/70%', copy:'de redução no tempo de preparação antes de cada conversa.'},
          {stat:'~25/50%', copy:'de redução nas perguntas repetidas entre interações.'},
          {stat:'~20/40%', copy:'de redução no tempo gasto a preparar o follow-up.'}
        ],
        outcomesTitle: 'Menos repetição. Mais continuidade. Follow-up mais rápido.',
        ctaTitle: 'Criar conversas que acumulam contexto.', cta: 'Explorar um agente para a minha operação'
      },
      en: {
        tags: 'Copilots · AI Agents',
        title: 'Voice Agent with Contextual Memory',
        lead: 'A voice agent that retrieves context, runs consistent interactions and automatically prepares the next step.',
        problemTitle: 'Conversations happen.\nContext is lost between interactions.',
        problemBody: 'Calls, notes and history live separately. Every new contact repeats questions, preparation and follow-up work because previous context does not travel with the conversation.',
        problemFlow: {inputs:['Calls','Notes','CRM','Email'], core:'New contact', outputs:['Repetition','Lost context']},
        problems: ['Context lost between interactions.', 'Repeated questions and preparation.', 'Inconsistent follow-up.', 'Important information trapped in notes.'],
        systemTitle: 'A voice agent that retrieves context and prepares the next step.',
        systemBody: 'We connect the agent to authorised sources and longitudinal memory to conduct the interaction, capture what matters and automatically prepare the next contact.',
        systemFlow: {inputs:['CRM','History','Notes','Sources'], core:'Context Memory', outputs:['Voice Agent','Next step','Human handoff']},
        system: ['A voice agent connected to authorised sources.', 'Longitudinal memory and contextual retrieval.', 'Transcription, synthesis and next steps.', 'Automatic preparation for the next interaction.', 'Human escalation when needed.'],
        evidence: [
          {stat:'70,000', copy:'candidates studied in a field experiment with voice agents.', source:'Jabarian & Henkel · 2026', url:'https://papers.ssrn.com/sol3/Delivery.cfm/5395709.pdf?abstractid=5395709&mirid=1&type=2'},
          {stat:'+12%', copy:'likelihood of an offer after structured AI voice interviews.', source:'Jabarian & Henkel · 2026', url:'https://papers.ssrn.com/sol3/Delivery.cfm/5395709.pdf?abstractid=5395709&mirid=1&type=2'},
          {stat:'fewer complaints', copy:'a persistent effect observed in a voice-service field experiment.', source:'Wang et al. · Field study', url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3633100'}
        ],
        note: 'The studies cover recruitment and customer service, not the same agent. They also show that complex requests and recognition failures require human escalation.',
        measures: ['Preparation time', 'Context retrieved', 'Conversations without repetition', 'Escalation rate', 'Next steps recorded'],
        outcomes: [
          {stat:'~40/70%', copy:'reduction in preparation time before each conversation.'},
          {stat:'~25/50%', copy:'reduction in questions repeated across interactions.'},
          {stat:'~20/40%', copy:'reduction in time spent preparing follow-up.'}
        ],
        outcomesTitle: 'Less repetition. More continuity. Faster follow-up.',
        ctaTitle: 'Create conversations that accumulate context.', cta: 'Explore an agent for my operation'
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
      ? 'Fontes fragmentadas — ' + sources.join(', ') + ' — ligadas através de ' + systemFlow.core + ' para ' + outputs.join(', ') + '.'
      : 'Fragmented sources — ' + sources.join(', ') + ' — connected through ' + systemFlow.core + ' to ' + outputs.join(', ') + '.');
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
    fillText('workEvidenceIntro', labels.evidenceIntro);
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
        link.setAttribute('aria-label', evidence.stat + ': ' + evidence.copy + ' — ' + evidence.source);
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
    fillText('workMeasuresIntro', labels.measuresIntro);
    fillList('workMeasuresList', copy.measures);
    fillText('workOutcomesLabel', labels.outcomes);
    fillText('workOutcomesTitle', copy.outcomesTitle || labels.outcomesTitle);
    fillText('workOutcomesIntro', labels.outcomesIntro);
    fillText('workOutcomesNote', labels.outcomesNote);
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
      cta.setAttribute('data-route-page', 'contact.html?service=' + encodeURIComponent(slug));
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
    if (typeof SERVICE_COPY !== 'undefined') SERVICES = SERVICE_COPY[lang] || SERVICE_COPY.pt;
    if (typeof drawWhyMark === 'function' && whySec && whyCanvas && whyBox) drawWhyMark();
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
