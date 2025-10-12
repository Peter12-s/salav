const etapas = [
  { key: "application_accepted", label: "Solicitud aceptada" },
  { key: "candidate_contacted", label: "Candidato contactado" },
  { key: "visit_scheduled", label: "Visita agendada" },
  { key: "background_check", label: "Background check" },
  { key: "visit_complete", label: "Visita realizada" },
  { key: "documenting_information", label: "Documentando información" },
  { key: "evaluation_complete", label: "Evaluación finalizada" }
];

let lastUploadResponse = null; // Variable para guardar respuesta de subida


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
  searchInput = document.querySelector("#searchInput");
  eventosPaginacion();

  // 📌 Filtro de búsqueda
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    filteredUsuarios = usuarios.filter(u =>
      (u.applicant_fullname || "").toLowerCase().includes(query)
    ); if (filteredUsuarios.length === 0) {
      tablaUsuarios.innerHTML = `<tr><td colspan="2" style="text-align:start; color:#888;">
                No se encontraron resultados
            </td></tr>`;
      document.getElementsByClassName("pagination")[0].style.display = "none";
    } else {
      document.getElementsByClassName("pagination")[0].style.display = "flex";
      currentPage = 1;
      renderSolicitudes();
    }

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
  modalAdjuntar.style.display = "none";
  const fileInput = document.getElementById("archivoInput");
  const file = fileInput.files[0];

  if (!file) {
    mostrarModalMensaje("Selecciona un archivo. ❌");
    return;
  }

  // 📌 Validar que sea PDF
  if (file.type !== "application/pdf") {
    mostrarModalMensaje("Solo se permiten archivos PDF. ❌");
    return;
  }

  // 📌 Validar tamaño (máx. 3 MB)
  if (file.size > 3 * 1024 * 1024) {
    mostrarModalMensaje("El archivo supera el límite de 3 MB. ❌");
    return;
  }

  // 📌 Construir carpeta dinámica
  const nombres = usuarioSeleccionado.applicant_fullname.split(" ");
  const nombre = nombres[0] || "";
  const apellido = nombres[1] || "";
  const carpeta = nombre.slice(0, 3) + apellido.slice(0, 2); // ej: "PedEs"
  const numeroSolicitud = usuarioSeleccionado.number;



  try {
    // 📌 Subida de archivo
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", numeroSolicitud + "_" + carpeta + "/Background");

    const res = await axios.post(`${API_URL}google/upload`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    lastUploadResponse = res.data;

    // 📌 Actualizar progreso SOLO si la subida fue exitosa
    const body = { background_check: true, bg_check_url: lastUploadResponse.id };
    const resProgress = await axios.patch(
      `${API_URL}user-progress/${usuarioSeleccionado._id}`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    mostrarModalMensaje("Archivo subido y progreso actualizado. ✅");


    // 🔹 Actualizar el array completo
    // 🔹 Actualizar el objeto en memoria
    usuarioSeleccionado.background_check = true;
    usuarioSeleccionado.bg_check_url = lastUploadResponse.id; // <--- agregar esto

    // 🔹 Actualizar el array completo
    const index = usuarios.findIndex(u => u._id === usuarioSeleccionado._id);
    if (index !== -1) {
      usuarios[index].background_check = true;
      usuarios[index].bg_check_url = lastUploadResponse.id; // <--- agregar esto
    }
    // 🔹 Renderizar nuevamente la tabla
    renderSolicitudes();
  } catch (error) {
    console.error(error);
    if (error.response) {
      mostrarModalMensaje(`Error: ${error.response.data?.message || "Desconocido"} ❌`);
    } else if (error.request) {
      mostrarModalMensaje("No hubo respuesta del servidor. ❌");
    } else {
      mostrarModalMensaje(`Error: ${error.message} ❌`);
    }
  }

}




function renderSolicitudes() {
  tablaUsuarios.innerHTML = "";

  // 📌 Actualizar paginación
  pageInput.min = 1;
  pageInput.max = totalPages;
  // 🔹 Calcula total de páginas
  const totalPagesCalc = Math.ceil(filteredUsuarios.length / usersPerPage) || 1;

  // 🔹 Actualiza info en ambos lugares
  pageInfo.textContent = `Página ${currentPage} de ${totalPagesCalc}`;
  document.getElementById("totalPages").textContent = totalPagesCalc;
  pageInput.value = currentPage;

  if (filteredUsuarios.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = etapas.length + 2;document.addEventListener("DOMContentLoaded", () => {
    obtenerLocalStorage();

    async function fetchFreelancers() {
        try {
            const res = await axios.get(`${API_URL}user`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { user_type: "FREELANCER" }
            });
            freelancers = res.data;
        } catch (err) {
            mostrarModalMensaje("Error en la petición. Inicia sesión de nuevo. ❌");
            errorServer();
        }
    }

    async function fetchApplicants() {
        try {
            const res = await axios.get(`${API_URL}form-request?freelance_id=null`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            applicants = res.data;
            filteredUsuarios = [...applicants];
            renderSolicitudes();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                mostrarModalMensaje("Sesión expirada. Inicia sesión de nuevo. ❌");
                errorServer();
            } else {
                if (token) {
                    mostrarModalMensaje("Error al obtener el progreso de usuarios. ❌");
                    errorServer();
                }
            }
        }
    }

    // 📌 Elementos del DOM
    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");
    pageInfo = document.getElementById("pageInfo");
    pageInput = document.getElementById("pageInput");
    goPageBtn = document.getElementById("goPage");
    tbody = document.querySelector("#tablaSolicitudes tbody");
    searchInput = document.querySelector("#searchInput");
    usersPerPage = getUsersPerPage();

    eventosPaginacion();

    // 📌 Filtro de búsqueda
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        filteredUsuarios = applicants.filter(a => {
            const persona = a.applicant?.person;
            return (`${persona?.name || ""} ${persona?.f_surname || ""} ${persona?.s_surname || ""}`)
                .toLowerCase()
                .includes(query);
        });

        if (filteredUsuarios.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" style="text-align:start; color:#888;">
                        No se encontraron resultados
                    </td>
                </tr>`;
            document.getElementsByClassName("pagination")[0].style.display = "none";
        } else {
            document.getElementsByClassName("pagination")[0].style.display = "flex";
            currentPage = 1;
            renderSolicitudes();
        }
    });

    // 📌 Inicializar
    (async () => {
        await fetchFreelancers();
        await fetchApplicants();
    })();
});

function renderSolicitudes() {
    tbody.innerHTML = "";

    // 📌 Si no hay solicitudes
    if (!filteredUsuarios || filteredUsuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="2" style="text-align:start; color:#888; padding:10px;">
                    No hay solicitudes pendientes.
                </td>
            </tr>`;
        document.getElementsByClassName("pagination")[0].style.display = "none";
        return;
    }

    // 📌 Si hay solicitudes
    document.getElementsByClassName("pagination")[0].style.display = "flex";

    const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage) || 1;
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const pageData = filteredUsuarios.slice(start, end);

    pageData.forEach((solicitud) => {
        const persona = solicitud.applicant?.person;
        if (!persona) return;

        const nombreCompleto = `${persona.name} ${persona.f_surname || ""} ${persona.s_surname || ""}`;
        const direccion = `${persona.state || ""}, ${persona.town || ""}, ${persona.settlement || ""}\n${persona.address_references || ""}`;

        const tr = document.createElement("tr");

        // 📌 Columna nombre con tooltip
        const tdNombre = document.createElement("td");
        const divTooltip = document.createElement("div");
        divTooltip.classList.add("tooltip-inner");
        divTooltip.textContent = nombreCompleto;

        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip-text");
        tooltip.textContent = `📍 ${direccion}\n📞 ${persona.phone || ""}`;
        divTooltip.appendChild(tooltip);
        tdNombre.appendChild(divTooltip);

        // 📌 Columna select freelancer
        const tdSelect = document.createElement("td");
        const select = document.createElement("select");
        select.classList.add("freelancer-select");
        select.dataset.applicantId = solicitud._id;

        const optionDefault = document.createElement("option");
        optionDefault.textContent = "Seleccionar freelancer";
        optionDefault.value = "";
        optionDefault.selected = true;
        select.appendChild(optionDefault);

        // Opciones de freelancers
        freelancers.forEach(f => {
            const opt = document.createElement("option");
            opt.value = f._id;
            opt.textContent = `${f.name} ${f.f_surname || ""} ${f.s_surname || ""}`;
            select.appendChild(opt);
        });

        // 📌 Botón asignar
        const btnAsignar = document.createElement("button");
        btnAsignar.textContent = "Asignar";
        btnAsignar.classList.add("btn-asignar");
        btnAsignar.disabled = true;
        btnAsignar.style.marginLeft = "8px";

        function toggleButton() {
            btnAsignar.disabled = !select.value;
        }

        select.addEventListener("change", toggleButton);
        $(select).on("select2:select", toggleButton);
        $(select).on("select2:clear", toggleButton);

        btnAsignar.addEventListener("click", async () => {
            const freelancerId = select.value;
            try {
                await axios.patch(
                    `${API_URL}form-request/${solicitud._id}`,
                    { freelance_id: freelancerId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                mostrarModalMensaje(
                    `Candidato asignado correctamente a ${select.options[select.selectedIndex].text} ✅`
                );

                searchInput.value = ""; // limpiar búsqueda
                tr.remove();
                filteredUsuarios = filteredUsuarios.filter(a => a._id !== solicitud._id);
                renderSolicitudes();
            } catch (err) {
                mostrarModalMensaje("Error al asignar freelancer ❌");
            }
        });

        tdSelect.appendChild(select);
        tdSelect.appendChild(btnAsignar);
        tr.appendChild(tdNombre);
        tr.appendChild(tdSelect);
        tbody.appendChild(tr);

        // Iniciar select2
        $(select).select2({
            placeholder: "Seleccionar freelancer",
            allowClear: true,
            minimumResultsForSearch: 0
        });
    });

    actualizarPaginacion();
}

    td.textContent = "No se encontraron resultados";
    td.style.textAlign = "start";
    td.style.color = "#888";
    tr.appendChild(td);
    tablaUsuarios.appendChild(tr);
    document.getElementsByClassName("pagination")[0].style.display = "none";
    return;
  } else {
    document.getElementsByClassName("pagination")[0].style.display = "flex";
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
    // 📌 Columna etapas
    etapas.forEach(etapa => {
      const td = document.createElement("td");
      const completado = usuarios[etapa.key];

      // 🔸 Caso especial para documenting_information
      if (etapa.key === "documenting_information") {
        if (completado && !usuarios.evaluation_complete) {
          // 📌 Naranja y clickeable si está documentando pero aún no evalúa
          td.className = "bloque status-evaluation";
          td.classList.add("clickable");
          td.style.cursor = "pointer";
          td.textContent = etapa.label;

          td.addEventListener("click", () => {
            sessionStorage.setItem('nombre_seleccionado', usuarios.applicant_fullname);
            sessionStorage.setItem('numero_solicitud', usuarios.number);
            window.location.href = `estudiosFormulario.html?user=${encodeURIComponent(usuarios.applicant_id)}&userprogress=${encodeURIComponent(usuarios._id)}`;
          });
        } else if (usuarios.evaluation_complete) {
          // 📌 Verde si ya está completada la evaluación
          td.className = "bloque status-completado";
          td.textContent = etapa.label;
        } else {
          // 📌 En proceso (gris o color normal)
          td.className = "bloque status-proceso";
          td.textContent = etapa.label;
        }
      }
      else {
        // 🔸 Resto de etapas
        td.className = "bloque " + (completado ? "status-completado" : "status-proceso");
        td.textContent = etapa.label;

        // 📌 Etapas con acción
        if (etapasConAccion.includes(etapa.key)) {
          if (!usuarios[etapa.key]) {
            td.classList.add("clickable");
            td.style.cursor = "pointer";
            td.addEventListener("click", () => {
              finalizarTarea(usuarios._id, etapa.key);
            });
          }
        }
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

    // ✅ Verificar si todas las etapas están en true
    const todasEtapasCompletadas = etapas.every(etapa => usuarios[etapa.key] === true);

    if (todasEtapasCompletadas) {
      tdDescargar.classList.add("clickable-blue");
      tdDescargar.style.cursor = "pointer";

      tdDescargar.addEventListener("click", () => {
        // Aquí defines lo que hace el botón de descarga
        //console.log(`Descargar datos de ${usuarios.applicant_fullname}`);
        // window.location.href = "ruta/descarga/file.pdf";
      });
    }
    tr.appendChild(tdDescargar);

    tablaUsuarios.appendChild(tr);
  });

  actualizarPaginacion();
}