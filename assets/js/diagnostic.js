/* Vouga · System Diagnostic
   Future Supabase table proposal: diagnostic_leads
   id, created_at, source, language, mode, name, email, company, role,
   entry_path, path_confidence, primary_pressure, friction_type,
   process_score, knowledge_score, ai_score, internal_capacity_score,
   urgency, recommended_branch, secondary_branch,
   recommended_offer, open_problem, diagnosis_summary, what_not_to_do,
   meeting_agenda jsonb, answers jsonb, consent boolean
*/
(function(){
  'use strict';

  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var CAL = 'https://cal.com/vouga';

  (function initTheme(){
    var theme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    try {
      var savedTheme = localStorage.getItem('vouga-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') theme = savedTheme;
    } catch(e){}
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', function(){
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('vouga-theme', next); } catch(e){}
    });
  })();

  var COPY = {
    pt: {
      title:'Diagnóstico de Sistema · Vouga Agency',
      description:'Diagnóstico da Vouga Agency para mapear fricção operacional, maturidade de processo, dados, IA e capacidade interna.',
      site:'← site',
      back:'Voltar',
      continue:'Continuar',
      optional:'Opcional',
      startLabel:'01 / ponto de entrada',
      startTitle:'Vamos mapear o seu <em class="diag-em">sistema</em>.',
      startLead:'Não é um quiz de IA. É uma primeira leitura sobre onde a empresa perde contexto, velocidade ou capacidade de execução.',
      identifiedTitle:'Diagnóstico identificado',
      identifiedSub:'Partilha nome e email para a Vouga poder preparar uma primeira leitura antes da conversa.',
      anonymousTitle:'Diagnóstico anónimo',
      anonymousSub:'Sem nome e sem email. Guardamos apenas a função e as respostas do diagnóstico.',
      name:'O seu nome',
      email:'email@empresa.com',
      company:'Nome da empresa',
      role:'O seu cargo ou função',
      anonNote:'Modo anónimo · sem nome, sem email',
      consent:'Ao enviar, aceita que a Vouga use estas respostas para preparar uma primeira leitura e eventual contacto.',
      answerLead:'Escolha a opção que melhor descreve a realidade atual. Não há resposta certa, há sinais de sistema.',
      openLead:'Uma frase curta chega. Se preferir, pode avançar sem preencher.',
      dashboard:'mapa de sistema',
      identifiedPath:'caminho identificado',
      confidence:'confiança',
      resultTitle:'Eis a primeira leitura do seu <em class="diag-em">sistema</em>.',
      resultLead:'Isto não substitui o diagnóstico humano. Serve para orientar a primeira conversa e separar sintomas, origem e próxima intervenção.',
      mainDiagnosis:'diagnóstico principal',
      maturity:'maturidade em 4 eixos',
      recommendation:'recomendação Vouga',
      primary:'principal',
      secondary:'secundária',
      nextMove:'próxima intervenção',
      avoid:'o que não fazer agora',
      agenda:'agenda sugerida para a primeira conversa',
      ctaTitle:'O mapa está feito. Agora falta olhar para o sistema real.',
      ctaSub:'Numa conversa curta, transformamos esta leitura num plano com prioridades, riscos e próximos passos.',
      ctaBtn:'Desenhar o próximo passo',
      restart:'Recomeçar',
      axes:{ process:'Processo', knowledge:'Dados/conhecimento', ai:'IA', internal_capacity:'Capacidade interna' },
      branches:{
        Intelligence:'Vouga Intelligence',
        Foundations:'Vouga Foundations',
        Academy:'Vouga Academy'
      },
      paths:{
        intelligence:'Intelligence',
        foundations:'Foundations',
        academy:'Academy',
        discovery:'Discovery'
      },
      branchDesc:{
        Intelligence:'Para integrar IA, conhecimento e decisões no trabalho que já move a empresa.',
        Foundations:'Para transformar incerteza em POC, MVP ou validação real antes de escalar.',
        Academy:'Para preparar equipas e talento para usar inteligência aplicada no trabalho real.'
      },
      routeQuestion:{ id:'entry_path', label:'02 / intenção', prompt:'O que melhor descreve aquilo que procura?', choices:[
        ['intelligence','Otimizar processos, conhecimento ou decisões com IA.'],
        ['foundations','Construir ou validar um novo produto, serviço ou MVP.'],
        ['academy','Preparar equipas para usar IA no trabalho real.'],
        ['discovery','Ainda não sei bem / quero descobrir.']
      ]},
      commonQuestions:[
        { id:'urgency', label:'10 / urgência', prompt:'Quando é que este problema precisa de começar a ser resolvido?', choices:[
          ['now','Agora, já está a custar dinheiro.'],
          ['30_60_days','Nos próximos 30 a 60 dias.'],
          ['this_quarter','Este trimestre.'],
          ['exploring','Ainda estamos a explorar.']
        ]}
      ],
      pathQuestions:{
        intelligence:[
          { id:'primary_pressure', label:'03 / contexto', prompt:'Que pressão quer resolver dentro da empresa existente?', choices:[
            ['internal_waste','Reduzir desperdício em processos internos.'],
            ['better_decisions','Melhorar decisões com dados e conhecimento interno.'],
            ['sales_growth','Crescer vendas sem aumentar caos operacional.'],
            ['other_depends','Outro / depende do contexto.']
          ]},
          { id:'friction_type', label:'04 / perda de valor', prompt:'Onde sente que o sistema perde mais valor hoje?', choices:[
            ['search_time','Tempo perdido à procura de informação.'],
            ['repeated_work','Trabalho repetido entre ferramentas e pessoas.'],
            ['slow_decisions','Decisões lentas por falta de contexto.'],
            ['unknown','Não sei ainda.']
          ]},
          { id:'process_maturity', label:'05 / processo', prompt:'Se uma pessoa-chave sair amanhã, o que acontece ao trabalho dela?', choices:[
            ['knowledge_disappears','Muito conhecimento desaparece.'],
            ['documented_but_hard','Parte está documentada, mas difícil de encontrar.'],
            ['continuity_exists','O sistema permite continuidade com pouca perda.']
          ]},
          { id:'knowledge_maturity', label:'06 / dados e conhecimento', prompt:'As fontes de informação estão preparadas para serem usadas por IA?', choices:[
            ['scattered','Não. Estão dispersas, incompletas ou sem dono.'],
            ['partial','Parcialmente. Há dados, mas pouca estrutura.'],
            ['ready','Sim. Há fontes, permissões e contexto claro.']
          ]},
          { id:'ai_maturity', label:'07 / IA em operação', prompt:'Onde a IA está hoje na empresa?', choices:[
            ['informal','Uso individual e informal.'],
            ['experiments','Experiências pontuais sem integração.'],
            ['integrated','Integrada em alguns processos.'],
            ['not_started','Ainda não usamos, mas queremos perceber por onde começar.']
          ]},
          { id:'intervention_type', label:'08 / intervenção', prompt:'Qual seria uma boa primeira intervenção?', choices:[
            ['diagnose_first','Diagnosticar antes de decidir.'],
            ['pilot_to_operation','Transformar um fluxo crítico em operação.'],
            ['quick_pilot','Construir um piloto técnico controlado.'],
            ['not_sure','Não sei ainda.']
          ]},
          { id:'internal_capacity', label:'09 / capacidade interna', prompt:'Quem consegue levar isto para a frente internamente?', choices:[
            ['no_owner','Ainda não há dono claro.'],
            ['sponsor_low_team','Há sponsor, mas pouca equipa disponível.'],
            ['team_no_method','Há equipa, mas falta método.'],
            ['team_sponsor_needs_execution','Há equipa e sponsor, falta execução especializada.']
          ]}
        ],
        foundations:[
          { id:'primary_pressure', label:'03 / ideia', prompt:'Em que ponto está a ideia ou produto?', choices:[
            ['validate_idea','Há uma ideia, mas falta validar problema e mercado.'],
            ['market_validate','Há hipótese clara e precisamos de testar procura.'],
            ['quick_pilot','Precisamos de construir um piloto funcional.'],
            ['product_build','Já há sinais e queremos avançar para MVP.']
          ]},
          { id:'friction_type', label:'04 / incerteza', prompt:'Qual é a maior incerteza neste momento?', choices:[
            ['problem_clarity','Se o problema é suficientemente importante.'],
            ['target_user','Quem é exatamente o utilizador-alvo.'],
            ['technical_feasibility','Se a solução é tecnicamente viável.'],
            ['business_model','Se há modelo de negócio ou adoção suficiente.'],
            ['unknown','Ainda não sei.']
          ]},
          { id:'process_maturity', label:'05 / definição', prompt:'Quão definido está o que precisa de ser construído?', choices:[
            ['knowledge_disappears','Está sobretudo em conversas, notas ou slides.'],
            ['documented_but_hard','Há requisitos, mas ainda com zonas ambíguas.'],
            ['continuity_exists','Há escopo, critérios e prioridades claras.']
          ]},
          { id:'knowledge_maturity', label:'06 / evidência', prompt:'Que evidência já existe sobre utilizadores ou mercado?', choices:[
            ['scattered','Quase nenhuma evidência real.'],
            ['partial','Algumas conversas, dados ou sinais, mas pouco estruturados.'],
            ['ready','Evidência clara para decidir o próximo teste.']
          ]},
          { id:'ai_maturity', label:'07 / tecnologia', prompt:'A solução depende de dados, IA, hardware ou integração técnica?', choices:[
            ['not_started','Ainda não sabemos bem.'],
            ['experiments','Há hipóteses técnicas, mas não foram testadas.'],
            ['informal','Há peças soltas ou protótipos informais.'],
            ['integrated','A arquitetura técnica já está relativamente clara.']
          ]},
          { id:'intervention_type', label:'08 / intervenção', prompt:'O que seria mais útil agora?', choices:[
            ['market_validate','Definir e testar a hipótese no mercado.'],
            ['quick_pilot','Construir um POC ou piloto rápido.'],
            ['product_build','Construir um MVP com lógica real.'],
            ['diagnose_first','Clarificar requisitos antes de construir.']
          ]},
          { id:'internal_capacity', label:'09 / capacidade', prompt:'Que capacidade existe para construir e testar rápido?', choices:[
            ['no_owner','Ainda não há dono claro.'],
            ['sponsor_low_team','Há sponsor, mas pouca equipa disponível.'],
            ['team_no_method','Há equipa, mas falta método de validação.'],
            ['team_sponsor_needs_execution','Há equipa e sponsor, falta execução especializada.']
          ]}
        ],
        academy:[
          { id:'primary_pressure', label:'03 / equipas', prompt:'O que mais precisa de mudar nas equipas?', choices:[
            ['train_teams','Preparar pessoas para usar IA no trabalho real.'],
            ['tool_without_method','Criar método para uso consistente.'],
            ['better_decisions','Ajudar equipas a decidir melhor com informação.'],
            ['unknown','Ainda não sei.']
          ]},
          { id:'friction_type', label:'04 / adoção', prompt:'Onde está o maior bloqueio à adoção?', choices:[
            ['tool_without_method','As pessoas usam ferramentas sem método.'],
            ['informal_risk','Há uso informal com riscos de qualidade ou dados.'],
            ['no_use_cases','Faltam casos concretos ligados ao trabalho real.'],
            ['team_confidence','Falta confiança para aplicar no dia a dia.']
          ]},
          { id:'process_maturity', label:'05 / rotinas', prompt:'As rotinas da equipa estão prontas para incorporar IA?', choices:[
            ['knowledge_disappears','Não. Cada pessoa trabalha de forma diferente.'],
            ['documented_but_hard','Algumas rotinas existem, mas são pouco consistentes.'],
            ['continuity_exists','Há rituais e processos onde a IA pode entrar com clareza.']
          ]},
          { id:'knowledge_maturity', label:'06 / contexto', prompt:'A equipa tem bons exemplos, dados e contexto para treinar em casos reais?', choices:[
            ['scattered','Não. Faltam exemplos e contexto organizado.'],
            ['partial','Há exemplos, mas ainda pouco estruturados.'],
            ['ready','Sim. Há trabalho real suficiente para uma formação aplicada.']
          ]},
          { id:'ai_maturity', label:'07 / uso atual', prompt:'Como a equipa usa IA hoje?', choices:[
            ['not_started','Ainda não usa.'],
            ['informal','Usa individualmente e sem regras comuns.'],
            ['experiments','Faz experiências pontuais.'],
            ['integrated','Já integra IA em alguns fluxos.']
          ]},
          { id:'intervention_type', label:'08 / intervenção', prompt:'Que tipo de capacitação faria mais sentido?', choices:[
            ['train_better','Workshop prático com casos reais da equipa.'],
            ['diagnose_first','Mapear primeiro onde a IA entra no trabalho.'],
            ['pilot_to_operation','Acompanhar a adoção num processo concreto.'],
            ['not_sure','Não sei ainda.']
          ]},
          { id:'internal_capacity', label:'09 / liderança', prompt:'Quem consegue sustentar a mudança depois da formação?', choices:[
            ['no_owner','Ainda não há dono claro.'],
            ['sponsor_low_team','Há sponsor, mas pouca disponibilidade.'],
            ['team_no_method','Há equipa motivada, mas falta método.'],
            ['team_sponsor_needs_execution','Há equipa e sponsor, falta acompanhamento especializado.']
          ]}
        ],
        discovery:[
          { id:'primary_pressure', label:'03 / pressão', prompt:'Qual é o sinal mais forte neste momento?', choices:[
            ['internal_waste','Há desperdício operacional evidente.'],
            ['validate_idea','Há uma ideia ou oportunidade por validar.'],
            ['train_teams','As equipas precisam de saber usar IA melhor.'],
            ['better_decisions','As decisões precisam de mais contexto.'],
            ['unknown','Ainda não sei.']
          ]},
          { id:'friction_type', label:'04 / perda de valor', prompt:'Onde sente que a empresa perde mais valor?', choices:[
            ['search_time','À procura de informação.'],
            ['repeated_work','A repetir trabalho entre pessoas e ferramentas.'],
            ['stuck_ideas','Em ideias que não chegam a teste real.'],
            ['tool_without_method','Em tecnologia usada sem método.'],
            ['unknown','Não sei ainda.']
          ]},
          { id:'process_maturity', label:'05 / processo', prompt:'Quando o trabalho passa de uma pessoa para outra, o que acontece?', choices:[
            ['knowledge_disappears','Perde-se contexto.'],
            ['documented_but_hard','O contexto existe, mas é difícil de recuperar.'],
            ['continuity_exists','A passagem é clara e relativamente previsível.']
          ]},
          { id:'knowledge_maturity', label:'06 / informação', prompt:'A informação necessária para decidir ou construir está organizada?', choices:[
            ['scattered','Não. Está dispersa.'],
            ['partial','Parcialmente. Há peças, mas falta estrutura.'],
            ['ready','Sim. Está relativamente pronta para ser usada.']
          ]},
          { id:'ai_maturity', label:'07 / IA', prompt:'Como descreve a relação atual com IA?', choices:[
            ['not_started','Ainda estamos a perceber por onde começar.'],
            ['informal','Há uso individual e informal.'],
            ['experiments','Há experiências pontuais.'],
            ['integrated','Já existe alguma integração em processos.']
          ]},
          { id:'intervention_type', label:'08 / próximo passo', prompt:'Que tipo de ajuda parece mais útil agora?', choices:[
            ['diagnose_first','Diagnosticar antes de decidir.'],
            ['quick_pilot','Construir um piloto.'],
            ['train_better','Capacitar equipas.'],
            ['market_validate','Validar uma ideia no mercado.'],
            ['not_sure','Não sei ainda.']
          ]},
          { id:'internal_capacity', label:'09 / capacidade interna', prompt:'Quem poderia levar isto para a frente?', choices:[
            ['no_owner','Ainda não há dono claro.'],
            ['sponsor_low_team','Há sponsor, mas pouca equipa.'],
            ['team_no_method','Há equipa, mas falta método.'],
            ['team_sponsor_needs_execution','Há equipa e sponsor, falta execução especializada.']
          ]}
        ]
      },
      openQuestion:{ id:'open_problem', type:'text', label:'11 / contexto livre', prompt:'Se tivesse de explicar o problema numa frase, qual seria?', placeholder:'Ex: Perdemos demasiado tempo a reconstruir contexto antes de decidir ou executar.' }
    },
    en: {
      title:'System Diagnostic · Vouga Agency',
      description:'Vouga Agency diagnostic to map operational friction, process maturity, knowledge, AI and internal capacity.',
      site:'← site',
      back:'Back',
      continue:'Continue',
      optional:'Optional',
      startLabel:'01 / entry point',
      startTitle:'Let us map your <em class="diag-em">system</em>.',
      startLead:'This is not an AI quiz. It is a first reading of where the company loses context, speed or execution capacity.',
      identifiedTitle:'Identified diagnostic',
      identifiedSub:'Share name and email so Vouga can prepare a first reading before the conversation.',
      anonymousTitle:'Anonymous diagnostic',
      anonymousSub:'No name and no email. We only keep your role and diagnostic answers.',
      name:'Your name',
      email:'email@company.com',
      company:'Company name',
      role:'Your role',
      anonNote:'Anonymous mode · no name, no email',
      consent:'By sending, you accept that Vouga uses these answers to prepare a first reading and possible contact.',
      answerLead:'Choose the option closest to the current reality. There is no right answer, only system signals.',
      openLead:'A short sentence is enough. You can also continue without filling this in.',
      dashboard:'system map',
      identifiedPath:'identified path',
      confidence:'confidence',
      resultTitle:'Here is the first reading of your <em class="diag-em">system</em>.',
      resultLead:'This does not replace human diagnosis. It helps orient the first conversation and separate symptoms, origin and next intervention.',
      mainDiagnosis:'main diagnosis',
      maturity:'maturity across 4 axes',
      recommendation:'Vouga recommendation',
      primary:'primary',
      secondary:'secondary',
      nextMove:'next intervention',
      avoid:'what not to do now',
      agenda:'suggested agenda for the first conversation',
      ctaTitle:'The map is ready. Now we need to look at the real system.',
      ctaSub:'In a short conversation, we turn this reading into a plan with priorities, risks and next steps.',
      ctaBtn:'Design the next step',
      restart:'Start again',
      axes:{ process:'Process', knowledge:'Data/knowledge', ai:'AI', internal_capacity:'Internal capacity' },
      branches:{
        Intelligence:'Vouga Intelligence',
        Foundations:'Vouga Foundations',
        Academy:'Vouga Academy'
      },
      paths:{
        intelligence:'Intelligence',
        foundations:'Foundations',
        academy:'Academy',
        discovery:'Discovery'
      },
      branchDesc:{
        Intelligence:'To integrate AI, knowledge and decisions into the work that already moves the company.',
        Foundations:'To turn uncertainty into a POC, MVP or real validation before scaling.',
        Academy:'To prepare teams and talent to use applied intelligence in real work.'
      },
      routeQuestion:{ id:'entry_path', label:'02 / intent', prompt:'What best describes what you are looking for?', choices:[
        ['intelligence','Optimise processes, knowledge or decisions with AI.'],
        ['foundations','Build or validate a new product, service or MVP.'],
        ['academy','Prepare teams to use AI in real work.'],
        ['discovery','I am not sure yet / I want to discover it.']
      ]},
      commonQuestions:[
        { id:'urgency', label:'10 / urgency', prompt:'When does this problem need to start being solved?', choices:[
          ['now','Now, it is already costing money.'],
          ['30_60_days','In the next 30 to 60 days.'],
          ['this_quarter','This quarter.'],
          ['exploring','We are still exploring.']
        ]}
      ],
      pathQuestions:{
        intelligence:[
          { id:'primary_pressure', label:'03 / context', prompt:'What pressure do you want to solve inside the existing company?', choices:[
            ['internal_waste','Reduce waste in internal processes.'],
            ['better_decisions','Improve decisions with data and internal knowledge.'],
            ['sales_growth','Grow sales without increasing operational chaos.'],
            ['other_depends','Other / it depends on the context.']
          ]},
          { id:'friction_type', label:'04 / value loss', prompt:'Where does the system lose the most value today?', choices:[
            ['search_time','Time lost looking for information.'],
            ['repeated_work','Repeated work between tools and people.'],
            ['slow_decisions','Slow decisions caused by lack of context.'],
            ['unknown','I do not know yet.']
          ]},
          { id:'process_maturity', label:'05 / process', prompt:'If a key person left tomorrow, what would happen to their work?', choices:[
            ['knowledge_disappears','A lot of knowledge would disappear.'],
            ['documented_but_hard','Some of it is documented, but hard to find.'],
            ['continuity_exists','The system allows continuity with limited loss.']
          ]},
          { id:'knowledge_maturity', label:'06 / data and knowledge', prompt:'Are the information sources ready to be used by AI?', choices:[
            ['scattered','No. They are scattered, incomplete or without clear ownership.'],
            ['partial','Partially. There is data, but little structure.'],
            ['ready','Yes. There are sources, permissions and clear context.']
          ]},
          { id:'ai_maturity', label:'07 / AI in operation', prompt:'Where is AI in the company today?', choices:[
            ['informal','Individual and informal use.'],
            ['experiments','Isolated experiments without integration.'],
            ['integrated','Integrated into some processes.'],
            ['not_started','We have not started, but want to understand where to begin.']
          ]},
          { id:'intervention_type', label:'08 / intervention', prompt:'What would be a good first intervention?', choices:[
            ['diagnose_first','Diagnose before deciding.'],
            ['pilot_to_operation','Turn a critical workflow into operation.'],
            ['quick_pilot','Build a controlled technical pilot.'],
            ['not_sure','I do not know yet.']
          ]},
          { id:'internal_capacity', label:'09 / internal capacity', prompt:'Who can carry this forward internally?', choices:[
            ['no_owner','There is no clear owner yet.'],
            ['sponsor_low_team','There is a sponsor, but limited team capacity.'],
            ['team_no_method','There is a team, but method is missing.'],
            ['team_sponsor_needs_execution','There is a team and sponsor, but execution support is missing.']
          ]}
        ],
        foundations:[
          { id:'primary_pressure', label:'03 / idea', prompt:'Where is the idea or product right now?', choices:[
            ['validate_idea','There is an idea, but problem and market still need validation.'],
            ['market_validate','There is a clear hypothesis and we need to test demand.'],
            ['quick_pilot','We need to build a functional pilot.'],
            ['product_build','There are signals and we want to move into MVP.']
          ]},
          { id:'friction_type', label:'04 / uncertainty', prompt:'What is the biggest uncertainty right now?', choices:[
            ['problem_clarity','Whether the problem is important enough.'],
            ['target_user','Who exactly the target user is.'],
            ['technical_feasibility','Whether the solution is technically feasible.'],
            ['business_model','Whether there is enough business model or adoption signal.'],
            ['unknown','I do not know yet.']
          ]},
          { id:'process_maturity', label:'05 / definition', prompt:'How clearly defined is what needs to be built?', choices:[
            ['knowledge_disappears','It mostly lives in conversations, notes or decks.'],
            ['documented_but_hard','There are requirements, but still with ambiguous areas.'],
            ['continuity_exists','Scope, criteria and priorities are clear.']
          ]},
          { id:'knowledge_maturity', label:'06 / evidence', prompt:'What evidence already exists about users or market?', choices:[
            ['scattered','Almost no real evidence.'],
            ['partial','Some conversations, data or signals, but little structure.'],
            ['ready','Clear evidence to decide the next test.']
          ]},
          { id:'ai_maturity', label:'07 / technology', prompt:'Does the solution depend on data, AI, hardware or technical integration?', choices:[
            ['not_started','We do not know yet.'],
            ['experiments','There are technical hypotheses, but they have not been tested.'],
            ['informal','There are loose pieces or informal prototypes.'],
            ['integrated','The technical architecture is relatively clear.']
          ]},
          { id:'intervention_type', label:'08 / intervention', prompt:'What would be most useful now?', choices:[
            ['market_validate','Define and test the market hypothesis.'],
            ['quick_pilot','Build a POC or fast pilot.'],
            ['product_build','Build an MVP with real logic.'],
            ['diagnose_first','Clarify requirements before building.']
          ]},
          { id:'internal_capacity', label:'09 / capacity', prompt:'What capacity exists to build and test quickly?', choices:[
            ['no_owner','There is no clear owner yet.'],
            ['sponsor_low_team','There is a sponsor, but limited team capacity.'],
            ['team_no_method','There is a team, but validation method is missing.'],
            ['team_sponsor_needs_execution','There is a team and sponsor, but specialised execution is missing.']
          ]}
        ],
        academy:[
          { id:'primary_pressure', label:'03 / teams', prompt:'What most needs to change in the teams?', choices:[
            ['train_teams','Prepare people to use AI in real work.'],
            ['tool_without_method','Create method for consistent use.'],
            ['better_decisions','Help teams make better decisions with information.'],
            ['unknown','I do not know yet.']
          ]},
          { id:'friction_type', label:'04 / adoption', prompt:'Where is the biggest adoption blocker?', choices:[
            ['tool_without_method','People use tools without method.'],
            ['informal_risk','There is informal use with quality or data risks.'],
            ['no_use_cases','Concrete cases connected to real work are missing.'],
            ['team_confidence','Confidence is missing for day-to-day use.']
          ]},
          { id:'process_maturity', label:'05 / routines', prompt:'Are team routines ready to incorporate AI?', choices:[
            ['knowledge_disappears','No. Each person works differently.'],
            ['documented_but_hard','Some routines exist, but they are not very consistent.'],
            ['continuity_exists','There are rituals and processes where AI can enter clearly.']
          ]},
          { id:'knowledge_maturity', label:'06 / context', prompt:'Does the team have good examples, data and context to train on real cases?', choices:[
            ['scattered','No. Examples and organised context are missing.'],
            ['partial','There are examples, but still little structure.'],
            ['ready','Yes. There is enough real work for applied training.']
          ]},
          { id:'ai_maturity', label:'07 / current use', prompt:'How does the team use AI today?', choices:[
            ['not_started','It does not use AI yet.'],
            ['informal','It uses AI individually and without common rules.'],
            ['experiments','It runs isolated experiments.'],
            ['integrated','It already integrates AI into some workflows.']
          ]},
          { id:'intervention_type', label:'08 / intervention', prompt:'What type of capability building would make most sense?', choices:[
            ['train_better','A practical workshop with real team cases.'],
            ['diagnose_first','First map where AI enters the work.'],
            ['pilot_to_operation','Support adoption in one concrete process.'],
            ['not_sure','I do not know yet.']
          ]},
          { id:'internal_capacity', label:'09 / leadership', prompt:'Who can sustain the change after training?', choices:[
            ['no_owner','There is no clear owner yet.'],
            ['sponsor_low_team','There is a sponsor, but limited availability.'],
            ['team_no_method','There is a motivated team, but method is missing.'],
            ['team_sponsor_needs_execution','There is a team and sponsor, but specialised follow-up is missing.']
          ]}
        ],
        discovery:[
          { id:'primary_pressure', label:'03 / pressure', prompt:'What is the strongest signal right now?', choices:[
            ['internal_waste','There is clear operational waste.'],
            ['validate_idea','There is an idea or opportunity to validate.'],
            ['train_teams','Teams need to use AI better.'],
            ['better_decisions','Decisions need more context.'],
            ['unknown','I do not know yet.']
          ]},
          { id:'friction_type', label:'04 / value loss', prompt:'Where do you feel the company loses the most value?', choices:[
            ['search_time','Looking for information.'],
            ['repeated_work','Repeating work between people and tools.'],
            ['stuck_ideas','Ideas that do not reach a real test.'],
            ['tool_without_method','Technology used without method.'],
            ['unknown','I do not know yet.']
          ]},
          { id:'process_maturity', label:'05 / process', prompt:'When work moves from one person to another, what happens?', choices:[
            ['knowledge_disappears','Context gets lost.'],
            ['documented_but_hard','Context exists, but is hard to recover.'],
            ['continuity_exists','The handover is clear and relatively predictable.']
          ]},
          { id:'knowledge_maturity', label:'06 / information', prompt:'Is the information needed to decide or build organised?', choices:[
            ['scattered','No. It is scattered.'],
            ['partial','Partially. There are pieces, but structure is missing.'],
            ['ready','Yes. It is relatively ready to be used.']
          ]},
          { id:'ai_maturity', label:'07 / AI', prompt:'How would you describe the current relationship with AI?', choices:[
            ['not_started','We are still understanding where to begin.'],
            ['informal','There is individual and informal use.'],
            ['experiments','There are isolated experiments.'],
            ['integrated','There is already some process integration.']
          ]},
          { id:'intervention_type', label:'08 / next step', prompt:'What type of help seems most useful now?', choices:[
            ['diagnose_first','Diagnose before deciding.'],
            ['quick_pilot','Build a pilot.'],
            ['train_better','Enable teams.'],
            ['market_validate','Validate an idea in the market.'],
            ['not_sure','I do not know yet.']
          ]},
          { id:'internal_capacity', label:'09 / internal capacity', prompt:'Who could carry this forward?', choices:[
            ['no_owner','There is no clear owner yet.'],
            ['sponsor_low_team','There is a sponsor, but limited team capacity.'],
            ['team_no_method','There is a team, but method is missing.'],
            ['team_sponsor_needs_execution','There is a team and sponsor, but specialised execution is missing.']
          ]}
        ]
      },
      openQuestion:{ id:'open_problem', type:'text', label:'11 / free context', prompt:'If you had to explain the problem in one sentence, what would it be?', placeholder:'Example: We lose too much time rebuilding context before deciding or executing.' }
    }
  };

  var currentLang = root.getAttribute('data-lang') === 'pt' ? 'pt' : 'en';
  var state = {
    stage:'start',
    mode:'identified',
    contact:{ name:'', email:'', company:'', role:'' },
    qIndex:0,
    answers:{},
    payload:null,
    saved:false
  };
  var app = document.getElementById('diagApp');
  if (!app) return;

  function c(){ return COPY[currentLang]; }
  function qs(lang, forcedPath){
    var copy = COPY[lang || currentLang];
    var path = forcedPath || answer('entry_path') || 'discovery';
    var pathQuestions = copy.pathQuestions[path] || copy.pathQuestions.discovery;
    return [copy.routeQuestion].concat(pathQuestions, copy.commonQuestions, [copy.openQuestion]);
  }
  function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function cap(n){ return Math.max(0, Math.min(100, Math.round(n))); }
  function answer(id){ return state.answers[id] || ''; }

  function syncLanguage(){
    root.setAttribute('lang', currentLang === 'pt' ? 'pt-PT' : 'en');
    root.setAttribute('data-lang', currentLang);
    document.title = c().title;
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', c().description);
    var siteLink = document.querySelector('[data-diag-site]');
    if (siteLink) siteLink.textContent = c().site;
    var logo = document.querySelector('.logo');
    if (logo) logo.setAttribute('aria-label', currentLang === 'pt' ? 'Vouga Agency, início' : 'Vouga Agency, home');
    var theme = document.getElementById('themeToggle');
    if (theme) theme.setAttribute('aria-label', currentLang === 'pt' ? 'alternar modo claro e escuro' : 'toggle light and dark mode');
    var langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.setAttribute('aria-label', currentLang === 'pt' ? 'Switch to English' : 'Mudar para português');
      [].slice.call(langToggle.querySelectorAll('[data-lang-option]')).forEach(function(option){
        option.classList.toggle('is-active', option.getAttribute('data-lang-option') === currentLang);
      });
    }
  }

  function startValid(){
    return state.mode === 'anonymous'
      ? !!state.contact.role.trim()
      : (!!state.contact.name.trim() && !!state.contact.email.trim());
  }

  function stepIndex(){
    if (state.stage === 'start') return 0;
    if (state.stage === 'result') return qs().length + 1;
    return state.qIndex + 1;
  }

  function stepsHtml(){
    var total = qs().length + 1;
    var cur = stepIndex();
    var out = '';
    for (var i = 0; i < total; i++){
      var cls = i === cur ? 'is-active' : i < cur ? 'is-done' : '';
      out += '<span class="diag-step '+cls+'">'+String(i + 1).padStart(2,'0')+'</span>';
      if (i < total - 1) out += '<span class="diag-step-line '+(i < cur ? 'is-done' : '')+'"></span>';
    }
    return out;
  }

  function footHtml(opts){
    opts = opts || {};
    var right = '';
    if (state.stage !== 'start') right += '<button class="diag-back" type="button" data-act="back">'+c().back+'</button>';
    if (opts.continue) right += '<button class="btn btn-primary" type="button" data-act="'+(opts.act || 'continue')+'"'+(opts.disabled ? ' disabled' : '')+'>'+c().continue+' <span class="arrow">→</span></button>';
    return '<footer class="diag-foot wrap"><div class="diag-steps">'+stepsHtml()+'</div><div class="diag-foot-right">'+right+'</div></footer>';
  }

  function terminalLead(text, extraClass){
    var cls = 'diag-lead diag-terminal-text' + (extraClass ? ' ' + extraClass : '');
    return '<p class="'+cls+'" data-terminal-text data-fulltext="'+esc(text)+'">'
      + '<span class="diag-terminal-prompt" aria-hidden="true">&gt;</span>'
      + '<span class="diag-terminal-output"></span>'
      + '</p>';
  }

  function modeCard(mode, title, sub){
    return '<button class="diag-mode'+(state.mode === mode ? ' is-active' : '')+'" type="button" data-mode="'+mode+'">'
      + '<span class="diag-mode-t">'+title+'</span>'
      + '<span class="diag-mode-s">'+sub+'</span>'
      + '</button>';
  }

  function startHtml(){
    var copy = c();
    var contact = state.contact;
    var identified = state.mode === 'identified';
    var fields = identified
      ? '<div class="diag-fields two">'
        + '<input class="diag-input" data-f="name" value="'+esc(contact.name)+'" placeholder="'+copy.name+'" autocomplete="name">'
        + '<input class="diag-input" type="email" data-f="email" value="'+esc(contact.email)+'" placeholder="'+copy.email+'" autocomplete="email">'
        + '<input class="diag-input span2" data-f="company" value="'+esc(contact.company)+'" placeholder="'+copy.company+'" autocomplete="organization">'
        + '<input class="diag-input span2" data-f="role" value="'+esc(contact.role)+'" placeholder="'+copy.role+'" autocomplete="organization-title">'
        + '</div><p class="diag-consent">'+copy.consent+'</p>'
      : '<div class="diag-fields">'
        + '<span class="diag-anon-note">'+copy.anonNote+'</span>'
        + '<input class="diag-input" data-f="role" value="'+esc(contact.role)+'" placeholder="'+copy.role+'">'
        + '</div>';
    return '<section class="diag-stage diag-fade wrap">'
      + '<span class="label">'+copy.startLabel+'</span>'
      + '<h1 class="diag-h1">'+copy.startTitle+'</h1>'
      + terminalLead(copy.startLead)
      + '<div class="diag-modes">'
      + modeCard('identified', copy.identifiedTitle, copy.identifiedSub)
      + modeCard('anonymous', copy.anonymousTitle, copy.anonymousSub)
      + '</div>' + fields + '</section>'
      + footHtml({ continue:true, disabled:!startValid() });
  }

  function questionHtml(){
    var q = qs()[state.qIndex];
    if (q.type === 'text') {
      return '<section class="diag-stage diag-fade wrap">'
        + '<span class="label">'+q.label+' · '+c().optional+'</span>'
        + '<h1 class="diag-h1 q">'+esc(q.prompt)+'</h1>'
        + terminalLead(c().openLead)
        + '<textarea class="diag-input diag-textarea" data-open-problem placeholder="'+esc(q.placeholder || '')+'">'+esc(answer(q.id))+'</textarea>'
        + '</section>' + footHtml({ continue:true, act:'finish' });
    }
    var choices = '';
    q.choices.forEach(function(choice, i){
      var key = choice[0], label = choice[1];
      var selected = answer(q.id) === key;
      choices += '<button class="diag-choice'+(selected ? ' is-active' : '')+'" type="button" data-q="'+q.id+'" data-value="'+key+'">'
        + '<span class="diag-cdot" style="--d:var(--accent)"></span>'
        + '<span class="diag-clabel">'+esc(label)+'</span>'
        + '<span class="diag-check" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2.5 6.2 5 8.7l4.5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
        + '</button>';
    });
    return '<section class="diag-stage diag-fade wrap">'
      + '<span class="label">'+q.label+'</span>'
      + '<h1 class="diag-h1 q">'+esc(q.prompt)+'</h1>'
      + terminalLead(c().answerLead)
      + '<div class="diag-choices">'+choices+'</div>'
      + '</section>' + footHtml({});
  }

  function labelFor(id, value, lang){
    var list = qs(lang || currentLang, answer('entry_path'));
    for (var i = 0; i < list.length; i++){
      if (list[i].id !== id || !list[i].choices) continue;
      for (var j = 0; j < list[i].choices.length; j++){
        if (list[i].choices[j][0] === value) return list[i].choices[j][1];
      }
    }
    return value || '';
  }

  function scoreChoice(id, value){
    var scores = {
      process_maturity:{ knowledge_disappears:25, documented_but_hard:58, continuity_exists:88 },
      knowledge_maturity:{ scattered:22, partial:58, ready:88 },
      ai_maturity:{ informal:35, experiments:52, integrated:82, not_started:28 },
      internal_capacity:{ no_owner:22, sponsor_low_team:48, team_no_method:62, team_sponsor_needs_execution:74 }
    };
    return scores[id] && scores[id][value] != null ? scores[id][value] : 50;
  }

  function calculateRecommendation(inputState){
    var a = inputState.answers;
    var branch = { Intelligence:0, Foundations:0, Academy:0 };

    function add(name, value){ branch[name] += value; }
    var entryMap = { intelligence:'Intelligence', foundations:'Foundations', academy:'Academy' };
    if (entryMap[a.entry_path]) add(entryMap[a.entry_path], 8);

    if (a.primary_pressure === 'validate_idea') add('Foundations', 5);
    if (a.primary_pressure === 'train_teams') add('Academy', 5);
    if (a.primary_pressure === 'sales_growth' || a.primary_pressure === 'internal_waste' || a.primary_pressure === 'better_decisions' || a.primary_pressure === 'other_depends') add('Intelligence', 4);
    if (a.primary_pressure === 'quick_pilot' || a.primary_pressure === 'market_validate' || a.primary_pressure === 'product_build') add('Foundations', 5);
    if (a.primary_pressure === 'tool_without_method') add('Academy', 4);

    if (['stuck_ideas','problem_clarity','target_user','technical_feasibility','business_model'].indexOf(a.friction_type) >= 0) add('Foundations', 4);
    if (['tool_without_method','informal_risk','no_use_cases','team_confidence'].indexOf(a.friction_type) >= 0) add('Academy', 4);
    if (['search_time','repeated_work','slow_decisions','unknown'].indexOf(a.friction_type) >= 0) add('Intelligence', 3);

    if (a.intervention_type === 'quick_pilot' || a.intervention_type === 'market_validate' || a.intervention_type === 'product_build') add('Foundations', 6);
    if (a.intervention_type === 'train_better') add('Academy', 6);
    if (a.intervention_type === 'diagnose_first' || a.intervention_type === 'pilot_to_operation') add('Intelligence', 5);
    if (a.intervention_type === 'not_sure') add('Intelligence', 2);

    if (a.ai_maturity === 'informal' || a.ai_maturity === 'experiments') add('Intelligence', 2);
    if (a.ai_maturity === 'not_started') add('Academy', 2);

    var ranked = Object.keys(branch).sort(function(x,y){ return branch[y] - branch[x]; });
    var primary = ranked[0];
    var secondary = branch[ranked[1]] >= 4 ? ranked[1] : '';
    var pathConfidence = 'medium';
    if (a.entry_path === 'discovery') pathConfidence = branch[ranked[0]] - branch[ranked[1]] >= 4 ? 'medium' : 'low';
    else if (entryMap[a.entry_path] === primary && branch[ranked[0]] - branch[ranked[1]] >= 5) pathConfidence = 'high';
    else if (entryMap[a.entry_path] === primary) pathConfidence = 'medium';
    else pathConfidence = 'low';

    var scores = {
      process:scoreChoice('process_maturity', a.process_maturity),
      knowledge:scoreChoice('knowledge_maturity', a.knowledge_maturity),
      ai:scoreChoice('ai_maturity', a.ai_maturity),
      internal_capacity:scoreChoice('internal_capacity', a.internal_capacity)
    };

    if (a.primary_pressure === 'internal_waste') scores.process = cap(scores.process - 8);
    if (a.friction_type === 'search_time') scores.knowledge = cap(scores.knowledge - 8);
    if (a.friction_type === 'tool_without_method') scores.internal_capacity = cap(scores.internal_capacity - 8);

    var offer = 'Sprint Operacional';
    if (a.intervention_type === 'quick_pilot' || a.intervention_type === 'product_build') offer = 'MVP Build Sprint';
    else if (a.intervention_type === 'market_validate' || a.primary_pressure === 'validate_idea') offer = 'POC Definition Sprint';
    else if (a.intervention_type === 'train_better' || primary === 'Academy') offer = 'Team Applied AI Workshop';
    else if (a.intervention_type === 'diagnose_first' || primary === 'Intelligence') offer = 'AI Workflow Audit';

    var lang = currentLang;
    var summary = '';
    var avoid = '';
    var agenda = [];

    if (primary === 'Foundations') {
      summary = lang === 'pt'
        ? 'O seu sistema parece estar a perder valor na passagem entre intenção e validação. Há sinais de ideias, requisitos ou oportunidades que ainda precisam de prova antes de escalar.'
        : 'Your system seems to lose value between intent and validation. There are signs that ideas, requirements or opportunities need evidence before scaling.';
      avoid = lang === 'pt'
        ? 'Não começaria por construir produto completo. O risco é gastar execução antes de provar o que precisa realmente de existir.'
        : 'I would not start by building a full product. The risk is spending execution before proving what truly needs to exist.';
      agenda = lang === 'pt'
        ? ['Definir hipótese principal e critério de sucesso.','Mapear utilizadores, contexto de uso e bloqueios de adoção.','Separar POC, MVP e produto completo.','Escolher o menor teste capaz de gerar evidência.']
        : ['Define the core hypothesis and success criteria.','Map users, usage context and adoption blockers.','Separate POC, MVP and full product.','Choose the smallest test capable of creating evidence.'];
    } else if (primary === 'Academy') {
      summary = lang === 'pt'
        ? 'O seu sistema parece perder valor na adoção. A tecnologia pode existir, mas falta método, capacidade ou segurança para a equipa a transformar em trabalho real.'
        : 'Your system seems to lose value at adoption. The technology may exist, but method, capability or confidence is missing for the team to turn it into real work.';
      avoid = lang === 'pt'
        ? 'Não começaria por mais uma formação genérica de prompts. O risco é criar entusiasmo sem mudar rotinas, decisões ou responsabilidade.'
        : 'I would not start with another generic prompt training. The risk is creating enthusiasm without changing routines, decisions or ownership.';
      agenda = lang === 'pt'
        ? ['Identificar equipas e rituais onde a IA pode entrar com utilidade.','Separar literacia, método e aplicação prática.','Definir casos de trabalho reais para o workshop.','Mapear regras mínimas de uso, segurança e qualidade.']
        : ['Identify teams and rituals where AI can be useful.','Separate literacy, method and practical application.','Define real work cases for the workshop.','Map minimum rules for usage, security and quality.'];
    } else {
      summary = lang === 'pt'
        ? 'O seu sistema parece perder valor sobretudo na passagem entre conhecimento e execução. A informação existe, mas não está suficientemente ligada a decisões, responsáveis e trabalho diário.'
        : 'Your system seems to lose value mostly between knowledge and execution. Information exists, but it is not connected enough to decisions, owners and daily work.';
      avoid = lang === 'pt'
        ? 'Não começaria por construir um chatbot. O risco é automatizar informação que ainda não tem dono, estrutura ou ligação ao processo.'
        : 'I would not start by building a chatbot. The risk is automating information that still has no owner, structure or connection to the process.';
      agenda = lang === 'pt'
        ? ['Mapear onde nasce a informação e quem a valida.','Identificar decisões críticas, responsáveis e ferramentas atuais.','Separar sintomas de causa raiz operacional.','Escolher um fluxo onde IA possa reduzir fricção sem aumentar ruído.']
        : ['Map where information is created and who validates it.','Identify critical decisions, owners and current tools.','Separate symptoms from operational root cause.','Choose one workflow where AI can reduce friction without adding noise.'];
    }

    if (a.urgency === 'now') {
      agenda.push(lang === 'pt' ? 'Definir o primeiro quick win sem comprometer a arquitetura futura.' : 'Define the first quick win without compromising future architecture.');
    }

    return {
      scores:scores,
      recommended_branch:primary,
      secondary_branch:secondary,
      path_confidence:pathConfidence,
      recommended_offer:offer,
      diagnosis_summary:summary,
      what_not_to_do:avoid,
      meeting_agenda:agenda.slice(0,5)
    };
  }

  function buildDiagnosticPayload(inputState){
    var rec = calculateRecommendation(inputState);
    return {
      source:'diagnostic',
      language:currentLang,
      mode:inputState.mode,
      name:inputState.mode === 'identified' ? inputState.contact.name.trim() : '',
      email:inputState.mode === 'identified' ? inputState.contact.email.trim() : '',
      company:inputState.mode === 'identified' ? inputState.contact.company.trim() : '',
      role:inputState.contact.role.trim(),
      answers:Object.assign({}, inputState.answers),
      entry_path:inputState.answers.entry_path || 'discovery',
      path_confidence:rec.path_confidence,
      scores:{
        process:rec.scores.process,
        knowledge:rec.scores.knowledge,
        ai:rec.scores.ai,
        internal_capacity:rec.scores.internal_capacity
      },
      primary_pressure:inputState.answers.primary_pressure || '',
      friction_type:inputState.answers.friction_type || '',
      ai_maturity:inputState.answers.ai_maturity || '',
      urgency:inputState.answers.urgency || '',
      recommended_branch:rec.recommended_branch,
      secondary_branch:rec.secondary_branch,
      recommended_offer:rec.recommended_offer,
      open_problem:inputState.answers.open_problem || '',
      diagnosis_summary:rec.diagnosis_summary,
      what_not_to_do:rec.what_not_to_do,
      meeting_agenda:rec.meeting_agenda,
      consent:inputState.mode === 'identified' || !!inputState.contact.email.trim() || !!inputState.contact.company.trim(),
      created_at:new Date().toISOString()
    };
  }

  async function saveDiagnosticLead(payload){
    // Future Supabase integration:
    // insert payload into a diagnostic_leads table.
    console.log('Diagnostic payload ready for Supabase:', payload);
    return { success:true };
  }

  function finalizeDiagnostic(){
    var diagnosticPayload = buildDiagnosticPayload(state);
    state.payload = diagnosticPayload;
    state.stage = 'result';
    if (!state.saved) {
      state.saved = true;
      saveDiagnosticLead(diagnosticPayload);
    }
    render();
  }

  function scoreTone(score){
    if (score < 40) return 'var(--diag-red)';
    if (score < 70) return 'var(--diag-yellow)';
    return 'var(--diag-green)';
  }

  function resultHtml(){
    var copy = c();
    var payload = state.payload || buildDiagnosticPayload(state);
    var rec = calculateRecommendation(state);
    var axes = ['process','knowledge','ai','internal_capacity'];
    var axisHtml = axes.map(function(axis){
      var score = rec.scores[axis];
      return '<div class="diag-axis">'
        + '<div class="diag-axis-top"><span>'+copy.axes[axis]+'</span><strong style="color:'+scoreTone(score)+'">'+score+'/100</strong></div>'
        + '<div class="diag-mat-track"><span class="diag-mat-fill" style="--pct:'+Math.max(score,5)+'%;background:'+scoreTone(score)+'"></span></div>'
        + '</div>';
    }).join('');
    var agenda = rec.meeting_agenda.map(function(item){ return '<li>'+esc(item)+'</li>'; }).join('');
    var company = payload.company;
    return '<section class="diag-result wrap">'
      + '<div class="diag-fade">'
      + '<p class="label" style="text-align:center">'+copy.dashboard+'</p>'
      + '<h1 class="diag-h1 center">'+(company ? esc(company)+', ' : '')+copy.resultTitle+'</h1>'
      + terminalLead(copy.resultLead, 'center')
      + '</div>'
      + '<div class="diag-path-card diag-fade">'
      + '<span><strong>'+copy.identifiedPath+'</strong>'+esc(copy.paths[payload.entry_path] || payload.entry_path)+'</span>'
      + '<span><strong>'+copy.confidence+'</strong>'+esc(payload.path_confidence)+'</span>'
      + '</div>'
      + '<div class="diag-reading diag-fade">'
      + '<span class="label">'+copy.mainDiagnosis+'</span>'
      + '<p>'+esc(rec.diagnosis_summary)+'</p>'
      + '</div>'
      + '<div class="diag-maturity diag-fade">'
      + '<span class="label">'+copy.maturity+'</span>'
      + '<div class="diag-axis-grid">'+axisHtml+'</div>'
      + '</div>'
      + '<div class="diag-reco-grid diag-fade">'
      + '<article class="diag-service"><span class="label">'+copy.recommendation+' · '+copy.primary+'</span><h2 class="diag-svc-name">'+copy.branches[rec.recommended_branch]+'</h2><p class="diag-svc-desc">'+copy.branchDesc[rec.recommended_branch]+'</p></article>'
      + '<article class="diag-service"><span class="label">'+copy.secondary+'</span><h2 class="diag-svc-name">'+(rec.secondary_branch ? copy.branches[rec.secondary_branch] : (currentLang === 'pt' ? 'Sem camada secundária clara' : 'No clear secondary layer'))+'</h2><p class="diag-svc-desc">'+(rec.secondary_branch ? copy.branchDesc[rec.secondary_branch] : (currentLang === 'pt' ? 'O sinal principal é suficientemente forte para começar por uma frente única.' : 'The primary signal is strong enough to start with one clear front.'))+'</p></article>'
      + '</div>'
      + '<div class="diag-service diag-fade"><span class="label">'+copy.nextMove+'</span><h2 class="diag-svc-name">'+esc(rec.recommended_offer)+'</h2><p class="diag-svc-desc">'+esc(offerDescription(rec.recommended_offer))+'</p></div>'
      + '<div class="diag-reading diag-fade"><span class="label">'+copy.avoid+'</span><p>'+esc(rec.what_not_to_do)+'</p></div>'
      + '<div class="diag-service diag-fade"><span class="label">'+copy.agenda+'</span><ul class="diag-svc-bullets">'+agenda+'</ul></div>'
      + '<div class="diag-cta diag-fade">'
      + '<h2 class="diag-cta-t">'+copy.ctaTitle+'</h2>'
      + '<p class="diag-cta-s">'+copy.ctaSub+'</p>'
      + '<a class="btn btn-primary diag-cta-btn" href="'+CAL+'" target="_blank" rel="noreferrer">'+copy.ctaBtn+' <span class="arrow">→</span></a>'
      + '<button class="diag-back" type="button" data-act="restart">'+copy.restart+'</button>'
      + '</div>'
      + '</section>';
  }

  function offerDescription(offer){
    var pt = currentLang === 'pt';
    var map = {
      'AI Workflow Audit': pt ? 'Mapeamos o trabalho real, as fontes de contexto e os pontos onde IA pode reduzir fricção sem criar ruído.' : 'We map real work, context sources and the places where AI can reduce friction without creating noise.',
      'Sprint Operacional': pt ? 'Entramos no sistema, distinguimos sintomas de origem e desenhamos a intervenção certa antes de construir.' : 'We enter the system, separate symptoms from origin and design the right intervention before building.',
      'POC Definition Sprint': pt ? 'Transformamos incerteza em hipótese, critérios de sucesso e prova mínima antes de comprometer produto ou orçamento.' : 'We turn uncertainty into hypothesis, success criteria and minimum proof before committing product or budget.',
      'MVP Build Sprint': pt ? 'Construímos uma primeira versão funcional para testar uso real, valor e aprendizagem com rapidez.' : 'We build a first functional version to test real usage, value and learning quickly.',
      'Team Applied AI Workshop': pt ? 'Trabalhamos com a equipa sobre casos reais para criar método, confiança e aplicação prática.' : 'We work with the team on real cases to create method, confidence and practical application.'
    };
    return map[offer] || '';
  }

  function render(){
    var html = state.stage === 'start' ? startHtml()
      : state.stage === 'question' ? questionHtml()
      : resultHtml();
    app.innerHTML = html;
    wire();
    animateTerminalText(app);
    window.scrollTo(0,0);
  }

  function animateTerminalText(scope){
    [].slice.call(scope.querySelectorAll('[data-terminal-text]')).forEach(function(el){
      var out = el.querySelector('.diag-terminal-output');
      var text = el.getAttribute('data-fulltext') || '';
      if (!out) return;
      if (reduce) {
        out.textContent = text;
        el.classList.add('is-complete');
        return;
      }
      out.textContent = '';
      el.classList.remove('is-complete');
      var i = 0;
      var delay = Math.max(16, Math.min(28, 800 / Math.max(text.length, 1)));
      function type(){
        i += 1;
        out.textContent = text.slice(0, i);
        if (i < text.length) window.setTimeout(type, delay);
        else el.classList.add('is-complete');
      }
      window.setTimeout(type, 100);
    });
  }

  function setContinueState(){
    var btn = app.querySelector('[data-act="continue"]');
    if (btn) btn.disabled = !startValid();
  }

  function goNextQuestion(){
    if (state.qIndex < qs().length - 1) {
      state.qIndex += 1;
      state.stage = 'question';
      render();
    } else {
      finalizeDiagnostic();
    }
  }

  function wire(){
    [].slice.call(app.querySelectorAll('[data-mode]')).forEach(function(btn){
      btn.addEventListener('click', function(){
        state.mode = btn.getAttribute('data-mode');
        render();
      });
    });
    [].slice.call(app.querySelectorAll('[data-f]')).forEach(function(inp){
      inp.addEventListener('input', function(){
        state.contact[inp.getAttribute('data-f')] = inp.value;
        setContinueState();
      });
    });
    var textarea = app.querySelector('[data-open-problem]');
    if (textarea) {
      textarea.addEventListener('input', function(){
        state.answers.open_problem = textarea.value.trim();
        state.payload = null;
        state.saved = false;
      });
    }
    [].slice.call(app.querySelectorAll('[data-q]')).forEach(function(btn){
      btn.addEventListener('click', function(){
        var qid = btn.getAttribute('data-q');
        var value = btn.getAttribute('data-value');
        if (qid === 'entry_path' && state.answers.entry_path !== value) {
          state.answers = { entry_path:value };
        } else {
          state.answers[qid] = value;
        }
        state.payload = null;
        state.saved = false;
        btn.classList.add('is-active');
        window.setTimeout(goNextQuestion, reduce ? 60 : 360);
      });
    });
    [].slice.call(app.querySelectorAll('[data-act]')).forEach(function(btn){
      btn.addEventListener('click', function(){
        var act = btn.getAttribute('data-act');
        if (act === 'continue') {
          if (startValid()) {
            state.stage = 'question';
            state.qIndex = 0;
            render();
          }
        } else if (act === 'finish') {
          finalizeDiagnostic();
        } else if (act === 'back') {
          back();
        } else if (act === 'restart') {
          state = { stage:'start', mode:'identified', contact:{ name:'', email:'', company:'', role:'' }, qIndex:0, answers:{}, payload:null, saved:false };
          render();
        }
      });
    });
  }

  function back(){
    if (state.stage === 'result') {
      state.stage = 'question';
      state.qIndex = qs().length - 1;
    } else if (state.stage === 'question' && state.qIndex > 0) {
      state.qIndex -= 1;
    } else if (state.stage === 'question') {
      state.stage = 'start';
    }
    render();
  }

  syncLanguage();
  var langToggle = document.getElementById('langToggle');
  if (langToggle) langToggle.addEventListener('click', function(){
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    try { localStorage.setItem('vouga-lang', currentLang); } catch(e){}
    syncLanguage();
    if (state.stage === 'result') state.payload = buildDiagnosticPayload(state);
    render();
  });
  render();
})();
