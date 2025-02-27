<?php

/**
 * Sube un archivo json que serán las traducciones que utilizará mi web
 */

require_once "../cors.php";
require_once "conf.php";

use Cloudinary\Api\Upload\UploadApi;

header('Content-Type: application/json');
try{
    if (!isset($_FILES["json"]) || !isset($_POST["dir"]) || !isset($_POST["id"]) || !isset($_POST["lang"])) {
        throw new Exception("Faltan datos en la solicitud (json, directorio, id o idioma)");
    }
    
    $temp = $_FILES["json"]["tmp_name"];

    /** 
     * La carpeta donde se guardará, por ejemplo, si es una idioma de un juego se guardará en lang/games
     * @var string $dir 
    */
    $dir = $_POST["dir"];

    /** 
     * El id de la entidad a la que pertenece, por ejemplo, si pertenece a un juego será el id del juego 
     * @var string $id 
    */
    $id = $_POST["id"];

    /** 
     * El idioma al que corresponde json
     * @var string $lang
    */
    $lang = $_POST["lang"];

    $json = $lang . ".json";

    rename($temp, $json ); 

    $upload = new UploadApi();
    $response = $upload->upload($json, [
        'folder' => "lang/$dir/$id",
        'public_id' => "$lang.json",
        'resource_type' => 'raw',
        'overwrite' => true,
    ]);

    unlink($json);
    
    echo json_encode([
        "exito" => true,
        "url" => $response["secure_url"],
        "public_id" => $response["public_id"],
    ], JSON_PRETTY_PRINT);

} catch(Exception $e) {

    echo json_encode([
        "exito" => false,
        "error" => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
    
}

?>