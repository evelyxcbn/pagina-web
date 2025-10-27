<?php
require_once 'config/Database.php';

class ClienteModel {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    // Registrar cliente en región específica
    public function registrar($datos_cliente) {
        $region = $datos_cliente['region'];
        $database = new Database();
        $conn_regional = $database->connectRegional($region);
        
        $query = "INSERT INTO clientes (nombre_completo, email, telefono, direccion, ciudad, codigo_postal, region) 
                 VALUES (:nombre, :email, :telefono, :direccion, :ciudad, :cp, :region) RETURNING id";
        
        $stmt = $conn_regional->prepare($query);
        $stmt->bindParam(':nombre', $datos_cliente['nombre']);
        $stmt->bindParam(':email', $datos_cliente['email']);
        $stmt->bindParam(':telefono', $datos_cliente['telefono']);
        $stmt->bindParam(':direccion', $datos_cliente['direccion']);
        $stmt->bindParam(':ciudad', $datos_cliente['ciudad']);
        $stmt->bindParam(':cp', $datos_cliente['codigo_postal']);
        $stmt->bindParam(':region', $region);
        
        $stmt->execute();
        $resultado = $stmt->fetch();
        
        return $resultado['id'];
    }

    // Buscar cliente en todas las regiones
    public function buscar($email) {
        $query = "SELECT * FROM global.vista_clientes_global WHERE email = :email";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        return $stmt->fetch();
    }
}
?>