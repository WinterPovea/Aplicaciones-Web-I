import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null) // { nombre: string, rol: 'administrador' | 'guardia' }
  const isAuthenticated = ref(false)

  function login(usuario, rol) {
    user.value = { nombre: usuario, rol }
    isAuthenticated.value = true
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  return { user, isAuthenticated, login, logout }
})