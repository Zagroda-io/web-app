export interface HerdSize {
  total: number
  cows: number
  heifers: number
  calves: number
  bulls: number
}

export interface LactationStats {
  inLactation: number
  inLactationPercentage: number
  dry: number
  avgDim: number
}

export interface ReproductionStats {
  pregnant: number
  conceptionRate: number
  waitingForInsemination: number
  overdueCount: number // For the warning badge
}

export interface UpcomingCalving {
  id: string
  tagNumber: string
  name: string
  date: string
  daysToCalving: number
}

export interface HerdKpiData {
  herdSize: HerdSize
  lactation: LactationStats
  reproduction: ReproductionStats
  upcomingCalvings: UpcomingCalving[]
}
