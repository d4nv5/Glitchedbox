// ============================================================
// checkout.js — Glitched Box
// Flujo progresivo: Paso 1 (datos) → Paso 2 (envío) → Paso 3 (pago)
// ============================================================

// ── Regex de validación ──────────────────────────────────────
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RE_PHONE = /^[0-9]{10}$/;
const RE_ZIP   = /^[0-9]{5}$/;
const VALID_PROMOS = { 'GLITCH10': 0.10, 'GLITCH20': 0.20 };

// ── Estado compartido ────────────────────────────────────────
const state = {
  step1: { firstName: '', lastName: '', email: '', phone: '' },
  step2: { street: '', colonia: '', city: '', state: '', zip: '' },
  promoDiscount: 0,
  subtotal: 3200,
  shipping: 0,
};

// ── Helpers ──────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function formatMXN(n) {
  return '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2 }) + ' MXN';
}

// Muestra error en un input
function setError(inputEl, errorEl, msg) {
  inputEl.classList.add('is-error');
  if (errorEl) errorEl.textContent = msg;
}

// Limpia error de un input
function clearError(inputEl, errorEl) {
  inputEl.classList.remove('is-error');
  if (errorEl) errorEl.textContent = '';
}

// Valida un input y retorna bool
function validateField(inputEl, errorEl, { required = true, regex, label = 'Este campo' } = {}) {
  const val = inputEl.value.trim();
  if (required && !val) {
    setError(inputEl, errorEl, `${label} es requerido`);
    return false;
  }
  if (regex && val && !regex.test(val)) {
    setError(inputEl, errorEl, `Formato inválido`);
    return false;
  }
  clearError(inputEl, errorEl);
  return true;
}

// ── Desbloquear siguiente paso ───────────────────────────────
function unlockStep(stepNum) {
  const section = $(`step${stepNum}`);
  const body    = $(`step${stepNum}Body`);
  const title   = section.querySelector('.co-step__title');

  section.classList.remove('co-step--locked');
  body.hidden = false;
  title.classList.remove('co-step__title--muted');
  section.querySelector('.co-step__number').style.background = '';

  // Scroll suave al nuevo paso
  setTimeout(() => {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

// ── Colapsar paso completado ─────────────────────────────────
function collapseStep(stepNum, summaryHTML) {
  const body    = $(`step${stepNum}Body`);
  const summary = $(`step${stepNum}Summary`);

  body.hidden = true;
  if (summary) {
    const infoEl = $(`step${stepNum}SummaryInfo`);
    if (infoEl) infoEl.innerHTML = summaryHTML;
    summary.hidden = false;
  }
}

// ── Editar paso colapsado ────────────────────────────────────
function editStep(stepNum) {
  const body    = $(`step${stepNum}Body`);
  const summary = $(`step${stepNum}Summary`);

  body.hidden = false;
  if (summary) summary.hidden = true;

  // Re-bloquear los pasos posteriores
  for (let i = stepNum + 1; i <= 3; i++) {
    const section = $(`step${i}`);
    const body_   = $(`step${i}Body`);
    const sum_    = $(`step${i}Summary`);
    const title_  = section.querySelector('.co-step__title');

    section.classList.add('co-step--locked');
    if (body_) body_.hidden = true;
    if (sum_) sum_.hidden = true;
    if (title_) title_.classList.add('co-step__title--muted');
  }

  $(`step${stepNum}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ════════════════════════════════
// PASO 1: DATOS PERSONALES
// ════════════════════════════════
function setupStep1() {
  const btn = $('continueToShipping');
  if (!btn) return;

  // Limpiar errores on-input
  ['firstName','lastName','email','phone'].forEach(id => {
    const input = $(id);
    const error = $(`${id}Error`);
    if (input) input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) clearError(input, error);
    });
  });

  btn.addEventListener('click', () => {
    const valid = [
      validateField($('firstName'), $('firstNameError'), { label: 'Nombre' }),
      validateField($('lastName'),  $('lastNameError'),  { label: 'Apellidos' }),
      validateField($('email'),     $('emailError'),     { label: 'Correo', regex: RE_EMAIL }),
      validateField($('phone'),     $('phoneError'),     { label: 'Teléfono', regex: RE_PHONE }),
    ].every(Boolean);

    if (!valid) return;

    // Guardar en state
    state.step1 = {
      firstName: $('firstName').value.trim(),
      lastName:  $('lastName').value.trim(),
      email:     $('email').value.trim(),
      phone:     $('phone').value.trim(),
    };

    // Precargar paso 2 con nombre y teléfono
    const sf = $('shipFirstName'), sl = $('shipLastName'), sp = $('shipPhone');
    if (sf && !sf.value) sf.value = state.step1.firstName;
    if (sl && !sl.value) sl.value = state.step1.lastName;
    if (sp && !sp.value) sp.value = state.step1.phone;

    // Colapsar paso 1
    const summaryHTML = `
      <strong>${state.step1.firstName} ${state.step1.lastName}</strong>
      ${state.step1.phone}<br>${state.step1.email}
    `;
    collapseStep(1, summaryHTML);

    // Desbloquear paso 2
    unlockStep(2);
  });
}

// ── Calcular y mostrar precio de envío ────────────────────────
const SHIPPING_THRESHOLD = 2500;
const SHIPPING_COST = 150;

function updateDeliveryPrice() {
  const priceEl = document.getElementById('deliveryPrice');
  if (!priceEl) return;

  const afterDiscount = state.subtotal - state.promoDiscount;
  const isFree = afterDiscount >= SHIPPING_THRESHOLD;

  state.shipping = isFree ? 0 : SHIPPING_COST;

  if (isFree) {
    priceEl.textContent = 'Gratis';
    priceEl.classList.add('co-delivery-option__price--free');
    priceEl.classList.remove('co-delivery-option__price--paid');
  } else {
    priceEl.textContent = formatMXN(SHIPPING_COST);
    priceEl.classList.remove('co-delivery-option__price--free');
    priceEl.classList.add('co-delivery-option__price--paid');
  }

  updateTotals();
}

// ════════════════════════════════
// PASO 2: ENVÍO
// ════════════════════════════════
function setupStep2() {
  const btn = $('continueToPayment');
  if (!btn) return;

  const fields = [
    { id: 'shipFirstName', label: 'Nombre' },
    { id: 'shipLastName',  label: 'Apellido' },
    { id: 'shipPhone',     label: 'Teléfono', regex: RE_PHONE },
    { id: 'shipStreet',    label: 'Calle y número' },
    { id: 'shipColonia',   label: 'Colonia' },
    { id: 'shipCity',      label: 'Ciudad' },
    { id: 'shipState',     label: 'Estado' },
    { id: 'shipZip',       label: 'Código postal', regex: RE_ZIP },
  ];

  // Limpiar errores on-input
  fields.forEach(({ id }) => {
    const input = $(id);
    const error = $(`${id}Error`);
    if (input) input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) clearError(input, error);
    });
  });

  btn.addEventListener('click', () => {
    const valid = fields.map(({ id, label, regex }) =>
      validateField($(id), $(`${id}Error`), { label, regex })
    ).every(Boolean);

    if (!valid) return;

    // Guardar en state
    const stateEl = $('shipState');
    const stateText = stateEl.options[stateEl.selectedIndex]?.text || '';
    state.step2 = {
      firstName: $('shipFirstName').value.trim(),
      lastName:  $('shipLastName').value.trim(),
      phone:     $('shipPhone').value.trim(),
      street:    $('shipStreet').value.trim(),
      colonia:   $('shipColonia').value.trim(),
      city:      $('shipCity').value.trim(),
      state:     stateText,
      zip:       $('shipZip').value.trim(),
    };

    // Actualizar dirección de facturación en paso 3
    updateBillingAddress();

    // Colapsar paso 2
    const summaryHTML = `
      <strong>Dirección de envío</strong>
      ${state.step2.firstName} ${state.step2.lastName}<br>
      ${state.step2.phone}<br>
      ${state.step2.street}, ${state.step2.colonia}<br>
      ${state.step2.city}, ${state.step2.state}, ${state.step2.zip}
    `;
    collapseStep(2, summaryHTML);

    // Desbloquear paso 3
    unlockStep(3);
  });
}

// ── Actualizar tarjeta de dirección de facturación ────────────
function updateBillingAddress() {
  const card = $('billingAddressCard');
  if (!card) return;
  const s = state.step2;
  card.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z" stroke-linejoin="round"/>
    </svg>
    <p style="margin:0">${s.firstName} ${s.lastName}</p>
    <p style="margin:0">${s.phone}</p>
    <p style="margin:0">${s.street}</p>
    <p style="margin:0">${s.colonia}</p>
    <p style="margin:0">${s.city}, ${s.state}, ${s.zip}</p>
    <p style="margin:0">México</p>
  `;
}

// ════════════════════════════════
// PASO 3: PAGO — CHIPS + FORMULARIO
// ════════════════════════════════
const CARD_REGEX = /^[0-9]{13,19}$/;
const CVV_REGEX  = /^[0-9]{3,4}$/;

function setupStep3() {
  const btn = $('placeOrder');
  if (!btn) return;

  // ── Chips de método de pago ──
  const chips = document.querySelectorAll('.co-pay-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Desactivar todos
      chips.forEach(c => {
        c.classList.remove('co-pay-chip--active');
        c.setAttribute('aria-pressed', 'false');
      });
      // Activar el seleccionado
      chip.classList.add('co-pay-chip--active');
      chip.setAttribute('aria-pressed', 'true');

      // Ocultar todos los paneles
      document.querySelectorAll('.co-pay-panel').forEach(p => {
        p.classList.add('co-pay-panel--hidden');
      });
      // Mostrar el panel correspondiente
      const panel = document.getElementById(`panel-${chip.dataset.method}`);
      if (panel) {
        panel.classList.remove('co-pay-panel--hidden');
      }
    });
  });

  // ── Formateo de número de tarjeta ──
  const cardNumberEl = $('cardNumber');
  if (cardNumberEl) {
    cardNumberEl.addEventListener('input', e => {
      let val = e.target.value.replace(/\D/g, '');
      val = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = val;
      // Detectar marca
      updateCardBrand(val.replace(/\s/g, ''));
    });
  }

  // ── Formateo de fecha de expiración ──
  const cardExpiryEl = $('cardExpiry');
  if (cardExpiryEl) {
    cardExpiryEl.addEventListener('input', e => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 2) val = val.slice(0, 2) + ' / ' + val.slice(2, 4);
      e.target.value = val;
    });
  }

  // ── Solo números en CVV ──
  const cvvEl = $('cardCvv');
  if (cvvEl) {
    cvvEl.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // ── Limpiar errores on-input ──
  ['cardName','cardNumber','cardExpiry','cardCvv'].forEach(id => {
    const el = $(id);
    const er = $(`${id}Error`);
    if (el) el.addEventListener('input', () => {
      if (el.classList.contains('is-error')) clearError(el, er);
    });
  });

  // ── Botón realizar pedido ──
  btn.addEventListener('click', () => {
    const activeChip = document.querySelector('.co-pay-chip--active');
    const method = activeChip?.dataset.method || 'card';

    // Validar solo si es tarjeta
    if (method === 'card') {
      const cardNum = $('cardNumber');
      const rawNum = cardNum ? cardNum.value.replace(/\s/g, '') : '';
      const valid = [
        validateField($('cardName'),   $('cardNameError'),   { label: 'Nombre del titular' }),
        validateField(cardNum,         $('cardNumberError'), { label: 'Número de tarjeta', regex: CARD_REGEX }),
        validateField($('cardExpiry'), $('cardExpiryError'), { label: 'Fecha de expiración' }),
        validateField($('cardCvv'),    $('cardCvvError'),    { label: 'CVV', regex: CVV_REGEX }),
      ].every(Boolean);

      if (!valid) return;
    }

    // Procesar
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      Procesando...
    `;
    setTimeout(() => {
      window.location.href = 'order-confirmed.html';
    }, 1500);
  });
}

// ── Detectar marca de tarjeta ─────────────────────────────────
function updateCardBrand(num) {
  const el = $('cardBrand');
  if (!el) return;
  if (/^4/.test(num)) {
    el.textContent = 'VISA';
    el.style.color = '#1A1F71';
  } else if (/^5[1-5]|^2[2-7]/.test(num)) {
    el.textContent = 'MC';
    el.style.color = '#EB001B';
  } else {
    el.textContent = '';
  }
}

// ════════════════════════════════
// EDITAR PASOS (botón Editar)
// ════════════════════════════════
function setupEditButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-edit-step]');
    if (btn) editStep(parseInt(btn.dataset.editStep, 10));
  });
}

// ════════════════════════════════
// PROMO EN EL SIDEBAR
// ════════════════════════════════
function setupPromo() {
  const toggle   = $('promoToggle');
  const form     = $('promoForm');
  const input    = $('promoInput');
  const applyBtn = $('applyPromo');
  const feedback = $('promoFeedback');

  if (!toggle || !form) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    form.hidden = expanded;
    toggle.querySelector('.co-summary__promo-toggle-icon').textContent = expanded ? '--' : '×';
  });

  if (!applyBtn || !input) return;

  applyBtn.addEventListener('click', applyPromoCode);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') applyPromoCode(); });

  function applyPromoCode() {
    const code = input.value.trim().toUpperCase();
    feedback.className = 'co-summary__promo-feedback';

    if (!code) {
      feedback.textContent = 'Ingresa un código primero.';
      feedback.classList.add('is-error');
      return;
    }

    const pct = VALID_PROMOS[code];
    if (pct) {
      state.promoDiscount = Math.round(state.subtotal * pct);
      feedback.textContent = `¡Código aplicado! ${pct * 100}% de descuento.`;
      feedback.classList.add('is-success');
      input.disabled = true;
      applyBtn.disabled = true;
      applyBtn.textContent = '✓ Aplicado';
      updateDeliveryPrice(); // recalcula envío + totales
    } else {
      feedback.textContent = 'Código no válido o expirado.';
      feedback.classList.add('is-error');
    }
  }
}

// ── Actualizar totales en sidebar ────────────────────────────
function updateTotals() {
  const afterDiscount = state.subtotal - state.promoDiscount;
  const total = afterDiscount + state.shipping;

  const subtotalEl = $('coSubtotal');
  const totalEl    = $('coTotal');

  if (subtotalEl) subtotalEl.textContent = formatMXN(afterDiscount);
  if (totalEl)    totalEl.textContent    = formatMXN(total);
}

// ── Logo dinámico (hereda patrón de gb-core) ─────────────────
function syncLogo() {
  const logo = $('checkoutLogo');
  if (!logo) return;

  function apply() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    logo.src = theme === 'light'
      ? (logo.dataset.logoLight || logo.src)
      : (logo.dataset.logoDark  || logo.src);
  }

  apply();
  new MutationObserver(apply).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}

// ── Renderizar ítems del carrito en el resumen ────────────────
function renderSummaryItems() {
  const container = $('checkoutSummaryItems');
  if (!container) return;

  // Leer carrito desde localStorage
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('gb_cart') || '[]'); } catch(e) {}

  if (!cart.length) {
    container.innerHTML = '<p style="font-size:var(--t-sm);color:var(--color-text-muted);padding:var(--size-4) 0;">Tu carrito está vacío.</p>';
    return;
  }

  // Calcular subtotal real desde el carrito
  state.subtotal = cart.reduce((t, i) => t + (i.price || 0) * (i.quantity || 1), 0);

  container.innerHTML = cart.map(item => {
    const qty    = item.quantity || 1;
    const price  = (item.price || 0) * qty;
    const imgTag = item.image
      ? `<img src="${item.image}" alt="${item.name || ''}" loading="lazy" width="64" height="64" />`
      : `<span style="font-size:2rem;">${item.emoji || '📦'}</span>`;
    return `
      <div class="co-summary__item">
        <div class="co-summary__item-img">
          ${imgTag}
          <span class="co-summary__item-qty">${qty}</span>
        </div>
        <div class="co-summary__item-info">
          <p class="co-summary__item-name">${item.name || 'Producto'}</p>
          <p class="co-summary__item-variant">${item.variant || ''}</p>
        </div>
        <p class="co-summary__item-price">${formatMXN(price)}</p>
      </div>`;
  }).join('');

  // También actualizar el contador de artículos en paso 2
  const totalQty = cart.reduce((t, i) => t + (i.quantity || 1), 0);
  const countEl  = $('shippingItemCount');
  if (countEl) countEl.textContent = `${totalQty} artículo${totalQty !== 1 ? 's' : ''}`;
}

// ── Init ─────────────────────────────────────────────────────
function init() {
  renderSummaryItems(); // Lee gb_cart y renderiza ítems reales
  setupStep1();
  setupStep2();
  setupStep3();
  setupEditButtons();
  setupPromo();
  syncLogo();
  updateDeliveryPrice(); // calcula envío y totales desde el inicio
  console.log('✓ GB Checkout inicializado');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
