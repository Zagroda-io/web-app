"use client"

import Link from "next/link"
import * as React from "react"
import {
  Bell,
  Calendar,
  CircleCheck,
  TriangleAlert,
  Users,
  Video,
} from "lucide-react"

import { ZagrodaLogo, ZagrodaMark } from "@/components/brand/zagroda-logo"

/**
 * Układ ekranów wejścia z designu (W1/W2): z lewej ciemnozielony panel marki,
 * z prawej formularz. Poniżej 960 px panel znika, a logo przechodzi nad formularz.
 */
export function AuthShell({
  aside,
  topRight,
  children,
}: {
  aside: React.ReactNode
  topRight: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh grid-cols-1 bg-z-bg font-sans text-[15px] leading-[22px] text-z-ink antialiased min-[960px]:grid-cols-2">
      {aside}
      <main className="flex min-w-0 flex-col p-4 min-[960px]:px-14 min-[960px]:pt-7 min-[960px]:pb-6">
        <div className="flex min-h-11 items-center gap-3">
          <Link href="/login" className="min-[960px]:hidden" aria-label="Zagroda — logowanie">
            <ZagrodaLogo size="sm" />
          </Link>
          <p className="ml-auto text-[15px] text-z-ink-2">{topRight}</p>
        </div>

        <div className="flex flex-1 items-center justify-center py-6">{children}</div>

        <footer className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 pt-3 text-[13.5px] leading-[19px] text-z-ink-3">
          <span>© {new Date().getFullYear()} Zagroda</span>
          <nav aria-label="Dokumenty" className="flex flex-wrap gap-5">
            <Link href="/terms" className="flex min-h-8 items-center hover:text-z-ink">
              Regulamin
            </Link>
            <Link href="/privacy" className="flex min-h-8 items-center hover:text-z-ink">
              Polityka prywatności
            </Link>
          </nav>
        </footer>
      </main>
    </div>
  )
}

function BrandAside({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <aside
      aria-label={label}
      className="m-4 mr-0 hidden flex-col gap-6 overflow-hidden rounded-[28px] bg-[#17241B] px-11 pt-9 pb-10 text-[#F2F4EF] min-[960px]:flex"
    >
      <span className="flex items-center gap-3">
        <ZagrodaMark size={44} labelled={false} />
        <span className="text-[22px] font-bold tracking-[-0.02em]">Zagroda</span>
      </span>
      {children}
    </aside>
  )
}

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex size-9 flex-none items-center justify-center rounded-[10px] bg-[#1E3325] text-[#8FCB98]">
      {children}
    </span>
  )
}

/** W1 — „Opieka nad stadem przez całą dobę”. */
export function LoginBrandAside() {
  return (
    <BrandAside label="O Zagrodzie">
      <div
        aria-hidden
        className="relative max-h-[460px] min-h-[260px] flex-[1_1_300px] overflow-hidden rounded-[20px] bg-[#0F1712]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- dekoracja, bez optymalizacji */}
        <img
          src="/auth/obora-kamera.jpg"
          alt=""
          className="absolute inset-0 block size-full object-cover object-[32%_50%]"
        />
        <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-[rgba(15,23,18,.8)] px-2.5 py-1 text-xs font-bold tracking-[.04em] text-white">
          <span className="size-2 animate-pulse rounded-full bg-[#F0624A] motion-reduce:animate-none" />
          NA ŻYWO · KOJEC PORODOWY
        </span>
        <span className="absolute bottom-4 left-4 flex w-[min(380px,calc(100%-32px))] gap-3 rounded-[18px] bg-white p-3.5 text-[#151915] shadow-[0_12px_32px_rgba(0,0,0,.35)]">
          <span className="inline-flex size-10 flex-none items-center justify-center rounded-xl bg-[#FBE5DF] text-[#962A18]">
            <TriangleAlert className="size-[18px]" />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-xs leading-4 text-[#5F655D]">Zagroda · teraz</span>
            <span className="text-[15px] leading-5 font-bold">Poród się przedłuża — #072 Kalina</span>
            <span className="text-[13.5px] leading-[19px] text-[#3F453E]">
              Brak postępu od 48 min. Sprawdź kojec.
            </span>
          </span>
        </span>
      </div>

      <h2 className="max-w-[520px] text-[40px] leading-[46px] font-bold tracking-[-0.03em] text-balance">
        Opieka nad stadem przez całą dobę
      </h2>
      <p className="max-w-[520px] text-[17px] leading-[26px] text-[#C9D0C6]">
        Kamery i obroże czuwają w oborze. Gdy krowa potrzebuje pomocy, alert trafia na telefon i
        do panelu w przeglądarce.
      </p>
      <ul className="grid grid-cols-3 gap-4">
        {[
          { icon: <Bell className="size-[18px]" />, text: "Alert na telefon, także w nocy" },
          { icon: <Video className="size-[18px]" />, text: "Kamera widzi, obroża wie, która to krowa" },
          { icon: <Calendar className="size-[18px]" />, text: "Terminy rozrodu liczą się same" },
        ].map((item) => (
          <li key={item.text} className="flex flex-col gap-2.5 text-sm leading-5 text-[#C9D0C6]">
            <FeatureIcon>{item.icon}</FeatureIcon>
            {item.text}
          </li>
        ))}
      </ul>
    </BrandAside>
  )
}

/** W2 — „Zacznij w trzech krokach”. */
export function RegisterBrandAside() {
  const steps = [
    { title: "Konto", text: "Teraz. Zajmie minutę." },
    {
      title: "Gospodarstwo i pierwsze krowy",
      text: "Nazwa, miejscowość, kilka krów na start. Około 3 minut.",
    },
    {
      title: "Obroże i kamery",
      text: "Przypiszemy je do Twojego gospodarstwa. Włączysz je telefonem, przykładając go do obroży.",
    },
  ]

  return (
    <BrandAside label="Jak zacząć">
      <div
        aria-hidden
        className="relative max-h-[420px] min-h-[240px] flex-[1_1_280px] overflow-hidden rounded-[20px] bg-[#0F1712]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- dekoracja, bez optymalizacji */}
        <img
          src="/auth/analiza-zdarzenia.jpg"
          alt=""
          className="absolute inset-0 block size-full object-cover object-[50%_75%]"
        />
        <span className="absolute bottom-4 left-4 flex w-[min(340px,calc(100%-32px))] flex-col gap-2.5 rounded-[18px] border border-[#2E4A36] bg-[rgba(15,23,18,.94)] px-4 py-3.5 text-[#F2F4EF]">
          <span className="flex justify-between text-[11px] font-bold tracking-[.08em] text-[#9AA597]">
            <span>ANALIZA ZDARZENIA</span>
            <span className="font-mono font-medium tracking-normal">kamera 2</span>
          </span>
          <span className="flex items-center gap-2.5 text-sm">
            <CircleCheck className="size-[18px] text-[#8FCB98]" />
            Krowa w kadrze
          </span>
          <span className="flex items-center gap-2.5 text-sm">
            <CircleCheck className="size-[18px] text-[#8FCB98]" />
            <span>
              Obroża ZG-0447 → <b className="font-bold">#047 Pestka</b>
            </span>
          </span>
          <span className="flex items-center gap-2.5 text-sm">
            <span className="size-[18px] rounded-full border-2 border-[#F4D51B]" />
            Analiza chodu
            <span className="ml-auto h-1 w-16 overflow-hidden rounded-sm bg-[#2E4A36]">
              <span className="block h-full w-[70%] bg-[#F4D51B]" />
            </span>
          </span>
        </span>
      </div>

      <h2 className="text-[36px] leading-[42px] font-bold tracking-[-0.03em] text-balance">
        Zacznij w trzech krokach
      </h2>
      <ol className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <li key={step.title} className="flex items-start gap-3.5">
            <span
              aria-hidden
              className={
                i === 0
                  ? "grid size-8 flex-none place-items-center rounded-full bg-[#8FCB98] text-[15px] font-bold text-[#0F1712]"
                  : "grid size-8 flex-none place-items-center rounded-full border-2 border-[#3A5A44] text-[15px] font-bold text-[#C9D0C6]"
              }
            >
              {i + 1}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[17px] leading-6 font-semibold">{step.title}</span>
              <span className="text-[15px] leading-[22px] text-[#C9D0C6]">{step.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="flex items-start gap-3 border-t border-[#2E4A36] pt-[18px] text-[15px] leading-[22px] text-[#C9D0C6]">
        <Users className="mt-0.5 size-[18px] flex-none text-[#8FCB98]" aria-hidden />
        <span>
          Dostałeś zaproszenie do czyjegoś gospodarstwa? Otwórz link z SMS-a. Założysz konto i od
          razu dołączysz do stada, bez dodawania nowego gospodarstwa.
        </span>
      </p>
    </BrandAside>
  )
}
