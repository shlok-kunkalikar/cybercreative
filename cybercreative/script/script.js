/* =============================================
   CYBER CREATIVE — Premium script.js v2
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── PAGE TRANSITION ─────────────────────── */
  const pt = document.getElementById('page-transition');
  // Fade in
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.25s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
  // Intercept internal links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      if (pt) { pt.classList.add('out'); }
      else { document.body.style.opacity = '0'; }
      setTimeout(() => { window.location.href = href; }, 150);
    });
  });

  /* ─── SCROLL PROGRESS ─────────────────────── */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      progressBar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ─── PRELOADER ───────────────────────────── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const page   = window.location.pathname.split('/').pop() || 'index.html';
    const isHome = page === 'index.html' || page === '';
    if (isHome) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.classList.add('hidden');
          document.body.style.overflow = '';
          triggerCounters();
        }, 400);
      });
      // Failsafe: never block longer than 2.5s even if a resource hangs
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        triggerCounters();
      }, 2500);
    } else {
      preloader.classList.add('hidden');
      triggerCounters();
    }
  }

  /* ─── CUSTOM CURSOR ───────────────────────── */
  const dot     = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (dot && outline) {
    let mx = 0, my = 0, ox = 0, oy = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    }, { passive: true });
    (function tick() {
      ox += (mx - ox) * 0.1; oy += (my - oy) * 0.1;
      outline.style.left = ox + 'px'; outline.style.top = oy + 'px';
      requestAnimationFrame(tick);
    })();

    const hoverEls = document.querySelectorAll(
      'a, button, .sp-card, .collage-cell, .career-row, .arc-slice, .whyus-card, .arc-sub-card, input, textarea, select, .pf-btn'
    );
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    document.querySelectorAll('.case-study, .collage-cell').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-view'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-view'));
    });
  }

  /* ─── NAVBAR ──────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      const btt = document.getElementById('backToTop');
      if (btt) btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
  }

  /* Active nav link */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });

  /* ─── HAMBURGER ───────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const overlay   = document.getElementById('mobileOverlay');
  const closeMenu = () => {
    hamburger && hamburger.classList.remove('open');
    navLinks  && navLinks.classList.remove('open');
    overlay   && overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks && navLinks.classList.toggle('open', open);
      overlay  && overlay.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  overlay && overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));

  /* ─── BACK TO TOP ─────────────────────────── */
  const btt = document.getElementById('backToTop');
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─── SCROLL REVEAL ───────────────────────── */
  const revealSel = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .clip-reveal, .shimmer-line, .stagger-list';
  const revealEls = document.querySelectorAll(revealSel);
  if (revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* Why-us step cards */
  const stepCards = document.querySelectorAll('.whyus-step-card');
  if (stepCards.length) {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); sio.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    stepCards.forEach(c => sio.observe(c));
  }

  /* ─── ANIMATED COUNTERS ───────────────────── */
  function triggerCounters() {
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
      if (el.dataset.animated) return;
      el.dataset.animated = '1';
      const target = parseInt(el.dataset.count, 10);
      let cur = 0; const step = target / 60;
      (function tick() {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur);
        if (cur < target) requestAnimationFrame(tick);
        else el.textContent = target;
      })();
    });
  }

  const cio = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerCounters(); cio.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const firstCounter = document.querySelector('.stat-num[data-count]');
  if (firstCounter) cio.observe(firstCounter);

  /* ─── HERO SCROLL ZOOM ────────────────────── */
  const heroTitle = document.getElementById('heroZoomTitle');
  if (heroTitle) {
    window.addEventListener('scroll', () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      heroTitle.style.transform = `scale(${1 + progress * 0.3})`;
      heroTitle.style.opacity   = Math.max(1 - progress * 2, 0);
    }, { passive: true });
  }

  /* ─── ORB MOUSE PARALLAX ──────────────────── */
  const heroOrb = document.querySelector('.hero-bg-orb');
  if (heroOrb) {
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 28;
      const y = (e.clientY / window.innerHeight - 0.5) * 28;
      heroOrb.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }, { passive: true });
  }

  /* ─── MAGNETIC BUTTONS ────────────────────── */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2))  * 0.28;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ─── PROCESS STEP ACTIVATE ───────────────── */
  document.querySelectorAll('.process-step').forEach(s => {
    const pio = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) s.classList.add('active');
    }, { threshold: 0.5 });
    pio.observe(s);
  });

  /* ─── TICKER PAUSE ON HOVER ───────────────── */
  const ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

  /* ─────────────────────────────────────────────────────
     CIRCULAR ARC MENU — Services page
  ───────────────────────────────────────────────────── */
  const arcSlices = document.querySelectorAll('.arc-slice');
  const arcPanels = document.querySelectorAll('.arc-panel');
  const arcCenter = document.getElementById('arcCenter');
  const arcCenterIcon = document.getElementById('arcCenterIcon');
  const arcCenterNum  = document.getElementById('arcCenterNum');

  const arcIcons = {
    web:      { icon: 'fa-laptop-code', num: '01/05' },
    app:      { icon: 'fa-mobile-screen', num: '02/05' },
    tech:     { icon: 'fa-headset', num: '03/05' },
    hardware: { icon: 'fa-microchip', num: '04/05' },
    software: { icon: 'fa-layer-group', num: '05/05' },
  };

  function activateArcPanel(panelId) {
    // Update slices
    arcSlices.forEach(s => s.classList.toggle('active', s.dataset.panel === panelId));

    // Animate out old panel, animate in new
    arcPanels.forEach(p => {
      if (p.id === 'panel-' + panelId) {
        p.classList.remove('active');
        p.classList.add('entering');
        p.style.display = 'block';
        // After animation, switch to active
        setTimeout(() => {
          p.classList.remove('entering');
          p.classList.add('active');
        }, 550);
      } else {
        p.classList.remove('active', 'entering');
        p.style.display = 'none';
      }
    });

    // Update center
    const info = arcIcons[panelId];
    if (arcCenterIcon && info) {
      arcCenterIcon.innerHTML = `<i class="fa-solid ${info.icon}"></i>`;
      arcCenterIcon.style.transform = 'scale(0.7) rotate(-10deg)';
      arcCenterIcon.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => { arcCenterIcon.style.transform = 'scale(1) rotate(0deg)'; }, 50);
    }
    if (arcCenterNum && info) arcCenterNum.textContent = info.num;
  }

  arcSlices.forEach(slice => {
    slice.addEventListener('click', () => activateArcPanel(slice.dataset.panel));
    // Keyboard support
    slice.setAttribute('tabindex', '0');
    slice.setAttribute('role', 'button');
    slice.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') activateArcPanel(slice.dataset.panel);
    });
  });

  // Mobile: swipe between panels on arc-panel-wrap
  const arcWrap = document.querySelector('.arc-panel-wrap');
  if (arcWrap) {
    let touchX = 0;
    const panelIds = ['web','app','tech','hardware','software'];
    arcWrap.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    arcWrap.addEventListener('touchend', e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) < 50) return;
      const current = [...arcSlices].findIndex(s => s.classList.contains('active'));
      const next = diff > 0
        ? Math.min(current + 1, panelIds.length - 1)
        : Math.max(current - 1, 0);
      activateArcPanel(panelIds[next]);
    });
  }

  /* ─────────────────────────────────────────────────────
     PORTFOLIO CATEGORY FILTER
  ───────────────────────────────────────────────────── */
  const pfBtns  = document.querySelectorAll('.pf-btn');
  const cases   = document.querySelectorAll('#portfolioCases .case-study');

  if (pfBtns.length && cases.length) {
    pfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pfBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        cases.forEach((c, i) => {
          const cat = c.dataset.cat || 'web';
          const show = filter === 'all' || cat === filter;
          if (show) {
            c.classList.remove('filtered-out');
            c.style.transitionDelay = (i * 0.06) + 's';
          } else {
            c.classList.add('filtered-out');
            c.style.transitionDelay = '0s';
          }
        });
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     SCROLLING BG TEXT on services (rAF parallax)
  ───────────────────────────────────────────────────── */
  const bgTextEl = document.querySelector('.services-bg-text-scroll span');
  if (bgTextEl) {
    window.addEventListener('scroll', () => {
      bgTextEl.style.transform = `translateY(-50%) translateX(${-window.scrollY * 0.15}px)`;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────
     SMOOTH ANCHOR SCROLL
  ───────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ─────────────────────────────────────────────────────
     COLLAGE CELL — tilt on mouse move
  ───────────────────────────────────────────────────── */
  document.querySelectorAll('.collage-cell').forEach(cell => {
    cell.addEventListener('mousemove', e => {
      const r  = cell.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      cell.style.transform = `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.01)`;
    });
    cell.addEventListener('mouseleave', () => { cell.style.transform = ''; });
  });

  /* ─────────────────────────────────────────────────────
     CASE STUDY — tilt on mouse move (subtle)
  ───────────────────────────────────────────────────── */
  document.querySelectorAll('.case-img-wrap').forEach(wrap => {
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      const img = wrap.querySelector('.case-img');
      if (img) img.style.transform = `scale(1.03) translate(${x * -8}px, ${y * -8}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      const img = wrap.querySelector('.case-img');
      if (img) img.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────────────────
     SECTION TITLE — letter split hover glow
  ───────────────────────────────────────────────────── */
  // Apply gold-glow to .yellow-text elements on page-banner-title
  document.querySelectorAll('.page-banner-title .yellow-text').forEach(el => {
    el.classList.add('gold-glow');
  });
  document.querySelectorAll('.hero-title-line:nth-child(2), .hero-title .yellow-text').forEach(el => {
    el.classList.add('gold-glow');
  });

});
