import { Card, CardContent } from "@/components/ui/card"
import { HerdSize } from "@/types/herd.types"

interface HerdSizeWidgetProps {
  data: HerdSize
}

export const HerdSizeWidget = ({ data }: HerdSizeWidgetProps) => {
  const metrics = [
    { label: "Łącznie", value: data.total },
    { label: "Krowy", value: data.cows },
    { label: "Jałówki", value: data.heifers },
    { label: "Cielęta", value: data.calves },
    { label: "Byki", value: data.bulls },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {metrics.map((metric) => (
        <Card key={metric.label} className="rounded-lg">
          <CardContent className="p-3">
            <p className="mb-1 text-xs text-muted-foreground">{metric.label}</p>
            <div className="text-2xl font-medium tabular-nums">
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
