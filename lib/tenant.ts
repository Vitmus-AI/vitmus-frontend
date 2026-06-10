import type { Tenant } from '@/types'

export interface NavItemConfig {
  label: string
  href: string
  key: 'dashboard' | 'contacts' | 'orders' | 'appointments' | 'platforms'
}

const ALL_NAV_ITEMS: NavItemConfig[] = [
  { label: 'Dashboard', href: '/', key: 'dashboard' },
  { label: 'Contactos', href: '/contacts', key: 'contacts' },
  { label: 'Órdenes', href: '/orders', key: 'orders' },
  { label: 'Citas', href: '/appointments', key: 'appointments' },
  { label: 'Plataformas', href: '/platforms', key: 'platforms' },
]

export function canShowOrders(vertical: Tenant['vertical']): boolean {
  return vertical !== 'services'
}

export function canShowAppointments(vertical: Tenant['vertical']): boolean {
  return vertical !== 'ecommerce'
}

export function canShowPlatforms(vertical: Tenant['vertical']): boolean {
  return vertical !== 'services'
}

export function getNavItems(vertical: Tenant['vertical']): NavItemConfig[] {
  return ALL_NAV_ITEMS.filter((item) => {
    if (item.key === 'orders') return canShowOrders(vertical)
    if (item.key === 'appointments') return canShowAppointments(vertical)
    if (item.key === 'platforms') return canShowPlatforms(vertical)
    return true
  })
}

export function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/contacts': 'Contactos',
    '/orders': 'Órdenes',
    '/appointments': 'Citas',
    '/platforms': 'Plataformas',
  }
  return titles[pathname] ?? 'Vitmus'
}
