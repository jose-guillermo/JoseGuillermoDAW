<?php 
// Crear usuario
require_once "../../cors.php";
require_once "../conn.php";

header('Content-Type: application/json');
try {

    $idProducto = $_POST["idProduct"];

    $query = "SELECT id FROM usuarios WHERE rol = user";
    
    $resultGames = pg_query($conn, $query);
    
    $rows = pg_fetch_all($resultGames);
    
    if ($rows) {
        // Recorre todas las filas
        foreach ($rows as $row) {
            $query = "INSERT INTO compras (id_usuario, id_producto) 
              VALUES($1, $2)";
            pg_query_params($conn, $query, [$row['id'], $idProducto]);
        }
    }

    echo json_encode([
        "exito" => true,
        "mensaje" => "producto por defecto añadido",
    ], JSON_PRETTY_PRINT);
    
} catch(Exception $e) {
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}