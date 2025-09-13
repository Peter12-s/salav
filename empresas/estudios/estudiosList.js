 // Simulación de datos recibidos desde backend
    const usuarios = [
        {
            user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            nombre: "Juan Perez",
            application_accepted: true,
            candidate_contacted: true,
            visit_scheduled: true,
            background_check: false,
            visit_complete: true,
            documenting_information: false,
            evaluation_complete: false
        },
        {
            user_id: "a12ac10b-1111-2222-3333-444444444444",
            nombre: "Maria Juana",
            application_accepted: true,
            candidate_contacted: false,
            visit_scheduled: true,
            background_check: true,
            visit_complete: true,
            documenting_information: true,
            evaluation_complete: true
        },
        {
            user_id: "b23bc20c-58cc-4372-a567-0e02b2c3d479",
            nombre: "Carlos Lopez",
            application_accepted: true,
            candidate_contacted: true,
            visit_scheduled: false,
            background_check: false,
            visit_complete: false,
            documenting_information: false,
            evaluation_complete: false
        },
        {
            user_id: "c34cd30d-58cc-4372-a567-0e02b2c3d479",
            nombre: "Ana Gomez",
            application_accepted: true,
            candidate_contacted: true,
            visit_scheduled: true,
            background_check: true,
            visit_complete: true,
            documenting_information: false,
            evaluation_complete: false
        },
        {
            user_id: "d45de40e-58cc-4372-a567-0e02b2c3d479",
            nombre: "Luis Martinez",
            application_accepted: true,                 
            candidate_contacted: true,
            visit_scheduled: true,
            background_check: true,
            visit_complete: true,
            documenting_information: true,
            evaluation_complete: false
        },
        {
            user_id: "e56ef50f-58cc-4372-a567-0e02b2c3d479",
            nombre: "Sofia Rodriguez",
            application_accepted: true,
            candidate_contacted: false,
            visit_scheduled: false,
            background_check: false,
            visit_complete: false,
            documenting_information: false,
            evaluation_complete: false
        },
        {
            user_id: "f67fg60g-58cc-4372-a567-0e02b2c3d479",
            nombre: "Miguel Torres",
            application_accepted: true,
            candidate_contacted: true,
            visit_scheduled: true,
            background_check: true,
            visit_complete: true,
            documenting_information: true,
            evaluation_complete: true
        },
        {
            user_id: "g78gh70h-58cc-4372-a567-0e02b2c3d479",
            nombre: "Laura Fernandez",
            application_accepted: true,
            candidate_contacted: true,
            visit_scheduled: false,
            background_check: false,   
            visit_complete: false,
            documenting_information: false,
            evaluation_complete: false
        },
        {
            user_id: "h89hi80i-58cc-4372-a567-0e02b2c3d479",
            nombre: "Diego Ramirez",
            application_accepted: true,
            candidate_contacted: true,
            visit_scheduled: true,
            background_check: true,
            visit_complete: true,
            documenting_information: false,
            evaluation_complete: false
        },
        {
            user_id: "i90ij90j-58cc-4372-a567-0e02b2c3d479",
            nombre: "Elena Sanchez",
            application_accepted: true,
            candidate_contacted: false,
            visit_scheduled: false,   
            background_check: false,
            visit_complete: false,
            documenting_information: false,
            evaluation_complete: false
        }
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

    function renderTabla() {
        const tabla = document.querySelector("table");
        tabla.innerHTML = ""; // limpiar

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

    // Llamar al render inicial
    renderTabla();