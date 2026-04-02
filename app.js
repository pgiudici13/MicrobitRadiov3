// ========== MicrobitRadioV3 — App.js ==========

// === INTRO: a tutto schermo, poi sparisce ===
window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('introOverlay');
  if (!intro) return;
  // After 2.8s, fade out with blur, then remove
  setTimeout(() => {
    intro.classList.add('done');
    setTimeout(() => {
      intro.remove();
      // Trigger scroll animations once intro is gone
      observeAnimations();
    }, 1000);
  }, 2800);
});

// === PARTICLES (background) ===
(function() {
  const c = document.getElementById('particlesCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let pts = [];
  const resize = () => { c.width = innerWidth; c.height = innerHeight; };
  resize();
  addEventListener('resize', resize);
  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * c.width;
      this.y = Math.random() * c.height;
      this.vx = (Math.random() - 0.5) * 0.18;
      this.vy = (Math.random() - 0.5) * 0.18;
      this.s = Math.random() * 1.2 + 0.4;
      this.o = Math.random() * 0.12 + 0.02;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > c.width || this.y < 0 || this.y > c.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,142,255,${this.o})`;
      ctx.fill();
    }
  }
  for (let i = 0; i < 45; i++) pts.push(new P());
  (function loop() {
    ctx.clearRect(0, 0, c.width, c.height);
    pts.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 80) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(79,142,255,${0.025 * (1 - d / 80)})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  })();
})();

// === NAVBAR scroll ===
const navbar = document.getElementById('navbar');
addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 40));
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// === SPA NAVIGATION ===
function navigateTo(page) {
  window.scrollTo(0, 0);
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.querySelectorAll('.sa').forEach(el => el.classList.remove('v'));
  });
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    setTimeout(() => observeAnimations(), 60);
  }
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  document.getElementById('navLinks').classList.remove('open');
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(el.dataset.page);
  });
});

// === SCROLL ANIMATIONS ===
let scrollObserver = null;
function observeAnimations() {
  if (scrollObserver) scrollObserver.disconnect();
  scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('v');
        scrollObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '50px 0px -20px 0px' });

  const activePage = document.querySelector('.page.active');
  if (!activePage) return;
  const els = activePage.querySelectorAll('.sa:not(.v)');
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      el.classList.add('v');
    } else {
      scrollObserver.observe(el);
    }
  });
}

// === HERO LED MATRIX ===
(function() {
  const m = document.getElementById('heroLed');
  if (!m) return;
  for (let i = 0; i < 25; i++) {
    const d = document.createElement('div');
    d.className = 'led';
    m.appendChild(d);
  }
  const patterns = [
    [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,1,0,0],
    [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,1,0,0, 0,1,0,1,0],
    [0,0,0,0,0, 0,0,0,0,0, 0,0,1,0,0, 0,1,0,1,0, 1,0,0,0,1],
    [0,0,0,0,0, 0,0,1,0,0, 0,1,0,1,0, 1,0,0,0,1, 0,1,0,1,0],
    [0,0,1,0,0, 0,1,0,1,0, 1,0,0,0,1, 0,1,0,1,0, 0,0,1,0,0],
    [0,1,0,1,0, 1,0,0,0,1, 0,1,0,1,0, 0,0,1,0,0, 0,0,0,0,0],
    [1,0,0,0,1, 0,1,0,1,0, 0,0,1,0,0, 0,0,0,0,0, 0,0,0,0,0],
    [0,1,0,1,0, 0,0,1,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
    [0,0,1,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
    [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
  ];
  let idx = 0;
  setInterval(() => {
    const dots = m.querySelectorAll('.led');
    const p = patterns[idx % patterns.length];
    dots.forEach((d, i) => d.classList.toggle('on', p[i] === 1));
    idx++;
  }, 550);
})();

// === CODE VIEWER ===
(function() {
  const el = document.getElementById('codeContent');
  if (!el) return;
  const lines = [
    {t:'// Programma MicrobitRadioV3',c:'comment'},{t:''},{t:'enum RadioMessage {',c:'keyword'},
    {t:'    HiUnknown = 26979,',c:'number'},{t:'    HiGeget = 2955,',c:'number'},
    {t:'    OnlineSYNC = 7840,',c:'number'},{t:'    OnlineSYNCReciving = 27820,',c:'number'},
    {t:'    BLOCK = 28732,',c:'number'},{t:'    HiZotap = 32430,',c:'number'},
    {t:'    HiGagez = 35590,',c:'number'},{t:'    message1 = 49434',c:'number'},{t:'}'},{t:''},
    {t:'// Inizializzazione',c:'comment'},{t:'radio.setGroup(137)',c:'function'},
    {t:'radio.setTransmitPower(7)',c:'function'},{t:'music.setVolume(130)',c:'function'},
    {t:'turtle.setSpeed(30)',c:'function'},{t:''},
    {t:'// Pulsante A',c:'comment'},{t:'input.onButtonPressed(Button.A, () => {',c:'function'},
    {t:'    if (status == 0) {'},{t:'        if(control.deviceName() == "geget") radio.sendMessage(RadioMessage.HiGeget)',c:'function'},
    {t:'        else radio.sendMessage(RadioMessage.HiUnknown)',c:'function'},{t:'    }'},{t:'})'},{t:''},
    {t:'// A+B — Scan della rete',c:'comment'},{t:'input.onButtonPressed(Button.AB, () => {',c:'function'},
    {t:'    online = 0',c:'number'},{t:'    radio.sendMessage(RadioMessage.message1)',c:'function'},
    {t:'    SYNC_did += 1',c:'number'},{t:'})'},{t:''},
    {t:'// Pulsante B — HUD',c:'comment'},{t:'input.onButtonPressed(Button.B, () => {',c:'function'},
    {t:'    turtle.setPosition(0, 0)',c:'function'},{t:'    turtle.pen(TurtlePenMode.Down)',c:'function'},
    {t:'    turtle.forward(X_view)',c:'function'},{t:'})'},{t:''},
    {t:'// Profili VIP',c:'comment'},{t:'function geget_ID() { /* pattern */ }',c:'function'},
    {t:'function zotap_ID() { /* pattern */ }',c:'function'},
    {t:'function gagez_ID() { /* pattern */ }',c:'function'},{t:''},
    {t:'// Loop — Calcolo HUD',c:'comment'},{t:'basic.forever(() => {',c:'function'},
    {t:'    if (online <= 5) X_view = online',c:'number'},
    {t:'    else if (online <= 10) {',c:'number'},
    {t:'        X_view = 5; Y_view = online - 5',c:'number'},
    {t:'    }'},{t:'    // ... fino a 20 utenti',c:'comment'},{t:'})'},
  ];
  el.innerHTML = lines.map(l => l.c ? `<span class="${l.c}">${esc(l.t)}</span>\n` : esc(l.t) + '\n').join('');
})();
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// === LED SIMULATOR ===
let simAnimating = false, simAnimInterval = null;
(function() {
  const m = document.getElementById('simMatrix');
  if (!m) return;
  for (let i = 0; i < 25; i++) {
    const led = document.createElement('div');
    led.className = 'sim-led';
    led.dataset.index = i;
    led.addEventListener('click', () => { led.classList.toggle('on'); updateExportCode(); });
    m.appendChild(led);
  }
})();

function getSimLeds() { return Array.from(document.querySelectorAll('#simMatrix .sim-led')); }
function clearSimMatrix() { getSimLeds().forEach(l => l.classList.remove('on')); updateExportCode(); }
function randomSimMatrix() { getSimLeds().forEach(l => l.classList.toggle('on', Math.random() > 0.5)); updateExportCode(); }
function invertSimMatrix() { getSimLeds().forEach(l => l.classList.toggle('on')); updateExportCode(); }

function toggleSimAnimation() {
  const btn = document.getElementById('simAnimate');
  simAnimating = !simAnimating;
  if (simAnimating) {
    btn.textContent = 'Stop'; btn.classList.add('active');
    const boot = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1],
      [0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0],
      [0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0],
      [0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0],
      [1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    let i = 0;
    const leds = getSimLeds();
    simAnimInterval = setInterval(() => {
      const p = boot[i % boot.length];
      leds.forEach((l, idx) => l.classList.toggle('on', p[idx] === 1));
      i++;
    }, 450);
  } else {
    btn.textContent = 'Sequenza Boot';
    btn.classList.remove('active');
    clearInterval(simAnimInterval);
  }
}

const PRESETS = {
  boot1:[0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0],
  ok:[0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0],
  hi:[1,0,1,0,1,1,0,1,0,0,1,1,1,0,1,1,0,1,0,1,1,0,1,0,1],
  geget:[0,1,0,0,1,1,0,1,1,0,0,1,1,1,0,0,1,1,0,1,1,0,0,1,0],
  zotap:[1,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  gagez:[1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0],
  sad:[0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0],
  no:[1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1],
  hud3:[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  hud12:[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
};
function loadPreset(name) {
  if (simAnimating) toggleSimAnimation();
  const p = PRESETS[name];
  if (!p) return;
  getSimLeds().forEach((l, i) => l.classList.toggle('on', p[i] === 1));
  updateExportCode();
}

function updateExportCode() {
  const leds = getSimLeds();
  const el = document.getElementById('simExportCode');
  if (!el) return;
  let hasOn = false;
  let code = 'basic.showLeds(`\n';
  for (let r = 0; r < 5; r++) {
    code += '    ';
    for (let c = 0; c < 5; c++) {
      const on = leds[r * 5 + c].classList.contains('on');
      if (on) hasOn = true;
      code += (on ? '#' : '.') + (c < 4 ? ' ' : '');
    }
    code += '\n';
  }
  code += '    `)';
  if (hasOn) { el.style.display = 'block'; el.textContent = code; }
  else el.style.display = 'none';
}

// === GITHUB API ===
const REPO_URL = 'https://api.github.com/repos/pgiudici13/MicrobitRadiov3';
const USER_URL = 'https://api.github.com/users/pgiudici13';
const LANG_COLORS = {
  TypeScript:'#3178c6', JavaScript:'#f1e05a', HTML:'#e34c26',
  CSS:'#563d7c', Python:'#3572A5', Ruby:'#701516',
  Makefile:'#427819', Shell:'#89e051'
};

async function fetchGithubData() {
  try {
    const [repoRes, commitsRes, langsRes, userReposRes] = await Promise.all([
      fetch(REPO_URL),
      fetch(REPO_URL + '/commits?per_page=10'),
      fetch(REPO_URL + '/languages'),
      fetch(USER_URL + '/repos?sort=updated&per_page=8')
    ]);
    const repo = await repoRes.json();
    const commits = await commitsRes.json();
    const langs = await langsRes.json();
    const userRepos = await userReposRes.json();

    // Stat counters
    animateCounter('gh-stars', repo.stargazers_count ?? 0);
    animateCounter('gh-forks', repo.forks_count ?? 0);
    animateCounter('gh-watchers', repo.watchers_count ?? 0);
    animateCounter('gh-issues', repo.open_issues_count ?? 0);
    animateCounter('gh-size', repo.size ?? 0);

    // Repo card
    const av = repo.owner?.avatar_url || '';
    const ghAvatar = document.getElementById('gh-avatar');
    const aboutAvatar = document.getElementById('aboutAvatar');
    if (ghAvatar) ghAvatar.src = av;
    if (aboutAvatar) aboutAvatar.src = av;

    const fn = document.getElementById('gh-fullname');
    const desc = document.getElementById('gh-desc');
    if (fn) fn.textContent = repo.full_name || '';
    if (desc) desc.textContent = repo.description || 'Nessuna descrizione.';

    const tags = document.getElementById('gh-tags');
    if (tags) {
      tags.innerHTML = '';
      [repo.language, repo.default_branch, repo.visibility, repo.has_pages ? 'GitHub Pages' : null, repo.license?.spdx_id]
        .filter(Boolean).forEach(t => {
          tags.innerHTML += `<span class="repo-tag">${esc(String(t))}</span>`;
        });
    }

    const fmt = d => new Date(d).toLocaleDateString('it-IT', { day:'2-digit', month:'short', year:'numeric' });
    const cr = document.getElementById('gh-created');
    const pu = document.getElementById('gh-pushed');
    if (cr) cr.textContent = repo.created_at ? fmt(repo.created_at) : '—';
    if (pu) pu.textContent = repo.pushed_at ? fmt(repo.pushed_at) : '—';

    // Languages
    if (langs && typeof langs === 'object' && Object.keys(langs).length) {
      const total = Object.values(langs).reduce((a, b) => a + b, 0);
      const sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]);
      const bar = document.getElementById('langBar');
      const legend = document.getElementById('langLegend');
      if (bar) bar.innerHTML = sorted.map(([l, b]) =>
        `<div class="lang-seg" style="width:${((b/total)*100).toFixed(1)}%;background:${LANG_COLORS[l]||'#8b949e'}"></div>`
      ).join('');
      if (legend) legend.innerHTML = sorted.map(([l, b]) =>
        `<div class="lang-i"><span class="lang-d" style="background:${LANG_COLORS[l]||'#8b949e'}"></span><span class="lang-n">${esc(l)}</span> <span class="lang-p">${((b/total)*100).toFixed(1)}%</span></div>`
      ).join('');
    }

    // Commits
    if (Array.isArray(commits) && commits.length) {
      const cl = document.getElementById('commitsList');
      if (cl) cl.innerHTML = commits.map(c =>
        `<div class="commit"><span class="commit-sha">${(c.sha||'').substring(0,7)}</span><span class="commit-msg">${esc(c.commit?.message?.split('\n')[0]||'—')}</span><span class="commit-date">${c.commit?.author?.date ? fmt(c.commit.author.date) : '—'}</span></div>`
      ).join('');
    }

    // User repos
    if (Array.isArray(userRepos)) {
      const filtered = userRepos.filter(r => r.name.toLowerCase() !== 'microbitradiov3').slice(0, 6);
      const ur = document.getElementById('userRepos');
      if (ur && filtered.length) {
        ur.innerHTML = filtered.map(r =>
          `<a href="${r.html_url}" target="_blank" class="card sa" style="text-decoration:none;color:inherit">
            <div class="icon b"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
            <h3>${esc(r.name)}</h3>
            <p class="desc">${esc(r.description || 'Nessuna descrizione')}</p>
            <div style="margin-top:.3rem">${r.language ? `<span class="repo-tag">${esc(r.language)}</span>` : ''}</div>
          </a>`
        ).join('');
        observeAnimations();
      }
    }
  } catch (err) { console.warn('GitHub API:', err); }
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  if (target === 0) { el.textContent = '0'; return; }
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 25));
  const iv = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(iv); }
    el.textContent = cur;
  }, 35);
}

fetchGithubData();
