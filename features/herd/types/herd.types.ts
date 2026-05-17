export interface HerdSize {
  total: number
  cows: number // dorosłe samice
  calves: number // cielęta (< 6 miesięcy)
  bulls: number // byki
}

export interface LactationStats {
  inLactation: number // krowy w laktacji
  totalCows: number // potrzebne do obliczenia %
  driedOff: number // zasuszone
  averageDim: number // średnie dni od ocielenia (Days In Milk)
}

export interface ReproductionStats {
  pregnant: number // w ciąży (potwierdzone)
  conceptionRate: number // skuteczność krycia w % (ostatnie 90 dni)
  awaitingInsemination: number // oczekują zacielenienia
  overdueInsemination: number // przeterminowane (podgrupa awaitingInsemination)
}

export interface UpcomingCalving {
  id: string
  earTagId: string // numer kolczyka, np. "PL-005"
  name: string // imię krowy
  estimatedDate: string // ISO date string, np. "2026-05-15"
  daysUntil: number // obliczone po stronie API lub w utils
}

export interface HerdKpiData {
  herdSize: HerdSize
  lactation: LactationStats
  reproduction: ReproductionStats
  upcomingCalvings: UpcomingCalving[] // tylko najbliższe ~5
}
