"use client"

/**
 * Klocki ekranów wejścia (W1 Logowanie, W2 Rejestracja) w stylu designu Zagrody:
 * pola 52 px, przyciski 48/56 px, zaokrąglenia 14–16 px, ciepła paleta `z-*` z globals.css.
 */

import * as React from "react"
import {
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  formatPhone,
  normalizePhone,
  PHONE_PREFIX,
  type PasswordStrength,
} from "@/lib/auth/validation"

/* ───────────── przyciski ───────────── */

type ButtonVariant = "dark" | "light" | "ghost"

export function zButtonClass({
  variant = "dark",
  size = "md",
  block = false,
}: {
  variant?: ButtonVariant
  size?: "md" | "lg"
  block?: boolean
} = {}) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap border font-semibold tracking-[-0.005em] transition-[background-color,opacity,box-shadow] outline-none",
    "focus-visible:ring-[3px] focus-visible:ring-z-ink/25 disabled:cursor-default disabled:opacity-45",
    size === "lg"
      ? "min-h-14 rounded-2xl px-5 text-[17px]"
      : "min-h-12 rounded-[14px] px-[18px] text-base",
    variant === "dark" && "border-transparent bg-z-ink text-z-on-ink hover:opacity-90",
    variant === "light" &&
      "border-z-line-strong bg-z-surface text-z-ink hover:bg-z-bg-sunken",
    variant === "ghost" && "border-transparent bg-transparent text-z-ink-2 hover:bg-z-bg-sunken",
    block && "w-full"
  )
}

export function ZButton({
  variant,
  size,
  block,
  loading,
  className,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: ButtonVariant
  size?: "md" | "lg"
  block?: boolean
  loading?: boolean
}) {
  return (
    <button
      className={cn(zButtonClass({ variant, size, block }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  )
}

/** Znak Google — w designie jest zaślepka do czasu podpięcia logowania przez Google. */
export function BrandMarkPlaceholder() {
  return (
    <span
      aria-hidden
      className="size-[18px] rounded-[5px] border-[1.5px] border-dashed border-z-line-strong"
    />
  )
}

/* ───────────── pola ───────────── */

export function ZField({
  label,
  hint,
  error,
  htmlFor,
  below,
  children,
}: {
  label: React.ReactNode
  hint?: React.ReactNode
  error?: string
  htmlFor: string
  below?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm leading-[18px] font-semibold text-z-ink-2">
        {label}
        {hint ? <span className="font-normal text-z-ink-3"> · {hint}</span> : null}
      </label>
      {children}
      {below}
      {error ? <FieldError id={`${htmlFor}-error`}>{error}</FieldError> : null}
    </div>
  )
}

export function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="flex items-center gap-1.5 text-[13.5px] leading-[19px] text-z-red-ink">
      <CircleAlert className="size-[15px] flex-none" aria-hidden />
      {children}
    </p>
  )
}

/** Obudowa pola: ramka, ikona/prefiks z lewej, akcja z prawej. */
export function ZInputBox({
  invalid,
  className,
  children,
}: {
  invalid?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "flex h-[52px] w-full items-center gap-2.5 rounded-[14px] border bg-z-surface px-3.5 text-base text-z-ink transition-[border-color,box-shadow]",
        "focus-within:border-z-ink focus-within:shadow-[0_0_0_1px_var(--z-ink)]",
        invalid
          ? "border-z-red shadow-[0_0_0_1px_var(--z-red)]"
          : "border-z-line-strong",
        className
      )}
    >
      {children}
    </span>
  )
}

const bareInput =
  "h-full min-w-0 flex-1 border-0 bg-transparent text-base text-z-ink outline-none placeholder:text-z-ink-3 disabled:opacity-60"

type InputProps = Omit<React.ComponentProps<"input">, "className"> & {
  invalid?: boolean
  icon?: React.ReactNode
}

export function ZInput({ invalid, icon, id, ...props }: InputProps) {
  return (
    <ZInputBox invalid={invalid}>
      {icon ? <span className="flex text-z-ink-3">{icon}</span> : null}
      <input
        id={id}
        className={bareInput}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        {...props}
      />
    </ZInputBox>
  )
}

export function ZPasswordInput({ invalid, icon, id, ...props }: Omit<InputProps, "type">) {
  const [visible, setVisible] = React.useState(false)
  return (
    <ZInputBox invalid={invalid} className="pr-1">
      {icon ? <span className="flex text-z-ink-3">{icon}</span> : null}
      <input
        id={id}
        type={visible ? "text" : "password"}
        className={bareInput}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ukryj hasło" : "Pokaż hasło"}
        aria-pressed={visible}
        className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-[12px] text-z-ink-3 outline-none hover:text-z-ink focus-visible:ring-2 focus-visible:ring-z-ink/25"
      >
        {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
      </button>
    </ZInputBox>
  )
}

/** Numer komórkowy z prefiksem +48; `value` i `onChange` operują na samych cyfrach. */
export function ZPhoneInput({
  value,
  onDigitsChange,
  invalid,
  id,
  ...props
}: Omit<InputProps, "value" | "onChange" | "type"> & {
  value: string
  onDigitsChange: (digits: string) => void
}) {
  return (
    <ZInputBox invalid={invalid}>
      <span className="font-semibold text-z-ink-2">{PHONE_PREFIX}</span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        className={bareInput}
        value={formatPhone(value)}
        onChange={(e) => onDigitsChange(normalizePhone(e.target.value))}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        {...props}
      />
    </ZInputBox>
  )
}

/* ───────────── kod SMS ───────────── */

/** Sześć pól kodu; pod spodem jedno prawdziwe pole (wklejanie, autouzupełnianie z SMS-a). */
export function CodeInput({
  value,
  onChange,
  length = 6,
  disabled,
  invalid,
  labelledBy,
}: {
  value: string
  onChange: (code: string) => void
  length?: number
  disabled?: boolean
  invalid?: boolean
  labelledBy?: string
}) {
  const [focused, setFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, length))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        disabled={disabled}
        aria-labelledby={labelledBy}
        aria-invalid={invalid || undefined}
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
      />
      <div aria-hidden className="grid grid-cols-6 gap-2">
        {Array.from({ length }, (_, i) => {
          const char = value[i]
          const active = focused && i === Math.min(value.length, length - 1)
          return (
            <span
              key={i}
              className={cn(
                "flex h-[60px] items-center justify-center rounded-[14px] border bg-z-surface font-mono text-2xl font-semibold text-z-ink",
                active
                  ? "border-2 border-z-ink"
                  : invalid
                    ? "border-z-red"
                    : "border-z-line-strong"
              )}
            >
              {char ??
                (active ? (
                  <span className="h-[26px] w-0.5 animate-pulse bg-z-ink" />
                ) : null)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ───────────── pozostałe ───────────── */

export function OrDivider({ children = "lub" }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[13.5px] leading-[19px] text-z-ink-3">
      <span className="h-px flex-1 bg-z-line" />
      {children}
      <span className="h-px flex-1 bg-z-line" />
    </div>
  )
}

const strengthLabels = ["", "Słabe", "Dobre", "Silne"] as const
const PASSWORD_RULE = "min. 8 znaków, w tym cyfra"

/** Trzy kreski siły hasła pod polem „Hasło” — jak w aplikacji mobilnej. */
export function PasswordStrengthMeter({ strength }: { strength: PasswordStrength }) {
  const hint =
    strength === 0 ? `Hasło: ${PASSWORD_RULE}` : `${strengthLabels[strength]} · ${PASSWORD_RULE}`
  return (
    <span className="flex items-center gap-2" aria-live="polite">
      <span aria-hidden className="flex w-24 gap-[3px]">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={cn(
              "h-1 flex-1 rounded-sm",
              step > strength ? "bg-z-line-strong" : strength === 1 ? "bg-z-red" : "bg-z-accent"
            )}
          />
        ))}
      </span>
      <span className="text-xs text-z-ink-3">
        <span className="sr-only">Siła hasła: </span>
        {hint}
      </span>
    </span>
  )
}

/** Kwadratowe pole wyboru z designu (22 px, obszar kliknięcia 44 px). */
export function ZCheckbox({
  checked,
  onCheckedChange,
  invalid,
  id,
  describedBy,
  children,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  invalid?: boolean
  id: string
  describedBy?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-0.5">
      <span className="relative flex size-11 flex-none items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
        />
        <span
          aria-hidden
          className={cn(
            "flex size-[22px] items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-[3px] peer-focus-visible:ring-z-ink/25",
            checked
              ? "border-z-ink bg-z-ink text-z-on-ink"
              : invalid
                ? "border-z-red bg-z-surface text-transparent"
                : "border-z-line-strong bg-z-surface text-transparent"
          )}
        >
          <svg viewBox="0 0 24 24" className="size-[15px]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      </span>
      <label htmlFor={id} className="cursor-pointer pt-[11px] text-[14.5px] leading-[21px] text-z-ink-2">
        {children}
      </label>
    </div>
  )
}

/** Błąd całego formularza (odpowiedź API). */
export function FormAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-[14px] border border-z-red-line bg-z-red-bg px-3.5 py-3 text-[14.5px] leading-[21px] text-z-red-ink"
    >
      <CircleAlert className="mt-0.5 size-[18px] flex-none" aria-hidden />
      <span>{message}</span>
    </div>
  )
}

/** Link w treści — zielony, podkreślony (w ciemnym motywie jasnozielony). */
export const zLinkClass =
  "font-semibold text-z-link underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-z-link rounded-sm"
