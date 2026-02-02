## Armar Build
npm run build:zip


# 🛒 Glitched Box - Página del Carrito

Código completo y responsive de la página del carrito, exportado de Webflow.

---

## 📦 Contenido

```
glitchedbox-cart/
├── cart.html           # HTML del carrito
├── cart-styles.css     # CSS responsive
├── cart-script.js      # JavaScript funcional
└── README.md           # Esta documentación
```

---

## ✨ Características

### ✅ Diseño Responsive
- **Desktop**: > 1024px (2 columnas: items + resumen)
- **Tablet**: 768px - 1024px (2 columnas ajustadas)
- **Mobile**: < 768px (1 columna, resumen abajo)

### ✅ Funcionalidades
- Eliminar items del carrito con animación
- Mover items a lista de deseos
- Cálculo automático de totales
- Envío gratis a partir de $2,500 MXN
- Mensaje cuando el carrito está vacío
- Newsletter funcional
- Back to top button

### ✅ UI/UX
- Alerta de envío gratis
- Hover states en todos los elementos
- Animaciones suaves
- Sticky order summary (desktop)
- Botones con feedback visual

---

## 🎨 Integración con Product Page

Esta página usa el **mismo header y footer** que `index.html` (product page). Los archivos son independientes pero mantienen consistencia visual.

### Archivos Compartidos:
- Navbar (idéntico)
- Footer (idéntico)
- Newsletter (idéntico)
- Variables CSS (iguales)
- Tipografía Inter

---

## 🚀 Instalación

### Opción 1: Junto con Product Page

```
mi-sitio/
├── index.html          (página de producto)
├── cart.html           (página de carrito)
├── styles.css          (CSS del producto)
├── cart-styles.css     (CSS del carrito)
├── script.js           (JS del producto)
├── cart-script.js      (JS del carrito)
└── README.md
```

### Opción 2: Solo Carrito

Sube los 3 archivos del carrito a tu hosting.

---

## 🔗 Navegación Entre Páginas

Para vincular las páginas, actualiza los links:

### En index.html (Product Page):
```html
<!-- Botón "Agregar al carrito" redirige a cart -->
<button onclick="window.location.href='cart.html'">
    Agregar al carrito
</button>

<!-- O el ícono del carrito en navbar -->
<a href="cart.html" class="nav-icon-btn cart-btn">
```

### En cart.html (Cart Page):
```html
<!-- Logo vuelve a home/productos -->
<a href="index.html" class="logo">

<!-- Botón "continuar comprando" -->
<a href="index.html">Ir a la tienda</a>
```

---

## 🛠️ Personalización

### Cambiar Items del Carrito

Edita en `cart.html` las secciones `.cart-item`:

```html
<div class="cart-item">
    <div class="cart-item-image">
        <img src="TU_IMAGEN.jpg" alt="Producto">
    </div>
    <div class="cart-item-info">
        <h3 class="cart-item-name">Nombre</h3>
        <div class="cart-item-details">
            <span>Versión: Tu Variante</span>
            <span>Tamaño: X in</span>
        </div>
        <div class="cart-item-price">$XXX MXN</div>
    </div>
    <!-- ...resto del item -->
</div>
```

### Actualizar Precios

En `cart-script.js`, línea 10, actualiza el array `items`:

```javascript
const cartState = {
    items: [
        {
            id: 1,
            name: 'Nombre Producto',
            variant: 'Color/Versión',
            size: 'Tamaño',
            price: 1600, // ← Precio en MXN
            image: 'URL_IMAGEN'
        }
    ]
};
```

### Cambiar Umbral de Envío Gratis

En `cart-script.js`, línea 29:

```javascript
function calculateTotals() {
    const subtotal = cartState.items.reduce((sum, item) => sum + item.price, 0);
    return {
        subtotal,
        shipping: subtotal >= 2500 ? 0 : 150, // ← Cambia 2500 por tu umbral
        total: subtotal >= 2500 ? subtotal : subtotal + 150
    };
}
```

---

## 💳 Conectar con Checkout

### Botón "Proceder al pago"

En `cart.html`, línea ~200:

```html
<button class="checkout-btn" onclick="window.location.href='checkout.html'">
    Proceder al proceso de pago
</button>
```

### O integra con:
- **Stripe**: [stripe.com/payments/checkout](https://stripe.com/payments/checkout)
- **PayPal**: [paypal.com/buttons](https://www.paypal.com/buttons/)
- **MercadoPago**: [mercadopago.com.mx](https://www.mercadopago.com.mx/)
- **Conekta**: [conekta.com](https://conekta.com/)

---

## 📱 Responsive Breakpoints

### Desktop (>1024px)
```css
.cart-layout {
    grid-template-columns: 1fr 400px;
    gap: 64px;
}

.order-summary {
    position: sticky;
    top: 100px;
}
```

### Tablet (768px - 1024px)
```css
.cart-layout {
    grid-template-columns: 1fr 350px;
    gap: 48px;
}
```

### Mobile (<768px)
```css
.cart-layout {
    grid-template-columns: 1fr;
    gap: 32px;
}

.order-summary {
    position: static; /* ya no sticky */
}

.cart-item {
    grid-template-columns: 100px 1fr;
}
```

---

## 🎨 Colores y Estilos

Usa las mismas variables que `styles.css`:

```css
:root {
    --color-accent: #8b5cf6;      /* Púrpura */
    --color-success: #10b981;     /* Verde (envío gratis) */
    --color-bg-primary: #0a0a0a;  /* Negro */
}
```

---

## ⚡ Funcionalidades JavaScript

### Eliminar Item
```javascript
function removeItem(button) {
    // Animación de salida
    cartItem.style.opacity = '0';
    
    // Eliminar del DOM
    setTimeout(() => cartItem.remove(), 300);
    
    // Actualizar totales
    updateSummary();
}
```

### Mover a Wishlist
```javascript
function moveToWishlist(button) {
    // Feedback visual
    button.textContent = '¡Movido! ✓';
    
    // Eliminar después de 1s
    setTimeout(() => removeItem(...), 1000);
}
```

### Carrito Vacío
Si no quedan items, muestra mensaje automáticamente con botón "Ir a la tienda".

---

## 🔄 Persistencia de Datos

Para guardar el carrito entre sesiones:

### LocalStorage
```javascript
// Guardar
localStorage.setItem('cart', JSON.stringify(cartState.items));

// Cargar
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    cartState.items = JSON.parse(savedCart);
}
```

### Cookies
```javascript
document.cookie = `cart=${JSON.stringify(cartState.items)}; max-age=86400`;
```

### Backend
Conecta con tu API para sincronizar el carrito del usuario.

---

## 🐛 Troubleshooting

### Los totales no se calculan
- Verifica que `cart-script.js` esté cargando
- Revisa la consola por errores
- Asegúrate de que los IDs `#subtotal` y `#total` existan

### Los botones no funcionan
- Verifica que las clases `.cart-item-remove` y `.cart-item-wishlist` estén correctas
- Revisa que `setupEventListeners()` se esté ejecutando

### No es responsive
- Verifica que `cart-styles.css` esté enlazado
- Revisa el viewport meta tag

---

## 📊 SEO & Performance

### Meta Tags Recomendados
```html
<title>Carrito de Compras - Glitched Box</title>
<meta name="description" content="Revisa tu carrito y completa tu compra">
<meta name="robots" content="noindex"> <!-- Carrito no debe indexarse -->
```

### Lazy Loading
Las imágenes ya usan loading nativo:
```html
<img loading="lazy" src="...">
```

---

## 🎯 Próximos Pasos

1. ✅ Integra con tu página de producto
2. ✅ Conecta el checkout
3. ✅ Agrega persistencia (localStorage)
4. ✅ Implementa cantidades editables
5. ✅ Agrega cupones de descuento
6. ✅ Sube a producción

---

## 💡 Mejoras Opcionales

### Contador de Cantidad
Agrega inputs para cambiar cantidad:
```html
<div class="quantity-controls">
    <button>-</button>
    <span>1</span>
    <button>+</button>
</div>
```

### Cupones de Descuento
```html
<div class="coupon-section">
    <input placeholder="Código de cupón">
    <button>Aplicar</button>
</div>
```

### Impuestos Desglosados
```html
<div class="summary-row">
    <span>IVA (16%)</span>
    <span id="tax">$XXX</span>
</div>
```

---

## ✅ Checklist de Deploy

- [ ] Vinculado con product page
- [ ] Checkout conectado
- [ ] Precios actualizados
- [ ] Imágenes reales
- [ ] Links de navegación funcionando
- [ ] Responsive testeado
- [ ] JavaScript sin errores
- [ ] Analytics instalado (opcional)

---

**¡Tu carrito está listo para producción!** 🛒✨

---

**Creado desde Webflow** | Febrero 2026


