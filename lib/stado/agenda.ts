import { addDays } from "date-fns"
import type { Tone } from "@/lib/theme/tone"
import type { HerdAgendaItem } from "@/lib/types/stado.types"
import {
  daysFromToday,
  daysLabel,
  formatDayMonth,
  formatHoursAgo,
} from "./dates"
import { AGENDA_META } from "./labels"
import { animalDisplayName } from "./presenters"

export interface AgendaEntryView {
  key: string
  animalId: string
  title: string
  subject: string
  kind: string
  tone: Tone
}

export interface AgendaGroupView {
  label: string
  dateLabel: string
  entries: AgendaEntryView[]
}

const GROUPS: { label: string; from: number; to: number }[] = [
  { label: "Dziś", from: 0, to: 0 },
  { label: "Jutro", from: 1, to: 1 },
  { label: "Ten tydzień", from: 2, to: 7 },
  { label: "Za tydzień", from: 8, to: 14 },
  { label: "Później", from: 15, to: Number.POSITIVE_INFINITY },
]

export function agendaItemTitle(item: HerdAgendaItem, now: Date): string {
  const overdue = item.overdueDays > 0
  switch (item.type) {
    case "ALERT":
      return item.title || "Alert"
    case "INSEMINATION":
      return item.referenceAt
        ? `Inseminacja — ruja ${formatHoursAgo(item.referenceAt, now)}`
        : "Inseminacja — ruja"
    case "CALVING":
      return overdue
        ? `Poród — po terminie ${daysLabel(item.overdueDays)}`
        : "Spodziewany poród"
    case "PREGNANCY_CHECK":
      return overdue ? "Badanie cielności — zaległe" : "Badanie cielności"
    case "DRY_OFF":
      return overdue
        ? `Zasuszenie — zaległe o ${daysLabel(item.overdueDays)}`
        : "Zasuszenie"
    case "TREATMENT_CHECK":
      return "Kontrola leczenia"
  }
}

function subject(item: HerdAgendaItem): string {
  const who = animalDisplayName({
    name: item.animalName,
    earTagNumber: item.earTagNumber,
  })
  return item.type === "CALVING" && item.category === "HEIFER"
    ? `${who} · pierwiastka`
    : who
}

/** Grupuje agendę w „Dziś / Jutro / Ten tydzień / Za tydzień"; puste grupy są pomijane. */
export function groupAgenda(
  items: HerdAgendaItem[],
  now: Date
): AgendaGroupView[] {
  return GROUPS.map((group) => {
    const entries = items
      .filter((item) => {
        const day = Math.max(0, daysFromToday(item.date, now))
        return day >= group.from && day <= group.to
      })
      .map((item, index) => ({
        key: `${item.animalId}-${item.type}-${index}`,
        animalId: item.animalId,
        title: agendaItemTitle(item, now),
        subject: subject(item),
        kind: AGENDA_META[item.type].kind,
        tone: AGENDA_META[item.type].tone,
      }))
    const dateLabel =
      group.from === group.to
        ? formatDayMonth(addDays(now, group.from))
        : Number.isFinite(group.to)
          ? `${formatDayMonth(addDays(now, group.from))} – ${formatDayMonth(addDays(now, group.to))}`
          : `od ${formatDayMonth(addDays(now, group.from))}`
    return { label: group.label, dateLabel, entries }
  }).filter((group) => group.entries.length > 0)
}
