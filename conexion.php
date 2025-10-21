<?php
// Configuración de la base de datos
$host = 'localhost';
$dbname = 'tienda_escolar';
$username = 'tu_usuario';
$password = 'tu_contraseña';

try {
    // Crear conexión PDO
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
    
    // Configurar PDO para que muestre errores
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Configurar codificación de caracteres
    $pdo->exec("SET NAMES 'utf8'");
    
} catch(PDOException $e) {
    // En caso de error, mostrar mensaje
    die("Error de conexión: " . $e->getMessage());
}
?>