export type Sex = "FEMALE" | "MALE"

export type AnimalCategory = "CALF" | "HEIFER" | "COW" | "BULL"

export type LactationStatus = "LACTATING" | "DRY" | "NONE"

export type AnimalEventType =
  | "CALVING"
  | "DRY_OFF"
  | "INSEMINATION"
  | "PREGNANCY_CHECK"
  | "ESTRUS"
  | "VET"
  | "ALERT"
  | "BCS"
  | "NOTE"

/** Pola statusowe / wyliczane wspólne dla listy i szczegółów zwierzęcia. */
export interface AnimalStatusFields {
  sex: Sex | null
  category: AnimalCategory | null
  lactationStatus: LactationStatus | null
  lactationNumber: number
  dayInMilk: number | null
  ageLabel: string | null
  dryOffSuggested: boolean
  suggestedDryOffDate: string | null
  lastCalvingDate: string | null
  expectedCalvingDate: string | null
}

export interface AnimalDetails extends AnimalStatusFields {
  id: string
  name: string
  birthDate: string | null
  breed: string | null
  earTagNumber: string | null
  bookType: string | null
  sensorId: string | null
  father: PedigreeAnimal | null
  mother: MotherDetails | null
  ff: PedigreeAnimal | null
  fm: PedigreeAnimal | null
}

/** Zdarzenie zwierzęcia zwracane przez backend (AnimalEventDto). */
export interface AnimalEvent {
  id: string
  animalId: string
  animalName: string | null
  earTagNumber: string | null
  type: AnimalEventType
  title: string | null
  description: string | null
  severity: string | null
  occurredAt: string
  metadata: string | null
}

export interface PedigreeAnimal {
  name: string | null
  birthDate: string | null
  breed: string | null
  earTagNumber: string | null
  bookType: string | null
}

export interface MotherDetails extends PedigreeAnimal {
  efficiency: string | null
  lactation: string | null
  offspring: string | null
  grandmotherLactations: string | null
  father: PedigreeAnimal | null
  mother: PedigreeAnimal | null
}

export interface Animal extends AnimalStatusFields {
  id: string
  name: string
  birthDate: string
  breed: string
  earTagNumber: string
  bookType: string
  sensorId: string | null
}

export interface PaginatedResponse<T> {
  content: T[]
  first: boolean
  last: boolean
  number: number
  size: number
  totalElements: number
  totalPages: number
}

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
  severity: AlertSeverity | "neutral"
  title: string
  description: string
  occurredAt: string // ISO datetime lub opis relatywny z backendu
  hasClip?: boolean // czy dostępny jest klip wideo 10s
  clipUrl?: string
  details?: CowAlert["details"]
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
  cowId: string
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
