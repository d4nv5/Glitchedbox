// Glitched Box — Favorites System
// Espejado al patrón de window.gbCart en gb-core.js

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // FAVORITES SYSTEM
  // =========================

  const STORAGE_KEY = 'gb_favorites';

  window.gbFavorites = {

    // Obtener lista de favoritos desde localStorage
    getAll: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    },

    // Guardar lista completa y sincronizar badge
    _save: function (list) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      this.updateBadge();
      this._dispatchChange();
    },

    // Verificar si un producto ya está en favoritos
    has: function (productId) {
      return this.getAll().some(item => item.id === productId);
    },

    // Agregar producto a favoritos
    add: function (product) {
      if (this.has(product.id)) return false;
      const list = this.getAll();
      list.push({
        id:          product.id,
        name:        product.name,
        price:       product.price,
        image:       product.image  || '',
        availability: product.availability || '',
        href:        product.href   || '#',
        addedAt:     Date.now()
      });
      this._save(list);
      return true;
    },

    // Quitar producto de favoritos
    remove: function (productId) {
      const list = this.getAll().filter(item => item.id !== productId);
      this._save(list);
    },

    // Toggle: agrega si no está, quita si ya está
    toggle: function (product) {
      if (this.has(product.id)) {
        this.remove(product.id);
        return false; // ahora NO está en favoritos
      } else {
        this.add(product);
        return true;  // ahora SÍ está en favoritos
      }
    },

    // Contar favoritos
    count: function () {
      return this.getAll().length;
    },

    // Badge eliminado del navbar (no confundir con carrito)
    updateBadge: function () { /* sin badge */ },

    // Disparar evento custom para que favorites.html pueda escuchar
    _dispatchChange: function () {
      window.dispatchEvent(new CustomEvent('gb:favorites:changed'));
    }
  };

  // =========================
  // INICIALIZAR BADGE
  // =========================
  window.gbFavorites.updateBadge();

  // =========================
  // ACTIVAR BOTONES .favorite-button EN CUALQUIER PÁGINA
  // (product-page, index, shop, etc.)
  // =========================
  function initFavoriteButtons() {
    document.querySelectorAll('.favorite-button, .wishlist-btn').forEach(btn => {
      const product = readProductData(btn);
      if (!product) return;

      // Sincronizar estado visual al cargar
      syncButtonState(btn, product.id);

      // Evitar doble binding
      if (btn.dataset.favBound) return;
      btn.dataset.favBound = 'true';

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isNowFav = window.gbFavorites.toggle(product);
        syncButtonState(btn, product.id);

        if (isNowFav) {
          GBToast.show(`${product.name} agregado a favoritos`, "success", { icon: "heart" });
        } else {
          // Al quitar: toast con opción de deshacer
          GBToast.show(`${product.name} eliminado de favoritos`, "error", {
            icon: "heart-broken",
            undo: { label: "Deshacer", callback: () => window.gbFavorites.add(product) }
          });
        }
      });
    });
  }

  // Leer datos del producto desde data-* del botón o del contenedor más cercano
  function readProductData(btn) {
    // Primero buscamos en el propio botón
    let id    = btn.dataset.productId;
    let name  = btn.dataset.productName;
    let price = btn.dataset.productPrice;
    let image = btn.dataset.productImage;
    let href  = btn.dataset.productHref;
    let availability = btn.dataset.productAvailability;

    // Si el botón no tiene los datos, buscar en el contenedor padre (.product-card o .product-top)
    if (!id) {
      const card = btn.closest('[data-product-id]') ||
                   btn.closest('.product-card[data-product-id]');
      if (card) {
        id    = card.dataset.productId;
        name  = card.dataset.productName  || name;
        price = card.dataset.productPrice || price;
        image = card.dataset.productImage || image;
        href  = card.dataset.productHref  || href;
        availability = card.dataset.productAvailability || availability;
      }
    }

    // Fallback: leer desde elementos hermanos dentro de .product-card__body o .product-info
    if (!id) return null;

    // Intentar leer nombre/precio del DOM si faltan
    if (!name) {
      const titleEl = btn.closest('.product-card')?.querySelector('.product-card__title') ||
                      btn.closest('.product-info')?.querySelector('.product-title');
      if (titleEl) name = titleEl.textContent.trim();
    }
    if (!price) {
      const priceEl = btn.closest('.product-card')?.querySelector('.product-card__price') ||
                      document.querySelector('.product-price');
      if (priceEl) price = priceEl.textContent.trim();
    }
    if (!image) {
      const imgEl = btn.closest('.product-card')?.querySelector('img') ||
                    document.querySelector('.carousel-image.active, .product-images img');
      if (imgEl) image = imgEl.src;
    }
    if (!availability) {
      const availEl = btn.closest('.product-card')?.querySelector('.product-card__availability');
      if (availEl) availability = availEl.textContent.trim();
    }

    return { id, name: name || 'Producto', price: price || '', image: image || '', href: href || '#', availability: availability || '' };
  }

  // Sincronizar clase/aria del botón según estado guardado
  function syncButtonState(btn, productId) {
    const isFav = window.gbFavorites.has(productId);
    btn.classList.toggle('is-favorite', isFav);
    btn.setAttribute('aria-label', isFav ? 'Quitar de favoritos' : 'Agregar a favoritos');

    // Rellenar/vaciar el SVG del corazón
    const path = btn.querySelector('path');
    if (path) {
      if (isFav) {
        path.setAttribute('fill', 'currentColor');
        path.removeAttribute('stroke');
      } else {
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'currentColor');
      }
    }
  }

  initFavoriteButtons();

  // Re-ejecutar si se inyectan cards dinámicamente (ej. favorites.html las renderiza)
  window.addEventListener('gb:favorites:changed', () => {
    initFavoriteButtons();
  });

  // =========================
  // TOAST — Delegado a GBToast (gb-core.js)
  // Las funciones showUndoToast y showToast han sido reemplazadas
  // por el sistema unificado GBToast.show(msg, type, options)
  // =========================

  // Alias de retrocompatibilidad por si algún script externo lo llama
  window.showFavToast = (message, type) => {
    GBToast.show(message, type === 'success' ? 'success' : 'default');
  };

  // =========================
  // RENDERIZAR GRID EN favorites.html
  // =========================
  const favGrid = document.getElementById('favoritesGrid');
  const favEmpty = document.getElementById('favoritesEmpty');
  const favCount = document.getElementById('favoritesCount');

  if (favGrid) {
    renderFavoritesPage();

    window.addEventListener('gb:favorites:changed', renderFavoritesPage);
  }

  function renderFavoritesPage() {
    const list = window.gbFavorites.getAll();

    // Actualizar contador en el título
    if (favCount) {
      favCount.textContent = list.length === 1 ? '1 producto' : `${list.length} productos`;
    }

    // Estado vacío
    if (list.length === 0) {
      favGrid.innerHTML = '';
      if (favEmpty) favEmpty.hidden = false;
      return;
    }

    if (favEmpty) favEmpty.hidden = true;

    // Renderizar cards usando la misma estructura de .product-card de home.css
    favGrid.innerHTML = list.map(item => `
      <article class="product-card glow-border" data-product-id="${item.id}">
        <!-- Wishlist btn flotante — quitar de favoritos -->
        <button
          class="wishlist-btn is-liked fav-card__remove-btn"
          data-product-id="${item.id}"
          aria-label="Quitar de favoritos"
          title="Quitar de favoritos"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"/>
          </svg>
        </button>
        <a href="${item.href}" class="product-card__media">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
        </a>
        <div class="product-card__body">
          <h3 class="product-card__title">${item.name}</h3>
          <div class="product-card__price-section">
            <span class="product-card__price">${item.price}</span>
            ${item.availability ? `<p class="product-card__availability${item.availability === 'Edición única' ? ' product-card__availability--badge' : ''}">${item.availability}</p>` : ''}
          </div>
          <div class="fav-card__actions">
            <button
              class="btn btn--primary btn--sm fav-card__add-btn glitch-text"
              data-product-id="${item.id}"
              data-text="Agregar al carrito"
              aria-label="Agregar al carrito"
            >
              <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 16C4.9 16 4.01 16.9 4.01 18C4.01 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM0 0V2H2L5.6 9.59L4.24 12.04C4.09 12.32 4 12.65 4 13C4 14.1 4.9 15 6 15H18V13H6.42C6.28 13 6.17 12.89 6.17 12.75L6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.58 16.3 9.97L19.88 3.48C19.96 3.34 20 3.17 20 3C20 2.45 19.55 2 19 2H4.21L3.27 0H0ZM16 16C14.9 16 14.01 16.9 14.01 18C14.01 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16Z" fill="currentColor"/>
              </svg>
              Agregar al carrito
            </button>
          </div>
        </div>
      </article>
    `).join('');

    // Binding: botones de quitar favorito
    favGrid.querySelectorAll('.fav-card__remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.dataset.productId;
        const item = window.gbFavorites.getAll().find(i => i.id === id);
        window.gbFavorites.remove(id);
        GBToast.show(`${item ? item.name : 'Producto'} eliminado de favoritos`, "error", {
          icon: "heart-broken",
          undo: { label: "Deshacer", callback: () => item && window.gbFavorites.add(item) }
        });
      });
    });

    // Binding: botones de agregar al carrito
    favGrid.querySelectorAll('.fav-card__add-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.dataset.productId;
        const item = window.gbFavorites.getAll().find(i => i.id === id);
        if (!item || !window.gbCart) return;

        const priceNum = parseFloat((item.price || '').replace(/[^0-9.]/g, '')) || 0;
        // gbCart.add() ya dispara su propio toast — no duplicar aquí
        window.gbCart.add({
          id:       item.id,
          name:     item.name,
          variant:  'default',
          price:    priceNum,
          quantity: 1,
          image:    item.image
        });
      });
    });
  }

});
