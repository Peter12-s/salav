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

function mostrarModalMensajeForm(mensaje, duracion = 3000) {
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
let usuarios = [];
let freelancers = [];
let currentPage = 1;

let prevBtn;
let nextBtn;
let pageInfo;
let pageInput;
let goPageBtn;
let tbody;
let tablaUsuarios;
let userTable;

let totalPagesSpan ;
let tabla;
let searchInput;



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
            mostrarModalMensaje(`⚠️ Ingresa un número entre 1 y ${totalPages}`);
        }
    });
}

function actualizarPaginacion(){
      // 📌 Actualizar paginación
    pageInput.min = 1;
    pageInput.max = totalPages;
     // 🔹 Calcula total de páginas
    const totalPagesCalc = Math.ceil(filteredUsuarios.length / usersPerPage) || 1;

    // 🔹 Actualiza info en ambos lugares
    pageInfo.textContent = `Página ${currentPage} de ${totalPagesCalc}`;
    document.getElementById("totalPages").textContent = totalPagesCalc;
    pageInput.value = currentPage;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPagesCalc;
}

