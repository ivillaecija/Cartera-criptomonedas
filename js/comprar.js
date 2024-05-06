var apikey = (function() {
    var apikey = "38f6fe89b061754d4a174474fd82af2a8c6ba01758f0c28c4309ec53c8588696";
    
    return {
        obtenerApiKey: function() {
            return apikey;
        }
    };
})();


// Función para obtener las criptomonedas en formato de la tabla Coin
async function obtenerCriptos() {
    try {
        const apiKey = apikey.obtenerApiKey();
        const response = await $.ajax({
            url: "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=30&tsym=USD",
            headers: {
                "Authorization": `Apikey ${apiKey}`
            },
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        });

        // Procesar la respuesta para obtener las criptomonedas en formato de la tabla Coin
        const criptosCoinFormat = response.Data.map(cripto => {
            return {
                Internal: cripto.CoinInfo.Internal,
                CoinFullName: cripto.CoinInfo.FullName,
                ImageUrl: cripto.CoinInfo.ImageUrl
            };
        });

        return criptosCoinFormat;
    } catch (error) {
        console.error("Ha habido un error:", error);
        return null; // Devolver un valor nulo en caso de error
    } 
}

async function agregarCriptos() {
    try {
        const criptos = await obtenerCriptos();
        console.log("Criptos antes de enviar la petición: ");
        criptos.forEach(cripto => {
            console.log(cripto);
        });
        const response = await $.ajax({
            url: "backend/criptoCreate.php",
            type: "POST",
            data: { dataCriptos: criptos },
            dataType: "json",
            contentType: "application/json"
        });

        if (response.success) {
            console.log("Se han insertado las criptomonedas correctamente en la base de datos.");
        } else {
            console.log("Ha habido un error al insertar las criptomonedas en la base de datos.");
        }
    } catch (error) {
        console.error("Ha habido un error:", error);
    }
}





document.addEventListener("DOMContentLoaded", async function() {
    // Añadir criptos del top 30 en caso de que no esten en la base de datos
    await agregarCriptos();
});