document.addEventListener("DOMContentLoaded", () => { // Asegurar que el DOM esté cargado
  const form = document.querySelector(".parqueadero-form");
  const tablaBody = document.querySelector(".tabla-parqueaderos tbody");
  let parqueaderos = JSON.parse(localStorage.getItem("parqueaderos")) || [];

  // Guardar en localStorage
  const guardar = () => localStorage.setItem("parqueaderos", JSON.stringify(parqueaderos));

  // Renderizar tabla
  const renderTabla = () => {
    tablaBody.innerHTML = parqueaderos.map((p, i) => ` //i es el índice del registro
      <tr>
        <td>${String(i + 1).padStart(3, "0")}</td> //padStart para formato 001, 002, ...
        <td>${p.nombre}</td>
        <td>${p.ubicacion}</td>
        <td>${p.capacidad}</td>
        <td>${p.disponibles}</td>
        <td><span class="estado ${p.estado}">${p.estado[0].toUpperCase() + p.estado.slice(1)}</span></td>
        <td>
          <button class="btn-editar" data-i="${i}">Editar</button>
          <button class="btn-eliminar" data-i="${i}">Eliminar</button>
        </td>
      </tr>
    `).join("");
  };

  // Manejo de clics en la tabla (editar / eliminar)
  tablaBody.addEventListener("click", (e) => {
    const i = e.target.dataset.i;
    if (e.target.classList.contains("btn-eliminar")) {
      if (confirm(`¿Eliminar "${parqueaderos[i].nombre}"?`)) {
        parqueaderos.splice(i, 1); //splice elimina el elemento
        guardar(); renderTabla();
      }
    }
    if (e.target.classList.contains("btn-editar")) {
      const p = parqueaderos[i];
      form.nombreParqueadero.value = p.nombre;
      form.ubicacion.value = p.ubicacion;
      form.capacidad.value = p.capacidad;
      form.disponibles.value = p.disponibles;
      form.estado.value = p.estado;
      form.dataset.editIndex = i; // Marcar que estamos editando
      form.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Guardar / actualizar
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      nombre: form.nombreParqueadero.value.trim(),
      ubicacion: form.ubicacion.value.trim(),
      capacidad: +form.capacidad.value,
      disponibles: +form.disponibles.value,
      estado: form.estado.value
    };

    if (form.dataset.editIndex) { // Si existe, estamos editando
      parqueaderos[form.dataset.editIndex] = data;
      delete form.dataset.editIndex;
      alert("✅ Parqueadero actualizado");
    } else {
      parqueaderos.push(data);
      alert("🅿️ Parqueadero agregado");
    }

    guardar(); renderTabla(); form.reset();
  });

  renderTabla();
});
