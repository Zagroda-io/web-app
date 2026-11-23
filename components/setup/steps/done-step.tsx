"use client"

import * as React from "react"
import { Check, ChevronRight, PartyPopper } from "lucide-react"

import { ZButton } from "@/components/auth/auth-ui"
import { AsideCard, SetupShell, StepTitle } from "@/components/setup/setup-shell"
import { IconBox, ListRow, ZChip } from "@/components/setup/setup-ui"
import { getAnimals } from "@/lib/api/stado"
import { formatFarmLocation, plural } from "@/lib/setup/farm-form"
import { notificationsEnabled } from "@/lib/setup/setup-state"
import { cn } from "@/lib/utils"
import type { Farm } from "@/types/farm"

type Todo = {
  title: string
  sub: string
  ok: boolean
  /** Przycisk przy niezrobionym kroku; `null` — funkcja jeszcze niedostępna. */
  cta?: { label: string; onClick: () => void } | null
}

/** W6d — konfiguracja zakończona: podsumowanie i „Pierwsze kroki” do zrobienia później. */
export function DoneStep({
  farm,
  onFinish,
  onEnableNotifications,
}: {
  farm: Farm
  onFinish: (href?: string) => void
  onEnableNotifications: () => void
}) {
  const [cows, setCows] = React.useState<number | null>(null)
  const notif = React.useMemo(() => notificationsEnabled(), [])

  React.useEffect(() => {
    getAnimals({ farmId: farm.id, page: 0, size: 1 })
      .then((page) => setCows(page.totalElements))
      .catch(() => setCows(0))
  }, [farm.id])

  const location = formatFarmLocation(farm.location)
  const total = cows ?? 0

  const todo: Todo[] = [
    { title: "Dane gospodarstwa", sub: [farm.name, location].filter(Boolean).join(" · "), ok: true },
    {
      title: total > 0 ? `${total} ${plural(total, "krowa", "krowy", "krów")} w stadzie` : "Dodaj krowy",
      sub: total > 0 ? "resztę dodasz w zakładce Stado" : "kolczyk, data urodzenia, rasa",
      ok: total > 0,
      cta: { label: "Dodaj", onClick: () => onFinish("/dashboard/stado") },
    },
    {
      title: notif ? "Powiadomienia włączone" : "Włącz powiadomienia",
      sub: notif ? "ustawienia zapisane na tym komputerze" : "bez nich alert z obory do Ciebie nie dotrze",
      ok: notif,
      cta: { label: "Włącz", onClick: onEnableNotifications },
    },
    {
      title: "Aktywuj obroże",
      sub: "przyłóż telefon do obroży albo wpisz jej token tutaj",
      ok: false,
      cta: { label: "Wpisz token", onClick: () => onFinish("/dashboard/czujniki") },
    },
    { title: "Zaproś pracowników", sub: "albo weterynarza jako gościa", ok: false, cta: null },
  ]
  const okN = todo.filter((t) => t.ok).length
  const doneText = `${okN} z ${todo.length}`

  return (
    <SetupShell
      step="done"
      aside={
        <AsideCard>
          <span className="text-[11px] font-bold tracking-[.08em] text-[#9AA597]">W OBORZE · CO DALEJ</span>
          <span className="flex items-start gap-2.5 text-sm leading-5 text-[#C9D0C6]">
            <span className="mt-1.5 size-2 flex-none rounded-full bg-[#8FCB98]" />
            Montaż serwera i kamer: umówimy termin telefonicznie.
          </span>
          <span className="flex items-start gap-2.5 text-sm leading-5 text-[#C9D0C6]">
            <span className="mt-1.5 size-2 flex-none rounded-full bg-[#8FCB98]" />
            Obroże przypiszemy do gospodarstwa. Włączysz je telefonem przez NFC.
          </span>
        </AsideCard>
      }
      footer={
        <>
          <span className="flex-1" />
          <ZButton type="button" size="lg" className="min-w-[220px]" onClick={() => onFinish()}>
            Przejdź do panelu gospodarstwa
            <ChevronRight className="size-[22px]" aria-hidden />
          </ZButton>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <IconBox className="size-16 rounded-[20px] bg-z-green-100 text-z-accent">
          <PartyPopper className="size-7" aria-hidden />
        </IconBox>
        <StepTitle
          title={`${farm.name} jest gotowe`}
          subtitle="Zostały kroki, które zrobisz w oborze albo w dowolnej chwili później."
        />
      </div>

      <section
        aria-labelledby="pk-h"
        className="flex flex-col gap-3 rounded-[20px] border border-z-line bg-z-surface px-5 pt-[18px] pb-2"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="pk-h" className="text-[17px] leading-6 font-semibold">
            Pierwsze kroki
          </h2>
          <span className="text-[13.5px] font-semibold text-z-ink-2">{doneText}</span>
        </div>
        <div
          role="img"
          aria-label={`Zrobione ${doneText}`}
          className="h-2 overflow-hidden rounded-full bg-z-bg-sunken"
        >
          <span
            className="block h-full rounded-full bg-z-accent transition-[width]"
            style={{ width: `${Math.round((okN / todo.length) * 100)}%` }}
          />
        </div>
        <ul className="-mx-4">
          {todo.map((t, i) => (
            <ListRow key={t.title} first={i === 0}>
              <span
                aria-hidden
                className={cn(
                  "grid size-7 flex-none place-items-center rounded-full",
                  t.ok ? "bg-z-accent text-z-on-ink" : "border-2 border-z-line-strong"
                )}
              >
                {t.ok ? <Check className="size-4" strokeWidth={3} /> : null}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <b className={cn("font-semibold", t.ok ? "text-z-ink-3" : "text-z-ink")}>
                  {t.title}
                  <span className="sr-only">{t.ok ? " — zrobione" : " — do zrobienia"}</span>
                </b>
                <span className="truncate text-xs leading-4 text-z-ink-3">{t.sub}</span>
              </span>
              {!t.ok && t.cta ? (
                <ZButton type="button" variant="light" className="min-h-10 px-3.5 text-[15px]" onClick={t.cta.onClick}>
                  {t.cta.label}
                </ZButton>
              ) : !t.ok ? (
                <ZChip>wkrótce</ZChip>
              ) : null}
            </ListRow>
          ))}
        </ul>
      </section>
    </SetupShell>
  )
}
