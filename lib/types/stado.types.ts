export type CowStatus = "alert" | "warn" | "ok" | "dry"

export type AlertSeverity = "red" | "amber" | "green" | "info"

export type EventCategory = "alert" | "wet" | "ins" | "other"

export interface CowAlert {
  id: string
  severity: AlertSeverity // 'red' | 'amber'
  title: string
  description: string
  detectedAt: string // ISO datetime
  details?: {
    metric?: string
    value?: string
    recommendation?: string
    analysis?: string
    predictionData?: {
      label: string
      value: number
      color: string
    }[]
    entities?: {
      match: number
      type: string
      id: string
      subType: string
    }[]
  }
}

export interface CowSire {
  identifier: string // np. "HOLANDIA-082" lub "NIEMCY-441"
  name: string // imię byka
  whIndex?: string // wskaźnik hodowlany, np. "WH 3121"
}

export interface CowDam {
  identifier: string // numer kolczyka lub ID z systemu
  name: string
  note?: string // np. "Lac. 5" lub "Brak w stadzie"
  cowId?: number // jeśli dostępny w stadzie — link do profilu
}

export interface CowOffspring {
  id: string
  cowId?: number // jeśli cielę jest w stadzie
  earTagNumber: string // numer kolczyka cielęcia
  name?: string
  sex: "male" | "female"
  birthDate: string // ISO date
  status: string // np. "Stado — laktacja 1" | "Sprzedany" | "Odchów"
}

export interface CowEvent {
  id: string
  category: EventCategory
  severity: "red" | "amber" | "green" | "info" | "neutral"
  title: string
  description: string
  occurredAt: string // ISO datetime lub opis relatywny z backendu
  hasClip?: boolean // czy dostępny jest klip wideo 10s
  clipUrl?: string
}

export interface CowYieldDay {
  date: string // ISO date
  liters: number
}

export interface CowActivityDay {
  dayLabel: string // "Pon" | "Wt" itd.
  activityIndex: number // wartość względna, baseline ~100
}

export interface Cow {
  id: number
  earTagNumber: string // pełny numer kolczyka PL
  name: string
  breed: string // np. "HO" (Holstein-Friesian)
  birthDate: string // ISO date
  ageLabel: string // sformatowany przez backend, np. "5 lat 3 m-ce"
  lactationNumber: number
  status: CowStatus
  yieldToday: number // litry, 0 jeśli zasuszenie
  yieldMax: number // maksymalna dzienna wydajność (do skali minibar)
  bcs: number // 1.00–5.00
  lastAlertLabel: string // krótki opis ostatniego alertu lub "—"
  activeAlerts: CowAlert[]
  sire: CowSire
  dam: CowDam
  offspring: CowOffspring[]
  yieldHistory: CowYieldDay[] // ostatnie 14 dni
  activityHistory: CowActivityDay[] // ostatnie 7 dni
  events: CowEvent[]
}

export interface HerdSummary {
  totalCows: number
  activeAlertCount: number
  plannedInseminationCount: number
  lastSyncAt: string // ISO datetime
}

export type FeedEventCategory =
  | "alert"
  | "estrus"
  | "yield"
  | "dry"
  | "vet"
  | "insemination"
  | "info"

export interface FeedEvent {
  id: string
  cowId: number
  cowName: string
  earTagShort: string // tylko numer, np. "034"
  severity: AlertSeverity
  category: FeedEventCategory
  categoryLabel: string // np. "Alert" | "Estrus" | "Zasuszenie"
  title: string
  description: string
  occurredAt: string // ISO datetime
  details?: CowAlert["details"]
}

export type CowStatusFilter = "all" | "alert" | "warn" | "ok"
