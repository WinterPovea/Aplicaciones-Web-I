<template>
  <div class="dashboard">
    <Sidebar />

    <main class="main-content">
      <Topbar />

      <section class="content-section">
        <h2>Registrar persona autorizada</h2>

        <form class="registro-form" @submit.prevent="guardarUsuario" @reset="cancelar">
          <div class="form-grid">
            <div class="form-group">
              <label for="nombre">Nombre completo</label>
              <input type="text" id="nombre" v-model="form.nombre" required>
            </div>

            <div class="form-group">
              <label for="cedula">Cédula / ID ULEAM</label>
              <input type="text" id="cedula" v-model="form.cedula" required>
            </div>

            <div class="form-group">
              <label for="tipoUsuario">Tipo de usuario</label>
              <select id="tipoUsuario" v-model="form.tipoUsuario" required>
                <option value="">Seleccione</option>
                <option value="profesor">Profesor</option>
                <option value="estudiante">Estudiante</option>
                <option value="administrativo">Personal administrativo</option>
              </select>
            </div>

            <div class="form-group">
              <label for="facultad">Facultad / Departamento</label>
              <input type="text" id="facultad" v-model="form.facultad" required>
            </div>

            <div class="form-group">
              <label for="placa">Número de placa</label>
              <input type="text" id="placa" v-model="form.placa" required>
            </div>

            <div class="form-group">
              <label for="tipoVehiculo">Tipo de vehículo</label>
              <select id="tipoVehiculo" v-model="form.tipoVehiculo" required>
                <option value="">Seleccione</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
            </div>

            <div class="form-group">
              <label for="correo">Correo institucional</label>
              <input type="email" id="correo" v-model="form.correo" required>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-registrar">Registrar</button>
            <button type="reset" class="btn-cancelar">Cancelar</button>
          </div>
        </form>

        <!-- Tabla usuarios -->
        <h2>Listado de personas autorizadas</h2>

        <div class="buscador">
          <input
            type="text"
            id="buscadorUsuarios"
            v-model="buscador"
            placeholder="🔍 Buscar por nombre, cédula, placa, facultad, tipo, vehículo..."
          >
        </div>

        <table class="tabla-autorizados">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Tipo</th>
              <th>Facultad / Departamento</th>
              <th>Placa</th>
              <th>Vehículo</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(usuario, index) in usuariosFiltrados" :key="usuario.cedula">
              <td>{{ String(usuarios.indexOf(usuario) + 1).padStart(3, '0') }}</td>
              <td>{{ usuario.nombre }}</td>
              <td>{{ usuario.cedula }}</td>
              <td>{{ usuario.tipoUsuario }}</td>
              <td>{{ usuario.facultad }}</td>
              <td>{{ usuario.placa }}</td>
              <td>{{ usuario.tipoVehiculo }}</td>
              <td>{{ usuario.correo }}</td>
              <td>
                <button class="btn-editar" @click="editarUsuario(usuario)">Editar</button>
                <button class="btn-eliminar" @click="eliminarUsuario(usuario)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Topbar from '@/components/dashboard/Topbar.vue'
import { getUsuariosAutorizados, saveUsuariosAutorizados } from '@/services/usuariosService.js'

// Datos reactivos
const usuarios = ref([])
const buscador = ref('')
const form = reactive({
  nombre: '',
  cedula: '',
  tipoUsuario: '',
  facultad: '',
  placa: '',
  tipoVehiculo: '',
  correo: ''
})
let editUsuario = null

// Computed para filtrado
const usuariosFiltrados = computed(() => {
  const texto = buscador.value.toLowerCase().trim()
  if (!texto) return usuarios.value
  return usuarios.value.filter(u =>
    u.nombre.toLowerCase().includes(texto) ||
    u.cedula.toLowerCase().includes(texto) ||
    u.placa.toLowerCase().includes(texto) ||
    u.tipoUsuario.toLowerCase().includes(texto) ||
    u.tipoVehiculo.toLowerCase().includes(texto) ||
    u.facultad.toLowerCase().includes(texto)
  )
})

// Cargar datos al montar
onMounted(() => {
  usuarios.value = getUsuariosAutorizados()
})

// Validaciones
function validar(data) {
  if (!/^\d{10}$/.test(data.cedula)) {
    alert('⚠️ La cédula debe tener exactamente 10 dígitos.')
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
    alert('⚠️ Ingrese un correo válido.')
    return false
  }
  if (!/^[A-Z]{3}-\d{4}$/.test(data.placa.toUpperCase())) {
    alert('⚠️ La placa debe tener el formato ABC-1234.')
    return false
  }
  return true
}

// Guardar usuario
function guardarUsuario() {
  const data = {
    nombre: form.nombre.trim(),
    cedula: form.cedula.trim(),
    tipoUsuario: form.tipoUsuario,
    facultad: form.facultad.trim(),
    placa: form.placa.trim().toUpperCase(),
    tipoVehiculo: form.tipoVehiculo,
    correo: form.correo.trim()
  }

  if (!validar(data)) return

  if (editUsuario) {
    // Editar
    const index = usuarios.value.indexOf(editUsuario)
    usuarios.value[index] = data
    alert('✅ Usuario actualizado correctamente.')
    editUsuario = null
  } else {
    // Agregar
    usuarios.value.push(data)
    alert('👥 Usuario agregado exitosamente.')
  }

  saveUsuariosAutorizados(usuarios.value)
  cancelar()
}

// Editar usuario
function editarUsuario(usuario) {
  Object.assign(form, usuario)
  editUsuario = usuario
  // Scroll al formulario
  document.querySelector('.registro-form').scrollIntoView({ behavior: 'smooth' })
}

// Eliminar usuario
function eliminarUsuario(usuario) {
  if (confirm(`¿Eliminar a "${usuario.nombre}"?`)) {
    const index = usuarios.value.indexOf(usuario)
    usuarios.value.splice(index, 1)
    saveUsuariosAutorizados(usuarios.value)
  }
}

// Cancelar
function cancelar() {
  Object.assign(form, {
    nombre: '',
    cedula: '',
    tipoUsuario: '',
    facultad: '',
    placa: '',
    tipoVehiculo: '',
    correo: ''
  })
  editUsuario = null
}
</script>

<style src="@/assets/css/Usuarios.css"></style>
