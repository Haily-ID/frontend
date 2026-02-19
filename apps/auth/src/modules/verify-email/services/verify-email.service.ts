import api from '@haily/api'
import type { VerifyEmailRequest, LoginResponse, ResendOTPRequest } from '@haily/types'

export const verifyEmailService = {
  verify(payload: VerifyEmailRequest): Promise<LoginResponse> {
    return api.post('/auth/verify-email', payload)
  },
  resendOTP(payload: ResendOTPRequest): Promise<{ message: string }> {
    return api.post('/auth/resend-otp', payload)
  },
}
