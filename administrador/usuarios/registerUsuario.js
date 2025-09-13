document.addEventListener("DOMContentLoaded", () => {
  // ===================== REGISTRO DE USUARIO =====================
  const form = document.getElementById("userForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Recuperar token desde localStorage
      //const token = localStorage.getItem("access_token");
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmOGE4Y2RjNi1mMGI3LTRiODMtYWIyZC01ZGQxODY2MjQxMTciLCJ1c2VyX3R5cGUiOiJBRE1JTklTVFJBRE9SIiwiaWF0IjoxNzU3Nzc2OTQwLCJleHAiOjE3NTc4NjMzNDB9.4ztJReYUnE7d_aKCm3kkciDdQZVxRFMdP-NO74An7fw";

      if (!token) {
        alert("No tienes sesión activa. Inicia sesión primero.");
        window.location.href = "../../login/login.html";
        return;
      }

      // Datos base del usuario
      const userData = {
        name: document.getElementById("nombre").value.trim(),
        f_surname: document.getElementById("apellidoPaterno").value.trim(),
        s_surname: document.getElementById("apellidoMaterno").value.trim(),
        phone: document.getElementById("telefono").value.trim(),
        state: document.getElementById("Estado").value.trim(),
        town: document.getElementById("Municipio").value.trim(),
        settlement: document.getElementById("Colonia").value.trim(),
        address_references: document.getElementById("Refencias").value.trim(), // ⚠️ en HTML es "Refencias"
        email: document.getElementById("correo").value.trim(),
        password: document.getElementById("password").value,
        user_type: document.getElementById("rol").value.toUpperCase()
      };

      // Si el rol es EMPRESA, agregamos company_name
      if (userData.user_type === "EMPRESA") {
        const companyName = document.getElementById("companyName").value.trim();
        if (!companyName) {
          alert("Por favor, ingresa el nombre de la empresa.");
          return;
        }
        userData.company_name = companyName;
      }

      try {
        const response = await axios.post("http://localhost:8080/api/user", userData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        alert("✅ Usuario registrado con éxito!");
        form.reset();
        // Ocultar el campo empresa otra vez
        document.getElementById("companyName").style.display = "none";

      } catch (err) {
        alert("❌ Error al registrar usuario: " + (err.response?.data?.message || err.message));
        console.error("Error detalle:", err.response?.data || err.message);
      }
    });
  }
});
