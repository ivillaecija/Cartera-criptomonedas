<?php
// Importar el archivo de conexión
require_once 'conex.php';

$query = "SELECT * FROM Currency";
$result = $conn->query($query);

// Verificar si se obtuvieron resultados
if ($result->num_rows > 0) {
    $divisas = array();

    while ($row = $result->fetch_assoc()) {
        $divisa = array(
            'Code' => $row['Code'],
            'CurrencyName' => $row['CurrencyName']
        );
        $divisas[] = $divisa;
    }

    header('Content-Type: application/json');
    echo json_encode($divisas);
} else {
    echo json_encode(array('message' => 'No se encontraron criptomonedas en la base de datos.'));
}

// Cerrar conexión
$conn->close();
?>
