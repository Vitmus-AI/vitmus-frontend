'use client'

import { useEffect, useState } from 'react'
import { PlatformsTable } from '@/components/platforms/PlatformsTable'
import { useAuth } from '@/hooks/useAuth'
import { fetchPlatforms } from '@/lib/data'
import { canShowPlatforms } from '@/lib/tenant'
import type { ExternalPlatform } from '@/types'

export default function PlatformsPage() {
  const { vertical } = useAuth()
  const [platforms, setPlatforms] = useState<ExternalPlatform[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await fetchPlatforms()
        setPlatforms(data.results)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [refreshKey])

  if (!canShowPlatforms(vertical)) {
    return (
      <div className="rounded-xl border border-vitmus-border bg-white py-16 text-center">
        <p className="text-vitmus-text-secondary">
          Las plataformas no están disponibles para negocios de servicios.
        </p>
      </div>
    )
  }

  return (
    <PlatformsTable
      platforms={platforms}
      isLoading={isLoading}
      onRefresh={() => setRefreshKey((k) => k + 1)}
    />
  )
}
