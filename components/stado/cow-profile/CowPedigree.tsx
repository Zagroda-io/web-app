import Link from "next/link"
import { cn } from "@/lib/utils"
import type { CowDam, CowSire } from "@/lib/types/stado.types"

interface CowPedigreeProps {
  sire: CowSire
  dam: CowDam
  onCowClick?: (id: number) => void
  onCowClickUrlBase?: string
}

interface DamCardProps {
  dam: CowDam
  onCowClick?: (id: number) => void
  onCowClickUrlBase?: string
}

function DamCard({ dam, onCowClick, onCowClickUrlBase }: DamCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-l-2 border-l-amber-400 bg-muted/30 p-3 transition-colors",
        dam.cowId ? "cursor-pointer hover:bg-muted/60" : ""
      )}
      onClick={() => !onCowClickUrlBase && dam.cowId && onCowClick?.(dam.cowId)}
    >
      <div className="w-7 text-center text-lg font-bold text-amber-600">♀</div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-xs font-bold">
          {dam.identifier}
        </div>
        <div className="truncate text-xs text-muted-foreground">{dam.name}</div>
      </div>
      {dam.note && (
        <div className="text-[10px] whitespace-nowrap text-muted-foreground">
          {dam.note}
        </div>
      )}
    </div>
  )
}

export function CowPedigree({
  sire,
  dam,
  onCowClick,
  onCowClickUrlBase,
}: CowPedigreeProps) {
  return (
    <div className="mb-4 space-y-4">
      <div className="px-1 text-[11px] font-semibold tracking-[0.08em] text-[#8A93A2] uppercase dark:text-muted-foreground/80">
        Rodowód
      </div>

      {/* Ojciec */}
      <div className="flex items-center gap-3 rounded-lg border border-l-2 border-l-blue-400 bg-muted/30 p-3 transition-colors hover:bg-muted/60">
        <div className="w-7 text-center text-lg font-bold text-blue-600">♂</div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-mono text-xs font-bold">
            {sire.identifier}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {sire.name}
          </div>
        </div>
        {sire.whIndex && (
          <div className="rounded border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
            {sire.whIndex}
          </div>
        )}
      </div>

      {/* Matka */}
      {dam.cowId && onCowClickUrlBase ? (
        <Link href={`${onCowClickUrlBase}/${dam.cowId}`}>
          <DamCard
            dam={dam}
            onCowClick={onCowClick}
            onCowClickUrlBase={onCowClickUrlBase}
          />
        </Link>
      ) : (
        <DamCard
          dam={dam}
          onCowClick={onCowClick}
          onCowClickUrlBase={onCowClickUrlBase}
        />
      )}
    </div>
  )
}
