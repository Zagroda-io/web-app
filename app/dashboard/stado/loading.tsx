import { Skeleton } from "@/components/ui/skeleton"

export default function StadoLoading() {
  return (
    <div className="flex w-full flex-col gap-5 px-4 pt-5 pb-10 md:px-6">
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="mr-auto h-7 w-48" />
        <Skeleton className="h-10 w-full max-w-[460px]" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-56" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_clamp(260px,24%,360px)]">
        <Skeleton className="h-[520px] w-full rounded-xl" />
        <Skeleton className="h-[360px] w-full rounded-xl" />
      </div>
    </div>
  )
}
