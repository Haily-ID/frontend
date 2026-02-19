import api from '@haily/api'
import type { VerifyEmailRequest, UserDTO, ResendOTPRequest } from '@haily/types'

export const verifyEmailService = {
  verify(payload: VerifyEmailRequest): Promise<UserDTO> {
    return api.post('/auth/verify-email', payload)
  },
  resendOTP(payload: ResendOTPRequest): Promise<{ message: string }> {
    return api.post('/auth/resend-otp', payload)
  },
}
