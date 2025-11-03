<?php
session_start();
require_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM global.administradores WHERE username = ? AND activo = true");
        $stmt->execute([$username]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($admin && password_verify($password, $admin['password_hash'])) {
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            $_SESSION['admin_nombre'] = $admin['nombre_completo'];
            
            // Actualizar último acceso
            $update_stmt = $pdo->prepare("UPDATE global.administradores SET ultimo_acceso = NOW() WHERE id = ?");
            $update_stmt->execute([$admin['id']]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Login exitoso',
                'admin' => [
                    'nombre' => $admin['nombre_completo'],
                    'username' => $admin['username']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>