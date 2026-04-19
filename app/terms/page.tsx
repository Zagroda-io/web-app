import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import { PageAnimate } from "@/components/page-animate"

export default function TermsPage() {
  return (
    <PageAnimate>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center gap-2 self-start">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link href="/login">
              <ArrowLeft className="mr-2 size-4" />
              Powrót do logowania
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Regulamin</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground italic">Ostatnia aktualizacja: 18 kwietnia 2026 r.</p>
            <Separator className="my-4" />
            
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">1. Postanowienia ogólne</h3>
              <p>
                Niniejszy regulamin określa zasady korzystania z serwisu Zagroda.io. Korzystając z serwisu, akceptujesz poniższe warunki.
              </p>

              <h3 className="text-lg font-semibold">2. Definicje</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Serwis:</strong> Platforma internetowa dostępna pod adresem Zagroda.io.</li>
                <li><strong>Użytkownik:</strong> Każda osoba fizyczna lub prawna korzystająca z Serwisu.</li>
                <li><strong>Konto:</strong> Indywidualny profil Użytkownika w Serwisie.</li>
              </ul>

              <h3 className="text-lg font-semibold">3. Zasady korzystania</h3>
              <p>
                Użytkownik zobowiązuje się do korzystania z Serwisu w sposób zgodny z obowiązującym prawem, zasadami współżycia społecznego oraz niniejszym Regulaminem.
              </p>

              <h3 className="text-lg font-semibold">4. Rejestracja i bezpieczeństwo</h3>
              <p>
                Podczas rejestracji Użytkownik jest zobowiązany do podania prawdziwych danych. Użytkownik odpowiada za zachowanie poufności swojego hasła.
              </p>

              <h3 className="text-lg font-semibold">5. Odpowiedzialność</h3>
              <p>
                Zagroda.io dokłada wszelkich starań, aby Serwis działał bez zakłóceń, jednak nie ponosi odpowiedzialności za przerwy techniczne niezależne od administratora.
              </p>

              <h3 className="text-lg font-semibold">6. Zmiany regulaminu</h3>
              <p>
                Zastrzegamy sobie prawo do zmiany regulaminu. O wszelkich zmianach Użytkownicy zostaną poinformowani z wyprzedzeniem.
              </p>
            </section>
          </CardContent>
        </Card>
        <div className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Zagroda.io. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </div>
    </PageAnimate>
  )
}
