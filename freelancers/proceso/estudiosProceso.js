let usuarios = [];
let filteredUsuarios = [];
let usuarioSeleccionado = null; // ✅ usuario en el que se hizo clic para adjuntar
const token = localStorage.getItem("access_token");
const userId = localStorage.getItem("_id");

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
      renderTabla();
    }
  });

  async function fetchUserProgress() {
    try {
      const res = axios.get(`${API_URL}user-progresst`, {
        headers: {
          Authorization: `Bearer ${token}`,
          params: { userId: userId },
        },
      });

      usuarios = res.data; // Actualiza la variable global con los datos recibidos
      // console.log("User Progress:", usuarios);
      filteredUsuarios = [...usuarios];
      renderTabla(); // Llama a la función para renderizar la tabla con los nuevos datos
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        mostrarModalMensaje("❌ Sesión expirada. Inicia sesión de nuevo.");
        errorServer();
      } else {
        mostrarModalMensaje("❌ Error al obtener el progreso de usuarios.");
        recargarPagina();
      }
    }
  }

  // 📌 Eventos de paginación
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTabla();
    }
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTabla();
    }
  });

  goPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);
    let page = parseInt(pageInput.value);
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      renderTabla();
    } else {
      mostrarModalMensaje(`⚠️ Ingresa un número entre 1 y ${totalPages}`);
    }
  });
  // 📌 Filtro de búsqueda
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    filteredUsuarios = usuarios.filter(u =>
      (u.applicant_fullname).toLowerCase().includes(query)
    );
    currentPage = 1;
    renderTabla();
  });



  // Llamada inmediata
  fetchUserProgress();

  const etapasConAccion = [
    "candidate_contacted",
    "visit_scheduled",
    "visit_complete",
    "documenting_information"
  ];
  // Mapear claves de usuario -> texto que se muestra en la tabla
  const etapas = [
    { key: "application_accepted", label: "Solicitud aceptada" },
    { key: "candidate_contacted", label: "Candidato contactado" },
    { key: "visit_scheduled", label: "Visita agendada" },
    { key: "background_check", label: "Background check" },
    { key: "visit_complete", label: "Visita realizada" },
    { key: "documenting_information", label: "Documentando información" },
    { key: "evaluation_complete", label: "Evaluación finalizada" }
  ];

  function renderTabla() {
    tabla.innerHTML = ""; // limpiar
    const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage) || 1;
    totalPagesSpan.textContent = totalPages;
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    pageInput.value = currentPage;

    if (filteredUsuarios.length === 0) {
      // Mensaje cuando no hay usuarios
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = etapas.length + 2; // +2 por columna nombre y descarga
      td.textContent = "No hay candidatos en proceso";
      td.style.textAlign = "start";
      td.style.fontStyle = "italic";
      tr.appendChild(td);
      tabla.appendChild(tr);
      document.getElementsByClassName("pagination")[0].style.display = "none";
      return;
    } else {
      document.getElementsByClassName("pagination")[0].style.display = "block";
    }

    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const pageData = filteredUsuarios.slice(start, end);

    pageData.forEach(usuario => {
      const tr = document.createElement("tr");

      // 📌 Columna nombre
      const tdNombre = document.createElement("td");
      tdNombre.className = "bloque nombre";
      tdNombre.textContent = usuario.applicant_fullname || "Sin nombre";
      tr.appendChild(tdNombre);


      // Columna etapas
      etapas.forEach(etapa => {
        const td = document.createElement("td");
        td.className = "bloque " + (usuario[etapa.key] ? "status-completado" : "status-proceso");
        td.textContent = etapa.label;

        // ✅ Si la etapa está en etapasConAccion, agregamos evento de clic
        if (etapasConAccion.includes(etapa.key)) {
          td.style.cursor = "pointer"; // indicar que es clickeable
          td.addEventListener("click", () => {
            finalizarTarea(usuario._id, etapa.key);
          });
        }
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
  }
});

// 🔹 Función para confirmar y mandar petición de actualización
async function finalizarTarea(userId, etapaKey) {
  mostrarModal();

  try {
    const res =  await axios.put(`${API_URL}user-progress/${userId}`, 
      { status: etapaKey },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    mostrarModalMensaje("Tarea finalizada con éxito ✅");
    fetchUserProgress(); // recargar la tabla
  } catch (error) {
    console.error("Error al actualizar tarea:", error.response?.data || error);
    mostrarModalMensaje("❌ Ocurrió un error al finalizar la tarea");
  }
}



// Variables del modal
const modal = document.getElementById("modalConfirm");
const btnCancelar = document.getElementById("btnCancelar");
const btnAceptar = document.getElementById("btnAceptar");

let modalResolve; // para manejar promesa




// Mostrar modal como promesa
function mostrarModal(mensaje) {
  return new Promise(resolve => {
    document.getElementById("modalMessage").textContent = mensaje;
    modal.style.display = "flex";
    modalResolve = resolve;
  });
}

// Eventos de botones
btnCancelar.onclick = () => {
  modal.style.display = "none";
  modalResolve(false);
};
btnAceptar.onclick = () => {
  modal.style.display = "none";
  modalResolve(true);
};



