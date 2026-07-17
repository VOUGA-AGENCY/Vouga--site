(function(){
  'use strict';

  var root = document.documentElement;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var currentLang = 'en';
  try { sessionStorage.setItem('vouga-pillars-cards-ready', '1'); } catch(e) {}
  (function normalizeCapabilityUrl(){
    if (!window.history || !window.history.replaceState) return;
    var hash = document.body.classList.contains('intelligence-page') ? '#intelligence'
      : document.body.classList.contains('foundations-page') ? '#engineering'
      : document.body.classList.contains('academy-page') ? '#academy'
      : '';
    if (!hash || window.location.hash === hash) return;
    window.history.replaceState(null, '', '/' + hash);
  })();
  document.addEventListener('click', function(e){
    var link = e.target.closest ? e.target.closest('a[data-route-page]') : null;
    if (!link) return;
    var page = link.getAttribute('data-route-page');
    if (!page) return;
    e.preventDefault();
    window.location.href = page;
  });
  try {
    var savedLang = localStorage.getItem('vouga-lang');
    if (savedLang === 'pt' || savedLang === 'en') currentLang = savedLang;
  } catch(e) {}

  (function initTheme(){
    root.setAttribute('data-theme', 'dark');
    try { localStorage.removeItem('vouga-theme'); } catch(e) {}
  })();

  (function initAcademyLoadingType(){
    var heading = document.querySelector('[data-academy-loading-title]');
    if (!heading) return;
    var output = heading.querySelector('[data-academy-loading-output]');
    var copy = heading.getAttribute('data-text') || 'Still loading...';
    if (!output) return;
    output.textContent = '';
    heading.classList.remove('is-typing', 'is-complete');

    function showComplete(){
      output.textContent = copy;
      heading.classList.remove('is-typing');
      heading.classList.add('is-complete');
    }
    if (reducedMotion) {
      showComplete();
      return;
    }

    var started = false;
    function startTyping(){
      if (started) return;
      started = true;
      heading.classList.add('is-typing');
      var index = 0;

      function typeNext(){
        index += 1;
        output.textContent = copy.slice(0, index);
        if (index >= copy.length) {
          window.setTimeout(showComplete, 180);
          return;
        }
        var character = copy.charAt(index - 1);
        var delay = character === '.' ? 250 : character === ' ' ? 155 : 88 + (index % 4) * 12;
        window.setTimeout(typeNext, delay);
      }
      window.setTimeout(typeNext, 260);
    }

    function removePositionListeners(){
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    }
    function checkPosition(){
      if (started) return;
      var rect = heading.getBoundingClientRect();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top > viewportHeight * 0.82 || rect.bottom < viewportHeight * 0.12) return;
      removePositionListeners();
      startTyping();
    }
    window.addEventListener('scroll', checkPosition, { passive:true });
    window.addEventListener('resize', checkPosition);
    requestAnimationFrame(checkPosition);
  })();

  (function initMobileMenu(){
    var navBurger = document.getElementById('navBurger');
    var mobileMenu = document.getElementById('mobileMenu');
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
    function setMenu(open){
      if (!navBurger || !mobileMenu) return;
      mobileMenu.classList.toggle('open', open);
      navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
      navBurger.setAttribute('aria-label', open ? 'fechar menu' : 'abrir menu');
    }
    enforceMobileNavSurface();
    window.addEventListener('resize', enforceMobileNavSurface);
    if (!navBurger || !mobileMenu) return;
    navBurger.addEventListener('click', function(){
      setMenu(!mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setMenu(false); });
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth > 820) setMenu(false);
    });
  })();

  (function initLanguage(){
    var langToggle = document.getElementById('langToggle');
    var page = document.body.classList.contains('intelligence-page') ? 'intelligence'
      : document.body.classList.contains('foundations-page') ? 'foundations'
      : document.body.classList.contains('academy-page') ? 'academy'
      : null;
    if (!page) return;

    var COMMON = {
      pt: { contact:'Falar connosco', logo:'Vouga Agency, início', nav:['Como Pensamos','Casos de Uso','Fundações','Serviços'] },
      en: { contact:'Contact us', logo:'Vouga Agency, home', nav:['Our Approach','Use Cases','Foundations','Services'] }
    };
    if (document.body.hasAttribute('data-static-detail')) {
      function applyStatic(lang){
        lang = lang === 'en' ? 'en' : 'pt';
        currentLang = lang;
        root.setAttribute('lang', lang === 'en' ? 'en' : 'pt-PT');
        root.setAttribute('data-lang', lang);
        var common = COMMON[lang];
        var pageTitle = document.body.getAttribute('data-title-' + lang);
        var pageDescription = document.body.getAttribute('data-description-' + lang);
        if (pageTitle) document.title = pageTitle;
        var description = document.querySelector('meta[name="description"]');
        if (description && pageDescription) description.setAttribute('content', pageDescription);
        Array.prototype.slice.call(document.querySelectorAll('[data-en][data-pt]')).forEach(function(el){
          el.textContent = el.getAttribute('data-' + lang);
        });
        Array.prototype.slice.call(document.querySelectorAll('[data-html-en][data-html-pt]')).forEach(function(el){
          el.innerHTML = el.getAttribute('data-html-' + lang);
        });
        Array.prototype.slice.call(document.querySelectorAll('[data-lang-option]')).forEach(function(option){
          option.classList.toggle('is-active', option.getAttribute('data-lang-option') === lang);
        });
        Array.prototype.slice.call(document.querySelectorAll('.nav-links a,.mobile-links a')).forEach(function(a, i){
          a.textContent = common.nav[i % common.nav.length];
        });
        Array.prototype.slice.call(document.querySelectorAll('.nav .btn-primary')).forEach(function(btn){
          if (!btn.hasAttribute('data-html-en')) btn.textContent = common.contact;
        });
        var logo = document.querySelector('.logo');
        if (logo) logo.setAttribute('aria-label', common.logo);
        if (langToggle) langToggle.setAttribute('aria-label', lang === 'pt' ? 'Switch to English' : 'Mudar para português');
      }
      applyStatic(currentLang);
      if (langToggle) {
        langToggle.addEventListener('click', function(){
          var next = currentLang === 'pt' ? 'en' : 'pt';
          applyStatic(next);
          try { localStorage.setItem('vouga-lang', next); } catch(e) {}
        });
      }
      return;
    }
    var COPY = {
      intelligence: {
        pt: {
          title:'Vouga Intelligence · AI Services',
          description:'Vouga Intelligence desenha e implementa serviços de IA aplicada: inteligência de workflows, sistemas de conhecimento e agentes operacionais.',
          kicker:'IA aplicada · sistemas de operação',
          lead:'Construímos sistemas de IA dentro dos workflows que já movem o negócio: conhecimento, decisões, operações de cliente e execução.',
          primary:'Falar connosco <span class="arrow">→</span>',
          secondary:'O que faz',
          simpleSections:[
            { h:'O que a Intelligence faz.', p:'A Vouga Intelligence liga contexto, decisões e execução através de sistemas de IA integrados em workflows reais.', cards:[['01 / compreender','Mapeamos onde vive o conhecimento e como as decisões acontecem.','Documentos, ferramentas, permissões, reuniões e know-how tácito tornam-se uma visão utilizável do trabalho.'],['02 / construir','Transformamos esse contexto em sistemas de IA fiáveis.','Pesquisa, retrieval, copilotos e agentes são desenhados com fontes, controlo de acessos e responsabilidade humana clara.'],['03 / operar','Colocamos inteligência onde a próxima ação precisa de acontecer.','O resultado não é um chatbot à parte. É uma camada de trabalho que ajuda equipas a decidir, preparar e executar.']] },
            { h:'O que pode produzir.', p:'Cada construção começa pelo workflow e combina modelos, dados, UI, permissões e adoção num sistema que as pessoas conseguem usar.', cards:[['Inteligência de workflow','Encontrar a intervenção de IA com maior impacto.','Mapeamos o trabalho, localizamos fricção e definimos onde a inteligência deve entrar.'],['Sistemas de conhecimento','Tornar o contexto da empresa pesquisável e utilizável.','Construímos retrieval, citações, controlo de acessos e apoio à decisão sobre fontes reais.'],['Agentes operacionais','Transformar contexto em ação preparada.','Construímos copilotos e agentes que ajudam equipas a preparar, triagem, coordenação e execução.']] },
            { h:'Quando é a área certa.', p:'Escolhe Intelligence quando o negócio precisa de usar o seu próprio contexto com mais rapidez, segurança e clareza de ação.', cards:[['Sinais','As pessoas fazem as mesmas perguntas, procuram os mesmos ficheiros ou reconstroem o mesmo contexto.','Criamos uma camada fiável de conhecimento e decisão para a organização reutilizar o que já sabe.'],['Resultado','As equipas recebem respostas mais rápidas, melhor preparação e próximos passos mais claros.','O sistema melhora velocidade e consistência sem retirar julgamento às pessoas responsáveis.']] }
          ],
          simpleCta:['Mostra-nos o trabalho que devia funcionar melhor.','Dizemos-te onde a IA faz sentido, o que construir primeiro e o que não deve ser automatizado.','Falar connosco <span class="arrow">→</span>'],
          heads:['O que entra em produção','Como pensamos IA','Métricas que queremos mover'],
          nums:['01 / sistemas','02 / lógica operacional','03 / medidas'],
          cards:[
            ['audit','Auditoria de Workflow com IA','Mapeamos onde o trabalho perde velocidade e priorizamos os casos em que IA cria alavanca real.'],
            ['knowledge','Sistema de Conhecimento com IA','Transformamos documentos, processos e decisões numa camada pesquisável, com respostas citadas.'],
            ['agents','Copilotos e agentes operacionais','Copiloto comercial, agente reunião-execução, triagem interna e automações ligadas às ferramentas existentes.']
          ],
          prose:'A pergunta nunca é “que modelo usamos?”. A pergunta é: que decisão, rotina ou fluxo fica melhor se a empresa conseguir ler o próprio contexto com mais velocidade?',
          bandTitle:'Sem feature sem contexto.',
          bandCopy:'Cada sistema começa por observar o trabalho real: onde nasce a informação, quem valida, onde falha, que risco existe e que ação deve acontecer a seguir.',
          list:['Integração com ferramentas existentes antes de substituir processos.','Respostas com fontes, permissões e rastreabilidade.','Medição simples: tempo poupado, erros reduzidos, decisões aceleradas.'],
          stats:['tempo até encontrar uma resposta interna','mais rápido da reunião à proposta enviada','reuniões com decisões, responsáveis e prazos registados'],
          cta:'Vamos ler o teu sistema?',
          ctaBtn:'Falar connosco <span class="arrow">→</span>'
        },
        en: {
          title:'Vouga Intelligence · AI Services',
          description:'Vouga Intelligence designs and delivers applied AI systems: workflow intelligence, knowledge systems and operational agents.',
          kicker:'applied AI · operating systems',
          lead:'We build AI systems into the workflows that already move the business: knowledge, decisions, customer operations and execution.',
          primary:'Start a conversation <span class="arrow">→</span>',
          secondary:'What it does',
          simpleSections:[
            { h:'Problems we enter.', p:'Vouga Intelligence connects company context, decisions and execution through AI systems that sit inside real workflows.', cards:[['01 / read','We map where knowledge lives and how decisions actually happen.','Documents, tools, permissions, meetings and tacit know-how become one usable view of the work.'],['02 / build','We turn that context into AI systems people can trust.','Search, retrieval, copilots and agents are designed with sources, access control and clear human ownership.'],['03 / operate','We put intelligence where the next action needs to happen.','The output is not a chatbot on the side. It is a working layer that helps teams decide, prepare and execute.']] },
            { h:'What it can produce.', p:'Each build starts from the workflow, then combines models, data, UI, permissions and adoption into a system people can actually use.', cards:[['Workflow intelligence','Find the highest-leverage AI intervention.','We map the work, locate friction and define where intelligence belongs.'],['Knowledge systems','Make company context searchable and usable.','We build retrieval, citations, access control and decision support around real sources.'],['Operational agents','Turn context into prepared action.','We build copilots and agents that help teams prepare, triage, coordinate and execute.']] },
            { h:'When it is the right pillar.', p:'Choose Intelligence when the business needs to use its own context faster, more safely and with clearer action.', cards:[['Signs','People are asking the same questions, searching the same files or rebuilding the same context.','We create a trusted knowledge and decision layer so the organisation can reuse what it already knows.'],['Outcome','Teams get faster answers, stronger preparation and clearer next actions.','The system improves speed and consistency without removing judgement from the people responsible.']] }
          ],
          simpleCta:['Show us the work that should work better.','We will tell you where AI belongs, what to build first and what should not be automated.','Start a conversation <span class="arrow">→</span>'],
          heads:['What goes into production','How we think about AI','Metrics we want to move'],
          nums:['01 / systems','02 / operating logic','03 / measures'],
          cards:[
            ['audit','AI Workflow Audit','We map where work loses speed and prioritize the cases where AI creates real leverage.'],
            ['knowledge','AI Knowledge System','We turn documents, processes and decisions into a searchable layer with cited answers.'],
            ['agents','Operational copilots and agents','Sales copilots, meeting-to-execution agents, internal triage and automations connected to existing tools.']
          ],
          prose:'The question is never “which model do we use?”. The question is: which decision, routine or workflow improves if the company can read its own context faster?',
          bandTitle:'No feature without context.',
          bandCopy:'Every system starts by observing real work: where information starts, who validates it, where it breaks, what risk exists and what action should happen next.',
          list:['Integrate with existing tools before replacing processes.','Answers with sources, permissions and traceability.','Simple measurement: time saved, errors reduced, decisions accelerated.'],
          stats:['time to find an internal answer','faster from meeting to proposal sent','meetings with decisions, owners and deadlines recorded'],
          cta:'Shall we read your system?',
          ctaBtn:'Start a conversation <span class="arrow">→</span>'
        }
      },
      foundations: {
        pt: {
          title:'Vouga Engineering · Produto e software',
          description:'A Vouga Engineering entrega validação, protótipos, produto, ferramentas internas, melhoria de software e execução técnica, com ou sem IA.',
          kicker:'produto · software · execução',
          lead:'Desenhamos, validamos e construímos software que muda a forma como o negócio trabalha, com ou sem IA.',
          primary:'Falar connosco <span class="arrow">→</span>',
          secondary:'O que faz',
          simpleSections:[
            { h:'O que a Engineering faz.', p:'A Vouga Engineering transforma mudança de negócio em software utilizável: validado, desenhado, construído e melhorado com ownership.', cards:[['01 / validar','Clarificamos o que deve ser construído antes de a construção ficar pesada.','Testamos pressupostos, enquadramos scope e reduzimos incerteza antes de comprometer orçamento e equipa.'],['02 / desenhar','Tornamos workflows complexos compreensíveis e usáveis.','Desenhamos interfaces, jornadas e decisões de produto para que as pessoas adotem a mudança com confiança.'],['03 / construir','Entregamos software que pode continuar a evoluir depois do lançamento.','Produtos, ferramentas internas, integrações e melhorias são construídos com arquitetura e ownership claros.']] },
            { h:'O que pode produzir.', p:'Engineering cobre validação, design de produto, execução técnica e melhoria do software que já existe dentro do negócio.', cards:[['Validação de produto','Transformar oportunidades pouco claras em evidência, scope e decisões de construção.','Enquadramos o problema, testamos os pressupostos mais arriscados e definimos o que merece ser construído.'],['UX e interface','Tornar sistemas complexos compreensíveis, usáveis e prontos para adoção.','Desenhamos interfaces que ajudam pessoas a compreender o trabalho e agir com confiança.'],['Engenharia de software','Construir produtos, ferramentas internas, integrações e melhorias que continuam a evoluir.','Entregamos software funcional com a arquitetura e ownership necessários depois do lançamento.']] },
            { h:'Quando é a área certa.', p:'Escolhe Engineering quando a organização precisa de um produto, ferramenta ou mudança de software que tem de funcionar na prática.', cards:[['Sinais','A ferramenta, produto ou workflow atual é lento, frágil ou difícil de usar.','Encontramos o que precisa de mudar e desenhamos e construímos a camada de software que faz o sistema funcionar melhor.'],['Resultado','O negócio ganha um caminho de produto mais claro e software funcional que pode assumir como seu.','O resultado pode ser um protótipo, produto, plataforma interna, integração ou melhoria de um sistema existente.']] }
          ],
          simpleCta:['Traz-nos o sistema que precisa de avançar.','Ajudamos a definir o que deve mudar, o que deve ser construído e como entregar.', 'Falar connosco <span class="arrow">→</span>'],
          heads:['Antes de construir, reduzimos incerteza','Roadmap de fundação','O que pode sair daqui'],
          nums:['01 / fundação','02 / caminho de construção','03 / outputs'],
          bandTitle:'A primeira versão não é pequena por falta de ambição. É pequena para aprender depressa.',
          bandCopy:'O esqueleto desta página ainda é draft, mas a tese é clara: uma boa fundação define o que deve ser verdade para a ideia funcionar, depois constrói apenas o necessário para testar isso.',
          cards:[
            ['risk','Mapa de risco','Hipóteses, dependências, dados necessários, esforço técnico e pontos onde a ideia pode falhar.'],
            ['prototype','Protótipo funcional','Não um mockup bonito: uma versão que permite testar comportamento, decisão ou venda.'],
            ['system','Produto evolutivo','Arquitetura simples, mas preparada para crescer se a validação justificar o passo seguinte.']
          ],
          steps:[
            ['semana 01','Discovery de risco','Entendemos utilizador, contexto, constraints e o que precisa de ser validado antes de escrever muito código.'],
            ['semana 02','Arquitetura mínima','Escolhemos stack, integrações, dados e superfície inicial do produto. O objetivo é aprender, não impressionar.'],
            ['semanas 03-06','Construção piloto','Produto funcional, testável e já com o suficiente para pôr nas mãos de utilizadores ou clientes reais.'],
            ['depois','Escalar ou matar','Com dados na mesa, decidimos: refinar, escalar, pivotar ou parar. Sem teatro de produto.']
          ],
          stats:['Produto inicial para testar venda, uso ou operação interna','Protótipo navegável com lógica real e dados simulados','Plano técnico para passagem a produto ou sistema interno'],
          cta:'Tens uma ideia que precisa de chão?',
          ctaBtn:'Construir a primeira fundação <span class="arrow">→</span>'
        },
        en: {
          title:'Vouga Engineering · Product and software delivery',
          description:'Vouga Engineering delivers validation, prototypes, products, internal tools, software improvement and technical execution, with or without AI.',
          kicker:'product · software · execution',
          lead:'We design, validate and build software that changes how the business works, with or without AI.',
          primary:'Start a conversation <span class="arrow">→</span>',
          secondary:'What it does',
          simpleSections:[
            { h:'What Engineering does.', p:'Vouga Engineering turns business change into usable software: validated, designed, built and improved with ownership.', cards:[['01 / validate','We clarify what should be built before the build gets heavy.','We test assumptions, frame scope and reduce uncertainty before budget and people are committed.'],['02 / design','We make complex workflows understandable and usable.','We shape interfaces, journeys and product decisions so people can adopt the change with confidence.'],['03 / build','We deliver software that can keep evolving after launch.','Products, internal tools, integrations and improvements are built with clear architecture and ownership.']] },
            { h:'What it can produce.', p:'Engineering covers validation, product design, technical delivery and improvement of the software already inside the business.', cards:[['Product validation','Turn unclear opportunities into evidence, scope and build decisions.','We frame the problem, test the risky assumptions and define what deserves to be built.'],['UX and interface design','Make complex systems understandable, usable and ready for adoption.','We design interfaces that help people understand the work and act with confidence.'],['Software engineering','Build products, internal tools, integrations and improvements that can keep evolving.','We deliver working software with the architecture and ownership needed after launch.']] },
            { h:'When it is the right pillar.', p:'Choose Engineering when the organisation needs a product, tool or software change that has to work in practice.', cards:[['Signs','The current tool, product or workflow is too slow, fragile or hard to use.','We find what needs to change, then design and build the software layer that makes the system work better.'],['Outcome','The business gets a clearer product path and working software it can own.','The result can be a prototype, product, internal platform, integration or improvement to an existing system.']] }
          ],
          simpleCta:['Bring us the system that needs to move.','We will help define what should change, what should be built and how to deliver it.','Start a conversation <span class="arrow">→</span>'],
          heads:['Before building, we reduce uncertainty','Foundation roadmap','What can come out of this'],
          nums:['01 / foundation','02 / build path','03 / outputs'],
          bandTitle:'The first version is not small because ambition is small. It is small so learning is fast.',
          bandCopy:'This page is still a draft skeleton, but the thesis is clear: a good foundation defines what must be true for the idea to work, then builds only what is needed to test that.',
          cards:[
            ['risk','Risk map','Hypotheses, dependencies, required data, technical effort and the points where the idea can fail.'],
            ['prototype','Functional prototype','Not a pretty mockup: a version that can test behavior, decision or sales.'],
            ['system','Evolving product','Simple architecture, but ready to grow if validation justifies the next step.']
          ],
          steps:[
            ['week 01','Risk discovery','We understand user, context, constraints and what must be validated before writing too much code.'],
            ['week 02','Minimum architecture','We choose stack, integrations, data and the first product surface. The goal is to learn, not impress.'],
            ['weeks 03-06','Pilot build','A functional, testable product with enough substance to put in front of real users or customers.'],
            ['after','Scale or kill','With data on the table, we decide: refine, scale, pivot or stop. No product theatre.']
          ],
          stats:['Initial product to test sales, usage or internal operation','Navigable prototype with real logic and simulated data','Technical plan for moving into product or internal system'],
          cta:'Have an idea that needs ground?',
          ctaBtn:'Build the first foundation <span class="arrow">→</span>'
        }
      },
      academy: {
        pt: {
          title:'Vouga Academy · Still loading',
          description:'A Vouga Academy está em desenvolvimento: uma futura capacidade para aprendizagem aplicada, talento e as pessoas que vão construir o que vem a seguir.',
          kicker:'',
          lead:'A Academy vai ajudar equipas e talento emergente a desenvolver capacidade através de trabalho real, não de formação genérica.',
          primary:'Falar connosco <span class="arrow">→</span>',
          secondary:'Voltar a Fundações',
          academyBlur:{ heading:'O que a Academy vai fazer.', body:'A Academy será a camada de aprendizagem futura da Vouga: programas práticos, contextos reais de negócio e desenvolvimento de talento em torno de sistemas, software e IA.', cards:[['01','Treinar equipas no seu trabalho real.','Programas construídos sobre workflows, documentos, ferramentas e decisões existentes.'],['02','Transformar aprendizagem em artefactos úteis.','Workshops e studios devem deixar playbooks, protótipos ou hábitos operacionais.'],['03','Ligar talento emergente a responsabilidade real.','Uma ponte entre educação, projetos aplicados e o standard necessário dentro das empresas.']], loading:'Vouga Academy está em desenvolvimento.'},
          heads:['A ponte que queremos construir','Formatos possíveis','Princípios da Academy','Indicadores de sucesso'],
          nums:['01 / ponte','02 / formatos','03 / princípios','04 / medidas'],
          cards:[
            ['teams','Equipas treinadas no próprio trabalho','Menos formação genérica. Mais sessões em cima de documentos, clientes, decisões e ferramentas reais.'],
            ['talent','Talento técnico com contexto','Jovens engenheiros e builders aprendem a pensar sistema, não só a entregar features.'],
            ['connection','Ligação entre empresa e capacidade','A empresa ganha fluência em IA e acesso a pessoas capazes de sustentar o que foi construído.']
          ],
          thread:[
            ['workshops','Blocos práticos sobre IA aplicada a funções específicas: comercial, operações, gestão e produto.'],
            ['playbooks','Guias por função, com exemplos reais e rotinas que ficam depois da formação.'],
            ['office hours','Acompanhamento depois da sessão para garantir que a mudança entra no trabalho diário.'],
            ['talent bridge','Pipeline futuro de talento jovem formado na forma Vouga de pensar sistemas.']
          ],
          bandTitle:'Aprender IA sem tocar no trabalho é quase turismo.',
          bandCopy:'A Academy deve nascer de casos vivos: propostas, reuniões, pesquisas, documentos internos, decisões e fluxos reais. O objetivo não é “saber prompts”. É trabalhar melhor.',
          list:['Formação desenhada por função e por rotina, não por ferramenta.','Talento jovem exposto cedo a problemas de negócio reais.','Uso responsável: segurança, privacidade, revisão humana e rastreabilidade.','Comunidade futura para quem quer construir com inteligência e critério.'],
          stats:['uso ativo semanal 60 dias após formação aplicada','poupadas por pessoa/semana em rotinas apoiadas por IA','NPS médio desejado para turmas e equipas piloto'],
          cta:'Queres formar uma equipa ou encontrar talento?',
          ctaBtn:'Abrir conversa <span class="arrow">→</span>'
        },
        en: {
          title:'Vouga Academy · Still loading',
          description:'Vouga Academy is in development: a future capability for applied learning, talent and the people who will build what comes next.',
          kicker:'',
          lead:'Academy will help teams and emerging talent build capability through real work, not generic training.',
          primary:'Start a conversation <span class="arrow">→</span>',
          secondary:'Back to foundations',
          academyBlur:{ heading:'What Academy will do.', body:'Academy is the future learning layer of Vouga: practical programmes, real business contexts and talent development around systems, software and AI.', cards:[['01','Train teams on their actual work.','Programmes built around existing workflows, documents, tools and decisions.'],['02','Turn learning into useful artefacts.','Workshops and studios should leave behind playbooks, prototypes or operational habits.'],['03','Connect emerging talent to real responsibility.','A bridge between education, applied projects and the standard needed inside companies.']], loading:'Vouga Academy is in development.'},
          heads:['The bridge we want to build','Possible formats','Academy principles','Success indicators'],
          nums:['01 / bridge','02 / formats','03 / principles','04 / measures'],
          cards:[
            ['teams','Teams trained on their own work','Less generic training. More sessions on real documents, clients, decisions and tools.'],
            ['talent','Technical talent with context','Young engineers and builders learn to think in systems, not just ship features.'],
            ['connection','Connection between company and capability','The company gains AI fluency and access to people able to sustain what was built.']
          ],
          thread:[
            ['workshops','Practical blocks on AI applied to specific functions: commercial, operations, management and product.'],
            ['playbooks','Role-based guides with real examples and routines that remain after training.'],
            ['office hours','Follow-up after the session to make sure the change enters daily work.'],
            ['talent bridge','A future pipeline of young talent trained in Vouga’s way of thinking systems.']
          ],
          bandTitle:'Learning AI without touching the work is almost tourism.',
          bandCopy:'Academy should be born from live cases: proposals, meetings, research, internal documents, decisions and real flows. The goal is not “knowing prompts”. It is working better.',
          list:['Training designed by role and routine, not by tool.','Young talent exposed early to real business problems.','Responsible use: security, privacy, human review and traceability.','A future community for people who want to build with intelligence and judgment.'],
          stats:['weekly active usage 60 days after applied training','saved per person/week in AI-supported routines','target average NPS for cohorts and pilot teams'],
          cta:'Do you want to train a team or find talent?',
          ctaBtn:'Open a conversation <span class="arrow">→</span>'
        }
      }
    };

    var INTEL_PT = {
      thesisLabel:'01 / A CAMADA OPERACIONAL',
      thesisTitle:'A IA não deve ser mais uma ferramenta à margem do negócio. Deve melhorar o próprio funcionamento da empresa.',
      thesisCopy:'Na Vouga Intelligence, ligamos modelos, conhecimento interno e processos reais num único sistema. O objetivo é simples: respostas com contexto, decisões mais seguras e trabalho que avança.',
      flow1Title:'Compreender o sistema',flow1Copy:'Perceber como o trabalho acontece, que contexto exige e onde encontra limites.',
      flow2Title:'Melhorar a decisão',flow2Copy:'Levar informação fiável ao momento em que é preciso decidir.',
      flow3Title:'Fazer avançar o trabalho',flow3Copy:'Transformar a decisão em ação dentro das ferramentas que a equipa já utiliza.',
      servicesLabel:'02 / SERVIÇOS DE IA APLICADA',servicesTitle:'Três serviços. Uma camada de inteligência.',
      servicesIntro:'Cada serviço resolve uma camada concreta. Em conjunto, criam um sistema que compreende o negócio, preserva o seu conhecimento e ajuda as equipas a executar melhor.',
      service1Tag:'VER O TRABALHO',service1Title:'Inteligência de Processos',
      service1Copy:'Mapeamos como o trabalho acontece na realidade, encontramos onde o contexto se perde e definimos a intervenção de IA com maior impacto.',
      service1Item1:'Auditoria de processos com IA',service1Item2:'Mapa de oportunidade e risco',service1Item3:'Arquitetura piloto e plano de prioridades',
      service1Result:'Começar pelo problema certo antes de investir na solução errada.',
      service2Tag:'CONHECER O NEGÓCIO',service2Title:'Sistemas de Conhecimento e Decisão',
      service2Copy:'Transformamos documentos, decisões e conhecimento disperso numa camada de inteligência governada em que a equipa pode confiar.',
      service2Item1:'RAG empresarial e pesquisa semântica',service2Item2:'Copilotos de decisão com fontes',service2Item3:'Memória organizacional com controlo de acessos',
      service2Result:'Dar a cada decisão acesso ao contexto que a empresa já possui.',
      service3Tag:'MOVER O TRABALHO',service3Title:'Agentes Operacionais',
      service3Copy:'Construímos copilotos e agentes que preparam, coordenam e executam trabalho dentro das ferramentas que as equipas já usam.',
      service3Item1:'Copilotos comerciais e de serviço',service3Item2:'Sistemas que transformam reuniões em ação',service3Item3:'Agentes de triagem e automação operacional',
      service3Result:'Transformar inteligência em ação sem retirar responsabilidade humana.',buildLabel:'O QUE CONSTRUÍMOS',
      productionLabel:'03 / PADRÃO DE PRODUÇÃO',productionTitle:'Feito para entrar em produção. Preparado para continuar a criar valor.',
      productionCopy:'Criar uma demo convincente é fácil. Construir um sistema em que a equipa confia todos os dias exige arquitetura, governação e responsabilidade desde o primeiro momento.',
      standard1Title:'Integrado',standard1Copy:'Liga-se às ferramentas e aos dados que já fazem parte da operação.',
      standard2Title:'Fiável',standard2Copy:'Responde com base no contexto da empresa e mostra as fontes sempre que são relevantes.',
      standard3Title:'Com controlo de acessos',standard3Copy:'Cada pessoa acede apenas à informação que deve ver.',
      standard4Title:'Com controlo humano',standard4Copy:'As decisões continuam nas mãos das pessoas sempre que existe julgamento, impacto ou risco.',
      standard5Title:'Mensurável',standard5Copy:'A qualidade, a utilização e as falhas ficam visíveis para poderem ser melhoradas.',
      standard6Title:'Preparado para a equipa',standard6Copy:'Depois do lançamento, a equipa consegue operar e evoluir o sistema sem ficar dependente de nós.',
      methodLabel:'04 / COMO CONSTRUÍMOS',methodTitle:'Do processo ao sistema em produção.',
      methodCopy:'Trabalhamos depressa, sem saltar as decisões que tornam a construção realmente útil.',
      method1Title:'Ler o contexto',method1Copy:'Observar o workflow, as pessoas, os dados, as decisões e as restrições.',
      method2Title:'Desenhar a intervenção',method2Copy:'Escolher onde entra a IA, o que permanece humano e o que significa sucesso.',
      method3Title:'Construir o piloto',method3Copy:'Colocar um sistema funcional nas mãos da equipa e testá-lo com trabalho real.',
      method4Title:'Operar e melhorar',method4Copy:'Medir utilização, qualidade e impacto. Reforçar apenas o que demonstra valor.',
      useLabel:'05 / ONDE CRIA VALOR',useTitle:'IA aplicada onde o trabalho custa mais.',
      useCopy:'As melhores oportunidades raramente são “projetos de IA”. São processos importantes que se tornaram lentos, fragmentados ou demasiado dependentes da memória individual.',
      use1Label:'COMERCIAL',use1Title:'Do histórico do cliente à próxima melhor ação.',use1Copy:'Preparação, propostas e acompanhamento apoiados pelo contexto comercial real da empresa.',
      use2Label:'OPERAÇÕES',use2Title:'De pedidos dispersos a execução controlada.',use2Copy:'Triagem, encaminhamento, exceções e passagens de trabalho coordenadas com supervisão humana clara.',
      use3Label:'LIDERANÇA',use3Title:'Da procura de informação à decisão preparada.',use3Copy:'Evidência, memória organizacional e sinais atuais reunidos à volta da decisão.',
      ctaLabel:'COMEÇAR PELO TRABALHO',ctaTitle:'Mostra-nos o processo que devia funcionar melhor.',
      ctaCopy:'Dizemos-te onde faz sentido aplicar IA, o que deve ser construído primeiro e o que deve continuar nas mãos das pessoas.',ctaButton:'Mapear a oportunidade →'
    };

    var FOUNDATION_PT = {
      thesisLabel:'01 / REDUZIR A INCERTEZA',thesisTitle:'Construir o suficiente para aprender. Aprender o suficiente para investir.',
      thesisCopy:'Na Engineering, transformamos pressupostos em evidência antes de a empresa comprometer orçamento, tempo de contratação ou uma equipa completa.',
      proof1Title:'Definir o que tem de ser verdade',proof1Copy:'Clarificar quem tem o problema, que valor existe, quais são os limites e como será tomada a decisão.',
      proof2Title:'Testar primeiro o maior risco',proof2Copy:'Usar investigação, protótipos e sinais do mercado antes de aprofundar a construção.',
      proof3Title:'Investir com dados',proof3Copy:'Avançar para a implementação com âmbito, arquitetura e lógica comercial mais claros.',
      servicesLabel:'02 / ONDE ENTRAMOS',servicesTitle:'Da pergunta de investigação ao produto em funcionamento.',
      servicesCopy:'Entramos quando uma ideia precisa de prova, quando uma contratação exige uma POC séria ou quando falta a equipa capaz de transformar o produto em realidade.',
      service1Tag:'I&D EMPRESARIAL',service1Title:'Investigação e validação de mercado',
      service1Copy:'Ajudamos equipas de inovação a formular a oportunidade, compreender o mercado e testar se a ideia cria valor antes de aumentar o investimento.',
      service1Item1:'Definição da oportunidade e das hipóteses',service1Item2:'Investigação com clientes e mercado',service1Item3:'Conceito, protótipo e testes no terreno',
      service1Result:'Uma decisão sustentada por evidência, não apenas por entusiasmo.',
      service2Tag:'POC E CONTRATAÇÃO',service2Title:'Provas de conceito que eliminam dúvidas',
      service2Copy:'Depois da reunião de requisitos, transformamos a ambiguidade numa POC funcional, com critérios de aceitação, prova técnica e um âmbito de implementação preciso.',
      service2Item1:'Requisitos convertidos em resultados testáveis',service2Item2:'Validação de integrações e viabilidade',service2Item3:'Âmbito partilhado entre cliente e fornecedor',
      service2Result:'Menos desperdício, menos pressupostos e uma contratação mais segura para ambas as partes.',
      service3Tag:'PRODUTO E SOFTWARE',service3Title:'A tua ideia, a nossa equipa de produto',
      service3Copy:'Quando a ideia existe, mas falta equipa ou tempo, assumimos o caminho desde a definição do produto até ao desenvolvimento, lançamento e aprendizagem.',
      service3Item1:'Estratégia de produto e experiência',service3Item2:'Desenvolvimento Web, iOS e Android',service3Item3:'Lançamento, medição e evolução',
      service3Result:'Um produto no mercado, com o código fonte e a propriedade nas tuas mãos.',
      aiLabel:'03 / COMO A IA MUDA A CONSTRUÇÃO',aiTitle:'Construímos com IA. Diferenciamo-nos para lá dela.',
      aiCopy:'Ignorar a IA tornaria o desenvolvimento mais lento e caro. Depender apenas dela tornaria o produto superficial. Usamo-la onde cria verdadeira alavancagem e acrescentamos o critério, a investigação e a engenharia que não podem ser automatizados.',
      aiSpeedLabel:'A IA ACELERA',aiSpeed1:'Exploração e prototipagem',aiSpeed2:'Desenvolvimento e testes de software',aiSpeed3:'Conteúdo, análise e iteração',
      aiOwnLabel:'A VOUGA ASSUME',aiOwn1:'Critério de produto e evidência de clientes',aiOwn2:'Hardware, testes reais e integrações',aiOwn3:'Segurança, entrega e responsabilidade pelo resultado',
      capLabel:'04 / CAPACIDADE COMPLETA DE PRODUTO',capTitle:'Tudo o que é preciso para passar da ideia ao mercado.',
      capCopy:'Uma equipa responsável por produto, tecnologia, negócio e lançamento. O trabalho varia de projeto para projeto. A responsabilidade mantém-se.',
      cap1Title:'Produto e validação',cap1Copy:'Formulação da ideia, proposta de valor, investigação de mercado, requisitos, testes com utilizadores e estratégia de produto.',
      cap2Title:'Design de experiência',cap2Copy:'UI e UX modernos, experiências responsivas, protótipos e interfaces que se compreendem de imediato.',
      cap3Title:'Software e hardware',cap3Copy:'Produtos Web, iOS e Android completos, bases de dados seguras, autenticação, pagamentos e integrações físicas.',
      cap4Title:'Negócio e mercado',cap4Copy:'Posicionamento, lógica de preço, SEO, materiais de lançamento, medição e racional comercial do produto.',
      cap5Title:'Lançamento e continuidade',cap5Copy:'Colocação em produção, código fonte, documentação, atualizações regulares e apoio após o lançamento. Tudo fica do teu lado.',
      processLabel:'05 / O CAMINHO DE CONSTRUÇÃO',processTitle:'Uma decisão clara em cada fase.',
      processCopy:'O objetivo não é continuar a construir. É conquistar o direito de avançar para o passo seguinte.',
      phase1Title:'Enquadrar',phase1Copy:'Transformar a conversa inicial num problema, âmbito e critérios de sucesso precisos.',
      phase2Title:'Prototipar',phase2Copy:'Tornar a ideia suficientemente concreta para testar comportamento, viabilidade e valor.',
      phase3Title:'Validar',phase3Copy:'Testar com utilizadores, compradores, equipas operacionais ou ambientes físicos reais.',
      phase4Title:'Construir',phase4Copy:'Desenvolver o produto, as integrações e as bases operacionais necessárias para o lançamento.',
      phase5Title:'Lançar e aprender',phase5Copy:'Colocar em produção, medir, apoiar e decidir o que merece o investimento seguinte.',
      scenarioLabel:'06 / PONTOS DE PARTIDA HABITUAIS',
      scenario1Tag:'EQUIPA DE INOVAÇÃO',scenario1Title:'“Temos uma ideia promissora, mas ainda não temos evidência de mercado.”',
      scenario2Tag:'CONTRATAÇÃO',scenario2Title:'“Os requisitos parecem claros. Precisamos de provar a solução antes de assumir o compromisso.”',
      scenario3Tag:'EMPREENDEDOR OU UNIDADE DE NEGÓCIO',scenario3Title:'“Sabemos o que devia existir. Não temos equipa ou tempo para o construir.”',
      ctaLabel:'COMEÇAR PELA INCERTEZA',ctaTitle:'Traz-nos a ideia, o requisito ou o produto que ainda precisa de prova.',
      ctaCopy:'Definimos o que é preciso aprender, o que deve ser construído e que evidência justifica o investimento seguinte.',ctaButton:'Construir a fundação →'
    };

    var ACADEMY_PT = {
      thesisLabel:'01 / APRENDIZAGEM QUE ENTRA NO TRABALHO',thesisTitle:'A inteligência só ganha valor quando as pessoas a conseguem aplicar.',
      thesisCopy:'A Academy liga desafios reais das organizações, aprendizagem aplicada e talento técnico jovem. As equipas melhoram a forma de trabalhar. Os estudantes aprendem a construir em contextos que importam.',
      flow1Title:'Compreender',flow1Copy:'Ler o contexto, o processo e a decisão antes de escolher uma ferramenta.',
      flow2Title:'Praticar',flow2Copy:'Aplicar frameworks atuais a documentos, sistemas e problemas reais.',
      flow3Title:'Construir',flow3Copy:'Transformar a aprendizagem num artefacto, processo ou capacidade que permanece.',
      pathLabel:'02 / DOIS PERCURSOS',
      path1Tag:'PARA ORGANIZAÇÕES',path1Title:'Equipas que precisam de aplicar inteligência no trabalho real.',
      path1Copy:'Programas práticos construídos sobre os processos, clientes, documentos e decisões da própria equipa. O objetivo não é conhecer IA. É trabalhar melhor.',
      path1Item1:'Workshops desenhados por função',path1Item2:'Laboratórios aplicados aos processos reais',path1Item3:'Playbooks, sessões de acompanhamento e apoio à adoção',
      path2Tag:'PARA O ENSINO SUPERIOR E TALENTO',path2Title:'Talento jovem que quer construir, não apenas estudar.',
      path2Copy:'Parcerias com universidades e politécnicos que dão aos estudantes acesso a desafios reais, pensamento de fronteira e a responsabilidade de aplicar o que aprendem.',
      path2Item1:'Projetos com organizações reais',path2Item2:'Mentoria por quem constrói no terreno',path2Item3:'Frameworks para lá do currículo habitual',
      formatsLabel:'03 / FORMATOS DE PROGRAMA',formatsTitle:'Formatos diferentes. O mesmo rigor aplicado.',
      formatsCopy:'O formato segue o resultado. Um workshop focado, um estúdio de várias semanas ou uma parceria institucional começam sempre pelo trabalho que precisa de ser compreendido e melhorado.',
      format1Title:'Workshops aplicados',format1Copy:'Sessões focadas para equipas comerciais, operacionais, de gestão e produto, usando o seu próprio trabalho como matéria-prima.',
      format2Title:'Estúdios de desafio',format2Copy:'Equipas e estudantes resolvem um desafio vivo, do contexto e investigação ao protótipo e apresentação.',
      format3Title:'Parcerias de talento',format3Copy:'Relações continuadas com instituições de ensino superior que criam uma ponte recorrente entre aprendizagem, prática e oportunidade.',
      frontierLabel:'04 / CAPACIDADE DE FRONTEIRA',frontierTitle:'Preparar para um trabalho que continua a mudar.',
      frontierCopy:'Nos próximos anos, ferramentas, funções e expectativas vão mudar repetidamente. Preparamos pessoas para compreender sistemas, aprender depressa e construir com responsabilidade, qualquer que seja o próximo trabalho.',
      skill1Title:'Pensamento sistémico',skill1Copy:'Ver pessoas, decisões, incentivos, dados e tecnologia como um único sistema operacional.',
      skill2Title:'Fluência em IA aplicada',skill2Copy:'Escolher e usar modelos com contexto, critério e limites claros.',
      skill3Title:'Construção de produto',skill3Copy:'Passar de uma necessidade pouco clara para uma solução testada que as pessoas conseguem usar.',
      skill4Title:'Execução responsável',skill4Copy:'Construir com atenção à segurança, privacidade, evidência e controlo humano.',
      modelLabel:'05 / O MODELO DE APRENDIZAGEM',modelTitle:'Contexto primeiro. Prática do início ao fim.',
      modelCopy:'Sem teoria isolada e sem demonstrações de ferramentas sem propósito. Cada programa percorre o mesmo ciclo.',
      model1Title:'Ler o contexto',model1Copy:'Compreender as pessoas, o trabalho e as restrições por trás do desafio.',
      model2Title:'Aprender o framework',model2Copy:'Introduzir os modelos mentais e as ferramentas necessárias para agir com intenção.',
      model3Title:'Aplicar e construir',model3Copy:'Trabalhar sobre matéria real e produzir algo que pode ser testado.',
      model4Title:'Refletir e transferir',model4Copy:'Transformar a experiência numa capacidade repetível para o desafio seguinte.',
      outcomeLabel:'06 / O QUE FICA',outcome1Tag:'PARA A EQUIPA',outcome1Title:'Melhores rotinas, linguagem partilhada e confiança para aplicar inteligência com responsabilidade.',
      outcome2Tag:'PARA A INSTITUIÇÃO',outcome2Title:'Uma ponte credível entre o currículo, as empresas e o trabalho que os estudantes vão encontrar.',
      outcome3Tag:'PARA O ESTUDANTE',outcome3Title:'Evidência real do que consegue compreender, construir e assumir como responsabilidade.',
      ctaLabel:'CONSTRUIR A PONTE',ctaTitle:'Traz-nos uma equipa, um programa ou um desafio real.',
      ctaCopy:'Desenhamos a aprendizagem à volta do trabalho que as pessoas precisam de fazer e das capacidades de que vão precisar a seguir.',ctaButton:'Desenhar o programa →'
    };

    function q(sel){ return document.querySelector(sel); }
    function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
    function text(sel, value){ var el = q(sel); if (el && value != null) el.textContent = value; }
    function html(sel, value){ var el = q(sel); if (el && value != null) el.innerHTML = value; }
    function meta(sel, value){ var el = q(sel); if (el && value != null) el.setAttribute('content', value); }
    function sync(lang){
      if (!langToggle) return;
      qa('[data-lang-option]').forEach(function(option){
        option.classList.toggle('is-active', option.getAttribute('data-lang-option') === lang);
      });
      langToggle.setAttribute('aria-label', lang === 'pt' ? 'Switch to English' : 'Mudar para português');
    }
    function setCards(items){
      qa('.detail-grid .detail-card').forEach(function(card, i){
        if (!items[i]) return;
        textNode(card.querySelector('.label'), items[i][0]);
        textNode(card.querySelector('h3'), items[i][1]);
        textNode(card.querySelector('p'), items[i][2]);
      });
    }
    function textNode(el, value){ if (el && value != null) el.textContent = value; }
    function setList(sel, items){ qa(sel).forEach(function(el, i){ if (items[i]) el.textContent = items[i]; }); }
    function setHeads(copy){
      qa('.detail-section-head h2').forEach(function(el, i){ if (copy.heads[i]) el.textContent = copy.heads[i]; });
      qa('.detail-section-head .detail-num').forEach(function(el, i){ if (copy.nums[i]) el.textContent = copy.nums[i]; });
    }
    function setSimpleSections(sections){
      if (!sections) return;
      qa('.detail-simple-section').forEach(function(section, i){
        var data = sections[i];
        if (!data) return;
        textNode(section.querySelector('.detail-simple-head h2'), data.h);
        textNode(section.querySelector('.detail-simple-head p'), data.p);
        Array.prototype.slice.call(section.querySelectorAll('.detail-simple-card,.detail-work-card')).forEach(function(card, j){
          if (!data.cards || !data.cards[j]) return;
          textNode(card.querySelector('span'), data.cards[j][0]);
          textNode(card.querySelector('h3'), data.cards[j][1]);
          textNode(card.querySelector('p'), data.cards[j][2]);
        });
      });
    }
    function setSimpleCta(data){
      if (!data) return;
      text('.detail-cta-simple h2', data[0]);
      text('.detail-cta-simple p', data[1]);
      html('.detail-cta-simple .btn-primary', data[2]);
    }
    function setAcademyBlur(data){
      if (!data) return;
      text('.academy-blur-head h2', data.heading);
      text('.academy-blur-head p', data.body);
      qa('.academy-blur-grid article').forEach(function(card, i){
        if (!data.cards || !data.cards[i]) return;
        textNode(card.querySelector('span'), data.cards[i][0]);
        textNode(card.querySelector('h3'), data.cards[i][1]);
        textNode(card.querySelector('p'), data.cards[i][2]);
      });
      text('.academy-loading-overlay p', data.loading);
    }
    function apply(lang){
      lang = lang === 'en' ? 'en' : 'pt';
      currentLang = lang;
      root.setAttribute('lang', lang === 'en' ? 'en' : 'pt-PT');
      root.setAttribute('data-lang', lang);
      var common = COMMON[lang], copy = COPY[page][lang];
      document.title = copy.title;
      meta('meta[name="description"]', copy.description);
      qa('.nav .btn-primary').forEach(function(btn){ btn.textContent = common.contact; });
      qa('.nav-links a,.mobile-links a').forEach(function(a, i){ a.textContent = common.nav[i % common.nav.length]; });
      var logo = q('.logo'); if (logo) logo.setAttribute('aria-label', common.logo);
      text('.detail-kicker', copy.kicker);
      text('.detail-lead', copy.lead);
      html('.detail-actions .btn-primary', copy.primary);
      text('.detail-actions .btn-ghost', copy.secondary);
      setSimpleSections(copy.simpleSections);
      setSimpleCta(copy.simpleCta);
      setAcademyBlur(copy.academyBlur);
      setHeads(copy);
      setCards(copy.cards || []);
      if (page === 'intelligence') {
        qa('[data-intel-copy]').forEach(function(el){
          if (!el.hasAttribute('data-intel-en')) el.setAttribute('data-intel-en', el.textContent);
          var key = el.getAttribute('data-intel-copy');
          var value = lang === 'pt' ? INTEL_PT[key] : el.getAttribute('data-intel-en');
          if (value != null) el.textContent = value;
        });
        text('.detail-split > .detail-prose', copy.prose);
        text('.detail-band h3', copy.bandTitle);
        text('.detail-band .detail-prose', copy.bandCopy);
        setList('.detail-list li', copy.list);
      }
      if (page === 'foundations') {
        qa('[data-foundation-copy]').forEach(function(el){
          if (!el.hasAttribute('data-foundation-en')) el.setAttribute('data-foundation-en', el.textContent);
          var key = el.getAttribute('data-foundation-copy');
          var value = lang === 'pt' ? FOUNDATION_PT[key] : el.getAttribute('data-foundation-en');
          if (value != null) el.textContent = value;
        });
        text('.detail-band h3', copy.bandTitle);
        text('.detail-band .detail-prose', copy.bandCopy);
        qa('.foundation-step').forEach(function(step, i){
          if (!copy.steps[i]) return;
          textNode(step.querySelector('strong'), copy.steps[i][0]);
          textNode(step.querySelector('h3'), copy.steps[i][1]);
          textNode(step.querySelector('p'), copy.steps[i][2]);
        });
      }
      if (page === 'academy') {
        qa('[data-academy-copy]').forEach(function(el){
          if (!el.hasAttribute('data-academy-en')) el.setAttribute('data-academy-en', el.textContent);
          var key = el.getAttribute('data-academy-copy');
          var value = lang === 'pt' ? ACADEMY_PT[key] : el.getAttribute('data-academy-en');
          if (value != null) el.textContent = value;
        });
      }
      setList('.detail-stat span', copy.stats);
      text('.detail-cta h2', copy.cta);
      html('.detail-cta .btn-primary', copy.ctaBtn);
      sync(lang);
    }

    apply(currentLang);
    if (langToggle) {
      langToggle.addEventListener('click', function(){
        var next = currentLang === 'pt' ? 'en' : 'pt';
        apply(next);
        try { localStorage.setItem('vouga-lang', next); } catch(e) {}
      });
    }
  })();

  (function renderDetailAscii(){
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-detail-ascii]'));
    if (!els.length) return;

    var charset = ' .:-=+*#%@';
    var mutators = '%#$@&+=*';

    function luminance(r,g,b){ return (0.2126 * r) + (0.7152 * g) + (0.0722 * b); }
    function lightBackground(r,g,b,minLum,maxSat){
      var lum = luminance(r,g,b);
      var max = Math.max(r,g,b), min = Math.min(r,g,b);
      var sat = max ? (max - min) / max : 0;
      var beigeLean = r >= b && g >= b && Math.abs(r - g) < 52;
      return lum > minLum && sat < maxSat && beigeLean;
    }
    function handBackground(r,g,b){
      var lum = luminance(r,g,b);
      var max = Math.max(r,g,b), min = Math.min(r,g,b);
      var sat = max ? (max - min) / max : 0;
      var beigeLean = r >= b && g >= b && Math.abs(r - g) < 58;
      return lum > 116 && sat < .38 && beigeLean;
    }
    function masked(mask,r,g,b,a,x,y,w,h){
      if (a < 24) return true;
      if (mask === 'alpha') return a < 24;
      if (mask === 'paper') return lightBackground(r,g,b, 172, .46);
      if (mask === 'hand') {
        var nx = x / w, ny = y / h;
        if (nx < .25 && ny > .64) return true;
        return handBackground(r,g,b);
      }
      return lightBackground(r,g,b, 218, .22);
    }
    function cellAspect(el){
      var cs = getComputedStyle(el);
      var fontSize = parseFloat(cs.fontSize) || 5;
      var lineHeight = parseFloat(cs.lineHeight) || fontSize * .9;
      var letterSpacing = parseFloat(cs.letterSpacing) || 0;
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      ctx.font = cs.font;
      return (ctx.measureText('M').width + letterSpacing) / lineHeight;
    }
    function escapeChar(char){
      if (char === '&') return '&amp;';
      if (char === '<') return '&lt;';
      if (char === '>') return '&gt;';
      return char;
    }
    function fitParent(study){
      if (!study.fitParent || (study.mobileAscii && !study.fitMobile)) return;
      var parent = study.el.parentElement;
      if (!parent) return;
      var target = parent.clientWidth;
      var actual = study.el.scrollWidth;
      var current = parseFloat(getComputedStyle(study.el).fontSize) || 5;
      if (!target || !actual) return;
      study.el.style.fontSize = Math.max(2, Math.min(12, current * (target / actual))) + 'px';
    }
    function render(study){
      if (!study.accentEnabled) {
        study.el.textContent = study.cells.map(function(row){ return row.join(''); }).join('\n');
        return;
      }
      var lines = study.cells.map(function(row,y){
        return row.map(function(char,x){
          var accent = study.accents[y + ':' + x];
          var output = accent && accent.char ? accent.char : char;
          var accentClass = accent && accent.word ? 'ascii-accent ascii-word' : 'ascii-accent';
          return accent ? '<span class="' + accentClass + '">' + escapeChar(output) + '</span>' : escapeChar(output);
        }).join('');
      });
      study.el.innerHTML = lines.join('\n');
    }
    function build(study){
      var cols = study.cols;
      var rows = Math.max(1, Math.round(cols * (study.img.naturalHeight / study.img.naturalWidth) * cellAspect(study.el)));
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d', { willReadFrequently:true });
      canvas.width = cols;
      canvas.height = rows;
      ctx.drawImage(study.img, 0, 0, cols, rows);
      var data = ctx.getImageData(0, 0, cols, rows).data;
      var visibleRows = Math.max(1, Math.round(rows * (1 - study.trimBottom)));
      study.cells = [];
      study.live = [];
      study.wordStarts = {};
      for (var y = 0; y < visibleRows; y++) {
        var row = [];
        for (var x = 0; x < cols; x++) {
          var i = (y * cols + x) * 4;
          var r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          if (masked(study.mask,r,g,b,a,x,y,cols,rows)) {
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
      if (study.accentEnabled) {
        var wordLengths = {};
        study.words.forEach(function(word){ wordLengths[word.length] = true; });
        Object.keys(wordLengths).forEach(function(lengthKey){
          var length = parseInt(lengthKey,10);
          study.wordStarts[length] = [];
          for (var wy = 0; wy < study.cells.length; wy++) {
            for (var wx = 0; wx <= cols - length; wx++) {
              var canWrite = true;
              for (var wi = 0; wi < length; wi++) {
                if (study.cells[wy][wx + wi] === ' ') { canWrite = false; break; }
              }
              if (canWrite) study.wordStarts[length].push([wy,wx]);
            }
          }
        });
        study.nextWordAt = Date.now() + (study.frequentWords ? 280 + Math.random() * 520 : 1400 + Math.random() * 1800);
      }
      render(study);
      fitParent(study);
    }
    function tick(study){
      if (document.hidden || !study.live.length) return;
      var now = Date.now();
      var n = Math.max(7, Math.floor(study.live.length * .028));
      for (var i = 0; i < n; i++) {
        var cell = study.live[Math.floor(Math.random() * study.live.length)];
        var jitter = Math.floor(Math.random() * 5) - 2;
        var shade = Math.max(0, Math.min(charset.length - 1, cell[2] + jitter));
        study.cells[cell[0]][cell[1]] = Math.random() < .12 ? mutators[Math.floor(Math.random() * mutators.length)] : charset[shade];
      }
      if (study.accentEnabled) {
        Object.keys(study.accents).forEach(function(key){
          if (study.accents[key].until <= now) delete study.accents[key];
        });
        if (Math.random() < .72) {
          var sparks = 1 + Math.floor(Math.random() * 3);
          for (var s = 0; s < sparks; s++) {
            var spark = study.live[Math.floor(Math.random() * study.live.length)];
            study.accents[spark[0] + ':' + spark[1]] = { until:now + 520 + Math.random() * 720 };
          }
        }
        if (now >= study.nextWordAt && study.words.length) {
          var word = study.words[Math.floor(Math.random() * study.words.length)];
          var starts = study.wordStarts[word.length] || [];
          if (starts.length) {
            var start = starts[Math.floor(Math.random() * starts.length)];
            var wordDuration = study.frequentWords ? 1450 : 1050;
            for (var w = 0; w < word.length; w++) {
              study.accents[start[0] + ':' + (start[1] + w)] = { char:word[w], word:true, until:now + wordDuration };
            }
          }
          study.nextWordAt = now + (study.frequentWords ? 430 + Math.random() * 720 : 2400 + Math.random() * 2600);
        }
      }
      render(study);
    }

    var studies = els.map(function(el){
      var accentEnabled = el.hasAttribute('data-ascii-accent');
      var wordAttr = el.getAttribute('data-ascii-words');
      var mobileAscii = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
      var baseCols = parseInt(el.getAttribute('data-cols') || '78', 10);
      var mobileCols = parseInt(el.getAttribute('data-mobile-cols') || baseCols, 10);
      var study = {
        el: el,
        src: el.getAttribute('data-src'),
        mask: el.getAttribute('data-mask') || 'light',
        cols: mobileAscii ? mobileCols : baseCols,
        baseCols: baseCols,
        mobileCols: mobileCols,
        mobileAscii: mobileAscii,
        fitParent: el.hasAttribute('data-ascii-fit-parent'),
        fitMobile: el.hasAttribute('data-ascii-fit-mobile'),
        trimBottom: parseFloat(el.getAttribute('data-trim-bottom') || '0') || 0,
        img: new Image(),
        cells: [],
        live: [],
        accentEnabled: accentEnabled,
        accents: {},
        words: wordAttr ? wordAttr.split('|').filter(Boolean) : (accentEnabled ? ['VOUGA'] : []),
        frequentWords: !!wordAttr,
        wordStarts: {},
        nextWordAt: 0
      };
      study.img.onload = function(){ build(study); };
      study.img.src = study.src;
      return study;
    });

    var resizeTimer = null;
    window.addEventListener('resize', function(){
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function(){
        var mobileAscii = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
        studies.forEach(function(study){
          var nextCols = mobileAscii ? study.mobileCols : study.baseCols;
          if (study.mobileAscii !== mobileAscii || study.cols !== nextCols) {
            study.mobileAscii = mobileAscii;
            study.cols = nextCols;
            study.el.style.fontSize = '';
            if (study.img.complete) build(study);
            return;
          }
          fitParent(study);
        });
      }, 120);
    });

    if (!reducedMotion) {
      window.setInterval(function(){ studies.forEach(tick); }, 130);
    }
  })();

})();
