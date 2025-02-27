<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prueba de carga de imagen</title>
</head>
<body>
    <h1>Formulario de Prueba</h1>
    <form action="cloudinary/upload_lang.php" method="POST" enctype="multipart/form-data">
        <!-- Campo para la imagen -->
        <label for="json">lang:</label>
        <input type="file" name="json" id="json" required><br><br>

        <!-- Campo para 'dir' -->
        <label for="lang">lang:</label>
        <input type="text" name="lang" id="lang" value="user" required><br><br>

        <!-- Campo para 'id' -->
        <label for="id">ID:</label>
        <input type="text" name="id" id="id" value="sdfaksdfj" required><br><br>

        <!-- Campo para 'idImage' -->
        <label for="dir">Directorio:</label>
        <input type="text" name="dir" id="dir" value="sdfsdf123" required><br><br>

        <!-- Botón para enviar -->
        <input type="submit" value="Subir Imagen">
    </form>
</body>
</html>