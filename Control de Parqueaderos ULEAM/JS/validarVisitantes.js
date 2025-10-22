document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".visitante-form");
  const tablaBody = document.querySelector(".tabla-visitantes tbody");
  const btnFinalizar = document.querySelector(".btn-finalizar");

  // Recuperar visitantes activos del localStorage
  let visitantes = JSON.parse(localStorage.getItem("visitantesActivos")) || [];

  // 🧾 Renderizar tabla
  const renderTabla = () => {
    tablaBody.innerHTML = "";
    visitantes.forEach((v, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${v.nombre}</td>
        <td>${v.cedula}</td>
        <td>${v.placa || "—"}</td>
        <td>${v.destino}</td>
        <td>${v.motivo}</td>
        <td>${v.horaIngreso}</td>
        <td><button class="btn-salida">Finalizar</button></td>
      `;
      tablaBody.appendChild(fila);

      // 🕒 Finalizar visita
      fila.querySelector(".btn-salida").addEventListener("click", () => {
        if (confirm(`¿Desea finalizar la visita de ${v.nombre}?`)) {
          const horaSalida = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          visitantes.splice(index, 1);
          guardarYRenderizar();
          alert(`✅ Visita de ${v.nombre} finalizada a las ${horaSalida}`);
        }
      });
    });
  };

  const guardarYRenderizar = () => {
    localStorage.setItem("visitantesActivos", JSON.stringify(visitantes));
    renderTabla();
  };

  // 🔍 Validaciones
  const validarCampos = (cedula, placa) => {
    const cedulaValida = /^\d{10}$/.test(cedula);
    const placaValida = !placa || /^[A-Z]{3}-?\d{4}$/.test(placa);

    if (!cedulaValida) {
      alert("⚠️ La cédula debe tener exactamente 10 dígitos numéricos.");
      return false;
    }
    if (!placaValida) {
      alert("⚠️ La placa debe tener 3 letras mayúsculas y 4 números. Ejemplo: ABC1234 o ABC-1234");
      return false;
    }
    return true;
  };

  // 🧍‍♂️ Registrar visitante
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoVisitante = {
      nombre: document.getElementById("nombre").value.trim(),
      cedula: document.getElementById("cedula").value.trim(),
      placa: document.getElementById("placa").value.trim().toUpperCase(),
      destino: document.getElementById("destino").value.trim(),
      motivo: document.getElementById("motivo").value.trim(),
      horaIngreso: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (!validarCampos(nuevoVisitante.cedula, nuevoVisitante.placa)) return;

    // Evitar duplicados por cédula
    const duplicado = visitantes.some((v) => v.cedula === nuevoVisitante.cedula);
    if (duplicado) {
      alert("⚠️ Este visitante ya tiene una visita activa.");
      return;
    }

    visitantes.push(nuevoVisitante);
    guardarYRenderizar();
    form.reset();

    // Rellenar hora de ingreso actualizada
    const horaIngreso = document.getElementById("horaIngreso");
    if (horaIngreso) {
      const now = new Date();
      horaIngreso.value = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    alert("✅ Visitante registrado correctamente.");
  });

  // 🧾 Botón global de finalizar (opcional)
  btnFinalizar.addEventListener("click", () => {
    if (visitantes.length === 0) {
      alert("⚠️ No hay visitantes activos para finalizar.");
      return;
    }

    if (confirm("¿Desea finalizar todas las visitas activas?")) {
      visitantes = [];
      guardarYRenderizar();
      alert("✅ Todas las visitas han sido finalizadas.");
    }
  });

  // Render inicial
  renderTabla();
});
