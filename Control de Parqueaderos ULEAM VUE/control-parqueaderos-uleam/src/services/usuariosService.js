// Servicio para manejar datos de usuarios autorizados

const USUARIOS_AUTORIZADOS_KEY = 'usuariosAutorizados';

const initialData = [
  {
    nombre: "Lucía Torres",
    cedula: "1312345678",
    tipoUsuario: "Docente",
    facultad: "Ciencias Administrativas",
    placa: "ABC-1234",
    tipoVehiculo: "Automóvil",
    correo: "l.torres@uleam.edu.ec"
  },
  {
    nombre: "Carlos Mendoza",
    cedula: "1318765432",
    tipoUsuario: "Estudiante",
    facultad: "Ingeniería",
    placa: "MBD-0987",
    tipoVehiculo: "Motocicleta",
    correo: "c.mendoza@uleam.edu.ec"
  },
  {
    nombre: "María Fernanda Ponce",
    cedula: "1311122233",
    tipoUsuario: "Administrativo",
    facultad: "Rectorado",
    placa: "GHI-4567",
    tipoVehiculo: "Automóvil",
    correo: "m.ponce@uleam.edu.ec"
  },
  {
    nombre: "José Luis Zambrano",
    cedula: "1314455667",
    tipoUsuario: "Docente",
    facultad: "Ciencias de la Salud",
    placa: "JKL-7788",
    tipoVehiculo: "Automóvil",
    correo: "j.zambrano@uleam.edu.ec"
  },
  {
    nombre: "Andrea Belén Macías",
    cedula: "1319988776",
    tipoUsuario: "Estudiante",
    facultad: "Comunicación",
    placa: "PQR-3344",
    tipoVehiculo: "Motocicleta",
    correo: "a.macias@uleam.edu.ec"
  },
  {
    nombre: "Luis Alberto Cedeño",
    cedula: "1312233445",
    tipoUsuario: "Docente",
    facultad: "Ingeniería",
    placa: "STU-8899",
    tipoVehiculo: "Camioneta",
    correo: "l.cedeno@uleam.edu.ec"
  },
  {
    nombre: "Diana Carolina Vélez",
    cedula: "1315566778",
    tipoUsuario: "Administrativo",
    facultad: "Biblioteca Central",
    placa: "VWX-1122",
    tipoVehiculo: "Automóvil",
    correo: "d.velez@uleam.edu.ec"
  },
  {
    nombre: "Kevin Andrés Loor",
    cedula: "1316677889",
    tipoUsuario: "Estudiante",
    facultad: "Educación",
    placa: "YZA-5566",
    tipoVehiculo: "Motocicleta",
    correo: "k.loor@uleam.edu.ec"
  }
];


export function getUsuariosAutorizados() {
  let usuarios = JSON.parse(localStorage.getItem(USUARIOS_AUTORIZADOS_KEY));

  if (!usuarios) {
    usuarios = initialData;
    saveUsuariosAutorizados(usuarios);
  } else {
    // Agrega nuevos sin borrar los existentes
    initialData.forEach(nuevo => {
      if (!usuarios.some(u => u.cedula === nuevo.cedula)) {
        usuarios.push(nuevo);
      }
    });
    saveUsuariosAutorizados(usuarios);
  }

  return usuarios;
}


export function saveUsuariosAutorizados(usuarios) {
  localStorage.setItem(USUARIOS_AUTORIZADOS_KEY, JSON.stringify(usuarios));
}