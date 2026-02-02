// ========================================
// STATE MANAGEMENT
// ========================================
const state = {
    currentVariant: 'blanca',
    currentImageIndex: 0,
    cartCount: 0,
    quantity: 0,
    variantImages: {
        blanca: [
            'images/gallina_blanca_1.webp',
            'images/gallina_blanca_2.webp',
            'images/gallina_blanca_3.webp'
        ],
        amarilla: [
            'images/gallina_amarilla_1.webp',
            'images/gallina_amarilla_2.webp',
            'images/gallina_amarilla_3.webp'
        ],
        aqua: [
            'images/gallina_aqua_1.webp',
            'images/gallina_aqua_2.webp',
            'images/gallina_aqua_3.webp'
        ],
        azul: [
            'images/gallina_azul_1.webp',
            'images/gallina_azul_2.webp',
            'images/gallina_azul_3.webp'
        ],
        cafe: [
            'images/gallina_cafe_1.webp',
            'images/gallina_cafe_2.webp',
            'images/gallina_cafe_3.webp'
        ],
        cafe_claro: [
            'images/gallina_cafe_claro_1.webp',
            'images/gallina_cafe_claro_2.webp',
            'images/gallina_cafe_claro_3.webp'
        ],
        gris: [
            'images/gallina_gris_1.webp',
            'images/gallina_gris_2.webp',
            'images/gallina_gris_3.webp'
        ],
        mamey: [
            'images/gallina_mamey_1.webp',
            'images/gallina_mamey_2.webp',
            'images/gallina_mamey_3.webp'
        ],
        dorada: [
            'images/gallina_dorada_1.webp',
            'images/gallina_dorada_2.webp',
            'images/gallina_dorada_3.webp'
        ],
        roja: [
            'images/gallina_roja_1.webp',
            'images/gallina_roja_2.webp',
            'images/gallina_roja_3.webp'
        ],
        roja: [
            'images/gallina_rosa_1.webp',
            'images/gallina_rosa_2.webp',
            'images/gallina_rosa_3.webp'
        ],
        verde: [
            'images/gallina_verde_1.webp',
            'images/gallina_verde_2.webp',
            'images/gallina_verde_3.webp'
        ]
    }
};

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
    carouselImages: document.querySelectorAll('.carousel-image'),
    prevButton: document.querySelector('.carousel-button-prev'),
    nextButton: document.querySelector('.carousel-button-next'),
    variantItems: document.querySelectorAll('.variant-item'),
    currentVariantDisplay: document.getElementById('currentVariant'),
    quantityInput: document.getElementById('quantityInput'),
    quantityPlus: document.querySelector('.quantity-plus'),
    quantityMinus: document.querySelector('.quantity-minus'),
    addToCartBtn: document.getElementById('addToCartBtn'),
    cartBadge: document.getElementById('cartBadge'),
    accordion: document.querySelector('.accordion'),
    accordionHeader: document.querySelector('.accordion-header'),
    backToTop: document.getElementById('backToTop'),
    favoriteButton: document.querySelector('.favorite-button')
};

// ========================================
// CAROUSEL FUNCTIONALITY
// ========================================
function updateCarousel() {
    elements.carouselImages.forEach((img, index) => {
        img.classList.toggle('active', index === state.currentImageIndex);
    });
}

function nextImage() {
    const totalImages = state.variantImages[state.currentVariant].length;
    state.currentImageIndex = (state.currentImageIndex + 1) % totalImages;
    updateCarousel();
    addButtonAnimation(elements.nextButton);
}

function prevImage() {
    const totalImages = state.variantImages[state.currentVariant].length;
    state.currentImageIndex = (state.currentImageIndex - 1 + totalImages) % totalImages;
    updateCarousel();
    addButtonAnimation(elements.prevButton);
}

function addButtonAnimation(button) {
    button.style.transform = 'translateY(-50%) scale(0.9)';
    setTimeout(() => {
        button.style.transform = 'translateY(-50%) scale(1)';
    }, 150);
}

// Update carousel images based on selected variant
function loadVariantImages(variant) {
    const images = state.variantImages[variant];
    elements.carouselImages.forEach((img, index) => {
        img.src = images[index];
        img.alt = `Gallinita ${variant.charAt(0).toUpperCase() + variant.slice(1)} - Vista ${index + 1}`;
    });
}

// ========================================
// COLOR VARIANT SELECTION
// ========================================
function selectVariant(variantColor) {
    // Update state
    state.currentVariant = variantColor;
    state.currentImageIndex = 0;
    
    // Update UI
    elements.variantItems.forEach(item => {
        item.classList.toggle('active', item.dataset.color === variantColor);
    });
    
    // Update variant display
    const variantName = variantColor.charAt(0).toUpperCase() + variantColor.slice(1);
    elements.currentVariantDisplay.textContent = variantName;
    
    // Load new images
    loadVariantImages(variantColor);
    updateCarousel();
    
    // Add animation
    elements.currentVariantDisplay.style.transform = 'scale(1.1)';
    setTimeout(() => {
        elements.currentVariantDisplay.style.transform = 'scale(1)';
    }, 200);
}

// ========================================
// QUANTITY MANAGEMENT
// ========================================
function updateQuantity(change) {
    const newQuantity = Math.max(0, Math.min(99, state.quantity + change));
    
    if (newQuantity !== state.quantity) {
        state.quantity = newQuantity;
        elements.quantityInput.value = state.quantity;
        
        // Add animation
        elements.quantityInput.style.transform = 'scale(1.15)';
        setTimeout(() => {
            elements.quantityInput.style.transform = 'scale(1)';
        }, 150);
    }
}

// ========================================
// CART MANAGEMENT
// ========================================
function addToCart() {
    if (state.quantity === 0) {
        // Show error feedback
        elements.addToCartBtn.style.backgroundColor = '#ef4444';
        elements.addToCartBtn.textContent = 'Selecciona una cantidad';
        
        setTimeout(() => {
            elements.addToCartBtn.style.backgroundColor = '';
            elements.addToCartBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 16C4.9 16 4.01 16.9 4.01 18C4.01 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM0 0V2H2L5.6 9.59L4.24 12.04C4.09 12.32 4 12.65 4 13C4 14.1 4.9 15 6 15H18V13H6.42C6.28 13 6.17 12.89 6.17 12.75L6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.58 16.3 9.97L19.88 3.48C19.96 3.34 20 3.17 20 3C20 2.45 19.55 2 19 2H4.21L3.27 0H0ZM16 16C14.9 16 14.01 16.9 14.01 18C14.01 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16Z" fill="currentColor"/>
                </svg>
                Agregar al carrito
            `;
        }, 2000);
        
        return;
    }
    
    // Add to cart
    state.cartCount += state.quantity;
    updateCartBadge();
    
    // Success feedback
    elements.addToCartBtn.style.backgroundColor = '#10b981';
    elements.addToCartBtn.textContent = '¡Agregado al carrito! ✓';
    
    // Reset quantity
    state.quantity = 0;
    elements.quantityInput.value = 0;
    
    // Reset button after delay
    setTimeout(() => {
        elements.addToCartBtn.style.backgroundColor = '';
        elements.addToCartBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 16C4.9 16 4.01 16.9 4.01 18C4.01 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM0 0V2H2L5.6 9.59L4.24 12.04C4.09 12.32 4 12.65 4 13C4 14.1 4.9 15 6 15H18V13H6.42C6.28 13 6.17 12.89 6.17 12.75L6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.58 16.3 9.97L19.88 3.48C19.96 3.34 20 3.17 20 3C20 2.45 19.55 2 19 2H4.21L3.27 0H0ZM16 16C14.9 16 14.01 16.9 14.01 18C14.01 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16Z" fill="currentColor"/>
            </svg>
            Agregar al carrito
        `;
    }, 2000);
}

function updateCartBadge() {
    elements.cartBadge.textContent = state.cartCount;
    
    if (state.cartCount > 0) {
        elements.cartBadge.classList.add('show');
    } else {
        elements.cartBadge.classList.remove('show');
    }
}

// ========================================
// ACCORDION FUNCTIONALITY
// ========================================
function toggleAccordion() {
    elements.accordion.classList.toggle('active');
}

// ========================================
// FAVORITE FUNCTIONALITY
// ========================================
function toggleFavorite() {
    elements.favoriteButton.classList.toggle('active');
    
    // Add animation
    elements.favoriteButton.style.transform = 'scale(1.2)';
    setTimeout(() => {
        elements.favoriteButton.style.transform = 'scale(1)';
    }, 200);
}

// ========================================
// BACK TO TOP FUNCTIONALITY
// ========================================
function handleScroll() {
    if (window.scrollY > 300) {
        elements.backToTop.classList.add('show');
    } else {
        elements.backToTop.classList.remove('show');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// NEWSLETTER FORM
// ========================================
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('.newsletter-input');
    const button = form.querySelector('.newsletter-button');
    
    // Show success state
    button.textContent = '¡Suscrito! ✓';
    button.style.backgroundColor = '#10b981';
    input.disabled = true;
    
    // Reset after delay
    setTimeout(() => {
        button.textContent = 'Suscribirse';
        button.style.backgroundColor = '';
        input.value = '';
        input.disabled = false;
    }, 3000);
}

// ========================================
// SMOOTH SCROLL FOR NAVIGATION
// ========================================
function handleSmoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================
function handleKeyboardNavigation(e) {
    // Arrow keys for carousel
    if (e.key === 'ArrowLeft') {
        prevImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
    
    // Number keys for quantity (1-9)
    if (e.key >= '0' && e.key <= '9' && document.activeElement === elements.quantityInput) {
        e.preventDefault();
        const value = parseInt(e.key);
        updateQuantity(value - state.quantity);
    }
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.product-card, .specs-table, .newsletter');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ========================================
// LAZY LOADING IMAGES
// ========================================
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// TOUCH GESTURE SUPPORT FOR MOBILE
// ========================================
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipeGesture();
}

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            nextImage();
        } else {
            // Swipe right - previous image
            prevImage();
        }
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
function initEventListeners() {
    // Carousel navigation
    elements.prevButton?.addEventListener('click', prevImage);
    elements.nextButton?.addEventListener('click', nextImage);
    
    // Touch gestures for carousel
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer?.addEventListener('touchstart', handleTouchStart);
    carouselContainer?.addEventListener('touchend', handleTouchEnd);
    
    // Variant selection
    elements.variantItems.forEach(item => {
        item.addEventListener('click', () => {
            selectVariant(item.dataset.color);
        });
    });
    
    // Quantity controls
    elements.quantityPlus?.addEventListener('click', () => updateQuantity(1));
    elements.quantityMinus?.addEventListener('click', () => updateQuantity(-1));
    
    // Cart
    elements.addToCartBtn?.addEventListener('click', addToCart);
    
    // Accordion
    elements.accordionHeader?.addEventListener('click', toggleAccordion);
    
    // Favorite
    elements.favoriteButton?.addEventListener('click', toggleFavorite);
    
    // Back to top
    elements.backToTop?.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', handleScroll);
    
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm?.addEventListener('submit', handleNewsletterSubmit);
    
    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Prevent default drag on images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
}

// ========================================
// INITIALIZATION
// ========================================
function init() {
    // Load initial variant images
    loadVariantImages(state.currentVariant);
    updateCarousel();
    
    // Initialize all features
    initEventListeners();
    initIntersectionObserver();
    initLazyLoading();
    
    // Set initial cart badge state
    updateCartBadge();
    
    // Set first variant as active
    const firstVariant = document.querySelector('.variant-item[data-color="blanca"]');
    if (firstVariant) {
        firstVariant.classList.add('active');
    }
    
    console.log('✓ Glitched Box - Product Page initialized successfully');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#8b5cf6'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export functions for external use (if needed)
window.GlitchedBoxApp = {
    selectVariant,
    addToCart,
    updateQuantity,
    state
};
