"use client"

import { useState } from "react"
import { StadoHeader } from "./StadoHeader"
import { EventFeed } from "./EventFeed"
import { CowTable } from "./CowTable"
import { motion } from "framer-motion"
import { AlertDetailsSheet } from "./AlertDetailsSheet"
import { HerdKpiSection } from "./kpi/HerdKpiSection"
import { UpcomingCalvingsWidget } from "./kpi/UpcomingCalvingsWidget"
import { mockHerdKpiData } from "@/mocks/herdMocks"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<CowStatusFilter>("all")
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
            cows={initialCows}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
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
