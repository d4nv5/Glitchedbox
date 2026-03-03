/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  gb-topbar.js — Smart TopBar Component · Glitched Box           ║
 * ║  Inyecta automáticamente la barra sticky post-header            ║
 * ║  con detección de contexto por pathname.                        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * USO: Incluir <script src="gb-topbar.js"></script> en el <head>
 *      o al final del <body> de cualquier página.
 *
 * CONTEXTOS DETECTADOS:
 *   • /index.html  o "/"           → Solo idioma + tema (sin topbar)
 *   • /all-products, /product-page → Breadcrumbs dinámicos
 *   • /login, /register, /auth/*   → Botón "Volver"
 *   • /checkout                    → Botón "Volver" + encabezado seguro
 *   • Resto de páginas             → Breadcrumbs dinámicos por defecto
 *
 * El componente respeta el sistema de diseño:
 *   - .top-bar + .layout__container + .top-bar__content
 *   - .topbar-back para el botón morado
 *   - .language-selector y .theme-switch de gb-core.css
 */

(function () {
  'use strict';

  // ── Iconos SVG inline ─────────────────────────────────────────────
  const ICON_BACK = `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13 4L7 10L13 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const ICON_LANG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clip-rule="evenodd"/>
  </svg>`;

  const ICON_CHEVRON = `<svg class="language-toggle-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
  </svg>`;

  // ── Detección de contexto ─────────────────────────────────────────
  const path = window.location.pathname.toLowerCase();
  const filename = path.split('/').pop() || 'index.html';

  const isIndex    = filename === '' || filename === 'index.html';
  const isAuth     = /^(login|register|forgot-password|change-password)\.html$/.test(filename);
  const isCheckout = filename === 'checkout.html';
  const isProduct  = filename === 'product-page.html';
  const isStore    = filename === 'all-products.html';

  // ── Mapa de rutas legibles para breadcrumbs ───────────────────────
  const ROUTE_LABELS = {
    'index.html':          'Inicio',
    'all-products.html':   'Tienda',
    'product-page.html':   'Producto',
    'cart.html':           'Carrito',
    'checkout.html':       'Pago seguro',
    'favorites.html':      'Favoritos',
    'my-account.html':     'Mi cuenta',
    'orders.html':         'Mis pedidos',
    'login.html':          'Iniciar sesión',
    'register.html':       'Registro',
  };

  // ── Construir el HTML de los controles (lang + theme) ─────────────
  function buildControls() {
    return `
      <div class="language-selector" id="topbarLangSelector">
        <button class="language-toggle" id="topbarLangToggle" aria-label="Cambiar idioma" type="button">
          ${ICON_LANG}
          <span id="topbarCurrentLang">ES</span>
          ${ICON_CHEVRON}
        </button>
        <div class="language-dropdown" role="menu">
          <button class="language-option active" data-lang="es" role="menuitem">
            <span class="fi fi-mx"></span> Español
          </button>
          <button class="language-option" data-lang="en" role="menuitem">
            <span class="fi fi-us"></span> English
          </button>
        </div>
      </div>

      <label class="theme-switch" aria-label="Cambiar tema">
        <input id="topbarThemeToggle" type="checkbox" class="theme-switch__checkbox" data-theme-toggle aria-label="Cambiar tema claro/oscuro">
        <div class="theme-switch__container" aria-hidden="true">
          <div class="theme-switch__clouds"></div>
          <div class="theme-switch__stars-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none" aria-hidden="true">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M135.8 3c-.8.9-1.7 1.3-2.8 1.4 1.1.1 2 .5 2.8 1.4.8.9 1.2 1.9 1.2 3.1 0-.8.2-1.5.5-2.1.4-.7.9-1.2 1.5-1.6.6-.4 1.3-.6 2.1-.6-1.1-.1-2.1-.5-2.9-1.4C137.4 2.2 137 1.2 137 0c0 1.2-.4 2.2-1.2 3ZM31 23.4c1.1-.1 2-.5 2.8-1.4.8-.9 1.2-1.8 1.2-3 0 1.2.4 2.1 1.2 3 .8.9 1.7 1.3 2.8 1.4-.7 0-1.4.2-2 .6-.6.4-1.1.9-1.5 1.6-.4.7-.5 1.4-.5 2.1 0-1.2-.4-2.2-1.2-3.1-.8-.9-1.7-1.3-2.8-1.4Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="theme-switch__circle-container">
            <div class="theme-switch__sun-moon-container">
              <div class="theme-switch__moon">
                <div class="theme-switch__spot"></div>
                <div class="theme-switch__spot"></div>
                <div class="theme-switch__spot"></div>
              </div>
            </div>
          </div>
        </div>
      </label>`;
  }

  // ── Construir breadcrumbs dinámicos ───────────────────────────────
  function buildBreadcrumbs() {
    const label = ROUTE_LABELS[filename] || document.title.split('—')[0].trim();

    // Read product name from data attribute if product page
    let currentLabel = label;
    if (isProduct) {
      const productTitle = document.querySelector('[data-product-name]');
      if (productTitle) currentLabel = productTitle.dataset.productName;
    }

    return `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="index.html" class="breadcrumb-link">Inicio</a>
        <span class="breadcrumb-sep" aria-hidden="true">›</span>
        ${isProduct
          ? `<a href="all-products.html" class="breadcrumb-link">Tienda</a>
             <span class="breadcrumb-sep" aria-hidden="true">›</span>
             <span class="breadcrumb-current" aria-current="page">${currentLabel}</span>`
          : `<span class="breadcrumb-current" aria-current="page">${currentLabel}</span>`
        }
      </nav>`;
  }

  // ── Construir botón Volver ────────────────────────────────────────
  function buildBackButton() {
    // For auth pages: back to previous page or index
    const backHref = (document.referrer && document.referrer.includes(window.location.hostname))
      ? 'javascript:history.back()'
      : 'index.html';

    return `
      <a href="${backHref}" class="icon-button topbar-back" aria-label="Volver">
        ${ICON_BACK}
        <span>Volver</span>
      </a>`;
  }

  // ── Construir la topbar completa ──────────────────────────────────
  function buildTopBar() {
    let leftContent = '';

    if (isIndex) {
      // Index: no topbar needed (breadcrumbs-bar is used instead via HTML)
      return null;
    } else if (isAuth || isCheckout) {
      leftContent = buildBackButton();
    } else {
      leftContent = buildBreadcrumbs();
    }

    return `
      <div class="top-bar" role="navigation" aria-label="Navegación secundaria">
        <div class="layout__container">
          <div class="top-bar__content">
            ${leftContent}
            ${buildControls()}
          </div>
        </div>
      </div>`;
  }

  // ── Inyectar el componente ────────────────────────────────────────
  function inject() {
    // Don't inject if a .top-bar or .breadcrumbs-bar already exists in the DOM
    if (document.querySelector('.top-bar') || document.querySelector('.breadcrumbs-bar')) {
      // Top bar exists — just sync the theme toggle state
      syncTheme();
      return;
    }

    const html = buildTopBar();
    if (!html) return;

    // Insert after the main <header> (primary nav)
    const header = document.querySelector('header.site-header') || document.querySelector('header');
    if (header) {
      header.insertAdjacentHTML('afterend', html);
    } else {
      document.body.insertAdjacentHTML('afterbegin', html);
    }

    // Initialize language selector for injected topbar
    initLangSelector();
    syncTheme();
  }

  // ── Sync theme toggle state ───────────────────────────────────────
  function syncTheme() {
    const savedTheme = localStorage.getItem('gb_theme') || 'dark';
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(t => { t.checked = savedTheme === 'light'; });
  }

  // ── Language selector init for injected instance ──────────────────
  function initLangSelector() {
    const selector = document.getElementById('topbarLangSelector');
    const toggle   = document.getElementById('topbarLangToggle');
    if (!selector || !toggle) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      selector.classList.toggle('is-open');
    });

    document.addEventListener('click', () => {
      selector.classList.remove('is-open');
    });
  }

  // ── Run ───────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
