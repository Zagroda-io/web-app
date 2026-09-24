import { cn } from "@/lib/utils"

/** Nagłówek sekcji w wersalikach — wspólny dla kart, pasków i tabel. */
export function Eyebrow({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode
  className?: string
  as?: "div" | "h2" | "h3" | "span"
}) {
  return (
    <Tag
      className={cn(
        "text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </Tag>
  )
}
