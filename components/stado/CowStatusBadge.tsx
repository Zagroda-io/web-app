import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CowStatus } from '@/lib/types/stado.types'

interface CowStatusBadgeProps {
  status: CowStatus
  mode: 'dot' | 'badge'
}

export function CowStatusBadge({ status, mode }: CowStatusBadgeProps) {
  if (mode === 'dot') {
    const isPulsing = status === 'alert' || status === 'warn'
    return (
      <div
        className={cn(
          'w-2.5 h-2.5 rounded-full mx-auto',
          status === 'alert' && 'bg-destructive',
          status === 'warn' && 'bg-amber-400',
          status === 'ok' && 'bg-green-500',
          status === 'dry' && 'bg-slate-300',
          isPulsing && 'animate-pulse'
        )}
      />
    )
  }

  switch (status) {
    case 'alert':
      return <Badge variant="destructive">Alert</Badge>
    case 'warn':
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
          Ostrzeżenie
        </Badge>
      )
    case 'ok':
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
          OK
        </Badge>
      )
    case 'dry':
      return <Badge variant="secondary">Zasuszenie</Badge>
    default:
      return null
  }
}
