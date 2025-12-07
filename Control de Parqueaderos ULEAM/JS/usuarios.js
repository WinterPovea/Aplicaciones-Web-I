document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".registro-form");
  const tablaBody = document.querySelector(".tabla-autorizados tbody");
  const buscador = document.getElementById("buscadorUsuarios");

  // Cargar datos desde LocalStorage o iniciar vacío
  let usuarios = JSON.parse(localStorage.getItem("usuariosAutorizados")) || [];
  let usuariosFiltrados = [...usuarios]; // versión filtrada

  // Si no hay datos, cargar desde JSON externo
  if (usuarios.length === 0) {
    fetch("JSON/usuariosAutorizados.json")
      .then(res => res.json())
      .then(data => {
        usuarios = data;
        usuariosFiltrados = [...usuarios];
        guardar();
        renderTabla();
      })
      .catch(err => console.error("❌ Error cargando JSON:", err));
  }

  // Guardar en localStorage
  const guardar = () =>
    localStorage.setItem("usuariosAutorizados", JSON.stringify(usuarios));

  // ------------------------------
  // 🔍 FILTRADO DINÁMICO
  // ------------------------------
  const filtrarUsuarios = () => {
    const texto = buscador.value.toLowerCase().trim();

    usuariosFiltrados = usuarios.filter(u =>
      u.nombre.toLowerCase().includes(texto) ||
      u.cedula.toLowerCase().includes(texto) ||
      u.placa.toLowerCase().includes(texto) ||
      u.tipoUsuario.toLowerCase().includes(texto) ||
      u.tipoVehiculo.toLowerCase().includes(texto) ||
      u.facultad.toLowerCase().includes(texto)
    );

    renderTabla();
  };

  // Escuchar al escribir en el input
  buscador.addEventListener("input", filtrarUsuarios);

  // Renderizar tabla
  const renderTabla = () => {
    tablaBody.innerHTML = usuariosFiltrados
      .map(
        (u, i) => `
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
    `
      )
      .join("");
  };

  // Validaciones
  const validar = ({ cedula, correo, placa }) => {
    if (!/^\d{10}$/.test(cedula))
      return alert("⚠️ La cédula debe tener exactamente 10 dígitos."), false;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      return alert("⚠️ Ingrese un correo válido."), false;

    if (!/^[A-Z]{3}-\d{4}$/.test(placa))
      return alert("⚠️ La placa debe tener el formato ABC-1234."), false;

    return true;
  };

  // Manejo de clics para editar/eliminar
  tablaBody.addEventListener("click", (e) => {
    const i = e.target.dataset.i;

    // Eliminar
    if (e.target.classList.contains("btn-eliminar")) {
      if (confirm(`¿Eliminar a "${usuariosFiltrados[i].nombre}"?`)) {

        // Buscar posición real en el arreglo original
        const indexReal = usuarios.indexOf(usuariosFiltrados[i]);

        usuarios.splice(indexReal, 1);
        usuariosFiltrados.splice(i, 1);

        guardar();
        renderTabla();
      }
    }

    // Editar
    if (e.target.classList.contains("btn-editar")) {
      const u = usuariosFiltrados[i];

      Object.entries(u).forEach(([key, value]) => {
        form[key].value = value;
      });

      form.dataset.editIndex = usuarios.indexOf(u);
      form.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Guardar o actualizar usuario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      nombre: form.nombre.value.trim(),
      cedula: form.cedula.value.trim(),
      tipoUsuario: form.tipoUsuario.value,
      facultad: form.facultad.value.trim(),
      placa: form.placa.value.trim().toUpperCase(),
      tipoVehiculo: form.tipoVehiculo.value,
      correo: form.correo.value.trim(),
    };

    if (!validar(data)) return;

    // Editar
    if (form.dataset.editIndex) {
      const index = form.dataset.editIndex;
      usuarios[index] = data;
      delete form.dataset.editIndex;
      alert("✅ Usuario actualizado correctamente.");
    }
    // Crear nuevo
    else {
      usuarios.push(data);
      alert("👥 Usuario agregado exitosamente.");
    }

    usuariosFiltrados = [...usuarios];

    guardar();
    renderTabla();
    form.reset();
  });

  renderTabla();
});
