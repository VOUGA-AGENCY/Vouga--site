(function(){
  'use strict';
  var root = document.documentElement;
  try {
    var theme = localStorage.getItem('vouga-theme');
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
    var lang = localStorage.getItem('vouga-lang');
    if (lang === 'pt' || lang === 'en') root.setAttribute('data-lang', lang);
  } catch(e) {}
  document.addEventListener('click', function(e){
    var link = e.target.closest ? e.target.closest('a[data-route-page]') : null;
    if (!link) return;
    var page = link.getAttribute('data-route-page');
    if (!page) return;
    e.preventDefault();
    window.location.href = page;
  });
})();
