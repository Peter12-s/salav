let candidatos = document.querySelectorAll(".candidato");
    let seleccionado = null;

    candidatos.forEach(c => {
      c.addEventListener("click", () => {
        // no permitir seleccionar aceptados
        if (c.classList.contains("aceptado")) return;

        candidatos.forEach(c => c.classList.remove("seleccionado"));
        c.classList.add("seleccionado");
        seleccionado = c;
      });
    });

    function aceptar() {
      if (seleccionado) {
        alert(`✅ Has aceptado la solicitud de ${seleccionado.textContent}`);
        seleccionado.classList.remove("seleccionado");
        seleccionado.classList.add("aceptado");
        seleccionado = null; // quitar selección activa
      } else {
        alert("⚠️ Selecciona un candidato primero.");
      }
    }

    function rechazar() {
      if (seleccionado) {
        // si ya estaba aceptado, no permitir eliminar
        if (seleccionado.classList.contains("aceptado")) {
          alert("⚠️ Este candidato ya fue aceptado y no se puede rechazar.");
          return;
        }

        alert(`❌ Has rechazado la solicitud de ${seleccionado.textContent}`);
        seleccionado.remove();
        seleccionado = null;
      } else {
        alert("⚠️ Selecciona un candidato primero.");
      }
    }