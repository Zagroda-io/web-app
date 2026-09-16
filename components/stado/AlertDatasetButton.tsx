"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { downloadAlertDataset, saveBlobAsFile } from "@/api/alerts"
import type { AlertReviewStatus } from "@/lib/types/stado.types"

interface AlertDatasetButtonProps {
  /** Który zbiór pakujemy: potwierdzone (pozytywy) czy odrzucone (negatywy). */
  reviewStatus: Exclude<AlertReviewStatus, "PENDING">
  /** Ile zweryfikowanych alertów jest w tym zbiorze — 0 wyłącza przycisk. */
  availableCount?: number
}

/**
 * Pobranie paczki ZIP z materiałem wideo zweryfikowanych alertów.
 *
 * <p>Endpoint wymaga tokena, więc nie da się go podać jako zwykły `href` — pobieramy blob
 * przez klienta API i dopiero wtedy zapisujemy plik.</p>
 */
export function AlertDatasetButton({
  reviewStatus,
  availableCount,
}: AlertDatasetButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const nothingToDownload = availableCount === 0

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const { blob, filename } = await downloadAlertDataset({ reviewStatus })
      saveBlobAsFile(blob, filename)
      toast.success(`Pobrano paczkę treningową (${filename}).`)
    } catch (error) {
      console.error("Nie udało się pobrać paczki treningowej:", error)
      toast.error("Nie udało się pobrać paczki z materiałem wideo.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Tooltip>
      {/* Wyłączony przycisk nie emituje zdarzeń myszy — dymek zawiesiliśmy na otoczce. */}
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex rounded-md">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 text-xs"
            disabled={isDownloading || nothingToDownload}
            onClick={handleDownload}
          >
            {isDownloading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            {isDownloading ? "Pakowanie…" : "Pobierz materiał (ZIP)"}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-64">
        {datasetTooltip(reviewStatus, nothingToDownload)}
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Wyjaśnienie, czym jest paczka — w dymku, a nie na stałe w widoku, żeby nie zaśmiecać
 * listy alertów informacją potrzebną tylko przy pobieraniu.
 */
export function datasetTooltip(
  reviewStatus: Exclude<AlertReviewStatus, "PENDING">,
  nothingToDownload: boolean
): string {
  const description =
    reviewStatus === "REJECTED"
      ? "Klipy alertów oznaczonych jako fałszywe — przykłady negatywne do douczania modelu."
      : "Potwierdzone alerty zasilają materiał do douczania modelu. Pobierz ich klipy jako paczkę ZIP."
  return nothingToDownload
    ? `${description} Brak zweryfikowanych alertów z klipem do pobrania.`
    : description
}
