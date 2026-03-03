/* my-account.js — SOLO Dashboard (Mi cuenta)
   Nota: header/footer/breadcrumbs/search/menu/newsletter/back-to-top/theme
   los controla gb-core.js.
*/

(function () {
  const onReady = (fn) =>
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", fn)
      : fn();

  onReady(() => {

    /* ─────────────────────────────────────────────────────────────
       EDICIÓN INLINE DE PERFIL (estilo Airbnb)
       Cada .profile-row tiene:
         [data-field]       → identificador del campo
         [data-label]       → texto del label
         [data-value]       → valor actual editable
         [data-type]        → tipo de input (text, email, tel, password)
         [data-placeholder] → placeholder del input
       ───────────────────────────────────────────────────────────── */

    const rows = document.querySelectorAll('.profile-row:not(.profile-row--no-edit):not(.profile-row--danger)');

    // Descripciones de ayuda por campo
    const fieldDescriptions = {
      nombre:     'Asegúrate de que el nombre coincida con tu identificación oficial.',
      nacimiento: 'Para verificar tu edad, se comparte con otros usuarios solo cuando sea necesario.',
      email:      'Usa una dirección a la que tengas acceso. Enviaremos un enlace de confirmación.',
      telefono:   'Agrega tu número para recibir notificaciones de tus pedidos.',
      direccion:  'Tu dirección de entrega principal.',
      password:   'Usa al menos 8 caracteres. Combina letras, números y símbolos.',
    };

    // Cierra todas las filas abiertas excepto la indicada
    function closeAllExcept(exceptRow) {
      rows.forEach(row => {
        if (row === exceptRow) return;
        const viewEl = row.querySelector('.profile-row__view');
        const editEl = row.querySelector('.profile-row__edit');
        if (editEl && !editEl.hidden) {
          editEl.hidden = true;
          viewEl.hidden = false;
          row.classList.remove('profile-row--open');
        }
      });
    }

    rows.forEach(row => {
      const viewEl   = row.querySelector('.profile-row__view');
      const editEl   = row.querySelector('.profile-row__edit');
      const input    = row.querySelector('.profile-row__input');
      const btnEdit  = row.querySelector('.profile-row__btn-edit');
      const btnSave  = row.querySelector('.profile-row__btn-save');
      const btnCancel = row.querySelector('.profile-row__btn-cancel');
      const descEl   = row.querySelector('.profile-row__edit-desc');
      const valueEl  = row.querySelector('.profile-row__value');

      if (!editEl) return; // profile-row--no-edit o danger

      const field = row.dataset.field;
      const label = row.dataset.label;
      const type  = row.dataset.type || 'text';
      const placeholder = row.dataset.placeholder || '';

      // Inicializar input
      input.type = type;
      input.placeholder = placeholder;
      if (descEl && fieldDescriptions[field]) {
        descEl.textContent = fieldDescriptions[field];
      }

      // ABRIR edición
      btnEdit.addEventListener('click', () => {
        closeAllExcept(row);

        // Pre-llenar con el valor actual (salvo contraseña)
        if (type !== 'password') {
          input.value = row.dataset.value || '';
        } else {
          input.value = '';
        }

        viewEl.hidden = true;
        editEl.hidden = false;
        row.classList.add('profile-row--open');
        input.focus();
      });

      // CANCELAR
      btnCancel.addEventListener('click', () => {
        editEl.hidden = true;
        viewEl.hidden = false;
        row.classList.remove('profile-row--open');
        input.setCustomValidity('');
      });

      // GUARDAR
      btnSave.addEventListener('click', () => {
        const newVal = input.value.trim();

        if (!newVal) {
          input.setCustomValidity('Este campo no puede estar vacío.');
          input.reportValidity();
          return;
        }
        input.setCustomValidity('');

        // Actualizar el valor mostrado y el data-value
        if (type !== 'password') {
          row.dataset.value = newVal;
          if (valueEl) valueEl.textContent = newVal;
        } else {
          if (valueEl) valueEl.textContent = 'Contraseña actualizada recientemente';
        }

        editEl.hidden = true;
        viewEl.hidden = false;
        row.classList.remove('profile-row--open');

        // Toast de confirmación
        showToast(`${label} actualizado`);
      });

      // Guardar con Enter
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btnSave.click();
        if (e.key === 'Escape') btnCancel.click();
      });
    });

    /* ─────────────────────────────────────────────────────────────
       DIRECCIÓN: flujo especial de 3 estados
       Estado 1 → vista cerrada (Proporcionada)
       Estado 2 → resumen con "Cambiar la dirección"
       Estado 3 → formulario completo
       ───────────────────────────────────────────────────────────── */
    const addrRow = document.querySelector('.profile-row--address');
    if (addrRow) {
      const stateView    = addrRow.querySelector('.addr-state-view');
      const stateSummary = addrRow.querySelector('.addr-state-summary');
      const stateForm    = addrRow.querySelector('.addr-state-form');
      const addrDisplay  = addrRow.querySelector('.addr-display');

      const goToView = () => {
        stateView.hidden    = false;
        stateSummary.hidden = true;
        stateForm.hidden    = true;
        addrRow.classList.remove('profile-row--open');
      };

      const goToSummary = () => {
        closeAllExcept(addrRow);
        stateView.hidden    = true;
        stateSummary.hidden = false;
        stateForm.hidden    = true;
        addrRow.classList.add('profile-row--open');
      };

      const goToForm = () => {
        stateView.hidden    = true;
        stateSummary.hidden = true;
        stateForm.hidden    = false;
        addrRow.classList.add('profile-row--open');
        stateForm.querySelector('input').focus();
      };

      addrRow.querySelector('.addr-btn-edit').addEventListener('click', goToSummary);
      addrRow.querySelector('.addr-btn-change').addEventListener('click', goToForm);
      addrRow.querySelector('.addr-btn-cancel-summary').addEventListener('click', goToView);
      addrRow.querySelector('.addr-btn-cancel-form').addEventListener('click', goToView);
      addrRow.querySelector('.addr-btn-save').addEventListener('click', () => {
        // Generar abreviación dinámica: primeras 3 letras de la calle + *** + país
        const calleInput = stateForm.querySelectorAll('input')[0].value.trim();
        const ciudadInput = stateForm.querySelectorAll('input')[3].value.trim();
        const selectPais = stateForm.querySelector('select');
        const pais = selectPais ? selectPais.options[selectPais.selectedIndex].text : 'México';

        let abrev = 'Proporcionada';
        if (calleInput) {
          const primeraPalabra = calleInput.split(/[\s,#]/)[0];
          const visible = primeraPalabra.slice(0, 3);
          const ciudad = ciudadInput || pais;
          abrev = `${visible}***, ${ciudad}`;
        }

        // Actualizar el texto del resumen (estado 2) y del valor visible (estado 1)
        const summaryText = addrRow.querySelector('.addr-summary-text');
        if (summaryText) summaryText.textContent = abrev;
        if (addrDisplay) addrDisplay.textContent = 'Proporcionada';

        goToView();
        showToast('Dirección actualizada');
      });
    }

    /* ─────────────────────────────────────────────────────────────
       TOAST DE CONFIRMACIÓN
       ───────────────────────────────────────────────────────────── */
    function showToast(message) {
      let toast = document.getElementById('profile-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'profile-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('profile-toast--visible');
      clearTimeout(toast._timeout);
      toast._timeout = setTimeout(() => {
        toast.classList.remove('profile-toast--visible');
      }, 2500);
    }

    /* ─────────────────────────────────────────────────────────────
       SIDEBAR: inyección de iconos en account-nav
       Los SVGs reutilizan los mismos paths que ya existen en el proyecto
       ───────────────────────────────────────────────────────────── */
    const SIDEBAR_ICONS = {
      // box.svg — tu archivo exacto, fill cambiado a currentColor
      'my-orders.html': `<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.36 7.30556L12.5908 3.65036C12.4099 3.55173 12.2066 3.5 12 3.5C11.7934 3.5 11.5901 3.55173 11.4092 3.65036L4.64 7.30707C4.44668 7.41146 4.28531 7.56515 4.17273 7.75209C4.06015 7.93904 4.0005 8.15239 4 8.36985V15.6301C4.0005 15.8476 4.06015 16.061 4.17273 16.2479C4.28531 16.4349 4.44668 16.5885 4.64 16.6929L11.4092 20.3496C11.5901 20.4483 11.7934 20.5 12 20.5C12.2066 20.5 12.4099 20.4483 12.5908 20.3496L19.36 16.6929C19.5533 16.5885 19.7147 16.4349 19.8273 16.2479C19.9398 16.061 19.9995 15.8476 20 15.6301V8.37061C19.9999 8.15276 19.9405 7.93894 19.8279 7.75155C19.7153 7.56417 19.5537 7.41013 19.36 7.30556ZM12 4.71314L18.1808 8.0533L15.89 9.28991L9.70923 5.94975L12 4.71314ZM12 11.3935L5.81923 8.0533L8.42769 6.6436L14.6085 9.98376L12 11.3935ZM18.7692 15.6332L12.6154 18.9574V12.4433L15.0769 11.1141V13.8227C15.0769 13.9837 15.1418 14.1382 15.2572 14.2521C15.3726 14.366 15.5291 14.43 15.6923 14.43C15.8555 14.43 16.012 14.366 16.1275 14.2521C16.2429 14.1382 16.3077 13.9837 16.3077 13.8227V10.4491L18.7692 9.11987V15.6301V15.6332Z" fill="currentColor"/></svg>`,
      // persona — mismo path que Mi cuenta en el navbar
      'my-account.html': `<svg aria-hidden="true" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12ZM12 14.5C8.66667 14.5 2 16.175 2 19.5V22H22V19.5C22 16.175 15.3333 14.5 12 14.5Z" fill="currentColor"/></svg>`,
      // credit-card.svg — tu archivo exacto, fill cambiado a currentColor
      'my-payments.html': `<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6ZM4 8H20V6H4V8ZM4 12V18H20V12H4Z" fill="currentColor"/></svg>`,
      // settings.svg — tu archivo exacto, fill cambiado a currentColor
      'preferences.html': `<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.7051 13.0456C18.7432 12.7597 18.7623 12.4642 18.7623 12.1497C18.7623 11.8447 18.7432 11.5397 18.6956 11.2538L20.6303 9.74791C20.8019 9.61448 20.8496 9.35714 20.7447 9.16652L18.9148 6.00225C18.8004 5.79257 18.5621 5.72585 18.3525 5.79257L16.0746 6.70754C15.598 6.34536 15.0929 6.04037 14.5305 5.81163L14.1874 3.39077C14.1493 3.16203 13.9587 3 13.7299 3H10.0701C9.84131 3 9.66023 3.16203 9.6221 3.39077L9.27899 5.81163C8.71666 6.04037 8.20199 6.35489 7.73497 6.70754L5.45708 5.79257C5.2474 5.71632 5.00912 5.79257 4.89475 6.00225L3.07434 9.16652C2.95997 9.36667 2.99809 9.61448 3.18871 9.74791L5.1235 11.2538C5.07584 11.5397 5.03772 11.8542 5.03772 12.1497C5.03772 12.4452 5.05678 12.7597 5.10443 13.0456L3.16965 14.5515C2.99809 14.6849 2.95044 14.9423 3.05528 15.1329L4.88522 18.2972C4.99959 18.5069 5.23787 18.5736 5.44755 18.5069L7.72544 17.5919C8.20199 17.9541 8.70713 18.259 9.26946 18.4878L9.61257 20.9087C9.66023 21.1374 9.84131 21.2994 10.0701 21.2994H13.7299C13.9587 21.2994 14.1493 21.1374 14.1779 20.9087L14.521 18.4878C15.0833 18.259 15.598 17.9541 16.065 17.5919L18.3429 18.5069C18.5526 18.5831 18.7909 18.5069 18.9052 18.2972L20.7352 15.1329C20.8496 14.9232 20.8019 14.6849 20.6208 14.5515L18.7051 13.0456ZM11.9 15.5809C10.0129 15.5809 8.46886 14.0368 8.46886 12.1497C8.46886 10.2626 10.0129 8.71857 11.9 8.71857C13.7871 8.71857 15.3311 10.2626 15.3311 12.1497C15.3311 14.0368 13.7871 15.5809 11.9 15.5809Z" fill="currentColor"/></svg>`,
      // logout — flecha de salida, 24x24
      'logout.html': `<svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    };

    document.querySelectorAll('.account-nav .account-link').forEach(link => {
      const href = link.getAttribute('href');
      const key = Object.keys(SIDEBAR_ICONS).find(k => href && href.includes(k));
      if (!key) return;
      const svgEl = document.createElement('span');
      svgEl.className = 'account-link__icon';
      svgEl.innerHTML = SIDEBAR_ICONS[key];
      link.insertBefore(svgEl, link.firstChild);
    });

    /* ─────────────────────────────────────────────────────────────
       PREFERENCIAS: Idioma y Moneda (select inline, mismo patrón profile-row)
       ───────────────────────────────────────────────────────────── */
    const prefRows = document.querySelectorAll('.profile-row[data-field="idioma"], .profile-row[data-field="moneda"]');

    prefRows.forEach(row => {
      const viewEl    = row.querySelector('.profile-row__view');
      const editEl    = row.querySelector('.profile-row__edit');
      const select    = row.querySelector('select');
      const btnEdit   = row.querySelector('.profile-row__btn-edit');
      const btnSave   = row.querySelector('.profile-row__btn-save');
      const btnCancel = row.querySelector('.profile-row__btn-cancel');
      const valueEl   = row.querySelector('.profile-row__value');

      if (!editEl) return;

      const label = row.dataset.label;

      // Cerrar todas las pref-rows excepto la indicada
      const closeOtherPrefRows = (exceptRow) => {
        prefRows.forEach(r => {
          if (r === exceptRow) return;
          const v = r.querySelector('.profile-row__view');
          const e = r.querySelector('.profile-row__edit');
          if (e && !e.hidden) {
            e.hidden = true;
            v.hidden = false;
            r.classList.remove('profile-row--open');
          }
        });
      };

      // ABRIR
      btnEdit.addEventListener('click', () => {
        closeOtherPrefRows(row);
        closeAllExcept(null); // cerrar profile-rows de otras páginas si las hubiera

        // Pre-seleccionar el valor actual
        const currentVal = row.dataset.value || '';
        for (const opt of select.options) {
          opt.selected = opt.value === currentVal;
        }

        viewEl.hidden = true;
        editEl.hidden = false;
        row.classList.add('profile-row--open');
        select.focus();
      });

      // CANCELAR
      btnCancel.addEventListener('click', () => {
        editEl.hidden = true;
        viewEl.hidden = false;
        row.classList.remove('profile-row--open');
      });

      // GUARDAR
      btnSave.addEventListener('click', () => {
        const newVal = select.value;
        row.dataset.value = newVal;
        if (valueEl) valueEl.textContent = newVal;

        editEl.hidden = true;
        viewEl.hidden = false;
        row.classList.remove('profile-row--open');

        showToast(`${label} actualizado`);
      });
    });

    /* ─────────────────────────────────────────────────────────────
       RESPONSIVE: navegación móvil/tablet (< 900px)
       - Sidebar = pantalla de lista (vista A)
       - Contenido = pantalla de detalle con botón "← Atrás" (vista B)
       Al cargar: si hay is-active → mostrar contenido directamente
       ───────────────────────────────────────────────────────────── */
    const sidebar     = document.querySelector('.account-sidebar');
    const contentWrap = document.querySelector('.account-content-wrap');

    if (sidebar && contentWrap) {

      // Inyectar botón Atrás dentro del account-header, antes del h1
      const accountHeader = contentWrap.querySelector('.account-header');
      const accountTitle  = contentWrap.querySelector('.account-title');

      if (accountHeader && accountTitle) {
        const backBtn = document.createElement('button');
        backBtn.className = 'account-back-btn';
        backBtn.setAttribute('type', 'button');
        backBtn.setAttribute('aria-label', 'Volver al menú de cuenta');
        backBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        accountHeader.insertBefore(backBtn, accountTitle);
      }

      const MOBILE_BP = 900;
      const isMobile  = () => window.innerWidth < MOBILE_BP;

      const showSidebar = () => {
        sidebar.classList.remove('account-sidebar--hidden');
        contentWrap.classList.remove('account-content--visible');
        document.documentElement.classList.remove('account-detail-view');
      };

      const showContent = () => {
        sidebar.classList.add('account-sidebar--hidden');
        contentWrap.classList.add('account-content--visible');
        document.documentElement.classList.add('account-detail-view');
      };

      const init = () => {
        if (isMobile()) {
          // Si llegamos con ?sidebar=1 (desde botón Atrás), forzar vista de sidebar
          const params = new URLSearchParams(window.location.search);
          if (params.get('sidebar') === '1') {
            showSidebar();
            return;
          }
          // Si la página tiene un link activo, ir directo al contenido
          const activeLink = sidebar.querySelector('.account-link.is-active');
          if (activeLink) {
            showContent();
          } else {
            showSidebar();
          }
        } else {
          // Desktop: limpiar clases responsive
          sidebar.classList.remove('account-sidebar--hidden');
          contentWrap.classList.remove('account-content--visible');
          document.documentElement.classList.remove('account-detail-view');
        }
      };

      // Botón atrás → vuelve al hub con ?sidebar=1 para forzar vista de sidebar
      if (accountHeader && accountTitle) {
        const backBtnEl = accountHeader.querySelector('.account-back-btn');
        if (backBtnEl) {
          backBtnEl.addEventListener('click', () => {
            window.location.href = 'my-account.html?sidebar=1';
          });
        }
      }

      // Re-evaluar al cambiar tamaño de ventana (con debounce)
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(init, 80);
      });

      init();
    }

    /* ─────────────────────────────────────────────────────────────
       MODAL LOGOUT (si existe)
       ───────────────────────────────────────────────────────────── */
    const openLogoutBtn = document.getElementById("openLogoutModal");
    const logoutModal   = document.querySelector(".logout-modal");
    const overlay       = document.querySelector(".modal-overlay");

    const closeLogout = () => {
      if (logoutModal) logoutModal.style.display = "none";
      if (overlay)     overlay.style.display     = "none";
      document.body.style.overflow = "";
    };

    const openLogout = () => {
      if (logoutModal) logoutModal.style.display = "block";
      if (overlay)     overlay.style.display     = "block";
      document.body.style.overflow = "hidden";
    };

    if (openLogoutBtn && (logoutModal || overlay)) {
      openLogoutBtn.addEventListener("click", (e) => { e.preventDefault(); openLogout(); });
    }

    document.querySelectorAll("[data-logout-close], .logout-close").forEach(btn => {
      btn.addEventListener("click", (e) => { e.preventDefault(); closeLogout(); });
    });

    if (overlay) overlay.addEventListener("click", closeLogout);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLogout(); });

  });
})();
