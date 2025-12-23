// Servicio para manejar datos de vehículos
// Simula la carga desde XML

const vehiculos = [
  { placa: 'ABC-1234', cedula: '1312345678', usuario: 'Juan Pérez' },
  { placa: 'DEF-5678', cedula: '1312345679', usuario: 'María García' },
  { placa: 'GHI-9012', cedula: '1312345680', usuario: 'Carlos López' },
  // Agrega más datos según necesites
];

export function getVehiculos() {
  return vehiculos;
}