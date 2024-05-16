var apikey = (function () {
    var apikey = "38f6fe89b061754d4a174474fd82af2a8c6ba01758f0c28c4309ec53c8588696";

    return {
        obtenerApiKey: function () {
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

// Función para obtener una cripto pasando el internal como parámetro
async function obtenerCriptoEspecifica(internal) {
    try {
        const response = await $.ajax({
            url: "backend/getCripto.php",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            data: { Internal: internal } // Pasar el código BTC como parámetro en la solicitud GET
        });

        // Verificar si se obtuvieron datos de manera exitosa
        if (response && response.length > 0) {
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


// Función para agregar las criptos a la select
function agregarCriptosYDivisasSelect(criptos, divisas) {
    let selectDivisas = document.getElementById("moneda");
    let selectCriptos = document.getElementById("criptomoneda");
    let imgCripto = document.querySelector(".imgCripto");

    if (divisas && divisas !== null) {
        if (divisas.length > 0) {
            for (i = 0; i < divisas.length; i++) {
                let divisa = divisas[i];
                selectDivisas.innerHTML += "<option value='" + divisa.Code + "'>" + divisa.CurrencyName + "</option>";
            }
        }
    }

    if (criptos && criptos !== null) {
        if (criptos.length > 0) {
            for (i = 0; i < criptos.length; i++) {
                let cripto = criptos[i];
                selectCriptos.innerHTML += "<option value='" + cripto.Internal + "'>" + cripto.CoinFullName + "</option>";
            }
            imgCripto.innerHTML = "<img src='" + criptos[0].ImageUrl + "' alt='Imagen cripto'/>";
        }
    }
}


// Función para agregar el evento para cambiar de crypto
async function cambiarCriptoSelect() {
    let select = document.getElementById("criptomoneda");
    let imgCriptoHtml = document.querySelector(".imgCripto");

    let cripto = select.value;
    let criptoData = await obtenerCriptoEspecifica(cripto);
    criptoData = criptoData[0];
    console.log(criptoData.ImageUrl);

    imgCriptoHtml.innerHTML = "<img src='" + criptoData.ImageUrl + "' alt='Imagen cripto'/>";

}

// Función para obtener el precio de una cripto con una divisa
async function obtenerPrecioCripto(cripto, divisa) {
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${cripto}&tsyms=${divisa}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[divisa];
    } catch (error) {
        console.error('Error al obtener el precio:', error);
        return null;
    }
}

// Función para obtener el precio más alto de una cripto hoy
async function obtenerPrecioAlto(cripto, divisa) {
    const apiKey = apikey.obtenerApiKey();
    const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cripto}&tsym=${divisa}&limit=1&api_key=${apiKey}`;

    try {
        const response = await $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        });

        if (response && response.Data && response.Data.Data && response.Data.Data.length > 0) {
            // El primer elemento del array Data.Data contiene la información más reciente
            const todayData = response.Data.Data[0];
            return todayData.high;
        } else {
            throw new Error('No se encontraron datos para el día de hoy.');
        }
    } catch (error) {
        console.error('Error al obtener el precio más alto:', error);
        return null;
    }
}

// Función para obtener el precio más bajo de una cripto hoy
async function obtenerPrecioBajo(cripto, divisa) {
    const apiKey = apikey.obtenerApiKey();
    const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cripto}&tsym=${divisa}&limit=1&api_key=${apiKey}`;

    try {
        const response = await $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        });

        if (response && response.Data && response.Data.Data && response.Data.Data.length > 0) {
            // El primer elemento del array Data.Data contiene la información más reciente
            const todayData = response.Data.Data[0];
            return todayData.low;
        } else {
            throw new Error('No se encontraron datos para el día de hoy.');
        }
    } catch (error) {
        console.error('Error al obtener el precio más bajo:', error);
        return null;
    }
}




// Función para modificar las estadisticas de la crypto actual en el HTML
async function modificarEstadisticas() {
    console.log("Modificando estadisticas...");
    let divisa = document.getElementById("moneda").value;
    let cripto = document.getElementById("criptomoneda").value;
    let h2precioSpan1 = document.querySelector("h2.precio span:first-child");
    let h2precioSpan2 = document.querySelector("h2.precio span:last-child");
    let pPrecioAlto = document.querySelector("p.precioAlto");
    let pPrecioBajo = document.querySelector("p.precioBajo");
    let pvariacion = document.querySelector("p.variacion");
    let plastUpdate = document.querySelector("p.lastUpdate");

    let precio = await obtenerPrecioCripto(cripto, divisa);
    h2precioSpan1.textContent = "El precio és: ";
    h2precioSpan2.textContent =  precio + " " + divisa;

    let precioAlto = obtenerPrecioAlto(cripto, divisa);
    let precioBajo = obtenerPrecioBajo(cripto, divisa);

}


// Obtener precio: https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,JPY,EUR,GBP,AUD,CAD,CHF,CNY,SEK,NZD

// Función para obtener divisas de la base de datos
async function obtenerDivisasBBDD() {
    try {
        const response = await $.ajax({
            url: "backend/getDivisas.php",
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        });

        // Verificar si se obtuvieron datos de manera exitosa
        if (response && response.length > 0) {
            return response; // Devuelve las criptomonedas obtenidas
        } else {
            console.log("No se encontraron divisas en la base de datos.");
            return []; // Devuelve un array vacío si no se encontraron criptomonedas
        }
    } catch (error) {
        console.error("Error al obtener las divisas de la base de datos:", error);
        return null; // Devuelve null en caso de error
    }
}


document.addEventListener("DOMContentLoaded", async function () {
    // Añadir criptos del top 30 en caso de que no esten en la base de datos
    await agregarCriptosBBDD();

    // Añadir criptos y divisas a la select
    let selectCriptos = document.getElementById("criptomoneda");
    let selectDivisas = document.getElementById("moneda");
    let criptos = await obtenerCriptosBBDD();
    let divisas = await obtenerDivisasBBDD();
    agregarCriptosYDivisasSelect(criptos, divisas);
    modificarEstadisticas();
    selectCriptos.addEventListener("change", cambiarCriptoSelect);
    selectDivisas.addEventListener("change", function() {
        modificarEstadisticas();
    });
});