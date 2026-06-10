'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, MoreHorizontal, Pencil, Plug, RefreshCw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getPlatformColor } from '@/lib/auth'
import { formatDateTime } from '@/lib/format'
import { createPlatform, deletePlatform, updatePlatform } from '@/lib/data'
import type { ExternalPlatform } from '@/types'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const platformFormSchema = z.object({
  platform_type: z.string().min(1, { message: 'Selecciona un tipo de plataforma' }),
  display_name: z.string().min(2, { message: 'El nombre es requerido' }),
  shop_url: z.string().url({ message: 'Ingresa una URL válida' }).optional().or(z.literal('')),
})

type PlatformFormValues = z.infer<typeof platformFormSchema>

interface PlatformsTableProps {
  platforms: ExternalPlatform[]
  isLoading?: boolean
  onRefresh: () => void
}

export function PlatformsTable({ platforms, isLoading, onRefresh }: PlatformsTableProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState<ExternalPlatform | null>(null)
  const [deletingPlatform, setDeletingPlatform] = useState<ExternalPlatform | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(platformFormSchema),
    defaultValues: { platform_type: '', display_name: '', shop_url: '' },
  })

  useEffect(() => {
    if (editingPlatform) {
      form.reset({
        platform_type: editingPlatform.platform_type,
        display_name: editingPlatform.display_name,
        shop_url: editingPlatform.shop_url ?? '',
      })
    } else {
      form.reset({ platform_type: '', display_name: '', shop_url: '' })
    }
  }, [editingPlatform, form])

  const handleClose = () => {
    setCreateOpen(false)
    setEditingPlatform(null)
    form.reset({ platform_type: '', display_name: '', shop_url: '' })
  }

  const onSubmit = async (data: PlatformFormValues) => {
    try {
      const payload = {
        platform_type: data.platform_type,
        display_name: data.display_name,
        ...(data.shop_url ? { shop_url: data.shop_url } : {}),
      }

      if (editingPlatform) {
        await updatePlatform(editingPlatform.id, payload)
        toast.success('Plataforma actualizada')
      } else {
        await createPlatform(payload)
        toast.success('Plataforma agregada')
      }

      handleClose()
      onRefresh()
    } catch {
      toast.error(editingPlatform ? 'Error al actualizar la plataforma' : 'Error al agregar la plataforma')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingPlatform) return
    setIsDeleting(true)
    try {
      await deletePlatform(deletingPlatform.id)
      toast.success('Plataforma eliminada')
      setDeletingPlatform(null)
      onRefresh()
    } catch {
      toast.error('Error al eliminar la plataforma')
    } finally {
      setIsDeleting(false)
    }
  }

  const isOpen = createOpen || !!editingPlatform

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="rounded-xl border border-vitmus-border bg-white">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-vitmus-border/60 px-4 py-4 last:border-0">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48 ml-4" />
              <Skeleton className="h-5 w-16 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const formContent = (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label htmlFor="platform_type">Tipo de plataforma</Label>
        <Select
          value={form.watch('platform_type')}
          onValueChange={(value) => { if (value) form.setValue('platform_type', value, { shouldValidate: true }) }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shopify">Shopify</SelectItem>
            <SelectItem value="woocommerce">WooCommerce</SelectItem>
            <SelectItem value="tiendanube">Tiendanube</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.platform_type && (
          <p className="text-xs text-red-500">{form.formState.errors.platform_type.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="display_name">Nombre</Label>
        <Input id="display_name" {...form.register('display_name')} />
        {form.formState.errors.display_name && (
          <p className="text-xs text-red-500">{form.formState.errors.display_name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="shop_url">URL de la tienda <span className="text-muted-foreground">(opcional)</span></Label>
        <Input id="shop_url" placeholder="https://..." {...form.register('shop_url')} />
        {form.formState.errors.shop_url && (
          <p className="text-xs text-red-500">{form.formState.errors.shop_url.message}</p>
        )}
      </div>

      <DialogFooter className="border-t-0 bg-transparent px-0 pb-0 pt-2">
        <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-vitmus-green hover:bg-vitmus-green-dark"
        >
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingPlatform ? 'Guardar cambios' : 'Guardar'}
        </Button>
      </DialogFooter>
    </form>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
          <DialogTrigger
            render={
              <Button
                onClick={() => setCreateOpen(true)}
                className="bg-vitmus-green hover:bg-vitmus-green-dark"
              >
                <Plug className="mr-2 h-4 w-4" />
                Agregar plataforma
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPlatform ? 'Editar plataforma' : 'Agregar plataforma'}</DialogTitle>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      </div>

      {platforms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-vitmus-border bg-white py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-vitmus-green/10">
            <Plug className="h-6 w-6 text-vitmus-green" />
          </div>
          <p className="font-medium text-foreground">Sin plataformas conectadas</p>
          <p className="mt-1 text-sm text-vitmus-text-secondary">
            Conecta tu primera tienda usando el botón de arriba
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-vitmus-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plataforma</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última sincronización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {platforms.map((platform) => {
                const color = getPlatformColor(platform.platform_type)
                return (
                  <TableRow key={platform.id} className="hover:bg-green-50/40 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <Plug className="h-4 w-4" style={{ color }} />
                        </div>
                        <span className="font-medium">{platform.display_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {platform.shop_url ? (
                        <a
                          href={platform.shop_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vitmus-green hover:underline"
                        >
                          {platform.shop_url}
                        </a>
                      ) : (
                        <span className="text-vitmus-text-secondary">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={platform.is_active ? 'Activo' : 'Inactivo'}
                        variant={platform.is_active ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell className="text-vitmus-text-secondary">
                      {platform.last_sync_at ? formatDateTime(platform.last_sync_at) : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info('Sincronización próximamente disponible')}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sincronizar
                        </Button>
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
                            <DropdownMenuItem onClick={() => setEditingPlatform(platform)}>
                              <Pencil className="h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem destructive onClick={() => setDeletingPlatform(platform)}>
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={!!deletingPlatform}
        onOpenChange={(open) => { if (!open) setDeletingPlatform(null) }}
        title="¿Eliminar plataforma?"
        description={deletingPlatform ? `Se desconectará "${deletingPlatform.display_name}". Esta acción no se puede deshacer.` : undefined}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
