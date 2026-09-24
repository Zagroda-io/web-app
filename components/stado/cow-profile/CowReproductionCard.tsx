import { SectionCard } from "@/components/shared/SectionCard"
import { textToneClass } from "@/lib/theme/tone"
import { reproductionTimeline } from "@/lib/stado/presenters"
import { cn } from "@/lib/utils"
import type { AnimalDetails } from "@/lib/types/stado.types"

export function CowReproductionCard({
  animal,
  now,
}: {
  animal: AnimalDetails
  now: Date
}) {
  const timeline = reproductionTimeline(animal, now)

  return (
    <SectionCard title="Rozród" bodyClassName="p-3.5">
      <div className="mb-1.5 flex justify-between gap-3 text-xs text-muted-foreground">
        <span>{timeline.startLabel}</span>
        <span>{timeline.endLabel}</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={timeline.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Postęp bieżącego etapu"
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${timeline.progress}%` }}
        />
      </div>
      <dl className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {timeline.stages.map((stage) => (
          <div key={stage.label} className="min-w-0">
            <dt className="text-[11px] text-muted-foreground">{stage.label}</dt>
            <dd
              className={cn(
                "mt-0.5 text-[13px] font-semibold",
                textToneClass(stage.tone)
              )}
            >
              {stage.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3.5 rounded-lg bg-muted/60 px-3 py-2.5 text-[13px]">
        <span className="font-semibold">Następny krok: </span>
        {timeline.nextStep}
      </p>
    </SectionCard>
  )
}
