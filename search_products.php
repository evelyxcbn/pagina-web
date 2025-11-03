<?php
require_once 'config/database.php';

$producto = $_GET['producto'] ?? '';

if (empty($producto)) {
    echo json_encode(['success' => false, 'message' => 'Término de búsqueda requerido']);
    exit;
}

try {
    // Consulta para buscar producto en todas las sucursales
    $query = "
        SELECT 
            nombre,
            descripcion,
            precio,
            stock,
            sucursal,
            categoria,
            estado_stock
        FROM global.inventario_completo 
        WHERE nombre ILIKE ? 
        ORDER BY sucursal, stock DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute(["%$producto%"]);
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Agrupar por producto para mostrar resumen
    $productos_agrupados = [];
    foreach ($resultados as $producto) {
        $nombre = $producto['nombre'];
        if (!isset($productos_agrupados[$nombre])) {
            $productos_agrupados[$nombre] = [
                'nombre' => $nombre,
                'descripcion' => $producto['descripcion'],
                'precio' => $producto['precio'],
                'categoria' => $producto['categoria'],
                'sucursales' => []
            ];
        }
        $productos_agrupados[$nombre]['sucursales'][] = [
            'sucursal' => $producto['sucursal'],
            'stock' => $producto['stock'],
            'estado' => $producto['estado_stock']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'producto_buscado' => $producto,
        'total_resultados' => count($resultados),
        'productos_agrupados' => array_values($productos_agrupados),
        'detalle_sucursales' => $resultados
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en la búsqueda: ' . $e->getMessage()
    ]);
}
?>