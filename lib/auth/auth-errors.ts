import { isAxiosError } from "axios"

/**
 * Komunikaty błędów logowania i rejestracji — te same co w aplikacji mobilnej
 * (mobile-app/src/lib/auth-errors.ts).
 */
const OFFLINE =
  "Nie możemy połączyć się z serwerem. Sprawdź internet i spróbuj ponownie."
const GENERIC = "Coś poszło nie tak. Spróbuj ponownie za chwilę."

/** Status odpowiedzi; `null` — brak odpowiedzi (sieć), `undefined` — nie błąd HTTP. */
function httpStatus(error: unknown): number | null | undefined {
  if (!isAxiosError(error)) return undefined
  return error.response?.status ?? null
}

/** Pole `detail` z odpowiedzi problem+json — komunikat pisany dla użytkownika. */
function problemDetail(error: unknown): string | null {
  if (!isAxiosError(error)) return null
  const detail = (error.response?.data as { detail?: unknown } | undefined)
    ?.detail
  return typeof detail === "string" && detail.trim() ? detail : null
}

/**
 * Złe dane logowania dają 401. Nieaktywne konto (niepotwierdzony e-mail) — 403 z opisem,
 * a w starszym core-api 500 bez opisu.
 */
export function loginErrorMessage(error: unknown): string {
  const status = httpStatus(error)
  if (status === undefined) return GENERIC
  if (status === null) return OFFLINE
  if (status === 403) {
    return problemDetail(error) ?? "Nieprawidłowy e-mail lub hasło."
  }
  if (status === 401) return "Nieprawidłowy e-mail lub hasło."
  return "Nie udało się zalogować. Jeśli konto jest nowe, najpierw potwierdź adres e-mail linkiem z wiadomości od nas."
}

export function registerErrorMessage(error: unknown): string {
  const status = httpStatus(error)
  if (status === undefined) return GENERIC
  if (status === null) return OFFLINE
  return "Nie udało się założyć konta. Jeśli masz już konto na ten adres e-mail, zaloguj się."
}

export function smsErrorMessage(
  error: unknown,
  step: "request" | "verify"
): string {
  const status = httpStatus(error)
  if (status === undefined) return GENERIC
  if (status === null) return OFFLINE
  // Endpointów OTP jeszcze nie ma w core-api — Spring odpowiada wtedy 401/403/404/501.
  if (step === "request" && [401, 403, 404, 501].includes(status)) {
    return "Logowanie kodem SMS jeszcze nie działa. Na razie zaloguj się e-mailem i hasłem."
  }
  if (step === "verify" && (status === 400 || status === 401)) {
    return "Kod jest nieprawidłowy albo wygasł. Sprawdź SMS lub wyślij nowy kod."
  }
  return GENERIC
}
