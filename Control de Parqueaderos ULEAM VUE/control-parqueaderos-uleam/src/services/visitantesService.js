// Servicio para manejar datos de visitantes
// Visitantes activos y historial

const VISITANTES_ACTIVOS_KEY = 'visitantesActivos';
const HISTORIAL_VISITANTES_KEY = 'historialVisitantes';

const initialActivos = []; // Puedes agregar datos iniciales si quieres

export function getVisitantesActivos() {
  let visitantes = JSON.parse(localStorage.getItem(VISITANTES_ACTIVOS_KEY));
  if (!visitantes) {
    visitantes = initialActivos;
    saveVisitantesActivos(visitantes);
  }
  return visitantes;
}

export function saveVisitantesActivos(visitantes) {
  localStorage.setItem(VISITANTES_ACTIVOS_KEY, JSON.stringify(visitantes));
}

export function getHistorialVisitantes() {
  return JSON.parse(localStorage.getItem(HISTORIAL_VISITANTES_KEY)) || [];
}

export function saveHistorialVisitantes(historial) {
  localStorage.setItem(HISTORIAL_VISITANTES_KEY, JSON.stringify(historial));
}