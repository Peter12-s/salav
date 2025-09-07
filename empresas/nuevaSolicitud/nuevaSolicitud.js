document.addEventListener("DOMContentLoaded", () => {

    // const token = localStorage.getItem("access_token");
    const token="yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmOGE4Y2RjNi1mMGI3LTRiODMtYWIyZC01ZGQxODY2MjQxMTciLCJ1c2VyX3R5cGUiOiJBRE1JTklTVFJBRE9SIiwiaWF0IjoxNzU3MjcxMzQwLCJleHAiOjE3NTcyNzIyNDB9.R3aJMp9kUFXt-BMMIoP3cerY82kAOLYlvXDt04PqnWU";
    const form = document.querySelector(".form");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Obtener datos del formulario por ID
        const data = {
            nombres: document.getElementById("nombres").value.trim(),
            apellido_paterno: document.getElementById("apellidoPaterno").value.trim(),
            apellido_materno: document.getElementById("apellidoMaterno").value.trim(),
            estado: document.getElementById("estado").value.trim(),
            municipio: document.getElementById("municipio").value.trim(),
            colonia: document.getElementById("colonia").value.trim(),
            direccion: document.getElementById("direccionCompleta").value.trim(),
            telefono: document.getElementById("telefono").value.trim()
            // No se envía el CV
        };

        if (!data.nombres || !data.apellido_paterno || !data.telefono) {
            alert("Por favor, completa los campos obligatorios.");
            return;
        }

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
                console.error(err);
            });
    });
});