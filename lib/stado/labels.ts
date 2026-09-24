import type { Tone } from "@/lib/theme/tone"
import type {
  AgendaItemType,
  AnimalCategory,
  AnimalEventType,
  AttentionLevel,
  HerdTask,
  LactationStatus,
} from "@/lib/types/stado.types"

/** Słownik domeny Stada: etykiety i tony w jednym miejscu dla listy, karty krowy i dialogów. */

export const CATEGORY_META: Record<
  AnimalCategory,
  { label: string; plural: string; tone: Tone }
> = {
  COW: { label: "Krowa", plural: "Krowy", tone: "success" },
  HEIFER: { label: "Jałówka", plural: "Jałówki", tone: "accent" },
  CALF: { label: "Cielę", plural: "Cielęta", tone: "info" },
  BULL: { label: "Byk", plural: "Byki", tone: "neutral" },
}

export const CATEGORY_ORDER: AnimalCategory[] = [
  "COW",
  "HEIFER",
  "CALF",
  "BULL",
]

export const LACTATION_OPTIONS: { value: LactationStatus; label: string }[] = [
  { value: "LACTATING", label: "W laktacji" },
  { value: "DRY", label: "Zasuszone" },
  { value: "NONE", label: "Bez laktacji" },
]

export const BREED_LABELS: Record<string, string> = {
  HO: "Holsztyno-fryzyjska",
  RW: "Polska czerwono-biała",
  JE: "Jersey",
  SI: "Simentalska",
  SM: "Simentalska",
  ZB: "Polska czarno-biała",
}

export function breedLabel(breed: string | null | undefined): string {
  if (!breed) return "—"
  return BREED_LABELS[breed] ?? breed
}

export interface EventTypeMeta {
  label: string
  tone: Tone
  /** Co zdarzenie zmienia w statusie zwierzęcia. */
  hint?: string
}

export const EVENT_TYPE_META: Record<AnimalEventType, EventTypeMeta> = {
  CALVING: {
    label: "Poród",
    tone: "success",
    hint: "Ustawia status: w laktacji",
  },
  DRY_OFF: {
    label: "Zasuszenie",
    tone: "warning",
    hint: "Ustawia status: zasuszona",
  },
  INSEMINATION: {
    label: "Inseminacja",
    tone: "accent",
    hint: "Wyznacza przewidywane wycielenie",
  },
  PREGNANCY_CHECK: {
    label: "Badanie cielności",
    tone: "info",
    hint: "Wynik „pusta” usuwa termin porodu",
  },
  ESTRUS: {
    label: "Ruja",
    tone: "warning",
    hint: "Oznacza krowę do inseminacji na 48 h",
  },
  VET: { label: "Leczenie", tone: "critical" },
  ALERT: { label: "Alert", tone: "critical" },
  BCS: { label: "BCS", tone: "neutral" },
  NOTE: { label: "Notatka", tone: "neutral" },
}

/** Typy, które hodowca może dodać ręcznie (ALERT tworzy system). */
export const MANUAL_EVENT_TYPES: AnimalEventType[] = [
  "CALVING",
  "DRY_OFF",
  "INSEMINATION",
  "PREGNANCY_CHECK",
  "ESTRUS",
  "VET",
  "BCS",
  "NOTE",
]

export const TASK_META: Record<HerdTask, { label: string; tone: Tone }> = {
  ALERTS: { label: "alerty", tone: "critical" },
  CALVING_SOON: { label: "porody ≤ 14 dni", tone: "warning" },
  TO_INSEMINATE: { label: "do inseminacji", tone: "accent" },
  PREGNANCY_CHECK: { label: "badanie cielności", tone: "info" },
  DRY_OFF: { label: "do zasuszenia", tone: "warning" },
  IN_TREATMENT: { label: "w leczeniu", tone: "critical" },
}

export const TASK_ORDER: HerdTask[] = [
  "ALERTS",
  "CALVING_SOON",
  "TO_INSEMINATE",
  "PREGNANCY_CHECK",
  "DRY_OFF",
  "IN_TREATMENT",
]

export const AGENDA_META: Record<AgendaItemType, { kind: string; tone: Tone }> =
  {
    ALERT: { kind: "alert", tone: "critical" },
    INSEMINATION: { kind: "ruja", tone: "warning" },
    CALVING: { kind: "poród", tone: "success" },
    PREGNANCY_CHECK: { kind: "badanie", tone: "info" },
    DRY_OFF: { kind: "zasusz.", tone: "warning" },
    TREATMENT_CHECK: { kind: "leczenie", tone: "critical" },
  }

export const ATTENTION_TONE: Record<AttentionLevel, Tone> = {
  CRITICAL: "critical",
  WARNING: "warning",
  OK: "success",
  IDLE: "neutral",
}

export const ATTENTION_LABEL: Record<AttentionLevel, string> = {
  CRITICAL: "Wymaga pilnej uwagi",
  WARNING: "Zadanie w najbliższych dniach",
  OK: "W laktacji, bez zadań",
  IDLE: "Bez zadań",
}

/** Tytuły alertów modelu vision — opis uzupełnia pewność modelu. */
export const AI_ALERT_TITLES: Record<string, string> = {
  ESTRUS: "Wykryto ruję",
  CALVING: "Wykryto poród",
  FALL: "Wykryto upadek",
  ANOMALY: "Nietypowe zachowanie",
}
