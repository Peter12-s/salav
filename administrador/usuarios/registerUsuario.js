document.addEventListener("DOMContentLoaded", () => {
  // ===================== MENÚ =====================
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const menuItems = document.querySelectorAll(".menu-item > a");

  // Menú principal en móvil
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("show");
    });
  }

  // Submenús
  menuItems.forEach(item => {
    item.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) { // móvil
        e.preventDefault();
        item.parentElement.classList.toggle("active");
      }
    });
  });

  // ===================== REGISTRO DE USUARIO =====================
  const form = document.getElementById("userForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Recuperar token desde localStorage
      const token = localStorage.getItem("access_token");

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
        const response = await axios.post("http://localhost:8080/api/users", userData, {
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

