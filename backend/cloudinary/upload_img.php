<?php

/**
 * Sube una imagen a cloudinary
 */

require_once "../cors.php";
require_once "conf.php";

use Cloudinary\Api\Upload\UploadApi;

header('Content-Type: application/json');
try{

    
    if (!isset($_POST["dir"])){
        throw new Exception("Faltan datos en la solicitud (dir)");
    }
    if (!isset($_POST["id"])){
        throw new Exception("Faltan datos en la solicitud (id)");
    }
    if (!isset($_POST["idImage"])){
        throw new Exception("Faltan datos en la solicitud (idImage)");
    }
    if (!isset($_FILES["image"])){
        throw new Exception("Faltan datos en la solicitud (imagen)");
    }
    
    $img = $_FILES["image"]["tmp_name"];

    /**
     * La carpeta donde se guardará, por ejemplo, si es una imagen de perfil se guardará en users
     * @var string $dir 
    */
    $dir = $_POST["dir"];

    /**
     * El id de la entidad a la que pertenece, por ejemplo, si pertenece a un juego será el id del juego 
     * @var string $id 
    */
    $id = $_POST["id"];

    /**
     * El nombre que la imagen tendrá en cloudinary
     * @var string $idImage
    */
    $idImage = $_POST["idImage"];


    $upload = new UploadApi();

    /**
     * Las opciones que le pondré para subir la imagen
     * @var Array $options
     */
    $options = [];

    // Si el directorio donde se va a guardar es user, la imagen se recortará para que sea circular
    if($dir === "user") {

        // Saco las dimensiones de la imagen 
        $dimensionImg = getimagesize($img);

        /**
         * Coge la menor de las dimensiones de la imagen, se utiliza para poder recortar la imagen de forma correcta
         * @var int $cropDimension
        */
        $cropDimension = min($dimensionImg[0], $dimensionImg[1]);
        
        $options = [
            'folder' => "$dir/$id", 
            'public_id' => $idImage,
            'resource_type' => 'image',
            'overwrite' => true,
            'format' => "webp",
            'transformation' => [
                'crop'   => 'crop', 
                'width'  => $cropDimension,       
                'height' => $cropDimension,       
                'gravity' => 'center', 
                'radius' => 'max',    
                'background' => 'transparent'
            ]
        ];
    } else {
        
        $options = [
            'folder' => "$dir/$id",
            'public_id' => $idImage,
            'resource_type' => 'image',
            'overwrite' => true,
            'format' => "webp",
        ];
    }

    // Subirá la imagen a cloudinary
    $response = $upload->upload($img, $options);
    

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