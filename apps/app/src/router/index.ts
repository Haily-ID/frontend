import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@haily/auth'
import { AppLayout } from '@haily/ui'

const AUTH_APP_URL = import.meta.env.VITE_AUTH_APP_URL

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          meta: { title: 'Home' },
          component: () => import('../modules/dashboard/pages/DashboardPage.vue'),
        },
      ],
    },
  ],
})

router.afterEach((to) => {
  const pageTitle = to.meta.title as string | undefined
  document.title = pageTitle ? `${pageTitle} | Haily` : 'Haily'
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    window.location.href = `${AUTH_APP_URL}/login?redirect=${encodeURIComponent(window.location.href)}`
    return false
  }
})

export default router
