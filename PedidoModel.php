<?php
require_once 'config/Database.php';

class PedidoModel {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    // Crear pedido distribuido
    public function crear($datos_pedido) {
        try {
            $this->conn->beginTransaction();

            // Llamar a función distribuida
            $query = "SELECT global.crear_pedido_distribuido(:cliente_id, :region, :direccion, :metodo_pago, :productos::jsonb) as numero_pedido";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':cliente_id', $datos_pedido['cliente_id']);
            $stmt->bindParam(':region', $datos_pedido['region']);
            $stmt->bindParam(':direccion', $datos_pedido['direccion']);
            $stmt->bindParam(':metodo_pago', $datos_pedido['metodo_pago']);
            $stmt->bindParam(':productos', json_encode($datos_pedido['productos']));
            
            $stmt->execute();
            $resultado = $stmt->fetch();
            
            $this->conn->commit();
            return $resultado['numero_pedido'];
            
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw new Exception("Error al crear pedido: " . $e->getMessage());
        }
    }

    // Obtener pedidos por región
    public function obtenerPorRegion($region) {
        $query = "SELECT * FROM global.vista_pedidos_global WHERE region_venta = :region ORDER BY fecha_pedido DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':region', $region);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }

    // Obtener detalles de pedido
    public function obtenerDetalles($pedido_id, $region) {
        $query = "SELECT dp.*, p.nombre as producto_nombre 
                 FROM global.detalles_pedido dp
                 JOIN global.vista_productos_global p ON dp.producto_id = p.id AND dp.region_venta = p.region
                 WHERE dp.pedido_id = :pedido_id AND dp.region_venta = :region";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':pedido_id', $pedido_id);
        $stmt->bindParam(':region', $region);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }
}
?>