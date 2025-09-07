document.addEventListener("DOMContentLoaded", () => {
    // Menú hamburguesa y submenús
    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");
    const menuItems = document.querySelectorAll(".menu-item > a");
    hamburger.addEventListener("click", () => menu.classList.toggle("show"));
    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                item.parentElement.classList.toggle("active");
            }
        });
    });

 const token = localStorage.getItem("access_token");
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

        axios.post(`${API_URL}empresas/solicitud`, data, {
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