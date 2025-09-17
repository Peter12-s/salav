const token = localStorage.getItem("access_token");
const tabla = document.getElementById("progressTable");

// Variables globales
let usuarios = [];
let filteredUsuarios = [];
let currentPage = 1;
let usuariosPerPage = window.innerWidth <= 768 ? 3 : 5;

// Ajustar cantidad de registros por página al cambiar tamaño de ventana
window.addEventListener("resize", () => {
    const newLimit = window.innerWidth <= 768 ? 3 : 5;
    if (newLimit !== usuariosPerPage) {
        usuariosPerPage = newLimit;
        currentPage = 1;
        renderTabla();
    }
});

// Etapas del proceso
const etapas = [
    { key: "application_accepted", label: "Solicitud aceptada" },
    { key: "candidate_contacted", label: "Candidato contactado" },
    { key: "visit_scheduled", label: "Visita agendada" },
    { key: "background_check", label: "Background check" },
    { key: "visit_complete", label: "Visita realizada" },
    { key: "documenting_information", label: "Documentando información" },
    { key: "evaluation_complete", label: "Evaluación finalizada" }
];

// === Fetch candidatos ===
async function fetchUserProgress() {
    try {
        const res = await axios.get(`${API_URL}user-progress`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        usuarios = res.data;
        filteredUsuarios = [...usuarios];
        renderTabla();
    } catch (error) {
        console.error("Error al obtener user-progress:", error.response?.data || error);
    }
}

// === Render de tabla con paginación ===
function renderTabla() {
    tabla.innerHTML = "";

    if (filteredUsuarios.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = etapas.length + 2;
        td.textContent = "No hay candidatos en proceso";
        td.style.textAlign = "start";
        td.style.fontStyle = "italic";
        tr.appendChild(td);
        tabla.appendChild(tr);
        actualizarPaginacion();
        return;
    }

    const start = (currentPage - 1) * usuariosPerPage;
    const end = start + usuariosPerPage;
    const pageUsuarios = filteredUsuarios.slice(start, end);

    pageUsuarios.forEach(usuario => {
        const tr = document.createElement("tr");

        // Columna nombre
        const tdNombre = document.createElement("td");
        tdNombre.className = "bloque nombre";
        tdNombre.textContent = usuario.nombre || "(Sin nombre)";
        tr.appendChild(tdNombre);

        // Columna etapas
        etapas.forEach(etapa => {
            const td = document.createElement("td");
            td.className = "bloque " + (usuario[etapa.key] ? "status-completado" : "status-proceso");
            td.textContent = etapa.label;
            tr.appendChild(td);
        });

        // Columna descarga
        const tdDescargar = document.createElement("td");
        tdDescargar.className = "bloque status-proceso descargar";
        tdDescargar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5 20h14v-2H5v2zM12 2v12l4-4h-3V2h-2v8H8l4 4z"/>
            </svg>`;
        tr.appendChild(tdDescargar);

        tabla.appendChild(tr);
    });

    actualizarPaginacion();
}

// === Paginación ===
function actualizarPaginacion() {
    const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage) || 1;
    document.getElementById("totalPages").textContent = totalPages;
    document.getElementById("pageInfo").textContent = `Página ${currentPage} de ${totalPages}`;
    document.getElementById("pageInput").value = currentPage;

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
}

// === Eventos de paginación ===
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderTabla();
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTabla();
    }
});

document.getElementById("goPage").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage);
    let page = parseInt(document.getElementById("pageInput").value);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTabla();
    }
});

// === Buscador ===
document.getElementById("searchInput").addEventListener("input", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    filteredUsuarios = usuarios.filter(u =>
        (u.nombre || "").toLowerCase().includes(query)
    );
    currentPage = 1;
    renderTabla();
});

// === Llamada inicial ===
fetchUserProgress();
