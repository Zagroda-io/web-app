import { cn } from "@/lib/utils"
import { textToneClass, type TextTone } from "@/lib/theme/tone"
import { Eyebrow } from "./Eyebrow"

export interface Fact {
  label: string
  value: React.ReactNode
  sub?: React.ReactNode
  tone?: TextTone
}

/** Siatka kafelków z liczbami kluczowymi, rozdzielonych cienką linią. */
export function FactGrid({
  facts,
  className,
}: {
  facts: Fact[]
  className?: string
}) {
  return (
    <section
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px overflow-hidden rounded-xl border bg-border",
        className
      )}
    >
      {facts.map((fact) => (
        <div key={fact.label} className="min-w-0 bg-card px-3.5 py-3">
          <Eyebrow className="text-[11px]">{fact.label}</Eyebrow>
          {/* Wartość może być tekstem („Inseminowana 30.08"), więc zawija się zamiast urywać. */}
          <div
            className={cn(
              "mt-1 text-lg font-semibold tracking-[-0.2px] text-balance tabular-nums",
              textToneClass(fact.tone ?? "default")
            )}
          >
            {fact.value}
          </div>
          {fact.sub && (
            <div className="mt-px truncate text-xs text-muted-foreground">
              {fact.sub}
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
