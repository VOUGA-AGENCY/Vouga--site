/* Vouga · Diagnóstico de Sistema — vanilla port of the Lovable diagnostic,
   rendered in the Vouga site's own look. No framework, no dependencies. */
(function(){
  'use strict';

  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ===== theme (shares the vouga-theme key with the rest of the site) ===== */
  (function(){
    root.setAttribute('data-theme', 'light');
    try { localStorage.setItem('vouga-theme', 'light'); } catch(e){}
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

  var PATHS = {
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

  /* ===== state ===== */
  var state = { stage:'start', mode:'identified', contact:{name:'',company:'',email:'',role:''}, path:null, qIndex:0, answers:[] };
  var app = document.getElementById('diagApp');
  if (!app) return;

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
    if (state.stage !== 'start') right += '<button class="diag-back" type="button" data-act="back">Voltar</button>';
    if (opts.continue) right += '<button class="btn btn-primary" type="button" data-act="continue"'+(opts.continueOff?' disabled':'')+'>Continuar <span class="arrow">→</span></button>';
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
        + '<input class="diag-input" data-f="name" value="'+esc(c.name)+'" placeholder="O seu nome" autocomplete="name">'
        + '<input class="diag-input" type="email" data-f="email" value="'+esc(c.email)+'" placeholder="email@empresa.com" autocomplete="email">'
        + '<input class="diag-input span2" data-f="company" value="'+esc(c.company)+'" placeholder="Nome da empresa" autocomplete="organization">'
        + '</div>'
      : '<div class="diag-fields">'
        + '<span class="diag-anon-note">Modo anónimo · sem nome, sem email</span>'
        + '<input class="diag-input" data-f="role" value="'+esc(c.role)+'" placeholder="O seu cargo ou função (ex: Diretor de Operações)">'
        + '</div>';
    return '<section class="diag-stage diag-fade wrap">'
      + '<span class="label">01 / como prefere começar</span>'
      + '<h1 class="diag-h1">Vamos mapear o seu <em class="diag-em">sistema</em>.</h1>'
      + terminalLead('Escolha a forma que lhe for mais confortável. Pode identificar-se para receber o relatório completo ou avançar em modo anónimo. O diagnóstico mantém a mesma lógica nos dois casos.')
      + '<div class="diag-modes">'
        + modeCard('identified','Diagnóstico identificado','Recebe o relatório completo por email, com contexto para a sua empresa.')
        + modeCard('anonymous','Diagnóstico 100% anónimo','Sem nome e sem email. Só precisamos da sua função.')
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
        + '<span class="diag-pgo">Escolher →</span></button>';
    });
    return '<section class="diag-stage diag-fade wrap">'
      + '<span class="label">02 / perfil</span>'
      + '<h1 class="diag-h1">Qual é o motor que move o seu <em class="diag-em">dia a dia</em>?</h1>'
      + terminalLead('Escolha a área onde sente mais pressão neste momento. A partir daí, adaptamos as perguntas ao que tende a fazer mais diferença no seu contexto.')
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
      + terminalLead('Escolha a opção que mais se aproxima da realidade atual da equipa.')
      + '<div class="diag-choices">'+choices+'</div></section>'
      + footHtml({});
  }

  function maturity(avg){
    if (avg<1.7) return {label:'Sistema Fragmentado', color:'var(--diag-red)'};
    if (avg<2.4) return {label:'Sistema em Transição', color:'var(--diag-yellow)'};
    return {label:'Sistema Orquestrado', color:'var(--diag-green)'};
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
    var ctaTitle = anon ? 'Este é o impacto provável no seu cargo.' : 'O mapa está feito. Agora falta desenhar o sistema.';
    var ctaSub = anon
      ? ('Podemos desenhar este sistema'+(state.contact.role.trim()?(' para '+esc(state.contact.role.trim())):'')+' de forma totalmente confidencial, sem expor a empresa.')
      : 'Numa conversa curta, transformamos este diagnóstico num plano concreto, com prioridades, riscos e próximos passos.';
    var ctaBtn = anon ? 'Agendar conversa de 15 min' : 'Desenhar o meu sistema';
    return '<section class="diag-result wrap">'
      + '<div class="diag-fade">'
        + '<p class="label" style="text-align:center">dashboard de diagnóstico · '+esc(def.title)+'</p>'
        + '<h1 class="diag-h1 center">'+(company?esc(company)+', eis':'Eis')+' o seu <em class="diag-em">mapa de impacto</em>.</h1>'
        + terminalLead('Uma leitura prática do seu sistema: pessoas, decisões, ferramentas e documentos a trabalhar em conjunto, ou a puxar cada um para seu lado.', 'center')
      + '</div>'
      + '<div class="diag-maturity diag-fade">'
        + '<div class="diag-mat-top"><div><span class="label">índice de maturidade do sistema</span>'
        + '<p class="diag-mat-label" style="color:'+m.color+'">'+m.label+'</p></div>'
        + '<p class="diag-mat-pct"><span class="num" data-count="'+pct+'%">'+pct+'%</span></p></div>'
        + '<div class="diag-mat-track"><span class="diag-mat-fill" style="--pct:'+Math.max(pct,5)+'%;background:'+m.color+'"></span></div>'
      + '</div>'
      + '<div class="diag-stats diag-fade">'+stats+'</div>'
      + '<div class="diag-service diag-fade">'
        + '<span class="label">sistema recomendado para si</span>'
        + '<h2 class="diag-svc-name">'+esc(def.service.name)+'</h2>'
        + '<p class="diag-svc-desc">'+esc(def.service.desc)+'</p>'
        + '<ul class="diag-svc-bullets">'+bullets+'</ul>'
      + '</div>'
      + '<div class="diag-cta diag-fade">'
        + '<h2 class="diag-cta-t">'+ctaTitle+'</h2>'
        + '<p class="diag-cta-s">'+ctaSub+'</p>'
        + '<a class="btn btn-primary diag-cta-btn" href="'+CAL+'" target="_blank" rel="noreferrer">'+ctaBtn+' <span class="arrow">→</span></a>'
        + '<button class="diag-back" type="button" data-act="restart">Recomeçar</button>'
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

  render();
})();
