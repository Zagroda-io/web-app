import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type {
  AnimalCategory,
  LactationStatus,
  Sex,
} from "@/lib/types/stado.types"

export const CATEGORY_LABELS: Record<AnimalCategory, string> = {
  CALF: "Cielę",
  HEIFER: "Jałówka",
  COW: "Krowa",
  BULL: "Byk",
}

export const LACTATION_LABELS: Record<LactationStatus, string> = {
  LACTATING: "W laktacji",
  DRY: "Zasuszona",
  NONE: "—",
}

export const SEX_LABELS: Record<Sex, string> = {
  FEMALE: "Samica",
  MALE: "Samiec",
}

const categoryStyles: Record<AnimalCategory, string> = {
  CALF: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/40",
  HEIFER:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-900/40",
  COW: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40",
  BULL: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700/40",
}

const lactationStyles: Record<LactationStatus, string> = {
  LACTATING:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900/40",
  DRY: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40",
  NONE: "bg-muted text-muted-foreground border-border",
}

export function CategoryBadge({
  category,
  className,
}: {
  category: AnimalCategory | null | undefined
  className?: string
}) {
  if (!category) return <span className="text-muted-foreground">—</span>
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", categoryStyles[category], className)}
    >
      {CATEGORY_LABELS[category]}
    </Badge>
  )
}

export function LactationBadge({
  status,
  className,
}: {
  status: LactationStatus | null | undefined
  className?: string
}) {
  if (!status || status === "NONE")
    return <span className="text-muted-foreground">—</span>
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", lactationStyles[status], className)}
    >
      {LACTATION_LABELS[status]}
    </Badge>
  )
}
