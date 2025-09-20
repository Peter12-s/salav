document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("_id");

    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    const pageInput = document.getElementById("pageInput");
    const goPageBtn = document.getElementById("goPage");
    const totalPagesSpan = document.getElementById("totalPages");
    const tabla = document.querySelector("table");
    const searchInput = document.getElementById("searchInput");

    let usuarios = [];
    let filteredUsuarios = [];
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
            const res = await axios.get(`${API_URL}user-progress`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId: userId },
            });
            usuarios = res.data;
            filteredUsuarios = [...usuarios];
            console.log("✅ user-progress:", usuarios);
            
            renderTabla();
        } catch (error) {
            console.error("❌ Error al obtener user-progress:", error.response?.data || error);
        }
    }

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
    function renderTabla() {
        tabla.innerHTML = "";

        const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage) || 1;
        totalPagesSpan.textContent = totalPages;
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        pageInput.value = currentPage;

        if (filteredUsuarios.length === 0) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = etapas.length + 2;
            td.textContent = "No se encontraron resultados";
            td.style.textAlign = "center";
            td.style.color = "#888";
            tr.appendChild(td);
            tabla.appendChild(tr);
            return;
        }

        const start = (currentPage - 1) * usersPerPage;
        const end = start + usersPerPage;
        const pageData = filteredUsuarios.slice(start, end);

        pageData.forEach(usuarios => {
            const tr = document.createElement("tr");

            // 📌 Columna nombre
            const tdNombre = document.createElement("td");
            tdNombre.className = "bloque nombre";
            tdNombre.textContent = usuarios.applicant_fullname.split(" ")[0] || "Sin nombre";
            tr.appendChild(tdNombre);

            // 📌 Columna etapas
            etapas.forEach(etapa => {
                const td = document.createElement("td");
                td.className = "bloque " + (usuarios[etapa.key] ? "status-completado" : "status-proceso");
                td.textContent = etapa.label;


                // ✅ Si la etapa está en etapasConAccion, agregamos evento de clic
                if (etapasConAccion.includes(etapa.key)) {
                    td.style.cursor = "pointer"; // indicar que es clickeable
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

            tabla.appendChild(tr);
        });

        // 📌 Habilitar/deshabilitar botones de paginación
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
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
            alert(`⚠️ Ingresa un número entre 1 y ${totalPages}`);
        }
    });

    // 📌 Filtro de búsqueda
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        filteredUsuarios = usuarios.filter(u =>
            (u.nombre || "").toLowerCase().includes(query)
        );
        currentPage = 1;
        renderTabla();
    });

    // 📌 Inicializar
    fetchUserProgress();
});

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

// 🔹 Función para confirmar y mandar petición de actualización
async function finalizarTarea(userId, etapaKey) {
  const confirmar = await mostrarModal("¿Deseas finalizar la tarea?");
  if (!confirmar) return;

  try {
    await axios.put(
      `http://localhost:8080/api/user-progress/${userId}`,
      { status: etapaKey },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Mensaje de éxito en modal
    await mostrarModal("✅ Tarea finalizada con éxito");
    fetchUserProgress();
  } catch (error) {
    console.error("Error al actualizar tarea:", error.response?.data || error);
    await mostrarModal("❌ Ocurrió un error al finalizar la tarea");
  }
}
