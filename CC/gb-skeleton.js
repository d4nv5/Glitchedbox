/* ============================================================
   gb-skeleton.js — Glitched Box
   Sistema de skeleton screens

   API pública:
     GBSkeleton.show(context)   — muestra skeleton
     GBSkeleton.hide(context)   — oculta skeleton y muestra contenido

   Contextos:
     'products'    grilla de productos (all-products.html)
     'collections' grilla de colecciones (colecciones.html)
     'cart'        lista de items + resumen (cart.html)
     'favorites'   grid de favoritos (favorites.html)
     'product'     página de producto (product-page.html)
     'checkout'    sidebar del checkout (checkout.html)

   INTEGRACIÓN RÁPIDA:
     // Al inicio de tu JS de datos:
     GBSkeleton.show('products');
     // Cuando los datos estén listos:
     GBSkeleton.hide('products');
   ============================================================ */

const GBSkeleton = (() => {
  'use strict';

  /* ── §1  Helpers ─────────────────────────────────────────── */

  /** Crea un bloque skeleton con clases dadas */
  function sk(...classes) {
    const el = document.createElement('div');
    el.className = ['sk-block', ...classes].join(' ');
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  /** Inserta N repeticiones de un fragmento en un contenedor */
  function repeat(container, count, buildFn) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) frag.appendChild(buildFn(i));
    container.appendChild(frag);
  }

  /* ── §2  Builders — crean el HTML del skeleton ───────────── */

  /**
   * product-card skeleton (usado en grillas de productos Y favoritos)
   * Replica: .product-card.glow-border
   */
  function buildProductCard() {
    const card = document.createElement('div');
    card.className = 'sk-product-card';
    card.setAttribute('aria-hidden', 'true');

    // Imagen 1:1
    card.appendChild(sk('sk-block--img', 'sk-product-card__img'));

    // Info
    const body = document.createElement('div');
    body.className = 'sk-product-card__body';
    body.appendChild(sk('sk-product-card__title'));
    body.appendChild(sk('sk-product-card__stars'));
    body.appendChild(sk('sk-product-card__price'));
    body.appendChild(sk('sk-product-card__sub'));
    body.appendChild(sk('sk-product-card__btn'));
    card.appendChild(body);

    return card;
  }

  /**
   * collection-card skeleton
   * Replica: .collection-card (colecciones.html)
   */
  function buildCollectionCard() {
    const card = document.createElement('div');
    card.className = 'sk-collection-card';
    card.setAttribute('aria-hidden', 'true');

    card.appendChild(sk('sk-block--img', 'sk-collection-card__img'));

    const body = document.createElement('div');
    body.className = 'sk-collection-card__body';
    body.appendChild(sk('sk-collection-card__badge'));
    body.appendChild(sk('sk-collection-card__title'));
    body.appendChild(sk('sk-collection-card__desc-1'));
    body.appendChild(sk('sk-collection-card__desc-2'));
    body.appendChild(sk('sk-collection-card__desc-3'));
    body.appendChild(sk('sk-collection-card__btn'));
    card.appendChild(body);

    return card;
  }

  /**
   * cart-item skeleton
   * Replica: .cart-item (cart.html)
   */
  function buildCartItem() {
    const item = document.createElement('div');
    item.className = 'sk-cart-item';
    item.setAttribute('aria-hidden', 'true');

    item.appendChild(sk('sk-block--img', 'sk-cart-item__img'));

    const info = document.createElement('div');
    info.className = 'sk-cart-item__info';
    info.appendChild(sk('sk-cart-item__name'));
    info.appendChild(sk('sk-cart-item__meta'));
    info.appendChild(sk('sk-cart-item__meta2'));

    const controls = document.createElement('div');
    controls.className = 'sk-cart-item__controls';
    controls.appendChild(sk('sk-cart-item__qty'));
    controls.appendChild(sk('sk-cart-item__acts'));
    info.appendChild(controls);

    item.appendChild(info);
    item.appendChild(sk('sk-cart-item__price'));
    return item;
  }

  /**
   * cart-summary skeleton
   * Replica: .cart-summary (cart.html)
   */
  function buildCartSummary() {
    const box = document.createElement('div');
    box.className = 'sk-cart-summary';
    box.setAttribute('aria-hidden', 'true');

    box.appendChild(sk('sk-cart-summary__title'));

    // 3 filas de totales
    for (let i = 0; i < 2; i++) {
      const row = document.createElement('div');
      row.className = 'sk-cart-summary__row';
      row.appendChild(sk('sk-cart-summary__row-label'));
      row.appendChild(sk('sk-cart-summary__row-val'));
      box.appendChild(row);
    }

    box.appendChild(Object.assign(document.createElement('div'), { className: 'sk-cart-summary__divider' }));

    const totalRow = document.createElement('div');
    totalRow.className = 'sk-cart-summary__row';
    totalRow.appendChild(sk('sk-cart-summary__total-label'));
    totalRow.appendChild(sk('sk-cart-summary__total-val'));
    box.appendChild(totalRow);

    box.appendChild(sk('sk-cart-summary__btn'));
    return box;
  }

  /**
   * product-page skeleton
   * Replica: .product-top (product-page.html)
   */
  function buildProductTop() {
    const wrap = document.createElement('div');
    wrap.className = 'sk-product-top';
    wrap.setAttribute('aria-hidden', 'true');

    // Columna izquierda — imágenes
    const imgs = document.createElement('div');
    imgs.className = 'sk-product-images';
    imgs.appendChild(sk('sk-block--img', 'sk-product-images__main'));

    const thumbs = document.createElement('div');
    thumbs.className = 'sk-product-images__thumbs';
    for (let i = 0; i < 4; i++) thumbs.appendChild(sk('sk-product-images__thumb'));
    imgs.appendChild(thumbs);
    wrap.appendChild(imgs);

    // Columna derecha — info
    const info = document.createElement('div');
    info.className = 'sk-product-info';
    info.appendChild(sk('sk-product-info__badge'));
    info.appendChild(sk('sk-product-info__title'));
    info.appendChild(sk('sk-product-info__stars'));
    info.appendChild(sk('sk-product-info__price'));
    info.appendChild(sk('sk-product-info__desc-1'));
    info.appendChild(sk('sk-product-info__desc-2'));
    info.appendChild(sk('sk-product-info__desc-3'));

    // Variantes
    info.appendChild(sk('sk-product-info__variants-label'));
    const variants = document.createElement('div');
    variants.className = 'sk-product-info__variants';
    for (let i = 0; i < 4; i++) variants.appendChild(sk('sk-block--round', 'sk-product-info__variant-pill'));
    info.appendChild(variants);

    // Cantidad
    info.appendChild(sk('sk-product-info__qty-label'));
    info.appendChild(sk('sk-product-info__qty'));

    // Botones
    info.appendChild(sk('sk-product-info__btn-cart'));
    info.appendChild(sk('sk-product-info__btn-buy'));
    wrap.appendChild(info);

    return wrap;
  }

  /**
   * checkout sidebar skeleton
   * Replica: .co-summary__item + totales (checkout.html)
   */
  function buildCheckoutItem() {
    const item = document.createElement('div');
    item.className = 'sk-co-item';
    item.setAttribute('aria-hidden', 'true');

    item.appendChild(sk('sk-co-item__img'));

    const info = document.createElement('div');
    info.className = 'sk-co-item__info';
    info.appendChild(sk('sk-co-item__name'));
    info.appendChild(sk('sk-co-item__variant'));
    item.appendChild(info);

    item.appendChild(sk('sk-co-item__price'));
    return item;
  }

  function buildCheckoutTotals() {
    const box = document.createElement('div');
    box.className = 'sk-co-totals';
    box.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 2; i++) {
      const row = document.createElement('div');
      row.className = 'sk-co-totals__row';
      row.appendChild(sk('sk-co-totals__label'));
      row.appendChild(sk('sk-co-totals__val'));
      box.appendChild(row);
    }

    const totalRow = document.createElement('div');
    totalRow.className = 'sk-co-totals__row';
    totalRow.appendChild(sk('sk-co-totals__total-label'));
    totalRow.appendChild(sk('sk-co-totals__total-val'));
    box.appendChild(totalRow);

    return box;
  }

  /* ── §3  Mapa de contextos ───────────────────────────────── */

  /**
   * Cada contexto define:
   *  targets  — selectores a marcar con .is-loading
   *  render() — función que inserta el skeleton en el DOM
   *  cleanup  — clase o selector que se elimina al hacer hide()
   */
  const CONTEXTS = {

    /* ─── Grilla de productos ─── */
    products: {
      targets: ['.products-grid'],
      render() {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;
        grid.classList.add('is-loading');
        // Insertar 8 product-cards skeleton dentro del grid
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 8; i++) frag.appendChild(buildProductCard());
        grid.appendChild(frag);
      },
      cleanup: '.sk-product-card',
    },

    /* ─── Grilla de colecciones ─── */
    collections: {
      targets: ['.collections-grid'],
      render() {
        const grid = document.querySelector('.collections-grid');
        if (!grid) return;
        grid.classList.add('is-loading');
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 4; i++) frag.appendChild(buildCollectionCard());
        grid.appendChild(frag);
      },
      cleanup: '.sk-collection-card',
    },

    /* ─── Carrito ─── */
    cart: {
      targets: ['#cartItemsList', '.cart-summary'],
      render() {
        const list = document.querySelector('#cartItemsList');
        const summary = document.querySelector('.cart-summary');
        if (list) {
          list.classList.add('is-loading');
          const frag = document.createDocumentFragment();
          for (let i = 0; i < 3; i++) frag.appendChild(buildCartItem());
          list.appendChild(frag);
        }
        if (summary) {
          summary.classList.add('is-loading');
          summary.appendChild(buildCartSummary());
        }
      },
      cleanup: '.sk-cart-item, .sk-cart-summary',
    },

    /* ─── Favoritos ─── */
    favorites: {
      targets: ['#favoritesGrid'],
      render() {
        const grid = document.querySelector('#favoritesGrid');
        if (!grid) return;
        grid.classList.add('is-loading');
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 6; i++) frag.appendChild(buildProductCard());
        grid.appendChild(frag);
      },
      cleanup: '.sk-product-card',
    },

    /* ─── Página de producto ─── */
    product: {
      targets: ['.product-top'],
      render() {
        const top = document.querySelector('.product-top');
        if (!top) return;
        top.classList.add('is-loading');
        top.appendChild(buildProductTop());
      },
      cleanup: '.sk-product-top',
    },

    /* ─── Checkout sidebar ─── */
    checkout: {
      targets: ['#checkoutSummaryItems'],
      render() {
        const items = document.querySelector('#checkoutSummaryItems');
        if (!items) return;
        items.classList.add('is-loading');
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 2; i++) frag.appendChild(buildCheckoutItem());
        frag.appendChild(buildCheckoutTotals());
        items.appendChild(frag);
      },
      cleanup: '.sk-co-item, .sk-co-totals',
    },

  };

  /* ── §4  API pública ─────────────────────────────────────── */

  /**
   * Muestra el skeleton para un contexto.
   * @param {string} context — clave de CONTEXTS
   */
  function show(context) {
    const ctx = CONTEXTS[context];
    if (!ctx) { console.warn(`GBSkeleton: contexto desconocido "${context}"`); return; }
    ctx.render();
  }

  /**
   * Oculta el skeleton y deja visible el contenido real.
   * @param {string} context — clave de CONTEXTS
   */
  function hide(context) {
    const ctx = CONTEXTS[context];
    if (!ctx) return;

    // Eliminar nodos skeleton
    ctx.targets.forEach(sel => {
      const container = document.querySelector(sel);
      if (!container) return;

      // Remover clase is-loading → revela contenido real
      container.classList.remove('is-loading');

      // Eliminar nodos skeleton insertados
      const cleanup = ctx.cleanup.split(',').map(s => s.trim());
      cleanup.forEach(cleanSel => {
        container.querySelectorAll(cleanSel).forEach(node => node.remove());
      });
    });
  }

  /**
   * Auto-detecta la página actual y muestra su skeleton
   * inmediatamente. Útil para llamarlo al inicio del script.
   */
  function autoShow() {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    const map = {
      'all-products.html':  'products',
      'favorites.html':     'favorites',
      'cart.html':          'cart',
      'product-page.html':  'product',
      'checkout.html':      'checkout',
      'colecciones.html':   'collections',
    };
    const ctx = map[filename];
    if (ctx) show(ctx);
  }

  return { show, hide, autoShow };

})();

/* ─── Auto-inicializar si se añade data-skeleton-auto al <script> ─── */
document.currentScript &&
  document.currentScript.hasAttribute('data-skeleton-auto') &&
  GBSkeleton.autoShow();
