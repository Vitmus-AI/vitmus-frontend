export const AUTH_COOKIE_NAME = 'vitmus_access_token'
const AUTH_COOKIE_MAX_AGE_DAYS = 7

export function setAuthCookie(token: string): void {
  if (typeof document === 'undefined') return

  const maxAge = AUTH_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`
}

export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.trim().split('=')
    if (name === AUTH_COOKIE_NAME) {
      return decodeURIComponent(valueParts.join('='))
    }
  }
  return null
}
