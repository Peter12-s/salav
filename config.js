const API_URL = "http://localhost:8080/api/";

// Número de teléfono para llamar
const numeroLlamada = "521234567890"; // Formato internacional
const numeroWhatsApp = "521234567890";

// Preloader
const preloader = document.getElementById("preloader");

function showPreloader() {
  if (preloader) preloader.style.display = "flex";
}
function hidePreloader() {
  if (preloader) preloader.style.display = "none";
}
document.addEventListener("DOMContentLoaded", () => {
   // === Configurar interceptor global de Axios ===
axios.interceptors.request.use(
  (config) => {
    showPreloader();
    return config;
  },
  (error) => {
    hidePreloader();
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    hidePreloader();
    return response;
  },
  (error) => {
    hidePreloader();
    return Promise.reject(error);
  }
);
});


// Ocultar al inicio
hidePreloader();


// ===================== MENÚ Y LOGOUT =====================
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const menuItems = document.querySelectorAll(".menu-item > a");

  if (hamburger) {
    // Menú principal en móvil
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("show");
    });

    // Submenús
    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.parentElement.classList.toggle("active");
        }
      });
    });
  }
});

if (document.getElementById("btnLogout")) {
  document.getElementById("btnLogout").addEventListener("click", async () => {
    try {
      localStorage.clear();
      window.location.href = "/login.html";
    } catch (e) {
      alert("No se pudo cerrar la sesión. Intenta de nuevo.");
    }
  });
}
