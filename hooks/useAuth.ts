'use client'

import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const tenant = useAuthStore((s) => s.tenant)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  const setTenant = useAuthStore((s) => s.setTenant)

  return {
    user,
    tenant,
    vertical: tenant?.vertical ?? 'hybrid',
    isAuthenticated,
    hasHydrated,
    login,
    logout,
    setTenant,
  }
}
