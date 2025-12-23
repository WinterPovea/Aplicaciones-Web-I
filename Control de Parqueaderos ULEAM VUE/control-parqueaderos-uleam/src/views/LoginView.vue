<template>
  <div class="login-body">
    <div class="login-container">
      <h2>Sistema de Control de Parqueaderos</h2>
      <h3>ULEAM</h3>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Usuario</label>
          <input v-model="usuario" type="text" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" required />
        </div>

        <button class="btn">Iniciar sesión</button>

        <div class="extras">
          <a href="#">¿Olvidó su contraseña?</a>
        </div>
      </form>

      <p v-if="mensaje" :style="{ color: colorMensaje }" class="mensaje">
        {{ mensaje }}
      </p>
    </div>
  </div>
</template>

<script>
import { validarCredenciales } from '@/services/authService'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginForm',
  data() {
    return {
      usuario: '',
      password: '',
      mensaje: '',
      colorMensaje: ''
    }
  },
  methods: {
    handleLogin() {
      const { valido, rol } = validarCredenciales(this.usuario, this.password)

      if (valido) {
        const authStore = useAuthStore()
        authStore.login(this.usuario, rol)
        this.mensaje = '✅ Acceso concedido. Redirigiendo...'
        this.colorMensaje = 'green'
        setTimeout(() => this.$router.push('/dashboard'), 1500)
      } else {
        this.mensaje = '❌ Usuario o contraseña incorrectos'
        this.colorMensaje = 'red'
      }
    }
  }
}
</script>

<style scoped src="@/assets/css/login.css"></style>