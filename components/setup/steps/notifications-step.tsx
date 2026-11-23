"use client"

import * as React from "react"
import { Bell, ChevronLeft, Mail, MessageSquare, Monitor, Smartphone, TriangleAlert, Heart } from "lucide-react"

import { ZButton } from "@/components/auth/auth-ui"
import { AsideCard, SetupShell, StepTitle } from "@/components/setup/setup-shell"
import { IconBox, ListRow, Micro, ZChip, ZSwitch } from "@/components/setup/setup-ui"
import {
  getNotificationPrefs,
  saveNotificationPrefs,
  type NotificationPrefs,
} from "@/lib/setup/setup-state"

/**
 * W6 krok 3 — powiadomienia. Jak w aplikacji mobilnej ustawienia zostają na urządzeniu
 * (core-api nie ma jeszcze preferencji powiadomień); „W przeglądarce” prosi o zgodę przeglądarki.
 */
export function NotificationsStep({
  email,
  onBack,
  onDone,
}: {
  email: string | null
  onBack: () => void
  onDone: (enabled: boolean) => void
}) {
  const [prefs, setPrefs] = React.useState<NotificationPrefs>(() => getNotificationPrefs())
  const [busy, setBusy] = React.useState(false)
  const set = (key: keyof NotificationPrefs) => (value: boolean) =>
    setPrefs((p) => ({ ...p, [key]: value }))

  async function enable() {
    setBusy(true)
    let browser = prefs.browser
    if (browser && typeof window !== "undefined" && "Notification" in window) {
      try {
        browser = (await Notification.requestPermission()) === "granted"
      } catch {
        browser = false
      }
    }
    const next = { ...prefs, browser }
    saveNotificationPrefs(next, true)
    onDone(true)
  }

  function later() {
    saveNotificationPrefs(prefs, false)
    onDone(false)
  }

  return (
    <SetupShell
      step="notifications"
      aside={
        <AsideCard>
          <span className="text-sm text-[#9AA597]">Tak wyglądają alerty:</span>
          <span aria-hidden className="flex items-center gap-3 rounded-2xl bg-white p-3 text-[#151915]">
            <IconBox className="size-10 rounded-xl bg-[#FBE5DF] text-[#962A18]">
              <TriangleAlert className="size-[18px]" />
            </IconBox>
            <span className="flex min-w-0 flex-col">
              <b className="truncate text-[14.5px] font-bold">Poród się przedłuża — #072 Kalina</b>
              <span className="text-[13px] text-[#5F655D]">krytyczny · teraz</span>
            </span>
          </span>
          <span aria-hidden className="flex items-center gap-3 rounded-2xl bg-white p-3 text-[#151915]">
            <IconBox className="size-10 rounded-xl bg-[#EEE9FA] text-[#4F379C]">
              <Heart className="size-[18px]" />
            </IconBox>
            <span className="flex min-w-0 flex-col">
              <b className="truncate text-[14.5px] font-bold">#061 Bella — ruja</b>
              <span className="text-[13px] text-[#5F655D]">inseminuj dziś 11:00–17:00</span>
            </span>
          </span>
        </AsideCard>
      }
      footer={
        <>
          <ZButton type="button" variant="ghost" className="px-3 text-z-ink-2" onClick={onBack}>
            <ChevronLeft className="size-[22px]" aria-hidden />
            Wstecz
          </ZButton>
          <span className="flex-1" />
          <ZButton type="button" variant="ghost" className="text-[15px]" onClick={later}>
            Nie teraz
          </ZButton>
          <ZButton type="button" size="lg" className="min-w-[220px]" loading={busy} onClick={enable}>
            <Bell className="size-5" aria-hidden />
            Włącz powiadomienia
          </ZButton>
        </>
      }
    >
      <StepTitle
        title="Włącz powiadomienia"
        subtitle="Zagroda budzi Cię tylko wtedy, gdy krowa naprawdę potrzebuje pomocy."
      />

      <section aria-labelledby="co-h" className="flex flex-col gap-2.5">
        <Micro id="co-h">O czym powiadamiać</Micro>
        <ul className="overflow-hidden rounded-[20px] border border-z-line bg-z-surface">
          <ListRow first>
            <span className="flex min-w-0 flex-1 flex-col">
              <b className="font-semibold">Alerty krytyczne</b>
              <span className="text-[13.5px] leading-[19px] text-z-ink-3">poród, upadek · zawsze włączone</span>
            </span>
            <ZSwitch checked locked label="Alerty krytyczne, zawsze włączone" />
          </ListRow>
          <ListRow>
            <span className="flex min-w-0 flex-1 flex-col">
              <b className="font-semibold">Ruja i zdrowie</b>
              <span className="text-[13.5px] leading-[19px] text-z-ink-3">ruja, temperatura, spadek mleka</span>
            </span>
            <ZSwitch checked={prefs.reproductionAndHealth} onChange={set("reproductionAndHealth")} label="Ruja i zdrowie" />
          </ListRow>
          <ListRow>
            <span className="flex min-w-0 flex-1 flex-col">
              <b className="font-semibold">Plan dnia o 6:00</b>
              <span className="text-[13.5px] leading-[19px] text-z-ink-3">zadania na dziś w jednym powiadomieniu</span>
            </span>
            <ZSwitch checked={prefs.dailyPlan} onChange={set("dailyPlan")} label="Plan dnia o 6:00" />
          </ListRow>
        </ul>
      </section>

      <section aria-labelledby="gdzie-h" className="flex flex-col gap-2.5">
        <Micro id="gdzie-h">Gdzie</Micro>
        <ul className="overflow-hidden rounded-[20px] border border-z-line bg-z-surface">
          <ListRow first>
            <IconBox className="bg-z-bg-sunken text-z-ink-2">
              <Smartphone className="size-[22px]" aria-hidden />
            </IconBox>
            <span className="flex min-w-0 flex-1 flex-col">
              <b className="font-semibold">Aplikacja na telefonie</b>
              <span className="text-[13.5px] leading-[19px] text-z-ink-3">
                najszybsza droga dla alertów krytycznych · zaloguj się tym samym kontem
              </span>
            </span>
            <ZChip>link SMS-em wkrótce</ZChip>
          </ListRow>
          <ListRow>
            <IconBox className="bg-z-bg-sunken text-z-ink-2">
              <Monitor className="size-[22px]" aria-hidden />
            </IconBox>
            <span className="flex min-w-0 flex-1 flex-col">
              <b className="font-semibold">W przeglądarce</b>
              <span className="text-[13.5px] leading-[19px] text-z-ink-3">przeglądarka zapyta o zgodę</span>
            </span>
            <ZSwitch checked={prefs.browser} onChange={set("browser")} label="W przeglądarce" />
          </ListRow>
          <ListRow>
            <IconBox className="bg-z-bg-sunken text-z-ink-2">
              <MessageSquare className="size-[22px]" aria-hidden />
            </IconBox>
            <span className="flex min-w-0 flex-1 flex-col">
              <b className="font-semibold">SMS przy alercie krytycznym</b>
              <span className="text-[13.5px] leading-[19px] text-z-ink-3">
                na numer z konta · zapasowo, gdy nie odczytasz alertu
              </span>
            </span>
            <ZSwitch checked={prefs.sms} onChange={set("sms")} label="SMS przy alercie krytycznym" />
          </ListRow>
          <ListRow>
            <IconBox className="bg-z-bg-sunken text-z-ink-2">
              <Mail className="size-[22px]" aria-hidden />
            </IconBox>
            <span className="flex min-w-0 flex-1 flex-col">
              <b className="font-semibold">E-mail</b>
              <span className="truncate text-[13.5px] leading-[19px] text-z-ink-3">
                podsumowanie dnia{email ? ` na ${email}` : ""}
              </span>
            </span>
            <ZSwitch checked={prefs.email} onChange={set("email")} label="E-mail" />
          </ListRow>
        </ul>
      </section>
    </SetupShell>
  )
}
