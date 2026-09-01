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
import { getAlertVideoObjectUrl } from "@/api/alerts"
import { alertTypeMeta } from "./alert-utils"
import type { FarmAlert } from "@/lib/types/stado.types"

interface AlertVideoDialogProps {
  alert: FarmAlert | null
  onClose: () => void
}

/**
 * Dialog z odtwarzaczem klipu wideo alertu. Pobiera treść z object storage jako blob
 * (z tokenem) i odtwarza w `<video>`. Klip pobierany jest dopiero po otwarciu.
 */
export function AlertVideoDialog({ alert, onClose }: AlertVideoDialogProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!alert) return
    let objectUrl: string | null = null
    let cancelled = false

    setLoading(true)
    setError(false)
    getAlertVideoObjectUrl(alert.farmId, alert.alertId)
      .then((u) => {
        if (cancelled) {
          URL.revokeObjectURL(u)
          return
        }
        objectUrl = u
        setUrl(u)
      })
      .catch((err) => {
        console.error("Nie udało się pobrać klipu alertu:", err)
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setUrl(null)
    }
  }, [alert])

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
      </DialogContent>
    </Dialog>
  )
}
