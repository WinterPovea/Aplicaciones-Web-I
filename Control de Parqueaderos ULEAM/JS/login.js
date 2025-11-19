// ============================
//  Validación del Login ULEAM
// ============================

// Referencias a elementos del DOM
const form = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

// Manejo del envío del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevenir que la página se recargue

// Obtener valores
//trim elimina espacios en blanco al inicio y al final
  const usuario = form.usuario.value.trim();
  const password = form.password.value.trim();

  // Credenciales fijas para demo
  if (usuario === "Pedro Zambrano" && password === "1234") {
    mensaje.style.color = "green";
    mensaje.textContent = "✅ Acceso concedido. Redirigiendo...";
    setTimeout(() => window.location.href = "Dashboard.html", 1500); // Redirigir después de 1.5 segundos
  } else {
    mensaje.style.color = "red";
    mensaje.textContent = "❌ Usuario o contraseña incorrectos";
  }
});
