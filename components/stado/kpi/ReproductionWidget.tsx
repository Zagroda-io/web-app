import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ReproductionStats } from "@/types/herd.types"
import { AlertCircle } from "lucide-react"

interface ReproductionWidgetProps {
  data: ReproductionStats
}

export const ReproductionWidget = ({ data }: ReproductionWidgetProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="rounded-lg border-gray-100">
        <CardContent className="p-3">
          <p className="mb-1 text-xs text-gray-400">W ciąży</p>
          <div className="text-2xl font-medium">{data.pregnant}</div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-gray-100">
        <CardContent className="p-3">
          <p className="mb-1 text-xs text-gray-400">Skuteczność krycia</p>
          <div className="text-2xl font-medium">{data.conceptionRate}%</div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-gray-100">
        <CardContent className="p-3">
          <p className="mb-1 text-xs text-gray-400">Oczekują zacielenia</p>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-medium">
              {data.waitingForInsemination}
            </div>
            {data.overdueCount > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {data.overdueCount} przeterminowane
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
