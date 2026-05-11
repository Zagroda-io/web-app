import StadoView from '@/components/stado/StadoView'
import { getCows, getHerdFeed, getHerdSummary } from '@/api/stado'

export const dynamic = 'force-dynamic'

export default async function StadoPage() {
  // W rzeczywistym środowisku te dane przyjdą z API. 
  // Jeśli API nie jest gotowe, serwer rzuci błąd lub zwróci puste dane.
  let cows, feed, summary;

  try {
    [cows, feed, summary] = await Promise.all([
      getCows(),
      getHerdFeed({ limit: 3 }),
      getHerdSummary(),
    ])
  } catch (error) {
    console.error('Błąd ładowania danych stada:', error)
    // W środowisku produkcyjnym tu powinien być lepszy UI błędu
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Błąd połączenia z API</h2>
        <p className="text-muted-foreground mt-2">Nie udało się pobrać danych stada. Sprawdź czy backend działa i czy zmienna NEXT_PUBLIC_API_URL jest poprawna.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <StadoView initialCows={cows} initialFeed={feed} summary={summary} />
    </div>
  )
}
