export interface HerdAlert {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  description: string
  time: string
  hasVideo?: boolean
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

export const herdAlertsMock: HerdAlert[] = [
  {
    id: "1",
    type: "critical",
    title: "Krowa #034 — podwyższona temperatura",
    description: "39,8°C — możliwe zapalenie wymienia. Wymaga kontroli wet.",
    time: "06:14",
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
    id: "2",
    type: "warning",
    title: "Krowa #017 — spadek wydajności",
    description: "–18% przez 3 dni. Kontrola paszy i kondycji ciała.",
    time: "05:30",
    details: {
      metric: "Wydajność dojna",
      value: "14,2 l (Średnia: 17,4 l)",
      recommendation:
        "Sprawdzenie dostępności paszy, kontrola apetytu, badanie BCS (Body Condition Score).",
      analysis:
        "Trend spadkowy utrzymuje się od poniedziałku. Brak innych objawów chorobowych, jednak spadek jest statystycznie istotny.",
      predictionData: [
        { label: "Spadek produkcji", value: 88, color: "bg-red-500" },
        { label: "Niedobór energii", value: 55, color: "bg-amber-500" },
        { label: "Ryzyko ketozy", value: 25, color: "bg-green-500" },
      ],
      entities: [
        {
          match: 95,
          type: "Krowa",
          id: "#017",
          subType: "Krowa mleczna • Jersey",
        },
      ],
    },
  },
  {
    id: "3",
    type: "warning",
    title: "Krowa #061 — detekcja estrus",
    description: "Optymalne okno inseminacji: 6–12h. Aktyw. +340%.",
    time: "04:55",
    hasVideo: true,
    details: {
      metric: "Aktywność ruchowa",
      value: "+340% względem bazy",
      recommendation: "Planowana inseminacja między 11:00 a 17:00.",
      analysis:
        "Analiza obrazu z kamery AI potwierdziła zachowania rujowe (obskakiwanie, niepokój). Aktywność nocna znacznie powyżej normy.",
      predictionData: [
        { label: "Prawdopodobna ruja", value: 96, color: "bg-green-500" },
        { label: "Aktywność ruchowa", value: 92, color: "bg-green-500" },
        { label: "Spadek przeżuwania", value: 40, color: "bg-amber-500" },
      ],
      entities: [
        {
          match: 89,
          type: "Krowa",
          id: "#061",
          subType: "Jałówka • Holstein-Fryzyjska",
        },
      ],
    },
  },
  {
    id: "4",
    type: "info",
    title: "Wizyta weterynaryjna — jutro 8:00",
    description: "4 krowy do zbadania. BCS + kontrola wymion.",
    time: "jutro",
    details: {
      metric: "Planowane badania",
      value: "4 sztuki (#034, #012, #088, #055)",
      recommendation: "Przygotowanie dokumentacji medycznej wybranych krów.",
      analysis:
        "Rutynowa kontrola okresowa oraz badanie zgłoszonego przypadku #034. Lekarz: Dr Jan Kowalski.",
      predictionData: [
        { label: "Czas wizyty", value: 100, color: "bg-blue-500" },
        { label: "Liczba zwierząt", value: 80, color: "bg-blue-500" },
      ],
      entities: [
        {
          match: 100,
          type: "Lekarz",
          id: "VET-01",
          subType: "Medycyna dużych zwierząt",
        },
        { match: 100, type: "Krowa", id: "#034", subType: "Pacjent" },
      ],
    },
  },
  {
    id: "5",
    type: "success",
    title: "Wyniki badań mleka — Kwiecień",
    description: "LKS: 48k, Białko: 3,42% — klasa Extra. Bonus +0,04 zł/l.",
    time: "wczoraj",
    details: {
      metric: "Klasa jakości",
      value: "Extra",
      recommendation:
        "Utrzymanie obecnego reżimu żywieniowego i higienicznego.",
      analysis:
        "Wszystkie parametry (LKS, LB, tłuszcz, białko) znajdują się w górnych 5% normy regionalnej. Świetny wynik stada.",
      predictionData: [
        { label: "Jakość Extra", value: 100, color: "bg-green-500" },
        { label: "Prognoza premii", value: 100, color: "bg-green-500" },
      ],
      entities: [
        {
          match: 100,
          type: "Raport",
          id: "M-04-26",
          subType: "Jakość surowca",
        },
      ],
    },
  },
]
