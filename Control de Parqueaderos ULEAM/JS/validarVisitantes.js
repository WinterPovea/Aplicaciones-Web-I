document.addEventListener("DOMContentLoaded", async () => {

  //-----------------------------
  // REFERENCIAS
  //-----------------------------
  const form = document.querySelector(".visitante-form");
  const tablaBody = document.querySelector(".tabla-visitantes tbody");
  const btnFinalizar = document.querySelector(".btn-finalizar");
  const btnDescargar = document.getElementById("btnDescargarHistorial");

  //-----------------------------
  // VARIABLES
  //-----------------------------
  let visitantes = JSON.parse(localStorage.getItem("visitantesActivos")) || [];
  let historial = JSON.parse(localStorage.getItem("historialVisitantes")) || [];

  //-----------------------------
  // 1. Cargar visitantes JSON externo si está vacío
  //-----------------------------
  if (visitantes.length === 0) {
    try {
      const res = await fetch("JSON/visitantesActivos.json");
      visitantes = await res.json();
      localStorage.setItem("visitantesActivos", JSON.stringify(visitantes));
    } catch (err) {
      console.error("Error cargando JSON externo:", err);
    }
  }

  //-----------------------------
  // FUNCIONES
  //-----------------------------
  const guardarYRenderizar = () => {
    localStorage.setItem("visitantesActivos", JSON.stringify(visitantes));
    renderTabla();
  };

  const guardarHistorial = (reg) => {
    historial.push(reg);
    localStorage.setItem("historialVisitantes", JSON.stringify(historial));
  };

  const descargarHistorial = () => {
    const blob = new Blob([JSON.stringify(historial, null, 2)], {
      type: "application/json"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "historialVisitantes.json";
    a.click();
  };

  //-----------------------------
  // 2. Renderizar tabla
  //-----------------------------
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

    tablaBody.querySelectorAll(".btn-salida").forEach((btn) =>
      btn.addEventListener("click", () => finalizarVisita(btn.dataset.index))
    );
  };

  //-----------------------------
  // 3. Finalizar visita
  //-----------------------------
  const finalizarVisita = (index) => {
    const v = visitantes[index];
    if (!confirm(`¿Finalizar la visita de ${v.nombre}?`)) return;

    const horaSalida = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    guardarHistorial({ ...v, horaSalida });

    visitantes.splice(index, 1);
    guardarYRenderizar();

    alert(`Visita finalizada a las ${horaSalida}`);
  };

  //-----------------------------
  // 4. Validaciones
  //-----------------------------
  const validarCampos = (cedula, placa) => {
    if (!/^\d{10}$/.test(cedula)) {
      alert("La cédula debe tener 10 dígitos");
      return false;
    }
    if (placa && !/^[A-Z]{3}-?\d{4}$/.test(placa)) {
      alert("Placa inválida (ABC-1234)");
      return false;
    }
    return true;
  };

  //-----------------------------
  // 5. Registrar nuevo visitante
  //-----------------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const get = id => document.getElementById(id).value.trim();

    const nuevo = {
      nombre: get("nombre"),
      cedula: get("cedula"),
      placa: get("placa").toUpperCase(),
      destino: get("destino"),
      motivo: get("motivo"),
      horaIngreso: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    if (!validarCampos(nuevo.cedula, nuevo.placa)) return;

    if (visitantes.some(v => v.cedula === nuevo.cedula))
      return alert("Este visitante ya está activo");

    visitantes.push(nuevo);
    guardarYRenderizar();

    form.reset();
    document.getElementById("horaIngreso").value = nuevo.horaIngreso;
  });

  //-----------------------------
  // 6. Finalizar todas
  //-----------------------------
  btnFinalizar.addEventListener("click", () => {
    if (!visitantes.length)
      return alert("No hay visitantes");

    if (!confirm("¿Finalizar todas las visitas?")) return;

    visitantes.forEach(v => {
      const horaSalida = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
      guardarHistorial({ ...v, horaSalida });
    });

    visitantes = [];
    guardarYRenderizar();
  });

  //-----------------------------
  // 7. Descargar historial
  //-----------------------------
  btnDescargar.addEventListener("click", descargarHistorial);

  //-----------------------------
  // INICIO
  //-----------------------------
  renderTabla();
});
