'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { Card, CardHeader } from '@/components/ui/card'
import type { CowActivityDay } from '@/lib/types/stado.types'

interface CowActivityChartProps {
  activityHistory: CowActivityDay[]
}

export default function CowActivityChart({ activityHistory }: CowActivityChartProps) {
  return (
    <Card className="flex-1 p-4 shadow-none" size="sm">
      <CardHeader className="mb-4 p-0">
        <h3 className="text-[11px] font-semibold tracking-[0.08em] text-[#8A93A2] uppercase dark:text-muted-foreground/80">
          Aktywność (7 dni)
        </h3>
      </CardHeader>

      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activityHistory}>
            <Bar dataKey="activityIndex" radius={[2, 2, 0, 0]}>
              {activityHistory.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.activityIndex > 200
                      ? "hsl(var(--amber-400))"
                      : "hsl(var(--primary))"
                  }
                />
              ))}
            </Bar>
            <XAxis
              dataKey="dayLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value) => [`${value}`, "Aktywność"]}
              contentStyle={{ fontSize: "12px", borderRadius: "8px" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
