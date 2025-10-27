<?php
require_once 'config/Database.php';

class ProductoModel {
    private $conn;
    private $table = 'global.vista_productos_global';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    // Obtener todos los productos del sistema distribuido
    public function obtenerTodos() {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE activo = true ORDER BY region, nombre';
        
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception("Error al obtener productos: " . $e->getMessage());
        }
    }

    // Obtener productos por región
    public function obtenerPorRegion($region) {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE region = :region AND activo = true';
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':region', $region);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }

    // Búsqueda distribuida
    public function buscar($termino) {
        $query = "SELECT * FROM global.buscar_productos_distribuido(:termino)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':termino', $termino);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }

    // Obtener producto específico
    public function obtenerPorId($id, $region) {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE id = :id AND region = :region';
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':region', $region);
        $stmt->execute();
        
        return $stmt->fetch();
    }

    // Actualizar stock (operación distribuida)
    public function actualizarStock($id, $region, $nuevo_stock) {
        $database = new Database();
        $conn_regional = $database->connectRegional($region);
        
        $query = 'UPDATE productos SET stock = :stock WHERE id = :id';
        
        $stmt = $conn_regional->prepare($query);
        $stmt->bindParam(':stock', $nuevo_stock);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
}
?>