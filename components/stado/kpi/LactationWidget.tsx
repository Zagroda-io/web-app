import { Card, CardContent } from "@/components/ui/card"
import { LactationStats } from "@/types/herd.types"

interface LactationWidgetProps {
  data: LactationStats
}

export const LactationWidget = ({ data }: LactationWidgetProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="rounded-lg border-gray-100">
        <CardContent className="p-3">
          <p className="mb-1 text-xs text-gray-400">W laktacji</p>
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-medium">{data.inLactation}</div>
            <div className="text-sm text-muted-foreground">
              ({data.inLactationPercentage}%)
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-gray-100">
        <CardContent className="p-3">
          <p className="mb-1 text-xs text-gray-400">Zasuszone</p>
          <div className="text-2xl font-medium">{data.dry}</div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-gray-100">
        <CardContent className="p-3">
          <p className="mb-1 text-xs text-gray-400">Śr. DIM</p>
          <div className="text-2xl font-medium">{data.avgDim}</div>
        </CardContent>
      </Card>
    </div>
  )
}
