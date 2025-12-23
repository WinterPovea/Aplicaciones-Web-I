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
  })
  .catch(err => console.error("Error cargando XML:", err));

// ===============================
// Referencias
// ===============================

const buscar = document.getElementById("buscar");
const btnVerificar = document.querySelector(".btn-verificar");
const nombre = document.getElementById("nombreUsuario");
const fechaHora = document.getElementById("fechaHora");
const accion = document.getElementById("accionDetectada");
const form = document.querySelector(".control-form");
const tabla = document.querySelector(".tabla-historial tbody");

// Estado de cada vehículo
const estado = {}; // placa: true = dentro | false = fuera
let encontrado = null;

// ===============================
// Función hora
// ===============================
function obtenerFechaHora() {
  return new Date().toLocaleString();
}

// ===============================
// Verificar vehículo
// ===============================
function verificarVehiculo() {
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
}

btnVerificar.onclick = verificarVehiculo;

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

  // Crear fila
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${placa}</td>
    <td>${usuario}</td>
    <td><span class="accion ${tipo.toLowerCase()}">${tipo}</span></td>
    <td>${momento}</td>
    <td>${
      tipo === "Ingreso"
        ? `<button class="btn-finalizar-salida" data-placa="${placa}">Finalizar</button>`
        : `—`
    }</td>
  `;

  tabla.prepend(fila);

  // Asignar evento al botón de finalizar salida
  if (tipo === "Ingreso") {
    fila.querySelector(".btn-finalizar-salida").onclick = () => {
      registrarSalidaDirecta(placa, usuario);
    };
  }

  // Reset
  form.reset();
  nombre.value = fechaHora.value = accion.value = "";
  encontrado = null;
};

// ===============================
// Finalizar salida desde tabla
// ===============================
function registrarSalidaDirecta(placa, usuario) {
  const momento = obtenerFechaHora();

  estado[placa] = false;

  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${placa}</td>
    <td>${usuario}</td>
    <td><span class="accion salida">Salida</span></td>
    <td>${momento}</td>
    <td>—</td>
  `;

  tabla.prepend(fila);

  alert(`🚗 Salida registrada para ${usuario}`);
}

// ===============================
// ENTER para verificar y registrar
// ===============================

// Primer ENTER → verificar
buscar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    verificarVehiculo();
    fechaHora.focus();
  }
});

// Segundo ENTER → registrar
form.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target !== buscar) {
    e.preventDefault();
    form.requestSubmit();
  }
});
