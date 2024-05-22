document.addEventListener("DOMContentLoaded", function() {
    // Modificar menu si el usuario esta logeado
    let logeado = localStorage.getItem("logeado");
    let menuAuth = document.querySelector(".autenticacion");
    if (logeado !== null) {
        if (logeado === "yes") {
            let usuario = localStorage.getItem("usuario");
            menuAuth.innerHTML = "<div class='usuario'><p>" + usuario + "</p></div><div class='usuarioInfo noVisible'><button class='cerrarSesion'>Cerrar Sesión</button></div>";
        }
    } 

    // Mostrar opciones de autenticación
    if (menuAuth.classList.contains("noVisible")) {
        menuAuth.classList.remove("noVisible");
    }

    // Mostrar info usuario al pasar el raton por encima del correo del usuario
    let correoP = document.querySelector(".usuario p");
    let uInfo = document.querySelector(".usuarioInfo");
    correoP.addEventListener("mouseenter", function() {
        if (uInfo.classList.contains("noVisible")) {
            uInfo.classList.remove("noVisible");
        }
    });

    // Dejar de mostrar la info 
    menuAuth.addEventListener("mouseleave", function() {
        if (!uInfo.classList.contains("noVisible")) {
            uInfo.classList.add("noVisible");
        }
    });

    // Evento cerrar sesión
    let cerrarSesionBtn = document.querySelector(".cerrarSesion");
    cerrarSesionBtn.addEventListener("click", function() {
        localStorage.removeItem("usuario");
        localStorage.removeItem("logeado");
        location.reload();
    });
});