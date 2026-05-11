import Link from "next/link"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CowOffspring } from "@/lib/types/stado.types"

interface CowOffspringProps {
  offspring: CowOffspring[]
  onCowClick?: (id: number) => void
  onCowClickUrlBase?: string
}

interface CalfItemProps {
  calf: CowOffspring
  onCowClick?: (id: number) => void
  onCowClickUrlBase?: string
}

function CalfItem({ calf, onCowClick, onCowClickUrlBase }: CalfItemProps) {
  return (
    <div
      className="flex cursor-pointer items-center gap-3 border-b px-4 py-2.5 transition-colors first:pt-4 last:border-0 last:pb-4 hover:bg-muted/50"
      onClick={() =>
        !onCowClickUrlBase && calf.cowId && onCowClick?.(calf.cowId)
      }
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
        className="shrink-0 px-1.5 py-0 text-[10px]"
      >
        {calf.status}
      </Badge>
    </div>
  )
}

interface CardContentProps {
  offspring: CowOffspring[]
  onCowClick?: (id: number) => void
  onCowClickUrlBase?: string
}

function CardContent({
  offspring,
  onCowClick,
  onCowClickUrlBase,
}: CardContentProps) {
  return (
    <div>
      {offspring.length === 0 ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          Brak zarejestrowanego potomstwa.
        </div>
      ) : (
        offspring.map((calf) => {
          return calf.cowId && onCowClickUrlBase ? (
            <Link key={calf.id} href={`${onCowClickUrlBase}/${calf.cowId}`}>
              <CalfItem
                calf={calf}
                onCowClick={onCowClick}
                onCowClickUrlBase={onCowClickUrlBase}
              />
            </Link>
          ) : (
            <CalfItem
              key={calf.id}
              calf={calf}
              onCowClick={onCowClick}
              onCowClickUrlBase={onCowClickUrlBase}
            />
          )
        })
      )}
    </div>
  )
}

export function CowOffspring({
  offspring,
  onCowClick,
  onCowClickUrlBase,
}: CowOffspringProps) {

  return (
    <Card
      className="gap-0 overflow-hidden p-0 py-0 shadow-none data-[size=sm]:py-0"
      size="sm"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-4 py-3 dark:bg-muted/20">
        <h3 className="text-[11px] font-semibold tracking-[0.08em] text-[#8A93A2] uppercase dark:text-muted-foreground/80">
          Potomstwo
        </h3>
        <Badge
          variant="outline"
          className="h-5 rounded-[20px] border-none bg-slate-100 px-2 text-[10px] font-bold text-slate-600 dark:bg-muted/50 dark:text-muted-foreground"
        >
          {offspring.length}
        </Badge>
      </CardHeader>
      <CardContent
        offspring={offspring}
        onCowClick={onCowClick}
        onCowClickUrlBase={onCowClickUrlBase}
      />
    </Card>
  )
}
