<?php include('./includes/header.php'); ?>

<style>
  /* ====== Hero ====== */
  .hero {
  position: relative;
  height: 100vh;
  background: url('assets/img/hero.png') no-repeat center top;
  background-size: contain; /* En escritorio: imagen completa */
  background-color: #000; /* Fondo de relleno donde no haya imagen */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  }

  .hero .circle {
    clip-path: circle(100%);
    height: 100vh;
    width: 100vw;
    background: radial-gradient(circle at center, #f1f1f126 0%, #0000008a 40%);
    position: absolute;
    top: 0;
    left: 0;
  }

    .hero-content {
      background: linear-gradient(0deg, rgba(0, 0, 0, 1) 72%, rgba(255, 255, 255, 0) 100%);
      /*position: absolute;
      bottom: 0;*/
      width: 100%;
      padding: 111px 30px;
    }

  .hero-content h1 {
    font-size: clamp(32px, 6vw, 56px);
    margin-bottom: 20px;
    line-height: 1.2;
  }

  .hero-content p {
    font-size: clamp(17px, 3.5vw, 22px);
    max-width: 55rem;
    margin: 0 auto 25px;
    line-height: 1.6;
  }

  .hero-content a {
    display: inline-block;
    margin: 10px 8px;
    padding: 12px 28px;
    border-radius: 6px;
    font-weight: bold;
    text-decoration: none;
    border: 1px solid white;
    color: white;
    font-size: clamp(14px, 2.8vw, 16px);
  }

  .hero-content a.btn-white {
    background-color: white;
    color: black;
    border: none;
  }

  /* ====== Productos ====== */
  #productos {
    padding: 80px 20px;
    background-color: #000;
    color: white;
  }

  #productos h2 {
    font-size: clamp(28px, 5vw, 36px);
    text-align: left;
    margin: 0 auto 15px;
  }

  #productos p {
    text-align: left;
    max-width: 550px;
    font-size: clamp(16px, 3.5vw, 18px);
    line-height: 1.5;
  }

  .productos-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
  }

  .producto-card {
    border-radius: 10px;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    overflow: hidden;
    background: radial-gradient(circle, rgb(30 30 30) 0%, rgb(0 0 0) 100%);
    transition: transform 0.3s ease;
  }

  .producto-card:hover {
    transform: translateY(-5px);
    filter:grayscale(1);
    -webkit-transition : -webkit-filter 300ms linear
  }

  .producto-card img {
    height: 270px;
  }
  .producto-card:hover .producto-img {
       transform:scale(1.2);
       transition: transform 0.3s ease;
  }
  .producto-info {
      padding: 15px;
      display: flex;
      align-items: center; /* centra verticalmente */
      justify-content: space-between;
      gap: 10px;
    }
    .producto-info div {
      flex: 0 0 70%; /* 70 % del ancho */
    }
  .producto-info h3 {
    margin: 0;
    font-size: clamp(17px, 3.5vw, 19px);
  }

  .producto-info p {
    margin: 2px 0;
    font-size: clamp(16px, 3vw, 18px);
  }

  .producto-info small {
    color: #777;
    font-size: clamp(13px, 2.8vw, 13px);
  }

  .producto-info button {
       /*flex: 0 0 30%; 30 ---% del ancho */
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: white;
      color: black;
      border: none;
      padding: 10px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: clamp(16px, 3vw, 18px);
      transition: background 0.3s ease, transform 0.2s ease;
    }
    .producto-info img {
      height:inherit;
    }
    .producto-info button:hover {
      /*background-color: #ddd;*/
      transform: scale(1.05);
    }

  .producto-card a {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 5px;
    text-decoration: none;
  }

  /* ====== RESPONSIVE ====== */
  @media (max-width: 992px) {
    .hero {
    background-size: auto;
    background-position: center;
    background-position-y: -115px;
    }
    .producto-card {
      width: 45%;
    }
  }

  @media (max-width: 600px) {
    .hero {
    height: 85vh;
    background-size: 1225px;
    background-position: center;
    background-position-y: -115px;
    }

    .hero-content {
      padding: 45px 20px;
    }

    .productos-grid {
      flex-direction: column;
      align-items: center;
      gap: 40px;
    }

    .producto-card {
      width: 90%;
    }
    /*
    .producto-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .producto-info button {
      align-self: flex-end;
    }*/
  }
  
  @media (max-width: 400px) {
  .producto-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .producto-info button {
    align-self: flex-end;
  }
}

/* ========= Envíos ========= */
.envios-section {
  background-color: #000;
  color: white;
  padding: 80px 20px;
}

.envios-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.envios-container h2 {
  font-size: clamp(28px, 5vw, 36px);
  margin-bottom: 15px;
}

.envios-container p {
  font-size: clamp(16px, 3vw, 18px);
  /*max-width: 600px;*/
  margin: 0 auto 60px;
  line-height: 1.6;
  color: #ccc;
}

/* Grid principal */
.envios-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

/* Tarjetas */
.envio-card {
  background: #191A23;
  border-radius: 10px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
}

.envio-card:hover {
  transform: translateY(-5px);
}

.envio-card img {
    width: 40px;
    height: 40px;
    border: 6px solid #ffffff0d;
    border-radius: 15px;
}

.envio-card h3 {
  font-size: clamp(18px, 3.5vw, 20px);
  margin-bottom: 10px;
  font-weight: 500;
}

.envio-card p {
  color: #aaa;
  font-size: clamp(15px, 3vw, 16px);
  line-height: 1.5;
  margin: auto;
}

/* ====== Responsivo ====== */
@media (max-width: 900px) {
  .envios-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .envios-grid {
    grid-template-columns: 1fr;
  }
}

.floating {  
    animation-name: floating;
    animation-duration: 5s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    margin-left: 0px;
    margin-top: 0px;
}
  
@keyframes floating {
    0% { transform: translate(0,  0px); }
    50%  { transform: translate(0, 15px); }
    100%   { transform: translate(0, -0px); }    
}


/* ====== FAQ Section ====== */
.faq-section {
  background-color: #000;
  color: white;
  padding: 80px 20px;
}

.faq-container {
  max-width: 900px;
  margin: 0 auto;
}

.faq-container h2 {
  font-size: clamp(28px, 5vw, 36px);
  text-align: center;
  margin-bottom: 50px;
}

/* Cada ítem */
.faq-item {
  border-bottom: 1px solid #333;
  margin-bottom: 10px;
  padding-bottom: 10px;
}

/* Pregunta */
.faq-question {
  width: 100%;
  background: none;
  border: none;
  color: white;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: clamp(17px, 3vw, 19px);
  padding: 15px 0;
  cursor: pointer;
  font-weight: 500;
}

.faq-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
}

/* Respuesta (oculta por defecto) */
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, opacity 0.3s ease;
  opacity: 0;
}

.faq-answer p {
  font-size: clamp(15px, 3vw, 17px);
  color: #ccc;
  line-height: 1.6;
  margin: 0;
  padding-bottom: 10px;
}

/* Estado abierto */
.faq-item.active .faq-answer {
  max-height: 300px;
  opacity: 1;
}

.faq-item.active .faq-icon {
  transform: rotate(45deg); /* + → × (como un - en diagonal) */
}


</style>

<!-- Hero -->
<section class="hero">
  <div class="hero-content">
      <div class="floating">
            <img src="assets/img/products/kitsune_rojo_1.png" style="height: 300px;" alt="Kitsune"></img>
      </div>
    <h1>Descubre la colección completa</h1>
    <p>El Kitsune se ha fragmentado en tres formas: Rojo, Azul y Morado.  Cada uno con su propia energía... y su propia historia. Explora la colección completa y elige tu Kitsune.</p>
    <a href="#productos">Ver Colección</a>
    <a href="#productos" class="btn-white"><img src="assets/img/ico/cart.ico" style="vertical-align: middle;"></img> Agregar al Carrito</a>
  </div>
</section>

<!-- Productos -->
<section id="productos">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2>Echa un vistazo a otras colecciones</h2>
    <p style="margin-bottom:50px;color:#ccc;">Descubre nuevas criaturas que no pueden faltar en tu colección, cada una con su propio estilo y misterio.</p>

    <div class="productos-grid">
      <?php
      include('db.php');
      $sql = "SELECT * FROM productos ORDER BY id DESC LIMIT 8";
      $result = $conn->query($sql);

      if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
          echo '
          <div class="producto-card">
            <div style="position: relative;background: linear-gradient(0deg, rgba(0, 0, 0, 1) 46%, rgb(22 22 22) 100%);text-align: center;">
              <img class="producto-img" src="./assets/img/products/'.$row["imagen"].'" alt="'.$row["nombre"].'">
              <a href="producto.php?id='.$row["id"].'">Ver más</a>
            </div>
            <div class="producto-info">
              <div>
                <h3>'.$row["nombre"].'</h3>
                <p>$'.$row["precio"].' MXN</p>
                <small>'.$row["descripcion_corta"].'</small>
              </div>
              <button class="add-to-cart-btn"
                      data-product-id="'.$row["id"].'"
                      data-product-name="'.htmlspecialchars($row["nombre"], ENT_QUOTES).'"
                      data-product-price="'.$row["precio"].'"
                      data-product-image="./assets/img/products/'.$row["imagen"].'"
                      onclick="addToCartFromButton(this)">
                <img src="assets/img/ico/cart.ico" style="vertical-align: middle;">
              </button>
            </div>
          </div>
          ';
        }
      } else {
        echo "<p>No hay productos disponibles por el momento.</p>";
      }
      $conn->close();
      ?>
    </div>
  </div>
</section>

<!-- Envios -->
<section id="envios" class="envios-section">
  <div class="envios-container">
    <h2>Envíos y pagos sin complicaciones</h2>
    <p>Desde que eliges tu Art Toy hasta que lo recibes, nos encargamos de que todo sea seguro, rápido y emocionante.</p>

    <div class="envios-grid">
      <div class="envio-card">
        <img src="./assets/img/ico/box.ico" alt="Envío rápido">
        <h3>Empaque seguro</h3>
        <p>Tus art toys viajan protegidos en cajas diseñadas con estilo.</p>
      </div>

      <div class="envio-card">
        <img src="./assets/img/ico/truck.ico" alt="Pago seguro">
        <h3>Envío a todo México</h3>
        <p>Usamos transportistas confiables.</p>
      </div>

      <div class="envio-card">
        <img src="./assets/img/ico/search.ico" alt="Soporte personalizado">
        <h3>Rastrea tu pedido</h3>
        <p>Recibe tu guía en cuanto tu pedido sale.</p>
      </div>

      <div class="envio-card">
        <img src="./assets/img/ico/lock.ico" alt="Garantía de satisfacción">
        <h3>Pago 100% Seguro</h3>
        <p>Aceptamos tarjetas, tu información está segura.</p>
      </div>
    </div>
  </div>
</section>


<!-- Preguntas Frecuentes -->
<section id="faq" class="faq-section">
  <div class="faq-container">
    <h2>Preguntas frecuentes</h2>

    <div class="faq-item">
      <button class="faq-question">
        <span>¿Qué es un Art Toy?</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <p>Los art toys son figuras de colección que combinan arte y diseño. No son simples juguetes: cada pieza es una obra con personalidad, historia y estilo propio.</p>
      </div>
    </div>

    <div class="faq-item">
      <button class="faq-question">
        <span>¿De qué están hechos los art toys de Glitched Box?</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <p>Nuestros art toys están hechos principalmente de resina de alta calidad y algunos incorporan detalles pintados a mano. Cada figura está cuidada hasta el último pixel para garantizar que luzca increíble tanto en vitrina como en tu feed.</p>
      </div>
    </div>

    <div class="faq-item">
      <button class="faq-question">
        <span>¿Qué métodos de pago aceptan?</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <p>Aceptamos tarjetas de crédito, débito y pagos a través de plataformas seguras como PayPal y MercadoPago.</p>
      </div>
    </div>
    
    <div class="faq-item">
      <button class="faq-question">
        <span>¿Hacen envíos internacionales?</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <p>Por ahora solo realizamos envíos dentro de México. Esperamos poder llevar Glitched Box más allá muy pronto, pero por el momento estamos enfocados en crecer dentro del país.</p>
      </div>
    </div>
    
    <div class="faq-item">
      <button class="faq-question">
        <span>¿Cuánto tarda en llegar mi pedido?</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <p>El tiempo de entrega dentro de México es de aproximadamente 3 a 7 días hábiles. Una vez enviado, te compartiremos un número de rastreo para que sigas el camino de tu figura.</p>
      </div>
    </div>
    
    <div class="faq-item">
      <button class="faq-question">
        <span>¿Puedo devolver o cambiar mi pedido?</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <p>Si tu art toy llega dañado o hubo un error en el pedido, escríbenos. Haremos todo lo posible por solucionarlo rápidamente. No hacemos devoluciones por cambio de opinión, ya que muchas piezas son de edición limitada.</p>
      </div>
    </div>
    
    <div class="faq-item">
      <button class="faq-question">
        <span>¿Cada figura es única?</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <p>¡Sí! Algunas son parte de una serie limitada, otras están pintadas a mano o tienen detalles únicos. Nos gusta que cada pieza tenga ese algo especial que la haga irrepetible.</p>
      </div>
    </div>
    
    <div class="faq-item">
      <button class="faq-question">
        <span>¿Puedo encargar un art toy personalizado?</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">
        <p>No por ahora, pero quién sabe... si un día abrimos esa opción, lo anunciaremos a lo grande.</p>
      </div>
    </div>

  </div>
</section>
<script>
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('active');

      // Cierra los demás si quieres solo uno abierto a la vez:
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
    });
  });
</script>

<?php include('./includes/footer.php'); ?>
