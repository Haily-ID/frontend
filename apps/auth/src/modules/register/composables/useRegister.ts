import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { registerService } from '../services/register.service'
import type { RegisterRequest } from '@haily/types'

export function useRegister() {
  const router = useRouter()
  const loading = ref(false)
  const errorCode = ref<string | null>(null)

  const form = reactive<RegisterRequest>({
    email: '',
    password: '',
    name: '',
  })

  async function register() {
    loading.value = true
    errorCode.value = null
    try {
      const { verification_token, user } = await registerService.register(form)
      router.push({
        path: '/verify-email',
        query: { token: verification_token, email: user.email },
      })
    } catch (err: any) {
      errorCode.value = err?.code ?? 'INTERNAL_SERVER_ERROR'
    } finally {
      loading.value = false
    }
  }

  return { form, loading, errorCode, register }
}
