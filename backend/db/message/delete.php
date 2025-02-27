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

    $query = "DELETE FROM mensajes WHERE id = $1";
    $result = pg_query_params($conn, $query, [$idMessage]);

    if ($result === false) {
        throw new Exception("Error al ejecutar la consulta.");
    } else {
        require_once "messages.php";
    }
} catch (Exception $e){
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
    exit;
}

?>