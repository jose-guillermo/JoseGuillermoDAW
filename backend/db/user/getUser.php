<?php 
// Devuelve todos los datos de un usuario

// Habilito el cors
require_once "../../cors.php";

require_once __DIR__ . '/../../vendor/autoload.php'; 
// Me conecto a la base de datos
require_once "../conn.php";

// Compruebo si el usuario está logeado y crea el $userId
require_once "../../session/verify.php";

header('Content-Type: application/json');
try{

    $idUsuario = $_GET["idUsuario"];

    $query = 'SELECT id, nombre_usuario AS "userName", email, rol, monedas AS coins, fecha_creacion_usuario AS "creationDate", juego_favorito AS "favouriteGame", logro_favorito AS "favouriteAchievement"  FROM usuarios WHERE id = $1';
    $result = pg_query_params($conn, $query, [$idUsuario]);

    if ($result) {
        $row = pg_fetch_assoc($result);
        if ($row === false) {
            throw new Exception("No existe este usuario");
        } else {
            echo json_encode([
                "exito" => true,
                "mensaje" => "Usuario devuelto",
                "user" => $row,
            ], JSON_PRETTY_PRINT);
        }
    } else {
        throw new Exception("No existe este usuario");
    }

} catch (Exception $e){
    echo json_encode([
        "exito" => false,
        "query" => $checkQuery,
        "userId" => $userId,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
    exit;
}

?>