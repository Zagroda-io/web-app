import type {
  AlertReviewStatus,
  FarmAlert,
  PaginatedResponse,
} from "@/lib/types/stado.types"
import apiClient from "@/lib/api-client"

/**
 * Pobiera alerty AI aktywnego gospodarstwa (najnowsze najpierw).
 * GET /api/v1/alerts?page=&size=&reviewStatus=
 */
export interface GetFarmAlertsParams {
  page?: number
  size?: number
  /** Filtr werdyktu hodowcy; pominięty = wszystkie alerty. */
  reviewStatus?: AlertReviewStatus
}

export async function getFarmAlerts(
  params: GetFarmAlertsParams = {}
): Promise<PaginatedResponse<FarmAlert>> {
  const response = await apiClient.get<PaginatedResponse<FarmAlert>>(
    "/alerts",
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        // Backend traktuje brak parametru jako „bez filtra" — nie wysyłamy pustej wartości.
        ...(params.reviewStatus ? { reviewStatus: params.reviewStatus } : {}),
      },
    }
  )
  return response.data
}

/**
 * Zapisuje werdykt hodowcy dla alertu — etykietę materiału do douczania modelu vision.
 * Operacja jest odwracalna: PENDING cofa wcześniejszą decyzję.
 * PATCH /api/v1/alerts/{alertId}/review
 */
export async function reviewFarmAlert(
  alertId: string,
  status: AlertReviewStatus,
  note?: string
): Promise<FarmAlert> {
  const response = await apiClient.patch<FarmAlert>(
    `/alerts/${alertId}/review`,
    { status, note: note?.trim() || null }
  )
  return response.data
}

/** Nazwa pliku ustalona przez backend w nagłówku Content-Disposition. */
export function filenameFromContentDisposition(
  header: string | undefined,
  fallback: string
): string {
  if (!header) return fallback
  // Obsługujemy oba warianty: filename*=UTF-8''… (RFC 5987) i zwykły filename="…".
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1])
    } catch {
      return fallback
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header)
  return plain ? plain[1] : fallback
}

export interface AlertDatasetParams {
  /** Werdykt wybierający materiał; domyślnie potwierdzone (przykłady pozytywne). */
  reviewStatus?: Exclude<AlertReviewStatus, "PENDING">
  /** Maksymalna liczba klipów w paczce (backend przycina do 1000). */
  limit?: number
}

/**
 * Pobiera paczkę ZIP z materiałem wideo zweryfikowanych alertów (dane treningowe).
 * Endpoint wymaga tokena, więc zamiast linku pobieramy blob i sami go zapisujemy.
 * GET /api/v1/alerts/dataset?reviewStatus=&limit=
 */
export async function downloadAlertDataset(
  params: AlertDatasetParams = {}
): Promise<{ blob: Blob; filename: string }> {
  const reviewStatus = params.reviewStatus ?? "CONFIRMED"
  const response = await apiClient.get("/alerts/dataset", {
    params: {
      reviewStatus,
      ...(params.limit ? { limit: params.limit } : {}),
    },
    responseType: "blob",
  })
  return {
    blob: response.data as Blob,
    filename: filenameFromContentDisposition(
      response.headers?.["content-disposition"] as string | undefined,
      `zagroda-dataset-${reviewStatus.toLowerCase()}.zip`
    ),
  }
}

/** Zapisuje pobrany blob na dysk użytkownika (klik w niewidzialny link). */
export function saveBlobAsFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/**
 * Pobiera treść klipu wideo alertu jako obiekt URL (blob) do odtworzenia w `<video>`.
 * Endpoint wymaga tokena (interceptor apiClient go dołącza), więc nie da się użyć
 * bezpośrednio `<video src>` — pobieramy blob i tworzymy lokalny URL.
 * GET /api/v1/farms/{farmId}/alerts/{alertId}/video/content
 *
 * Wołający odpowiada za zwolnienie URL (`URL.revokeObjectURL`) po zamknięciu odtwarzacza.
 */
export async function getAlertVideoObjectUrl(
  farmId: string,
  alertId: string
): Promise<string> {
  const response = await apiClient.get(
    `/farms/${farmId}/alerts/${alertId}/video/content`,
    { responseType: "blob" }
  )
  return URL.createObjectURL(response.data as Blob)
}
