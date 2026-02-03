<?php
/**
 * API para obtener el stock de un producto
 * Uso: GET /api/get-stock.php?id=1
 * Respuesta: {"success": true, "stock": 10, "nombre": "Producto"}
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Incluir conexion a BD
include('../db.php');

// Validar parametro id
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'ID de producto no valido'
    ]);
    exit;
}

$id = intval($_GET['id']);

// Consultar producto
$result = $conn->query("SELECT id, nombre, stock FROM productos WHERE id = $id AND activo = 1 LIMIT 1");

if ($result->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'error' => 'Producto no encontrado'
    ]);
    exit;
}

$producto = $result->fetch_assoc();

echo json_encode([
    'success' => true,
    'id' => $producto['id'],
    'nombre' => $producto['nombre'],
    'stock' => intval($producto['stock'] ?? 0)
]);

$conn->close();
?>
