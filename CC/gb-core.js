// ╔══════════════════════════════════════════════════════════════════╗
// ║  GLITCHED BOX — gb-core.js  v2.0                               ║
// ║  Theme · Header · Search · Mobile menu · Language              ║
// ║  Cart · Auth state · Newsletter · Back to top                  ║
// ║  GBForms (validación centralizada) · GBToast                   ║
// ╚══════════════════════════════════════════════════════════════════╝

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // ================================================================
  // §1  STICKY HEIGHTS  (header + breadcrumbs/topbar)
  // ================================================================
  function syncStickyHeights() {
    const header      = document.querySelector(".header");
    const secondBar   = document.querySelector(".breadcrumbs-bar, .top-bar");

    if (header)    root.style.setProperty("--header-h",      `${Math.ceil(header.offsetHeight)}px`);
    if (secondBar) root.style.setProperty("--breadcrumbs-h", `${Math.ceil(secondBar.offsetHeight)}px`);
  }

  window.addEventListener("load",   syncStickyHeights);
  window.addEventListener("resize", syncStickyHeights);
  setTimeout(syncStickyHeights, 50);


  // ================================================================
  // §2  THEME (dark ↔ light)
  // ================================================================
  const themeToggle = document.querySelector("[data-theme-toggle]") ||
                      document.getElementById("themeToggle");
  const headerLogo  = document.getElementById("headerLogo");

  function setLogoForTheme(theme) {
    if (!headerLogo) return;
    const darkSrc  = headerLogo.getAttribute("data-logo-dark");
    const lightSrc = headerLogo.getAttribute("data-logo-light");
    if (darkSrc && lightSrc) {
      headerLogo.src = theme === "light" ? lightSrc : darkSrc;
    }
  }

  function getInitialTheme() {
    const saved = localStorage.getItem("gb_theme");
    if (saved === "dark" || saved === "light") return saved;
    const attr = root.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
    return "dark";
  }

  function syncToggleUI(theme) {
    if (!themeToggle) return;
    if ("checked" in themeToggle) themeToggle.checked = theme === "dark";
    themeToggle.setAttribute("aria-checked", theme === "dark" ? "true" : "false");
  }

  function updateMobileThemeToggle(theme) {
    const icon    = document.getElementById("mobileThemeIcon");
    const display = document.getElementById("mobileThemeDisplay");
    if (!icon || !display) return;

    if (theme === "dark") {
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>';
      display.textContent = "Oscuro";
    } else {
      icon.innerHTML = `<circle cx="12" cy="12" r="5" fill="currentColor"/>
        <line x1="12" y1="1"  x2="12" y2="3"  stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
        <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  stroke="currentColor" stroke-width="2"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/>
        <line x1="1"  y1="12" x2="3"  y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" stroke="currentColor" stroke-width="2"/>
        <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  stroke="currentColor" stroke-width="2"/>`;
      display.textContent = "Claro";
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("gb_theme", theme);
    syncToggleUI(theme);
    setLogoForTheme(theme);
    updateMobileThemeToggle(theme);
    requestAnimationFrame(syncStickyHeights);
  }

  applyTheme(getInitialTheme());

  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      applyTheme(themeToggle.checked ? "dark" : "light");
    });
  }


  // ================================================================
  // §3  SEARCH OVERLAY (mobile)
  // ================================================================
  const searchToggle      = document.getElementById("searchToggle");
  const searchOverlay     = document.getElementById("searchOverlay");
  const searchInputMobile = document.getElementById("searchInputMobile");
  const searchCloseNodes  = document.querySelectorAll("[data-search-close]");

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add("is-open");
    searchOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    setTimeout(() => searchInputMobile?.focus(), 0);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("is-open");
    searchOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  if (searchToggle) searchToggle.addEventListener("click", openSearch);
  searchCloseNodes.forEach(n => n.addEventListener("click", closeSearch));


  // ================================================================
  // §4  MOBILE MENU (hamburguesa)
  // ================================================================
  const hamburgerToggle = document.getElementById("hamburgerToggle");
  const mobileMenu      = document.getElementById("mobileMenu");
  const menuCloseNodes  = document.querySelectorAll("[data-menu-close]");

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  if (hamburgerToggle) hamburgerToggle.addEventListener("click", openMobileMenu);
  menuCloseNodes.forEach(n => n.addEventListener("click", closeMobileMenu));

  // Mobile theme toggle (hamburguesa)
  const mobileThemeToggle = document.getElementById("mobileThemeToggle");
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Escape key — cierra todo
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeSearch();
      closeMobileMenu();
      closeLanguageSelector();
    }
  });


  // ================================================================
  // §5  LANGUAGE SELECTOR
  // ================================================================
  const languageSelector = document.getElementById("languageSelector");
  const languageToggleEl = document.getElementById("languageToggle");
  const languageOptions  = document.querySelectorAll(".language-option");
  const currentLangSpan  = document.getElementById("currentLang");

  // Mobile lang
  const mobileLangToggle  = document.getElementById("mobileLangToggle");
  const mobileLangDisplay = document.getElementById("mobileLangDisplay");

  function openLanguageSelector()  { languageSelector?.classList.add("is-open"); }
  function closeLanguageSelector() { languageSelector?.classList.remove("is-open"); }

  if (languageToggleEl) {
    languageToggleEl.addEventListener("click", e => {
      e.stopPropagation();
      languageSelector?.classList.toggle("is-open");
    });
  }

  // Solo click para abrir/cerrar — sin hover

  function applyLang(lang) {
    localStorage.setItem("gb_lang", lang);
    const label = lang === "es" ? "ES" : "EN";
    if (currentLangSpan) currentLangSpan.textContent = label;
    if (mobileLangDisplay) {
      mobileLangDisplay.textContent = lang === "es" ? "Español" : "English";
    }
    languageOptions.forEach(opt => {
      opt.classList.toggle("active", opt.getAttribute("data-lang") === lang);
    });
  }

  languageOptions.forEach(option => {
    option.addEventListener("click", () => {
      applyLang(option.getAttribute("data-lang"));
      closeLanguageSelector();
    });
  });

  document.addEventListener("click", e => {
    if (languageSelector && !languageSelector.contains(e.target)) {
      closeLanguageSelector();
    }
  });

  if (mobileLangToggle) {
    mobileLangToggle.addEventListener("click", () => {
      const current = localStorage.getItem("gb_lang") || "es";
      applyLang(current === "es" ? "en" : "es");
    });
  }

  // Init
  applyLang(localStorage.getItem("gb_lang") || "es");


  // ================================================================
  // §6  BACK TO TOP
  // ================================================================
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("show", window.scrollY > 300);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  // ================================================================
  // §7  FOOTER — año dinámico
  // ================================================================
  const footerYear = document.getElementById("footerYear");
  if (footerYear) footerYear.textContent = new Date().getFullYear();


  // ================================================================
  // §8  AUTH STATE  (toggle Iniciar sesión ↔ Mi cuenta)
  // ================================================================
  function updateAuthButtons() {
    const isLoggedIn = localStorage.getItem("gb_user_logged_in") === "true";

    const authBtn = document.querySelector('.icon-button[aria-label="Iniciar sesión"]') ||
                    document.querySelector('.icon-button[aria-label="Mi cuenta"]');
    const authLink = document.querySelector('.mobile-menu__link[href="login.html"]') ||
                     document.querySelector('.mobile-menu__link[href="my-account.html"]');

    if (isLoggedIn) {
      authBtn?.setAttribute("aria-label", "Mi cuenta");
      const btnSpan = authBtn?.querySelector("span:not(.icon-wrap)");
      if (btnSpan) btnSpan.textContent = "Mi cuenta";
      authLink?.setAttribute("href", "my-account.html");
      const linkSpan = authLink?.querySelector("span:not(.icon-wrap)");
      if (linkSpan) linkSpan.textContent = "Mi cuenta";
    } else {
      authBtn?.setAttribute("aria-label", "Iniciar sesión");
      const btnSpan = authBtn?.querySelector("span:not(.icon-wrap)");
      if (btnSpan) btnSpan.textContent = "Iniciar sesión";
      authLink?.setAttribute("href", "login.html");
      const linkSpan = authLink?.querySelector("span:not(.icon-wrap)");
      if (linkSpan) linkSpan.textContent = "Iniciar sesión";
    }
  }

  updateAuthButtons();

  window.gbLogin  = () => { localStorage.setItem("gb_user_logged_in", "true");  updateAuthButtons(); };
  window.gbLogout = () => { localStorage.removeItem("gb_user_logged_in");        updateAuthButtons(); };


  // ================================================================
  // §9  SHOPPING CART
  // ================================================================
  const cartBadgeEl = document.getElementById("cartBadge");

  window.gbCart = {
    getCart() {
      try { return JSON.parse(localStorage.getItem("gb_cart") || "[]"); }
      catch { return []; }
    },

    saveCart(cart) {
      localStorage.setItem("gb_cart", JSON.stringify(cart));
      this.updateBadge();
    },

    add(product) {
      const cart  = this.getCart();
      const index = cart.findIndex(i => i.id === product.id && i.variant === product.variant);
      if (index > -1) {
        cart[index].quantity += product.quantity || 1;
      } else {
        cart.push({
          id:       product.id,
          name:     product.name,
          variant:  product.variant  || null,
          price:    product.price,
          quantity: product.quantity || 1,
          image:    product.image    || ""
        });
      }
      this.saveCart(cart);
      GBToast.show(`${product.name} agregado al carrito`, "success", { icon: "cart" });
      return true;
    },

    remove(productId, variant) {
      const cart    = this.getCart();
      const removed = cart.find(i => i.id === productId && i.variant === variant);
      this.saveCart(cart.filter(i => !(i.id === productId && i.variant === variant)));
      // Toast con Deshacer
      if (removed) {
        GBToast.show(`${removed.name} eliminado del carrito`, "error", {
          icon: "trash",
          undo: () => {
            const current = this.getCart();
            current.push(removed);
            this.saveCart(current);
            // Recargar la página del carrito si estamos en ella
            if (window.location.pathname.includes('cart')) {
              window.location.reload();
            }
          }
        });
      }
    },

    clear() {
      localStorage.removeItem("gb_cart");
      this.updateBadge();
    },

    getTotalQuantity() { return this.getCart().reduce((t, i) => t + i.quantity, 0); },
    getTotalPrice()    { return this.getCart().reduce((t, i) => t + i.price * i.quantity, 0); },

    updateBadge() {
      if (!cartBadgeEl) return;
      const qty = this.getTotalQuantity();
      cartBadgeEl.textContent = qty;
      cartBadgeEl.classList.toggle("show", qty > 0);
    }
  };

  window.gbCart.updateBadge();

  // Helper para product-page.js
  window.addToCart = product => window.gbCart.add(product);


  // ================================================================
  // §10  NEWSLETTER (validación en gb-core)
  // ================================================================
  const newsletterForm  = document.getElementById("newsletterForm")  || document.querySelector(".newsletter-form");
  const newsletterInput = document.getElementById("newsletterEmail") || document.querySelector(".newsletter-input");
  const newsletterHelp  = document.getElementById("newsletterHelp")  || document.querySelector(".newsletter-help");

  if (newsletterForm && newsletterInput) {
    const setHelp     = msg => { if (newsletterHelp) newsletterHelp.textContent = msg || ""; };
    const clearStates = ()  => {
      newsletterInput.classList.remove("is-error", "is-success");
      newsletterInput.removeAttribute("aria-invalid");
      setHelp("");
    };
    const setError    = msg => {
      newsletterInput.classList.replace("is-success", "is-error") ||
        newsletterInput.classList.add("is-error");
      newsletterInput.setAttribute("aria-invalid", "true");
      setHelp(msg || "Por favor revisa tu correo.");
    };
    const setSuccess  = msg => {
      newsletterInput.classList.replace("is-error", "is-success") ||
        newsletterInput.classList.add("is-success");
      newsletterInput.setAttribute("aria-invalid", "false");
      setHelp(msg || "¡Listo! Te avisaremos por correo.");
    };

    newsletterInput.addEventListener("blur", () => {
      const v = newsletterInput.value.trim();
      if (!v) return clearStates();
      GBForms.isEmail(v) ? setSuccess("") : setError("Correo inválido. Ej: hola@dominio.com");
    });

    newsletterInput.addEventListener("input", () => {
      if (!newsletterInput.classList.contains("is-error")) return;
      const v = newsletterInput.value.trim();
      if (!v) return clearStates();
      if (GBForms.isEmail(v)) setSuccess("");
    });

    newsletterForm.addEventListener("submit", e => {
      e.preventDefault();
      const v = newsletterInput.value.trim();
      if (!GBForms.isEmail(v)) return setError("Correo inválido. Ej: hola@dominio.com");
      setSuccess("¡Gracias! Revisa tu correo para confirmar.");
    });
  }

}); // end DOMContentLoaded


// ================================================================
// §11  GBForms — Validación centralizada
//  Uso:
//    GBForms.setError(input, "Mensaje de error")
//    GBForms.clearError(input)
//    GBForms.setSuccess(input, "Mensaje ok")
//    GBForms.isEmail("hola@dominio.com") → true/false
//    GBForms.isPhone("+52 55 1234 5678") → true/false
//    GBForms.isPassword("mi_pass_123")   → true/false  (≥8 chars)
//    GBForms.validateField(input, rules) → true/false
// ================================================================
window.GBForms = (() => {

  // ── Helpers de estado visual ───────────────────────────────────
  function setError(input, message) {
    if (!input) return;
    input.classList.add("input-error");
    input.classList.remove("input-ok");
    input.setAttribute("aria-invalid", "true");

    // Subir hasta .field-wrap o .login-field (para password-wrap anidado)
    const wrap = input.closest(".field-wrap, .login-field, .register-field") 
                 || input.parentElement?.parentElement 
                 || input.parentElement;
    let errEl = wrap?.querySelector(".field-error");

    if (!errEl) {
      errEl = document.createElement("span");
      errEl.className = "field-error";
      errEl.setAttribute("role", "alert");
      // Insertar después del password-wrap si existe, si no después del input
      const insertAfter = input.closest(".login-field__password-wrap") || input;
      insertAfter.insertAdjacentElement("afterend", errEl);
    }

    errEl.textContent = message || "Campo inválido.";
  }

  function clearError(input) {
    if (!input) return;
    input.classList.remove("input-error", "input-ok");
    input.removeAttribute("aria-invalid");

    const wrap = input.closest(".field-wrap, .login-field, .register-field")
                 || input.parentElement?.parentElement
                 || input.parentElement;
    const errEl = wrap?.querySelector(".field-error");
    if (errEl) errEl.textContent = "";
  }

  function setSuccess(input, message) {
    if (!input) return;
    input.classList.add("input-ok");
    input.classList.remove("input-error");
    input.setAttribute("aria-invalid", "false");

    if (message) {
      const wrap = input.closest(".field-wrap, .login-field, .register-field")
                   || input.parentElement?.parentElement
                   || input.parentElement;
      let errEl = wrap?.querySelector(".field-error");
      if (!errEl) {
        errEl = document.createElement("span");
        errEl.className = "field-error";
        const insertAfter = input.closest(".login-field__password-wrap") || input;
        insertAfter.insertAdjacentElement("afterend", errEl);
      }
      errEl.textContent = message;
      errEl.style.color = "var(--success)";
    }
  }

  // ── Reglas de validación ───────────────────────────────────────
  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function isPhone(value) {
    // Acepta formatos MX: +52 55 1234 5678 / 5512345678 / (55)12345678
    return /^[\+]?[\d\s\(\)\-]{8,16}$/.test(String(value).trim());
  }

  function isPassword(value) {
    // Mínimo 8 caracteres (spec del brief)
    return String(value).trim().length >= 8;
  }

  function isNotEmpty(value) {
    return String(value).trim().length > 0;
  }

  // ── validateField: valida y aplica estado automáticamente ──────
  //  rules: array de { test: fn, message: string }
  //  Devuelve true si pasa todas las reglas
  function validateField(input, rules = []) {
    if (!input) return false;
    const value = input.value;

    for (const rule of rules) {
      if (!rule.test(value)) {
        setError(input, rule.message);
        return false;
      }
    }

    clearError(input);
    return true;
  }

  // ── validateForm: valida múltiples campos de una vez ───────────
  //  fields: [{ input, rules }]
  //  Devuelve true si TODOS pasan
  function validateForm(fields = []) {
    let allValid = true;
    for (const { input, rules } of fields) {
      if (!validateField(input, rules)) allValid = false;
    }
    return allValid;
  }

  // ── attachLiveValidation: blur + input feedback en tiempo real ─
  function attachLiveValidation(input, rules = []) {
    input.addEventListener("blur", () => validateField(input, rules));

    input.addEventListener("input", () => {
      if (input.classList.contains("input-error")) {
        validateField(input, rules);
      }
    });
  }

  // Reglas reutilizables listas para usar
  const RULES = {
    required:     { test: isNotEmpty,   message: "Este campo es obligatorio."             },
    email:        { test: isEmail,      message: "Correo inválido. Ej: hola@dominio.com" },
    phone:        { test: isPhone,      message: "Teléfono inválido."                     },
    password:     { test: isPassword,   message: "La contraseña debe tener al menos 8 caracteres." },
    passwordMatch(getOtherValue) {
      return { test: v => v === getOtherValue(), message: "Las contraseñas no coinciden." };
    }
  };

  return {
    setError,
    clearError,
    setSuccess,
    isEmail,
    isPhone,
    isPassword,
    isNotEmpty,
    validateField,
    validateForm,
    attachLiveValidation,
    RULES
  };
})();


// ================================================================
// ================================================================
// §12  GBToast — Sistema unificado de notificaciones
// ================================================================
//  API:
//    GBToast.show(message, type, options)
//
//  Tipos:
//    "success"  → fondo verde claro + borde verde  (acción positiva)
//    "error"    → fondo rojo claro  + borde rojo   (acción destructiva)
//    "warning"  → fondo amarillo claro + borde amarillo
//    "default"  → fondo neutro
//
//  Options (objeto opcional):
//    duration   → ms antes de auto-cerrar (default: 4000)
//    undo       → { label: "Deshacer", callback: fn } — muestra botón
//    icon       → "heart-broken" | "heart" | "check" | "trash" | "cart"
//                 Si no se especifica, se infiere por type
//
//  Ejemplos:
//    GBToast.show("Agregado al carrito", "success")
//    GBToast.show("Kitsune eliminado del carrito", "error", {
//      undo: { label: "Deshacer", callback: () => gbCart.add(item) }
//    })
//    GBToast.show("Kitsune eliminado de favoritos", "error", {
//      icon: "heart-broken",
//      undo: { label: "Deshacer", callback: () => gbFavorites.add(item) }
//    })
// ================================================================
window.GBToast = (() => {
  let container = null;

  // ── Inyectar estilos una sola vez ────────────────────────────
  function injectStyles() {
    if (document.getElementById("gb-toast-styles")) return;
    const style = document.createElement("style");
    style.id = "gb-toast-styles";
    style.textContent = `
      /* ── Contenedor — arriba derecha, debajo del header ── */
      .gb-toast-container {
        position: fixed;
        top: calc(var(--header-h, 76px) + var(--breadcrumbs-h, 36px) + 12px);
        right: 24px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        max-width: min(380px, calc(100vw - 32px));
      }

      /* ── Toast base ── */
      .gb-toast {
        display: flex;
        align-items: center;
        gap: var(--size-3);
        padding: var(--size-4) var(--size-5);
        border-radius: var(--radius-2);
        font-family: var(--font-sans);
        font-size: var(--t-sm);
        font-weight: 600;
        line-height: 1.4;
        color: var(--color-text);
        border: 1.5px solid var(--toast-default-border);
        background: var(--toast-default-bg);
        box-shadow: var(--shadow-3);
        pointer-events: auto;
        opacity: 0;
        transform: translateX(calc(100% + 32px));
        transition:
          opacity var(--dur-3) cubic-bezier(.2,.8,.2,1),
          transform var(--dur-3) cubic-bezier(.2,.8,.2,1);
        will-change: opacity, transform;
        min-width: 260px;
      }

      .gb-toast.is-visible {
        opacity: 1;
        transform: translateX(0);
      }

      .gb-toast.is-hiding {
        opacity: 0;
        transform: translateX(calc(100% + 32px));
        transition-duration: var(--dur-2);
      }

      /* ── Variantes — 100% tokenizadas, sin hardcode ── */
      .gb-toast--success {
        background:   var(--toast-success-bg);
        border-color: var(--toast-success-border);
        color:        var(--toast-success-text, var(--color-text));
      }
      .gb-toast--error {
        background:   var(--toast-danger-bg);
        border-color: var(--toast-danger-border);
        color:        var(--toast-danger-text, var(--color-text));
      }
      .gb-toast--warning {
        background:   var(--toast-warning-bg);
        border-color: var(--toast-warning-border);
        color:        var(--toast-warning-text, var(--color-text));
      }
      .gb-toast--default {
        background:   var(--toast-default-bg);
        border-color: var(--toast-default-border);
      }

      /* ── Ícono ── */
      .gb-toast__icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gb-toast__icon svg { width: 20px; height: 20px; display: block; }

      /* ── Mensaje ── */
      .gb-toast__msg { flex: 1; min-width: 0; }

      /* ── Botón Deshacer — filled morado ── */
      .gb-toast__undo {
        flex-shrink: 0;
        background:    var(--accent-purple);
        border:        2px solid var(--accent-purple);
        border-radius: var(--radius-1);
        color:         var(--neutral-0);
        font-size:     var(--t-xs);
        font-weight:   700;
        font-family:   inherit;
        padding:       var(--size-1) var(--size-4);
        cursor:        pointer;
        white-space:   nowrap;
        line-height:   1.5;
        transition:
          background    var(--dur-1) var(--ease-out),
          border-color  var(--dur-1) var(--ease-out),
          transform     var(--dur-1) var(--ease-out);
      }
      .gb-toast__undo:hover {
        background:   color-mix(in srgb, var(--accent-purple) 82%, var(--neutral-0));
        border-color: color-mix(in srgb, var(--accent-purple) 82%, var(--neutral-0));
        transform:    translateY(-1px);
      }
      .gb-toast__undo:active { transform: translateY(0); }

      /* ── Botón cerrar ── */
      .gb-toast__close {
        flex-shrink: 0;
        background:    transparent;
        border:        none;
        cursor:        pointer;
        color:         currentColor;
        opacity:       0.45;
        padding:       var(--size-1);
        display:       flex;
        align-items:   center;
        border-radius: var(--radius-1);
        transition:    opacity var(--dur-1) ease, background var(--dur-1) ease;
      }
      .gb-toast__close:hover {
        opacity:    0.9;
        background: var(--glass-2);
      }

      /* ── Mobile ── */
      @media (max-width: 480px) {
        .gb-toast-container { right: var(--size-3); left: var(--size-3); max-width: 100%; }
        .gb-toast { min-width: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Contenedor único ────────────────────────────────────────
  function getContainer() {
    if (!container) {
      container = document.createElement("div");
      container.className = "gb-toast-container";
      container.setAttribute("aria-live", "polite");
      container.setAttribute("aria-atomic", "false");
      document.body.appendChild(container);
    }
    return container;
  }

  // ── Íconos SVG por contexto ─────────────────────────────────
  const ICONS = {
    // Acción positiva — checkmark verde
    "check": `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="var(--success,#22c55e)" stroke-width="1.5"/>
      <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="var(--success,#22c55e)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    // Agregado al carrito
    "cart": `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 16C4.9 16 4.01 16.9 4.01 18C4.01 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM0 0V2H2L5.6 9.59L4.24 12.04C4.09 12.32 4 12.65 4 13C4 14.1 4.9 15 6 15H18V13H6.42C6.28 13 6.17 12.89 6.17 12.75L6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.58 16.3 9.97L19.88 3.48C19.96 3.34 20 3.17 20 3C20 2.45 19.55 2 19 2H4.21L3.27 0H0ZM16 16C14.9 16 14.01 16.9 14.01 18C14.01 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16Z" fill="var(--success,#22c55e)"/>
    </svg>`,
    // Corazón relleno — agregado a favoritos
    "heart": `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18.35L8.55 17.03C3.4 12.36 0 9.27 0 5.5C0 2.41 2.42 0 5.5 0C7.24 0 8.91 0.81 10 2.08C11.09 0.81 12.76 0 14.5 0C17.58 0 20 2.41 20 5.5C20 9.27 16.6 12.36 11.45 17.03L10 18.35Z" fill="var(--danger,#ef4444)"/>
    </svg>`,
    // Corazón roto — eliminado de favoritos
    "heart-broken": `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18.35L8.55 17.03C3.4 12.36 0 9.27 0 5.5C0 2.41 2.42 0 5.5 0C7.24 0 8.91 0.81 10 2.08C11.09 0.81 12.76 0 14.5 0C17.58 0 20 2.41 20 5.5C20 9.27 16.6 12.36 11.45 17.03L10 18.35Z" fill="var(--danger,#ef4444)" opacity="0.35"/>
      <path d="M10 7L8 10H11L9 14" stroke="var(--danger,#ef4444)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    // Papelera — eliminado del carrito
    "trash": `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 2V0H15V2H20V4H18V19C18 19.5 17.79 20.04 17.41 20.41C17.04 20.79 16.5 21 16 21H4C3.5 21 2.96 20.79 2.59 20.41C2.21 20.04 2 19.5 2 19V4H0V2H5ZM4 4V19H16V4H4ZM7 7H9V16H7V7ZM11 7H13V16H11V7Z" fill="var(--danger,#ef4444)"/>
    </svg>`,
    // Warning
    "warning": `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L1 18h18L10 2zm0 5v5m0 3v1" stroke="var(--warning,#f59e0b)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    // Info neutro
    "default": `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
      <path d="M10 9v5m0-7v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  };

  // Inferir ícono por tipo si no se especificó
  function resolveIcon(type, explicitIcon) {
    if (explicitIcon && ICONS[explicitIcon]) return explicitIcon;
    if (type === "success") return "check";
    if (type === "error")   return "trash";
    if (type === "warning") return "warning";
    return "default";
  }

  // ── Función principal ────────────────────────────────────────
  //  show(message, type, options)
  //  show(message, type, duration)  ← retrocompatibilidad
  function show(message, type = "default", options = {}) {
    // Retrocompatibilidad: si options es número, es duration
    if (typeof options === "number") {
      options = { duration: options };
    }

    const duration = options.duration || 4000;
    const undoOpts = options.undo || null;     // { label, callback }
    const iconKey  = resolveIcon(type, options.icon);
    const typeClass = ["success","error","warning"].includes(type) ? type : "default";

    injectStyles();
    const c = getContainer();

    const toast = document.createElement("div");
    toast.className = `gb-toast gb-toast--${typeClass}`;
    toast.setAttribute("role", "status");

    // Construir HTML del toast
    const undoHTML = undoOpts
      ? `<button class="gb-toast__undo" type="button">${undoOpts.label || "Deshacer"}</button>`
      : "";

    toast.innerHTML = `
      <span class="gb-toast__icon">${ICONS[iconKey]}</span>
      <span class="gb-toast__msg">${message}</span>
      ${undoHTML}
      <button class="gb-toast__close" aria-label="Cerrar" type="button">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    `;

    c.appendChild(toast);

    // Trigger animación entrada
    requestAnimationFrame(() => requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    }));

    const dismiss = () => {
      if (!toast.isConnected) return;
      toast.classList.add("is-hiding");
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 220);
    };

    // Botón cerrar
    toast.querySelector(".gb-toast__close").addEventListener("click", dismiss);

    // Botón deshacer
    if (undoOpts) {
      toast.querySelector(".gb-toast__undo").addEventListener("click", () => {
        undoOpts.callback?.();
        dismiss();
      });
    }

    // Auto-dismiss
    const timer = setTimeout(dismiss, duration);

    // Pausar timer en hover
    toast.addEventListener("mouseenter", () => clearTimeout(timer));
    toast.addEventListener("mouseleave", () => setTimeout(dismiss, duration * 0.4));

    return { dismiss };
  }

  return { show };
})();

/* ══════════════════════════════════════════════════════════════
   GLITCH BLOCK TRANSITION — efecto de entrada tipo Ray-Ban EXE
   Pantalla negra al inicio. Los bloques se vuelven transparentes
   en orden aleatorio revelando el sitio debajo — como ventanas
   que se abren con un micro-glitch de color.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const COLS        = 12;   /* columnas */
  const ROWS        = 9;    /* filas */
  const BLOCK_DELAY = 22;   /* ms de stagger entre bloques */
  const GLITCH_MS   = 60;   /* ms del flash de color por bloque */

  function buildOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'gb-page-transition';
    overlay.setAttribute('aria-hidden', 'true');
    Object.assign(overlay.style, {
      position:            'fixed',
      inset:               '0',
      zIndex:              '99999',
      pointerEvents:       'none',
      display:             'grid',
      gridTemplateColumns: `repeat(${COLS}, 1fr)`,
      gridTemplateRows:    `repeat(${ROWS}, 1fr)`,
      overflow:            'hidden',
      background:          'transparent',
    });

    const blocks = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const block = document.createElement('div');
      /* Cada bloque empieza sólido negro — tapando el contenido */
      Object.assign(block.style, {
        background: '#0a0a0d',
        willChange: 'opacity',
      });
      overlay.appendChild(block);
      blocks.push(block);
    }

    return { overlay, blocks };
  }

  function revealBlock(block, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        /* Revelar directo: el bloque negro se vuelve transparente */
        block.style.transition = `opacity ${GLITCH_MS + 20}ms ease-out`;
        block.style.opacity    = '0';
        setTimeout(resolve, GLITCH_MS + 40);
      }, delay);
    });
  }

  function runTransition() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { overlay, blocks } = buildOverlay();
    document.body.appendChild(overlay);

    /* Orden aleatorio para revelar — más orgánico */
    const indices = Array.from({ length: blocks.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);

    Promise.all(
      indices.map((blockIdx, order) =>
        revealBlock(blocks[blockIdx], order * BLOCK_DELAY)
      )
    ).then(() => overlay.remove());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTransition);
  } else {
    runTransition();
  }

})();
