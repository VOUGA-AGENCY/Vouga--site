/* GradualBlur — vanilla JS port of the React Bits component (github.com/ansh-dhanani).
   Builds a stack of backdrop-filter layers masked by a gradient so content
   blurs progressively toward one edge. Here it runs as a page-level (fixed)
   scroll blur at the bottom of every page. No dependencies. */
(function(){
  'use strict';

  var STYLE_ID = 'gradual-blur-styles';
  function injectStyles(){
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '.gradual-blur{pointer-events:none;isolation:isolate;transition:opacity .28s ease}' +
      '.gradual-blur.is-hidden{opacity:0}' +
      '.gradual-blur-inner{position:relative;width:100%;height:100%}' +
      '.gradual-blur-inner>div{-webkit-backdrop-filter:inherit;backdrop-filter:inherit}' +
      '@supports not (backdrop-filter:blur(1px)){.gradual-blur-inner>div{background:rgba(20,19,15,.18)}}';
    document.head.appendChild(s);
  }

  var CURVES = {
    linear: function(p){ return p; },
    bezier: function(p){ return p * p * (3 - 2 * p); },
    'ease-in': function(p){ return p * p; },
    'ease-out': function(p){ return 1 - Math.pow(1 - p, 2); }
  };
  function dirFor(pos){
    return ({ top:'to top', bottom:'to bottom', left:'to left', right:'to right' })[pos] || 'to bottom';
  }

  function build(cfg){
    cfg = cfg || {};
    var position    = cfg.position || 'bottom';
    var strength    = cfg.strength == null ? 2 : cfg.strength;
    var height      = cfg.height || '6rem';
    var divCount    = cfg.divCount || 5;
    var exponential = !!cfg.exponential;
    var opacity     = cfg.opacity == null ? 1 : cfg.opacity;
    var curve       = CURVES[cfg.curve] || CURVES.linear;
    var zIndex      = cfg.zIndex == null ? 1000 : cfg.zIndex;
    var target      = cfg.target || 'page';
    var isVertical  = position === 'top' || position === 'bottom';
    var isPage      = target === 'page';

    var root = document.createElement('div');
    root.className = 'gradual-blur ' + (isPage ? 'gradual-blur-page' : 'gradual-blur-parent') +
      (cfg.className ? ' ' + cfg.className : '');
    root.setAttribute('aria-hidden', 'true');
    var st = root.style;
    st.position = isPage ? 'fixed' : 'absolute';
    st.pointerEvents = 'none';
    st.zIndex = (isPage ? zIndex + 100 : zIndex);
    if (isVertical) {
      st.height = height; st.width = cfg.width || '100%';
      st[position] = '0'; st.left = '0'; st.right = '0';
    } else {
      st.width = cfg.width || height; st.height = '100%';
      st[position] = '0'; st.top = '0'; st.bottom = '0';
    }

    var inner = document.createElement('div');
    inner.className = 'gradual-blur-inner';

    var increment = 100 / divCount;
    var direction = dirFor(position);
    for (var i = 1; i <= divCount; i++) {
      var progress = curve(i / divCount);
      var blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * divCount + 1) * strength;
      var p1 = Math.round((increment * i - increment) * 10) / 10;
      var p2 = Math.round(increment * i * 10) / 10;
      var p3 = Math.round((increment * i + increment) * 10) / 10;
      var p4 = Math.round((increment * i + increment * 2) * 10) / 10;
      var g = 'transparent ' + p1 + '%, black ' + p2 + '%';
      if (p3 <= 100) g += ', black ' + p3 + '%';
      if (p4 <= 100) g += ', transparent ' + p4 + '%';
      var mask = 'linear-gradient(' + direction + ', ' + g + ')';

      var d = document.createElement('div');
      var ds = d.style;
      ds.position = 'absolute'; ds.inset = '0';
      ds.maskImage = mask; ds.webkitMaskImage = mask;
      ds.backdropFilter = 'blur(' + blurValue.toFixed(3) + 'rem)';
      ds.webkitBackdropFilter = 'blur(' + blurValue.toFixed(3) + 'rem)';
      ds.opacity = opacity;
      inner.appendChild(d);
    }

    root.appendChild(inner);
    return root;
  }

  function init(){
    injectStyles();
    /* site-wide scroll blur: a soft veil at the bottom edge of the viewport */
    var blur = build({
      position: 'bottom',
      target: 'page',
      height: '6rem',
      strength: 2,
      divCount: 5,
      curve: 'bezier',
      exponential: true,
      opacity: 1
    });
    document.body.appendChild(blur);

    function syncBottomState(){
      var doc = document.documentElement;
      var remaining = doc.scrollHeight - (window.scrollY + window.innerHeight);
      blur.classList.toggle('is-hidden', remaining <= 8);
    }

    syncBottomState();
    window.addEventListener('scroll', syncBottomState, { passive: true });
    window.addEventListener('resize', syncBottomState);
  }

  /* expose for ad-hoc use elsewhere */
  window.GradualBlur = { build: build };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
