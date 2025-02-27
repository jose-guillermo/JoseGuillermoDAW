<?php 

require_once "conn.php";

$script_sql = file_get_contents('inidb.sql');
$result = pg_query($conn, $script_sql);

if ($result) {
    echo "Script ejecutado correctamente. \n";
} else {
    // Si ocurre un error, mostrar el detalle del error
    echo "Error al ejecutar el script: " . pg_last_error($conn);
}

$passAdmin = "Jose02";
$passSys = uniqid("sys_");
$hashedPassAdmin = password_hash($passAdmin, PASSWORD_DEFAULT);
$hashedPassSys = password_hash($passSys, PASSWORD_DEFAULT);

$createAdmin = "INSERT INTO usuarios (id, nombre_usuario, email, monedas, password_hash, rol)
    VALUES('1', 'admin', 'joseguille.jbc@gmail.com', 0, '$hashedPassAdmin', 'admin'),
          ('0', 'sys', 'sys@gmail.com', 0, '$hashedPassSys', 'admin')";
pg_query($conn, $createAdmin);

pg_close($conn);
?>