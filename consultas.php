<?php
require_once 'conexion.php';

header('Content-Type: application/json');

class ConsultasTienda {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Consulta 1: Obtener productos activos
    public function obtenerProductosActivos($categoria_id = null) {
        try {
            $sql = "SELECT * FROM vista_productos_completa WHERE activo = TRUE";
            
            if ($categoria_id) {
                $sql .= " AND categoria_id = :categoria_id";
            }
            
            $sql .= " ORDER BY destacado DESC, nombre ASC";
            
            $stmt = $this->pdo->prepare($sql);
            
            if ($categoria_id) {
                $stmt->execute([':categoria_id' => $categoria_id]);
            } else {
                $stmt->execute();
            }
            
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'productos' => $productos
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener productos: ' . $e->getMessage()
            ];
        }
    }
    
    // Consulta 2: Obtener productos destacados
    public function obtenerProductosDestacados($limite = 8) {
        try {
            $sql = "SELECT * FROM vista_productos_completa 
                    WHERE activo = TRUE AND destacado = TRUE 
                    ORDER BY fecha_creacion DESC 
                    LIMIT :limite";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
            $stmt->execute();
            
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'productos' => $productos
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener productos destacados: ' . $e->getMessage()
            ];
        }
    }
    
    // Consulta 3: Buscar productos
    public function buscarProductos($termino) {
        try {
            $sql = "SELECT * FROM vista_productos_completa 
                    WHERE activo = TRUE 
                    AND (nombre ILIKE :termino OR descripcion ILIKE :termino)
                    ORDER BY nombre ASC";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':termino' => '%' . $termino . '%']);
            
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'productos' => $productos
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al buscar productos: ' . $e->getMessage()
            ];
        }
    }
    
    // Consulta 4: Obtener categorías activas
    public function obtenerCategorias() {
        try {
            $sql = "SELECT * FROM categorias WHERE activo = TRUE ORDER BY nombre ASC";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            
            $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'categorias' => $categorias
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener categorías: ' . $e->getMessage()
            ];
        }
    }
    
    // Consulta 5: Registrar nueva venta
    public function registrarVenta($datos_venta) {
        try {
            $this->pdo->beginTransaction();
            
            // 1. Insertar cliente si no existe
            $cliente_id = $this->obtenerOInsertarCliente($datos_venta['cliente']);
            
            // 2. Insertar venta
            $sql_venta = "INSERT INTO ventas (cliente_id, subtotal, iva, total, metodo_pago, direccion_envio) 
                         VALUES (:cliente_id, :subtotal, :iva, :total, :metodo_pago, :direccion_envio) 
                         RETURNING id, numero_pedido";
            
            $stmt_venta = $this->pdo->prepare($sql_venta);
            $stmt_venta->execute([
                ':cliente_id' => $cliente_id,
                ':subtotal' => $datos_venta['subtotal'],
                ':iva' => $datos_venta['iva'],
                ':total' => $datos_venta['total'],
                ':metodo_pago' => $datos_venta['metodo_pago'],
                ':direccion_envio' => $datos_venta['direccion_envio']
            ]);
            
            $venta = $stmt_venta->fetch(PDO::FETCH_ASSOC);
            $venta_id = $venta['id'];
            $numero_pedido = $venta['numero_pedido'];
            
            // 3. Insertar detalles de venta
            $sql_detalle = "INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
                           VALUES (:venta_id, :producto_id, :cantidad, :precio_unitario, :subtotal)";
            
            $stmt_detalle = $this->pdo->prepare($sql_detalle);
            
            foreach ($datos_venta['productos'] as $producto) {
                $stmt_detalle->execute([
                    ':venta_id' => $venta_id,
                    ':producto_id' => $producto['id'],
                    ':cantidad' => $producto['cantidad'],
                    ':precio_unitario' => $producto['precio'],
                    ':subtotal' => $producto['precio'] * $producto['cantidad']
                ]);
            }
            
            // 4. Actualizar estadísticas del cliente
            $this->actualizarEstadisticasCliente($cliente_id, $datos_venta['total']);
            
            $this->pdo->commit();
            
            return [
                'success' => true,
                'numero_pedido' => $numero_pedido,
                'venta_id' => $venta_id,
                'message' => 'Venta registrada exitosamente'
            ];
            
        } catch(PDOException $e) {
            $this->pdo->rollBack();
            return [
                'success' => false,
                'message' => 'Error al registrar venta: ' . $e->getMessage()
            ];
        }
    }
    
    // Consulta 6: Obtener ventas recientes
    public function obtenerVentasRecientes($limite = 10) {
        try {
            $sql = "SELECT * FROM vista_ventas_completa 
                    ORDER BY fecha_venta DESC 
                    LIMIT :limite";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
            $stmt->execute();
            
            $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'ventas' => $ventas
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener ventas: ' . $e->getMessage()
            ];
        }
    }
    
    // Consulta 7: Obtener productos más vendidos
    public function obtenerProductosMasVendidos($limite = 5) {
        try {
            $sql = "SELECT * FROM vista_productos_mas_vendidos LIMIT :limite";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
            $stmt->execute();
            
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'productos' => $productos
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener productos más vendidos: ' . $e->getMessage()
            ];
        }
    }
    
    // Consulta 8: Obtener estadísticas de la tienda
    public function obtenerEstadisticasTienda() {
        try {
            $sql = "SELECT 
                    (SELECT COUNT(*) FROM productos WHERE activo = TRUE) as total_productos,
                    (SELECT COUNT(*) FROM clientes WHERE activo = TRUE) as total_clientes,
                    (SELECT COUNT(*) FROM ventas WHERE fecha_venta >= CURRENT_DATE) as ventas_hoy,
                    (SELECT COALESCE(SUM(total), 0) FROM ventas WHERE fecha_venta >= CURRENT_DATE) as ingresos_hoy,
                    (SELECT COUNT(*) FROM productos WHERE stock <= stock_minimo) as productos_stock_bajo";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            
            $estadisticas = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'estadisticas' => $estadisticas
            ];
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ];
        }
    }
    
    // Consulta 9: Verificar promoción
    public function verificarPromocion($codigo) {
        try {
            $sql = "SELECT * FROM promociones 
                    WHERE codigo = :codigo 
                    AND activo = TRUE 
                    AND fecha_inicio <= CURRENT_DATE 
                    AND fecha_fin >= CURRENT_DATE
                    AND (usos_maximos = 0 OR usos_actuales < usos_maximos)";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':codigo' => $codigo]);
            
            $promocion = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($promocion) {
                return [
                    'success' => true,
                    'promocion' => $promocion
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Promoción no válida o expirada'
                ];
            }
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al verificar promoción: ' . $e->getMessage()
            ];
        }
    }
    
    // Consulta 10: Obtener detalle de venta por número de pedido
    public function obtenerDetalleVenta($numero_pedido) {
        try {
            $sql = "SELECT 
                    v.numero_pedido,
                    v.fecha_venta,
                    v.subtotal,
                    v.iva,
                    v.total,
                    v.metodo_pago,
                    v.direccion_envio,
                    c.nombre as cliente_nombre,
                    c.email as cliente_email,
                    c.telefono as cliente_telefono,
                    p.nombre as producto_nombre,
                    dv.cantidad,
                    dv.precio_unitario,
                    dv.subtotal as producto_subtotal
                FROM ventas v
                JOIN clientes c ON v.cliente_id = c.id
                JOIN detalle_venta dv ON v.id = dv.venta_id
                JOIN productos p ON dv.producto_id = p.id
                WHERE v.numero_pedido = :numero_pedido";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':numero_pedido' => $numero_pedido]);
            
            $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if ($detalles) {
                return [
                    'success' => true,
                    'venta' => $detalles[0], // Información general
                    'productos' => $detalles  // Lista de productos
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Venta no encontrada'
                ];
            }
            
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener detalle de venta: ' . $e->getMessage()
            ];
        }
    }
    
    // Métodos auxiliares privados
    private function obtenerOInsertarCliente($datos_cliente) {
        // Verificar si el cliente ya existe
        $sql = "SELECT id FROM clientes WHERE email = :email";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':email' => $datos_cliente['email']]);
        
        $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($cliente) {
            return $cliente['id'];
        } else {
            // Insertar nuevo cliente
            $sql = "INSERT INTO clientes (nombre, email, telefono, direccion, ciudad, estado, codigo_postal) 
                   VALUES (:nombre, :email, :telefono, :direccion, :ciudad, :estado, :codigo_postal) 
                   RETURNING id";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':nombre' => $datos_cliente['nombre'],
                ':email' => $datos_cliente['email'],
                ':telefono' => $datos_cliente['telefono'],
                ':direccion' => $datos_cliente['direccion'],
                ':ciudad' => $datos_cliente['ciudad'] ?? '',
                ':estado' => $datos_cliente['estado'] ?? '',
                ':codigo_postal' => $datos_cliente['codigo_postal'] ?? ''
            ]);
            
            $nuevo_cliente = $stmt->fetch(PDO::FETCH_ASSOC);
            return $nuevo_cliente['id'];
        }
    }
    
    private function actualizarEstadisticasCliente($cliente_id, $total_compra) {
        $sql = "UPDATE clientes 
               SET total_compras = total_compras + :total,
                   ultima_compra = CURRENT_TIMESTAMP
               WHERE id = :cliente_id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':total' => $total_compra,
            ':cliente_id' => $cliente_id
        ]);
    }
}

// Uso de la clase
$consultas = new ConsultasTienda($pdo);

// Ejemplo de cómo usar las consultas desde JavaScript/AJAX
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $accion = $_GET['accion'] ?? '';
    
    switch ($accion) {
        case 'productos_activos':
            $categoria_id = $_GET['categoria_id'] ?? null;
            echo json_encode($consultas->obtenerProductosActivos($categoria_id));
            break;
            
        case 'productos_destacados':
            $limite = $_GET['limite'] ?? 8;
            echo json_encode($consultas->obtenerProductosDestacados($limite));
            break;
            
        case 'categorias':
            echo json_encode($consultas->obtenerCategorias());
            break;
            
        case 'buscar_productos':
            $termino = $_GET['termino'] ?? '';
            echo json_encode($consultas->buscarProductos($termino));
            break;
            
        case 'estadisticas':
            echo json_encode($consultas->obtenerEstadisticasTienda());
            break;
            
        case 'productos_mas_vendidos':
            $limite = $_GET['limite'] ?? 5;
            echo json_encode($consultas->obtenerProductosMasVendidos($limite));
            break;
            
        case 'verificar_promocion':
            $codigo = $_GET['codigo'] ?? '';
            echo json_encode($consultas->verificarPromocion($codigo));
            break;
            
        case 'detalle_venta':
            $numero_pedido = $_GET['numero_pedido'] ?? '';
            echo json_encode($consultas->obtenerDetalleVenta($numero_pedido));
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida']);
    }
}

// Para registrar una venta (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';
    
    if ($accion === 'registrar_venta') {
        $datos_venta = json_decode(file_get_contents('php://input'), true);
        echo json_encode($consultas->registrarVenta($datos_venta));
    }
}
?>