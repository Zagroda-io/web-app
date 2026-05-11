import type {
  Cow,
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

export const MOCK_FEED: FeedEvent[] = [
  {
    id: "e1",
    cowId: 1,
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
    cowId: 2,
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
    cowId: 3,
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

const YIELD_HISTORY: CowYieldDay[] = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  liters: 25 + Math.random() * 10,
}))

const ACTIVITY_HISTORY: CowActivityDay[] = [
  { dayLabel: "Pon", activityIndex: 105 },
  { dayLabel: "Wt", activityIndex: 98 },
  { dayLabel: "Śr", activityIndex: 210 },
  { dayLabel: "Czw", activityIndex: 115 },
  { dayLabel: "Pt", activityIndex: 92 },
  { dayLabel: "Sob", activityIndex: 101 },
  { dayLabel: "Ndz", activityIndex: 108 },
]

export const MOCK_COWS: Cow[] = [
  {
    id: 1,
    earTagNumber: "PL 005312345678",
    name: "Basia",
    breed: "HO",
    birthDate: "2019-03-12",
    ageLabel: "5 lat 2 m-ce",
    lactationNumber: 3,
    status: "alert",
    yieldToday: 32.5,
    yieldMax: 45,
    bcs: 2.25,
    lastAlertLabel: "Podwyższona temperatura",
    activeAlerts: [
      {
        id: "a1",
        severity: "red",
        title: "Podwyższona temperatura",
        description: "39,8°C wykryte o 06:14. Ryzyko Mastitis.",
        detectedAt: new Date().toISOString(),
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
    ],
    sire: { identifier: "HOLANDIA-082", name: "Sunny Boy", whIndex: "WH 3121" },
    dam: { identifier: "PL 005211223344", name: "Bella", note: "Lac. 5" },
    offspring: [
      {
        id: "c1",
        earTagNumber: "PL 005400112233",
        sex: "female",
        birthDate: "2023-01-10",
        status: "Odchów",
      },
    ],
    yieldHistory: YIELD_HISTORY,
    activityHistory: ACTIVITY_HISTORY,
    events: [
      {
        id: "ev1",
        category: "alert",
        severity: "red",
        title: "Podwyższona temperatura 39,8°C",
        description: "Wykryta automatycznie. Oczekuje na ocenę weterynaryjną.",
        occurredAt: new Date().toISOString(),
        hasClip: true,
      },
    ],
  },
  {
    id: 2,
    earTagNumber: "PL 005312345679",
    name: "Krasula",
    breed: "HO",
    birthDate: "2020-05-20",
    ageLabel: "4 lata",
    lactationNumber: 2,
    status: "warn",
    yieldToday: 28.0,
    yieldMax: 40,
    bcs: 2.75,
    lastAlertLabel: "Wykryto ruję",
    activeAlerts: [],
    sire: { identifier: "NIEMCY-441", name: "Bullseye" },
    dam: { identifier: "PL 005211223345", name: "Mućka" },
    offspring: [],
    yieldHistory: YIELD_HISTORY,
    activityHistory: ACTIVITY_HISTORY,
    events: [],
  },
  {
    id: 3,
    earTagNumber: "PL 005312345680",
    name: "Mela",
    breed: "RW",
    birthDate: "2021-01-15",
    ageLabel: "3 lata 4 m-ce",
    lactationNumber: 1,
    status: "ok",
    yieldToday: 24.5,
    yieldMax: 35,
    bcs: 3.25,
    lastAlertLabel: "—",
    activeAlerts: [],
    sire: { identifier: "USA-123", name: "Ranger" },
    dam: { identifier: "PL 005211223346", name: "Mela Senior" },
    offspring: [],
    yieldHistory: YIELD_HISTORY,
    activityHistory: ACTIVITY_HISTORY,
    events: [],
  },
]
