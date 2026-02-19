import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@haily/auth'
import { AuthLayout } from '@haily/ui'

const PUBLIC_PATHS = ['/login', '/register', '/verify-email']

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          meta: { title: 'Sign In' },
          component: () => import('../modules/login/pages/LoginPage.vue'),
        },
        {
          path: 'register',
          meta: { title: 'Create Account' },
          component: () => import('../modules/register/pages/RegisterPage.vue'),
        },
        {
          path: 'verify-email',
          meta: { title: 'Verify Email' },
          component: () => import('../modules/verify-email/pages/VerifyEmailPage.vue'),
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
  if (authStore.isAuthenticated && PUBLIC_PATHS.includes(to.path)) {
    const redirect = new URLSearchParams(window.location.search).get('redirect')
    const target = redirect ?? import.meta.env.VITE_DEFAULT_REDIRECT_URL ?? '/'
    window.location.href = target
    return false
  }
})

export default router
