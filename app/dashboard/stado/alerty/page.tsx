"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getFarmAlerts } from "@/api/alerts"
import { ApiErrorState } from "@/components/shared/ApiErrorState"
import { AlertVideoDialog } from "@/components/stado/AlertVideoDialog"
import { AlertDatasetButton } from "@/components/stado/AlertDatasetButton"
import { AlertReviewControls } from "@/components/stado/AlertReviewControls"
import {
  alertTypeMeta,
  formatConfidence,
} from "@/components/stado/alert-utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  AlertReviewStatus,
  AlertSeverity,
  FarmAlert,
  PaginatedResponse,
} from "@/lib/types/stado.types"

const PAGE_SIZE = 20

/** Zakładki filtra weryfikacji; "ALL" to brak parametru reviewStatus w zapytaniu. */
type ReviewFilter = "ALL" | AlertReviewStatus

const REVIEW_FILTERS: { value: ReviewFilter; label: string }[] = [
  { value: "PENDING", label: "Do weryfikacji" },
  { value: "CONFIRMED", label: "Potwierdzone" },
  { value: "REJECTED", label: "Fałszywe" },
  { value: "ALL", label: "Wszystkie" },
]

/** Siatka wiersza — kolumna weryfikacji doszła po „Pewność". */
const ROW_GRID =
  "grid-cols-[16px_100px_140px_1fr_90px_170px_150px_150px]"

const severityColors: Record<AlertSeverity, string> = {
  red: "bg-destructive",
  amber: "bg-amber-400",
  green: "bg-green-500",
  info: "bg-muted-foreground",
}

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return "—"
  return date.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AlertyPage() {
  const [data, setData] = useState<PaginatedResponse<FarmAlert>>()
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState<ReviewFilter>("PENDING")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [videoAlert, setVideoAlert] = useState<FarmAlert | null>(null)

  const loadAlerts = useCallback(async () => {
    setIsLoading(true)
    setError(false)
    try {
      setData(
        await getFarmAlerts({
          page,
          size: PAGE_SIZE,
          reviewStatus: filter === "ALL" ? undefined : filter,
        })
      )
    } catch (err) {
      console.error("Błąd ładowania alertów:", err)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }, [page, filter])

  useEffect(() => {
    loadAlerts()
  }, [loadAlerts])

  /**
   * Po werdykcie podmieniamy alert w miejscu — bez przeładowania listy, żeby hodowca mógł
   * przejść przez kolejne pozycje bez skakania widoku. Wyjątek: gdy lista jest zawężona do
   * jednego statusu, zweryfikowany alert do niej już nie należy, więc znika.
   */
  const handleReviewed = (updated: FarmAlert) => {
    setData((current) => {
      if (!current) return current
      const belongsToFilter = filter === "ALL" || updated.reviewStatus === filter
      const content = belongsToFilter
        ? current.content.map((alert) =>
            alert.alertId === updated.alertId ? updated : alert
          )
        : current.content.filter((alert) => alert.alertId !== updated.alertId)
      return {
        ...current,
        content,
        totalElements: belongsToFilter
          ? current.totalElements
          : Math.max(current.totalElements - 1, 0),
      }
    })
    setVideoAlert((current) =>
      current && current.alertId === updated.alertId ? updated : current
    )
  }

  // Na zakładce „Fałszywe" pakujemy przykłady negatywne, w pozostałych — potwierdzone.
  const datasetStatus = filter === "REJECTED" ? "REJECTED" : "CONFIRMED"
  // Licznik znamy tylko wtedy, gdy oglądana lista to dokładnie ten zbiór.
  const datasetCount =
    data && filter === datasetStatus ? data.totalElements : undefined

  return (
    <div className="flex flex-1 flex-col gap-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/dashboard/stado" title="Wróć do widoku Stado">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Alerty</h1>
            <p className="text-xs text-muted-foreground">
              Zdarzenia wykryte przez modele AI (topik farm.&lt;klucz&gt;.alerts)
              {data && ` · ${data.totalElements} łącznie`}
            </p>
          </div>
        </div>
        <AlertDatasetButton
          reviewStatus={datasetStatus}
          availableCount={datasetCount}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Tabs
          value={filter}
          onValueChange={(value) => {
            setFilter(value as ReviewFilter)
            setPage(0)
          }}
        >
          <TabsList>
            {REVIEW_FILTERS.map((option) => (
              <TabsTrigger key={option.value} value={option.value}>
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <p className="text-[11px] text-muted-foreground">
          Potwierdzone alerty zasilają materiał do douczania modelu — paczkę z ich
          klipami pobierzesz przyciskiem &bdquo;Pobierz materiał (ZIP)&rdquo;.
        </p>
      </div>

      {error ? (
        <ApiErrorState
          message="Nie udało się pobrać listy alertów."
          onRetry={loadAlerts}
        />
      ) : (
        <Card
          className="gap-0 overflow-hidden p-0 py-0 shadow-none data-[size=sm]:py-0"
          size="sm"
        >
          <div
            className={cn(
              "hidden items-center gap-4 border-b bg-slate-50/50 px-4 py-2 text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase md:grid dark:bg-muted/20",
              ROW_GRID
            )}
          >
            <div />
            <div>Typ</div>
            <div>Zwierzę</div>
            <div>Alert</div>
            <div className="text-right">Pewność</div>
            <div>Weryfikacja</div>
            <div className="text-right">Wykryto</div>
            <div className="text-right">Odebrano</div>
          </div>

          <div className="flex flex-col">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "grid items-center gap-4 border-b px-4 py-3 last:border-0",
                    ROW_GRID
                  )}
                >
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="ml-auto h-4 w-10" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="ml-auto h-4 w-24" />
                  <Skeleton className="ml-auto h-4 w-24" />
                </div>
              ))
            ) : !data || data.content.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                {filter === "PENDING"
                  ? "Wszystkie alerty zweryfikowane — nie ma nic do potwierdzenia."
                  : "Brak alertów dla tego gospodarstwa."}
              </div>
            ) : (
              data.content.map((alert) => {
                const meta = alertTypeMeta(alert.type)
                return (
                  <div
                    key={alert.alertId}
                    className={cn(
                      "grid items-center gap-4 overflow-x-auto border-b px-4 py-3 last:border-0 md:overflow-x-visible",
                      ROW_GRID
                    )}
                  >
                    <div className="flex justify-center">
                      <div
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          severityColors[meta.severity]
                        )}
                      />
                    </div>
                    <div className="flex">
                      <Badge
                        variant="outline"
                        className={cn(
                          "w-full justify-center px-1.5 py-0 text-[10px] font-bold uppercase",
                          meta.badgeClass
                        )}
                      >
                        {meta.label}
                      </Badge>
                    </div>
                    <div
                      className="truncate font-mono text-xs font-semibold text-muted-foreground"
                      title={alert.cowId ?? "Nieprzypisane zwierzę"}
                    >
                      {alert.cowId ? `#${alert.cowId.slice(0, 8)}` : "—"}
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate font-mono text-xs text-muted-foreground">
                        {alert.alertId}
                      </span>
                      {alert.hasVideo && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 shrink-0 gap-1 px-2 text-[10px] font-semibold"
                          onClick={() => setVideoAlert(alert)}
                        >
                          <Play className="h-3 w-3 fill-current" />
                          Odtwórz
                        </Button>
                      )}
                    </div>
                    <div className="text-right font-mono text-xs font-semibold">
                      {formatConfidence(alert.confidence)}
                    </div>
                    <AlertReviewControls
                      alert={alert}
                      onReviewed={handleReviewed}
                    />
                    <div className="text-right font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                      {formatDateTime(alert.detectedAt)}
                    </div>
                    <div className="text-right font-mono text-[11px] whitespace-nowrap text-muted-foreground/60">
                      {formatDateTime(alert.receivedAt)}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t bg-slate-50/50 px-4 py-2 dark:bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Strona {data.number + 1} z {data.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  disabled={data.first || isLoading}
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                >
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                  Poprzednia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  disabled={data.last || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Następna
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <AlertVideoDialog
        alert={videoAlert}
        onClose={() => setVideoAlert(null)}
        onReviewed={handleReviewed}
      />
    </div>
  )
}
