"use client"

import * as React from "react"
import { Check, ChevronRight, Nfc, Users } from "lucide-react"

import { ZagrodaLogo } from "@/components/brand/zagroda-logo"
import { InviteDialog } from "@/components/setup/invite-dialog"
import { IconBox, ZChip } from "@/components/setup/setup-ui"
import { useAuth } from "@/hooks/use-auth"
import { firstName, initials } from "@/lib/setup/farm-form"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Gospodarstwo",
    hint: "Nazwa, miejscowość i typ hodowli. Numer siedziby stada możesz dodać później.",
    time: "1 min",
  },
  {
    title: "Pierwsze krowy",
    hint: "Ręcznie albo z pliku CSV lub Excel. Na start wystarczy kilka.",
    time: "1–2 min",
  },
  {
    title: "Powiadomienia",
    hint: "Żeby alert z obory dotarł do Ciebie także w nocy: w przeglądarce, na telefonie i SMS-em.",
    time: "30 s",
  },
]

/** Nagłówek ekranów konfiguracji bez bocznego panelu: logo, użytkownik, „Wyloguj”. */
export function SetupTopBar({ fullName }: { fullName: string | null }) {
  const { logout } = useAuth()
  const ini = initials(fullName)
  return (
    <header>
      <div className="mx-auto flex min-h-[76px] max-w-[1120px] items-center gap-3 px-4 min-[900px]:px-8">
        <ZagrodaLogo size="sm" />
        <div className="ml-auto flex items-center gap-3.5">
          {fullName ? (
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-full border border-z-line bg-z-surface text-[13px] font-semibold text-z-ink-2"
              >
                {ini}
              </span>
              <span className="hidden text-[13.5px] font-semibold sm:inline">{fullName}</span>
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => logout()}
            className="flex min-h-11 cursor-pointer items-center rounded-lg px-1 text-[13.5px] font-semibold text-z-ink-3 outline-none hover:text-z-ink focus-visible:ring-2 focus-visible:ring-z-ink/25"
          >
            Wyloguj
          </button>
        </div>
      </div>
    </header>
  )
}

/** W5 — powitanie po pierwszym logowaniu, przed konfiguracją gospodarstwa (W6). */
export function SetupWelcome({
  fullName,
  onStart,
}: {
  fullName: string | null
  onStart: () => void
}) {
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const name = firstName(fullName)

  return (
    <div className="flex min-h-svh flex-col bg-z-bg font-sans text-[15px] leading-[22px] text-z-ink antialiased">
      <SetupTopBar fullName={fullName} />

      <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-7 px-4 pt-1 pb-12 min-[900px]:px-8">
        <section className="relative grid animate-rise-in grid-cols-1 gap-8 overflow-hidden rounded-[28px] bg-[#17241B] px-6 py-7 text-[#F2F4EF] min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[900px]:p-9">
          <div className="flex min-w-0 flex-col justify-center gap-3.5">
            <span className="inline-flex h-[26px] items-center gap-1.5 self-start rounded-full bg-[#1E3325] px-2.5 text-[12.5px] font-semibold text-[#8FCB98]">
              <Check className="size-[15px]" aria-hidden />
              Konto gotowe
            </span>
            <h1 className="text-[36px] leading-[42px] font-bold tracking-[-0.03em] min-[900px]:text-[44px] min-[900px]:leading-[50px]">
              {name ? `Witaj, ${name}!` : "Witaj w Zagrodzie!"}
            </h1>
            <p className="max-w-[460px] text-lg leading-7 text-[#C7DDBD]">
              Ustawmy Twoje gospodarstwo. To 3 krótkie kroki, razem około 3 minut. Potem zobaczysz
              stado, alerty i terminy rozrodu w jednym miejscu.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-5 text-[17px] font-semibold text-[#151915] outline-none hover:bg-[#F2F4EF] focus-visible:ring-[3px] focus-visible:ring-white/40"
              >
                Zaczynamy: gospodarstwo
                <ChevronRight className="size-[22px]" aria-hidden />
              </button>
              <span className="text-sm text-[#9AA597]">Postęp zapisuje się po każdym kroku.</span>
            </div>
          </div>

          <div
            aria-hidden
            className="relative hidden min-h-[300px] overflow-hidden rounded-[20px] bg-[#0F1712] min-[900px]:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- dekoracja, bez optymalizacji */}
            <img
              src="/auth/obora-kamera.jpg"
              alt=""
              className="absolute inset-0 block size-full object-cover object-[32%_50%]"
            />
            <span className="absolute right-4 bottom-4 left-4 flex max-w-[360px] flex-col gap-2.5 rounded-[18px] border border-[#2E4A36] bg-[rgba(15,23,18,.94)] px-4 py-3.5">
              <span className="text-[11px] font-bold tracking-[.08em] text-[#9AA597]">
                TWOJA OBORA · CO DALEJ
              </span>
              <span className="flex items-center gap-2.5 text-sm">
                <span className="size-2.5 rounded-full bg-[#8FCB98]" />
                Konto i gospodarstwo — teraz
              </span>
              <span className="flex items-center gap-2.5 text-sm text-[#C9D0C6]">
                <span className="size-2.5 rounded-full border-2 border-[#9AA597]" />
                Serwer i kamery — po montażu w oborze
              </span>
              <span className="flex items-center gap-2.5 text-sm text-[#C9D0C6]">
                <span className="size-2.5 rounded-full border-2 border-[#9AA597]" />
                Obroże — włączysz je telefonem
              </span>
            </span>
          </div>
        </section>

        <section aria-labelledby="kroki-h" className="flex flex-col gap-3.5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h2 id="kroki-h" className="text-[22px] leading-[30px] font-bold tracking-[-0.01em]">
              Konfiguracja w 3 krokach
            </h2>
            <span className="text-[13.5px] leading-[19px] text-z-ink-3">
              Tak samo jak w aplikacji na telefonie. Możesz przerwać i wrócić później.
            </span>
          </div>
          <ol className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-2.5 rounded-[20px] border border-z-line bg-z-surface p-5"
              >
                <span className="flex items-center justify-between">
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-9 place-items-center rounded-full text-base font-bold",
                      i === 0
                        ? "bg-z-ink text-z-on-ink"
                        : "border-2 border-z-line-strong text-z-ink-2"
                    )}
                  >
                    {i + 1}
                  </span>
                  <ZChip>{step.time}</ZChip>
                </span>
                <span className="text-[17px] leading-6 font-semibold">
                  <span className="sr-only">Krok {i + 1}: </span>
                  {step.title}
                </span>
                <span className="text-[13.5px] leading-[19px] text-z-ink-3">{step.hint}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-2">
          <div className="flex items-start gap-3.5 rounded-[20px] border border-z-green-200 bg-z-green-50 px-5 py-[18px]">
            <IconBox className="bg-z-surface text-z-accent">
              <Nfc className="size-[22px]" aria-hidden />
            </IconBox>
            <span className="flex flex-col gap-0.5">
              <span className="text-base leading-[22px] font-semibold">
                Obroże przypiszemy po konfiguracji
              </span>
              <span className="text-[13.5px] leading-[19px] text-z-ink-2">
                Włączysz je telefonem, przykładając go do obroży. Bez telefonu z NFC wpiszesz token
                obroży tutaj, w przeglądarce.
              </span>
            </span>
          </div>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setInviteOpen(true)}
            className="flex w-full cursor-pointer items-center gap-3.5 rounded-[20px] border border-z-line bg-z-surface py-[18px] pr-3.5 pl-5 text-left text-z-ink outline-none hover:bg-z-surface-2 focus-visible:ring-[3px] focus-visible:ring-z-ink/25"
          >
            <IconBox className="bg-z-blue-bg text-z-blue-ink">
              <Users className="size-[22px]" aria-hidden />
            </IconBox>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-base leading-[22px] font-semibold">Masz zaproszenie?</span>
              <span className="text-[13.5px] leading-[19px] text-z-ink-3">
                Dołącz do czyjegoś gospodarstwa kodem z SMS-a, bez zakładania własnego.
              </span>
            </span>
            <ChevronRight className="size-[22px] text-z-ink-3" aria-hidden />
          </button>
        </div>
      </main>

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
