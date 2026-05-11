"use client"

import { useEffect, useState } from "react"
import { StadoHeader } from "./StadoHeader"
import { EventFeed } from "./EventFeed"
import { CowTable } from "./CowTable"
import { CowProfile } from "./cow-profile/CowProfile"
import { AlertDetailsSheet } from "./AlertDetailsSheet"
import { getCowById } from "@/api/stado"
import type {
  Cow,
  CowAlert,
  CowStatusFilter,
  FeedEvent,
  HerdSummary,
} from "@/lib/types/stado.types"

interface StadoViewProps {
  initialCows: Cow[]
  initialFeed: FeedEvent[]
  summary: HerdSummary
}

export default function StadoView({
  initialCows,
  initialFeed,
  summary,
}: StadoViewProps) {
  const [activeCowId, setActiveCowId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<CowStatusFilter>("all")

  const [activeCow, setActiveCow] = useState<Cow | null>(null)
  const [cowLoading, setCowLoading] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<CowAlert | null>(null)

  const handleEventClick = (event: FeedEvent) => {
    if (event.category === "alert" && event.details) {
      setSelectedAlert({
        id: event.id,
        severity: event.severity,
        title: event.title,
        description: event.description,
        detectedAt: event.occurredAt,
        details: event.details,
      })
    } else {
      setActiveCowId(event.cowId)
    }
  }

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
        console.error("Błąd podczas pobierania danych krowy:", error)
      } finally {
        if (isMounted) setCowLoading(false)
      }
    }

    fetchCow()
    return () => {
      isMounted = false
    }
  }, [activeCowId])

  if (activeCowId) {
    return (
      <>
        <CowProfile
          cow={activeCow}
          isLoading={cowLoading}
          onBack={() => setActiveCowId(null)}
          onCowClick={setActiveCowId}
          onAlertClick={setSelectedAlert}
        />
        <AlertDetailsSheet
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      </>
    )
  }

  return (
    <div className="flex flex-1 flex-col md:p-6">
      <StadoHeader
        summary={summary}
        onSearchChange={setSearchQuery}
        onFilterChange={setStatusFilter}
      />

      <div className="space-y-4">
        <EventFeed
          events={initialFeed}
          activeAlertCount={summary.activeAlertCount}
          onEventClick={handleEventClick}
          onShowAll={() => console.log("Pokaż wszystkie zdarzenia")}
        />

        <CowTable
          cows={initialCows}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onRowClick={setActiveCowId}
        />
      </div>

      <AlertDetailsSheet
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  )
}
