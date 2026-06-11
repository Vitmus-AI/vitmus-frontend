import { ShoppingBag } from 'lucide-react'
import { getFinancialStatusBadge, getOrderStatusBadge } from '@/lib/auth'
import { formatCurrency, formatDate, getFullName } from '@/lib/format'
import type { Order } from '@/types'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface RecentOrdersTableProps {
  orders: Order[]
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
        Órdenes recientes
      </h2>
      <div>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-vitmus-green/10">
              <ShoppingBag className="h-6 w-6 text-vitmus-green" />
            </div>
            <p className="font-medium text-foreground">Sin órdenes recientes</p>
            <p className="mt-1 text-sm text-vitmus-text-secondary">
              Las órdenes aparecerán aquí cuando las recibas
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
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
                      <TableCell className="text-vitmus-text-secondary">{contactName}</TableCell>
                      <TableCell>{formatCurrency(order.total, order.currency)}</TableCell>
                      <TableCell>
                        <StatusBadge label={statusBadge.label} variant={statusBadge.variant} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge label={paymentBadge.label} variant={paymentBadge.variant} />
                      </TableCell>
                      <TableCell className="text-vitmus-text-secondary">{formatDate(order.created_at)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
