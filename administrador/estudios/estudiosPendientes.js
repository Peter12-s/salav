const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmOGE4Y2RjNi1mMGI3LTRiODMtYWIyZC01ZGQxODY2MjQxMTciLCJ1c2VyX3R5cGUiOiJBRE1JTklTVFJBRE9SIiwiaWF0IjoxNzU3MjE2OTI1LCJleHAiOjE3NTczMDMzMjV9.ac_Hkoap_rFZCBd7hVT8__O4jUR1v6PepYmgwVMCUBo";

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

/**
 * Renderizar solicitudes
 */
function renderSolicitudes(data) {
    const tbody = document.querySelector("#tablaSolicitudes tbody");
    tbody.innerHTML = "";

    data.forEach(solicitud => {
        const persona = solicitud.person;
        const nombreCompleto = `${persona.name} ${persona.f_surname} ${persona.s_surname}`;
        const direccion = `${persona.state}, ${persona.town}, ${persona.settlement}\n${persona.address_references}`;

        const tr = document.createElement("tr");

        // Nombre + tooltip
        const tdNombre = document.createElement("td");
        tdNombre.classList.add("tooltip");
        tdNombre.textContent = nombreCompleto;

        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip-text");
        tooltip.textContent = `📍 ${direccion}\n📞 ${persona.phone}`;
        tdNombre.appendChild(tooltip);

        // Select de freelancers
        const tdSelect = document.createElement("td");
        const select = document.createElement("select");

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

        tdSelect.appendChild(select);

        tr.appendChild(tdNombre);
        tr.appendChild(tdSelect);
        tbody.appendChild(tr);
    });
}
