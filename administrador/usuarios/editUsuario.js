document.addEventListener("DOMContentLoaded", async () => {
    const preloader = document.getElementById("preloader");

    // ====== MENÚ HAMBURGUESA ======
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

    // ====== FORMULARIO ======
    const form = document.getElementById("userForm");
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");
    const token = "TU_TOKEN_AQUI";

    const nombre = document.getElementById("nombre");
    const apellidoPaterno = document.getElementById("apellidoPaterno");
    const apellidoMaterno = document.getElementById("apellidoMaterno");
    const telefono = document.getElementById("telefono");
    const estado = document.getElementById("Estado");
    const municipio = document.getElementById("Municipio");
    const colonia = document.getElementById("Colonia");
    const referencias = document.getElementById("Refencias");
    const correo = document.getElementById("correo");
    const password = document.getElementById("password");
    const rol = document.getElementById("rol");

    if (!userId) {
        alert("❌ No se especificó un usuario para editar");
        preloader.classList.add("hidden");
        return;
    }

    // ====== FUNCION PARA CARGAR USUARIO ======
    async function cargarUsuario() {
        try {
            const res = await axios.get(`http://localhost:8080/api/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = res.data.user || res.data;

            nombre.value = user.name || "";
            apellidoPaterno.value = user.f_surname || "";
            apellidoMaterno.value = user.s_surname || "";
            telefono.value = user.phone || "";
            estado.value = user.state || "";
            municipio.value = user.town || "";
            colonia.value = user.settlement || "";
            referencias.value = user.references || "";
            correo.value = user.email || "";
            rol.value = user.user_type || "";

        } catch (err) {
            //console.error(err);
            alert("⚠️ No se pudo cargar el usuario");
        } finally {
            // ✅ Ocultar preloader solo cuando el usuario esté listo
            preloader.classList.add("hidden");
        }
    }

    await cargarUsuario();

    // ====== GUARDAR CAMBIOS ======
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        preloader.classList.remove("hidden"); // mostrar mientras guarda

        const payload = {
            name: nombre.value,
            f_surname: apellidoPaterno.value,
            s_surname: apellidoMaterno.value,
            phone: telefono.value,
            state: estado.value,
            town: municipio.value,
            settlement: colonia.value,
            references: referencias.value,
            email: correo.value,
            user_type: rol.value
        };

        if (password.value.trim() !== "") {
            payload.password = password.value;
        }

        try {
            await axios.patch(`http://localhost:8080/api/users/${userId}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Usuario actualizado correctamente");
            window.location.href = "listarUsuarios.html";

        } catch (err) {
            //console.error(err);
            alert("❌ No se pudo actualizar el usuario");

        } finally {
            preloader.classList.add("hidden"); // ocultar al terminar
        }
    });
});
