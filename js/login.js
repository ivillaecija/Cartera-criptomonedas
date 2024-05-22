document.addEventListener('DOMContentLoaded', function() {
    let estadoSesion = localStorage.getItem("logeado");
    let contenido = document.querySelector(".contenido");

    if (estadoSesion !== "yes") {
        // Mostrar contenido
        if (contenido.classList.contains("noVisible")) {
            contenido.classList.remove("noVisible");
        }
    
        // Obtener el formulario de inicio de sesión
        const formularioLogin = document.getElementById('formularioLogin');
        // Obtener los campos de entrada
        const correoInput = document.getElementById('correo');
        const passwordInput = document.getElementById('password');
        const campoError = document.querySelector('.campoError');

        // Agregar evento de escucha para el envío del formulario
        formularioLogin.addEventListener('submit', async function(event) {
            // Evitar el envío del formulario por defecto
            event.preventDefault();

            // Obtener los valores de correo y contraseña
            const correo = correoInput.value.trim();
            const password = passwordInput.value.trim();

            // Validar si las credenciales son correctas
            let validacion = await validarLogin(correo, password);

            // Verificar si el usuario existe y la contraseña es correcta
            if (validacion === true) {
                // Guardar estado de la sesión
                localStorage.setItem("logeado", "yes");

                // Guardar usuario actual
                localStorage.setItem("usuario", correo);

                window.location.replace("comprar.html");
            } else {
                // Mostrar mensaje de error y resaltar los campos
                campoError.textContent = "Credenciales incorrectas";
                campoError.classList.remove('noVisible');
                campoError.classList.add('visible');
            }
        });
    }
    else {
        window.location.replace("comprar.html");
    }
});


// Función para validar el inicio de sesión
async function validarLogin(correo, password) {
    try {
        const response = await $.ajax({
            url: "backend/validateLogin.php",
            type: "POST",
            data: JSON.stringify({ correo: correo, password: password }), // Convertir a JSON
            dataType: "json",
            contentType: "application/json"
        });

        // Retornar el resultado de la validación
        return response.success;
    } catch (error) {
        console.error("Error validando el login:", error);
        return false;
    }
}
