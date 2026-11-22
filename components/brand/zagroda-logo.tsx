import { cn } from "@/lib/utils"

/**
 * Znak Zagrody — ten sam co w aplikacji mobilnej (mobile-app/src/components/ui/logo.tsx)
 * i favicon strony zagroda.io (landing-page/public/icon.svg): „snopek” — pięć kresek
 * wychodzących z jednego punktu i zielony węzeł u nasady, na czarnym kaflu.
 */
const MARK_PATHS = [
  "M14 24 Q13.7 14.5 14 5.4",
  "M14 24 Q11.2 15 9.1 9.2",
  "M14 24 Q16.8 15 18.9 9.2",
  "M14 24 Q9.2 16.4 5.7 12.6",
  "M14 24 Q18.8 16.4 22.3 12.6",
]

export const brand = {
  tile: "#0A0A0A",
  stroke: "#F6F5F1",
  node: "#3A9C61",
}

type MarkProps = {
  /** Bok kafla w px. */
  size?: number
  className?: string
  /** `false`, gdy obok stoi już nazwa „Zagroda” — wtedy znak jest dekoracją. */
  labelled?: boolean
}

/** Kafel ze znakiem. Czarny kafel ginie na ciemnym tle — w ciemnym motywie dostaje obrys. */
export function ZagrodaMark({ size = 44, className, labelled = true }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn("flex-none", className)}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? "Zagroda" : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      <rect
        x={0.5}
        y={0.5}
        width={63}
        height={63}
        rx={16}
        fill={brand.tile}
        strokeWidth={1}
        className="stroke-transparent dark:stroke-z-line-strong"
      />
      <g
        transform="translate(4 4) scale(2)"
        stroke={brand.stroke}
        strokeWidth={1.7}
        strokeLinecap="round"
        fill="none"
      >
        {MARK_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <circle cx={32} cy={52.4} r={4} fill={brand.node} />
    </svg>
  )
}

/** Znak z nazwą „Zagroda”. */
export function ZagrodaLogo({
  size = "md",
  className,
}: {
  size?: "md" | "sm"
  className?: string
}) {
  return (
    <span className={cn("flex items-center", size === "md" ? "gap-3" : "gap-2.5", className)}>
      <ZagrodaMark size={size === "md" ? 44 : 36} labelled={false} />
      <span
        className={cn(
          "font-bold tracking-[-0.02em]",
          size === "md" ? "text-[22px]" : "text-[19px]"
        )}
      >
        Zagroda
      </span>
    </span>
  )
}
