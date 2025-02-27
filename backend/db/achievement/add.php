<?php 
// Crear usuario
require_once "../../cors.php";
require_once "../conn.php";
// Verifico que el usuario que me quieren enviar no existe

header('Content-Type: application/json');
try {

    $id = uniqid("achievement_");
    $nombre = $_POST["nombre"];
    $recompensa = $_POST["recompensa"];
    $nivel = $_POST["nivel"];
    $juego = $_POST["juego"];

    $query = "SELECT id FROM juegos WHERE nombre = $1";
    $resultGames = pg_query_params($conn, $query, [$juego]);
  
    $row = pg_fetch_assoc($resultGames);
    
    // consulta para crear logros
    $query = "INSERT INTO logros (id, nombre, recompensa_monedas, nivel, juego) 
              VALUES($1, $2, $3, $4, $5)";
    
    $result = pg_query_params($conn, $query, [$id, $nombre, $recompensa, $nivel, $row["id"]]);

    echo json_encode([
        "exito" => true,
        "idAchievement" => $id,
        "mensaje" => "producto creado con exito",
    ], JSON_PRETTY_PRINT);
    
} catch(Exception $e) {
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}