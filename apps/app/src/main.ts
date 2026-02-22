import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { onUnauthorized } from '@haily/api'
import { useAuthStore } from '@haily/auth'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import enCommon from '@haily/utils/locales/en/common.json'
import enErrors from '@haily/utils/locales/en/errors.json'
import idCommon from '@haily/utils/locales/id/common.json'
import idErrors from '@haily/utils/locales/id/errors.json'
import enApp from './locales/en/app.json'
import idApp from './locales/id/app.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: { ...enCommon, ...enErrors, ...enApp },
    id: { ...idCommon, ...idErrors, ...idApp },
  },
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

const authStore = useAuthStore()
authStore.hydrate()

onUnauthorized(() => {
  authStore.logout()
  const authUrl = import.meta.env.VITE_AUTH_APP_URL ?? '/'
  window.location.href = `${authUrl}/login?redirect=${encodeURIComponent(window.location.href)}`
})

app.mount('#app')
