<?php
// Importar el archivo de conexión
require_once 'conex.php';

// Obtener los datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"));

// Verificar que se haya recibido el usuario
if(isset($data->usuario)) {
    // Obtener el valor del usuario
    $usuario = $data->usuario;

    // Preparar la consulta SQL para obtener la cartera del usuario
    $stmt_wallet = $conn->prepare("SELECT Coin.CoinFullName, Wallet.Quantity, Coin.Internal, Coin.ImageUrl FROM Wallet INNER JOIN Coin ON Wallet.Coin_ID = Coin.Coin_ID WHERE Wallet.User_ID = (SELECT User_ID FROM User WHERE Email = ?)");
    $stmt_wallet->bind_param("s", $usuario);
    $stmt_wallet->execute();
    $result_wallet = $stmt_wallet->get_result();

    // Crear un array para almacenar los datos de la cartera
    $wallet = array();

    // Recorrer los resultados y almacenarlos en el array
    while($row = $result_wallet->fetch_assoc()) {
        $wallet[] = $row;
    }

    // Devolver los datos en formato JSON
    header('Content-Type: application/json');
    echo json_encode($wallet);
} else {
    // No se recibió el usuario, devolver error
    http_response_code(400);
}
?>
