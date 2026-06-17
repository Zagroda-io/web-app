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
      <CardHeader className="mb-4 flex flex-row items-center justify-between p-0">
        <h3 className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase dark:text-muted-foreground/80">
          Wydajność (14 dni)
        </h3>
        <Badge
          variant="outline"
          className="h-5 rounded-[20px] border-none bg-primary/5 px-2 text-[10px] font-bold text-primary dark:bg-primary/10"
        >
          Śr. {average} l/dzień
        </Badge>
      </CardHeader>

      <div className="h-[90px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yieldHistory}>
            <defs>
              <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
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
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              formatter={(value) => [`${value} l`, "Wydajność"]}
              labelFormatter={(label) => label}
              contentStyle={{ fontSize: "12px", borderRadius: "8px" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
        {yieldHistory
          .filter((_, i) => i % 3 === 0)
          .map((d, i) => (
            <span key={i}>{d.date}</span>
          ))}
      </div>
    </Card>
  )
}
