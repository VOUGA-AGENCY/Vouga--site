/* Vouga · Diagnóstico de Sistema — vanilla port of the Lovable diagnostic,
   rendered in the Vouga site's own look. No framework, no dependencies. */
(function(){
  'use strict';

  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ===== theme (shares the vouga-theme key with the rest of the site) ===== */
  (function(){
    var theme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    try {
      var savedTheme = localStorage.getItem('vouga-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') theme = savedTheme;
    } catch(e){}
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', function(){
      var n = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', n);
      try { localStorage.setItem('vouga-theme', n); } catch(e){}
    });
  })();

  /* ===== data ===== */
  var SEV = { red:1, yellow:2, green:3 };
  var CAL = 'https://cal.com/vouga';
  var PATH_ORDER = ['commercial','operations','strategy'];

  var PATHS_PT = {
    commercial: {
      icon:'01', title:'Vendas & Receita', tagline:'Para perceber onde as oportunidades avançam, abrandam ou se perdem.',
      accent:'var(--accent)',
      questions:[
        { index:'01', kicker:'Fricção', prompt:'Quanto tempo demora a enviar uma proposta complexa?',
          choices:[
            {label:'Dias, porque a informação vive espalhada em demasiados sítios', severity:'red'},
            {label:'Horas, ainda muito à base de copiar, colar e confirmar detalhes', severity:'yellow'},
            {label:'Minutos, com um processo bem montado e quase automático', severity:'green'}]},
        { index:'02', kicker:'Desperdício', prompt:'Onde é que a sua equipa comercial perde mais horas?',
          choices:[
            {label:'A reconstruir histórico e contexto antes de cada conversa', severity:'red'},
            {label:'A escrever emails e propostas quase sempre do zero', severity:'yellow'},
            {label:'A alinhar próximos passos em reuniões internas', severity:'green'}]},
        { index:'03', kicker:'Histórico', prompt:'O conhecimento sobre clientes está centralizado ou na cabeça de cada comercial?',
          choices:[
            {label:'Está na cabeça de cada um, e parte dele desaparece quando alguém sai', severity:'red'},
            {label:'Está dividido entre CRM, notas soltas e mensagens antigas', severity:'yellow'},
            {label:'Está organizado, integrado e fácil de consultar', severity:'green'}]}
      ],
      stats:[
        {value:'3.4x', label:'Mais rápido a enviar propostas'},
        {value:'-67%', label:'Tempo perdido em pesquisa de contexto'},
        {value:'+28%', label:'Taxa de conversão com follow-up automático'}],
      service:{ name:'Copiloto Comercial com IA',
        desc:'Um sistema que conhece o histórico de cada cliente, ajuda a preparar propostas em minutos e mantém os follow-ups no radar, sem depender da memória de ninguém.',
        bullets:['Propostas criadas a partir do histórico real do cliente','Memória comercial centralizada e fácil de pesquisar','Follow-ups sugeridos ou enviados no momento certo']}
    },
    operations: {
      icon:'02', title:'Processos & Equipas', tagline:'Para ver onde o trabalho flui e onde a equipa fica presa.',
      accent:'var(--diag-green)',
      questions:[
        { index:'01', kicker:'Reuniões', prompt:'No fim de cada reunião, atas e tarefas ficam registadas de forma automática?',
          choices:[
            {label:'Não, alguém ainda fica com a parte ingrata de escrever tudo à mão', severity:'red'},
            {label:'Às vezes, mas há sempre decisões e tarefas que escapam', severity:'yellow'},
            {label:'Sim, fica tudo registado automaticamente com IA', severity:'green'}]},
        { index:'02', kicker:'Integração', prompt:'Quando um colaborador sai de férias ou da empresa, o conhecimento dele...',
          choices:[
            {label:'Fica meio trancado e difícil de recuperar', severity:'red'},
            {label:'Está algures numa pasta, mas nem sempre é simples encontrá-lo', severity:'yellow'},
            {label:'Está indexado num sistema pesquisável e útil para a equipa', severity:'green'}]},
        { index:'03', kicker:'Tempo', prompt:'Quantas horas por semana, por pessoa, perdem à procura de documentos internos?',
          choices:[
            {label:'Mais de 5h por semana', severity:'red'},
            {label:'Entre 2h a 5h', severity:'yellow'},
            {label:'Menos de 2h', severity:'green'}]}
      ],
      stats:[
        {value:'+11h', label:'Poupadas por semana, por pessoa'},
        {value:'-83%', label:'Tempo de pesquisa interna de documentos'},
        {value:'100%', label:'Reuniões com atas e tarefas automáticas'}],
      service:{ name:'Sistema de Conhecimento com IA',
        desc:'As reuniões terminam com decisões claras, tarefas atribuídas e conhecimento guardado num sítio onde a equipa consegue realmente encontrá-lo.',
        bullets:['Atas, decisões e tarefas geradas no fim de cada reunião','Onboarding e offboarding sem perda de conhecimento','Respostas internas em segundos, sempre com fontes citadas']}
    },
    strategy: {
      icon:'03', title:'Estratégia & Futuro', tagline:'Para tomar decisões com mais clareza, menos ruído e menos risco.',
      accent:'var(--diag-yellow)',
      questions:[
        { index:'01', kicker:'Uso de IA', prompt:'Os seus colaboradores usam IA (ex: ChatGPT) hoje?',
          choices:[
            {label:'Sim, mas sem regras claras nem grande visibilidade', severity:'red'},
            {label:'Usam pouco, ou ainda de forma muito pontual', severity:'yellow'},
            {label:'Sim, com regras, integração e segurança', severity:'green'}]},
        { index:'02', kicker:'Decisão', prompt:'As decisões estratégicas dependem de auditorias demoradas?',
          choices:[
            {label:'Sim, ainda passam semanas a juntar e validar dados', severity:'red'},
            {label:'Temos dados, mas nem sempre contam uma história clara', severity:'yellow'},
            {label:'As decisões já são rápidas e apoiadas por sistemas', severity:'green'}]},
        { index:'03', kicker:'Risco', prompt:'Existe risco de fuga de dados confidenciais através de ferramentas web?',
          choices:[
            {label:'Sim, ou pelo menos não sabemos medir bem esse risco', severity:'red'},
            {label:'Existe algum risco, mas já há cuidados básicos', severity:'yellow'},
            {label:'O risco está controlado com regras e proteção adequadas', severity:'green'}]}
      ],
      stats:[
        {value:'-91%', label:'Tempo de auditoria para decisões'},
        {value:'0', label:'Pontos cegos de fuga de dados'},
        {value:'100%', label:'Governação de IA documentada e segura'}],
      service:{ name:'Auditoria de Governação de IA',
        desc:'Mapeamos o que a equipa já usa, fechamos brechas de segurança e criamos uma forma mais clara de usar dados antes das decisões importantes.',
        bullets:['Política e perímetro de uso de IA para toda a equipa','Decisões estratégicas suportadas por dados em tempo real','Proteção de informação confidencial com regras claras']}
    }
  };

  var PATHS_EN = {
    commercial: {
      icon:'01', title:'Sales & Revenue', tagline:'See where opportunities move, slow down or disappear.', accent:'var(--accent)',
      questions:[
        {index:'01',kicker:'Friction',prompt:'How long does it take to send a complex proposal?',choices:[
          {label:'Days, because the information is scattered across too many places',severity:'red'},
          {label:'Hours, still relying heavily on copying, pasting and checking details',severity:'yellow'},
          {label:'Minutes, through a well designed and largely automated process',severity:'green'}]},
        {index:'02',kicker:'Waste',prompt:'Where does your commercial team lose the most time?',choices:[
          {label:'Rebuilding history and context before every conversation',severity:'red'},
          {label:'Writing emails and proposals almost from scratch',severity:'yellow'},
          {label:'Aligning next steps in internal meetings',severity:'green'}]},
        {index:'03',kicker:'Memory',prompt:'Is customer knowledge centralised or held by each salesperson?',choices:[
          {label:'It lives in individual heads and some of it disappears when people leave',severity:'red'},
          {label:'It is split across the CRM, loose notes and old messages',severity:'yellow'},
          {label:'It is organised, connected and easy to consult',severity:'green'}]}
      ],
      stats:[{value:'3.4x',label:'Faster proposal delivery'},{value:'-67%',label:'Less time lost searching for context'},{value:'+28%',label:'Conversion rate with automated follow up'}],
      service:{name:'AI Commercial Copilot',desc:'A system that understands each customer’s history, helps prepare proposals in minutes and keeps follow ups visible without relying on anyone’s memory.',bullets:['Proposals built from real customer history','Centralised, searchable commercial memory','Follow ups suggested or sent at the right moment']}
    },
    operations: {
      icon:'02', title:'Processes & Teams', tagline:'See where work flows and where the team gets stuck.', accent:'var(--diag-green)',
      questions:[
        {index:'01',kicker:'Meetings',prompt:'Are minutes and tasks recorded automatically after every meeting?',choices:[
          {label:'No, someone still has to write everything down manually',severity:'red'},
          {label:'Sometimes, but decisions and tasks still slip through',severity:'yellow'},
          {label:'Yes, everything is recorded automatically with AI',severity:'green'}]},
        {index:'02',kicker:'Integration',prompt:'When someone goes on holiday or leaves the company, their knowledge...',choices:[
          {label:'Becomes partly locked away and difficult to recover',severity:'red'},
          {label:'Exists somewhere in a folder, but is not always easy to find',severity:'yellow'},
          {label:'Is indexed in a searchable system the team can actually use',severity:'green'}]},
        {index:'03',kicker:'Time',prompt:'How many hours per person are lost each week looking for internal documents?',choices:[
          {label:'More than 5 hours a week',severity:'red'},
          {label:'Between 2 and 5 hours',severity:'yellow'},
          {label:'Fewer than 2 hours',severity:'green'}]}
      ],
      stats:[{value:'+11h',label:'Saved per person every week'},{value:'-83%',label:'Internal document search time'},{value:'100%',label:'Meetings with automatic minutes and tasks'}],
      service:{name:'AI Knowledge System',desc:'Meetings end with clear decisions, assigned tasks and knowledge stored somewhere the team can genuinely find it.',bullets:['Minutes, decisions and tasks generated after every meeting','Onboarding and offboarding without knowledge loss','Internal answers in seconds with cited sources']}
    },
    strategy: {
      icon:'03', title:'Strategy & Future', tagline:'Make decisions with more clarity, less noise and less risk.', accent:'var(--diag-yellow)',
      questions:[
        {index:'01',kicker:'AI use',prompt:'Do your people use AI tools such as ChatGPT today?',choices:[
          {label:'Yes, but without clear rules or much visibility',severity:'red'},
          {label:'Only a little, or in very isolated situations',severity:'yellow'},
          {label:'Yes, with rules, integration and security',severity:'green'}]},
        {index:'02',kicker:'Decision',prompt:'Do strategic decisions depend on lengthy audits?',choices:[
          {label:'Yes, it still takes weeks to gather and validate the data',severity:'red'},
          {label:'We have data, but it does not always tell a clear story',severity:'yellow'},
          {label:'Decisions are already fast and supported by systems',severity:'green'}]},
        {index:'03',kicker:'Risk',prompt:'Is confidential data at risk through public web tools?',choices:[
          {label:'Yes, or at least we cannot measure the risk properly',severity:'red'},
          {label:'There is some risk, although basic safeguards exist',severity:'yellow'},
          {label:'The risk is controlled through appropriate rules and protection',severity:'green'}]}
      ],
      stats:[{value:'-91%',label:'Audit time for decisions'},{value:'0',label:'Blind spots in data leakage'},{value:'100%',label:'Documented and secure AI governance'}],
      service:{name:'AI Governance Audit',desc:'We map what the team already uses, close security gaps and create a clearer way to use data before important decisions.',bullets:['An AI policy and usage perimeter for the whole team','Strategic decisions supported by current data','Confidential information protected by clear rules']}
    }
  };

  var UI = {
    pt:{
      title:'Diagnóstico de Sistema · Vouga Agency',description:'Avaliação interativa da Vouga Agency para mapear fricção operacional em vendas, processos e IA, e identificar o sistema certo para a resolver.',
      site:'← site',back:'Voltar',continue:'Continuar',choose:'Escolher →',
      startLabel:'01 / como prefere começar',startTitle:'Vamos mapear o seu <em class="diag-em">sistema</em>.',startLead:'Escolha a forma que lhe for mais confortável. Pode identificar-se para receber o relatório completo ou avançar em modo anónimo. O diagnóstico mantém a mesma lógica nos dois casos.',
      identifiedTitle:'Diagnóstico identificado',identifiedSub:'Recebe o relatório completo por email, com contexto para a sua empresa.',anonymousTitle:'Diagnóstico 100% anónimo',anonymousSub:'Sem nome e sem email. Só precisamos da sua função.',
      name:'O seu nome',company:'Nome da empresa',role:'O seu cargo ou função (ex: Diretor de Operações)',anonNote:'Modo anónimo · sem nome, sem email',
      profileLabel:'02 / perfil',profileTitle:'Qual é o motor que move o seu <em class="diag-em">dia a dia</em>?',profileLead:'Escolha a área onde sente mais pressão neste momento. A partir daí, adaptamos as perguntas ao que tende a fazer mais diferença no seu contexto.',
      answerLead:'Escolha a opção que mais se aproxima da realidade atual da equipa.',fragmented:'Sistema Fragmentado',transition:'Sistema em Transição',orchestrated:'Sistema Orquestrado',
      dashboard:'dashboard de diagnóstico',mapPrefix:'Eis',mapSuffix:'o seu <em class="diag-em">mapa de impacto</em>.',resultLead:'Uma leitura prática do seu sistema: pessoas, decisões, ferramentas e documentos a trabalhar em conjunto, ou a puxar cada um para seu lado.',
      maturity:'índice de maturidade do sistema',recommended:'sistema recomendado para si',identifiedCta:'O mapa está feito. Agora falta desenhar o sistema.',anonymousCta:'Este é o impacto provável no seu cargo.',
      identifiedSubCta:'Numa conversa curta, transformamos este diagnóstico num plano concreto, com prioridades, riscos e próximos passos.',anonymousSubBefore:'Podemos desenhar este sistema',anonymousSubAfter:' de forma totalmente confidencial, sem expor a empresa.',identifiedBtn:'Desenhar o meu sistema',anonymousBtn:'Agendar conversa de 15 min',restart:'Recomeçar'
    },
    en:{
      title:'System Diagnostic · Vouga Agency',description:'An interactive Vouga Agency diagnostic to map operational friction across sales, processes and AI, and identify the right system to address it.',
      site:'← site',back:'Back',continue:'Continue',choose:'Choose →',
      startLabel:'01 / how would you like to begin',startTitle:'Let us map your <em class="diag-em">system</em>.',startLead:'Choose the route that feels most comfortable. Identify yourself to receive the full report or continue anonymously. The diagnostic uses the same logic in both cases.',
      identifiedTitle:'Identified diagnostic',identifiedSub:'Receive the full report by email, with context for your company.',anonymousTitle:'100% anonymous diagnostic',anonymousSub:'No name and no email. We only need your role.',
      name:'Your name',company:'Company name',role:'Your role (e.g. Operations Director)',anonNote:'Anonymous mode · no name, no email',
      profileLabel:'02 / profile',profileTitle:'What drives your <em class="diag-em">day to day</em> work?',profileLead:'Choose the area under the most pressure right now. We will adapt the questions to what is most likely to matter in your context.',
      answerLead:'Choose the option closest to the team’s current reality.',fragmented:'Fragmented System',transition:'Transitioning System',orchestrated:'Orchestrated System',
      dashboard:'diagnostic dashboard',mapPrefix:'Here is',mapSuffix:'your <em class="diag-em">impact map</em>.',resultLead:'A practical reading of your system: people, decisions, tools and documents working together, or pulling in different directions.',
      maturity:'system maturity index',recommended:'recommended system',identifiedCta:'The map is ready. Now the system needs to be designed.',anonymousCta:'This is the likely impact in your role.',
      identifiedSubCta:'In a short conversation, we turn this diagnostic into a concrete plan with priorities, risks and next steps.',anonymousSubBefore:'We can design this system',anonymousSubAfter:' in complete confidence, without exposing the company.',identifiedBtn:'Design my system',anonymousBtn:'Book a 15 minute conversation',restart:'Start again'
    }
  };

  var currentLang = root.getAttribute('data-lang') === 'pt' ? 'pt' : 'en';
  var PATHS = currentLang === 'pt' ? PATHS_PT : PATHS_EN;
  function t(key){ return UI[currentLang][key]; }

  /* ===== state ===== */
  var state = { stage:'start', mode:'identified', contact:{name:'',company:'',email:'',role:''}, path:null, qIndex:0, answers:[] };
  var app = document.getElementById('diagApp');
  if (!app) return;

  function syncLanguage(){
    PATHS = currentLang === 'pt' ? PATHS_PT : PATHS_EN;
    root.setAttribute('lang', currentLang === 'pt' ? 'pt-PT' : 'en');
    root.setAttribute('data-lang', currentLang);
    document.title = t('title');
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', t('description'));
    var siteLink = document.querySelector('[data-diag-site]');
    if (siteLink) siteLink.textContent = t('site');
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

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function dot(sev){ return sev==='red'?'var(--diag-red)':sev==='yellow'?'var(--diag-yellow)':'var(--diag-green)'; }

  /* nav steps: start=0, profile=1, q0=2, q1=3, q2=4 */
  function stepIndex(){ return state.stage==='start'?0 : state.stage==='profile'?1 : 2+state.qIndex; }
  function stepsHtml(){
    var cur = stepIndex(), out='', labels=['01','02','03','04','05'];
    for (var i=0;i<labels.length;i++){
      var cls = i===cur ? 'is-active' : i<cur ? 'is-done' : '';
      out += '<span class="diag-step '+cls+'">'+labels[i]+'</span>';
      if (i<labels.length-1) out += '<span class="diag-step-line '+(i<cur?'is-done':'')+'"></span>';
    }
    return out;
  }
  function footHtml(opts){
    opts = opts || {};
    var right = '';
    if (state.stage !== 'start') right += '<button class="diag-back" type="button" data-act="back">'+t('back')+'</button>';
    if (opts.continue) right += '<button class="btn btn-primary" type="button" data-act="continue"'+(opts.continueOff?' disabled':'')+'>'+t('continue')+' <span class="arrow">→</span></button>';
    return '<footer class="diag-foot wrap"><div class="diag-steps">'+stepsHtml()+'</div><div class="diag-foot-right">'+right+'</div></footer>';
  }

  function startValid(){
    return state.mode==='anonymous' ? !!state.contact.role.trim() : (!!state.contact.name.trim() && !!state.contact.email.trim());
  }

  function terminalLead(text, extraClass){
    var cls = 'diag-lead diag-terminal-text' + (extraClass ? ' ' + extraClass : '');
    return '<p class="'+cls+'" data-terminal-text data-fulltext="'+esc(text)+'">'
      + '<span class="diag-terminal-prompt" aria-hidden="true">&gt;</span>'
      + '<span class="diag-terminal-output"></span>'
      + '</p>';
  }

  /* ===== stage renderers ===== */
  function startHtml(){
    var c = state.contact, ident = state.mode==='identified';
    var fields = ident
      ? '<div class="diag-fields two">'
        + '<input class="diag-input" data-f="name" value="'+esc(c.name)+'" placeholder="'+t('name')+'" autocomplete="name">'
        + '<input class="diag-input" type="email" data-f="email" value="'+esc(c.email)+'" placeholder="'+(currentLang==='pt'?'email@empresa.com':'email@company.com')+'" autocomplete="email">'
        + '<input class="diag-input span2" data-f="company" value="'+esc(c.company)+'" placeholder="'+t('company')+'" autocomplete="organization">'
        + '</div>'
      : '<div class="diag-fields">'
        + '<span class="diag-anon-note">'+t('anonNote')+'</span>'
        + '<input class="diag-input" data-f="role" value="'+esc(c.role)+'" placeholder="'+t('role')+'">'
        + '</div>';
    return '<section class="diag-stage diag-fade wrap">'
      + '<span class="label">'+t('startLabel')+'</span>'
      + '<h1 class="diag-h1">'+t('startTitle')+'</h1>'
      + terminalLead(t('startLead'))
      + '<div class="diag-modes">'
        + modeCard('identified',t('identifiedTitle'),t('identifiedSub'))
        + modeCard('anonymous',t('anonymousTitle'),t('anonymousSub'))
      + '</div>' + fields + '</section>'
      + footHtml({ continue:true, continueOff:!startValid() });
  }
  function modeCard(m,title,sub){
    var on = state.mode===m;
    return '<button class="diag-mode'+(on?' is-active':'')+'" type="button" data-mode="'+m+'">'
      + '<span class="diag-mode-t">'+title+'</span><span class="diag-mode-s">'+sub+'</span></button>';
  }

  function profileHtml(){
    var cards='';
    PATH_ORDER.forEach(function(id){
      var p = PATHS[id];
      cards += '<button class="diag-pcard" type="button" data-path="'+id+'">'
        + '<span class="diag-picon" aria-hidden="true">'+p.icon+'</span>'
        + '<span class="diag-pt">'+esc(p.title)+'</span>'
        + '<span class="diag-ptag">'+esc(p.tagline)+'</span>'
        + '<span class="diag-pgo">'+t('choose')+'</span></button>';
    });
    return '<section class="diag-stage diag-fade wrap">'
      + '<span class="label">'+t('profileLabel')+'</span>'
      + '<h1 class="diag-h1">'+t('profileTitle')+'</h1>'
      + terminalLead(t('profileLead'))
      + '<div class="diag-pgrid">'+cards+'</div></section>'
      + footHtml({});
  }

  function questionHtml(){
    var def = PATHS[state.path], q = def.questions[state.qIndex], sel = state.answers[state.qIndex];
    var choices='';
    q.choices.forEach(function(ch){
      var on = sel===ch.severity;
      choices += '<button class="diag-choice'+(on?' is-active':'')+'" type="button" data-sev="'+ch.severity+'">'
        + '<span class="diag-cdot" style="--d:'+dot(ch.severity)+'"></span>'
        + '<span class="diag-clabel">'+esc(ch.label)+'</span>'
        + '<span class="diag-check" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2.5 6.2 5 8.7l4.5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>';
    });
    return '<section class="diag-stage diag-fade wrap">'
      + '<span class="label">'+q.index+' / '+esc(def.title)+' · '+esc(q.kicker)+'</span>'
      + '<h1 class="diag-h1 q">'+esc(q.prompt)+'</h1>'
      + terminalLead(t('answerLead'))
      + '<div class="diag-choices">'+choices+'</div></section>'
      + footHtml({});
  }

  function maturity(avg){
    if (avg<1.7) return {label:t('fragmented'), color:'var(--diag-red)'};
    if (avg<2.4) return {label:t('transition'), color:'var(--diag-yellow)'};
    return {label:t('orchestrated'), color:'var(--diag-green)'};
  }
  function resultHtml(){
    var def = PATHS[state.path];
    var scores = state.answers.map(function(s){ return SEV[s]; });
    var avg = scores.reduce(function(a,b){return a+b;},0) / (scores.length||1);
    var pct = Math.round(((avg-1)/2)*100);
    var m = maturity(avg);
    var company = state.mode==='anonymous' ? '' : state.contact.company.trim();
    var anon = state.mode==='anonymous';
    var stats='';
    def.stats.forEach(function(s){
      stats += '<div class="diag-stat"><span class="num" data-count="'+esc(s.value)+'">'+esc(s.value)+'</span><span class="lbl">'+esc(s.label)+'</span></div>';
    });
    var bullets='';
    def.service.bullets.forEach(function(b){ bullets += '<li>'+esc(b)+'</li>'; });
    var ctaTitle = anon ? t('anonymousCta') : t('identifiedCta');
    var ctaSub = anon
      ? (t('anonymousSubBefore')+(state.contact.role.trim()?((currentLang==='pt'?' para ':' for ')+esc(state.contact.role.trim())):'')+t('anonymousSubAfter'))
      : t('identifiedSubCta');
    var ctaBtn = anon ? t('anonymousBtn') : t('identifiedBtn');
    return '<section class="diag-result wrap">'
      + '<div class="diag-fade">'
        + '<p class="label" style="text-align:center">'+t('dashboard')+' · '+esc(def.title)+'</p>'
        + '<h1 class="diag-h1 center">'+(company?(esc(company)+', '+(currentLang==='pt'?'eis':'here is')):t('mapPrefix'))+' '+t('mapSuffix')+'</h1>'
        + terminalLead(t('resultLead'), 'center')
      + '</div>'
      + '<div class="diag-maturity diag-fade">'
        + '<div class="diag-mat-top"><div><span class="label">'+t('maturity')+'</span>'
        + '<p class="diag-mat-label" style="color:'+m.color+'">'+m.label+'</p></div>'
        + '<p class="diag-mat-pct"><span class="num" data-count="'+pct+'%">'+pct+'%</span></p></div>'
        + '<div class="diag-mat-track"><span class="diag-mat-fill" style="--pct:'+Math.max(pct,5)+'%;background:'+m.color+'"></span></div>'
      + '</div>'
      + '<div class="diag-stats diag-fade">'+stats+'</div>'
      + '<div class="diag-service diag-fade">'
        + '<span class="label">'+t('recommended')+'</span>'
        + '<h2 class="diag-svc-name">'+esc(def.service.name)+'</h2>'
        + '<p class="diag-svc-desc">'+esc(def.service.desc)+'</p>'
        + '<ul class="diag-svc-bullets">'+bullets+'</ul>'
      + '</div>'
      + '<div class="diag-cta diag-fade">'
        + '<h2 class="diag-cta-t">'+ctaTitle+'</h2>'
        + '<p class="diag-cta-s">'+ctaSub+'</p>'
        + '<a class="btn btn-primary diag-cta-btn" href="'+CAL+'" target="_blank" rel="noreferrer">'+ctaBtn+' <span class="arrow">→</span></a>'
        + '<button class="diag-back" type="button" data-act="restart">'+t('restart')+'</button>'
      + '</div>'
      + '</section>';
  }

  /* ===== count-up ===== */
  function animateCounts(scope){
    [].slice.call(scope.querySelectorAll('[data-count]')).forEach(function(el){
      var raw = el.getAttribute('data-count');
      var m = /^([+\-−]?)(\d+(?:\.\d+)?)(.*)$/.exec(raw);
      if (!m){ el.textContent = raw; return; }
      var sign = (m[1]==='-'||m[1]==='−') ? '−' : m[1];
      var target = parseFloat(m[2]); var suffix = m[3];
      var dec = m[2].indexOf('.')>=0 ? 1 : 0;
      if (reduce){ el.textContent = sign + target.toFixed(dec) + suffix; return; }
      var dur=1100, start=null;
      function tick(ts){
        if (start===null) start=ts;
        var p=Math.min((ts-start)/dur,1), e=1-Math.pow(1-p,3);
        el.textContent = sign + (target*e).toFixed(dec) + suffix;
        if (p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ===== render + wiring ===== */
  function render(){
    if (state.path) app.style.setProperty('--path-accent', PATHS[state.path].accent);
    var html = state.stage==='start' ? startHtml()
      : state.stage==='profile' ? profileHtml()
      : state.stage==='question' ? questionHtml()
      : resultHtml();
    app.innerHTML = html;
    wire();
    if (state.stage==='result') animateCounts(app);
    animateTerminalText(app);
    var first = app.querySelector('.diag-stage, .diag-result');
    if (first) first.scrollIntoView ? window.scrollTo(0,0) : null;
  }

  function animateTerminalText(scope){
    [].slice.call(scope.querySelectorAll('[data-terminal-text]')).forEach(function(el){
      var out = el.querySelector('.diag-terminal-output');
      var text = el.getAttribute('data-fulltext') || '';
      if (!out) return;
      if (reduce){
        out.textContent = text;
        el.classList.add('is-complete');
        return;
      }
      out.textContent = '';
      el.classList.remove('is-complete');
      var i = 0;
      var delay = Math.max(18, Math.min(34, 900 / Math.max(text.length, 1)));
      function type(){
        i += 1;
        out.textContent = text.slice(0, i);
        if (i < text.length) window.setTimeout(type, delay);
        else el.classList.add('is-complete');
      }
      window.setTimeout(type, 120);
    });
  }

  function setContinueState(){
    var btn = app.querySelector('[data-act="continue"]');
    if (btn) btn.disabled = !startValid();
  }

  function wire(){
    /* mode cards */
    [].slice.call(app.querySelectorAll('[data-mode]')).forEach(function(b){
      b.addEventListener('click', function(){ state.mode = b.getAttribute('data-mode'); render(); });
    });
    /* inputs */
    [].slice.call(app.querySelectorAll('[data-f]')).forEach(function(inp){
      inp.addEventListener('input', function(){ state.contact[inp.getAttribute('data-f')] = inp.value; setContinueState(); });
    });
    /* path cards */
    [].slice.call(app.querySelectorAll('[data-path]')).forEach(function(b){
      b.addEventListener('click', function(){
        state.path = b.getAttribute('data-path'); state.answers=[]; state.qIndex=0; state.stage='question'; render();
      });
    });
    /* answers */
    [].slice.call(app.querySelectorAll('[data-sev]')).forEach(function(b){
      b.addEventListener('click', function(){
        state.answers[state.qIndex] = b.getAttribute('data-sev');
        b.classList.add('is-active');
        setTimeout(function(){
          if (state.qIndex < 2){ state.qIndex++; state.stage='question'; }
          else state.stage='result';
          render();
        }, reduce ? 60 : 420);
      });
    });
    /* footer / actions */
    [].slice.call(app.querySelectorAll('[data-act]')).forEach(function(b){
      b.addEventListener('click', function(){
        var act = b.getAttribute('data-act');
        if (act==='continue'){ if (startValid()){ state.stage='profile'; render(); } }
        else if (act==='back'){ back(); }
        else if (act==='restart'){ state = {stage:'start',mode:'identified',contact:{name:'',company:'',email:'',role:''},path:null,qIndex:0,answers:[]}; render(); }
      });
    });
  }

  function back(){
    if (state.stage==='question' && state.qIndex>0) state.qIndex--;
    else if (state.stage==='question') state.stage='profile';
    else if (state.stage==='profile') state.stage='start';
    else if (state.stage==='result'){ state.stage='question'; state.qIndex=2; }
    render();
  }

  syncLanguage();
  var langToggle = document.getElementById('langToggle');
  if (langToggle) langToggle.addEventListener('click', function(){
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    try { localStorage.setItem('vouga-lang', currentLang); } catch(e){}
    syncLanguage();
    render();
  });
  render();
})();
