"use client"

import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { CowProfileTopbar } from "./CowProfileTopbar"
import { CowIdCard } from "./CowIdCard"
import { CowActiveAlerts } from "./CowActiveAlerts"
import { CowPedigree } from "./CowPedigree"
import { CowOffspring } from "./CowOffspring"
import { CowBcsDisplay } from "./CowBcsDisplay"
import { CowEventTimeline } from "./CowEventTimeline"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { AlertDetailsSheet } from "../AlertDetailsSheet"
import { AddEventDialog } from "./AddEventDialog"
import { getAnimalEvents, mapEventToCowEvent } from "@/api/stado"
import type { AnimalDetails, CowAlert, CowEvent } from "@/lib/types/stado.types"

const CowYieldChart = dynamic(() => import("./CowYieldChart"), {
  ssr: false,
  loading: () => <Skeleton className="mb-4 h-[160px] w-full" />,
})
const CowActivityChart = dynamic(() => import("./CowActivityChart"), {
  ssr: false,
  loading: () => <Skeleton className="h-[150px] w-full" />,
})

interface CowProfileProps {
  animal: AnimalDetails | null
  isLoading: boolean
  onBack?: () => void
  onBackUrl?: string
  onCowClick?: (id: number) => void
  onCowClickUrlBase?: string
  onRefresh?: () => void
}

export function CowProfile({
  animal,
  isLoading,
  onBack,
  onBackUrl,
  onCowClick,
  onCowClickUrlBase,
  onRefresh,
}: CowProfileProps) {
  const [selectedAlert, setSelectedAlert] = useState<CowAlert | null>(null)
  const [events, setEvents] = useState<CowEvent[]>([])
  const [addEventOpen, setAddEventOpen] = useState(false)

  const animalId = animal?.id

  const loadEvents = useCallback(() => {
    if (!animalId) return
    getAnimalEvents(animalId)
      .then((data) => setEvents(data.map(mapEventToCowEvent)))
      .catch((err) => console.error("Błąd ładowania zdarzeń zwierzęcia:", err))
  }, [animalId])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  if (isLoading || !animal) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[160px] w-full" />
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  const handlePlayClip = (eventId: string) => {
    console.log("Odtwarzanie klipu dla zdarzenia:", eventId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-1 flex-col p-4 md:p-6"
    >
      <CowProfileTopbar
        animal={animal}
        onBack={onBack}
        onBackUrl={onBackUrl}
        onEdit={() => console.log("Edytuj")}
        onAddEvent={() => setAddEventOpen(true)}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* Lewa kolumna */}
        <div className="flex flex-col gap-4">
          <CowIdCard animal={animal} />
          <CowActiveAlerts alerts={[]} onAlertClick={setSelectedAlert} />
          <CowPedigree
            animal={animal}
            onCowClick={onCowClick}
            onCowClickUrlBase={onCowClickUrlBase}
          />
          <CowOffspring
            offspring={[]}
            onCowClick={onCowClick}
            onCowClickUrlBase={onCowClickUrlBase}
          />
        </div>

        {/* Prawa kolumna */}
        <div className="flex flex-col gap-4">
          <CowYieldChart yieldHistory={[]} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CowActivityChart activityHistory={[]} />
            <CowBcsDisplay bcs={3.5} />
          </div>

          <CowEventTimeline
            events={events}
            onPlayClip={handlePlayClip}
            onAlertClick={setSelectedAlert}
          />
        </div>
      </div>

      <AlertDetailsSheet
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />

      <AddEventDialog
        animalId={animal.id}
        open={addEventOpen}
        onOpenChange={setAddEventOpen}
        onSaved={() => {
          loadEvents()
          onRefresh?.()
        }}
      />
    </motion.div>
  )
}
