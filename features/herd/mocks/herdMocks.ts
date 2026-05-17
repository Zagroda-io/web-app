import { HerdKpiData } from "../types/herd.types"

export const mockHerdKpiData: HerdKpiData = {
  herdSize: {
    total: 142,
    cows: 98,
    calves: 31,
    bulls: 13,
  },
  lactation: {
    inLactation: 71,
    totalCows: 98,
    driedOff: 12,
    averageDim: 124,
  },
  reproduction: {
    pregnant: 27,
    conceptionRate: 62,
    awaitingInsemination: 18,
    overdueInsemination: 6,
  },
  upcomingCalvings: [
    {
      id: "calving-1",
      earTagId: "PL-005",
      name: "Basia",
      estimatedDate: "2026-05-15",
      daysUntil: 2,
    },
    {
      id: "calving-2",
      earTagId: "PL-041",
      name: "Kama",
      estimatedDate: "2026-05-18",
      daysUntil: 5,
    },
    {
      id: "calving-3",
      earTagId: "PL-019",
      name: "Marta",
      estimatedDate: "2026-05-24",
      daysUntil: 11,
    },
  ],
}
