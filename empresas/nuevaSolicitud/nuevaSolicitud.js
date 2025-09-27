  let lastUploadResponse = null; // Variable para guardar respuesta de subida

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("access_token");
  const form = document.querySelector(".form");
  const fileInput = document.getElementById("cv");

  // Campos que se usan para crear la carpeta
  const nombreInput = document.getElementById("nombres");
  const apellidoInput = document.getElementById("apellidoPaterno");

  // Inicialmente deshabilitar el input de archivo
  fileInput.disabled = true;

  // Función para habilitar o deshabilitar input según campos
  const revisarCampos = () => {
    if (nombreInput.value.trim() && apellidoInput.value.trim()) {
      fileInput.disabled = false;
    } else {
      fileInput.disabled = true;
      fileInput.value = "";
    }
  };

  nombreInput.addEventListener("input", revisarCampos);
  apellidoInput.addEventListener("input", revisarCampos);

  let lastFormResponse = null;   // Variable para guardar respuesta del formulario

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      mostrarModalMensaje("Solo se permiten archivos PDF. ❌");
      fileInput.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      mostrarModalMensaje("El archivo supera el límite de 3 MB. ❌");
      fileInput.value = "";
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

      lastUploadResponse = response.data; // Guardar la respuesta
    //   localStorage.setItem("lastUploadResponse", JSON.stringify(lastUploadResponse)); // opcional
      mostrarModalMensaje("Archivo subido correctamente. ✅");
    } catch (error) {
      mostrarModalMensaje(`Error al subir el archivo: ${error.response?.data?.message || error.message} ❌`);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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
      const response = await axios.post(`${API_URL}form-request/from-enterprise`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

    //   localStorage.setItem("", JSON.stringify(lastFormResponse)); // opcional

      mostrarModalMensaje("Solicitud enviada correctamente ✅");
      form.reset();
      fileInput.disabled = true;
      fileInput.value = "";
    } catch (err) {
      mostrarModalMensaje("Error al enviar la solicitud ❌");
    }
  });
});
