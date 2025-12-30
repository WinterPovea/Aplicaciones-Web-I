export function validarCredenciales(usuario, password) {
  // Hardcodeado para ejemplo; expande a una base de datos
  const usuarios = {
    'Winter Povea': { password: '131705', rol: 'administrador' },
    'Guardia Juan': { password: '1234', rol: 'guardia' },
    'Guardia Manuel': { password: '5678', rol: 'guardia' }
  }

  const userData = usuarios[usuario.trim()]
  if (userData && password.trim() === userData.password) {
    return { valido: true, rol: userData.rol }
  }
  return { valido: false, rol: null }
}