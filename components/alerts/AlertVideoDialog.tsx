"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getAlertVideoObjectUrl } from "@/lib/api/alerts"
import { AlertReviewControls } from "./AlertReviewControls"
import { alertTypeMeta } from "./alert-utils"
import type { FarmAlert } from "@/lib/types/stado.types"

interface AlertVideoDialogProps {
  alert: FarmAlert | null
  onClose: () => void
  /** Werdykt wydany pod odtwarzaczem — rodzic aktualizuje listę alertów. */
  onReviewed?: (alert: FarmAlert) => void
}

/**
 * Dialog z odtwarzaczem klipu wideo alertu. Pobiera treść z object storage jako blob
 * (z tokenem) i odtwarza w `<video>`. Klip pobierany jest dopiero po otwarciu.
 *
 * <p>Werdykt hodowcy jest tuż pod odtwarzaczem — to moment, w którym człowiek faktycznie
 * widzi nagranie i może ocenić, czy model trafił.</p>
 */
export function AlertVideoDialog({
  alert,
  onClose,
  onReviewed,
}: AlertVideoDialogProps) {
  // Wynik pobierania jest przypięty do alertu, dla którego powstał — klip poprzedniego
  // alertu nigdy nie mignie w oknie następnego, a „ładowanie” wynika z braku wyniku.
  const [clip, setClip] = useState<{
    alertId: string
    url: string | null
  } | null>(null)

  useEffect(() => {
    if (!alert) return
    const { farmId, alertId } = alert
    let objectUrl: string | null = null
    let cancelled = false

    getAlertVideoObjectUrl(farmId, alertId)
      .then((u) => {
        if (cancelled) {
          URL.revokeObjectURL(u)
          return
        }
        objectUrl = u
        setClip({ alertId, url: u })
      })
      .catch((err) => {
        console.error("Nie udało się pobrać klipu alertu:", err)
        if (!cancelled) setClip({ alertId, url: null })
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [alert])

  const current = alert && clip?.alertId === alert.alertId ? clip : null
  const loading = !!alert && !current
  const error = !!current && current.url === null
  const url = current?.url ?? null

  const meta = alert ? alertTypeMeta(alert.type) : null

  return (
    <Dialog open={!!alert} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Klip alertu{meta ? ` — ${meta.label}` : ""}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {alert ? alert.alertId : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-md bg-black">
          {loading && (
            <div className="flex flex-col items-center gap-2 text-white/70">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs">Ładowanie klipu…</span>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center gap-2 p-6 text-center text-white/70">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <span className="text-xs">Nie udało się pobrać klipu.</span>
            </div>
          )}
          {url && !error && (
            <video
              src={url}
              controls
              autoPlay
              className="max-h-[70vh] w-full"
            />
          )}
        </div>

        {alert && onReviewed && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Czy model trafił? Werdykt etykietuje ten klip w materiale treningowym.
            </p>
            <AlertReviewControls alert={alert} onReviewed={onReviewed} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
