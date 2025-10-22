document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".registro-form");
  const tablaBody = document.querySelector(".tabla-autorizados tbody");

  // Recuperar datos de localStorage
  let usuarios = JSON.parse(localStorage.getItem("usuariosAutorizados")) || [];

  // Renderizar tabla
  const renderTabla = () => {
    tablaBody.innerHTML = "";
    usuarios.forEach((u, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${String(index + 1).padStart(3, "0")}</td>
        <td>${u.nombre}</td>
        <td>${u.cedula}</td>
        <td>${u.tipoUsuario}</td>
        <td>${u.facultad}</td>
        <td>${u.placa}</td>
        <td>${u.tipoVehiculo}</td>
        <td>${u.correo}</td>
        <td>
          <button class="btn-editar">Editar</button>
          <button class="btn-eliminar">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);

      // Evento eliminar
      fila.querySelector(".btn-eliminar").addEventListener("click", () => {
        if (confirm(`¿Desea eliminar al usuario "${u.nombre}"?`)) {
          usuarios.splice(index, 1);
          guardarYRenderizar();
        }
      });

      // Evento editar
      fila.querySelector(".btn-editar").addEventListener("click", () => {
        document.getElementById("nombre").value = u.nombre;
        document.getElementById("cedula").value = u.cedula;
        document.getElementById("tipoUsuario").value = u.tipoUsuario;
        document.getElementById("facultad").value = u.facultad;
        document.getElementById("placa").value = u.placa;
        document.getElementById("tipoVehiculo").value = u.tipoVehiculo;
        document.getElementById("correo").value = u.correo;

        form.dataset.editIndex = index; // Marca el índice en edición
      });
    });
  };

  const guardarYRenderizar = () => {
    localStorage.setItem("usuariosAutorizados", JSON.stringify(usuarios));
    renderTabla();
  };

  // --- 🔍 Validar cédula, correo y placa ---
  const validarCampos = (cedula, correo, placa) => {
    const cedulaValida = /^\d{10}$/.test(cedula);
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    const placaValida = /^[A-Z]{3}-\d{4}$/.test(placa);

    if (!cedulaValida) {
      alert("⚠️ La cédula debe tener exactamente 10 dígitos numéricos.");
      return false;
    }
    if (!correoValido) {
      alert("⚠️ Ingrese un correo institucional válido.");
      return false;
    }
    if (!placaValida) {
      alert("⚠️ La placa debe tener el formato ABC-1234 (3 letras mayúsculas, un guion y 4 números).");
      return false;
    }

    return true;
  };

  // Registrar / actualizar usuario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoUsuario = {
      nombre: document.getElementById("nombre").value.trim(),
      cedula: document.getElementById("cedula").value.trim(),
      tipoUsuario: document.getElementById("tipoUsuario").value,
      facultad: document.getElementById("facultad").value.trim(),
      placa: document.getElementById("placa").value.trim().toUpperCase(),
      tipoVehiculo: document.getElementById("tipoVehiculo").value,
      correo: document.getElementById("correo").value.trim(),
    };

    // --- Validación ---
    if (!validarCampos(nuevoUsuario.cedula, nuevoUsuario.correo, nuevoUsuario.placa)) return;

    if (form.dataset.editIndex) {
      // Modo edición
      const index = parseInt(form.dataset.editIndex);
      usuarios[index] = nuevoUsuario;
      delete form.dataset.editIndex;
      alert("✅ Usuario actualizado correctamente.");
    } else {
      // Nuevo registro
      usuarios.push(nuevoUsuario);
      alert("👥 Usuario agregado exitosamente.");
    }

    form.reset();
    guardarYRenderizar();
  });

  // Render inicial
  renderTabla();
});
