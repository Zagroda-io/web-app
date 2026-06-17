"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { HerdKpiData } from "@/types/herd.types"
import { HerdSizeWidget } from "./HerdSizeWidget"
import { LactationWidget } from "./LactationWidget"
import { ReproductionWidget } from "./ReproductionWidget"
import { Card, CardContent } from "@/components/ui/card"
import { InlineError } from "@/components/shared/InlineError"

interface HerdKpiSectionProps {
  data: HerdKpiData
  error?: boolean
  onRetry?: () => void
}

export const HerdKpiSection = ({ data, error, onRetry }: HerdKpiSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <InlineError onRetry={onRetry} />
          Nie udało się pobrać wskaźników stada.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Łącznie */}
        <Card className="border-gray-100 shadow-none">
          <CardContent className="flex h-full flex-col justify-between p-4">
            <div>
              <p className="mb-1 text-[12px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Wielkość stada
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] leading-none font-semibold tracking-[-0.5px] text-foreground tabular-nums">
                  {data.herdSize.total}
                </span>
                <span className="text-[13px] font-light text-muted-foreground">
                  szt.
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">sztuk ogółem</p>
          </CardContent>
        </Card>

        {/* Card 2: W laktacji */}
        <Card className="border-gray-100 shadow-none">
          <CardContent className="flex h-full flex-col justify-between p-4">
            <div>
              <p className="mb-1 text-[12px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                W laktacji
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] leading-none font-semibold tracking-[-0.5px] text-foreground tabular-nums">
                  {data.lactation.inLactation}
                </span>
                <span className="text-[13px] font-light text-muted-foreground">
                  szt.
                </span>
                <span className="ml-0.5 text-sm text-muted-foreground">
                  ({data.lactation.inLactationPercentage}%)
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">krów dojnych</p>
          </CardContent>
        </Card>

        {/* Card 3: Zasuszone */}
        <Card className="border-gray-100 shadow-none">
          <CardContent className="flex h-full flex-col justify-between p-4">
            <div>
              <p className="mb-1 text-[12px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Zasuszone
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] leading-none font-semibold tracking-[-0.5px] text-foreground tabular-nums">
                  {data.lactation.dry}
                </span>
                <span className="text-[13px] font-light text-muted-foreground">
                  szt.
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">krów zasuszonych</p>
          </CardContent>
        </Card>

        {/* Card 4: Zbliżające się porody */}
        <Card className="border-gray-100 shadow-none">
          <CardContent className="flex h-full flex-col justify-between p-4">
            <div>
              <p className="mb-1 text-[12px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Nadchodzące porody
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] leading-none font-semibold tracking-[-0.5px] text-foreground tabular-nums">
                  {data.upcomingCalvings.length}
                </span>
                <span className="text-[13px] font-light text-muted-foreground">
                  szt.
                </span>
              </div>
              <button
                className="mt-1 block text-xs text-blue-600 hover:underline"
                onClick={() => setIsExpanded(true)}
              >
                Zobacz →
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">w ciągu 14 dni</p>
          </CardContent>
        </Card>
      </div>

      {isExpanded && (
        <div className="animate-in space-y-8 duration-500 fade-in">
          <section className="space-y-4">
            <h3 className="mb-2 text-[11px] font-medium tracking-widest text-gray-400 uppercase">
              Szczegóły stada
            </h3>
            <HerdSizeWidget data={data.herdSize} />
          </section>

          <section className="space-y-4">
            <h3 className="mb-2 text-[11px] font-medium tracking-widest text-gray-400 uppercase">
              Laktacja
            </h3>
            <LactationWidget data={data.lactation} />
          </section>

          <section className="space-y-4">
            <h3 className="mb-2 text-[11px] font-medium tracking-widest text-gray-400 uppercase">
              Rozród
            </h3>
            <ReproductionWidget data={data.reproduction} />
          </section>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          {isExpanded ? (
            <>
              Zwiń <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Pokaż więcej KPI <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
