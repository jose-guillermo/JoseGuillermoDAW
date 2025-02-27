<?php 
// Crear usuario
require_once "../../cors.php";
require_once "../conn.php";
// Verifico que el usuario que me quieren enviar no existe

header('Content-Type: application/json');
try {

    $id = uniqid("game_");
    $nombre = $_POST["nombre"];
    $piezas = json_decode($_POST["piezas"]);

    $piezas_pg = "{" . implode(",", $piezas) . "}";
    // consulta para crear usuario
    $query = "INSERT INTO juegos (id, nombre, piezas) 
              VALUES($1, $2, $3)";
    
    $result = pg_query_params($conn, $query, [$id, $nombre, $piezas_pg]);

    echo json_encode([
        "exito" => true,
        "idGame" => $id,
        "mensaje" => "juego creado con exito",
    ], JSON_PRETTY_PRINT);
    
} catch(Exception $e) {
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}