document.addEventListener('DOMContentLoaded', function () {
    let estadoSesion = localStorage.getItem("logeado");
    let contenido = document.querySelector(".contenido");

    if (estadoSesion !== "yes") {
        // Mostrar contenido
        if (contenido.classList.contains("noVisible")) {
            contenido.classList.remove("noVisible");
        }

        // Obtener el formulario de registro de clientes
        const formularioRegistro = document.getElementById('formularioRegistro');

        // Obtener todos los campos de entrada
        const camposEntrada = document.querySelectorAll('input[type="text"], input[type="password"], input[type="date"], input[type="checkbox"]');

        // Agregar eventos input y blur para validar los campos mientras se escribe o al salir del campo
        camposEntrada.forEach(function (campo) {

            /* campo.addEventListener('blur', function() {
                 this.style.border = ""; 
             });*/

            campo.addEventListener('input', function () {
                validarCampo(this);
            });

            campo.addEventListener('blur', function () {
                validarCampo(this);
            });
        });

        // Función para validar un campo y mostrar el mensaje de error si es necesario
        function validarCampo(campo) {
            const valor = campo.value.trim();
            const campoError = campo.nextElementSibling;
            const nombreCampo = campo.getAttribute('id');
            let password = document.getElementById("password");
            let passwordConfirm = document.getElementById("passwordConfirm");


            switch (nombreCampo) {
                case 'nombre':
                    validarCampoGenerico(campo, valor, validarNombre, "El nombre debe contener solo letras y espacios, y al menos un nombre.");
                    break;
                case 'apellidos':
                    validarCampoGenerico(campo, valor, validarApellidos, "Los apellidos deben contener solo letras y espacios.");
                    break;
                case 'correo':
                    validarCampoGenerico(campo, valor, validarCorreo, "El correo electrónico no es válido.");
                    if (validarCorreo(valor) === true) {
                        validarCampoGenerico(campo, valor, verificarCorreoExistente, "El correo electrónico ya esta registrado.");
                    }
                    break;
                case 'password':
                    validarCampoGenerico(password, password.value, validarContrasena, "La contraseña no cumple con el formato específicado: Mínimo 8 carácteres y contener al menos 1 número, mayúscula, minúscula y símbolo");
                    validarCampoGenerico(passwordConfirm, passwordConfirm.value, validarConfirmacionContrasena, "Las contraseñas no coinciden");
                    break;
                case 'passwordConfirm':
                    validarCampoGenerico(password, password.value, validarContrasena, "La contraseña no cumple con el formato específicado: Mínimo 8 carácteres y contener al menos 1 número, mayúscula, minúscula y símbolo");
                    validarCampoGenerico(passwordConfirm, passwordConfirm.value, validarConfirmacionContrasena, "Las contraseñas no coinciden");
                    break;
                default:
                    break;
            }
        }

        // Función genérica para validar un campo con una función de validación específica
        async function validarCampoGenerico(campo, valor, validacion, mensajeError) {
            const campoError = campo.nextElementSibling;
            if (!await validacion(valor)) {
                campo.style.border = "2px solid red";
                campoError.classList.remove('noVisible');
                campoError.classList.add('visible');
                campoError.textContent = mensajeError;
            } else {
                campo.style.border = "2px solid green";
                campoError.classList.remove('visible');
                campoError.classList.add('noVisible');
                campoError.textContent = "";
            }
        }

        // Función para validar el nombre
        function validarNombre(nombre) {
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+(?: [a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+)?$/;
            return regex.test(nombre);
        }

        // Función para validar los apellidos
        function validarApellidos(apellidos) {
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+(?: [a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+)?$/;
            return regex.test(apellidos);
        }

        // Función para validar el correo electrónico
        function validarCorreo(correo) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(correo);
        }

        // Funciones para validar la contraseña y la confirmación
        function validarContrasena(password) {
            // Verificar la fortaleza de la contraseña
            const fortaleza = calcularFortalezaContrasena(password);
            if (fortaleza !== "Fuerte") {
                return false;
            }

            return true; // La contraseña es válida
        }

        function validarConfirmacionContrasena(passwordConfirmar) {
            let password = document.getElementById("password").value;

            // Verificar si las contraseñas coinciden
            if (password !== passwordConfirmar) {
                return false;
            }

            return true; // La contraseña es válida
        }

        // Función para evaluar la fortaleza de la contraseña
        function calcularFortalezaContrasena(password) {
            const longitudMinima = 8;
            const tieneMayusculas = /[A-Z]/.test(password);
            const tieneMinusculas = /[a-z]/.test(password);
            const tieneNumeros = /\d/.test(password);
            const tieneCaracteresEspeciales = /[^A-Za-z0-9]/.test(password);

            // Calcular la puntuación basada en los criterios
            let puntuacion = 0;
            if (password.length >= longitudMinima) {
                puntuacion++;
            }
            if (tieneMayusculas) {
                puntuacion++;
            }
            if (tieneMinusculas) {
                puntuacion++;
            }
            if (tieneNumeros) {
                puntuacion++;
            }
            if (tieneCaracteresEspeciales) {
                puntuacion++;
            }

            // Devolver la fortaleza basada en la puntuación
            if (puntuacion < 3) {
                return "Débil";
            } else if (puntuacion < 5) {
                return "Media";
            } else {
                return "Fuerte";
            }
        }

        // Función para validar las contraseñas
        function validarContrasenas() {
            const password = document.getElementById('password');
            const passwordConfirmar = document.getElementById('passwordConfirm');
            const campoErrorPassword = password.nextElementSibling;
            const campoErrorConfirmar = passwordConfirmar.nextElementSibling;

            const resultado = validarContrasena(password.value, passwordConfirmar.value);
            if (resultado !== true) {
                password.style.border = "2px solid red";
                campoErrorPassword.classList.remove('noVisible');
                campoErrorPassword.classList.add('visible');
                campoErrorPassword.textContent = resultado;

                passwordConfirmar.style.border = "2px solid red";
                campoErrorConfirmar.classList.remove('noVisible');
                campoErrorConfirmar.classList.add('visible');
                campoErrorConfirmar.textContent = resultado;
            } else {
                password.style.border = "2px solid green";
                campoErrorPassword.classList.remove('visible');
                campoErrorPassword.classList.add('noVisible');
                campoErrorPassword.textContent = "";

                passwordConfirmar.style.border = "2px solid green";
                campoErrorConfirmar.classList.remove('visible');
                campoErrorConfirmar.classList.add('noVisible');
                campoErrorConfirmar.textContent = "";
            }
        }

        //Enviar formulario
        formularioRegistro.addEventListener('submit', function (event) {
            // Obtener todos los campos del formulario
            const camposEntrada = document.querySelectorAll('input[type="text"], input[type="password"]');

            // Validar todos los campos
            camposEntrada.forEach(function (campo) {
                validarCampo(campo);
            });

            // Si hay errores, detener el envío del formulario y mostrar los mensajes de error
            if (document.querySelectorAll('.visible').length > 0) {
                event.preventDefault(); // Detener el envío del formulario
            }
            else {
                event.preventDefault(); // Detener el envío del formulario
                // Obtener los valores del formulario
                let respuestaNombre = document.getElementById("nombre").value;
                let respuestaApellidos = document.getElementById("apellidos").value;
                let respuestaCorreo = document.getElementById("correo").value;
                let respuestaPassword = document.getElementById("password").value;

                // Crear objeto para mandar al php en formato JSON
                let usuario = {
                    "Nombre": respuestaNombre,
                    "Apellidos": respuestaApellidos,
                    "Correo": respuestaCorreo,
                    "Password": respuestaPassword
                }

                // Registrar usuario
                registrarUsuario(usuario);
            }
        });
    }

    else {
        window.location.replace("comprar.html");
    }

});


// Función para validar si un correo existe en la BBDD
async function verificarCorreoExistente(correo) {
    try {
        const response = await $.ajax({
            url: "backend/verifyEmailExists.php",
            type: "POST",
            data: JSON.stringify({ correo: correo }), // Convertir a JSON
            dataType: "json",
            contentType: "application/json"
        });

        let existencia = !response.exists;

        // Retornar el resultado de la verificación
        return existencia;
    } catch (error) {
        console.error("Error verificando el correo:", error);
        return false;
    }
}




// Función para mandar la peticion para registrar usuarios
async function registrarUsuario(usuario) {
    try {
        const jsonData = JSON.stringify(usuario);

        const response = await $.ajax({
            url: "backend/addUser.php",
            type: "POST",
            data: jsonData, // Convertir a JSON
            dataType: "json",
            contentType: "application/json"
        });

        if (response.success) {
            localStorage.setItem("logeado", "yes");
            localStorage.setItem("usuario", usuario.Correo);
            location.replace("comprar.html");
        } else {
            alert("Ha ocurrido un error al intentar agregar el usuario.")
        }
    } catch (error) {
        alert("Ha habido un error: " + error);
    }
}