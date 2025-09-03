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

      // Recuperar token dinámico de localStorage
      // const loginData = JSON.parse(localStorage.getItem("loginResponse"));
      // const token = loginData?.access_token;

      // Provisional (para pruebas)
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmYWFiZTY0MS01YjQxLTQxNDgtODg3Ny04YjhlZDU5MjUzYTgiLCJpYXQiOjE3NTY5MTc1MzMsImV4cCI6MTc1NzAwMzkzM30.JuTJiGp83yZ8wQPC6OwZfElEfcapoyP08NsppR7uMKI";


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
        address_references: document.getElementById("Refencias").value, // ⚠️ typo en HTML
        email: document.getElementById("correo").value,
        password: document.getElementById("password").value,
        user_type: document.getElementById("rol").value.toUpperCase()
      };

      try {
        const response = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData);
          alert("❌ Error al registrar usuario: " + (errorData.message || response.status));
          return;
        }

        const result = await response.json();
        console.log("✅ Usuario creado:", result);
        alert("Usuario registrado con éxito!");
        form.reset();
      } catch (err) {
        console.error("⚠️ Error de red:", err);
        alert("Error de red al registrar usuario.");
      }
    });
  }
});
