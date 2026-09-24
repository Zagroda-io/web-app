import { ToneBadge } from "@/components/shared/ToneBadge"
import { CATEGORY_META } from "@/lib/stado/labels"
import type { AnimalCategory } from "@/lib/types/stado.types"

export function CategoryBadge({
  category,
}: {
  category: AnimalCategory | null | undefined
}) {
  if (!category) return <span className="text-muted-foreground">—</span>
  const meta = CATEGORY_META[category]
  return <ToneBadge tone={meta.tone}>{meta.label}</ToneBadge>
}
