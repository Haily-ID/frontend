import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { verifyEmailService } from '../services/verify-email.service'

export function useVerifyEmail() {
  const router = useRouter()
  const route = useRoute()

  const token = ref((route.query.token as string) ?? '')
  const email = ref((route.query.email as string) ?? '')

  const loading = ref(false)
  const resendLoading = ref(false)
  const errorCode = ref<string | null>(null)
  const resendCooldown = ref(0)
  const resendSuccess = ref(false)

  const form = reactive({ otp: '' })

  const COOLDOWN_KEY = 'haily_resend_cooldown_until'
  let countdownInterval: ReturnType<typeof setInterval> | null = null

  function startCountdownTick() {
    countdownInterval = setInterval(() => {
      const until = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0)
      const remaining = Math.ceil((until - Date.now()) / 1000)
      if (remaining <= 0) {
        resendCooldown.value = 0
        localStorage.removeItem(COOLDOWN_KEY)
        if (countdownInterval) {
          clearInterval(countdownInterval)
          countdownInterval = null
        }
      } else {
        resendCooldown.value = remaining
      }
    }, 1000)
  }

  function startCooldown(seconds = 60) {
    const until = Date.now() + seconds * 1000
    localStorage.setItem(COOLDOWN_KEY, String(until))
    resendCooldown.value = seconds
    if (countdownInterval) clearInterval(countdownInterval)
    startCountdownTick()
  }

  onMounted(() => {
    const until = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0)
    const remaining = Math.ceil((until - Date.now()) / 1000)
    if (remaining > 0) {
      resendCooldown.value = remaining
      startCountdownTick()
    } else {
      localStorage.removeItem(COOLDOWN_KEY)
      startCooldown()
    }
  })
  onUnmounted(() => {
    if (countdownInterval) clearInterval(countdownInterval)
  })

  async function verify() {
    loading.value = true
    errorCode.value = null
    try {
      await verifyEmailService.verify({ token: token.value, otp: form.otp })
      router.push('/login')
    } catch (err: any) {
      errorCode.value = err?.code ?? 'INTERNAL_SERVER_ERROR'
    } finally {
      loading.value = false
    }
  }

  async function resendOTP() {
    resendLoading.value = true
    errorCode.value = null
    try {
      await verifyEmailService.resendOTP({ email: email.value })
      resendSuccess.value = true
      startCooldown()
    } catch (err: any) {
      errorCode.value = err?.code ?? 'INTERNAL_SERVER_ERROR'
    } finally {
      resendLoading.value = false
    }
  }

  return {
    form,
    email,
    loading,
    resendLoading,
    errorCode,
    resendCooldown,
    resendSuccess,
    verify,
    resendOTP,
  }
}
