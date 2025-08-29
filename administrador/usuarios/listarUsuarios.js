// ====== MENÚ RESPONSIVO Y SUBMENÚ ======
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

// ====== DATOS DE USUARIOS (DUMMY) ======
const users = [
    { nombre: "Juan Pérez", telefono: "5551234567", direccion: "Av. Reforma 123", correo: "juan@example.com", sexo: "Masculino", rol: "Administrador" },
    { nombre: "María López", telefono: "5559876543", direccion: "Calle 5 #234", correo: "maria@example.com", sexo: "Femenino", rol: "Freelance" },
    { nombre: "Carlos Ramírez", telefono: "5556789123", direccion: "Col. Centro", correo: "carlos@example.com", sexo: "Masculino", rol: "Empresa" },
    // ...agrega más usuarios si lo necesitas
];

// ====== TABLA Y PAGINACIÓN ======
document.addEventListener("DOMContentLoaded", () => {
    const userTable = document.getElementById("userTable");
    const searchInput = document.getElementById("searchInput");
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    const pageInput = document.getElementById("pageInput");
    const totalPagesSpan = document.getElementById("totalPages");
    const goPageBtn = document.getElementById("goPage");

    let usersPerPage = window.innerWidth <= 768 ? 3 : 5;

    window.addEventListener("resize", () => {
        const newLimit = window.innerWidth <= 768 ? 3 : 5;
        if (newLimit !== usersPerPage) {
            usersPerPage = newLimit;
            currentPage = 1;
            renderUsersPage();
        }
    });

    let currentPage = 1;
    let filteredUsers = [...users];

    // Renderiza la tabla de usuarios paginada
    function renderUsersPage() {
        userTable.innerHTML = "";
        const start = (currentPage - 1) * usersPerPage;
        const end = start + usersPerPage;
        const pageUsers = filteredUsers.slice(start, end);

        pageUsers.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.nombre}</td>
                <td>${user.telefono}</td>
                <td>${user.direccion}</td>
                <td>${user.correo}</td>
                <td>${user.sexo}</td>
                <td>${user.rol}</td>
                <td class="actions">
                    <button title="Editar" onclick="alert('Editar: ${user.nombre}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4CAF50" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM21.41 
                            6.34c.39-.39.39-1.02 0-1.41l-2.34-2.34a1.003 
                            1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 
                            1.84-1.83z"/>
                        </svg>
                    </button>
                    <button title="Eliminar" onclick="alert('Eliminar: ${user.nombre}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#F44336" viewBox="0 0 24 24">
                            <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 
                            1H5v2h14V4h-4.5l-1-1z"/>
                        </svg>
                    </button>
                </td>
            `;
            userTable.appendChild(row);
        });

        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        totalPagesSpan.textContent = totalPages;
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        pageInput.value = currentPage;

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Navegación
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderUsersPage();
        }
    });

    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderUsersPage();
        }
    });

    goPageBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        let page = parseInt(pageInput.value);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            renderUsersPage();
        }
    });

    // Filtrar usuarios
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        filteredUsers = users.filter(user => user.nombre.toLowerCase().includes(query));
        currentPage = 1;
        renderUsersPage();
    });

    // Render inicial
    renderUsersPage();
});