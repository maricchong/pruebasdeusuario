/**
 * NAVEGACIÓN COMPARTIDA DEL SITIO (Fuente única de verdad)
 * Investigación: ¿En qué haría clic ChatGPT?
 * 
 * Funcionalidades automáticas:
 * - Menú lateral de escritorio y panel móvil deslizable.
 * - Subíndice "En esta página" (TOC) y resaltado al hacer scroll (Scrollspy).
 * - Migas de pan (Breadcrumbs).
 * - Indicador de avance ("Capítulo N de M").
 * - Navegación Anterior / Siguiente (Pager).
 * - Generación de tarjetas de capítulos en la portada.
 * - Accesibilidad de teclado (foco atrapado/restaurado, tecla Escape).
 * - Cierre automático del menú móvil al seleccionar cualquier enlace.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. ARREGLO DE CONFIGURACIÓN DEL SITIO
     ========================================================================== */
  const SITE_CONFIG = {
    title: "¿En qué haría clic ChatGPT?",
    tagline: "Usuarios sintéticos vs. pruebas reales de usuario",
    kicker: "INVESTIGACIÓN UX // INTELIGENCIA ARTIFICIAL",
    pages: [
      {
        type: "home",
        file: "index.html",
        title: "Inicio",
        shortTitle: "Inicio",
        navLabel: "Inicio",
        summary: "Portada y presentación general de la investigación."
      },
      {
        type: "chapter",
        num: "01",
        file: "capitulo-01.html",
        title: "Las pruebas de usuario y los usuarios sintéticos",
        shortTitle: "Pruebas de usuario y usuarios sintéticos",
        summary: "Qué son las pruebas con personas reales y cómo la inteligencia artificial propone simular participantes mediante modelos de lenguaje."
      },
      {
        type: "chapter",
        num: "02",
        file: "capitulo-02.html",
        title: "La pregunta de investigación",
        shortTitle: "La pregunta de investigación",
        summary: "¿Es preferible una investigación simulada a la ausencia de información? Límites del reemplazo y formulación del problema."
      },
      {
        type: "chapter",
        num: "03",
        file: "capitulo-03.html",
        title: "Estado del arte y evidencia empírica",
        shortTitle: "Estado del arte y evidencia",
        summary: "Análisis de tres estudios comparativos: credibilidad frente a precisión, complacencia algorítmica y riesgos metodológicos."
      },
      {
        type: "chapter",
        num: "04",
        file: "capitulo-04.html",
        title: "Metodología y prueba de diseño",
        shortTitle: "Metodología y prueba de diseño",
        summary: "Diseño experimental en dos fases consecutivas y cuatro dimensiones de fidelidad para comparar recorridos humanos y sintéticos."
      },
      {
        type: "chapter",
        num: "05",
        file: "capitulo-05.html",
        title: "Conclusiones y discusión",
        shortTitle: "Conclusiones y discusión",
        summary: "Resultados finales de la prueba, discusión sobre la utilidad de los agentes sintéticos y recomendaciones prácticas."
      },
      {
        type: "utility",
        file: "referencias.html",
        title: "Referencias bibliográficas",
        shortTitle: "Referencias",
        navLabel: "Referencias",
        summary: "Fuentes, papers académicos y literatura consultada en la investigación."
      },
      {
        type: "utility",
        file: "acerca.html",
        title: "Acerca del proyecto",
        shortTitle: "Acerca de",
        navLabel: "Acerca del proyecto",
        summary: "Equipo de investigación, marco institucional y contexto del trabajo."
      }
    ]
  };

  /* ==========================================================================
     2. DETECCIÓN DE PÁGINA ACTUAL (Robusta para file:// y http://)
     ========================================================================== */
  function getCurrentFilename() {
    try {
      const rawPath = decodeURIComponent(window.location.pathname).replace(/\\/g, '/');
      const segments = rawPath.split('/').filter(Boolean);
      const last = segments.length > 0 ? segments[segments.length - 1].toLowerCase() : 'index.html';
      
      if (!last || !last.endsWith('.html')) {
        return 'index.html';
      }
      return last;
    } catch (e) {
      return 'index.html';
    }
  }

  const currentFile = getCurrentFilename();
  const currentPage = SITE_CONFIG.pages.find(p => p.file.toLowerCase() === currentFile) || SITE_CONFIG.pages[0];
  const chaptersList = SITE_CONFIG.pages.filter(p => p.type === 'chapter');

  /* ==========================================================================
     3. RENDERIZADO DEL MENÚ LATERAL (SIDEBAR)
     ========================================================================== */
  function renderSidebar() {
    const sidebarContainer = document.getElementById('sidebar');
    if (!sidebarContainer) return;

    let html = `
      <div class="sidebar-header">
        <div class="sidebar-kicker">
          <span class="matrix-dots" aria-hidden="true">
            <span class="matrix-dot"></span>
            <span class="matrix-dot"></span>
            <span class="matrix-dot"></span>
          </span>
          <span>${SITE_CONFIG.kicker}</span>
        </div>
        <a href="index.html" class="sidebar-brand">
          <div class="sidebar-title">${SITE_CONFIG.title}</div>
          <p class="sidebar-subtitle">${SITE_CONFIG.tagline}</p>
        </a>
      </div>

      <nav aria-label="Navegación principal" class="site-nav">
        <!-- Inicio -->
        <div class="nav-group">
          <ul class="nav-list">
            <li class="nav-item">
              <a href="index.html" class="nav-link ${currentFile === 'index.html' ? 'active' : ''}" ${currentFile === 'index.html' ? 'aria-current="page"' : ''}>
                <span class="nav-num">00</span>
                <span class="nav-label">Inicio</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Capítulos -->
        <div class="nav-group">
          <div class="nav-group-title">Capítulos</div>
          <ul class="nav-list">
    `;

    chaptersList.forEach(chapter => {
      const isCurrent = chapter.file.toLowerCase() === currentFile;
      html += `
        <li class="nav-item">
          <a href="${chapter.file}" class="nav-link ${isCurrent ? 'active' : ''}" ${isCurrent ? 'aria-current="page"' : ''}>
            <span class="nav-num">${chapter.num}</span>
            <span class="nav-label">${chapter.shortTitle || chapter.title}</span>
          </a>
      `;

      // Si es el capítulo activo, incrustamos el contenedor para el subíndice "En esta página"
      if (isCurrent) {
        html += `
          <div class="toc-container" id="toc-container" style="display: none;">
            <div class="toc-heading">
              <span aria-hidden="true">▸</span>
              <span>En esta página</span>
            </div>
            <ul class="toc-sublist" id="toc-list" aria-label="Secciones de este capítulo"></ul>
          </div>
        `;
      }

      html += `</li>`;
    });

    html += `
          </ul>
        </div>

        <!-- Información complementaria -->
        <div class="nav-group">
          <div class="nav-group-title">Información</div>
          <ul class="nav-list">
            <li class="nav-item">
              <a href="referencias.html" class="nav-link ${currentFile === 'referencias.html' ? 'active' : ''}" ${currentFile === 'referencias.html' ? 'aria-current="page"' : ''}>
                <span class="nav-num">REF</span>
                <span class="nav-label">Referencias</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="acerca.html" class="nav-link ${currentFile === 'acerca.html' ? 'active' : ''}" ${currentFile === 'acerca.html' ? 'aria-current="page"' : ''}>
                <span class="nav-num">INFO</span>
                <span class="nav-label">Acerca del proyecto</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div class="sidebar-footer">
        <span class="sidebar-status-tag">
          <span style="color: var(--color-accent-orange);">●</span> ESTADO: REPORTE
        </span>
        <span>2026 // UX LAB</span>
      </div>
    `;

    sidebarContainer.innerHTML = html;

    // Delegación de evento: cualquier clic en enlace dentro del sidebar cierra el menú en móvil
    sidebarContainer.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link && document.body.classList.contains('nav-open')) {
        closeMobileMenu();
      }
    });
  }

  /* ==========================================================================
     4. SUBÍNDICE "EN ESTA PÁGINA" Y SCROLLSPY CON INTERSECTIONOBSERVER
     ========================================================================== */
  function setupTocAndScrollspy() {
    const tocList = document.getElementById('toc-list');
    const tocContainer = document.getElementById('toc-container');
    if (!tocList || !tocContainer) return;

    // Secciones con id dentro del contenido principal
    const headings = Array.from(document.querySelectorAll('main h2[id], main h3[id]'));
    if (headings.length === 0) {
      tocContainer.style.display = 'none';
      return;
    }

    let tocHtml = '';
    headings.forEach(heading => {
      const id = heading.id;
      const cleanText = heading.textContent.replace(/^\/\/\s*/, '').trim();
      const isH3 = heading.tagName.toLowerCase() === 'h3';

      tocHtml += `
        <li class="toc-item ${isH3 ? 'toc-item--sub' : ''}">
          <a href="#${id}" class="toc-link" data-target="${id}">
            ${cleanText}
          </a>
        </li>
      `;
    });

    tocList.innerHTML = tocHtml;
    tocContainer.style.display = 'block';

    const tocLinks = tocList.querySelectorAll('.toc-link');

    // Desplazamiento suave y gestión de foco accesible al hacer clic
    tocLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          // Scroll suave nativo garantizado
          targetEl.scrollIntoView({ behavior: 'smooth' });
          targetEl.setAttribute('tabindex', '-1');
          targetEl.focus({ preventScroll: true });
        }
      });
    });

    // Scrollspy usando IntersectionObserver nativo
    if ('IntersectionObserver' in window) {
      let activeHeadingId = null;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activeHeadingId = entry.target.id;
            tocLinks.forEach(link => {
              if (link.getAttribute('data-target') === activeHeadingId) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, {
        root: null,
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0
      });

      headings.forEach(heading => observer.observe(heading));
    }
  }

  /* ==========================================================================
     5. MIGAS DE PAN (BREADCRUMBS)
     ========================================================================== */
  function renderBreadcrumbs() {
    const breadcrumbsContainer = document.getElementById('breadcrumbs');
    if (!breadcrumbsContainer) return;

    if (currentPage.type === 'home') {
      breadcrumbsContainer.innerHTML = '';
      breadcrumbsContainer.style.display = 'none';
      return;
    }

    let html = `<a href="index.html">Inicio</a>`;
    html += `<span class="breadcrumbs-sep" aria-hidden="true">›</span>`;

    if (currentPage.type === 'chapter') {
      html += `<span>Capítulos</span>`;
      html += `<span class="breadcrumbs-sep" aria-hidden="true">›</span>`;
      html += `<span class="breadcrumbs-current">${currentPage.num} · ${currentPage.shortTitle || currentPage.title}</span>`;
    } else {
      html += `<span class="breadcrumbs-current">${currentPage.title}</span>`;
    }

    breadcrumbsContainer.innerHTML = html;
    breadcrumbsContainer.style.display = 'flex';
  }

  /* ==========================================================================
     6. INDICADOR DE CAPÍTULO ("Capítulo N de M")
     ========================================================================== */
  function renderChapterMeta() {
    const chapterMetaContainer = document.getElementById('chapter-meta');
    if (!chapterMetaContainer) return;

    if (currentPage.type !== 'chapter') {
      chapterMetaContainer.innerHTML = '';
      chapterMetaContainer.style.display = 'none';
      return;
    }

    const currentNumInt = parseInt(currentPage.num, 10);
    const totalChapters = chaptersList.length;

    chapterMetaContainer.innerHTML = `
      <div class="chapter-badge">
        <span aria-hidden="true" style="color: var(--color-accent-orange);">■</span>
        <span>Capítulo ${currentNumInt} de ${totalChapters}</span>
      </div>
      <div class="chapter-progress">
        <span>INVESTIGACIÓN // INFORME DE RESULTADOS</span>
      </div>
    `;
    chapterMetaContainer.style.display = 'flex';
  }

  /* ==========================================================================
     7. NAVEGACIÓN ANTERIOR / SIGUIENTE (PAGER)
     ========================================================================== */
  function renderPager() {
    const pagerContainer = document.getElementById('pager');
    if (!pagerContainer) return;

    if (currentPage.type === 'home') {
      pagerContainer.innerHTML = '';
      pagerContainer.style.display = 'none';
      return;
    }

    let prevPage = null;
    let nextPage = null;

    if (currentPage.type === 'chapter') {
      const currentIdx = chaptersList.findIndex(c => c.file.toLowerCase() === currentFile);
      if (currentIdx === 0) {
        prevPage = SITE_CONFIG.pages.find(p => p.type === 'home');
      } else if (currentIdx > 0) {
        prevPage = chaptersList[currentIdx - 1];
      }

      if (currentIdx === chaptersList.length - 1) {
        nextPage = SITE_CONFIG.pages.find(p => p.file === 'referencias.html');
      } else if (currentIdx >= 0 && currentIdx < chaptersList.length - 1) {
        nextPage = chaptersList[currentIdx + 1];
      }
    } else if (currentPage.file === 'referencias.html') {
      prevPage = chaptersList[chaptersList.length - 1];
      nextPage = SITE_CONFIG.pages.find(p => p.file === 'acerca.html');
    } else if (currentPage.file === 'acerca.html') {
      prevPage = SITE_CONFIG.pages.find(p => p.file === 'referencias.html');
      nextPage = null;
    }

    let html = `<div class="pager-nav">`;

    if (prevPage) {
      const prevNumLabel = prevPage.type === 'chapter' ? `Capítulo ${prevPage.num}` : (prevPage.type === 'home' ? 'Portada' : 'Anterior');
      html += `
        <a href="${prevPage.file}" class="pager-btn pager-btn--prev">
          <span class="pager-direction">← ${prevNumLabel}</span>
          <span class="pager-title">${prevPage.shortTitle || prevPage.title}</span>
        </a>
      `;
    } else {
      html += `<div></div>`;
    }

    if (nextPage) {
      const nextNumLabel = nextPage.type === 'chapter' ? `Capítulo ${nextPage.num}` : (nextPage.file === 'referencias.html' ? 'Bibliografía' : 'Siguiente');
      html += `
        <a href="${nextPage.file}" class="pager-btn pager-btn--next">
          <span class="pager-direction">${nextNumLabel} →</span>
          <span class="pager-title">${nextPage.shortTitle || nextPage.title}</span>
        </a>
      `;
    }

    html += `</div>`;

    // Enlace Volver arriba
    html += `
      <div class="back-to-top-container">
        <a href="#contenido" class="back-to-top" id="back-to-top-btn">
          ↑ Volver arriba
        </a>
      </div>
    `;

    pagerContainer.innerHTML = html;
    pagerContainer.style.display = 'block';

    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     8. TARJETAS DE CAPÍTULOS EN PORTADA (INDEX.HTML)
     ========================================================================== */
  function renderHomeCards() {
    const gridContainer = document.getElementById('chapters-grid');
    if (!gridContainer) return;

    let html = '';
    chaptersList.forEach(chapter => {
      html += `
        <a href="${chapter.file}" class="chapter-card">
          <div>
            <div class="chapter-card-top">
              <span class="chapter-card-num">${chapter.num}</span>
              <span>CAPÍTULO</span>
            </div>
            <h3 class="chapter-card-title">${chapter.title}</h3>
            <p class="chapter-card-summary">${chapter.summary}</p>
          </div>
          <div class="chapter-card-cta">
            <span>Leer capítulo</span>
          </div>
        </a>
      `;
    });

    gridContainer.innerHTML = html;
  }

  /* ==========================================================================
     9. CABECERA MÓVIL Y CONTROL DE FOCO / ACCESIBILIDAD
     ========================================================================== */
  let menuToggleBtn = null;
  let sidebarEl = null;
  let backdropEl = null;

  function setupMobileHeader() {
    const mobileHeader = document.getElementById('mobile-header');
    if (!mobileHeader) return;

    mobileHeader.innerHTML = `
      <a href="index.html" class="mobile-brand">${SITE_CONFIG.title}</a>
      <button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="sidebar" aria-label="Abrir menú de navegación">
        <svg class="menu-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    `;

    menuToggleBtn = document.getElementById('menu-toggle');
    sidebarEl = document.getElementById('sidebar');
    backdropEl = document.getElementById('nav-backdrop');

    if (menuToggleBtn && sidebarEl && backdropEl) {
      menuToggleBtn.addEventListener('click', toggleMobileMenu);
      backdropEl.addEventListener('click', closeMobileMenu);

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
          closeMobileMenu();
        }
      });
    }
  }

  function toggleMobileMenu() {
    if (document.body.classList.contains('nav-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    document.body.classList.add('nav-open');
    if (menuToggleBtn) {
      menuToggleBtn.setAttribute('aria-expanded', 'true');
      menuToggleBtn.setAttribute('aria-label', 'Cerrar menú');
      menuToggleBtn.innerHTML = `
        <svg class="menu-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    }
    // Traslado de foco accesible al primer enlace del menú lateral
    setTimeout(() => {
      const firstLink = sidebarEl ? sidebarEl.querySelector('a') : null;
      if (firstLink) firstLink.focus();
    }, 50);
  }

  function closeMobileMenu() {
    if (!document.body.classList.contains('nav-open')) return;
    document.body.classList.remove('nav-open');
    if (menuToggleBtn) {
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      menuToggleBtn.setAttribute('aria-label', 'Abrir menú');
      menuToggleBtn.innerHTML = `
        <svg class="menu-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
      // Restauración de foco al botón disparador
      menuToggleBtn.focus();
    }
  }

  /* ==========================================================================
     10. INICIALIZACIÓN
     ========================================================================== */
  function init() {
    setupMobileHeader();
    renderSidebar();
    setupTocAndScrollspy();
    renderBreadcrumbs();
    renderChapterMeta();
    renderPager();
    renderHomeCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
