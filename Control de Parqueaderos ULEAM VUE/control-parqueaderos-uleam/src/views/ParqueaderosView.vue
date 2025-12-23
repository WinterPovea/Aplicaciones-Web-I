<template>
  <div class="dashboard">
    <Sidebar />

    <main class="main-content">
      <Topbar />

      <section class="content-section">
        <h2>Registrar nuevo parqueadero</h2>

        <form class="parqueadero-form" @submit.prevent="guardarParqueadero" @reset="cancelar">
          <div class="form-grid">
            <div class="form-group">
              <label for="nombreParqueadero">Nombre del parqueadero</label>
              <input type="text" id="nombreParqueadero" v-model="form.nombre" placeholder="Ej: Parqueadero Facultad de Comunicación" required>
            </div>

            <div class="form-group">
              <label for="ubicacion">Ubicación / Zona</label>
              <input type="text" id="ubicacion" v-model="form.ubicacion" placeholder="Ej: Sector Norte - Puerta 2" required>
            </div>

            <div class="form-group">
              <label for="capacidad">Capacidad total</label>
              <input type="number" id="capacidad" v-model.number="form.capacidad" min="1" required>
            </div>

            <div class="form-group">
              <label for="disponibles">Espacios disponibles</label>
              <input type="number" id="disponibles" v-model.number="form.disponibles" min="0" required>
            </div>

            <div class="form-group">
              <label for="estado">Estado</label>
              <select id="estado" v-model="form.estado" required>
                <option value="">Seleccione</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-guardar">Guardar</button>
            <button type="reset" class="btn-cancelar">Cancelar</button>
          </div>
        </form>

        <!-- Tabla de parqueaderos -->
        <h2>Listado de parqueaderos registrados</h2>

        <table class="tabla-parqueaderos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Capacidad</th>
              <th>Disponibles</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(parqueadero, index) in parqueaderos" :key="index">
              <td>{{ String(index + 1).padStart(3, '0') }}</td>
              <td>{{ parqueadero.nombre }}</td>
              <td>{{ parqueadero.ubicacion }}</td>
              <td>{{ parqueadero.capacidad }}</td>
              <td>{{ parqueadero.disponibles }}</td>
              <td><span :class="['estado', parqueadero.estado]">
                {{ parqueadero.estado.charAt(0).toUpperCase() + parqueadero.estado.slice(1) }}
              </span></td>
              <td>
                <button class="btn-editar" @click="editarParqueadero(index)">Editar</button>
                <button class="btn-eliminar" @click="eliminarParqueadero(index)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Topbar from '@/components/dashboard/Topbar.vue'
import { getParqueaderos, saveParqueaderos } from '@/services/parqueaderosService.js'

// Datos reactivos
const parqueaderos = ref([])
const form = reactive({
  nombre: '',
  ubicacion: '',
  capacidad: null,
  disponibles: null,
  estado: ''
})
let editIndex = null

// Cargar datos al montar
onMounted(() => {
  parqueaderos.value = getParqueaderos()
})

// Guardar parqueadero
function guardarParqueadero() {
  const data = { ...form }

  if (editIndex !== null) {
    // Editar
    parqueaderos.value[editIndex] = data
    alert('✅ Parqueadero actualizado')
    editIndex = null
  } else {
    // Agregar nuevo
    parqueaderos.value.push(data)
    alert('🅿️ Parqueadero agregado')
  }

  saveParqueaderos(parqueaderos.value)
  cancelar()
}

// Editar parqueadero
function editarParqueadero(index) {
  const p = parqueaderos.value[index]
  Object.assign(form, p)
  editIndex = index
  // Scroll al formulario (opcional)
  document.querySelector('.parqueadero-form').scrollIntoView({ behavior: 'smooth' })
}

// Eliminar parqueadero
function eliminarParqueadero(index) {
  if (confirm(`¿Eliminar "${parqueaderos.value[index].nombre}"?`)) {
    parqueaderos.value.splice(index, 1)
    saveParqueaderos(parqueaderos.value)
  }
}

// Cancelar / Reset
function cancelar() {
  Object.assign(form, {
    nombre: '',
    ubicacion: '',
    capacidad: null,
    disponibles: null,
    estado: ''
  })
  editIndex = null
}
</script>

<style src="@/assets/css/parqueadero.css"></style>
