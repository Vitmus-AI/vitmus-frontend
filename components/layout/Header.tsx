'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { getPageTitle } from '@/lib/tenant'

interface HeaderProps {
  pathname: string
  onMenuClick?: () => void
}

export function Header({ pathname, onMenuClick }: HeaderProps) {
  const { user } = useAuth()

  const initials = user?.full_name
    ? user.full_name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'U'

  return (
    <header className="flex items-center justify-between border-b border-vitmus-border bg-white px-4 py-3 lg:px-8">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold text-foreground">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <p className="hidden text-sm text-vitmus-text-secondary sm:block">
          {user?.full_name ?? 'Usuario'}
        </p>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vitmus-green/10 text-xs font-bold text-vitmus-green ring-2 ring-vitmus-green/20">
          {initials}
        </div>
      </div>
    </header>
  )
}
