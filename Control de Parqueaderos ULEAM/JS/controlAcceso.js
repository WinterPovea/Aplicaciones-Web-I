// ============================================
//   Control de Acceso Vehicular (Versión Demo)
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // --- Simulación de base de datos ---
  const vehiculosRegistrados = [
    { placa: "ABC-1234", cedula: "1312345678", usuario: "Lucía Torres" },
    { placa: "MBD-0987", cedula: "1318765432", usuario: "Carlos Mendoza" },
    { placa: "ULE-2025", cedula: "1315678901", usuario: "Pedro Zambrano" }
  ];

  // --- Elementos del DOM ---
  const inputBuscar = document.getElementById("buscar");
  const btnVerificar = document.querySelector(".btn-verificar");
  const inputNombre = document.getElementById("nombreUsuario");
  const inputFechaHora = document.getElementById("fechaHora");
  const inputAccion = document.getElementById("accionDetectada");
  const form = document.querySelector(".control-form");
  const tablaBody = document.querySelector(".tabla-historial tbody");

  let vehiculoEncontrado = null;
  let estadoVehiculo = {}; // Guarda si está dentro o fuera

  // --- Función: obtener fecha y hora actual ---
  function obtenerFechaHora() {
    const ahora = new Date();
    const fecha = ahora.toISOString().split("T")[0];
    const hora = ahora.toTimeString().split(" ")[0];
    return `${fecha} ${hora}`;
  }

  // --- Verificar vehículo ---
  btnVerificar.addEventListener("click", () => {
    const valor = inputBuscar.value.trim();
    vehiculoEncontrado = vehiculosRegistrados.find(
      v => v.placa === valor || v.cedula === valor
    );

    if (vehiculoEncontrado) {
      inputNombre.value = vehiculoEncontrado.usuario;
      inputFechaHora.value = obtenerFechaHora();

      // Detectar si entra o sale
      const esIngreso = !estadoVehiculo[vehiculoEncontrado.placa];
      inputAccion.value = esIngreso ? "Ingreso" : "Salida";
    } else {
      inputNombre.value = "";
      inputFechaHora.value = "";
      inputAccion.value = "";
      alert("❌ Vehículo o usuario no encontrado.");
    }
  });

  // --- Registrar evento ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!vehiculoEncontrado) {
      alert("⚠️ Primero verifique un vehículo antes de registrar.");
      return;
    }

    const placa = vehiculoEncontrado.placa;
    const usuario = vehiculoEncontrado.usuario;
    const accion = inputAccion.value;
    const fechaHora = inputFechaHora.value;

    // Alternar el estado
    estadoVehiculo[placa] = accion === "Ingreso";

    // Crear una nueva fila en la tabla
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td>${placa}</td>
      <td>${usuario}</td>
      <td><span class="accion ${accion.toLowerCase()}">${accion}</span></td>
      <td>${fechaHora}</td>
    `;
    tablaBody.prepend(nuevaFila);

    // Limpiar campos
    form.reset();
    inputNombre.value = "";
    inputFechaHora.value = "";
    inputAccion.value = "";
    vehiculoEncontrado = null;
  });
});
