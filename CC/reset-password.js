// reset-password.js — Glitched Box
// Maneja el formulario de restablecimiento de contraseña (paso 2 del flujo)
// Este paso recibe el token de reset y permite establecer nueva contraseña
// La lógica está integrada en change-password.js

document.addEventListener('DOMContentLoaded', () => {
  // El flujo de reset usa el mismo formulario que change-password
  // Redirigir si no hay token en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (!token && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // En producción, redirigir si no hay token
    // window.location.href = 'forgot-password.html';
  }
});
