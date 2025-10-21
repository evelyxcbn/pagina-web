<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    
    $conn = conectarDB();
    
    if ($action === 'finalizar_compra') {
        $productos = $input['productos'] ?? [];
        $datosCliente = $input['datos_cliente'] ?? [];
        
        if (empty($productos)) {
            sendResponse(false, 'El carrito está vacío');
        }
        
        $total = 0;
        $productos_desc = [];
        
        try {
            // Iniciar transacción
            $conn->beginTransaction();
            
            // Procesar cada producto y verificar stock
            foreach ($productos as $item) {
                $producto_id = $item['id'];
                $cantidad = $item['cantidad'];
                
                // Verificar stock
                $sql_stock = "SELECT stock, precio, nombre FROM productos WHERE id = :producto_id FOR UPDATE";
                $stmt_stock = $conn->prepare($sql_stock);
                $stmt_stock->bindParam(':producto_id', $producto_id, PDO::PARAM_INT);
                $stmt_stock->execute();
                $producto = $stmt_stock->fetch(PDO::FETCH_ASSOC);
                
                if (!$producto) {
                    throw new Exception("Producto no encontrado: ID " . $producto_id);
                }
                
                if ($producto['stock'] < $cantidad) {
                    throw new Exception("Stock insuficiente para: " . $producto['nombre'] . ". Stock disponible: " . $producto['stock']);
                }
                
                // Actualizar stock
                $nuevo_stock = $producto['stock'] - $cantidad;
                $sql_update = "UPDATE productos SET stock = :nuevo_stock WHERE id = :producto_id";
                $stmt_update = $conn->prepare($sql_update);
                $stmt_update->bindParam(':nuevo_stock', $nuevo_stock, PDO::PARAM_INT);
                $stmt_update->bindParam(':producto_id', $producto_id, PDO::PARAM_INT);
                $stmt_update->execute();
                
                // Calcular subtotal
                $subtotal = $producto['precio'] * $cantidad;
                $total += $subtotal;
                
                $productos_desc[] = $producto['nombre'] . " x" . $cantidad;
            }
            
            // Registrar la venta
            $productos_str = implode(", ", $productos_desc);
            $fecha = date('Y-m-d H:i:s');
            $metodo_pago = $datosCliente['metodo_pago'] ?? 'tarjeta';
            
            $sql_venta = "INSERT INTO ventas (fecha, total, productos, cliente_nombre, cliente_email, cliente_telefono, cliente_direccion, metodo_pago) 
                          VALUES (:fecha, :total, :productos, :cliente_nombre, :cliente_email, :cliente_telefono, :cliente_direccion, :metodo_pago) 
                          RETURNING id";
            
            $stmt_venta = $conn->prepare($sql_venta);
            $stmt_venta->bindParam(':fecha', $fecha);
            $stmt_venta->bindParam(':total', $total);
            $stmt_venta->bindParam(':productos', $productos_str);
            $stmt_venta->bindParam(':cliente_nombre', $datosCliente['nombre']);
            $stmt_venta->bindParam(':cliente_email', $datosCliente['email']);
            $stmt_venta->bindParam(':cliente_telefono', $datosCliente['telefono']);
            $stmt_venta->bindParam(':cliente_direccion', $datosCliente['direccion']);
            $stmt_venta->bindParam(':metodo_pago', $metodo_pago);
            $stmt_venta->execute();
            
            $venta_id = $stmt_venta->fetch(PDO::FETCH_ASSOC)['id'];
            
            // Confirmar transacción
            $conn->commit();
            
            // Preparar respuesta con datos de la venta
            $venta = [
                'id' => $venta_id,
                'fecha' => $fecha,
                'total' => $total,
                'productos' => $productos
            ];
            
            sendResponse(true, 'Compra realizada exitosamente', $venta);
            
        } catch (Exception $e) {
            // Revertir transacción en caso de error
            $conn->rollBack();
            sendResponse(false, $e->getMessage());
        }
    }
    
    $conn = null;
}

sendResponse(false, 'Acción no válida');
?>