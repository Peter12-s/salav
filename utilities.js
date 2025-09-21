// Variables modal
const modalAlert = document.getElementById("modalAlert");
const modalMensaje = document.getElementById("modal-contenido");

/**
 * Muestra un mensaje en el modal de alerta durante un tiempo.
 * @param {string} mensaje - Texto a mostrar en el modal.
 * @param {number} duracion - Tiempo en ms antes de ocultar (default: 1000).
 */
function mostrarModalMensaje(mensaje, duracion = 1000) {
    modalMensaje.innerHTML = mensaje;
    modalAlert.style.display = "flex";

    setTimeout(() => {
        modalAlert.style.display = "none";
    }, duracion);
}


// 📌 Ajustar usuarios por página al cambiar tamaño de pantalla
window.addEventListener("resize", () => {
    const newLimit = getUsersPerPage();
    if (newLimit !== usersPerPage) {
        usersPerPage = newLimit;
        currentPage = 1;
        renderSolicitudes();
    }
});

// ObtenerLocal storage
let token;
let userId;
let user_type;

function obtenerLocalStorage() {
    token = localStorage.getItem("access_token");
    userId = localStorage.getItem("user_id");
    user_type = localStorage.getItem("user_type");
}


let applicants = [];
let filteredUsuarios = [];
let freelancers = [];
let currentPage = 1;

let prevBtn;
let nextBtn;
let pageInfo;
let pageInput;
let goPageBtn;
let tbody;
let tablaUsuarios;



let usersPerPage = getUsersPerPage();

function eventosPaginacion() {
    // 📌 Eventos de paginación
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderSolicitudes();
        }
    });

    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderSolicitudes();
        }
    });

    goPageBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);
        let page = parseInt(pageInput.value);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            renderSolicitudes();
        } else {
            alert(`⚠️ Ingresa un número entre 1 y ${totalPages}`);
        }
    });
}