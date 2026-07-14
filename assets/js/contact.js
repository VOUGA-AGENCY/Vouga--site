(function(){
  'use strict';

  if (window.history && window.history.replaceState && /\/contact\.html$/i.test(window.location.pathname || '')) {
    window.history.replaceState(null, '', '/#contact');
  }

  var root = document.documentElement;
  root.setAttribute('data-theme', 'dark');
  try { localStorage.removeItem('vouga-theme'); } catch(e) {}
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = 'pt';
  try {
    var savedLang = localStorage.getItem('vouga-lang');
    if (savedLang === 'pt' || savedLang === 'en') lang = savedLang;
  } catch(e) {}
  root.setAttribute('data-lang', lang);

  var COPY = {
    pt: {
      documentTitle:'Contactar a Vouga · Vamos conversar',
      metaDescription:'Fale com a Vouga sobre o sistema, produto, software, IA ou decisão que precisa de avançar.',
      socialLocale:'pt_PT',
      socialImageAlt:'Identidade visual da Vouga Agency para transformação sistémica, software, IA e execução.',
      logoHome:'Vouga Agency, início',
      mainNav:'navegação principal',
      mobileNav:'navegação mobile',
      openMenu:'abrir menu',
      closeMenu:'fechar menu',
      backLabel:'Voltar',
      langToggle:'Switch to English',
      principlesLabel:'Como trabalhamos',
      formLabel:'Formulário de contacto',
      signatureLabel:'Desenvolvido no Porto.',
      navApproach:'Como Pensamos',
      navWork:'Casos de Uso',
      navCapabilities:'Áreas',
      talkToUs:'Falar connosco',
      title:'Vamos conversar.',
      lead:'Traz-nos o problema, sistema ou decisão que precisa de avançar. Respondemos com contexto, não com uma proposta automática.',
      principleOne:'Contexto primeiro',
      principleTwo:'Ferramenta certa',
      principleThree:'Execução até ao resultado',
      nameLabel:'Nome',
      emailLabel:'Email',
      phoneLabel:'Telefone',
      optionalLabel:'(opcional)',
      phoneHint:'Inclui o indicativo do país.',
      companyLabel:'Empresa',
      messageLabel:'Mensagem',
      consent:'Aceito que a Vouga use estes dados para responder ao meu pedido.',
      submit:'Enviar',
      sending:'A enviar...',
      missing:'Preenche os campos obrigatórios para continuarmos.',
      invalidName:'Indica um nome com pelo menos 2 caracteres.',
      invalidEmail:'Introduz um email válido, como nome@exemplo.com.',
      invalidPhone:'Introduz um número válido com o indicativo do país, como +351 912 345 678.',
      invalidCompany:'Indica o nome da empresa.',
      invalidMessage:'Conta-nos um pouco mais, usando pelo menos 10 caracteres.',
      consentRequired:'Precisamos do teu consentimento para responder ao pedido.',
      success:'Pedido enviado. Falamos em breve.',
      error:'Não foi possível enviar. Tenta novamente ou escreve para hello@vouga-agency.pt.'
    },
    en: {
      documentTitle:'Contact Vouga · Start a conversation',
      metaDescription:'Start a conversation with Vouga about the business system, product, software or AI work that needs to move.',
      socialLocale:'en_US',
      socialImageAlt:'Vouga Agency visual identity for systems-led transformation, software, AI and execution.',
      logoHome:'Vouga Agency, home',
      mainNav:'main navigation',
      mobileNav:'mobile navigation',
      openMenu:'open menu',
      closeMenu:'close menu',
      backLabel:'Go back',
      langToggle:'Mudar para português',
      principlesLabel:'How we work',
      formLabel:'Contact form',
      signatureLabel:'Engineered in Porto.',
      navApproach:'Our Approach',
      navWork:'Use Cases',
      navCapabilities:'Capabilities',
      talkToUs:'Contact us',
      title:'Start a conversation.',
      lead:'Bring us the problem, system or decision that needs to move. We reply with context, not an automatic proposal.',
      principleOne:'Context first',
      principleTwo:'Right tool',
      principleThree:'Execution to outcome',
      nameLabel:'Name',
      emailLabel:'Email',
      phoneLabel:'Phone',
      optionalLabel:'(optional)',
      phoneHint:'Include the international country code.',
      companyLabel:'Company',
      messageLabel:'Message',
      consent:'I agree that Vouga may use these details to reply to my request.',
      submit:'Submit',
      sending:'Sending...',
      missing:'Fill in the required fields before continuing.',
      invalidName:'Enter a name with at least 2 characters.',
      invalidEmail:'Enter a valid email, such as name@example.com.',
      invalidPhone:'Enter a valid number with its country code, such as +351 912 345 678.',
      invalidCompany:'Enter the company name.',
      invalidMessage:'Tell us a little more, using at least 10 characters.',
      consentRequired:'We need your consent before replying to the request.',
      success:'Request sent. We will be in touch soon.',
      error:'We could not send it. Please try again or email hello@vouga-agency.pt.'
    }
  };
  var copy = COPY[lang] || COPY.pt;
  function applyCopy(){
    copy = COPY[lang] || COPY.pt;
    root.setAttribute('lang', lang === 'en' ? 'en' : 'pt-PT');
    root.setAttribute('data-lang', lang);
    document.title = copy.documentTitle;
    function setMeta(selector, value){
      var el = document.querySelector(selector);
      if (el) el.setAttribute('content', value);
    }
    setMeta('meta[name="description"]', copy.metaDescription);
    setMeta('meta[property="og:title"]', copy.documentTitle);
    setMeta('meta[property="og:description"]', copy.metaDescription);
    setMeta('meta[property="og:locale"]', copy.socialLocale);
    setMeta('meta[property="og:image:alt"]', copy.socialImageAlt);
    setMeta('meta[name="twitter:title"]', copy.documentTitle);
    setMeta('meta[name="twitter:description"]', copy.metaDescription);
    setMeta('meta[name="twitter:image:alt"]', copy.socialImageAlt);
    document.querySelectorAll('[data-contact-i18n]').forEach(function(el){
      var key = el.getAttribute('data-contact-i18n');
      if (copy[key]) el.textContent = copy[key];
    });
    document.querySelectorAll('[data-lang-option]').forEach(function(el){
      el.classList.toggle('is-active', el.getAttribute('data-lang-option') === lang);
    });
    var placeholders = lang === 'pt' ? {
      contactName:'Pedro Santos',
      contactEmail:'nome@exemplo.com',
      contactPhone:'+351 900 000 000',
      contactCompany:'Empresa',
      contactMessage:'Conta-nos o que precisa de mudar...'
    } : {
      contactName:'Pedro Santos',
      contactEmail:'name@example.com',
      contactPhone:'+351 900 000 000',
      contactCompany:'Company',
      contactMessage:'Tell us what needs to change...'
    };
    Object.keys(placeholders).forEach(function(id){
      var field = document.getElementById(id);
      if (field) field.setAttribute('placeholder', placeholders[id]);
    });
    var logo = document.querySelector('.logo');
    if (logo) logo.setAttribute('aria-label', copy.logoHome);
    var nav = document.querySelector('.nav nav');
    if (nav) nav.setAttribute('aria-label', copy.mainNav);
    var mobileNav = document.querySelector('.mobile-links');
    if (mobileNav) mobileNav.setAttribute('aria-label', copy.mobileNav);
    var langToggle = document.getElementById('langToggle');
    if (langToggle) langToggle.setAttribute('aria-label', copy.langToggle);
    var navBurger = document.getElementById('navBurger');
    var mobileMenu = document.getElementById('mobileMenu');
    if (navBurger) {
      navBurger.setAttribute('aria-label', mobileMenu && mobileMenu.classList.contains('open') ? copy.closeMenu : copy.openMenu);
    }
    var principles = document.querySelector('.contact-principles');
    if (principles) principles.setAttribute('aria-label', copy.principlesLabel);
    var panel = document.querySelector('.contact-panel');
    if (panel) panel.setAttribute('aria-label', copy.formLabel);
    var signature = document.querySelector('.contact-signature');
    if (signature) signature.setAttribute('aria-label', copy.signatureLabel);
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
    var navBurger = document.getElementById('navBurger');
    var mobileMenu = document.getElementById('mobileMenu');
    function setMenu(open){
      if (!navBurger || !mobileMenu) return;
      mobileMenu.classList.toggle('open', open);
      navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
      navBurger.setAttribute('aria-label', open ? copy.closeMenu : copy.openMenu);
    }
    function enforceMobileNavSurface(){
      var mobile = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
      document.querySelectorAll('.nav .nav-right > .desktop-contact').forEach(function(el){
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

  (function initContactAscii(){
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
    var asciiEl = document.getElementById('contactAsciiLogo');
    if (!asciiEl) return;
    var asciiCells = [];
    var asciiOn = [];
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
    function renderAscii(){
      var out = '';
      for (var r = 0; r < asciiCells.length; r++) out += asciiCells[r].join('') + (r < asciiCells.length - 1 ? '\n' : '');
      asciiEl.textContent = out;
    }
    renderAscii();
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
      language: lang,
      consent: data.get('consent') === 'on',
      website: String(data.get('website') || '').trim()
    };
  }

  var fields = {
    name: form.elements.name,
    email: form.elements.email,
    phone: form.elements.phone,
    company: form.elements.company,
    message: form.elements.message,
    consent: form.elements.consent
  };

  function setFieldError(name, message){
    var field = fields[name];
    var error = document.getElementById('contact' + name.charAt(0).toUpperCase() + name.slice(1) + 'Error');
    if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message || '';
  }

  function validateField(name){
    var field = fields[name];
    if (!field) return true;
    var value = typeof field.value === 'string' ? field.value.trim() : '';
    var message = '';

    if (name === 'name' && (value.length < 2 || value.length > 100)) message = copy.invalidName;
    if (name === 'email' && (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))) message = copy.invalidEmail;
    if (name === 'company' && (value.length < 2 || value.length > 120)) message = copy.invalidCompany;
    if (name === 'message' && (value.length < 10 || value.length > 5000)) message = copy.invalidMessage;
    if (name === 'consent' && !field.checked) message = copy.consentRequired;
    if (name === 'phone' && value) {
      var phone = window.VougaPhone && window.VougaPhone.parse(value);
      if (!phone || !phone.valid) message = copy.invalidPhone;
    }

    setFieldError(name, message);
    return !message;
  }

  function validateForm(){
    var order = ['name', 'email', 'phone', 'company', 'message', 'consent'];
    var firstInvalid = null;
    order.forEach(function(name){
      if (!validateField(name) && !firstInvalid) firstInvalid = fields[name];
    });
    if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
    return !firstInvalid;
  }

  Object.keys(fields).forEach(function(name){
    var field = fields[name];
    var eventName = name === 'consent' ? 'change' : 'blur';
    field.addEventListener(eventName, function(){ validateField(name); });
    if (name !== 'consent') {
      field.addEventListener('input', function(){
        if (field.getAttribute('aria-invalid') === 'true') validateField(name);
      });
    }
  });

  fields.phone.addEventListener('blur', function(){
    var phone = window.VougaPhone && window.VougaPhone.parse(fields.phone.value);
    if (phone && phone.valid && !phone.empty) fields.phone.value = phone.international;
  });

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    if (!validateForm()) {
      setStatus(copy.missing, 'error');
      return;
    }
    var payload = payloadFromForm();
    var submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    if (submit) submit.textContent = copy.sending;
    setStatus('', 'info');

    try {
      var response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      var result = await response.json().catch(function(){ return {}; });
      if (!response.ok) {
        if (result.field && fields[result.field]) {
          validateField(result.field);
          fields[result.field].focus();
        }
        throw new Error(result.code || 'contact_request_failed');
      }
      form.reset();
      Object.keys(fields).forEach(function(name){ setFieldError(name, ''); });
      setStatus(copy.success, 'success');
    } catch(e) {
      setStatus(copy.error, 'error');
    } finally {
      if (submit) submit.disabled = false;
      if (submit) submit.textContent = copy.submit;
    }
  });
})();
