<?php
/**
 * db.php - Conexión a datos desde Google Apps Script JSON
 * Simula la interfaz mysqli para mantener compatibilidad con el código existente
 */

$url = "https://script.google.com/macros/s/AKfycbwuZJ9M9klXC2DdyrHLq2D8j2M6Wblng7m-iiQoiL_8KzwMrEvj6BqpnAYzO4lItggW/exec";

// Obtener datos del JSON
$response = file_get_contents($url);
$data = json_decode($response, true);

// Clase para simular resultados de consulta MySQL
class JsonResult {
    private $items;
    private $index = 0;
    public $num_rows;

    public function __construct($items) {
        $this->items = $items;
        $this->num_rows = count($items);
    }

    public function fetch_assoc() {
        if ($this->index < count($this->items)) {
            return $this->items[$this->index++];
        }
        return null;
    }
}

// Clase para simular conexión MySQL
class JsonConnection {
    private $data;

    public function __construct($data) {
        $this->data = $data['items'] ?? [];
    }

    public function query($sql) {
        $items = $this->data;

        // Detectar WHERE id = X
        if (preg_match('/WHERE\s+id\s*=\s*(\d+)/i', $sql, $matches)) {
            $id = (int)$matches[1];
            $items = array_values(array_filter($items, fn($item) => $item['id'] == $id));
        }

        // Detectar WHERE id != X
        if (preg_match('/WHERE\s+id\s*!=\s*(\d+)/i', $sql, $matches)) {
            $id = (int)$matches[1];
            $items = array_values(array_filter($items, fn($item) => $item['id'] != $id));
        }

        // Detectar WHERE activo = 1
        if (preg_match('/activo\s*=\s*1/i', $sql)) {
            $items = array_values(array_filter($items, fn($item) => ($item['activo'] ?? 1) == 1));
        }

        // Detectar ORDER BY RAND()
        if (preg_match('/ORDER BY RAND/i', $sql)) {
            shuffle($items);
        }

        // Detectar ORDER BY id DESC
        if (preg_match('/ORDER BY id DESC/i', $sql)) {
            usort($items, fn($a, $b) => ($b['id'] ?? 0) - ($a['id'] ?? 0));
        }

        // Detectar LIMIT
        if (preg_match('/LIMIT\s+(\d+)/i', $sql, $matches)) {
            $limit = (int)$matches[1];
            $items = array_slice($items, 0, $limit);
        }

        return new JsonResult($items);
    }

    public function close() {
        // No hace nada, solo para compatibilidad
    }
}

// Crear la conexión
$conn = new JsonConnection($data);
?>
