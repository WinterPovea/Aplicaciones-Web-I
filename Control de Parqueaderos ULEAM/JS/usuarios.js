document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".registro-form");
  const tablaBody = document.querySelector(".tabla-autorizados tbody");
  let usuarios = JSON.parse(localStorage.getItem("usuariosAutorizados")) || [];

  // Guardar en localStorage
  const guardar = () => localStorage.setItem("usuariosAutorizados", JSON.stringify(usuarios)); //stringify convierte a cadena

  // Renderizar tabla
  const renderTabla = () => {
    tablaBody.innerHTML = usuarios.map((u, i) => ` 
      <tr>
        <td>${String(i + 1).padStart(3, "0")}</td>
        <td>${u.nombre}</td>
        <td>${u.cedula}</td>
        <td>${u.tipoUsuario}</td>
        <td>${u.facultad}</td>
        <td>${u.placa}</td>
        <td>${u.tipoVehiculo}</td>
        <td>${u.correo}</td>
        <td>
          <button class="btn-editar" data-i="${i}">Editar</button>
          <button class="btn-eliminar" data-i="${i}">Eliminar</button>
        </td>
      </tr>
    `).join("");
  };

  // Validaciones
  const validar = ({ cedula, correo, placa }) => {
    if (!/^\d{10}$/.test(cedula))
      return alert("⚠️ La cédula debe tener exactamente 10 dígitos numéricos."), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      return alert("⚠️ Ingrese un correo institucional válido."), false;
    if (!/^[A-Z]{3}-\d{4}$/.test(placa))
      return alert("⚠️ La placa debe tener el formato ABC-1234."), false;
    return true;
  };

  // Manejo de clics en la tabla (editar / eliminar)
  tablaBody.addEventListener("click", (e) => {
    const i = e.target.dataset.i;
    if (e.target.classList.contains("btn-eliminar")) {
      if (confirm(`¿Eliminar al usuario "${usuarios[i].nombre}"?`)) {
        usuarios.splice(i, 1);
        guardar(); renderTabla();
      }
    }
    if (e.target.classList.contains("btn-editar")) {
      const u = usuarios[i];
      Object.entries(u).forEach(([k, v]) => (form[k].value = v));
      form.dataset.editIndex = i;
      form.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Guardar / actualizar
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      nombre: form.nombre.value.trim(), 
      cedula: form.cedula.value.trim(),
      tipoUsuario: form.tipoUsuario.value,
      facultad: form.facultad.value.trim(),
      placa: form.placa.value.trim().toUpperCase(), //toUpperCase para normalizar placas
      tipoVehiculo: form.tipoVehiculo.value,
      correo: form.correo.value.trim(),
    };

    if (!validar(data)) return;

    if (form.dataset.editIndex) {
      usuarios[form.dataset.editIndex] = data;
      delete form.dataset.editIndex;
      alert("✅ Usuario actualizado correctamente.");
    } else {
      usuarios.push(data);
      alert("👥 Usuario agregado exitosamente.");
    }

    guardar(); renderTabla(); form.reset();
  });

  renderTabla();
});
