const etapas = [
    { key: "application_accepted", label: "Solicitud aceptada" },
    { key: "candidate_contacted", label: "Candidato contactado" },
    { key: "visit_scheduled", label: "Visita agendada" },
    { key: "background_check", label: "Background check" },
    { key: "visit_complete", label: "Visita realizada" },
    { key: "documenting_information", label: "Documentando información" },
    { key: "evaluation_complete", label: "Evaluación finalizada" }
];



const etapasConAccion = [
    "background_check"
];

document.addEventListener("DOMContentLoaded", () => {
    obtenerLocalStorage();

    async function fetchUserProgress() {
        try {
            const res = await axios.get(`${API_URL}user-progress`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId: userId },
            });
            usuarios = res.data;
            filteredUsuarios = [...usuarios];
            mostrarModalMensaje("Petición realizada. ✅");
            renderSolicitudes();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                mostrarModalMensaje("Sesión expirada. Inicia sesión de nuevo. ❌");
                // errorServer();
            } else {
                if (token) {
                    mostrarModalMensaje("Error al obtener el progreso de usuarios. ❌");
                    // errorServer();
                }
            }
        }
    }



    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");
    pageInfo = document.getElementById("pageInfo");
    pageInput = document.getElementById("pageInput");
    goPageBtn = document.getElementById("goPage");
    usersPerPage = getUsersPerPage();
    tablaUsuarios = document.querySelector("#tablaUsuarios tbody");


    eventosPaginacion();

    // 📌 Filtro de búsqueda
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        filteredUsuarios = usuarios.filter(u =>
            (u.applicant_fullname || "").toLowerCase().includes(query)
        );
        currentPage = 1;
        renderSolicitudes();
    });

    (async () => {
        await fetchUserProgress();
    })();
});

// Variables del modal
const modal = document.getElementById("modalConfirm");
const btnCancelar = document.getElementById("btnCancelar");
const btnAceptar = document.getElementById("btnAceptar");




// Variables modal
const modalAdjuntar = document.getElementById("modalAdjuntar");
const modalNombre = document.getElementById("modalNombre");
const btnGuardar = document.getElementById("btnGuardar");
const btnCerrar = document.getElementById("btnCerrar");

// Abrir modal con nombre candidato
function finalizarTarea(userId, etapaKey) {
    // buscar el usuario en el array
    const candidato = usuarios.find(u => u._id === userId);
    usuarioSeleccionado = candidato;
    if (!candidato) return;

    // poner el nombre en el modal
    modalNombre.textContent = candidato.applicant_fullname;

    // mostrar modal
    modalAdjuntar.style.display = "flex";
}

// Cerrar modal
btnCerrar.onclick = () => {
    modalAdjuntar.style.display = "none";
};

// 📌 Guardar archivos y actualizar progreso
btnGuardar.onclick = async () => {
    try {
        await axios.patch(`${API_URL}user-progress/${usuarioSeleccionado._id}`,
            { background_check: true },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        mostrarModalMensaje("Archivo guardado y progreso actualizado correctamente ✅");


    } catch (error) {
        if (error.response && error.response.status === 401) {
            mostrarModalMensaje("Sesión expirada. Inicia sesión de nuevo. ❌");
            errorServer();
        } else {
            mostrarModalMensaje("Error al obtener el progreso de usuarios. ❌");
            recargarPagina();
        }
    } finally {
        modalAdjuntar.style.display = "none";
        window.location.reload();
    }
};


function renderSolicitudes() {
    tablaUsuarios.innerHTML = "";

    const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage) || 1;
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    pageInput.value = currentPage;

    if (filteredUsuarios.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = etapas.length + 2;
        td.textContent = "No se encontraron resultados";
        td.style.textAlign = "start";
        td.style.color = "#888";
        tr.appendChild(td);
        tablaUsuarios.appendChild(tr);
        document.getElementsByClassName("pagination")[0].style.display = "none";
        return;
    } else {
        document.getElementsByClassName("pagination")[0].style.display = "block";
    }

    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const pageData = filteredUsuarios.slice(start, end);

    pageData.forEach(usuarios => {
        const tr = document.createElement("tr");

        // 📌 Columna nombre
        const tdNombre = document.createElement("td");
        tdNombre.className = "bloque nombre";
        tdNombre.textContent = usuarios.applicant_fullname || "Sin nombre";
        tr.appendChild(tdNombre);

        // 📌 Columna etapas
        etapas.forEach(etapa => {
            const td = document.createElement("td");
            td.className = "bloque " + (usuarios[etapa.key] ? "status-completado" : "status-proceso");
            td.textContent = etapa.label;


            // ✅ Si la etapa está en etapasConAccion, agregamos evento de clic
            if (etapasConAccion.includes(etapa.key)) {
                if (usuarios[etapa.key] == false) {
                    td.classList.add("clickable");
                    td.style.cursor = "pointer"; // indicar que es clickeable
                }
                td.addEventListener("click", () => {
                    finalizarTarea(usuarios._id, etapa.key);
                });
            }
            tr.appendChild(td);
        });

        // 📌 Columna descarga
        const tdDescargar = document.createElement("td");
        tdDescargar.className = "bloque status-proceso descargar";
        tdDescargar.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M5 20h14v-2H5v2zM12 2v12l4-4h-3V2h-2v8H8l4 4z"/>
                </svg>`;
        tr.appendChild(tdDescargar);

        tablaUsuarios.appendChild(tr);
    });

    // 📌 Habilitar/deshabilitar botones de paginación
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}