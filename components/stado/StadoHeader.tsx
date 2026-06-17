import { RefreshCcw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  AnimalCategory,
  HerdSummary,
  LactationStatus,
} from "@/lib/types/stado.types"
import { AddCowSheet } from "./new-animal/AddCowSheet"
import { InlineError } from "../shared/InlineError"

interface StadoHeaderProps {
  summary: HerdSummary
  error?: boolean
  onRetry?: () => void
  onSearchChange: (value: string) => void
  category?: AnimalCategory
  onCategoryChange: (value: AnimalCategory | undefined) => void
  lactationStatus?: LactationStatus
  onLactationChange: (value: LactationStatus | undefined) => void
}

const LACTATION_ALL = "all"

export function StadoHeader({
  summary,
  error,
  onRetry,
  onSearchChange,
  category,
  onCategoryChange,
  lactationStatus,
  onLactationChange,
}: StadoHeaderProps) {
  const displayValue = (val: number) => (isNaN(val) ? "—" : val)

  return (
    <div className="mb-6 flex flex-col gap-4 border-b pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Podsumowanie stada
            </div>
            {error && <InlineError onRetry={onRetry} />}
          </div>
          <h1 className="text-xl font-semibold tracking-[-0.3px] text-foreground">
            Stado — {displayValue(summary.totalCows)} szt.
          </h1>
          <p className="text-xs text-muted-foreground">
            {displayValue(summary.activeAlertCount)} aktywnych alertów ·{" "}
            {displayValue(summary.plannedInseminationCount)} inseminacji
            zaplanowanych
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj — numer, imię, kolczyk…"
                className="bg-background pl-9"
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            {error && onRetry && (
              <Button
                variant="outline"
                size="icon"
                onClick={onRetry}
                className="h-10 w-10 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                title="Odśwież dane"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            )}
          </div>

          <AddCowSheet />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          type="single"
          value={category ?? "all"}
          onValueChange={(value) =>
            onCategoryChange(
              !value || value === "all" ? undefined : (value as AnimalCategory)
            )
          }
          className="justify-start"
        >
          <ToggleGroupItem value="all">Wszystkie</ToggleGroupItem>
          <ToggleGroupItem value="COW">Krowy</ToggleGroupItem>
          <ToggleGroupItem value="HEIFER">Jałówki</ToggleGroupItem>
          <ToggleGroupItem value="CALF">Cielęta</ToggleGroupItem>
          <ToggleGroupItem value="BULL">Byki</ToggleGroupItem>
        </ToggleGroup>

        <Select
          value={lactationStatus ?? LACTATION_ALL}
          onValueChange={(value) =>
            onLactationChange(
              value === LACTATION_ALL ? undefined : (value as LactationStatus)
            )
          }
        >
          <SelectTrigger className="h-9 w-[190px]">
            <SelectValue placeholder="Status laktacji" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={LACTATION_ALL}>Wszystkie statusy</SelectItem>
            <SelectItem value="LACTATING">W laktacji</SelectItem>
            <SelectItem value="DRY">Zasuszone</SelectItem>
            <SelectItem value="NONE">Bez laktacji</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
