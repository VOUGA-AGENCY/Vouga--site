(function(){
  'use strict';

  var root = document.documentElement;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var currentLang = 'en';
  try {
    var savedLang = localStorage.getItem('vouga-lang');
    if (savedLang === 'pt' || savedLang === 'en') currentLang = savedLang;
  } catch(e) {}

  (function initTheme(){
    var theme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    try {
      var savedTheme = localStorage.getItem('vouga-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') theme = savedTheme;
    } catch(e) {}
    root.setAttribute('data-theme', theme);

    function toggleTheme(){
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('vouga-theme', next); } catch(e) {}
    }
    var btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);
    var mobileBtn = document.getElementById('themeToggleMobile');
    if (mobileBtn) mobileBtn.addEventListener('click', toggleTheme);
  })();

  (function initMobileMenu(){
    var navBurger = document.getElementById('navBurger');
    var mobileMenu = document.getElementById('mobileMenu');
    function enforceMobileNavSurface(){
      var mobile = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
      document.querySelectorAll('.nav .nav-right > .theme-toggle, .nav .nav-right > .desktop-contact, .nav .nav-right > a[href^="mailto"]').forEach(function(el){
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
      pt: { contact:'Contacte-nos', theme:'alternar modo claro e escuro', logo:'Vouga Agency, início' },
      en: { contact:'Contact us', theme:'toggle light and dark mode', logo:'Vouga Agency, home' }
    };
    var COPY = {
      intelligence: {
        pt: {
          title:'Vouga Intelligence · AI Services',
          description:'Vouga Intelligence desenha e implementa serviços de IA aplicada: inteligência de workflows, sistemas de conhecimento e agentes operacionais.',
          kicker:'AI services · sistemas de operação',
          lead:'Construímos IA aplicada dentro do trabalho que já move o negócio: conhecimento, decisões, operações de cliente e execução.',
          primary:'Mapear a oportunidade <span class="arrow">→</span>',
          secondary:'Explorar os serviços',
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
          ctaBtn:'Começar pelo diagnóstico <span class="arrow">→</span>'
        },
        en: {
          title:'Vouga Intelligence · AI Services',
          description:'Vouga Intelligence designs and delivers applied AI services: workflow intelligence, knowledge systems and operational agents.',
          kicker:'AI services · operating systems',
          lead:'We build applied AI into the work that already moves the business: knowledge, decisions, customer operations and execution.',
          primary:'Map the opportunity <span class="arrow">→</span>',
          secondary:'Explore the services',
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
          ctaBtn:'Start with the diagnosis <span class="arrow">→</span>'
        }
      },
      foundations: {
        pt: {
          title:'Vouga Foundations · I&D, POCs e MVPs',
          description:'A Vouga Foundations valida ideias, constrói POCs e desenvolve MVPs para I&D empresarial, contratação de tecnologia e novos produtos.',
          kicker:'I&D · POCs · MVPs',
          lead:'Transformamos ideias incertas e requisitos complexos em evidência, protótipos funcionais e produtos prontos a lançar.',
          primary:'Validar uma ideia <span class="arrow">→</span>',
          secondary:'Explorar a Foundations',
          heads:['Antes de construir, reduzimos incerteza','Roadmap de fundação','O que pode sair daqui'],
          nums:['01 / fundação','02 / caminho de construção','03 / outputs'],
          bandTitle:'A primeira versão não é pequena por falta de ambição. É pequena para aprender depressa.',
          bandCopy:'O esqueleto desta página ainda é draft, mas a tese é clara: uma boa fundação define o que deve ser verdade para a ideia funcionar, depois constrói apenas o necessário para testar isso.',
          cards:[
            ['risk','Mapa de risco','Hipóteses, dependências, dados necessários, esforço técnico e pontos onde a ideia pode falhar.'],
            ['prototype','Protótipo funcional','Não um mockup bonito: uma versão que permite testar comportamento, decisão ou venda.'],
            ['system','MVP evolutivo','Arquitetura simples, mas preparada para crescer se a validação justificar o passo seguinte.']
          ],
          steps:[
            ['semana 01','Discovery de risco','Entendemos utilizador, contexto, constraints e o que precisa de ser validado antes de escrever muito código.'],
            ['semana 02','Arquitetura mínima','Escolhemos stack, integrações, dados e superfície do MVP. O objetivo é aprender, não impressionar.'],
            ['semanas 03-06','Construção piloto','Produto funcional, testável e já com o suficiente para pôr nas mãos de utilizadores ou clientes reais.'],
            ['depois','Escalar ou matar','Com dados na mesa, decidimos: refinar, escalar, pivotar ou parar. Sem teatro de produto.']
          ],
          stats:['MVP para testar venda, uso ou operação interna','Protótipo navegável com lógica real e dados simulados','Plano técnico para passagem a produto ou sistema interno'],
          cta:'Tens uma ideia que precisa de chão?',
          ctaBtn:'Construir a primeira fundação <span class="arrow">→</span>'
        },
        en: {
          title:'Vouga Foundations · R&D, POCs and MVPs',
          description:'Vouga Foundations validates ideas, builds POCs and delivers MVPs for corporate R&D, technology procurement and new products.',
          kicker:'R&D · POCs · MVPs',
          lead:'We turn uncertain ideas and complex requirements into evidence, working prototypes and products ready to launch.',
          primary:'Validate an idea <span class="arrow">→</span>',
          secondary:'Explore Foundations',
          heads:['Before building, we reduce uncertainty','Foundation roadmap','What can come out of this'],
          nums:['01 / foundation','02 / build path','03 / outputs'],
          bandTitle:'The first version is not small because ambition is small. It is small so learning is fast.',
          bandCopy:'This page is still a draft skeleton, but the thesis is clear: a good foundation defines what must be true for the idea to work, then builds only what is needed to test that.',
          cards:[
            ['risk','Risk map','Hypotheses, dependencies, required data, technical effort and the points where the idea can fail.'],
            ['prototype','Functional prototype','Not a pretty mockup: a version that can test behavior, decision or sales.'],
            ['system','Evolving MVP','Simple architecture, but ready to grow if validation justifies the next step.']
          ],
          steps:[
            ['week 01','Risk discovery','We understand user, context, constraints and what must be validated before writing too much code.'],
            ['week 02','Minimum architecture','We choose stack, integrations, data and MVP surface. The goal is to learn, not impress.'],
            ['weeks 03-06','Pilot build','A functional, testable product with enough substance to put in front of real users or customers.'],
            ['after','Scale or kill','With data on the table, we decide: refine, scale, pivot or stop. No product theatre.']
          ],
          stats:['MVP to test sales, usage or internal operation','Navigable prototype with real logic and simulated data','Technical plan for moving into product or internal system'],
          cta:'Have an idea that needs ground?',
          ctaBtn:'Build the first foundation <span class="arrow">→</span>'
        }
      },
      academy: {
        pt: {
          title:'Vouga Academy · Inteligência Aplicada e Talento',
          description:'A Vouga Academy ajuda equipas a aplicar inteligência no trabalho real e liga instituições de ensino superior e talento jovem a desafios reais.',
          kicker:'',
          lead:'Ajudamos equipas a aplicar inteligência no trabalho real e damos ao talento jovem espaço para praticar, construir e crescer em contexto real.',
          primary:'Desenhar um programa <span class="arrow">→</span>',
          secondary:'Explorar a Academy',
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
          title:'Vouga Academy · Applied Intelligence and Talent',
          description:'Vouga Academy helps teams apply intelligence in real work and connects higher education and young talent with real challenges.',
          kicker:'',
          lead:'We help teams use intelligence in real work and give young talent a place to practise, build and grow through real application.',
          primary:'Build a programme <span class="arrow">→</span>',
          secondary:'Explore Academy',
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
      thesisCopy:'Na Foundations, transformamos pressupostos em evidência antes de a empresa comprometer orçamento, tempo de contratação ou uma equipa completa.',
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
      service3Tag:'MVP E NOVOS PRODUTOS',service3Title:'A tua ideia, a nossa equipa de produto',
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
    function apply(lang){
      lang = lang === 'en' ? 'en' : 'pt';
      currentLang = lang;
      root.setAttribute('lang', lang === 'en' ? 'en' : 'pt-PT');
      root.setAttribute('data-lang', lang);
      var common = COMMON[lang], copy = COPY[page][lang];
      document.title = copy.title;
      meta('meta[name="description"]', copy.description);
      qa('.nav .btn-primary').forEach(function(btn){ btn.textContent = common.contact; });
      var logo = q('.logo'); if (logo) logo.setAttribute('aria-label', common.logo);
      var theme = q('#themeToggle'); if (theme) theme.setAttribute('aria-label', common.theme);
      text('.detail-kicker', copy.kicker);
      text('.detail-lead', copy.lead);
      html('.detail-actions .btn-primary', copy.primary);
      text('.detail-actions .btn-ghost', copy.secondary);
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
      var study = {
        el: el,
        src: el.getAttribute('data-src'),
        mask: el.getAttribute('data-mask') || 'light',
        cols: parseInt(el.getAttribute('data-cols') || '78', 10),
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

    if (!reducedMotion) {
      window.setInterval(function(){ studies.forEach(tick); }, 130);
    }
  })();
})();
