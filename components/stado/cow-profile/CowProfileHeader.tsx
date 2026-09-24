"use client"

import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToneBadge } from "@/components/shared/ToneBadge"
import { AttentionDot } from "@/components/stado/shared/AttentionDot"
import { CategoryBadge } from "@/components/stado/shared/CategoryBadge"
import { formatDate } from "@/lib/stado/dates"
import { breedLabel } from "@/lib/stado/labels"
import { shortTag } from "@/lib/stado/presenters"
import type { AnimalDetails, AnimalEventType } from "@/lib/types/stado.types"

interface CowProfileHeaderProps {
  animal: AnimalDetails
  backHref: string
  onAddEvent: (type: AnimalEventType) => void
}

/** Szybkie akcje najczęstszych zdarzeń; pełna lista typów jest w dialogu. */
const QUICK_EVENTS: { type: AnimalEventType; label: string }[] = [
  { type: "ESTRUS", label: "Ruja" },
  { type: "INSEMINATION", label: "Inseminacja" },
  { type: "VET", label: "Leczenie" },
]

export function CowProfileHeader({
  animal,
  backHref,
  onAddEvent,
}: CowProfileHeaderProps) {
  return (
    <>
      <Link
        href={backHref}
        className="flex w-fit items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" />
        Stado
      </Link>
      <header className="flex flex-wrap items-start gap-4">
        <div className="mr-auto flex min-w-0 items-center gap-3.5">
          <AttentionDot animal={animal} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-[26px] font-semibold tracking-[-0.4px]">
                {animal.name || "Bez imienia"}
              </h1>
              <span className="font-mono text-[15px] text-muted-foreground">
                #{shortTag(animal.earTagNumber)}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {animal.earTagNumber && (
                <span className="font-mono text-xs text-muted-foreground">
                  {animal.earTagNumber}
                </span>
              )}
              <CategoryBadge category={animal.category} />
              {animal.breed && (
                <ToneBadge tone="neutral" plain>
                  {breedLabel(animal.breed)}
                </ToneBadge>
              )}
              <span className="text-xs text-muted-foreground">
                {[
                  animal.ageLabel,
                  animal.birthDate && `ur. ${formatDate(animal.birthDate)}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_EVENTS.map((quick) => (
            <Button
              key={quick.type}
              variant="outline"
              className="h-9 rounded-[9px] px-3 text-[13px]"
              onClick={() => onAddEvent(quick.type)}
            >
              {quick.label}
            </Button>
          ))}
          <Button
            className="h-9 rounded-[9px] px-3.5 text-[13px] font-semibold"
            onClick={() => onAddEvent("NOTE")}
          >
            <Plus />
            Zdarzenie
          </Button>
        </div>
      </header>
    </>
  )
}
