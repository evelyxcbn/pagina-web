<?php
require_once 'config/database.php';

try {
    // Estadísticas generales
    $stmt = $pdo->query("SELECT * FROM global.estadisticas_sucursales");
    $estadisticas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Productos agotados
    $stmt_agotados = $pdo->query("
        SELECT nombre, sucursal, categoria 
        FROM global.inventario_completo 
        WHERE estado_stock = 'AGOTADO' 
        ORDER BY sucursal, nombre
    ");
    $agotados = $stmt_agotados->fetchAll(PDO::FETCH_ASSOC);
    
    // Productos bajo stock
    $stmt_bajos = $pdo->query("
        SELECT nombre, sucursal, stock, stock_minimo 
        FROM global.inventario_completo 
        WHERE estado_stock = 'BAJO STOCK' 
        ORDER BY stock ASC, sucursal
    ");
    $bajos_stock = $stmt_bajos->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'estadisticas' => $estadisticas,
        'agotados' => $agotados,
        'bajos_stock' => $bajos_stock,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
    ]);
}
?>