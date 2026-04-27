"use client"

import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { HardwareStatusPopover } from "@/components/hardware/status-popover"

interface DashboardSummary {
  userName: string
  farmName: string
  location: string
  systemsActive: boolean
  lastSyncMinutes: number
}

// Mock API call
const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  return {
    userName: "Brunon",
    farmName: "Gospodarstwo Kowalski",
    location: "Bystre, Podlaskie",
    systemsActive: true,
    lastSyncMinutes: 3,
  }
}

export function DashboardHeader() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    fetchDashboardSummary().then(setData)

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  if (!data) {
    return (
      <div className="flex animate-pulse flex-col gap-1 pb-4">
        <div className="h-4 w-48 rounded bg-muted" />
        <div className="h-8 w-64 rounded bg-muted" />
      </div>
    )
  }

  const formattedDate = format(currentTime, "EEEE, d MMM yyyy · HH:mm", {
    locale: pl,
  })

  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <div className="flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end">
      <div className="flex-1">
        <div className="mb-0.5 text-[11px] font-semibold tracking-[0.08em] text-[#8A93A2] uppercase dark:text-muted-foreground/80">
          Dzień dobry, {data.userName} — {capitalizedDate}
        </div>
        <h1 className="text-xl font-semibold tracking-[-0.3px] text-[#131720] dark:text-foreground">
          {data.farmName} — {data.location}
        </h1>
      </div>
      <div className="flex flex-col items-end gap-2">
        <HardwareStatusPopover>
          <button className="group flex items-center gap-1.5 text-xs text-[#8A93A2] transition-colors outline-none hover:text-[#131720] dark:text-muted-foreground/60 dark:hover:text-foreground">
            <div className="relative flex h-1.75 w-1.75">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${data.systemsActive ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}
              ></span>
              <span
                className={`relative inline-flex h-1.75 w-1.75 rounded-full ${data.systemsActive ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}
              ></span>
            </div>
            <span className="decoration-dotted underline-offset-4 group-hover:underline">
              {data.systemsActive
                ? "Wszystkie systemy aktywne"
                : "Uwaga: Problemy z systemami"}{" "}
              · Synchronizacja {data.lastSyncMinutes} min. temu
            </span>
          </button>
        </HardwareStatusPopover>
      </div>
    </div>
  )
}
