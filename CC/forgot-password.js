// ============================================================
// forgot-password.js — Glitched Box
// Paso 1: ingresa email → sessionStorage → redirect
// Depende de: gb-core.js (GBForms, GBToast)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const emailInput   = document.getElementById('email');
  const forgotForm   = document.getElementById('forgotForm');
  const forgotSubmit = document.getElementById('forgotSubmit');

  const emailRules = [
    GBForms.RULES.required,
    GBForms.RULES.email
  ];

  // ── Live validation ─────────────────────────────────────────
  if (emailInput) GBForms.attachLiveValidation(emailInput, emailRules);

  // ── Submit ──────────────────────────────────────────────────
  if (forgotForm) {
    forgotForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const valid = GBForms.validateForm([
        { input: emailInput, rules: emailRules }
      ]);

      if (!valid) return;

      if (forgotSubmit) {
        forgotSubmit.disabled    = true;
        forgotSubmit.textContent = 'Enviando...';
      }

      sessionStorage.setItem('gb_reset_email', emailInput.value.trim());

      setTimeout(() => { window.location.href = 'reset-password.html'; }, 800);
    });
  }

});
