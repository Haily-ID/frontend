import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@haily/auth'
import { AppLayout } from '@haily/ui'
import { useCompanyStore } from '../stores/company.store'

const AUTH_APP_URL = import.meta.env.VITE_AUTH_APP_URL

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true, requiresCompany: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          meta: { title: 'Home' },
          component: () => import('../modules/dashboard/pages/DashboardPage.vue'),
        },
      ],
    },
    {
      path: '/no-company',
      name: 'no-company',
      meta: { requiresAuth: true, title: 'No Company' },
      component: () => import('../modules/company/pages/NoCompanyPage.vue'),
    },
  ],
})

router.afterEach((to) => {
  const pageTitle = to.meta.title as string | undefined
  document.title = pageTitle ? `${pageTitle} | Haily` : 'Haily'
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // ── 1. Auth guard ─────────────────────────────────────────────
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    window.location.href = `${AUTH_APP_URL}/login?redirect=${encodeURIComponent(window.location.href)}`
    return false
  }

  // ── 2. Company guard ──────────────────────────────────────────
  if (authStore.isAuthenticated) {
    const companyStore = useCompanyStore()
    await companyStore.fetchMyCompanies()

    const noCompanies =
      companyStore.isLoaded && !companyStore.hasCompany

    if (noCompanies && to.name !== 'no-company') {
      return { name: 'no-company' }
    }
    if (!noCompanies && to.name === 'no-company' && companyStore.isLoaded) {
      return { name: 'dashboard' }
    }
  }
})

export default router
