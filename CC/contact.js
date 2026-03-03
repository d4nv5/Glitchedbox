// ============================================================
// contact.js — Glitched Box
// Depende de: gb-core.js (GBForms, GBToast)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const firstNameInput = document.getElementById('firstName');
  const lastNameInput  = document.getElementById('lastName');
  const emailInput     = document.getElementById('email');
  const phoneInput     = document.getElementById('phone');
  const messageInput   = document.getElementById('message');
  const contactForm    = document.getElementById('contactForm');
  const charCounter    = document.getElementById('charCounter');

  // ── Reglas de validación ────────────────────────────────────
  const nameRules = [GBForms.RULES.required];
  const emailRules = [GBForms.RULES.required, GBForms.RULES.email];

  // Teléfono: acepta formatos MX con lada
  const phoneRules = [
    {
      test: v => {
        if (!v.trim()) return true;           // opcional — si está vacío, no hay error
        return GBForms.isPhone(v);
      },
      message: 'Ingresa un número válido de al menos 10 dígitos.'
    }
  ];

  const messageRules = [
    GBForms.RULES.required,
    { test: v => v.trim().length >= 10, message: 'El mensaje debe tener al menos 10 caracteres.' }
  ];

  // ── Live validation ─────────────────────────────────────────
  if (firstNameInput) GBForms.attachLiveValidation(firstNameInput, [
    { test: GBForms.isNotEmpty, message: 'El nombre es obligatorio.' }
  ]);

  if (lastNameInput) GBForms.attachLiveValidation(lastNameInput, [
    { test: GBForms.isNotEmpty, message: 'Los apellidos son obligatorios.' }
  ]);

  if (emailInput)   GBForms.attachLiveValidation(emailInput,   emailRules);
  if (phoneInput)   GBForms.attachLiveValidation(phoneInput,   phoneRules);
  if (messageInput) GBForms.attachLiveValidation(messageInput, messageRules);

  // ── Contador de caracteres del mensaje ──────────────────────
  if (messageInput && charCounter) {
    const updateCounter = () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len}/500`;
      charCounter.className   = 'char-counter ' + (len < 10 ? 'char-counter--warn' : 'char-counter--ok');
    };
    messageInput.addEventListener('input', updateCounter);
  }

  // ── Custom phone flag selector ───────────────────────────────
  const phoneFlagBtn      = document.getElementById('phoneFlagBtn');
  const phoneFlagDropdown = document.getElementById('phoneFlagDropdown');
  const selectedFlag      = document.getElementById('selectedFlag');
  const selectedCode      = document.getElementById('selectedCode');
  const countryCodeInput  = document.getElementById('countryCode');

  if (phoneFlagBtn && phoneFlagDropdown) {
    phoneFlagBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = phoneFlagDropdown.classList.contains('is-open');
      phoneFlagDropdown.classList.toggle('is-open', !isOpen);
      this.setAttribute('aria-expanded', String(!isOpen));
    });

    phoneFlagDropdown.querySelectorAll('.phone-flag-option').forEach(option => {
      option.addEventListener('click', function () {
        const code = this.dataset.code;
        const iso  = this.dataset.iso;

        if (selectedFlag) selectedFlag.innerHTML = `<span class="fi fi-${iso}"></span>`;
        if (selectedCode) selectedCode.textContent = code;
        if (countryCodeInput) countryCodeInput.value = code;

        phoneFlagDropdown.querySelectorAll('.phone-flag-option')
          .forEach(o => o.classList.remove('is-selected'));
        this.classList.add('is-selected');

        phoneFlagDropdown.classList.remove('is-open');
        phoneFlagBtn.setAttribute('aria-expanded', 'false');
        phoneFlagBtn.focus();
      });
    });

    document.addEventListener('click', () => {
      phoneFlagDropdown.classList.remove('is-open');
      phoneFlagBtn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && phoneFlagDropdown.classList.contains('is-open')) {
        phoneFlagDropdown.classList.remove('is-open');
        phoneFlagBtn.setAttribute('aria-expanded', 'false');
        phoneFlagBtn.focus();
      }
    });
  }

  // ── Submit ──────────────────────────────────────────────────
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const termsEl    = document.getElementById('terms');
      const termsError = document.getElementById('terms-error');
      const termsOk    = termsEl?.checked ?? false;

      const valid = GBForms.validateForm([
        { input: firstNameInput, rules: [{ test: GBForms.isNotEmpty, message: 'El nombre es obligatorio.' }] },
        { input: lastNameInput,  rules: [{ test: GBForms.isNotEmpty, message: 'Los apellidos son obligatorios.' }] },
        { input: emailInput,     rules: emailRules   },
        { input: phoneInput,     rules: phoneRules   },
        { input: messageInput,   rules: messageRules }
      ]);

      if (!termsOk && termsError) {
        termsError.textContent = 'Debes aceptar los términos para continuar.';
      } else if (termsError) {
        termsError.textContent = '';
      }

      if (!valid || !termsOk) {
        contactForm.querySelector('.input-error')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Feedback visual inmediato con toast
      GBToast.show('¡Mensaje enviado! Te responderemos pronto.', 'success');

      const submitBtn = contactForm.querySelector('.contact-submit');
      if (submitBtn) {
        submitBtn.disabled    = true;
        submitBtn.textContent = '✓ Mensaje enviado';
      }

      console.log('Contacto enviado:', {
        firstName: firstNameInput?.value.trim(),
        lastName:  lastNameInput?.value.trim(),
        email:     emailInput?.value.trim(),
        phone:     phoneInput?.value.trim(),
        message:   messageInput?.value.trim()
      });

      // Reset después de 3 s
      setTimeout(() => {
        contactForm.reset();
        if (charCounter) { charCounter.textContent = ''; charCounter.className = 'char-counter'; }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            Enviar mensaje`;
        }
      }, 3000);
    });
  }

});
