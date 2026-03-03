// ============================================================
// cart.js — Glitched Box
// Carrito con productos: cantidad, eliminar, promo, totales
// ============================================================

const SHIPPING_THRESHOLD = 2500; // MXN para envío gratis
const SHIPPING_COST = 150;

// ── Estado del carrito — sincronizado con localStorage gb_cart ───
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem('gb_cart');
    if (raw === null) return null; // key nunca se ha creado → sesión nueva
    if (raw === '[]' || raw === '') return []; // carrito vaciado explícitamente
    const stored = JSON.parse(raw);
    // Normalizar: gb-core guarda {id, name, variant, price, quantity, image}
    // cart.js usa {id, name, variant, size, price, qty}
    return stored.map((item, idx) => ({
      id:      item.id || idx + 1,
      name:    item.name    || 'Producto',
      variant: item.variant || null,
      size:    item.size    || '',
      price:   typeof item.price === 'number' ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, '')) || 0,
      qty:     item.quantity || item.qty || 1,
      image:   item.image   || '',
    }));
  } catch { return []; }
}

function saveCartToStorage() {
  try {
    const toSave = cart.items.map(i => ({
      id:       i.id,
      name:     i.name,
      variant:  i.variant,
      price:    i.price,
      quantity: i.qty,
      image:    i.image || '',
    }));
    localStorage.setItem('gb_cart', JSON.stringify(toSave));
    // Sincronizar badge de gb-core si está disponible
    if (window.gbCart?.updateBadge) window.gbCart.updateBadge();
  } catch {}
}

const _stored = loadCartFromStorage();
const cart = {
  items: _stored !== null ? _stored : [], // null = sesión nueva, [] = vaciado
  promoDiscount: 0,
  validPromos: {
    'GLITCH10': 0.10,
    'GLITCH20': 0.20,
  }
};

// ── Helpers de formato ───────────────────────────────────────
function formatMXN(amount) {
  return '$' + amount.toLocaleString('es-MX', { minimumFractionDigits: 2 }) + ' MXN';
}

// ── Calcular totales ─────────────────────────────────────────
function calcTotals() {
  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const afterDiscount = subtotal - cart.promoDiscount;
  const shipping = afterDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = afterDiscount + shipping;
  return { subtotal, afterDiscount, shipping, total };
}

// ── Actualizar UI de totales ─────────────────────────────────
function updateSummaryUI() {
  const { subtotal, shipping, total } = calcTotals();
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shippingCost');
  const totalEl    = document.getElementById('total');
  const alertEl    = document.getElementById('shippingAlert');
  const countEl    = document.getElementById('cartItemCount');
  const badgeEl    = document.getElementById('cartBadge');

  const totalQty = cart.items.reduce((s, i) => s + i.qty, 0);

  if (subtotalEl) subtotalEl.textContent = formatMXN(subtotal);
  if (totalEl)    totalEl.textContent    = formatMXN(total);
  if (countEl)    countEl.textContent    = `(${totalQty} artículo${totalQty !== 1 ? 's' : ''})`;
  if (badgeEl)    badgeEl.textContent    = totalQty;

  if (shippingEl) {
    if (shipping === 0) {
      shippingEl.textContent = 'Gratis';
      shippingEl.className = 'cart-summary__free';
    } else {
      shippingEl.textContent = formatMXN(shipping);
      shippingEl.className   = 'cart-summary__value';
    }
  }

  if (alertEl) {
    alertEl.style.display = shipping === 0 ? 'flex' : 'none';
  }
}

// ── Eliminar item ─────────────────────────────────────────────
function removeItem(articleEl, itemId) {
  articleEl.classList.add('is-removing');
  setTimeout(() => {
    articleEl.remove();
    cart.items = cart.items.filter(i => i.id !== itemId);
    saveCartToStorage();
    updateSummaryUI();
    checkEmpty();
  }, 220);
}

// ── Mover a favoritos ─────────────────────────────────────────
function moveToWishlist(articleEl, itemId, btn) {
  btn.disabled = true;
  btn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 20 20" fill="#ef4444" aria-hidden="true">
      <path d="M10 18.35L8.55 17.03C3.4 12.36 0 9.27 0 5.5C0 2.41 2.42 0 5.5 0C7.24 0 8.91 0.81 10 2.08C11.09 0.81 12.76 0 14.5 0C17.58 0 20 2.41 20 5.5C20 9.27 16.6 12.36 11.45 17.03L10 18.35Z"/>
    </svg>
    ¡Agregado!
  `;
  setTimeout(() => removeItem(articleEl, itemId), 900);
}

// ── Estado vacío ──────────────────────────────────────────────
function checkEmpty() {
  const list = document.getElementById('cartItemsList');
  const layout = document.querySelector('.cart-layout');
  if (!list || cart.items.length > 0) return;

  list.innerHTML = '';
  if (layout) {
    layout.innerHTML = `
      <div class="cart-empty-inline">
        <svg class="cart-empty-inline__icon" width="64" height="64" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 16C4.9 16 4.01 16.9 4.01 18C4.01 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM0 0V2H2L5.6 9.59L4.24 12.04C4.09 12.32 4 12.65 4 13C4 14.1 4.9 15 6 15H18V13H6.42C6.28 13 6.17 12.89 6.17 12.75L6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.58 16.3 9.97L19.88 3.48C19.96 3.34 20 3.17 20 3C20 2.45 19.55 2 19 2H4.21L3.27 0H0ZM16 16C14.9 16 14.01 16.9 14.01 18C14.01 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16Z"/>
        </svg>
        <h2 class="cart-empty-inline__title">Tu carrito está vacío</h2>
        <p class="cart-empty-inline__desc">Agrega productos para comenzar tu compra.</p>
        <a href="all-products.html" class="cart-summary__cta" style="width:auto;padding:var(--size-4) var(--size-8);display:inline-flex;align-items:center;gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.5 22v-7.5H2L12 2l10 12.5h-3.5V22H5.5zm2-2h3v-7.5H7.5V20zm5 0h4v-7.5h-4V20z"/></svg>
          Ir a la tienda
        </a>
      </div>
    `;
  }
}

// ── Código promocional ────────────────────────────────────────
function setupPromo() {
  const btn      = document.getElementById('applyPromo');
  const input    = document.getElementById('promoCode');
  const feedback = document.getElementById('promoFeedback');
  if (!btn || !input || !feedback) return;

  btn.addEventListener('click', () => {
    const code = input.value.trim().toUpperCase();
    feedback.className = 'cart-promo__feedback';

    if (!code) {
      feedback.textContent = 'Ingresa un código primero.';
      feedback.classList.add('is-error');
      return;
    }

    const discount = cart.validPromos[code];
    if (discount) {
      const { subtotal } = calcTotals();
      cart.promoDiscount = Math.round(subtotal * discount);
      feedback.textContent = `¡Código aplicado! ${discount * 100}% de descuento.`;
      feedback.classList.add('is-success');
      input.disabled = true;
      btn.disabled   = true;
      btn.textContent = '✓ Aplicado';
      updateSummaryUI();
    } else {
      cart.promoDiscount = 0;
      feedback.textContent = 'Código no válido o expirado.';
      feedback.classList.add('is-error');
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });
}

// ── Toast de deshacer eliminación ────────────────────────────
function showUndoRemoveToast(articleEl, idx, snapshot) {
  const container = document.getElementById('gbToastContainer') || (() => {
    const el = document.createElement('div');
    el.id = 'gbToastContainer';
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(el);
    return el;
  })();

  const toast = document.createElement('div');
  toast.style.cssText = `
    display: flex; align-items: center; gap: 12px;
    background: var(--color-surface-2, #1e1e2e);
    color: var(--color-text, #fff);
    border: 1px solid var(--color-border, rgba(255,255,255,.12));
    border-radius: 10px; padding: 12px 16px;
    font-size: 14px; font-family: inherit;
    box-shadow: 0 4px 16px rgba(0,0,0,.4);
    transform: translateX(120%); transition: transform .25s ease;
    min-width: 280px; max-width: 360px;
  `;

  const msg = document.createElement('span');
  msg.style.flex = '1';
  msg.textContent = `${snapshot.name} eliminado del carrito`;

  const undoBtn = document.createElement('button');
  undoBtn.textContent = 'Deshacer';
  undoBtn.style.cssText = `
    background: var(--accent-purple, #8b5cf6); color: #fff;
    border: none; border-radius: 6px; padding: 4px 12px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    white-space: nowrap; font-family: inherit;
  `;

  let undone = false;
  undoBtn.addEventListener('click', () => {
    if (undone) return;
    undone = true;
    // Restaurar el article al DOM
    const list = document.getElementById('cartItemsList');
    const articles = list.querySelectorAll('.cart-item');
    if (idx >= articles.length) {
      list.appendChild(articleEl);
    } else {
      list.insertBefore(articleEl, articles[idx]);
    }
    articleEl.classList.remove('is-removing');
    // Restaurar en cart.items
    cart.items.splice(idx, 0, snapshot);
    saveCartToStorage();
    updateSummaryUI();
    checkEmpty();
    toast.style.transform = 'translateX(120%)';
    clearTimeout(timer);
    setTimeout(() => toast.remove(), 300);
  });

  toast.appendChild(msg);
  toast.appendChild(undoBtn);
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  }));
  const timer = setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
  undoBtn.addEventListener('click', () => clearTimeout(timer));
}

// ── Eliminar con deshacer ─────────────────────────────────────
function removeItemWithUndo(articleEl, idx) {
  const snapshot = { ...cart.items[idx] };
  articleEl.classList.add('is-removing');
  setTimeout(() => {
    articleEl.remove();
    cart.items.splice(idx, 1);
    saveCartToStorage();
    updateSummaryUI();
    checkEmpty();
    showUndoRemoveToast(articleEl, idx, snapshot);
  }, 220);
}

// ── Setup de items — conecta por índice posicional ────────────
function setupItems() {
  const articles = document.querySelectorAll('.cart-item');

  // Si localStorage está vacío o no coincide con el HTML, 
  // inicializar cart.items desde el DOM
  if (cart.items.length !== articles.length) {
    cart.items = Array.from(articles).map((article, idx) => {
      const price = parseInt(article.dataset.price, 10) || 0;
      const qty   = parseInt(article.querySelector('.qty-input')?.value, 10) || 1;
      const name  = article.querySelector('.cart-item__name')?.textContent?.trim() || 'Producto';
      const variant = article.querySelector('.cart-item__meta strong')?.textContent?.trim() || null;
      return { id: idx + 1, name, variant, price, qty, image: '' };
    });
    saveCartToStorage();
  }

  articles.forEach((article, idx) => {
    // Obtener siempre el item actual por posición
    const getItem = () => cart.items[idx];
    const item = getItem();
    if (!item) return;

    const qtyInput = article.querySelector('.qty-input');
    const btnMinus = article.querySelector('.qty-btn--minus');
    const btnPlus  = article.querySelector('.qty-btn--plus');

    function updateQty(newQty) {
      newQty = Math.max(1, Math.min(99, newQty));
      const current = getItem();
      if (!current) return;
      current.qty = newQty;
      if (qtyInput) qtyInput.value = newQty;
      const priceEl       = article.querySelector('.cart-item__price');
      const priceElMobile = article.querySelector('.cart-item__price-mobile');
      const formatted     = formatMXN(current.price * newQty);
      if (priceEl)       priceEl.textContent       = formatted;
      if (priceElMobile) priceElMobile.textContent = formatted;
      saveCartToStorage();
      updateSummaryUI();
    }

    if (btnMinus) btnMinus.addEventListener('click', () => updateQty((getItem()?.qty || 1) - 1));
    if (btnPlus)  btnPlus.addEventListener('click',  () => updateQty((getItem()?.qty || 1) + 1));
    if (qtyInput) {
      qtyInput.addEventListener('change', () => updateQty(parseInt(qtyInput.value, 10) || 1));
      qtyInput.addEventListener('blur',   () => updateQty(parseInt(qtyInput.value, 10) || 1));
    }

    // Eliminar con toast de deshacer
    const removeBtn = article.querySelector('.cart-item__remove-btn');
    if (removeBtn) removeBtn.addEventListener('click', () => {
      const currentIdx = Array.from(document.querySelectorAll('.cart-item')).indexOf(article);
      removeItemWithUndo(article, currentIdx);
    });

    // Mover a favoritos
    const wishlistBtn = article.querySelector('.cart-item__wishlist-btn');
    if (wishlistBtn) wishlistBtn.addEventListener('click', () => moveToWishlist(article, item.id, wishlistBtn));
  });
}

// ── Footer year ───────────────────────────────────────────────
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

// ── Inicialización ────────────────────────────────────────────

// ── Template HTML de un cart item ────────────────────────────
function renderCartItem(item, index) {
  const price = typeof item.price === 'number' ? item.price
    : parseInt(String(item.price).replace(/[^0-9]/g, '')) || 0;
  const qty   = item.qty || item.quantity || 1;
  const name  = item.name || 'Producto';
  const variant = item.variant || null;
  const size    = item.size    || null;
  const image   = item.image   || '';

  const imgHtml = image
    ? `<img src="${image}" alt="${name}" loading="lazy" width="100" height="100" />`
    : `<div style="width:100px;height:100px;background:var(--color-surface);border-radius:var(--radius-2);"></div>`;

  const metaHtml = [
    variant ? `<span>Versión: <strong>${variant}</strong></span>` : '',
    size    ? `<span>Tamaño: <strong>${size}</strong></span>`     : '',
  ].filter(Boolean).join('\n                  ');

  return `<article class="cart-item" data-item-id="${index + 1}" data-price="${price}">
  <div class="cart-item__image">${imgHtml}</div>
  <div class="cart-item__info">
    <h2 class="cart-item__name">${name}</h2>
    <div class="cart-item__meta">${metaHtml}</div>
    <div class="cart-item__price-mobile">${'$' + (price * qty).toLocaleString('es-MX', {minimumFractionDigits:2}) + ' MXN'}</div>
    <div class="cart-item__controls">
      <div class="qty-control" role="group" aria-label="Cantidad">
        <button class="qty-btn qty-btn--minus" aria-label="Reducir cantidad" type="button">
          <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor"><rect width="12" height="2"/></svg>
        </button>
        <input class="qty-input" type="number" value="${qty}" min="1" max="99" aria-label="Cantidad" />
        <button class="qty-btn qty-btn--plus" aria-label="Aumentar cantidad" type="button">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect y="5" width="12" height="2"/><rect x="5" width="2" height="12"/></svg>
        </button>
      </div>
      <div class="cart-item__actions">
        <button class="cart-item__wishlist-btn" type="button" aria-label="Mover a favoritos">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 18.35L8.55 17.03C3.4 12.36 0 9.27 0 5.5C0 2.41 2.42 0 5.5 0C7.24 0 8.91 0.81 10 2.08C11.09 0.81 12.76 0 14.5 0C17.58 0 20 2.41 20 5.5C20 9.27 16.6 12.36 11.45 17.03L10 18.35Z"/></svg>
          Mover a favoritos
        </button>
        <button class="cart-item__remove-btn" type="button" aria-label="Eliminar del carrito">
          <svg width="16" height="16" viewBox="0 -960 960 960" fill="var(--danger, #ef4444)" aria-hidden="true"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          Eliminar
        </button>
      </div>
    </div>
  </div>
  <div class="cart-item__price">${'$' + price.toLocaleString('es-MX', {minimumFractionDigits:2}) + ' MXN'}</div>
</article>`;
}

// ── Repoblar el DOM desde cart.items ─────────────────────────
function renderCartItems() {
  const list = document.getElementById('cartItemsList');
  if (!list) return;

  if (cart.items.length === 0) {
    checkEmpty();
    return;
  }

  // Repoblar con HTML dinámico
  list.innerHTML = cart.items.map((item, idx) => renderCartItem(item, idx)).join('\n');
}

function init() {
  // Si localStorage tiene items reales (agregados desde el sitio), renderizarlos
  // Si no, mantener los items demo del HTML como fallback y guardarlos
  if (_stored === null) {
    // Sesión nueva: usar items del DOM como demo y guardarlos en localStorage
    const articles = document.querySelectorAll('.cart-item');
    cart.items = Array.from(articles).map((article, idx) => {
      const price   = parseInt(article.dataset.price, 10) || 0;
      const qty     = parseInt(article.querySelector('.qty-input')?.value, 10) || 1;
      const name    = article.querySelector('.cart-item__name')?.textContent?.trim() || 'Producto';
      const variant = article.querySelector('.cart-item__meta strong')?.textContent?.trim() || null;
      return { id: idx + 1, name, variant, price, qty, image: '' };
    });
    saveCartToStorage();
  } else if (cart.items.length > 0) {
    // Hay items en localStorage → renderizarlos dinámicamente
    renderCartItems();
    saveCartToStorage(); // sincronizar badge
  } else {
    // Carrito vaciado explícitamente → mostrar estado vacío
    saveCartToStorage();
    checkEmpty();
  }

  setupItems();
  setupPromo();
  updateSummaryUI();
  setFooterYear();
  console.log('✓ GB Cart inicializado con', cart.items.length, 'items');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
