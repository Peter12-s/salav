document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("userForm");

    // 👉 Obtener ID de la URL
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (!userId) {
        alert("❌ No se especificó un usuario para editar");
        //window.location.href = "listarUsuarios.html";
        return;
    }

    // 👉 Tomar token (de momento fijo)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmYWFiZTY0MS01YjQxLTQxNDgtODg3Ny04YjhlZDU5MjUzYTgiLCJpYXQiOjE3NTcwNDU5ODgsImV4cCI6MTc1NzEzMjM4OH0.yvh_jqn_J-eq5HK9nhkYTrJg4yV8owAFjpWXeW9W2bU"; 

    // 👉 Inputs
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

    // 👉 Obtener datos del usuario
    try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("Error al cargar usuario");
        }

        const user = await res.json();

        // Llenar formulario
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
        // password.value lo dejamos vacío por seguridad
    } catch (err) {
        console.error(err);
        alert("⚠️ No se pudo cargar el usuario");
    }

    // 👉 Guardar cambios (PATCH)
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

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

        // Solo enviar password si se escribió algo
        if (password.value.trim() !== "") {
            payload.password = password.value;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error("Error al actualizar usuario");
            }

            alert("✅ Usuario actualizado correctamente");
            window.location.href = "listarUsuarios.html";
        } catch (err) {
            console.error(err);
            alert("❌ No se pudo actualizar el usuario");
        }
    });
});


