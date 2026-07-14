(function(){
  'use strict';
  var root = document.documentElement;
  root.setAttribute('data-theme', 'dark');
  try {
    localStorage.removeItem('vouga-theme');
    var lang = localStorage.getItem('vouga-lang');
    if (lang === 'pt' || lang === 'en') root.setAttribute('data-lang', lang);
  } catch(e) {}
  document.addEventListener('click', function(e){
    var link = e.target.closest ? e.target.closest('a[data-route-page]') : null;
    if (!link) link = e.target.closest ? e.target.closest('a.logo') : null;
    if (!link && !document.body.classList.contains('home')) link = e.target.closest ? e.target.closest('a[href^="/#"]') : null;
    if (!link) return;
    var page = link.getAttribute('data-route-page');
    if (!page && link.classList.contains('logo') && !document.body.classList.contains('home')) page = 'index.html#top';
    if (!page && !document.body.classList.contains('home') && link.getAttribute('href')) page = 'index.html' + link.getAttribute('href').slice(1);
    if (!page) return;
    e.preventDefault();
    window.location.href = page;
  });
})();
