import { format } from "date-fns"
import type { AnimalEventType } from "@/lib/types/stado.types"

/** Formularz „Dodaj zdarzenie" i jego zamiana na żądanie POST /animals/:id/events. */
export type PregnancyResult = "POSITIVE" | "NEGATIVE"

export interface EventFormState {
  type: AnimalEventType
  /** yyyy-MM-dd */
  date: string
  note: string
  pregnancyResult: PregnancyResult
  /** Tekst z pola BCS, np. „3,25". */
  bcs: string
}

export interface EventRequest {
  type: AnimalEventType
  occurredAt?: string
  description?: string
  severity?: string
  metadata?: string
}

export const BCS_MIN = 1
export const BCS_MAX = 5

export function emptyEventForm(
  type: AnimalEventType,
  now: Date
): EventFormState {
  return {
    type,
    date: format(now, "yyyy-MM-dd"),
    note: "",
    pregnancyResult: "POSITIVE",
    bcs: "",
  }
}

export function parseBcs(value: string): number | null {
  const score = Number.parseFloat(value.replace(",", "."))
  return Number.isFinite(score) && score >= BCS_MIN && score <= BCS_MAX
    ? score
    : null
}

/** Komunikat błędu walidacji albo null, gdy formularz da się zapisać. */
export function validateEventForm(
  form: EventFormState,
  now: Date
): string | null {
  if (!form.date) return "Podaj datę zdarzenia."
  if (form.date > format(now, "yyyy-MM-dd"))
    return "Data zdarzenia nie może być z przyszłości."
  if (form.type === "BCS" && parseBcs(form.bcs) === null)
    return `Ocena BCS musi być liczbą od ${BCS_MIN} do ${BCS_MAX}.`
  return null
}

const joinParts = (...parts: (string | null | undefined)[]) =>
  parts
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(" · ") || undefined

/**
 * Zdarzenie z dzisiejszą datą zapisujemy bez godziny — backend przyjmie „teraz", więc ruja
 * zgłoszona rano liczy się od właściwego momentu. Starsze dostają południe, żeby strefa
 * czasowa nie przesunęła ich na sąsiedni dzień.
 */
export function buildEventRequest(
  form: EventFormState,
  now: Date
): EventRequest {
  const today = format(now, "yyyy-MM-dd")
  const request: EventRequest = {
    type: form.type,
    occurredAt: form.date === today ? undefined : `${form.date}T12:00:00`,
  }

  if (form.type === "PREGNANCY_CHECK") {
    request.metadata = JSON.stringify({ result: form.pregnancyResult })
    request.description = joinParts(
      form.pregnancyResult === "POSITIVE" ? "wynik: cielna" : "wynik: pusta",
      form.note
    )
    return request
  }
  if (form.type === "BCS") {
    const score = parseBcs(form.bcs)
    if (score !== null) {
      request.metadata = JSON.stringify({ score })
      request.description = joinParts(
        `BCS ${score.toFixed(2).replace(".", ",")}`,
        form.note
      )
    }
    return request
  }
  request.description = joinParts(form.note)
  return request
}
