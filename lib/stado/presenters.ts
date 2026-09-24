import { addDays } from "date-fns"
import type { TextTone, Tone } from "@/lib/theme/tone"
import type { ActiveAlert, AnimalStatusFields } from "@/lib/types/stado.types"
import type { HerdKpiData } from "@/types/herd.types"
import { pluralPl } from "@/lib/utils/plural"
import {
  daysFromToday,
  daysLabel,
  formatDayMonth,
  formatDaysAgo,
  formatHoursAgo,
  toDate,
} from "./dates"
import { AI_ALERT_TITLES, ATTENTION_TONE, EVENT_TYPE_META } from "./labels"

/**
 * Prezentery Stada — zamieniają dane z API na teksty i tony gotowe do wyświetlenia.
 * Czyste funkcje (czas „teraz" w argumencie), wspólne dla listy, agendy i karty krowy.
 */

/** Okres spoczynku po porodzie (zgodnie z backendem). */
export const VOLUNTARY_WAITING_PERIOD_DAYS = 60
export const PREGNANCY_CHECK_AFTER_DAYS = 30
const ESTRUS_RETURN_DAYS = 21
const GESTATION_DAYS = 283
const CALVING_SOON_DAYS = 14
const PREGNANCY_CHECK_LEAD_DAYS = 7

export interface Summary {
  label: string
  detail: string
  tone: TextTone
}

type StatusAnimal = AnimalStatusFields & {
  earTagNumber: string | null
  name: string | null
}

/** Linia statystyk nad listą: „128 krów · 104 w laktacji (81%) · …". */
export function herdStatsLine(kpi: HerdKpiData): string {
  const { herdSize, lactation, reproduction } = kpi
  return [
    `${herdSize.cows} ${pluralPl(herdSize.cows, "krowa", "krowy", "krów")}`,
    `${lactation.inLactation} w laktacji (${Math.round(lactation.inLactationPercentage)}%)`,
    `${lactation.dry} ${pluralPl(lactation.dry, "zasuszona", "zasuszone", "zasuszonych")}`,
    `${reproduction.pregnant} ${pluralPl(reproduction.pregnant, "cielna", "cielne", "cielnych")}`,
    `śr. DIM ${lactation.avgDim}`,
  ].join(" · ")
}

export function animalsCountLabel(count: number): string {
  return `${count} ${pluralPl(count, "zwierzę", "zwierzęta", "zwierząt")}`
}

/** Numer w stadzie — trzy ostatnie cyfry kolczyka. */
export function shortTag(earTag: string | null | undefined): string {
  if (!earTag) return "—"
  const digits = earTag.replace(/\D/g, "")
  return (digits || earTag).slice(-3)
}

export function animalDisplayName(animal: {
  name: string | null
  earTagNumber: string | null
}): string {
  return `${animal.name || "Bez imienia"} #${shortTag(animal.earTagNumber)}`
}

export function attentionDot(animal: AnimalStatusFields): {
  tone: Tone
  pulse: boolean
} {
  const level = animal.attentionLevel ?? "IDLE"
  const alert = animal.activeAlert
  return {
    tone: ATTENTION_TONE[level],
    pulse: level === "CRITICAL" || (!!alert && alert.severity !== "info"),
  }
}

export function lactationSummary(animal: AnimalStatusFields): Summary {
  switch (animal.lactationStatus) {
    case "LACTATING":
      return {
        label: `W laktacji · ${animal.lactationNumber}.`,
        detail: animal.dayInMilk != null ? `DIM ${animal.dayInMilk}` : "",
        tone: "success",
      }
    case "DRY":
      return {
        label: "Zasuszona",
        detail:
          animal.lactationNumber > 0
            ? `po ${animal.lactationNumber}. laktacji`
            : "",
        tone: "warning",
      }
    default:
      return {
        label: "—",
        detail: animal.category === "CALF" ? "odchów" : "",
        tone: "muted",
      }
  }
}

export function reproductionSummary(animal: StatusAnimal, now: Date): Summary {
  const repro = animal.reproduction
  switch (repro?.status) {
    case "PREGNANT": {
      const dryOff = animal.dryOffSuggested ? " · do zasuszenia" : ""
      const days = repro.daysToCalving
      if (days == null || !repro.expectedCalvingDate) {
        return {
          label: "Cielna",
          detail: repro.pregnancyConfirmedDate
            ? `potwierdzona ${formatDayMonth(repro.pregnancyConfirmedDate)}${dryOff}`
            : dryOff.slice(3),
          tone: animal.dryOffSuggested ? "warning" : "default",
        }
      }
      const due = formatDayMonth(repro.expectedCalvingDate)
      if (days <= CALVING_SOON_DAYS) {
        const label =
          days < 0
            ? `Poród po terminie ${daysLabel(-days)}`
            : days === 0
              ? "Poród dziś"
              : `Poród za ${daysLabel(days)}`
        return { label, detail: `termin ${due}${dryOff}`, tone: "warning" }
      }
      return {
        label: "Cielna",
        detail: `poród ${due} · za ${daysLabel(days)}${dryOff}`,
        tone: animal.dryOffSuggested ? "warning" : "default",
      }
    }
    case "ESTRUS":
      return {
        label: "Ruja — do inseminacji",
        detail: repro.lastEstrusAt
          ? `wykryta ${formatHoursAgo(repro.lastEstrusAt, now)}`
          : "",
        tone: "warning",
      }
    case "INSEMINATED": {
      const inseminated = repro.lastInseminationDate
        ? `Inseminowana ${formatDayMonth(repro.lastInseminationDate)}`
        : "Inseminowana"
      if (!repro.pregnancyCheckDate)
        return { label: inseminated, detail: "", tone: "default" }
      const due = daysFromToday(repro.pregnancyCheckDate, now)
      const detail =
        due <= 0
          ? "badanie cielności zaległe"
          : due <= PREGNANCY_CHECK_LEAD_DAYS
            ? `badanie cielności za ${daysLabel(due)}`
            : `badanie cielności ${formatDayMonth(repro.pregnancyCheckDate)}`
      return {
        label: inseminated,
        detail,
        tone: due <= PREGNANCY_CHECK_LEAD_DAYS ? "warning" : "default",
      }
    }
    case "OPEN":
      return {
        label: "Do krycia",
        detail:
          animal.category === "HEIFER"
            ? animal.ageLabel
              ? `wiek ${animal.ageLabel}`
              : ""
            : animal.dayInMilk != null
              ? `DIM ${animal.dayInMilk}`
              : "",
        tone: "default",
      }
    case "FRESH":
      return {
        label: "Po porodzie",
        detail:
          animal.dayInMilk != null
            ? `okres spoczynku, DIM ${animal.dayInMilk}`
            : "okres spoczynku",
        tone: "muted",
      }
    case "REARING":
      return { label: "Odchów", detail: "krycie od 13 mies.", tone: "muted" }
    default:
      return { label: "—", detail: "", tone: "muted" }
  }
}

function confidencePercent(confidence: number | null): string {
  return confidence == null || Number.isNaN(confidence)
    ? "—"
    : `${Math.round(confidence * 100)}%`
}

export interface AlertView {
  title: string
  description: string
  when: string
  tone: Tone
}

export function alertView(alert: ActiveAlert, now: Date): AlertView {
  const isAi = alert.source === "AI"
  return {
    title: isAi
      ? (AI_ALERT_TITLES[alert.type] ?? "Alert kamery")
      : alert.title || "Alert",
    description: isAi
      ? `pewność ${confidencePercent(alert.confidence)}, wykryte przez kamerę`
      : (alert.description ?? ""),
    when: formatHoursAgo(alert.detectedAt, now),
    tone:
      alert.severity === "red"
        ? "critical"
        : alert.severity === "amber"
          ? "warning"
          : "neutral",
  }
}

/** Kolumna „Ostatnie zdarzenie": aktywny alert ma pierwszeństwo przed historią. */
export function lastActivity(
  animal: AnimalStatusFields,
  now: Date
): { title: string; when: string } {
  if (animal.activeAlert) {
    const view = alertView(animal.activeAlert, now)
    return { title: view.title, when: view.when }
  }
  const event = animal.lastEvent
  if (!event) return { title: "—", when: "" }
  const title = event.title || EVENT_TYPE_META[event.type]?.label || event.type
  return {
    title: event.description ? `${title} · ${event.description}` : title,
    when: formatDaysAgo(event.occurredAt, now),
  }
}

export interface ReproductionStage {
  label: string
  value: string
  tone: TextTone
}

export interface ReproductionTimeline {
  startLabel: string
  endLabel: string
  /** Postęp etapu 0–100. */
  progress: number
  stages: ReproductionStage[]
  nextStep: string
}

const clampPercent = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)))

/** Karta „Rozród" — oś bieżącego etapu, cztery kroki i następna czynność. */
export function reproductionTimeline(
  animal: StatusAnimal,
  now: Date
): ReproductionTimeline {
  const repro = animal.reproduction
  const status = repro?.status ?? "NONE"

  if (status === "PREGNANT" && repro?.expectedCalvingDate) {
    const due = toDate(repro.expectedCalvingDate)
    const inseminated = repro.lastInseminationDate
      ? toDate(repro.lastInseminationDate)
      : addDays(due, -GESTATION_DAYS)
    const span = Math.max(1, daysFromToday(due, inseminated))
    const daysToCalving = daysFromToday(due, now)
    const isDry = animal.lactationStatus === "DRY"
    const dryOffDate = animal.suggestedDryOffDate
    return {
      startLabel: `Inseminacja ${formatDayMonth(inseminated)}`,
      endLabel: `Poród ${formatDayMonth(due)}`,
      progress: clampPercent(((span - daysToCalving) / span) * 100),
      stages: [
        {
          label: "Inseminacja",
          value: formatDayMonth(inseminated),
          tone: "default",
        },
        {
          label: "Cielność",
          value: repro.pregnancyConfirmedDate
            ? `potwierdzona ${formatDayMonth(repro.pregnancyConfirmedDate)}`
            : "potwierdzona",
          tone: "success",
        },
        {
          label: "Zasuszenie",
          value: isDry ? "wykonane" : formatDayMonth(dryOffDate),
          tone: animal.dryOffSuggested ? "warning" : "default",
        },
        {
          label: "Poród",
          value: formatDayMonth(due),
          tone: daysToCalving <= CALVING_SOON_DAYS ? "warning" : "default",
        },
      ],
      nextStep: isDry
        ? `przygotowanie do porodu, obserwacja od ${formatDayMonth(addDays(due, -7))}`
        : animal.dryOffSuggested
          ? `zasuszenie — termin ${formatDayMonth(dryOffDate)}${dryOffDate && daysFromToday(dryOffDate, now) < 0 ? " (zaległe)" : ""}`
          : `zasuszenie ${formatDayMonth(dryOffDate)}`,
    }
  }

  if (status === "INSEMINATED" && repro?.lastInseminationDate) {
    const inseminated = toDate(repro.lastInseminationDate)
    const check = repro.pregnancyCheckDate
      ? toDate(repro.pregnancyCheckDate)
      : addDays(inseminated, PREGNANCY_CHECK_AFTER_DAYS)
    const sinceInsemination = -daysFromToday(inseminated, now)
    const untilCheck = daysFromToday(check, now)
    return {
      startLabel: `Inseminacja ${formatDayMonth(inseminated)}`,
      endLabel: `Badanie ${formatDayMonth(check)}`,
      progress: clampPercent(
        (sinceInsemination / PREGNANCY_CHECK_AFTER_DAYS) * 100
      ),
      stages: [
        {
          label: "Ruja",
          value: formatDayMonth(repro.lastEstrusAt),
          tone: "default",
        },
        {
          label: "Inseminacja",
          value: formatDayMonth(inseminated),
          tone: "default",
        },
        {
          label: "Badanie",
          value: formatDayMonth(check),
          tone: untilCheck <= PREGNANCY_CHECK_LEAD_DAYS ? "warning" : "default",
        },
        {
          label: "Poród",
          value: repro.expectedCalvingDate
            ? `${formatDayMonth(repro.expectedCalvingDate)} (jeśli cielna)`
            : "—",
          tone: "muted",
        },
      ],
      nextStep:
        untilCheck <= 0
          ? "badanie cielności — zaległe"
          : `badanie cielności za ${daysLabel(untilCheck)}; obserwować powrót rui ok. ${formatDayMonth(addDays(inseminated, ESTRUS_RETURN_DAYS))}`,
    }
  }

  if (status === "ESTRUS") {
    return {
      startLabel: repro?.lastEstrusAt
        ? `Ruja ${formatHoursAgo(repro.lastEstrusAt, now)}`
        : "Ruja",
      endLabel: "Inseminacja w 12–18 h",
      progress: 100,
      stages: [
        {
          label: "Ruja",
          value: repro?.lastEstrusAt
            ? formatHoursAgo(repro.lastEstrusAt, now)
            : "wykryta",
          tone: "warning",
        },
        { label: "Inseminacja", value: "dziś / jutro rano", tone: "warning" },
        {
          label: "Badanie",
          value: formatDayMonth(addDays(now, PREGNANCY_CHECK_AFTER_DAYS)),
          tone: "muted",
        },
        {
          label: "Poród",
          value: formatDayMonth(addDays(now, GESTATION_DAYS)),
          tone: "muted",
        },
      ],
      nextStep: "inseminować w ciągu 12–18 h od początku rui, zapisać byka",
    }
  }

  const lactating =
    animal.lactationStatus === "LACTATING" && animal.lastCalvingDate
  const dim = animal.dayInMilk ?? 0
  const calving = lactating ? toDate(animal.lastCalvingDate!) : null
  return {
    startLabel: calving ? `Poród ${formatDayMonth(calving)}` : "Odchów",
    endLabel: calving
      ? `Krycie od ${formatDayMonth(addDays(calving, VOLUNTARY_WAITING_PERIOD_DAYS))}`
      : animal.category === "HEIFER"
        ? "Krycie od 13 mies."
        : "",
    progress: calving
      ? clampPercent((dim / VOLUNTARY_WAITING_PERIOD_DAYS) * 100)
      : 0,
    stages: [
      {
        label: "Ostatni poród",
        value: calving ? formatDayMonth(calving) : "—",
        tone: "default",
      },
      {
        label: "Okres spoczynku",
        value: calving
          ? dim >= VOLUNTARY_WAITING_PERIOD_DAYS
            ? "zakończony"
            : daysLabel(VOLUNTARY_WAITING_PERIOD_DAYS - dim)
          : "—",
        tone: "default",
      },
      {
        label: "Ruja",
        value: status === "NONE" ? "—" : "oczekiwana",
        tone: "muted",
      },
      { label: "Inseminacja", value: "—", tone: "muted" },
    ],
    nextStep:
      status === "OPEN"
        ? "obserwować ruję; brak wykrycia > 21 dni — konsultacja wet."
        : status === "FRESH"
          ? `okres spoczynku do DIM ${VOLUNTARY_WAITING_PERIOD_DAYS}`
          : status === "REARING"
            ? "krycie od 13–15 mies. przy odpowiedniej masie"
            : animal.category === "CALF"
              ? "odchów, odsadzenie wg planu"
              : "—",
  }
}
