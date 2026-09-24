"use client"

import { cn } from "@/lib/utils"
import { TONE, type Tone } from "@/lib/theme/tone"

interface CountChipProps {
  label: string
  count: number | null
  tone: Tone | "default"
  active: boolean
  onClick: () => void
}

/** Szybki filtr z licznikiem — np. „4 porody ≤ 14 dni". Pusty licznik jest przygaszony. */
export function CountChip({
  label,
  count,
  tone,
  active,
  onClick,
}: CountChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex h-9 items-center gap-2 rounded-[9px] border pr-3 pl-2.5 text-[13px] font-medium transition-[filter,opacity] hover:brightness-[.97]",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-card text-foreground",
        count === 0 && !active && "opacity-50"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-2 rounded-full",
          active
            ? "bg-primary-foreground"
            : tone === "default"
              ? "bg-foreground"
              : TONE[tone].dot
        )}
      />
      <span className="font-semibold tabular-nums">{count ?? "—"}</span>
      <span>{label}</span>
    </button>
  )
}
