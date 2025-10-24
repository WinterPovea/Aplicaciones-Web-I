// ============================
//  Validación del Login ULEAM
// ============================

// Referencias a elementos del DOM
const form = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

// Manejo del envío del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

// Obtener valores
  const usuario = form.usuario.value.trim();
  const password = form.password.value.trim();

  // Credenciales fijas para demo
  if (usuario === "Pedro Zambrano" && password === "1234") {
    mensaje.style.color = "green";
    mensaje.textContent = "✅ Acceso concedido. Redirigiendo...";
    setTimeout(() => window.location.href = "Dashboard.html", 1500);
  } else {
    mensaje.style.color = "red";
    mensaje.textContent = "❌ Usuario o contraseña incorrectos";
  }
});
