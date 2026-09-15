"use client"

import { useState } from "react"
import { Check, Loader2, RotateCcw, X } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { reviewFarmAlert } from "@/api/alerts"
import { reviewStatusMeta } from "./alert-utils"
import type { AlertReviewStatus, FarmAlert } from "@/lib/types/stado.types"

interface AlertReviewControlsProps {
  alert: FarmAlert
  /** Wywoływane po zapisaniu werdyktu — rodzic podmienia alert na wersję z backendu. */
  onReviewed: (alert: FarmAlert) => void
  className?: string
}

/**
 * Potwierdzenie albo odrzucenie alertu przez hodowcę.
 *
 * <p>Decyzja jest etykietą materiału wideo w zbiorze treningowym modelu vision, dlatego
 * zawsze da się ją cofnąć — pochopne „potwierdzam" zatruwałoby dane. Zapis idzie od razu
 * (bez osobnego „Zapisz"), a stan bierzemy z odpowiedzi backendu, nie z optymistycznego
 * zgadywania.</p>
 */
export function AlertReviewControls({
  alert,
  onReviewed,
  className,
}: AlertReviewControlsProps) {
  const [pendingStatus, setPendingStatus] = useState<AlertReviewStatus | null>(
    null
  )
  const meta = reviewStatusMeta(alert.reviewStatus)

  const submit = async (status: AlertReviewStatus) => {
    setPendingStatus(status)
    try {
      const updated = await reviewFarmAlert(alert.alertId, status)
      onReviewed(updated)
      toast.success(
        status === "CONFIRMED"
          ? "Alert potwierdzony — klip trafi do paczki treningowej."
          : status === "REJECTED"
            ? "Alert oznaczony jako fałszywy alarm."
            : "Cofnięto weryfikację alertu."
      )
    } catch (error) {
      console.error("Nie udało się zapisać weryfikacji alertu:", error)
      toast.error("Nie udało się zapisać weryfikacji. Spróbuj ponownie.")
    } finally {
      setPendingStatus(null)
    }
  }

  const busy = pendingStatus !== null

  if (alert.reviewStatus === "PENDING") {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <Button
          variant="outline"
          size="sm"
          className="h-6 gap-1 px-2 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
          disabled={busy}
          onClick={() => submit("CONFIRMED")}
          title="Alert prawdziwy — dodaj klip do materiału treningowego"
        >
          {pendingStatus === "CONFIRMED" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
          Prawdziwy
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-6 gap-1 px-2 text-[10px] font-semibold text-muted-foreground hover:bg-slate-50 dark:hover:bg-muted/40"
          disabled={busy}
          onClick={() => submit("REJECTED")}
          title="Fałszywy alarm — oznacz jako przykład negatywny"
        >
          {pendingStatus === "REJECTED" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <X className="h-3 w-3" />
          )}
          Fałszywy
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Badge
        variant="outline"
        className={cn("px-1.5 py-0 text-[10px] font-bold uppercase", meta.badgeClass)}
        title={meta.description}
      >
        {meta.label}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground"
        disabled={busy}
        onClick={() => submit("PENDING")}
        title="Cofnij weryfikację"
      >
        {pendingStatus === "PENDING" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <RotateCcw className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}
