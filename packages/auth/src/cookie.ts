const COOKIE_NAME = 'haily_token'
const COOKIE_DOMAIN = '.haily.id'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24h

function isLocalDev(): boolean {
  return typeof window !== 'undefined' && window.location.hostname === 'localhost'
}

export function writeSSOCookie(token: string): void {
  const maxAge = `Max-Age=${COOKIE_MAX_AGE}`
  const domain = isLocalDev() ? '' : `; Domain=${COOKIE_DOMAIN}`
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${token}; Path=/; SameSite=Lax; ${maxAge}${domain}${secure}`
}

export function readSSOCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  return match ? match[1] : null
}

export function clearSSOCookie(): void {
  const domain = isLocalDev() ? '' : `; Domain=${COOKIE_DOMAIN}`
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0${domain}`
}
