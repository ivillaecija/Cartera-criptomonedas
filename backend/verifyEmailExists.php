<?php
// Importar el archivo de conexión
require_once 'conex.php';

// Verificar si se ha recibido una solicitud POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener el contenido de la solicitud POST en formato JSON
    $data = file_get_contents('php://input');
    
    // Decodificar el JSON a un objeto PHP
    $request = json_decode($data);

    // Verificar que se haya recibido el correo
    if (!empty($request->correo)) {
        // Preparar la consulta SQL para verificar si el correo existe
        $email = $request->correo;
        $query = $conn->prepare("SELECT COUNT(*) AS count FROM User WHERE Email = ?");
        $query->bind_param("s", $email);

        // Ejecutar la consulta
        $query->execute();
        $result = $query->get_result();
        $row = $result->fetch_assoc();

        // Verificar si el correo existe
        $exists = $row['count'] > 0;

        // Preparar la respuesta
        $response = array("exists" => $exists);

        // Cerrar la consulta
        $query->close();
    } else {
        // Preparar la respuesta en caso de datos incompletos
        $response = array("exists" => false, "error" => "Correo no proporcionado");
    }

    // Devolver la respuesta en formato JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}

// Cerrar la conexión
$conn->close();
?>
