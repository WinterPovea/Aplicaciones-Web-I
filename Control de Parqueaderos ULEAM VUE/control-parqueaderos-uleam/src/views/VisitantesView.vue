<template>
  <div class="dashboard">
    <Sidebar />

    <main class="main-content">
      <Topbar />

      <section class="content-section">
        <h2>Registro temporal de visitantes</h2>

        <form class="visitante-form" @submit.prevent="registrarVisitante">
          <div class="form-grid">
            <div class="form-group">
              <label for="nombre">Nombre del visitante</label>
              <input type="text" id="nombre" v-model="form.nombre" placeholder="Ej: José Ramírez" required>
            </div>

            <div class="form-group">
              <label for="cedula">Número de cédula</label>
              <input type="text" id="cedula" v-model="form.cedula" placeholder="Ej: 1312345678" required>
            </div>

            <div class="form-group">
              <label for="placa">Placa del vehículo</label>
              <input type="text" id="placa" v-model="form.placa" placeholder="Ej: ABC-1234">
            </div>

            <div class="form-group">
              <label for="destino">Persona / Facultad destino</label>
              <input type="text" id="destino" v-model="form.destino" placeholder="Ej: Facultad de Ingeniería">
            </div>

            <div class="form-group full-width">
              <label for="motivo">Motivo de la visita</label>
              <input type="text" id="motivo" v-model="form.motivo" placeholder="Ej: Entrega de documentos">
            </div>

            <div class="form-group">
              <label for="horaIngreso">Hora de ingreso</label>
              <input type="text" id="horaIngreso" v-model="horaIngreso" readonly>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-registrar">Registrar ingreso</button>
            <button type="button" class="btn-finalizar" @click="finalizarTodas">Finalizar visita</button>
          </div>
        </form>

        <div class="historial-actions" v-if="esAdministrador">
          <button type="button" class="btn-historial" @click="descargarHistorial">
            📥 Descargar historial JSON
          </button>
        </div>

        <h2>Visitantes activos</h2>

        <table class="tabla-visitantes">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Placa</th>
              <th>Destino</th>
              <th>Motivo</th>
              <th>Hora de ingreso</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(visitante, index) in visitantesActivos" :key="index">
              <td>{{ visitante.nombre }}</td>
              <td>{{ visitante.cedula }}</td>
              <td>{{ visitante.placa || "—" }}</td>
              <td>{{ visitante.destino }}</td>
              <td>{{ visitante.motivo }}</td>
              <td>{{ visitante.horaIngreso }}</td>
              <td><button class="btn-salida" @click="finalizarVisita(index)">Finalizar</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Topbar from '@/components/dashboard/Topbar.vue'
import { getVisitantesActivos, saveVisitantesActivos, getHistorialVisitantes, saveHistorialVisitantes } from '@/services/visitantesService.js'
// 🔐 Auth / Roles
const authStore = useAuthStore()

const esAdministrador = computed(() => {
  return authStore.user?.rol === 'administrador'
})


// Datos reactivos
const visitantesActivos = ref([])
const historial = ref([])
const form = reactive({
  nombre: '',
  cedula: '',
  placa: '',
  destino: '',
  motivo: ''
})
const horaIngreso = ref('')

// Cargar datos al montar
onMounted(() => {
  visitantesActivos.value = getVisitantesActivos()
  historial.value = getHistorialVisitantes()
  actualizarHoraIngreso()
})

// Actualizar hora de ingreso
function actualizarHoraIngreso() {
  const now = new Date()
  horaIngreso.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Validaciones
function validarCampos(cedula, placa) {
  if (!/^\d{10}$/.test(cedula)) {
    alert('La cédula debe tener 10 dígitos')
    return false
  }
  if (placa && !/^[A-Z]{3}-?\d{4}$/.test(placa.toUpperCase())) {
    alert('Placa inválida (ABC-1234)')
    return false
  }
  return true
}

// Registrar visitante
function registrarVisitante() {
  const nuevo = {
    nombre: form.nombre.trim(),
    cedula: form.cedula.trim(),
    placa: form.placa.trim().toUpperCase(),
    destino: form.destino.trim(),
    motivo: form.motivo.trim(),
    horaIngreso: horaIngreso.value
  }

  if (!validarCampos(nuevo.cedula, nuevo.placa)) return

  if (visitantesActivos.value.some(v => v.cedula === nuevo.cedula)) {
    alert('Este visitante ya está activo')
    return
  }

  visitantesActivos.value.push(nuevo)
  saveVisitantesActivos(visitantesActivos.value)

  // Reset form
  Object.assign(form, {
    nombre: '',
    cedula: '',
    placa: '',
    destino: '',
    motivo: ''
  })
  actualizarHoraIngreso()
}

// Finalizar visita individual
function finalizarVisita(index) {
  const v = visitantesActivos.value[index]
  if (!confirm(`¿Finalizar la visita de ${v.nombre}?`)) return

  const horaSalida = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const registro = { ...v, horaSalida }

  historial.value.push(registro)
  saveHistorialVisitantes(historial.value)

  visitantesActivos.value.splice(index, 1)
  saveVisitantesActivos(visitantesActivos.value)

  alert(`Visita finalizada a las ${horaSalida}`)
}

// Finalizar todas las visitas
function finalizarTodas() {
  if (!visitantesActivos.value.length) {
    alert('No hay visitantes')
    return
  }

  if (!confirm('¿Finalizar todas las visitas?')) return

  const horaSalida = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  visitantesActivos.value.forEach(v => {
    const registro = { ...v, horaSalida }
    historial.value.push(registro)
  })

  saveHistorialVisitantes(historial.value)

  visitantesActivos.value = []
  saveVisitantesActivos(visitantesActivos.value)
}

// Descargar historial
function descargarHistorial() {
  if (!esAdministrador.value) {
    alert('Acceso denegado: solo administradores')
    return
  }

  const blob = new Blob(
    [JSON.stringify(historial.value, null, 2)],
    { type: 'application/json' }
  )

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'historialVisitantes.json'
  a.click()
}

</script>

<style src="@/assets/css/RegistroVisitantes.css"></style>
