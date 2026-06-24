(function(){
  'use strict';

  var root = document.documentElement;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var currentLang = 'pt';

  (function initTheme(){
    var saved = null;
    try { saved = localStorage.getItem('vouga-theme'); } catch(e) {}
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) root.setAttribute('data-theme', 'dark');
    else root.setAttribute('data-theme', 'light');

    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function(){
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('vouga-theme', next); } catch(e) {}
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
          description:'Vouga Intelligence integra sistemas de IA em workflows reais: auditorias, copilotos, agentes, conhecimento interno e governação.',
          kicker:'AI services · sistemas de operação',
          lead:'Integramos IA no trabalho que já move a empresa: propostas, conhecimento interno, reuniões, decisões e governação. A tecnologia entra depois de entendermos o sistema.',
          primary:'Fazer diagnóstico <span class="arrow">→</span>',
          secondary:'Ver sistemas',
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
          description:'Vouga Intelligence integrates AI systems into real workflows: audits, copilots, agents, internal knowledge and governance.',
          kicker:'AI services · operating systems',
          lead:'We integrate AI into the work that already moves the company: proposals, internal knowledge, meetings, decisions and governance. Technology enters after we understand the system.',
          primary:'Take the diagnosis <span class="arrow">→</span>',
          secondary:'See systems',
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
          title:'Vouga Foundations · MVPs',
          description:'Vouga Foundations transforma ideias em MVPs e sistemas validados: risco primeiro, construção depois.',
          kicker:'MVPs · validação · produto',
          lead:'Da ideia ao sistema validado. Construímos MVPs e protótipos só depois de perceber o risco: mercado, operação, dados, equipa e viabilidade técnica.',
          primary:'Trazer uma ideia <span class="arrow">→</span>',
          secondary:'Ver processo',
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
          title:'Vouga Foundations · MVPs',
          description:'Vouga Foundations turns ideas into MVPs and validated systems: risk first, build after.',
          kicker:'MVPs · validation · product',
          lead:'From idea to validated system. We build MVPs and prototypes only after understanding the risk: market, operation, data, team and technical feasibility.',
          primary:'Bring an idea <span class="arrow">→</span>',
          secondary:'See process',
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
          title:'Vouga Academy · Ligação e Talento',
          description:'Vouga Academy liga formação aplicada, talento técnico jovem e equipas que precisam de trabalhar melhor com inteligência.',
          kicker:'ligação · formação · talento',
          lead:'Uma ponte entre equipas que precisam de usar inteligência no trabalho real e talento jovem que quer construir, aprender e assumir responsabilidade cedo.',
          primary:'Falar sobre formação <span class="arrow">→</span>',
          secondary:'Ver ponte',
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
          title:'Vouga Academy · Connection and Talent',
          description:'Vouga Academy connects applied training, young technical talent and teams that need to work better with intelligence.',
          kicker:'connection · training · talent',
          lead:'A bridge between teams that need to use intelligence in real work and young talent that wants to build, learn and take responsibility early.',
          primary:'Talk about training <span class="arrow">→</span>',
          secondary:'See bridge',
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
      text('.nav-right .btn-primary', common.contact);
      var logo = q('.logo'); if (logo) logo.setAttribute('aria-label', common.logo);
      var theme = q('#themeToggle'); if (theme) theme.setAttribute('aria-label', common.theme);
      text('.detail-kicker', copy.kicker);
      text('.detail-lead', copy.lead);
      html('.detail-actions .btn-primary', copy.primary);
      text('.detail-actions .btn-ghost', copy.secondary);
      setHeads(copy);
      setCards(copy.cards || []);
      if (page === 'intelligence') {
        text('.detail-split > .detail-prose', copy.prose);
        text('.detail-band h3', copy.bandTitle);
        text('.detail-band .detail-prose', copy.bandCopy);
        setList('.detail-list li', copy.list);
      }
      if (page === 'foundations') {
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
        qa('.academy-thread div').forEach(function(item, i){
          if (!copy.thread[i]) return;
          textNode(item.querySelector('strong'), copy.thread[i][0]);
          textNode(item.querySelector('span'), copy.thread[i][1]);
        });
        text('.detail-band h3', copy.bandTitle);
        text('.detail-band .detail-prose', copy.bandCopy);
        setList('.detail-list li', copy.list);
      }
      setList('.detail-stat span', copy.stats);
      text('.detail-cta h2', copy.cta);
      html('.detail-cta .btn-primary', copy.ctaBtn);
      sync(lang);
    }

    var saved = null;
    try { saved = localStorage.getItem('vouga-lang'); } catch(e) {}
    apply(saved === 'en' ? 'en' : 'pt');
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
    function render(study){
      study.el.textContent = study.cells.map(function(row){ return row.join(''); }).join('\n');
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
      render(study);
    }
    function tick(study){
      if (document.hidden || !study.live.length) return;
      var n = Math.max(7, Math.floor(study.live.length * .028));
      for (var i = 0; i < n; i++) {
        var cell = study.live[Math.floor(Math.random() * study.live.length)];
        var jitter = Math.floor(Math.random() * 5) - 2;
        var shade = Math.max(0, Math.min(charset.length - 1, cell[2] + jitter));
        study.cells[cell[0]][cell[1]] = Math.random() < .12 ? mutators[Math.floor(Math.random() * mutators.length)] : charset[shade];
      }
      render(study);
    }

    var studies = els.map(function(el){
      var study = {
        el: el,
        src: el.getAttribute('data-src'),
        mask: el.getAttribute('data-mask') || 'light',
        cols: parseInt(el.getAttribute('data-cols') || '78', 10),
        trimBottom: parseFloat(el.getAttribute('data-trim-bottom') || '0') || 0,
        img: new Image(),
        cells: [],
        live: []
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
