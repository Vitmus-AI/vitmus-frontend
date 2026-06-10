'use client'

import { useMemo, useState } from 'react'
import { MoreHorizontal, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { getSourceBadge } from '@/lib/auth'
import { formatDate, formatPhone, getFullName } from '@/lib/format'
import { deleteContact } from '@/lib/data'
import type { Contact } from '@/types'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
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
import { ContactFormModal } from '@/components/contacts/ContactFormModal'

const PAGE_SIZE = 10

interface ContactsTableProps {
  contacts: Contact[]
  isLoading?: boolean
  onRefresh: () => void
}

export function ContactsTable({ contacts, isLoading, onRefresh }: ContactsTableProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return contacts
    return contacts.filter(
      (c) =>
        getFullName(c.first_name, c.last_name).toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query)
    )
  }, [contacts, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setFormOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingContact) return
    setIsDeleting(true)
    try {
      await deleteContact(deletingContact.id)
      toast.success('Contacto eliminado')
      setDeletingContact(null)
      onRefresh()
    } catch {
      toast.error('Error al eliminar el contacto')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-full max-w-sm" />
          <Skeleton className="h-8 w-36" />
        </div>
        <div className="rounded-xl border border-vitmus-border bg-white">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-vitmus-border/60 px-4 py-3 last:border-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 ml-auto" />
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
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
            className="max-w-sm"
          />
          <Button
            onClick={() => {
              setEditingContact(null)
              setFormOpen(true)
            }}
            className="shrink-0 bg-vitmus-green hover:bg-vitmus-green-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo contacto
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-vitmus-border bg-white py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-vitmus-green/10">
              <Users className="h-6 w-6 text-vitmus-green" />
            </div>
            <p className="font-medium text-foreground">
              {search ? 'Sin resultados' : 'Aún no hay contactos'}
            </p>
            <p className="mt-1 text-sm text-vitmus-text-secondary">
              {search
                ? 'Intenta con otro nombre o email'
                : 'Agrega tu primer contacto usando el botón de arriba'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-vitmus-border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre completo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Fuente</TableHead>
                    <TableHead>Fecha de registro</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((contact) => {
                    const source = getSourceBadge(contact.external_platform, contact.source_mode)
                    return (
                      <TableRow key={contact.id} className="hover:bg-green-50/40 transition-colors">
                        <TableCell className="font-medium">
                          {getFullName(contact.first_name, contact.last_name)}
                        </TableCell>
                        <TableCell className="text-vitmus-text-secondary">{contact.email ?? '—'}</TableCell>
                        <TableCell className="text-vitmus-text-secondary">{formatPhone(contact.phone_e164)}</TableCell>
                        <TableCell>
                          <StatusBadge label={source.label} variant={source.variant} />
                        </TableCell>
                        <TableCell className="text-vitmus-text-secondary">{formatDate(contact.created_at)}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEdit(contact)}>
                                <Pencil className="h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                destructive
                                onClick={() => setDeletingContact(contact)}
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
                {filtered.length} contacto{filtered.length !== 1 ? 's' : ''}
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
          </>
        )}
      </div>

      <ContactFormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingContact(null)
        }}
        contact={editingContact}
        onSuccess={onRefresh}
      />

      <AlertDialog
        open={!!deletingContact}
        onOpenChange={(open) => { if (!open) setDeletingContact(null) }}
        title="¿Eliminar contacto?"
        description={
          deletingContact
            ? `Se eliminará permanentemente a ${getFullName(deletingContact.first_name, deletingContact.last_name)}. Esta acción no se puede deshacer.`
            : undefined
        }
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
