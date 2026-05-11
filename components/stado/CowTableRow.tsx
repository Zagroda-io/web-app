import { ChevronRight } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'
import { CowStatusBadge } from './CowStatusBadge'
import { CowYieldMiniBar } from './CowYieldMiniBar'
import { cn } from '@/lib/utils'
import type { Cow } from '@/lib/types/stado.types'

interface CowTableRowProps {
  cow: Cow
  onClick: (id: number) => void
}

export function CowTableRow({ cow, onClick }: CowTableRowProps) {
  const getBcsColor = (bcs: number) => {
    if (bcs < 2.5) return 'text-destructive'
    if (bcs < 3.0) return 'text-amber-500'
    return 'text-green-600'
  }

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50 transition-colors group"
      onClick={() => onClick(cow.id)}
    >
      <TableCell className="w-8">
        <CowStatusBadge status={cow.status} mode="dot" />
      </TableCell>
      
      <TableCell>
        <div className="font-mono font-semibold text-slate-900">#{cow.id} {cow.name}</div>
        <div className="text-xs text-muted-foreground">{cow.ageLabel}</div>
      </TableCell>

      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
        {cow.earTagNumber}
      </TableCell>

      <TableCell className="text-sm">{cow.breed}</TableCell>
      
      <TableCell className="text-sm">{cow.ageLabel}</TableCell>
      
      <TableCell className="text-sm">{cow.lactationNumber}.</TableCell>

      <TableCell className={cn('text-sm font-semibold', getBcsColor(cow.bcs))}>
        {cow.bcs.toFixed(2)}
      </TableCell>

      <TableCell>
        <CowStatusBadge status={cow.status} mode="badge" />
      </TableCell>

      <TableCell className="max-w-[150px]">
        <div className="text-xs text-muted-foreground truncate" title={cow.lastAlertLabel}>
          {cow.lastAlertLabel}
        </div>
      </TableCell>

      <TableCell className="w-4">
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </TableCell>
    </TableRow>
  )
}
