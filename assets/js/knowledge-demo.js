(function(){
  'use strict';

  var board = document.getElementById('demoBoard');
  var primary = document.getElementById('primaryAction');
  var reset = document.getElementById('resetDemo');
  var progress = document.getElementById('boardProgress');
  var step = document.getElementById('boardStep');
  var status = document.getElementById('demoStatus');
  var title = document.getElementById('boardTitle');
  var assemble = document.getElementById('assembleBtn');
  var draft = document.getElementById('draftBtn');
  var tasks = document.getElementById('tasksBtn');
  var replyCard = document.getElementById('replyCard');
  var tasksCard = document.getElementById('tasksCard');
  var root = document.documentElement;
  var langToggle = document.getElementById('demoLangToggle');
  var state = 0;
  var currentLang = 'pt';
  try {
    var savedTheme = localStorage.getItem('vouga-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') root.setAttribute('data-theme', savedTheme);
    var savedLang = localStorage.getItem('vouga-lang');
    if (savedLang === 'pt' || savedLang === 'en') currentLang = savedLang;
  } catch(e){}
  var COPY = {
    pt: {
      pageTitle: 'Demo Sistema de Conhecimento com IA · Vouga Agency',
      metaDescription: 'Demo interativa do Sistema de Conhecimento com IA da Vouga Agency: transforma conhecimento disperso num pacote de decisão com fontes, responsável, risco, resposta e tarefas.',
      logoHome: 'Vouga Agency, início',
      back: 'Voltar',
      talkToUs: 'Contacte-nos',
      demoLabel: 'Demo Sistema de Conhecimento com IA',
      demoTitle: 'Vê conhecimento disperso transformar-se num pacote de decisão.',
      demoCopy: 'Uma pergunta de gestão. Evidência, responsável, risco, resposta e tarefas. Sem caça à informação, sem interrupções.',
      stepStuck: 'decisão bloqueada',
      titleStuck: 'A Acme pode ter 12% de desconto antes de sexta-feira?',
      metricSearch: 'à procura',
      metricPeople: 'pessoas interrompidas',
      metricAnswers: 'respostas contraditórias',
      sourceEmail: 'Cliente precisa de resposta hoje.',
      sourcePricing: 'Limite self-serve de 8%.',
      sourceCrm: 'Pré-pagamento anual é provável.',
      sourceArchiveLabel: 'Arquivo de propostas',
      sourceArchive: 'Exceção Q4 semelhante foi ganha.',
      sourceSlack: '"Pergunta à Marta, ela sabe."',
      buildPacketCore: 'Criar<br>pacote',
      decisionPacketCore: 'Pacote de<br>decisão',
      confidence: '92% confiança',
      packetDecision: 'Aprovar 12%, com validação do responsável.',
      ownerLabel: 'Responsável',
      ownerValue: 'Head of Sales',
      riskLabel: 'Risco',
      riskValue: 'Médio',
      dueLabel: 'Prazo',
      dueValue: 'Hoje',
      evidencePricing: 'Regras de pricing',
      evidenceCrm: 'Nota de CRM',
      evidenceArchive: 'Arquivo de propostas',
      draftReply: 'Preparar resposta',
      createTasks: 'Criar tarefas',
      replyReady: '<span>Resposta</span><strong>Pronta</strong>',
      tasksReady: '<span>Tarefas</span><strong>Prontas</strong>',
      impact: '35s · 0 interrupções · 3 fontes',
      collectEvidence: 'Recolher evidência <span class="arrow">→</span>',
      reset: 'Reiniciar',
      statusWaiting: 'Um gestor está à espera da resposta certa.',
      stepReconciling: 'a reconciliar fontes',
      statusReconciling: 'A camada está a verificar regras de pricing, CRM e precedentes de propostas.',
      titleReconciling: 'A resposta está a ser montada a partir de fontes aprovadas.',
      reconcilingButton: 'A reconciliar...',
      buildDecision: 'Criar pacote de decisão <span class="arrow">→</span>',
      stepReady: 'pacote de decisão pronto',
      statusReady: 'Decisão, evidência, responsável e próximas ações estão prontos.',
      titleReady: 'Aprovar 12%, com validação do responsável.',
      replyButton: 'Preparar resposta',
      replyDone: '<span>Resposta</span><strong>12% é possível com pré-pagamento anual e aprovação do Head of Sales. Posso confirmar hoje.</strong>',
      statusReply: 'Resposta ao cliente preparada a partir de wording aprovado.',
      tasksDone: '<span>Tarefas</span><strong>Pedido de aprovação · Nota no CRM · Follow-up ao cliente</strong>',
      statusTasks: 'Tarefas em fila com responsável e contexto.'
    },
    en: {
      pageTitle: 'AI Knowledge System Demo · Vouga Agency',
      metaDescription: "Interactive demo of Vouga Agency's AI Knowledge System: turn scattered company knowledge into a cited decision packet with owner, risk, reply and tasks.",
      logoHome: 'Vouga Agency, home',
      back: 'Back',
      talkToUs: 'Contact us',
      demoLabel: 'AI Knowledge System demo',
      demoTitle: 'Watch scattered knowledge become a decision packet.',
      demoCopy: 'One manager question. Evidence, owner, risk, reply and tasks. No hunting, no interruptions.',
      stepStuck: 'stuck decision',
      titleStuck: 'Can Acme get a 12% discount before Friday?',
      metricSearch: 'searching',
      metricPeople: 'people interrupted',
      metricAnswers: 'answers disagree',
      sourceEmail: 'Client needs an answer today.',
      sourcePricing: '8% self-serve cap.',
      sourceCrm: 'Annual prepay is likely.',
      sourceArchiveLabel: 'Proposal archive',
      sourceArchive: 'Similar Q4 exception won.',
      sourceSlack: '"Ask Marta, she knows."',
      buildPacketCore: 'Build<br>packet',
      decisionPacketCore: 'Decision<br>packet',
      confidence: '92% confidence',
      packetDecision: 'Approve 12%, with owner sign-off.',
      ownerLabel: 'Owner',
      ownerValue: 'Head of Sales',
      riskLabel: 'Risk',
      riskValue: 'Medium',
      dueLabel: 'Due',
      dueValue: 'Today',
      evidencePricing: 'Pricing rules',
      evidenceCrm: 'CRM note',
      evidenceArchive: 'Proposal archive',
      draftReply: 'Draft reply',
      createTasks: 'Create tasks',
      replyReady: '<span>Reply</span><strong>Ready</strong>',
      tasksReady: '<span>Tasks</span><strong>Ready</strong>',
      impact: '35s · 0 interruptions · 3 sources',
      collectEvidence: 'Collect evidence <span class="arrow">→</span>',
      reset: 'Reset',
      statusWaiting: 'A manager is waiting for the right answer.',
      stepReconciling: 'reconciling sources',
      statusReconciling: 'The layer is checking pricing rules, CRM and proposal precedent.',
      titleReconciling: 'The answer is being assembled from approved sources.',
      reconcilingButton: 'Reconciling...',
      buildDecision: 'Build decision packet <span class="arrow">→</span>',
      stepReady: 'decision packet ready',
      statusReady: 'Decision, evidence, owner and next actions are ready.',
      titleReady: 'Approve 12%, with owner sign-off.',
      replyButton: 'Draft reply',
      replyDone: '<span>Reply</span><strong>12% is possible with annual prepay and Head of Sales approval. I can confirm today.</strong>',
      statusReply: 'Client reply drafted from approved wording.',
      tasksDone: '<span>Tasks</span><strong>Approval request · CRM note · Client follow-up</strong>',
      statusTasks: 'Tasks queued with owner and context.'
    }
  };

  function setText(el, value){ if (el) el.textContent = value; }
  function t(key){ return (COPY[currentLang] && COPY[currentLang][key]) || COPY.pt[key] || ''; }
  function setMeta(selector, value){
    var el = document.querySelector(selector);
    if (el) el.setAttribute('content', value);
  }
  function syncLangToggle(){
    if (!langToggle) return;
    langToggle.querySelectorAll('[data-lang-option]').forEach(function(option){
      var active = option.getAttribute('data-lang-option') === currentLang;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    langToggle.setAttribute('aria-label', currentLang === 'pt' ? 'Switch to English' : 'Mudar para português');
  }
  function applyLanguage(lang){
    currentLang = lang === 'en' ? 'en' : 'pt';
    root.setAttribute('lang', currentLang === 'en' ? 'en' : 'pt-PT');
    root.setAttribute('data-lang', currentLang);
    document.title = t('pageTitle');
    setMeta('meta[name="description"]', t('metaDescription'));
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if (t(key)) el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var key = el.getAttribute('data-i18n-html');
      if (t(key)) el.innerHTML = t(key);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el){
      var key = el.getAttribute('data-i18n-aria');
      if (t(key)) el.setAttribute('aria-label', t(key));
    });
    syncLangToggle();
  }

  function collectEvidence(){
    state = 1;
    board.classList.add('is-assembling');
    setText(step, t('stepReconciling'));
    setText(status, t('statusReconciling'));
    setText(title, t('titleReconciling'));
    progress.style.width = '52%';
    primary.disabled = true;
    primary.textContent = t('reconcilingButton');
    window.setTimeout(function(){
      board.classList.add('is-layered');
      primary.disabled = false;
      primary.innerHTML = t('buildDecision');
      primary.focus();
    }, 980);
  }

  function buildPacket(){
    state = 2;
    board.classList.add('is-packet');
    setText(step, t('stepReady'));
    setText(status, t('statusReady'));
    setText(title, t('titleReady'));
    progress.style.width = '100%';
    primary.innerHTML = t('replyButton');
    draft.focus();
  }

  function draftReply(){
    replyCard.classList.add('ready');
    replyCard.innerHTML = t('replyDone');
    setText(status, t('statusReply'));
  }

  function createTasks(){
    tasksCard.classList.add('ready');
    tasksCard.innerHTML = t('tasksDone');
    setText(status, t('statusTasks'));
  }

  function resetDemo(){
    state = 0;
    board.classList.remove('is-assembling', 'is-layered', 'is-packet');
    progress.style.width = '10%';
    setText(step, t('stepStuck'));
    setText(title, t('titleStuck'));
    setText(status, t('statusWaiting'));
    primary.disabled = false;
    primary.innerHTML = t('collectEvidence');
    replyCard.classList.remove('ready');
    tasksCard.classList.remove('ready');
    replyCard.innerHTML = t('replyReady');
    tasksCard.innerHTML = t('tasksReady');
    primary.focus();
  }

  function primaryAction(){
    if (state === 0) collectEvidence();
    else if (state === 1) buildPacket();
    else draftReply();
  }

  primary.addEventListener('click', primaryAction);
  assemble.addEventListener('click', collectEvidence);
  draft.addEventListener('click', draftReply);
  tasks.addEventListener('click', createTasks);
  reset.addEventListener('click', resetDemo);
  if (langToggle) {
    langToggle.addEventListener('click', function(){
      var next = currentLang === 'pt' ? 'en' : 'pt';
      applyLanguage(next);
      try { localStorage.setItem('vouga-lang', next); } catch(e){}
      resetDemo();
    });
  }

  applyLanguage(currentLang);
})();
