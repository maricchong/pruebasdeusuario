/* ============================================================
   NAV.JS — Línea de Tiempo Vertical Sutil & Navegación Suave
   ¿En qué haría clic ChatGPT?
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  var nodes = document.querySelectorAll('.timeline-node-item');
  var progressBar = document.querySelector('.timeline-progress-bar');
  var percentText = document.querySelector('.scroll-percentage');
  var mobileBtn = document.querySelector('.mobile-toggle-btn');
  var timelineNav = document.querySelector('.timeline-nav');
  var topics = document.querySelectorAll('.stream-topic, .hero-fullscreen, .final-meta-section');

  // — 1. PROGRESO DE SCROLL Y RELLENO SUAVE DE LA LÍNEA VERTICAL —
  function updateScrollProgress() {
    var winScroll = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = docHeight > 0 ? (winScroll / docHeight) * 100 : 0;
    var clampedScrolled = Math.min(Math.max(scrolled, 0), 100);

    if (progressBar) {
      progressBar.style.height = clampedScrolled + '%';
    }
    if (percentText) {
      percentText.textContent = Math.round(clampedScrolled) + '%';
    }

    // Identificar el tema activo en base a la posición del scroll
    var scrollPosition = winScroll + window.innerHeight * 0.35;
    var currentTopicId = '';

    // Si está al final de la página, activar el último tema
    if (winScroll + window.innerHeight >= document.documentElement.scrollHeight - 30) {
      var lastTopic = topics[topics.length - 1];
      if (lastTopic) currentTopicId = lastTopic.getAttribute('id');
    } else {
      topics.forEach(function (topic) {
        var top = topic.offsetTop;
        var height = topic.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentTopicId = topic.getAttribute('id');
        }
      });
    }

    if (currentTopicId) {
      nodes.forEach(function (node) {
        var link = node.querySelector('.timeline-node-link');
        if (link && link.getAttribute('href') === '#' + currentTopicId) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // — 2. SCROLL SUAVE AL HACER CLIC EN UN NODO O ENLACE INTERNO —
  var timelineLinks = document.querySelectorAll('.timeline-node-link, .btn-cta-soft, a[href^="#"]');
  timelineLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          var offset = targetEl.getBoundingClientRect().top + window.scrollY - 20;
          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });

          // Cerrar menú móvil si está desplegado
          if (timelineNav && timelineNav.classList.contains('mobile-visible')) {
            timelineNav.classList.remove('mobile-visible');
            if (mobileBtn) mobileBtn.textContent = 'Menú';
          }
        }
      }
    });
  });

  // — 3. MENÚ MÓVIL SUTIL —
  if (mobileBtn && timelineNav) {
    mobileBtn.addEventListener('click', function () {
      var isOpen = timelineNav.classList.toggle('mobile-visible');
      mobileBtn.textContent = isOpen ? 'Cerrar' : 'Menú';
    });

    document.addEventListener('click', function (e) {
      if (
        timelineNav.classList.contains('mobile-visible') &&
        !timelineNav.contains(e.target) &&
        e.target !== mobileBtn
      ) {
        timelineNav.classList.remove('mobile-visible');
        mobileBtn.textContent = 'Menú';
      }
    });
  }
});
