import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BeefIcon, HeartPulseIcon } from "lucide-react"

export function LivestockSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Liczebność stada
          </CardTitle>
          <BeefIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">128</div>
          <p className="text-xs text-muted-foreground">
            +4 od zeszłego miesiąca
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Zdrowie (średnia)
          </CardTitle>
          <HeartPulseIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94%</div>
          <p className="text-xs text-muted-foreground">W normie</p>
        </CardContent>
      </Card>
    </div>
  )
}
