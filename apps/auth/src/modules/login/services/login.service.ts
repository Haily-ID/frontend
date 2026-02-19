import api from '@haily/api'
import type { LoginRequest, LoginResponse } from '@haily/types'

export const loginService = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return api.post('/auth/login', payload)
  },
}
