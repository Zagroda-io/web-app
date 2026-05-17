import { LactationStats } from "../types/herd.types"

export const LactationWidget = ({ data }: { data: LactationStats }) => {
  const lactationPercentage =
    data.totalCows > 0
      ? Math.round((data.inLactation / data.totalCows) * 100)
      : 0

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg bg-gray-50 p-[14px] px-4">
        <div className="mb-1 text-sm text-gray-500">W laktacji</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold">{data.inLactation}</span>
          <span className="text-sm text-gray-400">
            ({lactationPercentage}%)
          </span>
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 p-[14px] px-4">
        <div className="mb-1 text-sm text-gray-500">Zasuszone</div>
        <div className="text-2xl font-semibold">{data.driedOff}</div>
      </div>
      <div className="rounded-lg bg-gray-50 p-[14px] px-4">
        <div className="mb-1 text-sm text-gray-500">Śr. DIM</div>
        <div className="text-2xl font-semibold">{data.averageDim}</div>
        <div className="text-xs text-gray-400">dni od ocielenia</div>
      </div>
    </div>
  )
}
