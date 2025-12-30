<template>
  <section class="cards">
    <div class="card">
      <h3>Vehículos dentro</h3>
      <p>{{ vehiculosDentro }}</p>
    </div>

    <div class="card">
      <h3>Estudiantes autorizados</h3>
      <p>{{ estudiantesAutorizados }}</p>
    </div>

    <div class="card">
      <h3>Docentes autorizados</h3>
      <p>{{ docentesAutorizados }}</p>
    </div>

    <div class="card">
      <h3>Visitantes activos</h3>
      <p>{{ visitantesActivos }}</p>
    </div>

    <div class="card">
      <h3>Personal administrativo</h3>
      <p>{{ administrativos }}</p>
    </div>

    <div class="card">
      <h3>Últimos ingresos</h3>
      <ul>
        <li v-for="ingreso in ultimosIngresos" :key="ingreso.fechaHora">
          {{ ingreso.fechaHora.split(' ')[1] }} - {{ ingreso.placa }}
        </li>
      </ul>
    </div>
  </section>

  <section class="chart-section">
    <h3>Estadísticas Generales</h3>
    <Bar :data="chartData" :options="chartOptions" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsuariosAutorizados } from '@/services/usuariosService.js'
import { getVisitantesActivos } from '@/services/visitantesService.js'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Datos reactivos
const vehiculosDentro = ref(0)
const estudiantesAutorizados = ref(0)
const docentesAutorizados = ref(0)
const visitantesActivos = ref(0)
const administrativos = ref(0)
const ultimosIngresos = ref([])
const chartData = ref({
  labels: [],
  datasets: []
})
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Estadísticas del Sistema'
    }
  }
})

onMounted(() => {
  // Calcular vehículos dentro
  const estadoVehiculos = JSON.parse(localStorage.getItem('estadoVehiculos') || '{}')
  vehiculosDentro.value = Object.values(estadoVehiculos).filter(estado => estado === true).length

  // Calcular usuarios
  const usuarios = getUsuariosAutorizados()
  estudiantesAutorizados.value = usuarios.filter(u => u.tipoUsuario === 'Estudiante').length
  docentesAutorizados.value = usuarios.filter(u => u.tipoUsuario === 'Docente').length
  administrativos.value = usuarios.filter(u => u.tipoUsuario === 'Administrativo').length

  // Visitantes activos
  visitantesActivos.value = getVisitantesActivos().length

  // Obtener últimos ingresos
  const historial = JSON.parse(localStorage.getItem('historialAccesos') || '[]')
  ultimosIngresos.value = historial
    .filter(evento => evento.tipo === 'Ingreso')
    .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))
    .slice(0, 3)

  // Datos del gráfico
  chartData.value = {
    labels: ['Vehículos Dentro', 'Estudiantes', 'Docentes', 'Administrativos', 'Visitantes'],
    datasets: [
      {
        label: 'Cantidad',
        data: [
          vehiculosDentro.value,
          estudiantesAutorizados.value,
          docentesAutorizados.value,
          administrativos.value,
          visitantesActivos.value
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
})
</script>
