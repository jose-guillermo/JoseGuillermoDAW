<?php 

// Devuelve todos los mensajes de un usuario en específico

// Habilito el cors
require_once "../../cors.php";

require_once __DIR__ . '/../../vendor/autoload.php'; 
// Me conecto a la base de datos
require_once "../conn.php";
// Compruebo si el usuario está logeado
// require_once "../../session/verify.php";

header('Content-Type: application/json');
try{
    
    $query = 'SELECT id, nombre AS name, piezas AS pieces FROM juegos';
    $result = pg_query($conn, $query);

    if ($result) {
        $rows = pg_fetch_all($result);
        if (!$rows) {
            throw new Exception("No hay mensajes");
        } else {
            foreach ($rows AS &$juego) {
                // Eliminar las llaves y convertir el string a un array
                $juego['pieces'] = explode(',', trim($juego['pieces'], '{}'));
            }
            echo json_encode([
                "exito" => true,
                "mensaje" => "Mensajes devueltos",
                "juegos" => $rows,
            ], JSON_PRETTY_PRINT);
        }
    } else {
        throw new Exception("No existe este usuario");
    }

} catch (Exception $e){
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
    exit;
}
