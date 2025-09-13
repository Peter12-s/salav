const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmOGE4Y2RjNi1mMGI3LTRiODMtYWIyZC01ZGQxODY2MjQxMTciLCJ1c2VyX3R5cGUiOiJBRE1JTklTVFJBRE9SIiwiaWF0IjoxNzU3NzQxNzYxLCJleHAiOjE3NTc3NDI2NjF9.zo6rfP5rsGgkgOztv5KbFEbV7z8X9ufXI5Yq1bLJeQw";
let users = [];
let filteredUsers = [];
let freelancers = [];

const preloader = document.getElementById("preloader");

if (!token) {
    alert("No hay sesión activa. Por favor, inicia sesión.");
} else {
    // Mostrar preloader
    preloader.style.display = "flex";

    // Cargar freelancers y luego aplicantes
    fetchFreelancers()
        .then(() => fetchApplicants())
        .finally(() => {
            preloader.style.display = "none";
        });
}

/**
 * Obtener freelancers
 */
async function fetchFreelancers() {
    try {
        const res = await axios.get("http://localhost:8080/api/user", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        users = res.data;
        filteredUsers = [...users];
        freelancers = users.filter(u => u.user_type === "FREELANCER");
    } catch (err) {
        if (err.response) {
            alert("❌ Error al obtener freelancers: " + err.response.data.message);
        } else {
            alert("⚠️ No se pudo conectar con el servidor");
        }
    }
}

/**
 * Obtener aplicantes
 */
async function fetchApplicants() {
    try {
        const res = await axios.get("http://localhost:8080/api/applicant", {
            headers: {
                Authorization: `Bearer ${token}`,
                freelancer: null
            }
        });
        console.log("Datos de aplicantes:", res.data);
        renderSolicitudes(res.data);
    } catch (err) {
        console.error("Error en la petición:", err);
    }
}
function renderSolicitudes(data) {
    const tbody = document.querySelector("#tablaSolicitudes tbody");
    tbody.innerHTML = "";

    data.forEach((solicitud) => {
        const persona = solicitud.person;
        const nombreCompleto = `${persona.name} ${persona.f_surname} ${persona.s_surname}`;
        const direccion = `${persona.state}, ${persona.town}, ${persona.settlement}\n${persona.address_references}`;

        const tr = document.createElement("tr");

        // === Columna nombre + tooltip ===
        const tdNombre = document.createElement("td");

        // Contenedor interno para nombre + tooltip
        const divTooltip = document.createElement("div");
        divTooltip.classList.add("tooltip-inner");

        divTooltip.textContent = nombreCompleto;

        // Tooltip
        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip-text");
        tooltip.textContent = `📍 ${direccion}\n📞 ${persona.phone}`;

        // Agregamos tooltip al contenedor
        divTooltip.appendChild(tooltip);
        tdNombre.appendChild(divTooltip);



        // === Columna select + botones ===
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
            opt.value = f.id;
            opt.textContent = `${f.name} ${f.f_surname || ""} ${f.s_surname || ""}`;
            select.appendChild(opt);
        });

        // Botón Asignar
        const btnAsignar = document.createElement("button");
        btnAsignar.textContent = "Asignar";
        btnAsignar.classList.add("btn-asignar");
        btnAsignar.disabled = true;
        btnAsignar.style.marginLeft = "8px";

        // Acción de Asignar
        btnAsignar.addEventListener("click", async () => {
            const freelancerId = select.value;
            const applicantId = select.dataset.applicantId;
            if (!freelancerId) return;

            try {
                preloader.style.display = "flex";
                await axios.put(
                    `http://localhost:8080/api/applicant/${applicantId}/assign`,
                    { freelancerId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                alert(`✅ Freelancer asignado a ${nombreCompleto}`);
            } catch (err) {
                console.error("Error asignando freelancer:", err);
                alert("❌ No se pudo asignar el freelancer.");
            } finally {
                preloader.style.display = "none";
            }
        });


        // Agregar a la fila
        tdSelect.appendChild(select);
        tdSelect.appendChild(btnAsignar);

        tr.appendChild(tdNombre);
        tr.appendChild(tdSelect);
        tbody.appendChild(tr);

        // Inicializar Select2
        $(select).select2({
            placeholder: "Selecciona Freelancer",
            allowClear: true,
            minimumResultsForSearch: 0
        });
    });
}

// Acción de Eliminar
// Detectar cambios en cualquier select2 de la tabla
$(document).on("change", ".freelancer-select", function () {
    const td = $(this).closest("td");
    const botonAsignar = td.find(".btn-asignar");
    const clearBtn = $(this).siblings(".select2").find(".select2-selection__clear");

    if ($(this).val()) {
        botonAsignar.prop("disabled", false);
        clearBtn.show();   // ✅ Mostrar "×" solo si hay selección
    } else {
        botonAsignar.prop("disabled", true);
        clearBtn.hide();   // ✅ Ocultar "×" si no hay selección
    }
});

// Al inicializar el select2
$(select).select2({
    placeholder: "Selecciona Freelancer",
    allowClear: true,
    minimumResultsForSearch: 0
});

// Mostrar/ocultar el "×" dinámicamente cuando cambia el select
$(document).on("change", ".freelancer-select", function () {
    const clearBtn = $(this).siblings(".select2").find(".select2-selection__clear");

    if ($(this).val()) {
        clearBtn.show();   // ✅ Mostrar si hay selección
    } else {
        clearBtn.hide();   // ✅ Ocultar si no hay selección
    }
});
document.querySelectorAll(".tooltip").forEach(td => {
    const tooltip = td.querySelector(".tooltip-text");

    td.addEventListener("mouseenter", (e) => {
        // Necesario forzar que el tooltip tenga display block temporal para medir
        tooltip.style.display = "block";
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = 0;

        const rect = td.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top = rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2;
        let left = rect.right + 10;

        // Ajuste si se sale del viewport a la derecha
        if (left + tooltipRect.width > window.innerWidth) {
            left = rect.left - tooltipRect.width - 10;
        }

        // Ajuste si se sale del viewport arriba/abajo
        if (top < 5) top = 5;
        if (top + tooltipRect.height > window.innerHeight) top = window.innerHeight - tooltipRect.height - 5;

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = 1;
    });

    td.addEventListener("mouseleave", () => {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = 0;
        tooltip.style.display = "none";
    });
});

