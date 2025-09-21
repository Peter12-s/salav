const token = localStorage.getItem("access_token");
const tabla = document.getElementById("progressTable");
const idEnterprise = localStorage.getItem("user_id"); // 👈 el id del freelancer

// Variables globales
let usuarios=[] ;
let filteredUsuarios=[] ;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {


  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");
  const pageInput = document.getElementById("pageInput");
  const goPageBtn = document.getElementById("goPage");
  const totalPagesSpan = document.getElementById("totalPages");
  const tabla = document.querySelector("table");
  const searchInput = document.getElementById("searchInput");


  let currentPage = 1;
  let usersPerPage = getUsersPerPage(); // ✅ viene del config.js

  // 📌 Ajustar usuarios por página al cambiar tamaño de pantalla
  window.addEventListener("resize", () => {
    const newLimit = getUsersPerPage();
    if (newLimit !== usersPerPage) {
      usersPerPage = newLimit;
      currentPage = 1;
      renderSolicitudes();
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
      headers: {
        Authorization: `Bearer ${token}` // ✅ enviamos token
      },
      params: {
        enterprise_id: idEnterprise, // ✅ enviamos parámetro
      }
    });

    usuarios = res.data;
    filteredUsuarios = [...usuarios];
    renderSolicitudes();
  } catch (error) {
    console.error("Error al obtener user-progress:", error.response?.data || error);
  }
}


  // === Render de tabla con paginación ===
  function renderSolicitudes() {
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
      document.getElementsByClassName("pagination")[0].style.display = "none";
      actualizarPaginacion();
      return;
    } else {
      document.getElementsByClassName("pagination")[0].style.display = "block";

    }

    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const pageUsuarios = filteredUsuarios.slice(start, end);

    pageUsuarios.forEach(usuario => {
      const tr = document.createElement("tr");

      // Columna nombre
      const tdNombre = document.createElement("td");
      tdNombre.className = "bloque nombre";
      tdNombre.textContent = usuario.applicant_fullname || "Sin nombre";
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
    const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage) || 1;
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
      renderSolicitudes();
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderSolicitudes();
    }
  });

  document.getElementById("goPage").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);
    let page = parseInt(document.getElementById("pageInput").value);
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      renderSolicitudes();
    }
  });

  // === Buscador ===
  document.getElementById("searchInput").addEventListener("input", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
   filteredUsuarios = usuarios.filter(u =>
            (u.applicant_fullname || "").toLowerCase().includes(query)
        );
    currentPage = 1;
    renderSolicitudes();
  });

  // === Llamada inicial ===
  fetchUserProgress();
});