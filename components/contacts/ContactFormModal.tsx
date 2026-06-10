"use client"

import { useEffect } from "react"
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
import { createContact, updateContact } from "@/lib/data"
import type { Contact } from "@/types"

const schema = z.object({
  first_name: z.string().min(1, { message: "El nombre es requerido" }),
  last_name: z.string().min(1, { message: "El apellido es requerido" }),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .or(z.literal(""))
    .optional(),
  phone_e164: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface ContactFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: Contact | null
  onSuccess: () => void
}

export function ContactFormModal({
  open,
  onOpenChange,
  contact,
  onSuccess,
}: ContactFormModalProps) {
  const isEditing = !!contact

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_e164: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        first_name: contact?.first_name ?? "",
        last_name: contact?.last_name ?? "",
        email: contact?.email ?? "",
        phone_e164: contact?.phone_e164 ?? "",
      })
    }
  }, [open, contact, form])

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        ...(values.email ? { email: values.email } : {}),
        ...(values.phone_e164 ? { phone_e164: values.phone_e164 } : {}),
        source_mode: "native" as const,
      }

      if (isEditing && contact) {
        await updateContact(contact.id, payload)
        toast.success("Contacto actualizado")
      } else {
        await createContact(payload)
        toast.success("Contacto creado")
      }

      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error(isEditing ? "Error al actualizar el contacto" : "Error al crear el contacto")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar contacto" : "Nuevo contacto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">Nombre</Label>
              <Input id="first_name" {...form.register("first_name")} />
              {form.formState.errors.first_name && (
                <p className="text-xs text-red-500">{form.formState.errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last_name">Apellido</Label>
              <Input id="last_name" {...form.register("last_name")} />
              {form.formState.errors.last_name && (
                <p className="text-xs text-red-500">{form.formState.errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email <span className="text-muted-foreground">(opcional)</span></Label>
            <Input id="email" type="email" placeholder="correo@ejemplo.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone_e164">Teléfono <span className="text-muted-foreground">(opcional)</span></Label>
            <Input id="phone_e164" type="tel" placeholder="+573001234567" {...form.register("phone_e164")} />
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
              {isEditing ? "Guardar cambios" : "Crear contacto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
