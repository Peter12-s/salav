  const userId = params.get("id");
  const token = localStorage.getItem("access_token");

document.addEventListener("DOMContentLoaded", async () => {
  // ===================== FORMULARIO =====================
  const form = document.getElementById("userForm");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);

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
  const companyName = document.getElementById("companyName");
  const nombreFields = document.querySelector(".nombre");

  if (!userId) {
    mostrarModalMensaje("No se especificó un usuario para editar ❌");
    errorServer();
  }

  // ===================== FUNCION PARA CARGAR USUARIO =====================
  async function cargarUsuario() {
    try {
      const res = await axios.get(`${API_URL}user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data.user || res.data;

      // Rol
      rol.value = user.user_type || "";

      if (rol.value === "EMPRESA") {
        companyName.style.display = "block";
        nombreFields.style.display = "none";
        companyName.value = user.company_name || "";
      } else {
        companyName.style.display = "none";
        nombreFields.style.display = "flex";
        nombre.value = user.name || "";
        apellidoPaterno.value = user.f_surname || "";
        apellidoMaterno.value = user.s_surname || "";
      }

      // Campos de contacto
      telefono.value = user.phone || "";
      estado.value = user.state || "";
      municipio.value = user.town || "";
      colonia.value = user.settlement || "";
      referencias.value = user.address_references || ""; // ⚠️ corregido
      correo.value = user.email || "";

    } catch (err) {
      console.error(err);
      mostrarModalMensaje(" No se pudo cargar el usuario ⚠️");
    } finally {
      hidePreloader();
    }
  }

  await cargarUsuario();

  // ===================== LOGICA DE CAMBIO DE ROL =====================
  rol.addEventListener("change", () => {
    if (rol.value === "EMPRESA") {
      companyName.style.display = "block";
      nombreFields.style.display = "none";
    } else {
      companyName.style.display = "none";
      nombreFields.style.display = "flex";
    }
  });

  // ===================== GUARDAR CAMBIOS =====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showPreloader();

    const payload = {
      user_type: rol.value,
      phone: telefono.value,
      state: estado.value,
      town: municipio.value,
      settlement: colonia.value,
      address_references: referencias.value, // ⚠️ corregido
      email: correo.value
    };

    if (rol.value === "EMPRESA") {
      payload.company_name = companyName.value;
    } else {
      payload.name = nombre.value;
      payload.f_surname = apellidoPaterno.value;
      payload.s_surname = apellidoMaterno.value;
    }

    if (password.value.trim() !== "") {
      payload.password = password.value;
    }

    try {
      await axios.patch(`${API_URL}user/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      mostrarModalMensaje("Usuario actualizado correctamente ✅");
      window.location.href = "listarUsuarios.html";

    } catch (err) {
      console.error(err);
      alert("❌ No se pudo actualizar el usuario");
    } finally {
      hidePreloader();
    }
  });
});
