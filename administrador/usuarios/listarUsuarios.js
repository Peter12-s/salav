 const token = localStorage.getItem("access_token");
document.addEventListener("DOMContentLoaded", () => {
    // ======== TABLA DE USUARIOS ========
    const userTable = document.getElementById("userTable");
    const searchInput = document.getElementById("searchInput");
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    const pageInput = document.getElementById("pageInput");
    const totalPagesSpan = document.getElementById("totalPages");
    const goPageBtn = document.getElementById("goPage");

    // 👇 Token desde localStorage
   
    if (!token) {
        alert("No hay sesión activa. Por favor, inicia sesión.");
            errorServer();
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
            const res = await axios.get(`${API_URL}user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            // 🚨 Aquí la API devuelve un array plano
            users = res.data;
            filteredUsers = [...users];

            renderUsersPage();
        } catch (err) {
            if (err.response) {
                alert("❌ Error al obtener usuarios: " + err.response.data.message);
            } else {
                alert("⚠️ No se pudo conectar con el servidor");
            }
        }
    }

    async function eliminarUsuario(userId, userName) {
        if (!confirm(`¿Seguro que deseas eliminar al usuario "${userName}"?`)) {
            return;
        }

        try {
            await axios.delete(`${API_URL}user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            alert("✅ Usuario eliminado correctamente");
            await fetchUsers(); // refrescar tabla
        } catch (err) {
            if (err.response) {
                alert("❌ No se pudo eliminar: " + err.response.data.message);
            } else {
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

            // 👇 Si es empresa muestra company_name, si no muestra nombre completo
            const displayName = user.user_type === "EMPRESA"
                ? user.company_name || "(Sin nombre de empresa)"
                : `${user.name || ""} ${user.f_surname || ""} ${user.s_surname || ""}`.trim();

            row.innerHTML = `
                <td>${displayName}</td>
                <td>${user.phone || ""}</td>
                <td>${user.state || ""}, ${user.town || ""}, ${user.settlement || ""}</td>
                <td>${user.email || ""}</td>
                <td>${user.user_type || ""}</td>
                <td class="actions">
                    <button title="Editar" onclick="editarUsuario('${user._id}')">✏️</button>
                    <button title="Eliminar" onclick="eliminarUsuario('${user._id}', '${displayName}')">🗑️</button>
                </td>
            `;
            userTable.appendChild(row);
        });

        const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
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

    // Filtrar usuarios (incluye company_name si es EMPRESA)
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        filteredUsers = users.filter(user => {
            const displayName = user.user_type === "EMPRESA"
                ? user.company_name || ""
                : `${user.name || ""} ${user.f_surname || ""} ${user.s_surname || ""}`;
            return displayName.toLowerCase().includes(query);
        });
        currentPage = 1;
        renderUsersPage();
    });

    // Llamada inicial
    fetchUsers();

    // Expongo la función eliminar al scope global
    window.eliminarUsuario = eliminarUsuario;
});

// === FUNCIÓN GLOBAL PARA EDITAR ===
function editarUsuario(userId) {
    window.location.href = `editUsuario.html?id=${userId}`;
}
