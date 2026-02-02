<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Glitched Box - Art Toys</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="assets/css/styles.css">
  <!-- 🔹 Open Graph / Facebook / WhatsApp -->
<meta property="og:title" content="Glitched Box — Art Toys con historia">
<meta property="og:description" content="Figuras coleccionables únicas inspiradas en ilustraciones originales. Cada personaje es una mezcla entre lo kawaii y lo oscuro.">
<meta property="og:image" content="https://glitchedbox.com/assets/img/preview.jpg"> 
<meta property="og:url" content="https://glitchedbox.com">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Glitched Box">
<meta property="og:locale" content="es_MX">

<!-- 🔹 Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Glitched Box — Art Toys con historia">
<meta name="twitter:description" content="Descubre figuras coleccionables con estética única, entre lo adorable y lo oscuro.">
<meta name="twitter:image" content="https://glitchedbox.com/assets/img/preview.jpg">

<!-- 🔹 Favicon -->
<link rel="icon" type="image/png" href="assets/img/favicon.png">

<!-- 🔹 SEO básico -->
<meta name="description" content="Glitched Box es una marca mexicana de art toys inspirada en ilustraciones originales. Figuras únicas que combinan arte, diseño y coleccionismo.">
<meta name="keywords" content="art toys, figuras de colección, Glitched Box, juguetes de arte, diseño mexicano, figuras kawaii oscuras, coleccionables">
<meta name="author" content="Glitched Box">

  <style>
    /* ====== NAVBAR GENERAL ====== */
    nav {
      background-color: #1c1c1f;
      padding: 12px 20px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* ====== LOGO ====== */
    .nav-logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: white;
      font-weight: 600;
    }

    .nav-logo img {
      height: 40px;
      margin-right: 10px;
    }

    /* ====== ENLACES ====== */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
      transition: opacity 0.3s;
    }

    .nav-links a:hover {
      opacity: 0.8;
    }

    /* ====== BOTÓN HAMBURGUESA ====== */
    .menu-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 26px;
      height: 20px;
      cursor: pointer;
    }

    .menu-toggle span {
      display: block;
      height: 3px;
      width: 100%;
      background: white;
      border-radius: 3px;
      transition: 0.3s;
    }

    /* ====== RESPONSIVE ====== */
    @media (max-width: 768px) {
      .menu-toggle {
        display: flex;
      }

      .nav-links {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 65px;
        right: 0;
        background: #1c1c1f;
        width: 100%;
        padding: 20px 0;
        gap: 15px;
        border-top: 1px solid #333;
        text-align: center;
      }

      .nav-links.show {
        display: flex;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from {opacity: 0; transform: translateY(-10px);}
        to {opacity: 1; transform: translateY(0);}
      }
    }

    /* ====== ANIMACIÓN DEL BOTÓN ====== */
    .menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translateY(8px);
    }

    .menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }

    .menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translateY(-8px);
    }
    
/* ====== FOOTER ====== */
#footer {
  background-color: #000;
  color: white;
  padding: 60px 20px 30px;
  font-family: inherit;
}

/* === Newsletter Section === */
.footer-newsletter {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  flex-wrap: nowrap; 
  gap: 40px;
  max-width: 1200px; 
  margin: 0 auto;
  padding: 0 20px 43px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.newsletter-left {
  flex: 1 1 55%;
}

.newsletter-left h3 {
  font-size: clamp(22px, 4vw, 28px);
  margin-bottom: 10px;
}

.newsletter-left p {
  font-size: clamp(15px, 3vw, 17px);
  line-height: 1.5;
  margin: 0;
  max-width: 500px;
}

.newsletter-right {
  flex: 1 1 45%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.newsletter-right input {
  flex: 1;
  padding: 12px 15px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  background-color: #fff;
  color: #000;
  min-width: 220px;
}

.newsletter-right button {
  background-color: white;
  color: black;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  white-space: nowrap;
}

.newsletter-right button:hover {
  background-color: #ddd;
}

/* === Responsive === */
@media (max-width: 800px) {
  .footer-newsletter {
    flex-wrap: wrap;
    gap: 20px;
  }

  .newsletter-left,
  .newsletter-right {
    flex: 1 1 100%;
  }

  .newsletter-right {
    justify-content: flex-start;
  }
}


/* === Footer Info === */
.footer-info {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
  padding-top: 30px;
}

.footer-col h4 {
  font-size: clamp(16px, 3vw, 18px);
  margin-bottom: 10px;
}

.footer-col p {
  margin: 5px 0;
}

.footer-col .small {
  font-size: 13px;
  color: #bbb;
  line-height: 1.4;
}

.footer-logo {
  width: 170px;
  margin-bottom: 10px;
}

.footer-socials a {
  color: white;
  margin-right: 10px;
  font-size: 20px;
  transition: color 0.3s;
}

.footer-socials a:hover {
  color: #ff2d55;
}

.contact-btn {
  background-color: white;
  color: black;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.3s;
}

.contact-btn:hover {
  background-color: #ddd;
}

/* === Responsive === */
@media (max-width: 900px) {
  .footer-info {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .footer-newsletter {
    flex-direction: column;
    align-items: flex-start;
  }

  .newsletter-right {
    width: 100%;
  }

  .footer-info {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .footer-col {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 15px;
  }
}
    
  </style>
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Glitched Box",
  "url": "https://glitchedbox.com",
  "logo": "https://glitchedbox.com/assets/img/logo.svg",
  "description": "Glitched Box es una marca mexicana de art toys inspirada en ilustraciones originales. Cada figura representa un personaje que llegó a nuestro mundo por error a través de una glitch.",
  "sameAs": [
    "https://www.instagram.com/glitchedbox/",
    "https://www.facebook.com/p/Glitched-Box-100071087033149/"
  ],
  "foundingDate": "2024",
  "founder": {
    "@type": "Person",
    "name": "Guillermo Urgell"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MX"
  }
}
</script>
</head>

<body>

  <nav>
    <div class="nav-container">
      <!-- Logo -->
      <a href="/" class="nav-logo">
        <img src="assets/img/logo.svg" alt="Glitched Box">
      </a>

      <!-- Botón Hamburguesa -->
      <div class="menu-toggle" id="menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <!-- Enlaces -->
      <div class="nav-links" id="nav-links">
        <a href="login.php">Iniciar Sesión</a>
        <a href="favoritos.php">Favoritos</a>
        <a href="carrito.php">🛒 Carrito</a>
      </div>
    </div>
  </nav>

  <script>
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      menuToggle.classList.toggle('active');
    });
  </script>