import { isCurrentMonth, isSameDay } from '@/lib/format'
import { mockWeeklyRevenue, warnFallback } from '@/lib/fallbacks'
import type { Appointment, DashboardMetrics, Order, WeeklyRevenue } from '@/types'

export function calculateDashboardMetrics(
  contactsCount: number,
  orders: Order[],
  appointments: Appointment[]
): DashboardMetrics {
  const ordersThisMonth = orders.filter((o) => isCurrentMonth(o.created_at))
  const revenueThisMonth = ordersThisMonth.reduce((sum, o) => sum + parseFloat(o.total || '0'), 0)
  const appointmentsToday = appointments.filter((a) => isSameDay(a.starts_at)).length

  return {
    total_contacts: contactsCount,
    orders_this_month: ordersThisMonth.length,
    revenue_this_month: revenueThisMonth.toString(),
    appointments_today: appointmentsToday,
    recent_orders: orders.slice(0, 5),
  }
}

export function calculateWeeklyRevenue(orders: Order[]): WeeklyRevenue[] {
  const now = new Date()
  const weeks: WeeklyRevenue[] = []

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - i * 7 - now.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    const revenue = orders
      .filter((o) => {
        const date = new Date(o.created_at)
        return date >= weekStart && date < weekEnd
      })
      .reduce((sum, o) => sum + parseFloat(o.total || '0'), 0)

    const label = `Sem ${8 - i}`
    weeks.push({ week: label, revenue })
  }

  const hasData = weeks.some((w) => w.revenue > 0)
  if (!hasData) {
    warnFallback('weekly revenue calculation')
    return mockWeeklyRevenue
  }

  return weeks
}
