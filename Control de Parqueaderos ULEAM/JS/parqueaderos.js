document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".parqueadero-form");
  const tablaBody = document.querySelector(".tabla-parqueaderos tbody");

  // Cargar datos desde localStorage si existen
  let parqueaderos = JSON.parse(localStorage.getItem("parqueaderos")) || [];

  // Renderizar tabla
  const renderTabla = () => {
    tablaBody.innerHTML = "";
    parqueaderos.forEach((p, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${String(index + 1).padStart(3, "0")}</td>
        <td>${p.nombre}</td>
        <td>${p.ubicacion}</td>
        <td>${p.capacidad}</td>
        <td>${p.disponibles}</td>
        <td><span class="estado ${p.estado}">${p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}</span></td>
        <td>
          <button class="btn-editar">Editar</button>
          <button class="btn-eliminar">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);

      // Evento eliminar
      fila.querySelector(".btn-eliminar").addEventListener("click", () => {
        if (confirm(`¿Desea eliminar el parqueadero "${p.nombre}"?`)) {
          parqueaderos.splice(index, 1);
          guardarYRenderizar();
        }
      });

      // Evento editar
      fila.querySelector(".btn-editar").addEventListener("click", () => {
        document.getElementById("nombreParqueadero").value = p.nombre;
        document.getElementById("ubicacion").value = p.ubicacion;
        document.getElementById("capacidad").value = p.capacidad;
        document.getElementById("disponibles").value = p.disponibles;
        document.getElementById("estado").value = p.estado;

        // Marcar que estamos editando
        form.dataset.editIndex = index;
      });
    });
  };

  const guardarYRenderizar = () => {
    localStorage.setItem("parqueaderos", JSON.stringify(parqueaderos));
    renderTabla();
  };

  // Registrar / actualizar parqueadero
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoParqueadero = {
      nombre: document.getElementById("nombreParqueadero").value.trim(),
      ubicacion: document.getElementById("ubicacion").value.trim(),
      capacidad: parseInt(document.getElementById("capacidad").value),
      disponibles: parseInt(document.getElementById("disponibles").value),
      estado: document.getElementById("estado").value,
    };

    if (form.dataset.editIndex) {
      // Editar registro existente
      const index = parseInt(form.dataset.editIndex);
      parqueaderos[index] = nuevoParqueadero;
      delete form.dataset.editIndex;
      alert("Parqueadero actualizado correctamente ✅");
    } else {
      // Nuevo registro
      parqueaderos.push(nuevoParqueadero);
      alert("Parqueadero agregado exitosamente 🅿️");
    }

    form.reset();
    guardarYRenderizar();
  });

  // Render inicial
  renderTabla();
});
