// =======================================
// Control de Acceso Vehicular 
// =======================================

// Simulación de base de datos
const vehiculos = [
  { placa: "ABC-1234", cedula: "1312345678", usuario: "Lucía Torres" },
  { placa: "MBD-0987", cedula: "1318765432", usuario: "Carlos Mendoza" },
  { placa: "ULE-2025", cedula: "1315678901", usuario: "Pedro Zambrano" }
];

// Referencias a los elementos
const buscar = document.getElementById("buscar");
const btnVerificar = document.querySelector(".btn-verificar");
const nombre = document.getElementById("nombreUsuario");
const fechaHora = document.getElementById("fechaHora");
const accion = document.getElementById("accionDetectada");
const form = document.querySelector(".control-form");
const tabla = document.querySelector(".tabla-historial tbody");

// Guardar si un vehículo está dentro o fuera
const estado = {};
let encontrado = null;

// Función para obtener fecha y hora actual
function obtenerFechaHora() {
  const ahora = new Date();
  return ahora.toLocaleString(); 
}

// Verificar vehículo
btnVerificar.onclick = function () {
  const valor = buscar.value.trim();
  encontrado = vehiculos.find(v => v.placa === valor || v.cedula === valor);

  if (encontrado) {
    nombre.value = encontrado.usuario;
    fechaHora.value = obtenerFechaHora();
    const esIngreso = !estado[encontrado.placa];
    accion.value = esIngreso ? "Ingreso" : "Salida";
  } else {
    alert("❌ Vehículo o usuario no encontrado");
    form.reset();
    nombre.value = fechaHora.value = accion.value = "";
  }
};


// Registrar evento
form.onsubmit = function (e) {
  e.preventDefault();

  if (!encontrado) {
    alert("⚠️ Verifique un vehículo antes de registrar.");
    return;
  }

  const { placa, usuario } = encontrado;
  const tipo = accion.value;
  const momento = fechaHora.value;

  // Cambiar el estado (si entra, queda dentro)
  estado[placa] = tipo === "Ingreso";

  // Agregar nueva fila al historial
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${placa}</td>
    <td>${usuario}</td>
    <td><span class="accion ${tipo.toLowerCase()}">${tipo}</span></td>
    <td>${momento}</td>
  `;
  tabla.prepend(fila);

  // Limpiar campos
  form.reset();
  nombre.value = fechaHora.value = accion.value = "";
  encontrado = null;
};


