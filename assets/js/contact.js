(function(){
  'use strict';

  if (window.history && window.history.replaceState && /\/contact\.html$/i.test(window.location.pathname || '')) {
    window.history.replaceState(null, '', '/#contact');
  }

  var root = document.documentElement;
  var lang = 'pt';
  try {
    var savedLang = localStorage.getItem('vouga-lang');
    if (savedLang === 'pt' || savedLang === 'en') lang = savedLang;
  } catch(e) {}
  root.setAttribute('data-lang', lang);

  var COPY = {
    pt: {
      navApproach:'Como Pensamos',
      navWork:'Casos de Uso',
      navCapabilities:'Áreas',
      talkToUs:'Falar connosco',
      themeLabel:'Modo claro / escuro',
      kicker:'contact us',
      title:'Start a conversation.',
      lead:'Bring us the problem, system or decision that needs to move. We reply with context, not an automatic proposal.',
      principleOne:'Contexto primeiro',
      principleTwo:'Ferramenta certa',
      principleThree:'Execução até ao resultado',
      nameLabel:'Nome',
      emailLabel:'Email',
      phoneLabel:'Telefone',
      optionalLabel:'(opcional)',
      companyLabel:'Empresa',
      messageLabel:'Mensagem',
      consent:'Aceito que a Vouga use estes dados para responder ao meu pedido.',
      submit:'Enviar',
      missing:'Preenche os campos obrigatórios para continuarmos.',
      pending:'Formulário pronto. Falta ligar o Supabase para recolher submissões reais.',
      success:'Pedido enviado. Falamos em breve.',
      error:'Não foi possível enviar. Tenta novamente ou escreve para hello@vouga-agency.pt.'
    },
    en: {
      navApproach:'Our Approach',
      navWork:'Use Cases',
      navCapabilities:'Capabilities',
      talkToUs:'Contact us',
      themeLabel:'Light / dark mode',
      kicker:'contact us',
      title:'Start a conversation.',
      lead:'Bring us the problem, system or decision that needs to move. We reply with context, not an automatic proposal.',
      principleOne:'Context first',
      principleTwo:'Right tool',
      principleThree:'Execution to outcome',
      nameLabel:'Name',
      emailLabel:'Email',
      phoneLabel:'Phone',
      optionalLabel:'(optional)',
      companyLabel:'Company',
      messageLabel:'Message',
      consent:'I agree that Vouga may use these details to reply to my request.',
      submit:'Submit',
      missing:'Fill in the required fields before continuing.',
      pending:'Form ready. Supabase still needs to be connected before real submissions are collected.',
      success:'Request sent. We will be in touch soon.',
      error:'We could not send it. Please try again or email hello@vouga-agency.pt.'
    }
  };
  var copy = COPY[lang] || COPY.pt;
  function applyCopy(){
    copy = COPY[lang] || COPY.pt;
    root.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-contact-i18n]').forEach(function(el){
      var key = el.getAttribute('data-contact-i18n');
      if (copy[key]) el.textContent = copy[key];
    });
    document.querySelectorAll('[data-lang-option]').forEach(function(el){
      el.classList.toggle('is-active', el.getAttribute('data-lang-option') === lang);
    });
  }
  applyCopy();

  (function initNav(){
    var langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', function(){
        lang = lang === 'pt' ? 'en' : 'pt';
        try { localStorage.setItem('vouga-lang', lang); } catch(e) {}
        applyCopy();
      });
    }
    function toggleTheme(){
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('vouga-theme', next); } catch(e) {}
    }
    var themeBtn = document.getElementById('themeToggle');
    var themeBtnMobile = document.getElementById('themeToggleMobile');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (themeBtnMobile) themeBtnMobile.addEventListener('click', toggleTheme);

    var navBurger = document.getElementById('navBurger');
    var mobileMenu = document.getElementById('mobileMenu');
    function setMenu(open){
      if (!navBurger || !mobileMenu) return;
      mobileMenu.classList.toggle('open', open);
      navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
      navBurger.setAttribute('aria-label', open ? 'close menu' : 'open menu');
    }
    function enforceMobileNavSurface(){
      var mobile = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
      document.querySelectorAll('.nav .nav-right > .theme-toggle, .nav .nav-right > .desktop-contact').forEach(function(el){
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

  var form = document.querySelector('[data-contact-form]');
  var status = document.querySelector('[data-contact-status]');
  if (!form || !status) return;

  function setStatus(text, kind){
    status.textContent = text;
    status.setAttribute('data-state', kind || 'info');
  }
  function payloadFromForm(){
    var data = new FormData(form);
    return {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      company: String(data.get('company') || '').trim(),
      message: String(data.get('message') || '').trim(),
      source: String(data.get('source') || 'website_contact'),
      language: lang
    };
  }
  function storePending(payload){
    try {
      var existing = JSON.parse(localStorage.getItem('vouga-contact-pending') || '[]');
      existing.push(Object.assign({ created_at: new Date().toISOString() }, payload));
      localStorage.setItem('vouga-contact-pending', JSON.stringify(existing.slice(-20)));
    } catch(e) {}
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus(copy.missing, 'error');
      return;
    }
    var payload = payloadFromForm();
    var cfg = window.VOUGA_SUPABASE_CONFIG || {};
    var table = form.getAttribute('data-supabase-table') || 'contact_requests';
    var submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;

    if (!cfg.url || !cfg.anonKey) {
      storePending(payload);
      setStatus(copy.pending, 'info');
      if (submit) submit.disabled = false;
      return;
    }

    fetch(String(cfg.url).replace(/\/$/, '') + '/rest/v1/' + encodeURIComponent(table), {
      method: 'POST',
      headers: {
        apikey: cfg.anonKey,
        Authorization: 'Bearer ' + cfg.anonKey,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).then(function(res){
      if (!res.ok) throw new Error('Supabase request failed');
      form.reset();
      setStatus(copy.success, 'success');
    }).catch(function(){
      setStatus(copy.error, 'error');
    }).finally(function(){
      if (submit) submit.disabled = false;
    });
  });
})();
