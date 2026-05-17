import { HerdSize } from "../types/herd.types"

export const HerdSizeWidget = ({ data }: { data: HerdSize }) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="rounded-lg bg-gray-50 p-[14px] px-4">
        <div className="mb-1 text-sm text-gray-500">Łącznie</div>
        <div className="text-2xl font-semibold">{data.total}</div>
      </div>
      <div className="rounded-lg bg-gray-50 p-[14px] px-4">
        <div className="mb-1 text-sm text-gray-500">Krowy</div>
        <div className="text-2xl font-semibold">{data.cows}</div>
      </div>
      <div className="rounded-lg bg-gray-50 p-[14px] px-4">
        <div className="mb-1 text-sm text-gray-500">Cielęta</div>
        <div className="text-2xl font-semibold">{data.calves}</div>
        <div className="text-xs text-gray-400">poniżej 6 mies.</div>
      </div>
      <div className="rounded-lg bg-gray-50 p-[14px] px-4">
        <div className="mb-1 text-sm text-gray-500">Byki</div>
        <div className="text-2xl font-semibold">{data.bulls}</div>
      </div>
    </div>
  )
}
