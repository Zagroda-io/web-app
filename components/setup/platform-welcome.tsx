"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"

import { ZagrodaMark } from "@/components/brand/zagroda-logo"
import { formatFarmLocation } from "@/lib/setup/farm-form"

/** Tyle co najmniej trwa powitanie — dość, żeby przeczytać, za mało, żeby się nudzić. */
const MIN_MS = 2600
const MIN_MS_REDUCED = 1600
/** Gdy API długo nie odpowiada, i tak przechodzimy do panelu (dane dociągną się w tle). */
const MAX_MS = 8000

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Ostatni ekran konfiguracji: „Witaj w platformie Zagroda”. Leży nad panelem, który
 * ładuje się pod spodem; gdy minie chwila i dane konta są świeże, wygasa i odsłania panel.
 * Rodzic trzyma go w <AnimatePresence>, żeby wygaszanie (exit) zdążyło się odegrać.
 */
export function PlatformWelcome({
  farmName,
  farmLocation,
  ready,
  onCovered,
  onDone,
}: {
  farmName: string | null
  farmLocation?: string | null
  /** Dane konta po konfiguracji są już wczytane (nowe gospodarstwo w sidebarze). */
  ready: boolean
  /** Nakładka w pełni zakryła ekran — można pod nią podmienić konfigurację na panel. */
  onCovered?: () => void
  onDone: () => void
}) {
  const reduced = useReducedMotion()
  const minMs = reduced ? MIN_MS_REDUCED : MIN_MS
  const [minElapsed, setMinElapsed] = React.useState(false)
  const doneRef = React.useRef(onDone)

  React.useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  React.useEffect(() => {
    const min = setTimeout(() => setMinElapsed(true), minMs)
    const max = setTimeout(() => doneRef.current(), MAX_MS)
    return () => {
      clearTimeout(min)
      clearTimeout(max)
    }
  }, [minMs])

  React.useEffect(() => {
    if (minElapsed && ready) doneRef.current()
  }, [minElapsed, ready])

  const location = formatFarmLocation(farmLocation)
  const rise = (delay: number) =>
    reduced
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3, delay },
        }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease },
        }

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: reduced ? 0.25 : 0.7, ease },
      }}
      transition={{ duration: reduced ? 0.2 : 0.45, ease }}
      onAnimationComplete={(definition) => {
        // Tylko po wejściu (animate), nie po wyjściu (exit).
        if (
          typeof definition === "object" &&
          definition &&
          "opacity" in definition &&
          definition.opacity === 1
        ) {
          onCovered?.()
        }
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-[#17241B] px-6 font-sans text-[#F2F4EF] antialiased"
    >
      {/* Miękka poświata za znakiem. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[720px] -translate-x-1/2 -translate-y-[62%] rounded-full bg-[radial-gradient(circle,rgba(143,203,152,.16)_0%,rgba(143,203,152,0)_62%)]"
      />

      <motion.div
        exit={
          reduced
            ? undefined
            : { scale: 1.04, y: -8, transition: { duration: 0.7, ease } }
        }
        className="relative flex w-full max-w-[520px] flex-col items-center gap-6 text-center"
      >
        <motion.span
          className="relative"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={
            reduced
              ? { duration: 0.3 }
              : { type: "spring", stiffness: 220, damping: 18 }
          }
        >
          <ZagrodaMark size={88} labelled={false} />
          <motion.span
            aria-hidden
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={
              reduced
                ? { duration: 0.3, delay: 0.2 }
                : { type: "spring", stiffness: 380, damping: 16, delay: 0.45 }
            }
            className="absolute -right-2 -bottom-2 grid size-9 place-items-center rounded-full border-4 border-[#17241B] bg-[#8FCB98] text-[#0F1712]"
          >
            <Check className="size-[18px]" strokeWidth={3} />
          </motion.span>
        </motion.span>

        <motion.div {...rise(0.3)} className="flex flex-col gap-3">
          <h1 className="text-[36px] leading-[42px] font-bold tracking-[-0.03em] text-balance sm:text-[44px] sm:leading-[50px]">
            Witaj w platformie Zagroda
          </h1>
          <p className="text-lg leading-7 text-[#C7DDBD]">
            Twoje gospodarstwo zostało dodane.
          </p>
        </motion.div>

        {farmName ? (
          <motion.span
            {...rise(0.5)}
            className="flex max-w-full items-center gap-3 rounded-[18px] border border-[#2E4A36] bg-[#0F1712] py-3 pr-5 pl-3 text-left"
          >
            <ZagrodaMark size={40} labelled={false} />
            <span className="flex min-w-0 flex-col">
              <b className="truncate text-base font-semibold">{farmName}</b>
              {location ? (
                <span className="truncate text-[13px] text-[#9AA597]">
                  {location}
                </span>
              ) : null}
            </span>
          </motion.span>
        ) : null}

        <motion.div
          {...rise(0.7)}
          className="flex w-full max-w-[280px] flex-col items-center gap-2.5 pt-2"
        >
          <span
            aria-hidden
            className="h-1 w-full overflow-hidden rounded-full bg-[#2E4A36]"
          >
            <motion.span
              className="block h-full rounded-full bg-[#8FCB98]"
              initial={{ width: "0%" }}
              animate={{ width: ready && minElapsed ? "100%" : "88%" }}
              transition={{ duration: (minMs - 300) / 1000, ease: "easeOut" }}
            />
          </span>
          <span className="text-sm text-[#9AA597]">
            Przygotowujemy Twój panel…
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
