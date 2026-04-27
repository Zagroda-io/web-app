"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface HerdStatusProps {
  activeCows: number
  alertsCount: number
  dryCowsCount: number
  currentlyMilking: number
  className?: string
}

export function HerdStatusCard({
  activeCows,
  alertsCount,
  dryCowsCount,
  currentlyMilking,
  className,
}: HerdStatusProps) {
  return (
    <Card className={cn("overflow-hidden", className)} size="sm">
      <div className="flex flex-col py-0">
        <div className="flex items-center justify-between px-4 pt-1 pb-0">
          <div className="text-[12px] font-semibold tracking-[0.08em] text-[#8A93A2] uppercase dark:text-muted-foreground/80">
            Stado — Aktywne krowy
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 px-4 pt-2 pb-1">
          <span className="text-[28px] leading-none font-semibold tracking-[-0.5px] text-[#131720] tabular-nums dark:text-foreground">
            {activeCows}
          </span>
          <span className="text-[13px] font-light text-[#8A93A2] dark:text-muted-foreground/60">
            szt.
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 px-4 pb-1.5">
          <Badge
            variant="outline"
            className="flex h-auto items-center rounded-[20px] border-none bg-[#FEF2F2] px-[7px] py-[2px] text-[11px] font-medium text-[#B91C1C] hover:bg-[#FEF2F2]/80 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            <span className="mr-1 h-2 w-2 shrink-0 rounded-full bg-current" />
            {alertsCount} alertów
          </Badge>
          <Badge
            variant="outline"
            className="flex h-auto items-center rounded-[20px] border-none bg-[#FEF3DC] px-[7px] py-[2px] text-[11px] font-medium text-[#B45309] hover:bg-[#FEF3DC]/80 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50"
          >
            <span className="mr-1 h-2 w-2 shrink-0 rounded-full bg-current" />
            {dryCowsCount} zasuszenie
          </Badge>
        </div>

        <div className="px-4 text-[12px] text-[#8A93A2] dark:text-muted-foreground">
          W hali dojenia teraz:{" "}
          <span className="font-semibold text-[#3A4F70] dark:text-blue-400">
            {currentlyMilking} krów
          </span>
        </div>
      </div>
    </Card>
  )
}
