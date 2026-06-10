'use client'

import { useMemo, useState } from 'react'
import { Calendar, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getAppointmentStatusBadge } from '@/lib/auth'
import {
  formatCurrency,
  formatDateTime,
  getDurationMinutes,
  getFullName,
  isSameDay,
  isThisWeek,
} from '@/lib/format'
import { deleteAppointment, updateAppointment } from '@/lib/data'
import type { Appointment } from '@/types'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AppointmentFormModal } from '@/components/appointments/AppointmentFormModal'

const PAGE_SIZE = 10

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Programada' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'no_show', label: 'No asistió' },
]

interface AppointmentsTableProps {
  appointments: Appointment[]
  isLoading?: boolean
  onRefresh: () => void
}

export function AppointmentsTable({ appointments, isLoading, onRefresh }: AppointmentsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today')
  const [page, setPage] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = appointments

    if (viewMode === 'today') {
      result = result.filter((a) => isSameDay(a.starts_at))
    } else {
      result = result.filter((a) => isThisWeek(a.starts_at))
    }

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status.toLowerCase() === statusFilter)
    }

    return result
  }, [appointments, statusFilter, viewMode])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleStatusChange = async (appointment: Appointment, newStatus: string) => {
    setUpdatingId(appointment.id)
    try {
      await updateAppointment(appointment.id, { status: newStatus })
      toast.success('Estado actualizado')
      onRefresh()
    } catch {
      toast.error('Error al actualizar el estado')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingAppointment) return
    setIsDeleting(true)
    try {
      await deleteAppointment(deletingAppointment.id)
      toast.success('Cita eliminada')
      setDeletingAppointment(null)
      onRefresh()
    } catch {
      toast.error('Error al eliminar la cita')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="rounded-xl border border-vitmus-border bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-vitmus-border/60 px-4 py-3 last:border-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-20 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl border border-vitmus-border bg-white p-1">
              <Button
                variant={viewMode === 'today' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { setViewMode('today'); setPage(0) }}
                className={viewMode === 'today' ? 'bg-vitmus-green hover:bg-vitmus-green-dark' : ''}
              >
                Hoy
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { setViewMode('week'); setPage(0) }}
                className={viewMode === 'week' ? 'bg-vitmus-green hover:bg-vitmus-green-dark' : ''}
              >
                Esta semana
              </Button>
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => { if (value) { setStatusFilter(value); setPage(0) } }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setFormOpen(true)}
            className="shrink-0 bg-vitmus-green hover:bg-vitmus-green-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva cita
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-vitmus-border bg-white py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-vitmus-green/10">
              <Calendar className="h-6 w-6 text-vitmus-green" />
            </div>
            <p className="font-medium text-foreground">Sin citas en este período</p>
            <p className="mt-1 text-sm text-vitmus-text-secondary">
              Cambia el filtro o crea una nueva cita
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-vitmus-border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio(s)</TableHead>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Fecha y hora</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((appointment) => {
                    const statusBadge = getAppointmentStatusBadge(appointment.status)
                    const contactName = appointment.contact
                      ? getFullName(appointment.contact.first_name, appointment.contact.last_name)
                      : '—'
                    const duration = getDurationMinutes(appointment.starts_at, appointment.ends_at)

                    return (
                      <TableRow key={appointment.id} className="hover:bg-green-50/40 transition-colors">
                        <TableCell className="font-medium">{contactName}</TableCell>
                        <TableCell className="text-vitmus-text-secondary">
                          {appointment.services?.join(', ') ?? '—'}
                        </TableCell>
                        <TableCell className="text-vitmus-text-secondary">{appointment.employee_name ?? '—'}</TableCell>
                        <TableCell className="text-vitmus-text-secondary">{formatDateTime(appointment.starts_at)}</TableCell>
                        <TableCell className="text-vitmus-text-secondary">{duration} min</TableCell>
                        <TableCell>
                          <Select
                            value={appointment.status}
                            onValueChange={(val) => { if (val) handleStatusChange(appointment, val) }}
                            disabled={updatingId === appointment.id}
                          >
                            <SelectTrigger className="h-7 w-32 text-xs">
                              <SelectValue>
                                <StatusBadge label={statusBadge.label} variant={statusBadge.variant} />
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-vitmus-text-secondary">
                          {formatCurrency(appointment.total, appointment.currency)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-vitmus-text-secondary hover:bg-muted hover:text-foreground transition-colors">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Acciones</span>
                                </button>
                              }
                            />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                destructive
                                onClick={() => setDeletingAppointment(appointment)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-vitmus-text-secondary">
                {filtered.length} cita{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <AppointmentFormModal open={formOpen} onOpenChange={setFormOpen} onSuccess={onRefresh} />

      <AlertDialog
        open={!!deletingAppointment}
        onOpenChange={(open) => { if (!open) setDeletingAppointment(null) }}
        title="¿Eliminar cita?"
        description="Esta acción no se puede deshacer."
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
