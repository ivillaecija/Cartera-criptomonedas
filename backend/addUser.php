<?php
// Importar el archivo de conexión
require_once 'conex.php';

// Verificar si se ha recibido una solicitud POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener el contenido de la solicitud POST en formato JSON
    $userJson = file_get_contents('php://input');
    
    // Decodificar el JSON a un objeto PHP
    $user = json_decode($userJson);

    // Verificar que se hayan recibido los datos necesarios
    if (!empty($user->Nombre) && !empty($user->Apellidos) && !empty($user->Correo) && !empty($user->Password)) {
        // Encriptar la contraseña
        $hashedPassword = password_hash($user->Password, PASSWORD_DEFAULT);

        // Preparar la consulta SQL para insertar el usuario
        $insertQuery = $conn->prepare("INSERT INTO User (Username, Surnames, Email, Password) VALUES (?, ?, ?, ?)");
        $insertQuery->bind_param("ssss", $user->Nombre, $user->Apellidos, $user->Correo, $hashedPassword);

        // Ejecutar la consulta y verificar si la inserción fue exitosa
        if ($insertQuery->execute()) {
            // Preparar la respuesta en caso de éxito
            $response = array("success" => true);
        } else {
            // Preparar la respuesta en caso de error en la inserción
            $response = array("success" => false, "error" => $conn->error);
        }

        // Cerrar la consulta
        $insertQuery->close();
    } else {
        // Preparar la respuesta en caso de datos incompletos
        $response = array("success" => false, "error" => "Datos incompletos");
    }

    // Devolver la respuesta en formato JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}

// Cerrar la conexión
$conn->close();
?>
