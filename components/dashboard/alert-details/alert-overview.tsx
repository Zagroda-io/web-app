"use client"

import React from "react"
import { ChevronDown, ChevronUp, Pencil } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface AlertOverviewProps {
  criticality: "Wysoka" | "Średnia" | "Niska"
  predictionData: {
    label: string
    value: number
    color: string
  }[]
  summary: string
}

export function AlertOverview({
  criticality,
  predictionData,
  summary,
}: AlertOverviewProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const criticalityColor =
    criticality === "Wysoka"
      ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50"
      : criticality === "Średnia"
        ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50"
        : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900/50"

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card
          className={cn(
            "flex flex-col items-center justify-center overflow-hidden border p-6 text-center",
            criticalityColor
          )}
        >
          <span className="mb-1 text-sm font-medium opacity-80">
            Krytyczność
          </span>
          <span className="text-4xl font-bold tracking-tight break-all sm:text-5xl">
            {criticality}
          </span>
        </Card>

        <Card className="border bg-card p-4 dark:bg-muted/20">
          <h4 className="mb-4 text-center text-sm font-semibold">Predykcja</h4>
          <div className="space-y-4">
            {predictionData.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="text-xs font-medium text-foreground/80">
                  {item.label}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-muted/50">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      item.color
                    )}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Podsumowanie
            </h3>
            <Badge
              variant="secondary"
              className="h-5 border-blue-100 bg-blue-50 text-[10px] font-medium text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400"
            >
              Wygenerowane przez AI
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
