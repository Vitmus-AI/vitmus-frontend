export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

export function getSourceBadge(platform?: string, sourceMode?: string): { label: string; variant: BadgeVariant } {
  if (sourceMode === 'native' || !platform) {
    return { label: 'Nativo', variant: 'success' }
  }

  const normalized = platform.toLowerCase()
  if (normalized.includes('shopify')) return { label: 'Shopify', variant: 'info' }
  if (normalized.includes('woo')) return { label: 'WooCommerce', variant: 'warning' }
  if (normalized.includes('tiendanube')) return { label: 'Tiendanube', variant: 'info' }

  return { label: platform, variant: 'default' }
}

export function getOrderStatusBadge(status: string): { label: string; variant: BadgeVariant } {
  const normalized = status.toLowerCase()
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    delivered: { label: 'Entregado', variant: 'success' },
    pending: { label: 'Pendiente', variant: 'warning' },
    cancelled: { label: 'Cancelado', variant: 'danger' },
    processing: { label: 'Procesando', variant: 'info' },
    confirmed: { label: 'Confirmado', variant: 'info' },
  }
  return map[normalized] ?? { label: status, variant: 'default' }
}

export function getFinancialStatusBadge(status: string): { label: string; variant: BadgeVariant } {
  const normalized = status.toLowerCase()
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    paid: { label: 'Pagado', variant: 'success' },
    pending: { label: 'Pendiente', variant: 'warning' },
    refunded: { label: 'Reembolsado', variant: 'danger' },
  }
  return map[normalized] ?? { label: status, variant: 'default' }
}

export function getAppointmentStatusBadge(status: string): { label: string; variant: BadgeVariant } {
  const normalized = status.toLowerCase()
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    completed: { label: 'Completada', variant: 'success' },
    confirmed: { label: 'Confirmada', variant: 'info' },
    scheduled: { label: 'Programada', variant: 'warning' },
    cancelled: { label: 'Cancelada', variant: 'danger' },
    no_show: { label: 'No asistió', variant: 'danger' },
  }
  return map[normalized] ?? { label: status, variant: 'default' }
}

export function getPlatformColor(platformType: string): string {
  const normalized = platformType.toLowerCase()
  if (normalized.includes('shopify')) return '#22C55E'
  if (normalized.includes('woo')) return '#7C3AED'
  if (normalized.includes('tiendanube')) return '#3B82F6'
  return '#6B7280'
}

export const badgeVariantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
}
