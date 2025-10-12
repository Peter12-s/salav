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
      const userType = document.getElementById("rol").value.toUpperCase();
      const userData = {
        phone: document.getElementById("telefono").value.trim(),
        state: document.getElementById("Estado").value.trim(),
        town: document.getElementById("Municipio").value.trim(),
        settlement: document.getElementById("Colonia").value.trim(),
        address_references: document.getElementById("Refencias").value.trim(),
        email: document.getElementById("correo").value.trim(),
        password: document.getElementById("password").value,
        user_type: userType,
      };

      if (userType === "EMPRESA") {
        // Asegúrate que el campo esté visible y tenga valor
        const companyName = document.getElementById("companyNameField").value.trim();
        if (!companyName) {
          mostrarModalMensaje("Por favor, ingresa el nombre de la empresa.");
          return;
        }
        userData.company_name = companyName;
        // Elimina los campos de nombre si existen
        delete userData.name;
        delete userData.f_surname;
        delete userData.s_surname;
      } else {
        userData.name = document.getElementById("nombre").value.trim();
        userData.f_surname = document.getElementById("apellidoPaterno").value.trim();
        userData.s_surname = document.getElementById("apellidoMaterno").value.trim();
        // Elimina company_name si existe
        delete userData.company_name;
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
        document.getElementById("companyName").style.display = "none";
        document.querySelector(".nombre").style.display = "grid";
      } catch (err) {
        mostrarModalMensaje(
          "❌ Error al registrar usuario: " +
          (err.response?.data?.message || err.message)
        );
      }
    });
  }
});
function renderSolicitudes() { }