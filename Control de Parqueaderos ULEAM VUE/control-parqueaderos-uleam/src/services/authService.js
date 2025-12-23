export function validarCredenciales(usuario, password) {
  // Hardcodeado para ejemplo; expande a una base de datos
  const usuarios = {
    'Pedro Zambrano': { password: '1234', rol: 'administrador' },
    'Guardia Juan': { password: '5678', rol: 'guardia' } // Agrega más usuarios si necesitas
  }

  const userData = usuarios[usuario.trim()]
  if (userData && password.trim() === userData.password) {
    return { valido: true, rol: userData.rol }
  }
  return { valido: false, rol: null }
}