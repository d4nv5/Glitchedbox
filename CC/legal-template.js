/* legal-template.js — Glitched Box */

(function () {
  // ── Scroll spy para TOC — IntersectionObserver ──────────────
  const headings = Array.from(
    document.querySelectorAll('.legal-content h2[id], .legal-content h3[id]')
  );
  const tocLinks = document.querySelectorAll('.legal-toc__link');

  if (!headings.length || !tocLinks.length) return;

  // Mapa: id → link
  const linkMap = {};
  tocLinks.forEach(link => {
    const id = link.getAttribute('href')?.slice(1);
    if (id) linkMap[id] = link;
  });

  function setActive(id) {
    tocLinks.forEach(l => l.classList.remove('is-active'));
    if (id && linkMap[id]) linkMap[id].classList.add('is-active');
  }

  let activeId = '';
  const offset = 120;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
          setActive(activeId);
        }
      });
    },
    {
      rootMargin: `-${offset}px 0px -60% 0px`,
      threshold: 0,
    }
  );

  headings.forEach(h => observer.observe(h));

  // Activar la primera sección al cargar
  if (headings[0]) setActive(headings[0].id);

  // ── Smooth scroll al hacer click en TOC ────────────────────
  tocLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        setActive(id);
      }
    });
  });
})();
