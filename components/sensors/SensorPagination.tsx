"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAGE_SIZES, rangeLabel } from "./sensor-list-query"

interface SensorPaginationProps {
  page: number
  size: number
  totalElements: number
  totalPages: number
  disabled?: boolean
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

export function SensorPagination({
  page,
  size,
  totalElements,
  totalPages,
  disabled,
  onPageChange,
  onSizeChange,
}: SensorPaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-slate-50/50 px-4 py-2 dark:bg-muted/20">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span aria-live="polite">{rangeLabel(page, size, totalElements)}</span>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Na stronie</span>
          <Select value={String(size)} onValueChange={(v) => onSizeChange(Number(v))}>
            <SelectTrigger size="sm" className="h-8 w-[72px] text-xs" aria-label="Liczba czujników na stronie">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Strona {page + 1} z {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            disabled={disabled || page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="mr-1 h-3.5 w-3.5" />
            Poprzednia
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            disabled={disabled || page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
          >
            Następna
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
