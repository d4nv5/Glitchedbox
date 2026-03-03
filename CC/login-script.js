// ============================================================
// login-script.js — Glitched Box
// Depende de: gb-core.js (GBForms, GBToast)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const emailInput    = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginForm     = document.getElementById('loginForm');

  // ── Reglas de validación ────────────────────────────────────
  const emailRules = [
    GBForms.RULES.required,
    GBForms.RULES.email
  ];

  const passwordRules = [
    GBForms.RULES.required,
    GBForms.RULES.password
  ];

  // ── Live validation (blur + input feedback) ─────────────────
  if (emailInput)    GBForms.attachLiveValidation(emailInput,    emailRules);
  if (passwordInput) GBForms.attachLiveValidation(passwordInput, passwordRules);

  // ── Toggle ojo — contraseña ─────────────────────────────────
  const toggleBtn = document.getElementById('togglePassword');
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', function () {
      const visible = passwordInput.type === 'text';
      passwordInput.type = visible ? 'password' : 'text';
      this.classList.toggle('is-visible', !visible);
      this.setAttribute('aria-label', visible ? 'Mostrar contraseña' : 'Ocultar contraseña');
    });
  }

  // ── Toggle recordar sesión ──────────────────────────────────
  const rememberCheckbox = document.getElementById('remember');
  if (rememberCheckbox) {
    rememberCheckbox.addEventListener('change', function () {
      this.checked
        ? localStorage.setItem('gb_remember', '1')
        : localStorage.removeItem('gb_remember');
    });
    if (localStorage.getItem('gb_remember')) rememberCheckbox.checked = true;
  }

  // ── Submit ──────────────────────────────────────────────────
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const valid = GBForms.validateForm([
        { input: emailInput,    rules: emailRules    },
        { input: passwordInput, rules: passwordRules }
      ]);

      if (!valid) {
        loginForm.querySelector('.input-error')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const submitBtn = document.getElementById('loginSubmit');
      if (submitBtn) {
        submitBtn.disabled    = true;
        submitBtn.textContent = 'Iniciando sesión...';
      }

      // TODO: reemplazar con llamada real a API
      console.log('Login:', { email: emailInput.value.trim() });

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled    = false;
          submitBtn.textContent = 'Iniciar sesión';
        }
      }, 2000);
    });
  }

  // ── Social login (placeholders) ─────────────────────────────
  document.getElementById('btnGoogle')
    ?.addEventListener('click', () => console.log('Login con Google — integrar OAuth'));
  document.getElementById('btnFacebook')
    ?.addEventListener('click', () => console.log('Login con Facebook — integrar OAuth'));

});
