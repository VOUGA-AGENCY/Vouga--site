(() => {
  const section = document.querySelector('.news');
  if (!section) return;
  const rail = section.querySelector('.news-rail');
  const track = section.querySelector('.news-track');
  const group = section.querySelector('.news-group');
  const button = section.querySelector('.news-pause');
  const copy = group.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('a').forEach(link => link.tabIndex = -1);
  track.append(copy);
  section.setAttribute('data-enhanced', '');
  button.hidden = false;
  button.addEventListener('click', () => {
    const paused = section.toggleAttribute('data-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.querySelector('.news-pause-symbol').textContent = paused ? '▷' : 'Ⅱ';
  });
  // A constant 20 CSS pixels/second keeps the movement slow on every screen.
  new ResizeObserver(() => {
    section.style.setProperty('--news-duration', `${group.getBoundingClientRect().width / 20}s`);
  }).observe(group);
  new IntersectionObserver(entries => {
    section.toggleAttribute('data-offscreen', !entries[0].isIntersecting);
    if (entries[0].isIntersecting) {
      // Prepare the entire loop before offscreen cards drift into view on mobile.
      section.querySelectorAll('img').forEach(image => image.loading = 'eager');
    }
  }).observe(section);
  rail.addEventListener('focusin', event => {
    if (event.target.matches('a')) requestAnimationFrame(() => event.target.scrollIntoView({ block: 'nearest', inline: 'nearest' }));
  });
})();
