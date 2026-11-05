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
    // Paleta reducida estrictamente a dos colores: amarillo-verde y azul cobalto
    var heroPalette = [
      '#DDE53A', // Amarillo-verde (lima ácido luminoso)
      '#2563EB'  // Azul cobalto eléctrico
    ];

    // ------------------------------------------------------------
    // ELEMENTOS DEL HERO: 10 ELEMENTOS (CÍRCULOS, PUNTOS Y CUADRADOS)
    // Ubicados en distintos vértices de la grilla deformada
    // Dispersos en el centro horizontal del hero y en la mitad derecha
    // Escala refinada: ligeramente más pequeños, ajustados al nodo (11px a 24px)
    // Paleta estrictamente bimembre: Amarillo-verde (#DDE53A) y Azul cobalto (#2563EB)
    // ------------------------------------------------------------
    var heroElements = [
      // 0: Usuario Sintético #01 (Cobalto — Centro Horizontal Superior)
      {
        type: 'circle-synthetic',
        color: '#2563EB',
        size: 24,
        colRatio: 0.44,
        rowRatio: 0.20,
        hasWindow: true,
        winIdx: 0,
        dataTitle: 'USUARIO SINTÉTICO #01',
        data1: 'Tasa compra: 25,2%',
        data2: 'Fricción: 0% (Cieguera)'
      },
      // 1: Cuadrado Relleno Lima (Centro Horizontal Superior)
      {
        type: 'square-fill',
        color: '#DDE53A',
        size: 17,
        colRatio: 0.54,
        rowRatio: 0.24,
        rotSpeed: 0.22,
        phase: 1.2
      },
      // 2: Punto / Círculo Sólido Cobalto (Centro Horizontal Inferior)
      {
        type: 'circle-fill',
        color: '#2563EB',
        size: 11,
        colRatio: 0.40,
        rowRatio: 0.74
      },
      // 3: Cuadrado Delineado Lima (Centro Horizontal Inferior)
      {
        type: 'square-stroke',
        color: '#DDE53A',
        size: 19,
        colRatio: 0.52,
        rowRatio: 0.80,
        rotSpeed: -0.20,
        phase: 2.5
      },
      // 4: Usuario Sintético #02 (Lima Ácido — Mitad Derecha Superior)
      {
        type: 'circle-synthetic',
        color: '#DDE53A',
        size: 24,
        colRatio: 0.72,
        rowRatio: 0.20,
        hasWindow: true,
        winIdx: 1,
        dataTitle: 'USUARIO SINTÉTICO #02',
        data1: 'Complacencia: +84%',
        data2: 'Respuesta: Sesgo confirmatorio'
      },
      // 5: Cuadrado Relleno Cobalto (Mitad Derecha)
      {
        type: 'square-fill',
        color: '#2563EB',
        size: 18,
        colRatio: 0.84,
        rowRatio: 0.34,
        rotSpeed: 0.25,
        phase: 0.8
      },
      // 6: Círculo Delineado Cobalto (Mitad Derecha Central)
      {
        type: 'circle-stroke',
        color: '#2563EB',
        size: 22,
        colRatio: 0.64,
        rowRatio: 0.46
      },
      // 7: Usuario Sintético #03 (Cobalto con Núcleo Lima — Mitad Derecha)
      {
        type: 'circle-synthetic',
        color: '#2563EB',
        accentColor: '#DDE53A',
        size: 24,
        colRatio: 0.88,
        rowRatio: 0.58,
        hasWindow: true,
        winIdx: 2,
        dataTitle: 'USUARIO SINTÉTICO #03',
        data1: 'Precisión click: 11,7%',
        data2: 'Abandono: 2,7% (-90%)'
      },
      // 8: Punto / Círculo Sólido Lima (Mitad Derecha Inferior)
      {
        type: 'circle-fill',
        color: '#DDE53A',
        size: 12,
        colRatio: 0.76,
        rowRatio: 0.70
      },
      // 9: Cuadrado Delineado Cobalto (Mitad Derecha Inferior)
      {
        type: 'square-stroke',
        color: '#2563EB',
        size: 20,
        colRatio: 0.66,
        rowRatio: 0.84,
        rotSpeed: -0.22,
        phase: 3.1
      }
    ];

    function getHeroWindowAlpha(winIdx, t) {
      // Ciclo rotativo de 18s: ventana 1 (0.5s a 5.5s), ventana 2 (6.5s a 11.5s), ventana 3 (12.5s a 17.5s)
      var cycle = t % 18;
      var start = 0;
      if (winIdx === 0) start = 0.5;
      else if (winIdx === 1) start = 6.5;
      else if (winIdx === 2) start = 12.5;
      else return 0;

      if (cycle < start || cycle >= start + 5.0) return 0;
      var p = cycle - start;
      if (p < 0.8) return p / 0.8;
      if (p < 4.2) return 1.0;
      return (5.0 - p) / 0.8;
    }

    function drawHeroRoundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
    }

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

      // Dibujar la cuadrícula animada elástica en trazo sutil
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(195, 200, 209, 0.40)';

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

      // ------------------------------------------------------------
      // ASIGNACIÓN DE ELEMENTOS A DISTINTOS VÉRTICES DE LA GRILLA
      // Dispersos en el centro horizontal del hero y en la mitad derecha
      // Anclados exactamente a points[r][c] en la cuadrícula elástica
      // ------------------------------------------------------------
      var occupied = {};
      var assigned = [];

      // Detección del área de texto para proteger la legibilidad en pantallas medianas
      var textBounds = null;
      var heroMain = document.querySelector('.hero-main-block');
      if (heroMain && heroSection) {
        var mRect = heroMain.getBoundingClientRect();
        var hRect = heroSection.getBoundingClientRect();
        textBounds = {
          left: mRect.left - hRect.left - 15,
          top: mRect.top - hRect.top - 15,
          right: mRect.right - hRect.left + 15,
          bottom: mRect.bottom - hRect.top + 15
        };
      }

      for (var i = 0; i < heroElements.length; i++) {
        var el = heroElements[i];
        var c = Math.round((cols - 1) * el.colRatio);
        var r = Math.round((rows - 1) * el.rowRatio);

        c = Math.max(1, Math.min(cols - 2, c));
        r = Math.max(1, Math.min(rows - 2, r));

        // En caso de que en alguna resolución coincida con el bloque de texto
        if (textBounds && points[r] && points[r][c]) {
          var ptCheck = points[r][c];
          if (ptCheck.baseX >= textBounds.left && ptCheck.baseX <= textBounds.right &&
              ptCheck.baseY >= textBounds.top && ptCheck.baseY <= textBounds.bottom) {
            if (el.rowRatio < 0.5) {
              while (r > 1 && points[r][c].baseY >= textBounds.top) {
                r--;
              }
            } else {
              while (r < rows - 2 && points[r][c].baseY <= textBounds.bottom) {
                r++;
              }
            }
          }
        }

        var key = r + '_' + c;
        if (occupied[key]) {
          // Búsqueda en espiral para garantizar vértices distintos sin colisiones
          var found = false;
          for (var rad = 1; rad <= 4 && !found; rad++) {
            var deltas = [
              [0, rad], [0, -rad], [rad, 0], [-rad, 0],
              [rad, rad], [rad, -rad], [-rad, rad], [-rad, -rad]
            ];
            for (var d = 0; d < deltas.length; d++) {
              var nc = Math.max(1, Math.min(cols - 2, c + deltas[d][0]));
              var nr = Math.max(1, Math.min(rows - 2, r + deltas[d][1]));
              var nkey = nr + '_' + nc;
              if (!occupied[nkey]) {
                c = nc;
                r = nr;
                key = nkey;
                found = true;
                break;
              }
            }
          }
        }

        occupied[key] = true;
        assigned[i] = { r: r, c: c };
      }

      // Enlaces técnicos sutiles entre nodos adyacentes (red de telemetría / grafo de simulación)
      var links = [
        [0, 1], [1, 4], [4, 5], [5, 7],
        [6, 4], [2, 3], [3, 9], [9, 8], [7, 8]
      ];
      ctx.save();
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      for (var l = 0; l < links.length; l++) {
        var pair = links[l];
        var vA = assigned[pair[0]];
        var vB = assigned[pair[1]];
        if (vA && vB && points[vA.r] && points[vB.r]) {
          var ptA = points[vA.r][vA.c];
          var ptB = points[vB.r][vB.c];
          if (ptA && ptB) {
            ctx.strokeStyle = heroElements[pair[0]].color === '#2563EB'
              ? 'rgba(37, 99, 235, 0.24)'
              : 'rgba(221, 229, 58, 0.30)';
            ctx.beginPath();
            ctx.moveTo(ptA.x, ptA.y);
            ctx.lineTo(ptB.x, ptB.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Renderizado de cada elemento ubicado exactamente en su vértice de la grilla
      var isDark = document.body.classList.contains('theme-dark');

      for (var i = 0; i < heroElements.length; i++) {
        var el = heroElements[i];
        var v = assigned[i];
        var pt = points[v.r][v.c];
        var px = pt.x;
        var py = pt.y;

        var r = el.size * 0.5;

        if (el.type === 'circle-synthetic') {
          // --- NODO DE USUARIO SINTÉTICO ANCLADO AL VÉRTICE ---
          // 1. Radar / onda de escaneo suave periódica
          var pulseProgress = (t * 0.45 + i * 0.3) % 1;
          var pulseR = r + pulseProgress * 12;
          var pulseAlpha = (1 - pulseProgress) * 0.35;
          ctx.save();
          ctx.strokeStyle = el.color;
          ctx.globalAlpha = pulseAlpha;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(px, py, pulseR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // 2. Anillo exterior delineado
          ctx.strokeStyle = el.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.stroke();

          // 3. Núcleo interior sólido
          ctx.fillStyle = el.accentColor || el.color;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // 4. Marcas de mira técnica / crosshair (cruces perpendiculares)
          ctx.strokeStyle = el.color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(px, py - r - 4); ctx.lineTo(px, py - r + 2);
          ctx.moveTo(px, py + r - 2); ctx.lineTo(px, py + r + 4);
          ctx.moveTo(px - r - 4, py); ctx.lineTo(px - r + 2, py);
          ctx.moveTo(px + r - 2, py); ctx.lineTo(px + r + 4, py);
          ctx.stroke();

          // 5. Etiqueta permanente de usuario sintético
          ctx.fillStyle = el.color;
          ctx.font = '700 7px Space Mono, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('[USUARIO SINTÉTICO]', px, py + r + 11);
          ctx.textAlign = 'left';

          // 6. Ventana flotante ocasional de datos
          if (el.hasWindow) {
            var winAlpha = getHeroWindowAlpha(el.winIdx, t);
            if (winAlpha > 0.01) {
              var winW = 156;
              var winH = 46;
              var winX = px + r + 14;
              var winY = py - 23;
              if (winX + winW > width - 15) {
                winX = px - r - 14 - winW;
              }
              if (winY < 15) winY = 15;
              if (winY + winH > height - 15) winY = height - 15 - winH;

              ctx.save();
              ctx.globalAlpha = winAlpha;

              // Línea líder técnica desde el círculo hasta la ventana
              var attachX = (winX > px) ? (px + r) : (px - r);
              var targetX = (winX > px) ? winX : (winX + winW);
              var targetY = winY + winH * 0.5;
              ctx.strokeStyle = el.color;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(attachX, py);
              ctx.lineTo(attachX + (winX > px ? 8 : -8), targetY);
              ctx.lineTo(targetX, targetY);
              ctx.stroke();

              ctx.fillStyle = el.color;
              ctx.beginPath();
              ctx.arc(attachX, py, 2, 0, Math.PI * 2);
              ctx.fill();

              // Tarjeta de la ventana
              ctx.fillStyle = isDark ? '#1E2028' : '#FFFFFF';
              ctx.strokeStyle = el.color;
              ctx.lineWidth = 1.2;
              drawHeroRoundRect(ctx, winX, winY, winW, winH, 4);
              ctx.fill();
              ctx.stroke();

              // Cabecera con indicador luminoso
              ctx.fillStyle = el.color;
              ctx.beginPath();
              ctx.arc(winX + 10, winY + 12, 2.5, 0, Math.PI * 2);
              ctx.fill();

              ctx.font = '700 8px Space Mono, monospace';
              ctx.fillText(el.dataTitle, winX + 18, winY + 15);

              // Datos simulados auténticos
              ctx.font = '400 8px Space Mono, monospace';
              ctx.fillStyle = isDark ? '#E2E8F0' : '#16181B';
              ctx.fillText(el.data1, winX + 10, winY + 27);

              ctx.font = '400 7.5px Space Mono, monospace';
              ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
              ctx.fillText(el.data2, winX + 10, winY + 38);

              ctx.restore();
            }
          }

        } else if (el.type === 'circle-fill') {
          // Punto / círculo sólido
          ctx.fillStyle = el.color;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();

        } else if (el.type === 'circle-stroke') {
          // Círculo delineado
          ctx.strokeStyle = el.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.stroke();

        } else if (el.type === 'square-fill') {
          // Cuadrado relleno
          var s = el.size;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(t * (el.rotSpeed || 0.2) + (el.phase || 0));
          ctx.fillStyle = el.color;
          ctx.fillRect(-s * 0.5, -s * 0.5, s, s);
          ctx.restore();

        } else if (el.type === 'square-stroke') {
          // Cuadrado delineado
          var s = el.size;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(t * (el.rotSpeed || -0.2) + (el.phase || 0));
          ctx.strokeStyle = el.color;
          ctx.lineWidth = 2;
          ctx.strokeRect(-s * 0.5, -s * 0.5, s, s);
          ctx.restore();
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
  // Modos válidos: m1 (Humanización RLHF) | m2 (Completar Tareas)
  // (El estado neutral fue eliminado: la interacción inicia directamente en m1)
  // ------------------------------------------------------------
  var mechCanvas = document.getElementById('mechCanvas');
  var mechMode = 'm1';
  var mechToggles = document.querySelectorAll('.mech-toggle-btn');
  var mechAccordions = document.querySelectorAll('.mech-accordion-item');

  function setMechanismState(mode) {
    if (mode !== 'm1' && mode !== 'm2') mode = 'm1';
    mechMode = mode;
    mechToggles.forEach(function (btn) {
      if (btn.getAttribute('data-mech') === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Abrir el acordeón correspondiente y cerrar el otro
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

      if (mechMode === 'm1') {
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
        mCtx.fillStyle = '#16181B';
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

        mCtx.fillStyle = '#C2410C';
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

        mCtx.fillStyle = '#C2410C';
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

  // ------------------------------------------------------------
  // ACORDEÓN HORIZONTAL EN PUNTOS 5.1 Y 5.2
  // Permite desplegar «Nuestra prueba paralela» plegando el diagrama nativo
  // ------------------------------------------------------------
  document.querySelectorAll('.parallel-h-accordion').forEach(function (acc) {
    var nativePanel = acc.querySelector('.h-panel-native');
    var parallelPanel = acc.querySelector('.h-panel-parallel');

    if (nativePanel && parallelPanel) {
      // Al hacer clic en la pestaña o panel paralelo colapsado -> desplegar
      parallelPanel.addEventListener('click', function (e) {
        if (!acc.classList.contains('parallel-expanded')) {
          acc.classList.add('parallel-expanded');
        }
      });

      // Al hacer clic en la pestaña o panel nativo colapsado -> replegar y volver al diagrama
      nativePanel.addEventListener('click', function (e) {
        if (acc.classList.contains('parallel-expanded')) {
          acc.classList.remove('parallel-expanded');
        }
      });
    }
  });

  // ------------------------------------------------------------
  // Gráfico 5.4: Visualización Comparativa por Variable // ShopCART Lu et al. (2026)
  // Lógica invertida: organizada por variable (compra, abandono, precisión)
  // Gráfico de curvas comparativo entre Personas reales vs Claude 3.5 Sonnet vs DeepSeek-R1
  // ------------------------------------------------------------
  var shopcartVarButtons = document.querySelectorAll('.shopcart-var-btn');
  var shopcartTitle = document.getElementById('shopcart-current-var-title');
  var valHuman = document.getElementById('user-val-human');
  var valClaude = document.getElementById('user-val-claude');
  var valDeepseek = document.getElementById('user-val-deepseek');
  var deltaClaude = document.getElementById('user-delta-claude');
  var deltaDeepseek = document.getElementById('user-delta-deepseek');
  var subHuman = document.getElementById('user-sub-human');
  var subClaude = document.getElementById('user-sub-claude');
  var subDeepseek = document.getElementById('user-sub-deepseek');
  var shopcartTakeaway = document.getElementById('shopcart-takeaway');
  var shopcartCurveSvg = document.getElementById('shopcartCurveSvg');

  var shopcartVariables = {
    'buy': {
      title: 'VARIABLE SELECCIONADA: TASA DE COMPRA EFECTIVA',
      yMax: 30,
      unit: '%',
      human: { val: '3,3%', num: 3.3, sub: 'Línea base natural en 31.865 sesiones de Amazon' },
      claude: { val: '25,2%', num: 25.2, delta: '+663% sobreestimación', sub: 'Fuerza la compra para cumplir el objetivo' },
      deepseek: { val: '24,8%', num: 24.8, delta: '+651% sobreestimación', sub: 'Tendencia similar de cumplimiento ciego' },
      takeaway: '<strong>Impacto en pruebas de usuario:</strong> Las personas reales dudan, comparan y solo compran en el 3,3% de las acciones. Claude 3.5 Sonnet infla la tasa a 25,2% (+663%). Esto crearía la ilusión de un embudo de compra perfecto cuando en realidad los clientes reales se están trabando y marchando.'
    },
    'abandon': {
      title: 'VARIABLE SELECCIONADA: TASA DE ABANDONO (DETECCIÓN DE FRICCIÓN)',
      yMax: 30,
      unit: '%',
      human: { val: '26,5%', num: 26.5, sub: 'Fricciones detectadas: dudas, frustración o confusión' },
      claude: { val: '2,7%', num: 2.7, delta: '-90% ceguera a fricción', sub: 'Invisibiliza casi por completo las trabas de diseño' },
      deepseek: { val: '8,4%', num: 8.4, delta: '-68% subestimación', sub: 'Minimiza los problemas reales de usabilidad' },
      takeaway: '<strong>Impacto en pruebas de usuario:</strong> El abandono es el indicador más crítico: revela que el diseño causa frustración. Un humano abandona en el 26,5% de las sesiones, pero Claude 3.5 Sonnet apenas en el 2,7%. La persistencia ciega de la IA silencia los problemas que ahuyentan a las personas.'
    },
    'accuracy': {
      title: 'VARIABLE SELECCIONADA: PRECISIÓN EN TAREAS PASO A PASO',
      yMax: 100,
      unit: '%',
      human: { val: '100%', num: 100, sub: 'Referencia base del recorrido humano efectivo' },
      claude: { val: '11,69%', num: 11.69, delta: '-88,3% desvío', sub: 'Acierto muy bajo respecto al clickpath humano real' },
      deepseek: { val: '11,86%', num: 11.86, delta: '-88,1% desvío', sub: 'Desconexión evidente de los pasos reales del usuario' },
      takeaway: '<strong>Impacto en pruebas de usuario:</strong> Los modelos no replican las acciones humanas paso a paso (Claude acierta solo el 11,69% y DeepSeek el 11,86%). Aunque el modelo alcance la meta, su recorrido no predice por dónde navegará, dudará o se equivocará un ser humano.'
    }
  };

  function updateShopcartVariable(varKey) {
    var d = shopcartVariables[varKey];
    if (!d) return;

    if (shopcartTitle) shopcartTitle.textContent = d.title;
    if (valHuman) valHuman.textContent = d.human.val;
    if (valClaude) valClaude.textContent = d.claude.val;
    if (valDeepseek) valDeepseek.textContent = d.deepseek.val;

    if (deltaClaude) deltaClaude.textContent = d.claude.delta;
    if (deltaDeepseek) deltaDeepseek.textContent = d.deepseek.delta;

    if (subHuman) subHuman.textContent = d.human.sub;
    if (subClaude) subClaude.textContent = d.claude.sub;
    if (subDeepseek) subDeepseek.textContent = d.deepseek.sub;

    if (shopcartTakeaway) shopcartTakeaway.innerHTML = d.takeaway;

    // Dibujar curvas dinámicas en el SVG
    if (shopcartCurveSvg) {
      renderShopcartCurve(d);
    }
  }

  function renderShopcartCurve(d) {
    var svg = shopcartCurveSvg;
    var w = 700;
    var h = 210;
    var padLeft = 70;
    var padRight = 50;
    var padTop = 30;
    var padBottom = 40;
    var chartW = w - padLeft - padRight;
    var chartH = h - padTop - padBottom;

    // Puntos x para los 3 tipos de usuario
    var xHuman = padLeft + chartW * 0.15;
    var xDeepseek = padLeft + chartW * 0.52;
    var xClaude = padLeft + chartW * 0.88;

    function getY(val) {
      var ratio = Math.min(1, Math.max(0, val / d.yMax));
      return (padTop + chartH) - (ratio * chartH);
    }

    var yHuman = getY(d.human.num);
    var yDeepseek = getY(d.deepseek.num);
    var yClaude = getY(d.claude.num);
    var yBase = padTop + chartH;

    // Construcción de la curva de Bézier cúbica continua
    var c1x = (xHuman + xDeepseek) / 2;
    var c2x = (xDeepseek + xClaude) / 2;

    var curvePath = 'M ' + xHuman.toFixed(1) + ',' + yHuman.toFixed(1) +
                    ' C ' + c1x.toFixed(1) + ',' + yHuman.toFixed(1) + ' ' + c1x.toFixed(1) + ',' + yDeepseek.toFixed(1) + ' ' + xDeepseek.toFixed(1) + ',' + yDeepseek.toFixed(1) +
                    ' C ' + c2x.toFixed(1) + ',' + yDeepseek.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + yClaude.toFixed(1) + ' ' + xClaude.toFixed(1) + ',' + yClaude.toFixed(1);

    var areaPath = curvePath +
                   ' L ' + xClaude.toFixed(1) + ',' + yBase.toFixed(1) +
                   ' L ' + xHuman.toFixed(1) + ',' + yBase.toFixed(1) + ' Z';

    // Líneas guía horizontales (grid Y)
    var gridLinesHtml = '';
    var steps = 4;
    for (var i = 0; i <= steps; i++) {
      var gridVal = (d.yMax * i / steps).toFixed(0);
      var gy = getY(gridVal);
      gridLinesHtml += '<line x1="' + padLeft + '" y1="' + gy + '" x2="' + (w - padRight) + '" y2="' + gy + '" stroke="rgba(195, 200, 209, 0.45)" stroke-dasharray="3,3" stroke-width="1" />' +
                       '<text x="' + (padLeft - 10) + '" y="' + (gy + 4) + '" fill="#9AA1AD" font-family="Space Mono, monospace" font-size="10" text-anchor="end">' + gridVal + d.unit + '</text>';
    }

    svg.innerHTML =
      '<defs>' +
        '<linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#4D6BFE" stop-opacity="0.22" />' +
          '<stop offset="100%" stop-color="#4D6BFE" stop-opacity="0.0" />' +
        '</linearGradient>' +
        '<linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%" stop-color="#C2410C" />' +
          '<stop offset="50%" stop-color="#DA9DED" />' +
          '<stop offset="100%" stop-color="#4D6BFE" />' +
        '</linearGradient>' +
      '</defs>' +
      gridLinesHtml +
      '<line x1="' + xHuman + '" y1="' + padTop + '" x2="' + xHuman + '" y2="' + yBase + '" stroke="rgba(195, 200, 209, 0.35)" stroke-width="1" />' +
      '<line x1="' + xDeepseek + '" y1="' + padTop + '" x2="' + xDeepseek + '" y2="' + yBase + '" stroke="rgba(195, 200, 209, 0.35)" stroke-width="1" />' +
      '<line x1="' + xClaude + '" y1="' + padTop + '" x2="' + xClaude + '" y2="' + yBase + '" stroke="rgba(195, 200, 209, 0.35)" stroke-width="1" />' +
      '<path d="' + areaPath + '" fill="url(#curveGrad)" />' +
      '<path d="' + curvePath + '" fill="none" stroke="url(#strokeGrad)" stroke-width="3" stroke-linecap="round" />' +
      '<circle cx="' + xHuman + '" cy="' + yHuman + '" r="7" fill="#C2410C" stroke="#FFFFFF" stroke-width="2" />' +
      '<text x="' + xHuman + '" y="' + (yHuman - 12) + '" fill="#C2410C" font-family="Space Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">' + d.human.val + '</text>' +
      '<text x="' + xHuman + '" y="' + (yBase + 20) + '" fill="#16181B" font-family="Space Mono, monospace" font-size="10" font-weight="600" text-anchor="middle">PERSONAS REALES</text>' +
      '<circle cx="' + xDeepseek + '" cy="' + yDeepseek + '" r="6" fill="#DA9DED" stroke="#FFFFFF" stroke-width="2" />' +
      '<text x="' + xDeepseek + '" y="' + (yDeepseek - 12) + '" fill="#9333EA" font-family="Space Mono, monospace" font-size="11" font-weight="700" text-anchor="middle">' + d.deepseek.val + '</text>' +
      '<text x="' + xDeepseek + '" y="' + (yBase + 20) + '" fill="#686E7A" font-family="Space Mono, monospace" font-size="10" text-anchor="middle">DEEPSEEK-R1</text>' +
      '<circle cx="' + xClaude + '" cy="' + yClaude + '" r="7" fill="#4D6BFE" stroke="#FFFFFF" stroke-width="2" />' +
      '<text x="' + xClaude + '" y="' + (yClaude - 12) + '" fill="#4D6BFE" font-family="Space Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">' + d.claude.val + '</text>' +
      '<text x="' + xClaude + '" y="' + (yBase + 20) + '" fill="#4D6BFE" font-family="Space Mono, monospace" font-size="10" font-weight="600" text-anchor="middle">CLAUDE 3.5 SONNET</text>';
  }

  shopcartVarButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      shopcartVarButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      var varKey = this.getAttribute('data-var');
      updateShopcartVariable(varKey);
    });
  });

  // Inicializar en la variable de compra
  updateShopcartVariable('buy');

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

      cCtx.fillStyle = '#C2410C';
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
