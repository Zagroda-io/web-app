'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { Card, CardHeader } from '@/components/ui/card'
import type { CowActivityDay } from '@/lib/types/stado.types'

interface CowActivityChartProps {
  activityHistory: CowActivityDay[]
}

export default function CowActivityChart({ activityHistory }: CowActivityChartProps) {
  return (
    <Card className="flex-1 p-4" size="sm">
      <CardHeader className="p-0 mb-4">
        <h3 className="text-sm font-bold text-slate-800">Aktywność (7 dni)</h3>
      </CardHeader>

      <div className="h-[80px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activityHistory}>
            <Bar dataKey="activityIndex" radius={[2, 2, 0, 0]}>
              {activityHistory.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.activityIndex > 200 ? 'hsl(var(--amber-400))' : 'hsl(var(--primary))'}
                />
              ))}
            </Bar>
            <XAxis dataKey="dayLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              formatter={(v: number) => [`${v}`, 'Aktywność']}
              contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
