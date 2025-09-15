const token = localStorage.getItem("access_token"); 
const freelanceId = localStorage.getItem("user_id"); // 👈 el id del freelancer

async function fetchUserProgress() {
  try {
    const res = await axios.get("http://localhost:8080/api/user-progress", {
      headers: {
        Authorization: `Bearer ${token}` 
      },
      params: {
        freelance_id: freelanceId // ✅ enviamos parámetro
      }
    });

    console.log("Progreso del usuario:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error al obtener user-progress:", error.response?.data || error);
  }
}

// Llamada inmediata
fetchUserProgress();
