'use client'

import { useState, useEffect } from 'react'
import { StadoHeader } from './StadoHeader'
import { EventFeed } from './EventFeed'
import { CowTable } from './CowTable'
import { CowProfile } from './cow-profile/CowProfile'
import { getCowById } from '@/api/stado'
import type { Cow, FeedEvent, HerdSummary, CowStatusFilter } from '@/lib/types/stado.types'

interface StadoViewProps {
  initialCows: Cow[]
  initialFeed: FeedEvent[]
  summary: HerdSummary
}

export default function StadoView({ initialCows, initialFeed, summary }: StadoViewProps) {
  const [activeCowId, setActiveCowId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CowStatusFilter>('all')
  
  const [activeCow, setActiveCow] = useState<Cow | null>(null)
  const [cowLoading, setCowLoading] = useState(false)

  // Pobieranie danych krowy po zmianie activeCowId
  useEffect(() => {
    if (activeCowId === null) {
      setActiveCow(null)
      return
    }

    let isMounted = true
    const fetchCow = async () => {
      setCowLoading(true)
      try {
        const cow = await getCowById(activeCowId)
        if (isMounted) setActiveCow(cow)
      } catch (error) {
        console.error('Błąd podczas pobierania danych krowy:', error)
      } finally {
        if (isMounted) setCowLoading(false)
      }
    }

    fetchCow()
    return () => { isMounted = false }
  }, [activeCowId])

  if (activeCowId) {
    return (
      <CowProfile
        cow={activeCow}
        isLoading={cowLoading}
        onBack={() => setActiveCowId(null)}
        onCowClick={setActiveCowId}
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <StadoHeader
        summary={summary}
        onSearchChange={setSearchQuery}
        onFilterChange={setStatusFilter}
      />
      
      <div className="space-y-4">
        <EventFeed
          events={initialFeed}
          activeAlertCount={summary.activeAlertCount}
          onCowClick={setActiveCowId}
          onShowAll={() => console.log('Pokaż wszystkie zdarzenia')}
        />

        <CowTable
          cows={initialCows}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onRowClick={setActiveCowId}
        />
      </div>
    </div>
  )
}
