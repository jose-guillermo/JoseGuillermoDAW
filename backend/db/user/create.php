<?php 
// Crear usuario
require_once "../../cors.php";
require_once "../conn.php";
// Verifico que el usuario que me quieren enviar no existe
require_once "check.php";

header('Content-Type: application/json');
try {

    $id = uniqid("user_");
    $nombre_usuario = $_POST["nombre_usuario"];
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Validar que los campos no estén vacíos
    if (!$nombre_usuario || !$email || !$password) {
        throw new Exception("Todos los campos son obligatorios");
    }
    
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    
    // consulta para crear usuario
    $query = "INSERT INTO usuarios (id, nombre_usuario, email, password_hash) 
              VALUES($1, $2, $3, $4)";
    
    $result = pg_query_params($conn, $query, [$id, $nombre_usuario, $email, $password_hash]);

    if( $result ){
        // consulta para crear los mensajes
        $query = "INSERT INTO mensajes (id, id_remitente, id_destinatario, titulo, contenido, tipo) 
                  VALUES($1, $2, $3, $4, $5, $6),
                        ($7, $8, $9, $10, $11, $12)";
        $idMessage1 = uniqid("message_");
        $idMessage2 = uniqid("message_");
        $result = pg_query_params($conn, $query, 
            [
                $idMessage1,"0" , $id, "MESSAGES.WELCOMING_MESSAGE.TITLE", "MESSAGES.WELCOMING_MESSAGE.BODY", "SYSTEM_NOTIFICATION",
                $idMessage2,"0" , $id, "MESSAGES.WELCOMING_SHOP_MESSAGE.TITLE", "MESSAGES.WELCOMING_SHOP_MESSAGE.BODY", "SHOP_MESSAGE"
            ]
        );

    }
    echo json_encode([
        "exito" => true,
        "userId" => $id,
        "mensaje" => "usuario creado con exito",
    ], JSON_PRETTY_PRINT);
    
} catch(Exception $e) {
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}