// product-page.js - Con modal de descripción

// ============================================
// CORAZÓN TOGGLE (Like/Unlike)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const favoriteButton = document.querySelector('.favorite-button');
    
    if (favoriteButton) {
        let isLiked = favoriteButton.classList.contains('is-favorite');
        
        favoriteButton.addEventListener('click', () => {
            isLiked = !isLiked;
            
            if (isLiked) {
                favoriteButton.classList.add('is-favorite');
                favoriteButton.setAttribute('aria-label', 'Quitar de favoritos');
            } else {
                favoriteButton.classList.remove('is-favorite');
                favoriteButton.setAttribute('aria-label', 'Agregar a favoritos');
            }
        });
    }
});

// ============================================
// MODAL DE DESCRIPCIÓN
// ============================================
const descToggle = document.getElementById('descToggle');
const descriptionModal = document.getElementById('descriptionModal');
const modalClose = document.querySelector('.description-modal__close');
const modalBackdrop = document.querySelector('.description-modal');

if (descToggle) {
    descToggle.addEventListener('click', (e) => {
        e.preventDefault();
        
        // En tablet/mobile: abrir modal
        if (window.innerWidth <= 1024) {
            if (descriptionModal) {
                descriptionModal.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            }
        } else {
            // En desktop: expandir inline
            const productDescription = document.querySelector('.product-description');
            if (productDescription) {
                const isExpanded = productDescription.classList.contains('is-expanded');
                
                if (isExpanded) {
                    productDescription.classList.remove('is-expanded');
                    descToggle.textContent = 'Ver más';
                } else {
                    productDescription.classList.add('is-expanded');
                    descToggle.textContent = 'Ver menos';
                }
            }
        }
    });
}

// Cerrar modal con botón X
if (modalClose) {
    modalClose.addEventListener('click', () => {
        if (descriptionModal) {
            descriptionModal.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    });
}

// Cerrar modal al hacer click en el backdrop
if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            descriptionModal.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    });
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && descriptionModal?.classList.contains('is-open')) {
        descriptionModal.classList.remove('is-open');
        document.body.style.overflow = '';
    }
});

// ============================================
// SLIDER DE IMÁGENES - INFINITO
// ============================================
const sliderTrack = document.querySelector('.slider-track');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

let sliderIndex = 1; // Empezamos en 1 porque clonaremos slides

function initSlider() {
    if (!sliderTrack) return;
    
    const slides = Array.from(sliderTrack.children);
    
    if (slides.length === 0) return;
    
    const slideWidth = slides[0].offsetWidth;

    // Clonar primer y último slide para loop infinito
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    sliderTrack.appendChild(firstClone);
    sliderTrack.insertBefore(lastClone, slides[0]);

    // Posición inicial (en el primer slide real, no el clon)
    sliderTrack.style.transform = `translateX(${-slideWidth * sliderIndex}px)`;

    // Botón siguiente
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const slides = Array.from(sliderTrack.children);
            const slideWidth = slides[0].offsetWidth;
            
            if (sliderIndex >= slides.length - 1) return;
            
            sliderIndex++;
            sliderTrack.style.transition = 'transform 0.35s ease';
            sliderTrack.style.transform = `translateX(${-slideWidth * sliderIndex}px)`;
        });
    }

    // Botón anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const slides = Array.from(sliderTrack.children);
            const slideWidth = slides[0].offsetWidth;
            
            if (sliderIndex <= 0) return;
            
            sliderIndex--;
            sliderTrack.style.transition = 'transform 0.35s ease';
            sliderTrack.style.transform = `translateX(${-slideWidth * sliderIndex}px)`;
        });
    }

    // Detectar fin de transición para hacer el loop infinito
    sliderTrack.addEventListener('transitionend', () => {
        const slides = Array.from(sliderTrack.children);
        const slideWidth = slides[0].offsetWidth;
        
        // Si llegamos al clon del final, saltar al inicio real
        if (sliderIndex === slides.length - 1) {
            sliderTrack.style.transition = 'none';
            sliderIndex = 1;
            sliderTrack.style.transform = `translateX(${-slideWidth * sliderIndex}px)`;
        }
        
        // Si llegamos al clon del inicio, saltar al final real
        if (sliderIndex === 0) {
            sliderTrack.style.transition = 'none';
            sliderIndex = slides.length - 2;
            sliderTrack.style.transform = `translateX(${-slideWidth * sliderIndex}px)`;
        }
    });
}

// Inicializar el slider
initSlider();

// ============================================
// ACORDEÓN (Tiempo de entrega)
// ============================================
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordion = header.closest('.accordion');
        const wasOpen = accordion.classList.contains('is-open');
        
        document.querySelectorAll('.accordion').forEach(acc => {
            acc.classList.remove('is-open');
        });
        
        if (!wasOpen) {
            accordion.classList.add('is-open');
        }
    });
});

// ============================================
// ESTRELLAS INTERACTIVAS
// ============================================
const productRating = document.querySelector('.product-rating--interactive');

if (productRating) {
    const starButtons = productRating.querySelectorAll('.star-button');
    const ratingCountSpan = productRating.querySelector('.rating-count');
    let currentRating = parseInt(productRating.dataset.rating) || 0;

    function updateStars(rating, isPreview = false) {
        starButtons.forEach((button, index) => {
            const value = index + 1;
            
            button.classList.remove('filled', 'half-filled', 'hover-empty', 'hover-preview', 'hover-half');
            
            if (isPreview) {
                if (value <= rating) {
                    button.classList.add('hover-preview');
                } else {
                    button.classList.add('hover-empty');
                }
            } else {
                if (value <= Math.floor(rating)) {
                    button.classList.add('filled');
                } else if (value === Math.ceil(rating) && rating % 1 !== 0) {
                    button.classList.add('half-filled');
                }
            }
        });
        
        if (ratingCountSpan && !isPreview) {
            ratingCountSpan.textContent = `(${rating})`;
        }
    }

    starButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            currentRating = index + 1;
            productRating.dataset.rating = currentRating;
            updateStars(currentRating);
        });

        button.addEventListener('mouseenter', () => {
            updateStars(index + 1, true);
        });
    });

    productRating.addEventListener('mouseleave', () => {
        updateStars(currentRating);
    });

    updateStars(currentRating);
}

// ============================================
// VARIANTES DE COLOR
// ============================================
const variantItems = document.querySelectorAll('.variant-item');
const currentVariantSpan = document.getElementById('currentVariant');
const sliderImages = document.querySelectorAll('.slider-track img');

variantItems.forEach(item => {
    item.addEventListener('click', () => {
        variantItems.forEach(v => v.classList.remove('is-active'));
        item.classList.add('is-active');
        
        const variantName = item.dataset.color;
        if (currentVariantSpan) {
            currentVariantSpan.textContent = variantName.charAt(0).toUpperCase() + variantName.slice(1);
        }
        
        // Cambiar imagen del slider
        const newImageSrc = `images/gallina_${variantName}_1.webp`;
        if (sliderImages[currentIndex]) {
            sliderImages[currentIndex].src = newImageSrc;
        }
    });
});

// ============================================
// CONTADOR DE CANTIDAD
// ============================================
const quantityInput = document.getElementById('quantityInput');
const decreaseBtn = document.getElementById('decreaseQty');
const increaseBtn = document.getElementById('increaseQty');

if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value) || 0;
        if (currentValue > 0) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value) || 0;
        const maxValue = parseInt(quantityInput.max) || 99;
        if (currentValue < maxValue) {
            quantityInput.value = currentValue + 1;
        }
    });
}

// ============================================
// BOTONES DE ACCIÓN
// ============================================
const addToCartBtn = document.getElementById('addToCartBtn');
const buyNowBtn = document.getElementById('buyNowBtn');

if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput?.value) || 0;
        const variant = currentVariantSpan?.textContent || 'Blanca';
        
        if (quantity === 0) {
            // Feedback de error - cantidad = 0
            addToCartBtn.style.backgroundColor = '#ef4444';
            addToCartBtn.textContent = 'Selecciona una cantidad';
            
            setTimeout(() => {
                addToCartBtn.style.backgroundColor = '';
                addToCartBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 16C4.9 16 4.01 16.9 4.01 18C4.01 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM0 0V2H2L5.6 9.59L4.24 12.04C4.09 12.32 4 12.65 4 13C4 14.1 4.9 15 6 15H18V13H6.42C6.28 13 6.17 12.89 6.17 12.75L6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.58 16.3 9.97L19.88 3.48C19.96 3.34 20 3.17 20 3C20 2.45 19.55 2 19 2H4.21L3.27 0H0ZM16 16C14.9 16 14.01 16.9 14.01 18C14.01 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16Z" fill="currentColor"/>
                    </svg>
                    Agregar al carrito
                `;
            }, 2000);
            return;
        }
        
        // Agregar al carrito usando el sistema global
        const product = {
            id: 'gallinita-magica',
            name: 'Gallinitas Mágicas',
            variant: variant,
            price: 150,
            quantity: quantity,
            image: `images/gallina_${variant.toLowerCase()}_1.webp`
        };
        
        window.addToCart(product);
        
        // Feedback de éxito
        addToCartBtn.style.backgroundColor = '#10b981';
        addToCartBtn.textContent = '¡Agregado al carrito! ✓';
        
        // Resetear cantidad
        quantityInput.value = 0;
        
        // Restaurar botón después de 2 segundos
        setTimeout(() => {
            addToCartBtn.style.backgroundColor = '';
            addToCartBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 16C4.9 16 4.01 16.9 4.01 18C4.01 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM0 0V2H2L5.6 9.59L4.24 12.04C4.09 12.32 4 12.65 4 13C4 14.1 4.9 15 6 15H18V13H6.42C6.28 13 6.17 12.89 6.17 12.75L6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.58 16.3 9.97L19.88 3.48C19.96 3.34 20 3.17 20 3C20 2.45 19.55 2 19 2H4.21L3.27 0H0ZM16 16C14.9 16 14.01 16.9 14.01 18C14.01 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16Z" fill="currentColor"/>
                </svg>
                Agregar al carrito
            `;
        }, 2000);
    });
}

if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput?.value) || 0;
        const variant = currentVariantSpan?.textContent || 'Blanca';
        
        if (quantity === 0) {
            alert('Por favor selecciona una cantidad');
            return;
        }
        
        console.log(`Compra rápida: ${quantity} x ${variant}`);
        alert(`Compra rápida: ${quantity} x ${variant}`);
    });
}
// product-cards.js - Funcionalidad para las cards de productos relacionados

document.addEventListener('DOMContentLoaded', () => {
    // Manejar cambio de variantes en las cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const variantButtons = card.querySelectorAll('.variant-pill');
        const cardImage = card.querySelector('.product-card-image img');
        
        if (!variantButtons.length || !cardImage) return;
        
        variantButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remover clase activa de todos los botones
                variantButtons.forEach(btn => btn.classList.remove('is-active'));
                
                // Agregar clase activa al botón clickeado
                button.classList.add('is-active');
                
                // Cambiar la imagen
                const newImageSrc = button.getAttribute('data-img');
                if (newImageSrc) {
                    cardImage.src = newImageSrc;
                }
            });
        });
    });
    
    // Manejar botones "Agregar al carrito" de las cards
    const addToCartButtons = document.querySelectorAll('.product-card-add');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            const productId = card.getAttribute('data-productid') || 'unknown';
            const productName = card.getAttribute('data-product') || 'Producto';
            const activeVariant = card.querySelector('.variant-pill.is-active');
            const variantName = activeVariant ? activeVariant.getAttribute('data-variant') : 'Única';
            
            // Obtener precio (extraer número del texto)
            const priceText = card.querySelector('.product-card-price')?.textContent || '$0 MXN';
            const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            
            // Obtener imagen actual
            const currentImage = card.querySelector('.product-card-image img')?.src || '';
            
            // Crear objeto de producto
            const product = {
                id: `${productId}-${variantName}`,
                name: productName,
                variant: variantName,
                price: price,
                quantity: 1,
                image: currentImage
            };
            
            // Agregar al carrito usando el sistema global
            if (window.gbCart) {
                window.gbCart.add(product);
                console.log('Producto agregado:', product);
            }
            
            // Feedback visual
            button.textContent = '¡Agregado!';
            button.style.borderColor = 'var(--accent-green)';
            button.style.color = 'var(--accent-green)';
            
            setTimeout(() => {
                button.textContent = 'Agregar al carrito';
                button.style.borderColor = '';
                button.style.color = '';
            }, 1500);
        });
    });

    // ============================================
    // CARRUSEL INDICATOR (MOBILE)
    // ============================================
    const productsCarousel = document.getElementById('productsCarousel');
    const currentCardSpan = document.getElementById('currentCard');
    const totalCardsSpan = document.getElementById('totalCards');

    if (productsCarousel && currentCardSpan && totalCardsSpan) {
        const cards = productsCarousel.querySelectorAll('.product-card');
        
        // Actualizar total de cards
        totalCardsSpan.textContent = cards.length;
        
        // Detectar scroll y actualizar el indicador
        let scrollTimeout;
        productsCarousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                if (cards.length === 0) return;
                
                // Obtener el centro del viewport del carrusel
                const containerCenter = productsCarousel.scrollLeft + (productsCarousel.offsetWidth / 2);
                
                // Encontrar qué card está más cerca del centro
                let closestIndex = 0;
                let closestDistance = Infinity;
                
                cards.forEach((card, index) => {
                    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                    const distance = Math.abs(containerCenter - cardCenter);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestIndex = index;
                    }
                });
                
                currentCardSpan.textContent = closestIndex + 1;
            }, 50); // Debounce de 50ms
        });
    }
});

// ============================================
// INTERSECTION OBSERVER - SCROLL ANIMATIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Configuración del observador
    const observerOptions = {
        threshold: 0.1, // Se activa cuando el 10% del elemento es visible
        rootMargin: '0px 0px -50px 0px' // Se activa 50px antes de que entre completamente
    };
    
    // Callback cuando un elemento entra/sale del viewport
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Opcional: dejar de observar después de animar (se anima solo una vez)
                // observer.unobserve(entry.target);
            }
        });
    };
    
    // Crear el observador
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Elementos a observar
    const animatedElements = [
        document.querySelector('.product-details'),
        document.querySelector('.related-header'),
        document.querySelector('.products-grid'),
        ...document.querySelectorAll('.product-card')
    ].filter(Boolean); // Filtrar elementos que existan
    
    // Agregar clase inicial y observar
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
    
    console.log('✓ Scroll animations initialized');
});


// ============================================
// BOTÓN "VER MÁS" - MOSTRAR SOLO SI ESTÁ TRUNCADO
// ============================================
function initDescriptionToggle() {
    const desc = document.getElementById('productDesc');
    const toggleBtn = document.getElementById('descToggle');
    
    if (!desc || !toggleBtn) return;
    
    // Función para verificar si el texto está truncado
    function isTextTruncated() {
        // scrollHeight > clientHeight significa que hay contenido oculto
        return desc.scrollHeight > desc.clientHeight;
    }
    
    // Verificar al cargar
    function checkTruncation() {
        if (isTextTruncated()) {
            toggleBtn.classList.add('show');
        } else {
            toggleBtn.classList.remove('show');
        }
    }
    
    // Verificar al cargar y al cambiar tamaño de ventana
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    
    // Click en "Ver más"
    toggleBtn.addEventListener('click', function() {
        desc.classList.toggle('is-expanded');
        
        if (desc.classList.contains('is-expanded')) {
            toggleBtn.textContent = 'Ver menos';
        } else {
            toggleBtn.textContent = '...Ver más';
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDescriptionToggle);
} else {
    initDescriptionToggle();
}

// ============================================
// BOTÓN "VER MÁS" - MOSTRAR SOLO SI ESTÁ TRUNCADO
// ============================================
function initDescriptionToggle() {
    const desc = document.getElementById('productDesc');
    const toggleBtn = document.getElementById('descToggle');
    
    if (!desc || !toggleBtn) return;
    
    // Función para verificar si el texto está truncado
    function isTextTruncated() {
        // scrollHeight > clientHeight significa que hay contenido oculto
        return desc.scrollHeight > desc.clientHeight;
    }
    
    // Verificar al cargar
    function checkTruncation() {
        if (isTextTruncated()) {
            toggleBtn.classList.add('show');
        } else {
            toggleBtn.classList.remove('show');
        }
    }
    
    // Verificar al cargar y al cambiar tamaño de ventana
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    
    // Click en "Ver más"
    toggleBtn.addEventListener('click', function() {
        desc.classList.toggle('is-expanded');
        
        if (desc.classList.contains('is-expanded')) {
            toggleBtn.textContent = 'Ver menos';
        } else {
            toggleBtn.textContent = '...Ver más';
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDescriptionToggle);
} else {
    initDescriptionToggle();
}
