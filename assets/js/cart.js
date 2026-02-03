/**
 * GLITCHED BOX - Cart Manager
 * Sistema de carrito de compras con localStorage
 * Validacion de stock en tiempo real contra la BD
 */

const CartManager = {
    STORAGE_KEY: 'glitchedbox_cart',
    FREE_SHIPPING_THRESHOLD: 2500,
    SHIPPING_COST: 150,
    API_URL: 'api/get-stock.php',

    /**
     * Obtener el carrito desde localStorage
     */
    getCart: function() {
        try {
            const cart = localStorage.getItem(this.STORAGE_KEY);
            return cart ? JSON.parse(cart) : [];
        } catch (e) {
            console.error('Error al leer el carrito:', e);
            return [];
        }
    },

    /**
     * Guardar el carrito en localStorage
     */
    saveCart: function(cart) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
            this.updateCartBadge();
            return true;
        } catch (e) {
            console.error('Error al guardar el carrito:', e);
            return false;
        }
    },

    /**
     * Consultar stock en tiempo real desde el servidor
     * @param {string|number} productId - ID del producto
     * @returns {Promise<number>} - Stock disponible
     */
    fetchStock: async function(productId) {
        try {
            const response = await fetch(`${this.API_URL}?id=${productId}`);
            const data = await response.json();
            if (data.success) {
                return data.stock;
            }
            console.error('Error al obtener stock:', data.error);
            return 0;
        } catch (e) {
            console.error('Error de red al consultar stock:', e);
            return 0;
        }
    },

    /**
     * Agregar un producto al carrito con validacion de stock en tiempo real
     * @param {Object} product - Objeto con id, name, price, image, variant, quantity
     */
    addToCart: async function(product) {
        const productId = String(product.id);
        const quantityToAdd = product.quantity || 1;

        // Consultar stock actual desde el servidor
        const stockActual = await this.fetchStock(productId);

        if (stockActual === 0) {
            this.showNotification('Producto sin stock disponible', 'warning');
            return false;
        }

        const cart = this.getCart();

        // Buscar si ya existe el producto con la misma variante
        const existingIndex = cart.findIndex(item =>
            item.id === productId && (item.variant || '') === (product.variant || '')
        );

        let cantidadEnCarrito = 0;
        if (existingIndex !== -1) {
            cantidadEnCarrito = cart[existingIndex].quantity;
        }

        const cantidadTotal = cantidadEnCarrito + quantityToAdd;

        // Validar que no exceda el stock
        if (cantidadTotal > stockActual) {
            const disponible = stockActual - cantidadEnCarrito;
            if (disponible <= 0) {
                this.showNotification(`Ya tienes el maximo disponible (${stockActual}) en tu carrito`, 'warning');
                return false;
            }
            this.showNotification(`Solo puedes agregar ${disponible} unidades mas (stock: ${stockActual})`, 'warning');
            return false;
        }

        if (existingIndex !== -1) {
            cart[existingIndex].quantity = cantidadTotal;
            cart[existingIndex].stock = stockActual;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                variant: product.variant || '',
                quantity: quantityToAdd,
                stock: stockActual
            });
        }

        this.saveCart(cart);
        this.showNotification(`${product.name} agregado al carrito`);
        return true;
    },

    /**
     * Remover un producto del carrito
     */
    removeFromCart: function(productId, variant = '') {
        let cart = this.getCart();
        cart = cart.filter(item => !(item.id === productId && (item.variant || '') === variant));
        this.saveCart(cart);
        return true;
    },

    /**
     * Actualizar la cantidad de un producto (usa stock local, sin consultar servidor)
     * @param {string} productId - ID del producto
     * @param {string} variant - Variante del producto
     * @param {number} quantity - Nueva cantidad
     * @param {function} callback - Funcion a llamar despues de actualizar (opcional)
     */
    updateQuantity: function(productId, variant = '', quantity, callback = null) {
        if (quantity <= 0) {
            this.removeFromCart(productId, variant);
            if (callback) callback();
            return true;
        }

        const cart = this.getCart();
        const item = cart.find(i => i.id === productId && (i.variant || '') === variant);

        if (item) {
            // Usar stock guardado localmente (ya se valido al agregar)
            const stock = item.stock || 99;

            if (quantity > stock) {
                this.showNotification(`Solo hay ${stock} unidades disponibles`, 'warning');
                item.quantity = stock;
            } else {
                item.quantity = quantity;
            }
            this.saveCart(cart);
        }

        if (callback) callback();
        return true;
    },

    /**
     * Limpiar el carrito
     */
    clearCart: function() {
        this.saveCart([]);
        return true;
    },

    /**
     * Obtener el numero total de items
     */
    getItemCount: function() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    /**
     * Calcular totales del carrito
     */
    calculateTotals: function() {
        const cart = this.getCart();
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
        const total = subtotal + shipping;

        return {
            subtotal,
            shipping,
            total,
            itemCount: this.getItemCount(),
            freeShipping: subtotal >= this.FREE_SHIPPING_THRESHOLD
        };
    },

    /**
     * Actualizar el badge del carrito en el navbar
     */
    updateCartBadge: function() {
        const count = this.getItemCount();
        const badges = document.querySelectorAll('.cart-badge, #cartBadge');

        badges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.classList.add('show');
                badge.style.display = 'inline-block';
            } else {
                badge.classList.remove('show');
                badge.style.display = 'none';
            }
        });
    },

    /**
     * Mostrar notificacion
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: 'success' o 'warning'
     */
    showNotification: function(message, type = 'success') {
        const existing = document.querySelector('.cart-notification');
        if (existing) {
            existing.remove();
        }

        const isWarning = type === 'warning';
        const iconColor = isWarning ? '#f59e0b' : '#10b981';
        const iconPath = isWarning
            ? 'M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z'
            : 'M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z';

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="${iconPath}" fill="${iconColor}"/>
            </svg>
            <span>${message}</span>
            ${!isWarning ? '<a href="carrito.php">Ver carrito</a>' : ''}
        `;

        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a1a1a;
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            z-index: 10000;
            animation: slideInUp 0.3s ease;
            border: 1px solid #333;
        `;

        const link = notification.querySelector('a');
        if (link) {
            link.style.cssText = `
                color: #8b5cf6;
                text-decoration: none;
                font-weight: 600;
                margin-left: 8px;
            `;
        }

        if (!document.querySelector('#cart-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'cart-notification-styles';
            style.textContent = `
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideOutDown {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(20px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
};

/**
 * Funcion global para agregar al carrito desde botones
 * @param {HTMLElement} button - El boton que disparo el evento
 */
async function addToCartFromButton(button) {
    const productData = {
        id: button.dataset.productId,
        name: button.dataset.productName,
        price: button.dataset.productPrice,
        image: button.dataset.productImage,
        variant: button.dataset.productVariant || '',
        quantity: parseInt(button.dataset.productQuantity) || 1
    };

    if (!productData.id || !productData.name || !productData.price) {
        console.error('Faltan datos del producto:', productData);
        return false;
    }

    // Deshabilitar boton mientras se procesa
    button.disabled = true;
    button.style.opacity = '0.6';

    await CartManager.addToCart(productData);

    // Rehabilitar boton
    button.disabled = false;
    button.style.opacity = '1';

    return true;
}

// Inicializar el badge del carrito cuando se carga la pagina
document.addEventListener('DOMContentLoaded', function() {
    CartManager.updateCartBadge();
});

// Exponer CartManager globalmente
window.CartManager = CartManager;
window.addToCartFromButton = addToCartFromButton;
