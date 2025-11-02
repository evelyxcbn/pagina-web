<?php
// config/database.php

$host = 'localhost';
$port = '5432';
$dbname = 'tienda_central'; // Tu base de datos central
$username = 'tienda_user';
$password = 'Tienda2024!';

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>