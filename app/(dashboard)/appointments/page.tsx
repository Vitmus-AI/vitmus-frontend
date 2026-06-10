'use client'

import { useEffect, useState } from 'react'
import { AppointmentsTable } from '@/components/appointments/AppointmentsTable'
import { useAuth } from '@/hooks/useAuth'
import { fetchAppointments } from '@/lib/data'
import { canShowAppointments } from '@/lib/tenant'
import type { Appointment } from '@/types'

export default function AppointmentsPage() {
  const { vertical } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await fetchAppointments()
        setAppointments(data.results)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [refreshKey])

  if (!canShowAppointments(vertical)) {
    return (
      <div className="rounded-xl border border-vitmus-border bg-white py-16 text-center">
        <p className="text-vitmus-text-secondary">
          Las citas no están disponibles para negocios de ecommerce.
        </p>
      </div>
    )
  }

  return (
    <AppointmentsTable
      appointments={appointments}
      isLoading={isLoading}
      onRefresh={() => setRefreshKey((k) => k + 1)}
    />
  )
}
