var candidatosData = [];
let seleccionado = null;
let tooltipTimeout;

document.addEventListener("DOMContentLoaded", () => {

    obtenerLocalStorage();
    var listaCandidatos = document.getElementById("listaCandidatos");
    var acciones = document.querySelector(".acciones");
    var notaCandidatos = document.getElementById("listaCandidatos");
    var tooltip = document.getElementById("tooltip");
  var btnAceptar = document.querySelector(".btn-aceptar");
var btnRechazar = document.querySelector(".btn-rechazar");

    async function fetchFormRequest() {
        try {
            const res = await axios.get(`${API_URL}form-request`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { accepted: false }
            });

            candidatosData = res.data;
            renderSolicitudes();
            return res.data;
        } catch (error) {
            console.error("Error al obtener solicitudes:", error.response?.data || error);
        }
    }

    (async () => {
        await fetchFormRequest();
    })();

    // 👇 renderSolicitudes necesita acceso a botones → muévela aquí
    function renderSolicitudes() {
        listaCandidatos.innerHTML = "";

        if (candidatosData.length > 0) {
            candidatosData.forEach(c => {
                const div = document.createElement("div");
                div.className = "candidato";
                div.setAttribute("data-id", c._id);
                div.setAttribute("data-info", `• ${c.applicant.person.town}\n• ${c.applicant.person.state}\n• ${c.applicant.person.settlement}`);
                div.textContent = c.applicant.person.name;
                listaCandidatos.appendChild(div);
            });

            acciones.hidden = false;
            btnAceptar.disabled = true;
            btnRechazar.disabled = true;
            notaCandidatos.textContent = "";
        } else {
            acciones.hidden = false;
            btnAceptar.disabled = true;
            btnRechazar.disabled = true;
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

            // ✅ Habilitar botones al seleccionar un candidato
            btnAceptar.disabled = false;
            btnRechazar.disabled = false;

            tooltipTimeout = setTimeout(() => {
                tooltip.classList.remove("visible");
            }, 1200);
        });
    });
}
});



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
        acciones.hidden = true;
        notaCandidatos.textContent = "No hay solicitudes de candidatos";
    } else {
        renderSolicitudes(); // 👈 vuelve a pintar lista actualizada
    }
}
function eliminarCandidato() {
    if (seleccionado) {
        const idCandidato = seleccionado.getAttribute("data-id");
        candidatosData = candidatosData.filter(c => c._id !== idCandidato);
    }
}


window.aceptar = async function () {
    if (!seleccionado) {
        mostrarModalMensaje("⚠️ Selecciona un candidato primero");
        return;
    }

    const solicitudId = seleccionado.getAttribute("data-id"); // 👈 id de la solicitud
    try {
        await axios.patch(`${API_URL}form-request/${solicitudId}`,
            {
                accepted: true,
                freelance_id: userId,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        mostrarModalMensaje("✅ Solicitud aceptada correctamente");

        // Animación + eliminación
        animacion();
        elimiarCandidato();
        validarCandidatos();

    } catch (err) {
        console.error(err);
        mostrarModalMensaje("❌ Error al aceptar la solicitud");
    }
};

window.rechazar = async function () {
    if (!seleccionado) {
        mostrarModalMensaje("⚠️ Selecciona un candidato primero");
        return;
    }

    const solicitudId = seleccionado.getAttribute("data-id");

    try {
        // 🔹 Hacemos el PATCH al backend
        await axios.patch(`${API_URL}form-request/${solicitudId}`,
            {
                freelance_id: null, // 👈 liberamos al freelancer
                accepted: false     // 👈 lo pasamos a pendiente
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        mostrarModalMensaje("❌ Solicitud rechazada, regresó a la caja de SALAV");

        // 🔹 Animaciones y eliminación en UI
        animacion();
        eliminarCandidato();
        validarCandidatos();

    } catch (err) {
        // console.error(err);
        mostrarModalMensaje("⚠️ Error al rechazar la solicitud");
    }
};
