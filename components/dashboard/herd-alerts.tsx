"use client"

import React, { useState } from "react"
import { AlertTriangle, Bookmark, CheckCircle, Clock, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface HerdAlert {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  description: string
  time: string
  hasVideo?: boolean
  details?: {
    metric?: string
    value?: string
    recommendation?: string
    analysis?: string
  }
}

const mockAlerts: HerdAlert[] = [
  {
    id: "1",
    type: "critical",
    title: "Krowa #034 — podwyższona temperatura",
    description: "39,8°C — możliwe zapalenie wymienia. Wymaga kontroli wet.",
    time: "06:14",
    details: {
      metric: "Temperatura ciała",
      value: "39,8°C (Norma: 38,5-39,2°C)",
      recommendation:
        "Odseparowanie od stada, pilna kontrola weterynaryjna, badanie wymienia.",
      analysis:
        "Wykryto gwałtowny wzrost temperatury w ciągu ostatnich 2 godzin (+1,2°C).",
    },
  },
  {
    id: "2",
    type: "warning",
    title: "Krowa #017 — spadek wydajności",
    description: "–18% przez 3 dni. Kontrola paszy i kondycji ciała.",
    time: "05:30",
    details: {
      metric: "Wydajność dojna",
      value: "14,2 l (Średnia: 17,4 l)",
      recommendation:
        "Sprawdzenie dostępności paszy, kontrola apetytu, badanie BCS (Body Condition Score).",
      analysis:
        "Trend spadkowy utrzymuje się od poniedziałku. Brak innych objawów chorobowych.",
    },
  },
  {
    id: "3",
    type: "warning",
    title: "Krowa #061 — detekcja estrus",
    description: "Optymalne okno inseminacji: 6–12h. Aktyw. +340%.",
    time: "04:55",
    hasVideo: true,
    details: {
      metric: "Aktywność ruchowa",
      value: "+340% względem bazy",
      recommendation: "Planowana inseminacja między 11:00 a 17:00.",
      analysis:
        "Analiza obrazu z kamery AI potwierdziła zachowania rujowe (obskakiwanie, niepokój).",
    },
  },
  {
    id: "4",
    type: "info",
    title: "Wizyta weterynaryjna — jutro 8:00",
    description: "4 krowy do zbadania. BCS + kontrola wymion.",
    time: "jutro",
    details: {
      metric: "Planowane badania",
      value: "4 sztuki (#034, #012, #088, #055)",
      recommendation: "Przygotowanie dokumentacji medycznej wybranych krów.",
      analysis:
        "Rutynowa kontrola okresowa oraz badanie zgłoszonego przypadku #034.",
    },
  },
  {
    id: "5",
    type: "success",
    title: "Wyniki badań mleka — Kwiecień",
    description: "LKS: 48k, Białko: 3,42% — klasa Extra. Bonus +0,04 zł/l.",
    time: "wczoraj",
    details: {
      metric: "Klasa jakości",
      value: "Extra",
      recommendation:
        "Utrzymanie obecnego reżimu żywieniowego i higienicznego.",
      analysis:
        "Wszystkie parametry (LKS, LB, tłuszcz, białko) znajdują się w górnych 5% normy regionalnej.",
    },
  },
]

export function HerdAlerts() {
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
        return "bg-red-500/10 border-red-500/20"
      case "warning":
        return "bg-amber-500/10 border-amber-500/20"
      case "info":
        return "bg-blue-500/10 border-blue-500/20"
      case "success":
        return "bg-green-500/10 border-green-500/20"
    }
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            Alerty stada
          </CardTitle>
          <Badge
            variant="destructive"
            className="h-5 px-2 text-[10px] font-medium"
          >
            3 aktywne
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {mockAlerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className="flex items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border",
                    getAlertColorClass(alert.type)
                  )}
                >
                  {getAlertIcon(alert.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {alert.title}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {alert.time}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {alert.description}
                  </p>
                </div>
              </button>
            ))}
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
                      predictionData={[
                        {
                          label: "Wysoka temperatura",
                          value: 85,
                          color: "bg-red-500",
                        },
                        {
                          label: "Spadek produkcji",
                          value: 65,
                          color: "bg-amber-500",
                        },
                        {
                          label: "Anomalia zachowania",
                          value: 15,
                          color: "bg-green-500",
                        },
                      ]}
                      summary={
                        selectedAlert.details?.analysis ||
                        "System AI wykrył nieprawidłowości w zachowaniu i parametrach życiowych krowy. Zalecana jest natychmiastowa weryfikacja stanu zdrowia oraz konsultacja z lekarzem weterynarii."
                      }
                    />

                    <AlertEntities
                      entities={[
                        {
                          match: 62,
                          type: "Krowa",
                          id: selectedAlert.title.match(/#\d+/)?.[0] || "#000",
                          subType: "Krowa mleczna • Holstein",
                        },
                        {
                          match: 6,
                          type: "Krowa",
                          id: "#012",
                          subType: "Krowa mleczna • Jersey",
                        },
                      ]}
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
