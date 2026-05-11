interface CowYieldMiniBarProps {
  yieldToday: number
  yieldMax: number
}

export function CowYieldMiniBar({ yieldToday, yieldMax }: CowYieldMiniBarProps) {
  const percentage = yieldMax > 0 ? Math.min((yieldToday / yieldMax) * 100, 100) : 0

  return (
    <div className="w-14 h-1 rounded-full bg-muted overflow-hidden mt-1">
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
