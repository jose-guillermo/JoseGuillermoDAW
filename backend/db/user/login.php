<?php

require_once "../../cors.php";
require_once "../conn.php";

header('Content-Type: application/json');
try{
    // if(!isset($_POST['email']) && !isset($_POST['password'])){
    //     throw new Exception("Faltan el email o la contraseña");
    // }
    $email = $_POST["email"];
    $password = $_POST["password"];

    $query = "SELECT * FROM usuarios WHERE email = $1";

    $result = pg_query_params($conn, $query, [$email]);

    if ($result) {
        $row = pg_fetch_assoc($result);
        if ($row) {
            if (!password_verify($password, $row['password_hash'])) {
                throw new Exception("Error al iniciar sesión");                
            }
        } else {
            throw new Exception("Error al iniciar sesión");
        }
    } else {
        throw new Exception("Error al iniciar sesión");
    }

} catch (Exception $e) {
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
    exit;
}
require_once "../../session/createSession.php";

?>