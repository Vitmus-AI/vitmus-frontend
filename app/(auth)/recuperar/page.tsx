import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'

export default function RecuperarPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
      <div className="card w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Recuperar contraseña
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Esta función estará disponible próximamente. Mientras tanto,
          contacta al administrador de tu cuenta.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          <IconArrowLeft size={16} />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
