import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CategoryBadge, LactationBadge } from "./AnimalBadges"
import type { Animal, PaginatedResponse } from "@/lib/types/stado.types"

interface CowTableProps {
  data?: PaginatedResponse<Animal>
  isLoading?: boolean
  onPageChange: (page: number) => void
  onSortChange: (sort: string) => void
  currentSort?: string
  onRowClick?: (cowId: string) => void
  onRowClickUrlBase?: string
}

export function CowTable({
  data,
  isLoading,
  onPageChange,
  onSortChange,
  currentSort,
  onRowClick,
  onRowClickUrlBase,
}: CowTableProps) {
  const animals = data?.content || []
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number || 0

  const handleSort = (column: string) => {
    if (currentSort === column) {
      onSortChange(`${column},desc`)
    } else if (currentSort === `${column},desc`) {
      onSortChange("")
    } else {
      onSortChange(column)
    }
  }

  const renderSortIcon = (column: string) => {
    return (
      <ArrowUpDown className={cn(
        "ml-2 h-3 w-3 transition-colors",
        currentSort?.startsWith(column) ? "text-primary" : "text-muted-foreground/50"
      )} />
    )
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden py-0 shadow-none" size="sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-muted/20">
              <TableRow className="hover:bg-transparent">
                <TableHead
                  className="cursor-pointer text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-muted-foreground uppercase"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Numer / Imię {renderSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-muted-foreground uppercase"
                  onClick={() => handleSort("earTagNumber")}
                >
                  <div className="flex items-center">
                    Kolczyk {renderSortIcon("earTagNumber")}
                  </div>
                </TableHead>
                <TableHead className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Kategoria
                </TableHead>
                <TableHead
                  className="cursor-pointer text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-muted-foreground uppercase"
                  onClick={() => handleSort("lactationStatus")}
                >
                  <div className="flex items-center">
                    Status {renderSortIcon("lactationStatus")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase"
                  onClick={() => handleSort("breed")}
                >
                  <div className="flex items-center">
                    Rasa {renderSortIcon("breed")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-muted-foreground uppercase"
                  onClick={() => handleSort("birthDate")}
                >
                  <div className="flex items-center">
                    Wiek {renderSortIcon("birthDate")}
                  </div>
                </TableHead>
                <TableHead className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Sensor
                </TableHead>
                <TableHead className="w-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : animals.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Brak zwierząt spełniających kryteria.
                  </TableCell>
                </TableRow>
              ) : (
                animals.map((animal) => (
                  <TableRow
                    key={animal.id}
                    className="group cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => {
                      if (onRowClickUrlBase) {
                        window.location.href = `${onRowClickUrlBase}/${animal.id}`
                      } else {
                        onRowClick?.(animal.id)
                      }
                    }}
                  >
                    <TableCell>
                      <div className="font-semibold text-foreground">
                        {animal.name || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                      {animal.earTagNumber}
                    </TableCell>
                    <TableCell>
                      <CategoryBadge category={animal.category} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <LactationBadge status={animal.lactationStatus} />
                        {animal.dryOffSuggested && (
                          <Badge
                            variant="outline"
                            className="border-amber-300 bg-amber-50 text-[10px] font-medium text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300"
                            title="Sugerowane zasuszenie"
                          >
                            Do zasuszenia
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{animal.breed}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                      {animal.ageLabel || animal.birthDate}
                    </TableCell>
                    <TableCell className="text-sm">
                      {animal.sensorId || "—"}
                    </TableCell>
                    <TableCell className="w-4">
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Strona {currentPage + 1} z {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={data?.first || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Poprzednia
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={data?.last || isLoading}
            >
              Następna
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

import { cn } from "@/lib/utils"
