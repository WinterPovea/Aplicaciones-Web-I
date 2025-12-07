document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".parqueadero-form");
  const tablaBody = document.querySelector(".tabla-parqueaderos tbody");

  // =============================
  // 1. Cargar JSON desde archivo
  // =============================
  let parqueaderos = JSON.parse(localStorage.getItem("parqueaderos")) || [];

  if (parqueaderos.length === 0) {
    fetch("JSON/parqueaderos.json")
      .then(res => res.json())
      .then(data => {
        parqueaderos = data;
        guardar();
        renderTabla();
        console.log("Parqueaderos cargados desde JSON ✔");
      })
      .catch(err => console.error("Error cargando JSON:", err));
  }

  // Guardar en LocalStorage
  const guardar = () =>
    localStorage.setItem("parqueaderos", JSON.stringify(parqueaderos));

  // =============================
  // 2. Renderizar tabla
  // =============================
  const renderTabla = () => {
    tablaBody.innerHTML = parqueaderos
      .map(
        (p, i) => `
      <tr>
        <td>${String(i + 1).padStart(3, "0")}</td>
        <td>${p.nombre}</td>
        <td>${p.ubicacion}</td>
        <td>${p.capacidad}</td>
        <td>${p.disponibles}</td>
        <td><span class="estado ${p.estado}">
          ${p.estado[0].toUpperCase() + p.estado.slice(1)}
        </span></td>
        <td>
          <button class="btn-editar" data-i="${i}">Editar</button>
          <button class="btn-eliminar" data-i="${i}">Eliminar</button>
        </td>
      </tr>`
      )
      .join("");
  };

  // =============================
  // 3. Editar / Eliminar registros
  // =============================
  tablaBody.addEventListener("click", (e) => {
    const i = e.target.dataset.i;

    if (e.target.classList.contains("btn-eliminar")) {
      if (confirm(`¿Eliminar "${parqueaderos[i].nombre}"?`)) {
        parqueaderos.splice(i, 1);
        guardar();
        renderTabla();
      }
    }

    if (e.target.classList.contains("btn-editar")) {
      const p = parqueaderos[i];
      form.nombreParqueadero.value = p.nombre;
      form.ubicacion.value = p.ubicacion;
      form.capacidad.value = p.capacidad;
      form.disponibles.value = p.disponibles;
      form.estado.value = p.estado;

      form.dataset.editIndex = i;
      form.scrollIntoView({ behavior: "smooth" });
    }
  });

  // =============================
  // 4. Guardar / Actualizar
  // =============================
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      nombre: form.nombreParqueadero.value.trim(),
      ubicacion: form.ubicacion.value.trim(),
      capacidad: +form.capacidad.value,
      disponibles: +form.disponibles.value,
      estado: form.estado.value
    };

    // Editar
    if (form.dataset.editIndex) {
      parqueaderos[form.dataset.editIndex] = data;
      delete form.dataset.editIndex;
      alert("✅ Parqueadero actualizado");
    }
    // Agregar nuevo
    else {
      parqueaderos.push(data);
      alert("🅿️ Parqueadero agregado");
    }

    guardar();
    renderTabla();
    form.reset();
  });

  // Render inicial
  renderTabla();
});
