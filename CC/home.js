// HOME PAGE - Glitched Box
// Animaciones scroll + FAQ accordion

document.addEventListener("DOMContentLoaded", () => {
  
  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Opcional: dejar de observar después de animar
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los elementos con la clase animate-on-scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));

  // ============================================
  // FAQ ACCORDION — usa sistema .accordion del core
  // ============================================
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach((acc) => {
    const header = acc.querySelector('.accordion-header');
    const content = acc.querySelector('.accordion-content');
    const icon = acc.querySelector('.accordion-icon');
    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = acc.classList.contains('is-open');

      // Cerrar todos (comportamiento acordeón único)
      accordions.forEach((a) => {
        a.classList.remove('is-open');
        const h = a.querySelector('.accordion-header');
        const ic = a.querySelector('.accordion-icon');
        if (h) h.setAttribute('aria-expanded', 'false');
        if (ic) ic.textContent = '+';
      });

      // Abrir el actual si estaba cerrado
      if (!isOpen) {
        acc.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = '−';
      }
    });
  });
});
