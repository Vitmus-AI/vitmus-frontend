'use client'

import { IconAlertTriangle } from '@tabler/icons-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center gap-3 bg-[var(--color-danger-background)] p-4">
          <IconAlertTriangle size={24} className="text-[var(--color-danger)]" />
          <h3 className="font-semibold text-[var(--color-danger)]">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-[var(--color-text-primary)]">{message}</p>
        </div>
        <div className="bg-[var(--color-background-gray)] px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-background-gray)] transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90 transition-colors duration-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
