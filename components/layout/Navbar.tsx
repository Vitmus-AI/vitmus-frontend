'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  IconChevronDown,
  IconLogout,
  IconSearch,
} from '@tabler/icons-react'
import { useAuth } from '@/hooks/useAuth'
import { getPageTitle } from '@/lib/tenant'

interface NavbarProps {
  isSidebarCollapsed: boolean
}

export function Navbar({ isSidebarCollapsed }: NavbarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setIsUserMenuOpen(false)
  }, [pathname])

  const initials = user?.full_name
    ? user.full_name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'U'

  return (
    <div className={`navbar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="flex items-center justify-between h-full px-5">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {getPageTitle(pathname)}
        </h1>

        <div className="hidden flex-1 max-w-md ml-8 md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full px-4 py-2 pl-10 bg-[var(--color-background-gray)] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-20)]"
            />
            <IconSearch
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            />
          </div>
        </div>

        <div className="relative ml-4" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[var(--color-background-gray)] hover:bg-[var(--color-border)] transition-colors duration-200"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-background-blue)] text-xs font-bold text-[var(--color-primary)]">
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-[var(--color-text-primary)] sm:block">
              {user?.full_name ?? 'Usuario'}
            </span>
            <IconChevronDown
              size={16}
              className={`text-[var(--color-text-secondary)] transition-transform ${
                isUserMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] z-50 py-1">
              <div className="px-4 py-2 border-b border-[var(--color-border)]">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {user?.full_name ?? 'Usuario'}
                </p>
                {user?.email && (
                  <p className="text-xs text-[var(--color-text-secondary)] truncate">
                    {user.email}
                  </p>
                )}
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-background-gray)] flex items-center gap-2 transition-colors duration-200"
              >
                <IconLogout size={16} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
