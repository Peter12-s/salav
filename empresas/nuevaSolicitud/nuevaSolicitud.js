document.addEventListener("DOMContentLoaded", () => {

    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmOGE4Y2RjNi1mMGI3LTRiODMtYWIyZC01ZGQxODY2MjQxMTciLCJuYW1lIjoiT1NNQVIgREFWSUQiLCJmX3N1cm5hbWUiOiJBUkVMTEFOTyIsInNfc3VybmFtZSI6Ik1BR0RBTEVOTyIsImNvbXBhbnlfbmFtZSI6bnVsbCwidXNlcl90eXBlIjoiQURNSU5JU1RSQURPUiIsImlhdCI6MTc1NzgyNTQzNywiZXhwIjoxNzU3ODI2MzM3fQ.IongztvdyJHA0QiAH9joub1bDmGsMhrO_OtiLdL5irY";
    const token = localStorage.getItem("access_token"); // Obtener el token del localStorage
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
        axios.post(`${API_URL}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
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
