<?php 

// Envia un mensaje con los datos necesarios

// Habilito el cors
require_once "../../cors.php";

require_once __DIR__ . '/../../vendor/autoload.php'; 
// Me conecto a la base de datos
require_once "../conn.php";
// Compruebo si el usuario está logeado y crea el $userId
require_once "../../session/verify.php";

header('Content-Type: application/json');

try{
    $idMessage = uniqid("message_");
    $destinatario = $_POST["destinatario"];
    $titulo = $_POST["titulo"];
    $contenido = $_POST["contenido"];
    $tipo = $_POST["tipo"];

    if($destinatario !== "1"){
        $query = "SELECT id FROM usuarios WHERE nombre_usuario = $1";
        $result = pg_query_params($conn, $query, [$destinatario]);
        if($result) {
            $row = pg_fetch_assoc($result);
            $destinatario = $row['id'];
        }
    }

    $query = "INSERT INTO mensajes (id, id_remitente, id_destinatario, titulo, contenido, tipo) 
              VALUES($1, $2, $3, $4, $5, $6)";
    $result = pg_query_params($conn, $query, [$idMessage ,$userId ,$destinatario, $titulo, $contenido, $tipo]);

    if($result) {
        echo json_encode([
            "exito" => true,
            "mensaje" => "mensaje enviado",
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