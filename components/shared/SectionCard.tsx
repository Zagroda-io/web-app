import { cn } from "@/lib/utils"
import { Eyebrow } from "./Eyebrow"

interface SectionCardProps extends Omit<
  React.ComponentProps<"section">,
  "title"
> {
  /** Tytuł w nagłówku karty (wersaliki). Bez tytułu karta nie ma nagłówka. */
  title?: React.ReactNode
  /** Treść po prawej stronie nagłówka, np. licznik albo akcja. */
  aside?: React.ReactNode
  bodyClassName?: string
}

/** Biała karta z opcjonalnym nagłówkiem — podstawowy blok ekranów Stada i karty krowy. */
export function SectionCard({
  title,
  aside,
  className,
  bodyClassName,
  children,
  ...props
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      {(title || aside) && (
        <header className="flex items-baseline justify-between gap-3 border-b px-3.5 py-3">
          {title && <Eyebrow as="h2">{title}</Eyebrow>}
          {aside && (
            <div className="text-xs text-muted-foreground">{aside}</div>
          )}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}
