import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UpcomingCalving } from "@/types/herd.types"
import { cn } from "@/lib/utils"

interface UpcomingCalvingsWidgetProps {
  data: UpcomingCalving[]
  onShowAll?: () => void
}

export const UpcomingCalvingsWidget = ({
  data,
  onShowAll,
}: UpcomingCalvingsWidgetProps) => {
  const getUrgencyColor = (days: number) => {
    if (days <= 3) return "bg-amber-500"
    if (days <= 7) return "bg-blue-500"
    return "bg-green-500"
  }

  return (
    <Card
      className="h-full gap-0 overflow-hidden p-0 py-0 shadow-none data-[size=sm]:py-0"
      size="sm"
    >
      <div className="flex items-center justify-between border-b bg-slate-50/50 px-4 py-3 dark:bg-muted/20">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-[#8A93A2] uppercase dark:text-muted-foreground/80">
            Zbliżające się porody
          </span>
        </div>
        {onShowAll && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary"
            onClick={onShowAll}
          >
            Pokaż wszystkie
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="flex flex-col">
        {data.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Brak nadchodzących porodów w najbliższym czasie.
          </div>
        ) : (
          data.slice(0, 3).map((calving) => (
            <div
              key={calving.id}
              className="group grid grid-cols-[16px_100px_1fr_80px_24px] items-center gap-4 border-b px-4 py-3 transition-colors last:border-0 hover:bg-muted/50"
            >
              <div className="flex justify-center">
                <div
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    getUrgencyColor(calving.daysToCalving)
                  )}
                />
              </div>

              <div className="truncate font-mono text-xs font-semibold text-muted-foreground">
                #{calving.tagNumber}
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-900 dark:text-foreground">
                  {calving.name || "Bez imienia"}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  Data: {calving.date}
                </div>
              </div>

              <div className="text-right">
                <Badge
                  variant="outline"
                  className={cn(
                    "border-none px-2 py-0 text-[10px] font-bold",
                    calving.daysToCalving <= 3
                      ? "bg-amber-50 text-amber-700"
                      : calving.daysToCalving <= 7
                        ? "bg-blue-50 text-blue-700"
                        : "bg-green-50 text-green-700"
                  )}
                >
                  {calving.daysToCalving} dni
                </Badge>
              </div>

              <div className="flex justify-end">
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
