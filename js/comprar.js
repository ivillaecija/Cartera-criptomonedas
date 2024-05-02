var apikey = (function() {
    var apikey = "38f6fe89b061754d4a174474fd82af2a8c6ba01758f0c28c4309ec53c8588696";
    
    return {
        obtenerApiKey: function() {
            return apikey;
        }
    };
})();


// Función para obtener las criptomonedas
async function obtenerCriptos() {
    try {
        const apiKey = apikey.obtenerApiKey();
        const response = await $.ajax({
            url: "https://min-api.cryptocompare.com/data/blockchain/list",
            headers: {
                "Authorization": `Apikey ${apiKey}`
            },
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        });

        return response;
    } catch (error) {
        console.error("Ha habido un error:", error);
        return null; // Devolver un valor nulo en caso de error
    } 
}



document.addEventListener("DOMContentLoaded", async function() {
    let criptos = await obtenerCriptos();
});