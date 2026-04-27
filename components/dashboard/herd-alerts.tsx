"use client"

import React, { useState } from "react"
import { AlertTriangle, Bookmark, CheckCircle, Clock, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { AlertActions } from "./alert-details/alert-actions"
import { AlertOverview } from "./alert-details/alert-overview"
import { AlertEntities } from "./alert-details/alert-entities"
import { AlertRiskProfile } from "./alert-details/alert-risk-profile"
import { HerdAlert } from "@/mocks/dashboard/herd-alerts"

interface HerdAlertsProps {
  alerts: HerdAlert[]
}

export function HerdAlerts({ alerts }: HerdAlertsProps) {
  const [selectedAlert, setSelectedAlert] = useState<HerdAlert | null>(null)

  const getAlertIcon = (type: HerdAlert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="size-4 text-red-500" />
      case "warning":
        return <Info className="size-4 text-amber-500" />
      case "info":
        return <Clock className="size-4 text-blue-500" />
      case "success":
        return <CheckCircle className="size-4 text-green-500" />
    }
  }

  const getAlertColorClass = (type: HerdAlert["type"]) => {
    switch (type) {
      case "critical":
        return "bg-[#FEF2F2] dark:bg-red-950/30 text-[#EF4444] dark:text-red-400"
      case "warning":
        return "bg-[#FFFBEB] dark:bg-amber-950/30 text-[#F59E0B] dark:text-amber-400"
      case "info":
        return "bg-[#EBF0F5] dark:bg-blue-950/30 text-[#3A4F70] dark:text-blue-400"
      case "success":
        return "bg-[#F0FDF4] dark:bg-green-950/30 text-[#15803D] dark:text-green-400"
    }
  }

  return (
    <>
      <Card className="overflow-hidden py-0" size="sm">
        <div className="flex flex-col py-0">
          <div className="flex items-center justify-between px-4 pt-1 pb-0">
            <div className="text-[12px] font-semibold tracking-[0.08em] text-[#8A93A2] uppercase dark:text-muted-foreground/80">
              Alerty stada
            </div>
          </div>
        </div>
        <CardContent className="p-0 pt-2">
          <div className="flex flex-col">
            {alerts.slice(0, 5).map((alert) => (
              <button
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className="flex items-start gap-2.5 border-b border-[#ECEEF2] px-4 py-[9px] text-left transition-colors last:border-0 hover:bg-[#F7F8FA] dark:border-border/40 dark:hover:bg-muted/20"
              >
                <div
                  className={cn(
                    "mt-[1px] flex size-7 shrink-0 items-center justify-center rounded-[7px]",
                    getAlertColorClass(alert.type)
                  )}
                >
                  <span className="[&>svg]:size-[13px]">
                    {getAlertIcon(alert.type)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-[#131720] dark:text-foreground">
                      {alert.title}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-[#B8BFCC] dark:text-muted-foreground/40">
                      {alert.time}
                    </span>
                  </div>
                  <p className="mt-[1px] line-clamp-2 text-[11px] leading-[1.5] text-[#8A93A2] dark:text-muted-foreground/80">
                    {alert.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 px-4 pt-3 pb-3">
            <Badge
              variant="outline"
              className="flex h-auto items-center rounded-[20px] border-none bg-[#FEF2F2] px-3 py-[3px] text-[11px] font-medium text-[#B91C1C] hover:bg-[#FEF2F2]/80 dark:bg-red-950/30 dark:text-red-400"
            >
              5 wysoki
            </Badge>
            <Badge
              variant="outline"
              className="flex h-auto items-center rounded-[20px] border-none bg-[#FEF3DC] px-3 py-[3px] text-[11px] font-medium text-[#B45309] hover:bg-[#FEF3DC]/80 dark:bg-amber-950/30 dark:text-amber-400"
            >
              3 średni
            </Badge>
            <Badge
              variant="outline"
              className="flex h-auto items-center rounded-[20px] border-none bg-[#F0FDF4] px-3 py-[3px] text-[11px] font-medium text-[#15803D] hover:bg-[#F0FDF4]/80 dark:bg-green-950/30 dark:text-green-400"
            >
              2 info
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Sheet
        open={!!selectedAlert}
        onOpenChange={(open) => !open && setSelectedAlert(null)}
      >
        <SheetContent
          side="right"
          className="w-full gap-0 p-0 sm:max-w-[550px]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Szczegóły alertu</SheetTitle>
            <SheetDescription>
              Szczegółowe informacje o wykrytym alercie dla stada.
            </SheetDescription>
          </SheetHeader>
          {selectedAlert && (
            <div className="flex h-full flex-col overflow-hidden bg-muted/30 dark:bg-background">
              <div className="flex shrink-0 items-center justify-between border-b bg-background px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bookmark className="size-4 text-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    {selectedAlert.title.includes("#")
                      ? `Wykryto ${selectedAlert.title.split(" — ")[0].toLowerCase()}`
                      : "Szczegóły alertu"}
                  </span>
                </div>
              </div>

              <Tabs
                defaultValue="overview"
                className="flex flex-1 flex-col overflow-hidden"
              >
                <div className="shrink-0 border-b bg-background px-2">
                  <TabsList
                    variant="line"
                    className="h-10 w-full justify-start gap-4"
                  >
                    <TabsTrigger
                      value="overview"
                      className="px-4 text-xs font-medium"
                    >
                      Podsumowanie
                    </TabsTrigger>
                    <TabsTrigger
                      value="master"
                      className="px-4 text-xs font-medium"
                    >
                      Dane podstawowe
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="px-4 text-xs font-medium"
                    >
                      Historia
                    </TabsTrigger>
                    <TabsTrigger
                      value="communication"
                      className="px-4 text-xs font-medium"
                    >
                      Komunikacja
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="scrollbar-hide flex-1 overflow-y-auto p-6">
                  <TabsContent value="overview" className="m-0 space-y-8">
                    <AlertActions />

                    <AlertOverview
                      criticality={
                        selectedAlert.type === "critical"
                          ? "Wysoka"
                          : selectedAlert.type === "warning"
                            ? "Średnia"
                            : "Niska"
                      }
                      predictionData={
                        selectedAlert.details?.predictionData || []
                      }
                      summary={
                        selectedAlert.details?.analysis ||
                        "System AI wykrył nieprawidłowości w zachowaniu i parametrach życiowych krowy. Zalecana jest natychmiastowa weryfikacja stanu zdrowia oraz konsultacja z lekarzem weterynarii."
                      }
                    />

                    <AlertEntities
                      entities={selectedAlert.details?.entities || []}
                    />

                    <AlertRiskProfile />
                  </TabsContent>

                  <TabsContent value="master" className="m-0 pt-4">
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                      Sekcja danych podstawowych w przygotowaniu.
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="m-0 pt-4">
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                      Historia zdarzeń dla tego obiektu.
                    </div>
                  </TabsContent>

                  <TabsContent value="communication" className="m-0 pt-4">
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                      Komunikacja i notatki personelu.
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
