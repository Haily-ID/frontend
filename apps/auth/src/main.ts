import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { onUnauthorized } from '@haily/api'
import { useAuthStore } from '@haily/auth'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import enCommon from '@haily/utils/locales/en/common.json'
import enAuth from '@haily/utils/locales/en/auth.json'
import enErrors from '@haily/utils/locales/en/errors.json'
import idCommon from '@haily/utils/locales/id/common.json'
import idAuth from '@haily/utils/locales/id/auth.json'
import idErrors from '@haily/utils/locales/id/errors.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: { ...enCommon, ...enAuth, ...enErrors },
    id: { ...idCommon, ...idAuth, ...idErrors },
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
  router.replace('/login')
})

app.mount('#app')
