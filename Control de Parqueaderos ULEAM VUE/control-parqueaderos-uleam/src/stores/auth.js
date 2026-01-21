import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  //Estado usuario
  const user = ref(null) // { nombre: string, rol: 'administrador' | 'guardia' }
  //Estado autenticación
  const isAuthenticated = ref(false)

  // Inicializar desde localStorage
  function init() {
    const storedUser = localStorage.getItem('user')
    const storedAuth = localStorage.getItem('isAuthenticated')
    if (storedUser && storedAuth === 'true') {
      user.value = JSON.parse(storedUser) // Parsear el usuario almacenado
      isAuthenticated.value = true
    }
  }

  function login(usuario, rol) {
    user.value = { nombre: usuario, rol }
    isAuthenticated.value = true
    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(user.value)) // Guardar el usuario como string
    localStorage.setItem('isAuthenticated', 'true')
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    // Remover de localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated') // Al volver atras no hay sesión
  }

  return { user, isAuthenticated, login, logout, init }
})