import { cn } from "@/lib/utils"
import type { AnimalDetails, PedigreeAnimal } from "@/lib/types/stado.types"

interface CowPedigreeProps {
  animal: AnimalDetails
  onCowClick?: (id: number) => void
  onCowClickUrlBase?: string
}

interface PedigreeCardProps {
  animal: PedigreeAnimal | null
  label: string
  gender: "male" | "female"
  className?: string
  children?: React.ReactNode
}

function PedigreeCard({
  animal,
  label,
  gender,
  className,
  children,
}: PedigreeCardProps) {
  if (!animal || (!animal.name && !animal.earTagNumber)) return null

  const isMale = gender === "male"

  return (
    <div className={cn("space-y-2", className)}>
      <div className="px-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </div>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-l-2 bg-muted/30 p-3 transition-colors",
          isMale ? "border-l-blue-400" : "border-l-amber-400"
        )}
      >
        <div
          className={cn(
            "w-7 text-center text-lg font-bold",
            isMale ? "text-blue-600" : "text-amber-600"
          )}
        >
          {isMale ? "♂" : "♀"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-mono text-xs font-bold">
            {animal.earTagNumber || "Brak kolczyka"}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {animal.name || "Brak imienia"}
          </div>
          {(animal.breed || animal.bookType) && (
            <div className="mt-1 flex gap-1">
              {animal.breed && (
                <span className="text-[10px] text-muted-foreground">
                  {animal.breed}
                </span>
              )}
              {animal.bookType && (
                <span className="text-[10px] text-muted-foreground">
                  • {animal.bookType}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export function CowPedigree({
  animal,
  onCowClick,
  onCowClickUrlBase,
}: CowPedigreeProps) {
  const { father, mother, ff, fm } = animal

  const hasAnyPedigree = father || mother || ff || fm

  if (!hasAnyPedigree) return null

  return (
    <div className="mb-4 space-y-6">
      <div className="px-1 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase dark:text-muted-foreground/80">
        Rodowód
      </div>

      <div className="space-y-4">
        {/* Ojciec i jego ojciec (FF) */}
        <PedigreeCard animal={father} label="Ojciec" gender="male">
          <PedigreeCard
            animal={ff}
            label="Ojciec ojca (FF)"
            gender="male"
            className="mt-2 ml-6"
          />
        </PedigreeCard>

        {/* Matka i jej rodzice oraz statystyki */}
        <PedigreeCard animal={mother} label="Matka" gender="female">
          {mother && (
            <div className="mt-2 ml-6 space-y-3">
              {(mother.efficiency || mother.lactation || mother.offspring) && (
                <div className="space-y-1 rounded-lg border bg-muted/20 p-2 text-[11px]">
                  {mother.efficiency && (
                    <div>
                      Wydajność:{" "}
                      <span className="font-semibold">{mother.efficiency}</span>
                    </div>
                  )}
                  {mother.lactation && (
                    <div>
                      Laktacja:{" "}
                      <span className="font-semibold">{mother.lactation}</span>
                    </div>
                  )}
                  {mother.offspring && (
                    <div>
                      Potomstwo:{" "}
                      <span className="font-semibold">{mother.offspring}</span>
                    </div>
                  )}
                  {mother.grandmotherLactations && (
                    <div>
                      Laktacje babki:{" "}
                      <span className="font-semibold">
                        {mother.grandmotherLactations}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <PedigreeCard
                animal={mother.father}
                label="Ojciec matki"
                gender="male"
              />
              <PedigreeCard
                animal={mother.mother}
                label="Matka matki"
                gender="female"
              />
              <PedigreeCard
                animal={fm}
                label="Ojciec matki (FM)"
                gender="male"
              />
            </div>
          )}
        </PedigreeCard>
      </div>
    </div>
  )
}
