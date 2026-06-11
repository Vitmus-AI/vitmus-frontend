'use client'

import { useEffect, useRef, useState } from 'react'
import { IconInfoCircle } from '@tabler/icons-react'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'
type TooltipWidth = 'narrow' | 'medium' | 'wide' | 'extra-wide' | 'double-wide'

interface InfoTooltipProps {
  content: React.ReactNode
  position?: TooltipPosition
  width?: TooltipWidth
}

const widthClasses: Record<TooltipWidth, string> = {
  narrow: 'w-48',
  medium: 'w-64',
  wide: 'w-80',
  'extra-wide': 'w-96',
  'double-wide': 'w-[40rem]',
}

const panelPosition: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

const arrowPosition: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--color-background)] border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--color-background)] border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--color-background)] border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--color-background)] border-y-transparent border-l-transparent',
}

export function InfoTooltip({
  content,
  position = 'right',
  width = 'double-wide',
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-flex" ref={containerRef}>
      <IconInfoCircle
        size={16}
        className="cursor-help text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen((open) => !open)}
      />
      {isOpen && (
        <div
          className={`absolute z-50 bg-[var(--color-background)] p-3 rounded-lg shadow-lg text-sm text-[var(--color-text-primary)] ${widthClasses[width]} ${panelPosition[position]}`}
        >
          {content}
          <span
            className={`absolute border-4 ${arrowPosition[position]}`}
          />
        </div>
      )}
    </div>
  )
}
