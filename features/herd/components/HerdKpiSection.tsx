import { HerdKpiData } from "../types/herd.types"
import { HerdSizeWidget } from "./HerdSizeWidget"
import { LactationWidget } from "./LactationWidget"
import { ReproductionWidget } from "./ReproductionWidget"
import { UpcomingCalvingsWidget } from "./UpcomingCalvingsWidget"

export const HerdKpiSection = ({ data }: { data: HerdKpiData }) => {
  return (
    <div className="space-y-8">
      {/* LICZEBNOŚĆ STADA */}
      <section>
        <h2 className="mb-4 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
          Liczebność stada
        </h2>
        <HerdSizeWidget data={data.herdSize} />
      </section>

      <hr className="border-gray-100" />

      {/* LAKTACJA */}
      <section>
        <h2 className="mb-4 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
          Laktacja
        </h2>
        <LactationWidget data={data.lactation} />
      </section>

      <hr className="border-gray-100" />

      {/* ROZRÓD */}
      <section>
        <h2 className="mb-4 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
          Rozród
        </h2>
        <ReproductionWidget data={data.reproduction} />
      </section>

      <hr className="border-gray-100" />

      {/* ZBLIŻAJĄCE SIĘ PORODY */}
      <section>
        <h2 className="mb-4 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
          Zbliżające się porody
        </h2>
        <UpcomingCalvingsWidget calvings={data.upcomingCalvings} />
      </section>
    </div>
  )
}
