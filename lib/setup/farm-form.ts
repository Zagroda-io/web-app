import type { HerdSize, ProductionType } from "./setup-state"

/** Słowniki i reguły formularzy konfiguracji — te same co w aplikacji mobilnej. */

export const voivodeships = [
  "dolnośląskie",
  "kujawsko-pomorskie",
  "lubelskie",
  "lubuskie",
  "łódzkie",
  "małopolskie",
  "mazowieckie",
  "opolskie",
  "podkarpackie",
  "podlaskie",
  "pomorskie",
  "śląskie",
  "świętokrzyskie",
  "warmińsko-mazurskie",
  "wielkopolskie",
  "zachodniopomorskie",
] as const

export const productionTypes: { value: ProductionType; label: string }[] = [
  { value: "dairy", label: "Mleczna" },
  { value: "beef", label: "Mięsna" },
  { value: "mixed", label: "Mieszana" },
]

export const herdSizes: { value: HerdSize; label: string }[] = [
  { value: "upTo30", label: "do 30" },
  { value: "30to80", label: "30–80" },
  { value: "80to150", label: "80–150" },
  { value: "150plus", label: "150+" },
]

/** Rasy w kodach platformy (lib/stado/labels.ts). */
export const breeds = [
  { value: "HO", label: "HO · holsztyńsko-fryzyjska" },
  { value: "RW", label: "RW · polska czerwono-biała" },
  { value: "ZB", label: "ZB · polska czarno-biała" },
  { value: "SM", label: "SM · simentalska" },
  { value: "JE", label: "JE · jersey" },
] as const

/** Numer siedziby stada po „PL”: 9 cyfr, „-”, 3 cyfry. */
export function formatHerdNumber(text: string): string {
  const digits = text.replace(/\D/g, "").slice(0, 12)
  return digits.length > 9 ? `${digits.slice(0, 9)}-${digits.slice(9)}` : digits
}

export function isCompleteHerdNumber(value: string): boolean {
  return /^\d{9}-\d{3}$/.test(value)
}

export const EAR_TAG_DIGITS = 12

/** Numer kolczyka po „PL”: same cyfry, maks. 12 (wklejony „PL…” też przechodzi). */
export function normalizeEarTag(text: string): string {
  return text.replace(/^\s*PL/i, "").replace(/\D/g, "").slice(0, EAR_TAG_DIGITS)
}

/** POST /farms rozdziela `location` po przecinku: miejscowość, województwo. */
export function farmLocation(city: string, region: string): string {
  return `${city.trim()}, ${region}`
}

/** core-api skleja miejscowość i województwo w różnej kolejności — zawsze „Miejscowość, województwo”. */
export function formatFarmLocation(location?: string | null): string | null {
  if (!location) return null
  const [first, second] = location.split(",").map((part) => part.trim())
  const isRegion = (value?: string) =>
    !!value && (voivodeships as readonly string[]).includes(value.toLowerCase())
  return second && isRegion(first) && !isRegion(second) ? `${second}, ${first}` : location
}

/** „2021-03-12” → „12.03.2021”. */
export function formatIsoDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-")
  return d && m && y ? `${d}.${m}.${y}` : iso
}

/** Pierwsze imię z „Imię Nazwisko” do powitania. */
export function firstName(fullName?: string | null): string | null {
  const name = fullName?.trim().split(/\s+/)[0]
  return name || null
}

/** Inicjały do awatara: „Brunon Kowalski” → „BK”. */
export function initials(fullName?: string | null): string {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? []
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")
}

/** Polska odmiana: 1 krowa, 2 krowy, 5 krów. */
export function plural(n: number, one: string, few: string, many: string): string {
  const a = n % 10
  const b = n % 100
  if (n === 1) return one
  return a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many
}
