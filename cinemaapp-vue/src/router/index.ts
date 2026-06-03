import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/cliente/listar-filmes',
      name: 'cliente-listar-filmes',
      component: () => import('@/views/cliente/ClienteListarFilmesView.vue'),
      meta: { requiresAuth: true, role: 'cliente' },
    },
    {
      path: '/admin',
      name: 'admin-home',
      component: () => import('@/views/admin/AdminHomeView.vue'),
      meta: { requiresAuth: true, role: 'administrador' },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (!to.meta.requiresAuth) {
    return true
  }

  if (auth.user.tipo === 'guest') {
    return '/login'
  }

  if (to.meta.role === 'administrador' && auth.user.tipo !== 'administrador') {
    return '/cliente/listar-filmes'
  }

  if (to.meta.role === 'cliente' && auth.user.tipo === 'administrador') {
    return '/admin'
  }

  return true
})

export default router