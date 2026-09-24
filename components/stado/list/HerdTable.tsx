"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type { Animal } from "@/lib/types/stado.types"
import { HerdTableRow } from "./HerdTableRow"

interface HerdTableProps {
  animals: Animal[] | null
  now: Date
  onOpen: (animal: Animal) => void
  onQuickAdd: (animal: Animal) => void
}

/**
 * Kolumny znikają wraz ze zwężaniem okna — to, co wypada, wiersz pokazuje pod imieniem
 * zwierzęcia. Dzięki temu tabela mieści się nawet na telefonie i nie przewija się w bok.
 */
const COLUMNS: { label: string; className: string }[] = [
  { label: "", className: "w-[22px] pl-3.5" },
  { label: "Zwierzę", className: "px-2 py-2" },
  { label: "Kategoria", className: "hidden px-2 py-2 lg:table-cell" },
  { label: "Laktacja", className: "hidden px-2 py-2 md:table-cell" },
  { label: "Rozród", className: "hidden px-2 py-2 sm:table-cell" },
  { label: "Ostatnie zdarzenie", className: "hidden px-2 py-2 xl:table-cell" },
  { label: "", className: "w-10 pr-3.5" },
]

export function HerdTable({
  animals,
  now,
  onOpen,
  onQuickAdd,
}: HerdTableProps) {
  return (
    <table className="w-full table-fixed border-collapse text-sm">
      <colgroup>
        <col className="w-[30px]" />
        <col />
        <col className="hidden lg:table-column lg:w-[110px]" />
        <col className="hidden md:table-column md:w-[150px]" />
        <col className="hidden sm:table-column sm:w-[26%]" />
        <col className="hidden xl:table-column xl:w-[22%]" />
        <col className="w-[52px]" />
      </colgroup>
      <thead>
        <tr className="text-left text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {COLUMNS.map((column, index) => (
            <th key={index} scope="col" className={column.className}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {animals === null ? (
          Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-t">
              <td colSpan={COLUMNS.length} className="px-3.5 py-3">
                <Skeleton className="h-8 w-full" />
              </td>
            </tr>
          ))
        ) : animals.length === 0 ? (
          <tr className="border-t">
            <td
              colSpan={COLUMNS.length}
              className="p-10 text-center text-muted-foreground"
            >
              Brak zwierząt spełniających kryteria.
            </td>
          </tr>
        ) : (
          animals.map((animal) => (
            <HerdTableRow
              key={animal.id}
              animal={animal}
              now={now}
              onOpen={onOpen}
              onQuickAdd={onQuickAdd}
            />
          ))
        )}
      </tbody>
    </table>
  )
}
