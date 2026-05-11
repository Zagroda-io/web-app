import { cn } from '@/lib/utils'
import type { CowSire, CowDam } from '@/lib/types/stado.types'

interface CowPedigreeProps {
  sire: CowSire
  dam: CowDam
  onCowClick: (id: number) => void
}

export function CowPedigree({ sire, dam, onCowClick }: CowPedigreeProps) {
  return (
    <div className="space-y-4 mb-4">
      <div className="px-1 text-[11px] font-semibold tracking-[0.08em] text-[#8A93A2] uppercase dark:text-muted-foreground/80">
        Rodowód
      </div>
      
      {/* Ojciec */}
      <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors border-l-2 border-l-blue-400">
        <div className="w-7 text-center text-blue-600 font-bold text-lg">♂</div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs font-bold truncate">{sire.identifier}</div>
          <div className="text-xs text-muted-foreground truncate">{sire.name}</div>
        </div>
        {sire.whIndex && (
          <div className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
            {sire.whIndex}
          </div>
        )}
      </div>

      {/* Matka */}
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border bg-muted/30 transition-colors border-l-2 border-l-amber-400",
          dam.cowId ? "hover:bg-muted/60 cursor-pointer" : ""
        )}
        onClick={() => dam.cowId && onCowClick(dam.cowId)}
      >
        <div className="w-7 text-center text-amber-600 font-bold text-lg">♀</div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs font-bold truncate">{dam.identifier}</div>
          <div className="text-xs text-muted-foreground truncate">{dam.name}</div>
        </div>
        {dam.note && (
          <div className="text-[10px] text-muted-foreground whitespace-nowrap">
            {dam.note}
          </div>
        )}
      </div>
    </div>
  )
}
