(function(){
  'use strict';

  document.querySelectorAll('[data-history-back]').forEach(function(button){
    button.addEventListener('click', function(){
      if (document.referrer && window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = '/#top';
    });
  });
})();
