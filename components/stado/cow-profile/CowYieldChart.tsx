'use client'

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CowYieldDay } from '@/lib/types/stado.types'

interface CowYieldChartProps {
  yieldHistory: CowYieldDay[]
}

export default function CowYieldChart({ yieldHistory }: CowYieldChartProps) {
  const average = yieldHistory.length > 0
    ? (yieldHistory.reduce((acc, curr) => acc + curr.liters, 0) / yieldHistory.length).toFixed(1)
    : '0.0'

  return (
    <Card className="mb-4 p-4 shadow-none" size="sm">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
        <h3 className="text-sm font-bold text-slate-800">Wydajność (14 dni)</h3>
        <Badge variant="outline" className="font-mono text-[10px] bg-primary/5 text-primary border-primary/20">
          Śr. {average} l/dzień
        </Badge>
      </CardHeader>

      <div className="h-[90px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yieldHistory}>
            <defs>
              <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="liters"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#yieldGrad)"
              dot={false}
              activeDot={{ r: 4 }}
            />
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              formatter={(v: number) => [`${v} l`, 'Wydajność']}
              labelFormatter={(label) => label}
              contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
        {yieldHistory.filter((_, i) => i % 3 === 0).map((d, i) => (
          <span key={i}>{d.date}</span>
        ))}
      </div>
    </Card>
  )
}
