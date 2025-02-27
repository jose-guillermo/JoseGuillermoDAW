<?php 
// Crear usuario
require_once "../../cors.php";
require_once "../conn.php";
// Verifico que el usuario que me quieren enviar no existe

header('Content-Type: application/json');
try {

    $id = uniqid("product_");
    $nombre = $_POST["nombre"];
    $precio = $_POST["precio"];
    $juego = $_POST["juego"];
    $tipo = $_POST["tipo"];

    $query = "SELECT id FROM juegos WHERE nombre = $1";
    $resultGames = pg_query_params($conn, $query, [$juego]);
    
    
    $row = pg_fetch_assoc($resultGames);
    
    // consulta para crear usuario
    $query = "INSERT INTO productos (id, nombre, precio, juego, tipo) 
              VALUES($1, $2, $3, $4, $5)";
    
    $result = pg_query_params($conn, $query, [$id, $nombre, $precio, $row["id"], $tipo]);

    echo json_encode([
        "exito" => true,
        "idProduct" => $id,
        "mensaje" => "producto creado con exito",
    ], JSON_PRETTY_PRINT);
    
} catch(Exception $e) {
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}