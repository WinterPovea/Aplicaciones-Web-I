<template>
  <div class="dashboard">
    <Sidebar />

    <main class="main-content">
      <Topbar />

      <section class="content-section">
        <h2>Registrar ingreso o salida de vehículos</h2>

        <form class="control-form" @submit.prevent="registrarEvento" @reset="cancelar">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="buscar">Buscar por placa o cédula</label>
              <div class="input-with-btn">
                <input type="text" id="buscar" v-model="buscar" placeholder="Ej: ABC-1234 o 1312345678" required>
                <button type="button" class="btn-verificar" @click="verificarVehiculo">Verificar</button>
              </div>
            </div>

            <div class="form-group">
              <label for="nombreUsuario">Nombre del usuario</label>
              <input type="text" id="nombreUsuario" v-model="nombreUsuario" readonly>
            </div>

            <div class="form-group">
              <label for="fechaHora">Hora y fecha actual</label>
              <input type="text" id="fechaHora" v-model="fechaHora" readonly>
            </div>

            <div class="form-group">
              <label for="accionDetectada">Acción detectada</label>
              <input type="text" id="accionDetectada" v-model="accionDetectada" readonly placeholder="Se determinará automáticamente">
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-registrar">Registrar evento</button>
            <button type="reset" class="btn-cancelar">Cancelar</button>
          </div>
        </form>

        <!-- Tabla de historial -->
        <h2>Historial reciente de movimientos</h2>

        <table class="tabla-historial">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Fecha y Hora</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(evento, index) in historial" :key="index">
              <td>{{ evento.placa }}</td>
              <td>{{ evento.usuario }}</td>
              <td><span :class="['accion', evento.tipo.toLowerCase()]">{{ evento.tipo }}</span></td>
              <td>{{ evento.fechaHora }}</td>
              <td>
                <button v-if="evento.tipo === 'Ingreso'" class="btn-finalizar-salida" @click="registrarSalidaDirecta(evento.placa, evento.usuario)">Finalizar</button>
                <span v-else>—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Topbar from '@/components/dashboard/Topbar.vue'
import { getVehiculos } from '@/services/vehiculosService.js'

// Datos reactivos
const buscar = ref('')
const nombreUsuario = ref('')
const fechaHora = ref('')
const accionDetectada = ref('')
const historial = ref([])
const estado = reactive({}) // placa: true = dentro | false = fuera
let encontrado = null

// Vehículos desde servicio
const vehiculos = getVehiculos()

// Función para obtener fecha y hora
function obtenerFechaHora() {
  return new Date().toLocaleString()
}

// Verificar vehículo
function verificarVehiculo() {
  const valor = buscar.value.trim()
  encontrado = vehiculos.find(v => v.placa === valor || v.cedula === valor)

  if (encontrado) {
    nombreUsuario.value = encontrado.usuario
    fechaHora.value = obtenerFechaHora()
    const esIngreso = !estado[encontrado.placa]
    accionDetectada.value = esIngreso ? 'Ingreso' : 'Salida'
  } else {
    alert('❌ Vehículo o usuario no encontrado')
    cancelar()
  }
}

// Registrar evento
function registrarEvento() {
  if (!encontrado) {
    alert('⚠️ Verifique un vehículo antes de registrar.')
    return
  }

  const { placa, usuario } = encontrado
  const tipo = accionDetectada.value
  const momento = fechaHora.value

  // Cambiar estado
  estado[placa] = tipo === 'Ingreso'

  // Agregar al historial
  historial.value.unshift({
    placa,
    usuario,
    tipo,
    fechaHora: momento
  })

  // Reset
  cancelar()
  encontrado = null
}

// Cancelar / Reset
function cancelar() {
  buscar.value = ''
  nombreUsuario.value = ''
  fechaHora.value = ''
  accionDetectada.value = ''
}

// Registrar salida directa desde tabla
function registrarSalidaDirecta(placa, usuario) {
  const momento = obtenerFechaHora()
  estado[placa] = false

  historial.value.unshift({
    placa,
    usuario,
    tipo: 'Salida',
    fechaHora: momento
  })

  alert(`🚗 Salida registrada para ${usuario}`)
}
</script>

<style src="@/assets/css/controlAcceso.css"></style>
