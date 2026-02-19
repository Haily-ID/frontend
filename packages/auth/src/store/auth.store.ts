import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { setApiToken } from '@haily/api'
import { readSSOCookie, writeSSOCookie, clearSSOCookie } from '../cookie'
import type { UserDTO } from '@haily/types'

export const useAuthStore = defineStore('haily-auth', () => {
  const token = ref<string | null>(null)
  const user = ref<UserDTO | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function hydrate(): boolean {
    const cookieToken = readSSOCookie()
    if (cookieToken) {
      token.value = cookieToken
      setApiToken(cookieToken)
      return true
    }
    return false
  }

  function setSession(newToken: string, newUser: UserDTO): void {
    token.value = newToken
    user.value = newUser
    writeSSOCookie(newToken)
    setApiToken(newToken)
  }

  function logout(): void {
    token.value = null
    user.value = null
    clearSSOCookie()
    setApiToken(null)
  }

  return { token, user, isAuthenticated, hydrate, setSession, logout }
})
