<?php
header("Access-Control-Allow-Origin: https://virtual-board-games.web.app"); // Permite solo a mi frontend
header("Access-Control-Allow-Credentials: true"); // Permitir envío de cookies o credenciales

// Destruyo la cookie del jwt
$cookieOptions = [
    "expires" => time() - 1000,
    "path" => "/",
    "domain" => "vbgames-backend-production.up.railway.app",
    "httponly" => true,
    "secure" => true,
    "samesite" => "None",
];
setcookie("jwt", "", $cookieOptions);

header('Content-Type: application/json');

echo json_encode([
    "exito" => true,
    "mensaje" => "sesión destruida",
], JSON_PRETTY_PRINT);

?>