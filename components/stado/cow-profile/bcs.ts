import type { TextTone } from "@/lib/theme/tone"

/** BCS poniżej 2,5 — wychudzenie, poniżej 3 — do obserwacji. */
export function bcsTone(score: number): TextTone {
  if (score < 2.5) return "critical"
  if (score < 3) return "warning"
  return "success"
}

export function formatBcs(score: number): string {
  return score.toFixed(2).replace(".", ",")
}
