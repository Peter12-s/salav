// Datos de candidatos
var candidatosData = [
    { nombre: "Candidato A", info: "Especialista en Cardiología. 5 años de experiencia." },
    { nombre: "Candidato B", info: "Técnico de laboratorio con certificación ISO 9001." },
    //     { nombre: "Candidato C", info: "Enfermero con experiencia en urgencias hospitalarias." },
    //     { nombre: "Candidato D", info: "Radiólogo con más de 10 años de trayectoria." },
    //     { nombre: "Candidato E", info: "Especialista en análisis clínicos." },
    //     { nombre: "Candidato F", info: "Auxiliar médico en oncología." }
];
const listaCandidatos = document.getElementById("listaCandidatos");
const acciones = document.querySelector(".acciones");
const notaCandidatos = document.querySelector(".notaCandidatos");
const tooltip = document.getElementById("tooltip");

let seleccionado = null;
let tooltipTimeout;

document.addEventListener("DOMContentLoaded", () => {
    // Renderizar candidatos
    function renderCandidatos() {
        if (candidatosData.length > 0) {
            candidatosData.forEach(c => {
                const div = document.createElement("div");
                div.className = "candidato";
                div.setAttribute("data-info", c.info);
                div.textContent = c.nombre;
                listaCandidatos.appendChild(div);
            });
            acciones.hidden = false; // Muestra el elemento
            notaCandidatos.textContent = "";
        } else {
            acciones.hidden = true; // Oculta el elemento
            notaCandidatos.textContent = "No hay solicitudes de candidatos";
        }
        addCandidatoListeners();
    }

    // Añadir listeners a los candidatos
    function addCandidatoListeners() {
        const candidatos = document.querySelectorAll(".candidato");
        candidatos.forEach(candidato => {
            candidato.addEventListener("click", () => {
                clearTimeout(tooltipTimeout);
                const info = candidato.getAttribute("data-info");
                tooltip.textContent = info;
                tooltip.classList.add("visible");
                candidatos.forEach(c => c.classList.remove("seleccionado"));
                candidato.classList.add("seleccionado");
                seleccionado = candidato;
                tooltipTimeout = setTimeout(() => {
                    tooltip.classList.remove("visible");
                }, 1200);
            });
        });
    }

    // Animación y eliminación de candidato
    function animacion() {
        if (!seleccionado) return;
        seleccionado.classList.add("eliminando");
        tooltip.classList.remove("visible");
        seleccionado.addEventListener("animationend", () => {
            seleccionado.remove();
            seleccionado = null;
            validarCandidatos();
        });
    }

    // Validar si hay candidatos después de eliminar
    function validarCandidatos() {
        if (candidatosData.length === 0) {
            // Para ocultarlo

            notaCandidatos.textContent = "No hay solicitudes de candidatos";
        }
    }
    function elimiarCandidato() {
        if (seleccionado) {
            const nombreCandidato = seleccionado.textContent.trim();
            candidatosData = candidatosData.filter(c => c.nombre !== nombreCandidato);
        }
    }
    // Funciones globales para botones
    window.aceptar = function () {
        animacion();
        elimiarCandidato();
        validarCandidatos();
    };
    window.rechazar = function () {
        animacion();
        elimiarCandidato();
        validarCandidatos();
    };
    // Inicializar
    renderCandidatos();
});