import { Skeleton } from "@/components/ui/skeleton"

export function CowProfileSkeleton() {
  return (
    <div className="flex w-full flex-col gap-5 px-4 pt-5 pb-10 md:px-6">
      <Skeleton className="h-4 w-16" />
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="mr-auto h-12 w-72" />
        <Skeleton className="h-9 w-80" />
      </div>
      <Skeleton className="h-[84px] w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  )
}
