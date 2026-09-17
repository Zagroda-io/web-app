import type {
  CowActivityDay,
  CowYieldDay,
  FeedEvent,
  HerdSummary,
} from "@/lib/types/stado.types"

export const MOCK_SUMMARY: HerdSummary = {
  totalCows: 86,
  activeAlertCount: 3,
  plannedInseminationCount: 2,
  lastSyncAt: new Date().toISOString(),
}

export const YIELD_HISTORY: CowYieldDay[] = [
  { date: "2024-03-01", liters: 28.5 },
  { date: "2024-03-02", liters: 29.2 },
  { date: "2024-03-03", liters: 27.8 },
  { date: "2024-03-04", liters: 30.1 },
  { date: "2024-03-05", liters: 31.4 },
  { date: "2024-03-06", liters: 29.8 },
  { date: "2024-03-07", liters: 28.9 },
  { date: "2024-03-08", liters: 30.5 },
  { date: "2024-03-09", liters: 32.1 },
  { date: "2024-03-10", liters: 31.8 },
  { date: "2024-03-11", liters: 30.2 },
  { date: "2024-03-12", liters: 29.5 },
  { date: "2024-03-13", liters: 30.8 },
  { date: "2024-03-14", liters: 31.2 },
]

export const ACTIVITY_HISTORY: CowActivityDay[] = [
  { dayLabel: "Pon", activityIndex: 98 },
  { dayLabel: "Wt", activityIndex: 105 },
  { dayLabel: "Śr", activityIndex: 112 },
  { dayLabel: "Cz", activityIndex: 95 },
  { dayLabel: "Pt", activityIndex: 120 },
  { dayLabel: "Sb", activityIndex: 102 },
  { dayLabel: "Nd", activityIndex: 108 },
]

export const MOCK_FEED: FeedEvent[] = [
  {
    id: "e1",
    cowId: "1",
    cowName: "Basia",
    earTagShort: "034",
    severity: "red",
    category: "alert",
    categoryLabel: "Alert",
    title: "Podwyższona temperatura",
    description: "39,8°C - Możliwe zapalenie wymienia",
    occurredAt: new Date().toISOString(),
    details: {
      metric: "Temperatura ciała",
      value: "39,8°C (Norma: 38,5-39,2°C)",
      recommendation:
        "Odseparowanie od stada, pilna kontrola weterynaryjna, badanie wymienia.",
      analysis:
        "Wykryto gwałtowny wzrost temperatury w ciągu ostatnich 2 godzin (+1,2°C). System AI sugeruje wysokie prawdopodobieństwo infekcji.",
      predictionData: [
        { label: "Wysoka temperatura", value: 92, color: "bg-red-500" },
        { label: "Spadek apetytu", value: 45, color: "bg-amber-500" },
        { label: "Anomalia aktywności", value: 30, color: "bg-amber-500" },
      ],
      entities: [
        {
          match: 98,
          type: "Krowa",
          id: "#034",
          subType: "Krowa mleczna • Holstein-Fryzyjska",
        },
      ],
    },
  },
  {
    id: "e2",
    cowId: "2",
    cowName: "Krasula",
    earTagShort: "112",
    severity: "amber",
    category: "estrus",
    categoryLabel: "Estrus",
    title: "Wykryto ruję",
    description: "Wysoka aktywność od 4 godzin",
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "e3",
    cowId: "3",
    cowName: "Mela",
    earTagShort: "085",
    severity: "info",
    category: "yield",
    categoryLabel: "Wydajność",
    title: "Spadek wydajności",
    description: "O 15% mniej niż średnia 7-dniowa",
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
]

export const MOCK_COWS: any[] = []
