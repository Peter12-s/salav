let candidatosData = [];
let seleccionado = null;
let tooltipTimeout;

document.addEventListener("DOMContentLoaded", () => {
    obtenerLocalStorage();
    // Contenedores y botones
    const listaCandidatos = document.getElementById("listaCandidatos");
    const acciones = document.querySelector(".acciones");
    const tooltip = document.getElementById("tooltip");
    const btnAceptar = document.querySelector(".btn-aceptar");
    const btnRechazar = document.querySelector(".btn-rechazar");
    searchInput = document.querySelector("#searchInput");

    // Inicializamos botones y ocultamos acciones
    acciones.hidden = true;
    btnAceptar.disabled = true;
    btnRechazar.disabled = true;

    // Obtener datos del backend
    async function fetchFormRequest() {
        try {
            const res = await axios.get(`${API_URL}form-request`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { accepted: false }
            });

            candidatosData = res.data;
            renderSolicitudes();
        } catch (error) {
            console.error("Error al obtener solicitudes:", error.response?.data || error);
            listaCandidatos.textContent = "Error al cargar candidatos";
        }
    }

    fetchFormRequest();

    // Función para pintar los candidatos
    function renderSolicitudes() {
        listaCandidatos.innerHTML = "";

        if (candidatosData.length === 0) {
            listaCandidatos.textContent = "No hay solicitudes de candidatos";
            acciones.hidden = true;
            return;
        }

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

                // Habilitar botones
                btnAceptar.disabled = false;
                btnRechazar.disabled = false;

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

    // Validar si hay candidatos
    function validarCandidatos() {
        if (candidatosData.length === 0) {
            acciones.hidden = true;
            listaCandidatos.textContent = "No hay solicitudes de candidatos";
        } else {
            renderSolicitudes();
        }
    }

    // Eliminar candidato del array
    function eliminarCandidato() {
        if (seleccionado) {
            const idCandidato = seleccionado.getAttribute("data-id");
            candidatosData = candidatosData.filter(c => c._id !== idCandidato);
        }
    }

    // Aceptar candidato
    window.aceptar = async function () {
        if (!seleccionado) {
            mostrarModalMensaje("⚠️ Selecciona un candidato primero");
            return;
        }

        const solicitudId = seleccionado.getAttribute("data-id");

        try {
            await axios.patch(`${API_URL}form-request/${solicitudId}`, {
                accepted: true,
                freelance_id: userId,
            }, { headers: { Authorization: `Bearer ${token}` } });

            mostrarModalMensaje("✅ Solicitud aceptada correctamente");
            searchInput.value = ""; // ✅ limpiar el input

            animacion();
            eliminarCandidato();
            validarCandidatos();

        } catch (err) {
            console.error(err);
            mostrarModalMensaje("❌ Error al aceptar la solicitud");
        }
    };

    // Rechazar candidato
    window.rechazar = async function () {
        if (!seleccionado) {
            mostrarModalMensaje("⚠️ Selecciona un candidato primero");
            return;
        }

        const solicitudId = seleccionado.getAttribute("data-id");

        try {
            await axios.patch(`${API_URL}form-request/${solicitudId}`, {
                freelance_id: null,
                accepted: false
            }, { headers: { Authorization: `Bearer ${token}` } });

            mostrarModalMensaje("❌ Solicitud rechazada, regresó a la caja de SALAV");

            animacion();
            eliminarCandidato();
            validarCandidatos();

        } catch (err) {
            console.error(err);
            mostrarModalMensaje("⚠️ Error al rechazar la solicitud");
        }
    };

});
