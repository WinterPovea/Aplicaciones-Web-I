import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, roles: ['administrador', 'guardia'] }
  },
  {
    path: '/accesos',
    name: 'accesos',
    component: () => import('@/views/AccesosView.vue'), // Crea este archivo más tarde
    meta: { requiresAuth: true, roles: ['guardia'] }
  },
  {
    path: '/parqueaderos',
    name: 'parqueaderos',
    component: () => import('@/views/ParqueaderosView.vue'), // Crea este archivo más tarde
    meta: { requiresAuth: true, roles: ['administrador', 'guardia'] }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import('@/views/UsuariosView.vue'), // Crea este archivo más tarde
    meta: { requiresAuth: true, roles: ['administrador'] }
  },
  {
    path: '/visitantes',
    name: 'visitantes',
    component: () => import('@/views/VisitantesView.vue'), // Crea este archivo más tarde
    meta: { requiresAuth: true, roles: ['guardia'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const allowedRoles = to.meta.roles

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/') // Redirige a login si no autenticado
  } else if (requiresAuth && allowedRoles && !allowedRoles.includes(authStore.user?.rol)) {
    next('/dashboard') // Redirige a dashboard si no tiene rol permitido
  } else {
    next()
  }
})

export default router