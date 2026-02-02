// ====================================
// ESTADO DEL CARRITO
// ====================================
const cartState = {
    items: [
        {
            id: 1,
            name: 'Reaper',
            variant: 'Plasma',
            size: '4.3 in',
            price: 1600,
            image: 'https://cdn.prod.website-files.com/697ede50720ea849f52717f1/697ee38a6c744cda21fa8519_reaper_plasma_card_300x300.webp'
        },
        {
            id: 2,
            name: 'Reaper',
            variant: 'Espíritu',
            size: '4.3 in',
            price: 1600,
            image: 'https://cdn.prod.website-files.com/697ede50720ea849f52717f1/697ee38bbaaec7f1666d3cb9_reaper_espiritu_card_300x300.webp'
        }
    ]
};

// ====================================
// ELEMENTOS DEL DOM
// ====================================
const elements = {
    subtotalEl: document.getElementById('subtotal'),
    totalEl: document.getElementById('total'),
    newsletterForm: document.getElementById('newsletterForm'),
    backToTop: document.getElementById('backToTop'),
    removeButtons: document.querySelectorAll('.cart-item-remove'),
    wishlistButtons: document.querySelectorAll('.cart-item-wishlist')
};

// ====================================
// CALCULAR TOTALES
// ====================================
function calculateTotals() {
    const subtotal = cartState.items.reduce((sum, item) => sum + item.price, 0);
    return {
        subtotal,
        shipping: subtotal >= 2500 ? 0 : 150,
        total: subtotal >= 2500 ? subtotal : subtotal + 150
    };
}

// ====================================
// ACTUALIZAR UI
// ====================================
function updateSummary() {
    const { subtotal, total } = calculateTotals();
    
    elements.subtotalEl.textContent = `$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
    elements.totalEl.textContent = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
}

// ====================================
// ELIMINAR ITEM
// ====================================
function removeItem(button) {
    const cartItem = button.closest('.cart-item');
    
    // Animación de salida
    cartItem.style.opacity = '0';
    cartItem.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        cartItem.remove();
        
        // Actualizar estado (aquí deberías actualizar cartState.items)
        updateSummary();
        
        // Si el carrito está vacío, mostrar mensaje
        checkEmptyCart();
    }, 300);
}

// ====================================
// MOVER A WISHLIST
// ====================================
function moveToWishlist(button) {
    const cartItem = button.closest('.cart-item');
    const itemName = cartItem.querySelector('.cart-item-name').textContent;
    
    // Feedback visual
    button.textContent = '¡Movido! ✓';
    button.style.backgroundColor = '#10b981';
    button.style.color = 'white';
    button.style.borderColor = '#10b981';
    
    setTimeout(() => {
        removeItem(cartItem.querySelector('.cart-item-remove'));
    }, 1000);
}

// ====================================
// VERIFICAR CARRITO VACÍO
// ====================================
function checkEmptyCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const remainingItems = cartItemsContainer.querySelectorAll('.cart-item').length;
    
    if (remainingItems === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style="margin: 0 auto 20px; opacity: 0.3;">
                    <path d="M24 64C19.6 64 16.04 67.6 16.04 72C16.04 76.4 19.6 80 24 80C28.4 80 32 76.4 32 72C32 67.6 28.4 64 24 64ZM0 0V8H8L22.4 38.36L16.96 48.16C16.36 49.28 16 50.6 16 52C16 56.4 19.6 60 24 60H72V52H25.68C25.12 52 24.68 51.56 24.68 51L24.8 50.52L28.4 44H58.2C61.2 44 63.84 42.32 65.2 39.88L79.52 13.92C79.84 13.36 80 12.68 80 12C80 9.8 78.2 8 76 8H16.84L13.08 0H0ZM64 64C59.6 64 56.04 67.6 56.04 72C56.04 76.4 59.6 80 64 80C68.4 80 72 76.4 72 72C72 67.6 68.4 64 64 64Z" fill="currentColor"/>
                </svg>
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">Tu carrito está vacío</h2>
                <p style="color: #a0a0a0; margin-bottom: 24px;">Agrega productos para comenzar tu compra</p>
                <a href="/product" style="display: inline-block; padding: 12px 32px; background: #8b5cf6; color: white; border-radius: 12px; font-weight: 600; text-decoration: none;">Ir a la tienda</a>
            </div>
        `;
    }
}

// ====================================
// NEWSLETTER
// ====================================
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('.newsletter-input');
    const button = form.querySelector('.newsletter-btn');
    
    // Éxito
    button.textContent = '¡Suscrito! ✓';
    button.style.backgroundColor = '#10b981';
    input.disabled = true;
    
    // Reset
    setTimeout(() => {
        button.textContent = 'Suscribirse';
        button.style.backgroundColor = '';
        input.value = '';
        input.disabled = false;
    }, 3000);
}

// ====================================
// SCROLL
// ====================================
function handleScroll() {
    elements.backToTop.classList.toggle('show', window.scrollY > 300);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====================================
// EVENT LISTENERS
// ====================================
function setupEventListeners() {
    // Botones de eliminar
    elements.removeButtons.forEach(button => {
        button.addEventListener('click', () => removeItem(button));
    });
    
    // Botones de wishlist
    elements.wishlistButtons.forEach(button => {
        button.addEventListener('click', () => moveToWishlist(button));
    });
    
    // Newsletter
    elements.newsletterForm?.addEventListener('submit', handleNewsletterSubmit);
    
    // Scroll
    window.addEventListener('scroll', handleScroll);
    elements.backToTop?.addEventListener('click', scrollToTop);
}

// ====================================
// INICIALIZACIÓN
// ====================================
function init() {
    updateSummary();
    setupEventListeners();
    console.log('✓ Carrito inicializado');
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
