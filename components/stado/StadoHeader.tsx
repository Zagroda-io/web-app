import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { CowStatusFilter, HerdSummary } from "@/lib/types/stado.types"
import { AddCowSheet } from "./AddCowSheet"

interface StadoHeaderProps {
  summary: HerdSummary
  onSearchChange: (value: string) => void
  onFilterChange: (value: CowStatusFilter) => void
}

export function StadoHeader({
  summary,
  onSearchChange,
  onFilterChange,
}: StadoHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-0.5">
          <div className="text-[11px] font-semibold tracking-[0.08em] text-[#8A93A2] uppercase dark:text-muted-foreground/80">
            Podsumowanie stada
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-[-0.3px] text-[#131720] dark:text-foreground">
              Stado — {summary.totalCows} krów
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.activeAlertCount} aktywne alerty ·{" "}
            {summary.plannedInseminationCount} inseminacje zaplanowane
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj — numer, imię, kolczyk…"
              className="bg-white pl-9 dark:bg-input/30"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ToggleGroup
              type="single"
              defaultValue="all"
              onValueChange={(value) =>
                onFilterChange((value as CowStatusFilter) || "all")
              }
              className="justify-start"
            >
              <ToggleGroupItem
                value="all"
                className="data-[state=on]:bg-slate-100"
              >
                Wszystkie
              </ToggleGroupItem>
              <ToggleGroupItem
                value="alert"
                className="data-[state=on]:text-destructive-foreground data-[state=on]:bg-destructive"
              >
                Alerty
              </ToggleGroupItem>
              <ToggleGroupItem
                value="warn"
                className="data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700"
              >
                Ostrzeżenia
              </ToggleGroupItem>
              <ToggleGroupItem
                value="ok"
                className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
              >
                OK
              </ToggleGroupItem>
            </ToggleGroup>
            <AddCowSheet />
          </div>
        </div>
      </div>
    </div>
  )
}
