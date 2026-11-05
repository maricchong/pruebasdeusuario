/* ============================================================
   NAV.JS — Sicofancia algorítmica: qué es y cómo afecta
   a las pruebas de usuario
   1. Ilustración Generativa del Hero (Canvas Dinámico Deformado)
   2. Menú de Navegación Vertical (100vh) y Progreso de Avance
   3. Ilustración Interactiva de Mecanismos (Sección 4.2)
   4. Índice Interno Interactivo de Manifestaciones (Sección 5)
   5. Visualizaciones Nativas Interactivas (Sharma Fig 1, Fig 2, ShopCART)
   6. Ilustración Procedural de Conclusión (Sección 7)
   7. Red Conectada: Popovers de Citas y Cajón de Referencias
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ------------------------------------------------------------
  // 1. ILUSTRACIÓN GENERATIVA DEL HERO: GRILLA DINÁMICA DEFORMADA
  // Única cuadrícula en el Hero, con tensión y respuesta elástica al cursor
  // ------------------------------------------------------------
  var heroCanvas = document.getElementById('heroCanvas');
  var heroSection = document.getElementById('inicio');

  if (heroCanvas && heroSection) {
    var ctx = heroCanvas.getContext('2d');
    var animFrameId = null;
    var isHeroVisible = true;
    var width = 0;
    var height = 0;
    var dpr = window.devicePixelRatio || 1;

    var mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      isHovered: false
    };

    function resizeHeroCanvas() {
      var rect = heroSection.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      heroCanvas.width = width * dpr;
      heroCanvas.height = height * dpr;
      heroCanvas.style.width = width + 'px';
      heroCanvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }

    resizeHeroCanvas();
    window.addEventListener('resize', resizeHeroCanvas);

    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    });

    heroSection.addEventListener('mouseleave', function () {
      mouse.isHovered = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    });

    if ('IntersectionObserver' in window) {
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isHeroVisible = entry.isIntersecting;
          if (isHeroVisible && !animFrameId) {
            lastTime = performance.now();
            animFrameId = requestAnimationFrame(renderHeroGrid);
          }
        });
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    }

    var gridSize = 55;
    // Paleta cromática enriquecida (Cobalto #4D6BFE, Lila #DA9DED, Lima Ácido #DDE53A, Coral #F48B68, Pizarra #3E517A)
    var palette = [
      '#4D6BFE', // Azul cobalto / periwinkle vibrante
      '#DA9DED', // Orquídea / lila suave
      '#DDE53A', // Lima ácido luminoso
      '#F48B68', // Coral melocotón cálido
      '#3E517A', // Azul pizarra técnico
      '#686E7A'  // Pizarra medio
    ];

    var startTime = performance.now();
    var lastTime = startTime;

    function renderHeroGrid(now) {
      if (!isHeroVisible) {
        animFrameId = null;
        return;
      }

      lastTime = now;
      var t = (now - startTime) * 0.001;

      if (mouse.isHovered) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }

      ctx.clearRect(0, 0, width, height);

      var cols = Math.ceil(width / gridSize) + 2;
      var rows = Math.ceil(height / gridSize) + 2;
      var points = [];

      for (var r = 0; r < rows; r++) {
        points[r] = [];
        for (var c = 0; c < cols; c++) {
          var baseX = (c - 0.5) * gridSize;
          var baseY = (r - 0.5) * gridSize;

          var waveX = Math.sin(baseY * 0.008 + t * 0.9) * 16 +
                      Math.cos(baseX * 0.012 + t * 0.6) * 10;
          var waveY = Math.cos(baseX * 0.009 + t * 0.8) * 16 +
                      Math.sin(baseY * 0.011 + t * 0.7) * 10;

          if (mouse.isHovered) {
            var dx = baseX - mouse.x;
            var dy = baseY - mouse.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var maxDist = 220;
            if (dist < maxDist && dist > 1) {
              var force = (1 - dist / maxDist) * 32;
              waveX += (dx / dist) * force;
              waveY += (dy / dist) * force;
            }
          }

          points[r][c] = {
            baseX: baseX,
            baseY: baseY,
            x: baseX + waveX,
            y: baseY + waveY,
            defX: waveX,
            defY: waveY
          };
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(195, 200, 209, 0.45)';

      for (var r = 0; r < rows; r++) {
        ctx.beginPath();
        for (var c = 0; c < cols; c++) {
          var p = points[r][c];
          if (c === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            var prev = points[r][c - 1];
            ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + p.x) / 2, (prev.y + p.y) / 2);
          }
        }
        ctx.stroke();
      }

      for (var c = 0; c < cols; c++) {
        ctx.beginPath();
        for (var r = 0; r < rows; r++) {
          var p = points[r][c];
          if (r === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            var prev = points[r - 1][c];
            ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + p.x) / 2, (prev.y + p.y) / 2);
          }
        }
        ctx.stroke();
      }

      for (var r = 0; r < rows; r += 2) {
        for (var c = 0; c < cols; c += 2) {
          var pt = points[r][c];
          var seed = (r * 13 + c * 37) % 100;

          if (seed > 35) {
            var color = palette[seed % palette.length];

            ctx.strokeStyle = color;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.x - pt.defX * 0.45, pt.y - pt.defY * 0.45);
            ctx.stroke();

            if (seed % 3 === 0) {
              ctx.save();
              ctx.translate(pt.x, pt.y);
              ctx.rotate(pt.defX * 0.05 + t * 0.5);
              ctx.fillStyle = color;
              ctx.fillRect(-3, -3, 6, 6);
              ctx.restore();
            } else if (seed % 3 === 1) {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.strokeStyle = color;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      animFrameId = requestAnimationFrame(renderHeroGrid);
    }

    animFrameId = requestAnimationFrame(renderHeroGrid);
  }

  // ------------------------------------------------------------
  // 2. MENÚ DE NAVEGACIÓN VERTICAL (100vh) Y PROGRESO DE LECTURA
  // (media_1793854410293_e947b7bb.png)
  // ------------------------------------------------------------
  var timelineNodes = document.querySelectorAll('.timeline-node-item');
  var progressBar = document.querySelector('.timeline-progress-bar');
  var percentText = document.querySelector('.scroll-percentage');
  var mobileBtn = document.querySelector('.mobile-toggle-btn');
  var timelineNav = document.querySelector('.timeline-nav');
  var trackedSections = document.querySelectorAll('.hero-fullscreen, .stream-topic, .references-drawer-section');

  function updateTimelineProgress() {
    var winScroll = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = docHeight > 0 ? (winScroll / docHeight) * 100 : 0;
    var clamped = Math.min(Math.max(scrolled, 0), 100);

    if (progressBar) progressBar.style.height = clamped + '%';
    if (percentText) percentText.textContent = Math.round(clamped) + '%';

    var probe = winScroll + window.innerHeight * 0.35;
    var currentId = '';

    if (winScroll + window.innerHeight >= document.documentElement.scrollHeight - 50) {
      currentId = 'seccion-08';
    } else {
      trackedSections.forEach(function (sec) {
        var top = sec.offsetTop;
        var h = sec.offsetHeight;
        if (probe >= top && probe < top + h) {
          currentId = sec.getAttribute('id');
        }
      });
    }

    if (currentId) {
      timelineNodes.forEach(function (node) {
        var link = node.querySelector('.timeline-node-link');
        if (link && link.getAttribute('href') === '#' + currentId) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateTimelineProgress, { passive: true });
  updateTimelineProgress();

  // ------------------------------------------------------------
  // 2.1 CAMBIO GLOBAL DE COLOR: MODO CLARO / OSCURO AL SCROLLEAR
  // Se activa de forma global y coordinada ÚNICAMENTE en «Nuestra prueba de diseño» (#seccion-06)
  // Regresa suavemente al modo claro al continuar hacia abajo o desplazarse hacia arriba.
  // ------------------------------------------------------------
  var section06 = document.getElementById('seccion-06');

  function updateGlobalColorMode() {
    if (!section06) return;
    var rect = section06.getBoundingClientRect();
    // Umbral de transición: activo cuando la sección ocupa el tercio central de la lectura
    var inSection06 = (rect.top <= window.innerHeight * 0.45) && (rect.bottom >= window.innerHeight * 0.35);

    if (inSection06) {
      if (!document.body.classList.contains('theme-dark')) {
        document.body.classList.add('theme-dark');
      }
    } else {
      if (document.body.classList.contains('theme-dark')) {
        document.body.classList.remove('theme-dark');
      }
    }
  }

  window.addEventListener('scroll', updateGlobalColorMode, { passive: true });
  window.addEventListener('resize', updateGlobalColorMode, { passive: true });
  updateGlobalColorMode();

  // Scroll suave en enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1) {
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          var offset = targetEl.getBoundingClientRect().top + window.scrollY - 30;
          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });

          if (timelineNav && timelineNav.classList.contains('mobile-visible')) {
            timelineNav.classList.remove('mobile-visible');
            if (mobileBtn) mobileBtn.textContent = 'Menú';
          }
        }
      }
    });
  });

  if (mobileBtn && timelineNav) {
    mobileBtn.addEventListener('click', function () {
      var isOpen = timelineNav.classList.toggle('mobile-visible');
      mobileBtn.textContent = isOpen ? 'Cerrar' : 'Menú';
    });
  }

  // ------------------------------------------------------------
  // 3. SECCIÓN 4.2: ILUSTRACIÓN INTERACTIVA DE MECANISMOS
  // Modos: neutral | m1 (Humanización RLHF) | m2 (Completar Tareas)
  // ------------------------------------------------------------
  var mechCanvas = document.getElementById('mechCanvas');
  var mechMode = 'neutral';
  var mechToggles = document.querySelectorAll('.mech-toggle-btn');
  var mechAccordions = document.querySelectorAll('.mech-accordion-item');

  function setMechanismState(mode) {
    mechMode = mode;
    mechToggles.forEach(function (btn) {
      if (btn.getAttribute('data-mech') === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Abrir el acordeón correspondiente y cerrar los otros
    mechAccordions.forEach(function (acc) {
      var accId = acc.getAttribute('id');
      if ((mode === 'm1' && accId === 'mech-acc-1') || (mode === 'm2' && accId === 'mech-acc-2')) {
        acc.classList.add('open');
      } else {
        acc.classList.remove('open');
      }
    });
  }

  mechToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetMode = this.getAttribute('data-mech');
      setMechanismState(targetMode);
    });
  });

  // Toggles de acordeón manuales
  document.querySelectorAll('.mech-accordion-header').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = this.closest('.mech-accordion-item');
      var wasOpen = item.classList.contains('open');
      item.classList.toggle('open', !wasOpen);

      var itemId = item.getAttribute('id');
      if (!wasOpen) {
        if (itemId === 'mech-acc-1') mechMode = 'm1';
        if (itemId === 'mech-acc-2') mechMode = 'm2';
        mechToggles.forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-mech') === (itemId === 'mech-acc-1' ? 'm1' : 'm2'));
        });
      }
    });
  });

  if (mechCanvas) {
    var mCtx = mechCanvas.getContext('2d');
    var mW = 0;
    var mH = 0;

    function resizeMechCanvas() {
      var rect = mechCanvas.getBoundingClientRect();
      mW = rect.width;
      mH = rect.height;
      mechCanvas.width = mW * dpr;
      mechCanvas.height = mH * dpr;
      mCtx.scale(dpr, dpr);
    }
    resizeMechCanvas();
    window.addEventListener('resize', resizeMechCanvas);

    var mStart = performance.now();

    function renderMech(now) {
      var t = (now - mStart) * 0.001;
      mCtx.clearRect(0, 0, mW, mH);

      // Dibujar grilla base tenue
      var step = 40;
      mCtx.strokeStyle = 'rgba(195, 200, 209, 0.35)';
      mCtx.lineWidth = 1;
      for (var x = 0; x < mW; x += step) {
        mCtx.beginPath();
        mCtx.moveTo(x, 0);
        mCtx.lineTo(x, mH);
        mCtx.stroke();
      }
      for (var y = 0; y < mH; y += step) {
        mCtx.beginPath();
        mCtx.moveTo(0, y);
        mCtx.lineTo(mW, y);
        mCtx.stroke();
      }

      var cx = mW / 2;
      var cy = mH / 2;

      if (mechMode === 'neutral') {
        // Estado neutral: dos polos en equilibrio con onda sinusoidal central
        mCtx.strokeStyle = '#4D6BFE';
        mCtx.lineWidth = 2;
        mCtx.beginPath();
        for (var x = 80; x < mW - 80; x += 4) {
          var y = cy + Math.sin((x - 80) * 0.04 + t * 2) * 18;
          if (x === 80) mCtx.moveTo(x, y);
          else mCtx.lineTo(x, y);
        }
        mCtx.stroke();

        // Polo 1: Humano / Expectativa
        mCtx.fillStyle = '#3E517A';
        mCtx.beginPath();
        mCtx.arc(80, cy, 8, 0, Math.PI * 2);
        mCtx.fill();
        mCtx.font = '10px Space Mono, monospace';
        mCtx.fillText('USUARIO', 55, cy - 16);

        // Polo 2: Tarea / Modelo
        mCtx.fillStyle = '#4D6BFE';
        mCtx.beginPath();
        mCtx.arc(mW - 80, cy, 8, 0, Math.PI * 2);
        mCtx.fill();
        mCtx.fillText('AGENTE', mW - 105, cy - 16);

        mCtx.fillStyle = '#686E7A';
        mCtx.fillText('[ ESTADO EQUILIBRIO NEUTRAL // SELECCIONÁ UN MECANISMO ARRIBA ]', cx - 180, mH - 20);

      } else if (mechMode === 'm1') {
        // MECANISMO 1: Humanización RLHF — Las ondas del usuario desvían la verdad
        var uX = 100;
        var uY = cy;
        var mX = mW - 100;
        var mY = cy;

        // Ondas de complacencia gravitacional con matices lila y cobalto
        for (var i = 1; i <= 4; i++) {
          var r = (i * 35 + t * 30) % 150;
          var alpha = Math.max(0, 1 - r / 150) * 0.55;
          mCtx.strokeStyle = i % 2 === 0 ? ('rgba(218, 157, 237, ' + alpha + ')') : ('rgba(77, 107, 254, ' + alpha + ')');
          mCtx.lineWidth = 1.5;
          mCtx.beginPath();
          mCtx.arc(uX, uY, r, -Math.PI / 3, Math.PI / 3);
          mCtx.stroke();
        }

        // Línea de trayectoria del modelo deformada hacia el polo usuario
        mCtx.strokeStyle = '#4D6BFE';
        mCtx.lineWidth = 2.5;
        mCtx.beginPath();
        mCtx.moveTo(mX, mY);
        mCtx.bezierCurveTo(cx + 60, cy - 60, cx - 40, cy - 60, uX + 20, uY - 10);
        mCtx.stroke();

        // Nodos
        mCtx.fillStyle = '#3E517A';
        mCtx.beginPath();
        mCtx.arc(uX, uY, 9, 0, Math.PI * 2);
        mCtx.fill();
        mCtx.fillStyle = '#4D6BFE';
        mCtx.fillText('USUARIO // SESGO DE PREFERENCIA', uX - 40, uY + 28);

        mCtx.fillStyle = '#4D6BFE';
        mCtx.beginPath();
        mCtx.arc(mX, mY, 9, 0, Math.PI * 2);
        mCtx.fill();
        mCtx.fillText('MODELO // RLHF COMPLACIENTE', mX - 80, mY + 28);

        mCtx.fillStyle = '#3E517A';
        mCtx.fillText('BUCLE DE RETROALIMENTACIÓN: PREMIA DAR EL GUSTO POR ENCIMA DE LA VERDAD', cx - 220, 30);

      } else if (mechMode === 'm2') {
        // MECANISMO 2: Orientación a completar tareas — Vector recto imparable
        var startX = 80;
        var endX = mW - 80;

        // Barreras de fricción (donde una persona real se detendría) en coral cálido
        var barriers = [startX + (endX - startX) * 0.35, startX + (endX - startX) * 0.65];
        barriers.forEach(function (bx, idx) {
          mCtx.strokeStyle = 'rgba(244, 139, 104, 0.85)';
          mCtx.setLineDash([4, 4]);
          mCtx.lineWidth = 2;
          mCtx.beginPath();
          mCtx.moveTo(bx, cy - 50);
          mCtx.lineTo(bx, cy + 50);
          mCtx.stroke();
          mCtx.setLineDash([]);
          mCtx.fillStyle = '#F48B68';
          mCtx.font = '9px Space Mono, monospace';
          mCtx.fillText('FRICCIÓN #' + (idx + 1), bx - 26, cy - 60);
          mCtx.fillStyle = '#686E7A';
          mCtx.fillText('(Persona abandona)', bx - 38, cy + 68);
        });

        // Vector del agente atravesando ciegamente las barreras
        var agentX = startX + ((t * 120) % (endX - startX + 40));
        mCtx.strokeStyle = '#4D6BFE';
        mCtx.lineWidth = 3;
        mCtx.beginPath();
        mCtx.moveTo(startX, cy);
        mCtx.lineTo(Math.min(agentX, endX), cy);
        mCtx.stroke();

        // Cabeza del agente con acento de lima ácido
        mCtx.fillStyle = '#DDE53A';
        mCtx.beginPath();
        mCtx.arc(Math.min(agentX, endX), cy, 7, 0, Math.PI * 2);
        mCtx.fill();
        mCtx.strokeStyle = '#4D6BFE';
        mCtx.lineWidth = 1.5;
        mCtx.stroke();

        mCtx.fillStyle = '#16181B';
        mCtx.font = '10px Space Mono, monospace';
        mCtx.fillText('INICIO', startX - 45, cy + 4);
        mCtx.fillText('OBJETIVO CUMPLIDO (100%)', endX + 15, cy + 4);

        mCtx.fillStyle = '#3E517A';
        mCtx.fillText('EL AGENTE AVANZA CIEGAMENTE: SUPRIME LA FRICCIÓN Y SUBESTIMA EL ERROR', cx - 210, 30);
      }

      requestAnimationFrame(renderMech);
    }
    requestAnimationFrame(renderMech);
  }

  // ------------------------------------------------------------
  // 4. SECCIÓN 5: ÍNDICE INTERNO INTERACTIVO
  // ------------------------------------------------------------
  var indexCards = document.querySelectorAll('.index-card');
  var manifSections = document.querySelectorAll('[id^="manif-5-"]');

  function updateManifestationsIndex() {
    var scrollPos = window.scrollY + window.innerHeight * 0.4;
    var currentManifId = '';

    manifSections.forEach(function (sec) {
      var top = sec.offsetTop;
      var h = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + h) {
        currentManifId = sec.getAttribute('id');
      }
    });

    if (currentManifId) {
      indexCards.forEach(function (card) {
        if (card.getAttribute('href') === '#' + currentManifId) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateManifestationsIndex, { passive: true });

  // ------------------------------------------------------------
  // 5. VISUALIZACIONES NATIVAS INTERACTIVAS (Sharma et al. & Lu et al.)
  // ------------------------------------------------------------
  // Gráfico 5.1: Feedback sesgado (Sharma Fig 1)
  var sharmaPills = document.querySelectorAll('.sharma-pill-btn');
  var sharmaMarkers = document.querySelectorAll('.sharma-delta-marker');

  var sharmaOffsets = {
    'favor': [
      { left: '50%', width: '38%', dir: 'pos' },
      { left: '50%', width: '45%', dir: 'pos' },
      { left: '50%', width: '42%', dir: 'pos' },
      { left: '50%', width: '30%', dir: 'pos' }
    ],
    'neutral': [
      { left: '49%', width: '2%', dir: 'zero' },
      { left: '49%', width: '2%', dir: 'zero' },
      { left: '49%', width: '2%', dir: 'zero' },
      { left: '49%', width: '2%', dir: 'zero' }
    ],
    'contra': [
      { left: '18%', width: '32%', dir: 'neg' },
      { left: '10%', width: '40%', dir: 'neg' },
      { left: '15%', width: '35%', dir: 'neg' },
      { left: '22%', width: '28%', dir: 'neg' }
    ]
  };

  sharmaPills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sharmaPills.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      var cond = this.getAttribute('data-cond');
      var cfg = sharmaOffsets[cond] || sharmaOffsets.neutral;

      sharmaMarkers.forEach(function (marker, idx) {
        if (cfg[idx]) {
          marker.style.left = cfg[idx].left;
          marker.style.width = cfg[idx].width;
        }
      });
    });
  });

  // Gráfico 5.2: Capitulación (Sharma Fig 2)
  var capPills = document.querySelectorAll('.cap-view-btn');
  var capFills = document.querySelectorAll('.capitulation-fill');
  var capValues = document.querySelectorAll('.cap-val');

  var capData = {
    'apologies': [
      { pct: '98%', text: '98% (Claude 1.3)' },
      { pct: '84%', text: '84% (Claude 2)' },
      { pct: '67%', text: '67% (GPT-4)' },
      { pct: '74%', text: '74% (LLaMA-2)' }
    ],
    'changes': [
      { pct: '89%', text: '89% cambió a errónea' },
      { pct: '71%', text: '71% cambió a errónea' },
      { pct: '48%', text: '48% cambió a errónea' },
      { pct: '62%', text: '62% cambió a errónea' }
    ]
  };

  capPills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      capPills.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      var view = this.getAttribute('data-view');
      var data = capData[view] || capData.apologies;

      capFills.forEach(function (fill, i) {
        if (data[i]) fill.style.width = data[i].pct;
      });
      capValues.forEach(function (val, i) {
        if (data[i]) val.textContent = data[i].text;
      });
    });
  });

  // Gráfico 5.4: ShopCART Lu et al. (2026)
  var shopcartTabs = document.querySelectorAll('.shopcart-tab-btn');
  var valBuy = document.getElementById('shopcart-val-buy');
  var valAbandon = document.getElementById('shopcart-val-abandon');
  var valAccuracy = document.getElementById('shopcart-val-acc');
  var labelAgent = document.getElementById('shopcart-agent-label');

  var shopcartData = {
    'human': {
      label: 'PERSONAS REALES (AMAZON.COM)',
      buy: '3,3%',
      abandon: '26,5%',
      acc: 'LÍNEA BASE (100%)'
    },
    'claude': {
      label: 'CLAUDE 3.5 SONNET',
      buy: '25,2%',
      abandon: '2,7%',
      acc: '11,69%'
    },
    'deepseek': {
      label: 'DEEPSEEK-R1',
      buy: '24,8%',
      abandon: '8,4%',
      acc: '11,86%'
    }
  };

  shopcartTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      shopcartTabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      var agentKey = this.getAttribute('data-agent');
      var d = shopcartData[agentKey];
      if (d) {
        if (labelAgent) labelAgent.textContent = d.label;
        if (valBuy) valBuy.textContent = d.buy;
        if (valAbandon) valAbandon.textContent = d.abandon;
        if (valAccuracy) valAccuracy.textContent = d.acc;
      }
    });
  });

  // ------------------------------------------------------------
  // 6. SECCIÓN 6: EXPLORADOR INTERACTIVO DE PRUEBAS
  // ------------------------------------------------------------
  var tabButtons = document.querySelectorAll('.test-tab-btn');
  var tabPanes = document.querySelectorAll('.test-tab-pane');

  function activateTestTab(tabId) {
    tabButtons.forEach(function (btn) {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabPanes.forEach(function (pane) {
      if (pane.getAttribute('id') === tabId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabId = this.getAttribute('data-tab');
      activateTestTab(tabId);
    });
  });

  document.querySelectorAll('[data-target-tab]').forEach(function (link) {
    link.addEventListener('click', function () {
      var targetTab = this.getAttribute('data-target-tab');
      if (targetTab) activateTestTab(targetTab);
    });
  });

  // ------------------------------------------------------------
  // 7. SECCIÓN 7: ILUSTRACIÓN PROCEDURAL DE CONCLUSIÓN
  // Metáfora: Sim2Real Gap — Convergencia entre la grilla complaciente
  // y los anclajes rígidos de la fricción humana real
  // ------------------------------------------------------------
  var concCanvas = document.getElementById('conclusionCanvas');
  if (concCanvas) {
    var cCtx = concCanvas.getContext('2d');
    var cW = 0;
    var cH = 0;

    function resizeConcCanvas() {
      var rect = concCanvas.getBoundingClientRect();
      cW = rect.width;
      cH = rect.height;
      concCanvas.width = cW * dpr;
      concCanvas.height = cH * dpr;
      cCtx.scale(dpr, dpr);
    }
    resizeConcCanvas();
    window.addEventListener('resize', resizeConcCanvas);

    var cStart = performance.now();

    function renderConclusion(now) {
      var t = (now - cStart) * 0.001;
      cCtx.clearRect(0, 0, cW, cH);

      var midX = cW / 2;
      var step = 45;

      // Lado Izquierdo: Grilla maleable artificial (Sicofancia que se amolda)
      cCtx.strokeStyle = 'rgba(77, 107, 254, 0.45)';
      cCtx.lineWidth = 1;

      for (var y = 20; y < cH - 20; y += step) {
        cCtx.beginPath();
        for (var x = 30; x <= midX; x += 10) {
          var dy = Math.sin(x * 0.02 + y * 0.03 + t) * 12;
          if (x === 30) cCtx.moveTo(x, y + dy);
          else cCtx.lineTo(x, y + dy);
        }
        cCtx.stroke();
      }

      // Nodos adaptativos en lila flotante
      for (var y = 20; y < cH - 20; y += step * 2) {
        var nx = 30 + (midX - 60) * 0.5;
        var ndy = Math.sin(nx * 0.02 + y * 0.03 + t) * 12;
        cCtx.fillStyle = '#DA9DED';
        cCtx.beginPath();
        cCtx.arc(nx, y + ndy, 3, 0, Math.PI * 2);
        cCtx.fill();
      }

      // Lado Derecho: Grilla ortogonal rígida (Fricción humana no negociable)
      cCtx.strokeStyle = 'rgba(62, 81, 122, 0.5)';
      for (var y = 20; y < cH - 20; y += step) {
        cCtx.beginPath();
        cCtx.moveTo(midX, y);
        cCtx.lineTo(cW - 30, y);
        cCtx.stroke();
      }

      for (var x = midX + step; x < cW - 30; x += step) {
        cCtx.beginPath();
        cCtx.moveTo(x, 20);
        cCtx.lineTo(x, cH - 20);
        cCtx.stroke();
      }

      // Línea frontera central (Horizonte Sim2Real)
      cCtx.strokeStyle = '#4D6BFE';
      cCtx.lineWidth = 2;
      cCtx.setLineDash([5, 5]);
      cCtx.beginPath();
      cCtx.moveTo(midX, 10);
      cCtx.lineTo(midX, cH - 10);
      cCtx.stroke();
      cCtx.setLineDash([]);

      // Nodos ancla humanos en la derecha (puntos de fricción, duda y abandono) en coral cálido
      for (var y = 20; y < cH - 20; y += step) {
        cCtx.fillStyle = '#F48B68';
        cCtx.beginPath();
        cCtx.arc(midX + step * 2, y, 4, 0, Math.PI * 2);
        cCtx.fill();
      }

      cCtx.font = '9px Space Mono, monospace';
      cCtx.fillStyle = '#4D6BFE';
      cCtx.fillText('← MODELOS SINTÉTICOS (VALIDACIÓN ADAPTATIVA)', 40, 24);

      cCtx.fillStyle = '#3E517A';
      cCtx.fillText('USUARIOS REALES (FRICCIÓN Y REALIDAD EXTERIOR) →', midX + 30, 24);

      requestAnimationFrame(renderConclusion);
    }
    requestAnimationFrame(renderConclusion);
  }

  // ------------------------------------------------------------
  // 8. RED CONECTADA: CITAS Y REFERENCIAS
  // ------------------------------------------------------------
  var popover = document.getElementById('cite-preview-popover');
  var popoverTitle = document.getElementById('popover-title');
  var popoverAuthors = document.getElementById('popover-authors');
  var popoverDesc = document.getElementById('popover-desc');
  var popoverRefTag = document.getElementById('popover-ref-tag');
  var popoverAction = document.getElementById('popover-action-btn');
  var popoverClose = document.getElementById('popover-close-btn');

  var citationsData = {
    'ref-sharma2023': {
      tag: 'arXiv:2310.13548 // Anthropic & NYU',
      title: 'Towards Understanding Sycophancy in Language Models',
      authors: 'Sharma, Tong, Korbak, Duvenaud, Askell, Bowman, Perez et al. (2023)',
      desc: 'Evidencia experimental sobre sesgo de complacencia: asistentes de IA modifican diagnósticos correctos ante la presión, dan feedback sesgado según la autoría y repiten errores insinuados por el usuario.'
    },
    'ref-lu2026': {
      tag: 'ACL 2026 // Amazon ShopCART',
      title: 'Can LLM Agents Simulate Multi-Turn Human Behavior?',
      authors: 'Yuxuan Lu, Jing Huang, Yan Han, Bingsheng Yao, Sisong Bei, Qi He, Dakuo Wang et al. (2026)',
      desc: '31.865 sesiones reales en Amazon: los modelos compran hasta un 25% frente al 3,3% de las personas y abandonan entre 2,7% y 8,4% frente al 26,5% humano, ocultando la fricción de diseño.'
    },
    'ref-rosala2024': {
      tag: 'Nielsen Norman Group // UX Research',
      title: 'Synthetic Users: If, When, and How to Use AI-Generated “Research”',
      authors: 'Maria Rosala & Kate Moran (2024)',
      desc: 'Estudio comparativo entre usuarios reales y sintéticos: alerta sobre el aplanamiento de prioridades, donde la IA le da importancia a todo impidiendo jerarquizar problemas de usabilidad.'
    },
    'ref-sponheim': {
      tag: 'Nielsen Norman Group // Report',
      title: 'Sycophancy in Generative-AI Chatbots',
      authors: 'Caleb Sponheim',
      desc: 'Análisis de la sicofancia en chatbots generativos y su impacto en la validación acrítica de interfaces digitales.'
    },
    'ref-sim2real': {
      tag: 'alphaXiv // Agent Simulation',
      title: 'Mind the Sim2Real Gap in User Simulation for Agentic Tasks',
      authors: 'alphaXiv Preprint',
      desc: 'Evaluación de la brecha entre la simulación de agentes sintéticos y el comportamiento real humano en tareas con interfaces complejas.'
    }
  };

  var activeTargetRef = null;

  function showPopover(chip, refKey) {
    var data = citationsData[refKey];
    if (!data || !popover) return;

    activeTargetRef = refKey;
    popoverRefTag.textContent = data.tag;
    popoverTitle.textContent = data.title;
    popoverAuthors.textContent = data.authors;
    popoverDesc.textContent = data.desc;

    var rect = chip.getBoundingClientRect();
    var topPos = rect.bottom + 8;
    var leftPos = rect.left;

    if (leftPos + 340 > window.innerWidth) leftPos = window.innerWidth - 350;
    if (leftPos < 10) leftPos = 10;

    popover.style.top = topPos + 'px';
    popover.style.left = leftPos + 'px';
    popover.classList.add('visible');
  }

  function hidePopover() {
    if (popover) popover.classList.remove('visible');
  }

  document.querySelectorAll('.cite-chip').forEach(function (chip) {
    var refKey = chip.getAttribute('data-ref');
    chip.addEventListener('mouseenter', function () { showPopover(chip, refKey); });
    chip.addEventListener('click', function (e) {
      e.preventDefault();
      showPopover(chip, refKey);
    });
  });

  if (popover) {
    popover.addEventListener('mouseleave', hidePopover);
    if (popoverClose) popoverClose.addEventListener('click', hidePopover);
    if (popoverAction) {
      popoverAction.addEventListener('click', function (e) {
        e.preventDefault();
        hidePopover();
        if (activeTargetRef) goToReference(activeTargetRef);
      });
    }
  }

  document.addEventListener('click', function (e) {
    if (popover && popover.classList.contains('visible')) {
      if (!popover.contains(e.target) && !e.target.classList.contains('cite-chip')) {
        hidePopover();
      }
    }
  });

  function goToReference(refId) {
    var drawer = document.querySelector('.references-content-drawer');
    var toggleBar = document.querySelector('.references-toggle-bar');
    if (drawer && !drawer.classList.contains('expanded')) {
      drawer.classList.add('expanded');
      if (toggleBar) toggleBar.classList.add('expanded');
    }

    var targetCard = document.getElementById(refId);
    if (targetCard) {
      var offset = targetCard.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      targetCard.classList.add('highlighted');
      setTimeout(function () { targetCard.classList.remove('highlighted'); }, 3000);
    }
  }

  var refsToggleBar = document.querySelector('.references-toggle-bar');
  var refsDrawer = document.querySelector('.references-content-drawer');
  if (refsToggleBar && refsDrawer) {
    refsToggleBar.addEventListener('click', function () {
      var isExp = refsDrawer.classList.toggle('expanded');
      refsToggleBar.classList.toggle('expanded', isExp);
    });
  }

});
