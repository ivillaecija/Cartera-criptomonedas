<?php 
// Importar el archivo de conexión
require_once 'conex.php';

// Verificar si se ha recibido una solicitud POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "Se ha obtenido una petición post.\n";
    // Obtener los objetos de monedas (suponiendo que estén en formato JSON)
    $coinObjectsJson = file_get_contents('php://input');
    $coinObjects = json_decode($coinObjectsJson);
    echo "Data $coinObjects \n";
    
    if (!empty($coinObjects)) {
        echo "Se ha recibido el json";
        // Iterar sobre los objetos de monedas
        foreach ($coinObjects as $coin) {
            echo "Coin: $coin \n";
            // Verificar si la moneda ya está en la base de datos
            $query = "SELECT * FROM Coin WHERE Internal = '$coin->Internal'";
            $result = $conn->query($query);

            if ($result->num_rows == 0) {
                // Si la moneda no está en la base de datos, insertarla
                $insertQuery = "INSERT INTO Coin (Internal, CoinFullName, ImageUrl) VALUES ('$coin->Internal', '$coin->CoinFullName', 'https://cryptocompare.com$coin->ImageUrl')";
                if ($conn->query($insertQuery) === TRUE) {
                    echo "Nueva moneda insertada: " . $coin->CoinFullName . "\n";
                } else {
                    echo "Error al insertar moneda: " . $conn->error . "\n";
                }
            } else {
                echo "La moneda " . $coin->CoinFullName . " ya está en la base de datos.\n";
            }
        }
    } else {
        echo "No se han recibido objetos de monedas en la solicitud.\n";
    }
}

// Cerrar conexión
$conn->close();

?>
