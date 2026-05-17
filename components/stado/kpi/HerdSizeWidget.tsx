import { Card, CardContent } from "@/components/ui/card"
import { HerdSize } from "@/types/herd.types"

interface HerdSizeWidgetProps {
  data: HerdSize
}

export const HerdSizeWidget = ({ data }: HerdSizeWidgetProps) => {
  const metrics = [
    { label: "Łącznie", value: data.total },
    { label: "Krowy", value: data.cows },
    { label: "Cielęta", value: data.calves },
    { label: "Byki", value: data.bulls },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="rounded-lg border-gray-100">
          <CardContent className="p-3">
            <p className="mb-1 text-xs text-gray-400">{metric.label}</p>
            <div className="text-2xl font-medium">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
