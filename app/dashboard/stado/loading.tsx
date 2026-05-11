import { Skeleton } from "@/components/ui/skeleton"

export default function StadoLoading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 max-w-[80vw]" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
          <Skeleton className="h-10 w-48 shrink-0" />
          <Skeleton className="h-10 w-48 shrink-0" />
        </div>
      </div>

      {/* Feed Skeleton */}
      <div className="overflow-hidden rounded-xl border border-foreground/10 bg-card shadow-none">
        <div className="flex items-center justify-between border-b bg-slate-50/50 px-4 py-3 dark:bg-muted/20">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="p-0">
          <div className="grid grid-cols-[16px_80px_100px_1fr_120px_24px] items-center gap-4 border-b border-foreground/5 px-4 py-3 last:border-0">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="ml-auto h-4 w-16" />
            <Skeleton className="h-4 w-4" />
          </div>
          <div className="grid grid-cols-[16px_80px_100px_1fr_120px_24px] items-center gap-4 border-b border-foreground/5 px-4 py-3 last:border-0">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="ml-auto h-4 w-16" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-xl border border-foreground/10 bg-card shadow-none">
        <div className="border-b bg-slate-50/50 p-4 dark:bg-muted/20">
          <div className="flex justify-between gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        <div className="space-y-6 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between gap-4">
              {Array.from({ length: 8 }).map((_, j) => (
                <Skeleton key={j} className="h-5 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
