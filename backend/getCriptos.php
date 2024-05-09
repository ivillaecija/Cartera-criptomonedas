<?php
// Importar el archivo de conexión
require_once 'conex.php';

// Consultar las criptomonedas en la base de datos
$query = "SELECT * FROM Coin";
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
    // Si no se encontraron criptomonedas, devolver un mensaje de error
    echo json_encode(array('message' => 'No se encontraron criptomonedas en la base de datos.'));
}

// Cerrar conexión
$conn->close();
?>
