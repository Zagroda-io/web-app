/**
 * Tony semantyczne — jedyne miejsce, które tłumaczy znaczenie (krytyczny, ostrzeżenie…)
 * na klasy Tailwinda. Kolory definiuje app/globals.css (`--tone-*`, także w trybie ciemnym).
 *
 * Klasy są wypisane w całości (bez sklejania stringów), żeby Tailwind je wykrył.
 */
export type Tone =
  | "critical"
  | "warning"
  | "success"
  | "info"
  | "accent"
  | "neutral"

/** Ton tekstu: semantyczny albo zwykły/wyciszony. */
export type TextTone = Tone | "default" | "muted"

interface ToneClasses {
  /** Wypełnienie kropki / paska. */
  dot: string
  /** Tekst w kolorze tonu. */
  text: string
  /** Miękkie tło + tekst + obramowanie (pigułki, bannery). */
  soft: string
}

export const TONE: Record<Tone, ToneClasses> = {
  critical: {
    dot: "bg-tone-critical",
    text: "text-tone-critical-fg",
    soft: "bg-tone-critical-soft text-tone-critical-fg border-tone-critical-line",
  },
  warning: {
    dot: "bg-tone-warning",
    text: "text-tone-warning-fg",
    soft: "bg-tone-warning-soft text-tone-warning-fg border-tone-warning-line",
  },
  success: {
    dot: "bg-tone-success",
    text: "text-tone-success-fg",
    soft: "bg-tone-success-soft text-tone-success-fg border-tone-success-line",
  },
  info: {
    dot: "bg-tone-info",
    text: "text-tone-info-fg",
    soft: "bg-tone-info-soft text-tone-info-fg border-tone-info-line",
  },
  accent: {
    dot: "bg-tone-accent",
    text: "text-tone-accent-fg",
    soft: "bg-tone-accent-soft text-tone-accent-fg border-tone-accent-line",
  },
  neutral: {
    dot: "bg-tone-neutral",
    text: "text-tone-neutral-fg",
    soft: "bg-tone-neutral-soft text-tone-neutral-fg border-tone-neutral-line",
  },
}

export function textToneClass(tone: TextTone): string {
  if (tone === "default") return "text-foreground"
  if (tone === "muted") return "text-muted-foreground"
  return TONE[tone].text
}
