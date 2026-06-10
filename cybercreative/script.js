/* =============================================
   CYBER CREATIVE — script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. PRELOADER — only on index.html
  ───────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isIndex = currentPage === 'index.html' || currentPage === '';

    if (isIndex) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.classList.add('hidden');
          document.body.style.overflow = 'auto';
          animateCounters();
          initHeroLetters();
        }, 2000);
      });
    } else {
      /* On inner pages: hide preloader instantly, run hero/counter init */
      preloader.classList.add('hidden');
      document.body.style.overflow = 'auto';
      animateCounters();
      initHeroLetters();
    }
  }

  /* ─────────────────────────────────────────
     2. CUSTOM CURSOR
  ───────────────────────────────────────── */
  const dot     = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  (function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.left = outlineX + 'px';
    outline.style.top  = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  })();

  const hoverTargets = document.querySelectorAll(
    'a, button, .dvd-item, .pfilt, .service-card, .whyus-card, .career-card, .portfolio-item, input, textarea, select'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ─────────────────────────────────────────
     3. NAVBAR — scroll & active link
  ───────────────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const hrefPage = href ? href.split('#')[0] : '';
    if (hrefPage === currentPage || (currentPage === '' && hrefPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    const btt = document.getElementById('backToTop');
    if (btt) {
      if (window.scrollY > 500) btt.classList.add('visible');
      else btt.classList.remove('visible');
    }
  });

  /* ─────────────────────────────────────────
     4. MOBILE HAMBURGER MENU
  ───────────────────────────────────────── */
  const hamburger     = document.getElementById('hamburger');
  const navLinksEl    = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    mobileOverlay.classList.remove('active');
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    mobileOverlay.classList.toggle('active');
  });

  mobileOverlay.addEventListener('click', closeMenu);
  navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ─────────────────────────────────────────
     5. SMOOTH SCROLL for same-page hash links
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─────────────────────────────────────────
     6. BACK TO TOP
  ───────────────────────────────────────── */
  const bttBtn = document.getElementById('backToTop');
  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────
     7. HERO STAT COUNTERS
  ───────────────────────────────────────── */
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target   = +el.dataset.count;
      const duration = 1800;
      const step     = target / (duration / 16);
      let current    = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 16);
    });
  }

  /* ─────────────────────────────────────────
     8. HERO HEADING — Letter-by-letter reveal
  ───────────────────────────────────────── */
  function initHeroLetters() {
    const lines = [
      document.getElementById('heroLine1'),
      document.getElementById('heroLine2'),
      document.getElementById('heroLine3')
    ];

    let globalDelay = 0;

    lines.forEach((line) => {
      if (!line) return;
      const text = line.textContent;
      line.textContent = '';

      [...text].forEach((char) => {
        const span = document.createElement('span');
        span.className = 'hero-letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.transitionDelay = globalDelay + 'ms';
        line.appendChild(span);
        globalDelay += 60;
      });

      globalDelay += 120;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelectorAll('.hero-letter').forEach(s => s.classList.add('visible'));
      });
    });
  }

  /* ─────────────────────────────────────────
     9. SCROLL REVEAL (IntersectionObserver)
  ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-card');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObs.observe(el));

  /* ─────────────────────────────────────────
     10. WHY US — Step-fall animation
  ───────────────────────────────────────── */
  const whyusSection = document.getElementById('why-us');
  let whyusFallen = false;

  const whyusObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !whyusFallen) {
        whyusFallen = true;
        document.querySelectorAll('.whyus-step-card').forEach((card) => {
          card.classList.add('step-fallen');
        });
        whyusObs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (whyusSection) whyusObs.observe(whyusSection);

  /* ─────────────────────────────────────────
     11. DVD HALF-DISK SERVICES
  ───────────────────────────────────────── */
  const dvdItems  = document.querySelectorAll('.dvd-item');
  const panels    = document.querySelectorAll('.services-panel');
  const dvdUp     = document.getElementById('dvdUp');
  const dvdDown   = document.getElementById('dvdDown');
  let currentDvdIndex = 0;
  const totalTabs = dvdItems.length;

  function activateDvdTab(index) {
    index = ((index % totalTabs) + totalTabs) % totalTabs;
    currentDvdIndex = index;

    dvdItems.forEach(item => item.classList.remove('active'));
    panels.forEach(p => { p.classList.remove('active'); p.style.animation = ''; });

    const activeItem = dvdItems[index];
    activeItem.classList.add('active');

    const tabId = activeItem.dataset.tab;
    const activePanel = document.getElementById('tab-' + tabId);
    if (activePanel) {
      activePanel.classList.add('active');
      activePanel.style.animation = 'fadeSlideUp 0.45s ease both';

      activePanel.querySelectorAll('.reveal-card').forEach((card, i) => {
        card.classList.remove('revealed');
        setTimeout(() => card.classList.add('revealed'), 60 + i * 80);
      });
    }

    activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  dvdItems.forEach((item, i) => {
    item.addEventListener('click', () => activateDvdTab(i));
  });

  if (dvdUp)   dvdUp.addEventListener('click',   () => activateDvdTab(currentDvdIndex - 1));
  if (dvdDown) dvdDown.addEventListener('click',  () => activateDvdTab(currentDvdIndex + 1));

  document.querySelectorAll('#tab-web .reveal-card').forEach((card, i) => {
    setTimeout(() => card.classList.add('revealed'), 500 + i * 100);
  });

  /* ─────────────────────────────────────────
     12. PORTFOLIO FILTER
  ───────────────────────────────────────── */
  const pfilts    = document.querySelectorAll('.pfilt');
  const portItems = document.querySelectorAll('.portfolio-item');

  pfilts.forEach(btn => {
    btn.addEventListener('click', () => {
      pfilts.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portItems.forEach(item => {
        const cat = item.dataset.cat;
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeSlideUp 0.45s ease both';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ─────────────────────────────────────────
     13. CONTACT FORM
  ───────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#ff4444';
          valid = false;
        }
      });
      if (!valid) { shakeForm(); return; }

      const btn     = contactForm.querySelector('button[type="submit"]');
      const btnText = btn.querySelector('span');
      btnText.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      }, 1400);
    });
  }

  function shakeForm() {
    contactForm.style.animation = 'shake 0.4s ease';
    setTimeout(() => contactForm.style.animation = '', 400);
  }

  /* ─────────────────────────────────────────
     14. PARALLAX — hero visual subtle drift
  ───────────────────────────────────────── */
  const heroImg = document.querySelector('.hero-img-frame');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      heroImg.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    });
  }

  /* ─────────────────────────────────────────
     15. TILT EFFECT on cards
  ───────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('.service-card, .whyus-card, .career-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) *  6;
      card.style.transform  = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s ease, border-color 0.4s, box-shadow 0.4s';
    });
  });

  /* ─────────────────────────────────────────
     16. PORTFOLIO ITEM — magnetic effect
  ───────────────────────────────────────── */
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.04;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.04;
      item.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
    });
    item.addEventListener('mouseleave', () => { item.style.transform = ''; });
  });

  /* ─────────────────────────────────────────
     17. FLOATING BADGES — parallax on scroll
  ───────────────────────────────────────── */
  const badges = document.querySelectorAll('.floating-badge');
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 480) return; // badges hidden on very small screens
    if (window.innerWidth <= 768) return; // badges are static on mobile
    const sy = window.scrollY;
    badges.forEach((b, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      b.style.transform = `translateY(${sy * 0.06 * dir}px)`;
    });
  });

  /* ─────────────────────────────────────────
     18. TICKER — pause on hover
  ───────────────────────────────────────── */
  const ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

  /* ─────────────────────────────────────────
     19. FORM INPUT — floating label feel
  ───────────────────────────────────────── */
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
    field.addEventListener('focus', () => field.parentElement.classList.add('focused'));
    field.addEventListener('blur', () => {
      field.parentElement.classList.remove('focused');
      if (field.value.trim()) field.parentElement.classList.add('filled');
      else field.parentElement.classList.remove('filled');
    });
  });

  /* ─────────────────────────────────────────
     20. SECTION HEADING — letter split reveal
  ───────────────────────────────────────── */
  function splitReveal(selector) {
    // On mobile, skip the letter-split to prevent section-label overflow
    if (window.innerWidth <= 768) return;
    document.querySelectorAll(selector).forEach(el => {
      if (el.dataset.split) return;
      el.dataset.split = true;
      const text = el.textContent;
      el.textContent = '';
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = `
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease ${i * 0.025}s, transform 0.5s ease ${i * 0.025}s;
        `;
        el.appendChild(span);
      });

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.querySelectorAll('span').forEach(s => {
              s.style.opacity = '1';
              s.style.transform = 'translateY(0)';
            });
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.3 });
      obs.observe(el);
    });
  }

  splitReveal('.section-label');

  /* ─────────────────────────────────────────
     21. YELLOW GLOW — mouse-track on hero
  ───────────────────────────────────────── */
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      heroSection.style.setProperty('--mx', x + '%');
      heroSection.style.setProperty('--my', y + '%');
    });
  }

  /* ─────────────────────────────────────────
     22. KEYBOARD ACCESSIBILITY
  ───────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ─────────────────────────────────────────
     23. REFRESH CURSOR TARGETS after tab switch
  ───────────────────────────────────────── */
  function refreshCursorTargets() {
    document.querySelectorAll('.service-card, .whyus-card, .career-card, .portfolio-item').forEach(el => {
      el.removeEventListener('mouseenter', cursorEnter);
      el.removeEventListener('mouseleave', cursorLeave);
      el.addEventListener('mouseenter', cursorEnter);
      el.addEventListener('mouseleave', cursorLeave);
    });
  }

  function cursorEnter() { document.body.classList.add('cursor-hover'); }
  function cursorLeave() { document.body.classList.remove('cursor-hover'); }

  dvdItems.forEach(btn => btn.addEventListener('click', () => {
    setTimeout(refreshCursorTargets, 100);
  }));

  /* ─────────────────────────────────────────
     24. ABOUT SECTION reveal
  ───────────────────────────────────────── */
  const aboutWrap = document.querySelector('.about-content-wrap');
  if (aboutWrap) {
    const isMobile = () => window.innerWidth <= 768;
    const aboutObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (isMobile()) {
            /* On mobile: just show text, keep image in place */
            aboutWrap.querySelectorAll('.about-desc').forEach(el => {
              el.style.opacity = '1';
              el.style.transform = 'none';
            });
            const badge = aboutWrap.querySelector('.about-badge');
            if (badge) { badge.style.opacity = '1'; badge.style.transform = 'none'; }
          } else {
            aboutWrap.classList.add('reveal');
          }
          aboutObs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    aboutObs.observe(aboutWrap);
  }

  console.log('%c✦ CYBER CREATIVE — Loaded ', 'background:#ffd017;color:#000;font-weight:bold;padding:4px 10px;border-radius:4px;');
});

/* ─────────────────────────────────────────
   GLOBAL — keyframes injected via JS
───────────────────────────────────────── */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();
