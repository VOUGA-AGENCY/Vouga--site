/* Existing Vouga image-sampled ASCII effect, isolated from homepage navigation. */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  (function initHeroAsciiOverlay(){
    var canvases = Array.prototype.slice.call(document.querySelectorAll('[data-hero-ascii]'));
    if (!canvases.length) return;

    canvases.forEach(function(canvas){
      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      var mobileMedia = window.matchMedia('(max-width: 820px)');
      var source = new Image();
      var cells = [];
      var palette = canvas.getAttribute('data-palette') || '.:+*%V#A@';
      var mutators = canvas.getAttribute('data-mutators') || '.:%#@&V+=*A';
      var timer = 0;
      var visible = true;

      function clamp(value, min, max){ return Math.max(min, Math.min(max, value)); }
      function luminance(r, g, b){ return .2126 * r + .7152 * g + .0722 * b; }
      function hash(x, y){
        var value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return value - Math.floor(value);
      }
      function pixel(data, width, height, x, y){
        x = clamp(Math.round(x), 0, width - 1);
        y = clamp(Math.round(y), 0, height - 1);
        var index = (y * width + x) * 4;
        return [data[index], data[index + 1], data[index + 2], data[index + 3]];
      }
      function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        var fontSize = parseInt(canvas.getAttribute('data-font-size'), 10) || 12;
        ctx.font = '700 ' + fontSize + 'px "SFMono-Regular", Consolas, "Liberation Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var defaultColor = canvas.getAttribute('data-ascii-color') || '#fff';
        for (var i = 0; i < cells.length; i += 1){
          var cell = cells[i];
          ctx.fillStyle = cell.color || defaultColor;
          ctx.fillText(cell.char, cell.x, cell.y);
        }
      }
      function build(){
        var width = source.naturalWidth;
        var height = source.naturalHeight;
        if (!width || !height) return;

        canvas.width = width;
        canvas.height = height;
        var sample = document.createElement('canvas');
        sample.width = width;
        sample.height = height;
        var sampleCtx = sample.getContext('2d', { willReadFrequently:true });
        sampleCtx.drawImage(source, 0, 0, width, height);
        var data = sampleCtx.getImageData(0, 0, width, height).data;
        var mobile = mobileMedia.matches;
        var fontSize = parseInt(canvas.getAttribute('data-font-size'), 10) || 12;
        var scaleFactor = fontSize / 12;
        var stepMult = parseFloat(canvas.getAttribute('data-step-mult')) || 1;
        var stepX = Math.max(12, Math.round((mobile ? 10 : 9) * scaleFactor * stepMult));
        var stepY = Math.max(14, Math.round((mobile ? 14 : 13) * scaleFactor * stepMult));
        var firstThird = canvas.hasAttribute('data-first-third-only') || canvas.hasAttribute('data-first-third');
        var maxAllowedX = firstThird ? width * 0.38 : width;
        var minDetail = canvas.hasAttribute('data-min-detail') ? parseFloat(canvas.getAttribute('data-min-detail')) : (mobile ? 30 : 28);
        var forceDense = canvas.hasAttribute('data-force-dense');
        var brightOnly = canvas.hasAttribute('data-bright-only');
        var brightThreshold = parseFloat(canvas.getAttribute('data-bright-threshold')) || 155;
        var includeOrange = canvas.hasAttribute('data-include-orange');
        var horizontalSpread = parseInt(canvas.getAttribute('data-horizontal-spread'), 10) || 0;
        var pastelAccent = canvas.getAttribute('data-pastel-accent') || canvas.getAttribute('data-accent-color');
        var defaultColor = canvas.getAttribute('data-ascii-color') || '#fff';
        cells = [];

        for (var y = Math.floor(stepY / 2); y < height; y += stepY){
          for (var x = Math.floor(stepX / 2); x < maxAllowedX; x += stepX){
            var center = pixel(data, width, height, x, y);
            if (center[3] < 28) continue;

            if (brightOnly) {
              var brightness = luminance(center[0], center[1], center[2]);
              var orangeTarget = includeOrange && center[0] > 145 && center[0] > center[1] * 1.35 && center[1] > 28 && center[2] < 135;
              var directTarget = brightness >= brightThreshold || orangeTarget;
              var spreadTarget = false;
              if (!directTarget && horizontalSpread) {
                for (var spread = 1; spread <= horizontalSpread; spread += 1) {
                  var spreadLeft = pixel(data, width, height, x - stepX * spread, y);
                  var spreadRight = pixel(data, width, height, x + stepX * spread, y);
                  var spreadPixels = [spreadLeft, spreadRight];
                  for (var side = 0; side < spreadPixels.length; side += 1) {
                    var neighbour = spreadPixels[side];
                    var neighbourBright = luminance(neighbour[0], neighbour[1], neighbour[2]) >= brightThreshold;
                    var neighbourOrange = includeOrange && neighbour[0] > 145 && neighbour[0] > neighbour[1] * 1.35 && neighbour[1] > 28 && neighbour[2] < 135;
                    if (neighbourBright || neighbourOrange) spreadTarget = true;
                  }
                  if (spreadTarget) break;
                }
              }
              if (!directTarget && !spreadTarget) continue;
              var brightDensity = spreadTarget ? .42 : (orangeTarget ? .82 : clamp((brightness - brightThreshold) / 42, .58, .98));
              if (hash(x * 1.37, y * 2.11) > brightDensity) continue;
              cells.push({
                x:x,
                y:y,
                char:palette.charAt(Math.floor(hash(x * 3.17, y * 4.73) * palette.length)),
                color:defaultColor
              });
              continue;
            }

            var left = pixel(data, width, height, x - stepX, y);
            var right = pixel(data, width, height, x + stepX, y);
            var up = pixel(data, width, height, x, y - stepY);
            var down = pixel(data, width, height, x, y + stepY);
            var horizontal = Math.abs(luminance(left[0], left[1], left[2]) - luminance(right[0], right[1], right[2]));
            var vertical = Math.abs(luminance(up[0], up[1], up[2]) - luminance(down[0], down[1], down[2]));
            var alphaEdge = Math.max(
              Math.abs(center[3] - left[3]),
              Math.abs(center[3] - right[3]),
              Math.abs(center[3] - up[3]),
              Math.abs(center[3] - down[3])
            );
            var detail = Math.sqrt(horizontal * horizontal + vertical * vertical) + alphaEdge * .42;
            if (detail < minDetail) continue;

            var density = forceDense ? 0.95 : (mobile
              ? clamp((detail - 28) / 110, .08, .55)
              : clamp((detail - 25) / 102, .1, .65));
            if (!forceDense && hash(x, y) > density) continue;

            var strength = clamp((detail - 10) / 110, 0, 1);
            var shade = clamp(Math.round(strength * (palette.length - 1)), 0, palette.length - 1);
            var isAccent = pastelAccent && (hash(x * 3.1, y * 7.7) < 0.38);
            cells.push({
              x:x,
              y:y,
              char:palette.charAt(shade),
              color:isAccent ? pastelAccent : defaultColor
            });
          }
        }
        draw();
        canvas.classList.add('is-ready');
      }
      function mutate(){
        if (document.hidden || !visible || !cells.length) return;
        var mutationRate = parseFloat(canvas.getAttribute('data-mutation-rate')) || .045;
        var changes = Math.max(12, Math.floor(cells.length * mutationRate));
        var pastelAccent = canvas.getAttribute('data-pastel-accent') || canvas.getAttribute('data-accent-color');
        var defaultColor = canvas.getAttribute('data-ascii-color') || '#fff';
        for (var i = 0; i < changes; i += 1){
          var cell = cells[Math.floor(Math.random() * cells.length)];
          cell.char = mutators.charAt(Math.floor(Math.random() * mutators.length));
          if (pastelAccent) {
            cell.color = (Math.random() < 0.38) ? pastelAccent : defaultColor;
          }
        }
        draw();
      }

      function loadSource(){
        var nextSource = mobileMedia.matches ? (canvas.getAttribute('data-mobile-src') || canvas.getAttribute('data-src')) : canvas.getAttribute('data-src');
        if (nextSource && source.getAttribute('data-current-src') !== nextSource){
          source.setAttribute('data-current-src', nextSource);
          source.src = nextSource;
        }
      }
      source.onload = function(){
        build();
        var mutationInterval = parseInt(canvas.getAttribute('data-mutation-ms'), 10) || 150;
        if (!reducedMotion && !timer) timer = window.setInterval(mutate, mutationInterval);
      };
      loadSource();
      if (mobileMedia.addEventListener) mobileMedia.addEventListener('change', loadSource);
      else if (mobileMedia.addListener) mobileMedia.addListener(loadSource);

      if ('IntersectionObserver' in window){
        new IntersectionObserver(function(entries){
          visible = entries[0] ? entries[0].isIntersecting : true;
        }, { threshold:0 }).observe(canvas);
      }
      window.addEventListener('pagehide', function(){
        if (timer) window.clearInterval(timer);
      });
    });
  })();


