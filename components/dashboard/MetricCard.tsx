import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accentColor: string
  className?: string
}

export function MetricCard({ label, value, icon: Icon, accentColor, className }: MetricCardProps) {
  return (
    <Card
      className={cn(
        'rounded-xl border-vitmus-border shadow-none transition-shadow hover:shadow-md',
        className
      )}
    >
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${accentColor}18` }}
        >
          <Icon className="h-6 w-6" style={{ color: accentColor }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-vitmus-text-secondary">{label}</p>
          <p className="truncate text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
