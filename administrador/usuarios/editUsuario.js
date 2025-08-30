
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");
    const menuItems = document.querySelectorAll(".menu-item > a");

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
});