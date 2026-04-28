"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface DailyMilkYield {
  date: string
  yield: number
  hasData: boolean
}

interface MilkYieldProps {
  currentYield: number
  difference: number
  history: DailyMilkYield[]
  className?: string
}

export function MilkYieldCard({
  currentYield,
  difference,
  history,
  className,
}: MilkYieldProps) {
  const isPositive = difference >= 0

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-[#243047] bg-[#1A2336] text-white",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_85%_-5%,rgba(74,96,128,0.45)_0%,transparent_60%)]",
        className
      )}
      size="sm"
    >
      <div className="relative flex flex-col py-0">
        <div className="flex items-center justify-between px-4 pt-1 pb-0">
          <div className="text-[12px] font-semibold tracking-[0.08em] text-[#8FA5C0] uppercase">
            Dzienna wydajność mleczna
          </div>
          <div className="flex cursor-pointer items-center text-[11px] font-medium text-[#C5D2E0] transition-colors hover:underline">
            Historia 30 dni <ChevronRight className="ml-0.5 h-3 w-3" />
          </div>
        </div>

        <div className="flex items-end gap-4 px-4 pt-2 pb-0">
          <div className="flex items-baseline gap-1">
            <span className="text-[52px] leading-[1] font-semibold tracking-[-1.5px] tabular-nums">
              {currentYield > 0 ? currentYield.toLocaleString() : "—"}
            </span>
            <span className="mb-2 text-[18px] font-light text-[#8FA5C0]">
              l
            </span>
          </div>

          <div className="mb-2 flex flex-col">
            {currentYield > 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 text-[12px] font-medium text-[#22C55E]">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="2,9 6,3 10,9" />
                  </svg>
                  +{difference} l
                </span>
                <span className="text-[11px] text-[#6A85A8]">vs wczoraj</span>
              </div>
            ) : (
              <span className="text-[11px] text-[#6A85A8]">Brak danych</span>
            )}
          </div>
        </div>

        <div className="mt-1 flex h-[52px] items-end gap-[3px] px-4 pb-3">
          {history.length > 0
            ? history.slice(-14).map((day, idx) => {
                const maxVal = Math.max(...history.map((h) => h.yield), 4000)
                const height = day.hasData
                  ? Math.max((day.yield / maxVal) * 100, 8)
                  : 8
                const isToday = idx === history.slice(-14).length - 1
                const isLow = day.hasData && day.yield < 3700 // Example threshold for red bars

                return (
                  <div
                    key={day.date + idx}
                    className={cn(
                      "flex-1 cursor-pointer rounded-t-[2px] transition-colors",
                      isToday
                        ? "bg-white/50"
                        : isLow
                          ? "bg-[#EF4444]/45"
                          : "bg-white/15 hover:bg-white/30"
                    )}
                    style={{ height: `${height}%` }}
                    title={
                      day.hasData
                        ? `${day.date}: ${day.yield} l`
                        : `${day.date}: Brak danych`
                    }
                  />
                )
              })
            : Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-t-[2px] bg-white/10"
                />
              ))}
        </div>
      </div>
    </Card>
  )
}
