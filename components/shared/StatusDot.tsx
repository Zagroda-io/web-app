import { cn } from "@/lib/utils"
import { TONE, type Tone } from "@/lib/theme/tone"

interface StatusDotProps {
  tone: Tone
  pulse?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  /** Opis dla czytników ekranu; bez niego kropka jest dekoracją. */
  label?: string
}

const SIZES = { sm: "size-2", md: "size-[9px]", lg: "size-3" }

export function StatusDot({
  tone,
  pulse,
  size = "md",
  className,
  label,
}: StatusDotProps) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "block shrink-0 rounded-full",
        SIZES[size],
        TONE[tone].dot,
        pulse && "animate-status-pulse",
        className
      )}
    />
  )
}
