<?php
require_once 'config/database.php';

$search = $_GET['search'] ?? '';
$sucursal = $_GET['sucursal'] ?? '';

try {
    $query = "SELECT * FROM global.inventario_completo WHERE 1=1";
    $params = [];
    
    if (!empty($search)) {
        $query .= " AND (nombre ILIKE ? OR descripcion ILIKE ? OR categoria ILIKE ?)";
        $search_term = "%$search%";
        $params[] = $search_term;
        $params[] = $search_term;
        $params[] = $search_term;
    }
    
    if (!empty($sucursal) && in_array($sucursal, ['norte', 'sur', 'este'])) {
        $query .= " AND sucursal = ?";
        $params[] = $sucursal;
    }
    
    $query .= " ORDER BY nombre, sucursal";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $productos,
        'total' => count($productos)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en la consulta: ' . $e->getMessage()
    ]);
}
?>