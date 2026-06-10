'use client'

import { useEffect, useState } from 'react'
import { Calendar, DollarSign, ShoppingBag, Users } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { fetchAppointments, fetchContacts, fetchOrders } from '@/lib/data'
import { formatCurrency } from '@/lib/format'
import { calculateDashboardMetrics, calculateWeeklyRevenue } from '@/lib/metrics'
import { canShowAppointments, canShowOrders } from '@/lib/tenant'
import type { DashboardMetrics, WeeklyRevenue } from '@/types'

export default function DashboardPage() {
  const { vertical } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [weeklyRevenue, setWeeklyRevenue] = useState<WeeklyRevenue[]>([])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [contactsRes, ordersRes, appointmentsRes] = await Promise.all([
          fetchContacts(),
          fetchOrders({ ordering: '-created_at', limit: '50' }),
          fetchAppointments(),
        ])

        const calculated = calculateDashboardMetrics(
          contactsRes.count,
          ordersRes.results,
          appointmentsRes.results
        )

        setMetrics(calculated)
        setWeeklyRevenue(calculateWeeklyRevenue(ordersRes.results))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  const showOrders = canShowOrders(vertical)
  const showAppointments = canShowAppointments(vertical)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MetricCard
          label="Total Contactos"
          value={metrics?.total_contacts ?? 0}
          icon={Users}
          accentColor="#22C55E"
        />
        {showOrders && (
          <MetricCard
            label="Órdenes este mes"
            value={metrics?.orders_this_month ?? 0}
            icon={ShoppingBag}
            accentColor="#3B82F6"
          />
        )}
        <MetricCard
          label="Facturado este mes"
          value={formatCurrency(metrics?.revenue_this_month ?? '0')}
          icon={DollarSign}
          accentColor="#22C55E"
        />
        {showAppointments && (
          <MetricCard
            label="Citas hoy"
            value={metrics?.appointments_today ?? 0}
            icon={Calendar}
            accentColor="#F97316"
          />
        )}
      </div>

      {showOrders && <RevenueChart data={weeklyRevenue} />}

      {showOrders && (
        <RecentOrdersTable orders={metrics?.recent_orders ?? []} />
      )}
    </div>
  )
}
