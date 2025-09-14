document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmOGE4Y2RjNi1mMGI3LTRiODMtYWIyZC01ZGQxODY2MjQxMTciLCJuYW1lIjoiT1NNQVIgREFWSUQiLCJmX3N1cm5hbWUiOiJBUkVMTEFOTyIsInNfc3VybmFtZSI6Ik1BR0RBTEVOTyIsImNvbXBhbnlfbmFtZSI6bnVsbCwidXNlcl90eXBlIjoiQURNSU5JU1RSQURPUiIsImlhdCI6MTc1NzgxMjUwNSwiZXhwIjoxNzU3ODEzNDA1fQ.Z0ucivN-yELl_S13kG4lewxw364xKT-lKk7oIzRKgE4";   // === ELEMENTOS DE LA TABLA Y CONTROLES ===
    const tbody = document.querySelector("#tablaSolicitudes tbody");
    const searchInput = document.getElementById("searchInput");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");
    const pageInput = document.getElementById("pageInput");
    const goPageBtn = document.getElementById("goPage");

    let applicants = [];

    let freelancers = [];
    let currentPage = 1;
    let usersPerPage = window.innerWidth <= 768 ? 3 : 5;

    window.addEventListener("resize", () => {
        const newLimit = window.innerWidth <= 768 ? 3 : 5;
        if (newLimit !== usersPerPage) {
            usersPerPage = newLimit;
            currentPage = 1;
            renderSolicitudes();
        }
    });

    async function fetchFreelancers() {
        try {
            const res = await axios.get("http://localhost:8080/api/user", {
                headers: { Authorization: `Bearer ${token}` },
                params: { user_type: "FREELANCER" } // lo pasamos como query param
            });

            freelancers = res.data; // ya viene filtrado del backend
            console.log(freelancers);
        } catch (err) {
            console.error(err);
            alert("❌ Error al obtener freelancers");
        }
    }

    async function fetchApplicants() {
        try {
            const res = await axios.get("http://localhost:8080/api/form-request", {
                headers: {
                    Authorization: `Bearer ${token}` // si tu API lo requiere
                },
                params: {
                    applicant_id: null // null para traer todas
                }
            });
            applicants = res.data; // opcional si quieres usar los datos afuera
            console.log(applicants[0]);

        } catch (error) {
            console.error("❌ Error al obtener solicitudes:", error);
            alert("❌ Error al obtener solicitudes");
        }
    }

    function renderSolicitudes() {
        tbody.innerHTML = "";

        const totalPages = Math.ceil(filteredApplicants.length / usersPerPage) || 1;
        const start = (currentPage - 1) * usersPerPage;
        const end = start + usersPerPage;
        const pageData = filteredApplicants.slice(start, end);

        pageData.forEach((solicitud) => {
            const persona = solicitud.person || solicitud;
            const nombreCompleto = `${persona.name} ${persona.f_surname || ""} ${persona.s_surname || ""}`;
            const direccion = `${persona.state || ""}, ${persona.town || ""}, ${persona.settlement || ""}\n${persona.address_references || ""}`;

            const tr = document.createElement("tr");

            const tdNombre = document.createElement("td");
            const divTooltip = document.createElement("div");
            divTooltip.classList.add("tooltip-inner");
            divTooltip.textContent = nombreCompleto;

            const tooltip = document.createElement("span");
            tooltip.classList.add("tooltip-text");
            tooltip.textContent = `📍 ${direccion}\n📞 ${persona.phone || ""}`;
            divTooltip.appendChild(tooltip);
            tdNombre.appendChild(divTooltip);

            const tdSelect = document.createElement("td");
            const select = document.createElement("select");
            select.classList.add("freelancer-select");
            select.dataset.applicantId = solicitud._id;

            const optionDefault = document.createElement("option");
            optionDefault.textContent = "Seleccionar freelancer";
            optionDefault.disabled = true;
            optionDefault.selected = true;
            select.appendChild(optionDefault);


            freelancers.forEach(f => {
                const opt = document.createElement("option");
                opt.value = f._id;
                opt.textContent = `${f.name} ${f.f_surname || ""} ${f.s_surname || ""}`;
                select.appendChild(opt);
            });

            const btnAsignar = document.createElement("button");
            btnAsignar.textContent = "Asignar";
            btnAsignar.classList.add("btn-asignar");
            btnAsignar.disabled = true;
            btnAsignar.style.marginLeft = "8px";

            // ✅ Función para habilitar/deshabilitar
            function toggleButton() {
                btnAsignar.disabled = !select.value;
            }

            // ✅ Eventos: change nativo y de Select2
            select.addEventListener("change", toggleButton);
            $(select).on("select2:select", toggleButton);
            $(select).on("select2:clear", toggleButton);

            // ✅ Acción de prueba
            btnAsignar.addEventListener("click", async () => {
                const freelancerId = select.value;

                if (!freelancerId) return;

                try {
                    const res = await axios.patch(`http://localhost:8080/api/user/${applicantId}`, {
                        freelance_id: freelancerId
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    alert(`✅ Freelancer asignado correctamente a ${select.options[select.selectedIndex].text}`);
                } catch (err) {
                    console.error(err);
                    alert("❌ Error al asignar freelancer");
                } finally {
                }
            });

            tdSelect.appendChild(select);
            tdSelect.appendChild(btnAsignar);

            tr.appendChild(tdNombre);
            tr.appendChild(tdSelect);
            tbody.appendChild(tr);

            // Inicializa select2
            $(select).select2({
                placeholder: "Selecciona Freelancer",
                allowClear: true,
                minimumResultsForSearch: 0
            });
        });

        // ✅ Actualizar texto de paginación
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        // ✅ Limitar input de "Ir a página"
        pageInput.min = 1;
        pageInput.max = totalPages;
        pageInput.value = currentPage;

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

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

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        filteredApplicants = applicants.filter(a => {
            const persona = a.person || a;
            return (`${persona.name} ${persona.f_surname || ""} ${persona.s_surname || ""}`)
                .toLowerCase()
                .includes(query);
        });
        currentPage = 1;
        renderSolicitudes();

        if (filteredApplicants.length === 0) {
            tbody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:#888;">
                No se encontraron resultados
            </td></tr>`;
        }
    });

    (async () => {
        await fetchFreelancers();
        await fetchApplicants();
    })();
});
