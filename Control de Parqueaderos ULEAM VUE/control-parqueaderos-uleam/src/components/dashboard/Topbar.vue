<template>
  <header class="topbar">
    <h1>Panel de Control</h1>

    <div class="user-info">
      <span>{{ user?.rol === 'administrador' ? 'Administrador' : 'Guardia' }}: <b>{{ user?.nombre }}</b></span>
      <button class="logout-btn" @click="logout">Cerrar sesión</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { user, logout: storeLogout } = useAuthStore()

function logout() {
  storeLogout()
  router.push('/')
}
</script>