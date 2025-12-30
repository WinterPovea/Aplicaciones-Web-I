<template>
  <aside class="sidebar">
    <div class="logo">
      <img src="/img/Logo_Uleam.png" alt="Logo ULEAM">
      <h2>Control Parqueaderos</h2>
    </div>

    <nav>
      <ul>
        <li><RouterLink to="/dashboard">🏠 Inicio</RouterLink></li>
        <li v-if="user?.rol === 'guardia'"><RouterLink to="/accesos">🚗 Control de Acceso</RouterLink></li>
        <li v-if="user?.rol === 'administrador'"><RouterLink to="/parqueaderos">🅿️ Parqueaderos</RouterLink></li>
        <li v-if="user?.rol === 'administrador'"><RouterLink to="/usuarios">👥 Usuarios</RouterLink></li>
        <li><RouterLink to="/visitantes">🧍‍♂️ Visitantes</RouterLink></li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const { user } = useAuthStore()
</script>