<?php 
// Archivo que habilita el cors en mi sitio web
// header("Access-Control-Allow-Origin: http://localhost:8100"); // Permite a solo a localhost por el puerto 8100
header("Access-Control-Allow-Origin: https://virtual-board-games.web.app"); // Permite solo a mi frontend
header("Access-Control-Allow-Credentials: true"); // Permitir envío de cookies o credenciales
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization, Set-Cookie"); // Cabeceras permitidas



?>