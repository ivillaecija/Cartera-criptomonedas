<?php
// Importar el archivo de conexión
require_once 'conex.php';

// Verificar si se ha proporcionado el parámetro Internal en la solicitud GET
if(isset($_GET['Internal'])) {
    // Obtener el valor del parámetro Internal
    $internal = $_GET['Internal'];
    
    // Consultar las criptomonedas en la base de datos que coincidan con $internal
    $query = "SELECT * FROM Coin WHERE Internal = '$internal'";
    $result = $conn->query($query);

    // Verificar si se obtuvieron resultados
    if ($result->num_rows > 0) {
        // Inicializar un array para almacenar las criptomonedas
        $cryptos = array();

        // Iterar sobre los resultados y agregar cada criptomoneda al array
        while ($row = $result->fetch_assoc()) {
            $crypto = array(
                'Internal' => $row['Internal'],
                'CoinFullName' => $row['CoinFullName'],
                'ImageUrl' => $row['ImageUrl']
            );
            $cryptos[] = $crypto;
        }

        // Devolver los datos como JSON
        header('Content-Type: application/json');
        echo json_encode($cryptos);
    } else {
        // Si no se encontraron criptomonedas que coincidan con internal, devolver un mensaje de error
        echo json_encode(array('message' => 'No se encontraron criptomonedas con el internal en la base de datos.'));
    }
} else {
    // Si no se proporcionó el parámetro internal en la solicitud GET, devolver un mensaje de error
    echo json_encode(array('message' => 'El parámetro internal no fue proporcionado en la solicitud GET.'));
}

// Cerrar conexión
$conn->close();
?>
