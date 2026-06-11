'use client'

import { useEffect } from 'react'
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconX,
} from '@tabler/icons-react'

type ToastType = 'success' | 'error' | 'warning'

interface ToastProps {
  type: ToastType
  message: string
  onClose: () => void
  duration?: number
}

const toastStyles: Record<
  ToastType,
  { background: string; color: string; icon: React.ReactNode }
> = {
  success: {
    background: 'var(--color-success-background)',
    color: 'var(--color-success)',
    icon: <IconCheck size={20} />,
  },
  error: {
    background: 'var(--color-danger-background)',
    color: 'var(--color-danger)',
    icon: <IconAlertTriangle size={20} />,
  },
  warning: {
    background: 'var(--color-warning-background)',
    color: 'var(--color-warning)',
    icon: <IconAlertCircle size={20} />,
  },
}

export function Toast({ type, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const style = toastStyles[type]

  return (
    <div
      className="fixed top-16 right-4 z-50 min-w-[300px] px-4 py-3 rounded-lg shadow-md flex items-center gap-3"
      style={{ backgroundColor: style.background, color: style.color }}
    >
      {style.icon}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={onClose} aria-label="Cerrar notificación">
        <IconX size={16} />
      </button>
    </div>
  )
}
