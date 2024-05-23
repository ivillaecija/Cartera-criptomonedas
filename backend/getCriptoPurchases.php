<?php
// Importar el archivo de conexión
require_once 'conex.php';

// Obtener los datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"));

// Verificar que se hayan recibido los datos necesarios
if(isset($data->usuario, $data->cripto)) {
    // Obtener los valores enviados desde el frontend
    $usuario = $data->usuario;
    $cripto = $data->cripto;

    // Preparar la consulta SQL para obtener las compras del usuario en la criptomoneda especificada
    $stmt_purchases = $conn->prepare("SELECT Currency.Code, Purchase.CurrencyQuantity FROM Purchase INNER JOIN Currency ON Purchase.Currency_ID = Currency.Currency_ID WHERE Purchase.User_ID = (SELECT User_ID FROM User WHERE Email = ?) AND Purchase.Coin_ID = (SELECT Coin_ID FROM Coin WHERE Internal = ?)");
    $stmt_purchases->bind_param("ss", $usuario, $cripto);
    $stmt_purchases->execute();
    $result_purchases = $stmt_purchases->get_result();

    // Crear un array para almacenar los datos de las compras
    $purchases = array();

    // Recorrer los resultados y almacenarlos en el array
    while($row = $result_purchases->fetch_assoc()) {
        $purchases[] = $row;
    }

    // Devolver los datos en formato JSON
    header('Content-Type: application/json');
    echo json_encode($purchases);
} else {
    // No se recibieron todos los datos necesarios, devolver error
    http_response_code(400);
}
?>
