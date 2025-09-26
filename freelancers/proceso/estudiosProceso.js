let usuarios = [];
let usuarioSeleccionado = null; // ✅ usuario en el que se hizo clic para adjuntar

document.addEventListener("DOMContentLoaded", () => {
  obtenerLocalStorage();


  async function fetchUserProgress() {
    try {
      const res = await axios.get(`${API_URL}user-progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          freelance_id: userId,
          application_accepted: true,
        },
      });

      usuarios = res.data; // Actualiza la variable global con los datos recibidos
      // console.log("User Progress:", usuarios);
      filteredUsuarios = [...usuarios];
      renderSolicitudes(); // Llama a la función para renderizar la tabla con los nuevos datos
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // mostrarModalMensaje("❌ Sesión expirada. Inicia sesión de nuevo.");
        // errorServer();
      } else {
        // mostrarModalMensaje("❌ Error al obtener el progreso de usuarios.");
        // errorServer();
      }
    }
  }
  prevBtn = document.getElementById("prevPage");
  nextBtn = document.getElementById("nextPage");
  pageInfo = document.getElementById("pageInfo");
  pageInput = document.getElementById("pageInput");
  goPageBtn = document.getElementById("goPage");
  totalPagesSpan = document.getElementById("totalPages");
  tabla = document.querySelector("table");
  searchInput = document.getElementById("searchInput");
  eventosPaginacion();

  // 📌 Filtro de búsqueda
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    filteredUsuarios = usuarios.filter(u =>
      (u.applicant_fullname).toLowerCase().includes(query)
    );
    currentPage = 1;
    renderSolicitudes();
  });




  // 📌 Inicializar
  (async () => {
    await fetchUserProgress();
  })();
});



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

function renderSolicitudes() {
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
    document.getElementsByClassName("pagination")[0].style.display = "flex";
  }

  const start = (currentPage - 1) * usersPerPage;
  const end = start + usersPerPage;
  const pageData = filteredUsuarios.slice(start, end);

  pageData.forEach(usuario => {
    const tr = document.createElement("tr");

    console.log(usuario);
    console.log(usuario.applicant_id);
    // 📌 Columna nombre
    const tdNombre = document.createElement("td");
    tdNombre.className = "bloque nombre";
    tdNombre.textContent = usuario.applicant_fullname || "Sin nombre";
    tr.appendChild(tdNombre);


    // Columna etapas
    // Columna etapas
    etapas.forEach(etapa => {
      const td = document.createElement("td");

      const completado = usuario[etapa.key]; // true si ya completado
      td.className = "bloque " + (completado ? "status-completado" : "status-proceso");
      td.textContent = etapa.label;

      // ✅ Solo agregar acción si la etapa está en etapasConAccion y NO está completada
      if (etapasConAccion.includes(etapa.key) && !completado) {
        td.style.cursor = "pointer"; // indicar que es clickeable

        if (etapa.key == "documenting_information") {
          td.addEventListener("click", () => {
            console.log("se abre el formulario ", usuario.applicant_id);
            window.location.href = `estudiosFormulario.html?user=${encodeURIComponent(usuario.applicant_id)}&userprogress=${encodeURIComponent(usuario._id)}`;
          });
        } else {
          td.addEventListener("click", () => {
            finalizarTarea(usuario._id, etapa.key);
          });
        }
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


async function finalizarTarea(userId, etapaKey) {
  // Esperar confirmación del usuario
  const confirmado = await mostrarModal("¿Deseas finalizar la tarea?");
  if (!confirmado) return; // si el usuario cancela, no hacemos nada

  console.log(etapaKey, userId);
  try {
    // Crear un objeto dinámico con la clave de la etapa a actualizar
    const body = { [etapaKey]: true };

    const res = await axios.patch(`${API_URL}user-progress/${userId}`, body, {
      headers: { Authorization: `Bearer ${token}` }
    });

    mostrarModalMensaje("Tarea finalizada con éxito ✅");

    // Recargar los datos y refrescar la tabla
    await fetchUserProgress();
  } catch (error) {
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



