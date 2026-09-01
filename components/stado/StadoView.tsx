"use client"

import { useCallback, useEffect, useState } from "react"
import { StadoHeader } from "./StadoHeader"
import { EventFeed } from "./EventFeed"
import { CowTable } from "./CowTable"
import { motion } from "framer-motion"
import { AlertDetailsSheet } from "./AlertDetailsSheet"
import { HerdKpiSection } from "./kpi/HerdKpiSection"
import { UpcomingCalvingsWidget } from "./kpi/UpcomingCalvingsWidget"
import { getAnimals, getHerdKpi } from "@/api/stado"
import { getFarmAlerts } from "@/api/alerts"
import { useUser } from "@/context/UserContext"
import { ApiErrorState } from "@/components/shared/ApiErrorState"
import type {
  Animal,
  AnimalCategory,
  CowAlert,
  FarmAlert,
  FeedEvent,
  HerdSummary,
  LactationStatus,
  PaginatedResponse,
} from "@/lib/types/stado.types"
import type { HerdKpiData } from "@/types/herd.types"

interface StadoViewProps {
  initialCows?: unknown
  initialFeed: FeedEvent[]
  summary: HerdSummary
  summaryError?: boolean
  feedError?: boolean
  onRetrySummary?: () => void
  onRetryFeed?: () => void
}

const EMPTY_KPI: HerdKpiData = {
  herdSize: { total: 0, cows: 0, heifers: 0, calves: 0, bulls: 0 },
  lactation: { inLactation: 0, inLactationPercentage: 0, dry: 0, avgDim: 0 },
  reproduction: {
    pregnant: 0,
    conceptionRate: 0,
    waitingForInsemination: 0,
    overdueCount: 0,
  },
  upcomingCalvings: [],
}

export default function StadoView({
  initialFeed,
  summary,
  summaryError,
  feedError,
  onRetrySummary,
  onRetryFeed,
}: StadoViewProps) {
  const { activeFarm } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAlert, setSelectedAlert] = useState<CowAlert | null>(null)

  const [animalsData, setAnimalsData] = useState<PaginatedResponse<Animal>>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState("name")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory] = useState<AnimalCategory | undefined>()
  const [lactationStatus, setLactationStatus] = useState<
    LactationStatus | undefined
  >()

  const [kpi, setKpi] = useState<HerdKpiData>(EMPTY_KPI)
  const [kpiError, setKpiError] = useState(false)

  const [alerts, setAlerts] = useState<FarmAlert[]>([])
  const [alertsError, setAlertsError] = useState(false)

  const loadKpi = useCallback(async () => {
    try {
      setKpiError(false)
      setKpi(await getHerdKpi())
    } catch (err) {
      console.error("Błąd ładowania KPI stada:", err)
      setKpiError(true)
    }
  }, [])

  useEffect(() => {
    loadKpi()
  }, [loadKpi])

  const loadAlerts = useCallback(async () => {
    try {
      setAlertsError(false)
      const page = await getFarmAlerts({ page: 0, size: 5 })
      setAlerts(page.content)
    } catch (err) {
      console.error("Błąd ładowania alertów:", err)
      setAlertsError(true)
    }
  }, [])

  useEffect(() => {
    loadAlerts()
  }, [loadAlerts])

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
    setError(false)
    try {
      const data = await getAnimals({
        farmId: activeFarm.id,
        page,
        size: 20,
        sort,
        search: debouncedSearch,
        category,
        lactationStatus,
      })
      setAnimalsData(data)
    } catch (error) {
      console.error("Błąd pobierania zwierząt:", error)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }, [activeFarm?.id, page, sort, debouncedSearch, category, lactationStatus])

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
          error={summaryError}
          onRetry={onRetrySummary}
          onSearchChange={setSearchQuery}
          category={category}
          onCategoryChange={(value) => {
            setCategory(value)
            setPage(0)
          }}
          lactationStatus={lactationStatus}
          onLactationChange={(value) => {
            setLactationStatus(value)
            setPage(0)
          }}
        />

        <div className="space-y-6">
          <HerdKpiSection data={kpi} error={kpiError} onRetry={loadKpi} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UpcomingCalvingsWidget
              data={kpi.upcomingCalvings}
              onShowAll={() => console.log("Pokaż wszystkie porody")}
            />

            <EventFeed
              events={initialFeed}
              activeAlertCount={summary.activeAlertCount}
              error={feedError}
              onRetry={onRetryFeed}
              onEventClick={handleEventClick}
              onEventClickUrlBase="/dashboard/stado"
              onShowAll={() => console.log("Pokaż wszystkie zdarzenia")}
              alerts={alerts}
              alertsError={alertsError}
              onRetryAlerts={loadAlerts}
              allAlertsHref="/dashboard/stado/alerty"
            />
          </div>

          {error ? (
            <ApiErrorState
              message="Nie udało się pobrać listy zwierząt."
              onRetry={fetchAnimals}
            />
          ) : (
            <CowTable
              data={animalsData}
              isLoading={isLoading}
              onPageChange={setPage}
              onSortChange={setSort}
              currentSort={sort}
              onRowClickUrlBase="/dashboard/stado"
            />
          )}
        </div>
      </motion.div>

      <AlertDetailsSheet
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </>
  )
}
