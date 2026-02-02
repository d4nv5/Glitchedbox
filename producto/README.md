# 🎨 Glitched Box - Página de Producto Ecommerce

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Página de producto profesional y completamente funcional para ecommerce de art toys, diseñada para Webflow con todas las funcionalidades interactivas implementadas.

---

## ✨ Características Principales

### 🖼️ Carrusel de Imágenes
- **Loop infinito**: Navega entre 3 vistas del producto con transición suave
- **Controles táctiles**: Swipe gestures para dispositivos móviles
- **Navegación por teclado**: Usa flechas ← → para navegar
- **Botones estilizados**: Con efectos hover y animaciones

### 🎨 Selector de Variantes de Color
- **12 colores disponibles**: Cada uno con 3 vistas diferentes
- **Hover interactivo**: Muestra el nombre del color al pasar el mouse
- **Selección visual**: Borde púrpura indica el color activo
- **Mobile-friendly**: Grid responsive (6 columnas → 4 → 3)
- **Actualización automática**: Cambia imágenes del carrusel al seleccionar color

### 🛒 Sistema de Carrito
- **Contador de cantidad**: Botones +/- con validación (0-99)
- **Badge animado**: Notificación en el navbar con número de items
- **Feedback visual**: Mensajes de éxito/error al agregar productos
- **Validación**: Previene agregar 0 items al carrito

### 📋 Características Adicionales
- **Acordeón de entrega**: Expandible con información de shipping
- **Tabla de especificaciones**: Con mejor padding y legibilidad
- **Newsletter funcional**: Con validación y feedback
- **Productos relacionados**: Grid responsive con hover effects
- **Back to top button**: Aparece después de scroll
- **Botón de favoritos**: Toggle con animación
- **Smooth scroll**: Navegación fluida entre secciones
- **Intersection Observer**: Animaciones al hacer scroll

---

## 📁 Estructura de Archivos

```
glitched-box-product-page/
├── index.html          # Estructura HTML completa
├── styles.css          # Estilos con CSS Variables
├── script.js           # Funcionalidad JavaScript
└── README.md           # Esta documentación
```

---

## 🚀 Implementación en Webflow

### Paso 1: Configuración Inicial

1. **Crea un nuevo proyecto en Webflow**
2. **Ve a Project Settings > Custom Code**
3. **Agrega las fuentes en el `<head>`:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### Paso 2: Estructura HTML

**Opción A - Copiar Todo (Recomendado):**
1. Copia el contenido de `index.html` (desde `<header>` hasta `</footer>`)
2. Pégalo en un nuevo elemento Embed dentro del Body en Webflow

**Opción B - Construir Manualmente:**
1. Usa la estructura del HTML como referencia
2. Construye cada sección usando los elementos nativos de Webflow
3. Asigna las clases CSS correspondientes

### Paso 3: Estilos CSS

1. **Ve a Project Settings > Custom Code**
2. **En el campo "Head Code", agrega:**

```html
<style>
  /* Pega aquí el contenido completo de styles.css */
</style>
```

**Alternativa:** Sube `styles.css` como archivo externo en el Assets panel.

### Paso 4: JavaScript

1. **Ve a Project Settings > Custom Code**
2. **En el campo "Footer Code" (ANTES de `</body>`), agrega:**

```html
<script>
  // Pega aquí el contenido completo de script.js
</script>
```

### Paso 5: Imágenes

**Reemplaza los placeholders con tus imágenes reales:**

1. En el JavaScript, busca el objeto `variantImages`
2. Reemplaza las URLs de placeholder con tus URLs reales:

```javascript
variantImages: {
    blanca: [
        '/images/gallinita-blanca-vista-1.jpg',
        '/images/gallinita-blanca-vista-2.jpg',
        '/images/gallinita-blanca-vista-3.jpg'
    ],
    // ... resto de colores
}
```

3. También actualiza las imágenes en el HTML inicial del carrusel

---

## 🎨 Personalización

### Colores del Tema

Edita las CSS Variables en `styles.css`:

```css
:root {
    --color-bg-primary: #0a0a0a;        /* Fondo principal */
    --color-bg-secondary: #1a1a1a;      /* Fondo secundario */
    --color-accent: #8b5cf6;            /* Color de acento (púrpura) */
    --color-text-primary: #ffffff;      /* Texto principal */
    /* ... más variables */
}
```

### Tipografía

El sitio usa **Inter** como fuente principal (consistente con tu diseño). Si quieres cambiarla:

```css
:root {
    --font-primary: 'Tu-Nueva-Fuente', sans-serif;
    --font-secondary: 'Tu-Nueva-Fuente', sans-serif;
}
```

**Nota:** Inter incluye múltiples pesos (400, 500, 600, 700, 800, 900) para dar flexibilidad visual manteniendo consistencia tipográfica.

### Animaciones

Ajustar velocidades de transición:

```css
:root {
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 📱 Responsive Design

### Breakpoints

- **Desktop**: > 1024px (diseño completo)
- **Tablet**: 768px - 1024px (2 columnas en grid)
- **Mobile**: < 768px (1 columna, navegación simplificada)
- **Small Mobile**: < 480px (3 columnas en variantes)

### Características Mobile

- ✅ Touch gestures (swipe) en el carrusel
- ✅ Navegación compacta (oculta texto en botones)
- ✅ Grid responsive en variantes de color
- ✅ Formulario de newsletter en columna
- ✅ Footer apilado verticalmente
- ✅ Botones táctiles optimizados (48x48px mínimo)

---

## 🔧 Funcionalidades JavaScript

### API Principal

```javascript
// Acceso global al estado y funciones
window.GlitchedBoxApp = {
    selectVariant: (color) => {},    // Cambiar variante
    addToCart: () => {},             // Agregar al carrito
    updateQuantity: (change) => {},  // Actualizar cantidad
    state: {}                        // Estado actual
}
```

### Eventos Personalizados

```javascript
// Ejemplo: Detectar cuando se agrega al carrito
elements.addToCartBtn.addEventListener('click', () => {
    // Tu código personalizado aquí
});
```

---

## ⚙️ Integraciones con Webflow

### CMS Collections

Para conectar con Webflow CMS:

1. **Crea una Collection "Products"** con estos campos:
   - Name (Text)
   - Price (Number)
   - Description (Rich Text)
   - Colors (Multi-reference a "Colors" Collection)
   - Images (Image - múltiples)

2. **Actualiza el HTML** usando Webflow's dynamic content:
   ```html
   <h1 class="product-title">{Product Name}</h1>
   <div class="product-price">${Product Price} MXN</div>
   ```

### Ecommerce

Si usas Webflow Ecommerce:

1. Reemplaza el botón "Agregar al carrito" con el componente nativo
2. Mantén el JavaScript para el contador y animaciones
3. Sincroniza el `state.cartCount` con el carrito real de Webflow

---

## 🎯 Mejoras Implementadas desde el Diseño Original

✅ **Tabla de características**: Mejor padding interno (+4px)
✅ **Variantes simplificadas**: Eliminados botones redundantes, todo integrado en miniaturas
✅ **Hover states**: Nombres de colores al hacer hover
✅ **Mobile optimization**: Grid responsive 6→4→3 columnas
✅ **Carrusel mejorado**: Loop infinito funcional
✅ **Cart badge**: Notificación animada en navbar
✅ **Acordeón funcional**: Tiempo de entrega expandible
✅ **Animaciones suaves**: Intersection Observer para scroll
✅ **Accesibilidad**: Focus states, ARIA labels, navegación por teclado

---

## 🐛 Troubleshooting

### El carrusel no cambia de imagen
- **Verifica** que las imágenes tengan URLs válidas
- **Revisa** la consola del navegador por errores
- **Asegúrate** de que el JavaScript se cargó después del HTML

### Los colores no cambian las imágenes
- **Confirma** que cada color tenga 3 imágenes en `variantImages`
- **Verifica** que el `data-color` en HTML coincida con las keys del objeto

### El badge del carrito no aparece
- **Revisa** que el elemento tenga `id="cartBadge"`
- **Verifica** que el CSS del `.cart-badge.show` esté presente

### Problemas de responsive
- **Asegúrate** de incluir `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- **Verifica** que Webflow no esté sobrescribiendo los media queries

---

## 📊 Performance

### Optimizaciones Incluidas

- ✅ **Lazy loading** de imágenes con Intersection Observer
- ✅ **CSS Variables** para reutilización eficiente
- ✅ **Debounce** en eventos de scroll
- ✅ **Transiciones con GPU** (transform, opacity)
- ✅ **Event delegation** donde es posible
- ✅ **Minificación lista** para producción

### Métricas Esperadas

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Lighthouse Score**: 90+ (Performance)

---

## 🔐 Accesibilidad (A11y)

- ✅ Contraste WCAG AA compliant
- ✅ Navegación por teclado completa
- ✅ ARIA labels en botones
- ✅ Focus states visibles
- ✅ Textos alternativos en imágenes
- ✅ Tamaño mínimo de tap targets (48x48px)

---

## 📝 Próximos Pasos

### Funcionalidades Adicionales Sugeridas

1. **Zoom de imagen**: Modal con imagen ampliada
2. **Reviews y ratings**: Sistema de valoraciones
3. **Compartir en redes**: Botones de social sharing
4. **Wishlist persistente**: Guardar favoritos con localStorage
5. **Quick view**: Modal de vista rápida desde productos relacionados
6. **Filtros de producto**: Por color, precio, disponibilidad
7. **Notificaciones de stock**: Alert cuando haya disponibilidad
8. **Comparador de productos**: Comparar múltiples productos

---

## 🤝 Soporte y Contacto

Si tienes preguntas o necesitas ayuda con la implementación:

1. **Revisa este README completo**
2. **Verifica la consola del navegador** por errores
3. **Asegúrate de seguir todos los pasos** de implementación

---

## 📄 Licencia

Este código fue creado específicamente para Glitched Box y puede ser usado libremente para tu proyecto.

---

## 🎉 ¡Listo para Producción!

Tu página de producto está lista para ser implementada en Webflow. Todos los archivos incluyen:

✅ Código limpio y comentado
✅ Optimizado para performance
✅ Totalmente responsive
✅ Accesible (WCAG AA)
✅ Fácil de mantener y personalizar
✅ Compatible con Webflow CMS y Ecommerce

**¡Mucho éxito con tu tienda Glitched Box! 🎨🐔**

---

**Creado con 💜 por Claude** | Enero 2026
