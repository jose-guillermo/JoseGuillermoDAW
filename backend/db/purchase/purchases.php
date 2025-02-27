<?php 

// Devuelve todos los mensajes de un usuario en específico

// Habilito el cors
require_once "../../cors.php";

require_once __DIR__ . '/../../vendor/autoload.php'; 
// Me conecto a la base de datos
require_once "../conn.php";
// Compruebo si el usuario está logeado
require_once "../../session/verify.php";

header('Content-Type: application/json');
try{
    $idUsuario = $_GET["idUsuario"];
    
    $query = 'SELECT id_producto AS idUsuario FROM compras WHERE id_usuario = $1';
    $result = pg_query_params($conn, $query, [$idUsuario]);

    if ($result) {
        $rows = pg_fetch_all($result);
        echo json_encode([
            "exito" => true,
            "mensaje" => "compras devueltos",
            "compras" => $rows,
        ], JSON_PRETTY_PRINT);
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
