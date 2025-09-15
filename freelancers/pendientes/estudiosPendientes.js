var candidatosData = [];

  const token = localStorage.getItem("access_token"); // o de donde lo estés guardando
async function fetchFormRequest() {
    try {
      
        const freelanceId = localStorage.getItem("user_id"); // 👈 el id del freelancer

        const res = await axios.get("http://localhost:8080/api/form-request", {
            headers: {
                Authorization: `Bearer ${token}` // ✅ enviamos token
            },
            params: {
                freelance_id: freelanceId, // ✅ enviamos parámetro
                accepted:false // ✅ solo pendientes
            }
        });

        // console.log("Solicitudes:", res.data);
        candidatosData = res.data; // Guardar los datos obtenidos
        renderCandidatos();
        return res.data;

    } catch (error) {
        console.error("Error al obtener solicitudes:", error.response?.data || error);
    }
}
fetchFormRequest();


const listaCandidatos = document.getElementById("listaCandidatos");
const acciones = document.querySelector(".acciones");
const notaCandidatos = document.querySelector(".notaCandidatos");
const tooltip = document.getElementById("tooltip");

let seleccionado = null;
let tooltipTimeout;


// Renderizar candidatos
function renderCandidatos() {
    if (candidatosData.length > 0) {
        candidatosData.forEach(c => {
            const div = document.createElement("div");
            div.className = "candidato";
            div.setAttribute("data-id", c._id); // 👈 guardamos el id de la solicitud
            div.setAttribute(
                "data-info",
                `• ${c.applicant.person.town}\n• ${c.applicant.person.state}\n• ${c.applicant.person.settlement}`
            ); div.textContent = c.applicant.person.name;
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



window.aceptar = async function () {
    if (!seleccionado) {
        alert("⚠️ Selecciona un candidato primero");
        return;
    }

    const solicitudId = seleccionado.getAttribute("data-id"); // 👈 id de la solicitud
    try {
        await axios.patch(
            `http://localhost:8080/api/form-request/${solicitudId}`,
            { accepted: true },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("✅ Solicitud aceptada correctamente");

        // Animación + eliminación
        animacion();
        elimiarCandidato();
        validarCandidatos();

    } catch (err) {
        console.error(err);
        alert("❌ Error al aceptar la solicitud");
    }
};

window.rechazar = async function () {
    if (!seleccionado) {
        alert("⚠️ Selecciona un candidato primero");
        return;
    }

    const solicitudId = seleccionado.getAttribute("data-id");

    try {
        // 🔹 Hacemos el PATCH al backend
        await axios.patch(
            `http://localhost:8080/api/form-request/${solicitudId}`,
            {
                freelance_id: null, // 👈 liberamos al freelancer
                accepted: false     // 👈 lo pasamos a pendiente
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        alert("❌ Solicitud rechazada, regresó a la caja de SALAV");

        // 🔹 Animaciones y eliminación en UI
        animacion();
        elimiarCandidato();
        validarCandidatos();

    } catch (err) {
        console.error(err);
        alert("⚠️ Error al rechazar la solicitud");
    }
};
