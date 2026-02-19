export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'error.validationError',
  EMAIL_ALREADY_EXISTS: 'error.emailAlreadyExists',
  INVALID_CREDENTIALS: 'error.invalidCredentials',
  EMAIL_NOT_VERIFIED: 'error.emailNotVerified',
  ACCOUNT_SUSPENDED: 'error.accountSuspended',
  INVALID_VERIFICATION_TOKEN: 'error.invalidVerificationToken',
  VERIFICATION_TOKEN_USED: 'error.verificationTokenUsed',
  VERIFICATION_TOKEN_EXPIRED: 'error.verificationTokenExpired',
  MAX_OTP_ATTEMPTS_EXCEEDED: 'error.maxOtpAttemptsExceeded',
  INVALID_OTP: 'error.invalidOtp',
  USER_NOT_FOUND: 'error.userNotFound',
  EMAIL_ALREADY_VERIFIED: 'error.emailAlreadyVerified',
  UNAUTHORIZED: 'error.unauthorized',
  INTERNAL_SERVER_ERROR: 'error.internalServerError',
}

export function getErrorMessageKey(code: string): string {
  return AUTH_ERROR_MESSAGES[code] ?? 'error.unknown'
}
