<?php
require_once '../models/ProductoModel.php';

class ProductoController {
    private $productoModel;

    public function __construct() {
        $this->productoModel = new ProductoModel();
    }

    public function obtenerProductos() {
        try {
            $region = $_GET['region'] ?? null;
            
            if ($region) {
                $productos = $this->productoModel->obtenerPorRegion($region);
            } else {
                $productos = $this->productoModel->obtenerTodos();
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $productos,
                'total' => count($productos)
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function buscarProductos() {
        try {
            $termino = $_GET['q'] ?? '';
            
            if (empty($termino)) {
                throw new Exception("Término de búsqueda requerido");
            }
            
            $productos = $this->productoModel->buscar($termino);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $productos
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}

// Uso del controlador
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $controller = new ProductoController();
    
    if (isset($_GET['q'])) {
        $controller->buscarProductos();
    } else {
        $controller->obtenerProductos();
    }
}
?>