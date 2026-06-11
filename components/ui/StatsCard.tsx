import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  subtitle?: string
}

export function StatsCard({ title, value, icon, trend, subtitle }: StatsCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="text-[var(--color-text-secondary)] text-sm font-medium">
          {title}
        </span>
        <span className="text-[var(--color-text-secondary)]">{icon}</span>
      </div>
      <div className="mt-2 flex items-center">
        <span className="text-2xl font-bold text-[var(--color-text-primary)]">
          {value}
        </span>
        {trend && (
          <span
            className={`ml-2 text-sm font-medium flex items-center ${
              trend.isPositive
                ? 'text-[var(--color-success)]'
                : 'text-[var(--color-danger)]'
            }`}
          >
            {trend.isPositive ? (
              <IconArrowUpRight size={16} />
            ) : (
              <IconArrowDownRight size={16} />
            )}
            {trend.value}%
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
      )}
    </div>
  )
}
