"use client"

import * as React from "react"
import { Check, LogOut } from "lucide-react"

import { ZagrodaMark } from "@/components/brand/zagroda-logo"
import { ZagrodaLogo } from "@/components/brand/zagroda-logo"
import { useAuth } from "@/hooks/use-auth"
import type { SetupStep } from "@/lib/setup/setup-state"
import { cn } from "@/lib/utils"

const STEP_NO: Record<SetupStep, number> = { farm: 1, herd: 2, notifications: 3, done: 4 }

const steps = [
  { title: "Gospodarstwo", desc: "nazwa, miejscowość, typ hodowli", time: "1 min" },
  { title: "Pierwsze krowy", desc: "ręcznie albo z pliku", time: "1–2 min" },
  { title: "Powiadomienia", desc: "alerty także w nocy", time: "30 s" },
]

const LABELS: Record<SetupStep, string> = {
  farm: "Krok 1 z 3 · Gospodarstwo",
  herd: "Krok 2 z 3 · Stado",
  notifications: "Krok 3 z 3 · Powiadomienia",
  done: "Konfiguracja zakończona",
}

/**
 * W6 — układ konfiguracji: z lewej ciemny panel z postępem i podpowiedzią do kroku,
 * z prawej formularz, pasek postępu i stopka z przyciskami. Poniżej 1000 px panel znika.
 */
export function SetupShell({
  step,
  aside,
  footer,
  children,
}: {
  step: SetupStep
  aside: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}) {
  const { logout } = useAuth()
  const current = STEP_NO[step]
  const headingRef = React.useRef<HTMLDivElement>(null)

  // Nowy krok — fokus na jego treść, żeby czytnik ekranu i klawiatura zaczynały od góry.
  React.useEffect(() => {
    headingRef.current?.querySelector<HTMLElement>("h1")?.focus()
  }, [step])

  return (
    <div className="grid min-h-svh grid-cols-1 bg-z-bg font-sans text-[15px] leading-[22px] text-z-ink antialiased min-[1000px]:grid-cols-[420px_minmax(0,1fr)]">
      <aside
        aria-label="Postęp konfiguracji"
        className="m-4 mr-0 hidden flex-col gap-7 overflow-hidden rounded-[28px] bg-[#17241B] p-8 px-9 text-[#F2F4EF] min-[1000px]:flex"
      >
        <span className="flex items-center gap-3">
          <ZagrodaMark size={44} labelled={false} />
          <span className="text-[22px] font-bold tracking-[-0.02em]">Zagroda</span>
        </span>

        <div className="flex flex-col gap-4">
          <span className="text-[11px] leading-[14px] font-bold tracking-[.08em] text-[#9AA597]">
            KONFIGURACJA GOSPODARSTWA
          </span>
          <ol className="flex flex-col">
            {steps.map((s, i) => {
              const n = i + 1
              const done = current > n
              const cur = current === n
              return (
                <li key={s.title} aria-current={cur ? "step" : undefined} className="flex gap-3.5">
                  <span className="flex flex-none flex-col items-center">
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-8 place-items-center rounded-full border-2 text-sm font-bold",
                        done && "border-[#8FCB98] bg-[#8FCB98] text-[#0F1712]",
                        cur && "border-[#F2F4EF] bg-[#F2F4EF] text-[#0F1712]",
                        !done && !cur && "border-[#3A5A44] text-[#9AA597]"
                      )}
                    >
                      {done ? <Check className="size-4" strokeWidth={3} /> : n}
                    </span>
                    {n < 3 ? (
                      <span
                        aria-hidden
                        className={cn(
                          "my-1 min-h-[22px] w-0.5 flex-1 rounded-sm",
                          done ? "bg-[#8FCB98]" : "bg-[#2E4A36]"
                        )}
                      />
                    ) : null}
                  </span>
                  <span className="flex flex-col gap-0.5 pt-1 pb-[18px]">
                    <span
                      className={cn(
                        "text-base leading-[22px] font-semibold",
                        cur ? "text-white" : done ? "text-[#C9D0C6]" : "text-[#9AA597]"
                      )}
                    >
                      {s.title}
                      {done ? <span className="sr-only"> (zrobione)</span> : null}
                    </span>
                    <span className="text-sm leading-5 text-[#9AA597]">
                      {s.desc} · {s.time}
                    </span>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>

        {aside}

        <button
          type="button"
          onClick={() => logout()}
          className="mt-auto flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-lg text-sm font-semibold text-[#9AA597] outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <LogOut className="size-[18px]" aria-hidden />
          Wyloguj
        </button>
      </aside>

      <main className="flex min-w-0 flex-col p-4 min-[1000px]:px-14 min-[1000px]:py-8">
        <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-6">
          <div className="flex items-center justify-between min-[1000px]:hidden">
            <ZagrodaLogo size="sm" />
            <button
              type="button"
              onClick={() => logout()}
              className="flex min-h-11 cursor-pointer items-center px-1 text-[13.5px] font-semibold text-z-ink-3 hover:text-z-ink"
            >
              Wyloguj
            </button>
          </div>

          <header className="flex flex-col gap-2.5">
            <span className="text-[13.5px] leading-[19px] font-semibold text-z-ink-2">{LABELS[step]}</span>
            <div aria-hidden className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={cn(
                    "h-1 rounded-sm",
                    current > n ? "bg-z-accent" : current === n ? "bg-z-ink" : "bg-z-line-strong"
                  )}
                />
              ))}
            </div>
          </header>

          <div ref={headingRef} key={step} className="flex animate-rise-in flex-col gap-6">
            {children}
          </div>

          <footer className="mt-auto flex flex-wrap items-center gap-2.5 border-t border-z-line pt-2">
            {footer}
          </footer>
        </div>
      </main>
    </div>
  )
}

/** Nagłówek kroku: tytuł (dostaje fokus po zmianie kroku) i podtytuł. */
export function StepTitle({ title, subtitle }: { title: React.ReactNode; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 tabIndex={-1} className="text-[32px] leading-[38px] font-bold tracking-[-0.02em] outline-none">
        {title}
      </h1>
      <p className="text-[17px] leading-6 text-z-ink-2">{subtitle}</p>
    </div>
  )
}

/** Karta podpowiedzi w ciemnym panelu. */
export function AsideCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-[20px] border border-[#2E4A36] bg-[#0F1712] p-[18px]", className)}>
      {children}
    </div>
  )
}
