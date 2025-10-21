<?php
// Configuración de la base de datos
$host = 'localhost';
$dbname = 'tienda_escolar';
$username = 'postgres';
$password = 'Honimore188';

try {
    // Crear conexión PDO
    $pdo = new PDO("pgsql:host=$host;dbname=$tienda_escolar", $username=, $password);
    
    // Configurar PDO para que muestre errores
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Configurar codificación de caracteres
    $pdo->exec("SET NAMES 'utf8'");
    
} catch(PDOException $e) {
    // En caso de error, mostrar mensaje
    die("Error de conexión: " . $e->getMessage());
}
?>