import { ref, reactive } from 'vue'
import { useAuthStore } from '@haily/auth'
import { loginService } from '../services/login.service'
import type { LoginRequest } from '@haily/types'

export function useLogin() {
  const authStore = useAuthStore()
  const loading = ref(false)
  const errorCode = ref<string | null>(null)

  const form = reactive<LoginRequest>({
    email: '',
    password: '',
  })

  async function login(redirectUrl?: string | null) {
    loading.value = true
    errorCode.value = null
    try {
      const { token, user } = await loginService.login(form)
      authStore.setSession(token, user)
      const target = redirectUrl ?? import.meta.env.VITE_DEFAULT_REDIRECT_URL ?? '/'
      window.location.href = target
    } catch (err: any) {
      errorCode.value = err?.code ?? 'INTERNAL_SERVER_ERROR'
    } finally {
      loading.value = false
    }
  }

  return { form, loading, errorCode, login }
}
