document.addEventListener("DOMContentLoaded", () => {

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmOGE4Y2RjNi1mMGI3LTRiODMtYWIyZC01ZGQxODY2MjQxMTciLCJ1c2VyX3R5cGUiOiJBRE1JTklTVFJBRE9SIiwiaWF0IjoxNzU3Mjc4NDU1LCJleHAiOjE3NTczNjQ4NTV9.kPCfxpcvzOW8ft9aVC3OCFzRrv5tEQfVc_CkaeM-gS4"; // Tu token válido
    const API_URL = "http://localhost:8080/api/form-request/from-enterprise"; // URL de tu API
    const form = document.querySelector(".form");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Mapear los datos del formulario a los campos que espera el backend
        const data = {
            name: document.getElementById("nombres").value.trim(),
            f_surname: document.getElementById("apellidoPaterno").value.trim(),
            s_surname: document.getElementById("apellidoMaterno").value.trim(),
            email: `test.${Date.now()}@correo.com`, // email obligatorio
            phone: document.getElementById("telefono").value.trim(),
            state: document.getElementById("estado").value.trim(),
            town: document.getElementById("municipio").value.trim(),
            settlement: document.getElementById("colonia").value.trim(),
            address_references: document.getElementById("direccionCompleta").value.trim()
        };


        // Validación de todos los campos
        const missingFields = Object.entries(data)
            .filter(([key, value]) => !value) // filtra los que estén vacíos
            .map(([key]) => key); // solo nombres de los campos

        if (missingFields.length > 0) {
            alert(`Por favor, completa los campos obligatorios: ${missingFields.join(", ")}`);
            return;
        }

        // Enviar solicitud con Axios
        axios.post(`${API_URL}applicant`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                alert("Solicitud enviada correctamente");
                form.reset();
            })
            .catch(err => {
                alert("Error al enviar la solicitud");
                console.error(err.response ? err.response.data : err);
            });
    });
});
