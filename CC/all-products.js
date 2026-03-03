// All Products JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Filter Accordion
    // ============================================
    const filterTitles = document.querySelectorAll('.filter-title');
    
    filterTitles.forEach(title => {
        title.addEventListener('click', function() {
            const filterGroup = this.parentElement;
            filterGroup.classList.toggle('collapsed');
        });
    });

    // ============================================
    // Filter Logic
    // ============================================
    const checkboxes = document.querySelectorAll('.filter-content input[type="checkbox"]');
    const productCards = document.querySelectorAll('.product-card');
    const resultsCount = document.querySelector('.results-count strong');
    const activeFiltersContainer = document.querySelector('.active-filters');
    const activeFiltersList = document.querySelector('.active-filters-list');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const clearAllFiltersBtn = document.querySelector('.clear-all-filters');
    const priceMinInput = document.getElementById('minPrice');
    const priceMaxInput = document.getElementById('maxPrice');
    const priceMinSlider = document.getElementById('priceMin');
    const priceMaxSlider = document.getElementById('priceMax');

    let activeFilters = {
        category: [],
        collection: [],
        size: [],
        availability: [],
        edition: [],
        artist: [],
        minPrice: 0,
        maxPrice: 5000
    };

    // Filter products
    function filterProducts() {
        let visibleCount = 0;

        productCards.forEach(card => {
            let shouldShow = true;

            // Category filter
            if (activeFilters.category.length > 0) {
                const cardCategory = card.dataset.category;
                if (!activeFilters.category.includes(cardCategory)) {
                    shouldShow = false;
                }
            }

            // Collection filter
            if (activeFilters.collection.length > 0) {
                const cardCollection = card.dataset.collection;
                if (!activeFilters.collection.includes(cardCollection)) {
                    shouldShow = false;
                }
            }

            // Size filter
            if (activeFilters.size.length > 0) {
                const cardSize = card.dataset.size;
                if (!activeFilters.size.includes(cardSize)) {
                    shouldShow = false;
                }
            }

            // Availability filter
            if (activeFilters.availability.length > 0) {
                const cardAvailability = card.dataset.availability;
                if (!activeFilters.availability.includes(cardAvailability)) {
                    shouldShow = false;
                }
            }

            // Edition filter
            if (activeFilters.edition.length > 0) {
                const cardEdition = card.dataset.edition;
                if (!activeFilters.edition.includes(cardEdition)) {
                    shouldShow = false;
                }
            }

            // Artist filter
            if (activeFilters.artist.length > 0) {
                const cardArtist = card.dataset.artist;
                if (!activeFilters.artist.includes(cardArtist)) {
                    shouldShow = false;
                }
            }

            // Price filter
            const cardPrice = parseInt(card.dataset.price);
            if (cardPrice < activeFilters.minPrice || cardPrice > activeFilters.maxPrice) {
                shouldShow = false;
            }

            // Show/hide card
            if (shouldShow) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Update count
        resultsCount.textContent = visibleCount;

        // Update active filters display
        updateActiveFiltersDisplay();
    }

    // Update active filters display
    function updateActiveFiltersDisplay() {
        activeFiltersList.innerHTML = '';
        let hasFilters = false;

        // Add filter tags
        Object.keys(activeFilters).forEach(filterType => {
            if (filterType === 'minPrice' || filterType === 'maxPrice') return;

            activeFilters[filterType].forEach(value => {
                hasFilters = true;
                const tag = document.createElement('div');
                tag.className = 'filter-tag';
                
                const filterLabel = getFilterLabel(filterType, value);
                tag.innerHTML = `
                    ${filterLabel}
                    <button onclick="removeFilter('${filterType}', '${value}')">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                `;
                activeFiltersList.appendChild(tag);
            });
        });

        // Show/hide active filters container
        if (hasFilters) {
            activeFiltersContainer.style.display = 'flex';
        } else {
            activeFiltersContainer.style.display = 'none';
        }
    }

    // Get filter label
    function getFilterLabel(type, value) {
        const labels = {
            category: {
                'vinyl': 'Vinyl Figures',
                'resin': 'Resin Figures',
                'blind-box': 'Blind Boxes',
                'plush': 'Plush',
                'accessories': 'Accesorios'
            },
            collection: {
                'dark-kawaii': 'Dark Kawaii',
                'glitch-squad': 'Glitch Squad',
                'neon-nightmares': 'Neon Nightmares',
                'pixel-demons': 'Pixel Demons'
            },
            size: {
                'mini': 'Mini',
                'standard': 'Standard',
                'large': 'Large',
                'xl': 'XL'
            },
            availability: {
                'in-stock': 'En stock',
                'preorder': 'Pre-order',
                'sold-out': 'Agotado'
            },
            edition: {
                'regular': 'Regular',
                'limited': 'Limitada',
                'exclusive': 'Exclusiva'
            },
            artist: {
                'glitched-studio': 'Glitched Studio',
                'neon-collective': 'Neon Collective',
                'dark-kawaii-crew': 'Dark Kawaii Crew'
            }
        };

        return labels[type]?.[value] || value;
    }

    // Remove filter
    window.removeFilter = function(type, value) {
        const index = activeFilters[type].indexOf(value);
        if (index > -1) {
            activeFilters[type].splice(index, 1);
        }

        // Uncheck corresponding checkbox
        const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }

        filterProducts();
    };

    // Checkbox change handler
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterType = this.name;
            const value = this.value;

            if (this.checked) {
                if (!activeFilters[filterType].includes(value)) {
                    activeFilters[filterType].push(value);
                }
            } else {
                const index = activeFilters[filterType].indexOf(value);
                if (index > -1) {
                    activeFilters[filterType].splice(index, 1);
                }
            }

            filterProducts();
        });
    });

    // Price range inputs
    priceMinInput.addEventListener('input', function() {
        activeFilters.minPrice = parseInt(this.value) || 0;
        priceMinSlider.value = this.value;
        filterProducts();
    });

    priceMaxInput.addEventListener('input', function() {
        activeFilters.maxPrice = parseInt(this.value) || 5000;
        priceMaxSlider.value = this.value;
        filterProducts();
    });

    priceMinSlider.addEventListener('input', function() {
        priceMinInput.value = this.value;
        activeFilters.minPrice = parseInt(this.value);
        filterProducts();
    });

    priceMaxSlider.addEventListener('input', function() {
        priceMaxInput.value = this.value;
        activeFilters.maxPrice = parseInt(this.value);
        filterProducts();
    });

    // Clear all filters
    function clearAllFilters() {
        // Reset active filters
        activeFilters = {
            category: [],
            collection: [],
            size: [],
            availability: [],
            edition: [],
            artist: [],
            minPrice: 0,
            maxPrice: 5000
        };

        // Uncheck all checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset price inputs
        priceMinInput.value = 0;
        priceMaxInput.value = 5000;
        priceMinSlider.value = 0;
        priceMaxSlider.value = 5000;

        filterProducts();
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // ============================================
    // Sorting
    // ============================================
    const sortSelect = document.getElementById('sort');
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const productsGrid = document.querySelector('.products-grid');
        const productsArray = Array.from(productCards);

        productsArray.sort((a, b) => {
            switch(sortValue) {
                case 'price-low':
                    return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                case 'price-high':
                    return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                case 'name-az':
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                case 'name-za':
                    return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
                case 'newest':
                default:
                    return 0; // Keep original order
            }
        });

        // Re-append sorted products
        productsArray.forEach(card => {
            productsGrid.appendChild(card);
        });
    });

    // Wishlist manejado por script inline en HTML

    // ============================================
    // Mobile Filters
    // ============================================
    const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
    const mobileFiltersOverlay = document.querySelector('.mobile-filters-overlay');
    const closeFiltersBtn = document.querySelector('.close-filters');
    const applyFiltersMobileBtn = document.querySelector('.apply-filters-mobile');
    const clearFiltersMobileBtn = document.querySelector('.clear-filters-mobile');

    if (mobileFilterBtn) {
        mobileFilterBtn.addEventListener('click', function() {
            mobileFiltersOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeMobileFilters() {
        mobileFiltersOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeFiltersBtn) {
        closeFiltersBtn.addEventListener('click', closeMobileFilters);
    }

    if (mobileFiltersOverlay) {
        mobileFiltersOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeMobileFilters();
            }
        });
    }

    if (applyFiltersMobileBtn) {
        applyFiltersMobileBtn.addEventListener('click', closeMobileFilters);
    }

    if (clearFiltersMobileBtn) {
        clearFiltersMobileBtn.addEventListener('click', function() {
            clearAllFilters();
            closeMobileFilters();
        });
    }

    // Clone filters to mobile modal
    if (mobileFiltersOverlay) {
        const desktopFilters = document.querySelector('.filters-sidebar').cloneNode(true);
        const mobileFiltersContent = document.querySelector('.mobile-filters-content');
        mobileFiltersContent.appendChild(desktopFilters);

        // Re-attach event listeners for mobile filters
        const mobileCheckboxes = mobileFiltersContent.querySelectorAll('input[type="checkbox"]');
        mobileCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const filterType = this.name;
                const value = this.value;
                
                // Sync with desktop checkbox
                const desktopCheckbox = document.querySelector(`.filters-sidebar input[name="${filterType}"][value="${value}"]`);
                if (desktopCheckbox) {
                    desktopCheckbox.checked = this.checked;
                    desktopCheckbox.dispatchEvent(new Event('change'));
                }
            });
        });
    }

    // ============================================
    // Pagination — 15 items/page, dinámica
    // ============================================
    const ITEMS_PER_PAGE = 15;
    let currentPage = 1;
    const paginationContainer = document.getElementById('pagination');
    const allCards = Array.from(document.querySelectorAll('.product-card'));

    function getVisibleCards() {
        // Respeta los filtros activos: solo cards no ocultas por filtro
        return allCards.filter(c => c.dataset.filteredOut !== 'true');
    }

    function applyPagination() {
        const visible = getVisibleCards();
        const totalPages = Math.max(1, Math.ceil(visible.length / ITEMS_PER_PAGE));

        // Clamp currentPage
        if (currentPage > totalPages) currentPage = totalPages;

        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIdx   = startIdx + ITEMS_PER_PAGE;

        visible.forEach((card, i) => {
            card.style.display = (i >= startIdx && i < endIdx) ? '' : 'none';
        });

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const ARROW_LEFT  = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
        const ARROW_RIGHT = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

        function btn(label, page, isActive, isDisabled, isArrow) {
            const b = document.createElement('button');
            b.className = 'pagination-btn' + (isActive ? ' active' : '');
            b.innerHTML = label;
            if (isDisabled) { b.disabled = true; }
            if (!isDisabled && !isActive) {
                b.addEventListener('click', () => {
                    currentPage = page;
                    applyPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
            return b;
        }

        // Prev arrow
        paginationContainer.appendChild(btn(ARROW_LEFT, currentPage - 1, false, currentPage === 1));

        // Page numbers with smart truncation
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }

        pages.forEach(p => {
            if (p === '...') {
                const dots = document.createElement('span');
                dots.className = 'pagination-dots';
                dots.textContent = '...';
                paginationContainer.appendChild(dots);
            } else {
                paginationContainer.appendChild(btn(p, p, p === currentPage, false));
            }
        });

        // Next arrow
        paginationContainer.appendChild(btn(ARROW_RIGHT, currentPage + 1, false, currentPage === totalPages));
    }

    // Integrar paginación con filterProducts
    const _origFilterProducts = filterProducts;
    // Override: después de filtrar, resetear página y aplicar paginación
    // Hacemos que filterProducts marque las cards en lugar de ocultarlas
    // y la paginación se encarga del show/hide

    // Reemplazar show/hide en filterProducts para usar data-filteredOut
    function filterProductsWithPagination() {
        let visibleCount = 0;
        productCards.forEach(card => {
            let shouldShow = true;
            if (activeFilters.category.length > 0 && !activeFilters.category.includes(card.dataset.category)) shouldShow = false;
            if (activeFilters.collection.length > 0 && !activeFilters.collection.includes(card.dataset.collection)) shouldShow = false;
            if (activeFilters.size.length > 0 && !activeFilters.size.includes(card.dataset.size)) shouldShow = false;
            if (activeFilters.availability.length > 0 && !activeFilters.availability.includes(card.dataset.availability)) shouldShow = false;
            if (activeFilters.edition.length > 0 && !activeFilters.edition.includes(card.dataset.edition)) shouldShow = false;
            const price = parseInt(card.dataset.price);
            if (price < activeFilters.minPrice || price > activeFilters.maxPrice) shouldShow = false;

            card.dataset.filteredOut = shouldShow ? 'false' : 'true';
            if (!shouldShow) card.style.display = 'none';
            else visibleCount++;
        });

        resultsCount.textContent = visibleCount;
        updateActiveFiltersDisplay();
        currentPage = 1;
        applyPagination();
    }

    // Reemplazar la función filterProducts del scope superior
    // (ya que está en el mismo DOMContentLoaded, hacemos el override aquí)
    // Detach los listeners de checkbox y re-attach con la nueva función
    checkboxes.forEach(checkbox => {
        checkbox.replaceWith(checkbox.cloneNode(true));
    });
    const freshCheckboxes = document.querySelectorAll('.filter-content input[type="checkbox"]');
    freshCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterType = this.name;
            const value = this.value;
            if (this.checked) {
                if (!activeFilters[filterType].includes(value)) activeFilters[filterType].push(value);
            } else {
                const idx = activeFilters[filterType].indexOf(value);
                if (idx > -1) activeFilters[filterType].splice(idx, 1);
            }
            filterProductsWithPagination();
        });
    });

    priceMinInput.addEventListener('input', function() { activeFilters.minPrice = parseInt(this.value) || 0; priceMinSlider.value = this.value; filterProductsWithPagination(); });
    priceMaxInput.addEventListener('input', function() { activeFilters.maxPrice = parseInt(this.value) || 5000; priceMaxSlider.value = this.value; filterProductsWithPagination(); });
    priceMinSlider.addEventListener('input', function() { priceMinInput.value = this.value; activeFilters.minPrice = parseInt(this.value); filterProductsWithPagination(); });
    priceMaxSlider.addEventListener('input', function() { priceMaxInput.value = this.value; activeFilters.maxPrice = parseInt(this.value); filterProductsWithPagination(); });

    // Init
    filterProductsWithPagination();

    // ============================================
    // Mobile Menu (from header)
    // ============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // ============================================
    // Cart Count (example)
    // ============================================
    function updateCartCount() {
        const cartCount = localStorage.getItem('cartCount') || '0';
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }

    updateCartCount();

    // ============================================
    // Initialize
    // ============================================
    filterProductsWithPagination(); // Init con paginación correcta
});
