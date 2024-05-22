<?php
// Importar el archivo de conexión
require_once 'conex.php';

// Obtener los datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"));

// Verificar que se hayan recibido los datos necesarios
if(isset($data->usuario, $data->cripto, $data->divisa, $data->cantidad_divisa, $data->cantidad_cripto)) {
    // Obtener los valores enviados desde el frontend
    $usuario = $data->usuario;
    $cripto = $data->cripto;
    $divisa = $data->divisa;
    $cantidad_divisa = $data->cantidad_divisa;
    $cantidad_cripto = $data->cantidad_cripto;

    // Obtener el ID de usuario
    $stmt_user = $conn->prepare("SELECT User_ID FROM User WHERE Email = ?");
    $stmt_user->bind_param("s", $usuario);
    $stmt_user->execute(); 
    $result_user = $stmt_user->get_result();

    if ($result_user->num_rows > 0) {
        $row_user = $result_user->fetch_assoc();
        $user_id = $row_user['User_ID'];
    } else {
        // Usuario no encontrado, devolver error
        http_response_code(404);
        exit();
    }
    $stmt_user->close();

    // Obtener el ID de la criptomoneda
    $stmt_crypto = $conn->prepare("SELECT Coin_ID FROM Coin WHERE Internal = ?");
    $stmt_crypto->bind_param("s", $cripto);
    $stmt_crypto->execute();
    $result_crypto = $stmt_crypto->get_result();

    if ($result_crypto->num_rows > 0) {
        $row_crypto = $result_crypto->fetch_assoc();
        $crypto_id = $row_crypto['Coin_ID'];
    } else {
        // Criptomoneda no encontrada, devolver error
        http_response_code(404);
        exit();
    }
    $stmt_crypto->close();

    // Obtener el ID de la divisa
    $stmt_currency = $conn->prepare("SELECT Currency_ID FROM Currency WHERE Code = ?");
    $stmt_currency->bind_param("s", $divisa);
    $stmt_currency->execute();
    $result_currency = $stmt_currency->get_result();

    if ($result_currency->num_rows > 0) {
        $row_currency = $result_currency->fetch_assoc();
        $currency_id = $row_currency['Currency_ID'];
    } else {
        // Divisa no encontrada, devolver error
        http_response_code(404);
        exit();
    }
    $stmt_currency->close();

    // Iniciar transacción
    $conn->begin_transaction();

    // Verificar si la moneda ya existe en la billetera del usuario
    $stmt_check_wallet = $conn->prepare("SELECT Quantity FROM Wallet WHERE User_ID = ? AND Coin_ID = ?");
    $stmt_check_wallet->bind_param("ii", $user_id, $crypto_id);
    $stmt_check_wallet->execute();
    $result_check_wallet = $stmt_check_wallet->get_result();

    if ($result_check_wallet->num_rows > 0) {
        // La moneda ya existe en la billetera del usuario, actualizar cantidad
        $row_check_wallet = $result_check_wallet->fetch_assoc();
        $cantidad_cripto_update = $row_check_wallet['Quantity'] + $cantidad_cripto; // Sumar la cantidad actual con la nueva
        $stmt_check_wallet->close();
        $stmt_update_wallet = $conn->prepare("UPDATE Wallet SET Quantity = ? WHERE User_ID = ? AND Coin_ID = ?");
        $stmt_update_wallet->bind_param("dii", $cantidad_cripto_update, $user_id, $crypto_id);
        $stmt_update_wallet->execute();
        $stmt_update_wallet->close();
    } else {
        // La moneda no existe en la billetera del usuario, insertar nueva entrada
        $stmt_check_wallet->close();
        $stmt_insert_wallet = $conn->prepare("INSERT INTO Wallet (User_ID, Coin_ID, Quantity) VALUES (?, ?, ?)");
        $stmt_insert_wallet->bind_param("iid", $user_id, $crypto_id, $cantidad_cripto);
        $stmt_insert_wallet->execute();
        $stmt_insert_wallet->close();
    }

    // Insertar la compra en la tabla Purchase
    $stmt_purchase = $conn->prepare("INSERT INTO Purchase (User_ID, Coin_ID, Currency_ID, Quantity, CurrencyQuantity, PurchaseDate) VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt_purchase->bind_param("iiddd", $user_id, $crypto_id, $currency_id, $cantidad_cripto, $cantidad_divisa);
    $stmt_purchase->execute();

    // Verificar si la transacción fue exitosa
    if ($conn->commit()) {
        // La compra se realizó con éxito
        http_response_code(200);
    } else {
        // Hubo un error al realizar la compra
        http_response_code(500);
    }
} else {
    // No se recibieron todos los datos necesarios
    http_response_code(400);
}
?>
