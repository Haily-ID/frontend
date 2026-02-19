import api from '@haily/api'
import type { RegisterRequest, RegisterResponse } from '@haily/types'

export const registerService = {
  register(payload: RegisterRequest): Promise<RegisterResponse> {
    return api.post('/auth/register', payload)
  },
}
