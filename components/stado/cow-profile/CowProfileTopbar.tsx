import { ChevronLeft, Pencil, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Cow } from '@/lib/types/stado.types'

interface CowProfileTopbarProps {
  cow: Cow
  onBack: () => void
  onEdit: () => void
  onAddEvent: () => void
}

export function CowProfileTopbar({ cow, onBack, onEdit, onAddEvent }: CowProfileTopbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="h-8">
          <ChevronLeft className="mr-1 h-4 w-4" />
          <span className="hidden xs:inline">Wróć do stada</span>
          <span className="xs:hidden">Powrót</span>
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="hidden xs:inline">Stado</span> 
          <span className="mx-2 hidden xs:inline">›</span> 
          <span className="font-semibold text-slate-900">#{cow.id} {cow.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onEdit} className="h-8 flex-1 sm:flex-none">
          <Pencil className="mr-2 h-3.5 w-3.5" />
          Edytuj
        </Button>
        <Button size="sm" onClick={onAddEvent} className="h-8 flex-1 sm:flex-none">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Zdarzenie
        </Button>
      </div>
    </div>
  )
}
