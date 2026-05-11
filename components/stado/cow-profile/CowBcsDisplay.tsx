import { Card } from "@/components/ui/card"

interface CowBcsDisplayProps {
  bcs: number
}

export function CowBcsDisplay({ bcs }: CowBcsDisplayProps) {
  let bcsColor = "hsl(var(--green-600))"
  let bcsNote = "✓ W normie"

  if (bcs < 2.5) {
    bcsColor = "hsl(var(--destructive))"
    bcsNote = "⚠ Zbyt niska — ryzyko ketozy"
  } else if (bcs < 3.0) {
    bcsColor = "hsl(var(--amber-500))"
    bcsNote = "Uwaga — poniżej normy"
  } else if (bcs > 3.75) {
    bcsColor = "hsl(var(--amber-500))"
    bcsNote = "⚠ Zbyt wysoka — ryzyko otyłości"
  }

  return (
    <Card className="flex-1 p-4 shadow-none" size="sm">
      <h3 className="mb-4 text-[11px] font-semibold tracking-[0.08em] text-[#8A93A2] uppercase dark:text-muted-foreground/80">
        Ocena kondycji BCS
      </h3>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold" style={{ color: bcsColor }}>
          {bcs.toFixed(2)}
        </span>
        <span className="text-sm text-muted-foreground">/ 5.0</span>
      </div>

      <div className="my-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((seg) => (
          <div
            key={seg}
            className="h-1.5 flex-1 rounded-sm transition-colors duration-500"
            style={{
              background:
                bcs >= seg
                  ? bcsColor
                  : bcs > seg - 1 && bcs < seg
                    ? `linear-gradient(to right, ${bcsColor} ${(bcs - (seg - 1)) * 100}%, hsl(var(--muted)) 0%)`
                    : "hsl(var(--muted))",
            }}
          />
        ))}
      </div>

      <p className="text-xs font-medium" style={{ color: bcsColor }}>
        {bcsNote}
      </p>
    </Card>
  )
}
