export type UserStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED'
export type UserGender = 'MALE' | 'FEMALE'

export interface UserDTO {
  id: string
  email: string
  name: string
  phone: string | null
  gender: UserGender | null
  avatar_key: string | null
  status: UserStatus
  email_verified_at: number | null
  last_login_at: number | null
  created_at: number
  updated_at: number
}

// ─── Auth Requests ────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface VerifyEmailRequest {
  token: string
  otp: string
}

export interface ResendOTPRequest {
  email: string
}

// ─── Auth Responses ───────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string
  user: UserDTO
}

export interface RegisterResponse {
  user: UserDTO
  verification_token: string
  message: string
}

// ─── API Wrapper ──────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  data: T
}

export interface ApiError {
  error: string
}
