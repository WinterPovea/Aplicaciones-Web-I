// Servicio para manejar datos de parqueaderos
// Carga inicial desde JSON y persiste en localStorage

const PARQUEADEROS_KEY = 'parqueaderos';

const initialData = [
  {
    "nombre": "Parqueadero Facultad de Comunicación",
    "ubicacion": "Sector Norte - Puerta 2",
    "capacidad": 40,
    "disponibles": 15,
    "estado": "activo"
  },
  {
    "nombre": "Parqueadero Ciencias de la Salud",
    "ubicacion": "Sector Central - Hospital Universitario",
    "capacidad": 60,
    "disponibles": 40,
    "estado": "activo"
  }
];

export function getParqueaderos() {
  let parqueaderos = JSON.parse(localStorage.getItem(PARQUEADEROS_KEY));
  if (!parqueaderos || parqueaderos.length === 0) {
    parqueaderos = initialData;
    saveParqueaderos(parqueaderos);
  }
  return parqueaderos;
}

export function saveParqueaderos(parqueaderos) {
  localStorage.setItem(PARQUEADEROS_KEY, JSON.stringify(parqueaderos));
}