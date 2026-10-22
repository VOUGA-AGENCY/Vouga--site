/* Halftone wordmark: canvas dots, spring displacement and click wave.
   Adapted from the supplied React component; no runtime dependencies. */
(() => {
  'use strict';
  const labels = {
    pt: { explore: 'Explorar', work: 'Trabalho', approach: 'Abordagem', about: 'Sobre', follow: 'Siga-nos', contact: 'Contacto', book: 'Marcar uma conversa', privacy: 'Privacidade', terms: 'Termos', top: 'Voltar ao topo ↑' },
    en: { explore: 'Explore', work: 'Work', approach: 'Approach', about: 'About', follow: 'Follow us', contact: 'Contact', book: 'Book a conversation', privacy: 'Privacy', terms: 'Terms', top: 'Back to top ↑' }
  };
  document.querySelectorAll('[data-halftone-footer]').forEach(root => {
    const translate = () => {
      const copy = labels[document.documentElement.dataset.lang] || labels.pt;
      root.querySelectorAll('[data-hwf-copy]').forEach(el => { el.textContent = copy[el.dataset.hwfCopy]; });
    };
    translate();
    new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width:720px)');
    root.querySelector('.hwf-up').addEventListener('click', event => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduced.matches ? 'instant' : 'smooth' });
    });
    const canvas = root.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0, height = 0, dpr = 1, dots = new Float32Array(0);
    let px = -1e5, py = -1e5, raf = 0, visible = false, dirty = true;
    let ring = { x: 0, y: 0, time: -1e5 };
    const ink = [24, 24, 24], warm = [38, 38, 38];
    function layout() {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const mask = document.createElement('canvas');
      mask.width = width; mask.height = height;
      const m = mask.getContext('2d', { willReadFrequently: true });
      if (!m) return;
      const family = getComputedStyle(root).getPropertyValue('--font-sans');
      m.font = `800 100px ${family}`;
      const word = 'VOUGA';
      const size = width * .8 / m.measureText(word).width * 100;
      m.font = `800 ${size}px ${family}`;
      const box = m.measureText(word);
      m.fillStyle = '#000';
      m.textBaseline = 'alphabetic';
      m.fillText(word, (width - box.width) / 2, height - Math.max(0, box.actualBoundingBoxDescent || 0) - 2);
      const pixels = m.getImageData(0, 0, width, height).data;
      const gap = width < 600 ? 3.5 : 6;
      const cells = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          let alpha = 0;
          for (let sy = 0; sy < 3; sy++) for (let sx = 0; sx < 3; sx++) {
            const sampleX = Math.min(width - 1, Math.floor(x + (sx + .5) * gap / 3));
            const sampleY = Math.min(height - 1, Math.floor(y + (sy + .5) * gap / 3));
            alpha += pixels[(sampleY * width + sampleX) * 4 + 3];
          }
          const coverage = alpha / (9 * 255);
          if (coverage < .06) continue;
          const hx = x + gap / 2, hy = y + gap / 2;
          // Per dot: position, velocity, home position and radius.
          cells.push(hx, hy, 0, 0, hx, hy, Math.sqrt(coverage) * gap * .56);
        }
      }
      dots = new Float32Array(cells);
      root.dataset.ready = '';
      dirty = false;
    }
    function draw(now) {
      if (dirty) layout();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Keep the restored footer photograph visible behind the dots.
      ctx.clearRect(0, 0, width, height);
      const radius = reduced.matches ? 0 : 80;
      const age = now - ring.time;
      let moving = false;
      for (let j = 0; j < dots.length; j += 7) {
        let x = dots[j], y = dots[j + 1], vx = dots[j + 2], vy = dots[j + 3];
        const hx = dots[j + 4], hy = dots[j + 5];
        if (!reduced.matches) {
          if (age < 900) {
            const dx = hx - ring.x, dy = hy - ring.y;
            const distance = Math.hypot(dx, dy) + .001;
            const band = 1 - Math.min(1, Math.abs(distance - age * .9) / 26);
            const force = band * 3.2 * (1 - age / 900);
            vx += dx / distance * force; vy += dy / distance * force;
          }
          const dx = x - px, dy = y - py, distance = Math.hypot(dx, dy) + .001;
          if (distance < radius) {
            const force = (1 - distance / radius) * 2.6;
            vx += dx / distance * force; vy += dy / distance * force;
          }
          vx = (vx + (hx - x) * .05) * .84;
          vy = (vy + (hy - y) * .05) * .84;
          x += vx; y += vy;
          if (Math.abs(vx) + Math.abs(vy) > .02) moving = true;
          if (px < -1e4 && Math.abs(vx) + Math.abs(vy) < .02 && Math.abs(x - hx) + Math.abs(y - hy) < .05) {
            x = hx; y = hy; vx = vy = 0;
          }
        } else { x = hx; y = hy; vx = vy = 0; }
        dots[j] = x; dots[j + 1] = y; dots[j + 2] = vx; dots[j + 3] = vy;
        const warmth = Math.min(1, Math.hypot(x - hx, y - hy) / 28);
        ctx.fillStyle = warmth > .02
          ? `rgb(${ink.map((v, i) => Math.round(v + (warm[i] - v) * warmth)).join(',')})`
          : '#181818';
        ctx.beginPath();
        ctx.arc(x, y, dots[j + 6], 0, Math.PI * 2);
        ctx.fill();
      }
      return !reduced.matches && (moving || age < 900);
    }
    function loop(now) {
      raf = 0;
      if (!visible || document.hidden || compact.matches) return;
      if (draw(now)) raf = requestAnimationFrame(loop);
    }
    function wake() { if (!raf && visible && !document.hidden && !compact.matches) raf = requestAnimationFrame(loop); }
    function leave() { px = py = -1e5; wake(); }
    function local(event) {
      const rect = canvas.getBoundingClientRect();
      return [(event.clientX - rect.left) * width / rect.width, (event.clientY - rect.top) * height / rect.height];
    }
    root.addEventListener('pointermove', event => {
      if (compact.matches || reduced.matches || event.pointerType === 'touch') return;
      [px, py] = local(event); wake();
    }, { passive: true });
    root.addEventListener('pointerleave', leave);
    root.addEventListener('pointercancel', leave);
    root.addEventListener('pointerdown', event => {
      if (compact.matches || reduced.matches || event.target.closest('a,button')) return;
      const [x, y] = local(event);
      ring = { x, y, time: performance.now() }; wake();
    }, { passive: true });
    new ResizeObserver(() => { dirty = true; wake(); }).observe(root);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) wake();
      else { cancelAnimationFrame(raf); raf = 0; px = py = -1e5; }
    }, { rootMargin: '100px' }).observe(root);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else wake();
    });
    reduced.addEventListener('change', () => { leave(); ring.time = -1e5; wake(); });
    compact.addEventListener('change', () => {
      cancelAnimationFrame(raf); raf = 0; dirty = true;
      px = py = -1e5; ring.time = -1e5; wake();
    });
    document.fonts.ready.then(() => { dirty = true; wake(); });
  });
})();
