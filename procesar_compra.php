<?php
// Incluir archivo de conexión
require_once 'conexion.php';

header('Content-Type: application/json');

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Obtener datos del POST
$data = json_decode(file_get_contents('php://input'), true);

try {
    // Iniciar transacción
    $pdo->beginTransaction();
    
    // 1. Insertar cliente
    $sqlCliente = "INSERT INTO clientes (nombre, email, telefono, direccion) 
                   VALUES (:nombre, :email, :telefono, :direccion) 
                   RETURNING id";
    $stmtCliente = $pdo->prepare($sqlCliente);
    $stmtCliente->execute([
        ':nombre' => $data['cliente']['nombre'],
        ':email' => $data['cliente']['email'],
        ':telefono' => $data['cliente']['telefono'],
        ':direccion' => $data['cliente']['direccion']
    ]);
    $clienteId = $stmtCliente->fetchColumn();
    
    // 2. Generar número de pedido único
    $numeroPedido = 'TS' . date('Ymd') . str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
    
    // 3. Insertar venta
    $sqlVenta = "INSERT INTO ventas (cliente_id, numero_pedido, total) 
                 VALUES (:cliente_id, :numero_pedido, :total) 
                 RETURNING id";
    $stmtVenta = $pdo->prepare($sqlVenta);
    $stmtVenta->execute([
        ':cliente_id' => $clienteId,
        ':numero_pedido' => $numeroPedido,
        ':total' => $data['total']
    ]);
    $ventaId = $stmtVenta->fetchColumn();
    
    // 4. Insertar detalles de venta y actualizar stock
    $sqlDetalle = "INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
                   VALUES (:venta_id, :producto_id, :cantidad, :precio_unitario, :subtotal)";
    $stmtDetalle = $pdo->prepare($sqlDetalle);
    
    $sqlUpdateStock = "UPDATE productos SET stock = stock - :cantidad WHERE id = :producto_id";
    $stmtUpdateStock = $pdo->prepare($sqlUpdateStock);
    
    foreach ($data['productos'] as $producto) {
        // Insertar detalle
        $stmtDetalle->execute([
            ':venta_id' => $ventaId,
            ':producto_id' => $producto['id'],
            ':cantidad' => $producto['cantidad'],
            ':precio_unitario' => $producto['precio'],
            ':subtotal' => $producto['precio'] * $producto['cantidad']
        ]);
        
        // Actualizar stock
        $stmtUpdateStock->execute([
            ':cantidad' => $producto['cantidad'],
            ':producto_id' => $producto['id']
        ]);
    }
    
    // Confirmar transacción
    $pdo->commit();
    
    // Devolver respuesta exitosa
    echo json_encode([
        'success' => true,
        'numero_pedido' => $numeroPedido,
        'venta_id' => $ventaId,
        'message' => 'Compra procesada exitosamente'
    ]);
    
} catch(PDOException $e) {
    // Revertir transacción en caso de error
    $pdo->rollBack();
    
    echo json_encode([
        'success' => false,
        'message' => 'Error al procesar la compra: ' . $e->getMessage()
    ]);
}
?>