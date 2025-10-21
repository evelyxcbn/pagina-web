<?php
// Incluir archivo de conexión
require_once 'conexion.php';

header('Content-Type: application/json');

try {
    // Consulta para obtener productos activos
    $sql = "SELECT id, nombre, descripcion, precio, imagen, stock FROM productos WHERE activo = TRUE ORDER BY id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    // Obtener resultados
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Devolver productos en formato JSON
    echo json_encode([
        'success' => true,
        'productos' => $productos
    ]);
    
} catch(PDOException $e) {
    // En caso de error
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener productos: ' . $e->getMessage()
    ]);
}
?>