"use client"

import { useState, type FormEvent } from "react"
import { AlertCircle, Loader2, QrCode } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { activateSensor } from "@/lib/api/sensors"
import { apiErrorMessage } from "@/lib/api-error"
import type { FarmSensor } from "@/lib/types/sensor.types"
import { formatDevEui } from "./sensor-utils"

interface ActivateSensorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Wywoływane z czujnikiem po aktywacji — rodzic dokłada go do puli. */
  onActivated: (sensor: FarmSensor) => void
}

/**
 * Aktywacja zakupionego czujnika w gospodarstwie.
 *
 * Web-app przyjmuje DevEUI i kod aktywacyjny wpisane z etykiety. Aplikacja mobilna odczyta
 * te same dwie wartości z kodu QR / NFC i wyśle je na ten sam endpoint — ten dialog jest
 * ręcznym odpowiednikiem skanu.
 */
export function ActivateSensorDialog({
  open,
  onOpenChange,
  onActivated,
}: ActivateSensorDialogProps) {
  const [devEui, setDevEui] = useState("")
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setDevEui("")
    setCode("")
    setError(null)
    setIsSubmitting(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const sensor = await activateSensor(devEui, code)
      toast.success(`Czujnik ${formatDevEui(sensor.devEui)} jest w Twoim gospodarstwie.`)
      onActivated(sensor)
      handleOpenChange(false)
    } catch (err) {
      console.error("Nie udało się aktywować czujnika:", err)
      setError(
        apiErrorMessage(err, "Nie udało się aktywować czujnika. Spróbuj ponownie.")
      )
      setIsSubmitting(false)
    }
  }

  const canSubmit = devEui.trim() !== "" && code.trim() !== "" && !isSubmitting

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Aktywuj czujnik</DialogTitle>
            <DialogDescription>
              Przepisz dane z etykiety na czujniku. Po aktywacji czujnik trafi do
              puli gospodarstwa i przypiszesz go do krowy.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="sensor-dev-eui">DevEUI</Label>
            <Input
              id="sensor-dev-eui"
              placeholder="00:80:E1:15:06:1B:F5:35"
              autoComplete="off"
              spellCheck={false}
              className="font-mono"
              value={devEui}
              onChange={(e) => setDevEui(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sensor-activation-code">Kod aktywacyjny</Label>
            <Input
              id="sensor-activation-code"
              placeholder="XXXXX-XXXXX"
              autoComplete="off"
              spellCheck={false}
              className="font-mono uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <QrCode className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            W aplikacji mobilnej oba pola uzupełni skan kodu QR lub NFC z czujnika.
          </p>

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
            >
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={!canSubmit} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Aktywuj
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
