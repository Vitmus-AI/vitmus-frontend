import axios from 'axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '@/lib/api'
import { clearAuthCookie, setAuthCookie } from '@/lib/cookies'
import { mockTenant, mockUser, warnFallback } from '@/lib/fallbacks'
import type { MeResponse, Tenant, TokenResponse, User } from '@/types'

interface AuthStore {
  user: User | null
  tenant: Tenant | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  hasHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setTenant: (tenant: Tenant) => void
  setHasHydrated: (value: boolean) => void
}

const authAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tenant: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      login: async (email, password) => {
        const { data } = await authAxios.post<TokenResponse>('/auth/token/', {
          email,
          password,
        })

        set({
          accessToken: data.access,
          refreshToken: data.refresh,
          isAuthenticated: true,
        })

        setAuthCookie(data.access)

        try {
          const meResponse = await apiClient.get<MeResponse>('/auth/me/')
          set({
            user: meResponse.data.user,
            tenant: meResponse.data.tenant,
          })
        } catch {
          warnFallback('GET /auth/me/')
          set({
            user: { ...mockUser, email },
            tenant: mockTenant,
          })
        }
      },

      logout: () => {
        set({
          user: null,
          tenant: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
        clearAuthCookie()

        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      },

      setTenant: (tenant) => set({ tenant }),
    }),
    {
      name: 'vitmus-auth',
      partialize: (state) => ({
        user: state.user,
        tenant: state.tenant,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAuthCookie(state.accessToken)
        }
        state?.setHasHydrated(true)
      },
    }
  )
)

export function getIsAuthenticated(): boolean {
  const state = useAuthStore.getState()
  return state.isAuthenticated && !!state.accessToken
}
