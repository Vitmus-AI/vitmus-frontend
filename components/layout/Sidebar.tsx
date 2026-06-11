'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconCalendar,
  IconChevronDown,
  IconLayoutDashboard,
  IconMenu2,
  IconPlug,
  IconShoppingBag,
  IconUsers,
} from '@tabler/icons-react'
import { useAuth } from '@/hooks/useAuth'
import { getNavItems } from '@/lib/tenant'

interface SubMenuItem {
  name: string
  path: string
  icon?: React.ReactNode
}

interface MenuItem {
  name: string
  icon: React.ReactNode
  path?: string
  submenu?: SubMenuItem[]
}

const iconMap = {
  dashboard: IconLayoutDashboard,
  contacts: IconUsers,
  orders: IconShoppingBag,
  appointments: IconCalendar,
  platforms: IconPlug,
} as const

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const { tenant } = useAuth()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const vertical = tenant?.vertical ?? 'hybrid'
  const menuItems: MenuItem[] = getNavItems(vertical).map((item) => {
    const Icon = iconMap[item.key]
    return { name: item.label, icon: <Icon size={20} />, path: item.href }
  })

  const isActive = (path: string) => pathname === path
  const hasActiveSubmenu = (submenu?: SubMenuItem[]) =>
    submenu?.some((item) => pathname === item.path) ?? false
  const toggleSubmenu = (name: string) =>
    setOpenSubmenu((open) => (open === name ? null : name))

  const initials = tenant?.name
    ? tenant.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'V'

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="flex h-full flex-col">
        <div className="sidebar-header">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Vitmus<span className="text-[var(--color-primary)]">.</span>
            </h2>
          )}
          <button
            onClick={onToggleCollapse}
            className="menu-button"
            aria-label="Alternar menú"
          >
            <IconMenu2 size={20} className="text-[var(--color-text-primary)]" />
          </button>
        </div>

        <nav className="sidebar-menu custom-scrollbar flex-1 overflow-y-auto">
          {menuItems.map((item) =>
            item.submenu ? (
              <div key={item.name}>
                <div
                  className="sidebar-menu-item text-[var(--color-text-primary)] hover:bg-[var(--color-background-gray)]"
                  onClick={() => toggleSubmenu(item.name)}
                  title={isCollapsed ? item.name : undefined}
                  data-active={hasActiveSubmenu(item.submenu)}
                >
                  <div className="item-content">
                    <span className="item-icon">{item.icon}</span>
                    <span
                      className={`item-text transition-opacity duration-200 ${
                        isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                      }`}
                    >
                      {!isCollapsed && item.name}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <IconChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openSubmenu === item.name ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>

                {!isCollapsed && (
                  <div
                    className={`sidebar-submenu bg-[var(--color-background-white)] ${
                      openSubmenu === item.name
                        ? 'border-l-2 border-[var(--color-primary)]'
                        : ''
                    }`}
                    style={{
                      maxHeight:
                        openSubmenu === item.name
                          ? `${item.submenu.length * 40}px`
                          : '0',
                      transition:
                        'max-height var(--transition-duration) var(--transition-timing)',
                    }}
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        className="sidebar-submenu-item text-[var(--color-text-primary)] hover:bg-[var(--color-background-gray)]"
                        data-active={isActive(subItem.path)}
                      >
                        <span className="item-icon">{subItem.icon}</span>
                        <span className="item-text">{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.path!}
                className="sidebar-menu-item text-[var(--color-text-primary)] hover:bg-[var(--color-background-gray)]"
                title={isCollapsed ? item.name : undefined}
                data-active={isActive(item.path!)}
              >
                <div className="item-content">
                  <span className="item-icon">{item.icon}</span>
                  <span
                    className={`item-text transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                    }`}
                  >
                    {!isCollapsed && item.name}
                  </span>
                </div>
              </Link>
            )
          )}
        </nav>

        <div
          className={`border-t border-[var(--color-border)] p-4 ${
            isCollapsed ? 'flex justify-center px-2' : ''
          }`}
          title={isCollapsed ? tenant?.name ?? 'Mi negocio' : undefined}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-background-blue)] text-xs font-bold text-[var(--color-primary)]">
              {initials}
            </div>
            {!isCollapsed && (
              <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                {tenant?.name ?? 'Mi negocio'}
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
