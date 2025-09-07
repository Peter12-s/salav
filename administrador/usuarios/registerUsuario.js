document.addEventListener("DOMContentLoaded", () => {
  // ===================== REGISTRO DE USUARIO =====================
  const form = document.getElementById("userForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Recuperar token desde localStorage
      //const token = localStorage.getItem("access_token");
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmOGE4Y2RjNi1mMGI3LTRiODMtYWIyZC01ZGQxODY2MjQxMTciLCJ1c2VyX3R5cGUiOiJBRE1JTklTVFJBRE9SIiwiaWF0IjoxNzU3MjE2OTI1LCJleHAiOjE3NTcyMTc4MjV9.rrcJ5mQV1Huzrw_9Hb_tFO3eCGXdoFHMadg-TZpnD14";

      if (!token) {
        alert("No tienes sesión activa. Inicia sesión primero.");
        window.location.href = "../../login/login.html";
        return;
      }

      const userData = {
        name: document.getElementById("nombre").value,
        f_surname: document.getElementById("apellidoPaterno").value,
        s_surname: document.getElementById("apellidoMaterno").value,
        phone: document.getElementById("telefono").value,
        state: document.getElementById("Estado").value,
        town: document.getElementById("Municipio").value,
        settlement: document.getElementById("Colonia").value,
        address_references: document.getElementById("Refencias").value, // ⚠️ ojo: en HTML está mal escrito
        email: document.getElementById("correo").value,
        password: document.getElementById("password").value,
        user_type: document.getElementById("rol").value.toUpperCase()
      };

      try {
        const response = await axios.post("http://localhost:8080/api/user", userData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        //console.log("✅ Usuario creado:", response.data);
        alert("Usuario registrado con éxito!");
        form.reset();

      } catch (err) {
        //console.error("❌ Error al registrar usuario:", err.response?.data || err.message);
        alert("Error al registrar usuario: " + (err.response?.data?.message || err.message));
      }
    });
  }
});

