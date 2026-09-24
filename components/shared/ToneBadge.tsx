import { cn } from "@/lib/utils"
import { TONE, type Tone } from "@/lib/theme/tone"

interface ToneBadgeProps {
  tone: Tone
  children: React.ReactNode
  /**
   * `pill` — etykieta z obramowaniem (kategoria, rasa);
   * `tag` — małe wersaliki bez obramowania (typ zdarzenia, rodzaj pozycji agendy).
   */
  variant?: "pill" | "tag"
  /** Neutralna pigułka na białym tle zamiast miękkiego tła tonu. */
  plain?: boolean
  className?: string
}

export function ToneBadge({
  tone,
  children,
  variant = "pill",
  plain,
  className,
}: ToneBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center rounded-full whitespace-nowrap",
        variant === "pill" && "border px-2 py-0.5 text-xs font-medium",
        variant === "tag" &&
          "px-[7px] py-0.5 text-[11px] font-semibold tracking-[0.04em] uppercase",
        plain ? "border-border bg-card text-foreground/80" : TONE[tone].soft,
        className
      )}
    >
      {children}
    </span>
  )
}
