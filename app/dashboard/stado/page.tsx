import StadoView from '@/components/stado/StadoView'
import { getCows, getHerdFeed, getHerdSummary } from '@/api/stado'
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

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
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Zagroda</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Stado</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <StadoView initialCows={cows} initialFeed={feed} summary={summary} />
      </div>
    </>
  )
}
