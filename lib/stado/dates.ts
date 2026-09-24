import {
  differenceInCalendarDays,
  differenceInHours,
  format,
  isValid,
  parseISO,
} from "date-fns"
import { pl } from "date-fns/locale"
import { pluralPl } from "@/lib/utils/plural"

/**
 * Daty w widokach stada. Backend zwraca LocalDate/LocalDateTime bez strefy — parseISO
 * czyta je jako czas lokalny, czyli tak, jak zapisał je hodowca.
 */
export type DateInput = string | Date

export function toDate(value: DateInput): Date {
  return typeof value === "string" ? parseISO(value) : value
}

function valid(value: DateInput | null | undefined): Date | null {
  if (value === null || value === undefined) return null
  const date = toDate(value)
  return isValid(date) ? date : null
}

/** „17.09" */
export function formatDayMonth(value: DateInput | null | undefined): string {
  const date = valid(value)
  return date ? format(date, "dd.MM") : "—"
}

/** „17.09.2026" */
export function formatDate(value: DateInput | null | undefined): string {
  const date = valid(value)
  return date ? format(date, "dd.MM.yyyy") : "—"
}

/** „środa, 17 września" */
export function formatWeekdayLong(now: Date): string {
  return format(now, "EEEE, d MMMM", { locale: pl })
}

/** Dni kalendarzowe od dziś do daty (ujemne = w przeszłości). */
export function daysFromToday(value: DateInput, now: Date): number {
  return differenceInCalendarDays(toDate(value), now)
}

export function daysLabel(days: number): string {
  return `${days} ${pluralPl(days, "dzień", "dni", "dni")}`
}

/** „dziś", „wczoraj", „5 dni temu", „3 mies. temu", „1,5 r. temu" — dla zdarzeń z datą dzienną. */
export function formatDaysAgo(
  value: DateInput | null | undefined,
  now: Date
): string {
  const date = valid(value)
  if (!date) return ""
  const days = Math.max(0, -differenceInCalendarDays(date, now))
  if (days === 0) return "dziś"
  if (days === 1) return "wczoraj"
  if (days < 30) return `${days} dni temu`
  if (days < 365) return `${Math.round(days / 30)} mies. temu`
  return `${(days / 365).toFixed(1).replace(".", ",")} r. temu`
}

/** „przed chwilą", „ok. 5 h temu", a powyżej doby jak {@link formatDaysAgo} — dla alertów. */
export function formatHoursAgo(
  value: DateInput | null | undefined,
  now: Date
): string {
  const date = valid(value)
  if (!date) return ""
  const hours = differenceInHours(now, date)
  if (hours < 1) return "przed chwilą"
  if (hours < 24) return `ok. ${hours} h temu`
  return formatDaysAgo(date, now)
}
