/**
 * Tokeny sesji. „Zapamiętaj mnie” trzyma je w localStorage (przeżywają zamknięcie
 * przeglądarki), bez tego — w sessionStorage (znikają razem z kartą).
 */
const ACCESS = "accessToken"
const REFRESH = "refreshToken"

function stores(): Storage[] {
  if (typeof window === "undefined") return []
  return [window.localStorage, window.sessionStorage]
}

/** Magazyn, w którym leży bieżąca sesja; `null`, gdy nikt nie jest zalogowany. */
function activeStore(): Storage | null {
  return stores().find((s) => s.getItem(REFRESH) !== null) ?? null
}

export function getAccessToken(): string | null {
  return activeStore()?.getItem(ACCESS) ?? null
}

export function getRefreshToken(): string | null {
  return activeStore()?.getItem(REFRESH) ?? null
}

/** Zapis po zalogowaniu. Czyści drugi magazyn, żeby nie zostały w nim stare tokeny. */
export function saveTokens(
  accessToken: string,
  refreshToken: string,
  remember = true
) {
  clearTokens()
  const store = remember ? window.localStorage : window.sessionStorage
  store.setItem(ACCESS, accessToken)
  store.setItem(REFRESH, refreshToken)
}

/** Zapis po odświeżeniu tokena — w tym samym magazynie, w którym była sesja. */
export function updateTokens(accessToken: string, refreshToken: string) {
  const store = activeStore() ?? window.localStorage
  store.setItem(ACCESS, accessToken)
  store.setItem(REFRESH, refreshToken)
}

export function clearTokens() {
  for (const store of stores()) {
    store.removeItem(ACCESS)
    store.removeItem(REFRESH)
  }
}
