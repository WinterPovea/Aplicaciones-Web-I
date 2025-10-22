// ============================
//  Validación del Login ULEAM
// ============================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  const mensaje = document.getElementById("mensaje");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    const usuarioValido = "Pedro Zambrano";
    const passwordValida = "1234";

    if (usuario === usuarioValido && password === passwordValida) {
      mensaje.style.color = "green";
      mensaje.textContent = "✅ Acceso concedido. Redirigiendo...";
      setTimeout(() => {
        window.location.href = "Dashboard.html";
      }, 1500);
    } else {
      mensaje.style.color = "red";
      mensaje.textContent = "❌ Usuario o contraseña incorrectos";
    }
  });
});
