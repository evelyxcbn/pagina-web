<?php
require_once '../models/PedidoModel.php';
require_once '../models/ProductoModel.php';

class PedidoController {
    private $pedidoModel;
    private $productoModel;

    public function __construct() {
        $this->pedidoModel = new PedidoModel();
        $this->productoModel = new ProductoModel();
    }

    public function crearPedido() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validaciones básicas
            if (empty($input['cliente_id']) || empty($input['productos'])) {
                throw new Exception("Datos incompletos para crear pedido");
            }
            
            // Determinar región
            $region = $input['region'] ?? Config::getRegionPorIP($_SERVER['REMOTE_ADDR']);
            
            // Verificar stock de productos
            foreach ($input['productos'] as $producto) {
                $producto_info = $this->productoModel->obtenerPorId($producto['id'], $region);
                
                if (!$producto_info || $producto_info['stock'] < $producto['cantidad']) {
                    throw new Exception("Stock insuficiente para: " . $producto_info['nombre']);
                }
            }
            
            // Crear pedido
            $datos_pedido = [
                'cliente_id' => $input['cliente_id'],
                'region' => $region,
                'direccion' => $input['direccion'],
                'metodo_pago' => $input['metodo_pago'],
                'productos' => $input['productos']
            ];
            
            $numero_pedido = $this->pedidoModel->crear($datos_pedido);
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Pedido creado exitosamente',
                'numero_pedido' => $numero_pedido
            ]);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function obtenerPedidos() {
        try {
            $region = $_GET['region'] ?? null;
            
            if (!$region) {
                throw new Exception("Región requerida");
            }
            
            $pedidos = $this->pedidoModel->obtenerPorRegion($region);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $pedidos
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
?>