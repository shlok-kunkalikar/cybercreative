    // ── Service panel iframe loader ──────────────────────────────────────────
    const panelFiles = {
      web: 'services/service-web.html',
      app: 'services/service-app.html',
      tech: 'services/service-tech.html',
      hardware: 'services/service-hardware.html',
      software: 'services/service-software.html'
    };

    const centerIcons = {
      web: 'fa-laptop-code',
      app: 'fa-mobile-screen-button',
      tech: 'fa-headset',
      hardware: 'fa-microchip',
      software: 'fa-layer-group'
    };

    const centerNums = {
      web: '01/05', app: '02/05', tech: '03/05', hardware: '04/05', software: '05/05'
    };

    const frame = document.getElementById('servicePanelFrame');
    const slices = document.querySelectorAll('.arc-slice');
    const tabs = document.querySelectorAll('.service-tab');
    const iconEl = document.getElementById('arcCenterIcon');
    const numEl = document.getElementById('arcCenterNum');

    function loadPanel(key) {
      // Animate out
      frame.classList.remove('visible');

      setTimeout(() => {
        frame.src = panelFiles[key];
        frame.onload = () => frame.classList.add('visible');
      }, 200);

      // Update center
      iconEl.innerHTML = `<i class="fa-solid ${centerIcons[key]}"></i>`;
      numEl.textContent = centerNums[key];

      // Update active slice
      slices.forEach(s => s.classList.toggle('active', s.dataset.panel === key));

      // Update active tab (mobile)
      tabs.forEach(t => t.classList.toggle('active', t.dataset.panel === key));

      // Scroll the panel into view on mobile when switching tabs
      if (window.innerWidth <= 860) {
        frame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    // Attach clicks to SVG slices
    slices.forEach(slice => {
      slice.style.cursor = 'pointer';
      slice.addEventListener('click', () => loadPanel(slice.dataset.panel));
    });

    // Attach clicks to mobile tab pills
    tabs.forEach(tab => {
      tab.addEventListener('click', () => loadPanel(tab.dataset.panel));
    });

    // Show first panel on load
    window.addEventListener('load', () => {
      frame.classList.add('visible');
    });

    // Also hook into your existing arc nav if script.js drives the wheel
    // The MutationObserver below watches for active class changes from script.js
    const observer = new MutationObserver(() => {
      const active = document.querySelector('.arc-slice.active');
      if (active) loadPanel(active.dataset.panel);
    });
    slices.forEach(s => observer.observe(s, { attributes: true, attributeFilter: ['class'] }));
  
