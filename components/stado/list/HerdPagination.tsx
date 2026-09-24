"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { animalsCountLabel } from "@/lib/stado/presenters"

interface HerdPaginationProps {
  page: number
  totalPages: number
  totalElements: number
  disabled?: boolean
  onPageChange: (page: number) => void
}

export function HerdPagination({
  page,
  totalPages,
  totalElements,
  disabled,
  onPageChange,
}: HerdPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t px-3.5 py-2.5 text-[13px] text-muted-foreground">
      <span>
        Strona {page + 1} z {Math.max(1, totalPages)} ·{" "}
        {animalsCountLabel(totalElements)}
      </span>
      <div className="flex gap-1.5">
        <Button
          variant="outline"
          className="h-[30px] text-[13px]"
          disabled={disabled || page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Poprzednia
        </Button>
        <Button
          variant="outline"
          className="h-[30px] text-[13px]"
          disabled={disabled || page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Następna
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
