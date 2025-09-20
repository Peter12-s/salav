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
            const res = await axios.get(`${API_URL}user-progress`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId: userId },
            });
            usuarios = res.data;
            filteredUsuarios = [...usuarios];
            // console.log("✅ user-progress:", usuarios);

            renderTabla();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("❌ Sesión expirada. Inicia sesión de nuevo.");
                errorServer();
            } else {
                alert("❌ Error al obtener el progreso de usuarios.");
                recarcarPagina();
            }
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
            td.style.textAlign = "start";
            td.style.color = "#888";
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
            (u.applicant_fullname || "").toLowerCase().includes(query)
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
        // const archivos = document.getElementById("archivoInput").files;
        // if (archivos.length === 0) {
        //     alert("⚠️ Debes seleccionar un archivo");
        //     return;
        // }

        // // ✅ Subir archivo
        // const formData = new FormData();
        // for (let file of archivos) {
        //     formData.append("files", file);
        // }

        // await axios.post(`${API_URL}upload/${usuarioSeleccionado._id}`, formData, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //         "Content-Type": "multipart/form-data"
        //     }
        // });

        // ✅ Actualizar progreso (PATCH)
        await axios.patch(`${API_URL}user-progress/${usuarioSeleccionado._id}`,
            { background_check: true },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // alert("✅ Archivo guardado y progreso actualizado correctamente");
       
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert("❌ Sesión expirada. Inicia sesión de nuevo.");
            errorServer();
        } else {
            alert("❌ Error al obtener el progreso de usuarios.");
            recarcarPagina();
        }
    } finally {
        modalAdjuntar.style.display = "none";
        window.location.reload();
    }
};