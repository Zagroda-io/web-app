export interface DailyMilkYield {
  date: string
  yield: number
  hasData: boolean
}

export interface MilkYieldData {
  currentYield: number
  difference: number
  history: DailyMilkYield[]
}

export const milkYieldMock: MilkYieldData = {
  currentYield: 3842,
  difference: 124,
  history: [
    { date: "2026-04-14", yield: 3700, hasData: true },
    { date: "2026-04-15", yield: 3750, hasData: true },
    { date: "2026-04-16", yield: 3800, hasData: true },
    { date: "2026-04-17", yield: 3720, hasData: true },
    { date: "2026-04-18", yield: 3650, hasData: true },
    { date: "2026-04-19", yield: 3600, hasData: true },
    { date: "2026-04-20", yield: 3780, hasData: true },
    { date: "2026-04-21", yield: 3820, hasData: true },
    { date: "2026-04-22", yield: 0, hasData: false },
    { date: "2026-04-23", yield: 3850, hasData: true },
    { date: "2026-04-24", yield: 3900, hasData: true },
    { date: "2026-04-25", yield: 3880, hasData: true },
    { date: "2026-04-26", yield: 3860, hasData: true },
    { date: "2026-04-27", yield: 3842, hasData: true },
  ],
}

export const milkYieldEmptyMock: MilkYieldData = {
  currentYield: 0,
  difference: 0,
  history: Array.from({ length: 14 }, (_, i) => ({
    date: `2026-04-${14 + i}`,
    yield: 0,
    hasData: false,
  })),
}
