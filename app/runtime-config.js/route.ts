import { serverRuntimeConfig } from "@/lib/config"

// Konfiguracja dla przeglądarki (opis w lib/config.ts). Liczona przy każdym żądaniu, a nie przy buildzie —
// inaczej adres API zostałby zapisany w obrazie.
export const dynamic = "force-dynamic"

export function GET() {
  const body = `window.__ZAGRODA_CONFIG__ = ${JSON.stringify(serverRuntimeConfig())};\n`
  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
