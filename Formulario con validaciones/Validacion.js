// Código de validación y limpieza de errores para el formulario
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formulario');
  if (!form) return;

  const clearErrors = () => {
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
  };

  // Helpers reutilizables
  const isNumericLength = (value, length) => {
    return new RegExp('^\\d{' + length + '}$').test(value);
  };

  const isValidName = (value) => {
    return /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(value) && value.trim() !== '';
  };

  // Limpiar mensajes de error cuando el formulario se resetea (botón type="reset" o form.reset())
  form.addEventListener('reset', function() {
    // delay to allow native reset to complete (not strictly necessary here)
    setTimeout(clearErrors, 0);
  });

  // Envío / validación
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // evita el envío por defecto
    let valido = true;

    // limpiar mensajes previos
    clearErrors();

    // validar cédula (10 dígitos)
    let cedula = document.getElementById('cedula').value.trim();
    if (!isNumericLength(cedula, 10)) {
      document.getElementById('errorCedula').textContent = 'Ingrese una cédula válida (10 números).';
      valido = false;
    }

    // validar nombres
    let nombres = document.getElementById('nombres').value.trim();
    if (nombres === '') {
      document.getElementById('errorNombres').textContent = 'Ingrese sus nombres.';
      valido = false;
    } else if (!isValidName(nombres)) {
      document.getElementById('errorNombres').textContent = 'Solo se permiten letras y espacios.';
      valido = false;
    }

    // validar apellidos
    let apellidos = document.getElementById('apellidos').value.trim();
    if (apellidos === '') {
      document.getElementById('errorApellidos').textContent = 'Ingrese sus apellidos.';
      valido = false;
    } else if (!isValidName(apellidos)) {
      document.getElementById('errorApellidos').textContent = 'Solo se permiten letras y espacios.';
      valido = false;
    }

    // validar sexo
    let sexo = document.querySelector('input[name="sexo"]:checked');
    if (!sexo) {
      document.getElementById('errorSexo').textContent = 'Seleccione su sexo.';
      valido = false;
    }

    // validar correo (solo dominios comunes y live.uleam.edu.ec)
    let correo = document.getElementById('correo').value.trim();
    if (!/^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com|live\.com|yahoo\.com|live\.uleam\.edu\.ec)$/i.test(correo)) {
      document.getElementById('errorCorreo').textContent =
        'Ingrese un correo válido (gmail, outlook, hotmail, live, yahoo o live.uleam.edu.ec).';
      valido = false;
    }

    // validar teléfono (10 dígitos)
    let telefono = document.getElementById('telefono').value.trim();
    if (!isNumericLength(telefono, 10)) {
      document.getElementById('errorTelefono').textContent = 'Ingrese un teléfono válido (10 números).';
      valido = false;
    }

    if (valido) {
      alert('Formulario enviado correctamente.');
      // resetear el formulario (disparará el listener 'reset' que limpia errores)
      form.reset();
    }
  });
});
