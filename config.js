
const API_URL = "https://nest-api-217870254419.us-central1.run.app/api/";
// const API_URL="http://localhost:8080/api/";
const mensajeWhatsApp = encodeURIComponent("Hola, quisiera abrir una cuenta");


// Número de teléfono para llamar y conseguir cuenta 
const numeroLlamada = "7731154556";
const numeroWhatsApp = "7731154556";

// ===================== PRELOADER =====================
const preloader = document.getElementById("preloader");

function showPreloader() {
  if (preloader) preloader.style.display = "flex";
}
function hidePreloader() {
  if (preloader) preloader.style.display = "none";
}

// Configuración global de Axios con preloader
document.addEventListener("DOMContentLoaded", () => {
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

// Ocultar preloader al inicio
hidePreloader();

// ===================== FUNCIÓN GLOBAL PAGINACIÓN =====================
function getUsersPerPage() {
  return window.innerWidth <= 768 ? 3 : 5;
}

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


function getBasePath() {
  const parts = location.pathname.split('/').filter(Boolean);
  return (location.hostname.endsWith('github.io') && parts.length) ? `/${parts[0]}` : '';
}

if (document.getElementById("btnLogout")) {
  document.getElementById("btnLogout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = location.origin + getBasePath() + "/login.html";
  });
}

function errorServer() {
  localStorage.clear();
  window.location.href = location.origin + getBasePath() + "/login.html";
}
if (document.getElementById("btnLogout")) {
  document.getElementById("btnLogout").addEventListener("click", async () => {
    try {
      localStorage.clear();
      window.location.href = location.origin + getBasePath() + "/login.html";
    } catch (e) {
      mostrarModalMensaje("No se pudo cerrar la sesión. Intenta de nuevo.");
    }
  });
}

function recargarPagina() {
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      mostrarModalMensaje("⚠️ Token expirado o inválido. Cerrando sesión...");
      setTimeout(() => {
        errorServer();
      }, 1000);
    }
    return Promise.reject(error);
  }
);