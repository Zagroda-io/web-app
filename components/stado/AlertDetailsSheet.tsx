"use client"

import React from "react"
import { Bookmark } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertActions } from "@/components/dashboard/alert-details/alert-actions"
import { AlertOverview } from "@/components/dashboard/alert-details/alert-overview"
import { AlertEntities } from "@/components/dashboard/alert-details/alert-entities"
import { AlertRiskProfile } from "@/components/dashboard/alert-details/alert-risk-profile"
import type { CowAlert } from "@/lib/types/stado.types"

interface AlertDetailsSheetProps {
  alert: CowAlert | null
  onClose: () => void
}

export function AlertDetailsSheet({ alert, onClose }: AlertDetailsSheetProps) {
  return (
    <Sheet open={!!alert} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-[550px]">
        <SheetHeader className="sr-only">
          <SheetTitle>Szczegóły alertu</SheetTitle>
          <SheetDescription>
            Szczegółowe informacje o wykrytym alercie dla zwierzęcia.
          </SheetDescription>
        </SheetHeader>

        {alert && (
          <div className="flex h-full flex-col overflow-hidden bg-muted/30 dark:bg-background">
            <div className="flex shrink-0 items-center justify-between border-b bg-background px-4 py-3">
              <div className="flex items-center gap-2">
                <Bookmark className="size-4 text-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {alert.title.includes("#")
                    ? `Wykryto ${alert.title.split(" — ")[0].toLowerCase()}`
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
                      alert.severity === "red"
                        ? "Wysoka"
                        : alert.severity === "amber"
                          ? "Średnia"
                          : "Niska"
                    }
                    predictionData={alert.details?.predictionData || []}
                    summary={
                      alert.details?.analysis ||
                      "System AI wykrył nieprawidłowości w zachowaniu i parametrach życiowych zwierzęcia. Zalecana jest natychmiastowa weryfikacja stanu zdrowia oraz konsultacja z lekarzem weterynarii."
                    }
                  />

                  <AlertEntities entities={alert.details?.entities || []} />

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
  )
}
