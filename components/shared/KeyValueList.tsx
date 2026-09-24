import { cn } from "@/lib/utils"

export interface KeyValueItem {
  label: string
  value: React.ReactNode
  /** Wartość w kroju mono (identyfikatory). */
  mono?: boolean
  valueClassName?: string
}

/** Lista „etykieta — wartość" z liniami między wierszami. */
export function KeyValueList({
  items,
  className,
}: {
  items: KeyValueItem[]
  className?: string
}) {
  return (
    <dl className={cn("px-3.5 py-1.5", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-3 border-b py-2 text-[13px] last:border-0"
        >
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd
            className={cn(
              "min-w-0 truncate text-right",
              item.mono && "font-mono",
              item.valueClassName
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
