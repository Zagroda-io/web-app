"use client"

import { Plus } from "lucide-react"
import { CategoryBadge } from "@/components/stado/shared/CategoryBadge"
import { AttentionDot } from "@/components/stado/shared/AttentionDot"
import { textToneClass } from "@/lib/theme/tone"
import { CATEGORY_META } from "@/lib/stado/labels"
import {
  lactationSummary,
  lastActivity,
  reproductionSummary,
  shortTag,
} from "@/lib/stado/presenters"
import { cn } from "@/lib/utils"
import type { Animal } from "@/lib/types/stado.types"

interface HerdTableRowProps {
  animal: Animal
  now: Date
  onOpen: (animal: Animal) => void
  onQuickAdd: (animal: Animal) => void
}

const cell = "px-2 py-2.5 align-middle"

export function HerdTableRow({
  animal,
  now,
  onOpen,
  onQuickAdd,
}: HerdTableRowProps) {
  const lactation = lactationSummary(animal)
  const reproduction = reproductionSummary(animal, now)
  const activity = lastActivity(animal, now)
  const name = animal.name || "Bez imienia"

  return (
    <tr
      tabIndex={0}
      aria-label={`Otwórz kartę: ${name} #${shortTag(animal.earTagNumber)}`}
      onClick={() => onOpen(animal)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) onOpen(animal)
      }}
      className="cursor-pointer border-t outline-none hover:bg-surface-hover focus-visible:bg-surface-hover"
    >
      <td className={cn(cell, "pl-3.5")}>
        <AttentionDot animal={animal} />
      </td>
      <td className={cell}>
        <div className="flex items-baseline gap-1.5">
          <span className="truncate font-semibold">{name}</span>
          <span className="font-mono text-xs text-muted-foreground">
            #{shortTag(animal.earTagNumber)}
          </span>
        </div>
        <div className="mt-px truncate font-mono text-[11px] text-muted-foreground/70">
          {[animal.earTagNumber, animal.breed, animal.ageLabel]
            .filter(Boolean)
            .join(" · ")}
        </div>
        {/* Na wąskim ekranie kolumny są ukryte — najważniejsze z nich wracają tutaj. */}
        <div
          className={cn(
            "mt-1 truncate text-xs sm:hidden",
            textToneClass(reproduction.tone)
          )}
        >
          {reproduction.label}
          {reproduction.detail && (
            <span className="text-muted-foreground">
              {" "}
              · {reproduction.detail}
            </span>
          )}
        </div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground md:hidden">
          {[
            animal.category && CATEGORY_META[animal.category].label,
            lactation.label !== "—" && lactation.label,
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </td>
      <td className={cn(cell, "hidden lg:table-cell")}>
        <CategoryBadge category={animal.category} />
      </td>
      <td className={cn(cell, "hidden md:table-cell")}>
        <div
          className={cn("truncate text-[13px]", textToneClass(lactation.tone))}
        >
          {lactation.label}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {lactation.detail}
        </div>
      </td>
      <td className={cn(cell, "hidden sm:table-cell")}>
        <div
          className={cn(
            "truncate text-[13px] font-medium",
            textToneClass(reproduction.tone)
          )}
        >
          {reproduction.label}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {reproduction.detail}
        </div>
      </td>
      <td className={cn(cell, "hidden xl:table-cell")}>
        <div className="truncate text-[13px]" title={activity.title}>
          {activity.title}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {activity.when}
        </div>
      </td>
      <td className={cn(cell, "pr-3.5 text-right")}>
        <button
          type="button"
          title="Dodaj zdarzenie"
          aria-label={`Dodaj zdarzenie: ${name}`}
          onClick={(e) => {
            e.stopPropagation()
            onQuickAdd(animal)
          }}
          onKeyDown={(e) => e.stopPropagation()}
          className="inline-flex size-7 items-center justify-center rounded-[7px] border bg-card text-foreground/75 transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="size-4" />
        </button>
      </td>
    </tr>
  )
}
