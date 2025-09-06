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
            if (window.innerWidth <= 768) {
                e.preventDefault();
                item.parentElement.classList.toggle("active");
            }
        });
    });

    // ======== TABLA DE USUARIOS ========
    const userTable = document.getElementById("userTable");
    const searchInput = document.getElementById("searchInput");
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    const pageInput = document.getElementById("pageInput");
    const totalPagesSpan = document.getElementById("totalPages");
    const goPageBtn = document.getElementById("goPage");

    // 👇 Tomar token desde localStorage
    //const loginData = JSON.parse(localStorage.getItem("loginResponse"));
    //const token = loginData?.access_token;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmYWFiZTY0MS01YjQxLTQxNDgtODg3Ny04YjhlZDU5MjUzYTgiLCJpYXQiOjE3NTcwNDU5ODgsImV4cCI6MTc1NzEzMjM4OH0.yvh_jqn_J-eq5HK9nhkYTrJg4yV8owAFjpWXeW9W2bU";
 

    if (!token) {
        alert("No hay sesión activa. Por favor, inicia sesión primero.");
        // No redirigimos, solo mostramos alerta
        return;
    }

    let users = [];
    let filteredUsers = [];
    let currentPage = 1;
    let usersPerPage = window.innerWidth <= 768 ? 3 : 5;

    // Ajustar cantidad de usuarios por página al cambiar tamaño de ventana
    window.addEventListener("resize", () => {
        const newLimit = window.innerWidth <= 768 ? 3 : 5;
        if (newLimit !== usersPerPage) {
            usersPerPage = newLimit;
            currentPage = 1;
            renderUsersPage();
        }
    });

    // ======= FUNCIONES =======
    async function fetchUsers() {
        try {
            const res = await fetch("http://localhost:8080/api/users", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                const error = await res.json();
                console.error("Error:", error);
                alert("❌ Error al obtener usuarios: " + error.message);
                return;
            }

            users = await res.json(); // ya viene en JSON desde el back
            filteredUsers = [...users];
            renderUsersPage();
        } catch (err) {
            console.error("Error de red:", err);
            alert("⚠️ No se pudo conectar con el servidor");
        }
    }

    function renderUsersPage() {
        userTable.innerHTML = "";
        const start = (currentPage - 1) * usersPerPage;
        const end = start + usersPerPage;
        const pageUsers = filteredUsers.slice(start, end);

        pageUsers.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.name} ${user.f_surname} ${user.s_surname}</td>
                <td>${user.phone || ""}</td>
                <td>${user.state || ""}, ${user.town || ""}, ${user.settlement || ""}</td>
                <td>${user.email || ""}</td>
                <td>${user.user_type || ""}</td>
                <td class="actions">
                <button title="Editar" onclick="editarUsuario('${user._id}')">✏️</button>
                <button title="Eliminar" onclick="alert('Eliminar: ${user.name}')">🗑️</button>
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
        filteredUsers = users.filter(user =>
            (`${user.name} ${user.f_surname} ${user.s_surname}`).toLowerCase().includes(query)
        );
        currentPage = 1;
        renderUsersPage();
    });

    // Llamada inicial
    fetchUsers();
});

// === FUNCIÓN GLOBAL PARA EDITAR ===
function editarUsuario(userId) {
    window.location.href = `editUsuario.html?id=${userId}`;
}
