var apikey = (function() {
    var apikey = "38f6fe89b061754d4a174474fd82af2a8c6ba01758f0c28c4309ec53c8588696";
    
    return {
        obtenerApiKey: function() {
            return apikey;
        }
    };
})();

// Función para obtener el top 30 de criptomonedas en formato de la tabla Coin
async function obtenerCriptosAPI() {
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

// Función para añadir las criptos no existentes del top 30 en la bbdd a ella
async function agregarCriptosBBDD() {
    try {
        const criptos = await obtenerCriptosAPI();

        const response = await $.ajax({
            url: "backend/criptoCreate.php",
            type: "POST",
            data: JSON.stringify({ dataCriptos: criptos }), // Convertir a JSON
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

// Función para obtener las criptos de la bbdd
async function obtenerCriptosBBDD() {
    try {
        const response = await $.ajax({
            url: "backend/getCriptos.php",
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        });

        // Verificar si se obtuvieron datos de manera exitosa
        if (response && response.length > 0) {
            console.log("Criptomonedas obtenidas de la base de datos:");
            console.log(response);
            return response; // Devuelve las criptomonedas obtenidas
        } else {
            console.log("No se encontraron criptomonedas en la base de datos.");
            return []; // Devuelve un array vacío si no se encontraron criptomonedas
        }
    } catch (error) {
        console.error("Error al obtener las criptomonedas de la base de datos:", error);
        return null; // Devuelve null en caso de error
    }
}



document.addEventListener("DOMContentLoaded", async function() {
    // Añadir criptos del top 30 en caso de que no esten en la base de datos
    await agregarCriptosBBDD();

    // Añadir criptos a la select
    let criptos = obtenerCriptosBBDD();
});