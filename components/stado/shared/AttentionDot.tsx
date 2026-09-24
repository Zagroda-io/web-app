import { StatusDot } from "@/components/shared/StatusDot"
import { ATTENTION_LABEL } from "@/lib/stado/labels"
import { attentionDot } from "@/lib/stado/presenters"
import type { AnimalStatusFields } from "@/lib/types/stado.types"

/** Kropka pilności zwierzęcia — ten sam kolor na liście i w karcie krowy. */
export function AttentionDot({
  animal,
  size,
}: {
  animal: AnimalStatusFields
  size?: "md" | "lg"
}) {
  const { tone, pulse } = attentionDot(animal)
  return (
    <StatusDot
      tone={tone}
      pulse={pulse}
      size={size}
      label={ATTENTION_LABEL[animal.attentionLevel ?? "IDLE"]}
    />
  )
}
