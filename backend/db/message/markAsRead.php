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

    $idMessage = $_POST["idMessage"];

    $query = "UPDATE mensajes SET leido = TRUE WHERE id = $1";
    $result = pg_query_params($conn, $query, [$idMessage]);

    if ($result === false) {
        throw new Exception("Error al ejecutar la consulta.");
    } else {
        echo json_encode([
            "exito" => true,
            "mensaje" => "Mensaje modificado",
        ], JSON_PRETTY_PRINT);
    }
} catch (Exception $e){
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
    exit;
}

?>