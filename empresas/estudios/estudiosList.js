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
usuarios =[
  {
    "_id": "5c8b9a10-3a1f-41ab-9f81-2a1f8a6c3f11",
    "form_request_id": "f2a18f56-9b65-45d1-85a7-1a1a6e3a7b20",
    "application_accepted": true,
    "candidate_contacted": false,
    "visit_scheduled": false,
    "background_check": false,
    "visit_complete": false,
    "documenting_information": false,
    "evaluation_complete": false,
    "createdAt": "2025-09-16T04:12:10.654Z",
    "updatedAt": "2025-09-16T04:12:10.654Z",
    "applicant_fullname": "JUAN CARLOS HERNÁNDEZ LÓPEZ"
  },
  {
    "_id": "7d3f8e54-5f42-4ab9-b92c-7a2d6c71e422",
    "form_request_id": "6acbd2a4-4a92-4d73-b6db-1f28b1e09a87",
    "application_accepted": true,
    "candidate_contacted": false,
    "visit_scheduled": false,
    "background_check": false,
    "visit_complete": false,
    "documenting_information": false,
    "evaluation_complete": false,
    "createdAt": "2025-09-16T05:20:35.987Z",
    "updatedAt": "2025-09-16T05:20:35.987Z",
    "applicant_fullname": "MARÍA FERNANDA GARCÍA RAMÍREZ"
  },
  {
    "_id": "3a7e9a61-2c3a-45f9-8e5b-9f8c4c7d1d34",
    "form_request_id": "8f1e3a64-9b3e-4a45-8a56-b92a7e56f213",
    "application_accepted": true,
    "candidate_contacted": false,
    "visit_scheduled": false,
    "background_check": false,
    "visit_complete": false,
    "documenting_information": false,
    "evaluation_complete": false,
    "createdAt": "2025-09-16T06:15:48.432Z",
    "updatedAt": "2025-09-16T06:15:48.432Z",
    "applicant_fullname": "ALEJANDRO MARTÍNEZ CRUZ"
  },
  {
    "_id": "6f9c2d83-1a32-4ab1-97c9-6c73e2b1f876",
    "form_request_id": "d3c5b2e1-2a64-48f7-93a8-4b9f2e5d1f22",
    "application_accepted": true,
    "candidate_contacted": false,
    "visit_scheduled": false,
    "background_check": false,
    "visit_complete": false,
    "documenting_information": false,
    "evaluation_complete": false,
    "createdAt": "2025-09-16T07:40:22.678Z",
    "updatedAt": "2025-09-16T07:40:22.678Z",
    "applicant_fullname": "SOFÍA ELENA TORRES MORA"
  },
  {
    "_id": "9a4d7c12-7c84-44d9-8d91-1b3c2e8a6d54",
    "form_request_id": "c1a8f23e-3b5f-4a71-90f7-5a1b2d3e6c77",
    "application_accepted": true,
    "candidate_contacted": false,
    "visit_scheduled": false,
    "background_check": false,
    "visit_complete": false,
    "documenting_information": false,
    "evaluation_complete": false,
    "createdAt": "2025-09-16T08:55:11.345Z",
    "updatedAt": "2025-09-16T08:55:11.345Z",
    "applicant_fullname": "CARLOS EDUARDO FLORES PÉREZ"
  },
  {
    "_id": "4e7f3b92-6a71-41d8-9d2b-3a7f1e6c8a21",
    "form_request_id": "b2e9a4c5-7a3d-49a8-bd91-4c8a2e9f1a23",
    "application_accepted": true,
    "candidate_contacted": false,
    "visit_scheduled": false,
    "background_check": false,
    "visit_complete": false,
    "documenting_information": false,
    "evaluation_complete": false,
    "createdAt": "2025-09-16T09:22:44.911Z",
    "updatedAt": "2025-09-16T09:22:44.911Z",
    "applicant_fullname": "ISABELLA REYES CASTRO"
  },
  {
    "_id": "8d5f2c34-2c74-4f7b-82a6-9f8b3a6c1d45",
    "form_request_id": "f9c3a2d4-6e2b-4a91-b3e7-7d3a2c5b1f92",
    "application_accepted": true,
    "candidate_contacted": false,
    "visit_scheduled": false,
    "background_check": false,
    "visit_complete": false,
    "documenting_information": false,
    "evaluation_complete": false,
    "createdAt": "2025-09-16T10:05:57.129Z",
    "updatedAt": "2025-09-16T10:05:57.129Z",
    "applicant_fullname": "MIGUEL ÁNGEL GONZÁLEZ DOMÍNGUEZ"
  },
  {
    "_id": "1b9f6e54-4f8a-47b3-a1f6-7d2c4a9e5b77",
    "form_request_id": "e7a2c4f9-3b2e-49c8-90d3-5a6c2f7e9d11",
    "application_accepted": true,
    "candidate_contacted": false,
    "visit_scheduled": false,
    "background_check": false,
    "visit_complete": false,
    "documenting_information": false,
    "evaluation_complete": false,
    "createdAt": "2025-09-16T11:30:33.876Z",
    "updatedAt": "2025-09-16T11:30:33.876Z",
    "applicant_fullname": "VALERIA MENDOZA HERRERA"
  },
  {
    "_id": "6a4e9b12-2b6d-4c8a-bf73-8e5a2c9f1d22",
    "form_request_id": "a1f7c2d4-3b2e-4d7a-9f1e-6b2c3a7d1e44",
    "application_accepted": true,
    "candidate_contacted": false,
    "visit_scheduled": false,
    "background_check": false,
    "visit_complete": false,
    "documenting_information": false,
    "evaluation_complete": false,
    "createdAt": "2025-09-16T12:45:28.543Z",
    "updatedAt": "2025-09-16T12:45:28.543Z",
    "applicant_fullname": "DANIEL ALEJANDRO VARGAS PANIAGUA"
  },
  {
    "_id": "2d7f9e43-5c81-48a9-a2f9-3c7b1f9d8e99",
    "form_request_id": "b9a1e2f7-6d3c-4a8f-92f7-5c2a1d9b7e33",
    "application_accepted": true,
    "candidate_contacted": false,
    "visit_scheduled": false,
    "background_check": false,
    "visit_complete": false,
    "documenting_information": false,
    "evaluation_complete": false,
    "createdAt": "2025-09-16T13:55:49.267Z",
    "updatedAt": "2025-09-16T13:55:49.267Z",
    "applicant_fullname": "RENATA GUTIÉRREZ SALAZAR"
  }
]
;
        // usuarios = res.data;
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
