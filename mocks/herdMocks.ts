import { HerdKpiData } from "../types/herd.types"

export const mockHerdKpiData: HerdKpiData = {
  herdSize: {
    total: 142,
    cows: 98,
    calves: 30,
    bulls: 14,
  },
  lactation: {
    inLactation: 71,
    inLactationPercentage: 72.4,
    dry: 27,
    avgDim: 168,
  },
  reproduction: {
    pregnant: 27,
    conceptionRate: 62,
    waitingForInsemination: 15,
    overdueCount: 4,
  },
  upcomingCalvings: [
    {
      id: "1",
      tagNumber: "PL005123456789",
      name: "Berta",
      date: "2026-05-14",
      daysToCalving: 1,
    },
    {
      id: "2",
      tagNumber: "PL005123456123",
      name: "Malina",
      date: "2026-05-18",
      daysToCalving: 5,
    },
    {
      id: "3",
      tagNumber: "PL005123456456",
      name: "Gwiazda",
      date: "2026-05-25",
      daysToCalving: 12,
    },
  ],
}
