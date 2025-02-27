<?php

// include "../cors.php";
header("Access-Control-Allow-Origin: https://virtual-board-games.web.app"); // Permite solo a mi frontend
header("Access-Control-Allow-Credentials: true"); // Permitir envío de cookies o credenciales
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cabeceras permitidas
// Comentar al desplegar
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '../.env');
// $dotenv->load();

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Clave secreta para firmar mi jwt
$secret_key = $_ENV["SECRET_KEY_JWT"];

header('Content-Type: application/json');
try{
    if (!isset($_COOKIE['jwt'])) {
        throw new Exception("No está logeado");
    }
    $jwt = $_COOKIE["jwt"];

    $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));
    $userId = $decoded->user_id;
    
} catch (Exception $e) {
    echo json_encode([
        "exito" => false,
        "jwt" => $jwt,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
    exit;
}

// echo json_encode([
//     "exito" => true,
//     "error" => "bienvenido $jwt, userid: $userId",
// ], JSON_PRETTY_PRINT);

?>