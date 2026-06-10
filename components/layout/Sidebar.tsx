'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Plug,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { getNavItems } from '@/lib/tenant'
import { cn } from '@/lib/utils'

const iconMap = {
  dashboard: LayoutDashboard,
  contacts: Users,
  orders: ShoppingBag,
  appointments: Calendar,
  platforms: Plug,
} as const

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { tenant, logout } = useAuth()
  const vertical = tenant?.vertical ?? 'hybrid'
  const navItems = getNavItems(vertical)

  const initials = tenant?.name
    ? tenant.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'V'

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-6">
        <span className="text-xl font-bold tracking-tight text-white">
          Vitmus<span className="text-vitmus-green">.</span>
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-[#1F2D23] hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.key]
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'border-l-2 border-vitmus-green bg-vitmus-green/15 pl-[10px] text-white'
                  : 'text-gray-400 hover:bg-[#1F2D23] hover:text-white'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-vitmus-green')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[#1F2D23] p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-vitmus-green/20 text-xs font-bold text-vitmus-green">
            {initials}
          </div>
          <p className="truncate text-sm font-medium text-white">
            {tenant?.name ?? 'Mi negocio'}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-2 text-gray-400 hover:bg-[#1F2D23] hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden h-screen w-60 shrink-0 bg-vitmus-sidebar lg:block">
        {content}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-60 bg-vitmus-sidebar shadow-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
