import { badgeVariantClasses, type BadgeVariant } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  label: string
  variant: BadgeVariant
  className?: string
}

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        badgeVariantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
