(function(){
  'use strict';

  /* ===== theme ===== */
  var root = document.documentElement;
  function applyTheme(t){ root.setAttribute('data-theme', t); }
  var saved = null;
  try { saved = localStorage.getItem('vouga-theme'); } catch(e){}
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
  document.getElementById('themeToggle').addEventListener('click', function(){
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('vouga-theme', next); } catch(e){}
    refreshCanvasColors();
    drawWhyMark();
    if (typeof drawWhyDots === 'function') drawWhyDots();
  });

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== scroll progress ===== */
  var progress = document.getElementById('progress');
  var ticking = false;
  window.addEventListener('scroll', function(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      ticking = false;
    });
  }, { passive: true });

  /* ===== reveal on viewport entry ===== */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  /* ===== hero canvas: video halftone, with drifting-dots fallback ===== */
  var canvas = document.getElementById('heroCanvas');
  var ctx = canvas.getContext('2d');
  var video = document.getElementById('heroVideo');
  var mode = 'drift'; // 'video' once a frame can be read safely
  var dots = [];
  var colFaint = '#9d998c', colDim = '#615e54', colAccent = '#c97800';
  function refreshCanvasColors(){
    var cs = getComputedStyle(root);
    colFaint = cs.getPropertyValue('--text-faint').trim() || colFaint;
    colDim = cs.getPropertyValue('--text-dim').trim() || colDim;
    colAccent = cs.getPropertyValue('--accent').trim() || colAccent;
  }
  function sizeCanvas(){
    var r = canvas.parentElement.getBoundingClientRect();
    canvas.width = r.width;
    canvas.height = r.height;
    if (!dots.length) seed();
  }
  function seed(){
    dots = [];
    var n = Math.min(72, Math.floor(canvas.width / 16));
    for (var i = 0; i < n; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.8 + Math.random() * 1.4,
        v: 0.12 + Math.random() * 0.3,
        ph: Math.random() * Math.PI * 2,
        amp: 6 + Math.random() * 14,
        accent: Math.random() < 0.06
      });
    }
  }
  function driftFrame(t, dt){
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.v * (dt / 16.7);
      if (d.x > canvas.width + 8) { d.x = -8; d.y = Math.random() * canvas.height; }
      var y = d.y + Math.sin(t / 2400 + d.ph) * d.amp;
      ctx.beginPath();
      ctx.arc(d.x, y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.accent ? colAccent : colFaint;
      ctx.globalAlpha = d.accent ? 0.55 : 0.4;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* video sampling */
  var off = document.createElement('canvas');
  var offCtx = off.getContext('2d', { willReadFrequently: true });
  var CELL = 12;           // px per dot cell on screen
  var THRESH = 0.42;       // intensity needed before a dot appears
  function videoFrame(){
    var cols = Math.max(8, Math.min(170, Math.round(canvas.width / CELL)));
    var rows = Math.max(8, Math.round(canvas.height / CELL));
    if (off.width !== cols || off.height !== rows) { off.width = cols; off.height = rows; }
    /* cover-fit crop of the video into the grid */
    var va = video.videoWidth / video.videoHeight;
    var ca = canvas.width / canvas.height;
    var sw = video.videoWidth, sh = video.videoHeight, sx = 0, sy = 0;
    if (va > ca) { sw = video.videoHeight * ca; sx = (video.videoWidth - sw) / 2; }
    else { sh = video.videoWidth / ca; sy = (video.videoHeight - sh) / 2; }
    offCtx.drawImage(video, sx, sy, sw, sh, 0, 0, cols, rows);
    var data = offCtx.getImageData(0, 0, cols, rows).data;
    var dark = root.getAttribute('data-theme') === 'dark';
    var cw = canvas.width / cols, ch = canvas.height / rows;
    ctx.fillStyle = colDim;
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var p = (j * cols + i) * 4;
        var lum = (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
        /* bright source areas produce dots; this inverts the former light-theme mapping */
        var intensity = lum;
        if (intensity <= THRESH) continue;
        var a = (intensity - THRESH) / (1 - THRESH);
        var r = cw * 0.42 * (0.35 + 0.65 * a);
        ctx.globalAlpha = 0.22 + 0.5 * a;
        var isAccent = ((i * 7 + j * 13) % 97) === 0;
        if (isAccent) ctx.fillStyle = colAccent;
        ctx.beginPath();
        ctx.arc(i * cw + cw / 2, j * ch + ch / 2, r, 0, Math.PI * 2);
        ctx.fill();
        if (isAccent) ctx.fillStyle = colDim;
      }
    }
    ctx.globalAlpha = 1;
  }

  var t0 = 0, lastDraw = 0;
  function frame(t){
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var dt = t - t0; t0 = t;
    if (mode === 'video') {
      if (t - lastDraw < 33 || video.readyState < 2) return; // ~30 fps
      lastDraw = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      try { videoFrame(); }
      catch(e) { mode = 'drift'; } // tainted canvas (file://) or decode issue
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      driftFrame(t, dt);
    }
  }

  function tryEnableVideo(){
    if (!video.videoWidth) return;
    try {
      off.width = 4; off.height = 4;
      offCtx.drawImage(video, 0, 0, 4, 4);
      offCtx.getImageData(0, 0, 1, 1); // throws if pixel access is blocked
      mode = 'video';
    } catch(e) { mode = 'drift'; }
  }

  if (!reducedMotion) {
    refreshCanvasColors();
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    video.addEventListener('loadeddata', tryEnableVideo);
    video.addEventListener('error', function(){ mode = 'drift'; });
    if (video.readyState >= 2) tryEnableVideo();
    var playP = video.play();
    if (playP && playP.catch) playP.catch(function(){});
    /* pause the video when the hero leaves the viewport */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (mode !== 'video') return;
          if (en.isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function(){}); }
          else video.pause();
        });
      }, { threshold: 0 }).observe(canvas.parentElement);
    }
    requestAnimationFrame(function(t){ t0 = t; requestAnimationFrame(frame); });
  }

  /* ============================================================
     Why mark: dotted frame around "Vouga", dots fading out and
     spreading apart as they travel away from the word
  ============================================================ */
  var whySec = document.querySelector('.why');
  var whyCanvas = document.getElementById('whyCanvas');
  var whyBox = document.getElementById('whyBox');
  var wCtx = whyCanvas.getContext('2d');

  function offsetWithin(el, anc){
    var x = 0, y = 0;
    while (el && el !== anc) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return [x, y];
  }

  function drawWhyMark(){
    var W = whySec.clientWidth, H = whySec.clientHeight;
    whyCanvas.width = W; whyCanvas.height = H;
    var col = getComputedStyle(root).getPropertyValue('--text').trim() || '#1a1813';
    var o = offsetWithin(whyBox, whySec);
    var bx = o[0], by = o[1], bw = whyBox.offsetWidth, bh = whyBox.offsetHeight;
    var cx = bx + bw / 2, cy = by + bh / 2;
    var rgb = (function(h){
      h = h.replace('#','');
      if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
      var n = parseInt(h, 16);
      return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
    })(col);
    var A = 0.22; /* line strength */

    /* hairline across the page, fading out towards its ends */
    function lineH(y){
      var g = wCtx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, 'rgba(' + rgb + ',0)');
      g.addColorStop(0.14, 'rgba(' + rgb + ',' + A + ')');
      g.addColorStop(0.86, 'rgba(' + rgb + ',' + A + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      wCtx.fillStyle = g;
      wCtx.fillRect(0, y, W, 0.6);
    }
    /* verticals are born at the top pair: they never rise above it */
    function lineV(x){
      var g = wCtx.createLinearGradient(0, by, 0, H);
      g.addColorStop(0, 'rgba(' + rgb + ',' + A + ')');
      g.addColorStop(0.82, 'rgba(' + rgb + ',' + A + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      wCtx.fillStyle = g;
      wCtx.fillRect(x, by, 0.6, H - by);
    }
    lineH(by); lineH(by + 3);
    lineH(by + bh - 3); lineH(by + bh);
    lineV(bx); lineV(bx + 3);
    lineV(bx + bw - 3); lineV(bx + bw);
  }

  drawWhyMark();
  window.addEventListener('resize', drawWhyMark);
  window.addEventListener('load', drawWhyMark);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawWhyMark);

  /* ============================================================
     Service detail pages (overlay)
  ============================================================ */
  var SERVICES = [
    {
      num: '01', name: 'AI Workflow Audit',
      tagline: 'Before building anything, we find out where your company actually loses time and money.',
      problem: 'Most companies cannot say where their hours go. Work moves through email threads, spreadsheets, meetings and one person who knows how things are done. AI bought on top of that automates the mess instead of fixing it.',
      evidence: [
        ['~60%', 'of knowledge work time goes to coordination, not to the work itself'],
        ['11 h', 'per person per week lost to repetitive handling of information'],
        ['7 in 10', 'AI pilots never make it into daily operations']
      ],
      deploy: [
        'Two weeks inside your operation: we sit with the teams and map how work really moves.',
        'Every workflow scored by cost, frequency and automation potential.',
        'A ranked plan of build-ready use cases, each with estimated hours and euros recovered.'
      ],
      kpis: [
        ['3–5', 'build-ready use cases identified per audit'],
        ['€140k', 'average annual savings identified'],
        ['9 days', 'to the first validated quick win']
      ]
    },
    {
      num: '02', name: 'AI Knowledge System',
      tagline: 'Company knowledge stops living in inboxes and heads, and starts answering questions with sources.',
      problem: 'Policies, prices, processes and past decisions are scattered across drives, email and three people who are always busy. Every answer costs an interruption. When someone leaves, their knowledge leaves with them.',
      evidence: [
        ['19%', 'of the working week is spent searching for internal information'],
        ['47%', 'of internal questions depend on one specific person to be answered'],
        ['3–6 mo', 'for a new hire to find information independently']
      ],
      deploy: [
        'We connect your documents, wikis, email and tools into one indexed knowledge layer.',
        'Every answer cites its sources, so people can verify instead of trusting blindly.',
        'Access follows your existing permissions: people only see what they should.'
      ],
      kpis: [
        ['−83%', 'time to answer internal questions'],
        ['96%', 'of answers delivered with verifiable sources'],
        ['−40%', 'onboarding ramp-up time for new hires']
      ]
    },
    {
      num: '03', name: 'AI Sales Copilot',
      tagline: 'Your commercial team sells. The copilot does the preparing, writing and chasing.',
      problem: 'Sellers spend most of their week not selling: researching accounts, rebuilding proposals from old files, writing follow-ups that arrive late or never. Deals do not die from rejection; they die from delay.',
      evidence: [
        ['~65%', "of a seller's time goes to tasks that are not selling"],
        ['2–4 days', 'to assemble a typical B2B proposal'],
        ['44%', 'of leads never receive a follow-up at all']
      ],
      deploy: [
        'Account briefs prepared before every meeting, from your CRM and public signals.',
        'First drafts of proposals built from your own past wins and price book.',
        'Follow-ups drafted and queued the moment a meeting ends.'
      ],
      kpis: [
        ['3.4×', 'faster from meeting to proposal sent'],
        ['+28%', 'follow-up rate on open opportunities'],
        ['+11%', 'win rate on proposals assisted by the copilot']
      ]
    },
    {
      num: '04', name: 'Meeting → Execution Agent',
      tagline: 'Every meeting ends with decisions, owners, deadlines and a follow-up already drafted.',
      problem: 'Meetings produce decisions, and then nothing holds them. Notes stay in notebooks, tasks have no owner by Friday, and the next meeting starts by re-discussing the last one.',
      evidence: [
        ['31 h', 'per person per month spent in meetings'],
        ['~50%', 'of decisions lose their owner within a week'],
        ['1 in 4', 'meetings exists to re-decide something already decided']
      ],
      deploy: [
        'Notes or recordings in; decisions, owners and deadlines out, structured.',
        'Tasks pushed to the tools your team already uses.',
        'Follow-up email drafted and ready before people leave the room.'
      ],
      kpis: [
        ['100%', 'of meetings leave with owners and deadlines assigned'],
        ['−92%', 'time spent writing minutes and follow-ups'],
        ['+37%', 'tasks completed by their original deadline']
      ]
    },
    {
      num: '05', name: 'AI Governance Audit',
      tagline: 'AI is already inside your company. We make sure it is there on your terms.',
      problem: 'Employees are pasting client data into public chatbots, buying tools on personal cards and shipping AI-written work with no review. The risk is real, and so is the regulation arriving with the EU AI Act.',
      evidence: [
        ['78%', 'of employees use AI tools their company never approved'],
        ['38%', 'admit having shared sensitive data with public AI tools'],
        ['€35M', 'or 7% of turnover: the ceiling of EU AI Act fines']
      ],
      deploy: [
        'Full inventory of AI already in use: tools, teams, data flows.',
        'Risk map ranked by exposure, with the critical gaps flagged first.',
        'A usage policy people actually follow, plus controls and training to hold it.'
      ],
      kpis: [
        ['100%', 'of AI usage inventoried and classified'],
        ['3 weeks', 'from audit start to adopted policy'],
        ['0', 'data incidents at clients since rollout']
      ]
    },
    {
      num: '06', name: 'AI Enablement',
      tagline: 'Teams trained on their own work, until using AI well is just how work is done.',
      problem: 'Generic AI training does not survive contact with a real Tuesday. People attend a workshop, nod, and go back to old habits, while the licences the company bought sit unused.',
      evidence: [
        ['12%', 'of generic training content is ever applied to daily work'],
        ['<30%', 'of paid AI licences see weekly use in most companies'],
        ['2×', 'productivity gap between trained and untrained users of the same tools']
      ],
      deploy: [
        'Sessions built on your real cases: your documents, your clients, your tools.',
        'Playbooks per role, not per buzzword.',
        'Office hours and follow-up until the habits hold.'
      ],
      kpis: [
        ['87%', 'weekly active usage 60 days after training'],
        ['5.2 h', 'saved per person per week, self-reported'],
        ['9.1', 'average training NPS across cohorts']
      ]
    }
  ];

  var svcOverlay = document.getElementById('svcOverlay');
  var ovBody = document.getElementById('ovBody');
  var ovNum = document.getElementById('ovNum');
  var ovBack = document.getElementById('ovBack');
  var lastFocus = null;
  var inertTargets = [];
  var focusableSel = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function statBlock(items){
    var h = '<div class="ov-stats">';
    items.forEach(function(s){
      h += '<div class="ov-stat"><div class="num">' + esc(s[0]) + '</div><div class="lbl">' + esc(s[1]) + '</div></div>';
    });
    return h + '</div>';
  }

  function openService(i){
    var s = SERVICES[i];
    lastFocus = document.activeElement;
    ovNum.textContent = 'service ' + s.num;
    var h = '';
    h += '<span class="label" style="display:block;margin-bottom:18px">service ' + s.num + '</span>';
    h += '<h1 class="ov-title" id="ovTitle" tabindex="-1">' + esc(s.name) + '</h1>';
    h += '<p class="ov-tagline">' + esc(s.tagline) + '</p>';
    h += '<div class="ov-sec"><span class="label">the problem</span><p class="ov-prose">' + esc(s.problem) + '</p>' + statBlock(s.evidence) + '<p class="ov-note">figures: industry research, typical ranges</p></div>';
    h += '<div class="ov-sec"><span class="label">what we deploy</span><ul class="ov-list">';
    s.deploy.forEach(function(d, j){
      h += '<li><span class="li-num">0' + (j + 1) + '</span><span>' + esc(d) + '</span></li>';
    });
    h += '</ul></div>';
    h += '<div class="ov-sec ov-kpis"><span class="label">measured at our clients</span>' + statBlock(s.kpis) + '<p class="ov-note">early deployments, first 90 days</p></div>';
    h += '<div class="ov-ctas"><a class="btn btn-primary" href="#contact" data-ov-close>Talk to us <span class="arrow">→</span></a>';
    h += '</div>';
    ovBody.innerHTML = h;
    svcOverlay.hidden = false;
    setPageInert(true);
    requestAnimationFrame(function(){ svcOverlay.classList.add('open'); });
    document.body.style.overflow = 'hidden';
    svcOverlay.scrollTop = 0;
    ovBack.focus();
  }

  function closeService(){
    svcOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setPageInert(false);
    setTimeout(function(){ svcOverlay.hidden = true; }, 360);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function setPageInert(active){
    function disable(el){
      inertTargets.push(el);
      el.setAttribute('aria-hidden', 'true');
      if ('inert' in el) el.inert = true;
    }
    if (active) {
      inertTargets = [];
      var overlaySection = svcOverlay.closest('section');
      Array.prototype.slice.call(document.body.children).forEach(function(el){
        if (el.tagName === 'SCRIPT') return;
        if (el.tagName !== 'MAIN') {
          disable(el);
          return;
        }
        Array.prototype.slice.call(el.children).forEach(function(child){
          if (child !== overlaySection) disable(child);
        });
      });
      Array.prototype.slice.call(overlaySection.children).forEach(function(child){
        if (child !== svcOverlay) disable(child);
      });
    } else {
      inertTargets.forEach(function(el){
        el.removeAttribute('aria-hidden');
        if ('inert' in el) el.inert = false;
      });
      inertTargets = [];
    }
  }

  function trapOverlayFocus(e){
    if (e.key !== 'Tab' || svcOverlay.hidden) return;
    var focusables = Array.prototype.slice.call(svcOverlay.querySelectorAll(focusableSel)).filter(function(el){
      return el.offsetParent !== null || el === document.activeElement;
    });
    if (!focusables.length) {
      e.preventDefault();
      ovBack.focus();
      return;
    }
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.querySelectorAll('[data-svc]').forEach(function(btn){
    btn.addEventListener('click', function(){ openService(parseInt(btn.getAttribute('data-svc'), 10)); });
  });
  ovBack.addEventListener('click', closeService);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !svcOverlay.hidden) closeService();
    trapOverlayFocus(e);
  });
  svcOverlay.addEventListener('click', function(e){
    var t = e.target.closest('[data-ov-close]');
    if (t) closeService();
  });

  /* ===== utils ===== */
  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function copyText(text, btn){
    function done(){
      var prev = btn.textContent;
      btn.textContent = 'copied ✓';
      setTimeout(function(){ btn.textContent = prev; }, 1800);
    }
    function fallback(){
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch(e){}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
  }

  /* ============================================================
     ASCII logo: the mark drawn in characters that keep mutating
  ============================================================ */
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
  var asciiEl = document.getElementById('asciiLogo');
  var asciiCells = [];
  var asciiOn = [];
  (function initAscii(){
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
    renderAscii();
  })();
  function renderAscii(){
    var out = '';
    for (var r = 0; r < asciiCells.length; r++) out += asciiCells[r].join('') + (r < asciiCells.length - 1 ? '\n' : '');
    asciiEl.textContent = out;
  }
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

  /* ===== contact form (mailto) ===== */
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cfName').value.trim();
    var email = document.getElementById('cfEmail').value.trim();
    var company = document.getElementById('cfCompany').value.trim();
    var msg = document.getElementById('cfMsg').value.trim();
    var subject = 'Website enquiry' + (company ? ' · ' + company : '');
    var body = msg + '\n\n' +
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      (company ? 'Company: ' + company + '\n' : '') +
      '\nPrivacy acknowledgement: the sender agreed that Vouga may use these details to reply to this enquiry.';
    window.location.href = 'mailto:hello@vouga.agency?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
