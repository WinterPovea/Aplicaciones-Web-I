// Servicio para manejar datos de parqueaderos
// Carga inicial desde JSON y persiste en localStorage

const PARQUEADEROS_KEY = 'parqueaderos';

const initialData = [
  {
    nombre: "Parqueadero Facultad de Comunicación",
    ubicacion: "Sector Norte - Puerta 2",
    capacidad: 40,
    disponibles: 15,
    estado: "activo"
  },
  {
    nombre: "Parqueadero Ciencias de la Salud",
    ubicacion: "Sector Central - Hospital Universitario",
    capacidad: 60,
    disponibles: 40,
    estado: "activo"
  },
  {
    nombre: "Parqueadero Facultad de Ingeniería",
    ubicacion: "Sector Oeste - Edificio de Ingeniería",
    capacidad: 80,
    disponibles: 55,
    estado: "activo"
  },
  {
    nombre: "Parqueadero Administración Central",
    ubicacion: "Sector Administrativo - Rectorado",
    capacidad: 30,
    disponibles: 10,
    estado: "activo"
  },
  {
    nombre: "Parqueadero Biblioteca Central",
    ubicacion: "Sector Académico - Biblioteca",
    capacidad: 25,
    disponibles: 5,
    estado: "activo"
  },
  {
    nombre: "Parqueadero Docentes",
    ubicacion: "Sector Interno - Acceso Restringido",
    capacidad: 50,
    disponibles: 20,
    estado: "activo"
  },
  {
    nombre: "Parqueadero Visitantes",
    ubicacion: "Ingreso Principal - Puerta 1",
    capacidad: 35,
    disponibles: 12,
    estado: "activo"
  }
];



export function getParqueaderos() {
  let parqueaderos = JSON.parse(localStorage.getItem(PARQUEADEROS_KEY)) || [];

  // Agregar parqueaderos nuevos del initialData si no existen
  initialData.forEach(init => {
    const existe = parqueaderos.some(p => p.nombre === init.nombre);
    if (!existe) {
      parqueaderos.push(init);
    }
  });

  saveParqueaderos(parqueaderos);
  return parqueaderos;
}


export function saveParqueaderos(parqueaderos) {
  localStorage.setItem(PARQUEADEROS_KEY, JSON.stringify(parqueaderos));
}