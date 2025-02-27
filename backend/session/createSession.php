<?php

//Crea un JWT y lo devulve al frontend
header("Access-Control-Allow-Origin: https://virtual-board-games.web.app"); // Permite solo a mi frontend
header("Access-Control-Allow-Credentials: true"); // Permitir envío de cookies o credenciales
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Métodos permitidos
// header("Access-Control-Allow-Headers: Content-Type, Authorization, Set-Cookie"); // Cabeceras permitidas

require_once __DIR__ . '/../vendor/autoload.php'; 

use Firebase\JWT\JWT;

header('Content-Type: application/json');

// Clave secreta para firmar mi jwt
$secret_key = $_ENV["SECRET_KEY_JWT"];

$exp = 3600 * 24 * 7;
$payload = [
    "iat" => time(),
    "exp" => time() + $exp,
    "user_id" => $row["id"]
];

$jwt = JWT::encode($payload, $secret_key, "HS256");

$cookieOptions = [
    "expires" => time() + 360000000,
    "path" => "/",
    "domain" => "vbgames-backend-production.up.railway.app",
    "httponly" => true,
    "secure" => true,
    "samesite" => "None",
];

setcookie("jwt", $jwt, $cookieOptions);

$cook = $_COOKIE;
echo json_encode([
    "exito" => true,
    "jwt" => $jwt,
    "id" => $row["id"],
    "mensaje" => "Sesión creada",
], JSON_PRETTY_PRINT);