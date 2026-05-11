import { DashboardHeader } from "@/components/dashboard/header"
import { HerdAlerts } from "@/components/dashboard/herd-alerts"
import { HerdStatusCard } from "@/components/dashboard/herd-status"
import { MilkYieldCard } from "@/components/dashboard/milk-yield"
import { herdStatusMock } from "@/mocks/dashboard/herd-status"
import { milkYieldMock } from "@/mocks/dashboard/milk-yield"
import { herdAlertsMock } from "@/mocks/dashboard/herd-alerts"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <DashboardHeader />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-3">
          <div className="grid gap-4 md:grid-cols-3">
            <MilkYieldCard
              {...milkYieldMock}
              className="md:col-span-2"
            />
            <HerdStatusCard 
              {...herdStatusMock} 
              currentlyMilking={herdStatusMock.currentlyMilking}
            />
          </div>
          <div className="min-h-[400px] flex-1 rounded-xl bg-muted/50" />
        </div>
        <div className="lg:col-span-1">
          <HerdAlerts alerts={herdAlertsMock} />
        </div>
      </div>
    </div>
  )
}
