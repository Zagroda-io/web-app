/**
 * Stan konfiguracji po pierwszym logowaniu (W5/W6) — jak w aplikacji mobilnej
 * (mobile-app/src/lib/account.tsx): core-api zna tylko gospodarstwo i krowy, więc
 * krok, profil gospodarstwa i ustawienia powiadomień trzymamy w przeglądarce.
 */

export type SetupStep = "farm" | "herd" | "notifications" | "done"

export type ProductionType = "dairy" | "beef" | "mixed"
export type HerdSize = "upTo30" | "30to80" | "80to150" | "150plus"

/** Dane z kroku 1, których nie przyjmuje POST /farms. */
export type FarmProfile = {
  city: string
  region: string
  productionType: ProductionType
  herdSize: HerdSize
  /** „PL012345678-001”. */
  herdNumber?: string
}

export type NotificationPrefs = {
  reproductionAndHealth: boolean
  dailyPlan: boolean
  browser: boolean
  sms: boolean
  email: boolean
}

export const defaultNotificationPrefs: NotificationPrefs = {
  reproductionAndHealth: true,
  dailyPlan: false,
  browser: true,
  sms: true,
  email: false,
}

/** Krok przypisany do konta — inne konto w tej samej przeglądarce nie wejdzie w cudzą konfigurację. */
const stepKey = (owner: string | null) => `zagroda.setupStep.${owner?.toLowerCase() ?? "_"}`
const NOTIF_KEY = "zagroda.notificationPrefs"
const NOTIF_ON_KEY = "zagroda.notificationsEnabled"
const profileKey = (farmId: string) => `zagroda.farmProfile.${farmId}`

const STEPS: SetupStep[] = ["farm", "herd", "notifications", "done"]

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    // Prywatne okno / zablokowany magazyn — konfiguracja działa dalej, tylko bez wznawiania.
  }
}

/** Krok, na którym użytkownik przerwał konfigurację; `null` — konfiguracja nie trwa. */
export function getSetupStep(owner: string | null): SetupStep | null {
  const raw = read(stepKey(owner))
  return raw && (STEPS as string[]).includes(raw) ? (raw as SetupStep) : null
}

/** „Postęp zapisuje się po każdym kroku.” */
export function saveSetupStep(owner: string | null, step: SetupStep) {
  write(stepKey(owner), step)
}

export function finishSetup(owner: string | null) {
  write(stepKey(owner), null)
}

export function getFarmProfile(farmId: string): FarmProfile | null {
  const raw = read(profileKey(farmId))
  if (!raw) return null
  try {
    return JSON.parse(raw) as FarmProfile
  } catch {
    return null
  }
}

export function saveFarmProfile(farmId: string, profile: FarmProfile) {
  write(profileKey(farmId), JSON.stringify(profile))
}

export function getNotificationPrefs(): NotificationPrefs {
  const raw = read(NOTIF_KEY)
  if (!raw) return defaultNotificationPrefs
  try {
    return { ...defaultNotificationPrefs, ...(JSON.parse(raw) as Partial<NotificationPrefs>) }
  } catch {
    return defaultNotificationPrefs
  }
}

export function saveNotificationPrefs(prefs: NotificationPrefs, enabled: boolean) {
  write(NOTIF_KEY, JSON.stringify(prefs))
  write(NOTIF_ON_KEY, enabled ? "1" : "0")
}

export function notificationsEnabled(): boolean {
  return read(NOTIF_ON_KEY) === "1"
}

/**
 * Co pokazać zamiast panelu. Bez gospodarstwa — powitanie albo krok 1;
 * z gospodarstwem — przerwana konfiguracja (od kroku 2), inaczej nic.
 */
export function resolveSetup(
  farmCount: number,
  savedStep: SetupStep | null
): { show: "none" } | { show: "welcome" } | { show: "wizard"; step: SetupStep } {
  if (farmCount === 0) {
    return savedStep === "farm" ? { show: "wizard", step: "farm" } : { show: "welcome" }
  }
  if (!savedStep) return { show: "none" }
  // Gospodarstwo już jest — do kroku 1 nie wracamy.
  return { show: "wizard", step: savedStep === "farm" ? "herd" : savedStep }
}
