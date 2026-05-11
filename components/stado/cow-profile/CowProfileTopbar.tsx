import Link from "next/link"
import { ChevronLeft, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Cow } from "@/lib/types/stado.types"

interface CowProfileTopbarProps {
  cow: Cow
  onBack?: () => void
  onBackUrl?: string
  onEdit: () => void
  onAddEvent: () => void
}

export function CowProfileTopbar({
  cow,
  onBack,
  onBackUrl,
  onEdit,
  onAddEvent,
}: CowProfileTopbarProps) {
  const BackButton = () => (
    <Button variant="outline" size="sm" onClick={onBack} className="h-8">
      <ChevronLeft className="mr-1 h-4 w-4" />
      <span className="xs:inline hidden">Wróć do stada</span>
      <span className="xs:hidden">Powrót</span>
    </Button>
  )

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {onBackUrl ? (
          <Link href={onBackUrl}>
            <BackButton />
          </Link>
        ) : (
          <BackButton />
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="xs:inline hidden">Stado</span>
          <span className="xs:inline mx-2 hidden">›</span>
          <span className="font-semibold text-slate-900">
            #{cow.id} {cow.name}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-8 flex-1 sm:flex-none"
        >
          <Pencil className="mr-2 h-3.5 w-3.5" />
          Edytuj
        </Button>
        <Button
          size="sm"
          onClick={onAddEvent}
          className="h-8 flex-1 sm:flex-none"
        >
          <Plus className="mr-2 h-3.5 w-3.5" />
          Zdarzenie
        </Button>
      </div>
    </div>
  )
}
