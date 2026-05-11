import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Cow } from '@/lib/types/stado.types'

interface CowIdCardProps {
  cow: Cow
}

export function CowIdCard({ cow }: CowIdCardProps) {
  const getBcsColor = (bcs: number) => {
    if (bcs < 2.5) return 'text-destructive'
    if (bcs < 3.0) return 'text-amber-600'
    if (bcs <= 3.75) return 'text-green-600'
    return 'text-amber-600'
  }

  const getYieldColor = (status: string) => {
    if (status === 'alert') return 'text-destructive'
    if (status === 'warn') return 'text-amber-600'
    return 'text-green-600'
  }

  return (
    <Card className="overflow-hidden mb-4 p-0 gap-0" size="sm">
      {/* Górna sekcja */}
      <div className="bg-slate-800 p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="rounded-xl bg-slate-700 w-12 h-12 flex items-center justify-center text-2xl">
            🐄
          </div>
          <div>
            <h2 className="text-2xl font-bold">#{cow.id} {cow.name}</h2>
            <p className="text-sm text-slate-300 font-mono">{cow.earTagNumber}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {cow.activeAlerts.length > 0 && (
            <Badge variant="destructive" className="bg-red-500 hover:bg-red-500">
              {cow.activeAlerts.length} aktywne alerty
            </Badge>
          )}
          {cow.status === 'dry' && (
            <Badge variant="secondary" className="bg-slate-600 text-slate-100 hover:bg-slate-600 border-none">
              Zasuszenie
            </Badge>
          )}
          <Badge variant="outline" className="text-slate-100 border-slate-600">
            {cow.breed}
          </Badge>
        </div>
      </div>

      {/* Dolna sekcja */}
      <div className="p-4 space-y-1">
        <DataField label="Wiek" value={cow.ageLabel} />
        <DataField label="Laktacja" value={`${cow.lactationNumber}. laktacja`} />
        <DataField 
          label="Wydajność dziś" 
          value={cow.status === 'dry' ? '—' : `${cow.yieldToday} l`} 
          valueClassName={cow.status === 'dry' ? '' : cn('font-bold', getYieldColor(cow.status))}
        />
        <DataField 
          label="BCS" 
          value={cow.bcs.toFixed(2)} 
          valueClassName={cn('font-bold', getBcsColor(cow.bcs))}
        />
        <DataField label="Rasa" value="Holstein-Friesian" />
      </div>
    </Card>
  )
}

function DataField({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('text-slate-900', valueClassName)}>{value}</span>
    </div>
  )
}
