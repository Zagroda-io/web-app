export interface HerdStatus {
  activeCows: number
  alertsCount: number
  dryCowsCount: number
  currentlyMilking: number
}

export const herdStatusMock: HerdStatus = {
  activeCows: 86,
  alertsCount: 2,
  dryCowsCount: 3,
  currentlyMilking: 11,
}
