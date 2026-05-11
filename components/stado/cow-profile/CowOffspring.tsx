import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CowOffspring } from "@/lib/types/stado.types"

interface CowOffspringProps {
  offspring: CowOffspring[]
  onCowClick: (id: number) => void
}

export function CowOffspring({ offspring, onCowClick }: CowOffspringProps) {
  return (
    <Card
      className="gap-0 overflow-hidden p-0 py-0 shadow-none data-[size=sm]:py-0"
      size="sm"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-4 py-3">
        <h3 className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          Potomstwo
        </h3>
        <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold">
          {offspring.length}
        </Badge>
      </CardHeader>
      <div>
        {offspring.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Brak zarejestrowanego potomstwa.
          </div>
        ) : (
          offspring.map((calf) => (
            <div
              key={calf.id}
              className="flex cursor-pointer items-center gap-3 border-b px-4 py-2.5 transition-colors last:border-0 hover:bg-muted/50"
              onClick={() => calf.cowId && onCowClick(calf.cowId)}
            >
              <div className="shrink-0 text-xl">
                {calf.sex === "female" ? "🐄" : "🐂"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-mono text-xs font-bold">
                    {calf.earTagNumber}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    {calf.sex === "female" ? "Cieliczka" : "Byczek"}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Urodz. {calf.birthDate}
                </div>
              </div>
              <Badge
                variant="outline"
                className="shrink-0 border-slate-200 bg-slate-50 px-1.5 py-0 text-[10px]"
              >
                {calf.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
