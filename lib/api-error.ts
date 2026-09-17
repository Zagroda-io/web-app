import { isAxiosError } from "axios"

/**
 * Komunikat błędu z odpowiedzi API do pokazania użytkownikowi.
 *
 * Backend zwraca błędy jako RFC 9457 (`application/problem+json`); pole `detail` niesie
 * powód napisany dla człowieka, np. „Czujnik … jest już przypisany do krowy Mućka".
 * Gdy go brak (błąd sieci, 500), zostaje komunikat zapasowy wołającego.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)
      ?.detail
    if (typeof detail === "string" && detail.trim()) {
      return detail
    }
  }
  return fallback
}
