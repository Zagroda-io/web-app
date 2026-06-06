import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ApiErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ApiErrorState({
  title = "Błąd połączenia z API",
  message = "Nie udało się pobrać danych. Sprawdź połączenie z internetem i spróbuj ponownie.",
  onRetry,
  className,
}: ApiErrorStateProps) {
  return (
    <div
      className={cn("flex flex-1 items-center justify-center p-6", className)}
    >
      <Card className="flex max-w-md flex-col items-center p-8 text-center shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-foreground">
          {title}
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Spróbuj ponownie
          </Button>
        )}
      </Card>
    </div>
  )
}
