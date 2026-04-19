import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import { PageAnimate } from "@/components/page-animate"

export default function PrivacyPage() {
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
            <CardTitle className="text-2xl">Polityka prywatności</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground italic">Ostatnia aktualizacja: 18 kwietnia 2026 r.</p>
            <Separator className="my-4" />
            
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">1. Informacje ogólne</h3>
              <p>
                Zagroda.io szanuje Twoją prywatność i dba o ochronę Twoich danych osobowych. Niniejsza polityka wyjaśnia, jakie dane zbieramy i jak je przetwarzamy.
              </p>

              <h3 className="text-lg font-semibold">2. Administrator danych</h3>
              <p>
                Administratorem Twoich danych osobowych jest Zagroda.io. W sprawach dotyczących ochrony danych możesz skontaktować się z nami pod adresem kontakt@zagroda.io.
              </p>

              <h3 className="text-lg font-semibold">3. Zakres zbieranych danych</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Imię i nazwisko (podczas rejestracji)</li>
                <li>Adres e-mail</li>
                <li>Dane logowania (poprzez dostawców zewnętrznych jak Google/Apple)</li>
                <li>Pliki cookies i dane analityczne</li>
              </ul>

              <h3 className="text-lg font-semibold">4. Cel przetwarzania</h3>
              <p>
                Dane są przetwarzane w celu świadczenia usług w ramach Serwisu, komunikacji z Użytkownikiem oraz zapewnienia bezpieczeństwa Konta.
              </p>

              <h3 className="text-lg font-semibold">5. Twoje prawa</h3>
              <p>
                Masz prawo do dostępu do swoich danych, ich poprawiania, żądania usunięcia lub ograniczenia przetwarzania, a także prawo do przenoszenia danych.
              </p>

              <h3 className="text-lg font-semibold">6. Pliki Cookies</h3>
              <p>
                Serwis wykorzystuje pliki cookies w celu poprawy komfortu użytkowania oraz do celów statystycznych. Możesz zmienić ustawienia cookies w swojej przeglądarce.
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
