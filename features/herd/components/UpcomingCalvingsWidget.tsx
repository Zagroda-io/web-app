import { UpcomingCalving } from "../types/herd.types"
import Link from "next/link"

export const UpcomingCalvingsWidget = ({
  calvings,
}: {
  calvings: UpcomingCalving[]
}) => {
  const getUrgencyBadge = (daysUntil: number) => {
    if (daysUntil <= 3) {
      return (
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
          za {daysUntil} dni
        </span>
      )
    }
    if (daysUntil <= 7) {
      return (
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
          za {daysUntil} dni
        </span>
      )
    }
    return (
      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800">
        za {daysUntil} dni
      </span>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      <div className="space-y-4 p-4">
        {calvings.length === 0 ? (
          <div className="py-4 text-sm text-gray-500">
            Brak porodów w ciągu najbliższych 14 dni
          </div>
        ) : (
          calvings.map((calving) => (
            <div
              key={calving.id}
              className="flex items-center justify-between py-1"
            >
              <div>
                <div className="font-bold text-gray-900">
                  {calving.earTagId} {calving.name}
                </div>
                <div className="text-sm text-gray-400">
                  {calving.estimatedDate}
                </div>
              </div>
              <div>{getUrgencyBadge(calving.daysUntil)}</div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3">
        <span className="text-sm text-gray-400">
          {calvings.length} porodów w ciągu 14 dni
        </span>
        <Link
          href="/herd/calvings"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Zobacz wszystkie &rarr;
        </Link>
      </div>
    </div>
  )
}
