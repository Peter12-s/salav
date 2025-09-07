
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmOGE4Y2RjNi1mMGI3LTRiODMtYWIyZC01ZGQxODY2MjQxMTciLCJ1c2VyX3R5cGUiOiJBRE1JTklTVFJBRE9SIiwiaWF0IjoxNzU3MjE2OTI1LCJleHAiOjE3NTczMDMzMjV9.ac_Hkoap_rFZCBd7hVT8__O4jUR1v6PepYmgwVMCUBo";

if (!token) {
    alert("No hay sesión activa. Por favor, inicia sesión.");
} else {
    // Mostrar preloader
    preloader.style.display = "flex";

    axios.get('http://localhost:8080/api/applicant', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        console.log('Datos:', response.data);
        renderSolicitudes(response.data);
    })
    .catch(error => {
        console.error('Error en la petición:', error);
    })
    .finally(() => {
        // Ocultar preloader
        preloader.style.display = "none";
    });
}
var freelancers = [
    { id: 1, nombre: "Freelancer A" },
    { id: 2, nombre: "Freelancer B" },
    { id: 3, nombre: "Freelancer C" }
];
// Función para renderizar la tabla
function renderSolicitudes(data) {
    const tbody = document.querySelector("#tablaSolicitudes tbody");
    tbody.innerHTML = ""; // Limpia antes de renderizar

    data.forEach(solicitud => {
        const persona = solicitud.person;
        const nombreCompleto = `${persona.name} ${persona.f_surname} ${persona.s_surname}`;

        // Dirección completa
        const direccion = `${persona.state}, ${persona.town}, ${persona.settlement}\n${persona.address_references}`;

        // Fila
        const tr = document.createElement("tr");

        // Columna Nombre con tooltip
        const tdNombre = document.createElement("td");
        tdNombre.classList.add("tooltip");
        tdNombre.textContent = nombreCompleto;

        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip-text");
        tooltip.textContent = `📍 ${direccion}\n📞 ${persona.phone}`;
        tdNombre.appendChild(tooltip);

        // Columna Select Freelancer
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
            opt.textContent = f.nombre;
            select.appendChild(opt);
        });

        tdSelect.appendChild(select);

        // Agregar columnas a la fila
        tr.appendChild(tdNombre);
        tr.appendChild(tdSelect);

        // Agregar fila al tbody
        tbody.appendChild(tr);
    });
}

