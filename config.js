const API_URL = "http://localhost:8080/api/";



//funcione el menu y submenus
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
    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) { // móvil
                e.preventDefault();
                item.parentElement.classList.toggle("active");
            }
        });
    });
  }
});

if (document.getElementById('btnLogout')) {
document.getElementById('btnLogout').addEventListener('click', async () => {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_name");
    // Si guardaste más datos, elimínalos también
    window.location.href = "/login.html";
  } catch (e) {
    // console.error('Error al cerrar sesión:', e);
    alert('No se pudo cerrar la sesión. Intenta de nuevo.');
  }
});
}