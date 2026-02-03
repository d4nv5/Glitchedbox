<?php include('./includes/header.php'); ?>

<link rel="stylesheet" href="CC/cart-styles.css">

<style>
/* Sobrescribir algunos estilos para integrar con el tema del sitio */
body {
    background-color: #000;
}

.navbar {
    display: none; /* Usamos el navbar del header.php */
}

/* Ajustes adicionales */
.cart-section {
    padding-top: 40px;
}

.empty-cart {
    text-align: center;
    padding: 60px 20px;
}

.empty-cart svg {
    margin: 0 auto 20px;
    opacity: 0.3;
}

.empty-cart h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
}

.empty-cart p {
    color: #a0a0a0;
    margin-bottom: 24px;
}

.empty-cart a {
    display: inline-block;
    padding: 12px 32px;
    background: #8b5cf6;
    color: white;
    border-radius: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.3s;
}

.empty-cart a:hover {
    background: #7c3aed;
}

.cart-item-quantity {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
}

.cart-item-quantity button {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: var(--color-bg-tertiary);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s;
}

.cart-item-quantity button:hover {
    background: var(--color-accent);
}

.cart-item-quantity span {
    min-width: 30px;
    text-align: center;
    font-weight: 600;
}
</style>

<!-- BREADCRUMBS -->
<section class="breadcrumbs">
    <div class="container">
        <div class="breadcrumbs-list">
            <a href="index.php" class="breadcrumb-link">Inicio</a>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="breadcrumb-current">Carrito</span>
        </div>
    </div>
</section>

<!-- CART SECTION -->
<main class="cart-section">
    <div class="container">
        <h1 class="cart-title">Carrito</h1>

        <div class="cart-layout">
            <!-- CART ITEMS -->
            <div class="cart-items" id="cartItems">
                <!-- Los items se cargan dinamicamente con JavaScript -->
                <div class="empty-cart" id="emptyCart" style="display: none;">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <path d="M24 64C19.6 64 16.04 67.6 16.04 72C16.04 76.4 19.6 80 24 80C28.4 80 32 76.4 32 72C32 67.6 28.4 64 24 64ZM0 0V8H8L22.4 38.36L16.96 48.16C16.36 49.28 16 50.6 16 52C16 56.4 19.6 60 24 60H72V52H25.68C25.12 52 24.68 51.56 24.68 51L24.8 50.52L28.4 44H58.2C61.2 44 63.84 42.32 65.2 39.88L79.52 13.92C79.84 13.36 80 12.68 80 12C80 9.8 78.2 8 76 8H16.84L13.08 0H0ZM64 64C59.6 64 56.04 67.6 56.04 72C56.04 76.4 59.6 80 64 80C68.4 80 72 76.4 72 72C72 67.6 68.4 64 64 64Z" fill="currentColor"/>
                    </svg>
                    <h2>Tu carrito esta vacio</h2>
                    <p>Agrega productos para comenzar tu compra</p>
                    <a href="index.php#productos">Ir a la tienda</a>
                </div>
            </div>

            <!-- ORDER SUMMARY -->
            <div class="order-summary" id="orderSummary">
                <h2 class="summary-title">Resumen del pedido</h2>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <span class="summary-value" id="subtotal">$0.00 MXN</span>
                </div>

                <div class="summary-section">
                    <div class="summary-label">Tarifas estimadas</div>
                    <div class="summary-row">
                        <span>Enviar a domicilio</span>
                        <span id="shippingCost" class="summary-free">Gratis</span>
                    </div>
                </div>

                <div class="summary-total">
                    <span>Total</span>
                    <span class="summary-total-value" id="total">$0.00 MXN</span>
                </div>

                <div class="summary-note">
                    El total del pedido incluye impuestos. Tiempo de entrega de 3 a 7 dias.
                </div>

                <button class="checkout-btn" onclick="proceedToCheckout()">Proceder al proceso de pago</button>
            </div>
        </div>
    </div>
</main>

<!-- Free Shipping Alert (se muestra dinamicamente) -->
<template id="freeShippingTemplate">
    <div class="free-shipping-alert">
        Has calificado para recibir envio gratuito!
    </div>
</template>

<!-- Cart Item Template -->
<template id="cartItemTemplate">
    <div class="cart-item" data-item-id="" data-stock="">
        <div class="cart-item-image">
            <img src="" alt="">
        </div>
        <div class="cart-item-info">
            <h3 class="cart-item-name"></h3>
            <div class="cart-item-details">
                <span class="cart-item-variant"></span>
                <span class="cart-item-stock" style="color: #a0a0a0; font-size: 12px; margin-left: 10px;"></span>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn-minus" onclick="updateQuantity(this, -1)">-</button>
                <span class="quantity-value">1</span>
                <button class="qty-btn-plus" onclick="updateQuantity(this, 1)">+</button>
            </div>
            <div class="cart-item-price"></div>
        </div>
        <div class="cart-item-actions">
            <button class="cart-item-remove" aria-label="Eliminar del carrito" onclick="removeFromCart(this)">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 2V0H15V2H20V4H18V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V4H0V2H5ZM4 4V19H16V4H4ZM7 7H9V16H7V7ZM11 7H13V16H11V7Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script src="assets/js/cart.js"></script>
<script>
// Inicializar la pagina del carrito
document.addEventListener('DOMContentLoaded', function() {
    renderCartPage();
});

function renderCartPage() {
    const cart = CartManager.getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const orderSummary = document.getElementById('orderSummary');

    // Limpiar contenedor (excepto el empty cart)
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item, .free-shipping-alert');
    existingItems.forEach(item => item.remove());

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        orderSummary.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    orderSummary.style.display = 'block';

    // Calcular totales
    const totals = CartManager.calculateTotals();

    // Mostrar alerta de envio gratis si aplica
    if (totals.subtotal >= 2500) {
        const freeShippingTemplate = document.getElementById('freeShippingTemplate');
        const freeShippingAlert = freeShippingTemplate.content.cloneNode(true);
        cartItemsContainer.insertBefore(freeShippingAlert, cartItemsContainer.firstChild);
    }

    // Renderizar items
    const template = document.getElementById('cartItemTemplate');

    cart.forEach(item => {
        const itemElement = template.content.cloneNode(true);
        const cartItem = itemElement.querySelector('.cart-item');
        const stock = item.stock || 99;

        cartItem.dataset.itemId = item.id;
        cartItem.dataset.variant = item.variant || '';
        cartItem.dataset.stock = stock;

        const img = itemElement.querySelector('.cart-item-image img');
        img.src = item.image;
        img.alt = item.name;

        itemElement.querySelector('.cart-item-name').textContent = item.name;
        itemElement.querySelector('.cart-item-variant').textContent = item.variant ? `Version: ${item.variant}` : '';
        itemElement.querySelector('.cart-item-stock').textContent = `(${stock} disponibles)`;
        itemElement.querySelector('.quantity-value').textContent = item.quantity;
        itemElement.querySelector('.cart-item-price').textContent = `$${(item.price * item.quantity).toLocaleString('es-MX')} MXN`;

        // Deshabilitar boton + si se alcanzo el stock
        const plusBtn = itemElement.querySelector('.qty-btn-plus');
        if (item.quantity >= stock) {
            plusBtn.disabled = true;
            plusBtn.style.opacity = '0.5';
            plusBtn.style.cursor = 'not-allowed';
        }

        cartItemsContainer.appendChild(itemElement);
    });

    // Actualizar resumen
    updateSummary(totals);
}

function updateSummary(totals) {
    document.getElementById('subtotal').textContent = `$${totals.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
    document.getElementById('total').textContent = `$${totals.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;

    const shippingEl = document.getElementById('shippingCost');
    if (totals.shipping === 0) {
        shippingEl.textContent = 'Gratis';
        shippingEl.className = 'summary-free';
    } else {
        shippingEl.textContent = `$${totals.shipping.toLocaleString('es-MX')} MXN`;
        shippingEl.className = 'summary-value';
    }
}

function updateQuantity(button, delta) {
    const cartItem = button.closest('.cart-item');
    const itemId = cartItem.dataset.itemId;
    const variant = cartItem.dataset.variant;

    const cart = CartManager.getCart();
    const item = cart.find(i => i.id === itemId && (i.variant || '') === variant);

    if (item) {
        const newQuantity = item.quantity + delta;

        // Validar minimo
        if (newQuantity <= 0) {
            removeFromCart(cartItem.querySelector('.cart-item-remove'));
            return;
        }

        // Usar validacion de stock local (instantaneo)
        CartManager.updateQuantity(itemId, variant, newQuantity);
        renderCartPage();
    }
}

function removeFromCart(button) {
    const cartItem = button.closest('.cart-item');
    const itemId = cartItem.dataset.itemId;
    const variant = cartItem.dataset.variant;

    // Animacion de salida
    cartItem.style.opacity = '0';
    cartItem.style.transform = 'translateX(-20px)';
    cartItem.style.transition = 'all 0.3s ease';

    setTimeout(() => {
        CartManager.removeFromCart(itemId, variant);
        renderCartPage();
    }, 300);
}

function proceedToCheckout() {
    const cart = CartManager.getCart();
    if (cart.length === 0) {
        alert('Tu carrito esta vacio');
        return;
    }

    // Aqui se implementaria la logica del checkout
    alert('Redirigiendo al proceso de pago...');
    // window.location.href = 'checkout.php';
}
</script>

<?php include('./includes/footer.php'); ?>
