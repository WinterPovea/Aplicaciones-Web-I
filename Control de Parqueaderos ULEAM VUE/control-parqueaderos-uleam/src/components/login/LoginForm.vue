<template>
  <!-- ...existing code... -->
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