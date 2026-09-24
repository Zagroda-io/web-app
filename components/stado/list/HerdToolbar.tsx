"use client"

import {
  SegmentedControl,
  type SegmentOption,
} from "@/components/shared/SegmentedControl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HERD_SORT_OPTIONS, type HerdSort } from "@/lib/stado/herd-list-query"
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  LACTATION_OPTIONS,
} from "@/lib/stado/labels"
import type { AnimalCategory, LactationStatus } from "@/lib/types/stado.types"

/** Radix Select i przełącznik nie przyjmują pustej wartości — „bez filtra" ma własny znacznik. */
const ALL = "all"

const CATEGORY_OPTIONS: SegmentOption<AnimalCategory | typeof ALL>[] = [
  { value: ALL, label: "Wszystkie" },
  ...CATEGORY_ORDER.map((category) => ({
    value: category,
    label: CATEGORY_META[category].plural,
  })),
]

interface HerdToolbarProps {
  category: AnimalCategory | null
  onCategoryChange: (category: AnimalCategory | null) => void
  lactation: LactationStatus | null
  onLactationChange: (lactation: LactationStatus | null) => void
  sort: HerdSort
  onSortChange: (sort: HerdSort) => void
  resultLabel: string | null
}

export function HerdToolbar({
  category,
  onCategoryChange,
  lactation,
  onLactationChange,
  sort,
  onSortChange,
  resultLabel,
}: HerdToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-3 py-2.5">
      <SegmentedControl
        ariaLabel="Kategoria"
        options={CATEGORY_OPTIONS}
        value={category ?? ALL}
        onChange={(value) => onCategoryChange(value === ALL ? null : value)}
        className="max-w-full overflow-x-auto"
      />
      <Select
        value={lactation ?? ALL}
        onValueChange={(value) =>
          onLactationChange(value === ALL ? null : (value as LactationStatus))
        }
      >
        <SelectTrigger
          aria-label="Status laktacji"
          className="h-8 bg-card text-[13px]"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Wszystkie statusy</SelectItem>
          {LACTATION_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="ml-auto flex items-center gap-2 text-[13px] text-muted-foreground">
        {resultLabel && <span aria-live="polite">{resultLabel}</span>}
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as HerdSort)}
        >
          <SelectTrigger
            aria-label="Sortowanie"
            className="h-8 bg-card text-[13px] text-foreground"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {HERD_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
