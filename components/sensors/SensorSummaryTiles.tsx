"use client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { SensorPoolSummary } from "@/lib/types/sensor.types"
import type { SummaryTile } from "./sensor-list-query"

interface SensorSummaryTilesProps {
  summary: SensorPoolSummary | null
  isActive: (tile: SummaryTile) => boolean
  onSelect: (tile: SummaryTile) => void
}

const TILES: { tile: SummaryTile; label: string; value: (s: SensorPoolSummary) => number }[] = [
  { tile: "ALL", label: "Wszystkie", value: (s) => s.total },
  { tile: "ASSIGNED", label: "Na krowach", value: (s) => s.assigned },
  { tile: "FREE", label: "Wolne", value: (s) => s.free },
  { tile: "ATTENTION", label: "Wymaga uwagi", value: (s) => s.needsAttention },
]

/**
 * Stan całej puli — i zarazem najszybszy filtr. Hodowca zwykle chce jednego z tych czterech
 * widoków, więc jedno kliknięcie w kafelek zastępuje grzebanie w listach rozwijanych.
 */
export function SensorSummaryTiles({ summary, isActive, onSelect }: SensorSummaryTilesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {TILES.map(({ tile, label, value }) => {
        const active = isActive(tile)
        const count = summary ? value(summary) : null
        const alarming = tile === "ATTENTION" && (count ?? 0) > 0
        return (
          <button
            key={tile}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(tile)}
            className={cn(
              "flex flex-col gap-1 rounded-xl border bg-card px-4 py-3 text-left transition-colors",
              "hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active && "border-foreground/60 ring-1 ring-foreground/60",
              alarming && !active && "border-amber-300 dark:border-amber-900/60"
            )}
          >
            <span className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              {label}
            </span>
            {count === null ? (
              <Skeleton className="h-7 w-10" />
            ) : (
              <span
                className={cn(
                  "text-xl font-semibold tabular-nums",
                  alarming && "text-amber-700 dark:text-amber-400"
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
