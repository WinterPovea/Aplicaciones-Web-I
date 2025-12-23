// Servicio para manejar datos de usuarios autorizados

const USUARIOS_AUTORIZADOS_KEY = 'usuariosAutorizados';

const initialData = [
  {
    "nombre": "Lucía Torres",
    "cedula": "1312345678",
    "tipoUsuario": "Docente",
    "facultad": "Ciencias Administrativas",
    "placa": "ABC-1234",
    "tipoVehiculo": "Automóvil",
    "correo": "l.torres@uleam.edu.ec"
  },
  {
    "nombre": "Carlos Mendoza",
    "cedula": "1318765432",
    "tipoUsuario": "Estudiante",
    "facultad": "Ingeniería",
    "placa": "MBD-0987",
    "tipoVehiculo": "Motocicleta",
    "correo": "c.mendoza@uleam.edu.ec"
  }
];

export function getUsuariosAutorizados() {
  let usuarios = JSON.parse(localStorage.getItem(USUARIOS_AUTORIZADOS_KEY));
  if (!usuarios || usuarios.length === 0) {
    usuarios = initialData;
    saveUsuariosAutorizados(usuarios);
  }
  return usuarios;
}

export function saveUsuariosAutorizados(usuarios) {
  localStorage.setItem(USUARIOS_AUTORIZADOS_KEY, JSON.stringify(usuarios));
}