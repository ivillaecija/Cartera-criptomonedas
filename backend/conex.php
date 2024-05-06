<?php
    // Datos de conexión a la base de datos
    $servername = "localhost";
    $username = "ivillaecija";
    $password = "221722";
    $dbname = "cartera_criptomonedas";

    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }
?>
