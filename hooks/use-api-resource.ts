"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface ApiResource<T> {
  data: T | null
  error: boolean
  /** Trwa pobieranie dla bieżącego klucza (poprzednie dane zostają na ekranie). */
  isLoading: boolean
  reload: () => void
}

/**
 * Pobiera zasób z API dla danego klucza. Poprzednie dane zostają widoczne do czasu
 * nadejścia nowych (bez migania przy filtrowaniu), a odpowiedzi dla nieaktualnego klucza
 * są ignorowane. `key = null` wstrzymuje pobieranie (np. brak aktywnego gospodarstwa).
 */
export function useApiResource<T>(
  key: string | null,
  fetcher: () => Promise<T>
): ApiResource<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState(false)
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const requestKey = key === null ? null : `${key}#${reloadToken}`

  // Fetcher jest zwykle funkcją strzałkową tworzoną w renderze — o ponownym pobraniu decyduje klucz.
  // Efekt aktualizujący jest zadeklarowany przed efektem pobierania, więc ten widzi świeżą wersję.
  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    if (requestKey === null) return
    let cancelled = false
    fetcherRef.current().then(
      (result) => {
        if (cancelled) return
        setData(result)
        setError(false)
        setLoadedKey(requestKey)
      },
      (err) => {
        if (cancelled) return
        console.error("Błąd pobierania danych:", err)
        setError(true)
        setLoadedKey(requestKey)
      }
    )
    return () => {
      cancelled = true
    }
  }, [requestKey])

  const reload = useCallback(() => setReloadToken((t) => t + 1), [])

  return {
    data,
    error,
    isLoading: requestKey !== null && loadedKey !== requestKey,
    reload,
  }
}
