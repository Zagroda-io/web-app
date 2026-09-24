import type {
  AlertReviewStatus,
  AlertSeverity,
} from "@/lib/types/stado.types"

interface AlertTypeMeta {
  label: string
  severity: AlertSeverity
  badgeClass: string
}

const DEFAULT_META: AlertTypeMeta = {
  label: "Alert",
  severity: "info",
  badgeClass:
    "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30",
}

/** Mapowanie typu alertu AI na etykietę, wagę i styl badge'a (spójne z EventFeedItem). */
export const ALERT_TYPE_META: Record<string, AlertTypeMeta> = {
  CALVING: {
    label: "Poród",
    severity: "red",
    badgeClass:
      "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
  },
  ESTRUS: {
    label: "Ruja",
    severity: "amber",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
  },
  FALL: {
    label: "Upadek",
    severity: "red",
    badgeClass:
      "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
  },
  ANOMALY: {
    label: "Anomalia",
    severity: "amber",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
  },
}

export function alertTypeMeta(type: string): AlertTypeMeta {
  return ALERT_TYPE_META[type] ?? DEFAULT_META
}

/** Pewność modelu jako procent, np. 0.8697 → "87%". */
export function formatConfidence(confidence: number | null): string {
  if (confidence === null || confidence === undefined || isNaN(confidence)) {
    return "—"
  }
  return `${Math.round(confidence * 100)}%`
}

interface ReviewStatusMeta {
  label: string
  /** Krótki opis dla tooltipa/opisu kolumny — po co ta decyzja jest. */
  description: string
  badgeClass: string
}

/**
 * Werdykt hodowcy w wersji dla UI. Świadomie neutralne kolory: to etykieta danych
 * treningowych, a nie waga alertu (tę niesie {@link ALERT_TYPE_META}).
 */
export const REVIEW_STATUS_META: Record<AlertReviewStatus, ReviewStatusMeta> = {
  PENDING: {
    label: "Do weryfikacji",
    description: "Alert czeka na potwierdzenie — nie trafia do paczki treningowej",
    badgeClass:
      "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/40",
  },
  CONFIRMED: {
    label: "Potwierdzony",
    description: "Prawdziwe wykrycie — materiał wejdzie do paczki jako przykład pozytywny",
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40",
  },
  REJECTED: {
    label: "Fałszywy alarm",
    description: "Błędne wykrycie — materiał opisany jako przykład negatywny",
    badgeClass:
      "bg-zinc-100 text-zinc-600 border-zinc-200 line-through decoration-1 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-800/40",
  },
}

export function reviewStatusMeta(status: AlertReviewStatus): ReviewStatusMeta {
  return REVIEW_STATUS_META[status] ?? REVIEW_STATUS_META.PENDING
}
