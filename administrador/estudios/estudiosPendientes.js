document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token"); // ✅ Token desde localStorage

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");
    const pageInput = document.getElementById("pageInput");
    const goPageBtn = document.getElementById("goPage");
    const tbody = document.querySelector("#tablaSolicitudes tbody");

    let applicants = [];
    let filteredApplicants = [];
    let freelancers = [];
    let currentPage = 1;
    let usersPerPage = getUsersPerPage(); // ✅ ahora viene del config.js

    // 📌 Ajustar usuarios por página al cambiar tamaño de pantalla
    window.addEventListener("resize", () => {
        const newLimit = getUsersPerPage();
        if (newLimit !== usersPerPage) {
            usersPerPage = newLimit;
            currentPage = 1;
            renderSolicitudes();
        }
    });

    async function fetchFreelancers() {
        try {
            const res = await axios.get(`${API_URL}user`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { user_type: "FREELANCER" }
            });
            freelancers = res.data;
        } catch (err) {

        }
    }

    async function fetchApplicants() {
        try {
            const res = await axios.get(`${API_URL}form-request?freelance_id=null`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            applicants = res.data;
            filteredApplicants = [...applicants];
            renderSolicitudes();
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

    function renderSolicitudes() {
        tbody.innerHTML = "";

        const totalPages = Math.ceil(filteredApplicants.length / usersPerPage) || 1;
        const start = (currentPage - 1) * usersPerPage;
        const end = start + usersPerPage;
        const pageData = filteredApplicants.slice(start, end);

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
                if (!freelancerId) return;

                try {
                    await axios.patch(`${API_URL}form-request/${solicitud._id}`,
                        { freelance_id: freelancerId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert(`✅ Freelancer asignado correctamente a ${select.options[select.selectedIndex].text}`);
                    tr.remove();
                    filteredApplicants = filteredApplicants.filter(a => a._id !== solicitud._id);
                    renderSolicitudes();
                } catch (err) {
                    if (err.response && err.response.status === 401) {
                        alert("❌ Sesión expirada. Inicia sesión de nuevo.");
                        errorServer();
                    } else {
                        alert("❌ Error al obtener el progreso de usuarios.");
                        recarcarPagina();
                    }
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

        // 📌 Actualizar paginación
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        pageInput.min = 1;
        pageInput.max = totalPages;
        pageInput.value = currentPage;

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // 📌 Eventos de paginación
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderSolicitudes();
        }
    });

    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredApplicants.length / usersPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderSolicitudes();
        }
    });

    goPageBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredApplicants.length / usersPerPage);
        let page = parseInt(pageInput.value);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            renderSolicitudes();
        } else {
            alert(`⚠️ Ingresa un número entre 1 y ${totalPages}`);
        }
    });

    // 📌 Filtro de búsqueda
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        filteredApplicants = applicants.filter(a => {
            const persona = a.applicant?.person;
            return (`${persona?.name || ""} ${persona?.f_surname || ""} ${persona?.s_surname || ""}`)
                .toLowerCase()
                .includes(query);
        });
        currentPage = 1;
        renderSolicitudes();

        if (filteredApplicants.length === 0) {
            tbody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:#888;">
                No se encontraron resultados
            </td></tr>`;
            document.getElementsByClassName("pagination")[0].style.display = "none";
        } else {
            document.getElementsByClassName("pagination")[0].style.display = "block";
        }
    });

    // 📌 Inicializar
    (async () => {
        await fetchFreelancers();
        await fetchApplicants();
    })();
});
