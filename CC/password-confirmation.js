// ============================================================
// password-confirmation.js — Glitched Box
// Paso 4: confirmación — solo limpia sessionStorage
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  // Limpiar datos de sesión del flujo de reset
  sessionStorage.removeItem('gb_reset_email');
  console.log('GB — Password Confirmation listo.');
});
