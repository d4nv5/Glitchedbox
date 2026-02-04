<?php
include('db.php');
include('./includes/header.php');

// --- VALIDACIÓN DEL ID ---
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
  echo "<p style='text-align:center; padding:50px;'>Producto no encontrado.</p>";
  include('./includes/footer.php');
  exit;
}

$id = intval($_GET['id']);
$sql = "SELECT * FROM productos WHERE id = $id AND activo = 1 LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows == 0) {
  echo "<p style='text-align:center; padding:50px;'>Producto no encontrado o inactivo.</p>";
  include('./includes/footer.php');
  exit;
}

$producto = $result->fetch_assoc();
?>

<!-- BREADCRUMB -->
<nav style="padding:15px 30px; font-size:14px;">
  <a href="index.php" style="text-decoration:none;">Art Toys</a> >
  <a href="#" style="text-decoration:none;"><?php echo htmlspecialchars($producto['coleccion']); ?></a> >
  <span style="color:#39FF14;"><?php echo htmlspecialchars($producto['nombre']); ?></span>
</nav>

<!-- CONTENIDO PRINCIPAL -->
<section style="max-width:1200px; margin:40px auto; display:flex; flex-wrap:wrap; gap:40px;">

  <!-- IMÁGENES -->
  <div style="flex:1 1 450px;">
    <div class="product-images" style="position:relative;">
    <!-- BOTONES DE NAVEGACIÓN -->
    <button onclick="prevImage()" style="position:absolute; top:50%; left:0; transform:translateY(-50%); background:rgba(0,0,0,0.5); border:none; color:white; font-size:24px; padding:10px; border-radius:50%; cursor:pointer;">◀</button>
    <button onclick="nextImage()" style="position:absolute; top:50%; right:0; transform:translateY(-50%); background:rgba(0,0,0,0.5); border:none; color:white; font-size:24px; padding:10px; border-radius:50%; cursor:pointer;">▶</button>

    <!-- IMAGEN PRINCIPAL -->
    <img id="mainImage" 
         src="./assets/img/products/<?php echo htmlspecialchars($producto['imagen']); ?>" 
         alt="<?php echo htmlspecialchars($producto['nombre']); ?>" 
         style="width:100%; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.2); margin-bottom:15px;">

    <!-- MINIATURAS DE COLORES -->
    <div id="thumbnails" class="thumbnails">
        <?php
        $colores = array_map('trim', explode(',', $producto['color']));
        foreach ($colores as $c) {
            $nombreArchivo = strtolower(str_replace(' ', '_', $producto['nombre'])) . "_" . strtolower($c) . ".webp"; // primera vista por color
            echo "<img src='./assets/img/products/thumbnails/$nombreArchivo' alt='$c'
                      onclick=\"selectColor('$c')\"> ";
        }
        ?>
    </div>
</div>

    
  </div>

  <!-- INFORMACIÓN -->
  <div style="flex:1 1 500px;">
    <h1 style="display:flex; align-items:center; gap:10px;"><?php echo htmlspecialchars($producto['nombre']); ?>
     <button onclick="toggleFavorite()" style="background: white;border:none;color:#f94c10;font-size:24px;cursor:pointer;margin-left: auto;border-radius: 5px;font-size: 15px;padding: 10px;">❤️</button>
    </h1>
  <!-- PRECIO -->
    <div style="font-size:20px; margin:15px 0;">
      <?php if ($producto['descuento'] > 0): ?>
        <p><span style="text-decoration:line-through; color:#888;">$<?php echo number_format($producto['precio'],2); ?></span></p>
        <p style="color:#f94c10; font-weight:bold;">$<?php echo number_format($producto['precio'] - $producto['descuento'], 2); ?></p>
      <?php else: ?>
        <p style="font-weight:bold;">$<?php echo number_format($producto['precio'], 2); ?></p>
      <?php endif; ?>
    </div>
  <!-- DESCRIP -->
    <p style="color:#555;"><?php echo nl2br(htmlspecialchars($producto['descripcion_larga'])); ?></p>

    <!-- ELIJE TU VERSIÓN FAVORITA -->
    <h4>Elige tu versión favorita:</h4>
    <div style="margin-bottom:20px;">
      <?php
      foreach ($colores as $c) {
        echo "<button class='colorBtn' onclick=\"selectColor('$c')\" 
              style='margin:5px; padding:10px 15px; border:none; border-radius:5px; background:#1c1c1f; color:white; cursor:pointer;'>$c</button>";
      }
      ?>
    </div>

    <!-- SELECTOR DE CANTIDAD -->
    <h4>Número de piezas:</h4>
    <div style="display:flex; align-items:center; margin-bottom:20px;">
      <button onclick="changeQty(-1)" style="padding:5px 10px;border-radius: 15px 0 0 15px;border: none;">-</button>
      <input type="number" id="cantidad" value="1" min="1" max="<?php echo $producto['stock']; ?>" style="width: 39px;text-align:center;height: 26px;border: none;">
      <button onclick="changeQty(1)" style="padding:5px 10px;border: none;border-radius: 0 15px 15px 0;">+</button>
    </div>

    <!-- BOTONES -->
    <div style="display:flex; gap:10px; margin-bottom:20px;">
      <button id="addToCartBtn"
              class="add-to-cart-btn"
              data-product-id="<?php echo $producto['id']; ?>"
              data-product-name="<?php echo htmlspecialchars($producto['nombre'], ENT_QUOTES); ?>"
              data-product-price="<?php echo $producto['descuento'] > 0 ? ($producto['precio'] - $producto['descuento']) : $producto['precio']; ?>"
              data-product-image="./assets/img/products/<?php echo htmlspecialchars($producto['imagen']); ?>"
              data-product-variant=""
              data-product-quantity="1"
              data-product-stock="<?php echo $producto['stock'] ?? 99; ?>"
              onclick="addToCartWithOptions()"
              style="flex:1; padding:12px; border:none; border-radius:5px; cursor:pointer; background:white; color:black; font-weight:bold;">
        🛒 Agregar al carrito
      </button>
      <button onclick="buyNow()" style="flex:1;background: none;color:white;padding:12px;border: 1px solid;border-radius:5px;cursor:pointer;">Comprar ahora</button>
    </div>

    <!-- ENVÍOS -->
    <p style="text-align: center;">🚚 Envío gratis en pedidos mayores a $2,500 MXN</p>

    <div id="envioBox" style="margin-top:10px;background: #1c1c1c;padding: 15px;">
      <button onclick="toggleEnvio()" style="background:none;border:none;font-weight:bold;cursor:pointer;color: white;">
        Tiempo de entrega ▼
      </button>
      <div id="envioInfo" style="display:none; padding:10px; border-left:3px solid #1c1c1f; margin-top:5px;">
        El tiempo estimado de entrega es de 3 a 7 días hábiles, según la ubicación y disponibilidad del producto. Si el artículo no está en stock o se fabrica bajo pedido, el procesamiento puede tomar 3 a 4 días hábiles adicionales. Ofrecemos envío gratuito en compras iguales o mayores a $2,500 MXN, excepto en zonas extendidas.
      </div>
    </div>

    <hr style="margin:30px 0;">

    <h3>Detalles Técnicos</h3>
    <table style="width:100%; border-collapse:collapse;">
      <tbody>
        <?php
        $detalles = [
          'Altura' => $producto['altura'].' cm',
          'Ancho' => $producto['ancho'].' cm',
          'Profundidad' => $producto['profundidad'].' cm',
          'Material' => $producto['material'],
          'Distribuido por' => $producto['distribuido_por'],
          'Producción' => $producto['produccion'],
          'Pintado a mano' => $producto['pintado_a_mano'] ? 'Sí' : 'No',
          'Colores / Variantes' => $producto['colores_variantes'],
          'Acabado' => $producto['acabado'],
          'Edición' => $producto['edicion'],
          'Número de serie' => $producto['numero_serie'],
          'Colección' => $producto['coleccion']
        ];

        foreach ($detalles as $label => $valor) {
          if (!empty($valor)) {
            echo "<tr style='border-bottom:1px solid #eee;'>
                    <td style='padding:8px 5px; font-weight:bold; width:180px;'>$label</td>
                    <td style='padding:8px 5px;'>".htmlspecialchars($valor)."</td>
                  </tr>";
          }
        }
        ?>
      </tbody>
    </table>
  </div>
</section>

<!-- PRODUCTOS RELACIONADOS -->
<section style="background:#f8f8f8; padding:50px 0;">
  <div style="max-width:1200px; margin:auto;">
    <h2 style="text-align:center; margin-bottom:30px; color:#000;">¡Separados son geniales, juntos son leyenda!</h2>
    <div style="display:flex; flex-wrap:wrap; gap:20px; justify-content:center;">
      <?php
      $rel = $conn->query("SELECT * FROM productos WHERE id != $id AND activo = 1 ORDER BY RAND() LIMIT 4");
      while ($p = $rel->fetch_assoc()) {
        $precioFinal = $p['descuento'] > 0 ? ($p['precio'] - $p['descuento']) : $p['precio'];
        echo "
        <div style='width:250px; background:white; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.1); overflow:hidden; position:relative;'>
          <img src='./assets/img/products/{$p['imagen']}' alt='{$p['nombre']}' style='width:100%; height:250px; object-fit:cover;'>
          <a href='producto.php?id={$p['id']}' style='position:absolute; top:10px; right:10px; background:#1c1c1f; color:white; border:none; border-radius:5px; padding:5px 10px; cursor:pointer; text-decoration:none;'>Ver mas</a>
          <div style='padding:15px;'>
            <h4 style='margin:0;color:#000;'>{$p['nombre']}</h4>
            <p style='margin:5px 0; color:#f94c10; font-weight:bold;'>$".number_format($p['precio'],2)."</p>
            <p style='color:#555; font-size:14px;'>{$p['descripcion_corta']}</p>
            <button class='add-to-cart-btn'
                    data-product-id='{$p['id']}'
                    data-product-name='".htmlspecialchars($p['nombre'], ENT_QUOTES)."'
                    data-product-price='{$precioFinal}'
                    data-product-image='./assets/img/products/{$p['imagen']}'
                    data-product-stock='".($p['stock'] ?? 99)."'
                    onclick='addToCartFromButton(this)'
                    style='background:#1c1c1f; color:white; border:none; border-radius:5px; padding:8px 10px; cursor:pointer;'>
              🛒
            </button>
          </div>
        </div>";
      }
      ?>
    </div>
  </div>
</section>

<?php include('./includes/footer.php'); ?>

<script>
function changeImage(src) {
  document.getElementById('mainImage').src = './assets/img/products/' + src;
}

function selectColor(color) {
  const formattedName = "<?php echo strtolower(str_replace(' ', '_', $producto['nombre'])); ?>_" + color.toLowerCase() + ".jpg";
  changeImage(formattedName);
}

function changeQty(delta) {
  const qty = document.getElementById('cantidad');
  let newValue = parseInt(qty.value) + delta;
  if (newValue < 1) newValue = 1;
  if (newValue > <?php echo $producto['stock']; ?>) newValue = <?php echo $producto['stock']; ?>;
  qty.value = newValue;
}

function toggleEnvio() {
  const info = document.getElementById('envioInfo');
  info.style.display = info.style.display === 'none' ? 'block' : 'none';
}


// ---- FAVORITOS ----
function toggleFavorite() {
    alert("Favorito agregado (simulación, luego conectaremos con base de datos)");
}

// ---- IMÁGENES DEL MISMO COLOR ----
let currentColor = "<?php echo strtolower(array_shift($colores)); ?>"; // primer color
let currentImageIndex = 1;
let maxImages = 3; // número máximo de vistas (puede variar según producto)

function updateMainImage() {
    let name = "<?php echo strtolower(str_replace(' ', '_', $producto['nombre'])); ?>";
    document.getElementById('mainImage').src = `./assets/img/products/${name}_${currentColor}_${currentImageIndex}.webp`;
}

function selectColor(color) {
    currentColor = color.toLowerCase();
    currentImageIndex = 1; // reinicia la vista al cambiar color
    updateMainImage();
}

function prevImage() {
    currentImageIndex--;
    if (currentImageIndex < 1) currentImageIndex = maxImages;
    updateMainImage();
}

function nextImage() {
    currentImageIndex++;
    if (currentImageIndex > maxImages) currentImageIndex = 1;
    updateMainImage();
}

// ---- CARRITO ----
async function addToCartWithOptions() {
    const btn = document.getElementById('addToCartBtn');
    const quantity = parseInt(document.getElementById('cantidad').value) || 1;

    // Deshabilitar boton mientras se procesa
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.textContent = 'Agregando...';

    // Actualizar la imagen basada en el color seleccionado
    const productName = "<?php echo strtolower(str_replace(' ', '_', $producto['nombre'])); ?>";
    const imagePath = `./assets/img/products/${productName}_${currentColor}_1.webp`;

    const productData = {
        id: btn.dataset.productId,
        name: btn.dataset.productName,
        price: parseFloat(btn.dataset.productPrice),
        image: imagePath,
        variant: currentColor.charAt(0).toUpperCase() + currentColor.slice(1),
        quantity: quantity
    };

    await CartManager.addToCart(productData);

    // Rehabilitar boton
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.innerHTML = '🛒 Agregar al carrito';
}

async function buyNow() {
    const btn = document.getElementById('addToCartBtn');
    const quantity = parseInt(document.getElementById('cantidad').value) || 1;

    const productName = "<?php echo strtolower(str_replace(' ', '_', $producto['nombre'])); ?>";
    const imagePath = `./assets/img/products/${productName}_${currentColor}_1.webp`;

    const productData = {
        id: btn.dataset.productId,
        name: btn.dataset.productName,
        price: parseFloat(btn.dataset.productPrice),
        image: imagePath,
        variant: currentColor.charAt(0).toUpperCase() + currentColor.slice(1),
        quantity: quantity
    };

    const added = await CartManager.addToCart(productData);
    if (added) {
        window.location.href = 'carrito.php';
    }
}

// Actualizar el boton cuando cambia el color
const originalSelectColor = selectColor;
selectColor = function(color) {
    originalSelectColor(color);
    // Actualizar data attribute del boton
    const btn = document.getElementById('addToCartBtn');
    if (btn) {
        btn.dataset.productVariant = color;
    }
};
</script>
