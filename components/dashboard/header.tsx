"use client"

import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { HardwareStatusPopover } from "@/components/hardware/status-popover"
import { fetchHardwareStatus } from "@/api/hardware/liveness"
import { formatRelativeDate } from "@/lib/utils/date-utils"
import { pluralPl } from "@/lib/utils/plural"
import type { HardwareSummary } from "@/types/hardware"

/** Co ile odświeżamy pasek stanu. Edge raportuje co ~60 s, częstsze pytanie nic nie wniesie. */
const REFRESH_INTERVAL_MS = 60_000

interface DashboardSummary {
  userName: string
  farmName: string
  location: string
}

// TODO: podpiąć pod user-service / farm-service — pasek stanu poniżej jest już z backendu.
const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  return {
    userName: "Brunon",
    farmName: "Gospodarstwo Kowalski",
    location: "Bystre, Podlaskie",
  }
}

/**
 * Składa zdanie paska stanu z danych backendu. Świadomie po stronie UI —
 * API zwraca status i liczniki, nie gotowy polski tekst.
 */
function describeHealth(hardware: HardwareSummary): string {
  const { status, offlineDevices, warningDevices } = hardware.overall

  if (status === "offline") {
    // Edge jest bramą do wszystkiego — gdy milczy, o kamerach i obrożach nic nie wiemy.
    return "Brak łączności z serwerem edge"
  }
  if (offlineDevices > 0) {
    const noun = pluralPl(offlineDevices, "urządzenie", "urządzenia", "urządzeń")
    return `${offlineDevices} ${noun} bez kontaktu`
  }
  if (warningDevices > 0) {
    const noun = pluralPl(warningDevices, "urządzenie", "urządzenia", "urządzeń")
    const verb = pluralPl(warningDevices, "wymaga", "wymagają", "wymaga")
    return `${warningDevices} ${noun} ${verb} uwagi`
  }
  return "Wszystkie systemy aktywne"
}

function describeSync(hardware: HardwareSummary): string {
  return hardware.overall.lastSyncAt
    ? `Synchronizacja ${formatRelativeDate(hardware.overall.lastSyncAt)}`
    : "Brak synchronizacji"
}

export function DashboardHeader() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [hardware, setHardware] = useState<HardwareSummary | null>(null)
  const [hardwareFailed, setHardwareFailed] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    let cancelled = false

    const refreshHardware = () =>
      fetchHardwareStatus()
        .then((result) => {
          if (cancelled) return
          setHardware(result)
          setHardwareFailed(false)
        })
        .catch((error) => {
          if (cancelled) return
          console.error("Failed to fetch hardware status:", error)
          // Nie zostawiamy poprzedniego stanu jako aktualnego — zielona kropka przy zerwanym
          // połączeniu z API kłamałaby o stanie gospodarstwa.
          setHardware(null)
          setHardwareFailed(true)
        })

    fetchDashboardSummary().then(setData)
    refreshHardware()

    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Odświeżamy razem z zegarem, żeby „Synchronizacja X temu" nie zastygała.
      refreshHardware()
    }, REFRESH_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
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

  // Cztery stany, nie dwa: doszły „uwaga" (awaria częściowa) i „nieznany" (API nie odpowiada).
  const dotColor = hardwareFailed
    ? "bg-[#8A93A2]"
    : !hardware
      ? "bg-[#8A93A2]"
      : hardware.overall.status === "online"
        ? "bg-[#22C55E]"
        : hardware.overall.status === "warning"
          ? "bg-[#F59E0B]"
          : "bg-[#EF4444]"

  const statusText = hardwareFailed
    ? "Stan urządzeń niedostępny"
    : !hardware
      ? "Sprawdzanie stanu urządzeń…"
      : `${describeHealth(hardware)} · ${describeSync(hardware)}`

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
              {/* Pulsowanie tylko gdy stan jest znany — migająca szara kropka sugerowałaby aktywność. */}
              {hardware && !hardwareFailed && (
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dotColor}`}
                ></span>
              )}
              <span
                className={`relative inline-flex h-1.75 w-1.75 rounded-full ${dotColor}`}
              ></span>
            </div>
            <span className="decoration-dotted underline-offset-4 group-hover:underline">
              {statusText}
            </span>
          </button>
        </HardwareStatusPopover>
      </div>
    </div>
  )
}
