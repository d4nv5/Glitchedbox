// ============================================================
// register-script.js — Glitched Box
// Depende de: gb-core.js (GBForms, GBToast)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const firstNameInput  = document.getElementById('firstName');
  const lastNameInput   = document.getElementById('lastName');
  const emailInput      = document.getElementById('email');
  const passwordInput   = document.getElementById('password');
  const confirmInput    = document.getElementById('confirmPassword');
  const registerForm    = document.getElementById('registerForm');

  // ── Reglas de validación ────────────────────────────────────
  const nameRules = [GBForms.RULES.required];

  const emailRules = [
    GBForms.RULES.required,
    GBForms.RULES.email
  ];

  const passwordRules = [
    GBForms.RULES.required,
    GBForms.RULES.password
  ];

  // passwordMatch se evalúa en tiempo real, se construye como función
  // para siempre tomar el valor actual de passwordInput
  function getPasswordMatchRules() {
    return [
      GBForms.RULES.required,
      { test: v => v === (passwordInput?.value || ''), message: 'Las contraseñas no coinciden.' }
    ];
  }

  // ── Live validation ─────────────────────────────────────────
  if (firstNameInput) GBForms.attachLiveValidation(firstNameInput, [
    { test: GBForms.isNotEmpty, message: 'El nombre es obligatorio.' }
  ]);

  if (lastNameInput) GBForms.attachLiveValidation(lastNameInput, [
    { test: GBForms.isNotEmpty, message: 'Los apellidos son obligatorios.' }
  ]);

  if (emailInput)    GBForms.attachLiveValidation(emailInput,    emailRules);
  if (passwordInput) GBForms.attachLiveValidation(passwordInput, passwordRules);

  // Confirmar contraseña: revalida también cuando cambia la contraseña principal
  if (confirmInput) {
    GBForms.attachLiveValidation(confirmInput, getPasswordMatchRules());
    passwordInput?.addEventListener('input', () => {
      if (confirmInput.value) GBForms.validateField(confirmInput, getPasswordMatchRules());
    });
  }

  // ── Toggle ojos ─────────────────────────────────────────────
  function setupEyeToggle(btnId, inputId) {
    const btn   = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', function () {
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      this.classList.toggle('is-visible', !visible);
      this.setAttribute('aria-label', visible ? 'Mostrar contraseña' : 'Ocultar contraseña');
    });
  }

  setupEyeToggle('togglePassword', 'password');
  setupEyeToggle('toggleConfirm',  'confirmPassword');

  // ── Submit ──────────────────────────────────────────────────
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const termsEl    = document.getElementById('terms');
      const termsError = document.getElementById('terms-error');
      const termsOk    = termsEl?.checked ?? false;

      const valid = GBForms.validateForm([
        { input: firstNameInput, rules: [{ test: GBForms.isNotEmpty, message: 'El nombre es obligatorio.' }] },
        { input: lastNameInput,  rules: [{ test: GBForms.isNotEmpty, message: 'Los apellidos son obligatorios.' }] },
        { input: emailInput,     rules: emailRules    },
        { input: passwordInput,  rules: passwordRules },
        { input: confirmInput,   rules: getPasswordMatchRules() }
      ]);

      if (!termsOk && termsError) {
        termsError.textContent = 'Debes aceptar los términos para continuar.';
      } else if (termsError) {
        termsError.textContent = '';
      }

      if (!valid || !termsOk) {
        registerForm.querySelector('.input-error')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const submitBtn = document.getElementById('registerSubmit');
      if (submitBtn) {
        submitBtn.disabled    = true;
        submitBtn.textContent = '✓ Cuenta creada';
      }

      console.log('Registro:', {
        firstName: firstNameInput?.value.trim(),
        lastName:  lastNameInput?.value.trim(),
        email:     emailInput?.value.trim()
      });

      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    });
  }

});
