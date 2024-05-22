<?php
// Importar el archivo de conexión
require_once 'conex.php';

// Verificar si se ha recibido una solicitud POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener el contenido de la solicitud POST en formato JSON
    $data = file_get_contents('php://input');
    
    // Decodificar el JSON a un objeto PHP
    $request = json_decode($data);

    // Verificar que se hayan recibido el correo y la contraseña
    if (!empty($request->correo) && !empty($request->password)) {
        // Preparar la consulta SQL para buscar el usuario por correo
        $email = $request->correo;
        $password = $request->password;
        $query = $conn->prepare("SELECT Password FROM User WHERE Email = ?");
        $query->bind_param("s", $email);

        // Ejecutar la consulta
        $query->execute();
        $result = $query->get_result();

        // Verificar si se encontró un usuario
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $hashedPassword = $row['Password'];

            // Verificar la contraseña
            if (password_verify($password, $hashedPassword)) {
                // Preparar la respuesta en caso de éxito
                $response = array("success" => true);
            } else {
                // Preparar la respuesta en caso de contraseña incorrecta
                $response = array("success" => false, "error" => "Contraseña incorrecta");
            }
        } else {
            // Preparar la respuesta en caso de usuario no encontrado
            $response = array("success" => false, "error" => "Usuario no encontrado");
        }

        // Cerrar la consulta
        $query->close();
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
