(function(){
  'use strict';
  var root = document.documentElement;
  try {
    var theme = localStorage.getItem('vouga-theme');
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
    var lang = localStorage.getItem('vouga-lang');
    if (lang === 'pt' || lang === 'en') root.setAttribute('data-lang', lang);
  } catch(e) {}
})();
