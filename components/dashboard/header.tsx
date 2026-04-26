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
  // Pierwsza litera wielka dla dnia tygodnia
  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <div className="flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end">
      <div className="flex-1">
        <div className="mb-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          Dzień dobry, {data.userName} — {capitalizedDate}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {data.farmName} — {data.location}
        </h1>
      </div>
      <div className="flex flex-col items-end gap-2">
        <HardwareStatusPopover>
          <button className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground">
            <div className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${data.systemsActive ? "bg-green-400" : "bg-red-400"}`}
              ></span>
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${data.systemsActive ? "bg-green-500" : "bg-red-500"}`}
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
