"use client"

import { useState } from "react"
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
import type { Cow, CowAlert } from "@/lib/types/stado.types"

// Dynamic imports for Recharts components
const CowYieldChart = dynamic(() => import("./CowYieldChart"), {
  ssr: false,
  loading: () => <Skeleton className="mb-4 h-[160px] w-full" />,
})
const CowActivityChart = dynamic(() => import("./CowActivityChart"), {
  ssr: false,
  loading: () => <Skeleton className="h-[150px] w-full" />,
})

interface CowProfileProps {
  cow: Cow | null
  isLoading: boolean
  onBack?: () => void
  onBackUrl?: string
  onCowClick?: (id: number) => void
  onCowClickUrlBase?: string
}

export function CowProfile({
  cow,
  isLoading,
  onBack,
  onBackUrl,
  onCowClick,
  onCowClickUrlBase,
}: CowProfileProps) {
  const [selectedAlert, setSelectedAlert] = useState<CowAlert | null>(null)

  if (isLoading || !cow) {
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
        cow={cow}
        onBack={onBack}
        onBackUrl={onBackUrl}
        onEdit={() => console.log("Edytuj")}
        onAddEvent={() => console.log("Dodaj zdarzenie")}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* Lewa kolumna */}
        <div className="flex flex-col gap-4">
          <CowIdCard cow={cow} />
          <CowActiveAlerts
            alerts={cow.activeAlerts}
            onAlertClick={setSelectedAlert}
          />
          <CowPedigree
            sire={cow.sire}
            dam={cow.dam}
            onCowClick={onCowClick}
            onCowClickUrlBase={onCowClickUrlBase}
          />
          <CowOffspring
            offspring={cow.offspring}
            onCowClick={onCowClick}
            onCowClickUrlBase={onCowClickUrlBase}
          />
        </div>

        {/* Prawa kolumna */}
        <div className="flex flex-col gap-4">
          <CowYieldChart yieldHistory={cow.yieldHistory} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CowActivityChart activityHistory={cow.activityHistory} />
            <CowBcsDisplay bcs={cow.bcs} />
          </div>

          <CowEventTimeline
            events={cow.events}
            onPlayClip={handlePlayClip}
            onAlertClick={setSelectedAlert}
          />
        </div>
      </div>

      <AlertDetailsSheet
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </motion.div>
  )
}
