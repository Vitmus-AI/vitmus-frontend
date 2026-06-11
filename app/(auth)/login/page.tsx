'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  IconAlertTriangle,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconLock,
  IconMail,
  IconMessageCircle,
} from '@tabler/icons-react'
import { useAuth } from '@/hooks/useAuth'
import { isAxiosError } from 'axios'

const loginSchema = z.object({
  email: z.string().email({ message: 'Ingresa un email válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

function VitmusLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)]">
        <IconMessageCircle size={20} className="text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white">
        Vitmus<span className="text-[var(--color-primary)]">.</span>
      </span>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      await login(data.email, data.password)
      router.push('/')
    } catch (err) {
      if (isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 400)) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      } else {
        setError('No se pudo iniciar sesión. Intenta de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Panel de marca — desktop */}
      <aside className="brand-dots relative hidden flex-col justify-between bg-[#0D1B12] p-10 lg:flex lg:w-[45%]">
        <VitmusLogo />

        <div className="max-w-md">
          <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
            Tu negocio fluye{' '}
            <span className="text-[var(--color-primary)]">conversando</span>.
          </h2>
          <p className="mt-4 text-sm text-[var(--color-text-light)]">
            Contactos, órdenes y citas en un solo lugar, conectados a las
            conversaciones de tus clientes.
          </p>
        </div>

        <div className="max-w-md rounded-lg bg-[#1F2D23] p-4">
          <p className="text-sm leading-relaxed text-[#DCFCE7]">
            “Hoy tienes 3 citas confirmadas y 2 órdenes nuevas. ¿Quieres que
            te prepare el resumen del día?”
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)]">
            <IconMessageCircle size={14} />
            Copiloto Vitmus
          </p>
        </div>
      </aside>

      {/* Franja de marca compacta — móvil */}
      <div className="flex h-20 items-center justify-center bg-[#0D1B12] lg:hidden">
        <VitmusLogo />
      </div>

      {/* Panel de formulario */}
      <main className="flex flex-1 flex-col items-center justify-center bg-[var(--color-background)] p-4 lg:bg-white">
        <div className="card animate-fade-in-up w-full max-w-sm lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              Bienvenido de vuelta
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Inicia sesión en tu cuenta
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-[var(--color-danger-background)] p-3 text-sm text-[var(--color-danger)]">
              <IconAlertTriangle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[var(--color-text-primary)]"
              >
                Email
              </label>
              <div className="relative">
                <IconMail
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="input-field bg-white pl-10"
                  {...form.register('email')}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-[var(--color-danger)]">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  Contraseña
                </label>
                <Link
                  href="/recuperar"
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <IconLock
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input-field bg-white pl-10 pr-10"
                  {...form.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)]"
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-[var(--color-danger)]">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <IconLoader2 size={18} className="animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-[var(--color-text-light)]">
          © 2026 Vitmus
        </p>
      </main>
    </div>
  )
}
