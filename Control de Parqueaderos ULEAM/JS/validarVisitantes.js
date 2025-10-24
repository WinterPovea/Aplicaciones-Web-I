document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".visitante-form");
  const tablaBody = document.querySelector(".tabla-visitantes tbody");
  const btnFinalizar = document.querySelector(".btn-finalizar");

  // Recuperar y renderizar visitantes activos
  let visitantes = JSON.parse(localStorage.getItem("visitantesActivos")) || [];
  const guardarYRenderizar = () => {
    localStorage.setItem("visitantesActivos", JSON.stringify(visitantes));
    renderTabla();
  };

  // Renderizar tabla
  const renderTabla = () => {
    tablaBody.innerHTML = visitantes
      .map(
        (v, i) => `
        <tr>
          <td>${v.nombre}</td>
          <td>${v.cedula}</td>
          <td>${v.placa || "—"}</td>
          <td>${v.destino}</td>
          <td>${v.motivo}</td>
          <td>${v.horaIngreso}</td>
          <td><button class="btn-salida" data-index="${i}">Finalizar</button></td>
        </tr>`
      )
      .join("");

    // Asignar evento a todos los botones de salida
    tablaBody.querySelectorAll(".btn-salida").forEach((btn) =>
      btn.addEventListener("click", () => finalizarVisita(btn.dataset.index))
    );
  };

  // Finalizar visita individual
  const finalizarVisita = (index) => {
    const v = visitantes[index];
    if (confirm(`¿Desea finalizar la visita de ${v.nombre}?`)) {
      const horaSalida = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      visitantes.splice(index, 1);
      guardarYRenderizar();
      alert(`✅ Visita de ${v.nombre} finalizada a las ${horaSalida}`);
    }
  };

  // Validaciones
  const validarCampos = (cedula, placa) => {
    if (!/^\d{10}$/.test(cedula)) {
      alert("⚠️ La cédula debe tener exactamente 10 dígitos numéricos.");
      return false;
    }
    if (placa && !/^[A-Z]{3}-?\d{4}$/.test(placa)) {
      alert("⚠️ La placa debe tener 3 letras mayúsculas y 4 números. Ej: ABC1234 o ABC-1234");
      return false;
    }
    return true;
  };

  // Registrar visitante
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const getVal = (id) => document.getElementById(id).value.trim();

    const nuevo = {
      nombre: getVal("nombre"),
      cedula: getVal("cedula"),
      placa: getVal("placa").toUpperCase(),
      destino: getVal("destino"),
      motivo: getVal("motivo"),
      horaIngreso: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (!validarCampos(nuevo.cedula, nuevo.placa)) return;
    if (visitantes.some((v) => v.cedula === nuevo.cedula))
      return alert("⚠️ Este visitante ya tiene una visita activa.");

    visitantes.push(nuevo);
    guardarYRenderizar();
    form.reset();
    document.getElementById("horaIngreso").value = nuevo.horaIngreso;
    alert("✅ Visitante registrado correctamente.");
  });

  // Finalizar todas las visitas
  btnFinalizar.addEventListener("click", () => {
    if (!visitantes.length) return alert("⚠️ No hay visitantes activos.");
    if (confirm("¿Desea finalizar todas las visitas activas?")) {
      visitantes = [];
      guardarYRenderizar();
      alert("✅ Todas las visitas han sido finalizadas.");
    }
  });

  // Mostrar hora inicial
  document.getElementById("horaIngreso").value = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Render inicial
  renderTabla();
});
