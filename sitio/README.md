# ¿En qué haría clic ChatGPT? — Publicación de Resultados de Investigación

Versión inicial de sitio web estático para la difusión y consulta del informe de investigación sobre usuarios sintéticos en pruebas de usabilidad y diseño web.

---

## 1. Modo de apertura y funcionamiento

Este sitio está construido bajo el estándar **autocontenido y autónomo (*standalone*)**:
- **Se abre haciendo doble clic sobre `index.html`** directamente desde el explorador de archivos de Windows/macOS/Linux.
- Funciona bajo el protocolo `file://` y en cualquier navegador moderno (Chrome, Firefox, Safari, Edge).
- **No requiere**: Node.js, npm, servidores locales, compilación, CDNs ni conexión a internet activa.
- Todos los recursos (estilos CSS, scripts JS, rutas relativas y gráficos SVG) son 100% nativos y locales.

---

## 2. Estructura de archivos

El proyecto posee una estructura plana y organizada para garantizar que las rutas relativas se mantengan consistentes:

```text
sitio/
├── index.html            ← Portada general e índice de capítulos
├── capitulo-01.html      ← Capítulo 01: Pruebas de usuario y usuarios sintéticos
├── capitulo-02.html      ← Capítulo 02: La pregunta de investigación
├── capitulo-03.html      ← Capítulo 03: Estado del arte y evidencia empírica
├── capitulo-04.html      ← Capítulo 04: Metodología y prueba de diseño
├── capitulo-05.html      ← Capítulo 05: Conclusiones y discusión
├── referencias.html      ← Fuentes y referencias bibliográficas
├── acerca.html           ← Equipo de investigación y marco institucional
├── css/
│   └── estilos.css       ← Hoja de estilo global (variables, grilla, responsive)
├── js/
│   └── nav.js            ← Navegación compartida (fuente única de verdad)
├── img/                  ← Carpeta para futuras imágenes, diagramas y figuras
└── README.md             ← Este documento de especificación y guía de ampliación
```

---

## 3. Cómo agregar un capítulo nuevo

Agregar un nuevo capítulo al sitio requiere únicamente **dos pasos simples**:

### Paso 1: Crear el nuevo archivo HTML a partir de la plantilla
1. Duplicar cualquiera de los archivos de capítulo existentes (por ejemplo, `capitulo-05.html`) y renombrarlo como `capitulo-06.html`.
2. Abrir el archivo y actualizar:
   - Las etiquetas `<title>` y `<meta name="description">` en el `<head>`.
   - El título principal `<h1>` dentro de `<main id="contenido">`.
   - El contenido del cuerpo organizándolo con secciones `h2[id]` y `h3[id]`.
   
> **Nota clave sobre los IDs:** Cada sección con `id` que agregues en el HTML (por ejemplo `<h2 id="mi-seccion">Mi Sección</h2>`) será detectada automáticamente por `nav.js` para construir el subíndice dinámico *"En esta página"* con desplazamiento suave y *scrollspy*.

### Paso 2: Registrar el capítulo en `js/nav.js`
Abrir `js/nav.js` y agregar una nueva entrada dentro del arreglo `SITE_CONFIG.pages` en el orden correspondiente:

```javascript
{
  type: "chapter",
  num: "06",
  file: "capitulo-06.html",
  title: "Título completo del nuevo capítulo",
  shortTitle: "Título corto para el menú lateral",
  summary: "Resumen breve de una o dos líneas que aparecerá en la tarjeta de la portada."
}
```

¡Listo! Al guardar los cambios y refrescar el navegador, `nav.js` se encargará de forma automática de:
- Sumar el enlace en el menú lateral de escritorio y en el panel móvil.
- Actualizar las migas de pan y el indicador `"Capítulo 6 de 06"`.
- Enlazar la navegación *Anterior / Siguiente* (Pager) entre capítulos adyacentes.
- Renderizar la nueva tarjeta en la cuadrícula de la portada (`index.html`).

---

## 4. Personalización y variables de estilo

Todos los estilos visuales del sitio están centralizados en las variables CSS (`:root`) al comienzo de `css/estilos.css`:

```css
:root {
  /* Fondo cálido de papel de archivo */
  --color-bg: #f5f4ef;
  
  /* Tintas de alto contraste */
  --color-text: #141518;
  --color-text-secondary: #4a4e57;
  
  /* Acentos cromáticos (extraídos de la referencia visual) */
  --color-accent-yellow: #f6c414;  /* Puntos activos, llamadas */
  --color-accent-orange: #d94726;  /* Tramas, alertas, barras */
  --color-accent-blue: #2d73b5;    /* Etiquetas técnicas */

  /* Tipografías con fallback offline */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Consolas, Menlo, monospace;

  /* Ancho máximo de columna de lectura cómoda */
  --content-max-width: 72ch;
}
```

Cualquier ajuste de colores, tipografías, grosores de línea o márgenes modulares realizado aquí impactará de forma coherente en todo el sitio.

---

## 5. Localización de bloques de contenido pendiente

Para identificar con rapidez qué secciones aún necesitan texto, datos o citas definitivas, se utiliza la clase CSS `.pendiente`.

En el código fuente de las páginas HTML se encuentran bloques con esta estructura:

```html
<div class="pendiente">
  <div class="pendiente-badge">
    <span aria-hidden="true">⚠</span>
    <span>Contenido pendiente // [Motivo]</span>
  </div>
  <p class="pendiente-text">
    [Contenido pendiente: Descripción detallada de qué información debe volcarse aquí...]
  </p>
</div>
```

Para buscar todos los pendientes del proyecto, basta con realizar una búsqueda global en el editor de código con el término:
- `.pendiente` o `[Contenido pendiente:`

---

## 6. Decisiones de accesibilidad

- **Navegación por teclado:** Enlace *"Saltar al contenido"* visible con foco inicial (`Tab`). Trampa de foco y cierre con tecla `Escape` en el menú móvil.
- **Jerarquía y semántica:** Uso estricto de elementos `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` y un único `<h1>` por página.
- **Contraste visual:** Relación de contraste superior al umbral WCAG AA (texto `#141518` sobre fondo `#f5f4ef` supera 14:1).
- **Animaciones reducidas:** La regla `@media (prefers-reduced-motion: reduce)` anula las transiciones y el desplazamiento suave para usuarios con sensibilidades vestibulares.
