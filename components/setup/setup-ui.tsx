"use client"

/** Klocki ekranów konfiguracji (W5/W6), w tej samej palecie `z-*` co logowanie. */

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/** Lista rozwijana w obudowie pola 52 px (natywny <select> — klawiatura i czytniki ekranu za darmo). */
export function ZSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  options: readonly { value: string; label: string }[]
  placeholder?: string
  invalid?: boolean
}) {
  return (
    <span
      className={cn(
        "relative flex h-[52px] w-full items-center rounded-[14px] border bg-z-surface text-base text-z-ink transition-[border-color,box-shadow]",
        "focus-within:border-z-ink focus-within:shadow-[0_0_0_1px_var(--z-ink)]",
        invalid ? "border-z-red shadow-[0_0_0_1px_var(--z-red)]" : "border-z-line-strong"
      )}
    >
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={cn(
          "h-full w-full cursor-pointer appearance-none rounded-[14px] bg-transparent pr-10 pl-3.5 outline-none",
          !value && "text-z-ink-3"
        )}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 size-[18px] text-z-ink-3" aria-hidden />
    </span>
  )
}

/** Przełącznik segmentowy jako grupa radio (Typ hodowli). */
export function ZSegmented<T extends string>({
  labelledBy,
  options,
  value,
  onChange,
}: {
  labelledBy: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex gap-1 rounded-[14px] bg-z-bg-sunken p-1">
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[10px] px-2 text-[15px] font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-z-ink/25",
              on
                ? "bg-z-surface text-z-ink shadow-[0_1px_2px_rgba(17,26,20,.10),0_0_0_1px_rgba(17,26,20,.04)] dark:bg-z-raised dark:shadow-none"
                : "text-z-ink-3 hover:text-z-ink"
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/** Kafle wyboru (Ile masz krów?). */
export function ZOptionChips<T extends string>({
  labelledBy,
  options,
  value,
  onChange,
}: {
  labelledBy: string
  options: readonly { value: T; label: string }[]
  value: T | null
  onChange: (value: T) => void
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid grid-cols-4 gap-1.5">
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex h-[52px] cursor-pointer items-center justify-center rounded-full border px-1 text-sm font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-z-ink/25",
              on
                ? "border-z-ink bg-z-ink text-z-on-ink"
                : "border-z-line bg-z-surface text-z-ink hover:bg-z-bg-sunken"
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/** Przełącznik on/off. `locked` — zawsze włączony (alerty krytyczne). */
export function ZSwitch({
  checked,
  onChange,
  label,
  locked,
}: {
  checked: boolean
  onChange?: (checked: boolean) => void
  label: string
  locked?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-disabled={locked || undefined}
      onClick={() => !locked && onChange?.(!checked)}
      className={cn(
        "relative h-7 w-12 flex-none rounded-full outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-z-ink/25",
        checked ? "bg-z-switch" : "bg-z-line-strong",
        locked ? "cursor-default opacity-60" : "cursor-pointer"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-[3px] size-[22px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.2)] transition-[left]",
          checked ? "left-[23px]" : "left-[3px]"
        )}
      />
    </button>
  )
}

type ChipTone = "gray" | "green" | "amber"

export function ZChip({
  tone = "gray",
  className,
  children,
}: {
  tone?: ChipTone
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[26px] flex-none items-center gap-1.5 rounded-full px-2.5 text-[12.5px] leading-none font-semibold whitespace-nowrap tabular-nums",
        tone === "gray" && "bg-z-bg-sunken text-z-ink-2",
        tone === "green" && "bg-z-green-100 text-z-accent",
        tone === "amber" && "bg-z-amber-bg text-z-amber-ink",
        className
      )}
    >
      {children}
    </span>
  )
}

/** Kafelek ikony 44 px. */
export function IconBox({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex size-11 flex-none items-center justify-center rounded-[14px]", className)}>
      {children}
    </span>
  )
}

/** Żółty kolczyk z numerem — skrót komponentu „Kolczyk” z designu. */
export function EarTag({ number, size = "md" }: { number: string; size?: "md" | "lg" }) {
  const digits = number.replace(/^PL/i, "")
  return (
    <span
      aria-hidden
      className={cn(
        "flex flex-none flex-col items-center justify-center rounded-[10px] bg-z-tag font-mono leading-none text-[#151915]",
        size === "lg" ? "size-16 gap-1 rounded-[14px]" : "size-10 gap-0.5"
      )}
    >
      <span className={size === "lg" ? "text-[10px] font-semibold" : "text-[8px] font-semibold"}>PL</span>
      <span className={size === "lg" ? "text-[15px] font-bold" : "text-[11px] font-bold"}>
        {digits.slice(-4)}
      </span>
    </span>
  )
}

/** Wiersz listy w karcie (krowy, przełączniki, pierwsze kroki). */
export function ListRow({ first, className, children }: { first?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <li
      className={cn(
        "flex min-h-16 items-center gap-3 px-4 py-3",
        !first && "border-t border-z-line-soft",
        className
      )}
    >
      {children}
    </li>
  )
}

export function Micro({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-[11px] leading-[14px] font-semibold tracking-[.08em] text-z-ink-3 uppercase">
      {children}
    </h2>
  )
}
