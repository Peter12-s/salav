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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmYWFiZTY0MS01YjQxLTQxNDgtODg3Ny04YjhlZDU5MjUzYTgiLCJ1c2VyX3R5cGUiOiJBRE1JTklTVFJBRE9SIiwiaWF0IjoxNzU3MTg1ODAxLCJleHAiOjE3NTcxODY3MDF9.yPjaQKjfhKLJJ9vNM1XjASNYP5cFlVgd06I-IxLqKLc";

    if (!token) {
        alert("No hay sesión activa. Por favor, inicia sesión.");
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
        const res = await axios.get("http://localhost:8080/api/users", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        // Si la respuesta es exitosa
        users = res.data; // axios ya lo da en JSON
        filteredUsers = [...users];
        renderUsersPage();
    } catch (err) {
        if (err.response) {
            console.error("Error:", err.response.data);
            alert("❌ Error al obtener usuarios: " + err.response.data.message);
        } else {
            console.error("Error de red:", err);
            alert("⚠️ No se pudo conectar con el servidor");
        }
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
