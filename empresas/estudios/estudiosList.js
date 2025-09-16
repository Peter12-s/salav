const token = localStorage.getItem("access_token");
var usuarios = []; // Variable global para almacenar los usuarios
async function fetchUserProgress() {
    try {
        const res = await axios.get("http://localhost:8080/api/user-progress", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        usuarios = res.data; // Actualiza la variable global con los datos recibidos
        renderTabla(); // Llama a la función para renderizar la tabla con los nuevos datos
        return res.data;
    } catch (error) {
        console.error("Error al obtener user-progress:", error.response?.data || error);
    }
}

// Llamada inmediata
fetchUserProgress();



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
    const tabla = document.querySelector("table");
    tabla.innerHTML = ""; // limpiar

    if (usuarios.length === 0) {
        // Mensaje cuando no hay usuarios
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = etapas.length + 2; // +2 por columna nombre y descarga
        td.textContent = "No hay candidatos en proceso";
        td.style.textAlign = "start";
        td.style.fontStyle = "italic";
        tr.appendChild(td);
        tabla.appendChild(tr);
        return;
    }

    usuarios.forEach(usuario => {
        const tr = document.createElement("tr");

        // Columna nombre
        const tdNombre = document.createElement("td");
        tdNombre.className = "bloque nombre";
        tdNombre.textContent = usuario.nombre;
        tr.appendChild(tdNombre);

        // Columna etapas
        etapas.forEach(etapa => {
            const td = document.createElement("td");
            td.className = "bloque " + (usuario[etapa.key] ? "status-completado" : "status-proceso");
            td.textContent = etapa.label;
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
