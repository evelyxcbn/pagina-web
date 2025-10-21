<?php
require_once 'config.php';

$conn = conectarDB();

try {
    $search = $_GET['q'] ?? '';
    $categoria = $_GET['categoria'] ?? '';
    $minPrice = $_GET['min_price'] ?? '';
    $maxPrice = $_GET['max_price'] ?? '';
    $orden = $_GET['orden'] ?? 'relevancia';
    
    $sql = "SELECT * FROM productos WHERE stock > 0";
    $params = [];
    
    if (!empty($search)) {
        $sql .= " AND (nombre ILIKE :search OR descripcion ILIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    if (!empty($categoria) && $categoria !== 'todos') {
        $sql .= " AND categoria = :categoria";
        $params[':categoria'] = $categoria;
    }
    
    if (!empty($minPrice)) {
        $sql .= " AND precio >= :min_price";
        $params[':min_price'] = $minPrice;
    }
    
    if (!empty($maxPrice)) {
        $sql .= " AND precio <= :max_price";
        $params[':max_price'] = $maxPrice;
    }
    
    // Ordenar
    switch ($orden) {
        case 'precio_asc':
            $sql .= " ORDER BY precio ASC";
            break;
        case 'precio_desc':
            $sql .= " ORDER BY precio DESC";
            break;
        case 'nombre':
            $sql .= " ORDER BY nombre ASC";
            break;
        case 'relevancia':
        default:
            $sql .= " ORDER BY 
                CASE 
                    WHEN nombre ILIKE :exact_search THEN 1
                    WHEN descripcion ILIKE :exact_search THEN 2
                    ELSE 3
                END, fecha_creacion DESC";
            $params[':exact_search'] = $search;
    }
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse(true, 'Búsqueda completada', $productos);
    
} catch (PDOException $e) {
    error_log("Error en búsqueda: " . $e->getMessage());
    sendResponse(false, 'Error en la búsqueda');
}

$conn = null;
?>