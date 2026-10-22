(() => {
  const section = document.querySelector('.booking-section');
  if (!section) return;
  const calendar = section.querySelector('.booking-calendar');
  const mount = document.getElementById('my-cal-inline');
  let started = false;
  let timeout;
  function failed() {
    if (calendar.classList.contains('is-ready')) return;
    calendar.classList.add('is-error');
    calendar.setAttribute('aria-busy', 'false');
    section.querySelector('.booking-error').hidden = false;
    clearTimeout(timeout);
  }
  function ready() {
    calendar.classList.remove('is-error');
    calendar.classList.add('is-ready');
    calendar.setAttribute('aria-busy', 'false');
    section.querySelector('.booking-error').hidden = true;
    clearTimeout(timeout);
  }
  function start() {
    if (started) return;
    started = true;
    // Official Cal.com queue, loaded only when the footer approaches the viewport.
    (function (C, A, L) {
      const push = (api, args) => api.q.push(args);
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const args = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const script = document.createElement('script');
          script.src = A;
          script.async = true;
          script.onerror = failed;
          document.head.appendChild(script);
          cal.loaded = true;
        }
        if (args[0] === L) {
          const api = function () { push(api, arguments); };
          const namespace = args[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = api;
            push(api, args);
            return;
          }
        }
        push(cal, args);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');
    window.Cal('init', 'vouga', { origin: 'https://cal.com' });
    const cal = window.Cal.ns.vouga;
    cal('on', { action: 'linkReady', callback: ready });
    cal('on', { action: 'linkFailed', callback: failed });
    cal('inline', {
      elementOrSelector: '#my-cal-inline',
      calLink: 'vouga-agency/discovery-call-vouga-agency',
      config: { layout: 'month_view', theme: 'dark' }
    });
    cal('ui', {
      theme: 'dark', layout: 'month_view',
      cssVarsPerTheme: { dark: {
        'cal-bg': '#080808', 'cal-bg-subtle': '#111111',
        'cal-bg-emphasis': '#202020', 'cal-bg-muted': '#141414',
        'cal-text': '#ece8de', 'cal-text-emphasis': '#ffffff',
        'cal-text-subtle': '#b7b7b7', 'cal-text-muted': '#858585',
        'cal-brand': '#ece8de', 'cal-brand-emphasis': '#ffffff',
        'cal-brand-text': '#111111', 'cal-brand-accent': '#111111',
        'cal-border': '#2b2b2b', 'cal-border-subtle': '#202020',
        'cal-border-booker': '#2b2b2b', 'cal-border-booker-width': '1px',
        'radius': '4px'
      } }
    });
    timeout = setTimeout(failed, 30000);
  }
  // The iframe is created asynchronously by Cal; label it without accessing its contents.
  const labelFrame = () => {
    const frame = mount.querySelector('iframe');
    if (frame) frame.title = document.documentElement.dataset.lang === 'en'
      ? 'Book a conversation with Vouga Agency' : 'Agendar uma conversa com a Vouga Agency';
  };
  new MutationObserver(labelFrame).observe(mount, { childList: true, subtree: true });
  new MutationObserver(labelFrame).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { start(); observer.disconnect(); }
    }, { rootMargin: '500px' });
    observer.observe(section);
  } else start();
  if (location.hash === '#contact' || location.hash === '#lets-talk') start();
})();
