import { StatusDot } from "@/components/shared/StatusDot"
import { TONE } from "@/lib/theme/tone"
import { alertView } from "@/lib/stado/presenters"
import { cn } from "@/lib/utils"
import type { ActiveAlert } from "@/lib/types/stado.types"

export function CowAlertBanner({
  alert,
  now,
}: {
  alert: ActiveAlert
  now: Date
}) {
  const view = alertView(alert, now)
  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-[10px] border px-3.5 py-2.5",
        TONE[view.tone].soft
      )}
    >
      <StatusDot tone={view.tone} pulse={view.tone !== "neutral"} />
      <p className="min-w-0 flex-1">
        <span className="font-semibold">{view.title}</span>
        {view.description && <span> · {view.description}</span>}
      </p>
      <span className="text-xs whitespace-nowrap">{view.when}</span>
    </div>
  )
}
