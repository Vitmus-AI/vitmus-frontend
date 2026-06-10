"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAppointment, fetchContacts } from "@/lib/data"
import type { Contact } from "@/types"

const schema = z.object({
  contact_id: z.string().optional(),
  starts_at: z.string().min(1, { message: "La fecha de inicio es requerida" }),
  ends_at: z.string().min(1, { message: "La fecha de fin es requerida" }),
  notes: z.string().optional(),
  total: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface AppointmentFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AppointmentFormModal({ open, onOpenChange, onSuccess }: AppointmentFormModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactSearch, setContactSearch] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      contact_id: "",
      starts_at: "",
      ends_at: "",
      notes: "",
      total: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset()
      setContactSearch("")
      fetchContacts()
        .then((res) => setContacts(res.results))
        .catch(() => setContacts([]))
    }
  }, [open, form])

  const filteredContacts = contacts.filter((c) => {
    const q = contactSearch.toLowerCase()
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    )
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await createAppointment({
        ...(values.contact_id ? { contact: values.contact_id } : {}),
        starts_at: new Date(values.starts_at).toISOString(),
        ends_at: new Date(values.ends_at).toISOString(),
        ...(values.notes ? { notes: values.notes } : {}),
        ...(values.total ? { total: values.total } : {}),
        source_mode: "native",
      })
      toast.success("Cita creada")
      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error("Error al crear la cita")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva cita</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Contacto <span className="text-muted-foreground">(opcional)</span></Label>
            <Input
              placeholder="Buscar contacto..."
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
            />
            {contactSearch && filteredContacts.length > 0 && (
              <div className="max-h-36 overflow-y-auto rounded-lg border border-vitmus-border bg-white shadow-sm">
                {filteredContacts.slice(0, 6).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      form.setValue("contact_id", c.id)
                      setContactSearch(`${c.first_name} ${c.last_name}`)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-green-50 transition-colors"
                  >
                    <span className="font-medium">{c.first_name} {c.last_name}</span>
                    {c.email && <span className="ml-2 text-vitmus-text-secondary">{c.email}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="starts_at">Inicio</Label>
              <Input id="starts_at" type="datetime-local" {...form.register("starts_at")} />
              {form.formState.errors.starts_at && (
                <p className="text-xs text-red-500">{form.formState.errors.starts_at.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ends_at">Fin</Label>
              <Input id="ends_at" type="datetime-local" {...form.register("ends_at")} />
              {form.formState.errors.ends_at && (
                <p className="text-xs text-red-500">{form.formState.errors.ends_at.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="total">Total <span className="text-muted-foreground">(opcional)</span></Label>
            <Input id="total" type="number" placeholder="0" {...form.register("total")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notas <span className="text-muted-foreground">(opcional)</span></Label>
            <Input id="notes" placeholder="Notas adicionales..." {...form.register("notes")} />
          </div>

          <DialogFooter className="border-t-0 bg-transparent px-0 pb-0 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-vitmus-green hover:bg-vitmus-green-dark"
            >
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear cita
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
