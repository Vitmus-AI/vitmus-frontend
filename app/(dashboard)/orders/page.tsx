'use client'

import { useEffect, useState } from 'react'
import { OrdersTable } from '@/components/orders/OrdersTable'
import { useAuth } from '@/hooks/useAuth'
import { fetchOrders } from '@/lib/data'
import { canShowOrders } from '@/lib/tenant'
import type { Order } from '@/types'

export default function OrdersPage() {
  const { vertical } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await fetchOrders({ ordering: '-created_at' })
        setOrders(data.results)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (!canShowOrders(vertical)) {
    return (
      <div className="rounded-xl border border-vitmus-border bg-white py-16 text-center">
        <p className="text-vitmus-text-secondary">
          Las órdenes no están disponibles para negocios de servicios.
        </p>
      </div>
    )
  }

  return <OrdersTable orders={orders} isLoading={isLoading} />
}
