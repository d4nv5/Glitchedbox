// ============================================================
// change-password.js — Glitched Box
// Paso 3: nueva contraseña + confirmar → password-confirmation
// Depende de: gb-core.js (GBForms, GBToast)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const newPwInput     = document.getElementById('newPassword');
  const confirmPwInput = document.getElementById('confirmPassword');
  const changeForm     = document.getElementById('changePasswordForm');
  const changeSubmit   = document.getElementById('changeSubmit');

  // ── Reglas ─────────────────────────────────────────────────
  const newPasswordRules = [
    GBForms.RULES.required,
    GBForms.RULES.password
  ];

  function getConfirmRules() {
    return [
      GBForms.RULES.required,
      { test: v => v === (newPwInput?.value || ''), message: 'Las contraseñas no coinciden.' }
    ];
  }

  // ── Toggle ojos ─────────────────────────────────────────────
  function setupEye(btnId, inputId) {
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

  setupEye('toggleNew',     'newPassword');
  setupEye('toggleConfirm', 'confirmPassword');

  // ── Medidor de fortaleza de contraseña ──────────────────────
  const COMMON = ['123456','password','12345678','qwerty','abc123',
    'contraseña','111111','123123','admin','letmein','000000'];

  const LEVELS = { weak: 'Débil', medium: 'Media', strong: 'Fuerte' };

  function getStrength(pw) {
    if (!pw || pw.length < 6) return null;
    if (COMMON.includes(pw.toLowerCase())) return 'weak';

    let score = 0;
    if (pw.length >= 8)            score++;
    if (pw.length >= 12)           score++;
    if (/[a-z]/.test(pw))          score++;
    if (/[A-Z]/.test(pw))          score++;
    if (/\d/.test(pw))             score++;
    if (/[^a-zA-Z0-9]/.test(pw))   score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }

  function updateStrengthBar(pw) {
    const bar   = document.getElementById('pwStrength');
    const label = document.getElementById('pwStrengthLabel');
    if (!bar || !label) return;

    const level = getStrength(pw);
    if (!level) {
      bar.classList.remove('is-visible');
      bar.removeAttribute('data-level');
      label.textContent = '';
      return;
    }

    bar.classList.add('is-visible');
    bar.setAttribute('data-level', level);
    label.textContent = LEVELS[level];
  }

  // ── Live validation ─────────────────────────────────────────
  if (newPwInput) {
    newPwInput.addEventListener('input', function () {
      updateStrengthBar(this.value);
      // Revalidar confirmar si ya tiene valor
      if (confirmPwInput?.value) {
        GBForms.validateField(confirmPwInput, getConfirmRules());
      }
    });
    GBForms.attachLiveValidation(newPwInput, newPasswordRules);
  }

  if (confirmPwInput) {
    GBForms.attachLiveValidation(confirmPwInput, getConfirmRules());
  }

  // ── Submit ──────────────────────────────────────────────────
  if (changeForm) {
    changeForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const valid = GBForms.validateForm([
        { input: newPwInput,     rules: newPasswordRules  },
        { input: confirmPwInput, rules: getConfirmRules() }
      ]);

      if (!valid) return;

      if (changeSubmit) {
        changeSubmit.disabled    = true;
        changeSubmit.textContent = 'Guardando...';
      }

      sessionStorage.removeItem('gb_reset_email');
      setTimeout(() => { window.location.href = 'password-confirmation.html'; }, 800);
    });
  }

});
