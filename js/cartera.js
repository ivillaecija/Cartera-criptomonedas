// Clave de la API de Exchange Rate
const exchangeRateApiKey = 'ab893a0f4d2c8529bf5c3a6e';

// Clave de la API de cryptocompare
var apikey = (function () {
    var apikey = "38f6fe89b061754d4a174474fd82af2a8c6ba01758f0c28c4309ec53c8588696";

    return {
        obtenerApiKey: function () {
            return apikey;
        }
    };
})();

document.addEventListener("DOMContentLoaded", async function () {
    // Contenedor donde irán las criptos
    let contenedor = document.querySelector(".cartera");
    let contenedorMovil = document.querySelector(".carteraMovil");

    // Comprobar si el usuario está logeado
    let usuario = localStorage.getItem("logeado");

    if (usuario !== "yes") {
        contenedor.innerHTML = "<p>Inicia sesión para poder ver tu cartera.</p>";
        contenedorMovil.innerHTML = "<p>Inicia sesión para poder ver tu cartera.</p>";
        let selectDivisa = document.querySelector(".divisa");
        selectDivisa.parentNode.removeChild(selectDivisa);
        return;
    }

    // Obtener la cartera del usuario y las criptos
    let cartera = await getWallet();

    // Añadir coins al HTML
    if (cartera !== null) {
        // Contenedor
        contenedor.innerHTML = "<div class='criptoHeader'><p>Criptomoneda</p><p>Cantidad</p><p>Equivalente</p><p>Total Invertido</p></div>";
        cartera.forEach(coin => {
            let coinHTML = "";
            coinHTML += "<div class='cripto' id='" + coin.Internal + "'>";
            coinHTML += "<div><img src='" + coin.ImageUrl + "' alt='cripto imagen'/><h4>" + coin.CoinFullName + "</h4></div>";
            coinHTML += "<div><p>" + coin.Quantity + " " + coin.Internal + "</p></div>";
            coinHTML += "<div><p class='equivalente'></p></div><div><p></p></div></div>";
            contenedor.innerHTML += coinHTML;
        });


        // Contenedor Movil
        cartera.forEach(coin => {
            let coinHTML = "";
            coinHTML += "<div class='criptoMovil' id='" + coin.Internal + "'>";
            coinHTML += "<div class='stat'><div>Criptomoneda</div><div><img src='" + coin.ImageUrl + "' alt='cripto imagen'/><h4>" + coin.CoinFullName + "</h4></div></div>";
            coinHTML += "<div class='stat'><div>Cantidad</div><div><p>" + coin.Quantity + " " + coin.Internal + "</p></div></div>";
            coinHTML += "<div class='stat'><div>Equivalente</div><div><p class='equivalente'></p></div></div>";
            coinHTML += "<div class='stat'><div>Total Invertido</div><div><p></p></div></div>";
            coinHTML += "</div>";
            contenedorMovil.innerHTML += coinHTML;
        });


        let divisas = await obtenerDivisasBBDD();
        agregarDivisasSelect(divisas);

        // Al cargar el DOM, actualizar la cartera con la divisa seleccionada
        const selectDivisa = document.getElementById("criptoCartera");
        selectDivisa.addEventListener("change", async function () {
            const divisaSeleccionada = this.value;
            await actualizarCartera(divisaSeleccionada);
        });

        // Obtener la divisa seleccionada al cargar el DOM
        const divisaInicial = selectDivisa.value;
        actualizarCartera(divisaInicial);

        // Actualizar cartera cada 30 segundos
        setInterval(async () => {
            const divisa = document.getElementById("criptoCartera").value;
            await actualizarCartera(divisa);
        }, 30000); 
        
    }
});

// Función para obtener la cartera de un usuario
async function getWallet() {
    try {
        // Obtener el usuario del localStorage
        const usuario = localStorage.getItem("usuario");

        // Realizar la solicitud al servidor para obtener la cartera del usuario
        const response = await fetch("backend/getWallet.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Error al obtener la cartera del usuario.");
            return null;
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return null;
    }
}

// Función para obtener las criptos de la bbdd
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

// Función para agregar las divisas a la select
function agregarDivisasSelect(divisas) {
    let selectDivisas = document.getElementById("criptoCartera");

    if (divisas && divisas !== null) {
        if (divisas.length > 0) {
            for (i = 0; i < divisas.length; i++) {
                let divisa = divisas[i];
                selectDivisas.innerHTML += "<option value='" + divisa.Code + "'>" + divisa.CurrencyName + "</option>";
            }
        }
    }

    // Event listener para el cambio de divisa
    selectDivisas.addEventListener("change", async function () {
        const divisaSeleccionada = this.value;
        await actualizarCartera(divisaSeleccionada);
    });
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
            return response; // Devuelve las divisas obtenidas
        } else {
            console.log("No se encontraron divisas en la base de datos.");
            return []; // Devuelve un array vacío si no se encontraron divisas
        }
    } catch (error) {
        console.error("Error al obtener las divisas de la base de datos:", error);
        return null; // Devuelve null en caso de error
    }
}

// Función para obtener el precio de una criptomoneda con una divisa
async function obtenerPrecioCripto(cripto, divisa) {
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${cripto}&tsyms=${divisa}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[divisa];
    } catch (error) {
        console.error('Error al obtener el precio:', error);
        return "no se encontraron datos";
    }
}

// Función para actualizar los datos de la tabla con la divisa y valor de la criptomoneda actual
async function actualizarCartera(divisa) {
    const criptos = document.querySelectorAll(".cripto, .criptoMovil");

    const actualizarCripto = async (cripto) => {
        const internal = cripto.id;
        const cantidadCripto = parseFloat(cripto.querySelector("p").textContent);

        const precioCriptoDivisa = await obtenerPrecioCripto(internal, divisa);
        const equivalenteDivisa = cantidadCripto * precioCriptoDivisa;

        const equivalentes = cripto.querySelectorAll(".equivalente");
        equivalentes.forEach((equivalente) => {
            equivalente.textContent = `${equivalenteDivisa.toFixed(2)} ${divisa}`;
        });

        await actualizarTotalInvertido(internal);
    };

    await Promise.all(Array.from(criptos).map(actualizarCripto));
}

// Función para obtener las compras de un usuario en una cripto
async function obtenerComprasCripto(usuario, cripto) {
    try {
        // Objeto con los datos a enviar al backend
        const data = {
            usuario: usuario,
            cripto: cripto
        };

        // Realizar la solicitud HTTP POST al script PHP
        const response = await fetch('backend/getCriptoPurchases.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Verificar si la respuesta es exitosa
        if (response.ok) {
            // Extraer y devolver los datos de las compras en formato JSON
            return await response.json();
        } else {
            // Manejar el caso de respuesta no exitosa
            throw new Error('Error al obtener las compras de la criptomoneda');
        }
    } catch (error) {
        // Manejar errores
        console.error('Error:', error);
        throw error;
    }
}


// Función para actualizar el total invertido
async function actualizarTotalInvertido(cripto) {
    let usuario = localStorage.getItem("usuario");
    let compras = await obtenerComprasCripto(usuario, cripto);
    let divisa = document.getElementById("criptoCartera").value;
    let cantidadCompra;


    if (compras !== null) {
        if (compras.length > 0) {
            let cantidad = 0;
            for (let i = 0; i < compras.length; i++) {
                let compra = compras[i];
                cantidadCompra = await convertirDivisa(compra.Code, divisa, compra.CurrencyQuantity);
                cantidad += cantidadCompra;
            }

            cantidad = cantidad.toFixed(2);

            let selector1 = ".cartera #" + cripto + " > div:last-child p";
            let selector2 = ".carteraMovil #" + cripto + " > div:last-child p";

            document.querySelector(selector1).textContent = cantidad + " " + divisa;
            document.querySelector(selector2).textContent = cantidad + " " + divisa;
        }
    }

}


// Función para obtener la tasa de cambio entre dos divisas
async function obtenerTasaCambio(fromCurrency, toCurrency) {
    const url = `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/pair/${fromCurrency}/${toCurrency}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.result === 'success') {
            return data.conversion_rate;
        } else {
            throw new Error('Error al obtener la tasa de cambio');
        }
    } catch (error) {
        console.error('Error al obtener la tasa de cambio:', error);
        return null;
    }
}

// Función para convertir la cantidad de una divisa a otra
async function convertirDivisa(fromCurrency, toCurrency, amount) {
    const tasaCambio = await obtenerTasaCambio(fromCurrency, toCurrency);
    if (tasaCambio) {
        return amount * tasaCambio;
    } else {
        return null;
    }
}