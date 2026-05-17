import { ReproductionStats } from "../types/herd.types"

export const ReproductionWidget = ({ data }: { data: ReproductionStats }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg bg-gray-50 p-[14px] px-4">
        <div className="mb-1 text-sm text-gray-500">W ciąży</div>
        <div className="text-2xl font-semibold">{data.pregnant}</div>
        <div className="text-xs text-gray-400">potwierdzono</div>
      </div>
      <div className="rounded-lg bg-gray-50 p-[14px] px-4">
        <div className="mb-1 text-sm text-gray-500">Skuteczność krycia</div>
        <div className="text-2xl font-semibold">{data.conceptionRate}%</div>
        <div className="text-xs text-gray-400">ostatnie 90 dni</div>
      </div>
      <div className="flex flex-col justify-between rounded-lg bg-gray-50 p-[14px] px-4">
        <div>
          <div className="mb-1 text-sm text-gray-500">
            Oczekują zacielenienia
          </div>
          <div className="text-2xl font-semibold">
            {data.awaitingInsemination}
          </div>
        </div>
        {data.overdueInsemination > 0 && (
          <div className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800">
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {data.overdueInsemination} przeterminowanych
          </div>
        )}
      </div>
    </div>
  )
}
