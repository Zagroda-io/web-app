import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface InlineErrorProps {
  onRetry?: () => void
  className?: string
}

export function InlineError({ onRetry, className }: InlineErrorProps) {
  return (
    <div className={cn("flex items-center gap-2 text-destructive", className)}>
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-3.5 w-3.5" />
      </div>
      {onRetry && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onRetry()
          }}
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
