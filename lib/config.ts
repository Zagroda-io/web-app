/**
 * Konfiguracja aplikacji.
 *
 * Adres API nie jest wpisywany w kod przy buildzie (jak zmienne NEXT_PUBLIC_*), tylko czytany przy starcie
 * kontenera ze zmiennej API_URL — dzięki temu ten sam obraz Dockera działa na DEV i na PROD.
 *  - serwer czyta zmienne środowiska wprost;
 *  - przeglądarka dostaje je z /runtime-config.js (app/runtime-config.js/route.ts), który app/layout.tsx
 *    ładuje przed kodem aplikacji.
 * Lokalnie (npm run dev) działa dalej NEXT_PUBLIC_API_URL z .env.local.
 */
export type RuntimeConfig = {
  apiUrl: string
}

declare global {
  interface Window {
    __ZAGRODA_CONFIG__?: RuntimeConfig
  }
}

const DEFAULT_API_URL = "http://localhost:8080/api/v1"

/** Konfiguracja ze zmiennych środowiska — tylko po stronie serwera. */
export function serverRuntimeConfig(): RuntimeConfig {
  return {
    apiUrl:
      process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL,
  }
}

const runtime =
  (typeof window !== "undefined" && window.__ZAGRODA_CONFIG__) ||
  serverRuntimeConfig()

export const config = {
  apiUrl: runtime.apiUrl,
  isProduction: process.env.NODE_ENV === "production",
}
