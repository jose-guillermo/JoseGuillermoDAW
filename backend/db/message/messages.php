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
    
    $query = 'SELECT mensajes.id, usuarios.nombre_usuario AS sender, mensajes.fecha AS "creationDate", mensajes.titulo AS title, mensajes.leido AS read, mensajes.contenido AS body, mensajes.tipo AS type
                   FROM mensajes JOIN usuarios ON mensajes.id_remitente = usuarios.id
                   WHERE id_destinatario = $1';
    $result = pg_query_params($conn, $query, [$userId]);

    if ($result) {
        $rows = pg_fetch_all($result);
        if (!$rows) {
            throw new Exception("No hay mensajes");
        } else {
            foreach ($rows as &$row) {
                $row['read'] = $row['read'] === 't'; // Convierte 't' a true, 'f' a false
            }
            unset($row);
            echo json_encode([
                "exito" => true,
                "mensaje" => "Mensajes devueltos",
                "mensajes" => $rows,
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

?>