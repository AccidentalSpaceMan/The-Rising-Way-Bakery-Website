(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  // ── Nav: solid on scroll, progress bar ──
  const nav = $('nav');
  const bar = $('.progress');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav ──
  const toggle = $('.nav-toggle');
  const closeNav = () => {
    nav.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      document.body.classList.toggle('no-scroll', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  $$('#nav-links a').forEach((a) => a.addEventListener('click', closeNav));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

  // ── Scroll reveal ──
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach((el) => reveal.observe(el));

  // ── Scroll spy ──
  const spyLinks = $$('#nav-links a[href^="#"]');
  if (spyLinks.length) {
    const byId = new Map(spyLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = byId.get(entry.target.id);
        if (link && entry.isIntersecting) {
          spyLinks.forEach((a) => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const section = document.getElementById(id); if (section) spy.observe(section); });
  }

  // ── Animated counters ──
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion || target === 0) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const duration = 1500;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counters = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { countUp(entry.target); counters.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => counters.observe(el));

  // ── Menu tabs ──
  const tabs = $$('.tab');
  const panels = $$('.menu-panel');
  const selectTab = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });
  if (tabs.length) selectTab(tabs[0]);

  // ── Order status (driven by order-status.js) ──
  const isOpen = window.ORDERS_OPEN === true;
  $$('[data-order-status]').forEach((el) => {
    el.classList.add(isOpen ? 'open' : 'closed');
    el.textContent = isOpen ? 'Now taking orders' : 'Orders closed this week';
  });
  $$('[data-order-button]').forEach((el) => { el.textContent = isOpen ? 'Place an Order' : 'View Order Page'; });

  // ── Hero: pointer glow + emblem tilt ──
  const hero = $('.hero');
  const emblem = $('.emblem');
  if (hero && emblem && finePointer && !reduceMotion) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--mx', `${x * 100}%`);
      hero.style.setProperty('--my', `${y * 100}%`);
      emblem.style.setProperty('--ry', `${(x - 0.5) * 12}deg`);
      emblem.style.setProperty('--rx', `${-(y - 0.5) * 12}deg`);
    });
    hero.addEventListener('pointerleave', () => {
      emblem.style.setProperty('--ry', '0deg');
      emblem.style.setProperty('--rx', '0deg');
    });
  }

  // ── Hero: drifting embers ──
  const canvas = $('#embers');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, particles = [], frameId = 0;

    const spawn = (anywhere) => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 10,
      r: Math.random() * 1.7 + 0.4,
      vy: -(Math.random() * 0.35 + 0.08),
      vx: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.6 + 0.2,
      t: Math.random() * Math.PI * 2,
      s: Math.random() * 0.02 + 0.005,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(80, (width * height) / 18000));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const frame = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.shadowColor = 'rgba(223, 176, 96, 0.8)';
      ctx.shadowBlur = 8;
      for (const p of particles) {
        p.t += p.s;
        p.x += p.vx + Math.sin(p.t) * 0.15;
        p.y += p.vy;
        if (p.y < -10) Object.assign(p, spawn(false));
        ctx.fillStyle = `rgba(223, 176, 96, ${p.a * (0.6 + 0.4 * Math.sin(p.t * 3))})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frameId = requestAnimationFrame(frame);
    };

    resize();
    addEventListener('resize', resize);
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { if (!frameId) frameId = requestAnimationFrame(frame); }
      else { cancelAnimationFrame(frameId); frameId = 0; }
    }).observe(canvas);
  }
})();
