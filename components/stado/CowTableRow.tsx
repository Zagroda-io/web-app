import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { CowStatusBadge } from "./CowStatusBadge"
import { cn } from "@/lib/utils"
import type { Cow } from "@/lib/types/stado.types"

interface CowTableRowProps {
  cow: Cow
  onClick?: (id: number) => void
  onClickUrlBase?: string
}

export function CowTableRow({
  cow,
  onClick,
  onClickUrlBase,
}: CowTableRowProps) {
  const router = useRouter()
  const getBcsColor = (bcs: number) => {
    if (bcs < 2.5) return "text-destructive"
    if (bcs < 3.0) return "text-amber-500"
    return "text-green-600"
  }

  const RowContent = () => (
    <>
      <TableCell className="w-8">
        <CowStatusBadge status={cow.status} mode="dot" />
      </TableCell>

      <TableCell>
        <div className="font-mono font-semibold text-slate-900 dark:text-foreground">
          #{cow.id} {cow.name}
        </div>
        <div className="text-xs text-muted-foreground">{cow.ageLabel}</div>
      </TableCell>

      <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
        {cow.earTagNumber}
      </TableCell>

      <TableCell className="text-sm">{cow.breed}</TableCell>

      <TableCell className="text-sm">{cow.ageLabel}</TableCell>

      <TableCell className="text-sm">{cow.lactationNumber}.</TableCell>

      <TableCell className={cn("text-sm font-semibold", getBcsColor(cow.bcs))}>
        {cow.bcs.toFixed(2)}
      </TableCell>

      <TableCell>
        <CowStatusBadge status={cow.status} mode="badge" />
      </TableCell>

      <TableCell className="max-w-[150px]">
        <div
          className="truncate text-xs text-muted-foreground"
          title={cow.lastAlertLabel}
        >
          {cow.lastAlertLabel}
        </div>
      </TableCell>

      <TableCell className="w-4">
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </TableCell>
    </>
  )

  if (onClickUrlBase) {
    return (
      <TableRow
        className="group cursor-pointer transition-colors hover:bg-muted/50"
        onClick={() => {
          router.push(`${onClickUrlBase}/${cow.id}`)
        }}
      >
        <RowContent />
      </TableRow>
    )
  }

  return (
    <TableRow
      className="group cursor-pointer transition-colors hover:bg-muted/50"
      onClick={() => onClick?.(cow.id)}
    >
      <RowContent />
    </TableRow>
  )
}
