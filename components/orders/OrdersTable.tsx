'use client'

import { useMemo, useState } from 'react'
import { getFinancialStatusBadge, getOrderStatusBadge } from '@/lib/auth'
import { formatCurrency, formatDate, getFullName } from '@/lib/format'
import type { Order } from '@/types'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const PAGE_SIZE = 10

interface OrdersTableProps {
  orders: Order[]
  isLoading?: boolean
}

export function OrdersTable({ orders, isLoading }: OrdersTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((o) => o.status.toLowerCase() === statusFilter)
  }, [orders, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Select
        value={statusFilter}
        onValueChange={(value) => {
          if (value) {
            setStatusFilter(value)
            setPage(0)
          }
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">Pendiente</SelectItem>
          <SelectItem value="confirmed">Confirmado</SelectItem>
          <SelectItem value="delivered">Entregado</SelectItem>
          <SelectItem value="cancelled">Cancelado</SelectItem>
          <SelectItem value="processing">Procesando</SelectItem>
        </SelectContent>
      </Select>

      <div className="overflow-x-auto rounded-xl border border-vitmus-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de orden</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Estado de pago</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-vitmus-text-secondary">
                  No hay órdenes con este filtro
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((order) => {
                const statusBadge = getOrderStatusBadge(order.status)
                const paymentBadge = getFinancialStatusBadge(order.financial_status)
                const contactName = order.contact
                  ? getFullName(order.contact.first_name, order.contact.last_name)
                  : '—'

                return (
                  <TableRow key={order.id} className="hover:bg-green-50/40 transition-colors">
                    <TableCell className="font-medium">
                      {order.external_order_number ?? order.id}
                    </TableCell>
                    <TableCell>{contactName}</TableCell>
                    <TableCell>{formatCurrency(order.total, order.currency)}</TableCell>
                    <TableCell>
                      <StatusBadge label={statusBadge.label} variant={statusBadge.variant} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge label={paymentBadge.label} variant={paymentBadge.variant} />
                    </TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-vitmus-text-secondary">
          {filtered.length} orden{filtered.length !== 1 ? 'es' : ''}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
