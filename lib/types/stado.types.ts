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

/** Etap rozrodu wyliczany przez backend ze zdarzeń. */
export type ReproductionStatus =
  | "NONE"
  | "REARING"
  | "FRESH"
  | "OPEN"
  | "ESTRUS"
  | "INSEMINATED"
  | "PREGNANT"

/** Jak pilnie zwierzę wymaga uwagi — kropka statusu. */
export type AttentionLevel = "CRITICAL" | "WARNING" | "OK" | "IDLE"

/** Zadania hodowcy — szybkie filtry nad listą stada. */
export type HerdTask =
  | "ALERTS"
  | "CALVING_SOON"
  | "TO_INSEMINATE"
  | "PREGNANCY_CHECK"
  | "DRY_OFF"
  | "IN_TREATMENT"

export interface ReproductionInfo {
  status: ReproductionStatus
  lastInseminationDate: string | null
  lastEstrusAt: string | null
  pregnancyConfirmedDate: string | null
  pregnancyCheckDate: string | null
  expectedCalvingDate: string | null
  /** Dni do porodu; ujemne = po terminie. */
  daysToCalving: number | null
}

/** Najważniejszy aktywny alert — ze zdarzenia (EVENT) albo z modelu vision (AI). */
export interface ActiveAlert {
  source: "EVENT" | "AI"
  type: string
  title: string | null
  description: string | null
  severity: "red" | "amber" | "info"
  confidence: number | null
  detectedAt: string
}

export interface LastEvent {
  type: AnimalEventType
  title: string | null
  description: string | null
  occurredAt: string
}

export interface BcsReading {
  score: number
  measuredAt: string
}

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
  reproduction: ReproductionInfo | null
  attentionLevel: AttentionLevel | null
  urgency: number
  tasks: HerdTask[]
  activeAlert: ActiveAlert | null
  lastEvent: LastEvent | null
}

export interface AnimalDetails extends AnimalStatusFields {
  id: string
  name: string
  birthDate: string | null
  breed: string | null
  earTagNumber: string | null
  bookType: string | null
  sensorId: string | null
  latestBcs: BcsReading | null
  father: PedigreeAnimal | null
  mother: MotherDetails | null
  motherMother: PedigreeAnimal | null
  motherFather: PedigreeAnimal | null
  fatherMother: PedigreeAnimal | null
  fatherFather: PedigreeAnimal | null
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

/** GET /animals/herd/tasks */
export interface HerdTasks {
  total: number
  tasks: { task: HerdTask; count: number }[]
}

export type AgendaItemType =
  | "ALERT"
  | "INSEMINATION"
  | "CALVING"
  | "PREGNANCY_CHECK"
  | "DRY_OFF"
  | "TREATMENT_CHECK"

/** GET /animals/herd/agenda — `date` nigdy nie jest wcześniejsza niż dziś. */
export interface HerdAgendaItem {
  type: AgendaItemType
  date: string
  overdueDays: number
  animalId: string
  animalName: string | null
  earTagNumber: string | null
  category: AnimalCategory | null
  title: string | null
  referenceAt: string | null
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

export type AlertSeverity = "red" | "amber" | "green" | "info"

/** Typ alertu z modelu AI (topik farm.<farmKey>.alerts). */
export type FarmAlertType = "CALVING" | "ESTRUS" | "FALL" | "ANOMALY"

/**
 * Werdykt hodowcy dla alertu — etykieta materiału w zbiorze treningowym modelu vision.
 * CONFIRMED = prawdziwe wykrycie, REJECTED = fałszywy alarm, PENDING = brak decyzji.
 */
export type AlertReviewStatus = "PENDING" | "CONFIRMED" | "REJECTED"

/** Alert AI skonsumowany z Kafki — GET /api/v1/alerts. */
export interface FarmAlert {
  alertId: string
  farmId: string
  farmKey: string
  cowId: string | null // na razie brak skojarzenia ze zwierzęciem
  type: FarmAlertType | string
  detectedAt: string // ISO datetime
  confidence: number | null // 0.0–1.0
  videoRef: string | null
  hasVideo: boolean // czy istnieje wgrany klip w object storage (alert_videos)
  receivedAt: string // ISO datetime (zapis w chmurze)
  reviewStatus: AlertReviewStatus
  reviewedBy: string | null // id użytkownika, który wydał werdykt
  reviewedAt: string | null // ISO datetime
  reviewNote: string | null
}
