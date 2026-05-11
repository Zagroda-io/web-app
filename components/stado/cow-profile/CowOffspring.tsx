import { Card, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CowOffspring } from '@/lib/types/stado.types'

interface CowOffspringProps {
  offspring: CowOffspring[]
  onCowClick: (id: number) => void
}

export function CowOffspring({ offspring, onCowClick }: CowOffspringProps) {
  return (
    <Card className="border border-slate-200 shadow-sm overflow-hidden p-0 gap-0" size="sm">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b bg-slate-50/50">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Potomstwo
        </h3>
        <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold">
          {offspring.length}
        </Badge>
      </CardHeader>
      <div>
        {offspring.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4 text-center">
            Brak zarejestrowanego potomstwa.
          </div>
        ) : (
          offspring.map((calf) => (
            <div
              key={calf.id}
              className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => calf.cowId && onCowClick(calf.cowId)}
            >
              <div className="text-xl shrink-0">
                {calf.sex === 'female' ? '🐄' : '🐂'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold truncate">{calf.earTagNumber}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{calf.sex === 'female' ? 'Cieliczka' : 'Byczek'}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Urodz. {calf.birthDate}
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-slate-200 bg-slate-50 shrink-0">
                {calf.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
