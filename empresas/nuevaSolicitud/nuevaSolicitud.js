let lastUploadResponse = null; // Guardar respuesta de subida

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("access_token");
  const form = document.querySelector(".form");
  const fileInput = document.getElementById("cv");
  const submitBtn = form.querySelector('button[type="submit"]'); // botón de enviar

  const nombreInput = document.getElementById("nombres");
  const apellidoInput = document.getElementById("apellidoPaterno");

  // Inicialmente deshabilitar input y botón
  fileInput.disabled = true;
  submitBtn.disabled = true;

  // Revisar si el botón de submit puede habilitarse
  const revisarSubmit = () => {
    const camposCompletos = nombreInput.value.trim() && apellidoInput.value.trim();
    submitBtn.disabled = !(lastUploadResponse && camposCompletos);
  };

  // Revisar si se habilita el input de archivo
  const revisarCampos = () => {
    if (nombreInput.value.trim() && apellidoInput.value.trim()) {
      fileInput.disabled = false;
    } else {
      fileInput.disabled = true;
      fileInput.value = "";
      lastUploadResponse = null;
    }
    revisarSubmit();
  };

  nombreInput.addEventListener("input", revisarCampos);
  apellidoInput.addEventListener("input", revisarCampos);

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) {
      lastUploadResponse = null;
      revisarSubmit();
      return;
    }

    if (file.type !== "application/pdf") {
      mostrarModalMensaje("Solo se permiten archivos PDF. ❌");
      fileInput.value = "";
      lastUploadResponse = null;
      revisarSubmit();
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      mostrarModalMensaje("El archivo supera el límite de 3 MB. ❌");
      fileInput.value = "";
      lastUploadResponse = null;
      revisarSubmit();
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const nombre = nombreInput.value.trim().slice(0, 3);
      const apellido = apellidoInput.value.trim().slice(0, 2);
      formData.append("path", `${nombre}${apellido}/CV`);

      const response = await axios.post(`${API_URL}google/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      lastUploadResponse = response.data;
      mostrarModalMensaje("Archivo subido correctamente. ✅");
      revisarSubmit(); // habilitar submit
    } catch (error) {
      lastUploadResponse = null;
      revisarSubmit();
      mostrarModalMensaje(`Error al subir el archivo: ${error.response?.data?.message || error.message} ❌`);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!lastUploadResponse) {
      mostrarModalMensaje("Debes subir un archivo antes de enviar la solicitud ❌");
      return;
    }

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

    const missingFields = Object.entries(data)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      mostrarModalMensaje(`Por favor, completa los campos obligatorios: ${missingFields.join(", ")}`);
      return;
    }

    try {
      const responseProgres = await axios.post(`${API_URL}form-request/from-enterprise`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      mostrarModalMensaje("Solicitud enviada correctamente ✅");
      const id_creado = response.data.applicant._id;

      // Actualizar progreso SOLO si la subida fue exitosa
      const body = { background_check: true, cv_url: lastUploadResponse.id };
      await axios.patch(`${API_URL}user-progress/${id_creado}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      form.reset();
      fileInput.disabled = true;
      fileInput.value = "";
      lastUploadResponse = null;
      submitBtn.disabled = true;
    } catch (err) {
      mostrarModalMensaje("Error al enviar la solicitud ❌");
    }
  });
});
