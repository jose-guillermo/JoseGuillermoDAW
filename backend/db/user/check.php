<?php 
// Comprueba si el nombre de usuario o el email ya existe
header('Content-Type: application/json');
try{
    $nombre_usuario = $_POST["nombre_usuario"];
    $email = $_POST["email"];

    $checkQuery = "SELECT nombre_usuario, email FROM usuarios WHERE nombre_usuario = $1 OR email = $2";
    $result = pg_query_params($conn, $checkQuery, [$nombre_usuario, $email]);

    if ($result) {
        $row = pg_fetch_assoc($result);
        if ($row) {
            if ($row['nombre_usuario'] === $nombre_usuario && $row['email'] === $email) {
                throw new Exception("both");
            } elseif ($row['nombre_usuario'] === $nombre_usuario) {
                throw new Exception("userName");
            } elseif ($row['email'] === $email) {
                throw new Exception("email");
            }
        }
    }

} catch (Exception $e){
    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
    exit;
}
