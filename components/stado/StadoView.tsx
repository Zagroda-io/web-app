"use client"

import { useEffect, useState, useCallback } from "react"
import { StadoHeader } from "./StadoHeader"
import { EventFeed } from "./EventFeed"
import { CowTable } from "./CowTable"
import { motion } from "framer-motion"
import { AlertDetailsSheet } from "./AlertDetailsSheet"
import { HerdKpiSection } from "./kpi/HerdKpiSection"
import { UpcomingCalvingsWidget } from "./kpi/UpcomingCalvingsWidget"
import { mockHerdKpiData } from "@/mocks/herdMocks"
import { getAnimals } from "@/api/stado"
import { useUser } from "@/context/UserContext"
import type {
  Animal,
  CowAlert,
  CowStatusFilter,
  FeedEvent,
  HerdSummary,
  PaginatedResponse,
} from "@/lib/types/stado.types"

interface StadoViewProps {
  initialCows: any // Pozostawiam dla kompatybilności, ale będziemy używać getAnimals
  initialFeed: FeedEvent[]
  summary: HerdSummary
}

export default function StadoView({
  initialCows,
  initialFeed,
  summary,
}: StadoViewProps) {
  const { activeFarm } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<CowStatusFilter>("all")
  const [selectedAlert, setSelectedAlert] = useState<CowAlert | null>(null)
  
  const [animalsData, setAnimalsData] = useState<PaginatedResponse<Animal>>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState("name")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(0)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchAnimals = useCallback(async () => {
    if (!activeFarm?.id) return

    setIsLoading(true)
    try {
      const data = await getAnimals({
        farmId: activeFarm.id,
        page,
        size: 20,
        sort,
        search: debouncedSearch,
      })
      setAnimalsData(data)
    } catch (error) {
      console.error("Błąd pobierania zwierząt:", error)
    } finally {
      setIsLoading(false)
    }
  }, [activeFarm?.id, page, sort, debouncedSearch])

  useEffect(() => {
    fetchAnimals()
  }, [fetchAnimals])

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
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-1 flex-col md:p-6"
      >
        <StadoHeader
          summary={summary}
          onSearchChange={setSearchQuery}
          onFilterChange={setStatusFilter}
        />

        <div className="space-y-6">
          <HerdKpiSection data={mockHerdKpiData} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UpcomingCalvingsWidget
              data={mockHerdKpiData.upcomingCalvings}
              onShowAll={() => console.log("Pokaż wszystkie porody")}
            />

            <EventFeed
              events={initialFeed}
              activeAlertCount={summary.activeAlertCount}
              onEventClick={handleEventClick}
              onEventClickUrlBase="/dashboard/stado"
              onShowAll={() => console.log("Pokaż wszystkie zdarzenia")}
            />
          </div>

          <CowTable
            data={animalsData}
            isLoading={isLoading}
            onPageChange={setPage}
            onSortChange={setSort}
            currentSort={sort}
            onRowClickUrlBase="/dashboard/stado"
          />
        </div>
      </motion.div>

      <AlertDetailsSheet
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </>
  )
}
