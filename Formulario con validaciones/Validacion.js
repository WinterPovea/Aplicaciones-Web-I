document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formulario');
  if (!form) return;

  const clearErrors = () => {
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
  };

  const isNumericLength = (value, length) => new RegExp('^\\d{' + length + '}$').test(value);
  const isValidName = (value) => /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(value);
  const isAlphanumeric = (value) => /^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ\s.,#-]+$/.test(value);

  form.addEventListener('reset', () => setTimeout(clearErrors, 0));

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    clearErrors();
    let valido = true;

    // Validar cédula
    let cedula = document.getElementById('cedula').value.trim();
    if (!isNumericLength(cedula, 10)) {
      document.getElementById('errorCedula').textContent = 'Ingrese una cédula válida (10 números).';
      valido = false;
    }

    // Validar nombres
    let nombres = document.getElementById('nombres').value.trim();
    if (!isValidName(nombres)) {
      document.getElementById('errorNombres').textContent = 'Solo se permiten letras y espacios.';
      valido = false;
    }

    // Validar apellidos
    let apellidos = document.getElementById('apellidos').value.trim();
    if (!isValidName(apellidos)) {
      document.getElementById('errorApellidos').textContent = 'Solo se permiten letras y espacios.';
      valido = false;
    }

    // Validar sexo
    let sexo = document.querySelector('input[name="sexo"]:checked');
    if (!sexo) {
      document.getElementById('errorSexo').textContent = 'Seleccione su sexo.';
      valido = false;
    }

    // Validar dirección (alfanumérica)
    let direccion = document.getElementById('direccion').value.trim();
    if (direccion === '' || !isAlphanumeric(direccion)) {
      document.getElementById('errorDireccion').textContent = 'Ingrese una dirección válida (solo letras, números y signos básicos).';
      valido = false;
    }

    // Validar fecha de nacimiento (mayor de 18 años)
    let fechaNacimiento = document.getElementById('fechaNacimiento').value;
    if (!fechaNacimiento) {
      document.getElementById('errorFechaNacimiento').textContent = 'Seleccione su fecha de nacimiento.';
      valido = false;
    } else {
      let hoy = new Date();
      let fechaNac = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      let m = hoy.getMonth() - fechaNac.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
      if (edad < 18) {
        document.getElementById('errorFechaNacimiento').textContent = 'Debe tener al menos 18 años.';
        valido = false;
      }
    }

    // Validar correo
    let correo = document.getElementById('correo').value.trim();
    if (!/^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com|live\.com|yahoo\.com|live\.uleam\.edu\.ec)$/i.test(correo)) {
      document.getElementById('errorCorreo').textContent =
        'Ingrese un correo válido (gmail, outlook, hotmail, live, yahoo o live.uleam.edu.ec).';
      valido = false;
    }

    // Validar teléfono
    let telefono = document.getElementById('telefono').value.trim();
    if (!isNumericLength(telefono, 10)) {
      document.getElementById('errorTelefono').textContent = 'Ingrese un teléfono válido (10 números).';
      valido = false;
    }

    if (valido) {
      alert('Formulario enviado correctamente.');
      form.reset();
    }
  });
});
