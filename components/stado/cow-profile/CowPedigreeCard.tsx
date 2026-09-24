import { SectionCard } from "@/components/shared/SectionCard"
import { cn } from "@/lib/utils"
import type { AnimalDetails, PedigreeAnimal } from "@/lib/types/stado.types"

const hasData = (a: PedigreeAnimal | null | undefined): a is PedigreeAnimal =>
  !!a && !!(a.name || a.earTagNumber)

export function CowPedigreeCard({ animal }: { animal: AnimalDetails }) {
  const grandparents: [string, PedigreeAnimal | null][] = [
    ["Ojciec ojca", animal.fatherFather],
    ["Matka ojca", animal.fatherMother],
    ["Ojciec matki", animal.motherFather],
    ["Matka matki", animal.motherMother],
  ]
  const knownGrandparents = grandparents.filter(([, a]) => hasData(a))

  return (
    <SectionCard title="Rodowód">
      <div className="grid grid-cols-2 gap-px bg-border">
        <Ancestor label="Ojciec" animal={animal.father} />
        <Ancestor label="Matka" animal={animal.mother} />
        {knownGrandparents.map(([label, ancestor]) => (
          <Ancestor key={label} label={label} animal={ancestor} compact />
        ))}
      </div>
    </SectionCard>
  )
}

function Ancestor({
  label,
  animal,
  compact,
}: {
  label: string
  animal: PedigreeAnimal | null
  compact?: boolean
}) {
  const known = hasData(animal)
  return (
    <div className="min-w-0 bg-card px-3.5 py-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-0.5 truncate font-semibold",
          compact && "text-[13px]",
          !known && "text-muted-foreground"
        )}
      >
        {known ? animal.name || "Bez imienia" : "nieznany"}
      </div>
      {known && animal.earTagNumber && (
        <div className="truncate font-mono text-xs text-muted-foreground">
          {animal.earTagNumber}
        </div>
      )}
    </div>
  )
}
