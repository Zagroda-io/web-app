"use client"

import { CountChip } from "@/components/shared/CountChip"
import { Eyebrow } from "@/components/shared/Eyebrow"
import { InlineError } from "@/components/shared/InlineError"
import { TASK_META, TASK_ORDER } from "@/lib/stado/labels"
import type { HerdTask, HerdTasks } from "@/lib/types/stado.types"

interface HerdTaskBarProps {
  tasks: HerdTasks | null
  activeTask: HerdTask | null
  onTaskChange: (task: HerdTask | null) => void
  dateLabel: string
  statsLine: string | null
  error?: boolean
  onRetry?: () => void
}

/** „Do zrobienia" — liczniki zadań całego stada działające jak szybkie filtry listy. */
export function HerdTaskBar({
  tasks,
  activeTask,
  onTaskChange,
  dateLabel,
  statsLine,
  error,
  onRetry,
}: HerdTaskBarProps) {
  const countOf = (task: HerdTask) =>
    tasks?.tasks.find((t) => t.task === task)?.count ?? null

  return (
    <section aria-label="Do zrobienia" className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eyebrow as="h2">Do zrobienia · {dateLabel}</Eyebrow>
          {error && <InlineError onRetry={onRetry} />}
        </div>
        {statsLine && (
          <p className="text-[13px] text-muted-foreground">{statsLine}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <CountChip
          label="wszystkie"
          count={tasks?.total ?? null}
          tone="default"
          active={activeTask === null}
          onClick={() => onTaskChange(null)}
        />
        {TASK_ORDER.map((task) => (
          <CountChip
            key={task}
            label={TASK_META[task].label}
            count={countOf(task)}
            tone={TASK_META[task].tone}
            active={activeTask === task}
            onClick={() => onTaskChange(activeTask === task ? null : task)}
          />
        ))}
      </div>
    </section>
  )
}
