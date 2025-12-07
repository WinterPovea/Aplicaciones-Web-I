// =======================================
// Control de Acceso Vehicular (con XML)
// =======================================

let vehiculos = []; // Se llenará desde el XML

// 1. Cargar XML al iniciar
fetch("XML/vehiculos.xml")
  .then(res => res.text())
  .then(xmlString => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "text/xml");

    vehiculos = Array.from(xml.getElementsByTagName("vehiculo")).map(v => ({
      placa: v.getElementsByTagName("placa")[0].textContent.trim(),
      cedula: v.getElementsByTagName("cedula")[0].textContent.trim(),
      usuario: v.getElementsByTagName("usuario")[0].textContent.trim()
    }));

    console.log("Vehículos cargados desde XML:", vehiculos);
  })
  .catch(err => console.error("Error cargando XML:", err));


// ===============================
// Referencias a los elementos
// ===============================
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
  return new Date().toLocaleString();
}


// ===============================
// Verificar vehículo
// ===============================
btnVerificar.onclick = function () {
  const valor = buscar.value.trim();

  encontrado = vehiculos.find(v =>
    v.placa === valor || v.cedula === valor
  );

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


// ===============================
// Registrar evento
// ===============================
form.onsubmit = function (e) {
  e.preventDefault();

  if (!encontrado) {
    alert("⚠️ Verifique un vehículo antes de registrar.");
    return;
  }

  const { placa, usuario } = encontrado;
  const tipo = accion.value;
  const momento = fechaHora.value;

  // Cambiar estado
  estado[placa] = tipo === "Ingreso";

  // Agregar fila a la tabla
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
