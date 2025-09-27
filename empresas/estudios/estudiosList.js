document.addEventListener("DOMContentLoaded", () => {
  obtenerLocalStorage();

   prevBtn = document.getElementById("prevPage");
   nextBtn = document.getElementById("nextPage");
   pageInfo = document.getElementById("pageInfo");
   pageInput = document.getElementById("pageInput");
   goPageBtn = document.getElementById("goPage");
   totalPagesSpan = document.getElementById("totalPages");
   tabla = document.querySelector("table");
   tablaB=document.querySelector("tbody");
   
   searchInput = document.getElementById("searchInput");


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



  // === Fetch candidatos ===
  async function fetchUserProgress() {
    try {
      const res = await axios.get(`${API_URL}user-progress`, {
        headers: {
          Authorization: `Bearer ${token}` // ✅ enviamos token
        },
        params: {
          enterprise_id: userId, // ✅ enviamos parámetro
        }
      });

      usuarios = res.data;
      filteredUsuarios = [...usuarios];
      renderSolicitudes();
    } catch (error) {
      console.error("Error al obtener user-progress:", error.response?.data || error);
    }
  }


  eventosPaginacion();

  // === Buscador ===
  document.getElementById("searchInput").addEventListener("input", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    filteredUsuarios = usuarios.filter(u =>
      (u.applicant_fullname || "").toLowerCase().includes(query)
    );
     if (filteredUsuarios.length === 0) {
            tablaB.innerHTML = `<tr><td colspan="2" style="text-align:start; color:#888;">
                No se encontraron resultados
            </td></tr>`;
            document.getElementsByClassName("pagination")[0].style.display = "none";
        } else {
            document.getElementsByClassName("pagination")[0].style.display = "flex";

            currentPage = 1;
            renderSolicitudes();
        }
  });

  // === Llamada inicial ===
  fetchUserProgress();
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
function renderSolicitudes() {
  tablaB.innerHTML = ""; // ✅ limpiamos solo el tbody, no toda la tabla

  if (filteredUsuarios.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = etapas.length + 2;
    td.textContent = "No hay candidatos en proceso";
    td.style.textAlign = "start";
    td.style.fontStyle = "italic";
    tr.appendChild(td);
    tablaB.appendChild(tr); // ✅ agregamos al tbody
    document.getElementsByClassName("pagination")[0].style.display = "none";
    return;
  } else {
    document.getElementsByClassName("pagination")[0].style.display = "flex";
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

      // ✅ regla extra para evaluation_complete -> naranja
      if (etapa.key === "evaluation_complete" && usuario[etapa.key]) {
        td.className = "bloque status-evaluation";
      } else {
        td.className = "bloque " + (usuario[etapa.key] ? "status-completado" : "status-proceso");
      }

      td.textContent = etapa.label;

      // ✅ listener de click para revisar
      td.addEventListener("click", () => {
        console.log(`Click en etapa: ${etapa.label} del usuario ${usuario.applicant_fullname}`);
        // aquí puedes abrir modal o detalle
      });

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

    tablaB.appendChild(tr); // ✅ filas al tbody
  });

  actualizarPaginacion();
}
