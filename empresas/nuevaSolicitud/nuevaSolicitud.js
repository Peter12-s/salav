let lastUploadResponse = null; // respuesta de subida
let resposnsead = null; // respuesta de subida

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("access_token");
  const form = document.querySelector(".form");
  const fileInput = document.getElementById("cv");
  const submitBtn = form.querySelector('button[type="submit"]');

  const nombreInput = document.getElementById("nombres");
  const apellidoInput = document.getElementById("apellidoPaterno");

  // Inicialmente deshabilitar botón
  submitBtn.disabled = true;

  // Revisar si habilitar botón
  const revisarSubmit = () => {
    const camposCompletos =
      nombreInput.value.trim() &&
      apellidoInput.value.trim() &&
      document.getElementById("apellidoMaterno").value.trim() &&
      document.getElementById("telefono").value.trim() &&
      document.getElementById("estado").value.trim() &&
      document.getElementById("municipio").value.trim() &&
      document.getElementById("colonia").value.trim() &&
      document.getElementById("direccionCompleta").value.trim();

    const fileOk = fileInput.files.length > 0;
    submitBtn.disabled = !(camposCompletos && fileOk);
  };

  // Eventos para inputs
  [
    nombreInput,
    apellidoInput,
    document.getElementById("apellidoMaterno"),
    document.getElementById("telefono"),
    document.getElementById("estado"),
    document.getElementById("municipio"),
    document.getElementById("colonia"),
    document.getElementById("direccionCompleta"),
    fileInput
  ].forEach(el => el.addEventListener("input", revisarSubmit));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      mostrarModalMensaje("Debes seleccionar un archivo PDF antes de enviar ❌");
      return;
    }

    if (file.type !== "application/pdf") {
      mostrarModalMensaje("Solo se permiten archivos PDF. ❌");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      mostrarModalMensaje("El archivo supera el límite de 3 MB. ❌");
      return;
    }

    // Datos del formulario
    const data = {
      name: nombreInput.value.trim(),
      f_surname: apellidoInput.value.trim(),
      s_surname: document.getElementById("apellidoMaterno").value.trim(),
      email: `test.${Date.now()}@correo.com`,
      phone: document.getElementById("telefono").value.trim(),
      state: document.getElementById("estado").value.trim(),
      town: document.getElementById("municipio").value.trim(),
      settlement: document.getElementById("colonia").value.trim(),
      address_references: document.getElementById("direccionCompleta").value.trim()
    };

    try {

      // 1. Crear form-request
      const responseProgres = await axios.post(`${API_URL}form-request/from-enterprise`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const id_creado = responseProgres.data.user_progress_id;
      const numeroPeticion=responseProgres.data.number;


      // 2. Subir archivo
      const formData = new FormData();
      formData.append("file", file);
      const nombre = nombreInput.value.trim().slice(0, 3);
      const apellido = apellidoInput.value.trim().slice(0, 2);
      formData.append("path", `${numeroPeticion}_${nombre}${apellido}/CV`);

      const uploadRes = await axios.post(`${API_URL}google/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      lastUploadResponse = uploadRes.data;

  
      // 3. Actualizar progreso con el CV
      const body = { cv_url: lastUploadResponse.id };
      await axios.patch(`${API_URL}user-progress/${id_creado}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });

      mostrarModalMensaje("Solicitud enviada correctamente ✅");

      // Reset
      form.reset();
      lastUploadResponse = null;
      submitBtn.disabled = true;
    } catch (err) {
      console.error("Error en la solicitud:", err.response?.data || err);
      mostrarModalMensaje("Error al enviar la solicitud ❌");
    }
  });
});
