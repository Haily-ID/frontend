import axios from 'axios'

let _token: string | null = null
let _onUnauthorized: (() => void) | null = null

export function setApiToken(token: string | null): void {
  _token = token
}

export function onUnauthorized(handler: () => void): void {
  _onUnauthorized = handler
}

const api = axios.create({
  baseURL: typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_API_BASE_URL : '',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res.data.data,
  (err) => {
    const url: string = err.config?.url ?? ''
    const isAuthEndpoint = /\/auth\/(login|register|verify-email|resend-otp|forgot-password|reset-password)/.test(url)
    if (err.response?.status === 401 && _onUnauthorized && !isAuthEndpoint) {
      _onUnauthorized()
      return new Promise(() => {})
    }
    const code: string = err.response?.data?.error ?? 'INTERNAL_SERVER_ERROR'
    return Promise.reject({ code })
  },
)

export default api
