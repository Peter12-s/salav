
document.addEventListener("DOMContentLoaded", () => {
 obtenerLocalStorage();

  const form = document.getElementById("userForm");
   if (!token) {
        mostrarModalMensaje("No tienes sesión activa. Inicia sesión primero.");
        errorServer();
      }
      
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userData = {
        name: document.getElementById("nombre").value.trim(),
        f_surname: document.getElementById("apellidoPaterno").value.trim(),
        s_surname: document.getElementById("apellidoMaterno").value.trim(),
        phone: document.getElementById("telefono").value.trim(),
        state: document.getElementById("Estado").value.trim(),
        town: document.getElementById("Municipio").value.trim(),
        settlement: document.getElementById("Colonia").value.trim(),
        address_references: document.getElementById("Refencias").value.trim(),
        email: document.getElementById("correo").value.trim(),
        password: document.getElementById("password").value,
        user_type: document.getElementById("rol").value.toUpperCase(),
      };

      if (userData.user_type === "EMPRESA") {
        const companyName = document.getElementById("companyNameField").value.trim();
        if (!companyName) {
          mostrarModalMensaje("Por favor, ingresa el nombre de la empresa.");
          return;
        }
        userData.company_name = companyName;
      }

      try {
        const response = await axios.post(`${API_URL}user`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        mostrarModalMensaje("✅ Usuario registrado con éxito!");
        form.reset();
        document.getElementById("companyNameField").style.display = "none";
      } catch (err) {
        mostrarModalMensaje(
          "❌ Error al registrar usuario: " +
            (err.response?.data?.message || err.message)
        );
        // console.error("Error detalle:", err.response?.data || err.message);
      }
    });
  }
});

function renderSolicitudes() {}