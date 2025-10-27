<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../controllers/PedidoController.php';

$controller = new PedidoController();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $controller->obtenerPedidos();
        break;
    case 'POST':
        $controller->crearPedido();
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>